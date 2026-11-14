import { beforeEach, describe, expect, it } from 'vitest';
import { DEMO_EVENT, DEMO_GROUP, SEED_POSTS } from '@/shared/fixtures/ids';
import { routes } from '@/shared/routes';
import { communityActions, getGuestState, goingEventIds, isGoing, isMember, scoreboardActions } from '@/shared/state';
import { __setBackendForTests } from '@/shared/state/storage';
import { DEMO_LOCATION, EVENTS, GROUP, findEvent } from './content';
import { distanceLabel, milesBetween, sortByDistance } from './geo';
import { buildGroupBoard, coursePoints } from './leaderboard';
import { countdownLabel, eventDateLabel, eventShortDateLabel, eventTimeLabel, viewerTimeLabel } from './format';

function mem() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
}

describe('community content', () => {
  it('uses the shared stable IDs that Feed and Account link to', () => {
    expect(GROUP.id).toBe(DEMO_GROUP.id);
    expect(findEvent(DEMO_EVENT.id)?.organizer.groupId).toBe(DEMO_GROUP.id);
    expect(routes.event(DEMO_EVENT.id)).toBe('/community/events/watch-party-orlando-city-fc-cincinnati-2026-11-19');
    expect(findEvent('nope')).toBeUndefined();
  });

  it('every event is a free, labeled demo at a fictional sponsored venue with a real preview post', () => {
    for (const e of EVENTS) {
      expect(e.isDemo).toBe(true);
      expect(e.priceLabel).toBe('Free');
      expect(e.venue).toMatchObject({ sponsored: true, fictional: true });
      expect(SEED_POSTS.some((p) => p.id === e.previewPostId)).toBe(true);
    }
  });
});

describe('event time labels', () => {
  const { startsAt, timeZone } = DEMO_EVENT;
  // Newer ICU (Node 20+, modern browsers) uses U+202F before AM/PM.
  const norm = (v: string | null) => (v == null ? v : v.replace(/\s/g, ' '));

  it('shows date and venue-local time', () => {
    expect(eventDateLabel(startsAt, timeZone)).toBe('Thursday, November 19, 2026');
    expect(norm(eventTimeLabel(startsAt, timeZone))).toBe('7:00 PM EST');
    expect(eventShortDateLabel(startsAt, timeZone)).toBe('Thu, Nov 19');
  });

  it('adds the viewer’s time only when it differs from the venue', () => {
    expect(viewerTimeLabel(startsAt, timeZone, 'America/New_York')).toBeNull();
    expect(norm(viewerTimeLabel(startsAt, timeZone, 'America/Los_Angeles'))).toBe('Thu, Nov 19, 4:00 PM PST');
    expect(viewerTimeLabel(startsAt, timeZone, null)).toBeNull();
  });

  it('counts calendar days in the venue zone', () => {
    expect(countdownLabel(startsAt, timeZone, new Date('2026-11-14T12:00:00-05:00'))).toBe('In 5 days');
    expect(countdownLabel(startsAt, timeZone, new Date('2026-11-18T23:30:00-05:00'))).toBe('Tomorrow');
    expect(countdownLabel(startsAt, timeZone, new Date('2026-11-19T08:00:00-05:00'))).toBe('Today');
    expect(countdownLabel(startsAt, timeZone, new Date('2026-11-20T08:00:00-05:00'))).toBeNull();
  });
});

describe('journey 4: RSVP → Account → cancel persists after reload', () => {
  let backend: ReturnType<typeof mem>;
  const reload = () => __setBackendForTests(backend); // same storage, cleared in-memory caches
  beforeEach(() => {
    backend = mem();
    __setBackendForTests(backend);
  });

  it('RSVP is visible to Account’s selector and survives reload', () => {
    communityActions.rsvp(DEMO_EVENT.id);
    reload();
    expect(goingEventIds(getGuestState())).toEqual([DEMO_EVENT.id]);
  });

  it('cancel persists after reload and can be re-RSVPed', () => {
    communityActions.rsvp(DEMO_EVENT.id);
    communityActions.cancelRsvp(DEMO_EVENT.id);
    reload();
    const s = getGuestState();
    expect(isGoing(s, DEMO_EVENT.id)).toBe(false);
    expect(s.community.rsvps[DEMO_EVENT.id]?.status).toBe('cancelled');
    expect(goingEventIds(s)).toEqual([]);
    communityActions.rsvp(DEMO_EVENT.id);
    reload();
    expect(isGoing(getGuestState(), DEMO_EVENT.id)).toBe(true);
  });

  it('join/leave group persists independently of the RSVP', () => {
    communityActions.joinGroup(DEMO_GROUP.id);
    communityActions.rsvp(DEMO_EVENT.id);
    communityActions.leaveGroup(DEMO_GROUP.id);
    reload();
    const s = getGuestState();
    expect(isMember(s, DEMO_GROUP.id)).toBe(false);
    expect(isGoing(s, DEMO_EVENT.id)).toBe(true);
  });
});

describe('near you', () => {
  const miami = { lat: 25.7617, lon: -80.1918 };

  it('measures distance in miles', () => {
    expect(milesBetween(DEMO_LOCATION.coords, DEMO_LOCATION.coords)).toBe(0);
    const d = milesBetween(DEMO_LOCATION.coords, miami);
    expect(d).toBeGreaterThan(195);
    expect(d).toBeLessThan(215);
  });

  it('labels distance for people', () => {
    expect(distanceLabel(0.4)).toBe('Less than a mile from you');
    expect(distanceLabel(12.4)).toBe('12 mi from you');
    expect(distanceLabel(6912.2)).toBe('6,912 mi from you');
  });

  it('puts the nearest venue first', () => {
    const far = { id: 'far', venue: { coords: miami } };
    const near = { id: 'near', venue: { coords: DEMO_LOCATION.coords } };
    expect(sortByDistance([far, near], DEMO_LOCATION.coords).map((e) => e.id)).toEqual(['near', 'far']);
    expect(sortByDistance([far, near], miami).map((e) => e.id)).toEqual(['far', 'near']);
  });
});

describe('group leaderboard', () => {
  const now = new Date('2026-11-14T12:00:00-05:00');
  beforeEach(() => __setBackendForTests(mem()));

  it('counts only course points, first correct answers', () => {
    scoreboardActions.recordFirstAttempt('soccer', 'learn:rules-aggregate-score:quiz', true);
    scoreboardActions.recordFirstAttempt('soccer', 'learn:rules-aggregate-score:quiz', true); // retry: nothing
    scoreboardActions.recordFirstAttempt('soccer', 'learn:tactics-quick-corner:quiz', false);
    scoreboardActions.recordFirstAttempt('soccer', 'feed:feed-quiz:1', true); // not a course point
    expect(coursePoints(getGuestState())).toBe(10);
  });

  it('lists demo players only until the guest joins', () => {
    const board = buildGroupBoard(getGuestState(), DEMO_GROUP.id, now);
    expect(board.you).toBeNull();
    expect(board.rows.every((r) => r.isDemo && !r.isYou)).toBe(true);
    expect(board.rows.map((r) => r.points)).toEqual([40, 30, 30, 20]);
    expect(board.rows.map((r) => r.rank)).toEqual([1, 2, 3, 4]);
  });

  it('ranks the guest by course points once they join', () => {
    communityActions.joinGroup(DEMO_GROUP.id);
    expect(buildGroupBoard(getGuestState(), DEMO_GROUP.id, now).you).toMatchObject({ rank: 5, points: 0, isDemo: false });

    for (const step of ['a', 'b', 'c']) scoreboardActions.recordFirstAttempt('soccer', `learn:lesson:${step}`, true);
    const board = buildGroupBoard(getGuestState(), DEMO_GROUP.id, now);
    expect(board.yourPoints).toBe(30);
    // Tied with two demo players on 30: the guest is listed first among the tie.
    expect(board.you?.rank).toBe(2);
    expect(board.rows).toHaveLength(5);

    communityActions.leaveGroup(DEMO_GROUP.id);
    expect(buildGroupBoard(getGuestState(), DEMO_GROUP.id, now).you).toBeNull();
  });
});
