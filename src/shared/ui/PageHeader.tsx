import { useEffect, type ReactNode } from 'react';
import styles from './PageHeader.module.css';

/** Sets document.title as "<title> · Read the Game". */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · Read the Game` : 'Read the Game';
  }, [title]);
}

export function PageHeader({ title, eyebrow, subtitle, actions }: { title: string; eyebrow?: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  usePageTitle(title);
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
