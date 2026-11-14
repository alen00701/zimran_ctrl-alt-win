import type { Lesson } from '../../types';

export const historyMaradona1986: Lesson = {
  id: 'history-maradona-1986',
  title: 'Maradona’s two goals against England, 1986',
  module: 'history',
  difficulty: 'intermediate',
  minutes: 5,
  summary: 'Two goals in one match: one controversial, one remembered for its brilliance.',
  art: 'two-goals-1986',
  interests: ['players', 'tournaments', 'club-history'],
  tags: ['history', 'biographies', 'scandals', 'tournaments'],
  prerequisites: [],
  feedHook: { postIds: ['maradona-1986-england-two-goals'], label: 'Maradona vs. England' },
  story: {
    coach: 'One match, two goals, two very different reputations.',
    paragraphs: [
      'In the 1986 World Cup quarterfinal, Argentina beat England 2–1 and Diego Maradona scored both goals.',
      'The first goal was controversial: Maradona got to the ball first using his hand, and the goal was allowed to stand. The second was a solo run through the England team that fans still call one of the best goals ever scored.',
    ],
    sourcePostId: 'maradona-1986-england-two-goals',
  },
  interaction: {
    kind: 'classify',
    prompt: 'Which goal does each description belong to?',
    buckets: [
      { id: 'first', label: 'First goal' },
      { id: 'second', label: 'Second goal' },
    ],
    items: [
      { id: 'hand', label: 'Maradona touched the ball with his hand', bucketId: 'first' },
      { id: 'allowed', label: 'The goal stood even though it broke the rules', bucketId: 'first' },
      { id: 'run', label: 'A solo run that started in Argentina’s half', bucketId: 'second' },
      { id: 'weave', label: 'He weaved past several defenders before scoring', bucketId: 'second' },
    ],
    solvedMessage: 'Right. Same player, same match, but one goal is argued about and the other is admired.',
  },
  quiz: {
    art: 'two-goals-1986',
    question: 'Why is the first goal controversial?',
    options: [
      { id: 'hand', label: 'Maradona used his hand and the goal was allowed' },
      { id: 'offside', label: 'He was far offside when the ball was played' },
      { id: 'line', label: 'The ball had already crossed the touchline' },
    ],
    correctId: 'hand',
  },
  explanation: {
    paragraphs: [
      'In 1986 there was no video review. The referee’s decision on the field stood, even when replays later showed it differently.',
      'That is part of why this match is still discussed: one goal broke the rules without being punished, and the other showed what a single player could do inside the rules.',
    ],
    takeaway: 'A single match can hold two stories: a rules argument and a masterpiece.',
  },
};
