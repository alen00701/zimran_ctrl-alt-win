import { SEED_POSTS } from '@/shared/fixtures/ids';
import type { FeedState, InterestId, SubjectTag } from '@/shared/contracts/types';
import { isVerifiedPublisherPost } from './publishers';

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
    paragraphs: ['MLS lists Orlando City SC hosting FC Cincinnati in the Eastern Conference Wild Card match on November 19, 2026, at 7:30 PM ET at Inter.co Stadium. The winner advances to face Nashville SC in the Round One Best-of-3 Series.', 'Those are the schedule facts; the result is still to come in this November 14 edition. Our promoted watch party is fictional and opens its doors at 7:00 PM ET, 30 minutes before the listed kickoff.'],
    take: 'Watch who controls the space after losing possession. Our editorial question: can Orlando protect the middle while still committing players forward?',
    question: 'Which matchup is this demo preview about?', options: ['Miami vs Cruz Azul', 'Liverpool vs Barcelona', 'Orlando City vs FC Cincinnati'], correct: 2,
    explanation: 'The demo preview pairs Orlando City with FC Cincinnati on November 19.',
  },
];
export const stories: Story[] = SEED_POSTS.map((seed, i) => ({ ...seed, ...entries[i]! }));
/** Extra short-form posts for the endless media stream. They deliberately stay feature-local. */
export const streamStories: Story[] = [
  ...stories,
  {
    id: 'liverpool-barcelona-four-goals-video', sourceUrl: 'https://www.youtube.com/watch?v=27GHT7nAF8A', title: 'Four goals. Zero second chances.',
    category: 'Full-time rewind', date: '2019-05-07', publisher: 'UEFA', tags: ['tactics', 'club-history', 'match-moments'], stat: '4–0', caption: 'Liverpool complete the turnaround',
    summary: 'Watch the goals from the night Liverpool flipped a three-goal deficit into a place in the final.',
    paragraphs: ['UEFA’s official highlights collect Liverpool’s four goals against Barcelona at Anfield.', 'The score changed the aggregate from 3–0 Barcelona to 4–3 Liverpool. The quick corner was the final twist, but the comeback was built across the full match.'],
    take: 'Comebacks rarely happen in one play. Watch how the pressure compounds before the famous corner.', question: 'What did Liverpool need to reach the final?', options: ['One goal', 'Four goals', 'A penalty shootout'], correct: 1, explanation: 'After losing the first leg 3–0, Liverpool needed four goals to progress.'
  },
  {
    id: 'brazil-germany-seven-one-video', sourceUrl: 'https://www.youtube.com/watch?v=aE4BdIP6bvc', title: 'The six minutes that changed a semifinal.',
    category: 'World Cup rewind', date: '2014-07-08', publisher: 'FIFA', tags: ['tournaments', 'statistics', 'history'], stat: '1–7', caption: 'Brazil vs Germany · 2014 semifinal',
    summary: 'Germany scored four times in six first-half minutes against Brazil. The official highlights make the tempo of the collapse impossible to miss.',
    paragraphs: ['Germany beat Brazil 7–1 in the 2014 FIFA World Cup semifinal in Belo Horizonte.', 'The score was 5–0 after 29 minutes. FIFA’s extended highlights show how quickly the match moved from tension to disbelief.'],
    take: 'When one team loses its distances after conceding, the next attack can arrive before anyone resets.', question: 'How many goals did Germany score?', options: ['Five', 'Seven', 'Nine'], correct: 1, explanation: 'Germany won the semifinal 7–1.'
  },
  {
    id: 'argentina-france-2022-final-video', sourceUrl: 'https://www.youtube.com/watch?v=IipmpVcISXE', title: 'A final that refused to end.',
    category: 'World Cup rewind', date: '2022-12-18', publisher: 'FIFA', tags: ['tournaments', 'players', 'match-moments'], stat: '3–3', caption: 'Argentina vs France · 2022 final',
    summary: 'Messi, Mbappé and a finish that went all the way to penalties. This is the official FIFA highlight reel.',
    paragraphs: ['Argentina and France drew 3–3 after extra time in the 2022 FIFA World Cup final.', 'Argentina won the penalty shootout 4–2. FIFA’s official highlights track the shifts in momentum from Argentina’s early lead to France’s comeback.'],
    take: 'The scoreboard can change faster than a team’s mentality. Pay attention to who still wants the ball after a momentum swing.', question: 'How was the 2022 final decided?', options: ['Golden goal', 'Penalty shootout', 'Replay'], correct: 1, explanation: 'Argentina won the shootout 4–2 after a 3–3 draw.'
  },
  {
    id: 'maradona-eight-minutes-video', sourceUrl: 'https://www.youtube.com/watch?v=FRAbNlPS2MI', title: 'Eight minutes, two football myths.',
    category: 'FIFA archive', date: '1986-06-22', publisher: 'FIFA', tags: ['history', 'players', 'club-history'], stat: '2–1', caption: 'Maradona against England',
    summary: 'The official FIFA film puts the disputed goal and the solo run together, exactly as the match unfolded.',
    paragraphs: ['Argentina beat England 2–1 in their 1986 World Cup quarterfinal.', 'FIFA’s film revisits the two Maradona goals: the first was controversial for the handball, while the second was a solo dribble through England’s defense.'],
    take: 'A highlight can be beautiful and complicated at the same time. Let the clip give you the sequence; keep the context too.', question: 'Which came second in this match?', options: ['The solo dribble goal', 'The handball goal', 'A penalty'], correct: 0, explanation: 'The solo run followed the controversial handball goal.'
  },
];

export interface FeedQuiz {
  id: string; title: string; prompt: string; options: [string, string, string]; correct: number; explanation: string;
}
/** Two optional breaks per session, positioned only after every third video. */
export const streamQuizzes: FeedQuiz[] = [
  { id: 'feed-reel-quiz-restarts', title: 'Quick break · 1 question', prompt: 'Why was Liverpool’s quick corner so effective?', options: ['Barcelona had not reset', 'The ball was out', 'It was a penalty'], correct: 0, explanation: 'The defenders were not set when Alexander-Arnold took the corner.' },
  { id: 'feed-reel-quiz-momentum', title: 'Quick break · 1 question', prompt: 'What is a useful cue after a momentum swing?', options: ['Who wants the ball next', 'The crowd volume only', 'The kit color'], correct: 0, explanation: 'The next player willing to receive can reveal whether a team is still composed.' },
];
export const editionQuizId = 'feed-quiz:2026-11-14';
export const dateLabel = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export const rankStories = (interests: InterestId[]) => [...stories].sort((a, b) => b.tags.filter(tag => interests.some(i => i === tag)).length - a.tags.filter(tag => interests.some(i => i === tag)).length);
export const rankStreamStories = (interests: InterestId[]) =>
  streamStories.filter(isVerifiedPublisherPost).sort((a, b) => {
    const interestDifference =
      b.tags.filter(tag => interests.some(interest => interest === tag)).length -
      a.tags.filter(tag => interests.some(interest => interest === tag)).length;

    // Editors append new drops to this catalogue. Within the same personal
    // relevance score, the newest addition should lead the reel.
    return interestDifference || streamStories.indexOf(b) - streamStories.indexOf(a);
  });
export function quizStory(feed: FeedState) {
  const read = Object.values(feed.views).filter(view => stories.some(post => post.id === view.postId));
  if (read.length < 2) return undefined;
  return stories.find(post => post.id === read.sort((a, b) => a.firstViewedAt.localeCompare(b.firstViewedAt))[0]?.postId);
}
