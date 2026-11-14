import type { MascotPose } from './PathMascot';

/**
 * Where the coach appears along a block, and in which pose:
 * waves at the start, thinks mid-block, cheers before the last stretch, and holds a trophy at the final node
 * (the block quiz in Rules basics). The coach always stands on the side away from the path, so it alternates
 * left and right with the zig-zag and never sits over a lesson button.
 */
export function mascotAt(index: number, count: number, x: number, blockIndex: number): { pose: MascotPose; side: 'left' | 'right' } | undefined {
  const poses = new Map<number, MascotPose>();
  if (count === 1) poses.set(0, 'think'); // a "coming soon" block
  else {
    poses.set(1, 'wave');
    if (count >= 7) poses.set(4, 'think');
    if (count >= 8) poses.set(count - 3, 'cheer');
    if (count >= 3) poses.set(count - 1, 'trophy');
  }
  const pose = poses.get(index);
  if (!pose) return undefined;
  const side = x > 0 ? 'left' : x < 0 ? 'right' : (blockIndex + index) % 2 === 0 ? 'right' : 'left';
  return { pose, side };
}
