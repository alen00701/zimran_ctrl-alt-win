import { MEMBERSHIP_PRICE_LABEL } from '@/shared/contracts/catalog';
import { courseActions } from '@/shared/state';
import { Badge, Button, Card } from '@/shared/ui';
import type { Lesson } from './types';
import styles from './Membership.module.css';

const ORDINAL: Record<number, string> = { 2: 'third lesson', 3: 'fourth lesson' };

/**
 * Paywall card. Names the specific locked lesson and what membership includes.
 * "Demo" only: no card details, nothing is charged.
 */
export function MembershipCard({ lesson, completedCount }: { lesson: Lesson; completedCount: number }) {
  const which = ORDINAL[completedCount] ?? 'next lesson';
  return (
    <Card variant="inverse" className={styles.card}>
      <Badge variant="brand">Membership</Badge>
      <h2 className={styles.title}>Your {which}</h2>
      <p className={styles.lesson}>{lesson.title}</p>
      <p className={styles.summary}>
        You have finished your two free lessons. Membership unlocks this one and everything after it. Lessons you already finished stay free to replay.
      </p>
      <ul className={styles.list}>
        <li>The full personalized course</li>
        <li>New modules as they launch</li>
        <li>Four prematch editions per month</li>
      </ul>
      <p className={styles.price}>
        <strong>{MEMBERSHIP_PRICE_LABEL}</strong>
        <span> · Demo only. No card needed and nothing is charged.</span>
      </p>
      <Button size="lg" block onClick={courseActions.startDemoMembership}>
        Try membership demo · No charge
      </Button>
      <p className={styles.note}>The Feed stays free.</p>
    </Card>
  );
}
