import { useSyncExternalStore } from 'react';

/** The reader's sound preference for the whole feed. Videos open with sound on; one tap on "Mute" turns it off everywhere. */
let on = true;
const listeners = new Set<() => void>();
export const setSoundOn = (value: boolean) => {
  if (on === value) return;
  on = value;
  listeners.forEach(l => l());
};
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const useSoundOn = () => useSyncExternalStore(subscribe, () => on, () => true);
