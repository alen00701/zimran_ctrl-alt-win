import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { DEMO_EVENTS, DEMO_GROUPS } from '@/shared/fixtures/ids';
import { EXPERTISE_OPTIONS, INTEREST_OPTIONS, SPORTS } from '@/shared/contracts/catalog';
import { buildDemoPlayers, pointsWithin } from '@/shared/fixtures/demoPlayers';
import { goingEventIds, guestRecords, hasMembership, preferencesActions, resetDemo, resumableLesson, totalPoints, useGuestState, viewedPostCount } from '@/shared/state';
import { routes } from '@/shared/routes';
import type { Expertise } from '@/shared/contracts/types';
import { Badge, Button, ButtonLink, Card, CoachPrompt, OptionCard, PageHeader } from '@/shared/ui';
import styles from './Account.module.css';

function weeklyBoard(points: number) {
  return [
    { name: 'You', demo: false, points },
    ...buildDemoPlayers().map(player => ({ name: player.displayName, demo: true, points: pointsWithin(player.records, 7) })),
  ].sort((a, b) => b.points - a.points || Number(a.demo) - Number(b.demo));
}

export function AccountPage() {
  const state = useGuestState();
  const [confirming, setConfirming] = useState(false);
  const resume = resumableLesson(state.course);
  const going = goingEventIds(state);
  const groups = Object.keys(state.community.groups);
  const mine = guestRecords(state);
  const weekPoints = pointsWithin(mine, 7);
  const board = useMemo(() => weeklyBoard(weekPoints), [weekPoints]);
  const answeredQuizzes = Object.values(state.feed.quizzes).filter(quiz => quiz.status === 'answered').length;
  const readStories = viewedPostCount(state);
  const savedPicks = Object.keys(state.feed.picks).length;

  return <>
    <PageHeader eyebrow="Your game, saved" title="Account" subtitle="Progress stays on this device as you tune your feed and lessons." />
    <div className={styles.stack}>
      <CoachPrompt avatarSize="sm" state="speaking">Change what you want to learn about. Your lessons, points, groups and picks will stay put.</CoachPrompt>

      <Card className={styles.profileCard}>
        <div className={styles.sectionHeader}><div><p className={styles.eyebrow}>Personalization</p><h2>Make it yours</h2></div><Link to={routes.feed()} className={styles.textLink}>See your feed ↗</Link></div>
        <fieldset className={styles.fieldset}>
          <legend>How well do you know soccer?</legend>
          <div className={styles.levels}>{EXPERTISE_OPTIONS.map(option => <OptionCard key={option.id} mode="single" name="expertise" value={option.id} label={option.label} trailing={option.tag} selected={state.preferences.expertise === option.id} onChange={value => preferencesActions.setExpertise(value as Expertise)} />)}</div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend>What do you want more of?</legend>
          <div className={styles.interests}>{INTEREST_OPTIONS.map(option => <OptionCard key={option.id} mode="multi" name="interests" value={option.id} label={option.label} leading={option.icon} selected={state.preferences.interests.includes(option.id)} onChange={value => preferencesActions.toggleInterest(value as typeof option.id)} />)}</div>
        </fieldset>
      </Card>

      <div className={styles.twoUp}>
        <Card variant={hasMembership(state.course) ? 'brand' : 'inverse'}>
          <p className={styles.eyebrow}>Membership</p><h2>{hasMembership(state.course) ? 'Demo membership is active' : 'You’re on the free plan'}</h2>
          <p>{hasMembership(state.course) ? 'All available demo lessons are unlocked. No card and no charge.' : 'Finish two distinct lessons to see the membership demo.'}</p>
          <ButtonLink to={routes.learn()} variant={hasMembership(state.course) ? 'inverse' : 'secondary'}>{hasMembership(state.course) ? 'Browse every lesson' : 'Explore lessons'}</ButtonLink>
        </Card>
        <Card>
          <p className={styles.eyebrow}>Keep learning</p><h2>{resume ? `Resume “${resume.title}”` : 'Pick your next lesson'}</h2>
          <p>{resume ? `You’re at step ${resume.currentStep + 1}. Your answers are saved.` : `${state.course.completedLessonIds.length} lessons completed so far.`}</p>
          <ButtonLink to={resume ? routes.lesson(resume.lessonId) : routes.learn()} variant="secondary">{resume ? 'Resume lesson' : 'Go to Learn'}</ButtonLink>
        </Card>
      </div>

      <Card>
        <div className={styles.sectionHeader}><div><p className={styles.eyebrow}>Your activity</p><h2>Achievements</h2></div><Link to={routes.learn()} className={styles.textLink}>Keep building ↗</Link></div>
        <div className={styles.achievementGrid}>
          <Link to={routes.feed()} className={styles.achievement}><strong>{readStories}</strong><span>stories read</span></Link>
          <Link to={routes.feed()} className={styles.achievement}><strong>{answeredQuizzes}</strong><span>quizzes answered</span></Link>
          <Link to={routes.learn()} className={styles.achievement}><strong>{state.course.completedLessonIds.length}</strong><span>lessons completed</span></Link>
          <Link to={routes.feed()} className={styles.achievement}><strong>{savedPicks}</strong><span>match picks saved</span></Link>
        </div>
      </Card>

      <Card>
        <div className={styles.sectionHeader}><div><p className={styles.eyebrow}>Matchday</p><h2>Your groups and RSVPs</h2></div><Link to={routes.community()} className={styles.textLink}>Open Community ↗</Link></div>
        {groups.length + going.length ? <div className={styles.communityLists}>
          <div><h3>Groups</h3><ul>{groups.map(id => <li key={id}><Link to={routes.community()}>{DEMO_GROUPS.find(group => group.id === id)?.name ?? id}</Link></li>)}</ul></div>
          <div><h3>Going</h3><ul>{going.map(id => <li key={id}><Link to={routes.event(id)}>{DEMO_EVENTS.find(event => event.id === id)?.title ?? id}</Link> <Badge variant="demo">Demo event</Badge></li>)}</ul></div>
        </div> : <div className={styles.empty}><p>Nothing saved yet. Join a group or RSVP for a watch party to see it here.</p><ButtonLink to={routes.community()} variant="secondary">Find your people</ButtonLink></div>}
      </Card>

      <Card>
        <div className={styles.sectionHeader}><div><p className={styles.eyebrow}>Scoreboards</p><h2>Weekly points</h2></div><span className={styles.week}>Last 7 days</span></div>
        <div className={styles.sports} role="tablist" aria-label="Sports scoreboards">{SPORTS.map(sport => <button key={sport.id} type="button" role="tab" aria-selected={sport.active} disabled={!sport.active} className={styles.sportTab}>{sport.label}{!sport.active && <span>Coming soon</span>}</button>)}</div>
        <div className={styles.scoreHero}><div><span>Your soccer points</span><strong>{totalPoints(mine)}</strong><small>{weekPoints} earned this week</small></div><Link to={routes.learn()} className={styles.textLink}>Earn more in Learn ↗</Link></div>
        <ol className={styles.board} aria-label="Soccer weekly ranking">{board.map((row, index) => <li key={row.name} className={row.demo ? styles.demoRow : styles.youRow}><span className={styles.rank}>{index + 1}</span><span className={styles.player}>{row.name} {row.demo && <Badge variant="demo">Demo player</Badge>}</span><strong>{row.points} pts</strong></li>)}</ol>
      </Card>

      <Card variant="subtle" className={styles.resetCard}>
        <p className={styles.eyebrow}>Local demo data</p><h2>Reset this device</h2><p>This erases saved settings, progress, picks, memberships, groups, RSVPs and points from this browser.</p>
        {confirming ? <div className={styles.confirm}><strong>Reset everything on this device?</strong><div><Button variant="danger" onClick={() => { resetDemo(); setConfirming(false); }}>Yes, reset everything</Button><Button variant="secondary" onClick={() => setConfirming(false)}>Keep my progress</Button></div></div> : <Button variant="secondary" onClick={() => setConfirming(true)}>Reset demo…</Button>}
      </Card>
    </div>
  </>;
}
