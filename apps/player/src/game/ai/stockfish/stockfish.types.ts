export interface StockfishBestMove {
  from: string;
  to: string;
  promotion?: string;
  raw: string;
}

export interface StockfishSearchOptions {
  depth?: number;
  movetime?: number;
}

export type StockfishEngineStatus =
  | 'idle'
  | 'initializing'
  | 'ready'
  | 'thinking'
  | 'error';

export interface StockfishInfo {
  depth?: number;
  score?: { type: 'cp' | 'mate'; value: number };
  pv?: string;
  nodes?: number;
  nps?: number;
  time?: number;
}
