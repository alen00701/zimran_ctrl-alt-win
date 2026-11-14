import type { Lesson } from '../../types';

export const tacticsQuickCorner: Lesson = {
  id: 'tactics-quick-corner',
  title: 'The quick corner: attack before the defense is set',
  module: 'tactics',
  difficulty: 'advanced',
  minutes: 6,
  summary: 'Break down the restart that helped Liverpool finish off Barcelona at Anfield.',
  interests: ['tactics', 'strategy'],
  tags: ['tactics', 'match-moments', 'strategy'],
  prerequisites: ['rules-aggregate-score'],
  feedHook: { postIds: ['liverpool-quick-corner-barcelona'], label: 'Liverpool’s quick corner' },
  story: {
    coach: 'Set pieces are planned. The best ones are sometimes improvised.',
    paragraphs: [
      'A corner kick normally gives the defending team a few seconds to organize: pick up a mark, find a position, get set.',
      'In the second leg at Anfield, Trent Alexander-Arnold noticed that Barcelona’s defenders were still getting organized. He took the corner right away and Divock Origi finished it for Liverpool’s fourth goal.',
    ],
    sourcePostId: 'liverpool-quick-corner-barcelona',
  },
  interaction: {
    kind: 'sequence',
    prompt: 'Put the four moments of the quick corner in the order they happened.',
    items: [
      { id: 'unset', label: 'Barcelona’s defenders are still getting organized' },
      { id: 'take', label: 'Alexander-Arnold takes the corner right away' },
      { id: 'space', label: 'Origi receives the ball with space around him' },
      { id: 'finish', label: 'Origi finishes. Liverpool lead 4–0 on the night.' },
    ],
    initialOrder: ['space', 'unset', 'finish', 'take'],
    solvedMessage: 'That is the sequence. The kick came before the defense was ready.',
  },
  quiz: {
    question: 'What made the quick corner work?',
    options: [
      { id: 'timing', label: 'It was played before the defenders were set' },
      { id: 'long', label: 'It was a long ball to the far post' },
      { id: 'clock', label: 'The referee had paused the match clock' },
    ],
    correctId: 'timing',
  },
  explanation: {
    paragraphs: [
      'Defending is mostly organization. A defense needs time to arrange itself, and a quick restart takes that time away.',
      'Look for these moments in any match: a corner, a throw-in or a free kick taken while the other team is still shuffling into position.',
    ],
    takeaway: 'Speed of restart is a tactic. Attack the moment before the defense is organized.',
  },
};
