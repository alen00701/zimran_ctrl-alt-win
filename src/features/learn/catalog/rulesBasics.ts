/**
 * "Rules basics": the mandatory first block of the Beginner level.
 * Ten short drills + a 10-question block quiz (pass mark 7/10).
 * Drills are free foundation lessons: they do NOT count toward the two free course lessons.
 */
export interface ChoiceQuestion {
  id: string;
  question: string;
  options: { id: string; label: string }[];
  correctId: string;
  /** Shown after answering, right or wrong. */
  explain: string;
}

export interface Drill {
  id: string;
  title: string;
  paragraphs: string[];
  keyRule: string;
  check: ChoiceQuestion;
}

/** Stored in course.lessons under this ID (never passed to completeLesson, so the paywall count is untouched). */
export const RULES_BLOCK_ID = 'rules-basics';
export const RULES_QUIZ_ID = 'rules-basics-quiz';
export const QUIZ_PASS_MARK = 7;

export const RULES_DRILLS: Drill[] = [
  {
    id: 'rules-drill-goal',
    title: 'What counts as a goal',
    paragraphs: [
      'A goal is scored when the whole ball crosses the goal line, between the posts and under the crossbar.',
      'If even a sliver of the ball is still touching the line, it is not a goal yet.',
    ],
    keyRule: 'The whole ball must cross the whole line.',
    check: {
      id: 'goal',
      question: 'Half the ball is over the goal line. Is it a goal?',
      options: [
        { id: 'no', label: 'No. The whole ball has to cross.' },
        { id: 'yes', label: 'Yes. Most of it crossed.' },
      ],
      correctId: 'no',
      explain: 'The whole ball must be over the line. Half is not enough.',
    },
  },
  {
    id: 'rules-drill-players',
    title: 'Eleven against eleven',
    paragraphs: [
      'Each team starts with up to 11 players on the field, and one of them is the goalkeeper.',
      'A match cannot start or continue if a team has fewer than seven players.',
    ],
    keyRule: '11 players per side, one of them in goal.',
    check: {
      id: 'players',
      question: 'How many players does each team start with?',
      options: [
        { id: '11', label: '11, including the goalkeeper' },
        { id: '10', label: '10, plus a goalkeeper on the bench' },
        { id: '12', label: '12' },
      ],
      correctId: '11',
      explain: 'Eleven players, and the goalkeeper is one of them.',
    },
  },
  {
    id: 'rules-drill-time',
    title: 'Two halves and stoppage time',
    paragraphs: [
      'A match is two halves of 45 minutes each, with a break in between.',
      'The referee adds stoppage time at the end of each half to make up for time lost to injuries, substitutions and other delays.',
    ],
    keyRule: '2 × 45 minutes, plus stoppage time.',
    check: {
      id: 'time',
      question: 'What is stoppage time?',
      options: [
        { id: 'added', label: 'Extra minutes added for time lost during the half' },
        { id: 'ot', label: 'A third half played after every match' },
        { id: 'break', label: 'The break between the two halves' },
      ],
      correctId: 'added',
      explain: 'Stoppage time makes up for delays. That is how late winners happen.',
    },
  },
  {
    id: 'rules-drill-out',
    title: 'In and out of play',
    paragraphs: [
      'The ball is out of play only when the whole ball crosses the touchline or the goal line, or when the referee stops play.',
      'When the ball goes over a touchline, the team that did not touch it last restarts with a throw-in.',
    ],
    keyRule: 'Out over the touchline means a throw-in.',
    check: {
      id: 'out',
      question: 'The ball rolls over the touchline. How does play restart?',
      options: [
        { id: 'throw', label: 'A throw-in' },
        { id: 'corner', label: 'A corner kick' },
        { id: 'drop', label: 'A dropped ball' },
      ],
      correctId: 'throw',
      explain: 'Touchline means throw-in, taken by the team that did not touch it last.',
    },
  },
  {
    id: 'rules-drill-corners',
    title: 'Corner kicks and goal kicks',
    paragraphs: [
      'When the ball crosses the goal line without a goal, who touched it last decides the restart.',
      'If an attacker touched it last, the defending team takes a goal kick. If a defender touched it last, the attacking team gets a corner kick.',
    ],
    keyRule: 'Last touch by a defender = corner. Last touch by an attacker = goal kick.',
    check: {
      id: 'corners',
      question: 'A defender deflects a shot over their own goal line. What is the restart?',
      options: [
        { id: 'corner', label: 'Corner kick to the attacking team' },
        { id: 'goalkick', label: 'Goal kick to the defending team' },
      ],
      correctId: 'corner',
      explain: 'The defender touched it last, so the attackers get a corner.',
    },
  },
  {
    id: 'rules-drill-offside',
    title: 'Offside in plain English',
    paragraphs: [
      'A player is in an offside position if they are in the opponents’ half and closer to the opponents’ goal line than both the ball and the second-to-last defender. The goalkeeper usually counts as one of those defenders.',
      'Being in that position is not an offense by itself. It becomes one when the player gets involved in play after a teammate passes the ball. There is no offside directly from a throw-in, a goal kick or a corner kick.',
    ],
    keyRule: 'Offside = ahead of the ball and the second-to-last defender when a teammate plays it, and then involved in play.',
    check: {
      id: 'offside',
      question: 'Can a player be offside directly from a throw-in?',
      options: [
        { id: 'no', label: 'No, offside does not apply to a throw-in' },
        { id: 'yes', label: 'Yes, the same as any pass' },
      ],
      correctId: 'no',
      explain: 'Throw-ins, goal kicks and corner kicks are exceptions to offside.',
    },
  },
  {
    id: 'rules-drill-freekicks',
    title: 'Direct and indirect free kicks',
    paragraphs: [
      'Fouls are punished with free kicks. A direct free kick can be scored straight into the goal.',
      'An indirect free kick must touch another player before a goal can count. The referee signals it by raising an arm.',
    ],
    keyRule: 'Direct: shoot straight in. Indirect: someone else must touch it first.',
    check: {
      id: 'freekicks',
      question: 'An indirect free kick goes straight into the net untouched. Does the goal count?',
      options: [
        { id: 'no', label: 'No. Another player must touch it first.' },
        { id: 'yes', label: 'Yes, any free kick can be scored directly.' },
      ],
      correctId: 'no',
      explain: 'Indirect means a second touch is required before a goal.',
    },
  },
  {
    id: 'rules-drill-penalty',
    title: 'Penalty kicks',
    paragraphs: [
      'If a defender commits a direct-free-kick foul inside their own penalty area, the attacking team gets a penalty kick.',
      'It is taken from the penalty mark, 12 yards from goal. Only the kicker and the goalkeeper are involved until the ball is kicked.',
    ],
    keyRule: 'Foul in your own box = penalty from 12 yards.',
    check: {
      id: 'penalty',
      question: 'Where is a penalty kick taken from?',
      options: [
        { id: 'mark', label: 'The penalty mark, 12 yards from goal' },
        { id: 'edge', label: 'The edge of the penalty area' },
        { id: 'spot', label: 'Wherever the foul happened' },
      ],
      correctId: 'mark',
      explain: 'Always the penalty mark, 12 yards out.',
    },
  },
  {
    id: 'rules-drill-cards',
    title: 'Yellow and red cards',
    paragraphs: [
      'A yellow card is a caution. Two yellow cards in the same match add up to a red card.',
      'A red card sends the player off. The team cannot replace them and plays the rest of the match with one fewer player.',
    ],
    keyRule: 'Two yellows = red. A sent-off player is not replaced.',
    check: {
      id: 'cards',
      question: 'A player gets a second yellow card. What happens?',
      options: [
        { id: 'off', label: 'It becomes a red card and they are sent off' },
        { id: 'warn', label: 'Nothing more, it is just another warning' },
        { id: 'sub', label: 'They must be substituted' },
      ],
      correctId: 'off',
      explain: 'Second yellow means red, and the team plays a player short.',
    },
  },
  {
    id: 'rules-drill-hands',
    title: 'Handball and the goalkeeper',
    paragraphs: [
      'Players may not deliberately handle the ball. Doing so is a foul.',
      'The goalkeeper is the exception, but only inside their own penalty area. Outside it, the goalkeeper follows the same rules as everyone else.',
    ],
    keyRule: 'Only the goalkeeper may use hands, and only in their own penalty area.',
    check: {
      id: 'hands',
      question: 'Where may a goalkeeper handle the ball?',
      options: [
        { id: 'box', label: 'Only inside their own penalty area' },
        { id: 'half', label: 'Anywhere in their own half' },
        { id: 'anywhere', label: 'Anywhere on the field' },
      ],
      correctId: 'box',
      explain: 'Hands only inside their own penalty area.',
    },
  },
];

/** Block capstone quiz. Different questions from the drill checks. */
export const RULES_QUIZ: ChoiceQuestion[] = [
  {
    id: 'q1',
    question: 'The ball is on the goal line with part of it still touching the line. What is the call?',
    options: [
      { id: 'play', label: 'No goal, play on' },
      { id: 'goal', label: 'Goal' },
      { id: 'kick', label: 'Goal kick' },
    ],
    correctId: 'play',
    explain: 'The whole ball has to cross the line, so play continues.',
  },
  {
    id: 'q2',
    question: 'A team has five players sent off and only six remain. What happens?',
    options: [
      { id: 'stop', label: 'The match cannot continue' },
      { id: 'on', label: 'The match continues with six' },
      { id: 'subs', label: 'They can bring on replacements' },
    ],
    correctId: 'stop',
    explain: 'A team needs at least seven players for the match to continue.',
  },
  {
    id: 'q3',
    question: 'An attacker’s shot goes wide over the goal line without touching anyone else. Restart?',
    options: [
      { id: 'gk', label: 'Goal kick' },
      { id: 'corner', label: 'Corner kick' },
      { id: 'throw', label: 'Throw-in' },
    ],
    correctId: 'gk',
    explain: 'An attacker touched it last, so the defenders restart with a goal kick.',
  },
  {
    id: 'q4',
    question: 'Which restart can a player NOT be offside from?',
    options: [
      { id: 'corner', label: 'A corner kick' },
      { id: 'free', label: 'A free kick' },
      { id: 'pass', label: 'A pass in open play' },
    ],
    correctId: 'corner',
    explain: 'Corner kicks, goal kicks and throw-ins are exceptions to offside.',
  },
  {
    id: 'q5',
    question: 'A player is in an offside position but is far from the play and never touches the ball. Is it an offense?',
    options: [
      { id: 'no', label: 'No, being in the position alone is not an offense' },
      { id: 'yes', label: 'Yes, the position is the offense' },
    ],
    correctId: 'no',
    explain: 'Offside is only called when the player gets involved in play.',
  },
  {
    id: 'q6',
    question: 'How does the referee show that a free kick is indirect?',
    options: [
      { id: 'arm', label: 'By raising an arm above the head' },
      { id: 'whistle', label: 'By blowing the whistle twice' },
      { id: 'card', label: 'By showing a yellow card' },
    ],
    correctId: 'arm',
    explain: 'A raised arm means indirect.',
  },
  {
    id: 'q7',
    question: 'A defender trips an attacker inside the defender’s own penalty area. What is awarded?',
    options: [
      { id: 'pen', label: 'A penalty kick' },
      { id: 'ifk', label: 'An indirect free kick' },
      { id: 'corner', label: 'A corner kick' },
    ],
    correctId: 'pen',
    explain: 'A direct-free-kick foul by a defender in their own box is a penalty.',
  },
  {
    id: 'q8',
    question: 'A team has a player sent off. Can they bring on a substitute to replace that player?',
    options: [
      { id: 'no', label: 'No, they play one player short' },
      { id: 'yes', label: 'Yes, right away' },
      { id: 'half', label: 'Yes, but only after halftime' },
    ],
    correctId: 'no',
    explain: 'A sent-off player cannot be replaced.',
  },
  {
    id: 'q9',
    question: 'The goalkeeper runs outside the penalty area and catches the ball. What is it?',
    options: [
      { id: 'foul', label: 'A handball offense' },
      { id: 'fine', label: 'Allowed, goalkeepers can always use hands' },
    ],
    correctId: 'foul',
    explain: 'Outside the penalty area, the goalkeeper cannot handle the ball.',
  },
  {
    id: 'q10',
    question: 'Why do matches often run past 90 minutes?',
    options: [
      { id: 'stoppage', label: 'The referee adds stoppage time for delays' },
      { id: 'rule', label: 'Every match is 95 minutes long' },
      { id: 'extra', label: 'Extra time is played in every match' },
    ],
    correctId: 'stoppage',
    explain: 'Stoppage time is added at the end of each half for time lost.',
  },
];

export const getDrill = (id: string) => RULES_DRILLS.find((d) => d.id === id);
