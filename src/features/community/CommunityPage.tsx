import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { GuestState } from '@/shared/contracts/types';
import { communityActions, isGoing, useGuestState } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, Button, ButtonLink, Card, PageHeader } from '@/shared/ui';
import { DEMO_LOCATION, EVENT_KINDS, eventsOfKind, findEvent, type CommunityEvent, type EventKind } from './content';
import { countdownLabel, eventShortDateLabel, eventTimeLabel } from './format';
import { DEMO_FRIENDS, friendsGoingLabel, initials } from './friends';
import { distanceLabel, milesBetween, sortByDistance, useViewerLocation, } from './geo';
import { LEAGUE_NAME, buildLeagueBoard, timeLeftLabel, useNow } from './leaderboard';
import { StoreSection } from './StoreSection';
import { VenuePhoto } from './VenuePhoto';
import styles from './Community.module.css';

const SECTION_ORDER: EventKind[] = ['watch-party', 'play-day'];

/** /community: friends, the nearest matchday and play day, the weekly Silver League, then the store. */
export function CommunityPage() {
  const state = useGuestState();
  const viewer = useViewerLocation();
  const [params, setParams] = useSearchParams();
  const showFriends = params.get('view') === 'friends';
  const from = viewer.coords ?? DEMO_LOCATION.coords;

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

  return (
    <>
      <PageHeader
        title="Community"
        subtitle="Watch and play near you"
        actions={
          <Button variant="secondary" onClick={toggleFriends} aria-expanded={showFriends} aria-controls="friends-panel">
            <span aria-hidden="true">👥</span> Friends <span className={styles.countPill}>{DEMO_FRIENDS.length}</span>
          </Button>
        }
      />
      <div className={styles.stack}>
        {showFriends && <FriendsPanel state={state} onClose={toggleFriends} />}

        {SECTION_ORDER.map((kind) => {
          const [featured, ...others] = sortByDistance(eventsOfKind(kind), from);
          if (!featured) return null;
          return (
            <section key={kind} aria-labelledby={`section-${kind}`} className={styles.section}>
              <EventCard event={featured} going={isGoing(state, featured.id)} viewer={viewer} />
              {others.map((e) => (
                <Link key={e.id} to={routes.event(e.id)} className={styles.moreEvent}>
                  {e.title} · {eventShortDateLabel(e.startsAt, e.timeZone)} · {e.venue.name}
                </Link>
              ))}
            </section>
          );
        })}

        <LeagueCard state={state} />

        <StoreSection />
      </div>
    </>
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
      <Card className={styles.friends}>
        <div className={styles.friendsHead}>
          <h2 id="friends-title" className={styles.boardTitle}>
            <span aria-hidden="true">👥 </span>Friends
          </h2>
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

function EventCard({ event, going, viewer }: { event: CommunityEvent; going: boolean; viewer: ReturnType<typeof useViewerLocation> }) {
  const kind = EVENT_KINDS[event.kind];
  const countdown = countdownLabel(event.startsAt, event.timeZone);
  const friends = friendsGoingLabel(event.id);
  const to = routes.event(event.id);
  return (
    <article className={styles.featured} data-kind={event.kind}>
      <Link to={to} className={styles.featuredMedia} tabIndex={-1} aria-hidden="true">
        <VenuePhoto photo={event.photo} />
        <span className={styles.mediaNote}>Sample photo</span>
      </Link>
      <div className={styles.featuredBody}>
        <div className={styles.cardTop}>
          <h2 id={`section-${event.kind}`} className={styles.kicker}>
            <span aria-hidden="true">{kind.icon}</span> {kind.label}
          </h2>
          <span className={styles.badges}>
            <Badge variant="demo">Demo event</Badge>
            {event.venue.sponsored && <Badge variant="sponsored">Sponsored venue</Badge>}
          </span>
        </div>
        <h3 className={styles.featuredTitle}>
          <Link to={to}>{event.title}</Link>
        </h3>
        <div className={styles.cardLines}>
          <p className={styles.cardLine}>
            <span aria-hidden="true">🗓 </span>
            {countdown ? `${countdown} · ` : ''}
            {eventShortDateLabel(event.startsAt, event.timeZone)} · {eventTimeLabel(event.startsAt, event.timeZone)} ·{' '}
            <strong>{event.priceLabel}</strong>
          </p>
          <LocationLine event={event} viewer={viewer} />
          {friends && (
            <p className={styles.cardLine}>
              <span aria-hidden="true">👥 </span>
              {friends}
            </p>
          )}
        </div>
        <div className={styles.cardActions}>
          {going ? (
            <>
              <Badge variant="success">You’re going</Badge>
              <ButtonLink to={to} variant="secondary">View your RSVP</ButtonLink>
            </>
          ) : (
            <>
              <Button variant={event.kind === 'play-day' ? 'inverse' : 'primary'} onClick={() => communityActions.rsvp(event.id)}>
                I’m going
              </Button>
              <Link to={to} className={styles.detailsLink}>Details</Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

/** Top three get an icon; everyone else shows a plain rank number. */
const MEDALS = [
  { icon: '🏆', label: '1st place' },
  { icon: '🥈', label: '2nd place' },
  { icon: '🥉', label: '3rd place' },
] as const;
const medal = (rank: number) => MEDALS[rank - 1];

function LeagueCard({ state }: { state: GuestState }) {
  const now = useNow();
  const board = buildLeagueBoard(state, now);
  return (
    <section aria-labelledby="league-title">
      <Card className={styles.board}>
        <div className={styles.boardHead}>
          <h2 id="league-title" className={styles.boardTitle}>
            <span aria-hidden="true">🥈 </span>
            {LEAGUE_NAME}
          </h2>
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
              <li key={r.id} className={styles.boardRow} data-you={r.isYou || undefined}>
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
