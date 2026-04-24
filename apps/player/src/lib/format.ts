/**
 * Locale-aware formatting helpers.
 * Italian locale matches every number/date shown in the mockups.
 */

export function formatNumber(n: number): string {
  return n.toLocaleString('it-IT');
}

export function formatCurrencyEur(amount: number): string {
  // "€9,99" — the mockups use the Italian decimal comma + the euro sign up front.
  return `€${amount.toLocaleString('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Compact countdown ("2g 14h", "3h 22m", "45m"), good enough for event cards.
 * Accepts a future ISO string.
 */
export function formatCountdown(endsAt: string, now: Date = new Date()): string {
  const end = new Date(endsAt).getTime();
  let ms = Math.max(0, end - now.getTime());

  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;

  const days = Math.floor(ms / day);
  ms -= days * day;
  const hours = Math.floor(ms / hour);
  ms -= hours * hour;
  const minutes = Math.floor(ms / minute);

  if (days > 0) return `${days}g ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
