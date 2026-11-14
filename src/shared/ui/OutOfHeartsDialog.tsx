import { useEffect, useRef } from 'react';
import { BrandAvatar } from '../brand';
import { closeOutOfHearts, gameActions, useOutOfHeartsOpen } from '../state';
import { Button } from './Button';
import styles from './OutOfHeartsDialog.module.css';

/** Opens when a Free visitor spends the last heart (or tries to answer with none). Offers Pro or a demo refill. */
export function OutOfHeartsDialog() {
  const open = useOutOfHeartsOpen();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="out-of-hearts-title" onCancel={closeOutOfHearts} onClose={closeOutOfHearts}>
      <div className={styles.body}>
        <BrandAvatar size="lg" state="thinking" decorative />
        <h2 id="out-of-hearts-title" className={styles.title}>You’re out of hearts</h2>
        <p className={styles.text}>Every wrong answer costs a heart on the Free plan. Pick how to keep going. The Feed stays open either way.</p>
        <div className={styles.actions}>
          <Button onClick={() => { gameActions.setPlan('pro'); closeOutOfHearts(); }}>Switch to Pro · unlimited hearts</Button>
          <Button variant="secondary" onClick={() => { gameActions.refillHearts(); closeOutOfHearts(); }}>Restore my hearts (demo)</Button>
          <Button variant="ghost" onClick={closeOutOfHearts}>Not now</Button>
        </div>
        <p className={styles.note}>Pro is a demo: no card, no charge.</p>
      </div>
    </dialog>
  );
}
