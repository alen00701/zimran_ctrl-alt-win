/**
 * Community content catalog. The core IDs and facts come from the frozen shared fixtures
 * (@/shared/fixtures/ids); this file adds the page copy that Community owns.
 *
 * Everything here is a demo: the group and the venue are fictional. The app makes no claim
 * of a club, league, venue or media partnership.
 */
import { DEMO_EVENT, DEMO_GROUP, SEED_POSTS } from '@/shared/fixtures/ids';

export interface CommunityGroup {
  id: string;
  name: string;
  city: string;
  tagline: string;
  eventIds: string[];
}

export interface Coords {
  lat: number;
  lon: number;
}

/** Where the demo looks for matchdays until the visitor shares a location. */
export const DEMO_LOCATION: { label: string; coords: Coords } = {
  label: 'Orlando, FL',
  coords: { lat: 28.5384, lon: -81.3789 },
};

export interface CommunityEvent {
  id: string;
  title: string;
  /** Doors-open time at the venue (ISO with offset). Not an official kickoff time. */
  startsAt: string;
  /** IANA zone of the venue; the "local time" shown on the page. */
  timeZone: string;
  match: {
    id: string;
    home: string;
    away: string;
    competition: string;
    /** Where the match itself is announced. Kickoff time is not restated here. */
    source: { publisher: string; url: string };
  };
  venue: {
    name: string;
    area: string;
    city: string;
    /** Approximate (city-center) point for the fictional venue; used only for "near you" distance. */
    coords: Coords;
    /** The venue pays for placement in the business concept. */
    sponsored: true;
    fictional: true;
  };
  priceLabel: string;
  organizer: { name: string; groupId: string };
  agenda: Array<{ when: string; what: string }>;
  /** Feed story that previews the match. */
  previewPostId: string;
  isDemo: true;
}

const previewPost = SEED_POSTS.find((p) => p.id === 'orlando-city-fc-cincinnati-2026-11-19-preview')!;

export const GROUP: CommunityGroup = {
  id: DEMO_GROUP.id,
  name: DEMO_GROUP.name,
  city: 'Orlando, FL',
  tagline: 'Watch together. Ask anything.',
  eventIds: [DEMO_EVENT.id],
};

export const EVENTS: CommunityEvent[] = [
  {
    id: DEMO_EVENT.id,
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
  },
];

export const findEvent = (id: string) => EVENTS.find((e) => e.id === id);
