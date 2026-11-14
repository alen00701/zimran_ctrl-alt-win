/**
 * Lesson catalog. To add a lesson: create catalog/lessons/<id>.ts exporting a `Lesson`,
 * then add it to ALL_LESSONS below. Lessons that fail validation are not shown as available.
 */
import type { Lesson } from '../types';
import { historyMaradona1986 } from './lessons/history-maradona-1986';
import { rulesAggregateScore } from './lessons/rules-aggregate-score';
import { tacticsPassingLanes } from './lessons/tactics-passing-lanes';
import { tacticsQuickCorner } from './lessons/tactics-quick-corner';
import { tournaments2015WorldCupFinal } from './lessons/tournaments-2015-world-cup-final';
import { transfersMessiToMiami } from './lessons/transfers-messi-to-miami';
import { isPlayable } from './validate';

/** Order matters: it is the tie-breaker for recommendations. Matches SEED_LESSON_IDS. */
export const ALL_LESSONS: readonly Lesson[] = [
  rulesAggregateScore,
  tacticsQuickCorner,
  transfersMessiToMiami,
  tacticsPassingLanes,
  historyMaradona1986,
  tournaments2015WorldCupFinal,
];

/** Only playable lessons are exposed. */
export const CATALOG: readonly Lesson[] = ALL_LESSONS.filter(isPlayable);

export const getLesson = (id: string): Lesson | undefined => CATALOG.find((l) => l.id === id);
