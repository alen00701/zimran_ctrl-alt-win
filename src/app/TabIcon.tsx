import type { TabId } from '@/shared/routes';

const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** Simple original line icons for the four tabs. */
export function TabIcon({ tab }: { tab: TabId }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      {tab === 'feed' && (
        <g {...P}>
          <rect x="3.5" y="4" width="17" height="16" rx="3" />
          <path d="M7.5 8.5h9M7.5 12h9M7.5 15.5h5" />
        </g>
      )}
      {tab === 'learn' && (
        <g {...P}>
          <path d="M2.5 9 12 4.5 21.5 9 12 13.5z" />
          <path d="M6.5 11v4.5c1.5 1.6 3.4 2.4 5.5 2.4s4-.8 5.5-2.4V11M21.5 9v5" />
        </g>
      )}
      {tab === 'community' && (
        <g {...P}>
          <circle cx="9" cy="9" r="3.2" />
          <circle cx="16.8" cy="10" r="2.5" />
          <path d="M3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8M15 14.6c2.6-.4 4.9 1 5.5 4" />
        </g>
      )}
      {tab === 'account' && (
        <g {...P}>
          <circle cx="12" cy="8.5" r="3.8" />
          <path d="M4.5 20c.9-3.8 3.8-6 7.5-6s6.6 2.2 7.5 6" />
        </g>
      )}
    </svg>
  );
}
