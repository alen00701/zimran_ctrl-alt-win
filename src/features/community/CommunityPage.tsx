import { Link } from 'react-router';
import type { GuestState } from '@/shared/contracts/types';
import { communityActions, isGoing, isMember, useGuestState } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, Button, ButtonLink, Card, PageHeader } from '@/shared/ui';
import { DEMO_LOCATION, EVENTS, GROUP, type CommunityEvent } from './content';
import { countdownLabel, eventShortDateLabel, eventTimeLabel } from './format';
import { distanceLabel, milesBetween, sortByDistance, useViewerLocation } from './geo';
import { buildGroupBoard } from './leaderboard';
import { VenuePicture } from './VenuePicture';
import styles from './Community.module.css';

/** /community: the nearest matchday event first, then the group with its leaderboard. */
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

        <GroupCard state={state} />
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
        <VenuePicture venueName={event.venue.name} />
        <span className={styles.mediaNote}>Illustration</span>
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

function GroupCard({ state }: { state: GuestState }) {
  const member = isMember(state, GROUP.id);
  const board = buildGroupBoard(state, GROUP.id);
  return (
    <section id={`group-${GROUP.id}`} aria-labelledby="group-title">
      <Card className={styles.group}>
        <div className={styles.groupHead}>
          <div className={styles.groupText}>
            <span className={styles.badges}>
              <Badge variant="demo">Demo group</Badge>
              {member && <Badge variant="success">Member</Badge>}
            </span>
            <h2 id="group-title" className={styles.groupName}>{GROUP.name}</h2>
            <p className={styles.muted}>{GROUP.city} · {GROUP.tagline}</p>
          </div>
          {member ? (
            <Button variant="secondary" onClick={() => communityActions.leaveGroup(GROUP.id)}>Leave group</Button>
          ) : (
            <Button onClick={() => communityActions.joinGroup(GROUP.id)}>Join group</Button>
          )}
        </div>

        <div className={styles.board}>
          <div className={styles.boardHead}>
            <h3 className={styles.boardTitle}>Group leaderboard</h3>
            <span className={styles.boardNote}>Course points</span>
          </div>
          <ol className={styles.boardList}>
            {board.rows.map((r) => (
              <li key={r.id} className={styles.boardRow} data-you={r.isYou || undefined}>
                <span className={styles.rank}>{r.rank}</span>
                <span className={styles.player}>
                  {r.name}
                  {r.isDemo && <Badge variant="demo">Demo player</Badge>}
                </span>
                <span className={styles.points}>{r.points} pts</span>
              </li>
            ))}
          </ol>
          <p className={styles.boardFoot} role="status">
            {board.you
              ? `You’re #${board.you.rank} with ${board.yourPoints} pts from Learn lessons. `
              : `You have ${board.yourPoints} pts from Learn lessons. Join the group to get on the board. `}
            <Link to={routes.learn()}>Earn points in Learn →</Link>
          </p>
        </div>
      </Card>
    </section>
  );
}
