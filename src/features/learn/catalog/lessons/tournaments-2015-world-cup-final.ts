import type { Lesson } from '../../types';

export const tournaments2015WorldCupFinal: Lesson = {
  id: 'tournaments-2015-world-cup-final',
  title: 'The 2015 Women’s World Cup final',
  module: 'tournaments',
  difficulty: 'beginner',
  minutes: 5,
  summary: 'How a tournament works, and the hat trick that defined a final.',
  art: 'bracket',
  interests: ['tournaments', 'players'],
  tags: ['tournaments', 'history', 'match-moments'],
  prerequisites: [],
  feedHook: { postIds: ['carli-lloyd-2015-final-hat-trick'], label: 'Carli Lloyd’s 2015 final' },
  story: {
    coach: 'Every great final starts with a format. Here is how this one works.',
    paragraphs: [
      'A World Cup begins with a group stage, where teams play several matches in small groups. Then it becomes a knockout tournament: lose and you are out, until two teams are left for the final.',
      'In the 2015 FIFA Women’s World Cup final, the USA beat Japan 5–2. Carli Lloyd scored a hat trick, including a long-range third goal from near the halfway line.',
    ],
    sourcePostId: 'carli-lloyd-2015-final-hat-trick',
  },
  interaction: {
    kind: 'classify',
    prompt: 'Is each statement true of the group stage or the knockout rounds?',
    buckets: [
      { id: 'group', label: 'Group stage' },
      { id: 'knockout', label: 'Knockout rounds' },
    ],
    items: [
      { id: 'draw', label: 'A draw is an acceptable result', bucketId: 'group' },
      { id: 'several', label: 'Each team plays several matches against the same small group', bucketId: 'group' },
      { id: 'out', label: 'Lose and your tournament is over', bucketId: 'knockout' },
      { id: 'winner', label: 'Every match must produce a team that goes through', bucketId: 'knockout' },
    ],
    solvedMessage: 'Exactly. Groups let teams recover. Knockout rounds do not.',
  },
  quiz: {
    art: 'trophy',
    question: 'What is a hat trick?',
    options: [
      { id: 'three', label: 'Three goals by one player in one match' },
      { id: 'win', label: 'Winning three matches in a row' },
      { id: 'pen', label: 'Three penalty kicks in a shootout' },
    ],
    correctId: 'three',
  },
  explanation: {
    paragraphs: [
      'A hat trick is three goals by the same player in one match. Lloyd did it in a World Cup final, which is the highest-pressure setting in the sport.',
      'The long-range third goal shows why finals are remembered: one decision, one shot, one moment people replay for years.',
    ],
    takeaway: 'Know the format and you understand the stakes. A hat trick in a final is as big as it gets.',
  },
};
