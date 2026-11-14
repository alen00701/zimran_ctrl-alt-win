/**
 * The only way features change guest state. Each action touches one slice.
 * Import from '@/shared/state'.
 */
import type {
  EventId,
  Expertise,
  GroupId,
  InterestId,
  LessonId,
  MatchPick,
  PostId,
  QuizId,
  SavedAnswer,
  ScoreRecord,
  SportId,
  StepId,
  SubjectTag,
} from '../contracts/types';
import { MAX_HEARTS, POINTS_FOR_FIRST_CORRECT } from '../contracts/catalog';
import { openOutOfHearts } from './heartsUi';
import { hasMembership } from './selectors';
import { getGuestState, RESET_CONFIRMATION, resetGuestState, updateSlice } from './storage';

const now = () => new Date().toISOString();

/* ---------- preferences ---------- */

export const preferencesActions = {
  /** Finish onboarding. Editing later never touches progress slices. */
  completeOnboarding(expertise: Expertise, interests: InterestId[]) {
    updateSlice('preferences', (p) => ({
      expertise,
      interests: [...new Set(interests)],
      onboardedAt: p.onboardedAt ?? now(),
    }));
  },
  setExpertise(expertise: Expertise) {
    updateSlice('preferences', (p) => (p.expertise === expertise ? p : { ...p, expertise }));
  },
  setInterests(interests: InterestId[]) {
    updateSlice('preferences', (p) => ({ ...p, interests: [...new Set(interests)] }));
  },
  toggleInterest(id: InterestId) {
    updateSlice('preferences', (p) => ({
      ...p,
      interests: p.interests.includes(id) ? p.interests.filter((i) => i !== id) : [...p.interests, id],
    }));
  },
};

/* ---------- feed ---------- */

export const feedActions = {
  /** Idempotent: re-reading a story keeps the first view and does not count twice. */
  markPostViewed(postId: PostId, tags: SubjectTag[]) {
    updateSlice('feed', (f) =>
      f.views[postId] ? f : { ...f, views: { ...f.views, [postId]: { postId, tags, firstViewedAt: now() } } },
    );
  },
  dismissQuiz(quizId: QuizId) {
    updateSlice('feed', (f) =>
      f.quizzes[quizId] ? f : { ...f, quizzes: { ...f.quizzes, [quizId]: { status: 'dismissed', at: now() } } },
    );
  },
  /** Stores the first answer only. */
  answerQuiz(quizId: QuizId, answerId: string, correct: boolean) {
    updateSlice('feed', (f) =>
      f.quizzes[quizId]?.status === 'answered'
        ? f
        : { ...f, quizzes: { ...f.quizzes, [quizId]: { status: 'answered', at: now(), answerId, correct } } },
    );
  },
  savePick(pick: Omit<MatchPick, 'savedAt'>) {
    updateSlice('feed', (f) => ({ ...f, picks: { ...f.picks, [pick.matchId]: { ...pick, savedAt: now() } } }));
  },
};

/* ---------- course ---------- */

export const courseActions = {
  /** Opens a lesson. Keeps existing progress (current step, answers) if already started. */
  openLesson(lessonId: LessonId, title: string) {
    updateSlice('course', (c) => {
      const existing = c.lessons[lessonId];
      const t = now();
      return {
        ...c,
        lastLessonId: lessonId,
        lessons: {
          ...c.lessons,
          [lessonId]: existing
            ? { ...existing, title, updatedAt: t }
            : { lessonId, title, currentStep: 0, answers: {}, startedAt: t, updatedAt: t, completedAt: null },
        },
      };
    });
  },
  setStep(lessonId: LessonId, currentStep: number) {
    updateSlice('course', (c) => {
      const l = c.lessons[lessonId];
      if (!l) return c;
      return { ...c, lessons: { ...c.lessons, [lessonId]: { ...l, currentStep, updatedAt: now() } } };
    });
  },
  saveAnswer(lessonId: LessonId, stepId: StepId, answer: SavedAnswer) {
    updateSlice('course', (c) => {
      const l = c.lessons[lessonId];
      if (!l) return c;
      return {
        ...c,
        lessons: { ...c.lessons, [lessonId]: { ...l, answers: { ...l.answers, [stepId]: answer }, updatedAt: now() } },
      };
    });
  },
  /** Distinct: completing the same lesson again does not add a second entry. */
  completeLesson(lessonId: LessonId) {
    updateSlice('course', (c) => {
      const l = c.lessons[lessonId];
      const t = now();
      return {
        ...c,
        lessons: l ? { ...c.lessons, [lessonId]: { ...l, completedAt: l.completedAt ?? t, updatedAt: t } } : c.lessons,
        completedLessonIds: c.completedLessonIds.includes(lessonId)
          ? c.completedLessonIds
          : [...c.completedLessonIds, lessonId],
      };
    });
  },
  /** "Try membership demo · No charge". No card, no payment. */
  startDemoMembership() {
    updateSlice('course', (c) =>
      c.membership.status === 'demo' ? c : { ...c, membership: { status: 'demo', startedAt: now() } },
    );
  },
  endDemoMembership() {
    updateSlice('course', (c) => ({ ...c, membership: { status: 'none', startedAt: null } }));
  },
};

/* ---------- community ---------- */

export const communityActions = {
  joinGroup(groupId: GroupId) {
    updateSlice('community', (c) =>
      c.groups[groupId] ? c : { ...c, groups: { ...c.groups, [groupId]: { groupId, joinedAt: now() } } },
    );
  },
  leaveGroup(groupId: GroupId) {
    updateSlice('community', (c) => {
      if (!c.groups[groupId]) return c;
      const groups = { ...c.groups };
      delete groups[groupId];
      return { ...c, groups };
    });
  },
  rsvp(eventId: EventId) {
    updateSlice('community', (c) => ({
      ...c,
      rsvps: { ...c.rsvps, [eventId]: { eventId, status: 'going', updatedAt: now() } },
    }));
  },
  cancelRsvp(eventId: EventId) {
    updateSlice('community', (c) =>
      c.rsvps[eventId]?.status !== 'going'
        ? c
        : { ...c, rsvps: { ...c.rsvps, [eventId]: { eventId, status: 'cancelled', updatedAt: now() } } },
    );
  },
};

/* ---------- scoreboard ---------- */

export interface AttemptResult {
  /** Points awarded by THIS call (0 on retries and refreshes). */
  awarded: number;
  /** True if an earlier attempt already exists; nothing was written. */
  alreadyAttempted: boolean;
  record: ScoreRecord;
}

export const scoreKey = (sportId: SportId, exerciseId: string) => `${sportId}:${exerciseId}`;

export const scoreboardActions = {
  /**
   * Call on the FIRST submitted answer of a scored exercise. 10 points if correct, else 0.
   * Retrying or refreshing returns the stored record and awards nothing.
   */
  recordFirstAttempt(sportId: SportId, exerciseId: string, correct: boolean): AttemptResult {
    const key = scoreKey(sportId, exerciseId);
    let result: AttemptResult | null = null;
    updateSlice('scoreboard', (s) => {
      const existing = s.records[key];
      if (existing) {
        result = { awarded: 0, alreadyAttempted: true, record: existing };
        return s;
      }
      const record: ScoreRecord = {
        sportId,
        exerciseId,
        points: correct ? POINTS_FOR_FIRST_CORRECT : 0,
        firstAttemptAt: now(),
      };
      result = { awarded: record.points, alreadyAttempted: false, record };
      return { ...s, records: { ...s.records, [key]: record } };
    });
    return result!;
  },
};

/* ---------- game: plan and hearts ---------- */

export type Plan = 'free' | 'pro';

export const gameActions = {
  /** Pro is the demo membership, so Learn's paywall, Account and the status bar always agree. No card, no charge. */
  setPlan(plan: Plan) {
    if (plan === 'pro') courseActions.startDemoMembership();
    else courseActions.endDemoMembership();
  },
  /**
   * A wrong answer. Free: one heart is spent (never below 0) and the out-of-hearts dialog opens at 0.
   * Pro: nothing is spent. Returns what happened so callers can animate it.
   */
  loseHeart(): { lost: boolean; hearts: number } {
    const state = getGuestState();
    if (hasMembership(state.course)) return { lost: false, hearts: state.game.hearts };
    if (state.game.hearts <= 0) {
      openOutOfHearts();
      return { lost: false, hearts: 0 };
    }
    const hearts = state.game.hearts - 1;
    updateSlice('game', (g) => ({ ...g, hearts }));
    if (hearts === 0) openOutOfHearts();
    return { lost: true, hearts };
  },
  /** Demo refill. */
  refillHearts() {
    updateSlice('game', (g) => (g.hearts === MAX_HEARTS ? g : { ...g, hearts: MAX_HEARTS }));
  },
};

/** True when a Free visitor has no hearts left. Learn blocks answers then; the Feed never does. */
export const outOfHearts = () => {
  const s = getGuestState();
  return !hasMembership(s.course) && s.game.hearts <= 0;
};

/* ---------- reset ---------- */

/** Call only after the visitor confirmed in UI (Account owns the confirmation step). */
export function resetDemo() {
  resetGuestState(RESET_CONFIRMATION);
}
