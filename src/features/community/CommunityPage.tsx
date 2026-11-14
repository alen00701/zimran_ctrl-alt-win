import { Link } from 'react-router';
import { communityActions, isGoing, isMember, useGuestState } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, Button, Card, PageHeader } from '@/shared/ui';
import { EVENTS, GROUP, type CommunityEvent } from './content';
import { countdownLabel, eventDateTile, eventTimeLabel } from './format';
import styles from './Community.module.css';

/** /community: the demo group (join/leave) and its upcoming matchday events. */
export function CommunityPage() {
  const state = useGuestState();
  const member = isMember(state, GROUP.id);
  const events = EVENTS.filter((e) => GROUP.eventIds.includes(e.id));

  return (
    <>
      <PageHeader title="Community" subtitle="Find your people for matchday." />
      <div className={styles.stack}>
        <section id={`group-${GROUP.id}`} aria-labelledby="group-title" className={styles.section}>
          <Card variant="brand" className={styles.groupHero}>
            <div className={styles.badges}>
              <Badge variant="inverse">Demo group</Badge>
              {member && <Badge variant="success">Member</Badge>}
            </div>
            <h2 id="group-title" className={styles.groupName}>{GROUP.name}</h2>
            <p className={styles.groupMeta}>{GROUP.city} · {GROUP.tagline}</p>
            <p className={styles.groupText}>{GROUP.description}</p>
            <div className={styles.actions}>
              {member ? (
                <Button variant="inverse" onClick={() => communityActions.leaveGroup(GROUP.id)}>
                  Leave group
                </Button>
              ) : (
                <Button variant="inverse" onClick={() => communityActions.joinGroup(GROUP.id)}>
                  Join group
                </Button>
              )}
            </div>
            <p className={styles.status} role="status">
              {member ? 'You’re in. This group now shows on your Account.' : ''}
            </p>
          </Card>

          <div className={styles.twoUp}>
            <Card>
              <h3 className={styles.h3}>Why join</h3>
              <ul className={styles.checks}>
                {GROUP.perks.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </Card>
            <Card>
              <h3 className={styles.h3}>House rules</h3>
              <ul className={styles.checks}>
                {GROUP.houseRules.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </Card>
          </div>
        </section>

        <section aria-labelledby="events-title" className={styles.section}>
          <h2 id="events-title" className={styles.h2}>Upcoming watch parties</h2>
          <ul className={styles.list}>
            {events.map((e) => (
              <li key={e.id}>
                <EventCard event={e} going={isGoing(state, e.id)} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function EventCard({ event, going }: { event: CommunityEvent; going: boolean }) {
  const tile = eventDateTile(event.startsAt, event.timeZone);
  const countdown = countdownLabel(event.startsAt, event.timeZone);
  return (
    <Link to={routes.event(event.id)} className={styles.eventCard}>
      <span className={styles.dateTile} aria-hidden="true">
        <span className={styles.tileMonth}>{tile.month}</span>
        <span className={styles.tileDay}>{tile.day}</span>
        <span className={styles.tileWeekday}>{tile.weekday}</span>
      </span>
      <span className={styles.eventBody}>
        <span className={styles.badges}>
          <Badge variant="demo">Demo event</Badge>
          <Badge variant="sponsored">Sponsored venue</Badge>
          {going && <Badge variant="success">You’re going</Badge>}
        </span>
        <span className={styles.eventTitle}>{event.title}</span>
        <span className={styles.eventMeta}>
          {countdown ? `${countdown} · ` : ''}
          {eventTimeLabel(event.startsAt, event.timeZone)} · {event.venue.name}, {event.venue.city} · {event.priceLabel}
        </span>
      </span>
      <span className={styles.chevron} aria-hidden="true">›</span>
    </Link>
  );
}
