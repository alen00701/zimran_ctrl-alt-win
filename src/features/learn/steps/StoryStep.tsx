import { SEED_POSTS } from '@/shared/fixtures/ids';
import { routes } from '@/shared/routes';
import { ButtonLink, CoachPrompt } from '@/shared/ui';
import type { Lesson } from '../types';
import { Illustration } from '../art/Illustration';
import styles from '../Lesson.module.css';

const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');

export function StoryStep({ lesson }: { lesson: Lesson }) {
  const post = lesson.story.sourcePostId ? SEED_POSTS.find((p) => p.id === lesson.story.sourcePostId) : undefined;
  return (
    <div className={styles.stack}>
      <CoachPrompt>{lesson.story.coach}</CoachPrompt>
      <Illustration art={lesson.art} />
      <div className={styles.prose}>
        {lesson.story.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {post && (
        <div className={styles.sourceRow}>
          <a href={post.sourceUrl} target="_blank" rel="noreferrer">
            Source: {host(post.sourceUrl)} ↗
          </a>
          <ButtonLink to={routes.feedPost(post.id)} variant="ghost">
            Read the story in Feed
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
