import { describe, expect, it } from 'vitest';
import type { CourseState, GuestState } from '@/shared/contracts/types';
import { createDefaultState } from '@/shared/state/defaults';
import { CATALOG } from '../catalog';
import { ALL_DRILLS, LEVELS } from '../catalog/path';
import { QUIZ_PASS_MARK, RULES_BLOCK_ID, RULES_DRILLS, RULES_QUIZ } from '../catalog/rulesBasics';
import { buildPath, quizScore, readRules, streakDays } from './path';
import { recommend } from './recommend';

const course = (over: Partial<CourseState> = {}): CourseState => ({ ...createDefaultState().course, ...over });
const rulesRecord = (answers: Record<string, unknown>) => ({
  [RULES_BLOCK_ID]: { lessonId: RULES_BLOCK_ID, title: 'Rules basics', currentStep: 0, answers: answers as never, startedAt: 'x', updatedAt: 'x', completedAt: null },
});
const allDrills = Object.fromEntries(RULES_DRILLS.map((d) => [`drill:${d.id}`, true]));
const passed = { ...allDrills, quiz: { best: 8, last: 8, attempts: 1, passed: true } };

const path = (c: CourseState, expertise: GuestState['preferences']['expertise']) =>
  buildPath({
    course: c,
    expertise,
    lessons: CATALOG,
    recs: recommend({ lessons: [...CATALOG], expertise, interests: [], viewedPostIds: [], viewedTags: [], feedQuizzesAnswered: 0, feedQuizzesWrong: 0, completed: c.completedLessonIds, inProgress: [] }),
  });
const nodes = (levels: ReturnType<typeof path>, i = 0) => levels[i]!.blocks.flatMap((b) => b.nodes);

describe('path structure', () => {
  it('has three levels of five blocks', () => {
    expect(LEVELS.map((l) => l.id)).toEqual(['beginner', 'intermediate', 'advanced']);
    for (const l of LEVELS) expect(l.blocks).toHaveLength(5);
  });

  it('places every catalog lesson exactly once, at its own difficulty', () => {
    const placed = LEVELS.flatMap((l) => l.blocks.flatMap((b) => b.nodes.filter((n) => n.kind === 'lesson').map((n) => ({ id: n.id, level: l.id }))));
    expect(placed.map((p) => p.id).sort()).toEqual(CATALOG.map((l) => l.id).sort());
    for (const p of placed) expect(CATALOG.find((l) => l.id === p.id)?.difficulty).toBe(p.level);
  });

  it('each level has three full blocks of 10 lessons; the other two stay coming soon', () => {
    for (const l of LEVELS) {
      l.blocks.slice(0, 3).forEach((b) => expect(b.nodes, `${l.id}/${b.id}`).toHaveLength(10));
      l.blocks.slice(3).forEach((b) => expect(b.nodes, `${l.id}/${b.id}`).toHaveLength(0));
    }
    const lv = path(course(), 'expert');
    for (const l of lv) {
      expect(l.blocks.slice(0, 3).every((b) => !b.comingSoon && !b.nodes.some((n) => n.kind === 'soon'))).toBe(true);
      expect(l.blocks.slice(3).every((b) => b.comingSoon)).toBe(true);
    }
  });

  it('has unique, valid drills that never collide with lesson IDs', () => {
    const ids = ALL_DRILLS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.some((id) => CATALOG.some((l) => l.id === id))).toBe(false);
    expect(ALL_DRILLS).toHaveLength(10 + 74);
    for (const d of ALL_DRILLS) {
      expect(d.check.options.some((o) => o.id === d.check.correctId), d.id).toBe(true);
      expect(d.paragraphs.every((p) => p.length > 20) && d.keyRule.length > 5, d.id).toBe(true);
    }
  });

  it('Rules basics is first: 10 drills and a valid 10-question quiz', () => {
    const first = LEVELS[0]!.blocks[0]!;
    expect(first.id).toBe(RULES_BLOCK_ID);
    expect(first.mandatory).toBe(true);
    expect(first.nodes).toHaveLength(10);
    expect(RULES_QUIZ).toHaveLength(10);
    for (const q of [...RULES_QUIZ, ...RULES_DRILLS.map((d) => d.check)]) {
      expect(q.options.some((o) => o.id === q.correctId), q.id).toBe(true);
    }
    expect(new Set(RULES_DRILLS.map((d) => d.id)).size).toBe(10);
    expect(QUIZ_PASS_MARK).toBe(7);
  });
});

describe('path state', () => {
  it('newcomers: only the first drill is open, everything else is locked', () => {
    const lv = path(course(), 'new');
    const n = nodes(lv);
    expect(n[0]).toMatchObject({ state: 'open', active: true, kind: 'drill' });
    expect(n.slice(1, 10).every((x) => x.state === 'locked-order')).toBe(true);
    expect(n.find((x) => x.kind === 'quiz')?.state).toBe('locked-order');
    expect(n.filter((x) => x.kind === 'lesson').every((x) => x.state === 'locked-rules')).toBe(true);
  });

  it('never locks Intermediate or Advanced, even for newcomers', () => {
    for (const expertise of ['new', null] as const) {
      const lv = path(course(), expertise);
      for (const i of [1, 2]) {
        const n = nodes(lv, i).filter((x) => x.kind !== 'soon');
        expect(n.length).toBeGreaterThan(0);
        expect(n.every((x) => x.state === 'open' || x.state === 'in-progress'), `${lv[i]!.level.id} ${expertise}`).toBe(true);
        expect(n.filter((x) => x.active)).toHaveLength(1);
      }
    }
  });

  it('drills unlock one by one and the quiz opens after all ten', () => {
    const two = path(course({ lessons: rulesRecord({ [`drill:${RULES_DRILLS[0]!.id}`]: true, [`drill:${RULES_DRILLS[1]!.id}`]: true }) }), 'new');
    expect(nodes(two).slice(0, 4).map((n) => n.state)).toEqual(['done', 'done', 'open', 'locked-order']);
    const ten = path(course({ lessons: rulesRecord(allDrills) }), 'new');
    expect(nodes(ten).find((n) => n.kind === 'quiz')).toMatchObject({ state: 'open', active: true });
  });

  it('passing the quiz unlocks lessons and the other levels', () => {
    const lv = path(course({ lessons: rulesRecord(passed) }), 'new');
    expect(nodes(lv).filter((n) => n.kind === 'lesson').every((n) => n.state === 'open')).toBe(true);
    expect(nodes(lv).filter((n) => n.kind === 'drill' && n.state !== 'done').every((n) => n.state === 'open')).toBe(true);
    expect(nodes(lv).find((n) => n.active)?.kind).toBe('lesson');
    expect(lv[0]!.blocks[0]!.done).toBe(11);
  });

  it('familiar and expert fans are not gated; Rules basics is an optional refresher', () => {
    const lv = path(course(), 'expert');
    expect(lv[0]!.blocks[0]!.optional).toBe(true);
    expect(nodes(lv, 2).find((n) => n.active)?.id).toBe('tactics-quick-corner');
  });

  it('applies the paywall after two completed lessons and keeps those two open', () => {
    const c = course({ lessons: rulesRecord(passed), completedLessonIds: ['rules-aggregate-score', 'tactics-passing-lanes'] });
    const n = nodes(path(c, 'new'));
    expect(n.find((x) => x.id === 'rules-aggregate-score')?.state).toBe('done');
    expect(n.find((x) => x.id === 'tournaments-2015-world-cup-final')?.state).toBe('locked-members');
  });

  it('Rules drills do not count toward the free-lesson limit', () => {
    expect(readRules(course({ lessons: rulesRecord(passed) })).done.size).toBe(10);
    // completedLessonIds stays empty, so the paywall count is untouched
    const n = nodes(path(course({ lessons: rulesRecord(passed) }), 'new'));
    expect(n.filter((x) => x.state === 'locked-members')).toHaveLength(0);
  });

  it('marks exactly one active node per level', () => {
    const lv = path(course({ lessons: rulesRecord(passed) }), 'new');
    for (const l of lv) expect(l.blocks.flatMap((b) => b.nodes).filter((n) => n.active)).toHaveLength(1);
  });

  it('scores a quiz run', () => {
    const all = Object.fromEntries(RULES_QUIZ.map((q) => [q.id, q.correctId]));
    expect(quizScore(all)).toBe(10);
    expect(quizScore({ ...all, q1: 'goal', q2: 'on', q3: 'corner' })).toBe(7);
  });
});

describe('streak', () => {
  it('counts consecutive active days and survives until the day ends', () => {
    const s = createDefaultState();
    const now = new Date(2026, 10, 14, 12);
    const day = (n: number) => new Date(2026, 10, 14 - n, 10).toISOString();
    s.scoreboard.records = {
      a: { sportId: 'soccer', exerciseId: 'a', points: 10, firstAttemptAt: day(1) },
      b: { sportId: 'soccer', exerciseId: 'b', points: 10, firstAttemptAt: day(2) },
      c: { sportId: 'soccer', exerciseId: 'c', points: 10, firstAttemptAt: day(4) },
    };
    expect(streakDays(s, now)).toBe(2);
    s.feed.views = { p: { postId: 'p', tags: [], firstViewedAt: day(0) } };
    expect(streakDays(s, now)).toBe(3);
    expect(streakDays(createDefaultState(), now)).toBe(0);
  });
});
