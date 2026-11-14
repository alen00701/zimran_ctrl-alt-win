import { useState } from 'react';
import { Button } from '@/shared/ui';
import { classifyWrongIds, isClassifyComplete, isClassifySolved, type Assignments } from '../logic/interactions';
import type { ClassifySpec, InteractionProps } from '../types';
import styles from './Interactions.module.css';

const asAssignments = (spec: ClassifySpec, v: unknown): Assignments => {
  const out: Assignments = {};
  if (typeof v === 'object' && v !== null) {
    for (const item of spec.items) {
      const b = (v as Record<string, unknown>)[item.id];
      if (typeof b === 'string' && spec.buckets.some((x) => x.id === b)) out[item.id] = b;
    }
  }
  return out;
};

export function Classify({ spec, saved, onChange }: InteractionProps<ClassifySpec>) {
  const [a, setA] = useState<Assignments>(() => asAssignments(spec, saved?.state?.assignments));
  const [solved, setSolved] = useState(Boolean(saved?.solved));
  const [wrong, setWrong] = useState<string[] | null>(null);

  const assign = (itemId: string, bucketId: string) => {
    if (solved) return;
    const next = { ...a, [itemId]: bucketId };
    setA(next);
    setWrong(null);
    onChange({ solved: false, state: { assignments: next } });
  };

  const check = () => {
    const bad = classifyWrongIds(spec, a);
    setWrong(bad);
    if (isClassifySolved(spec, a)) {
      setSolved(true);
      onChange({ solved: true, state: { assignments: a } });
    }
  };

  return (
    <div className={styles.stack}>
      <p className={styles.prompt}>{spec.prompt}</p>
      <ul className={styles.classify}>
        {spec.items.map((item) => {
          const isWrong = wrong?.includes(item.id) && !solved;
          return (
            <li key={item.id} className={styles.classItem} data-wrong={isWrong || undefined}>
              <span id={`cl-${item.id}`} className={styles.classLabel}>
                {item.label}
              </span>
              <div className={styles.choices} role="group" aria-labelledby={`cl-${item.id}`}>
                {spec.buckets.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={styles.choice}
                    aria-pressed={a[item.id] === b.id}
                    disabled={solved}
                    onClick={() => assign(item.id, b.id)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              {isWrong && <span className={styles.wrongNote}>Not quite. Try the other group.</span>}
            </li>
          );
        })}
      </ul>
      {solved ? (
        <p className={styles.solved} role="status">
          ✓ {spec.solvedMessage}
        </p>
      ) : (
        <>
          <div className={styles.row}>
            <Button onClick={check} disabled={!isClassifyComplete(spec, a)}>
              Check answers
            </Button>
          </div>
          <p className={styles.muted} role="status">
            {wrong && wrong.length > 0 ? `${spec.items.length - wrong.length} of ${spec.items.length} correct. Fix the marked ones.` : 'Choose a group for every statement.'}
          </p>
        </>
      )}
    </div>
  );
}
