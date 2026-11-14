import { useState } from 'react';
import { DEMO_MATCH_ID, exerciseId } from '@/shared/fixtures/ids';
import { feedActions, scoreboardActions, useGuestState } from '@/shared/state';
import { Badge, Button, Card, CoachPrompt, OptionCard } from '@/shared/ui';
import { routes } from '@/shared/routes';
import { editionQuizId, quizStory } from './content';
import styles from './Feed.module.css';

export function StoryQuiz() {
  const { feed } = useGuestState();
  const story = quizStory(feed);
  const outcome = feed.quizzes[editionQuizId];
  if (!story || outcome?.status === 'dismissed') return null;
  return <Card className={styles.stack}>
    <Badge>One-minute check · optional</Badge>
    <CoachPrompt avatarSize="sm">{outcome?.status === 'answered' ? (outcome.correct ? 'You’ve got it!' : 'A good moment to revisit.') : 'Two stories in. What stuck with you?'}</CoachPrompt>
    <p className={styles.meta}>From your reading: {story.title}</p>
    {outcome?.status === 'answered' ? <p role="status">{story.explanation}</p> : <>
      <h2>{story.question}</h2>
      <div className={styles.stack}>{story.options.map((option, i) => <Button key={option} variant="secondary" onClick={() => {
        const correct = i === story.correct;
        feedActions.answerQuiz(editionQuizId, String(i), correct);
        scoreboardActions.recordFirstAttempt('soccer', exerciseId.feedQuiz(editionQuizId), correct);
      }}>{option}</Button>)}</div>
      <Button variant="ghost" onClick={() => feedActions.dismissQuiz(editionQuizId)}>Skip this quiz</Button>
    </>}
  </Card>;
}
export function MatchPick() {
  const { feed } = useGuestState();
  const pick = feed.picks[DEMO_MATCH_ID]?.pick;
  return <Card className={styles.stack}>
    <Badge variant="demo">Your prediction · demo fixture</Badge>
    <fieldset className={styles.stack}><legend>Who gets your pick?</legend>
      {(['home', 'draw', 'away'] as const).map((value, i) => <OptionCard key={value} mode="single" name="match-pick" value={value} label={['Orlando City', 'Draw', 'FC Cincinnati'][i]} selected={pick === value} onChange={() => feedActions.savePick({ matchId: DEMO_MATCH_ID, pick: value })} />)}
    </fieldset>
    <p role="status" className={styles.meta}>{pick ? `Saved: ${pick === 'home' ? 'Orlando City' : pick === 'away' ? 'FC Cincinnati' : 'Draw'}. Change your pick anytime.` : 'Choose to save on this device. This is your opinion, not a match result or a wager.'}</p>
  </Card>;
}
export function ShareStory({ postId }: { postId?: string }) {
  const [message, setMessage] = useState('');
  return <div className={styles.stack}>
    <Button variant="secondary" onClick={async () => {
      const url = postId ? new URL(routes.feedPost(postId), window.location.origin).href : window.location.href;
      try { await navigator.clipboard.writeText(url); setMessage('Story link copied.'); }
      catch { setMessage(`Copy this link: ${url}`); }
    }}>Copy story link</Button>
    {message && <p role="status" className={styles.share}>{message}</p>}
  </div>;
}
export function Reconstruction() {
  const [ready, setReady] = useState(false);
  return <Card variant="subtle" className={styles.stack}>
    <Badge variant="reconstruction">Tactical reconstruction</Badge>
    <h2>Read the restart</h2>
    <p>A simplified diagram, not match footage. Toggle the defense to explore why attention matters.</p>
    <div className={styles.pitch} role="img" aria-label={ready ? 'Defender tracks the receiver; passing lane is covered.' : 'Defender looks away; the corner taker can find the receiver.'}>
      <span className={styles.taker}>Corner</span><span className={styles.receiver}>Origi</span>
      <span className={ready ? styles.covering : styles.defender}>Defender</span><span className={styles.pass} aria-hidden="true">↗</span>
    </div>
    <Button variant="secondary" aria-pressed={ready} onClick={() => setReady(!ready)}>{ready ? 'Let the defender look away' : 'Make the defender track Origi'}</Button>
    <p role="status">{ready ? 'Tracking the receiver makes the easy pass harder.' : 'With attention elsewhere, the passer and receiver have a brief opening.'}</p>
  </Card>;
}
