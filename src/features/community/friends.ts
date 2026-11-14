/**
 * Demo friends. Illustrative people (the shared "Demo players"), never real users.
 * Friends' plans are fixed sample data; only the guest's own RSVPs are real state.
 */
import { DEMO_EVENT } from '@/shared/fixtures/ids';
import { PLAY_DAY_ID } from './content';

export interface DemoFriend {
  id: string;
  name: string;
  /** Event IDs this friend is going to. */
  going: string[];
}

export const DEMO_FRIENDS: DemoFriend[] = [
  { id: 'demo-maya', name: 'Maya R.', going: [DEMO_EVENT.id, PLAY_DAY_ID] },
  { id: 'demo-jordan', name: 'Jordan T.', going: [DEMO_EVENT.id] },
  { id: 'demo-sam', name: 'Sam K.', going: [PLAY_DAY_ID] },
  { id: 'demo-alex', name: 'Alex P.', going: [DEMO_EVENT.id] },
];

export const friendsGoingTo = (eventId: string) => DEMO_FRIENDS.filter((f) => f.going.includes(eventId));

/** "Maya R. is going", "Maya R. and Jordan T. are going", "Maya R. and 2 friends are going". */
export function friendsGoingLabel(eventId: string): string | null {
  const names = friendsGoingTo(eventId).map((f) => f.name);
  if (names.length === 0) return null;
  if (names.length === 1) return `${names[0]} is going`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are going`;
  return `${names[0]} and ${names.length - 1} friends are going`;
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
