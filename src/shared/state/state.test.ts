import { beforeEach, describe, expect, it } from 'vitest';
import { __setBackendForTests, getGuestState, STORAGE_KEY, updateSlice } from './storage';
import { communityActions, courseActions, feedActions, preferencesActions, resetDemo, scoreboardActions } from './actions';
import { isLessonUnlocked, resumableLesson, viewedPostCount } from './selectors';

function mem() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), m };
}

let b: ReturnType<typeof mem>;
beforeEach(() => {
  b = mem();
  __setBackendForTests(b);
});

describe('guest storage', () => {
  it('starts with safe defaults', () => {
    expect(getGuestState().preferences.onboardedAt).toBeNull();
    expect(getGuestState().course.membership.status).toBe('none');
  });

  it('scoped writes preserve other slices, even from a stale snapshot', () => {
    const stale = getGuestState();
    courseActions.openLesson('rules-aggregate-score', 'Aggregate');
    communityActions.rsvp('evt');
    // A component that still holds `stale` updates its own slice:
    updateSlice('feed', (f) => ({ ...f, views: { ...stale.feed.views, p1: { postId: 'p1', tags: [], firstViewedAt: 'x' } } }));
    const s = getGuestState();
    expect(s.course.lessons['rules-aggregate-score']).toBeDefined();
    expect(s.community.rsvps.evt?.status).toBe('going');
    expect(s.feed.views.p1).toBeDefined();
  });

  it('counts distinct stories once', () => {
    feedActions.markPostViewed('a', ['tactics']);
    feedActions.markPostViewed('a', ['tactics']);
    feedActions.markPostViewed('b', ['rules']);
    expect(viewedPostCount(getGuestState())).toBe(2);
  });

  it('awards points only for the first attempt', () => {
    expect(scoreboardActions.recordFirstAttempt('soccer', 'ex1', true).awarded).toBe(10);
    const retry = scoreboardActions.recordFirstAttempt('soccer', 'ex1', true);
    expect(retry.awarded).toBe(0);
    expect(retry.alreadyAttempted).toBe(true);
    expect(scoreboardActions.recordFirstAttempt('soccer', 'ex2', false).awarded).toBe(0);
    expect(Object.keys(getGuestState().scoreboard.records)).toHaveLength(2);
  });

  it('gates the third lesson until demo membership', () => {
    for (const id of ['l1', 'l2']) {
      courseActions.openLesson(id, id);
      courseActions.completeLesson(id);
      courseActions.completeLesson(id);
    }
    const c = () => getGuestState().course;
    expect(c().completedLessonIds).toEqual(['l1', 'l2']);
    expect(isLessonUnlocked(c(), 'l1')).toBe(true);
    expect(isLessonUnlocked(c(), 'l3')).toBe(false);
    courseActions.startDemoMembership();
    expect(isLessonUnlocked(c(), 'l3')).toBe(true);
  });

  it('keeps lesson step across reopen and survives preference edits', () => {
    courseActions.openLesson('l1', 'L1');
    courseActions.setStep('l1', 3);
    courseActions.openLesson('l1', 'L1');
    preferencesActions.completeOnboarding('new', ['rules']);
    preferencesActions.setExpertise('expert');
    expect(resumableLesson(getGuestState().course)?.currentStep).toBe(3);
  });

  it('reloads from storage and recovers from corrupt JSON', () => {
    communityActions.joinGroup('g1');
    __setBackendForTests(b); // simulate reload with the same storage
    expect(getGuestState().community.groups.g1).toBeDefined();
    b.setItem(STORAGE_KEY, '{not json');
    __setBackendForTests(b);
    expect(getGuestState().community.groups).toEqual({});
  });

  it('reset clears everything', () => {
    communityActions.joinGroup('g1');
    resetDemo();
    expect(getGuestState().community.groups).toEqual({});
  });
});
