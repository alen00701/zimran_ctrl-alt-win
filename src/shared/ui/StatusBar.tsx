import { useEffect, useRef, useState } from 'react';
import { MAX_HEARTS } from '../contracts/catalog';
import { gameActions, guestRecords, isPro, totalPoints, useGuestState } from '../state';
import styles from './StatusBar.module.css';

/** 'up' / 'down' for 700 ms after `value` changes, so the chip can animate a gain or loss. */
function useChange(value: number): 'up' | 'down' | null {
  const prev = useRef(value);
  const [dir, setDir] = useState<'up' | 'down' | null>(null);
  useEffect(() => {
    if (value === prev.current) return;
    setDir(value > prev.current ? 'up' : 'down');
    prev.current = value;
    const t = window.setTimeout(() => setDir(null), 700);
    return () => window.clearTimeout(t);
  }, [value]);
  return dir;
}

export function HeartIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 21s-7.5-4.6-9.6-9.4C.9 8 3 4.5 6.5 4.5c2 0 3.7 1.1 5.5 3.2 1.8-2.1 3.5-3.2 5.5-3.2 3.5 0 5.6 3.5 4.1 7.1C19.5 16.4 12 21 12 21Z" fill="currentColor" />
    </svg>
  );
}
function BoltIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M13.5 2 4.5 13.5h6L9.5 22l9-11.5h-6L13.5 2Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Points, hearts and the Free ↔ Pro switch. Everything is read from the one saved profile, so the numbers
 * are the same on every tab and update the moment anything changes.
 * `compact` is the dark, one-line version used on top of the Feed.
 */
export function StatusBar({ compact = false }: { compact?: boolean }) {
  const state = useGuestState();
  const pro = isPro(state);
  const points = totalPoints(guestRecords(state));
  const hearts = state.game.hearts;
  const pointsChange = useChange(points);
  const heartsChange = useChange(hearts);

  return (
    <div className={styles.bar} data-compact={compact || undefined} data-pro={pro || undefined} role="group" aria-label="Your status">
      <span className={styles.chip} data-kind="points" data-change={pointsChange ?? undefined}>
        <BoltIcon />
        <span className={styles.value} aria-live="polite">{points}</span>
        <span className="visually-hidden"> points</span>
        {pointsChange === 'up' && <span className={styles.float} aria-hidden="true">+</span>}
      </span>

      <span className={styles.chip} data-kind="hearts" data-pro={pro || undefined} data-empty={(!pro && hearts === 0) || undefined} data-change={heartsChange ?? undefined}>
        <HeartIcon />
        {pro ? (
          <>
            <span className={styles.value} aria-hidden="true">∞</span>
            <span className="visually-hidden">Unlimited hearts</span>
          </>
        ) : (
          <>
            <span className={styles.value} aria-hidden="true">{hearts}/{MAX_HEARTS}</span>
            <span className="visually-hidden">{hearts} of {MAX_HEARTS} hearts</span>
          </>
        )}
        {heartsChange === 'down' && <span className={styles.float} data-loss aria-hidden="true">−1</span>}
      </span>

      <button
        type="button"
        className={styles.plan}
        role="switch"
        aria-checked={pro}
        aria-label="Pro plan (demo, no charge)"
        onClick={() => gameActions.setPlan(pro ? 'free' : 'pro')}
      >
        <span className={styles.opt} data-on={!pro || undefined}>Free</span>
        <span className={styles.opt} data-on={pro || undefined} data-pro>Pro</span>
      </button>
    </div>
  );
}
