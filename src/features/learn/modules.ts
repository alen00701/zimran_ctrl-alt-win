import { MODULE_CATEGORIES, type ModuleCategory } from '@/shared/contracts/catalog';

/** Display copy for each module category. A category with no playable lesson shows "Coming soon". */
export const MODULE_INFO: Record<ModuleCategory, { label: string; blurb: string }> = {
  rules: { label: 'Rules', blurb: 'How the game is decided' },
  tactics: { label: 'Tactics', blurb: 'Shape, space and decisions' },
  strategy: { label: 'Strategy', blurb: 'Game plans and management' },
  techniques: { label: 'Techniques and skills', blurb: 'The craft on the ball' },
  history: { label: 'History', blurb: 'Moments that shaped the game' },
  tournaments: { label: 'Tournaments', blurb: 'Formats, finals and drama' },
  biographies: { label: 'Biographies', blurb: 'The people behind the legends' },
  transfers: { label: 'Transfers', blurb: 'Moves that moved the sport' },
};

export const MODULE_ORDER: readonly ModuleCategory[] = MODULE_CATEGORIES;
