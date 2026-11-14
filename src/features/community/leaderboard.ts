/**
 * Group leaderboard: course points among the members of one group.
 * The guest's points come from the shared scoreboard (first correct answers in Learn lessons);
 * the other members are the shared illustrative "Demo players".
 */
import type { GuestState } from '@/shared/contracts/types';
import { buildDemoPlayers } from '@/shared/fixtures/demoPlayers';
import { guestRecords, isMember, totalPoints } from '@/shared/state';

/** Scoreboard exercise IDs from Learn are `learn:<lesson>:<step>` (see exerciseId.lessonStep). */
const COURSE_EXERCISE_PREFIX = 'learn:';

/** Points the guest earned in the course. Feed quiz points are not course points. */
export const coursePoints = (state: GuestState) =>
  totalPoints(guestRecords(state).filter((r) => r.exerciseId.startsWith(COURSE_EXERCISE_PREFIX)));

export interface BoardRow {
  id: string;
  name: string;
  points: number;
  rank: number;
  isYou: boolean;
  isDemo: boolean;
}

export interface GroupBoard {
  /** Ranked members. Includes the guest only when they joined the group. */
  rows: BoardRow[];
  yourPoints: number;
  /** The guest's row when they are a member, else null. */
  you: BoardRow | null;
}

export function buildGroupBoard(state: GuestState, groupId: string, now: Date = new Date()): GroupBoard {
  const yourPoints = coursePoints(state);
  const members: Array<Omit<BoardRow, 'rank'>> = buildDemoPlayers(now).map((p) => ({
    id: p.playerId,
    name: p.displayName,
    points: totalPoints(p.records),
    isYou: false,
    isDemo: true,
  }));
  if (isMember(state, groupId)) {
    members.push({ id: 'you', name: 'You', points: yourPoints, isYou: true, isDemo: false });
  }
  const rows = members
    // Highest first; on a tie the guest goes first, then the fixture order.
    .map((m, i) => ({ m, i }))
    .sort((a, b) => b.m.points - a.m.points || Number(b.m.isYou) - Number(a.m.isYou) || a.i - b.i)
    .map(({ m }, i) => ({ ...m, rank: i + 1 }));
  return { rows, yourPoints, you: rows.find((r) => r.isYou) ?? null };
}
