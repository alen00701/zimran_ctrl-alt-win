import type { Lesson } from '../../types';

export const rulesAggregateScore: Lesson = {
  id: 'rules-aggregate-score',
  title: 'Aggregate score: how a two-leg tie is decided',
  module: 'rules',
  difficulty: 'beginner',
  minutes: 4,
  summary: 'Why a 4–0 win can still be a comeback story, and how two matches become one result.',
  interests: ['rules', 'tournaments'],
  tags: ['rules', 'tournaments', 'statistics'],
  prerequisites: [],
  feedHook: { postIds: ['liverpool-quick-corner-barcelona'], label: 'Liverpool vs. Barcelona' },
  story: {
    coach: 'Some knockout rounds take two matches. Here is how the math works.',
    paragraphs: [
      'In many knockout competitions, two teams play each other twice. Each match is called a leg. The team that scores more goals across both legs added together goes through. That total is the aggregate score.',
      'In the 2019 Champions League semifinal, Barcelona won the first leg 3–0. Liverpool, hosting the second leg at Anfield, needed to win by at least four clear goals. They won 4–0, so the aggregate finished Liverpool 4, Barcelona 3.',
    ],
    sourcePostId: 'liverpool-quick-corner-barcelona',
  },
  interaction: {
    kind: 'aggregate',
    prompt: 'Barcelona lead 3–0 after leg one. Set the leg-two score so Liverpool go through.',
    teamA: 'Barcelona',
    teamB: 'Liverpool',
    leg1: { a: 3, b: 0 },
    solvedMessage: 'Liverpool are ahead on aggregate. That is the whole idea: both legs count together.',
  },
  quiz: {
    question: 'A team wins the first leg 2–0 and loses the second leg 1–0. Who leads on aggregate?',
    options: [
      { id: 'first', label: 'The team that won the first leg, 2–1' },
      { id: 'second', label: 'The team that won the second leg' },
      { id: 'level', label: 'Neither team. It is level.' },
    ],
    correctId: 'first',
  },
  explanation: {
    paragraphs: [
      'Add each team’s goals from both legs. Barcelona scored 3 + 0 = 3. Liverpool scored 0 + 4 = 4. The higher total advances.',
      'Winning only one of the two legs can still be enough, as long as your total is higher.',
    ],
    takeaway: 'Two legs, one result: add the goals from both matches.',
  },
};
