import { SEED_POSTS } from '@/shared/fixtures/ids';
import type { FeedState, InterestId, SubjectTag } from '@/shared/contracts/types';
import { storyMedia } from './media';
import { pictureStories } from './pictures';
import { isVerifiedPublisherPost } from './publishers';

/** Anything that can appear as a card in the stream. `local` posts use team-supplied video files. */
export interface FeedPost {
  /** Team-supplied media with no known event date (shown without a date). */
  undated?: boolean;
  id: string; sourceUrl: string; title: string; summary: string; date: string;
  publisher: string; category: string; tags: SubjectTag[]; stat: string; caption: string;
  paragraphs: string[]; take: string; lesson?: string; clip?: boolean; preview?: boolean; local?: boolean;
}
export interface Story extends FeedPost {
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
/** The reel's photo cards are the team's own pictures; the six sourced seed stories stay open at /feed/:postId. */
export const streamStories: FeedPost[] = [
  ...pictureStories,
  {
    id: 'yamal-clip', sourceUrl: '', title: 'Lamine Yamal, in motion.', category: 'Player clip', date: '2026-11-14', publisher: 'The Touchline Desk',
    tags: ['players', 'techniques', 'match-moments'], stat: 'Yamal', caption: 'Lamine Yamal',
    summary: 'Lamine Yamal in a clip from the team’s own video library. Watch how he receives, turns and picks his moment.',
    paragraphs: ['This clip comes from the Touchline Desk’s own video library and is shown here as a short, original feed moment.', 'We keep the description to what the clip title says: Lamine Yamal. Watch it once for the result, then again for the detail.'],
    take: 'Watch it twice: first for the moment, then for the movement before it.', clip: false, local: true, undated: true,
  },
  {
    id: 'goalyamal-clip', sourceUrl: '', title: 'A Yamal goal, start to finish.', category: 'Goal clip', date: '2026-11-14', publisher: 'The Touchline Desk',
    tags: ['players', 'techniques', 'match-moments'], stat: 'Goal', caption: 'Lamine Yamal goal',
    summary: 'A goal by Lamine Yamal. Follow the build-up, the finish and the reaction in one short clip.',
    paragraphs: ['This clip comes from the Touchline Desk’s own video library and is shown here as a short, original feed moment.', 'We keep the description to what the clip title says: Lamine Yamal goal. Watch it once for the result, then again for the detail.'],
    take: 'Watch it twice: first for the moment, then for the movement before it.', clip: false, local: true, undated: true,
  },
  {
    id: 'barsapsglastmatch-clip', sourceUrl: '', title: 'Barça vs PSG: the last match.', category: 'Match recap', date: '2026-11-14', publisher: 'The Touchline Desk',
    tags: ['tactics', 'club-history', 'match-moments'], stat: 'Barça–PSG', caption: 'Barcelona vs Paris Saint-Germain',
    summary: 'Moments from the most recent Barcelona–Paris Saint-Germain meeting, cut into one watchable clip.',
    paragraphs: ['This clip comes from the Touchline Desk’s own video library and is shown here as a short, original feed moment.', 'We keep the description to what the clip title says: Barcelona vs Paris Saint-Germain. Watch it once for the result, then again for the detail.'],
    take: 'Watch it twice: first for the moment, then for the movement before it.', clip: false, local: true, undated: true,
  },
  {
    id: 'neymar-clip', sourceUrl: '', title: 'Neymar and the art of the dribble.', category: 'Player clip', date: '2026-11-14', publisher: 'The Touchline Desk',
    tags: ['players', 'techniques', 'match-moments'], stat: 'Neymar', caption: 'Neymar',
    summary: 'A Neymar clip built around flair: close control, quick feet and the one-v-one challenge.',
    paragraphs: ['This clip comes from the Touchline Desk’s own video library and is shown here as a short, original feed moment.', 'We keep the description to what the clip title says: Neymar. Watch it once for the result, then again for the detail.'],
    take: 'Watch it twice: first for the moment, then for the movement before it.', clip: false, local: true, undated: true,
  },
  {
    id: 'coutihno-clip', sourceUrl: '', title: 'Coutinho, vision and finish.', category: 'Player clip', date: '2026-11-14', publisher: 'The Touchline Desk',
    tags: ['players', 'techniques', 'match-moments'], stat: 'Coutinho', caption: 'Philippe Coutinho',
    summary: 'A Philippe Coutinho clip. Look for the weight of the pass and the strike from range.',
    paragraphs: ['This clip comes from the Touchline Desk’s own video library and is shown here as a short, original feed moment.', 'We keep the description to what the clip title says: Philippe Coutinho. Watch it once for the result, then again for the detail.'],
    take: 'Watch it twice: first for the moment, then for the movement before it.', clip: false, local: true, undated: true,
  },
  {
    id: 'doue-clip', sourceUrl: '', title: 'Désiré Doué: pace with the ball.', category: 'Player clip', date: '2026-11-14', publisher: 'The Touchline Desk',
    tags: ['players', 'techniques', 'match-moments'], stat: 'Doué', caption: 'Désiré Doué',
    summary: 'A Désiré Doué clip. Watch how he attacks space and keeps the ball moving at speed.',
    paragraphs: ['This clip comes from the Touchline Desk’s own video library and is shown here as a short, original feed moment.', 'We keep the description to what the clip title says: Désiré Doué. Watch it once for the result, then again for the detail.'],
    take: 'Watch it twice: first for the moment, then for the movement before it.', clip: false, local: true, undated: true,
  },
  {
    id: 'olise-clip', sourceUrl: '', title: 'Michael Olise, the left-footed creator.', category: 'Player clip', date: '2026-11-14', publisher: 'The Touchline Desk',
    tags: ['players', 'techniques', 'tactics'], stat: 'Olise', caption: 'Michael Olise',
    summary: 'A Michael Olise clip. A closer look at how he creates chances from wide areas.',
    paragraphs: ['This clip comes from the Touchline Desk’s own video library and is shown here as a short, original feed moment.', 'We keep the description to what the clip title says: Michael Olise. Watch it once for the result, then again for the detail.'],
    take: 'Watch it twice: first for the moment, then for the movement before it.', clip: false, local: true, undated: true,
  },
  {
    id: 'taarabt-clip', sourceUrl: '', title: 'Taarabt: the showman’s touch.', category: 'Player clip', date: '2026-11-14', publisher: 'The Touchline Desk',
    tags: ['players', 'techniques', 'match-moments'], stat: 'Taarabt', caption: 'Adel Taarabt',
    summary: 'An Adel Taarabt clip, a reminder that soccer can be as much about creativity as results.',
    paragraphs: ['This clip comes from the Touchline Desk’s own video library and is shown here as a short, original feed moment.', 'We keep the description to what the clip title says: Adel Taarabt. Watch it once for the result, then again for the detail.'],
    take: 'Watch it twice: first for the moment, then for the movement before it.', clip: false, local: true, undated: true,
  },
];

export interface FeedQuiz {
  id: string; title: string; prompt: string; options: [string, string, string]; correct: number; explanation: string;
}
/** Two optional breaks per session, positioned only after every third video. */
const baseQuizzes: FeedQuiz[] = [
  { id: 'feed-reel-quiz-restarts', title: 'Quick break · 1 question', prompt: 'Why was Liverpool’s quick corner so effective?', options: ['Barcelona had not reset', 'The ball was out', 'It was a penalty'], correct: 0, explanation: 'The defenders were not set when Alexander-Arnold took the corner.' },
  { id: 'feed-reel-quiz-momentum', title: 'Quick break · 1 question', prompt: 'What is a useful cue after a momentum swing?', options: ['Who wants the ball next', 'The crowd volume only', 'The kit color'], correct: 0, explanation: 'The next player willing to receive can reveal whether a team is still composed.' },
];
/** One optional quiz per loop. The pool is the two quick questions plus one question per seed story. */
export const streamQuizzes: FeedQuiz[] = [
  ...baseQuizzes,
  ...pictureStories.map((story): FeedQuiz => ({
    id: `feed-reel-quiz-${story.id}`, title: 'Quick break · 1 question', prompt: story.question,
    options: story.options, correct: story.correct, explanation: story.explanation,
  })),
];
export const editionQuizId = 'feed-quiz:2026-11-14';
export const dateLabel = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export const rankStories = (interests: InterestId[]) => [...stories].sort((a, b) => b.tags.filter(tag => interests.some(i => i === tag)).length - a.tags.filter(tag => interests.some(i => i === tag)).length);
/** The post that always opens the stream, whatever the reader's interests. */
export const PINNED_FIRST_POST_ID = 'yamal-clip';
const interestScore = (post: FeedPost, interests: InterestId[]) => post.tags.filter(tag => interests.some(interest => interest === tag)).length;
/** Small seeded PRNG (mulberry32): the same seed gives the same shuffle, so it is testable. */
function random(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(items: T[], rand: () => number) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
/** Shuffles videos and photo stories separately, then alternates them so the two kinds are mixed. */
function mixed(posts: FeedPost[], rand: () => number) {
  const videos = shuffle(posts.filter(post => storyMedia[post.id]?.video), rand);
  const photos = shuffle(posts.filter(post => !storyMedia[post.id]?.video), rand);
  const out: FeedPost[] = [];
  while (videos.length || photos.length) {
    if (videos.length) out.push(videos.shift()!);
    if (photos.length) out.push(photos.shift()!);
  }
  return out;
}
/**
 * Yamal first; then the reader's interests decide the tier; inside each tier videos and photos are
 * shuffled and alternated. Pass a new `seed` (for example once per visit) to get a new order.
 */
export const rankStreamStories = (interests: InterestId[], seed = 1) => {
  const rand = random(seed);
  const eligible = streamStories.filter(post => post.local || isVerifiedPublisherPost(post));
  const pinned = eligible.filter(post => post.id === PINNED_FIRST_POST_ID);
  const tiers = new Map<number, FeedPost[]>();
  for (const post of eligible.filter(post => post.id !== PINNED_FIRST_POST_ID)) {
    const score = interestScore(post, interests);
    tiers.set(score, [...(tiers.get(score) ?? []), post]);
  }
  const ordered = [...tiers.keys()].sort((a, b) => b - a).flatMap(score => mixed(tiers.get(score)!, rand));
  return [...pinned, ...ordered];
};
/** Stories that carry a question: the sourced seeds plus the picture stories. */
export const quizStories: Story[] = [...stories, ...pictureStories];
export const findStory = (id: string) => quizStories.find(post => post.id === id);
export function quizStory(feed: FeedState) {
  const read = Object.values(feed.views).filter(view => quizStories.some(post => post.id === view.postId));
  if (read.length < 2) return undefined;
  return quizStories.find(post => post.id === read.sort((a, b) => a.firstViewedAt.localeCompare(b.firstViewedAt))[0]?.postId);
}
