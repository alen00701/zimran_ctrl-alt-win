import type { GuestState } from '../contracts/types';
import { MAX_HEARTS } from '../contracts/catalog';

export function createDefaultState(): GuestState {
  return {
    preferences: { expertise: null, interests: [], onboardedAt: null },
    feed: { views: {}, quizzes: {}, picks: {} },
    course: {
      lessons: {},
      completedLessonIds: [],
      lastLessonId: null,
      membership: { status: 'none', startedAt: null },
    },
    community: { groups: {}, rsvps: {} },
    scoreboard: { records: {} },
    game: { hearts: MAX_HEARTS },
  };
}
