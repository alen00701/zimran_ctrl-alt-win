import { beforeEach, describe, expect, it } from 'vitest';
import { MAX_HEARTS } from '../contracts/catalog';
import { courseActions, gameActions, outOfHearts, scoreboardActions } from './actions';
import { getGuestState, __setBackendForTests } from './storage';
import { guestRecords, isPro, totalPoints } from './selectors';

beforeEach(() => __setBackendForTests());

describe('hearts and plan', () => {
  it('starts Free with full hearts', () => {
    expect(getGuestState().game.hearts).toBe(MAX_HEARTS);
    expect(isPro(getGuestState())).toBe(false);
  });

  it('a wrong answer costs one heart; hitting zero blocks answers until restored', () => {
    for (let i = 1; i <= MAX_HEARTS; i++) expect(gameActions.loseHeart()).toEqual({ lost: true, hearts: MAX_HEARTS - i });
    expect(getGuestState().game.hearts).toBe(0);
    expect(outOfHearts()).toBe(true);
    expect(gameActions.loseHeart()).toEqual({ lost: false, hearts: 0 });
    gameActions.refillHearts();
    expect(getGuestState().game.hearts).toBe(MAX_HEARTS);
    expect(outOfHearts()).toBe(false);
  });

  it('Pro never spends hearts, keeps the saved count, and the switch is the demo membership', () => {
    gameActions.loseHeart();
    gameActions.setPlan('pro');
    expect(isPro(getGuestState())).toBe(true);
    expect(getGuestState().course.membership.status).toBe('demo');
    for (let i = 0; i < 10; i++) expect(gameActions.loseHeart().lost).toBe(false);
    expect(getGuestState().game.hearts).toBe(MAX_HEARTS - 1);
    expect(outOfHearts()).toBe(false);
    gameActions.setPlan('free');
    expect(isPro(getGuestState())).toBe(false);
    expect(getGuestState().game.hearts).toBe(MAX_HEARTS - 1);
  });

  it('survives a reload (saved with the profile) and never touches other slices', () => {
    courseActions.openLesson('a', 'A');
    gameActions.loseHeart();
    expect(getGuestState().course.lessons['a']).toBeDefined();
    expect(getGuestState().game.hearts).toBe(MAX_HEARTS - 1);
  });
});

describe('points', () => {
  it('one total across the profile; a completion bonus and answers count once', () => {
    scoreboardActions.recordFirstAttempt('soccer', 'learn:x:quiz', true);
    scoreboardActions.recordFirstAttempt('soccer', 'learn:x:complete', true);
    scoreboardActions.recordFirstAttempt('soccer', 'learn:x:complete', true);
    scoreboardActions.recordFirstAttempt('soccer', 'learn:y:quiz', false);
    expect(totalPoints(guestRecords(getGuestState()))).toBe(20);
  });
});
