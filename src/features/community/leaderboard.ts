/**
 * Silver League: a weekly leaderboard of Learn points.
 * Only first correct answers in Learn lessons count (scoreboard IDs `learn:…`).
 * Matchdays, RSVPs, chat and Feed quizzes never add points.
 * Other entries are the shared illustrative "Demo players".
 */
import { useEffect, useState } from 'react';
import type { GuestState, ScoreRecord } from '@/shared/contracts/types';
import { buildDemoPlayers } from '@/shared/fixtures/demoPlayers';
import { guestRecords, totalPoints } from '@/shared/state';

export const LEAGUE_NAME = 'Silver League';

/** Scoreboard exercise IDs from Learn are `learn:<lesson>:<step>` (see exerciseId.lessonStep). */
const COURSE_EXERCISE_PREFIX = 'learn:';
const isCourseRecord = (r: ScoreRecord) => r.exerciseId.startsWith(COURSE_EXERCISE_PREFIX);

/** All-time points the guest earned in Learn. */
export const coursePoints = (state: GuestState) => totalPoints(guestRecords(state).filter(isCourseRecord));

/** The league week in the viewer's local time: Monday 00:00 → next Monday 00:00. */
export function leagueWeek(now: Date = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start, end };
}

/** "2d 4h 05m", "4h 05m", "5m"; "0m" once over. Minutes are floored. */
export function timeLeftLabel(end: Date, now: Date = new Date()): string {
  const mins = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 60_000));
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = String(mins % 60).padStart(2, '0');
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${mins % 60}m`;
}

const pointsBetween = (records: ScoreRecord[], start: Date, end: Date) =>
  records.reduce((sum, r) => {
    const t = Date.parse(r.firstAttemptAt);
    return t >= start.getTime() && t < end.getTime() ? sum + r.points : sum;
  }, 0);

export interface BoardRow {
  id: string;
  name: string;
  points: number;
  rank: number;
  isYou: boolean;
  isDemo: boolean;
}

export interface LeagueBoard {
  rows: BoardRow[];
  you: BoardRow;
  /** Guest's Learn points this league week. */
  yourPoints: number;
  endsAt: Date;
}

export function buildLeagueBoard(state: GuestState, now: Date = new Date()): LeagueBoard {
  const { start, end } = leagueWeek(now);
  const yourPoints = pointsBetween(guestRecords(state).filter(isCourseRecord), start, end);
  const entries: Array<Omit<BoardRow, 'rank'>> = [
    ...buildDemoPlayers(now).map((p) => ({
      id: p.playerId,
      name: p.displayName,
      points: pointsBetween(p.records, start, end),
      isYou: false,
      isDemo: true,
    })),
    { id: 'you', name: 'You', points: yourPoints, isYou: true, isDemo: false },
  ];
  const rows = entries
    // Highest first; on a tie the guest goes first, then the fixture order.
    .map((e, i) => ({ e, i }))
    .sort((a, b) => b.e.points - a.e.points || Number(b.e.isYou) - Number(a.e.isYou) || a.i - b.i)
    .map(({ e }, i) => ({ ...e, rank: i + 1 }));
  return { rows, you: rows.find((r) => r.isYou)!, yourPoints, endsAt: end };
}

/** Current time, refreshed every `ms` (for the countdown). */
export function useNow(ms = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}
