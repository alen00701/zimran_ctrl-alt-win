/**
 * Pure path state: which nodes are done, open, locked and why, and where the "Start" callout goes.
 * Inputs are plain data so this is unit-tested without React.
 */
import type { CourseState, Expertise, GuestState, ScoreRecord } from '@/shared/contracts/types';
import { isLessonUnlocked } from '@/shared/state';
import { LEVELS, type PathBlock, type PathLevel } from '../catalog/path';
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
export type NodeState = 'done' | 'open' | 'in-progress' | 'locked-order' | 'locked-rules' | 'locked-members' | 'soon';

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
  locked: boolean;
}

export interface PathInput {
  course: CourseState;
  expertise: Expertise | null;
  lessons: readonly Lesson[];
  recs: Recommendation[];
}

export const RULES_LOCK = 'Finish Rules basics and pass its quiz first. It unlocks the rest of the course.';
const ORDER_LOCK = 'Finish the previous lesson in this block first.';
const QUIZ_LOCK = 'Finish all ten Rules basics lessons to unlock the block quiz.';
const MEMBERS_LOCK = 'You have used your two free lessons. Membership unlocks this one.';

export function buildPath(input: PathInput): ViewLevel[] {
  const { course, expertise, lessons, recs } = input;
  const rules = readRules(course);
  const gate = rulesRequired(expertise) && !rules.passed;
  const titleOf = (id: string) => lessons.find((l) => l.id === id)?.title ?? id;
  const recRank = new Map(recs.map((r, i) => [r.lessonId, i]));

  return LEVELS.map((level, li) => {
    const blocks: ViewBlock[] = level.blocks.map((block, bi) => {
      const nodes: ViewNode[] = [];
      let firstUndoneSeen = false;

      for (const ref of block.nodes) {
        if (ref.kind === 'drill') {
          const drill = RULES_DRILLS.find((d) => d.id === ref.id);
          const done = rules.done.has(ref.id);
          let state: NodeState = done ? 'done' : 'open';
          if (!done) {
            if (firstUndoneSeen) state = 'locked-order';
            firstUndoneSeen = true;
          }
          nodes.push({
            key: ref.id,
            kind: 'drill',
            id: ref.id,
            title: drill?.title ?? ref.id,
            state,
            active: false,
            lockReason: state === 'locked-order' ? ORDER_LOCK : undefined,
          });
        } else {
          const id = ref.id;
          if (!lessons.some((l) => l.id === id)) continue; // only playable lessons appear
          const progress = course.lessons[id];
          let state: NodeState;
          let lockReason: string | undefined;
          if (course.completedLessonIds.includes(id)) state = 'done';
          else if (gate) {
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
    const isRules = (n: ViewNode) => n.kind === 'drill' || n.kind === 'quiz';
    const pickRules = () => all.find((n) => isRules(n) && n.state === 'open');
    const pickLesson = () =>
      all
        .filter((n) => n.kind === 'lesson' && (n.state === 'open' || n.state === 'in-progress'))
        .sort((a, b) => {
          const ip = Number(b.state === 'in-progress') - Number(a.state === 'in-progress');
          return ip || (recRank.get(a.id) ?? 99) - (recRank.get(b.id) ?? 99);
        })[0];
    const active = gate ? pickRules() : (pickLesson() ?? pickRules());
    if (active) active.active = true;

    const locked = li > 0 && gate;
    return {
      level,
      number: li + 1,
      blocks,
      done: blocks.reduce((s, b) => s + b.done, 0),
      total: blocks.reduce((s, b) => s + b.total, 0),
      locked,
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
