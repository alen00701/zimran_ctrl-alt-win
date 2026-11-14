import type { ReactNode } from 'react';
import styles from './OptionCard.module.css';

export interface OptionCardProps {
  /** 'single' renders a radio, 'multi' a checkbox. Both are native inputs (keyboard-accessible). */
  mode: 'single' | 'multi';
  /** Shared input name for a group. */
  name: string;
  value: string;
  label: ReactNode;
  selected: boolean;
  onChange: (value: string) => void;
  /** Left glyph, e.g. an emoji tile (reference: flags in the Duolingo course list). */
  leading?: ReactNode;
  /** Right-side muted tag (reference: "Лёгкая / Обычная" in the daily-goal list). */
  trailing?: ReactNode;
}

/** Selectable row from the Duolingo onboarding lists, in BALLR colors. */
export function OptionCard({ mode, name, value, label, selected, onChange, leading, trailing }: OptionCardProps) {
  return (
    <label className={styles.card} data-selected={selected || undefined}>
      <input
        className={styles.input}
        type={mode === 'single' ? 'radio' : 'checkbox'}
        name={name}
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
      />
      {leading != null && (
        <span className={styles.leading} aria-hidden="true">
          {leading}
        </span>
      )}
      <span className={styles.label}>{label}</span>
      {trailing != null && <span className={styles.trailing}>{trailing}</span>}
      {mode === 'multi' && (
        <span className={styles.check} aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14">
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </label>
  );
}
