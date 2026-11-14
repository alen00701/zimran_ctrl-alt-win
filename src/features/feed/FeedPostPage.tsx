import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import { SEED_POSTS } from '@/shared/fixtures/ids';
import { feedActions, isOnboarded, useGuestState } from '@/shared/state';
import { routes } from '@/shared/routes';
import { ButtonLink, Card, CoachPrompt, PageHeader } from '@/shared/ui';
import { humanize } from './FeedPage';
import styles from './Feed.module.css';

/** STARTER: opens a shared article link directly, records a unique view, offers personalization afterwards. */
export function FeedPostPage() {
  const { postId = '' } = useParams();
  const { pathname } = useLocation();
  const state = useGuestState();
  const post = SEED_POSTS.find((p) => p.id === postId);

  useEffect(() => {
    if (post) feedActions.markPostViewed(post.id, []);
  }, [post]);

  if (!post) {
    return (
      <div className={styles.stack}>
        <CoachPrompt headingLevel={1} state="thinking">We couldn’t find that story.</CoachPrompt>
        <ButtonLink to={routes.feed()}>Back to Feed</ButtonLink>
      </div>
    );
  }
  return (
    <article className={styles.stack}>
      <PageHeader eyebrow="Story" title={humanize(post.id)} />
      <p>
        <a href={post.sourceUrl} target="_blank" rel="noreferrer">Read the original source ↗</a>
      </p>
      {!isOnboarded(state) && (
        <Card variant="subtle" className={styles.prompt}>
          <p>Want more stories like this?</p>
          <ButtonLink to={routes.onboarding({ returnTo: pathname })} variant="secondary">Personalize my feed</ButtonLink>
        </Card>
      )}
      <ButtonLink to={routes.feed()} variant="ghost">← All stories</ButtonLink>
    </article>
  );
}
