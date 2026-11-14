import { Aggregate } from '../interactions/Aggregate';
import { Classify } from '../interactions/Classify';
import { PassingLanes } from '../interactions/PassingLanes';
import { Sequence } from '../interactions/Sequence';
import type { InteractionAnswer, Lesson } from '../types';

export function InteractionStep({
  lesson,
  saved,
  onChange,
}: {
  lesson: Lesson;
  saved: InteractionAnswer | undefined;
  onChange: (a: InteractionAnswer) => void;
}) {
  const spec = lesson.interaction;
  switch (spec.kind) {
    case 'passing-lanes':
      return <PassingLanes spec={spec} saved={saved} onChange={onChange} />;
    case 'aggregate':
      return <Aggregate spec={spec} saved={saved} onChange={onChange} />;
    case 'sequence':
      return <Sequence spec={spec} saved={saved} onChange={onChange} />;
    case 'classify':
      return <Classify spec={spec} saved={saved} onChange={onChange} />;
  }
}
