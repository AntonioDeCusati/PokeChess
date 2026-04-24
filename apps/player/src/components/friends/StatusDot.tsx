import type { FriendStatus } from '@/types';

const labelByStatus: Record<FriendStatus, string> = {
  'in-lobby':   'In lobby',
  playing:      'Sta giocando',
  'in-match':   'In partita',
  available:    'Disponibile',
  offline:      'Offline',
};

export function statusLabel(status: FriendStatus): string {
  return labelByStatus[status];
}

export function StatusDot({ online }: { online: boolean }) {
  return (
    <span
      aria-hidden
      className={[
        'inline-block h-2 w-2 shrink-0 rounded-full',
        online ? 'bg-success shadow-[0_0_6px_rgba(46,160,67,0.8)]' : 'bg-text-muted',
      ].join(' ')}
    />
  );
}
