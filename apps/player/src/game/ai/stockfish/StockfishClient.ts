import { StockfishWorkerManager } from './StockfishWorkerManager';
import {
  STOCKFISH_READY_TIMEOUT_MS,
  STOCKFISH_INIT_TIMEOUT_MS,
  STOCKFISH_DEFAULT_DEPTH,
  STOCKFISH_SKILL_MIN,
  STOCKFISH_SKILL_MAX,
} from './stockfish.constants';
import type {
  StockfishBestMove,
  StockfishSearchOptions,
  StockfishEngineStatus,
  StockfishInfo,
} from './stockfish.types';

function parseBestMove(line: string): StockfishBestMove {
  // "bestmove e2e4 ponder d7d5"  or  "bestmove e7e8q"
  const parts = line.split(/\s+/);
  const raw = parts[1] ?? '';
  const from = raw.slice(0, 2);
  const to = raw.slice(2, 4);
  const promotion = raw.length > 4 ? raw.slice(4) : undefined;
  return { from, to, promotion, raw };
}

/**
 * High-level, promise-based interface to a Stockfish engine running in a Web Worker.
 *
 * Usage:
 *   const sf = new StockfishClient();
 *   await sf.init();
 *   await sf.setPositionFen('rnbqkbnr/...');
 *   const move = await sf.getBestMove({ depth: 15 });
 *   sf.dispose();
 */
export class StockfishClient {
  private manager = new StockfishWorkerManager();
  private _status: StockfishEngineStatus = 'idle';
  private infoListener: ((info: StockfishInfo) => void) | null = null;

  get status(): StockfishEngineStatus {
    return this._status;
  }

  onInfo(listener: (info: StockfishInfo) => void): void {
    this.infoListener = listener;
  }

  async init(): Promise<void> {
    if (this._status === 'ready') return;
    this._status = 'initializing';

    try {
      await this.manager.spawn();

      this.manager.onMessage((line) => {
        if (line.startsWith('info ') && this.infoListener) {
          this.infoListener(this.parseInfo(line));
        }
      });

      this.manager.send('uci');
      await this.manager.waitFor(
        (l) => l.trim() === 'uciok',
        STOCKFISH_INIT_TIMEOUT_MS,
      );

      this._status = 'ready';
    } catch (err) {
      this._status = 'error';
      throw err;
    }
  }

  async isReady(): Promise<boolean> {
    if (!this.manager.alive) return false;
    try {
      this.manager.send('isready');
      await this.manager.waitFor(
        (l) => l.trim() === 'readyok',
        STOCKFISH_READY_TIMEOUT_MS,
      );
      return true;
    } catch {
      return false;
    }
  }

  async setSkillLevel(level: number): Promise<void> {
    const clamped = Math.max(STOCKFISH_SKILL_MIN, Math.min(STOCKFISH_SKILL_MAX, Math.round(level)));
    this.manager.send(`setoption name Skill Level value ${clamped}`);
    await this.isReady();
  }

  setPositionFen(fen: string): void {
    this.manager.send('ucinewgame');
    this.manager.send(`position fen ${fen}`);
  }

  async getBestMove(
    options: StockfishSearchOptions = {},
  ): Promise<StockfishBestMove> {
    this._status = 'thinking';

    const { depth, movetime } = options;
    let goCmd = 'go';
    if (depth != null) {
      goCmd += ` depth ${depth}`;
    } else if (movetime != null) {
      goCmd += ` movetime ${movetime}`;
    } else {
      goCmd += ` depth ${STOCKFISH_DEFAULT_DEPTH}`;
    }

    this.manager.send(goCmd);

    const timeoutMs = (movetime ?? 30_000) + 5_000;
    const line = await this.manager.waitFor(
      (l) => l.startsWith('bestmove'),
      timeoutMs,
    );

    this._status = 'ready';
    return parseBestMove(line);
  }

  stop(): void {
    if (this.manager.alive) {
      this.manager.send('stop');
    }
  }

  dispose(): void {
    this.manager.dispose();
    this._status = 'idle';
    this.infoListener = null;
  }

  private parseInfo(line: string): StockfishInfo {
    const info: StockfishInfo = {};
    const tokens = line.split(/\s+/);

    for (let i = 1; i < tokens.length; i++) {
      switch (tokens[i]) {
        case 'depth':
          info.depth = Number(tokens[++i]);
          break;
        case 'score': {
          const scoreType = tokens[++i] as 'cp' | 'mate';
          info.score = { type: scoreType, value: Number(tokens[++i]) };
          break;
        }
        case 'nodes':
          info.nodes = Number(tokens[++i]);
          break;
        case 'nps':
          info.nps = Number(tokens[++i]);
          break;
        case 'time':
          info.time = Number(tokens[++i]);
          break;
        case 'pv':
          info.pv = tokens.slice(i + 1).join(' ');
          i = tokens.length;
          break;
      }
    }

    return info;
  }
}
