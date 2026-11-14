import type { ReactNode } from 'react';
import { BrandAvatar, type BrandAvatarSize, type BrandAvatarState } from '../brand';
import styles from './CoachPrompt.module.css';

export interface CoachPromptProps {
  children: ReactNode;
  /** Render the bubble text as a heading (onboarding questions use 1). */
  headingLevel?: 1 | 2 | 3;
  avatarSize?: BrandAvatarSize | number;
  state?: BrandAvatarState;
  /** Feedback tone of the bubble border. */
  tone?: 'neutral' | 'success' | 'danger';
  id?: string;
}

/**
 * Avatar + speech bubble. Replaces the owl + bubble from the Duolingo references.
 * Use for onboarding questions, lesson feedback and completion.
 */
export function CoachPrompt({ children, headingLevel, avatarSize = 'md', state = 'speaking', tone = 'neutral', id }: CoachPromptProps) {
  const Tag = headingLevel ? (`h${headingLevel}` as const) : 'p';
  return (
    <div className={styles.row} data-tone={tone}>
      <BrandAvatar size={avatarSize} state={state} decorative />
      <div className={styles.bubble}>
        <Tag id={id} className={styles.text}>
          {children}
        </Tag>
      </div>
    </div>
  );
}
