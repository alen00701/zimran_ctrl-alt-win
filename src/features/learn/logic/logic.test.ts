import { describe, expect, it } from 'vitest';
import { SEED_LESSON_IDS } from '@/shared/fixtures/ids';
import { SEED_POSTS } from '@/shared/fixtures/ids';
import { CATALOG } from '../catalog';
import { lessonProblems } from '../catalog/validate';
import type { PassingLanesSpec } from '../types';
import { laneStatuses, openLanes, distanceToSegment } from './geometry';
import { aggregate, classifyWrongIds, isClassifySolved, isSequenceSolved, moveItem } from './interactions';
import { recommend, type RecommendInput } from './recommend';

const base = (over: Partial<RecommendInput> = {}): RecommendInput => ({
  lessons: [...CATALOG],
  expertise: null,
  interests: [],
  viewedPostIds: [],
  viewedTags: [],
  feedQuizzesAnswered: 0,
  feedQuizzesWrong: 0,
  completed: [],
  inProgress: [],
  ...over,
});
const top = (i: RecommendInput) => recommend(i)[0]!;

describe('catalog', () => {
  it('ships all six seed lessons, all playable, in seed order', () => {
    expect(CATALOG.map((l) => l.id)).toEqual([...SEED_LESSON_IDS]);
    for (const l of CATALOG) expect(lessonProblems(l), l.id).toEqual([]);
  });

  it('links stories only to real seed posts', () => {
    const ids = new Set<string>(SEED_POSTS.map((p) => p.id));
    for (const l of CATALOG) {
      if (l.story.sourcePostId) expect(ids.has(l.story.sourcePostId), l.id).toBe(true);
      for (const p of l.feedHook?.postIds ?? []) expect(ids.has(p), `${l.id} → ${p}`).toBe(true);
    }
  });

  it('passing-lanes quiz setup has exactly one open lane and it is the correct answer', () => {
    const lesson = CATALOG.find((l) => l.id === 'tactics-passing-lanes')!;
    const d = lesson.quiz.diagram!;
    const open = openLanes(laneStatuses(d.passer, d.receivers, d.defenders, d.blockRadius));
    expect(open.map((o) => o.id)).toEqual([lesson.quiz.correctId]);
  });

  it('passing-lanes interaction starts unsolved and can be solved by moving the defender', () => {
    const spec = CATALOG.find((l) => l.id === 'tactics-passing-lanes')!.interaction as PassingLanesSpec;
    const at = (p: { x: number; y: number }) => laneStatuses(spec.passer, spec.receivers, [p], spec.blockRadius);
    expect(at(spec.defenderStart).every((s) => !s.blocked)).toBe(true);
    const striker = spec.receivers.find((r) => r.id === spec.goalReceiverId)!;
    const mid = { x: (spec.passer.x + striker.at.x) / 2, y: (spec.passer.y + striker.at.y) / 2 };
    const blocked = at(mid);
    expect(blocked.find((s) => s.id === spec.goalReceiverId)?.blocked).toBe(true);
    // One defender cannot cover everything: the story promises the wingers stay open.
    expect(blocked.filter((s) => !s.blocked).length).toBeGreaterThan(0);
  });
});

describe('geometry', () => {
  it('measures distance to a segment, not an infinite line', () => {
    expect(distanceToSegment({ x: 0, y: 10 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(10);
    expect(distanceToSegment({ x: 20, y: 0 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(10);
    expect(distanceToSegment({ x: 5, y: 3 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(3);
  });
});

describe('interaction rules', () => {
  it('aggregate adds both legs', () => {
    expect(aggregate({ a: 3, b: 0 }, { a: 0, b: 4 })).toEqual({ totalA: 3, totalB: 4, leader: 'b' });
    expect(aggregate({ a: 3, b: 0 }, { a: 0, b: 3 }).leader).toBe('level');
    expect(aggregate({ a: 3, b: 0 }, { a: 1, b: 3 }).leader).toBe('a');
  });

  it('sequence and classify checks', () => {
    const seq = CATALOG.find((l) => l.id === 'tactics-quick-corner')!.interaction;
    if (seq.kind !== 'sequence') throw new Error('expected sequence');
    expect(isSequenceSolved(seq, seq.initialOrder)).toBe(false);
    expect(isSequenceSolved(seq, seq.items.map((i) => i.id))).toBe(true);
    expect(moveItem(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c']);
    expect(moveItem(['a', 'b', 'c'], 0, -1)).toEqual(['a', 'b', 'c']);

    const cls = CATALOG.find((l) => l.id === 'history-maradona-1986')!.interaction;
    if (cls.kind !== 'classify') throw new Error('expected classify');
    const right = Object.fromEntries(cls.items.map((i) => [i.id, i.bucketId]));
    expect(isClassifySolved(cls, right)).toBe(true);
    const wrong = { ...right, hand: 'second' };
    expect(classifyWrongIds(cls, wrong)).toEqual(['hand']);
    expect(isClassifySolved(cls, {})).toBe(false);
  });
});

describe('recommendations', () => {
  it('newcomers start with the aggregate score', () => {
    expect(top(base({ expertise: 'new' })).lessonId).toBe('rules-aggregate-score');
  });

  it('experienced tactics fans get the quick corner', () => {
    const r = top(base({ expertise: 'expert', interests: ['tactics'] }));
    expect(r.lessonId).toBe('tactics-quick-corner');
    expect(r.reason).toMatch(/tactics/i);
  });

  it('transfer fans get the Messi move', () => {
    expect(top(base({ expertise: 'familiar', interests: ['transfers'] })).lessonId).toBe('transfers-messi-to-miami');
  });

  it('a Feed story the visitor read lifts its lesson and says so', () => {
    const r = top(base({ expertise: 'new', viewedPostIds: ['carli-lloyd-2015-final-hat-trick'] }));
    expect(r.lessonId).toBe('tournaments-2015-world-cup-final');
    expect(r.reason).toContain('Carli Lloyd');
  });

  it('a wrong Feed quiz answer nudges a beginner refresher', () => {
    const r = recommend(base({ expertise: 'expert', feedQuizzesAnswered: 1, feedQuizzesWrong: 1 }));
    expect(r.find((x) => x.reason.includes('refresher after your story quiz'))).toBeDefined();
  });

  it('every pick carries a one-line reason', () => {
    for (const r of recommend(base({ expertise: 'familiar', interests: ['rules'] }))) {
      expect(r.reason.length).toBeGreaterThan(5);
      expect(r.reason).not.toContain('\n');
    }
  });

  it('is deterministic', () => {
    const i = base({ expertise: 'familiar', interests: ['players', 'tactics'], viewedPostIds: ['messi-signs-with-inter-miami'] });
    expect(recommend(i)).toEqual(recommend({ ...i }));
  });

  it('changing expertise updates the order (journey 5)', () => {
    const asNew = recommend(base({ expertise: 'new', interests: ['tactics'] })).map((r) => r.lessonId);
    const asExpert = recommend(base({ expertise: 'expert', interests: ['tactics'] })).map((r) => r.lessonId);
    expect(asNew).not.toEqual(asExpert);
    expect(asExpert[0]).toBe('tactics-quick-corner');
    expect(asNew[0]).toBe('tactics-passing-lanes');
  });

  it('pins a lesson in progress and never reranks it', () => {
    const inProgress = [{ lessonId: 'history-maradona-1986', currentStep: 2 }];
    for (const [expertise, interests] of [
      ['new', ['rules']],
      ['expert', ['tactics']],
      ['familiar', ['transfers']],
    ] as const) {
      const r = recommend(base({ expertise, interests: [...interests], inProgress }));
      expect(r[0]).toMatchObject({ lessonId: 'history-maradona-1986', state: 'in-progress' });
      expect(r[0]?.reason).toContain('step 3');
      expect(r.filter((x) => x.lessonId === 'history-maradona-1986')).toHaveLength(1);
    }
  });

  it('moves completed lessons to the end and never recommends them again', () => {
    const r = recommend(base({ expertise: 'new', completed: ['rules-aggregate-score', 'tactics-passing-lanes'] }));
    expect(r.slice(-2).map((x) => x.lessonId).sort()).toEqual(['rules-aggregate-score', 'tactics-passing-lanes']);
    expect(r.slice(-2).every((x) => x.state === 'completed')).toBe(true);
    expect(r[0]?.state).toBe('new');
  });
});
