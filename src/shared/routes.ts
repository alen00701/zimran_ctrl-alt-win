/**
 * Named routes. Use these builders for every cross-tab link; never hand-write paths.
 * Route patterns are registered once in src/app/App.tsx.
 */
export const paths = {
  onboarding: '/',
  feed: '/feed',
  feedPost: '/feed/:postId',
  learn: '/learn',
  lesson: '/learn/:lessonId',
  community: '/community',
  event: '/community/events/:eventId',
  account: '/account',
} as const;

const enc = encodeURIComponent;

export const routes = {
  /** Onboarding. `returnTo` sends the visitor back (e.g. to a shared article) when done. */
  onboarding: (opts?: { returnTo?: string; edit?: boolean }) => {
    const q = new URLSearchParams();
    if (opts?.returnTo) q.set('returnTo', opts.returnTo);
    if (opts?.edit) q.set('edit', '1');
    const s = q.toString();
    return s ? `/?${s}` : '/';
  },
  feed: () => '/feed',
  feedPost: (postId: string) => `/feed/${enc(postId)}`,
  learn: () => '/learn',
  lesson: (lessonId: string) => `/learn/${enc(lessonId)}`,
  community: () => '/community',
  event: (eventId: string) => `/community/events/${enc(eventId)}`,
  account: () => '/account',
} as const;

export type TabId = 'feed' | 'learn' | 'community' | 'account';

export const TABS: ReadonlyArray<{ id: TabId; label: string; to: string }> = [
  { id: 'feed', label: 'Feed', to: paths.feed },
  { id: 'learn', label: 'Learn', to: paths.learn },
  { id: 'community', label: 'Community', to: paths.community },
  { id: 'account', label: 'Account', to: paths.account },
];

/** Only relative in-app paths are accepted as `returnTo`, to avoid open redirects. */
export function safeReturnTo(value: string | null | undefined): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
  return value;
}
