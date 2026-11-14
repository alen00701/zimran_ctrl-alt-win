/**
 * Demo store: tickets, merch and gear with an app-only price.
 * Nothing here is for sale. Partners and brands are fictional; prices are illustrative.
 * The one real match listed is the sourced Orlando City–FC Cincinnati game, shown as a demo
 * listing with no claim of a club, league or ticketing partnership.
 */
export type StoreCategory = 'tickets' | 'merch' | 'gear';

export const STORE_CATEGORIES: Array<{ id: StoreCategory; label: string; icon: string }> = [
  { id: 'tickets', label: 'Tickets', icon: '🎟️' },
  { id: 'merch', label: 'Merch', icon: '🧣' },
  { id: 'gear', label: 'Gear', icon: '⚽' },
];

export interface StoreItem {
  id: string;
  category: StoreCategory;
  icon: string;
  name: string;
  detail: string;
  /** Fictional affiliate partner that would handle checkout. */
  partner: string;
  /** Prices in US cents. */
  listPriceCents: number;
  appPriceCents: number;
  /** "from $39" for tickets. */
  fromPrice?: boolean;
}

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'tix-orlando-cincinnati-2026-11-19',
    category: 'tickets',
    icon: '🎟️',
    name: 'Orlando City vs FC Cincinnati',
    detail: 'Thu, Nov 19 · MLS Cup Playoffs · demo listing',
    partner: 'SeatSwap (demo partner)',
    listPriceCents: 4500,
    appPriceCents: 3900,
    fromPrice: true,
  },
  {
    id: 'tix-sunshine-amateur-cup-final-2026-11-29',
    category: 'tickets',
    icon: '🏆',
    name: 'Sunshine Amateur Cup final',
    detail: 'Sun, Nov 29 · local amateur final · fictional event',
    partner: 'SeatSwap (demo partner)',
    listPriceCents: 1500,
    appPriceCents: 1000,
  },
  {
    id: 'tix-orlando-college-showcase-2026-12-05',
    category: 'tickets',
    icon: '🎓',
    name: 'Central Florida College Showcase',
    detail: 'Sat, Dec 5 · doubleheader · fictional event',
    partner: 'SeatSwap (demo partner)',
    listPriceCents: 2000,
    appPriceCents: 1600,
  },
  {
    id: 'merch-rtg-scarf',
    category: 'merch',
    icon: '🧣',
    name: 'Read the Game matchday scarf',
    detail: 'Purple and black knit, one size',
    partner: 'Read the Game shop',
    listPriceCents: 2400,
    appPriceCents: 1900,
  },
  {
    id: 'merch-coach-tee',
    category: 'merch',
    icon: '👕',
    name: 'Coach tee',
    detail: 'Soft cotton, sizes S–XXL',
    partner: 'Read the Game shop',
    listPriceCents: 2800,
    appPriceCents: 2200,
  },
  {
    id: 'merch-bucket-hat',
    category: 'merch',
    icon: '🧢',
    name: 'Far Post bucket hat',
    detail: 'For sunny play days',
    partner: 'Read the Game shop',
    listPriceCents: 2200,
    appPriceCents: 1800,
  },
  {
    id: 'gear-training-ball',
    category: 'gear',
    icon: '⚽',
    name: 'Size 5 training ball',
    detail: 'Machine-stitched, turf and grass',
    partner: 'Fieldline (demo brand)',
    listPriceCents: 3500,
    appPriceCents: 2800,
  },
  {
    id: 'gear-turf-shoes',
    category: 'gear',
    icon: '👟',
    name: 'Turf shoes',
    detail: 'Rubber studs, made for 5v5',
    partner: 'Fieldline (demo brand)',
    listPriceCents: 9000,
    appPriceCents: 7200,
  },
  {
    id: 'gear-shin-guards',
    category: 'gear',
    icon: '🛡️',
    name: 'Slip-in shin guards',
    detail: 'Lightweight, adult M/L',
    partner: 'Fieldline (demo brand)',
    listPriceCents: 2500,
    appPriceCents: 2000,
  },
];

export const itemsIn = (category: StoreCategory) => STORE_ITEMS.filter((i) => i.category === category);

/** "$39", "$19.50". */
export function formatUsd(cents: number): string {
  const dollars = cents / 100;
  return `$${Number.isInteger(dollars) ? dollars : dollars.toFixed(2)}`;
}

/** Whole-percent discount of the app price, e.g. 20 for $35 → $28. */
export const appDiscountPercent = (item: StoreItem) =>
  Math.round(((item.listPriceCents - item.appPriceCents) / item.listPriceCents) * 100);
