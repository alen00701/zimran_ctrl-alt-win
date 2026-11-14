import venueBarUrl from './assets/venue-bar.jpg';
import styles from './Community.module.css';

/**
 * Sample photo of a sports bar, standing in for the fictional venue.
 * Source: a Google Images thumbnail (547×365, cropped to 16:9); no club crests in frame.
 * Original photographer unknown: get a licensed or own photo before public release.
 */
export function VenuePhoto({ venueName, className }: { venueName: string; className?: string }) {
  return (
    <img
      className={[styles.venuePhoto, className].filter(Boolean).join(' ')}
      src={venueBarUrl}
      width={547}
      height={308}
      alt={`Sample photo for ${venueName}: a sports bar with a big screen showing a match, tables and tall stools`}
      loading="lazy"
      decoding="async"
    />
  );
}
