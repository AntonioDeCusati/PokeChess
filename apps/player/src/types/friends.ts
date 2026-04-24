import type { FriendId, MessageId, SpriteRef } from './common';

/**
 * Online state shown next to each friend row.
 * Labels are localized in the UI layer.
 */
export type FriendStatus =
  | 'in-lobby'        // "In lobby"
  | 'playing'         // "Sta giocando"
  | 'in-match'        // "In partita"
  | 'available'       // "Disponibile"
  | 'offline';

/** Primary action exposed on a friend row. */
export type FriendAction = 'challenge' | 'watch';

export interface Friend {
  id: FriendId;
  username: string;
  avatar: SpriteRef;
  status: FriendStatus;
  /** Whether the dot should render as green (online). */
  online: boolean;
  /** Which CTA is shown ("SFIDA" vs "GUARDA"). */
  action: FriendAction;
}

/** A short preview entry in the "MESSAGGI" list. */
export interface MessagePreview {
  id: MessageId;
  senderName: string;
  senderAvatar: SpriteRef;
  preview: string;
  /** Human-readable relative timestamp (e.g. "2h fa"). */
  timeAgo: string;
}
