import { SEED_POSTS } from '@/shared/fixtures/ids';
import type { FeedState, InterestId, SubjectTag } from '@/shared/contracts/types';

export interface Story {
  id: string; sourceUrl: string; title: string; summary: string; date: string;
  publisher: string; category: string; tags: SubjectTag[]; stat: string; caption: string;
  paragraphs: string[]; take: string; lesson?: string; clip?: boolean; preview?: boolean;
  question: string; options: [string, string, string]; correct: number; explanation: string;
}
const entries: Omit<Story, 'id' | 'sourceUrl'>[] = [
  {
    title: 'One free kick. A whole new chapter.', category: 'The moment', date: '2023-07-21', publisher: 'Inter Miami CF',
    tags: ['players', 'techniques', 'match-moments'], stat: '94′', caption: 'Miami’s introduction to Messi',
    summary: 'A tied game, a late foul, and a left foot everyone knew. Messi turned his Miami debut into a 2–1 win over Cruz Azul.',
    paragraphs: ['Lionel Messi came off the bench for his Inter Miami debut in the Leagues Cup against Cruz Azul. With the game level at 1–1 in stoppage time, Miami won a free kick just outside the penalty area.', 'Messi curled the ball over the wall and into the top corner. His 94th-minute winner made the final score 2–1: a debut decided by one set piece, rather than a full match of dominance.'],
    take: 'Watch the height of the wall and the space above it. A free kick is a geometry problem before it becomes a highlight.',
    question: 'How did Messi score the winner on his Miami debut?', options: ['A header', 'A direct free kick', 'A penalty'], correct: 1,
    explanation: 'His stoppage-time free kick gave Miami a 2–1 win over Cruz Azul.',
  },
  {
    title: 'Barcelona. Paris. Miami. What changed?', category: 'Transfer notebook', date: '2023-07-15', publisher: 'Inter Miami CF',
    tags: ['transfers', 'players', 'biographies'], stat: '2023', caption: 'A new home for a familiar No. 10',
    summary: 'Miami announced Messi’s signing in July 2023. Trace the path from Barcelona’s academy to Paris and a new challenge in MLS.',
    paragraphs: ['Messi joined Barcelona as a teenager and made his first-team competitive debut in 2004. His long Barcelona career ended in 2021, when he moved to Paris Saint-Germain.', 'He won the World Cup with Argentina in December 2022. On July 15, 2023, Inter Miami announced his signing, with a contract through the 2025 MLS season. This is a historical signing report, not a statement about his current contract.'],
    take: 'A transfer moves more than a player: it changes a team’s expectations, attention and tactical options.', lesson: 'transfers-messi-to-miami',
    question: 'Which club did Messi play for immediately before Miami?', options: ['Paris Saint-Germain', 'Barcelona', 'Manchester City'], correct: 0,
    explanation: 'His path was Barcelona → Paris Saint-Germain → Inter Miami.',
  },
  {
    title: 'The corner that caught everyone looking.', category: 'Tactics, unlocked', date: '2019-05-07', publisher: 'UEFA',
    tags: ['tactics', 'rules', 'club-history', 'statistics'], stat: '4–3', caption: 'Liverpool’s aggregate comeback',
    summary: 'Down 3–0 after the first leg, Liverpool needed four. Alexander-Arnold’s quick corner found Origi before Barcelona could reset.',
    paragraphs: ['Barcelona brought a 3–0 first-leg lead to Anfield. Divock Origi scored early in the return, and substitute Georginio Wijnaldum scored twice to level the aggregate score at 3–3.', 'Trent Alexander-Arnold spotted Barcelona’s defenders switching off at a corner. His quick delivery found Origi, whose finish made it 4–0 on the night and 4–3 across both legs. Liverpool advanced to the final.'],
    take: 'The advantage was attention. A routine restart became a chance because the passer and finisher were ready together.', lesson: 'tactics-quick-corner', clip: true,
    question: 'What was Liverpool’s winning aggregate score?', options: ['4–0', '3–3', '4–3'], correct: 2,
    explanation: 'Liverpool lost the first leg 3–0 and won the second 4–0: 4–3 on aggregate.',
  },
  {
    title: 'A hat trick before the final could settle.', category: 'World Cup archive', date: '2015-07-05', publisher: 'U.S. Soccer',
    tags: ['tournaments', 'techniques', 'players', 'statistics'], stat: '16′', caption: 'Three goals. One extraordinary start.',
    summary: 'Carli Lloyd scored three times inside 16 minutes against Japan. The third came from near halfway, with the goalkeeper stranded.',
    paragraphs: ['The United States beat Japan 5–2 in the 2015 Women’s World Cup final in Vancouver. Carli Lloyd scored in the third, fifth and 16th minutes; Lauren Holiday scored between Lloyd’s second and third.', 'For her third, Lloyd noticed the goalkeeper away from her line and struck from near the halfway line. The early hat trick helped the United States secure its third Women’s World Cup title.'],
    take: 'Look up before you look down at the ball. Spotting the goalkeeper’s position made the audacious shot possible.', lesson: 'tournaments-2015-world-cup-final',
    question: 'Where did Lloyd shoot from for her third goal?', options: ['The penalty spot', 'Near halfway', 'The six-yard box'], correct: 1,
    explanation: 'She saw the goalkeeper off her line and scored from near halfway.',
  },
  {
    title: 'Two goals. Two very different legacies.', category: 'History & controversy', date: '1986-06-22', publisher: 'FIFA',
    tags: ['club-history', 'rules', 'players', 'history', 'scandals'], stat: '2–1', caption: 'Argentina vs England · Mexico 1986',
    summary: 'Maradona’s handball goal and a remarkable solo run arrived in the same quarterfinal. Great skill does not erase the controversy.',
    paragraphs: ['Argentina beat England 2–1 in the 1986 World Cup quarterfinal. Diego Maradona scored both Argentina goals; Gary Lineker later pulled one back for England.', 'The first goal was scored with Maradona’s hand but was allowed by the officials, becoming known as the “Hand of God.” His second came after a long dribble through England’s defense. The two moments are remembered for entirely different reasons.'],
    take: 'Separate the decision from the talent. The first goal involved an illegal handball; the second showcased extraordinary control.', lesson: 'history-maradona-1986',
    question: 'Why was Maradona’s first goal controversial?', options: ['He used his hand', 'It was a penalty', 'It went in after full time'], correct: 0,
    explanation: 'The officials allowed the goal even though Maradona used his hand.',
  },
  {
    title: 'Orlando vs Cincinnati: make your call.', category: 'Next on your calendar', date: '2026-11-19', publisher: 'MLS',
    tags: ['strategy', 'tournaments', 'previews', 'news'], stat: 'NOV 19', caption: 'The next matchday conversation', preview: true,
    summary: 'Our November 14 demo edition looks ahead to Orlando City–FC Cincinnati. Explore the matchup, then save your own prediction.',
    paragraphs: ['Demo fixture: Orlando City vs FC Cincinnati, November 19, 2026. This pairing and date come from the supplied demo brief. The linked MLS schedule is the primary reference to check before making real matchday plans; we have not independently confirmed this fixture.', 'No result, confirmed lineup or kickoff time is asserted here. The promoted watch party’s 7:00 PM ET time is its fictional doors-open time, not an official kickoff.'],
    take: 'Watch who controls the space after losing possession. Our editorial question: can Orlando protect the middle while still committing players forward?',
    question: 'Which matchup is this demo preview about?', options: ['Miami vs Cruz Azul', 'Liverpool vs Barcelona', 'Orlando City vs FC Cincinnati'], correct: 2,
    explanation: 'The demo preview pairs Orlando City with FC Cincinnati on November 19.',
  },
];
export const stories: Story[] = SEED_POSTS.map((seed, i) => ({ ...seed, ...entries[i]! }));
export const editionQuizId = 'feed-quiz:2026-11-14';
export const dateLabel = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export const rankStories = (interests: InterestId[]) => [...stories].sort((a, b) => b.tags.filter(tag => interests.some(i => i === tag)).length - a.tags.filter(tag => interests.some(i => i === tag)).length);
export function quizStory(feed: FeedState) {
  const read = Object.values(feed.views).filter(view => stories.some(post => post.id === view.postId));
  if (read.length < 2) return undefined;
  return stories.find(post => post.id === read.sort((a, b) => a.firstViewedAt.localeCompare(b.firstViewedAt))[0]?.postId);
}
