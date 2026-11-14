import { CoachPrompt, ButtonLink, usePageTitle } from '@/shared/ui';
import { routes } from '@/shared/routes';

export function NotFound() {
  usePageTitle('Page not found');
  return (
    <section style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <CoachPrompt headingLevel={1} state="thinking">
        That page is offside. Let’s get you back in play.
      </CoachPrompt>
      <ButtonLink to={routes.feed()}>Go to Feed</ButtonLink>
    </section>
  );
}
