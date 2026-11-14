import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'inverse' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Full width. */
  block?: boolean;
  children: ReactNode;
}

const cls = (variant: ButtonVariant, size: ButtonSize, block?: boolean, extra?: string) =>
  [styles.btn, styles[variant], styles[size], block && styles.block, extra].filter(Boolean).join(' ');

/** Duolingo-style chunky button with a bottom lip. Use for actions. */
export function Button({
  variant = 'primary',
  size = 'md',
  block,
  className,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cls(variant, size, block, className)} {...rest} />;
}

/** Same look, but navigates. Use for in-app links styled as buttons. */
export function ButtonLink({ variant = 'primary', size = 'md', block, className, ...rest }: CommonProps & LinkProps) {
  return <Link className={cls(variant, size, block, className)} {...rest} />;
}
