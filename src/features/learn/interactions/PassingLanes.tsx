import { useState } from 'react';
import { Badge, Button } from '@/shared/ui';
import { Pitch } from '../Pitch';
import { laneStatuses, openLanes } from '../logic/geometry';
import type { InteractionProps, PassingLanesSpec, Point } from '../types';
import styles from './Interactions.module.css';

const isPoint = (v: unknown): v is Point =>
  typeof v === 'object' && v !== null && typeof (v as Point).x === 'number' && typeof (v as Point).y === 'number';

export function PassingLanes({ spec, saved, onChange }: InteractionProps<PassingLanesSpec>) {
  const savedPos = saved?.state?.defender;
  const [pos, setPos] = useState<Point>(isPoint(savedPos) ? savedPos : spec.defenderStart);
  const [solved, setSolved] = useState(Boolean(saved?.solved));

  const lanes = laneStatuses(spec.passer, spec.receivers, [pos], spec.blockRadius);
  const goalBlocked = lanes.find((l) => l.id === spec.goalReceiverId)?.blocked ?? false;
  const open = openLanes(lanes);

  const commit = (p: Point) => {
    const blocked = laneStatuses(spec.passer, spec.receivers, [p], spec.blockRadius).find((l) => l.id === spec.goalReceiverId)?.blocked ?? false;
    const nowSolved = solved || blocked;
    setSolved(nowSolved);
    onChange({ solved: nowSolved, state: { defender: p } });
  };

  return (
    <div className={styles.stack}>
      <div className={styles.row}>
        <Badge variant="reconstruction">Tactical reconstruction</Badge>
      </div>
      <p className={styles.prompt}>{spec.prompt}</p>
      <Pitch
        label="Passing lanes diagram"
        passer={spec.passer}
        receivers={spec.receivers}
        defenders={[pos]}
        lanes={lanes}
        reach={spec.blockRadius}
        draggable={0}
        onMove={setPos}
        onCommit={commit}
      />
      <p className={styles.hint}>Drag the defender, or focus it and use the arrow keys.</p>
      <ul className={styles.lanes} aria-live="polite" aria-label="Passing lanes">
        {lanes.map((l) => (
          <li key={l.id} className={styles.lane} data-blocked={l.blocked || undefined}>
            <span>{l.label}</span>
            <Badge variant={l.blocked ? 'danger' : 'success'}>{l.blocked ? 'Blocked' : 'Open'}</Badge>
          </li>
        ))}
      </ul>
      {solved ? (
        <p className={styles.solved} role="status">
          ✓ {spec.solvedMessage}
        </p>
      ) : (
        <p className={styles.muted} role="status">
          {goalBlocked ? 'Nice. Hold it there.' : `${open.length} of ${lanes.length} lanes are open. Try to close the striker’s lane.`}
        </p>
      )}
      <div className={styles.row}>
        <Button
          variant="secondary"
          onClick={() => {
            setPos(spec.defenderStart);
            commit(spec.defenderStart);
          }}
        >
          Reset defender
        </Button>
      </div>
    </div>
  );
}
