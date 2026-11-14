import { BrandAvatar, type BrandAvatarState } from '@/shared/brand';
import styles from './Path.module.css';

/**
 * The team avatar beside the path. The supplied artwork has ONE pose (and a logo that must never be mirrored),
 * so the pose is told by motion and by props drawn beside it: waving lines, a thought bubble, sparkles, a trophy.
 */
export type MascotPose = 'wave' | 'think' | 'cheer' | 'trophy';

const STATE: Record<MascotPose, BrandAvatarState> = { wave: 'speaking', think: 'thinking', cheer: 'celebrate', trophy: 'celebrate' };
const NAME: Record<MascotPose, string> = { wave: 'waving hello', think: 'thinking', cheer: 'cheering you on', trophy: 'celebrating with a trophy' };

function Props({ pose }: { pose: MascotPose }) {
  if (pose === 'wave')
    return (
      <svg className={styles.prop} data-pose="wave" viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
        <path d="M6 20c4-1 8-5 9-10M12 24c6-1 11-7 12-14M18 26c4-1 7-3 9-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  if (pose === 'think')
    return (
      <svg className={styles.prop} data-pose="think" viewBox="0 0 34 34" width="34" height="34" aria-hidden="true">
        <circle cx="5" cy="29" r="2.2" fill="currentColor" />
        <circle cx="10" cy="22" r="3" fill="currentColor" />
        <rect x="12" y="2" width="20" height="17" rx="8.5" fill="var(--color-surface)" stroke="currentColor" strokeWidth="2" />
        <text x="22" y="15" textAnchor="middle" fontSize="13" fontWeight="800" fill="currentColor">?</text>
      </svg>
    );
  if (pose === 'cheer')
    return (
      <svg className={styles.prop} data-pose="cheer" viewBox="0 0 34 34" width="34" height="34" aria-hidden="true">
        <path d="M10 2l2.2 6.3 6.3 2.2-6.3 2.2L10 19l-2.2-6.3L1.5 10.5l6.3-2.2Z" fill="currentColor" />
        <path d="M26 16l1.5 4.2 4.2 1.5-4.2 1.5L26 27.4l-1.5-4.2-4.2-1.5 4.2-1.5Z" fill="currentColor" opacity=".7" />
        <path d="M24 3v6M21 6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg className={styles.prop} data-pose="trophy" viewBox="0 0 40 44" width="40" height="44" aria-hidden="true">
      <path d="M12 4h16v10c0 6-4 10-8 10s-8-4-8-10V4Z" fill="#f2b705" stroke="var(--color-pro)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 7H5c0 6 3 9 8 10M28 7h7c0 6-3 9-8 10" fill="none" stroke="var(--color-pro)" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 24v7M13 38h14M15 31h10v7H15Z" fill="#f2b705" stroke="var(--color-pro)" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="3" cy="3" r="2" fill="currentColor" /><circle cx="37" cy="26" r="2" fill="currentColor" opacity=".7" /><circle cx="6" cy="30" r="1.6" fill="currentColor" opacity=".7" />
    </svg>
  );
}

/** Sits beside a node, on the side away from the path, so it never covers a lesson button. */
export function PathMascot({ pose, side, dim }: { pose: MascotPose; side: 'left' | 'right'; dim?: boolean }) {
  return (
    <span className={styles.mascot} data-pose={pose} data-side={side} data-dim={dim || undefined} aria-hidden="true" title={`The coach, ${NAME[pose]}`}>
      <BrandAvatar size="fill" state={STATE[pose]} decorative className={styles.mascotImg} />
      <Props pose={pose} />
    </span>
  );
}
