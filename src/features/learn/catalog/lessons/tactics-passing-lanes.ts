import type { Lesson } from '../../types';

export const tacticsPassingLanes: Lesson = {
  id: 'tactics-passing-lanes',
  title: 'Passing lanes: cut off the pass without chasing the ball',
  module: 'tactics',
  difficulty: 'beginner',
  minutes: 6,
  summary: 'Move a defender and watch the passing options open and close.',
  art: 'lanes',
  interests: ['tactics', 'strategy', 'techniques'],
  tags: ['tactics', 'techniques'],
  prerequisites: [],
  story: {
    coach: 'Good defenders defend the space between players, not only the player.',
    paragraphs: [
      'A pass can only travel along a straight lane from the passer to a teammate. If a defender stands on that line, or close enough to reach it, the lane is blocked.',
      'That is why defenders do not just chase the ball. Smart positioning removes passing options before a pass is even attempted.',
    ],
  },
  interaction: {
    kind: 'passing-lanes',
    prompt: 'Drag the defender to cut off the pass to the striker.',
    passer: { x: 50, y: 112 },
    receivers: [
      { id: 'left', label: 'Left winger', at: { x: 18, y: 42 } },
      { id: 'striker', label: 'Striker', at: { x: 50, y: 24 } },
      { id: 'right', label: 'Right winger', at: { x: 82, y: 42 } },
    ],
    defenderStart: { x: 24, y: 88 },
    goalReceiverId: 'striker',
    blockRadius: 6,
    solvedMessage: 'The striker is cut off. Notice that the wingers are still open. One defender cannot cover everything.',
  },
  quiz: {
    question: 'New setup, two defenders. Which teammate is the open pass option?',
    options: [
      { id: 'left', label: 'Left winger' },
      { id: 'striker', label: 'Striker' },
      { id: 'right', label: 'Right winger' },
    ],
    correctId: 'right',
    diagram: {
      passer: { x: 50, y: 112 },
      receivers: [
        { id: 'left', label: 'Left winger', at: { x: 16, y: 52 } },
        { id: 'striker', label: 'Striker', at: { x: 50, y: 22 } },
        { id: 'right', label: 'Right winger', at: { x: 84, y: 52 } },
      ],
      defenders: [
        { x: 50, y: 66 },
        { x: 32, y: 80 },
      ],
      blockRadius: 6,
    },
  },
  explanation: {
    paragraphs: [
      'The defender in the middle sits on the line to the striker. The second defender sits on the line to the left winger. Only the right winger has a clear lane.',
      'Attackers do the opposite: they move to open a lane. Defenders move to close it. The pass is decided by positions before anyone touches the ball.',
    ],
    takeaway: 'A pass needs a clear lane. Defenders take away lanes, attackers create them.',
  },
};
