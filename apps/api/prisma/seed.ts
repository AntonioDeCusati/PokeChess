/**
 * Seed script — popola il catalogo delle creature.
 *
 * I dati (slug, nome, tipo, rarità, frame dello sprite) replicano
 * `apps/player/src/data/creatures.ts`, così la collezione mostrata nel
 * Board → Collezione resta identica al mock iniziale.
 *
 * Run:
 *   npm run prisma:seed --workspace @pokechess/api
 * oppure Prisma lo lancia automaticamente durante `migrate dev` / `db seed`.
 */
import { PrismaClient, CreatureType, CreatureRarity, SpriteType } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedRow {
  slug: string;
  name: string;
  type: CreatureType;
  rarity: CreatureRarity;
  frame: number;
  fallbackColor: string;
  fallbackLabel?: string;
}

// Fallback colors mirror `typeTints` in apps/player/src/data/sprites.ts so
// the placeholder tiles match the client palette exactly.
const typeTints: Record<CreatureType, string> = {
  fire: '#E85C3A',
  water: '#4FA8E0',
  grass: '#5BBF4A',
  electric: '#E8C244',
  poison: '#8A4FB8',
  dark: '#3E4454',
  ghost: '#C7C7D1',
  dragon: '#55B89C',
  light: '#F7E7A8',
};

const rows: SeedRow[] = [
  // Row 1
  { slug: 'flarepup',  name: 'Flarepup',  type: 'fire',     rarity: 'epic',   frame: 0, fallbackColor: typeTints.fire },
  { slug: 'voidbat',   name: 'Voidbat',   type: 'poison',   rarity: 'rare',   frame: 0, fallbackColor: typeTints.poison },
  { slug: 'leafling',  name: 'Leafling',  type: 'grass',    rarity: 'rare',   frame: 0, fallbackColor: typeTints.grass },
  { slug: 'bubblet',   name: 'Bubblet',   type: 'water',    rarity: 'common', frame: 0, fallbackColor: typeTints.water },
  { slug: 'sparkit',   name: 'Sparkit',   type: 'electric', rarity: 'rare',   frame: 0, fallbackColor: typeTints.electric },
  // Row 2
  { slug: 'blushling', name: 'Blushling', type: 'fire',     rarity: 'common', frame: 1, fallbackColor: typeTints.fire },
  { slug: 'sprout',    name: 'Sprout',    type: 'grass',    rarity: 'common', frame: 1, fallbackColor: typeTints.grass },
  { slug: 'driplet',   name: 'Driplet',   type: 'water',    rarity: 'common', frame: 1, fallbackColor: typeTints.water },
  { slug: 'umbril',    name: 'Umbril',    type: 'poison',   rarity: 'rare',   frame: 1, fallbackColor: typeTints.poison },
  { slug: 'zaply',     name: 'Zaply',     type: 'electric', rarity: 'common', frame: 1, fallbackColor: typeTints.electric },
  // Row 3
  { slug: 'aquaro',    name: 'Aquaro',    type: 'water',    rarity: 'rare',   frame: 2, fallbackColor: typeTints.water },
  { slug: 'gravel',    name: 'Gravel',    type: 'dark',     rarity: 'common', frame: 2, fallbackColor: typeTints.dark },
  { slug: 'emberling', name: 'Emberling', type: 'fire',     rarity: 'common', frame: 2, fallbackColor: typeTints.fire },
  { slug: 'wispling',  name: 'Wispling',  type: 'ghost',    rarity: 'rare',   frame: 2, fallbackColor: typeTints.ghost },
  { slug: 'verdrake',  name: 'Verdrake',  type: 'dragon',   rarity: 'epic',   frame: 2, fallbackColor: typeTints.dragon },
];

async function main() {
  console.log(`[seed] upserting ${rows.length} creatures...`);
  for (const row of rows) {
    await prisma.creature.upsert({
      where: { slug: row.slug },
      update: {
        name: row.name,
        type: row.type,
        rarity: row.rarity,
        spriteKey: `creature.${row.type}`,
        spriteType: SpriteType.spritesheet,
        spriteFrame: row.frame,
        fallbackColor: row.fallbackColor,
        fallbackLabel: row.fallbackLabel ?? row.name.slice(0, 2).toUpperCase(),
      },
      create: {
        slug: row.slug,
        name: row.name,
        type: row.type,
        rarity: row.rarity,
        spriteKey: `creature.${row.type}`,
        spriteType: SpriteType.spritesheet,
        spriteFrame: row.frame,
        fallbackColor: row.fallbackColor,
        fallbackLabel: row.fallbackLabel ?? row.name.slice(0, 2).toUpperCase(),
      },
    });
  }
  console.log('[seed] done.');
}

main()
  .catch((err) => {
    console.error('[seed] failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
