import type { ModuleCategory } from '@/shared/contracts/catalog';
import type { InterestId, LessonId, SubjectTag } from '@/shared/contracts/types';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/** Every lesson has exactly these four steps, in this order. Step index = currentStep. */
export const STEP_IDS = ['story', 'interaction', 'quiz', 'explanation'] as const;
export type StepKey = (typeof STEP_IDS)[number];
/** currentStep === STEP_COUNT means "finished" (completion screen). */
export const STEP_COUNT = STEP_IDS.length;

/** Pitch coordinates: x 0..100, y 0..130 (goal at the top, passer at the bottom). */
export interface Point {
  x: number;
  y: number;
}

export interface Receiver {
  id: string;
  label: string;
  at: Point;
}

/* ---------- interactions (data-driven; add a kind = add a component) ---------- */

export interface PassingLanesSpec {
  kind: 'passing-lanes';
  prompt: string;
  passer: Point;
  receivers: Receiver[];
  defenderStart: Point;
  /** The visitor solves it by cutting off this receiver. */
  goalReceiverId: string;
  /** Distance (pitch units) within which a defender blocks a lane. */
  blockRadius: number;
  solvedMessage: string;
}

export interface AggregateSpec {
  kind: 'aggregate';
  prompt: string;
  teamA: string;
  teamB: string;
  /** First leg, played at team A's ground. */
  leg1: { a: number; b: number };
  /** The visitor sets the second-leg score so that team B advances. */
  solvedMessage: string;
}

export interface SequenceSpec {
  kind: 'sequence';
  prompt: string;
  /** Items listed in the CORRECT order. */
  items: { id: string; label: string }[];
  /** Starting arrangement shown to the visitor. Must differ from the correct order. */
  initialOrder: string[];
  solvedMessage: string;
}

export interface ClassifySpec {
  kind: 'classify';
  prompt: string;
  buckets: { id: string; label: string }[];
  items: { id: string; label: string; bucketId: string }[];
  solvedMessage: string;
}

export type InteractionSpec = PassingLanesSpec | AggregateSpec | SequenceSpec | ClassifySpec;

/** What an interaction reports back; stored under answers['interaction']. */
export interface InteractionAnswer {
  solved: boolean;
  /** Component-specific state so a reload restores the exact arrangement. */
  state?: Record<string, unknown>;
}

/* ---------- quiz ---------- */

export interface QuizDiagram {
  passer: Point;
  receivers: Receiver[];
  defenders: Point[];
  blockRadius: number;
}

export interface QuizSpec {
  question: string;
  options: { id: string; label: string }[];
  correctId: string;
  /** A different setup than the interaction, for tactical lessons. */
  diagram?: QuizDiagram;
}

/** What the quiz stores under answers['quiz']. */
export interface QuizAnswer {
  selected: string;
  firstChoice: string;
  correct: boolean;
  attempts: number;
}

/* ---------- lesson ---------- */

export interface Lesson {
  id: LessonId;
  title: string;
  module: ModuleCategory;
  difficulty: Difficulty;
  minutes: number;
  /** One or two sentences for list rows. */
  summary: string;
  interests: InterestId[];
  tags: SubjectTag[];
  /** Soft: only used to order recommendations for newcomers. */
  prerequisites: LessonId[];
  /** Feed stories this lesson builds on (stable post IDs) and a short label for the reason line. */
  feedHook?: { postIds: string[]; label: string };
  story: {
    coach: string;
    paragraphs: string[];
    /** Source story (a SEED_POSTS id) the lesson is based on. */
    sourcePostId?: string;
  };
  interaction: InteractionSpec;
  quiz: QuizSpec;
  explanation: { paragraphs: string[]; takeaway: string };
}

/** Props shared by every interaction component. `saved` restores the arrangement after a reload. */
export interface InteractionProps<S> {
  spec: S;
  saved: InteractionAnswer | undefined;
  onChange: (answer: InteractionAnswer) => void;
}
