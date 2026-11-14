import { describe, expect, it } from 'vitest';
import { mascotAt } from './mascots';

const ZIGZAG = [0, 1, 2, 1, 0, -1, -2, -1];

describe('path mascots', () => {
  it('uses four poses along a 10-lesson block: wave, think, cheer, trophy at the end', () => {
    const marks = Array.from({ length: 10 }, (_, i) => mascotAt(i, 10, ZIGZAG[i % 8]!, 0)?.pose);
    expect(marks.filter(Boolean)).toEqual(['wave', 'think', 'cheer', 'trophy']);
    expect(marks[9]).toBe('trophy');
  });
  it('puts the trophy beside the final quiz node of an 11-node block', () => {
    expect(mascotAt(10, 11, ZIGZAG[10 % 8]!, 0)?.pose).toBe('trophy');
  });
  it('always stands on the side away from the node, so it never covers the path', () => {
    for (let b = 0; b < 3; b++)
      for (let i = 0; i < 11; i++) {
        const x = ZIGZAG[i % 8]!;
        const m = mascotAt(i, 11, x, b);
        if (m && x > 0) expect(m.side).toBe('left');
        if (m && x < 0) expect(m.side).toBe('right');
      }
  });
  it('alternates sides across a block and gives a coming-soon block one thinking pose', () => {
    const sides = Array.from({ length: 11 }, (_, i) => mascotAt(i, 11, ZIGZAG[i % 8]!, 0)?.side).filter(Boolean);
    expect(new Set(sides).size).toBe(2);
    expect(mascotAt(0, 1, 0, 3)?.pose).toBe('think');
  });
});
