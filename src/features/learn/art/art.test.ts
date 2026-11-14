import { describe, expect, it } from 'vitest';
import { CATALOG } from '../catalog';
import { ALL_DRILLS, LEVELS } from '../catalog/path';
import { RULES_QUIZ } from '../catalog/rulesBasics';
import { ART_ALT, ART_IDS } from './Illustration';

const known = new Set<string>(ART_IDS);

describe('illustrations', () => {
  it('every scene has alt text', () => {
    for (const id of ART_IDS) expect(ART_ALT[id].length, id).toBeGreaterThan(20);
  });
  it('every Rules lesson and every quiz question has a picture', () => {
    for (const d of ALL_DRILLS) expect(known.has(d.art), d.id).toBe(true);
    for (const q of RULES_QUIZ) expect(q.art && known.has(q.art), q.id).toBe(true);
  });
  it('every course lesson has a story picture and a quiz picture or diagram', () => {
    for (const l of CATALOG) {
      expect(known.has(l.art), l.id).toBe(true);
      expect(Boolean(l.quiz.diagram) || Boolean(l.quiz.art && known.has(l.quiz.art)), l.id).toBe(true);
    }
  });
  it('every block banner has a picture', () => {
    for (const lv of LEVELS) for (const b of lv.blocks) expect(known.has(b.art), b.id).toBe(true);
  });
});
