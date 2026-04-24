import { Section } from '@/components/Section';
import {
  AsyncMatchCard,
  FriendRow,
  MessageRow,
} from '@/components/friends';
import { friends, messagePreviews, onlineCount } from '@/data';

/**
 * Friends screen (mockup #5).
 *
 * 3 sections:
 *   1. AMICI ONLINE     — list of friend rows with action buttons
 *   2. PARTITE ASINCRONE — new async challenge CTA
 *   3. MESSAGGI         — message previews
 */
export function FriendsPage() {
  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <div className="flex items-baseline justify-between">
        <h1 className="text-lg font-bold tracking-[0.12em] text-text-primary">
          AMICI
        </h1>
        <span className="text-xs font-semibold text-success">
          {onlineCount} online
        </span>
      </div>

      <Section title="Amici Online">
        <ul className="flex flex-col gap-2">
          {friends.map((friend) => (
            <li key={friend.id}>
              <FriendRow friend={friend} />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Partite Asincrone">
        <AsyncMatchCard />
      </Section>

      <Section title="Messaggi">
        <ul className="flex flex-col gap-2">
          {messagePreviews.map((message) => (
            <li key={message.id}>
              <MessageRow message={message} />
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
