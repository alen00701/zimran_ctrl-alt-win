import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { exerciseId } from '@/shared/fixtures/ids';
import { routes } from '@/shared/routes';
import { scoreboardActions, useGuestSlice } from '@/shared/state';
import { Button, ButtonLink, Card, CoachPrompt, OptionCard, ProgressBar, usePageTitle } from '@/shared/ui';
import { RULES_BLOCK_ID, RULES_DRILLS, type Drill } from './catalog/rulesBasics';
import { readRules } from './logic/path';
import { Illustration } from './art/Illustration';
import { rulesActions } from './logic/rulesActions';
import styles from './Lesson.module.css';

const PATH = `${routes.learn()}?level=beginner`;

/** One short Rules basics lesson: content, key rule, a check question, then "Complete lesson". */
export function DrillPage({ drill }: { drill: Drill }) {
  usePageTitle(drill.title);
  const course = useGuestSlice('course');
  const navigate = useNavigate();
  const rules = readRules(course);
  const index = RULES_DRILLS.findIndex((d) => d.id === drill.id);
  const prevDone = index === 0 || rules.done.has(RULES_DRILLS[index - 1]!.id);
  const done = rules.done.has(drill.id);

  const saved = course.lessons[RULES_BLOCK_ID]?.answers[`check:${drill.id}`] as { selected?: string; correct?: boolean } | undefined;
  const [selected, setSelected] = useState<string | null>(saved?.selected ?? null);
  const [status, setStatus] = useState<'idle' | 'right' | 'wrong'>(saved?.correct ? 'right' : saved ? 'wrong' : 'idle');
  const [awarded, setAwarded] = useState(false);

  useEffect(() => {
    if (prevDone) rulesActions.open();
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
          One step at a time. Finish the previous Rules basics lesson first.
        </CoachPrompt>
        <ButtonLink to={PATH}>Back to the path</ButtonLink>
      </div>
    );
  }

  const check = () => {
    if (!selected) return;
    const correct = selected === drill.check.correctId;
    const r = scoreboardActions.recordFirstAttempt('soccer', exerciseId.lessonStep(RULES_BLOCK_ID, `drill-${drill.check.id}`), correct);
    setAwarded(r.awarded > 0);
    setStatus(correct ? 'right' : 'wrong');
    rulesActions.saveCheck(drill.id, selected, correct);
  };

  const complete = () => {
    rulesActions.completeDrill(drill.id, rules.done.size + (done ? 0 : 1));
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
        <ProgressBar value={(index + (status === 'right' ? 1 : 0.5)) / RULES_DRILLS.length} label={`Rules basics, lesson ${index + 1} of ${RULES_DRILLS.length}`} />
      </div>
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          Rules basics · lesson {index + 1} of {RULES_DRILLS.length}
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
