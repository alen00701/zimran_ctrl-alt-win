/**
 * Original vector illustrations for lessons, drills, quiz questions and blocks.
 * Drawn in the brand palette with semantic tokens only. No photos, logos or crests.
 * Every scene has alt text so it reads the same for screen readers.
 */
import type { ReactNode } from 'react';
import styles from './Illustration.module.css';

export const ART_IDS = [
  'goal-line',
  'eleven',
  'clock',
  'throw-in',
  'corner-goal-kick',
  'offside',
  'free-kick',
  'penalty',
  'cards',
  'hands',
  'aggregate',
  'quick-corner',
  'transfer',
  'lanes',
  'two-goals-1986',
  'bracket',
  'skills',
  'board',
  'jersey',
  'trophy',
] as const;
export type ArtId = (typeof ART_IDS)[number];

export const ART_ALT: Record<ArtId, string> = {
  'goal-line': 'Two balls at the goal line: one only half over the line, marked no goal; one completely over, marked goal.',
  eleven: 'Eleven players of one team in formation, with the goalkeeper highlighted. At least seven are needed to play.',
  clock: 'Stadium clock at 45:00 with an official holding up a board showing plus three minutes of stoppage time.',
  'throw-in': 'The ball has crossed the touchline, and a player behind the line throws it back in with both hands.',
  'corner-goal-kick': 'Goal line restarts: last touch by a defender sends the ball to the corner flag, last touch by an attacker means a goal kick.',
  offside: 'An attacker past the second-to-last defender when the pass is played is offside; a teammate level with the line is onside.',
  'free-kick': 'A free kick curling over a defensive wall toward goal, with a referee raising an arm to signal indirect.',
  penalty: 'Penalty kick: the ball on the penalty mark 12 yards from goal, with the kicker and the goalkeeper.',
  cards: 'Yellow card plus yellow card equals red card. The sent-off player leaves and is not replaced.',
  hands: 'A goalkeeper may catch the ball inside the penalty area, but not outside it.',
  aggregate: 'Two-leg scoreboard: Barcelona 3, Liverpool 0 in leg one; Liverpool 4, Barcelona 0 in leg two; Liverpool win 4–3 on aggregate.',
  'quick-corner': 'A corner taken quickly while defenders turn away, a short pass to an unmarked attacker, and a shot into the goal.',
  transfer: 'Career path from Barcelona to Paris to Miami, shown as three plain shields joined by arrows.',
  lanes: 'A passer with three passing lanes; a defender stands on the middle lane and blocks it while the wide lanes stay open.',
  'two-goals-1986': 'Two goals from 1986: a hand reaching the ball first for goal one, and a long winding solo run past defenders for goal two.',
  bracket: 'Tournament structure: a group table, then a knockout bracket leading to a trophy.',
  skills: 'A player keeping the ball up with a dotted bounce path, showing first touch and control.',
  board: 'A coach’s tactics board with Xs, Os and arrows.',
  jersey: 'A plain soccer jersey with the number 10.',
  trophy: 'A trophy with stars above it.',
};

/* ---------- primitives ---------- */

function Arrow({ x1, y1, x2, y2, tone = 'light', dashed, curve }: { x1: number; y1: number; x2: number; y2: number; tone?: 'light' | 'hl' | 'dark'; dashed?: boolean; curve?: number }) {
  const cx = (x1 + x2) / 2 - (curve ?? 0) * (y2 - y1) * 0.5;
  const cy = (y1 + y2) / 2 + (curve ?? 0) * (x2 - x1) * 0.5;
  const fromX = curve ? cx : x1;
  const fromY = curve ? cy : y1;
  const a = Math.atan2(y2 - fromY, x2 - fromX);
  const h = 9;
  const p = (s: number) => `${x2 - h * Math.cos(a + s)},${y2 - h * Math.sin(a + s)}`;
  const d = curve ? `M${x1},${y1} Q${cx},${cy} ${x2},${y2}` : `M${x1},${y1} L${x2},${y2}`;
  return (
    <g className={styles[`arrow-${tone}`]}>
      <path d={d} strokeDasharray={dashed ? '6 5' : undefined} />
      <polygon points={`${x2},${y2} ${p(0.45)} ${p(-0.45)}`} />
    </g>
  );
}

function Player({ x, y, team = 'a', label, r = 10 }: { x: number; y: number; team?: 'a' | 'b' | 'gk' | 'ref'; label?: string; r?: number }) {
  return (
    <g>
      <circle className={styles[`p-${team}`]} cx={x} cy={y} r={r} />
      {label && (
        <text className={styles.tag} x={x} y={y + r + 13}>
          {label}
        </text>
      )}
    </g>
  );
}

const Ball = ({ x, y, r = 6 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle className={styles.ball} cx={x} cy={y} r={r} />
    <circle className={styles.ballDot} cx={x} cy={y} r={r * 0.35} />
  </g>
);

const Mark = ({ x, y, ok }: { x: number; y: number; ok: boolean }) => (
  <g>
    <circle className={styles.markBg} cx={x} cy={y} r={12} />
    {ok ? (
      <path className={styles.good} d={`M${x - 6},${y} l4,4.5 l8,-9`} />
    ) : (
      <path className={styles.bad} d={`M${x - 5},${y - 5} l10,10 M${x + 5},${y - 5} l-10,10`} />
    )}
  </g>
);

const Label = ({ x, y, children, anchor = 'middle', size = 'md' }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: 'sm' | 'md' | 'lg' }) => (
  <text className={styles[`label-${size}`]} x={x} y={y} textAnchor={anchor}>
    {children}
  </text>
);

const Goal = ({ x, y, w = 80, h = 22, up = true }: { x: number; y: number; w?: number; h?: number; up?: boolean }) => (
  <g>
    <rect className={styles.net} x={x} y={up ? y - h : y} width={w} height={h} />
    <path className={styles.post} d={up ? `M${x},${y} V${y - h} H${x + w} V${y}` : `M${x},${y} V${y + h} H${x + w} V${y}`} />
  </g>
);

const Figure = ({ x, y, armsUp, tone = 'a' }: { x: number; y: number; armsUp?: boolean; tone?: 'a' | 'b' | 'ref' }) => (
  <g className={styles[`fig-${tone}`]}>
    <circle cx={x} cy={y - 26} r={7} />
    <path d={`M${x},${y - 19} V${y + 4} M${x},${y + 4} l-8,16 M${x},${y + 4} l8,16`} />
    <path d={armsUp ? `M${x},${y - 12} l-10,-16 M${x},${y - 12} l10,-16` : `M${x},${y - 12} l-11,10 M${x},${y - 12} l11,10`} />
  </g>
);

const Card = ({ x, y, tone }: { x: number; y: number; tone: 'yellow' | 'red' }) => (
  <rect className={styles[`card-${tone}`]} x={x} y={y} width={36} height={50} rx={5} transform={`rotate(-8 ${x + 18} ${y + 25})`} />
);

const Shield = ({ x, y, text }: { x: number; y: number; text: string }) => (
  <g>
    <path className={styles.shield} d={`M${x - 26},${y - 30} H${x + 26} V${y + 2} C${x + 26},${y + 22} ${x},${y + 32} ${x},${y + 32} C${x},${y + 32} ${x - 26},${y + 22} ${x - 26},${y + 2} Z`} />
    <text className={styles.shieldText} x={x} y={y + 6}>
      {text}
    </text>
  </g>
);

const Trophy = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path className={styles.trophy} d="M-22,-34 H22 V-14 C22,2 10,10 0,10 C-10,10 -22,2 -22,-14 Z" />
    <path className={styles.trophyLine} d="M-22,-28 H-32 C-34,-12 -26,-6 -18,-6 M22,-28 H32 C34,-12 26,-6 18,-6" />
    <rect className={styles.trophy} x={-6} y={10} width={12} height={12} />
    <rect className={styles.trophy} x={-18} y={22} width={36} height={9} rx={2} />
  </g>
);

/* ---------- scenes (viewBox 320 × 180) ---------- */

const SCENES: Record<ArtId, () => ReactNode> = {
  'goal-line': () => (
    <>
      <line className={styles.lineStrong} x1={0} y1={78} x2={320} y2={78} />
      <Goal x={80} y={78} w={160} h={44} />
      <Ball x={108} y={78} r={11} />
      <Mark x={108} y={112} ok={false} />
      <Ball x={212} y={60} r={11} />
      <Mark x={212} y={112} ok />
      <Label x={86} y={150}>Half over</Label>
      <Label x={86} y={166} size="sm">No goal</Label>
      <Label x={234} y={150}>All the way over</Label>
      <Label x={234} y={166} size="sm">Goal</Label>
    </>
  ),
  eleven: () => (
    <>
      <rect className={styles.line} x={12} y={12} width={296} height={156} />
      <line className={styles.line} x1={160} y1={12} x2={160} y2={168} />
      <Player x={26} y={90} team="gk" />
      {[40, 72, 108, 140].map((y) => <Player key={`d${y}`} x={62} y={y} />)}
      {[40, 72, 108, 140].map((y) => <Player key={`m${y}`} x={102} y={y} />)}
      {[70, 110].map((y) => <Player key={`f${y}`} x={140} y={y} />)}
      <Label x={236} y={78} size="lg">11 players</Label>
      <Label x={236} y={100}>1 is the goalkeeper</Label>
      <Label x={236} y={126} size="sm">Fewer than 7? No match.</Label>
    </>
  ),
  clock: () => (
    <>
      <rect className={styles.board} x={40} y={40} width={150} height={78} rx={10} />
      <text className={styles.digits} x={115} y={95}>
        45:00
      </text>
      <Figure x={248} y={130} armsUp tone="ref" />
      <rect className={styles.subBoard} x={220} y={40} width={56} height={40} rx={6} />
      <text className={styles.subDigits} x={248} y={68}>
        +3
      </text>
      <Label x={115} y={150}>Half time on the clock</Label>
      <Label x={115} y={166} size="sm">…plus stoppage time</Label>
    </>
  ),
  'throw-in': () => (
    <>
      <rect className={styles.field} x={110} y={0} width={210} height={180} />
      <line className={styles.lineStrong} x1={110} y1={0} x2={110} y2={180} />
      <Figure x={72} y={112} armsUp />
      <Ball x={72} y={66} r={9} />
      <Arrow x1={88} y1={66} x2={220} y2={80} tone="hl" curve={-0.25} />
      <Player x={240} y={84} />
      <Player x={270} y={108} team="b" />
      <Label x={58} y={160} size="sm">Out of play</Label>
      <Label x={215} y={150}>Over the touchline</Label>
      <Label x={215} y={168} size="sm">Restart with a throw-in</Label>
    </>
  ),
  'corner-goal-kick': () => (
    <>
      <line className={styles.lineStrong} x1={0} y1={40} x2={320} y2={40} />
      <Goal x={130} y={40} w={60} h={24} />
      <rect className={styles.line} x={118} y={40} width={84} height={22} />
      <path className={styles.flag} d="M14,40 V14 l16,6 -16,6" />
      <Player x={78} y={92} team="b" label="Defender" />
      <Arrow x1={78} y1={80} x2={58} y2={34} tone="light" />
      <Arrow x1={58} y1={44} x2={24} y2={46} tone="hl" dashed />
      <Label x={60} y={150}>Corner kick</Label>
      <Player x={252} y={92} label="Attacker" />
      <Arrow x1={252} y1={80} x2={270} y2={34} tone="light" />
      <Arrow x1={262} y1={46} x2={190} y2={56} tone="hl" dashed />
      <Label x={252} y={150}>Goal kick</Label>
      <Label x={160} y={170} size="sm">Who touched it last decides</Label>
    </>
  ),
  offside: () => (
    <>
      <line className={styles.lineStrong} x1={308} y1={0} x2={308} y2={180} />
      <path className={styles.post} d="M308,60 H318 V120 H308" />
      <line className={styles.offLine} x1={204} y1={8} x2={204} y2={172} />
      <Player x={40} y={120} label="Passer" />
      <Ball x={56} y={112} />
      <Player x={204} y={56} team="b" />
      <Player x={204} y={124} team="b" />
      <Player x={290} y={90} team="gk" />
      <Player x={244} y={72} />
      <Mark x={244} y={44} ok={false} />
      <Player x={196} y={154} />
      <Mark x={172} y={154} ok />
      <Arrow x1={64} y1={108} x2={232} y2={76} tone="hl" dashed />
      <Label x={204} y={176} size="sm">Second-to-last defender</Label>
      <Label x={252} y={20}>Offside</Label>
    </>
  ),
  'free-kick': () => (
    <>
      <Goal x={290} y={40} w={14} h={100} up={false} />
      <Ball x={86} y={124} r={8} />
      {[62, 84, 106, 128].map((y) => <Player key={y} x={190} y={y} team="b" />)}
      <Arrow x1={92} y1={116} x2={286} y2={70} tone="hl" curve={0.4} />
      <Figure x={40} y={150} armsUp tone="ref" />
      <Label x={70} y={30}>Arm up = indirect</Label>
      <Label x={70} y={46} size="sm">Someone else must touch it</Label>
    </>
  ),
  penalty: () => (
    <>
      <line className={styles.lineStrong} x1={0} y1={30} x2={320} y2={30} />
      <Goal x={120} y={30} w={80} h={22} />
      <rect className={styles.line} x={50} y={30} width={220} height={110} />
      <path className={styles.line} d="M126,140 A44,44 0 0 0 194,140" />
      <circle className={styles.spot} cx={160} cy={102} r={4} />
      <Player x={160} y={42} team="gk" />
      <Ball x={160} y={102} />
      <Player x={176} y={128} />
      <line className={styles.measure} x1={96} y1={32} x2={96} y2={100} />
      <Label x={90} y={72} anchor="end">
        12 yards
      </Label>
      <Label x={160} y={168}>Foul in your own box = penalty</Label>
    </>
  ),
  cards: () => (
    <>
      <Card x={40} y={40} tone="yellow" />
      <Label x={110} y={74} size="lg">+</Label>
      <Card x={130} y={40} tone="yellow" />
      <Label x={200} y={74} size="lg">=</Label>
      <Card x={224} y={40} tone="red" />
      <Label x={160} y={130}>Second yellow = red card</Label>
      <Label x={160} y={150} size="sm">The player is sent off and not replaced</Label>
    </>
  ),
  hands: () => (
    <>
      <line className={styles.lineStrong} x1={0} y1={24} x2={320} y2={24} />
      <Goal x={120} y={24} w={80} h={18} />
      <rect className={styles.line} x={60} y={24} width={200} height={84} />
      <Player x={136} y={70} team="gk" />
      <Ball x={152} y={60} />
      <Mark x={168} y={84} ok />
      <Player x={226} y={140} team="gk" />
      <Ball x={242} y={130} />
      <Mark x={260} y={154} ok={false} />
      <Label x={110} y={132} size="sm">Inside the box</Label>
      <Label x={240} y={176} size="sm">Outside the box</Label>
    </>
  ),
  aggregate: () => (
    <>
      {[
        ['Leg 1', 'BAR 3 – 0 LIV', 18],
        ['Leg 2', 'LIV 4 – 0 BAR', 66],
      ].map(([t, s, y]) => (
        <g key={t as string}>
          <rect className={styles.board} x={30} y={y as number} width={260} height={40} rx={8} />
          <text className={styles.rowLabel} x={46} y={(y as number) + 26}>
            {t}
          </text>
          <text className={styles.rowScore} x={276} y={(y as number) + 27}>
            {s}
          </text>
        </g>
      ))}
      <rect className={styles.boardHl} x={30} y={118} width={260} height={46} rx={8} />
      <text className={styles.rowLabelDark} x={46} y={147}>
        Aggregate
      </text>
      <text className={styles.rowScoreDark} x={276} y={148}>
        LIV 4 – 3 BAR
      </text>
    </>
  ),
  'quick-corner': () => (
    <>
      <line className={styles.lineStrong} x1={0} y1={22} x2={320} y2={22} />
      <line className={styles.lineStrong} x1={14} y1={0} x2={14} y2={180} />
      <Goal x={150} y={22} w={70} h={18} />
      <rect className={styles.line} x={120} y={22} width={130} height={60} />
      <path className={styles.flag} d="M14,22 V4 l12,5 -12,5" />
      <Player x={30} y={38} />
      <Ball x={22} y={28} />
      {[
        [150, 110],
        [196, 120],
        [240, 104],
      ].map(([x, y]) => (
        <g key={x}>
          <Player x={x!} y={y!} team="b" />
          <path className={styles.turn} d={`M${x! - 8},${y! + 16} q8,6 16,0`} />
        </g>
      ))}
      <Player x={110} y={70} label="Unmarked" />
      <Arrow x1={30} y1={34} x2={98} y2={66} tone="hl" dashed />
      <Arrow x1={118} y1={62} x2={178} y2={18} tone="hl" />
      <Label x={226} y={166} size="sm">Defenders still getting set</Label>
    </>
  ),
  transfer: () => (
    <>
      <Shield x={60} y={70} text="BAR" />
      <Arrow x1={96} y1={70} x2={126} y2={70} />
      <Shield x={160} y={70} text="PAR" />
      <Arrow x1={196} y1={70} x2={226} y2={70} />
      <Shield x={260} y={70} text="MIA" />
      <Label x={60} y={128}>Barcelona</Label>
      <Label x={160} y={128}>Paris</Label>
      <Label x={260} y={128}>Miami</Label>
      <Label x={160} y={162} size="sm">One career, three clubs, two continents</Label>
    </>
  ),
  lanes: () => (
    <>
      <Player x={160} y={156} label="" />
      <Ball x={172} y={148} />
      <line className={styles.laneOpen} x1={160} y1={150} x2={60} y2={50} />
      <line className={styles.laneBlocked} x1={160} y1={146} x2={160} y2={34} />
      <line className={styles.laneOpen} x1={160} y1={150} x2={260} y2={50} />
      <Player x={60} y={44} />
      <Player x={160} y={28} />
      <Player x={260} y={44} />
      <Player x={160} y={96} team="b" />
      <Mark x={60} y={86} ok />
      <Mark x={196} y={96} ok={false} />
      <Mark x={260} y={86} ok />
      <Label x={250} y={170} size="sm">Defender on the line</Label>
    </>
  ),
  'two-goals-1986': () => (
    <>
      <line className={styles.divider} x1={150} y1={10} x2={150} y2={170} />
      <Label x={75} y={22}>Goal 1</Label>
      <Player x={60} y={120} team="gk" />
      <Figure x={100} y={120} armsUp />
      <Ball x={90} y={82} r={7} />
      <Label x={75} y={168} size="sm">The hand got there first</Label>
      <Label x={235} y={22}>Goal 2</Label>
      <path className={styles.run} d="M170,160 C200,140 180,120 210,110 S250,90 230,70 S270,50 290,40" />
      {[
        [195, 128],
        [222, 96],
        [246, 66],
        [275, 58],
      ].map(([x, y]) => (
        <Player key={x} x={x!} y={y!} team="b" r={8} />
      ))}
      <Ball x={292} y={36} />
      <Label x={235} y={176} size="sm">A solo run past defenders</Label>
    </>
  ),
  bracket: () => (
    <>
      <rect className={styles.board} x={14} y={30} width={96} height={104} rx={6} />
      {['A', 'B', 'C', 'D'].map((t, i) => (
        <g key={t}>
          <text className={styles.rowLabel} x={26} y={56 + i * 22}>
            Team {t}
          </text>
          <text className={styles.rowScore} x={100} y={56 + i * 22}>
            {9 - i * 3}
          </text>
        </g>
      ))}
      <path className={styles.bracket} d="M126,40 H154 V70 H178 M126,100 H154 V70 M126,112 H154 V142 H178 M126,170 H154 V142 M178,70 H204 V106 H228 M178,142 H204 V106" />
      <Trophy x={270} y={106} s={1.1} />
      <Label x={62} y={160} size="sm">Groups</Label>
      <Label x={176} y={176} size="sm">Knockout</Label>
      <Label x={270} y={176} size="sm">Final</Label>
    </>
  ),
  skills: () => (
    <>
      <Figure x={140} y={120} />
      <path className={styles.run} d="M156,138 Q176,70 196,138 Q214,90 232,138" />
      <Ball x={156} y={140} />
      <Ball x={196} y={140} r={5} />
      <Ball x={232} y={140} r={4} />
      <Label x={160} y={170}>First touch and control</Label>
    </>
  ),
  board: () => (
    <>
      <rect className={styles.board} x={60} y={16} width={200} height={148} rx={10} />
      <rect className={styles.boardLine} x={74} y={30} width={172} height={120} />
      <line className={styles.boardLine} x1={74} y1={90} x2={246} y2={90} />
      {[
        [110, 60],
        [160, 50],
        [210, 64],
      ].map(([x, y]) => (
        <text key={x} className={styles.chalk} x={x} y={y}>
          ×
        </text>
      ))}
      {[
        [120, 124],
        [200, 118],
      ].map(([x, y]) => (
        <circle key={x} className={styles.chalkCircle} cx={x} cy={y} r={8} />
      ))}
      <Arrow x1={128} y1={118} x2={150} y2={66} tone="hl" curve={0.3} />
      <Arrow x1={204} y1={108} x2={226} y2={74} tone="hl" />
    </>
  ),
  jersey: () => (
    <>
      <path className={styles.shirt} d="M120,30 L100,40 L72,70 L92,90 L108,78 V160 H212 V78 L228,90 L248,70 L220,40 L200,30 C192,46 128,46 120,30 Z" />
      <text className={styles.shirtNumber} x={160} y={132}>
        10
      </text>
    </>
  ),
  trophy: () => (
    <>
      <Trophy x={160} y={104} s={1.6} />
      {[110, 160, 210].map((x, i) => (
        <path key={x} className={styles.star} transform={`translate(${x} ${i === 1 ? 20 : 30}) scale(0.9)`} d="M0,-10 L3,-3 L10,-3 L4.5,1.5 L6.5,9 L0,4.5 L-6.5,9 L-4.5,1.5 L-10,-3 L-3,-3 Z" />
      ))}
    </>
  ),
};

export interface IllustrationProps {
  art: ArtId;
  /** Compact height for quiz questions and banners. */
  size?: 'md' | 'sm';
  className?: string;
}

export function Illustration({ art, size = 'md', className }: IllustrationProps) {
  return (
    <figure className={[styles.figure, className].filter(Boolean).join(' ')} data-size={size}>
      <svg viewBox="0 0 320 180" role="img" aria-label={ART_ALT[art]} className={styles.svg}>
        <rect className={styles.bg} x={0} y={0} width={320} height={180} />
        {SCENES[art]()}
      </svg>
    </figure>
  );
}
