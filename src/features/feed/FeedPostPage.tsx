import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import { DEMO_EVENT } from '@/shared/fixtures/ids';
import { feedActions, isOnboarded, useGuestState } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, ButtonLink, Card, CoachPrompt, PageHeader, usePageTitle } from '@/shared/ui';
import { dateLabel, findStory } from './content';
import { MatchPick, Reconstruction, ShareStory, StoryQuiz } from './FeedWidgets';
import styles from './Feed.module.css';

export function FeedPostPage() {
  const { postId = '' } = useParams();
  const { pathname } = useLocation();
  const state = useGuestState();
  const post = findStory(postId);
  usePageTitle(post?.title ?? 'Story not found');
  useEffect(() => { if (post) feedActions.markPostViewed(post.id, post.tags); }, [post]);
  if (!post) return <div className={styles.stack}><CoachPrompt headingLevel={1} state="thinking">We couldn’t find that story.</CoachPrompt><ButtonLink to={routes.feed()}>Back to Feed</ButtonLink></div>;
  return <article className={styles.article}>
    <ButtonLink to={routes.feed()} variant="ghost">← All stories</ButtonLink>
    <PageHeader eyebrow={`${post.category} · November 14, 2026 edition`} title={post.title} subtitle={post.summary} />
    <p className={styles.meta}>The Touchline Desk · Fictional editorial publisher<br />Event: <time dateTime={post.date}>{dateLabel(post.date)}</time> · Source publisher: {post.publisher}</p>
    <ShareStory key={post.id} />
    <section className={styles.stack}><h2>{post.preview ? 'Confirmed schedule' : 'What happened'}</h2>{post.paragraphs.map(p => <p key={p}>{p}</p>)}<a href={post.sourceUrl} target="_blank" rel="noreferrer">Read the original source at {post.publisher} ↗</a></section>
    {post.clip && <Card variant="inverse" className={styles.stack}><Badge>Official match footage</Badge><h2>See the split-second opening.</h2><p>UEFA’s match page includes footage and a link to the full replay. The original page and replay link were checked on November 14, 2026. Playback may require UEFA sign-in or depend on your region.</p><a className={styles.watch} href={post.sourceUrl} target="_blank" rel="noreferrer">▶ Watch the original ↗</a></Card>}
    <Card variant="subtle" className={styles.stack}><Badge>Editorial perspective</Badge><h2>What to watch for</h2><p>{post.take}</p></Card>
    {post.clip && <Reconstruction />}
    {post.preview && <><MatchPick /><ButtonLink to={routes.event(DEMO_EVENT.id)} variant="secondary">Promoted · Explore the demo watch party</ButtonLink></>}
    {post.lesson && <ButtonLink to={routes.lesson(post.lesson)} variant="secondary">Go deeper with an optional lesson →</ButtonLink>}
    <StoryQuiz />
    {!isOnboarded(state) && <Card className={styles.stack}><CoachPrompt avatarSize="sm">Want more stories like this?</CoachPrompt><ButtonLink to={routes.onboarding({ returnTo: pathname })}>Personalize my feed</ButtonLink></Card>}
    <ButtonLink to={routes.feed()} variant="ghost">← Back to your edition</ButtonLink>
  </article>;
}
