/**
 * Stable IDs and deep-link fixtures shared across tabs. Frozen in the foundation commit.
 * Feature owners may ADD their own local IDs inside their feature, but cross-tab IDs live here.
 */

/** Sourced seed stories required by the brief. Feed owns the card content and summaries. */
export const SEED_POSTS = [
  {
    id: 'messi-miami-debut-free-kick',
    sourceUrl:
      'https://www.intermiamicf.com/news/match-recap-lionel-messi-scores-late-free-kick-winner-in-inter-miami-cf-debut',
  },
  {
    id: 'messi-signs-with-inter-miami',
    sourceUrl:
      'https://www.intermiamicf.com/news/inter-miami-cf-signs-seven-time-ballon-d-or-winner-world-cup-champion-lionel-mes',
  },
  {
    id: 'liverpool-quick-corner-barcelona',
    sourceUrl:
      'https://www.uefa.com/uefachampionsleague/news/025d-0f5553e09799-f2005c82c870-1000--watch-in-full-liverpool-4-0-barca/',
  },
  {
    id: 'carli-lloyd-2015-final-hat-trick',
    sourceUrl:
      'https://www.ussoccer.com/stories/2015/07/world-champions-usa-wins-2015-fifa-womens-world-cup',
  },
  {
    id: 'maradona-1986-england-two-goals',
    sourceUrl:
      'https://www.fifa.com/en/tournaments/mens/worldcup/articles/argentina-england-1986-diego-maradona',
  },
  {
    id: 'orlando-city-fc-cincinnati-2026-11-19-preview',
    sourceUrl:
      'https://www.mlssoccer.com/news/audi-2026-mls-cup-playoffs-field-set-and-wild-card-match-schedule-announced',
  },
] as const;

export type SeedPostId = (typeof SEED_POSTS)[number]['id'];

/** Match ID used for the saved prediction on the preview story. */
export const DEMO_MATCH_ID = 'mls-2026-11-19-orlando-city-fc-cincinnati';

/**
 * Seed lesson IDs. Learn owns the catalog and may add more lessons as data.
 * These six are referenced by Feed ("optional lesson") and Account ("resume").
 */
export const SEED_LESSON_IDS = [
  'rules-aggregate-score',
  'tactics-quick-corner',
  'transfers-messi-to-miami',
  'tactics-passing-lanes',
  'history-maradona-1986',
  'tournaments-2015-world-cup-final',
] as const;

export type SeedLessonId = (typeof SEED_LESSON_IDS)[number];

/** Community fixtures. Community owns the full page content; these core facts are shared. */
export const DEMO_GROUP = {
  id: 'orlando-matchday-regulars',
  name: 'Orlando Matchday Regulars',
} as const;

export const DEMO_EVENT = {
  id: 'watch-party-orlando-city-fc-cincinnati-2026-11-19',
  title: 'Watch party: Orlando City vs FC Cincinnati',
  matchId: DEMO_MATCH_ID,
  /** Doors open time for the fictional watch party, not an official kickoff time. */
  startsAt: '2026-11-19T19:00:00-05:00',
  timeZone: 'America/New_York',
  venueName: 'The Far Post Taproom',
  city: 'Orlando, FL',
  groupId: 'orlando-matchday-regulars',
  isDemo: true,
} as const;

export const DEMO_EVENTS = [DEMO_EVENT] as const;
export const DEMO_GROUPS = [DEMO_GROUP] as const;

/** Quiz shown after two distinct stories. Feed owns the question content. */
export const FEED_QUIZ_ID_PREFIX = 'feed-quiz:';

/** Build a scoreboard exercise ID that never collides across tabs. */
export const exerciseId = {
  lessonStep: (lessonId: string, stepId: string) => `learn:${lessonId}:${stepId}`,
  feedQuiz: (quizId: string) => `feed:${quizId}`,
};
