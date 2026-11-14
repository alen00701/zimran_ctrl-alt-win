import type { Point, Receiver } from '../types';

export const PITCH_W = 100;
export const PITCH_H = 130;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export const clampToPitch = (p: Point, margin = 4): Point => ({
  x: clamp(p.x, margin, PITCH_W - margin),
  y: clamp(p.y, margin, PITCH_H - margin),
});

/** Shortest distance from point p to the segment a→b. */
export function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq, 0, 1);
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

export interface LaneStatus {
  id: string;
  label: string;
  blocked: boolean;
}

/** A lane is blocked when ANY defender stands within `radius` of the passer→receiver line. */
export function laneStatuses(passer: Point, receivers: Receiver[], defenders: Point[], radius: number): LaneStatus[] {
  return receivers.map((r) => ({
    id: r.id,
    label: r.label,
    blocked: defenders.some((d) => distanceToSegment(d, passer, r.at) <= radius),
  }));
}

export const openLanes = (statuses: LaneStatus[]) => statuses.filter((s) => !s.blocked);
