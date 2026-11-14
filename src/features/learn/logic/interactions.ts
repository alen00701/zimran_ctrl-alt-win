import type { ClassifySpec, SequenceSpec } from '../types';

/* ---------- aggregate ---------- */

export interface AggregateResult {
  totalA: number;
  totalB: number;
  leader: 'a' | 'b' | 'level';
}

export function aggregate(leg1: { a: number; b: number }, leg2: { a: number; b: number }): AggregateResult {
  const totalA = leg1.a + leg2.a;
  const totalB = leg1.b + leg2.b;
  return { totalA, totalB, leader: totalA === totalB ? 'level' : totalA > totalB ? 'a' : 'b' };
}

/* ---------- sequence ---------- */

export const isValidOrder = (spec: SequenceSpec, order: unknown): order is string[] =>
  Array.isArray(order) &&
  order.length === spec.items.length &&
  new Set(order).size === order.length &&
  spec.items.every((i) => order.includes(i.id));

export function sequenceCorrectCount(spec: SequenceSpec, order: string[]): number {
  return order.filter((id, idx) => spec.items[idx]?.id === id).length;
}

export const isSequenceSolved = (spec: SequenceSpec, order: string[]) =>
  sequenceCorrectCount(spec, order) === spec.items.length;

export function moveItem(order: string[], from: number, to: number): string[] {
  if (to < 0 || to >= order.length || from === to) return order;
  const next = [...order];
  const [item] = next.splice(from, 1);
  if (item === undefined) return order;
  next.splice(to, 0, item);
  return next;
}

/* ---------- classify ---------- */

export type Assignments = Record<string, string | undefined>;

export const classifyWrongIds = (spec: ClassifySpec, a: Assignments) =>
  spec.items.filter((i) => a[i.id] !== i.bucketId).map((i) => i.id);

export const isClassifyComplete = (spec: ClassifySpec, a: Assignments) => spec.items.every((i) => a[i.id] !== undefined);

export const isClassifySolved = (spec: ClassifySpec, a: Assignments) =>
  isClassifyComplete(spec, a) && classifyWrongIds(spec, a).length === 0;
