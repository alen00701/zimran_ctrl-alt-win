/** Tiny UI store: is the "out of hearts" dialog open? Kept apart from the saved profile on purpose. */
import { useSyncExternalStore } from 'react';

let open = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const openOutOfHearts = () => {
  if (open) return;
  open = true;
  emit();
};
export const closeOutOfHearts = () => {
  if (!open) return;
  open = false;
  emit();
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const useOutOfHeartsOpen = () => useSyncExternalStore(subscribe, () => open, () => false);
