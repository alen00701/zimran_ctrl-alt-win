import { Suspense } from 'react';
import { Link, NavLink, Navigate, Outlet, ScrollRestoration, matchPath, useLocation } from 'react-router';
import { BrandLogo } from '@/shared/brand';
import { TABS, paths, routes } from '@/shared/routes';
import { isOnboarded, useGuestState } from '@/shared/state';
import { OutOfHeartsDialog, StatusBar } from '@/shared/ui';
import { TabIcon } from './TabIcon';
import styles from './AppShell.module.css';

/**
 * Responsive shell: bottom tab bar on phones/tablets, left rail on desktop (≥1024px).
 * Exactly four tabs: Feed · Learn · Community · Account.
 */
/** Shared deep links open immediately for first-time visitors; personalization is offered afterward. */
const DEEP_LINKS = [paths.feedPost, paths.event];

export function AppShell() {
  const { pathname, search } = useLocation();
  const state = useGuestState();
  // First visit: show the customization landing (onboarding) before any tab.
  if (!isOnboarded(state) && !DEEP_LINKS.some((p) => matchPath(p, pathname))) {
    const here = pathname.replace(/\/+$/, '') + search;
    return <Navigate to={routes.onboarding(here === routes.feed() ? undefined : { returnTo: here })} replace />;
  }
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
