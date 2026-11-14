import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { routes } from '@/shared/routes';
import type { ViewNode } from '../logic/path';
import { QUIZ_PASS_MARK } from '../catalog/rulesBasics';
import { Icon, type IconName } from './icons';
import { PathMascot, type MascotPose } from './PathMascot';
import styles from './Path.module.css';

const STATE_LABEL: Record<ViewNode['state'], string> = {
  done: 'completed',
  open: 'available',
  'in-progress': 'in progress',
  'locked-order': 'locked',
  'locked-rules': 'locked until Rules basics is passed',
  'locked-level': 'locked until this level is unlocked',
  'locked-members': 'members only',
  soon: 'coming soon',
};

function iconFor(n: ViewNode): IconName {
  if (n.kind === 'soon') return 'dots';
  if (n.state === 'locked-members') return 'crown';
  if (n.state.startsWith('locked')) return 'lock';
  if (n.kind === 'quiz') return 'trophy';
  if (n.state === 'done') return 'check';
  if (n.active) return 'play';
  return 'star';
}

/** One island on the winding path. `x` is the horizontal step (-2..2). */
export function PathNode({ node, x, onLocked, mascot }: { node: ViewNode; x: number; onLocked: (msg: string) => void; mascot?: { pose: MascotPose; side: 'left' | 'right'; dim?: boolean } }) {
  const callout = node.active ? (node.kind === 'quiz' ? 'Quiz' : node.state === 'in-progress' ? 'Continue' : 'Start') : null;
  const label = `${node.title}, ${STATE_LABEL[node.state]}${node.score !== undefined ? `, best score ${node.score} of 10` : ''}`;
  const locked = node.state.startsWith('locked') || node.state === 'soon';
  const style = { '--x': x } as CSSProperties;

  const body = (
    <>
      <span className={styles.nodeFace}>
        <Icon name={iconFor(node)} size={node.kind === 'quiz' ? 34 : 30} />
      </span>
      {node.kind === 'quiz' && node.score !== undefined && (
        <span className={styles.stars} aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <span key={i} data-on={node.score! >= [QUIZ_PASS_MARK, 9, 10][i - 1]! || undefined}>
              <Icon name="star" size={18} />
            </span>
          ))}
        </span>
      )}
    </>
  );

  return (
    <li className={styles.nodeRow} style={style}>
      {callout && (
        <span className={styles.callout} aria-hidden="true">
          {callout}
        </span>
      )}
      {locked ? (
        <button
          type="button"
          className={styles.node}
          data-kind={node.kind}
          data-state={node.state}
          aria-label={label}
          onClick={() => onLocked(node.lockReason ?? 'More lessons in this block are coming soon.')}
        >
          {body}
        </button>
      ) : (
        <Link
          to={routes.lesson(node.id)}
          id={node.active ? 'path-active' : undefined}
          className={styles.node}
          data-kind={node.kind}
          data-state={node.state}
          data-active={node.active || undefined}
          aria-label={label}
        >
          {body}
        </Link>
      )}
      {mascot && <PathMascot {...mascot} />}
    </li>
  );
}
