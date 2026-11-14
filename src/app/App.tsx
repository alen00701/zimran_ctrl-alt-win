/**
 * Route registry. Owned by Foundation. Every tab route is registered here once;
 * feature pages are lazy-loaded from each feature's index.tsx.
 */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { paths } from '@/shared/routes';
import { AppShell } from './AppShell';
import { NotFound } from './NotFound';
import { OnboardingPage } from '@/onboarding/OnboardingPage';

const FeedPage = lazy(() => import('@/features/feed').then((m) => ({ default: m.FeedPage })));
const FeedPostPage = lazy(() => import('@/features/feed').then((m) => ({ default: m.FeedPostPage })));
const LearnPage = lazy(() => import('@/features/learn').then((m) => ({ default: m.LearnPage })));
const LessonPage = lazy(() => import('@/features/learn').then((m) => ({ default: m.LessonPage })));
const CommunityPage = lazy(() => import('@/features/community').then((m) => ({ default: m.CommunityPage })));
const EventPage = lazy(() => import('@/features/community').then((m) => ({ default: m.EventPage })));
const AccountPage = lazy(() => import('@/features/account').then((m) => ({ default: m.AccountPage })));

const router = createBrowserRouter([
  { path: paths.onboarding, element: <OnboardingPage /> },
  {
    element: <AppShell />,
    children: [
      { path: paths.feed, element: <FeedPage /> },
      { path: paths.feedPost, element: <FeedPostPage /> },
      { path: paths.learn, element: <LearnPage /> },
      { path: paths.lesson, element: <LessonPage /> },
      { path: paths.community, element: <CommunityPage /> },
      { path: paths.event, element: <EventPage /> },
      { path: paths.account, element: <AccountPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
