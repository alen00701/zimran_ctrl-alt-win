import { useState } from 'react';
import { Badge, Button, Card } from '@/shared/ui';
import { STORE_CATEGORIES, appDiscountPercent, formatUsd, itemsIn, type StoreCategory } from './store';
import styles from './Community.module.css';

/** Store at the bottom of /community. Demo only: no checkout, no card, no charge. */
export function StoreSection() {
  const [tab, setTab] = useState<StoreCategory>('tickets');
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <section aria-labelledby="store-title">
      <Card className={styles.store}>
        <div className={styles.boardHead}>
          <h2 id="store-title" className={styles.boardTitle}>
            <span aria-hidden="true">🛍️ </span>Store
          </h2>
          <Badge variant="demo">Demo store</Badge>
        </div>
        <p className={styles.boardRule}>Special app prices on tickets, merch and gear from our partners.</p>

        <div className={styles.storeTabs} role="group" aria-label="Store categories">
          {STORE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={tab === c.id}
              className={styles.storeTab}
              onClick={() => {
                setTab(c.id);
                setPicked(null);
              }}
            >
              <span aria-hidden="true">{c.icon}</span> {c.label}
            </button>
          ))}
        </div>

        <ul className={styles.storeList} aria-label={STORE_CATEGORIES.find((c) => c.id === tab)?.label}>
          {itemsIn(tab).map((item) => (
            <li key={item.id} className={styles.storeItem}>
              <span className={styles.storeIcon} aria-hidden="true">{item.icon}</span>
              <span className={styles.storeText}>
                <strong>{item.name}</strong>
                <span className={styles.storeDetail}>
                  {item.detail} · via {item.partner}
                </span>
              </span>
              <span className={styles.storeBuy}>
                <span className={styles.storePrice}>
                  <s className={styles.storeWas}>
                    <span className="visually-hidden">Regular price </span>
                    {formatUsd(item.listPriceCents)}
                  </s>
                  <strong>
                    <span className="visually-hidden">App price </span>
                    {item.fromPrice ? 'from ' : ''}
                    {formatUsd(item.appPriceCents)}
                  </strong>
                  <span className={styles.storeOff}>−{appDiscountPercent(item)}% in app</span>
                </span>
                <Button
                  variant="secondary"
                  onClick={() => setPicked(item.id)}
                  aria-describedby={picked === item.id ? `store-note-${item.id}` : undefined}
                >
                  {item.category === 'tickets' ? 'Get tickets' : 'Buy'}
                </Button>
              </span>
              {picked === item.id && (
                <p id={`store-note-${item.id}`} role="status" className={styles.storeNote}>
                  Demo store: nothing was bought. In the full app this opens {item.partner}’s checkout with your app
                  price applied. No card, no charge here.
                </p>
              )}
            </li>
          ))}
        </ul>

        <p className={styles.storeFine}>
          Affiliate links: Read the Game may earn a commission on purchases. Partners and prices are illustrative for
          this demo. Read the Game has no partnership with any club, league, venue or ticket seller.
        </p>
      </Card>
    </section>
  );
}
