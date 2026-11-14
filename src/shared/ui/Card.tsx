import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

/**
 * Surfaces. 'inverse' (black) and 'brand' (purple) echo the value cards in the palette document;
 * 'default' is the white bordered card from the Duolingo lists.
 */
export type CardVariant = 'default' | 'inverse' | 'brand' | 'subtle';

export function Card({ variant = 'default', className, ...rest }: { variant?: CardVariant } & HTMLAttributes<HTMLDivElement>) {
  return <div className={[styles.card, styles[variant], className].filter(Boolean).join(' ')} {...rest} />;
}
