/** Small original line icons (no icon library dependency). */
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export type IconName = 'check' | 'lock' | 'star' | 'play' | 'trophy' | 'bolt' | 'flame' | 'book' | 'up' | 'dots' | 'crown';

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      {name === 'check' && <path {...P} strokeWidth={3.2} d="M5 12.5l4.5 4.5L19 7.5" />}
      {name === 'lock' && (
        <g {...P}>
          <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" stroke="none" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        </g>
      )}
      {name === 'star' && <path fill="currentColor" d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" />}
      {name === 'play' && <path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.9l10.2-6.5a1 1 0 0 0 0-1.7L9.5 4.6A1 1 0 0 0 8 5.5z" />}
      {name === 'trophy' && (
        <g {...P}>
          <path d="M7 4h10v5a5 5 0 0 1-10 0z" fill="currentColor" />
          <path d="M7 6H4.5a2.5 2.5 0 0 0 2.6 3.4M17 6h2.5a2.5 2.5 0 0 1-2.6 3.4M12 14v3.5M8.5 20.5h7M9.5 17.5h5v3h-5z" />
        </g>
      )}
      {name === 'bolt' && <path fill="currentColor" d="M13.5 2.5L5 13.5h6l-1 8 8.5-11h-6z" />}
      {name === 'flame' && <path fill="currentColor" d="M12 2.5c.6 3.3 4.8 5.2 4.8 10.3a4.8 4.8 0 0 1-9.6 0c0-2.2 1-3.6 2.2-4.8.2 1.5.9 2.6 2 3.1C11 8.4 11.2 5.3 12 2.5z" />}
      {name === 'book' && (
        <g {...P}>
          <path d="M4.5 5.5c2.5-1.2 5-1.2 7.5 0v14c-2.5-1.2-5-1.2-7.5 0zM19.5 5.5c-2.5-1.2-5-1.2-7.5 0v14c2.5-1.2 5-1.2 7.5 0z" />
        </g>
      )}
      {name === 'up' && <path {...P} strokeWidth={2.8} d="M12 19V5M5.5 11.5L12 5l6.5 6.5" />}
      {name === 'dots' && (
        <g fill="currentColor">
          <circle cx="6" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="18" cy="12" r="1.8" />
        </g>
      )}
      {name === 'crown' && <path fill="currentColor" d="M3.5 8l4.5 4 4-6.5 4 6.5 4.5-4-1.8 10.5H5.3z" />}
    </svg>
  );
}
