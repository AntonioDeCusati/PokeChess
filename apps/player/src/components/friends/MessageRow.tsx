import { Sprite } from '@/components/Sprite';
import { ChevronRightIcon } from '@/components/icons';
import type { MessagePreview } from '@/types';

export interface MessageRowProps {
  message: MessagePreview;
  onOpen?: (message: MessagePreview) => void;
}

/** A message preview in the "MESSAGGI" list. */
export function MessageRow({ message, onOpen }: MessageRowProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(message)}
      className="
        flex w-full items-center gap-3 rounded-card border border-border-subtle
        bg-bg-elevated p-2 text-left transition-colors hover:bg-bg-hover
      "
    >
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border-strong bg-bg-surface">
        <Sprite sprite={message.senderAvatar} size="100%" alt={message.senderName} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-semibold text-text-primary">
            {message.senderName}
          </span>
          <span className="shrink-0 text-xxs text-text-secondary">
            {message.timeAgo}
          </span>
        </div>
        <span className="truncate text-xxs text-text-secondary">
          {message.preview}
        </span>
      </div>

      <ChevronRightIcon className="h-4 w-4 shrink-0 text-text-muted" />
    </button>
  );
}
