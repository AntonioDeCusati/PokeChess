import Phaser from 'phaser';
import { idleSpriteData } from '@/data/idle-sprite-data';
import { EventBus } from '@/game/battle/EventBus';

const FRONT_ROW = 0;
const MS_PER_TICK = 50;

interface ChestOpenData {
  pokedexPath: string;
  rarity: string;
  name: string;
  tier: string;
}

const RARITY_COLORS: Record<string, number> = {
  common:    0x9ca3af,
  rare:      0x3b82f6,
  epic:      0xa855f7,
  legendary: 0xeab308,
};

const RARITY_LABELS: Record<string, string> = {
  common: 'COMUNE', rare: 'RARO', epic: 'EPICO', legendary: 'LEGGENDARIO',
};

const CHEST_BODY: Record<string, number> = {
  wood: 0x8b6914, iron: 0x5c6370, gold: 0xb8860b, diamond: 0x4169e1,
};
const CHEST_LID: Record<string, number> = {
  wood: 0xa07828, iron: 0x6e7681, gold: 0xdaa520, diamond: 0x6495ed,
};

export class ChestOpenScene extends Phaser.Scene {
  private openData!: ChestOpenData;

  constructor() {
    super({ key: 'ChestOpenScene' });
  }

  init(data: ChestOpenData) {
    this.openData = data;
  }

  preload() {
    const path = this.openData.pokedexPath;
    const key = `idle-${path}`;
    const meta = idleSpriteData[path];
    if (meta && !this.textures.exists(key)) {
      this.load.spritesheet(key, `/sprite/${path}/Idle-Anim.png`, {
        frameWidth: meta.w,
        frameHeight: meta.h,
      });
    }
  }

  create() {
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;
    const tier = this.openData.tier || 'gold';

    this.cameras.main.setBackgroundColor(0x08090d);

    const bodyColor = CHEST_BODY[tier] ?? 0xb8860b;
    const lidColor = CHEST_LID[tier] ?? 0xdaa520;

    // Build chest from simple shapes
    const body = this.add.rectangle(cx, cy + 8, 70, 44, bodyColor).setDepth(1);
    const lid = this.add.rectangle(cx, cy - 18, 74, 26, lidColor).setDepth(2);
    const band = this.add.rectangle(cx, cy - 4, 74, 4, 0xffd700).setDepth(3);
    const lock = this.add.rectangle(cx, cy + 4, 12, 12, 0xffd700).setDepth(3);

    const chestGroup = [body, lid, band, lock];

    // Phase 1: gentle shake (1s)
    this.tweens.add({
      targets: chestGroup,
      x: `+=${0}`,
      duration: 100,
      yoyo: true,
      repeat: 5,
      onUpdate: (_tween) => {
        const p = _tween.progress;
        const offset = Math.sin(p * Math.PI * 12) * (2 + p * 4);
        for (const obj of chestGroup) {
          (obj as Phaser.GameObjects.Rectangle).setX(cx + offset);
        }
      },
      onComplete: () => {
        for (const obj of chestGroup) {
          (obj as Phaser.GameObjects.Rectangle).setX(cx);
        }
      },
    });

    // Phase 2: lid flies up + flash (after 0.8s)
    this.time.delayedCall(800, () => {
      this.tweens.add({
        targets: lid,
        y: cy - 120,
        angle: -25,
        alpha: 0,
        duration: 400,
        ease: 'Power2',
      });
      this.tweens.add({
        targets: [band, lock],
        alpha: 0,
        duration: 200,
      });

      // Soft glow from inside the chest
      const glow = this.add.ellipse(cx, cy, 50, 30,
        RARITY_COLORS[this.openData.rarity] ?? 0xffffff, 0.8);
      glow.setDepth(0);
      this.tweens.add({
        targets: glow,
        scaleX: 4,
        scaleY: 3,
        alpha: 0,
        duration: 600,
        ease: 'Power2',
      });

      // A few sparkle particles (not chaotic)
      this.spawnSparkles(cx, cy - 10, 8);

      this.time.delayedCall(500, () => {
        body.destroy();
        this.revealCreature(cx, cy);
      });
    });
  }

  private spawnSparkles(cx: number, cy: number, count: number) {
    const color = RARITY_COLORS[this.openData.rarity] ?? 0xffffff;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = Phaser.Math.Between(50, 100);
      const size = Phaser.Math.Between(2, 5);
      const dot = this.add.circle(cx, cy, size, color, 0.8).setDepth(5);

      this.tweens.add({
        targets: dot,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist - 20,
        alpha: 0,
        scale: 0.3,
        duration: Phaser.Math.Between(400, 700),
        ease: 'Power2',
        onComplete: () => dot.destroy(),
      });
    }
  }

  private revealCreature(cx: number, cy: number) {
    const path = this.openData.pokedexPath;
    const key = `idle-${path}`;
    const meta = idleSpriteData[path];

    if (!meta || !this.textures.exists(key)) {
      EventBus.emit('chest-reveal-done');
      return;
    }

    // Rarity glow behind the sprite
    const rarityColor = RARITY_COLORS[this.openData.rarity] ?? 0xffffff;
    const bgGlow = this.add.ellipse(cx, cy - 10, 80, 80, rarityColor, 0.12).setDepth(0);
    this.tweens.add({
      targets: bgGlow,
      alpha: { from: 0.08, to: 0.2 },
      scaleX: { from: 1, to: 1.3 },
      scaleY: { from: 1, to: 1.3 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Animated sprite
    const animKey = `chest-idle-${path}`;
    if (!this.anims.exists(animKey)) {
      const startFrame = FRONT_ROW * meta.frames;
      const avgDur = (meta.durs.reduce((a, b) => a + b, 0) / meta.frames) * MS_PER_TICK;
      const frameRate = 1000 / Math.max(avgDur, 80);
      this.anims.create({
        key: animKey,
        frames: Array.from({ length: meta.frames }, (_, i) => ({
          key, frame: startFrame + i,
        })),
        frameRate,
        repeat: -1,
      });
    }

    const sprite = this.add.sprite(cx, cy - 16, key).setDepth(5);
    sprite.setScale(0);
    sprite.play(animKey);

    this.tweens.add({
      targets: sprite,
      scale: 2.5,
      duration: 450,
      ease: 'Back.easeOut',
    });

    // Name
    const nameText = this.add.text(cx, cy + 50, this.openData.name, {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5).setAlpha(0).setDepth(5);

    // Rarity label
    const colorHex = '#' + rarityColor.toString(16).padStart(6, '0');
    const rarityText = this.add.text(cx, cy + 70,
      RARITY_LABELS[this.openData.rarity] ?? '', {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: colorHex,
      align: 'center',
    }).setOrigin(0.5).setAlpha(0).setDepth(5);

    this.tweens.add({
      targets: [nameText, rarityText],
      alpha: 1,
      y: '-=5',
      duration: 350,
      delay: 250,
      ease: 'Power2',
    });

    // Tap to close (after brief delay)
    this.time.delayedCall(1000, () => {
      const hint = this.add.text(cx, this.scale.height - 24,
        'Tocca per continuare', {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: '#666666',
        align: 'center',
      }).setOrigin(0.5).setDepth(5);

      this.tweens.add({
        targets: hint,
        alpha: { from: 0.4, to: 0.8 },
        duration: 800,
        yoyo: true,
        repeat: -1,
      });

      this.input.once('pointerdown', () => {
        EventBus.emit('chest-reveal-done');
      });
    });
  }
}
