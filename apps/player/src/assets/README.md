# Assets

This directory holds **all game artwork** referenced by the UI through `SpriteRef`.

```
assets/
├─ images/          # single PNG / WebP files (avatars, UI icons, backgrounds)
├─ spritesheets/    # sheets + matching .meta.ts files describing frame layout
├─ registry.ts      # key → imported asset metadata (runtime lookup)
└─ index.ts         # public API: resolveSprite(), AssetRegistry
```

## Rules

1. **Components never import assets directly.** They read a `SpriteRef` from
   the data layer and pass it to `<Sprite />`, which calls `resolveSprite(ref)`.

2. **Every asset is registered by `key`.** The same `key` will later be used
   verbatim by Phaser:
   ```ts
   // Later in a Phaser scene:
   this.load.spritesheet(key, url, { frameWidth, frameHeight });
   this.add.sprite(x, y, key, frame);
   ```

3. **Missing assets never break the UI.** `resolveSprite()` returns a
   fallback descriptor (color tile + optional label) when the key is unknown.

## Adding a single image

1. Drop the file in `images/` (e.g. `images/trainer-deku.png`).
2. Register it in `registry.ts`:
   ```ts
   'trainer/deku': { kind: 'image', url: imagesTrainerDeku },
   ```
3. Reference it from data:
   ```ts
   avatar: { key: 'trainer/deku', type: 'image' }
   ```

## Adding a spritesheet

1. Drop the sheet in `spritesheets/` (e.g. `spritesheets/creatures-fire.png`).
2. Create `spritesheets/creatures-fire.meta.ts` with `frameWidth`, `frameHeight`, `frames`.
3. Register it in `registry.ts` with `kind: 'spritesheet'`.
4. Reference a specific frame from data:
   ```ts
   sprite: { key: 'creatures/fire', type: 'spritesheet', frame: 3 }
   ```
