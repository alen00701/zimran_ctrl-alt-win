import { Link } from 'react-router';
import type { GuestState } from '@/shared/contracts/types';
import { communityActions, isGoing, useGuestState } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, Button, ButtonLink, Card, PageHeader } from '@/shared/ui';
import { DEMO_LOCATION, EVENTS, type CommunityEvent } from './content';
import { countdownLabel, eventShortDateLabel, eventTimeLabel } from './format';
import { distanceLabel, milesBetween, sortByDistance, useViewerLocation } from './geo';
import { LEAGUE_NAME, buildLeagueBoard, timeLeftLabel, useNow } from './leaderboard';
import { VenuePhoto } from './VenuePhoto';
import styles from './Community.module.css';

/** /community: the nearest matchday event first, then the weekly Silver League. */
export function CommunityPage() {
  const state = useGuestState();
  const viewer = useViewerLocation();
  const [featured, ...others] = sortByDistance(EVENTS, viewer.coords ?? DEMO_LOCATION.coords);

  return (
    <>
      <PageHeader title="Community" subtitle="Matchday near you" />
      <div className={styles.stack}>
        <section aria-labelledby="nearby-title" className={styles.section}>
          <h2 id="nearby-title" className="visually-hidden">Nearest watch party</h2>
          <p className={styles.locationRow}>
            <span role="status">
              <span aria-hidden="true">📍 </span>
              {viewer.status === 'ready' && featured
                ? `${distanceLabel(milesBetween(viewer.coords, featured.venue.coords))} · ${featured.venue.city}`
                : viewer.status === 'locating'
                  ? 'Finding you…'
                  : viewer.status === 'unavailable'
                    ? `Couldn’t get your location. Showing ${DEMO_LOCATION.label}.`
                    : `Showing ${DEMO_LOCATION.label}`}
            </span>
            {viewer.status !== 'ready' && viewer.status !== 'locating' && (
              <button type="button" className={styles.linkButton} onClick={viewer.request}>
                {viewer.status === 'unavailable' ? 'Try again' : 'Use my location'}
              </button>
            )}
          </p>
          {featured && <FeaturedEvent event={featured} going={isGoing(state, featured.id)} />}
          {others.map((e) => (
            <Link key={e.id} to={routes.event(e.id)} className={styles.moreEvent}>
              {e.title} · {eventTimeLabel(e.startsAt, e.timeZone)} · {e.venue.name}
            </Link>
          ))}
        </section>

        <LeagueCard state={state} />
      </div>
    </>
  );
}

function FeaturedEvent({ event, going }: { event: CommunityEvent; going: boolean }) {
  const countdown = countdownLabel(event.startsAt, event.timeZone);
  const to = routes.event(event.id);
  return (
    <article className={styles.featured}>
      <Link to={to} className={styles.featuredMedia} tabIndex={-1} aria-hidden="true">
        <VenuePhoto venueName={event.venue.name} />
        <span className={styles.mediaNote}>Sample photo</span>
      </Link>
      <div className={styles.featuredBody}>
        <span className={styles.badges}>
          <Badge variant="demo">Demo event</Badge>
          <Badge variant="sponsored">Sponsored venue</Badge>
        </span>
        <h3 className={styles.featuredTitle}>
          <Link to={to}>{event.title}</Link>
        </h3>
        <p className={styles.featuredMeta}>
          {countdown ? `${countdown} · ` : ''}
          {eventShortDateLabel(event.startsAt, event.timeZone)} · {eventTimeLabel(event.startsAt, event.timeZone)} ·{' '}
          {event.venue.name} · <strong>{event.priceLabel}</strong>
        </p>
        <div className={styles.actions}>
          {going ? (
            <>
              <Badge variant="success">You’re going</Badge>
              <ButtonLink to={to} variant="secondary">View your RSVP</ButtonLink>
            </>
          ) : (
            <>
              <Button onClick={() => communityActions.rsvp(event.id)}>I’m going</Button>
              <ButtonLink to={to} variant="ghost">Details</ButtonLink>
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
