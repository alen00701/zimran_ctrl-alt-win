import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { GuestState } from '@/shared/contracts/types';
import { BrandAvatar } from '@/shared/brand';
import { communityActions, goingEventIds, isGoing, useGuestState } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, Button, Card, usePageTitle } from '@/shared/ui';
import { DEMO_LOCATION, EVENT_KINDS, EVENTS, findEvent, type CommunityEvent } from './content';
import { countdownLabel, eventShortDateLabel, eventTimeLabel } from './format';
import { DEMO_FRIENDS, friendsGoingLabel, initials } from './friends';
import { distanceLabel, milesBetween, useViewerLocation } from './geo';
import { LEAGUE_NAME, buildLeagueBoard, timeLeftLabel, useNow } from './leaderboard';
import { VenuePhoto } from './VenuePhoto';
import styles from './Community.module.css';


/** /community: this week's two events with an "I'm going" check, friends, and the weekly Silver League. */
export function CommunityPage() {
  const state = useGuestState();
  const viewer = useViewerLocation();
  const [params, setParams] = useSearchParams();
  const showFriends = params.get('view') === 'friends';

  const toggleFriends = () =>
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        if (showFriends) next.delete('view');
        else next.set('view', 'friends');
        return next;
      },
      { replace: true },
    );

  usePageTitle('Community');
  const now = useNow();
  const board = buildLeagueBoard(state, now);
  const going = goingEventIds(state).length;

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-label="Community">
        <div className={styles.heroBand} aria-hidden="true" />
        <div className={styles.heroTop}>
          <BrandAvatar size={124} state="speaking" decorative className={styles.heroAvatar} />
          <div className={styles.heroText}>
            <p className={styles.heroEyebrow}>Matchdays · play days · friends</p>
            <h1 className={styles.heroTitle}>Community</h1>
            <p className={styles.heroSub}>Watch and play near you</p>
            <Button variant="inverse" onClick={toggleFriends} aria-expanded={showFriends} aria-controls="friends-panel">
              <span aria-hidden="true">👥</span> Friends <span className={styles.countPill}>{DEMO_FRIENDS.length}</span>
            </Button>
          </div>
        </div>
        <ul className={styles.tiles}>
          <li className={styles.tile} data-tone="green"><span className={styles.tileIcon}>🎟️</span><strong>{going}</strong><span>You’re going</span></li>
          <li className={styles.tile} data-tone="purple"><span className={styles.tileIcon}>👥</span><strong>{DEMO_FRIENDS.length}</strong><span>Friends</span></li>
          <li className={styles.tile} data-tone="amber"><span className={styles.tileIcon}>🏆</span><strong>#{board.you.rank}</strong><span>League rank</span></li>
          <li className={styles.tile} data-tone="red"><span className={styles.tileIcon}>⏱</span><strong>{timeLeftLabel(board.endsAt, now)}</strong><span>Week ends</span></li>
        </ul>
      </section>
      <div className={styles.stack}>
        {showFriends && <FriendsPanel state={state} onClose={toggleFriends} />}

        <WeekList state={state} viewer={viewer} />

        <LeagueCard board={board} now={now} />
      </div>
    </div>
  );
}

function FriendsPanel({ state, onClose }: { state: GuestState; onClose: () => void }) {
  const [copy, setCopy] = useState<'idle' | 'copied' | 'failed'>('idle');
  const inviteUrl = typeof window === 'undefined' ? routes.community() : new URL(routes.community(), window.location.origin).href;
  const invite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopy('copied');
    } catch {
      setCopy('failed');
    }
  };
  return (
    <section id="friends-panel" aria-labelledby="friends-title">
      <Card className={styles.friends} data-tone="green">
        <div className={styles.friendsHead}>
          <h2 id="friends-title" className={styles.boardTitle}>
            <span aria-hidden="true">👥 </span>Friends
          </h2>
          <BrandAvatar size={56} state="speaking" decorative className={styles.headAvatar} />
          <Badge variant="demo">Demo friends</Badge>
        </div>
        <ul className={styles.friendList}>
          {DEMO_FRIENDS.map((f) => (
            <li key={f.id} className={styles.friendRow}>
              <span className={styles.msgAvatar} aria-hidden="true">{initials(f.name)}</span>
              <span className={styles.friendText}>
                <strong>{f.name}</strong>
                <span className={styles.friendPlans}>
                  {f.going.map((id) => {
                    const e = findEvent(id);
                    if (!e) return null;
                    const k = EVENT_KINDS[e.kind];
                    const youToo = isGoing(state, id);
                    return (
                      <Link key={id} to={routes.event(id)} className={styles.planChip} data-you={youToo || undefined}>
                        <span aria-hidden="true">{k.icon}</span> {k.shortLabel} · {eventShortDateLabel(e.startsAt, e.timeZone)}
                        {youToo && (
                          <>
                            <span aria-hidden="true"> ✓</span>
                            <span className="visually-hidden"> (you’re going too)</span>
                          </>
                        )}
                      </Link>
                    );
                  })}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <Button onClick={invite}>Invite a friend</Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <span role="status" className={styles.muted}>
            {copy === 'copied' ? 'Link copied. Send it to a friend!' : copy === 'failed' ? `Copy this link: ${inviteUrl}` : ''}
          </span>
        </div>
      </Card>
    </section>
  );
}

function LocationLine({ event, viewer }: { event: CommunityEvent; viewer: ReturnType<typeof useViewerLocation> }) {
  const place = `${event.venue.name}, ${event.venue.area}`;
  const text =
    viewer.status === 'ready'
      ? `${distanceLabel(milesBetween(viewer.coords, event.venue.coords))} · ${place}`
      : viewer.status === 'locating'
        ? `Finding you… · ${place}`
        : viewer.status === 'unavailable'
          ? `${place} · couldn’t get your location`
          : place;
  return (
    <p className={styles.cardLine}>
      <span aria-hidden="true">📍 </span>
      {text}
      {viewer.status !== 'ready' && viewer.status !== 'locating' && (
        <>
          {' · '}
          <button type="button" className={styles.inlineButton} onClick={viewer.request}>
            {viewer.status === 'unavailable' ? 'Try again' : 'Use my location'}
          </button>
        </>
      )}
    </p>
  );
}

/** This week's events as a checklist. Only events with the box checked show up in Account. */
function WeekList({ state, viewer }: { state: GuestState; viewer: ReturnType<typeof useViewerLocation> }) {
  const events = [...EVENTS].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const checked = events.filter((e) => isGoing(state, e.id)).length;
  return (
    <section aria-labelledby="week-title" className={styles.week}>
      <header className={styles.weekHead}>
        <div>
          <h2 id="week-title" className={styles.weekTitle}>This week</h2>
          <p className={styles.muted}>{events.length} events near {DEMO_LOCATION.label}. Check the ones you’re going to.</p>
        </div>
        <BrandAvatar size={72} state={checked ? 'celebrate' : 'speaking'} decorative className={styles.weekAvatar} />
      </header>
      <ul className={styles.weekList}>
        {events.map((e) => <EventRow key={e.id} event={e} going={isGoing(state, e.id)} viewer={viewer} />)}
      </ul>
      <p className={styles.weekNote} role="status">
        {checked === 0 ? 'Nothing checked yet. Checked events appear in your Account.' : `${checked} of ${events.length} checked. `}
        {checked > 0 && <Link to={routes.account()}>See them in Account →</Link>}
      </p>
    </section>
  );
}

function EventRow({ event, going, viewer }: { event: CommunityEvent; going: boolean; viewer: ReturnType<typeof useViewerLocation> }) {
  const kind = EVENT_KINDS[event.kind];
  const countdown = countdownLabel(event.startsAt, event.timeZone);
  const friends = friendsGoingLabel(event.id);
  const to = routes.event(event.id);
  const boxId = `going-${event.id}`;
  return (
    <li className={styles.eventRow} data-going={going || undefined} data-tone={event.kind === 'play-day' ? 'green' : 'purple'}>
      <Link to={to} className={styles.rowMedia} tabIndex={-1} aria-hidden="true">
        <VenuePhoto photo={event.photo} />
      </Link>
      <div className={styles.rowBody}>
        <div className={styles.cardTop}>
          <p className={styles.kicker}><span aria-hidden="true">{kind.icon}</span> {kind.label}</p>
          <span className={styles.badges}>
            <Badge variant="demo">Demo event</Badge>
            {event.venue.sponsored && <Badge variant="sponsored">Sponsored venue</Badge>}
          </span>
        </div>
        <h3 className={styles.rowTitle}><Link to={to}>{event.title}</Link></h3>
        <p className={styles.cardLine}>
          <span aria-hidden="true">🗓 </span>
          {countdown ? <strong>{countdown}</strong> : null}{countdown ? ' · ' : ''}
          {eventShortDateLabel(event.startsAt, event.timeZone)} · {eventTimeLabel(event.startsAt, event.timeZone)} · <strong>{event.priceLabel}</strong>
        </p>
        <LocationLine event={event} viewer={viewer} />
        {friends && <p className={styles.cardLine}><span aria-hidden="true">👥 </span>{friends}</p>}
        <div className={styles.rowFoot}>
          <label className={styles.goingBox} htmlFor={boxId}>
            <input
              id={boxId}
              type="checkbox"
              checked={going}
              onChange={(e) => (e.target.checked ? communityActions.rsvp(event.id) : communityActions.cancelRsvp(event.id))}
            />
            <span className={styles.goingMark} aria-hidden="true">✓</span>
            <span className={styles.goingText}>{going ? 'I’m going' : 'Going?'}</span>
          </label>
          <Link to={to} className={styles.detailsLink}>Details</Link>
        </div>
      </div>
    </li>
  );
}

/** Top three get an icon; everyone else shows a plain rank number. */
const MEDALS = [
  { icon: '🏆', label: '1st place' },
  { icon: '🥈', label: '2nd place' },
  { icon: '🥉', label: '3rd place' },
] as const;
const medal = (rank: number) => MEDALS[rank - 1];

function LeagueCard({ board, now }: { board: ReturnType<typeof buildLeagueBoard>; now: Date }) {
  return (
    <section aria-labelledby="league-title">
      <Card className={styles.board} data-tone="amber">
        <div className={styles.boardHead}>
          <h2 id="league-title" className={styles.boardTitle}>
            <span aria-hidden="true">🥈 </span>
            {LEAGUE_NAME}
          </h2>
          <BrandAvatar size={56} state="celebrate" decorative className={styles.headAvatar} />
          <span className={styles.timer}>
            <span aria-hidden="true">⏱</span>
            <span className="visually-hidden">Week ends in </span>
            <time dateTime={board.endsAt.toISOString()}>{timeLeftLabel(board.endsAt, now)}</time>
          </span>
        </div>
        <p className={styles.boardRule}>
          This week’s points from Learn lessons only. Matchdays and RSVPs don’t earn points.
        </p>
        <ol className={styles.boardList}>
          {board.rows.map((r) => {
            const m = medal(r.rank);
            return (
              <li key={r.id} className={styles.boardRow} data-you={r.isYou || undefined} data-place={r.rank <= 3 ? r.rank : undefined}>
                <span className={styles.rank}>
                  {m ? <span role="img" aria-label={m.label}>{m.icon}</span> : r.rank}
                </span>
                <span className={styles.player}>
                  {r.name}
                  {r.isDemo && <Badge variant="demo">Demo player</Badge>}
                </span>
                <span className={styles.points}>{r.points} pts</span>
              </li>
            );
          })}
        </ol>
        <p className={styles.boardFoot}>
          You’re #{board.you.rank} with {board.yourPoints} pts this week.{' '}
          <Link to={routes.learn()}>Earn points in Learn →</Link>
        </p>
      </Card>
    </section>
  );
}
