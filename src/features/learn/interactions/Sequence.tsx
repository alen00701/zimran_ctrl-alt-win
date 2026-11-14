import { useState } from 'react';
import { Button } from '@/shared/ui';
import { isSequenceSolved, isValidOrder, moveItem, sequenceCorrectCount } from '../logic/interactions';
import type { InteractionProps, SequenceSpec } from '../types';
import styles from './Interactions.module.css';

export function Sequence({ spec, saved, onChange }: InteractionProps<SequenceSpec>) {
  const savedOrder = saved?.state?.order;
  const [order, setOrder] = useState<string[]>(isValidOrder(spec, savedOrder) ? savedOrder : spec.initialOrder);
  const [solved, setSolved] = useState(Boolean(saved?.solved));
  const [checked, setChecked] = useState<null | number>(null);

  const label = (id: string) => spec.items.find((i) => i.id === id)?.label ?? id;

  const move = (from: number, to: number) => {
    const next = moveItem(order, from, to);
    if (next === order) return;
    setOrder(next);
    setChecked(null);
    onChange({ solved, state: { order: next } });
  };

  const check = () => {
    const ok = isSequenceSolved(spec, order);
    setChecked(sequenceCorrectCount(spec, order));
    if (ok) {
      setSolved(true);
      onChange({ solved: true, state: { order } });
    }
  };

  return (
    <div className={styles.stack}>
      <p className={styles.prompt}>{spec.prompt}</p>
      <ol className={styles.sequence}>
        {order.map((id, idx) => {
          const wrong = checked !== null && !solved && spec.items[idx]?.id !== id;
          return (
            <li key={id} className={styles.seqItem} data-wrong={wrong || undefined} data-solved={solved || undefined}>
              <span className={styles.seqNum} aria-hidden="true">
                {idx + 1}
              </span>
              <span className={styles.seqLabel}>{label(id)}</span>
              {!solved && (
                <span className={styles.seqBtns}>
                  <button type="button" className={styles.stepBtn} onClick={() => move(idx, idx - 1)} disabled={idx === 0} aria-label={`Move up: ${label(id)}`}>
                    ↑
                  </button>
                  <button type="button" className={styles.stepBtn} onClick={() => move(idx, idx + 1)} disabled={idx === order.length - 1} aria-label={`Move down: ${label(id)}`}>
                    ↓
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {solved ? (
        <p className={styles.solved} role="status">
          ✓ {spec.solvedMessage}
        </p>
      ) : (
        <>
          <div className={styles.row}>
            <Button onClick={check}>Check order</Button>
          </div>
          <p className={styles.muted} role="status">
            {checked === null ? 'Use the arrows to reorder, then check.' : `${checked} of ${spec.items.length} in the right spot. Keep going.`}
          </p>
        </>
      )}
    </div>
  );
}
