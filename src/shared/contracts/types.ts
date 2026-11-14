/**
 * Frozen shared contracts for Read the Game.
 * Owned by Foundation / integration. Feature branches must not edit this file;
 * request changes from the integrator, who publishes them once for everyone.
 */

/* ---------- Identifiers ---------- */

/** Stable, URL-safe kebab-case IDs. Never reuse an ID for different content. */
export type PostId = string;
export type LessonId = string;
export type StepId = string;
export type QuizId = string;
export type MatchId = string;
export type GroupId = string;
export type EventId = string;
export type ExerciseId = string;
export type SportId = 'soccer';

/** ISO-8601 timestamp, e.g. "2026-11-14T15:04:05.000Z". */
export type IsoDateTime = string;
/** Calendar date, e.g. "2026-11-19". */
export type IsoDate = string;

/* ---------- Preferences ---------- */

export type Expertise = 'new' | 'familiar' | 'expert';

export type InterestId =
  | 'tactics'
  | 'strategy'
  | 'techniques'
  | 'rules'
  | 'players'
  | 'transfers'
  | 'club-history'
  | 'tournaments';

export interface Preferences {
  expertise: Expertise | null;
  interests: InterestId[];
  /** Set when the visitor finishes onboarding. Returning visitors with this set skip onboarding. */
  onboardedAt: IsoDateTime | null;
}

/* ---------- Feed ---------- */

/**
 * Subject tags used by Feed cards, Learn modules and quiz signals.
 * Interests are a subset; extra tags keep other subjects discoverable.
 */
export type SubjectTag =
  | InterestId
  | 'match-moments'
  | 'news'
  | 'biographies'
  | 'history'
  | 'scandals'
  | 'statistics'
  | 'previews';

export interface PostView {
  postId: PostId;
  tags: SubjectTag[];
  firstViewedAt: IsoDateTime;
}

export type QuizOutcome =
  | { status: 'dismissed'; at: IsoDateTime }
  | { status: 'answered'; at: IsoDateTime; answerId: string; correct: boolean };

export type MatchPickOutcome = 'home' | 'draw' | 'away';

export interface MatchPick {
  matchId: MatchId;
  pick: MatchPickOutcome;
  homeGoals?: number;
  awayGoals?: number;
  savedAt: IsoDateTime;
}

export interface FeedState {
  /** Keyed by post ID, so a second read of the same story is not a second article. */
  views: Record<PostId, PostView>;
  quizzes: Record<QuizId, QuizOutcome>;
  picks: Record<MatchId, MatchPick>;
}

/* ---------- Course (Learn) ---------- */

export type SavedAnswer = string | number | boolean | string[] | Record<string, unknown>;

export interface LessonProgress {
  lessonId: LessonId;
  /** Display title snapshot so Account can show "Resume …" without importing Learn. */
  title: string;
  /** Zero-based index of the step the visitor should land on after a reload. */
  currentStep: number;
  answers: Record<StepId, SavedAnswer>;
  startedAt: IsoDateTime;
  updatedAt: IsoDateTime;
  completedAt: IsoDateTime | null;
}

export interface Membership {
  /** Demo membership only. No card, no charge. */
  status: 'none' | 'demo';
  startedAt: IsoDateTime | null;
}

export interface CourseState {
  lessons: Record<LessonId, LessonProgress>;
  /** Distinct completed lessons, in completion order. */
  completedLessonIds: LessonId[];
  /** Last lesson the visitor opened; used for "Resume lesson". */
  lastLessonId: LessonId | null;
  membership: Membership;
}

/* ---------- Community ---------- */

export interface GroupMembership {
  groupId: GroupId;
  joinedAt: IsoDateTime;
}

export interface Rsvp {
  eventId: EventId;
  status: 'going' | 'cancelled';
  updatedAt: IsoDateTime;
}

export interface CommunityState {
  /** Present = joined. Leaving removes the key. */
  groups: Record<GroupId, GroupMembership>;
  rsvps: Record<EventId, Rsvp>;
}

/* ---------- Scoreboard ---------- */

export interface ScoreRecord {
  sportId: SportId;
  exerciseId: ExerciseId;
  /** 10 when the first submitted answer was correct, otherwise 0. Never changes afterwards. */
  points: number;
  firstAttemptAt: IsoDateTime;
}

export interface ScoreboardState {
  /** Keyed by `${sportId}:${exerciseId}`; only the first attempt is ever stored. */
  records: Record<string, ScoreRecord>;
}

/** Leaderboard row. `isDemo` rows are illustrative "Demo players", never real people. */
export interface LeaderboardPlayer {
  playerId: string;
  displayName: string;
  isDemo: boolean;
  records: ScoreRecord[];
}

/* ---------- Whole guest profile ---------- */

export interface GuestState {
  preferences: Preferences;
  feed: FeedState;
  course: CourseState;
  community: CommunityState;
  scoreboard: ScoreboardState;
}

export type GuestSlice = keyof GuestState;

/** Persisted envelope. Bump `version` and add a migration in storage.ts when the shape changes. */
export interface StoredEnvelope {
  version: number;
  updatedAt: IsoDateTime;
  state: GuestState;
}
