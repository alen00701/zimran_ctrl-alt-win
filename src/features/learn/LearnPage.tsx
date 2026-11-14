import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { FREE_LESSON_LIMIT } from '@/shared/contracts/catalog';
import { routes } from '@/shared/routes';
import { guestRecords, hasMembership, isLessonUnlocked, totalPoints, useGuestState } from '@/shared/state';
import { BrandAvatar } from '@/shared/brand';
import { Badge, ButtonLink, Card, ProgressBar, usePageTitle } from '@/shared/ui';
import { CATALOG } from './catalog';
import { getDrill, RULES_QUIZ_ID } from './catalog/rulesBasics';
import { useRecommendations } from './hooks';
import { buildPath, defaultLevel, isDifficulty, readRules, RULES_LOCK, rulesRequired, streakDays, type ViewNode } from './logic/path';
import { MembershipCard } from './MembershipCard';
import { BlockBanner } from './path/BlockBanner';
import { Icon } from './path/icons';
import { PathNode } from './path/PathNode';
import styles from './path/Path.module.css';

/** Zig-zag pattern from the reference path. */
const ZIGZAG = [0, 1, 2, 1, 0, -1, -2, -1];

export function LearnPage() {
  usePageTitle('Learn');
  const state = useGuestState();
  const { course, preferences } = state;
  const recs = useRecommendations();
  const [params, setParams] = useSearchParams();
  const [notice, setNotice] = useState<string | null>(null);

  const param = params.get('level');
  const levelId = isDifficulty(param) ? param : defaultLevel(preferences.expertise);
  const levels = useMemo(
    () => buildPath({ course, expertise: preferences.expertise, lessons: CATALOG, recs }),
    [course, preferences.expertise, recs],
  );
  const view = levels.find((l) => l.level.id === levelId) ?? levels[0]!;
  const active = view.blocks.flatMap((b) => b.nodes).find((n) => n.active);
  const required = rulesRequired(preferences.expertise);
  const rules = readRules(course);

  // Show the jump button only while the active island is off screen.
  const [activeVisible, setActiveVisible] = useState(true);
  const activeKey = active && !view.locked ? `${view.level.id}:${active.id}` : '';
  useEffect(() => {
    const el = activeKey ? document.getElementById('path-active') : null;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setActiveVisible(Boolean(e?.isIntersecting)), { rootMargin: '-80px 0px -140px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [activeKey]);
  // ...and only after the visitor has scrolled, so it never covers the first screen.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 240);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(t);
  }, [notice]);

  const points = totalPoints(guestRecords(state));
  const streak = streakDays(state);
  const member = hasMembership(course);
  const completed = course.completedLessonIds.length;
  const pct = view.total ? view.done / view.total : 0;

  // Paywall: the specific next lesson once the two free lessons are used.
  const nextRec = recs.find((r) => r.state !== 'completed');
  const nextLesson = nextRec ? CATALOG.find((l) => l.id === nextRec.lessonId) : undefined;
  const showPaywall = !member && completed >= FREE_LESSON_LIMIT && nextLesson && !isLessonUnlocked(course, nextLesson.id);

  const selectLevel = (id: string, locked: boolean) => {
    if (locked) return setNotice(RULES_LOCK);
    setParams({ level: id }, { replace: true });
  };

  return (
    <div className={styles.page}>
      {/* ---- status bar ---- */}
      <div className={styles.stats}>
        <span className={styles.stat} data-tone="points" title="Points">
          <Icon name="bolt" size={22} /> {points}
          <span className="visually-hidden"> points</span>
        </span>
        <span className={styles.stat} data-tone="streak" title="Day streak">
          <Icon name="flame" size={22} /> {streak}
          <span className="visually-hidden"> day streak</span>
        </span>
        <span className={styles.stat} data-tone="lessons" title="Lessons completed">
          <Icon name="check" size={20} /> {completed}
          <span className="visually-hidden"> lessons completed</span>
        </span>
        {member ? <Badge variant="brand">Member · demo</Badge> : <Badge variant="neutral">{Math.max(0, FREE_LESSON_LIMIT - completed)} free left</Badge>}
      </div>

      <h1 className={styles.h1}>Learn</h1>

      <div className={styles.levels} role="group" aria-label="Difficulty level">
        {levels.map((l) => (
          <button
            key={l.level.id}
            type="button"
            className={styles.levelBtn}
            aria-pressed={l.level.id === view.level.id}
            data-locked={l.locked || undefined}
            onClick={() => selectLevel(l.level.id, l.locked)}
          >
            {l.locked && <Icon name="lock" size={16} />}
            {l.level.label}
          </button>
        ))}
      </div>

      <div className={styles.overall}>
        <div className={styles.overallText}>
          <span>{view.level.label} level</span>
          <span>{Math.round(pct * 100)}% complete</span>
        </div>
        <ProgressBar value={pct} label={`${view.level.label} level progress`} />
      </div>

      {!preferences.expertise && (
        <Card variant="subtle" className={styles.prompt}>
          <p>Tell us your level and interests and we will pick lessons for you.</p>
          <ButtonLink to={routes.onboarding({ returnTo: routes.learn() })} variant="secondary">
            Personalize
          </ButtonLink>
        </Card>
      )}

      {showPaywall && nextLesson && <MembershipCard lesson={nextLesson} completedCount={completed} />}

      {active && !view.locked && <NextUp node={active} reason={recs.find((r) => r.lessonId === active.id)?.reason} rulesDone={rules.done.size} />}

      {view.locked && (
        <Card variant="inverse" className={styles.lockedLevel}>
          <p>
            <strong>{view.level.label} is locked.</strong> {RULES_LOCK}
          </p>
          <ButtonLink to={`${routes.learn()}?level=beginner`} replace>
            Go to Rules basics
          </ButtonLink>
        </Card>
      )}

      {/* ---- the path ---- */}
      <div className={styles.path} data-locked={view.locked || undefined}>
        {view.blocks.map((b, bi) => {
          const mascotAt = Math.min(2, b.nodes.length - 1);
          return (
            <section key={b.block.id} className={styles.block} aria-label={`Block ${b.number}: ${b.block.title}`}>
              {bi > 0 && (
                <div className={styles.divider} aria-hidden="true">
                  <span>{b.block.title}</span>
                </div>
              )}
              <BlockBanner view={b} levelNumber={view.number} required={required} />
              <ol className={styles.nodes}>
                {b.nodes.map((n, i) => {
                  const x = ZIGZAG[i % ZIGZAG.length]!;
                  const node = view.locked ? { ...n, state: 'locked-rules' as const, active: false, lockReason: RULES_LOCK } : n;
                  return (
                    <Fragment key={n.key}>
                      <PathNode node={node} x={x} onLocked={setNotice} />
                      {i === mascotAt && (
                        <li className={styles.mascotRow} aria-hidden="true" data-side={x > 0 ? 'left' : 'right'} data-dim={b.comingSoon || view.locked || undefined}>
                          <BrandAvatar size={96} state={n.active ? 'speaking' : 'idle'} decorative />
                        </li>
                      )}
                    </Fragment>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>

      <p className={styles.footnote}>
        Picks inside each level come from your level, your interests and what you read in the Feed. They are chosen by simple rules on this device, with no account and no AI call.{' '}
        <Link to={routes.onboarding({ edit: true, returnTo: routes.learn() })}>Change your level or interests</Link>
      </p>

      {activeKey && !activeVisible && scrolled && (
        <button
          type="button"
          className={styles.jump}
          aria-label="Jump to your next lesson"
          onClick={() => document.getElementById('path-active')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
        >
          <Icon name="up" size={24} />
        </button>
      )}

      <div className={styles.toastWrap} aria-live="polite">
        {notice && (
          <div className={styles.toast} role="status">
            <Icon name="lock" size={18} />
            <span>{notice}</span>
            <button type="button" className={styles.toastClose} onClick={() => setNotice(null)} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NextUp({ node, reason, rulesDone }: { node: ViewNode; reason?: string; rulesDone: number }) {
  const drill = node.kind === 'drill' ? getDrill(node.id) : undefined;
  const line =
    node.kind === 'quiz'
      ? `Score at least 7 of 10 to finish Rules basics.`
      : drill
        ? `Rules basics · lesson ${rulesDone + 1} of 10`
        : (reason ?? 'Recommended for you');
  return (
    <Card variant="inverse" className={styles.nextUp}>
      <div className={styles.nextText}>
        <Badge variant="brand">{node.state === 'in-progress' ? 'Continue' : node.id === RULES_QUIZ_ID ? 'Block quiz' : 'Up next'}</Badge>
        <p className={styles.nextTitle}>{node.title}</p>
        <p className={styles.nextReason}>{line}</p>
      </div>
      <ButtonLink to={routes.lesson(node.id)}>{node.state === 'in-progress' ? 'Resume' : 'Start'}</ButtonLink>
    </Card>
  );
}
