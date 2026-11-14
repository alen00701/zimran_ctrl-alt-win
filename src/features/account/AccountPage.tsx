import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { BrandAvatar, type BrandAvatarState } from '@/shared/brand';
import { DEMO_EVENTS, DEMO_GROUPS } from '@/shared/fixtures/ids';
import { EXPERTISE_OPTIONS, INTEREST_OPTIONS, MAX_HEARTS } from '@/shared/contracts/catalog';
import { buildDemoPlayers, pointsWithin } from '@/shared/fixtures/demoPlayers';
import {
  gameActions, goingEventIds, guestRecords, hasMembership, preferencesActions, resetDemo, resumableLesson, totalPoints, useGuestState, viewedPostCount,
} from '@/shared/state';
import { routes } from '@/shared/routes';
import type { Expertise, GuestState } from '@/shared/contracts/types';
import { Badge, Button, ButtonLink, usePageTitle } from '@/shared/ui';
import styles from './Account.module.css';

type Tone = 'purple' | 'green' | 'amber' | 'red';
const INTEREST_TONES: Tone[] = ['purple', 'green', 'amber', 'red'];

/** Achievements are computed from the shared profile, so they update the moment the visitor earns them. */
function achievements(s: GuestState, points: number, going: number, groups: number) {
  const done = s.course.completedLessonIds.length;
  return [
    { id: 'first-lesson', icon: '📘', title: 'First lesson', hint: 'Complete a lesson', tone: 'purple' as Tone, got: done >= 1 },
    { id: 'two-lessons', icon: '✌️', title: 'Two down', hint: 'Complete two lessons', tone: 'green' as Tone, got: done >= 2 },
    { id: 'points-50', icon: '⚡', title: '50 points', hint: 'Earn 50 points', tone: 'amber' as Tone, got: points >= 50 },
    { id: 'points-150', icon: '🔥', title: '150 points', hint: 'Earn 150 points', tone: 'red' as Tone, got: points >= 150 },
    { id: 'reader', icon: '📰', title: 'Story reader', hint: 'Read two stories in the Feed', tone: 'purple' as Tone, got: viewedPostCount(s) >= 2 },
    { id: 'quiz-ace', icon: '🎯', title: 'Quiz ace', hint: 'Get a Feed quiz right', tone: 'green' as Tone, got: Object.values(s.feed.quizzes).some((q) => q.status === 'answered' && q.correct) },
    { id: 'group', icon: '🤝', title: 'Teammate', hint: 'Join a group', tone: 'amber' as Tone, got: groups >= 1 },
    { id: 'matchday', icon: '🎟️', title: 'Matchday ready', hint: 'RSVP to an event', tone: 'red' as Tone, got: going >= 1 },
    { id: 'pro', icon: '👑', title: 'Pro member', hint: 'Try the Pro demo', tone: 'amber' as Tone, got: hasMembership(s.course) },
  ];
}

const whenLabel = (iso: string, tz: string) =>
  `${new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: tz })}, ${new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz })}`;

function Section({ tone, avatar, title, children, id }: { tone: Tone; avatar?: BrandAvatarState; title: string; children: ReactNode; id: string }) {
  return (
    <section className={styles.section} data-tone={tone} aria-labelledby={id}>
      <header className={styles.sectionHead}>
        <h2 className={styles.h2} id={id}>{title}</h2>
        {avatar && <BrandAvatar size={56} state={avatar} decorative className={styles.sectionAvatar} />}
      </header>
      {children}
    </section>
  );
}

export function AccountPage() {
  usePageTitle('Account');
  const state = useGuestState();
  const [confirming, setConfirming] = useState(false);
  const resume = resumableLesson(state.course);
  const going = goingEventIds(state);
  const groups = Object.keys(state.community.groups);
  const mine = guestRecords(state);
  const points = totalPoints(mine);
  const pro = hasMembership(state.course);
  const lessons = state.course.completedLessonIds.length;
  const stories = viewedPostCount(state);
  const level = EXPERTISE_OPTIONS.find((o) => o.id === state.preferences.expertise);
  const weekly = [
    { name: 'You', demo: false, pts: pointsWithin(mine, 7) },
    ...buildDemoPlayers().map((p) => ({ name: p.displayName, demo: true, pts: pointsWithin(p.records, 7) })),
  ].sort((a, b) => b.pts - a.pts);
  const medals = ['🥇', '🥈', '🥉'];
  const badges = achievements(state, points, going.length, groups.length);
  const earned = badges.filter((b) => b.got).length;

  return (
    <div className={styles.page}>
      {/* ---- hero ---- */}
      <section className={styles.hero} aria-label="Your profile">
        <div className={styles.heroBand} aria-hidden="true" />
        <div className={styles.heroTop}>
          <BrandAvatar size={132} state="celebrate" decorative className={styles.heroAvatar} />
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>Guest player · saved on this device</p>
            <h1 className={styles.name}>Your account</h1>
            <div className={styles.heroBadges}>
              <span className={styles.pill} data-tone="purple">{level ? level.tag : 'Level not set'}</span>
              <span className={styles.pill} data-tone={pro ? 'amber' : 'green'}>{pro ? '👑 Pro (demo)' : 'Free plan'}</span>
            </div>
          </div>
        </div>
        <ul className={styles.tiles}>
          <li className={styles.tile} data-tone="purple"><span className={styles.tileIcon}>⚡</span><strong>{points}</strong><span>Points</span></li>
          <li className={styles.tile} data-tone="green"><span className={styles.tileIcon}>✅</span><strong>{lessons}</strong><span>Lessons</span></li>
          <li className={styles.tile} data-tone="amber"><span className={styles.tileIcon}>📰</span><strong>{stories}</strong><span>Stories read</span></li>
          <li className={styles.tile} data-tone="red"><span className={styles.tileIcon}>❤️</span><strong>{pro ? '∞' : `${state.game.hearts}/${MAX_HEARTS}`}</strong><span>Hearts</span></li>
        </ul>
      </section>

      <div className={styles.stack}>
        {/* ---- level + interests ---- */}
        <Section tone="purple" avatar="thinking" title="Your level" id="acc-level">
          <select
            className={styles.select}
            value={state.preferences.expertise ?? ''}
            onChange={(e) => preferencesActions.setExpertise(e.target.value as Expertise)}
            aria-label="Soccer knowledge level"
          >
            <option value="" disabled>Choose…</option>
            {EXPERTISE_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <div className={styles.chips} aria-label="Your interests">
            {state.preferences.interests.length === 0 && <span className={styles.muted}>No interests yet</span>}
            {state.preferences.interests.map((id, i) => (
              <span key={id} className={styles.pill} data-tone={INTEREST_TONES[i % INTEREST_TONES.length]}>
                {INTEREST_OPTIONS.find((o) => o.id === id)?.icon} {INTEREST_OPTIONS.find((o) => o.id === id)?.label ?? id}
              </span>
            ))}
          </div>
          <ButtonLink to={routes.onboarding({ edit: true, returnTo: routes.account() })} variant="secondary">Edit interests</ButtonLink>
        </Section>

        {/* ---- membership ---- */}
        <Section tone="amber" avatar="speaking" title="Membership" id="acc-membership">
          <p className={styles.big}>{pro ? 'Pro · demo membership' : 'Free plan'}</p>
          <p className={styles.muted}>
            {pro ? 'Unlimited hearts and every lesson unlocked. No card, no charge.' : `Free: ${MAX_HEARTS} hearts and two free lessons. Pro is a demo with no card and no charge.`}
          </p>
          <div className={styles.row}>
            <Button onClick={() => gameActions.setPlan(pro ? 'free' : 'pro')} variant={pro ? 'secondary' : 'primary'}>
              {pro ? 'Back to the Free plan' : 'Try Pro · No charge'}
            </Button>
            {resume && <Link className={styles.resume} to={routes.lesson(resume.lessonId)}>▶ Resume “{resume.title}”</Link>}
          </div>
        </Section>

        {/* ---- achievements ---- */}
        <Section tone="red" avatar="celebrate" title={`Achievements · ${earned} of ${badges.length}`} id="acc-achievements">
          <ul className={styles.badges}>
            {badges.map((b) => (
              <li key={b.id} className={styles.badge} data-tone={b.tone} data-got={b.got || undefined}>
                <span className={styles.badgeIcon} aria-hidden="true">{b.got ? b.icon : '🔒'}</span>
                <strong>{b.title}</strong>
                <span className={styles.muted}>{b.got ? 'Earned' : b.hint}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* ---- groups and events ---- */}
        <Section tone="green" avatar="idle" title="Groups and events" id="acc-community">
          <ul className={styles.list}>
            {groups.map((id) => (
              <li key={id}><span aria-hidden="true">🤝</span> <Link to={routes.community()}>{DEMO_GROUPS.find((g) => g.id === id)?.name ?? id}</Link></li>
            ))}
            {going.map((id) => {
              const e = DEMO_EVENTS.find((x) => x.id === id);
              return (
                <li key={id}>
                  <span aria-hidden="true">🎟️</span> <Link to={routes.event(id)}>{e?.title ?? id}</Link> · going
                  {e && <span className={styles.muted}> · {whenLabel(e.startsAt, e.timeZone)} · {e.venueName}</span>}
                </li>
              );
            })}
            {groups.length + going.length === 0 && <li className={styles.muted}>Nothing yet. Check “I’m going” on an event in Community and it shows up here.</li>}
          </ul>
          <ButtonLink to={routes.community()} variant="secondary">Open Community</ButtonLink>
        </Section>

        {/* ---- scoreboard ---- */}
        <Section tone="purple" avatar="celebrate" title="Soccer scoreboard" id="acc-scoreboard">
          <p className={styles.big}>Your points: <strong>{points}</strong></p>
          <ol className={styles.board}>
            {weekly.map((r, i) => (
              <li key={r.name} className={styles.rank} data-you={!r.demo || undefined}>
                <span className={styles.place}>{medals[i] ?? i + 1}</span>
                <span className={styles.rankName}>{r.name}{r.demo && <> <Badge variant="demo">Demo player</Badge></>}</span>
                <strong>{r.pts} pts</strong>
              </li>
            ))}
          </ol>
          <p className={styles.muted}>This week’s points, last 7 days.</p>
        </Section>

        {/* ---- reset ---- */}
        <Section tone="red" avatar="incorrect" title="Reset demo" id="acc-reset">
          {confirming ? (
            <div className={styles.row}>
              <span>Erase all progress, picks and RSVPs on this device?</span>
              <Button variant="danger" onClick={() => { resetDemo(); setConfirming(false); }}>Yes, reset everything</Button>
              <Button variant="secondary" onClick={() => setConfirming(false)}>Keep my progress</Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setConfirming(true)}>Reset demo…</Button>
          )}
        </Section>
      </div>
    </div>
  );
}
