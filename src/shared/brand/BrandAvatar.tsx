import coachUrl from './assets/coach.png';
import styles from './BrandAvatar.module.css';

/** The supplied artwork has ONE pose. States are communicated by text/layout plus subtle motion. */
export type BrandAvatarState = 'idle' | 'speaking' | 'thinking' | 'correct' | 'incorrect' | 'celebrate';
export type BrandAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
/** 'fill' sizes the avatar to its container (square), for layouts that set the size in CSS. */

const SIZE_PX: Record<BrandAvatarSize, number> = { xs: 32, sm: 48, md: 88, lg: 120, xl: 176 };

export const BRAND_AVATAR_SRC = coachUrl;
/** Width / height of the artwork. Always preserve it. */
export const BRAND_AVATAR_ASPECT = 1;
export const BRAND_AVATAR_NAME = 'Coach';

export interface BrandAvatarProps {
  /** Preset or pixel width. Default 'md' (88px). */
  size?: BrandAvatarSize | number | 'fill';
  /** Drives a subtle CSS motion only; the pose itself never changes. */
  state?: BrandAvatarState;
  /** True when adjacent text already says what the avatar says (hidden from screen readers). */
  decorative?: boolean;
  /** Accessible name when not decorative. */
  label?: string;
  className?: string;
}

export function BrandAvatar({ size = 'md', state = 'idle', decorative = false, label, className }: BrandAvatarProps) {
  const fill = size === 'fill';
  const px = fill ? 0 : typeof size === 'number' ? size : SIZE_PX[size];
  return (
    <span
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-state={state}
      style={fill ? { width: '100%', aspectRatio: String(BRAND_AVATAR_ASPECT) } : { width: px, height: px / BRAND_AVATAR_ASPECT }}
    >
      <img
        className={styles.img}
        src={coachUrl}
        width={fill ? undefined : px}
        height={fill ? undefined : px / BRAND_AVATAR_ASPECT}
        alt={decorative ? '' : (label ?? `${BRAND_AVATAR_NAME}, the BALLR mascot`)}
        aria-hidden={decorative || undefined}
        draggable={false}
        decoding="async"
      />
    </span>
  );
}
