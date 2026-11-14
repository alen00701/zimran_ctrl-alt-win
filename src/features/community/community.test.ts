import { beforeEach, describe, expect, it } from 'vitest';
import { DEMO_EVENT, DEMO_GROUP, SEED_POSTS } from '@/shared/fixtures/ids';
import { routes } from '@/shared/routes';
import { communityActions, getGuestState, goingEventIds, isGoing, isMember } from '@/shared/state';
import { __setBackendForTests } from '@/shared/state/storage';
import { EVENTS, GROUP, findEvent } from './content';
import { countdownLabel, eventDateLabel, eventDateTile, eventTimeLabel, viewerTimeLabel } from './format';

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
    expect(eventDateTile(startsAt, timeZone)).toEqual({ month: 'NOV', day: '19', weekday: 'THU' });
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
