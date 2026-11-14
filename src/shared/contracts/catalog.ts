import type { Expertise, InterestId, SportId } from './types';

/** Onboarding step 1 — exact copy from the brief. */
export const EXPERTISE_OPTIONS: ReadonlyArray<{ id: Expertise; label: string; tag: string }> = [
  { id: 'new', label: 'I’m new here', tag: 'Beginner' },
  { id: 'familiar', label: 'I know my way around', tag: 'Regular fan' },
  { id: 'expert', label: 'Try me. I know ball.', tag: 'Expert' },
];

/** Onboarding step 2 — interests in the brief's order. `icon` is an emoji glyph (inferred). */
export const INTEREST_OPTIONS: ReadonlyArray<{ id: InterestId; label: string; icon: string }> = [
  { id: 'tactics', label: 'Tactics', icon: '♟️' },
  { id: 'strategy', label: 'Strategy', icon: '🧭' },
  { id: 'techniques', label: 'Techniques and skills', icon: '⚡' },
  { id: 'rules', label: 'Rules', icon: '📏' },
  { id: 'players', label: 'Players and biographies', icon: '🧑' },
  { id: 'transfers', label: 'Transfers', icon: '🔁' },
  { id: 'club-history', label: 'Club history', icon: '🏟️' },
  { id: 'tournaments', label: 'Tournaments', icon: '🏆' },
];

/** Learn module categories (extensible: add lessons as data under these). */
export const MODULE_CATEGORIES = [
  'rules',
  'tactics',
  'strategy',
  'techniques',
  'history',
  'tournaments',
  'biographies',
  'transfers',
] as const;
export type ModuleCategory = (typeof MODULE_CATEGORIES)[number];

export const SPORTS: ReadonlyArray<{ id: SportId | string; label: string; active: boolean }> = [
  { id: 'soccer', label: 'Soccer', active: true },
  { id: 'basketball', label: 'Basketball', active: false },
  { id: 'american-football', label: 'American football', active: false },
];

/** Product rules shared by Learn and Account. */
export const FREE_LESSON_LIMIT = 2;
export const POINTS_FOR_FIRST_CORRECT = 10;
/** Hearts on the Free plan. A wrong answer costs one; Pro is unlimited. */
export const MAX_HEARTS = 5;
export const MEMBERSHIP_PRICE_LABEL = '$7.99/month';
/** The demo edition date shown in the Feed header (America/New_York). */
export const DEMO_EDITION_DATE = '2026-11-14';
