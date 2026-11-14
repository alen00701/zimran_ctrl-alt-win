/** Writes for the Rules basics block. Everything lives in the shared guest state (course slice). */
import { courseActions } from '@/shared/state';
import { RULES_BLOCK_ID } from '../catalog/rulesBasics';
import type { QuizRecord, QuizRun } from './path';

const ensure = () => courseActions.openLesson(RULES_BLOCK_ID, 'Rules basics');

export const rulesActions = {
  open: ensure,
  saveCheck(drillId: string, selected: string, correct: boolean) {
    ensure();
    courseActions.saveAnswer(RULES_BLOCK_ID, `check:${drillId}`, { selected, correct });
  },
  /** Marks a drill done. Never calls completeLesson, so the two-free-lessons count is untouched. */
  completeDrill(drillId: string, doneCount: number) {
    ensure();
    courseActions.saveAnswer(RULES_BLOCK_ID, `drill:${drillId}`, true);
    courseActions.setStep(RULES_BLOCK_ID, doneCount);
  },
  saveRun(run: QuizRun) {
    ensure();
    courseActions.saveAnswer(RULES_BLOCK_ID, 'quiz-run', run as unknown as Record<string, unknown>);
  },
  saveRecord(rec: QuizRecord) {
    ensure();
    courseActions.saveAnswer(RULES_BLOCK_ID, 'quiz', rec as unknown as Record<string, unknown>);
  },
};

/** Same writes for any drill block (everything except the quiz). Progress lives in the block's own record. */
export function blockActions(blockId: string, title: string) {
  const open = () => courseActions.openLesson(blockId, title);
  return {
    open,
    saveCheck(drillId: string, selected: string, correct: boolean) {
      open();
      courseActions.saveAnswer(blockId, `check:${drillId}`, { selected, correct });
    },
    completeDrill(drillId: string, doneCount: number) {
      open();
      courseActions.saveAnswer(blockId, `drill:${drillId}`, true);
      courseActions.setStep(blockId, doneCount);
    },
  };
}
