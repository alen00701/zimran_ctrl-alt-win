/**
 * Matchday chat for fans who RSVP'd "I'm going".
 *
 * Demo messages are fixed sample content. The guest's own messages are kept in this
 * browser only, under a Community-owned key (the shared guest state has no chat slice).
 * Chat never touches points: the leaderboard counts Learn progress only.
 */
import { useSyncExternalStore } from 'react';
import { DEMO_EVENT } from '@/shared/fixtures/ids';

export const CHAT_STORAGE_KEY = 'rtg.community.chat';
const CHAT_VERSION = 1;
export const CHAT_MAX_LENGTH = 280;
const MAX_STORED_PER_EVENT = 50;

export interface ChatMessage {
  id: string;
  author: string;
  /** Host = the organizing group. */
  role: 'host' | 'fan' | 'you';
  at: string;
  text: string;
}

/** Sample discussion. Names match the shared "Demo players"; all of it is illustrative. */
export const DEMO_CHAT: Record<string, ChatMessage[]> = {
  [DEMO_EVENT.id]: [
    { id: 'd1', author: 'Orlando Matchday Regulars', role: 'host', at: '2026-11-12T18:05:00-05:00', text: 'Welcome, everyone! Our table is the long one by the big screen. Ask for “Matchday Regulars” at the door.' },
    { id: 'd2', author: 'Jordan T.', role: 'fan', at: '2026-11-12T18:21:00-05:00', text: 'First time watching a playoff game with a crowd. Anything I should know?' },
    { id: 'd3', author: 'Maya R.', role: 'fan', at: '2026-11-12T18:34:00-05:00', text: 'Just bring your voice 😄 Coach does a two-minute “what to watch” before kickoff, super helpful if you’re new.' },
    { id: 'd4', author: 'Alex P.', role: 'fan', at: '2026-11-13T09:12:00-05:00', text: 'Is there parking nearby?' },
    { id: 'd5', author: 'Orlando Matchday Regulars', role: 'host', at: '2026-11-13T09:40:00-05:00', text: 'Street parking fills up fast on matchdays. Rideshare is easiest.' },
    { id: 'd6', author: 'Sam K.', role: 'fan', at: '2026-11-13T20:02:00-05:00', text: 'Coming straight from work, could someone save me a stool? I’ll get there around 7:30.' },
    { id: 'd7', author: 'Maya R.', role: 'fan', at: '2026-11-14T08:47:00-05:00', text: 'Got you, Sam. Also: who’s brave enough to post a score prediction? 👀' },
  ],
};

/* ---------- guest's own messages (this browser only) ---------- */

type Store = Record<string, ChatMessage[]>;
const EMPTY: ChatMessage[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cached: Store = {};

function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function read(): Store {
  let raw: string | null = null;
  try {
    raw = storage()?.getItem(CHAT_STORAGE_KEY) ?? null;
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const env = raw ? (JSON.parse(raw) as { version?: number; posts?: Store }) : null;
    cached = env?.version === CHAT_VERSION && env.posts && typeof env.posts === 'object' ? env.posts : {};
  } catch {
    cached = {};
  }
  return cached;
}

function write(next: Store) {
  const raw = JSON.stringify({ version: CHAT_VERSION, posts: next });
  try {
    storage()?.setItem(CHAT_STORAGE_KEY, raw);
  } catch {
    /* private mode / quota: keep it in memory for this visit */
  }
  cachedRaw = raw;
  cached = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CHAT_STORAGE_KEY) listener();
  };
  if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage);
  };
}

export function getOwnMessages(eventId: string): ChatMessage[] {
  return read()[eventId] ?? EMPTY;
}

/** Returns the stored message, or null when the text is empty after trimming. */
export function postMessage(eventId: string, text: string, now: Date = new Date()): ChatMessage | null {
  const clean = text.trim().slice(0, CHAT_MAX_LENGTH);
  if (!clean) return null;
  const store = read();
  const msg: ChatMessage = { id: `you-${now.getTime()}`, author: 'You', role: 'you', at: now.toISOString(), text: clean };
  write({ ...store, [eventId]: [...(store[eventId] ?? []), msg].slice(-MAX_STORED_PER_EVENT) });
  return msg;
}

/** Demo messages first, then the guest's, in time order. */
export function useEventChat(eventId: string): ChatMessage[] {
  const own = useSyncExternalStore(subscribe, () => getOwnMessages(eventId), () => EMPTY);
  return [...(DEMO_CHAT[eventId] ?? []), ...own];
}

/** Test helper: forget the in-memory cache. */
export function __resetChatCacheForTests() {
  cachedRaw = undefined;
  cached = {};
}
