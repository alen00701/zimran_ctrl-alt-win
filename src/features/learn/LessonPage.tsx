import { useEffect } from 'react';
import { useParams } from 'react-router';
import { SEED_LESSON_IDS } from '@/shared/fixtures/ids';
import { courseActions, isLessonUnlocked, useGuestSlice } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Button, ButtonLink, CoachPrompt, PageHeader, ProgressBar } from '@/shared/ui';
import styles from './Learn.module.css';

const STEPS = 3;
const humanize = (id: string) => id.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/** STARTER: demonstrates resume-at-step, completion and the paywall contract. */
export function LessonPage() {
  const { lessonId = '' } = useParams();
  const course = useGuestSlice('course');
  const known = (SEED_LESSON_IDS as readonly string[]).includes(lessonId);
  const unlocked = known && isLessonUnlocked(course, lessonId);
  const progress = course.lessons[lessonId];

  useEffect(() => {
    if (known && unlocked) courseActions.openLesson(lessonId, humanize(lessonId));
  }, [known, unlocked, lessonId]);

  if (!known) {
    return (
      <div className={styles.stack}>
        <CoachPrompt headingLevel={1} state="thinking">That lesson isn’t in the playbook yet.</CoachPrompt>
        <ButtonLink to={routes.learn()}>Back to Learn</ButtonLink>
      </div>
    );
  }
  if (!unlocked) {
    return (
      <div className={styles.stack}>
        <PageHeader title={humanize(lessonId)} eyebrow="Members lesson" />
        <CoachPrompt>You’ve finished your two free lessons. Membership unlocks this one.</CoachPrompt>
        <Button onClick={courseActions.startDemoMembership}>Try membership demo · No charge</Button>
      </div>
    );
  }
  const step = progress?.currentStep ?? 0;
  const done = Boolean(progress?.completedAt);
  return (
    <div className={styles.stack}>
      <PageHeader title={humanize(lessonId)} eyebrow={`Step ${Math.min(step + 1, STEPS)} of ${STEPS}`} />
      <ProgressBar value={done ? 1 : step / STEPS} label="Lesson progress" />
      {done ? (
        <CoachPrompt state="celebrate" tone="success">Lesson complete. Nice read!</CoachPrompt>
      ) : (
        <CoachPrompt>Starter step {step + 1}. The Learn owner adds the story, interaction and quiz.</CoachPrompt>
      )}
      <div className={styles.row}>
        {step > 0 && !done && (
          <Button variant="secondary" onClick={() => courseActions.setStep(lessonId, step - 1)}>Back</Button>
        )}
        {!done && step < STEPS - 1 && <Button onClick={() => courseActions.setStep(lessonId, step + 1)}>Next</Button>}
        {!done && step === STEPS - 1 && <Button onClick={() => courseActions.completeLesson(lessonId)}>Complete lesson</Button>}
        {done && <ButtonLink to={routes.learn()}>Back to Learn</ButtonLink>}
      </div>
    </div>
  );
}
