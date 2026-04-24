/**
 * In-game currencies shown in the global header.
 * Matches the two counters in every screen: gold (coin) and gems (diamond).
 */
export type CurrencyKind = 'gold' | 'gem';

export interface Currency {
  kind: CurrencyKind;
  amount: number;
}

export interface CurrencyWallet {
  gold: number;
  gem: number;
}
