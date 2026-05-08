import {
  STOCKFISH_ENGINE_PATH,
  STOCKFISH_INIT_TIMEOUT_MS,
} from './stockfish.constants';

export type MessageListener = (line: string) => void;

/**
 * Manages the Web Worker that runs the Stockfish WASM engine.
 * All UCI communication goes through postMessage / onmessage.
 */
export class StockfishWorkerManager {
  private worker: Worker | null = null;
  private listeners = new Set<MessageListener>();

  async spawn(): Promise<void> {
    if (this.worker) return;

    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('Stockfish worker spawn timed out')),
        STOCKFISH_INIT_TIMEOUT_MS,
      );

      try {
        const w = new Worker(STOCKFISH_ENGINE_PATH);

        w.onmessage = (e: MessageEvent<string>) => {
          const line = typeof e.data === 'string' ? e.data : String(e.data);
          this.broadcast(line);
        };

        w.onerror = (err) => {
          clearTimeout(timeout);
          reject(new Error(`Stockfish worker error: ${err.message}`));
        };

        this.worker = w;
        clearTimeout(timeout);
        resolve();
      } catch (err) {
        clearTimeout(timeout);
        reject(err);
      }
    });
  }

  send(command: string): void {
    if (!this.worker) {
      throw new Error('Worker not spawned. Call spawn() first.');
    }
    this.worker.postMessage(command);
  }

  onMessage(listener: MessageListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Wait for a specific UCI response line (e.g. "uciok", "readyok", "bestmove ...").
   */
  waitFor(
    predicate: (line: string) => boolean,
    timeoutMs: number,
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => {
        unsub();
        reject(new Error(`Stockfish: timed out waiting for response (${timeoutMs}ms)`));
      }, timeoutMs);

      const unsub = this.onMessage((line) => {
        if (predicate(line)) {
          clearTimeout(timer);
          unsub();
          resolve(line);
        }
      });
    });
  }

  dispose(): void {
    if (this.worker) {
      try {
        this.worker.postMessage('quit');
      } catch {
        // worker may already be dead
      }
      this.worker.terminate();
      this.worker = null;
    }
    this.listeners.clear();
  }

  get alive(): boolean {
    return this.worker !== null;
  }

  private broadcast(line: string): void {
    for (const fn of this.listeners) {
      try {
        fn(line);
      } catch {
        // don't let one bad listener break the chain
      }
    }
  }
}
