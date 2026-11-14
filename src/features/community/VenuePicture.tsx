import styles from './VenuePicture.module.css';

/**
 * Picture of the watch-party venue. The venue is fictional, so this is an original
 * illustration (drawn with the brand tokens), never a photo of a real bar.
 */
export function VenuePicture({ venueName, className }: { venueName: string; className?: string }) {
  return (
    <svg
      className={[styles.art, className].filter(Boolean).join(' ')}
      viewBox="0 0 640 360"
      role="img"
      aria-label={`Illustration of ${venueName}: a taproom with a big screen showing a soccer match above the bar`}
    >
      {/* room */}
      <rect className={styles.wall} width="640" height="360" />
      <rect className={styles.floor} y="300" width="640" height="60" />

      {/* pendant lamps */}
      {[156, 484].map((x) => (
        <g key={x}>
          <circle className={styles.glow} cx={x} cy="52" r="58" />
          {/* starts above the frame so the cord still reaches the ceiling when the card shows extra wall */}
          <line className={styles.cord} x1={x} y1="-240" x2={x} y2="30" />
          <path className={styles.shade} d={`M${x - 20} 50 L${x - 9} 30 H${x + 9} L${x + 20} 50 Z`} />
          <ellipse className={styles.bulb} cx={x} cy="51" rx="13" ry="4" />
        </g>
      ))}

      {/* big screen with the match on */}
      <rect className={styles.screenFrame} x="186" y="34" width="268" height="158" rx="10" />
      <rect className={styles.pitch} x="194" y="42" width="252" height="142" rx="4" />
      <g className={styles.pitchLine}>
        <line x1="320" y1="42" x2="320" y2="184" />
        <circle cx="320" cy="113" r="24" />
        <rect x="194" y="78" width="38" height="70" />
        <rect x="408" y="78" width="38" height="70" />
        <rect x="194" y="96" width="14" height="34" />
        <rect x="432" y="96" width="14" height="34" />
      </g>
      <circle className={styles.ball} cx="352" cy="100" r="5" />
      <rect className={styles.liveChip} x="204" y="50" width="44" height="18" rx="9" />
      <text className={styles.liveText} x="226" y="63" textAnchor="middle">LIVE</text>

      {/* venue sign */}
      <rect className={styles.sign} x="24" y="92" width="126" height="64" rx="12" />
      <text className={styles.signText} x="87" y="120" textAnchor="middle">THE FAR POST</text>
      <text className={styles.signSub} x="87" y="141" textAnchor="middle">TAPROOM</text>

      {/* back shelves */}
      {[118, 170].map((y) => (
        <g key={y}>
          {[490, 508, 526, 544, 562, 580, 598].map((x, i) => (
            <rect
              key={x}
              className={[styles.bottleA, styles.bottleB, styles.bottleC][(i + (y === 118 ? 0 : 1)) % 3]}
              x={x}
              y={y - (i % 2 ? 30 : 36)}
              width="10"
              height={i % 2 ? 30 : 36}
              rx="3"
            />
          ))}
          <rect className={styles.shelf} x="478" y={y} width="140" height="5" rx="2" />
        </g>
      ))}

      {/* taps */}
      <rect className={styles.tapTower} x="300" y="206" width="40" height="28" rx="6" />
      {[308, 320, 332].map((x) => (
        <g key={x}>
          <line className={styles.tapStem} x1={x} y1="206" x2={x} y2="196" />
          <rect className={styles.tapHandle} x={x - 3} y="182" width="6" height="16" rx="3" />
        </g>
      ))}

      {/* pints on the bar */}
      {[176, 202, 430, 500].map((x) => (
        <g key={x}>
          <rect className={styles.beer} x={x} y="208" width="16" height="26" rx="3" />
          <rect className={styles.foam} x={x - 1} y="204" width="18" height="8" rx="4" />
        </g>
      ))}

      {/* bar counter */}
      <rect className={styles.counterTop} y="232" width="640" height="12" />
      <rect className={styles.counter} y="244" width="640" height="68" />
      {[40, 120, 200, 280, 360, 440, 520, 600].map((x) => (
        <line key={x} className={styles.slat} x1={x} y1="252" x2={x} y2="304" />
      ))}

      {/* stools */}
      {[64, 180, 296, 412].map((x) => (
        <g key={x}>
          <line className={styles.stoolLeg} x1={x - 12} y1="296" x2={x - 18} y2="352" />
          <line className={styles.stoolLeg} x1={x + 12} y1="296" x2={x + 18} y2="352" />
          <line className={styles.stoolLeg} x1={x - 15} y1="330" x2={x + 15} y2="330" />
          <rect className={styles.stoolSeat} x={x - 24} y="284" width="48" height="14" rx="7" />
        </g>
      ))}
    </svg>
  );
}
