import { Link } from 'react-router';
import { SEED_LESSON_IDS } from '@/shared/fixtures/ids';
import { MEMBERSHIP_PRICE_LABEL } from '@/shared/contracts/catalog';
import { courseActions, freeLessonsRemaining, hasMembership, isLessonUnlocked, resumableLesson, useGuestSlice } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, Button, ButtonLink, Card, PageHeader } from '@/shared/ui';
import styles from './Learn.module.css';

const humanize = (id: string) => id.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/** STARTER: Learn owner replaces with the personalized catalog. */
export function LearnPage() {
  const course = useGuestSlice('course');
  const resume = resumableLesson(course);
  return (
    <>
      <PageHeader
        title="Learn"
        subtitle={hasMembership(course) ? 'Demo membership active' : `${freeLessonsRemaining(course)} free lessons left`}
      />
      {resume && (
        <Card variant="inverse" className={styles.resume}>
          <span>Resume “{resume.title}” · step {resume.currentStep + 1}</span>
          <ButtonLink to={routes.lesson(resume.lessonId)}>Resume</ButtonLink>
        </Card>
      )}
      <ul className={styles.list}>
        {SEED_LESSON_IDS.map((id) => {
          const open = isLessonUnlocked(course, id);
          return (
            <li key={id}>
              <Link to={routes.lesson(id)} className={styles.item}>
                <span>{humanize(id)}</span>
                {course.completedLessonIds.includes(id) ? (
                  <Badge variant="success">Done</Badge>
                ) : open ? null : (
                  <Badge variant="brand">Members</Badge>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      {!hasMembership(course) && (
        <Card variant="subtle" className={styles.member}>
          <p>Membership · {MEMBERSHIP_PRICE_LABEL}</p>
          <Button onClick={courseActions.startDemoMembership}>Try membership demo · No charge</Button>
        </Card>
      )}
    </>
  );
}
