import Phaser from 'phaser';
import type { BattlePiece, BattleState, EnergyBank } from '@/types/battle';
import { BOARD_ROWS, BOARD_COLS } from '@/types/battle';
import { idleSpriteData } from '@/data/idle-sprite-data';
import { getAvailableMoves } from './movement';
import { EventBus } from './EventBus';
import { CustomBattleAi } from '@/game/ai/custom/CustomBattleAi';

const OPPONENT_ROW_DIR = 0;
const PLAYER_ROW_DIR = 4;
const MS_PER_TICK = 50;

const TILE_LIGHT = 0x141822;
const TILE_DARK = 0x1a2030;
const TILE_SELECTED = 0x3d3510;
const TILE_VALID = 0x0f2918;
const TILE_ENEMY = 0x2e1010;

const BORDER_SELECTED = 0xe0a83b;
const BORDER_VALID = 0x34d399;
const BORDER_ENEMY = 0xd9453c;

const AI_MOVE_DELAY_MS = 600;

export class BattleScene extends Phaser.Scene {
  private cellSize = 48;
  private boardX = 0;
  private boardY = 0;

  private state!: BattleState;
  private tileGraphics: Phaser.GameObjects.Rectangle[][] = [];
  private tileBorders: Phaser.GameObjects.Rectangle[][] = [];
  private pieceSprites = new Map<string, Phaser.GameObjects.Sprite>();
  private dotGraphics: Phaser.GameObjects.Arc[] = [];
  private ai = new CustomBattleAi('medium');
  private aiThinking = false;

  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data: { state: BattleState }) {
    this.state = data.state;
  }

  preload() {
    const loaded = new Set<string>();
    for (const piece of this.state.pieces) {
      const path = piece.pokedexPath;
      if (loaded.has(path)) continue;
      loaded.add(path);

      const spriteData = idleSpriteData[path];
      if (!spriteData) continue;

      this.load.spritesheet(`idle-${path}`, `/sprite/${path}/Idle-Anim.png`, {
        frameWidth: spriteData.w,
        frameHeight: spriteData.h,
      });
    }
  }

  create() {
    this.calculateLayout();
    this.drawBoard();
    this.createAnimations();
    this.spawnPieces();
    this.setupInput();

    EventBus.emit('scene-ready', this);
  }

  private calculateLayout() {
    const w = this.scale.width;
    const h = this.scale.height;
    const maxCellW = Math.floor(w / BOARD_COLS);
    const maxCellH = Math.floor((h * 0.78) / BOARD_ROWS);
    this.cellSize = Math.max(20, Math.min(maxCellW, maxCellH));
    const boardW = this.cellSize * BOARD_COLS;
    const boardH = this.cellSize * BOARD_ROWS;
    this.boardX = Math.floor((w - boardW) / 2);
    this.boardY = Math.floor((h - boardH) / 2) + 10;
  }

  private drawBoard() {
    this.tileGraphics = [];
    this.tileBorders = [];

    for (let r = 0; r < BOARD_ROWS; r++) {
      const tileRow: Phaser.GameObjects.Rectangle[] = [];
      const borderRow: Phaser.GameObjects.Rectangle[] = [];
      for (let c = 0; c < BOARD_COLS; c++) {
        const x = this.boardX + c * this.cellSize + this.cellSize / 2;
        const y = this.boardY + r * this.cellSize + this.cellSize / 2;
        const isDark = (r + c) % 2 === 1;

        const tile = this.add.rectangle(x, y, this.cellSize, this.cellSize, isDark ? TILE_DARK : TILE_LIGHT);
        tileRow.push(tile);

        const border = this.add.rectangle(x, y, this.cellSize - 2, this.cellSize - 2);
        border.setStrokeStyle(2, 0x000000, 0);
        border.setFillStyle(0x000000, 0);
        borderRow.push(border);
      }
      this.tileGraphics.push(tileRow);
      this.tileBorders.push(borderRow);
    }
  }

  private createAnimations() {
    const created = new Set<string>();
    for (const piece of this.state.pieces) {
      const path = piece.pokedexPath;
      if (created.has(path)) continue;
      created.add(path);

      const spriteData = idleSpriteData[path];
      if (!spriteData || spriteData.frames <= 0) continue;

      const key = `idle-${path}`;
      if (!this.textures.exists(key)) continue;

      for (const dir of [OPPONENT_ROW_DIR, PLAYER_ROW_DIR]) {
        const animKey = `${key}-dir${dir}`;
        if (this.anims.exists(animKey)) continue;

        const startFrame = dir * spriteData.frames;
        const frames: Phaser.Types.Animations.AnimationFrame[] = [];

        for (let f = 0; f < spriteData.frames; f++) {
          const durMs = Math.max((spriteData.durs[f] ?? 10) * MS_PER_TICK, 80);
          frames.push({
            key,
            frame: startFrame + f,
            duration: durMs,
          });
        }

        this.anims.create({
          key: animKey,
          frames,
          repeat: -1,
        });
      }
    }
  }

  private spawnPieces() {
    for (const piece of this.state.pieces) {
      this.createPieceSprite(piece);
    }
  }

  private createPieceSprite(piece: BattlePiece) {
    const { x, y } = this.cellToWorld(piece.row, piece.col);
    const path = piece.pokedexPath;
    const spriteData = idleSpriteData[path];
    const key = `idle-${path}`;

    if (!this.textures.exists(key) || !spriteData) return;

    const sprite = this.add.sprite(x, y, key);

    const scale = (this.cellSize * 0.8) / Math.max(spriteData.w, spriteData.h);
    sprite.setScale(scale);

    const dir = piece.owner === 'opponent' ? OPPONENT_ROW_DIR : PLAYER_ROW_DIR;
    const animKey = `${key}-dir${dir}`;

    if (this.anims.exists(animKey)) {
      sprite.play(animKey);
    }

    sprite.setDepth(1);
    this.pieceSprites.set(piece.id, sprite);
  }

  private setupInput() {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const col = Math.floor((pointer.x - this.boardX) / this.cellSize);
      const row = Math.floor((pointer.y - this.boardY) / this.cellSize);
      if (row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS) {
        this.handleCellTap(row, col);
      }
    });
  }

  private handleCellTap(row: number, col: number) {
    if (this.aiThinking || this.state.currentTurn !== 'player' || this.state.status !== 'playing') return;

    const piece = this.state.pieces.find((p) => p.row === row && p.col === col);

    if (this.state.selectedPieceId) {
      const selected = this.state.pieces.find((p) => p.id === this.state.selectedPieceId);
      if (!selected) return;

      if (piece && piece.owner === this.state.currentTurn) {
        if (piece.id === this.state.selectedPieceId) {
          this.clearSelection();
        } else {
          this.selectPiece(piece.id);
        }
        return;
      }

      const isValid = selected.availableMoves?.some((m) => m.row === row && m.col === col);
      if (isValid) {
        this.movePiece(selected, row, col);
        return;
      }

      if (piece && piece.owner === 'opponent') {
        this.clearSelection();
        this.inspectPiece(piece.id);
        return;
      }

      return;
    }

    if (this.state.inspectedPieceId) {
      if (piece && piece.owner === 'opponent') {
        if (piece.id === this.state.inspectedPieceId) {
          this.clearInspection();
        } else {
          this.inspectPiece(piece.id);
        }
        return;
      }
      this.clearInspection();
      if (piece && piece.owner === 'player') {
        this.selectPiece(piece.id);
      }
      return;
    }

    if (piece && piece.owner === this.state.currentTurn) {
      this.selectPiece(piece.id);
    } else if (piece && piece.owner === 'opponent') {
      this.inspectPiece(piece.id);
    }
  }

  private selectPiece(pieceId: string) {
    const piece = this.state.pieces.find((p) => p.id === pieceId);
    if (!piece) return;

    const moves = getAvailableMoves(piece, this.state.pieces, piece.movementType);

    this.state = {
      ...this.state,
      selectedPieceId: pieceId,
      inspectedPieceId: null,
      pieces: this.state.pieces.map((p) =>
        p.id === pieceId
          ? { ...p, selected: true, availableMoves: moves }
          : { ...p, selected: false, availableMoves: undefined },
      ),
    };

    this.updateHighlights();
    EventBus.emit('state-changed', this.state);
  }

  private clearSelection() {
    this.state = {
      ...this.state,
      selectedPieceId: null,
      pieces: this.state.pieces.map((p) => ({
        ...p, selected: false, availableMoves: undefined,
      })),
    };
    this.updateHighlights();
    EventBus.emit('state-changed', this.state);
  }

  private inspectPiece(pieceId: string) {
    this.state = {
      ...this.state,
      inspectedPieceId: pieceId,
      selectedPieceId: null,
      pieces: this.state.pieces.map((p) => ({
        ...p, selected: false, availableMoves: undefined,
      })),
    };
    this.updateHighlights();
    EventBus.emit('state-changed', this.state);
  }

  private clearInspection() {
    this.state = {
      ...this.state,
      inspectedPieceId: null,
    };
    EventBus.emit('state-changed', this.state);
  }

  private addReward(bank: EnergyBank, captured: BattlePiece): EnergyBank {
    const updated = { ...bank };
    updated[captured.type1] += captured.rewardType1;
    if (captured.type2) {
      updated[captured.type2] += captured.rewardType2;
    }
    return updated;
  }

  private movePiece(piece: BattlePiece, toRow: number, toCol: number) {
    const target = this.state.pieces.find(
      (p) => p.row === toRow && p.col === toCol && p.owner !== piece.owner,
    );

    if (target) {
      const capturedSprite = this.pieceSprites.get(target.id);
      if (capturedSprite) {
        this.tweens.add({
          targets: capturedSprite,
          alpha: 0,
          scale: 0,
          duration: 200,
          onComplete: () => capturedSprite.destroy(),
        });
        this.pieceSprites.delete(target.id);
      }
    }

    const sprite = this.pieceSprites.get(piece.id);
    if (sprite) {
      const { x, y } = this.cellToWorld(toRow, toCol);
      this.tweens.add({
        targets: sprite,
        x,
        y,
        duration: 250,
        ease: 'Power2',
      });
    }

    let playerEnergy = this.state.playerEnergy;
    let opponentEnergy = this.state.opponentEnergy;
    let status: BattleState['status'] = 'playing';

    if (target) {
      if (piece.owner === 'player') {
        playerEnergy = this.addReward(playerEnergy, target);
      } else {
        opponentEnergy = this.addReward(opponentEnergy, target);
      }

      if (target.isTrainer) {
        status = piece.owner === 'player' ? 'won' : 'lost';
      }
    }

    const nextTurn = status !== 'playing'
      ? this.state.currentTurn
      : this.state.currentTurn === 'player' ? 'opponent' : 'player';

    this.state = {
      ...this.state,
      selectedPieceId: null,
      inspectedPieceId: null,
      currentTurn: nextTurn,
      turnNumber: nextTurn === 'player' ? this.state.turnNumber + 1 : this.state.turnNumber,
      playerEnergy,
      opponentEnergy,
      status,
      pieces: this.state.pieces
        .filter((p) => p.id !== target?.id)
        .map((p) =>
          p.id === piece.id
            ? { ...p, row: toRow, col: toCol, selected: false, availableMoves: undefined }
            : { ...p, selected: false, availableMoves: undefined },
        ),
    };

    this.updateHighlights();
    EventBus.emit('state-changed', this.state);

    if (status !== 'playing') return;

    if (this.state.currentTurn === 'opponent') {
      this.scheduleAiMove();
    }
  }

  private scheduleAiMove() {
    this.aiThinking = true;
    this.time.delayedCall(AI_MOVE_DELAY_MS, () => {
      this.executeAiMove();
    });
  }

  private executeAiMove() {
    const move = this.ai.pickMove(this.state);

    if (!move) {
      this.state = {
        ...this.state,
        currentTurn: 'player',
        turnNumber: this.state.turnNumber + 1,
      };
      this.aiThinking = false;
      EventBus.emit('state-changed', this.state);
      return;
    }

    const piece = this.state.pieces.find((p) => p.id === move.pieceId);
    if (!piece) {
      this.state = {
        ...this.state,
        currentTurn: 'player',
        turnNumber: this.state.turnNumber + 1,
      };
      this.aiThinking = false;
      EventBus.emit('state-changed', this.state);
      return;
    }

    const target = move.isCapture
      ? this.state.pieces.find(
          (p) => p.row === move.to.row && p.col === move.to.col && p.owner !== piece.owner,
        )
      : undefined;

    if (target) {
      const capturedSprite = this.pieceSprites.get(target.id);
      if (capturedSprite) {
        this.tweens.add({
          targets: capturedSprite,
          alpha: 0,
          scale: 0,
          duration: 200,
          onComplete: () => capturedSprite.destroy(),
        });
        this.pieceSprites.delete(target.id);
      }
    }

    const sprite = this.pieceSprites.get(piece.id);
    if (sprite) {
      const { x, y } = this.cellToWorld(move.to.row, move.to.col);
      this.tweens.add({
        targets: sprite,
        x,
        y,
        duration: 300,
        ease: 'Power2',
      });
    }

    let opponentEnergy = this.state.opponentEnergy;
    let status: BattleState['status'] = 'playing';

    if (target) {
      opponentEnergy = this.addReward(opponentEnergy, target);
      if (target.isTrainer) {
        status = 'lost';
      }
    }

    this.state = {
      ...this.state,
      selectedPieceId: null,
      currentTurn: status !== 'playing' ? 'opponent' : 'player',
      turnNumber: status !== 'playing' ? this.state.turnNumber : this.state.turnNumber + 1,
      opponentEnergy,
      status,
      pieces: this.state.pieces
        .filter((p) => p.id !== target?.id)
        .map((p) =>
          p.id === piece.id
            ? { ...p, row: move.to.row, col: move.to.col, selected: false, availableMoves: undefined }
            : { ...p, selected: false, availableMoves: undefined },
        ),
    };

    this.aiThinking = false;
    this.updateHighlights();
    EventBus.emit('state-changed', this.state);
  }

  private updateHighlights() {
    // Clear previous
    for (const dot of this.dotGraphics) dot.destroy();
    this.dotGraphics = [];

    const selected = this.state.selectedPieceId
      ? this.state.pieces.find((p) => p.id === this.state.selectedPieceId)
      : undefined;
    const validSet = new Set(
      (selected?.availableMoves ?? []).map((m) => `${m.row},${m.col}`),
    );

    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 0; c < BOARD_COLS; c++) {
        const isDark = (r + c) % 2 === 1;
        const key = `${r},${c}`;
        const tile = this.tileGraphics[r][c];
        const border = this.tileBorders[r][c];
        const occupant = this.state.pieces.find((p) => p.row === r && p.col === c);
        const isSelected = occupant?.id === this.state.selectedPieceId;
        const isValid = validSet.has(key);
        const isEnemy = isValid && !!occupant && occupant.owner !== (selected?.owner ?? 'player');

        if (isSelected) {
          tile.setFillStyle(TILE_SELECTED);
          border.setStrokeStyle(2, BORDER_SELECTED, 1);
        } else if (isEnemy) {
          tile.setFillStyle(TILE_ENEMY);
          border.setStrokeStyle(2, BORDER_ENEMY, 0.8);
        } else if (isValid) {
          tile.setFillStyle(TILE_VALID);
          border.setStrokeStyle(2, BORDER_VALID, 0.5);

          if (!occupant) {
            const { x, y } = this.cellToWorld(r, c);
            const dot = this.add.circle(x, y, 4, BORDER_VALID, 0.7);
            dot.setDepth(0.5);
            this.dotGraphics.push(dot);
          }
        } else {
          tile.setFillStyle(isDark ? TILE_DARK : TILE_LIGHT);
          border.setStrokeStyle(2, 0x000000, 0);
        }
      }
    }
  }

  private cellToWorld(row: number, col: number) {
    return {
      x: this.boardX + col * this.cellSize + this.cellSize / 2,
      y: this.boardY + row * this.cellSize + this.cellSize / 2,
    };
  }

  // Public API for React to call
  public getState(): BattleState {
    return this.state;
  }

  public cancelSelection() {
    this.clearSelection();
  }
}
