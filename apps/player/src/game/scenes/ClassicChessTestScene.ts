import Phaser from 'phaser';
import { GameAiService } from '@/game/ai/GameAiService';
import { STOCKFISH_DEFAULT_FEN } from '@/game/ai/stockfish/stockfish.constants';
import type { StockfishInfo } from '@/game/ai/stockfish/stockfish.types';

/**
 * Minimal Phaser scene that initializes Stockfish and requests a best move.
 * This is a diagnostic/test scene -- it does NOT implement a full chess UI.
 */
export class ClassicChessTestScene extends Phaser.Scene {
  private ai!: GameAiService;
  private statusText!: Phaser.GameObjects.Text;
  private moveText!: Phaser.GameObjects.Text;
  private infoText!: Phaser.GameObjects.Text;
  private testFen = STOCKFISH_DEFAULT_FEN;

  constructor() {
    super({ key: 'ClassicChessTestScene' });
  }

  init(data?: { fen?: string }) {
    if (data?.fen) {
      this.testFen = data.fen;
    }
  }

  create() {
    const cx = this.scale.width / 2;

    this.add
      .text(cx, 30, 'Stockfish Integration Test', {
        fontSize: '22px',
        color: '#e0a83b',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.statusText = this.add
      .text(cx, 80, 'Status: initializing...', {
        fontSize: '16px',
        color: '#aaa',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 120, `FEN: ${this.testFen}`, {
        fontSize: '11px',
        color: '#666',
        fontFamily: 'monospace',
        wordWrap: { width: this.scale.width - 40 },
      })
      .setOrigin(0.5);

    this.moveText = this.add
      .text(cx, 180, '', {
        fontSize: '28px',
        color: '#34d399',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.infoText = this.add
      .text(cx, 230, '', {
        fontSize: '13px',
        color: '#888',
        fontFamily: 'monospace',
        wordWrap: { width: this.scale.width - 40 },
      })
      .setOrigin(0.5);

    this.runTest();
  }

  private async runTest() {
    this.ai = new GameAiService();

    try {
      this.setStatus('Spawning Stockfish worker...');
      await this.ai.initStockfish();
      this.setStatus('Stockfish ready. Requesting best move (depth 15)...');

      this.ai['stockfish']?.onInfo((info: StockfishInfo) => {
        const parts: string[] = [];
        if (info.depth != null) parts.push(`depth ${info.depth}`);
        if (info.score) parts.push(`score ${info.score.type} ${info.score.value}`);
        if (info.nodes) parts.push(`nodes ${info.nodes}`);
        if (info.nps) parts.push(`nps ${info.nps}`);
        this.infoText.setText(parts.join(' | '));
      });

      const bestMove = await this.ai.getClassicChessMove(this.testFen, {
        depth: 15,
      });

      this.setStatus('Done!');
      this.moveText.setText(`Best move: ${bestMove.raw}`);

      console.log('[ClassicChessTestScene] Stockfish bestmove:', bestMove);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setStatus(`Error: ${msg}`);
      console.error('[ClassicChessTestScene] Stockfish error:', err);
    }
  }

  private setStatus(text: string) {
    this.statusText.setText(`Status: ${text}`);
  }

  destroy() {
    this.ai?.dispose();
    super.destroy();
  }
}
