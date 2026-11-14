import { useEffect, useRef, useState, type FormEvent } from 'react';
import { communityActions } from '@/shared/state';
import { Badge, Button } from '@/shared/ui';
import { CHAT_MAX_LENGTH, postMessage, useEventChat } from './chat';
import { initials } from './friends';
import styles from './Community.module.css';

/** Chat for fans who are going. Everyone can read it; only fans who RSVP'd can post. */
export function EventChat({ eventId, timeZone, going, title = 'Matchday chat' }: { eventId: string; timeZone: string; going: boolean; title?: string }) {
  const messages = useEventChat(eventId);
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLOListElement>(null);
  const fanCount = new Set(messages.filter((m) => m.role === 'fan').map((m) => m.author)).size + (going ? 1 : 0);

  // Keep the newest message in view.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const timeLabel = (iso: string) =>
    new Intl.DateTimeFormat('en-US', { timeZone, month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(iso));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (postMessage(eventId, draft)) setDraft('');
  };

  return (
    <section aria-labelledby="chat-title" className={styles.chat}>
      <div className={styles.chatHead}>
        <h2 id="chat-title" className={styles.h3}>{title}</h2>
        <span className={styles.badges}>
          <Badge variant="demo">Demo chat</Badge>
          <Badge variant="neutral">{fanCount} going</Badge>
        </span>
      </div>

      <ol ref={listRef} className={styles.chatList} aria-label="Messages" tabIndex={0}>
        {messages.map((m) => (
          <li key={m.id} className={styles.msg} data-role={m.role}>
            {m.role !== 'you' && (
              <span className={styles.msgAvatar} aria-hidden="true">{initials(m.author)}</span>
            )}
            <div className={styles.msgBody}>
              <p className={styles.msgMeta}>
                <strong>{m.author}</strong>
                {m.role === 'host' && <Badge variant="brand">Host</Badge>}
                <time dateTime={m.at}>{timeLabel(m.at)}</time>
              </p>
              <p className={styles.msgText}>{m.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {going ? (
        <form className={styles.composer} onSubmit={onSubmit}>
          <label htmlFor="chat-input" className="visually-hidden">Message fans who are going</label>
          <input
            id="chat-input"
            className={styles.composerInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={CHAT_MAX_LENGTH}
            placeholder="Say hi to the group…"
            autoComplete="off"
          />
          <Button type="submit" disabled={!draft.trim()}>Send</Button>
        </form>
      ) : (
        <div className={styles.chatLocked}>
          <p>Only fans who are going can post. RSVP to join the conversation.</p>
          <Button onClick={() => communityActions.rsvp(eventId)}>I’m going</Button>
        </div>
      )}
    </section>
  );
}
