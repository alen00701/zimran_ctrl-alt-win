import { useState } from 'react';
import { exerciseId } from '@/shared/fixtures/ids';
import { POINTS_FOR_FIRST_CORRECT } from '@/shared/contracts/catalog';
import { scoreboardActions, scoreKey, useGuestSlice } from '@/shared/state';
import { Button, CoachPrompt, OptionCard } from '@/shared/ui';
import { Pitch } from '../Pitch';
import { laneStatuses } from '../logic/geometry';
import type { Lesson, QuizAnswer } from '../types';
import styles from '../Lesson.module.css';

type Status = 'idle' | 'wrong' | 'right';

/**
 * One quiz per lesson. Only the FIRST submitted answer can earn points (recordFirstAttempt),
 * so retries and refreshes never add to the score.
 */
export function QuizStep({
  lesson,
  saved,
  onAnswer,
}: {
  lesson: Lesson;
  saved: QuizAnswer | undefined;
  onAnswer: (a: QuizAnswer) => void;
}) {
  const { quiz } = lesson;
  const exId = exerciseId.lessonStep(lesson.id, 'quiz');
  const record = useGuestSlice('scoreboard').records[scoreKey('soccer', exId)];

  const [selected, setSelected] = useState<string | null>(saved?.selected ?? null);
  const [status, setStatus] = useState<Status>(saved ? (saved.correct ? 'right' : 'wrong') : 'idle');
  const [attempts, setAttempts] = useState(saved?.attempts ?? 0);
  const [firstChoice, setFirstChoice] = useState(saved?.firstChoice ?? '');
  const [awardedNow, setAwardedNow] = useState(false);

  const locked = status === 'right';

  const check = () => {
    if (!selected) return;
    const correct = selected === quiz.correctId;
    // Always routed through the scoreboard: it ignores everything but the first attempt.
    const result = scoreboardActions.recordFirstAttempt('soccer', exId, correct);
    const n = attempts + 1;
    const first = firstChoice || selected;
    setAttempts(n);
    setFirstChoice(first);
    setAwardedNow(result.awarded > 0);
    setStatus(correct ? 'right' : 'wrong');
    onAnswer({ selected, firstChoice: first, correct, attempts: n });
  };

  const diagram = quiz.diagram;

  let feedback = '';
  if (status === 'right') {
    if (awardedNow) feedback = `Nice read! +${POINTS_FOR_FIRST_CORRECT} points for getting it right first time.`;
    else if ((record?.points ?? 0) > 0) feedback = `Correct again. Your ${record?.points} points for this question are already saved.`;
    else feedback = 'Correct! Only your first answer earns points, so none this time. You can replay the lesson any time.';
  } else if (status === 'wrong') {
    feedback = 'Not quite. Look back at the story and try again. Only your first answer earns points.';
  }

  return (
    <div className={styles.stack}>
      <p className={styles.question} id={`q-${lesson.id}`}>
        {quiz.question}
      </p>
      {diagram && (
        <Pitch
          label="Quiz setup: passer, three teammates and two defenders"
          passer={diagram.passer}
          receivers={diagram.receivers}
          defenders={diagram.defenders}
        />
      )}
      <div className={styles.options} role="radiogroup" aria-labelledby={`q-${lesson.id}`}>
        {quiz.options.map((o) => (
          <OptionCard
            key={o.id}
            mode="single"
            name={`quiz-${lesson.id}`}
            value={o.id}
            label={o.label}
            selected={selected === o.id}
            onChange={(v) => {
              if (locked) return;
              setSelected(v);
              if (status === 'wrong') setStatus('idle');
            }}
          />
        ))}
      </div>
      {status !== 'right' && (
        <Button size="lg" block disabled={!selected || status === 'wrong'} onClick={check}>
          Check answer
        </Button>
      )}
      {feedback && (
        <div role="status">
          <CoachPrompt tone={status === 'right' ? 'success' : 'danger'} state={status === 'right' ? 'correct' : 'incorrect'}>
            {feedback}
          </CoachPrompt>
        </div>
      )}
      {/* Tactical lessons: reveal what the diagram showed once answered correctly */}
      {status === 'right' && diagram && (
        <p className={styles.muted}>
          Open lane: {laneStatuses(diagram.passer, diagram.receivers, diagram.defenders, diagram.blockRadius).filter((l) => !l.blocked).map((l) => l.label).join(', ')}.
        </p>
      )}
    </div>
  );
}
