import { Link, useParams } from 'react-router';
import { communityActions, isMember, useGuestState } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, Button, ButtonLink, Card, CoachPrompt, PageHeader, usePageTitle } from '@/shared/ui';
import { EVENT_KINDS, GROUP, findEvent, type CommunityEvent } from './content';
import { countdownLabel, eventDateLabel, eventTimeLabel, viewerTimeLabel } from './format';
import { EventChat } from './EventChat';
import { friendsGoingLabel } from './friends';
import { VenuePhoto } from './VenuePhoto';
import styles from './Community.module.css';

/** /community/events/:eventId. Works as a deep link and after a reload: RSVP lives in shared guest state. */
export function EventPage() {
  const { eventId = '' } = useParams();
  const event = findEvent(eventId);
  return event ? <EventDetails event={event} /> : <EventNotFound />;
}

function EventNotFound() {
  usePageTitle('Event not found');
  return (
    <div className={styles.stack}>
      <CoachPrompt headingLevel={1} state="thinking">We couldn’t find that event. It may have moved.</CoachPrompt>
      <ButtonLink to={routes.community()}>See upcoming events</ButtonLink>
    </div>
  );
}

function EventDetails({ event }: { event: CommunityEvent }) {
  const state = useGuestState();
  const rsvp = state.community.rsvps[event.id]?.status;
  const going = rsvp === 'going';
  const member = isMember(state, event.organizer.groupId);
  const countdown = countdownLabel(event.startsAt, event.timeZone);
  const yourTime = viewerTimeLabel(event.startsAt, event.timeZone);
  const kind = EVENT_KINDS[event.kind];
  const friends = friendsGoingLabel(event.id);

  return (
    <div className={styles.stack}>
      <Link to={routes.community()} className={styles.back}>← Community</Link>

      <PageHeader
        eyebrow={
          <span className={styles.badges}>
            <Badge variant="neutral">{kind.icon} {kind.label}</Badge>
            <Badge variant="demo">Demo event</Badge>
            {event.venue.sponsored && <Badge variant="sponsored">Sponsored venue</Badge>}
            {countdown && <Badge variant="neutral">{countdown}</Badge>}
          </span>
        }
        title={event.title}
        subtitle={`Hosted by ${event.organizer.name}`}
      />

      <figure className={styles.venueFigure}>
        <VenuePhoto photo={event.photo} />
        <figcaption>
          {event.kind === 'watch-party' ? 'Matchup artwork' : 'Illustration'} · {event.venue.name} is a fictional venue{event.kind === 'watch-party' ? '. No partnership with either club is claimed.' : ''}
        </figcaption>
      </figure>

      {event.kind === 'watch-party' ? (
      <Card variant="inverse" className={styles.matchCard}>
        <p className={styles.matchLabel}>
          <span aria-hidden="true">📺 </span>
          {event.match.competition}
        </p>
        <p className={styles.matchup}>
          <span>{event.match.home}</span>
          <span className={styles.vs}>vs</span>
          <span>{event.match.away}</span>
        </p>
        <p className={styles.matchSource}>
          Match announced by{' '}
          <a href={event.match.source.url} target="_blank" rel="noreferrer">
            {event.match.source.publisher}
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          . Check there for the official kickoff time.
        </p>
      </Card>
      ) : (
        <Card variant="inverse" className={styles.matchCard}>
          <p className={styles.matchLabel}>
            <span aria-hidden="true">⚽ </span>Pickup game · {event.game.spots} spots
          </p>
          <p className={styles.gameFormat}>{event.game.format}</p>
          <p className={styles.matchSource}>{event.game.level}</p>
          <p className={styles.matchSource}>
            <strong>Bring:</strong> {event.game.bring.join(' · ')}
          </p>
        </Card>
      )}

      <Card>
        <dl className={styles.facts}>
          <div>
            <dt>Date</dt>
            <dd>{eventDateLabel(event.startsAt, event.timeZone)}</dd>
          </div>
          <div>
            <dt>{kind.startLabel}</dt>
            <dd>
              {eventTimeLabel(event.startsAt, event.timeZone)} <span className={styles.muted}>(venue local time)</span>
              {yourTime && <span className={styles.subline}>Your time: {yourTime}</span>}
            </dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>
              {event.venue.name}
              <span className={styles.subline}>{event.venue.area}, {event.venue.city} · fictional venue</span>
            </dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd><strong>{event.priceLabel}</strong> <span className={styles.muted}>· no ticket needed</span></dd>
          </div>
          <div>
            <dt>Organizer</dt>
            <dd>{event.organizer.name} <span className={styles.muted}>(demo group)</span></dd>
          </div>
        </dl>
      </Card>

      <section aria-labelledby="rsvp-title" className={styles.rsvpPanel} data-going={going || undefined}>
        <h2 id="rsvp-title" className="visually-hidden">Your RSVP</h2>
        <div role="status" aria-live="polite">
          {going ? (
            <CoachPrompt state="celebrate" tone="success" avatarSize="sm">
              You’re going! We saved it to your Account.
            </CoachPrompt>
          ) : rsvp === 'cancelled' ? (
            <CoachPrompt state="idle" avatarSize="sm">RSVP cancelled. Changed your mind? You can still come.</CoachPrompt>
          ) : (
            <CoachPrompt state="speaking" avatarSize="sm">
              {event.kind === 'play-day' ? 'Coming to play with us? It’s free.' : 'Coming to watch with us? Admission is free.'}
            </CoachPrompt>
          )}
        </div>
        {friends && (
          <p className={styles.friendsGoing}>
            <span aria-hidden="true">👥 </span>
            {friends}
          </p>
        )}
        <div className={styles.actions}>
          {going ? (
            <>
              <ButtonLink to={routes.account()} variant="primary">See it on Account</ButtonLink>
              <Button variant="secondary" onClick={() => communityActions.cancelRsvp(event.id)}>Cancel RSVP</Button>
            </>
          ) : (
            <Button size="lg" onClick={() => communityActions.rsvp(event.id)}>I’m going</Button>
          )}
        </div>
      </section>

      <EventChat
        eventId={event.id}
        timeZone={event.timeZone}
        going={going}
        title={event.kind === 'play-day' ? 'Play day chat' : 'Matchday chat'}
      />

      <Card>
        <h2 className={styles.h3}>The plan</h2>
        <ol className={styles.agenda}>
          {event.agenda.map((a) => (
            <li key={a.when}>
              <span className={styles.agendaWhen}>{a.when}</span>
              <span>{a.what}</span>
            </li>
          ))}
        </ol>
        {event.kind === 'watch-party' && (
          <Link to={routes.feedPost(event.previewPostId)} className={styles.inlineLink}>
            Read the match preview in Feed →
          </Link>
        )}
      </Card>

      <Card className={styles.organizer}>
        <div>
          <h2 className={styles.h3}>{GROUP.name}</h2>
          <p className={styles.muted}>{GROUP.tagline} Join to see future watch parties first.</p>
        </div>
        {member ? (
          <Button variant="secondary" onClick={() => communityActions.leaveGroup(GROUP.id)}>Leave group</Button>
        ) : (
          <Button variant="secondary" onClick={() => communityActions.joinGroup(GROUP.id)}>Join group</Button>
        )}
      </Card>

      <Card variant="subtle" className={styles.disclosure}>
        <h2 className={styles.h3}>About this listing</h2>
        {event.venue.sponsored ? (
          <p>
            <Badge variant="sponsored">Sponsored venue</Badge>{' '}
            {event.venue.name} is a fictional venue created for this demo. In the BALLR business model, venues
            pay to feature their events here. Admission stays free for fans.
          </p>
        ) : (
          <p>{event.venue.name} is a fictional field created for this demo. Playing is free.</p>
        )}
        <p className={styles.muted}>
          This is a demo event. BALLR has no partnership with{' '}
          {event.kind === 'watch-party' ? `${event.match.home}, ${event.match.away}, Major League Soccer, ` : ''}
          any club, league, venue or media company.
        </p>
      </Card>
    </div>
  );
}
