/**
 * Two-step onboarding at "/". Owned by Foundation.
 * Reference mapping:
 *   Step 1 (expertise) ← docs/references/duolingo-onboarding-2-daily-goal.png  (single choice + right tag)
 *   Step 2 (interests) ← docs/references/duolingo-onboarding-1-choose-course.png (icon list, section header)
 * The owl is replaced by BrandAvatar inside CoachPrompt.
 */
import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import type { Expertise, InterestId } from '@/shared/contracts/types';
import { EXPERTISE_OPTIONS, INTEREST_OPTIONS } from '@/shared/contracts/catalog';
import { isOnboarded, preferencesActions, useGuestState } from '@/shared/state';
import { BrandLogo } from '@/shared/brand';
import { routes, safeReturnTo } from '@/shared/routes';
import { Button, CoachPrompt, OptionCard, ProgressBar, usePageTitle } from '@/shared/ui';
import styles from './OnboardingPage.module.css';

export function OnboardingPage() {
  const state = useGuestState();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const editing = params.get('edit') === '1';
  const returnTo = safeReturnTo(params.get('returnTo'));
  const done = returnTo ?? routes.feed();

  const [step, setStep] = useState<1 | 2>(1);
  const [expertise, setExpertise] = useState<Expertise | null>(state.preferences.expertise);
  const [interests, setInterests] = useState<InterestId[]>(state.preferences.interests);

  usePageTitle(step === 1 ? 'Welcome' : 'Pick your interests');

  // Returning visitors resume without repeating onboarding.
  if (isOnboarded(state) && !editing && step === 1) return <Navigate to={done} replace />;

  const toggle = (id: string) =>
    setInterests((cur) => (cur.includes(id as InterestId) ? cur.filter((i) => i !== id) : [...cur, id as InterestId]));

  const back = () => {
    if (step === 2) setStep(1);
    else if (returnTo || editing) navigate(done);
  };
  const canGoBack = step === 2 || Boolean(returnTo) || editing;

  const finish = () => {
    if (!expertise || interests.length === 0) return;
    preferencesActions.completeOnboarding(expertise, interests);
    navigate(done, { replace: true });
  };

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <button
          type="button"
          className={styles.back}
          onClick={back}
          aria-label={step === 2 ? 'Back to the previous question' : 'Leave setup'}
          style={{ visibility: canGoBack ? 'visible' : 'hidden' }}
        >
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path d="M20 12H5m6-7-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <ProgressBar value={step === 1 ? 0.34 : 0.67} label={`Setup step ${step} of 2`} />
        <BrandLogo variant="mark" height={36} />
      </header>

      <main className={styles.body}>
        {step === 1 ? (
          <form
            id="onb-form"
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              if (expertise) setStep(2);
            }}
          >
            <CoachPrompt headingLevel={1} avatarSize="lg" id="q-expertise">
              How well do you know soccer?
            </CoachPrompt>
            <div className={styles.list} role="radiogroup" aria-labelledby="q-expertise">
              {EXPERTISE_OPTIONS.map((o) => (
                <OptionCard
                  key={o.id}
                  mode="single"
                  name="expertise"
                  value={o.id}
                  label={o.label}
                  trailing={o.tag}
                  selected={expertise === o.id}
                  onChange={(v) => setExpertise(v as Expertise)}
                />
              ))}
            </div>
          </form>
        ) : (
          <form
            id="onb-form"
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              finish();
            }}
          >
            <CoachPrompt headingLevel={1} avatarSize="lg" id="q-interests">
              What do you want to read about?
            </CoachPrompt>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                Pick as many as you like
                <span className={styles.count} aria-live="polite">
                  {interests.length} selected
                </span>
              </legend>
              <div className={styles.list}>
                {INTEREST_OPTIONS.map((o) => (
                  <OptionCard
                    key={o.id}
                    mode="multi"
                    name="interests"
                    value={o.id}
                    label={o.label}
                    leading={o.icon}
                    selected={interests.includes(o.id)}
                    onChange={toggle}
                  />
                ))}
              </div>
            </fieldset>
          </form>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          {step === 1 ? (
            <Button type="submit" form="onb-form" size="lg" block disabled={!expertise}>
              Continue
            </Button>
          ) : (
            <Button type="submit" form="onb-form" size="lg" block disabled={interests.length === 0}>
              {returnTo ? 'Save and go back' : 'Start reading'}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
