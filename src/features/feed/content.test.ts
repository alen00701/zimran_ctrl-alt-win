import { describe, expect, it } from 'vitest';
import { SEED_POSTS } from '@/shared/fixtures/ids';
import { quizStory, rankStories, stories } from './content';
import type { FeedState } from '@/shared/contracts/types';

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
