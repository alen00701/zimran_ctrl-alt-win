import { Link } from 'react-router';
import { routes } from '@/shared/routes';
import { Badge } from '@/shared/ui';
import { MODULE_INFO } from './modules';
import type { LessonState } from './logic/recommend';
import type { Lesson } from './types';
import styles from './Learn.module.css';

const DIFFICULTY = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' } as const;

export function LessonRow({ lesson, state, reason, locked }: { lesson: Lesson; state: LessonState; reason: string; locked: boolean }) {
  return (
    <Link to={routes.lesson(lesson.id)} className={styles.row}>
      <span className={styles.rowMain}>
        <span className={styles.meta}>
          {MODULE_INFO[lesson.module].label} · {DIFFICULTY[lesson.difficulty]} · {lesson.minutes} min
        </span>
        <span className={styles.rowTitle}>{lesson.title}</span>
        <span className={styles.reason}>{reason}</span>
      </span>
      <span className={styles.rowBadge}>
        {state === 'completed' && <Badge variant="success">Done</Badge>}
        {state === 'in-progress' && <Badge variant="brand">In progress</Badge>}
        {state === 'new' && locked && <Badge variant="inverse">Members</Badge>}
      </span>
    </Link>
  );
}
