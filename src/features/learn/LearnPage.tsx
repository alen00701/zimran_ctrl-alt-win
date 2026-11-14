import { Link } from 'react-router';
import { FREE_LESSON_LIMIT } from '@/shared/contracts/catalog';
import { routes } from '@/shared/routes';
import { freeLessonsRemaining, hasMembership, isLessonUnlocked, useGuestState } from '@/shared/state';
import { Badge, ButtonLink, Card, PageHeader } from '@/shared/ui';
import { CATALOG } from './catalog';
import { useRecommendations } from './hooks';
import { LessonRow } from './LessonRow';
import { MembershipCard } from './MembershipCard';
import { MODULE_INFO, MODULE_ORDER } from './modules';
import styles from './Learn.module.css';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function LearnPage() {
  const state = useGuestState();
  const { course, preferences } = state;
  const recs = useRecommendations();
  const member = hasMembership(course);
  const completedCount = course.completedLessonIds.length;

  const lessonOf = (id: string) => CATALOG.find((l) => l.id === id)!;
  const active = recs.filter((r) => r.state !== 'completed');
  const done = recs.filter((r) => r.state === 'completed');
  const top = active[0];
  const topLesson = top ? lessonOf(top.lessonId) : undefined;
  const topLocked = topLesson ? !isLessonUnlocked(course, topLesson.id) : false;
  const rest = top ? active.slice(1) : [];

  const subtitle = member
    ? 'Demo membership active · the full course is unlocked'
    : `${plural(freeLessonsRemaining(course), 'free lesson', 'free lessons')} left of ${FREE_LESSON_LIMIT}`;

  return (
    <>
      <PageHeader title="Learn" subtitle={subtitle} />

      <div className={styles.stack}>
        {!preferences.expertise && (
          <Card variant="subtle" className={styles.prompt}>
            <p>Tell us your level and interests to get lessons picked for you.</p>
            <ButtonLink to={routes.onboarding({ returnTo: routes.learn() })} variant="secondary">
              Personalize
            </ButtonLink>
          </Card>
        )}

        {top && topLesson && topLocked && <MembershipCard lesson={topLesson} completedCount={completedCount} />}

        {top && topLesson && !topLocked && (
          <Card variant="inverse" className={styles.hero}>
            <Badge variant="brand">{top.state === 'in-progress' ? 'Continue' : 'Recommended for you'}</Badge>
            <h2 className={styles.heroTitle}>{topLesson.title}</h2>
            <p className={styles.heroReason}>{top.reason}</p>
            <p className={styles.heroMeta}>
              {MODULE_INFO[topLesson.module].label} · {topLesson.minutes} min
            </p>
            <ButtonLink to={routes.lesson(topLesson.id)} block size="lg">
              {top.state === 'in-progress' ? 'Resume lesson' : 'Start lesson'}
            </ButtonLink>
          </Card>
        )}

        {rest.length > 0 && (
          <section aria-labelledby="more-h">
            <h2 id="more-h" className={styles.h2}>
              {topLocked ? 'Also in the course' : 'More for you'}
            </h2>
            <ul className={styles.list}>
              {rest.map((r) => (
                <li key={r.lessonId}>
                  <LessonRow lesson={lessonOf(r.lessonId)} state={r.state} reason={r.reason} locked={!isLessonUnlocked(course, r.lessonId)} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {done.length > 0 && (
          <section aria-labelledby="done-h">
            <h2 id="done-h" className={styles.h2}>
              Completed
            </h2>
            <ul className={styles.list}>
              {done.map((r) => (
                <li key={r.lessonId}>
                  <LessonRow lesson={lessonOf(r.lessonId)} state="completed" reason={r.reason} locked={false} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="modules-h">
          <h2 id="modules-h" className={styles.h2}>
            Modules
          </h2>
          <ul className={styles.modules}>
            {MODULE_ORDER.map((m) => {
              const count = CATALOG.filter((l) => l.module === m).length;
              return (
                <li key={m} className={styles.module} data-empty={count === 0 || undefined}>
                  <span className={styles.moduleName}>{MODULE_INFO[m].label}</span>
                  <span className={styles.moduleBlurb}>{MODULE_INFO[m].blurb}</span>
                  {count > 0 ? <Badge variant="demo">{plural(count, 'lesson', 'lessons')}</Badge> : <Badge variant="neutral">Coming soon</Badge>}
                </li>
              );
            })}
          </ul>
        </section>

        <p className={styles.footnote}>
          Picks come from your level, your interests and what you read in the Feed. They are chosen by simple rules on this device, with no account and no AI call.{' '}
          <Link to={routes.onboarding({ edit: true, returnTo: routes.learn() })}>Change your level or interests</Link>
        </p>
      </div>
    </>
  );
}
