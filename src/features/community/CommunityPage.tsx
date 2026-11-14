import { Link } from 'react-router';
import { DEMO_EVENT, DEMO_GROUP } from '@/shared/fixtures/ids';
import { communityActions, isGoing, isMember, useGuestState } from '@/shared/state';
import { routes } from '@/shared/routes';
import { Badge, Button, Card, PageHeader } from '@/shared/ui';
import styles from './Community.module.css';

/** STARTER: Community owner replaces with groups and matchday events. */
export function CommunityPage() {
  const state = useGuestState();
  const member = isMember(state, DEMO_GROUP.id);
  return (
    <>
      <PageHeader title="Community" subtitle="Groups and matchday events" />
      <div className={styles.stack}>
        <Card className={styles.row}>
          <strong>{DEMO_GROUP.name}</strong>
          <Button variant={member ? 'secondary' : 'primary'} onClick={() => (member ? communityActions.leaveGroup(DEMO_GROUP.id) : communityActions.joinGroup(DEMO_GROUP.id))}>
            {member ? 'Leave group' : 'Join group'}
          </Button>
        </Card>
        <Card className={styles.row}>
          <Link to={routes.event(DEMO_EVENT.id)}><strong>{DEMO_EVENT.title}</strong></Link>
          <span className={styles.badges}>
            <Badge variant="demo">Demo event</Badge>
            {isGoing(state, DEMO_EVENT.id) && <Badge variant="success">Going</Badge>}
          </span>
        </Card>
      </div>
    </>
  );
}
