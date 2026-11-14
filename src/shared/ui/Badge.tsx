import type { ReactNode } from 'react';
import styles from './Badge.module.css';

/**
 * Required disclosure labels use these variants:
 * 'sponsored' → "Sponsored", 'demo' → "Demo event" / "Demo players",
 * 'reconstruction' → "Tactical reconstruction".
 */
export type BadgeVariant = 'brand' | 'neutral' | 'inverse' | 'success' | 'danger' | 'sponsored' | 'demo' | 'reconstruction';

export function Badge({ variant = 'neutral', children }: { variant?: BadgeVariant; children: ReactNode }) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
}
