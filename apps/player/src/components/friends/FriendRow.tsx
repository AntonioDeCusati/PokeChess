import { Button } from '@/components/Button';
import { Sprite } from '@/components/Sprite';
import type { Friend } from '@/types';
import { StatusDot, statusLabel } from './StatusDot';

export interface FriendRowProps {
  friend: Friend;
  onAction?: (friend: Friend) => void;
}

/** A row in the "AMICI ONLINE" list. */
export function FriendRow({ friend, onAction }: FriendRowProps) {
  const actionLabel = friend.action === 'watch' ? 'GUARDA' : 'SFIDA';
  return (
    <div className="flex items-center gap-3 rounded-card border border-border-subtle bg-bg-elevated p-2">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border-strong bg-bg-surface">
        <Sprite sprite={friend.avatar} size="100%" alt={friend.username} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-text-primary">
          {friend.username}
        </span>
        <span className="text-xxs text-text-secondary">
          {statusLabel(friend.status)}
        </span>
      </div>

      <StatusDot online={friend.online} />

      <Button
        variant="outline"
        size="sm"
        onClick={() => onAction?.(friend)}
        className={
          friend.action === 'watch'
            ? 'border-accent-red/60 text-accent-red hover:bg-accent-red/10'
            : 'border-accent/60 text-accent hover:bg-accent/10'
        }
      >
        {actionLabel}
      </Button>
    </div>
  );
}
