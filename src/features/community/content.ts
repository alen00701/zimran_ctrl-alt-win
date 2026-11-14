/**
 * Community content catalog. The core IDs and facts for the watch party come from the frozen
 * shared fixtures (@/shared/fixtures/ids); the play day is a Community-local event.
 *
 * Everything here is a demo: the group, the bar and the field are fictional. The app makes no
 * claim of a club, league, venue or media partnership.
 */
import { DEMO_EVENT, DEMO_GROUP, SEED_POSTS } from '@/shared/fixtures/ids';
import venueBarUrl from './assets/venue-bar.jpg';
import fieldPlayUrl from './assets/field-play.jpg';

export interface CommunityGroup {
  id: string;
  name: string;
  city: string;
  tagline: string;
}

export interface Coords {
  lat: number;
  lon: number;
}

/** Where the demo looks for events until the visitor shares a location. */
export const DEMO_LOCATION: { label: string; coords: Coords } = {
  label: 'Orlando, FL',
  coords: { lat: 28.5384, lon: -81.3789 },
};

export type EventKind = 'watch-party' | 'play-day';

/** Section copy per kind, shared by the main page and the event page. */
export const EVENT_KINDS: Record<EventKind, { icon: string; label: string; shortLabel: string; startLabel: string }> = {
  'watch-party': { icon: '📺', label: 'Matchday', shortLabel: 'Matchday', startLabel: 'Doors open' },
  'play-day': { icon: '⚽', label: 'Play day on field', shortLabel: 'Play day', startLabel: 'Starts' },
};

interface EventBase {
  id: string;
  kind: EventKind;
  title: string;
  /** Start at the venue (ISO with offset). For watch parties: doors open, not official kickoff. */
  startsAt: string;
  /** IANA zone of the venue; the "local time" shown on the page. */
  timeZone: string;
  venue: {
    name: string;
    area: string;
    city: string;
    /** Approximate point for the fictional venue; used only for "near you" distance. */
    coords: Coords;
    /** True when the venue pays for placement in the business concept. */
    sponsored: boolean;
    fictional: true;
  };
  /** Sample photo standing in for the fictional venue. */
  photo: { src: string; width: number; height: number; alt: string };
  priceLabel: string;
  organizer: { name: string; groupId: string };
  agenda: Array<{ when: string; what: string }>;
  isDemo: true;
}

export interface WatchPartyEvent extends EventBase {
  kind: 'watch-party';
  match: {
    id: string;
    home: string;
    away: string;
    competition: string;
    /** Where the match itself is announced. Kickoff time is not restated here. */
    source: { publisher: string; url: string };
  };
  /** Feed story that previews the match. */
  previewPostId: string;
}

export interface PlayDayEvent extends EventBase {
  kind: 'play-day';
  game: { format: string; level: string; spots: number; bring: string[] };
}

export type CommunityEvent = WatchPartyEvent | PlayDayEvent;

const previewPost = SEED_POSTS.find((p) => p.id === 'orlando-city-fc-cincinnati-2026-11-19-preview')!;

export const GROUP: CommunityGroup = {
  id: DEMO_GROUP.id,
  name: DEMO_GROUP.name,
  city: 'Orlando, FL',
  tagline: 'Watch together. Play together. Ask anything.',
};

/** Community-local ID (not a shared fixture). Account shows its title only if it reads Community content. */
export const PLAY_DAY_ID = 'play-day-orlando-pickup-2026-11-21';

export const WATCH_PARTY: WatchPartyEvent = {
  id: DEMO_EVENT.id,
  kind: 'watch-party',
  title: DEMO_EVENT.title,
  startsAt: DEMO_EVENT.startsAt,
  timeZone: DEMO_EVENT.timeZone,
  match: {
    id: DEMO_EVENT.matchId,
    home: 'Orlando City',
    away: 'FC Cincinnati',
    competition: '2026 MLS Cup Playoffs',
    source: { publisher: 'MLSsoccer.com', url: previewPost.sourceUrl },
  },
  venue: {
    name: DEMO_EVENT.venueName,
    area: 'Downtown',
    city: DEMO_EVENT.city,
    coords: DEMO_LOCATION.coords,
    sponsored: true,
    fictional: true,
  },
  photo: {
    src: venueBarUrl,
    width: 547,
    height: 308,
    alt: 'Sample photo: a sports bar with a big screen showing a match, tables and tall stools',
  },
  priceLabel: 'Free',
  organizer: { name: DEMO_GROUP.name, groupId: DEMO_EVENT.groupId },
  agenda: [
    { when: '7:00 PM', what: 'Doors open. Find the group table near the big screen.' },
    { when: 'Pregame', what: 'Coach’s one thing to watch, explained in two minutes.' },
    { when: 'Kickoff', what: 'Full match on the big screens with the sound up.' },
    { when: 'Full time', what: 'Quick player-of-the-match vote at the table.' },
  ],
  previewPostId: previewPost.id,
  isDemo: true,
};

export const PLAY_DAY: PlayDayEvent = {
  id: PLAY_DAY_ID,
  kind: 'play-day',
  title: 'Play day: 5v5 pickup at Riverside Fields',
  startsAt: '2026-11-21T10:00:00-05:00',
  timeZone: 'America/New_York',
  game: {
    format: '5v5 small-sided games, rotating teams every 10 minutes',
    level: 'All levels. Beginners welcome, no tackling.',
    spots: 20,
    bring: ['Sneakers or turf shoes (no metal studs)', 'Water bottle', 'One light and one dark shirt'],
  },
  venue: {
    name: 'Riverside Community Fields',
    area: 'College Park',
    city: 'Orlando, FL',
    coords: { lat: 28.5655, lon: -81.3912 },
    sponsored: false,
    fictional: true,
  },
  photo: {
    src: fieldPlayUrl,
    width: 1200,
    height: 675,
    alt: 'Sample photo: adults playing a pickup soccer game on an artificial turf field',
  },
  priceLabel: 'Free',
  organizer: { name: DEMO_GROUP.name, groupId: DEMO_GROUP.id },
  agenda: [
    { when: '9:45 AM', what: 'Check in at the north gate and grab a bib.' },
    { when: '10:00 AM', what: 'Easy warm-up together.' },
    { when: '10:15 AM', what: 'Small-sided games. Everyone plays, teams rotate.' },
    { when: '11:45 AM', what: 'Cool-down and group photo.' },
  ],
  isDemo: true,
};

export const EVENTS: CommunityEvent[] = [WATCH_PARTY, PLAY_DAY];

export const findEvent = (id: string) => EVENTS.find((e) => e.id === id);
export const eventsOfKind = (kind: EventKind) => EVENTS.filter((e) => e.kind === kind);
