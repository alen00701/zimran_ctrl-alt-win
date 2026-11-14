import { describe, expect, it } from 'vitest';
import { SEED_POSTS } from '@/shared/fixtures/ids';
import { quizStory, rankStories, rankStreamStories, stories, streamQuizzes, streamStories } from './content';
import type { FeedState } from '@/shared/contracts/types';
import { storyMedia } from './media';
import { canSubmitForReview, isVerifiedPublisherPost } from './publishers';

describe('edition selection', () => {
  it('keeps every required source and unique public ID', () => {
    expect(stories.map(({ id, sourceUrl }) => ({ id, sourceUrl }))).toEqual(SEED_POSTS);
    expect(new Set(stories.map(p => p.id)).size).toBe(6);
  });
  it('ranks interests without hiding discovery stories or mutating the catalog', () => {
    expect(rankStories(['transfers'])[0]?.id).toBe(SEED_POSTS[1].id);
    expect(rankStories(['rules', 'tactics'])[0]?.id).toBe(SEED_POSTS[2].id);
    expect(rankStories(['transfers'])).toHaveLength(6);
    expect(rankStories([]).map(p => p.id)).toEqual(SEED_POSTS.map(p => p.id));
  });
  it('adds a larger stream catalog and keeps quiz breaks intentionally scarce', () => {
    expect(streamStories).toHaveLength(14);
    expect(streamQuizzes).toHaveLength(2 + stories.length);
    expect(new Set(streamQuizzes.map(q => q.id)).size).toBe(streamQuizzes.length);
    expect(rankStreamStories(['tactics'])).toHaveLength(14);
    expect(new Set(streamStories.map(post => post.id)).size).toBe(streamStories.length);
    expect(streamStories.every(post => post.local || isVerifiedPublisherPost(post))).toBe(true);
  });
  it('opens the stream with Yamal for every interest set and has a video for every local post', () => {
    for (const interests of [[], ['tactics'], ['transfers', 'rules']] as const) expect(rankStreamStories([...interests])[0]?.id).toBe('yamal-clip');
    const order = rankStreamStories([], 7).slice(1);
    expect(order.some((post, i) => i > 0 && !!post.local !== !!order[i - 1]!.local)).toBe(true);
    expect(rankStreamStories([], 7).map(p => p.id)).toEqual(rankStreamStories([], 7).map(p => p.id));
    expect(new Set([1, 2, 3, 4, 5].map(seed => rankStreamStories([], seed).map(p => p.id).join())).size).toBeGreaterThan(1);
    for (const post of streamStories.filter(p => p.local)) expect(storyMedia[post.id]?.video).toBeTruthy();
  });
  it('allows publishing only from verified-source staff, never the AI assistant', () => {
    const submission = { publisherId: 'uefa', sourceUrl: 'https://www.uefa.com/story', title: 'A source post', summary: 'A sourced update.', publishedAt: '2026-11-14T12:00:00Z' };
    expect(canSubmitForReview({ ...submission, actorRole: 'editor' })).toBe(true);
    expect(canSubmitForReview({ ...submission, actorRole: 'ai-assistant' })).toBe(false);
    expect(canSubmitForReview({ ...submission, actorRole: 'owner', sourceUrl: 'https://untrusted.example/story' })).toBe(false);
  });
  it('requires two known distinct stories and asks about an actually read story', () => {
    const feed: FeedState = { views: {}, quizzes: {}, picks: {} };
    const id = SEED_POSTS[3].id;
    const view = { postId: id, tags: [], firstViewedAt: '2026-11-14T10:00:00Z' };
    feed.views[id] = view;
    feed.views[id] = view;
    expect(quizStory(feed)).toBeUndefined();
    feed.views.unknown = { ...view, postId: 'unknown' };
    expect(quizStory(feed)).toBeUndefined();
    feed.views[SEED_POSTS[0].id] = { ...view, postId: SEED_POSTS[0].id, firstViewedAt: '2026-11-14T11:00:00Z' };
    expect(quizStory(feed)?.id).toBe(id);
  });
});
