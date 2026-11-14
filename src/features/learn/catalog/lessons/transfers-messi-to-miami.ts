import type { Lesson } from '../../types';

export const transfersMessiToMiami: Lesson = {
  id: 'transfers-messi-to-miami',
  title: 'Reconstruct Messi’s move to Miami',
  module: 'transfers',
  difficulty: 'intermediate',
  minutes: 5,
  summary: 'Follow Lionel Messi’s career path to Inter Miami CF and the free kick that opened it.',
  art: 'transfer',
  interests: ['transfers', 'players'],
  tags: ['transfers', 'biographies', 'match-moments', 'news'],
  prerequisites: [],
  feedHook: {
    postIds: ['messi-signs-with-inter-miami', 'messi-miami-debut-free-kick'],
    label: 'Messi’s move to Miami',
  },
  story: {
    coach: 'A transfer is a story with a before and an after.',
    paragraphs: [
      'In 2023, Lionel Messi, a seven-time Ballon d’Or winner and World Cup champion, signed with Inter Miami CF and brought his career to Major League Soccer.',
      'His debut had its own storyline: he scored a stoppage-time free kick to win the match for his new club.',
    ],
    sourcePostId: 'messi-miami-debut-free-kick',
  },
  interaction: {
    kind: 'sequence',
    prompt: 'Rebuild the path. Put Messi’s clubs in the order he played for them.',
    items: [
      { id: 'barca', label: 'FC Barcelona' },
      { id: 'psg', label: 'Paris Saint-Germain' },
      { id: 'miami', label: 'Inter Miami CF' },
    ],
    initialOrder: ['miami', 'barca', 'psg'],
    solvedMessage: 'Barcelona, then Paris, then Miami. That is the transfer path.',
  },
  quiz: {
    art: 'free-kick',
    question: 'How did Messi’s Inter Miami debut get decided?',
    options: [
      { id: 'free-kick', label: 'A stoppage-time free kick' },
      { id: 'shootout', label: 'A penalty shootout' },
      { id: 'own-goal', label: 'An own goal' },
    ],
    correctId: 'free-kick',
  },
  explanation: {
    paragraphs: [
      'A transfer moves a player’s contract from one club to another. For fans, it also moves attention: a signing like this brings a new audience to a club and a league.',
      'A first match can set the tone for a whole move. Late winners are remembered long after the details of the contract are forgotten.',
    ],
    takeaway: 'A transfer is not just a signing. The first moment on the pitch becomes part of the story.',
  },
};
