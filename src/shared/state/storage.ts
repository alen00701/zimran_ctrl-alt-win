/**
 * Versioned browser-storage adapter for the guest profile.
 *
 * Rules:
 * - Every write is SCOPED to one slice and re-reads the latest persisted state first,
 *   so a write from Feed can never erase Learn, Community or Account data.
 * - There is intentionally no public "save whole state" function. Components cannot
 *   overwrite a full profile with an old snapshot.
 * - Corrupt or missing data falls back to safe defaults. Unknown future versions are
 *   never overwritten silently: we keep a backup key.
 */
import type { GuestSlice, GuestState, StoredEnvelope } from '../contracts/types';
import { MAX_HEARTS } from '../contracts/catalog';
import { createDefaultState } from './defaults';

export const STORAGE_KEY = 'rtg.guest';
export const STORAGE_VERSION = 1;
const BACKUP_KEY = `${STORAGE_KEY}.backup`;

interface Backend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function memoryBackend(): Backend {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
  };
}

function pickBackend(): Backend {
  try {
    const ls = globalThis.localStorage;
    const probe = `${STORAGE_KEY}.probe`;
    ls.setItem(probe, '1');
    ls.removeItem(probe);
    return ls;
  } catch {
    return memoryBackend();
  }
}

let backend: Backend = pickBackend();

/* ---------- normalization (safe defaults for partial / old data) ---------- */

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const strArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);
const rec = <T>(v: unknown): Record<string, T> => (isObj(v) ? (v as Record<string, T>) : {});

export function normalizeState(input: unknown): GuestState {
  const d = createDefaultState();
  if (!isObj(input)) return d;
  const p = isObj(input.preferences) ? input.preferences : {};
  const f = isObj(input.feed) ? input.feed : {};
  const c = isObj(input.course) ? input.course : {};
  const m = isObj(c.membership) ? c.membership : {};
  const cm = isObj(input.community) ? input.community : {};
  const s = isObj(input.scoreboard) ? input.scoreboard : {};
  const g = isObj(input.game) ? input.game : {};
  const hearts = typeof g.hearts === 'number' && Number.isFinite(g.hearts) ? Math.min(MAX_HEARTS, Math.max(0, Math.floor(g.hearts))) : MAX_HEARTS;
  const expertise = p.expertise;
  return {
    preferences: {
      expertise: expertise === 'new' || expertise === 'familiar' || expertise === 'expert' ? expertise : null,
      interests: strArr(p.interests) as GuestState['preferences']['interests'],
      onboardedAt: typeof p.onboardedAt === 'string' ? p.onboardedAt : null,
    },
    feed: { views: rec(f.views), quizzes: rec(f.quizzes), picks: rec(f.picks) },
    course: {
      lessons: rec(c.lessons),
      completedLessonIds: [...new Set(strArr(c.completedLessonIds))],
      lastLessonId: typeof c.lastLessonId === 'string' ? c.lastLessonId : null,
      membership: {
        status: m.status === 'demo' ? 'demo' : 'none',
        startedAt: typeof m.startedAt === 'string' ? m.startedAt : null,
      },
    },
    community: { groups: rec(cm.groups), rsvps: rec(cm.rsvps) },
    scoreboard: { records: rec(s.records) },
    game: { hearts },
  };
}

/** Add a case per version bump. Each step upgrades from version N to N+1. */
function migrate(envelope: { version: number; state: unknown }): unknown {
  const state = envelope.state;
  // v1 is the first published version; nothing to migrate yet.
  return state;
}

function parse(raw: string | null): GuestState {
  if (!raw) return createDefaultState();
  try {
    const env = JSON.parse(raw) as Partial<StoredEnvelope>;
    const version = typeof env.version === 'number' ? env.version : 0;
    if (version > STORAGE_VERSION) {
      // Data from a newer build: keep a copy, use defaults in memory, do not clobber on read.
      backend.setItem(BACKUP_KEY, raw);
      return normalizeState(env.state);
    }
    return normalizeState(migrate({ version, state: env.state }));
  } catch {
    try {
      backend.setItem(BACKUP_KEY, raw);
    } catch {
      /* ignore */
    }
    return createDefaultState();
  }
}

/* ---------- store ---------- */

type Listener = () => void;
const listeners = new Set<Listener>();
let cachedRaw: string | null = null;
let cached: GuestState = createDefaultState();
let loaded = false;

function load(): GuestState {
  const raw = safeGet();
  if (!loaded || raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parse(raw);
    loaded = true;
  }
  return cached;
}

function safeGet(): string | null {
  try {
    return backend.getItem(STORAGE_KEY);
  } catch {
    return cachedRaw;
  }
}

function persist(state: GuestState) {
  const env: StoredEnvelope = { version: STORAGE_VERSION, updatedAt: new Date().toISOString(), state };
  const raw = JSON.stringify(env);
  try {
    backend.setItem(STORAGE_KEY, raw);
  } catch {
    // Quota / private mode: keep the session working in memory.
  }
  cachedRaw = raw;
  cached = state;
  listeners.forEach((l) => l());
}

/** Current guest state (immutable; replaced on every write). */
export function getGuestState(): GuestState {
  return loaded ? cached : load();
}

export function subscribeGuestState(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Scoped update. Re-reads the latest persisted state, applies `updater` to one slice,
 * and writes. Return the same object to skip the write.
 */
export function updateSlice<K extends GuestSlice>(
  slice: K,
  updater: (prev: GuestState[K]) => GuestState[K],
): GuestState {
  const latest = load();
  const nextSlice = updater(latest[slice]);
  if (nextSlice === latest[slice]) return latest;
  const next = { ...latest, [slice]: nextSlice } as GuestState;
  persist(next);
  return next;
}

export const RESET_CONFIRMATION = 'RESET' as const;

/** Full demo reset. Requires the literal confirmation so it cannot be called by accident. */
export function resetGuestState(confirmation: typeof RESET_CONFIRMATION): void {
  if (confirmation !== RESET_CONFIRMATION) return;
  persist(createDefaultState());
}

/* Cross-tab sync: another browser tab wrote the profile. */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return;
    cachedRaw = null;
    loaded = false;
    load();
    listeners.forEach((l) => l());
  });
}

/** Test helper: swap the backend and clear caches. */
export function __setBackendForTests(b?: Backend) {
  backend = b ?? memoryBackend();
  cachedRaw = null;
  loaded = false;
  cached = createDefaultState();
}
