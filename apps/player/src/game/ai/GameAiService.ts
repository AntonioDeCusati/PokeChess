import { StockfishClient } from './stockfish';
import type { StockfishBestMove, StockfishSearchOptions } from './stockfish';
import { CustomBattleAi } from './custom';
import type { CustomAiMove, CustomAiDifficulty } from './custom';
import type { BattleState } from '@/types/battle';

/**
 * Facade that separates "classic chess" AI (Stockfish) from the custom battle AI.
 * Phaser scenes and React components should use this service, never Stockfish directly.
 */
export class GameAiService {
  private stockfish: StockfishClient | null = null;
  private customAi: CustomBattleAi;
  private stockfishReady = false;

  constructor(difficulty: CustomAiDifficulty = 'medium') {
    this.customAi = new CustomBattleAi(difficulty);
  }

  /* ─── Classic Chess (Stockfish) ─── */

  async initStockfish(): Promise<void> {
    if (this.stockfishReady) return;
    this.stockfish = new StockfishClient();
    await this.stockfish.init();
    this.stockfishReady = true;
  }

  get isStockfishReady(): boolean {
    return this.stockfishReady;
  }

  async getClassicChessMove(
    fen: string,
    options?: StockfishSearchOptions,
  ): Promise<StockfishBestMove> {
    if (!this.stockfish || !this.stockfishReady) {
      throw new Error('Stockfish is not initialized. Call initStockfish() first.');
    }
    this.stockfish.setPositionFen(fen);
    return this.stockfish.getBestMove(options);
  }

  async setStockfishSkillLevel(level: number): Promise<void> {
    if (!this.stockfish) {
      throw new Error('Stockfish is not initialized.');
    }
    await this.stockfish.setSkillLevel(level);
  }

  /* ─── Custom Battle AI ─── */

  getCustomBattleMove(state: BattleState): CustomAiMove | null {
    return this.customAi.pickMove(state);
  }

  setCustomDifficulty(difficulty: CustomAiDifficulty): void {
    this.customAi.setDifficulty(difficulty);
  }

  /* ─── Lifecycle ─── */

  dispose(): void {
    this.stockfish?.dispose();
    this.stockfish = null;
    this.stockfishReady = false;
  }
}
