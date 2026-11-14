import { Navigate, useParams } from 'react-router';
import { isLessonUnlocked, useGuestSlice } from '@/shared/state';
import { routes } from '@/shared/routes';
import { ButtonLink, CoachPrompt, PageHeader } from '@/shared/ui';
import { getLesson } from './catalog';
import { getDrill, RULES_BLOCK_ID, RULES_DRILLS, RULES_QUIZ_ID } from './catalog/rulesBasics';
import { BlockQuizPage } from './BlockQuizPage';
import { DrillPage } from './DrillPage';
import { readRules } from './logic/path';
import { LessonPlayer } from './LessonPlayer';
import { MembershipCard } from './MembershipCard';
import styles from './Lesson.module.css';

/** /learn/:lessonId — unknown IDs, the paywall and the lesson itself. */
export function LessonPage() {
  const { lessonId = '' } = useParams();
  const course = useGuestSlice('course');
  const lesson = getLesson(lessonId);
  const drill = getDrill(lessonId);

  // Rules basics block: drills, block quiz, and the block ID itself (used by Account's "Resume").
  if (drill) return <DrillPage key={drill.id} drill={drill} />;
  if (lessonId === RULES_QUIZ_ID) return <BlockQuizPage />;
  if (lessonId === RULES_BLOCK_ID) {
    const rules = readRules(course);
    const nextDrill = RULES_DRILLS.find((d) => !rules.done.has(d.id));
    const to = nextDrill ? routes.lesson(nextDrill.id) : rules.passed ? `${routes.learn()}?level=beginner` : routes.lesson(RULES_QUIZ_ID);
    return <Navigate to={to} replace />;
  }

  if (!lesson) {
    return (
      <div className={styles.stack}>
        <CoachPrompt headingLevel={1} state="thinking">
          That lesson isn’t in the playbook yet.
        </CoachPrompt>
        <ButtonLink to={routes.learn()}>Back to Learn</ButtonLink>
      </div>
    );
  }

  if (!isLessonUnlocked(course, lesson.id)) {
    const started = Boolean(course.lessons[lesson.id]);
    return (
      <div className={styles.stack}>
        <PageHeader eyebrow="Members lesson" title={lesson.title} subtitle={lesson.summary} />
        <CoachPrompt>
          {started ? 'Your progress in this lesson is saved. Unlock it to pick up where you stopped.' : 'This one is part of membership. Your first two lessons were on the house.'}
        </CoachPrompt>
        <MembershipCard lesson={lesson} completedCount={course.completedLessonIds.length} />
        <ButtonLink to={routes.learn()} variant="ghost">
          ← Back to Learn
        </ButtonLink>
      </div>
    );
  }

  return <LessonPlayer key={lesson.id} lesson={lesson} />;
}
