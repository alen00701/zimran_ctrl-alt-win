import { Link } from 'react-router';
import { SEED_POSTS, DEMO_EVENT } from '@/shared/fixtures/ids';
import { DEMO_EDITION_DATE } from '@/shared/contracts/catalog';
import { isOnboarded, useGuestState, viewedPostCount } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, ButtonLink, Card, PageHeader } from '@/shared/ui';
import styles from './Feed.module.css';

const editionLabel = new Date(`${DEMO_EDITION_DATE}T12:00:00`).toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});

export const humanize = (id: string) => id.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/** STARTER: Feed owner replaces with the ranked editorial feed. */
export function FeedPage() {
  const state = useGuestState();
  return (
    <>
      <PageHeader eyebrow={`Edition · ${editionLabel}`} title="Feed" subtitle={`${viewedPostCount(state)} stories read`} />
      {!isOnboarded(state) && (
        <Card variant="brand" className={styles.prompt}>
          <p>Tell us what you follow and we’ll put it first.</p>
          <ButtonLink to={routes.onboarding({ returnTo: routes.feed() })} variant="inverse">Personalize</ButtonLink>
        </Card>
      )}
      <ul className={styles.list}>
        {SEED_POSTS.map((p) => (
          <li key={p.id}>
            <Link to={routes.feedPost(p.id)} className={styles.item}>
              <span>{humanize(p.id)}</span>
              {state.feed.views[p.id] && <Badge variant="success">Read</Badge>}
            </Link>
          </li>
        ))}
        <li>
          <Link to={routes.event(DEMO_EVENT.id)} className={styles.item}>
            <span>{DEMO_EVENT.title}</span>
            <Badge variant="sponsored">Promoted</Badge>
          </Link>
        </li>
      </ul>
    </>
  );
}
