import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { courseActions, useGuestSlice } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Button, ProgressBar, usePageTitle } from '@/shared/ui';
import { CompletionStep } from './steps/CompletionStep';
import { ExplanationStep } from './steps/ExplanationStep';
import { InteractionStep } from './steps/InteractionStep';
import { QuizStep } from './steps/QuizStep';
import { StoryStep } from './steps/StoryStep';
import { STEP_COUNT, STEP_IDS, type InteractionAnswer, type Lesson, type QuizAnswer } from './types';
import styles from './Lesson.module.css';

const STEP_LABELS = ['The story', 'Try it', 'Quiz', 'Why it works'] as const;

/**
 * Plays one lesson. Progress (current step + answers) is saved to the shared guest state on every
 * change, so a reload lands on the exact step. currentStep === STEP_COUNT means finished.
 */
export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const course = useGuestSlice('course');
  const progress = course.lessons[lesson.id];
  const completed = Boolean(progress?.completedAt);
  const rawStep = progress?.currentStep ?? 0;
  const finished = completed && rawStep >= STEP_COUNT;
  const step = Math.min(Math.max(rawStep, 0), STEP_COUNT - 1);

  // A replay of a completed lesson starts fresh. Otherwise restore what was saved.
  const restored = completed ? {} : (progress?.answers ?? {});
  const [replayKey, setReplayKey] = useState(0);
  const [interactionSolved, setInteractionSolved] = useState(() => Boolean((restored['interaction'] as InteractionAnswer | undefined)?.solved));
  const [quizSolved, setQuizSolved] = useState(() => Boolean((restored['quiz'] as QuizAnswer | undefined)?.correct));

  useEffect(() => {
    courseActions.openLesson(lesson.id, lesson.title);
  }, [lesson.id, lesson.title]);

  // Move focus to the step heading when the step changes (not on first render).
  const headingRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, finished]);

  usePageTitle(lesson.title);

  const go = (n: number) => courseActions.setStep(lesson.id, n);
  const canAdvance = step === 1 ? interactionSolved : step === 2 ? quizSolved : true;
  const stepKey = STEP_IDS[step] ?? 'story';

  const replay = () => {
    setInteractionSolved(false);
    setQuizSolved(false);
    setReplayKey((k) => k + 1);
    go(0);
  };

  const finish = () => {
    courseActions.completeLesson(lesson.id);
    go(STEP_COUNT);
  };

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <Link to={routes.learn()} className={styles.back} aria-label="Back to Learn">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M20 12H5m6-7-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <ProgressBar value={finished ? 1 : step / STEP_COUNT} label={`Lesson progress, step ${finished ? STEP_COUNT : step + 1} of ${STEP_COUNT}`} />
      </div>

      <header className={styles.header}>
        <p className={styles.eyebrow}>{finished ? 'Complete' : `Step ${step + 1} of ${STEP_COUNT} · ${STEP_LABELS[step]}`}</p>
        <h1 className={styles.title}>{lesson.title}</h1>
      </header>
      <div ref={headingRef} tabIndex={-1} className={styles.focusAnchor} aria-hidden="true" />

      {finished ? (
        <CompletionStep lesson={lesson} onReplay={replay} />
      ) : (
        <div key={`${stepKey}-${replayKey}`} className={styles.stepWrap}>
          {step === 0 && <StoryStep lesson={lesson} />}
          {step === 1 && (
            <InteractionStep
              lesson={lesson}
              saved={restored['interaction'] as InteractionAnswer | undefined}
              onChange={(a) => {
                courseActions.saveAnswer(lesson.id, 'interaction', a as unknown as Record<string, unknown>);
                setInteractionSolved(a.solved);
              }}
            />
          )}
          {step === 2 && (
            <QuizStep
              lesson={lesson}
              saved={restored['quiz'] as QuizAnswer | undefined}
              onAnswer={(a) => {
                courseActions.saveAnswer(lesson.id, 'quiz', a as unknown as Record<string, unknown>);
                setQuizSolved(a.correct);
              }}
            />
          )}
          {step === 3 && <ExplanationStep lesson={lesson} />}

          <div className={styles.dock}>
            {!canAdvance && (
              <p className={styles.gateNote}>{step === 1 ? 'Finish the activity to continue.' : 'Answer correctly to continue.'}</p>
            )}
            <div className={styles.actions}>
              {step > 0 && (
                <Button variant="secondary" onClick={() => go(step - 1)}>
                  Back
                </Button>
              )}
              {step < STEP_COUNT - 1 ? (
                <Button disabled={!canAdvance} onClick={() => go(step + 1)}>
                  Continue
                </Button>
              ) : (
                <Button onClick={finish}>
                  Finish lesson
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
