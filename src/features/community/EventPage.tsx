import { useParams } from 'react-router';
import { DEMO_EVENTS } from '@/shared/fixtures/ids';
import { communityActions, isGoing, useGuestState } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, Button, ButtonLink, CoachPrompt, PageHeader } from '@/shared/ui';
import styles from './Community.module.css';

/** STARTER: event deep link + persistent RSVP / cancel. */
export function EventPage() {
  const { eventId = '' } = useParams();
  const state = useGuestState();
  const event = DEMO_EVENTS.find((e) => e.id === eventId);
  if (!event) {
    return (
      <div className={styles.stack}>
        <CoachPrompt headingLevel={1} state="thinking">We couldn’t find that event.</CoachPrompt>
        <ButtonLink to={routes.community()}>Back to Community</ButtonLink>
      </div>
    );
  }
  const going = isGoing(state, event.id);
  const when = new Date(event.startsAt).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: event.timeZone, timeZoneName: 'short',
  });
  return (
    <div className={styles.stack}>
      <PageHeader eyebrow={<Badge variant="demo">Demo event</Badge>} title={event.title} subtitle={`${when} · ${event.venueName}, ${event.city}`} />
      <div className={styles.row}>
        {going ? (
          <Button variant="secondary" onClick={() => communityActions.cancelRsvp(event.id)}>Cancel RSVP</Button>
        ) : (
          <Button onClick={() => communityActions.rsvp(event.id)}>I’m going</Button>
        )}
        {going && <Badge variant="success">You’re going</Badge>}
      </div>
      <ButtonLink to={routes.community()} variant="ghost">← Community</ButtonLink>
    </div>
  );
}
