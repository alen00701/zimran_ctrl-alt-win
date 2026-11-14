import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEMO_EVENT, DEMO_GROUP, SEED_POSTS } from '@/shared/fixtures/ids';
import { routes } from '@/shared/routes';
import { communityActions, getGuestState, goingEventIds, isGoing, isMember, scoreboardActions } from '@/shared/state';
import { __setBackendForTests } from '@/shared/state/storage';
import { DEMO_LOCATION, EVENTS, GROUP, PLAY_DAY, PLAY_DAY_ID, eventsOfKind, findEvent } from './content';
import { DEMO_FRIENDS, friendsGoingLabel, initials } from './friends';
import { distanceLabel, milesBetween, sortByDistance } from './geo';
import { buildLeagueBoard, coursePoints, leagueWeek, timeLeftLabel } from './leaderboard';
import { CHAT_MAX_LENGTH, CHAT_STORAGE_KEY, DEMO_CHAT, __resetChatCacheForTests, getOwnMessages, postMessage } from './chat';
import { buildDemoPlayers } from '@/shared/fixtures/demoPlayers';
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

  it('every event is a free, labeled demo at a fictional venue with a photo', () => {
    for (const e of EVENTS) {
      expect(e.isDemo).toBe(true);
      expect(e.priceLabel).toBe('Free');
      expect(e.venue.fictional).toBe(true);
      expect(e.photo.src).toBeTruthy();
      expect(e.photo.alt.length).toBeGreaterThan(20);
    }
  });

  it('has one matchday (sponsored, with a real preview post) and one play day', () => {
    const watch = eventsOfKind('watch-party');
    const play = eventsOfKind('play-day');
    expect(watch.map((e) => e.id)).toEqual([DEMO_EVENT.id]);
    expect(play.map((e) => e.id)).toEqual([PLAY_DAY_ID]);
    for (const e of watch) {
      expect(e.venue.sponsored).toBe(true);
      if (e.kind === 'watch-party') expect(SEED_POSTS.some((p) => p.id === e.previewPostId)).toBe(true);
    }
    expect(findEvent(PLAY_DAY_ID)?.organizer.groupId).toBe(DEMO_GROUP.id);
    expect(new Set(EVENTS.map((e) => e.id)).size).toBe(EVENTS.length);
  });

  it('play day is near the demo location', () => {
    expect(milesBetween(DEMO_LOCATION.coords, PLAY_DAY.venue.coords)).toBeLessThan(5);
  });
});

describe('demo friends', () => {
  it('are the shared demo players and only go to real events', () => {
    const names = new Set(buildDemoPlayers().map((p) => p.displayName));
    for (const f of DEMO_FRIENDS) {
      expect(names.has(f.name)).toBe(true);
      for (const id of f.going) expect(findEvent(id)).toBeDefined();
    }
  });

  it('summarize who is going', () => {
    expect(friendsGoingLabel(DEMO_EVENT.id)).toBe('Maya R. and 2 friends are going');
    expect(friendsGoingLabel(PLAY_DAY_ID)).toBe('Maya R. and Sam K. are going');
    expect(friendsGoingLabel('nope')).toBeNull();
    expect(initials('Maya R.')).toBe('MR');
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

describe('Silver League', () => {
  // Saturday noon local time; the league week started Monday 00:00.
  const SAT = new Date(2026, 10, 14, 12, 0, 0);
  beforeEach(() => {
    __setBackendForTests(mem());
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(SAT);
  });
  afterEach(() => vi.useRealTimers());

  it('runs Monday 00:00 to next Monday 00:00 in local time', () => {
    const { start, end } = leagueWeek(SAT);
    expect(start).toEqual(new Date(2026, 10, 9));
    expect(end).toEqual(new Date(2026, 10, 16));
    expect(leagueWeek(new Date(2026, 10, 16, 0, 0, 1)).start).toEqual(new Date(2026, 10, 16));
    expect(leagueWeek(new Date(2026, 10, 15, 23, 59)).start).toEqual(new Date(2026, 10, 9));
  });

  it('formats the countdown', () => {
    expect(timeLeftLabel(new Date(2026, 10, 16), SAT)).toBe('1d 12h 00m');
    expect(timeLeftLabel(new Date(2026, 10, 14, 15, 5), SAT)).toBe('3h 05m');
    expect(timeLeftLabel(new Date(2026, 10, 14, 12, 7, 30), SAT)).toBe('7m');
    expect(timeLeftLabel(new Date(2026, 10, 14, 11), SAT)).toBe('0m');
  });

  it('counts only this week’s Learn points, first correct answers', () => {
    scoreboardActions.recordFirstAttempt('soccer', 'learn:rules-aggregate-score:quiz', true);
    scoreboardActions.recordFirstAttempt('soccer', 'learn:rules-aggregate-score:quiz', true); // retry: nothing
    scoreboardActions.recordFirstAttempt('soccer', 'learn:tactics-quick-corner:quiz', false);
    scoreboardActions.recordFirstAttempt('soccer', 'feed:feed-quiz:1', true); // not a Learn point
    expect(coursePoints(getGuestState())).toBe(10);
    expect(buildLeagueBoard(getGuestState(), SAT).yourPoints).toBe(10);
    // Next week the league starts from zero; all-time points stay.
    expect(buildLeagueBoard(getGuestState(), new Date(2026, 10, 17)).yourPoints).toBe(0);
  });

  it('always lists the guest, ranked among demo players', () => {
    const empty = buildLeagueBoard(getGuestState(), SAT);
    expect(empty.rows).toHaveLength(5);
    expect(empty.rows.filter((r) => r.isDemo)).toHaveLength(4);
    expect(empty.you).toMatchObject({ rank: 5, points: 0, isDemo: false });
    expect(empty.rows.map((r) => r.rank)).toEqual([1, 2, 3, 4, 5]);

    for (const step of ['a', 'b', 'c']) scoreboardActions.recordFirstAttempt('soccer', `learn:lesson:${step}`, true);
    const board = buildLeagueBoard(getGuestState(), SAT);
    expect(board.yourPoints).toBe(30);
    expect(board.you.rank).toBe(1); // ties with the leader; the guest is listed first in a tie
  });
});

describe('points stay separate from matchdays', () => {
  beforeEach(() => __setBackendForTests(mem()));

  it('RSVPs and chat never change Learn points or rank', () => {
    scoreboardActions.recordFirstAttempt('soccer', 'learn:lesson:a', true);
    const before = buildLeagueBoard(getGuestState());
    communityActions.rsvp(DEMO_EVENT.id);
    postMessage(DEMO_EVENT.id, 'See you there!');
    communityActions.cancelRsvp(DEMO_EVENT.id);
    const after = buildLeagueBoard(getGuestState());
    expect(after.yourPoints).toBe(10);
    expect(after.rows).toEqual(before.rows);
  });
});

describe('matchday chat', () => {
  beforeEach(() => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    __resetChatCacheForTests();
  });

  it('ships a demo discussion from the shared demo players and the host', () => {
    const names = new Set(buildDemoPlayers().map((p) => p.displayName));
    const msgs = DEMO_CHAT[DEMO_EVENT.id] ?? [];
    expect(msgs.length).toBeGreaterThanOrEqual(5);
    for (const m of msgs) {
      if (m.role === 'fan') expect(names.has(m.author)).toBe(true);
      else expect(m).toMatchObject({ role: 'host', author: DEMO_GROUP.name });
    }
  });

  it('stores the guest’s trimmed messages per event and survives a reload', () => {
    expect(postMessage(DEMO_EVENT.id, '   ')).toBeNull();
    postMessage(DEMO_EVENT.id, '  Saving a stool for Sam  ');
    postMessage('other-event', 'elsewhere');
    __resetChatCacheForTests(); // reload
    const own = getOwnMessages(DEMO_EVENT.id);
    expect(own.map((m) => [m.author, m.role, m.text])).toEqual([['You', 'you', 'Saving a stool for Sam']]);
    expect(getOwnMessages('other-event')).toHaveLength(1);
  });

  it('caps message length', () => {
    postMessage(DEMO_EVENT.id, 'x'.repeat(CHAT_MAX_LENGTH + 50));
    expect(getOwnMessages(DEMO_EVENT.id)[0]?.text).toHaveLength(CHAT_MAX_LENGTH);
  });
});
