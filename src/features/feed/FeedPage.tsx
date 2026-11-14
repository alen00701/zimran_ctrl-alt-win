import { Link } from 'react-router';
import { DEMO_EVENT } from '@/shared/fixtures/ids';
import { DEMO_EDITION_DATE } from '@/shared/contracts/catalog';
import { useGuestState, viewedPostCount } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, ButtonLink, Card, CoachPrompt, PageHeader, usePageTitle } from '@/shared/ui';
import { dateLabel, rankStories } from './content';
import { StoryQuiz } from './FeedWidgets';
import styles from './Feed.module.css';

export function FeedPage() {
  const state = useGuestState();
  const ranked = rankStories(state.preferences.interests);
  usePageTitle('Feed');
  return <div className={styles.stack}>
    <PageHeader eyebrow={`The daily edition · ${dateLabel(DEMO_EDITION_DATE)}`} title="A little closer to the game." subtitle="Big moments. Small details. A fresh way to see soccer." />
    <div className={styles.toolbar}><Badge>Always free</Badge><span>{viewedPostCount(state)} stories read</span><Link to={routes.onboarding({ returnTo: routes.feed(), edit: true })}>Tune your interests</Link></div>
    <CoachPrompt avatarSize="sm">{state.preferences.interests.length ? 'Your interests lead the lineup. There’s always room for a surprise.' : 'Start with a story that catches your eye. After two, try a quick question with me.'}</CoachPrompt>
    <StoryQuiz />
    <div className={styles.grid}>
      {ranked.map((post, i) => <article key={post.id} className={i === 0 ? styles.lead : undefined}>
        <Card className={styles.story}>
          <Link to={routes.feedPost(post.id)} className={styles.art} aria-label={`Read ${post.title}`}>
            <span className={styles.category}>{post.category}</span><strong className={styles.stat}>{post.stat}</strong><span>{post.caption} <span aria-hidden="true">↗</span></span>
          </Link>
          <div className={styles.body}>
            <div className={styles.toolbar}><Badge>{post.preview ? 'Preview' : 'From the archive'}</Badge>{state.feed.views[post.id] && <Badge variant="success">Read</Badge>}{post.clip && <Badge>Original footage</Badge>}</div>
            <h2><Link to={routes.feedPost(post.id)}>{post.title}</Link></h2>
            <p>{post.summary}</p>
            <p className={styles.meta}>Event: <time dateTime={post.date}>{dateLabel(post.date)}</time> · Source publisher: {post.publisher}</p>
            <div className={styles.toolbar}><Link to={routes.feedPost(post.id)}>Read story →</Link><a href={post.sourceUrl} target="_blank" rel="noreferrer">Source ↗</a></div>
          </div>
        </Card>
      </article>)}
    </div>
    <Card variant="brand" className={styles.stack}>
      <div className={styles.toolbar}><Badge variant="sponsored">Promoted</Badge><Badge variant="demo">Demo event</Badge></div>
      <h2>A good game deserves good company.</h2><p>{DEMO_EVENT.title}</p>
      <p>November 19 · Doors at 7:00 PM ET · {DEMO_EVENT.venueName}, Orlando · Free admission</p>
      <p>Fictional venue and placement. No club or league partnership.</p>
      <ButtonLink to={routes.event(DEMO_EVENT.id)} variant="inverse">Explore the watch party →</ButtonLink>
    </Card>
    <Card className={styles.stack}>
      <Badge variant="sponsored">Sponsored · demo placement</Badge>
      <h2>Wear your weekend ritual.</h2><p>Touchline Goods’ “One More Match” scarf. A fictional merch concept from a fictional sponsor.</p>
      <details><summary>View merch details</summary><p>A soft knit scarf with an original soccer-inspired design. Illustrative price: $24. No checkout, stock or purchase is available in this demo.</p></details>
    </Card>
    <p className={styles.meta}>Published by The Touchline Desk, a fictional independent editorial publisher. Summaries are original; source reporting belongs to the credited publishers. No affiliation is implied.</p>
  </div>;
}
