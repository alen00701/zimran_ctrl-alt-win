import { useId, useState } from 'react';
import { Badge } from '@/shared/ui';
import type { ViewBlock } from '../logic/path';
import { BLOCK_SLOTS } from '../catalog/path';
import { Icon } from './icons';
import { Illustration } from '../art/Illustration';
import styles from './Path.module.css';

/** Colored block header card (reference: the "Module 1, Section 6" banner). */
export function BlockBanner({ view, levelNumber, required }: { view: ViewBlock; levelNumber: number; required: boolean }) {
  const [open, setOpen] = useState(false);
  const guideId = useId();
  const { block, done, total, comingSoon } = view;
  const tone = comingSoon ? 'outline' : block.tone;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const lessonsDone = view.nodes.filter((n) => (n.kind === 'drill' || n.kind === 'lesson') && n.state === 'done').length;
  const lessonsTotal = view.nodes.filter((n) => n.kind === 'drill' || n.kind === 'lesson').length;

  return (
    <div className={styles.banner} data-tone={tone}>
      <div className={styles.bannerArt} aria-hidden="true">
        <Illustration art={block.art} size="sm" />
      </div>
      <div className={styles.bannerMain}>
        <p className={styles.bannerEyebrow}>
          Level {levelNumber}, block {view.number}
          {block.mandatory && required && <Badge variant="inverse">Required</Badge>}
          {block.mandatory && !required && <Badge variant="neutral">Optional refresher</Badge>}
          {comingSoon && <Badge variant="neutral">Coming soon</Badge>}
        </p>
        <h2 className={styles.bannerTitle}>{block.title}</h2>
        {comingSoon ? (
          <p className={styles.bannerMeta}>{BLOCK_SLOTS} lessons planned</p>
        ) : (
          <>
            <div className={styles.bannerTrack} role="progressbar" aria-label={`${block.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
              <div className={styles.bannerFill} style={{ width: `${pct}%` }} />
            </div>
            <p className={styles.bannerMeta}>
              {lessonsDone}/{lessonsTotal} lessons
              {block.quizId ? ` · quiz ${view.nodes.find((n) => n.kind === 'quiz')?.state === 'done' ? 'passed' : 'to go'}` : ''}
            </p>
          </>
        )}
      </div>
      <button
        type="button"
        className={styles.guideBtn}
        aria-expanded={open}
        aria-controls={guideId}
        aria-label={`${open ? 'Hide' : 'Show'} the guide for ${block.title}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="book" size={26} />
      </button>
      <div id={guideId} className={styles.guide} hidden={!open}>
        <Illustration art={block.art} size="sm" />
        {block.guide.map((g) => (
          <p key={g}>{g}</p>
        ))}
      </div>
    </div>
  );
}
