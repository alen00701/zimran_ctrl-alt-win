import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { PITCH_H, PITCH_W, clampToPitch, type LaneStatus } from './logic/geometry';
import type { Point, Receiver } from './types';
import styles from './Pitch.module.css';

export interface PitchProps {
  label: string;
  passer: Point;
  receivers: Receiver[];
  defenders: Point[];
  /** When given, passing lanes are drawn: open in green, blocked in red. */
  lanes?: LaneStatus[];
  /** Radius shown around a draggable defender. */
  reach?: number;
  /** Index of the defender the visitor can move. Omit for a static diagram. */
  draggable?: number;
  onMove?: (p: Point) => void;
  onCommit?: (p: Point) => void;
}

const KEY_STEP = 3;

/** Simple top-down tactical diagram. Pointer drag or arrow keys (Shift = bigger steps) move the defender. */
export function Pitch({ label, passer, receivers, defenders, lanes, reach, draggable, onMove, onCommit }: PitchProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const toPitch = (e: PointerEvent): Point | null => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(m.inverse());
    return clampToPitch({ x: p.x, y: p.y });
  };

  const onDown = (e: PointerEvent<SVGGElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus();
  };
  const onPointerMove = (e: PointerEvent<SVGGElement>) => {
    if (!dragging.current) return;
    const p = toPitch(e);
    if (p) onMove?.(p);
  };
  const onUp = (e: PointerEvent<SVGGElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    const p = toPitch(e);
    if (p) onCommit?.(p);
  };
  const onKey = (e: KeyboardEvent<SVGGElement>, current: Point) => {
    const d = e.shiftKey ? KEY_STEP * 3 : KEY_STEP;
    const delta: Record<string, Point> = {
      ArrowLeft: { x: -d, y: 0 },
      ArrowRight: { x: d, y: 0 },
      ArrowUp: { x: 0, y: -d },
      ArrowDown: { x: 0, y: d },
    };
    const step = delta[e.key];
    if (!step) return;
    e.preventDefault();
    const p = clampToPitch({ x: current.x + step.x, y: current.y + step.y });
    onMove?.(p);
    onCommit?.(p);
  };

  return (
    <svg ref={svgRef} className={styles.svg} viewBox={`0 0 ${PITCH_W} ${PITCH_H}`} role="group" aria-label={label}>
      {/* markings */}
      <rect className={styles.line} x="2" y="2" width="96" height="126" rx="2" />
      <rect className={styles.line} x="24" y="2" width="52" height="22" />
      <rect className={styles.line} x="38" y="2" width="24" height="8" />
      <line className={styles.line} x1="2" y1="66" x2="98" y2="66" />

      {/* lanes */}
      {lanes?.map((l) => {
        const r = receivers.find((x) => x.id === l.id);
        if (!r) return null;
        return (
          <line
            key={l.id}
            className={l.blocked ? styles.laneBlocked : styles.laneOpen}
            x1={passer.x}
            y1={passer.y}
            x2={r.at.x}
            y2={r.at.y}
          />
        );
      })}

      {/* receivers */}
      {receivers.map((r) => (
        <g key={r.id}>
          <circle className={styles.receiver} cx={r.at.x} cy={r.at.y} r="4.2" />
          <text className={styles.label} x={r.at.x} y={r.at.y - 7}>
            {r.label}
          </text>
        </g>
      ))}

      {/* passer */}
      <circle className={styles.passer} cx={passer.x} cy={passer.y} r="4.2" />
      <circle className={styles.ball} cx={passer.x} cy={passer.y} r="1.5" />
      <text className={styles.label} x={passer.x} y={passer.y + 10}>
        Passer
      </text>

      {/* defenders */}
      {defenders.map((d, i) => {
        const isDrag = draggable === i;
        return isDrag ? (
          <g
            key={i}
            className={styles.dragGroup}
            tabIndex={0}
            role="group"
            aria-label="Defender. Drag it, or use the arrow keys to move it."
            onPointerDown={onDown}
            onPointerMove={onPointerMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={(e) => onKey(e, d)}
          >
            {reach ? <circle className={styles.reach} cx={d.x} cy={d.y} r={reach} /> : null}
            <circle className={styles.hit} cx={d.x} cy={d.y} r="10" />
            <circle className={styles.defender} cx={d.x} cy={d.y} r="4.2" />
            <text className={styles.defenderText} x={d.x} y={d.y + 1.4}>
              D
            </text>
          </g>
        ) : (
          <g key={i}>
            <circle className={styles.defender} cx={d.x} cy={d.y} r="4.2" />
            <text className={styles.defenderText} x={d.x} y={d.y + 1.4}>
              D
            </text>
          </g>
        );
      })}
    </svg>
  );
}
