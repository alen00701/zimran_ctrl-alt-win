import { Suspense } from 'react';
import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router';
import { BrandAvatar } from '@/shared/brand';
import { TABS, routes } from '@/shared/routes';
import { TabIcon } from './TabIcon';
import styles from './AppShell.module.css';

/**
 * Responsive shell: bottom tab bar on phones/tablets, left rail on desktop (≥1024px).
 * Exactly four tabs: Feed · Learn · Community · Account.
 */
export function AppShell() {
  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <nav className={styles.nav} aria-label="Main">
        <Link to={routes.feed()} className={styles.brand} aria-label="Read the Game home">
          <BrandAvatar size={40} decorative />
          <span className={styles.wordmark}>Read the Game</span>
        </Link>
        <ul className={styles.tabs}>
          {TABS.map((t) => (
            <li key={t.id}>
              <NavLink to={t.to} className={({ isActive }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab)}>
                <TabIcon tab={t.id} />
                <span className={styles.tabLabel}>{t.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main id="main" className={styles.main} tabIndex={-1}>
        <div className={styles.content}>
          <Suspense fallback={<p className={styles.loading}>Loading…</p>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <ScrollRestoration />
    </div>
  );
}
