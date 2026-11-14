/**
 * The learning path: 3 levels × 5 blocks. A block holds drills (Rules basics) or catalog lessons,
 * then a capstone quiz node. Blocks without authored content are shown as "Coming soon",
 * never as available.
 */
import type { ModuleCategory } from '@/shared/contracts/catalog';
import type { ArtId } from '../art/Illustration';
import type { Difficulty } from '../types';
import { RULES_BLOCK_ID, RULES_DRILLS, RULES_QUIZ_ID, type Drill } from './rulesBasics';
import { managerDrills, pressingDrills, setPieceDrills } from './blocks/advanced';
import { scoresDrills, spaceDrills } from './blocks/beginner';
import { bioDrills, legendsDrills, transferDrills } from './blocks/intermediate';

const drillNodes = (list: Drill[]): PathNodeRef[] => list.map((d) => ({ kind: 'drill', id: d.id }));
const lesson = (id: string): PathNodeRef => ({ kind: 'lesson', id });

export type PathNodeRef = { kind: 'drill'; id: string } | { kind: 'lesson'; id: string };

export type BlockTone = 'brand' | 'inverse' | 'deep' | 'outline';

export interface PathBlock {
  id: string;
  title: string;
  module: ModuleCategory;
  tone: BlockTone;
  /** Illustration for the banner thumbnail and guide. */
  art: ArtId;
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
        art: 'goal-line',
        title: 'Rules basics',
        module: 'rules',
        tone: 'brand',
        mandatory: true,
        guide: [
          'Ten short lessons on the rules every fan needs: goals, restarts, offside, fouls and cards.',
          'Finish all ten, then pass the 10-question quiz with at least 7 correct answers.',
          'Newcomers unlock the rest of the Beginner level by passing this block. Intermediate and Advanced are always open.',
        ],
        nodes: RULES_DRILLS.map((d) => ({ kind: 'drill' as const, id: d.id })),
        quizId: RULES_QUIZ_ID,
      },
      {
        id: 'beginner-scores',
        art: 'bracket',
        title: 'Scores and tournaments',
        module: 'tournaments',
        tone: 'inverse',
        guide: ['Points, tables, knockouts and shootouts, plus how aggregate scores and a World Cup final work.'],
        nodes: [
          ...drillNodes(scoresDrills.slice(0, 3)),
          lesson('rules-aggregate-score'),
          ...drillNodes(scoresDrills.slice(3)),
          lesson('tournaments-2015-world-cup-final'),
        ],
      },
      {
        id: 'beginner-space',
        art: 'lanes',
        title: 'Space on the field',
        module: 'tactics',
        tone: 'deep',
        guide: ['Why positions matter more than chasing the ball. Move a defender and see what changes.'],
        nodes: [...drillNodes(spaceDrills.slice(0, 3)), lesson('tactics-passing-lanes'), ...drillNodes(spaceDrills.slice(3))],
      },
      { id: 'beginner-skills',
        art: 'skills', title: 'Techniques and skills', module: 'techniques', tone: 'outline', guide: ['First touch, passing and shooting technique.'], nodes: [] },
      { id: 'beginner-plans',
        art: 'board', title: 'Game plans', module: 'strategy', tone: 'outline', guide: ['How coaches set up a team to win.'], nodes: [] },
    ],
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    blocks: [
      {
        id: 'intermediate-legends',
        art: 'two-goals-1986',
        title: 'Legends and controversy',
        module: 'history',
        tone: 'brand',
        guide: ['Matches the sport still argues about, and why.'],
        nodes: [...drillNodes(legendsDrills.slice(0, 4)), lesson('history-maradona-1986'), ...drillNodes(legendsDrills.slice(4))],
      },
      {
        id: 'intermediate-transfers',
        art: 'transfer',
        title: 'Transfers',
        module: 'transfers',
        tone: 'inverse',
        guide: ['How moves between clubs and leagues shape careers.'],
        nodes: [...drillNodes(transferDrills.slice(0, 1)), lesson('transfers-messi-to-miami'), ...drillNodes(transferDrills.slice(1))],
      },
      {
        id: 'intermediate-bios',
        art: 'jersey',
        title: 'Player biographies',
        module: 'biographies',
        tone: 'deep',
        guide: ['The people behind the legends.'],
        nodes: drillNodes(bioDrills),
      },
      { id: 'intermediate-formats',
        art: 'bracket', title: 'Tournament formats', module: 'tournaments', tone: 'outline', guide: ['Groups, knockouts and tiebreakers.'], nodes: [] },
      { id: 'intermediate-skills',
        art: 'skills', title: 'Skills in context', module: 'techniques', tone: 'outline', guide: ['When and why players choose a technique.'], nodes: [] },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    blocks: [
      {
        id: 'advanced-set-pieces',
        art: 'quick-corner',
        title: 'Set pieces',
        module: 'tactics',
        tone: 'brand',
        guide: ['Restarts as weapons: timing, routines and catching a defense unset.'],
        nodes: [...drillNodes(setPieceDrills.slice(0, 3)), lesson('tactics-quick-corner'), ...drillNodes(setPieceDrills.slice(3))],
      },
      {
        id: 'advanced-pressing',
        art: 'lanes',
        title: 'Pressing and shape',
        module: 'tactics',
        tone: 'inverse',
        guide: ['Defending as a unit, and the shapes that attack it.'],
        nodes: drillNodes(pressingDrills),
      },
      {
        id: 'advanced-managers',
        art: 'board',
        title: 'Managers and game plans',
        module: 'strategy',
        tone: 'deep',
        guide: ['In-game decisions, substitutions and preparing for a match.'],
        nodes: drillNodes(managerDrills),
      },
      { id: 'advanced-club-history',
        art: 'trophy', title: 'Club history', module: 'history', tone: 'outline', guide: ['How great clubs were built.'], nodes: [] },
      { id: 'advanced-market',
        art: 'transfer', title: 'The transfer market', module: 'transfers', tone: 'outline', guide: ['Fees, contracts and windows.'], nodes: [] },
    ],
  },
];

export const levelOf = (id: string) => LEVELS.find((l) => l.id === id);

/** Every drill in the course, with the block it belongs to. Rules basics keeps its own ordering and quiz. */
export const ALL_DRILLS: Drill[] = [...RULES_DRILLS, ...scoresDrills, ...spaceDrills, ...legendsDrills, ...transferDrills, ...bioDrills, ...setPieceDrills, ...pressingDrills, ...managerDrills];

export function findDrill(id: string) {
  for (const level of LEVELS) {
    for (const block of level.blocks) {
      if (block.nodes.some((n) => n.kind === 'drill' && n.id === id)) {
        const drills = block.nodes.flatMap((n) => (n.kind === 'drill' ? [ALL_DRILLS.find((d) => d.id === n.id)!] : []));
        return { drill: drills.find((d) => d.id === id)!, block, level, drills };
      }
    }
  }
  return undefined;
}

/** Block IDs that hold drills (their progress record doubles as the resume target). */
export const drillBlock = (id: string) => LEVELS.flatMap((l) => l.blocks).find((b) => b.id === id && b.nodes.some((n) => n.kind === 'drill'));
