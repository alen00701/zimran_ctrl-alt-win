import { useSyncExternalStore } from 'react';
import type { GuestSlice, GuestState } from '../contracts/types';
import { getGuestState, subscribeGuestState } from './storage';

/** Whole guest state. Re-renders on any change (cheap: state is small). */
export function useGuestState(): GuestState {
  return useSyncExternalStore(subscribeGuestState, getGuestState, getGuestState);
}

/** One slice, e.g. useGuestSlice('community'). */
export function useGuestSlice<K extends GuestSlice>(slice: K): GuestState[K] {
  return useGuestState()[slice];
}
