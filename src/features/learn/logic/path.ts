/**
 * Pure path state: which nodes are done, open, locked and why, and where the "Start" callout goes.
 * Inputs are plain data so this is unit-tested without React.
 */
import type { CourseState, Expertise, GuestState, ScoreRecord } from '@/shared/contracts/types';
import { isLessonUnlocked } from '@/shared/state';
import { ALL_DRILLS, LEVELS, type PathBlock, type PathLevel } from '../catalog/path';
import { QUIZ_PASS_MARK, RULES_BLOCK_ID, RULES_DRILLS, RULES_QUIZ, RULES_QUIZ_ID } from '../catalog/rulesBasics';
import type { Difficulty, Lesson } from '../types';
import type { Recommendation } from './recommend';

/* ---------- Rules basics progress (stored in course.lessons['rules-basics'].answers) ---------- */

export interface QuizRecord {
  best: number;
  last: number;
  attempts: number;
  passed: boolean;
}
export interface QuizRun {
  index: number;
  /** questionId → chosen option, only for questions already checked */
  answers: Record<string, string>;
  finished: boolean;
}
export interface RulesProgress {
  done: Set<string>;
  quiz: QuizRecord | null;
  run: QuizRun | null;
  passed: boolean;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

export function readRules(course: CourseState): RulesProgress {
  const a = course.lessons[RULES_BLOCK_ID]?.answers ?? {};
  const done = new Set(RULES_DRILLS.filter((d) => a[`drill:${d.id}`] === true).map((d) => d.id));
  const q = a['quiz'];
  const quiz: QuizRecord | null =
    isObj(q) && typeof q.best === 'number'
      ? { best: q.best, last: Number(q.last) || 0, attempts: Number(q.attempts) || 0, passed: q.passed === true }
      : null;
  const r = a['quiz-run'];
  const run: QuizRun | null =
    isObj(r) && typeof r.index === 'number' && isObj(r.answers)
      ? { index: r.index, answers: r.answers as Record<string, string>, finished: r.finished === true }
      : null;
  return { done, quiz, run, passed: quiz?.passed === true };
}

/** Drills finished in any block (Rules basics included): they are all stored as `drill:<id>` in the block's own record. */
export function readDone(course: CourseState, blockId: string): Set<string> {
  const a = course.lessons[blockId]?.answers ?? {};
  return new Set(ALL_DRILLS.filter((d) => a[`drill:${d.id}`] === true).map((d) => d.id));
}

export const quizScore = (answers: Record<string, string>) =>
  RULES_QUIZ.filter((q) => answers[q.id] === q.correctId).length;

export const passes = (score: number) => score >= QUIZ_PASS_MARK;

/* ---------- levels ---------- */

/** Newcomers (or visitors who skipped onboarding) must pass Rules basics first. */
export const rulesRequired = (expertise: Expertise | null) => expertise === null || expertise === 'new';

export function defaultLevel(expertise: Expertise | null): Difficulty {
  if (expertise === 'expert') return 'advanced';
  if (expertise === 'familiar') return 'intermediate';
  return 'beginner';
}

export const isDifficulty = (v: string | null): v is Difficulty =>
  v === 'beginner' || v === 'intermediate' || v === 'advanced';

/* ---------- node view model ---------- */

export type NodeKind = 'drill' | 'lesson' | 'quiz' | 'soon';
export type NodeState = 'done' | 'open' | 'in-progress' | 'locked-order' | 'locked-rules' | 'locked-level' | 'locked-members' | 'soon';

export interface ViewNode {
  key: string;
  kind: NodeKind;
  id: string;
  title: string;
  state: NodeState;
  /** The single "Start here" node for this level. */
  active: boolean;
  /** Message shown when a locked node is tapped. */
  lockReason?: string;
  /** Quiz node: best score so far. */
  score?: number;
}

export interface ViewBlock {
  block: PathBlock;
  number: number;
  nodes: ViewNode[];
  done: number;
  total: number;
  comingSoon: boolean;
  /** Mandatory block, but optional for this visitor (familiar/expert). */
  optional: boolean;
}

export interface ViewLevel {
  level: PathLevel;
  number: number;
  blocks: ViewBlock[];
  done: number;
  total: number;
  /** Above the visitor's level and not yet earned. Only the first lesson of each block is open (a preview). */
  locked: boolean;
}

export interface PathInput {
  course: CourseState;
  expertise: Expertise | null;
  lessons: readonly Lesson[];
  recs: Recommendation[];
}

export const levelIndex = (expertise: Expertise | null) => (expertise === 'expert' ? 2 : expertise === 'familiar' ? 1 : 0);
export const LEVEL_LOCK = 'This level is above the one you picked. Finish the level before it, or change your level, to unlock it. The first lesson of every block is open as a preview.';
export const RULES_LOCK = 'Finish Rules basics and pass its quiz first. It unlocks the rest of the Beginner level.';
const ORDER_LOCK = 'Finish the previous lesson in this block first.';
const QUIZ_LOCK = 'Finish all ten Rules basics lessons to unlock the block quiz.';
const MEMBERS_LOCK = 'You have used your two free lessons. Membership unlocks this one.';

export function buildPath(input: PathInput): ViewLevel[] {
  const { course, expertise, lessons, recs } = input;
  const rules = readRules(course);
  const gate = rulesRequired(expertise) && !rules.passed;
  const titleOf = (id: string) => lessons.find((l) => l.id === id)?.title ?? id;
  const recRank = new Map(recs.map((r, i) => [r.lessonId, i]));

  let prevComplete = true;
  return LEVELS.map((level, li) => {
    // A level opens when it is at or below the visitor's level, or once the level before it is finished.
    const levelLocked = li > levelIndex(expertise) && !prevComplete;
    const blocks: ViewBlock[] = level.blocks.map((block, bi) => {
      const nodes: ViewNode[] = [];
      let firstUndoneSeen = false;

      for (const [ri, ref] of block.nodes.entries()) {
        const first = ri === 0;
        if (ref.kind === 'drill') {
          const drill = ALL_DRILLS.find((d) => d.id === ref.id);
          const isRulesBlock = block.id === RULES_BLOCK_ID;
          const done = readDone(course, block.id).has(ref.id);
          let state: NodeState = done ? 'done' : 'open';
          let lockReason: string | undefined;
          if (!done) {
            // Rules basics is taken in order; every other block can be opened in any order.
            if (isRulesBlock && firstUndoneSeen) {
              state = 'locked-order';
              lockReason = ORDER_LOCK;
            } else if (!first && levelLocked) {
              state = 'locked-level';
              lockReason = LEVEL_LOCK;
            } else if (!first && !isRulesBlock && gate && level.id === 'beginner') {
              state = 'locked-rules';
              lockReason = RULES_LOCK;
            }
            if (isRulesBlock) firstUndoneSeen = true;
          }
          nodes.push({ key: ref.id, kind: 'drill', id: ref.id, title: drill?.title ?? ref.id, state, active: false, lockReason });
        } else {
          const id = ref.id;
          if (!lessons.some((l) => l.id === id)) continue; // only playable lessons appear
          const progress = course.lessons[id];
          let state: NodeState;
          let lockReason: string | undefined;
          if (course.completedLessonIds.includes(id)) state = 'done';
          else if (!first && levelLocked) {
            state = 'locked-level';
            lockReason = LEVEL_LOCK;
          } else if (!first && gate && level.id === 'beginner') {
            state = 'locked-rules';
            lockReason = RULES_LOCK;
          } else if (!isLessonUnlocked(course, id)) {
            state = 'locked-members';
            lockReason = MEMBERS_LOCK;
          } else state = progress ? 'in-progress' : 'open';
          nodes.push({ key: id, kind: 'lesson', id, title: titleOf(id), state, active: false, lockReason });
        }
      }

      if (block.quizId === RULES_QUIZ_ID) {
        const allDone = RULES_DRILLS.every((d) => rules.done.has(d.id));
        const state: NodeState = rules.passed ? 'done' : allDone ? 'open' : 'locked-order';
        nodes.push({
          key: RULES_QUIZ_ID,
          kind: 'quiz',
          id: RULES_QUIZ_ID,
          title: 'Rules basics quiz',
          state,
          active: false,
          lockReason: state === 'locked-order' ? QUIZ_LOCK : undefined,
          score: rules.quiz?.best,
        });
      }

      const playable = nodes.length;
      if (playable < block.nodes.length + (block.quizId ? 1 : 0) || playable === 0 || (!block.quizId && playable < 10)) {
        nodes.push({ key: `${block.id}-soon`, kind: 'soon', id: `${block.id}-soon`, title: 'More lessons coming soon', state: 'soon', active: false });
      }

      return {
        block,
        number: bi + 1,
        nodes,
        done: nodes.filter((n) => n.state === 'done').length,
        total: playable,
        comingSoon: playable === 0,
        optional: Boolean(block.mandatory) && !rulesRequired(expertise),
      };
    });

    // Pick the single "Start here" node for this level.
    const all = blocks.flatMap((b) => b.nodes);
    const rulesIds = new Set([...RULES_DRILLS.map((d) => d.id), RULES_QUIZ_ID]);
    const isRules = (n: ViewNode) => rulesIds.has(n.id);
    const pickRules = () => all.find((n) => isRules(n) && n.state === 'open');
    const rank = (id: string) => recRank.get(id) ?? 99;
    const pickNext = () =>
      all
        .map((n, order) => ({ n, order }))
        .filter(({ n }) => (n.kind === 'lesson' || (n.kind === 'drill' && !isRules(n))) && (n.state === 'open' || n.state === 'in-progress'))
        .sort((a, b) => Number(b.n.state === 'in-progress') - Number(a.n.state === 'in-progress') || rank(a.n.id) - rank(b.n.id) || a.order - b.order)[0]?.n;
    // Only the Beginner level starts with the Rules basics gate; other levels open straight away.
    const active = levelLocked ? undefined : gate && level.id === 'beginner' ? pickRules() : (pickNext() ?? pickRules());
    if (active) active.active = true;

    const done = blocks.reduce((s, b) => s + b.done, 0);
    const total = blocks.reduce((s, b) => s + b.total, 0);
    prevComplete = total > 0 && done === total;
    return {
      level,
      number: li + 1,
      blocks,
      done,
      total,
      locked: levelLocked,
    };
  });
}

/* ---------- streak ---------- */

const dayKey = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

/** Consecutive active days ending today (or yesterday, so a streak survives until the day ends). */
export function streakDays(s: GuestState, now: Date = new Date()): number {
  const stamps: string[] = [
    ...Object.values(s.course.lessons).flatMap((l) => [l.startedAt, l.updatedAt]),
    ...Object.values(s.scoreboard.records).map((r: ScoreRecord) => r.firstAttemptAt),
    ...Object.values(s.feed.views).map((v) => v.firstViewedAt),
  ];
  const days = new Set(stamps.map(dayKey).filter(Boolean) as string[]);
  const d = new Date(now);
  if (!days.has(dayKey(d.toISOString())!)) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(dayKey(d.toISOString())!)) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
