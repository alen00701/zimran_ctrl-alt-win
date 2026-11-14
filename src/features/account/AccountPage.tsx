import { useState } from 'react';
import { Link } from 'react-router';
import { DEMO_EVENTS, DEMO_GROUPS } from '@/shared/fixtures/ids';
import { EXPERTISE_OPTIONS, INTEREST_OPTIONS } from '@/shared/contracts/catalog';
import { buildDemoPlayers, pointsWithin } from '@/shared/fixtures/demoPlayers';
import { goingEventIds, guestRecords, hasMembership, preferencesActions, resetDemo, resumableLesson, totalPoints, useGuestState } from '@/shared/state';
import { routes } from '@/shared/routes';
import type { Expertise } from '@/shared/contracts/types';
import { Badge, Button, ButtonLink, Card, PageHeader } from '@/shared/ui';
import styles from './Account.module.css';

/** STARTER: Account owner replaces with the full profile, achievements and scoreboards. */
export function AccountPage() {
  const state = useGuestState();
  const [confirming, setConfirming] = useState(false);
  const resume = resumableLesson(state.course);
  const going = goingEventIds(state);
  const groups = Object.keys(state.community.groups);
  const mine = guestRecords(state);
  const weekly = [
    { name: 'You', demo: false, pts: pointsWithin(mine, 7) },
    ...buildDemoPlayers().map((p) => ({ name: p.displayName, demo: true, pts: pointsWithin(p.records, 7) })),
  ].sort((a, b) => b.pts - a.pts);

  return (
    <>
      <PageHeader title="Account" subtitle="Guest profile · saved on this device" />
      <div className={styles.stack}>
        <Card>
          <h2 className={styles.h2}>Your level</h2>
          <select
            className={styles.select}
            value={state.preferences.expertise ?? ''}
            onChange={(e) => preferencesActions.setExpertise(e.target.value as Expertise)}
            aria-label="Soccer knowledge level"
          >
            <option value="" disabled>Choose…</option>
            {EXPERTISE_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <p className={styles.muted}>
            Interests: {state.preferences.interests.map((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.label ?? i).join(', ') || 'none yet'}
          </p>
          <ButtonLink to={routes.onboarding({ edit: true, returnTo: routes.account() })} variant="secondary">Edit interests</ButtonLink>
        </Card>

        <Card>
          <h2 className={styles.h2}>Membership</h2>
          <p>{hasMembership(state.course) ? <Badge variant="brand">Demo membership</Badge> : 'Free plan'}</p>
          {resume && <p><Link to={routes.lesson(resume.lessonId)}>Resume “{resume.title}”</Link></p>}
          <p className={styles.muted}>{state.course.completedLessonIds.length} lessons completed</p>
        </Card>

        <Card>
          <h2 className={styles.h2}>Groups and events</h2>
          <ul className={styles.ul}>
            {groups.map((id) => (
              <li key={id}><Link to={routes.community()}>{DEMO_GROUPS.find((g) => g.id === id)?.name ?? id}</Link></li>
            ))}
            {going.map((id) => (
              <li key={id}><Link to={routes.event(id)}>{DEMO_EVENTS.find((e) => e.id === id)?.title ?? id}</Link> · going</li>
            ))}
            {groups.length + going.length === 0 && <li className={styles.muted}>Nothing yet</li>}
          </ul>
        </Card>

        <Card>
          <h2 className={styles.h2}>Soccer scoreboard</h2>
          <p>Your points: <strong>{totalPoints(mine)}</strong></p>
          <ol className={styles.ul}>
            {weekly.map((r) => (
              <li key={r.name}>{r.name} · {r.pts} pts {r.demo && <Badge variant="demo">Demo player</Badge>}</li>
            ))}
          </ol>
        </Card>

        <Card variant="subtle">
          <h2 className={styles.h2}>Reset demo</h2>
          {confirming ? (
            <div className={styles.row}>
              <span>Erase all progress, picks and RSVPs on this device?</span>
              <Button variant="danger" onClick={() => { resetDemo(); setConfirming(false); }}>Yes, reset everything</Button>
              <Button variant="secondary" onClick={() => setConfirming(false)}>Keep my progress</Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setConfirming(true)}>Reset demo…</Button>
          )}
        </Card>
      </div>
    </>
  );
}
