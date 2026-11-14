/** Date and time labels for events. Pure functions, tested in community.test.ts. */

const fmt = (iso: string, timeZone: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-US', { timeZone, ...opts }).format(new Date(iso));

/** "Thursday, November 19, 2026" in the venue's zone. */
export const eventDateLabel = (iso: string, timeZone: string) =>
  fmt(iso, timeZone, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

/** "7:00 PM EST" in the venue's zone. */
export const eventTimeLabel = (iso: string, timeZone: string) =>
  fmt(iso, timeZone, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });

/** Parts for a calendar tile: { month: "NOV", day: "19", weekday: "THU" }. */
export function eventDateTile(iso: string, timeZone: string) {
  return {
    month: fmt(iso, timeZone, { month: 'short' }).toUpperCase(),
    day: fmt(iso, timeZone, { day: 'numeric' }),
    weekday: fmt(iso, timeZone, { weekday: 'short' }).toUpperCase(),
  };
}

export function currentTimeZone(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    return null;
  }
}

/**
 * The same moment in the viewer's zone, e.g. "Thu, Nov 19, 4:00 PM PST".
 * Null when the viewer's wall-clock time matches the venue's, so we don't repeat it.
 */
export function viewerTimeLabel(iso: string, venueZone: string, viewerZone: string | null = currentTimeZone()) {
  if (!viewerZone) return null;
  const wall: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  try {
    if (fmt(iso, venueZone, wall) === fmt(iso, viewerZone, wall)) return null;
    return fmt(iso, viewerZone, {
      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    });
  } catch {
    return null;
  }
}

/** Calendar date (YYYY-MM-DD) of an instant in a zone. */
function ymd(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return Date.UTC(get('year'), get('month') - 1, get('day'));
}

/** "Today", "Tomorrow", "In 5 days", or null once the event day has passed (venue calendar). */
export function countdownLabel(iso: string, timeZone: string, now: Date = new Date()): string | null {
  const days = Math.round((ymd(new Date(iso), timeZone) - ymd(now, timeZone)) / 86_400_000);
  if (days < 0) return null;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}
