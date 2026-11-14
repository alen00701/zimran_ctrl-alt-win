import fullUrl from './assets/ballr-logo.png';
import markUrl from './assets/ballr-mark.png';
import styles from './BrandLogo.module.css';

export const BRAND_NAME = 'BALLR';

/** The BALLR logo. `full` is the mark plus the wordmark (3:1); `mark` is the planet B alone (1:1). Always set by height. */
export function BrandLogo({ variant = 'full', height = 32, className, decorative = false }: { variant?: 'full' | 'mark'; height?: number; className?: string; decorative?: boolean }) {
  const ratio = variant === 'full' ? 3 : 1;
  return (
    <img
      className={[styles.logo, className].filter(Boolean).join(' ')}
      src={variant === 'full' ? fullUrl : markUrl}
      width={height * ratio}
      height={height}
      alt={decorative ? '' : BRAND_NAME}
      aria-hidden={decorative || undefined}
      draggable={false}
      decoding="async"
    />
  );
}
