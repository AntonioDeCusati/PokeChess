import type { Friend, FriendId, MessageId, MessagePreview } from '@/types';
import { avatarSprite, creatureSprite } from './sprites';

/**
 * Friends screen (mockup #5).
 * 4 online friends, each with a status + CTA; plus 3 message previews.
 */

export const friends: readonly Friend[] = [
  {
    id: 'friend-shadowfiend' as FriendId,
    username: 'ShadowFiend',
    avatar: avatarSprite('shadowfiend', 'SF'),
    status: 'in-lobby',
    online: true,
    action: 'challenge',
  },
  {
    id: 'friend-arcananova' as FriendId,
    username: 'ArcaneNova',
    avatar: avatarSprite('arcananova', 'AN'),
    status: 'playing',
    online: true,
    action: 'challenge',
  },
  {
    id: 'friend-pixelmaster' as FriendId,
    username: 'PixelMaster',
    avatar: avatarSprite('pixelmaster', 'PM'),
    status: 'in-match',
    online: true,
    action: 'watch',
  },
  {
    id: 'friend-mysticpanda' as FriendId,
    username: 'MysticPanda',
    avatar: avatarSprite('mysticpanda', 'MP'),
    status: 'available',
    online: true,
    action: 'challenge',
  },
];

export const onlineCount = friends.filter((f) => f.online).length;

export const messagePreviews: readonly MessagePreview[] = [
  {
    id: 'msg-guildbot' as MessageId,
    senderName: 'GuildBot',
    senderAvatar: creatureSprite('poison', 0, 'GB'),
    preview: 'Domani inizia il torneo settimanale!',
    timeAgo: '2h fa',
  },
  {
    id: 'msg-shadowfiend' as MessageId,
    senderName: 'ShadowFiend',
    senderAvatar: avatarSprite('shadowfiend', 'SF'),
    preview: 'Bel match!',
    timeAgo: '5h fa',
  },
  {
    id: 'msg-arcananova' as MessageId,
    senderName: 'ArcaneNova',
    senderAvatar: avatarSprite('arcananova', 'AN'),
    preview: 'Sei pronto per la rivincita?',
    timeAgo: '1g fa',
  },
];
