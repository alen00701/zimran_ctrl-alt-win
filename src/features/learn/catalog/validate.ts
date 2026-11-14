import { MODULE_CATEGORIES } from '@/shared/contracts/catalog';
import type { Lesson } from '../types';

/**
 * Returns a list of problems. An empty list means the lesson is playable.
 * Only playable lessons are shown as available in the UI.
 */
export function lessonProblems(l: Lesson): string[] {
  const p: string[] = [];
  const need = (ok: unknown, msg: string) => {
    if (!ok) p.push(msg);
  };
  need(/^[a-z0-9-]+$/.test(l.id), 'id must be lowercase kebab-case');
  need(l.title.trim(), 'title is empty');
  need((MODULE_CATEGORIES as readonly string[]).includes(l.module), 'unknown module');
  need(l.minutes > 0, 'minutes must be positive');
  need(l.story.paragraphs.length > 0, 'story is empty');
  need(l.explanation.paragraphs.length > 0 && l.explanation.takeaway.trim(), 'explanation is empty');
  need(l.quiz.options.length >= 2, 'quiz needs at least two options');
  need(l.quiz.options.some((o) => o.id === l.quiz.correctId), 'quiz correctId is not one of the options');
  need(new Set(l.quiz.options.map((o) => o.id)).size === l.quiz.options.length, 'quiz option ids repeat');

  const i = l.interaction;
  if (i.kind === 'sequence') {
    need(i.items.length >= 2, 'sequence needs at least two items');
    need(
      i.initialOrder.length === i.items.length && i.items.every((it) => i.initialOrder.includes(it.id)),
      'sequence initialOrder must contain every item once',
    );
    need(i.initialOrder.some((id, idx) => i.items[idx]?.id !== id), 'sequence initialOrder must not start solved');
  } else if (i.kind === 'classify') {
    need(i.items.every((it) => i.buckets.some((b) => b.id === it.bucketId)), 'classify item points to a missing bucket');
    need(i.buckets.length >= 2, 'classify needs at least two buckets');
  } else if (i.kind === 'passing-lanes') {
    need(i.receivers.some((r) => r.id === i.goalReceiverId), 'passing-lanes goalReceiverId is missing');
  } else if (i.kind === 'aggregate') {
    need(i.leg1.a > i.leg1.b, 'aggregate leg 1 must favor team A so team B has something to overturn');
  }
  return p;
}

export const isPlayable = (l: Lesson) => lessonProblems(l).length === 0;
