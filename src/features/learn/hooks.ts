import { useMemo } from 'react';
import { useGuestState } from '@/shared/state';
import { CATALOG } from './catalog';
import { recommend, type RecommendInput, type Recommendation } from './logic/recommend';
import type { GuestState } from '@/shared/contracts/types';

/** Builds the pure recommend() input from the shared guest state (preferences, Feed signals, progress). */
export function buildRecommendInput(s: GuestState): RecommendInput {
  const quizzes = Object.values(s.feed.quizzes);
  const inProgress = Object.values(s.course.lessons)
    .filter((l) => !l.completedAt)
    .sort((a, b) => (a.lessonId === s.course.lastLessonId ? -1 : b.lessonId === s.course.lastLessonId ? 1 : b.updatedAt.localeCompare(a.updatedAt)))
    .map((l) => ({ lessonId: l.lessonId, currentStep: l.currentStep }));
  return {
    lessons: [...CATALOG],
    expertise: s.preferences.expertise,
    interests: s.preferences.interests,
    viewedPostIds: Object.keys(s.feed.views),
    viewedTags: Object.values(s.feed.views).flatMap((v) => v.tags),
    feedQuizzesAnswered: quizzes.filter((q) => q.status === 'answered').length,
    feedQuizzesWrong: quizzes.filter((q) => q.status === 'answered' && !q.correct).length,
    completed: s.course.completedLessonIds,
    inProgress,
  };
}

/** Live recommendations. Re-computed whenever preferences, Feed signals or progress change. */
export function useRecommendations(): Recommendation[] {
  const state = useGuestState();
  return useMemo(() => recommend(buildRecommendInput(state)), [state]);
}
