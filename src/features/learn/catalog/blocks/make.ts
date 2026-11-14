import type { ArtId } from '../../art/Illustration';
import type { Drill } from '../rulesBasics';

/** Compact authoring row: id, art, title, two paragraphs, key rule, question, right answer, wrong answers, explanation. */
export type Row = [id: string, art: ArtId, title: string, p1: string, p2: string, keyRule: string, question: string, right: string, wrong1: string, wrong2: string, explain: string];

/** Builds drills from rows. The correct answer rotates through positions 1-3 so it is not always first. */
export function drills(rows: Row[]): Drill[] {
  return rows.map(([id, art, title, p1, p2, keyRule, question, right, w1, w2, explain], i) => {
    const opts = [w1, w2];
    opts.splice(i % 3, 0, right);
    return {
      id,
      art,
      title,
      paragraphs: [p1, p2],
      keyRule,
      check: {
        id,
        question,
        options: opts.map((label, k) => ({ id: 'abc'[k]!, label })),
        correctId: 'abc'[i % 3]!,
        explain,
      },
    };
  });
}
