import venueBarUrl from './assets/venue-bar.jpg';
import styles from './Community.module.css';

/**
 * Sample photo of a bar, standing in for the fictional venue.
 * Source: homefans.com, cropped so no club crests or logos are in frame
 * (the app must not suggest a club partnership). Check licensing before public release.
 */
export const VENUE_PHOTO_CREDIT = 'homefans.com';

export function VenuePhoto({ venueName, className }: { venueName: string; className?: string }) {
  return (
    <img
      className={[styles.venuePhoto, className].filter(Boolean).join(' ')}
      src={venueBarUrl}
      width={1200}
      height={675}
      alt={`Sample photo for ${venueName}: fans at a long wooden bar with tall stools and beer taps`}
      loading="lazy"
      decoding="async"
    />
  );
}
