import { Card } from '@/shared/ui';
import type { Lesson } from '../types';
import styles from '../Lesson.module.css';

export function ExplanationStep({ lesson }: { lesson: Lesson }) {
  return (
    <div className={styles.stack}>
      <div className={styles.prose}>
        {lesson.explanation.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <Card variant="brand">
        <p className={styles.takeawayLabel}>Takeaway</p>
        <p className={styles.takeaway}>{lesson.explanation.takeaway}</p>
      </Card>
    </div>
  );
}
