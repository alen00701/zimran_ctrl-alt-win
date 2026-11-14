import { FREE_LESSON_LIMIT } from '@/shared/contracts/catalog';
import { exerciseId } from '@/shared/fixtures/ids';
import { routes } from '@/shared/routes';
import { guestRecords, hasMembership, isLessonUnlocked, scoreKey, totalPoints, useGuestState } from '@/shared/state';
import { Button, ButtonLink, Card, CoachPrompt } from '@/shared/ui';
import { CATALOG } from '../catalog';
import { useRecommendations } from '../hooks';
import { MembershipCard } from '../MembershipCard';
import type { Lesson } from '../types';
import styles from '../Lesson.module.css';

export function CompletionStep({ lesson, onReplay }: { lesson: Lesson; onReplay: () => void }) {
  const state = useGuestState();
  const recs = useRecommendations();
  const earned = (step: string) => state.scoreboard.records[scoreKey('soccer', exerciseId.lessonStep(lesson.id, step))]?.points ?? 0;
  const points = earned('quiz') + earned('complete');
  const total = totalPoints(guestRecords(state));
  const completedCount = state.course.completedLessonIds.length;
  const next = recs.find((r) => r.state !== 'completed' && r.lessonId !== lesson.id);
  const nextLesson = next ? CATALOG.find((l) => l.id === next.lessonId) : undefined;
  const nextLocked = nextLesson ? !isLessonUnlocked(state.course, nextLesson.id) : false;
  const freeLeft = Math.max(0, FREE_LESSON_LIMIT - completedCount);

  return (
    <div className={styles.stack}>
      <CoachPrompt tone="success" state="celebrate" avatarSize="lg">
        Lesson complete! {points > 0 ? `You earned ${points} points. Total: ${total}.` : 'No points this time, but you finished it.'}
      </CoachPrompt>

      <Card variant="subtle" className={styles.summaryCard}>
        <p>
          <strong>{completedCount}</strong> {completedCount === 1 ? 'lesson' : 'lessons'} completed
          {!hasMembership(state.course) && freeLeft > 0 ? ` · ${freeLeft} free ${freeLeft === 1 ? 'lesson' : 'lessons'} left` : ''}
        </p>
      </Card>

      {nextLesson && nextLocked && <MembershipCard lesson={nextLesson} completedCount={completedCount} />}

      {nextLesson && !nextLocked && (
        <Card className={styles.nextCard}>
          <p className={styles.eyebrow}>Up next for you</p>
          <h2 className={styles.nextTitle}>{nextLesson.title}</h2>
          <p className={styles.muted}>{next?.reason}</p>
          <ButtonLink to={routes.lesson(nextLesson.id)} block>
            Start next lesson
          </ButtonLink>
        </Card>
      )}

      <div className={styles.row}>
        <ButtonLink to={routes.learn()} variant="secondary">
          Back to Learn
        </ButtonLink>
        <Button variant="ghost" onClick={onReplay}>
          Replay this lesson
        </Button>
      </div>
    </div>
  );
}
