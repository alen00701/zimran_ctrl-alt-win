import type { CommunityEvent } from './content';
import styles from './Community.module.css';

/**
 * Sample photo standing in for a fictional venue. Photos are third-party samples with no club
 * crests in frame; get licensed or own photos before public release.
 */
export function VenuePhoto({ photo, className }: { photo: CommunityEvent['photo']; className?: string }) {
  return (
    <img
      className={[styles.venuePhoto, className].filter(Boolean).join(' ')}
      src={photo.src}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading="lazy"
      decoding="async"
      data-fit={photo.fit}
      style={photo.backdrop ? { background: photo.backdrop } : undefined}
    />
  );
}
