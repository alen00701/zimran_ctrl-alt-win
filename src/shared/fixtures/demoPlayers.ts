import type { LeaderboardPlayer, ScoreRecord } from '../contracts/types';

const DAY = 24 * 60 * 60 * 1000;

function rec(exercise: string, points: number, daysAgo: number, now: Date): ScoreRecord {
  return {
    sportId: 'soccer',
    exerciseId: `demo:${exercise}`,
    points,
    firstAttemptAt: new Date(now.getTime() - daysAgo * DAY).toISOString(),
  };
}

/**
 * Illustrative leaderboard entries, dated relative to `now` so the weekly board
 * is populated whenever the demo runs. Always label these "Demo players" in UI.
 */
export function buildDemoPlayers(now: Date = new Date()): LeaderboardPlayer[] {
  const make = (playerId: string, displayName: string, entries: Array<[number, number]>) => ({
    playerId,
    displayName,
    isDemo: true,
    records: entries.map(([points, daysAgo], i) => rec(`${playerId}-${i}`, points, daysAgo, now)),
  });
  return [
    make('demo-maya', 'Maya R.', [[10, 0], [10, 1], [10, 2], [0, 3], [10, 9]]),
    make('demo-jordan', 'Jordan T.', [[10, 1], [10, 2], [0, 4], [10, 12]]),
    make('demo-sam', 'Sam K.', [[10, 0], [0, 2], [10, 5]]),
    make('demo-alex', 'Alex P.', [[10, 3], [10, 15], [10, 16]]),
  ];
}

/** Sum points whose first attempt falls inside [now - days, now]. */
export function pointsWithin(records: ScoreRecord[], days: number, now: Date = new Date()): number {
  const from = now.getTime() - days * DAY;
  return records.reduce((sum, r) => {
    const t = Date.parse(r.firstAttemptAt);
    return t >= from && t <= now.getTime() ? sum + r.points : sum;
  }, 0);
}
