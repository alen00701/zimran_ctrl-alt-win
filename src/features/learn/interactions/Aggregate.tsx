import { useState } from 'react';
import { aggregate } from '../logic/interactions';
import type { AggregateSpec, InteractionProps } from '../types';
import styles from './Interactions.module.css';

const MAX_GOALS = 9;
const asGoals = (v: unknown, fallback: number) => (typeof v === 'number' && v >= 0 && v <= MAX_GOALS ? v : fallback);

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className={styles.stepper}>
      <button type="button" className={styles.stepBtn} onClick={() => onChange(Math.max(0, value - 1))} disabled={value <= 0} aria-label={`Remove a goal: ${label}`}>
        −
      </button>
      <output className={styles.stepValue} aria-label={`${label}: ${value}`}>
        {value}
      </output>
      <button type="button" className={styles.stepBtn} onClick={() => onChange(Math.min(MAX_GOALS, value + 1))} disabled={value >= MAX_GOALS} aria-label={`Add a goal: ${label}`}>
        +
      </button>
    </div>
  );
}

export function Aggregate({ spec, saved, onChange }: InteractionProps<AggregateSpec>) {
  const [leg2, setLeg2] = useState({ a: asGoals(saved?.state?.a, 0), b: asGoals(saved?.state?.b, 0) });
  const [solved, setSolved] = useState(Boolean(saved?.solved));
  const result = aggregate(spec.leg1, leg2);

  const update = (next: { a: number; b: number }) => {
    setLeg2(next);
    const nowSolved = solved || aggregate(spec.leg1, next).leader === 'b';
    setSolved(nowSolved);
    onChange({ solved: nowSolved, state: next });
  };

  const verdict =
    result.leader === 'b'
      ? `${spec.teamB} lead on aggregate, ${result.totalB}–${result.totalA}.`
      : result.leader === 'a'
        ? `${spec.teamA} still lead on aggregate, ${result.totalA}–${result.totalB}.`
        : `Level on aggregate, ${result.totalA}–${result.totalB}. The competition’s tiebreak rules would decide it.`;

  return (
    <div className={styles.stack}>
      <p className={styles.prompt}>{spec.prompt}</p>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Team</th>
              <th scope="col">Leg 1</th>
              <th scope="col">Leg 2</th>
              <th scope="col">Aggregate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{spec.teamA}</th>
              <td>{spec.leg1.a}</td>
              <td>
                <Stepper label={`${spec.teamA} leg 2 goals`} value={leg2.a} onChange={(a) => update({ ...leg2, a })} />
              </td>
              <td className={styles.total} data-lead={result.leader === 'a' || undefined}>
                {result.totalA}
              </td>
            </tr>
            <tr>
              <th scope="row">{spec.teamB}</th>
              <td>{spec.leg1.b}</td>
              <td>
                <Stepper label={`${spec.teamB} leg 2 goals`} value={leg2.b} onChange={(b) => update({ ...leg2, b })} />
              </td>
              <td className={styles.total} data-lead={result.leader === 'b' || undefined}>
                {result.totalB}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={result.leader === 'b' ? styles.solved : styles.muted} role="status">
        {result.leader === 'b' ? '✓ ' : ''}
        {verdict}
        {solved ? ` ${spec.solvedMessage}` : ''}
      </p>
    </div>
  );
}
