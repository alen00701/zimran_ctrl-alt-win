import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { exerciseId } from '@/shared/fixtures/ids';
import { routes } from '@/shared/routes';
import { guestRecords, scoreboardActions, useGuestState } from '@/shared/state';
import { Button, ButtonLink, Card, CoachPrompt, OptionCard, ProgressBar, usePageTitle } from '@/shared/ui';
import { QUIZ_PASS_MARK, RULES_BLOCK_ID, RULES_DRILLS, RULES_QUIZ } from './catalog/rulesBasics';
import { passes, quizScore, readRules, type QuizRun } from './logic/path';
import { rulesActions } from './logic/rulesActions';
import styles from './Lesson.module.css';

const PATH = `${routes.learn()}?level=beginner`;
const FRESH: QuizRun = { index: 0, answers: {}, finished: false };

/**
 * 10-question capstone quiz for Rules basics. Counter + progress bar, instant feedback,
 * results with a 7/10 pass mark and Retry. The run is saved, so a reload resumes the same question.
 * Points: each question scores only on its very first attempt, ever.
 */
export function BlockQuizPage() {
  usePageTitle('Rules basics quiz');
  const state = useGuestState();
  const rules = readRules(state.course);
  const allDrillsDone = RULES_DRILLS.every((d) => rules.done.has(d.id));
  const run = rules.run ?? FRESH;
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (allDrillsDone && !rules.run) rulesActions.saveRun(FRESH);
  }, [allDrillsDone, rules.run]);

  if (!allDrillsDone) {
    return (
      <div className={styles.stack}>
        <CoachPrompt headingLevel={1} state="thinking">
          Finish all ten Rules basics lessons to unlock the block quiz.
        </CoachPrompt>
        <ButtonLink to={PATH}>Back to the path</ButtonLink>
      </div>
    );
  }

  const top = (
    <div className={styles.top}>
      <Link to={PATH} className={styles.back} aria-label="Back to the path">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path d="M20 12H5m6-7-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <ProgressBar
        value={run.finished ? 1 : (run.index + (RULES_QUIZ[run.index] && run.answers[RULES_QUIZ[run.index]!.id] ? 1 : 0)) / RULES_QUIZ.length}
        label="Quiz progress"
      />
    </div>
  );

  /* ---------- results ---------- */
  if (run.finished) {
    const score = quizScore(run.answers);
    const ok = passes(score);
    const blockPoints = guestRecords(state)
      .filter((r) => r.exerciseId.startsWith(`learn:${RULES_BLOCK_ID}:`))
      .reduce((s, r) => s + r.points, 0);
    return (
      <div className={styles.page}>
        {top}
        <header className={styles.header}>
          <p className={styles.eyebrow}>Rules basics · results</p>
          <h1 className={styles.title}>
            {score}/{RULES_QUIZ.length} correct
          </h1>
        </header>
        <div className={styles.stepWrap}>
          <CoachPrompt tone={ok ? 'success' : 'danger'} state={ok ? 'celebrate' : 'thinking'} avatarSize="lg">
            {ok
              ? 'You passed Rules basics! The whole course is now unlocked.'
              : `So close. You need ${QUIZ_PASS_MARK} of ${RULES_QUIZ.length} to pass. Review the lessons and try again.`}
          </CoachPrompt>
          <Card variant="subtle" className={styles.summaryCard}>
            <p>
              Best score: <strong>{Math.max(rules.quiz?.best ?? 0, score)}/10</strong> · Attempts: {rules.quiz?.attempts ?? 1} · Points from this block:{' '}
              <strong>{blockPoints}</strong>
            </p>
          </Card>
          <div className={styles.row}>
            {ok ? (
              <ButtonLink to={PATH}>Back to the path</ButtonLink>
            ) : (
              <Button
                onClick={() => {
                  setPicked(null);
                  rulesActions.saveRun(FRESH);
                }}
              >
                Retry quiz
              </Button>
            )}
            {ok ? (
              <Button
                variant="ghost"
                onClick={() => {
                  setPicked(null);
                  rulesActions.saveRun(FRESH);
                }}
              >
                Retake for a better score
              </Button>
            ) : (
              <ButtonLink to={PATH} variant="secondary">
                Back to the path
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- question ---------- */
  const q = RULES_QUIZ[run.index] ?? RULES_QUIZ[0]!;
  const answered = run.answers[q.id];
  const correct = answered === q.correctId;
  const current = answered ?? picked;
  const last = run.index === RULES_QUIZ.length - 1;

  const check = () => {
    if (!picked) return;
    scoreboardActions.recordFirstAttempt('soccer', exerciseId.lessonStep(RULES_BLOCK_ID, `quiz-${q.id}`), picked === q.correctId);
    rulesActions.saveRun({ ...run, answers: { ...run.answers, [q.id]: picked } });
  };

  const next = () => {
    setPicked(null);
    if (!last) return rulesActions.saveRun({ ...run, index: run.index + 1 });
    const score = quizScore(run.answers);
    const prev = rules.quiz;
    rulesActions.saveRecord({
      best: Math.max(prev?.best ?? 0, score),
      last: score,
      attempts: (prev?.attempts ?? 0) + 1,
      passed: Boolean(prev?.passed) || passes(score),
    });
    rulesActions.saveRun({ ...run, finished: true });
  };

  return (
    <div className={styles.page}>
      {top}
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          Rules basics quiz · {run.index + 1}/{RULES_QUIZ.length}
        </p>
        <h1 className={styles.title} id={`bq-${q.id}`}>
          {q.question}
        </h1>
      </header>
      <div className={styles.stepWrap}>
        <div className={styles.options} role="radiogroup" aria-labelledby={`bq-${q.id}`}>
          {q.options.map((o) => (
            <OptionCard
              key={o.id}
              mode="single"
              name={`bq-${q.id}`}
              value={o.id}
              label={o.label}
              selected={current === o.id}
              onChange={(v) => {
                if (!answered) setPicked(v);
              }}
            />
          ))}
        </div>
        {answered && (
          <div role="status">
            <CoachPrompt tone={correct ? 'success' : 'danger'} state={correct ? 'correct' : 'incorrect'}>
              {correct ? `Correct! ${q.explain}` : `Not this time. ${q.explain}`}
            </CoachPrompt>
          </div>
        )}
        <div className={styles.dock}>
          <div className={styles.actions}>
            {answered ? (
              <Button onClick={next}>{last ? 'See results' : 'Next question'}</Button>
            ) : (
              <Button onClick={check} disabled={!picked}>
                Check
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
