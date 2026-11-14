import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { exerciseId } from '@/shared/fixtures/ids';
import { routes } from '@/shared/routes';
import { gameActions, openOutOfHearts, outOfHearts, scoreboardActions, useGuestSlice } from '@/shared/state';
import { Button, ButtonLink, Card, CoachPrompt, OptionCard, ProgressBar, usePageTitle } from '@/shared/ui';
import { findDrill } from './catalog/path';
import { RULES_BLOCK_ID, type Drill } from './catalog/rulesBasics';
import { readDone } from './logic/path';
import { Illustration } from './art/Illustration';
import { blockActions } from './logic/rulesActions';
import styles from './Lesson.module.css';

/** One short Rules basics lesson: content, key rule, a check question, then "Complete lesson". */
export function DrillPage({ drill }: { drill: Drill }) {
  usePageTitle(drill.title);
  const course = useGuestSlice('course');
  const navigate = useNavigate();
  const found = findDrill(drill.id)!;
  const { block, drills } = found;
  const PATH = `${routes.learn()}?level=${found.level.id}`;
  const isRulesBlock = block.id === RULES_BLOCK_ID;
  const actions = blockActions(block.id, block.title);
  const doneSet = readDone(course, block.id);
  const index = drills.findIndex((d) => d.id === drill.id);
  // Rules basics is taken in order; the other blocks open in any order.
  const prevDone = !isRulesBlock || index === 0 || doneSet.has(drills[index - 1]!.id);
  const done = doneSet.has(drill.id);

  const saved = course.lessons[block.id]?.answers[`check:${drill.id}`] as { selected?: string; correct?: boolean } | undefined;
  const [selected, setSelected] = useState<string | null>(saved?.selected ?? null);
  const [status, setStatus] = useState<'idle' | 'right' | 'wrong'>(saved?.correct ? 'right' : saved ? 'wrong' : 'idle');
  const [awarded, setAwarded] = useState(false);

  useEffect(() => {
    if (prevDone) actions.open();
  }, [prevDone]);

  // Bring coach feedback into view: the illustration can push it below the action bar on phones.
  const feedbackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status !== 'idle') feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [status]);

  if (!prevDone && !done) {
    return (
      <div className={styles.stack}>
        <CoachPrompt headingLevel={1} state="thinking">
          One step at a time. Finish the previous lesson in this block first.
        </CoachPrompt>
        <ButtonLink to={PATH}>Back to the path</ButtonLink>
      </div>
    );
  }

  const check = () => {
    if (!selected) return;
    if (outOfHearts()) return openOutOfHearts();
    const correct = selected === drill.check.correctId;
    if (!correct) gameActions.loseHeart();
    const r = scoreboardActions.recordFirstAttempt('soccer', exerciseId.lessonStep(block.id, `drill-${drill.check.id}`), correct);
    setAwarded(r.awarded > 0);
    setStatus(correct ? 'right' : 'wrong');
    actions.saveCheck(drill.id, selected, correct);
  };

  const complete = () => {
    // Finishing a lesson earns a one-time bonus, so replays and reloads add nothing.
    scoreboardActions.recordFirstAttempt('soccer', exerciseId.lessonStep(drill.id, 'complete'), true);
    actions.completeDrill(drill.id, doneSet.size + (done ? 0 : 1));
    navigate(PATH);
  };

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <Link to={PATH} className={styles.back} aria-label="Back to the path">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M20 12H5m6-7-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <ProgressBar value={(index + (status === 'right' ? 1 : 0.5)) / drills.length} label={`${block.title}, lesson ${index + 1} of ${drills.length}`} />
      </div>
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          {block.title} · lesson {index + 1} of {drills.length}
        </p>
        <h1 className={styles.title}>{drill.title}</h1>
      </header>

      <div className={styles.stepWrap}>
        <Illustration art={drill.art} />
        <div className={styles.prose}>
          {drill.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Card variant="brand">
          <p className={styles.takeawayLabel}>Key rule</p>
          <p className={styles.takeaway}>{drill.keyRule}</p>
        </Card>

        <p className={styles.question} id={`dq-${drill.id}`}>
          Quick check: {drill.check.question}
        </p>
        <div className={styles.options} role="radiogroup" aria-labelledby={`dq-${drill.id}`}>
          {drill.check.options.map((o) => (
            <OptionCard
              key={o.id}
              mode="single"
              name={`drill-${drill.id}`}
              value={o.id}
              label={o.label}
              selected={selected === o.id}
              onChange={(v) => {
                if (status === 'right') return;
                setSelected(v);
                setStatus('idle');
              }}
            />
          ))}
        </div>
        {status !== 'idle' && (
          <div role="status" ref={feedbackRef}>
            <CoachPrompt tone={status === 'right' ? 'success' : 'danger'} state={status === 'right' ? 'correct' : 'incorrect'}>
              {status === 'right' ? (awarded ? `Correct! +10 points. ${drill.check.explain}` : `Correct. ${drill.check.explain}`) : `Not quite. ${drill.check.explain} Try again.`}
            </CoachPrompt>
          </div>
        )}

        <div className={styles.dock}>
          {status !== 'right' && <p className={styles.gateNote}>Answer the quick check to finish this lesson.</p>}
          <div className={styles.actions}>
            {status === 'right' ? (
              <Button onClick={complete}>{done ? 'Back to the path' : 'Complete lesson'}</Button>
            ) : (
              <Button onClick={check} disabled={!selected || status === 'wrong'}>
                Check
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
