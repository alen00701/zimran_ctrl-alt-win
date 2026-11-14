/**
 * Deterministic lesson selection. Same inputs → same output. No network, no randomness.
 * Inputs: expertise, interests, Feed signals (stories read, topic tags, quiz outcomes) and progress.
 * A lesson already in progress is pinned first and is never reranked by preference changes.
 */
import { INTEREST_OPTIONS } from '@/shared/contracts/catalog';
import type { Expertise, InterestId, LessonId, SubjectTag } from '@/shared/contracts/types';
import type { Difficulty, Lesson } from '../types';

export interface RecommendInput {
  lessons: Lesson[];
  expertise: Expertise | null;
  interests: InterestId[];
  viewedPostIds: string[];
  viewedTags: SubjectTag[];
  feedQuizzesAnswered: number;
  feedQuizzesWrong: number;
  completed: LessonId[];
  /** Started, not completed. Ordered by most recently updated first. */
  inProgress: { lessonId: LessonId; currentStep: number }[];
}

export type LessonState = 'in-progress' | 'new' | 'completed';

export interface Recommendation {
  lessonId: LessonId;
  state: LessonState;
  score: number;
  /** One short line explaining the pick. */
  reason: string;
}

const EXPERTISE_FIT: Record<Expertise, Record<Difficulty, number>> = {
  new: { beginner: 3, intermediate: 1, advanced: -2 },
  familiar: { beginner: 1.5, intermediate: 3, advanced: 1.5 },
  expert: { beginner: -1, intermediate: 1.5, advanced: 3 },
};

const EXPERTISE_REASON: Record<Expertise, Record<Difficulty, string>> = {
  new: {
    beginner: 'A friendly place to start',
    intermediate: 'A step up once the basics click',
    advanced: 'Save this one for later',
  },
  familiar: {
    beginner: 'A quick refresher on the basics',
    intermediate: 'Right level for fans who know the game',
    advanced: 'A stretch goal for you',
  },
  expert: {
    beginner: 'Quick warm-up',
    intermediate: 'A solid challenge for experienced fans',
    advanced: 'Deeper analysis for experienced fans',
  },
};

const interestLabel = (id: InterestId) => (INTEREST_OPTIONS.find((o) => o.id === id)?.label ?? id).toLowerCase();

interface Part {
  /** Lower = wins ties when contributions are equal. */
  priority: number;
  points: number;
  reason: string;
}

function scoreLesson(lesson: Lesson, input: RecommendInput): { score: number; reason: string } {
  const parts: Part[] = [];

  // Feed: the visitor actually read a story this lesson builds on.
  const hookHits = lesson.feedHook ? lesson.feedHook.postIds.filter((id) => input.viewedPostIds.includes(id)).length : 0;
  if (hookHits > 0 && lesson.feedHook) {
    parts.push({ priority: 0, points: 5 + (hookHits - 1), reason: `Builds on the story you read: ${lesson.feedHook.label}` });
  }

  // Interests.
  const shared = lesson.interests.filter((i) => input.interests.includes(i));
  if (shared.length > 0) {
    const names = shared.slice(0, 2).map(interestLabel).join(' and ');
    parts.push({ priority: 1, points: 3 * shared.length, reason: `Matches your interest in ${names}` });
  }

  // Expertise fit.
  if (input.expertise) {
    parts.push({
      priority: 2,
      points: EXPERTISE_FIT[input.expertise][lesson.difficulty],
      reason: EXPERTISE_REASON[input.expertise][lesson.difficulty],
    });
  }

  // Topics seen in the Feed (up to two overlapping tags).
  const tagHits = lesson.tags.filter((t) => input.viewedTags.includes(t)).length;
  if (tagHits > 0) {
    parts.push({ priority: 3, points: Math.min(tagHits, 2), reason: 'Connects to topics you have been reading' });
  }

  // A wrong answer on a Feed quiz nudges beginner lessons up.
  if (input.feedQuizzesWrong > 0 && lesson.difficulty === 'beginner') {
    parts.push({ priority: 4, points: 2, reason: 'A quick refresher after your story quiz' });
  }

  // Soft prerequisites only matter for newcomers.
  let penalty = 0;
  if (input.expertise === 'new' && lesson.prerequisites.some((p) => !input.completed.includes(p))) penalty = 3;

  const score = parts.reduce((s, p) => s + p.points, 0) - penalty;
  const best = [...parts].filter((p) => p.points > 0).sort((a, b) => b.points - a.points || a.priority - b.priority)[0];
  return { score, reason: best?.reason ?? 'Fresh to your playbook' };
}

export function recommend(input: RecommendInput): Recommendation[] {
  const order = new Map(input.lessons.map((l, i) => [l.id, i]));
  const byId = new Map(input.lessons.map((l) => [l.id, l]));

  const pinned: Recommendation[] = input.inProgress
    .filter((p) => byId.has(p.lessonId) && !input.completed.includes(p.lessonId))
    .map((p) => ({
      lessonId: p.lessonId,
      state: 'in-progress' as const,
      score: Number.POSITIVE_INFINITY,
      reason: `Pick up at step ${Math.min(p.currentStep + 1, 4)} of 4`,
    }));
  const pinnedIds = new Set(pinned.map((p) => p.lessonId));

  const fresh: Recommendation[] = input.lessons
    .filter((l) => !pinnedIds.has(l.id) && !input.completed.includes(l.id))
    .map((l) => ({ lessonId: l.id, state: 'new' as const, ...scoreLesson(l, input) }))
    .sort((a, b) => b.score - a.score || (order.get(a.lessonId) ?? 0) - (order.get(b.lessonId) ?? 0));

  const done: Recommendation[] = input.lessons
    .filter((l) => input.completed.includes(l.id))
    .map((l) => ({ lessonId: l.id, state: 'completed' as const, score: Number.NEGATIVE_INFINITY, reason: 'Completed · replay any time' }));

  return [...pinned, ...fresh, ...done];
}
