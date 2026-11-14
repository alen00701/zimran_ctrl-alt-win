import styles from './ProgressBar.module.css';

/** Rounded progress track from the reference header. `value` is 0..1. */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className={styles.track} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <div className={styles.fill} style={{ width: `${Math.max(pct, 4)}%` }} />
    </div>
  );
}
