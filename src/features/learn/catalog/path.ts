/**
 * The learning path: 3 levels × 5 blocks. A block holds drills (Rules basics) or catalog lessons,
 * then a capstone quiz node. Blocks without authored content are shown as "Coming soon",
 * never as available.
 */
import type { ModuleCategory } from '@/shared/contracts/catalog';
import type { Difficulty } from '../types';
import { RULES_BLOCK_ID, RULES_DRILLS, RULES_QUIZ_ID } from './rulesBasics';

export type PathNodeRef = { kind: 'drill'; id: string } | { kind: 'lesson'; id: string };

export type BlockTone = 'brand' | 'inverse' | 'deep' | 'outline';

export interface PathBlock {
  id: string;
  title: string;
  module: ModuleCategory;
  tone: BlockTone;
  /** Quick-view guide shown from the banner's guide button. */
  guide: string[];
  nodes: PathNodeRef[];
  /** Capstone quiz route ID, if authored. */
  quizId?: string;
  /** True for the mandatory Rules basics block. */
  mandatory?: boolean;
}

export interface PathLevel {
  id: Difficulty;
  label: string;
  blocks: PathBlock[];
}

/** Planned slots per block, from the course structure. Only authored nodes are playable. */
export const BLOCK_SLOTS = 10;

export const LEVELS: PathLevel[] = [
  {
    id: 'beginner',
    label: 'Beginner',
    blocks: [
      {
        id: RULES_BLOCK_ID,
        title: 'Rules basics',
        module: 'rules',
        tone: 'brand',
        mandatory: true,
        guide: [
          'Ten short lessons on the rules every fan needs: goals, restarts, offside, fouls and cards.',
          'Finish all ten, then pass the 10-question quiz with at least 7 correct answers.',
          'Newcomers unlock the rest of the course by passing this block.',
        ],
        nodes: RULES_DRILLS.map((d) => ({ kind: 'drill' as const, id: d.id })),
        quizId: RULES_QUIZ_ID,
      },
      {
        id: 'beginner-scores',
        title: 'Scores and tournaments',
        module: 'tournaments',
        tone: 'inverse',
        guide: ['How results are decided across two legs and how a World Cup is structured.'],
        nodes: [
          { kind: 'lesson', id: 'rules-aggregate-score' },
          { kind: 'lesson', id: 'tournaments-2015-world-cup-final' },
        ],
      },
      {
        id: 'beginner-space',
        title: 'Space on the field',
        module: 'tactics',
        tone: 'deep',
        guide: ['Why positions matter more than chasing the ball. Move a defender and see what changes.'],
        nodes: [{ kind: 'lesson', id: 'tactics-passing-lanes' }],
      },
      { id: 'beginner-skills', title: 'Techniques and skills', module: 'techniques', tone: 'outline', guide: ['First touch, passing and shooting technique.'], nodes: [] },
      { id: 'beginner-plans', title: 'Game plans', module: 'strategy', tone: 'outline', guide: ['How coaches set up a team to win.'], nodes: [] },
    ],
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    blocks: [
      {
        id: 'intermediate-legends',
        title: 'Legends and controversy',
        module: 'history',
        tone: 'brand',
        guide: ['Matches the sport still argues about, and why.'],
        nodes: [{ kind: 'lesson', id: 'history-maradona-1986' }],
      },
      {
        id: 'intermediate-transfers',
        title: 'Transfers',
        module: 'transfers',
        tone: 'inverse',
        guide: ['How moves between clubs and leagues shape careers.'],
        nodes: [{ kind: 'lesson', id: 'transfers-messi-to-miami' }],
      },
      { id: 'intermediate-bios', title: 'Player biographies', module: 'biographies', tone: 'outline', guide: ['The people behind the legends.'], nodes: [] },
      { id: 'intermediate-formats', title: 'Tournament formats', module: 'tournaments', tone: 'outline', guide: ['Groups, knockouts and tiebreakers.'], nodes: [] },
      { id: 'intermediate-skills', title: 'Skills in context', module: 'techniques', tone: 'outline', guide: ['When and why players choose a technique.'], nodes: [] },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    blocks: [
      {
        id: 'advanced-set-pieces',
        title: 'Set pieces',
        module: 'tactics',
        tone: 'brand',
        guide: ['Restarts as weapons: timing, routines and catching a defense unset.'],
        nodes: [{ kind: 'lesson', id: 'tactics-quick-corner' }],
      },
      { id: 'advanced-pressing', title: 'Pressing and shape', module: 'tactics', tone: 'outline', guide: ['Defending as a unit.'], nodes: [] },
      { id: 'advanced-managers', title: 'Managers and game plans', module: 'strategy', tone: 'outline', guide: ['In-game decisions and substitutions.'], nodes: [] },
      { id: 'advanced-club-history', title: 'Club history', module: 'history', tone: 'outline', guide: ['How great clubs were built.'], nodes: [] },
      { id: 'advanced-market', title: 'The transfer market', module: 'transfers', tone: 'outline', guide: ['Fees, contracts and windows.'], nodes: [] },
    ],
  },
];

export const levelOf = (id: string) => LEVELS.find((l) => l.id === id);
