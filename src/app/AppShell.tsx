import { Suspense } from 'react';
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router';
import { BrandLogo } from '@/shared/brand';
import { TABS, routes } from '@/shared/routes';
import { OutOfHeartsDialog, StatusBar } from '@/shared/ui';
import { TabIcon } from './TabIcon';
import styles from './AppShell.module.css';

/**
 * Responsive shell: bottom tab bar on phones/tablets, left rail on desktop (≥1024px).
 * Exactly four tabs: Feed · Learn · Community · Account.
 */
export function AppShell() {
  const { pathname } = useLocation();
  // The Feed is a full-screen stream that carries its own compact status bar.
  const immersiveFeed = pathname.replace(/\/+$/, '') === routes.feed();
  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <nav className={styles.nav} aria-label="Main">
        <Link to={routes.feed()} className={styles.brand} aria-label="BALLR home">
          <BrandLogo height={44} decorative />
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
          {!immersiveFeed && (
            <div className={styles.status}>
              <Link to={routes.feed()} className={styles.mobileLogo} aria-label="BALLR home">
                <BrandLogo variant="mark" height={36} decorative />
              </Link>
              <StatusBar />
            </div>
          )}
          <Suspense fallback={<p className={styles.loading}>Loading…</p>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <OutOfHeartsDialog />
      <ScrollRestoration />
    </div>
  );
}
