import type { CourseState, GuestState, LessonId, ScoreRecord, SportId } from '../contracts/types';
import { FREE_LESSON_LIMIT } from '../contracts/catalog';

export const isOnboarded = (s: GuestState) => s.preferences.onboardedAt !== null;

/** Distinct stories read. */
export const viewedPostCount = (s: GuestState) => Object.keys(s.feed.views).length;

export const hasMembership = (c: CourseState) => c.membership.status === 'demo';

/**
 * Paywall policy: the first two DISTINCT completed lessons are free and stay free on replay.
 * Anything else needs demo membership once two lessons are complete.
 */
export function isLessonUnlocked(c: CourseState, lessonId: LessonId): boolean {
  if (hasMembership(c)) return true;
  if (c.completedLessonIds.includes(lessonId)) return true;
  return c.completedLessonIds.length < FREE_LESSON_LIMIT;
}

export const freeLessonsRemaining = (c: CourseState) =>
  Math.max(0, FREE_LESSON_LIMIT - c.completedLessonIds.length);

/** The lesson to resume, if it is still in progress. */
export function resumableLesson(c: CourseState) {
  const l = c.lastLessonId ? c.lessons[c.lastLessonId] : undefined;
  return l && !l.completedAt ? l : null;
}

export const isGoing = (s: GuestState, eventId: string) => s.community.rsvps[eventId]?.status === 'going';
export const isMember = (s: GuestState, groupId: string) => Boolean(s.community.groups[groupId]);
export const goingEventIds = (s: GuestState) =>
  Object.values(s.community.rsvps)
    .filter((r) => r.status === 'going')
    .map((r) => r.eventId);

export const guestRecords = (s: GuestState, sportId: SportId = 'soccer'): ScoreRecord[] =>
  Object.values(s.scoreboard.records).filter((r) => r.sportId === sportId);

export const totalPoints = (records: ScoreRecord[]) => records.reduce((n, r) => n + r.points, 0);
