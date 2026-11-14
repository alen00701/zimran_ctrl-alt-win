import { Navigate, useParams } from 'react-router';
import { isLessonUnlocked, useGuestSlice } from '@/shared/state';
import { routes } from '@/shared/routes';
import { ButtonLink, CoachPrompt, PageHeader } from '@/shared/ui';
import { getLesson } from './catalog';
import { drillBlock, findDrill, LEVELS } from './catalog/path';
import { RULES_BLOCK_ID, RULES_QUIZ_ID } from './catalog/rulesBasics';
import { BlockQuizPage } from './BlockQuizPage';
import { DrillPage } from './DrillPage';
import { readDone, readRules } from './logic/path';
import { LessonPlayer } from './LessonPlayer';
import { MembershipCard } from './MembershipCard';
import styles from './Lesson.module.css';

/** /learn/:lessonId — unknown IDs, the paywall and the lesson itself. */
export function LessonPage() {
  const { lessonId = '' } = useParams();
  const course = useGuestSlice('course');
  const lesson = getLesson(lessonId);
  const drill = findDrill(lessonId)?.drill;

  // Rules basics block: drills, block quiz, and the block ID itself (used by Account's "Resume").
  if (drill) return <DrillPage key={drill.id} drill={drill} />;
  if (lessonId === RULES_QUIZ_ID) return <BlockQuizPage />;
  // A block ID (used by Account's "Resume") sends the visitor to the next unfinished lesson in that block.
  const block = drillBlock(lessonId);
  if (block) {
    const done = readDone(course, block.id);
    const next = block.nodes.find((n) => n.kind === 'drill' && !done.has(n.id));
    const level = block.id === RULES_BLOCK_ID ? 'beginner' : LEVELS.find((l) => l.blocks.includes(block))!.id;
    const rules = readRules(course);
    const to = next ? routes.lesson(next.id) : block.id === RULES_BLOCK_ID && !rules.passed ? routes.lesson(RULES_QUIZ_ID) : `${routes.learn()}?level=${level}`;
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
