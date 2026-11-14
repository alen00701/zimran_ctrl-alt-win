import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { BrandAvatar } from '@/shared/brand';
import { DEMO_EVENT, exerciseId } from '@/shared/fixtures/ids';
import { feedActions, scoreboardActions, useGuestState } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, Button, ButtonLink, usePageTitle } from '@/shared/ui';
import { dateLabel, editionQuizId, quizStory, rankStreamStories, streamQuizzes, type FeedQuiz, type Story } from './content';
import { MatchPick, ShareStory, StoryQuiz } from './FeedWidgets';
import { storyMedia } from './media';
import styles from './Reels.module.css';

function Icon({ name }: { name: 'share' | 'info' | 'play' | 'pause' | 'up' | 'down' | 'quiz' }) {
  const paths = { share: 'M12 16V3m0 0L7 8m5-5 5 5M5 13v7h14v-7', info: 'M12 11v6m0-10v.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0', play: 'm8 5 11 7-11 7Z', pause: 'M8 5v14M16 5v14', up: 'm6 15 6-6 6 6', down: 'm6 9 6 6 6-6', quiz: 'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 4v.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0' };
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current!; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} className={styles.sheet} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className={styles.sheetHeader}><h2>{title}</h2><Button variant="ghost" onClick={onClose} aria-label="Close panel">✕</Button></div>
    <div className={styles.sheetBody}>{children}</div>
  </dialog>;
}
function QuizReel({ quiz, index, total }: { quiz: FeedQuiz; index: number; total: number }) {
  const { feed } = useGuestState();
  const outcome = feed.quizzes[quiz.id];
  return <article className={`${styles.reel} ${styles.quizReel}`} aria-label={`${index + 1} of ${total}: ${quiz.title}`}>
    <div className={styles.quizContent}>
      <BrandAvatar size="lg" state="thinking" decorative />
      <Badge>Optional · 1 question</Badge>
      <p className={styles.kicker}>You’ve watched a few clips.</p>
      <h2>{outcome?.status === 'answered' ? (outcome.correct ? 'Nice read.' : 'Almost — here’s the detail.') : quiz.prompt}</h2>
      {outcome?.status === 'answered' ? <p role="status">{quiz.explanation}</p> : <div className={styles.quizAnswers}>{quiz.options.map((option, optionIndex) => <Button key={option} variant="inverse" onClick={() => {
        const correct = optionIndex === quiz.correct;
        feedActions.answerQuiz(quiz.id, String(optionIndex), correct);
        scoreboardActions.recordFirstAttempt('soccer', exerciseId.feedQuiz(quiz.id), correct);
      }}>{option}</Button>)}</div>}
      {outcome?.status !== 'answered' && <Button variant="ghost" className={styles.skipQuiz} onClick={() => feedActions.dismissQuiz(quiz.id)}>Not now · keep watching</Button>}
      <span>{outcome ? 'This break will not appear again.' : 'We only put two optional questions in a session.'}</span>
    </div>
  </article>;
}
function Reel({ post, active, open, index, total }: { post: Story; active: boolean; open: (type: 'details' | 'share' | 'quiz', post: Story) => void; index: number; total: number }) {
  const media = storyMedia[post.id]!;
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const state = useGuestState();
  const hasQuiz = !!quizStory(state.feed) && state.feed.quizzes[editionQuizId]?.status !== 'dismissed';
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => feedActions.markPostViewed(post.id, post.tags), 5000);
    return () => clearTimeout(timer);
  }, [active, post]);
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== frame.current?.contentWindow || !['https://www.youtube-nocookie.com', 'https://www.youtube.com'].includes(event.origin)) return;
      try { const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data; if (data.event === 'onError') setFailed(true); } catch { /* Other provider messages are irrelevant. */ }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
  const showVideo = active && media.videoId && playing && !failed;
  return <article className={styles.reel} aria-label={`${index + 1} of ${total}: ${post.title}`}>
    <img className={styles.photo} src={media.image} alt={media.alt} style={{ objectPosition: media.position }} loading={index < 2 ? 'eager' : 'lazy'} />
    <div className={styles.shade} />
    <div className={styles.mediaLabel}>{media.videoId ? '▶ Match clip' : '▧ Photo story'} · {post.category}</div>
    {showVideo && <div className={styles.player}><iframe ref={frame} title={`${post.title} — ${media.credit}`} src={`https://www.youtube-nocookie.com/embed/${media.videoId}?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onLoad={() => frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: post.id }), 'https://www.youtube-nocookie.com')} /><a href={`https://www.youtube.com/watch?v=${media.videoId}`} target="_blank" rel="noreferrer">Not playing? Watch the original ↗</a></div>}
    {media.videoId && !showVideo && <Button variant="ghost" className={styles.play} onClick={() => { setFailed(false); setPlaying(true); }} aria-label={`Play ${post.title}`}><Icon name="play" /></Button>}
    <div className={styles.actions}>
      <div className={styles.avatar}><BrandAvatar size="sm" decorative /></div>
      {media.videoId && <Button variant="ghost" className={styles.action} onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause video' : 'Play video'}><Icon name={playing ? 'pause' : 'play'} /><span>{playing ? 'Pause' : 'Play'}</span></Button>}
      <Button variant="ghost" className={styles.action} onClick={() => open('details', post)} aria-label={`Details for ${post.title}`}><Icon name="info" /><span>Story</span></Button>
      <Button variant="ghost" className={styles.action} onClick={() => open('share', post)} aria-label={`Share ${post.title}`}><Icon name="share" /><span>Share</span></Button>
      {hasQuiz && <Button variant="ghost" className={styles.action} onClick={() => open('quiz', post)} aria-label="Open story quiz"><Icon name="quiz" /><span>Quiz</span></Button>}
    </div>
    <div className={styles.caption}>
      <span className={styles.publisher}>@touchlinedesk <span>· Fictional publisher</span></span>
      <h2>{post.title}</h2><p>{post.summary}</p>
      <div className={styles.captionLinks}><Button variant="ghost" onClick={() => open('details', post)}>{post.preview ? 'Make your pick →' : 'The story behind it →'}</Button>{post.clip && <a href={post.sourceUrl} target="_blank" rel="noreferrer">Watch the original ↗</a>}</div>
      <span className={styles.credit}>{dateLabel(post.date)} · {media.credit}</span>
    </div>
  </article>;
}

type StreamItem =
  | { type: 'post'; key: string; post: Story }
  | { type: 'quiz'; key: string; quiz: FeedQuiz }
  | { type: 'event'; key: string }
  | { type: 'merch'; key: string };

function buildStream(posts: Story[], batchCount: number, quizzes: Record<string, unknown>): StreamItem[] {
  const items: StreamItem[] = [];
  for (let batch = 0; batch < batchCount; batch += 1) {
    let videoCount = 0;
    for (const post of posts) {
      items.push({ type: 'post', key: `${batch}-${post.id}`, post });
      if (storyMedia[post.id]?.videoId) {
        videoCount += 1;
        const quiz = streamQuizzes[(videoCount / 3) - 1];
        if (batch === 0 && videoCount % 3 === 0 && quiz && !quizzes[quiz.id]) items.push({ type: 'quiz', key: quiz.id, quiz });
      }
    }
    if (batch === 0) {
      items.push({ type: 'event', key: 'event' });
      items.push({ type: 'merch', key: 'merch' });
    }
  }
  return items;
}

export function FeedPage() {
  const state = useGuestState();
  const { preferences } = state;
  const interestsKey = preferences.interests.join('|');
  const ranked = useMemo(() => rankStreamStories(preferences.interests), [preferences.interests]);
  const [mode, setMode] = useState<'all' | 'videos'>('all');
  const posts = useMemo(() => mode === 'videos' ? ranked.filter(p => storyMedia[p.id]?.videoId) : ranked, [ranked, mode]);
  const [batchCount, setBatchCount] = useState(2);
  const [active, setActive] = useState(0);
  const [panel, setPanel] = useState<{ type: 'details' | 'share' | 'quiz'; post: Story } | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const stream = useMemo(() => buildStream(posts, batchCount, state.feed.quizzes), [posts, batchCount, state.feed.quizzes]);
  const total = stream.length;
  usePageTitle('For you');
  useEffect(() => { setActive(0); setBatchCount(2); viewport.current?.scrollTo({ top: 0 }); }, [mode, interestsKey]);
  useEffect(() => { if (active >= stream.length - 4) setBatchCount(count => count + 1); }, [active, stream.length]);
  const move = (direction: number) => {
    const target = Math.max(0, Math.min(total - 1, active + direction));
    viewport.current?.scrollTo({ top: target * viewport.current.clientHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const open = (type: 'details' | 'share' | 'quiz', post: Story) => { if (type === 'details') feedActions.markPostViewed(post.id, post.tags); setPanel({ type, post }); };
  return <section className={styles.experience} aria-label="Soccer media feed">
    <div className={styles.stage}>
      <header className={styles.topbar}><h1 className={styles.srOnly}>Your soccer feed</h1><div className={styles.tabs}><Button variant="ghost" className={mode === 'all' ? styles.selected : ''} aria-pressed={mode === 'all'} onClick={() => setMode('all')}>For you</Button><Button variant="ghost" className={mode === 'videos' ? styles.selected : ''} aria-pressed={mode === 'videos'} onClick={() => setMode('videos')}>Videos</Button></div><Link to={routes.onboarding({ returnTo: routes.feed(), edit: true })} aria-label="Personalize your feed">Tune ↗</Link></header>
      <div className={styles.viewport} ref={viewport} tabIndex={0} aria-label="Swipe up for the next story, or use arrow keys" onScroll={e => setActive(Math.round(e.currentTarget.scrollTop / e.currentTarget.clientHeight))} onKeyDown={e => { if (e.target !== e.currentTarget || !['ArrowDown', 'ArrowUp'].includes(e.key)) return; e.preventDefault(); move(e.key === 'ArrowDown' ? 1 : -1); }}>
        {stream.map((item, index) => {
          if (item.type === 'post') return <Reel key={item.key} post={item.post} active={active === index && !panel} open={open} index={index} total={total} />;
          if (item.type === 'quiz') return <QuizReel key={item.key} quiz={item.quiz} index={index} total={total} />;
          if (item.type === 'event') return <article key={item.key} className={`${styles.reel} ${styles.promotion}`} aria-label="Promoted watch party"><img className={styles.photo} src={storyMedia[ranked.find(p => p.preview)!.id]!.image} alt="MLS Cup Playoffs trophy" loading="lazy" /><div className={styles.shade} /><div className={styles.promoContent}><Badge variant="sponsored">Promoted · Demo event</Badge><h2>Better<br />together.</h2><p>Orlando City × FC Cincinnati</p><p>Nov 19 · Doors 7 PM ET<br />The Far Post Taproom · Orlando<br />Free admission</p><ButtonLink to={routes.event(DEMO_EVENT.id)}>Find your matchday people →</ButtonLink><small>Fictional venue. No league affiliation. Doors time is not kickoff.</small></div></article>;
          return <article key={item.key} className={`${styles.reel} ${styles.merch}`} aria-label="Sponsored merchandise"><div className={styles.scarf} aria-hidden="true"><span>ONE MORE</span><span>MATCH</span><span>TOUCHLINE GOODS</span></div><div className={styles.promoContent}><Badge variant="sponsored">Sponsored · Fictional brand</Badge><h2>Your weekend.<br />Your colors.</h2><p>The One More Match scarf · $24 demo price</p><details><summary>See the drop ↗</summary><p>Original knit scarf concept. Demo merchandise only — no checkout or stock is available.</p></details></div></article>;
        })}
      </div>
      <div className={styles.progress} aria-hidden="true">{Array.from({ length: total }, (_, i) => <span key={i} className={i === active ? styles.current : ''} />)}</div>
    </div>
    <aside className={styles.controls} aria-label="Feed navigation"><span>{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span><Button variant="secondary" onClick={() => move(-1)} disabled={active === 0} aria-label="Previous story"><Icon name="up" /></Button><Button variant="secondary" onClick={() => move(1)} disabled={active === total - 1} aria-label="Next story"><Icon name="down" /></Button><p>Scroll to<br />discover</p><small>Nov 14<br />2026 edition</small></aside>
    {panel && <Sheet title={panel.type === 'details' ? 'Behind the moment' : panel.type === 'quiz' ? 'Your quick quiz' : 'Share this moment'} onClose={() => setPanel(null)}>
      {panel.type === 'details' ? <><Badge>{panel.post.category}</Badge><h3>{panel.post.title}</h3><p>{dateLabel(panel.post.date)} · Source: {panel.post.publisher}</p>{panel.post.paragraphs.map(p => <p key={p}>{p}</p>)}<p><strong>Our take: </strong>{panel.post.take}</p><a href={panel.post.sourceUrl} target="_blank" rel="noreferrer">Original source ↗</a>{panel.post.preview && <MatchPick />}<ButtonLink to={routes.feedPost(panel.post.id)} variant="secondary">Open full story</ButtonLink><StoryQuiz /></> : panel.type === 'quiz' ? <StoryQuiz /> : <><p>{panel.post.title}</p><ShareStory postId={panel.post.id} /></>}
    </Sheet>}
  </section>;
}
