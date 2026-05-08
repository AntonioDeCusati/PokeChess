/**
 * Seed script — popola il catalogo delle creature.
 *
 * Le creature sono fittizie (Flarepup, Voidbat, …). I campi `pokedexNumber`
 * e `pokedexPath` usano range custom (9001+) come placeholder: vanno aggiornati
 * quando si associano gli sprite reali dalla cartella apps/assets/sprite/.
 *
 * I dati delle animazioni sono placeholder strutturalmente validi:
 * aggiorna frameWidth/frameHeight/durations leggendo il vero AnimData.xml
 * una volta che il mapping sprite/creatura è definito.
 *
 * Run:
 *   npm run db:seed --workspace @pokechess/api
 */
import { PrismaClient, CreatureType, CreatureRarity, AnimationType } from '@prisma/client';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AnimationSeed {
  type: AnimationType;
  frameWidth: number;
  frameHeight: number;
  durations: number[];
  rushFrame?: number;
  hitFrame?: number;
  returnFrame?: number;
}

interface SeedRow {
  slug: string;
  pokedexNumber: number;
  pokedexPath: string;
  name: string;
  type1: CreatureType;
  type2?: CreatureType;
  rarity: CreatureRarity;
  expMax: number;
  canEvolve: boolean;
  evolveToSlug?: string;
  animations: AnimationSeed[];
}

// ---------------------------------------------------------------------------
// Placeholder animation builder
// Mimics a standard PMD sprite layout until real AnimData.xml values are set.
// ---------------------------------------------------------------------------

function placeholderAnimations(): AnimationSeed[] {
  return [
    {
      type: 'idle',
      frameWidth: 32, frameHeight: 40,
      durations: [40, 6, 6],
    },
    {
      type: 'walk',
      frameWidth: 40, frameHeight: 40,
      durations: [4, 4, 4, 4, 4, 4],
    },
    {
      type: 'attack',
      frameWidth: 64, frameHeight: 72,
      durations: [4, 2, 4, 2, 2, 2, 2, 2, 2, 2, 4],
      rushFrame: 2, hitFrame: 5, returnFrame: 7,
    },
    {
      type: 'hurt',
      frameWidth: 40, frameHeight: 56,
      durations: [2, 8],
    },
  ];
}

// ---------------------------------------------------------------------------
// Catalog
// pokedexNumber 9001+ = custom range (non-canon, placeholder).
// Replace with real dex numbers when mapping to apps/assets/sprite/ entries.
// ---------------------------------------------------------------------------

const rows: SeedRow[] = [
  // ── Row 1 ────────────────────────────────────────────────────────────────
  { slug: 'flarepup',   pokedexNumber: 9001, pokedexPath: '9001', name: 'Flarepup',   type1: 'fire',     rarity: 'epic',    expMax: 150, canEvolve: true,  evolveToSlug: 'emberfox',  animations: placeholderAnimations() },
  { slug: 'voidbat',    pokedexNumber: 9002, pokedexPath: '9002', name: 'Voidbat',    type1: 'poison',   rarity: 'rare',    expMax: 100, canEvolve: false, animations: placeholderAnimations() },
  { slug: 'leafling',   pokedexNumber: 9003, pokedexPath: '9003', name: 'Leafling',   type1: 'grass',    rarity: 'rare',    expMax: 100, canEvolve: true,  evolveToSlug: 'verdeon',   animations: placeholderAnimations() },
  { slug: 'bubblet',    pokedexNumber: 9004, pokedexPath: '9004', name: 'Bubblet',    type1: 'water',    rarity: 'common',  expMax: 80,  canEvolve: true,  evolveToSlug: 'tidalfin',  animations: placeholderAnimations() },
  { slug: 'sparkit',    pokedexNumber: 9005, pokedexPath: '9005', name: 'Sparkit',    type1: 'electric', rarity: 'rare',    expMax: 100, canEvolve: false, animations: placeholderAnimations() },
  // ── Row 2 ────────────────────────────────────────────────────────────────
  { slug: 'blushling',  pokedexNumber: 9006, pokedexPath: '9006', name: 'Blushling',  type1: 'fire',     rarity: 'common',  expMax: 80,  canEvolve: false, animations: placeholderAnimations() },
  { slug: 'sprout',     pokedexNumber: 9007, pokedexPath: '9007', name: 'Sprout',     type1: 'grass',    rarity: 'common',  expMax: 80,  canEvolve: false, animations: placeholderAnimations() },
  { slug: 'driplet',    pokedexNumber: 9008, pokedexPath: '9008', name: 'Driplet',    type1: 'water',    rarity: 'common',  expMax: 80,  canEvolve: false, animations: placeholderAnimations() },
  { slug: 'umbril',     pokedexNumber: 9009, pokedexPath: '9009', name: 'Umbril',     type1: 'poison',   rarity: 'rare',    expMax: 100, canEvolve: false, animations: placeholderAnimations() },
  { slug: 'zaply',      pokedexNumber: 9010, pokedexPath: '9010', name: 'Zaply',      type1: 'electric', rarity: 'common',  expMax: 80,  canEvolve: false, animations: placeholderAnimations() },
  // ── Row 3 ────────────────────────────────────────────────────────────────
  { slug: 'aquaro',     pokedexNumber: 9011, pokedexPath: '9011', name: 'Aquaro',     type1: 'water',    rarity: 'rare',    expMax: 100, canEvolve: false, animations: placeholderAnimations() },
  { slug: 'gravel',     pokedexNumber: 9012, pokedexPath: '9012', name: 'Gravel',     type1: 'dark',     rarity: 'common',  expMax: 80,  canEvolve: false, animations: placeholderAnimations() },
  { slug: 'emberling',  pokedexNumber: 9013, pokedexPath: '9013', name: 'Emberling',  type1: 'fire',     rarity: 'common',  expMax: 80,  canEvolve: false, animations: placeholderAnimations() },
  { slug: 'wispling',   pokedexNumber: 9014, pokedexPath: '9014', name: 'Wispling',   type1: 'ghost',    rarity: 'rare',    expMax: 100, canEvolve: false, animations: placeholderAnimations() },
  { slug: 'verdrake',   pokedexNumber: 9015, pokedexPath: '9015', name: 'Verdrake',   type1: 'dragon',   rarity: 'epic',    expMax: 150, canEvolve: false, animations: placeholderAnimations() },
  // ── Evolutions (referenced above via evolveToSlug) ──────────────────────
  { slug: 'emberfox',   pokedexNumber: 9016, pokedexPath: '9016', name: 'Emberfox',   type1: 'fire',     rarity: 'legendary', expMax: 200, canEvolve: false, animations: placeholderAnimations() },
  { slug: 'verdeon',    pokedexNumber: 9017, pokedexPath: '9017', name: 'Verdeon',    type1: 'grass',    rarity: 'epic',      expMax: 150, canEvolve: false, animations: placeholderAnimations() },
  { slug: 'tidalfin',   pokedexNumber: 9018, pokedexPath: '9018', name: 'Tidalfin',   type1: 'water',    rarity: 'epic',      expMax: 150, canEvolve: false, animations: placeholderAnimations() },
];

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function main() {
  console.log(`[seed] upserting ${rows.length} creatures…`);

  // First pass: upsert all creatures WITHOUT evolveToId so foreign keys are
  // all present before we wire up the evolution chain in the second pass.
  for (const row of rows) {
    await prisma.creature.upsert({
      where: { slug: row.slug },
      update: {
        pokedexNumber: row.pokedexNumber,
        pokedexPath:   row.pokedexPath,
        name:          row.name,
        type1:         row.type1,
        type2:         row.type2 ?? null,
        rarity:        row.rarity,
        expMax:        row.expMax,
        canEvolve:     row.canEvolve,
        evolveToId:   null, // patched in second pass
      },
      create: {
        slug:          row.slug,
        pokedexNumber: row.pokedexNumber,
        pokedexPath:   row.pokedexPath,
        name:          row.name,
        type1:         row.type1,
        type2:         row.type2 ?? null,
        rarity:        row.rarity,
        expMax:        row.expMax,
        canEvolve:     row.canEvolve,
        evolveToId:   null,
      },
    });

    // Upsert animations for this creature.
    const creature = await prisma.creature.findUniqueOrThrow({ where: { slug: row.slug } });
    for (const anim of row.animations) {
      await prisma.creatureAnimation.upsert({
        where: {
          creatureId_type: { creatureId: creature.id, type: anim.type },
        },
        update: {
          frameWidth:  anim.frameWidth,
          frameHeight: anim.frameHeight,
          frameCount:  anim.durations.length,
          durations:   anim.durations,
          rushFrame:   anim.rushFrame   ?? null,
          hitFrame:    anim.hitFrame    ?? null,
          returnFrame: anim.returnFrame ?? null,
        },
        create: {
          creatureId:  creature.id,
          type:        anim.type,
          frameWidth:  anim.frameWidth,
          frameHeight: anim.frameHeight,
          frameCount:  anim.durations.length,
          durations:   anim.durations,
          rushFrame:   anim.rushFrame   ?? null,
          hitFrame:    anim.hitFrame    ?? null,
          returnFrame: anim.returnFrame ?? null,
        },
      });
    }
  }

  // Second pass: wire up evolution chains.
  const slugToId = new Map(
    (await prisma.creature.findMany({ select: { id: true, slug: true } }))
      .map((c) => [c.slug, c.id]),
  );

  for (const row of rows) {
    if (!row.evolveToSlug) continue;
    const evolveToId = slugToId.get(row.evolveToSlug);
    if (!evolveToId) {
      console.warn(`[seed] evolveToSlug "${row.evolveToSlug}" not found for "${row.slug}"`);
      continue;
    }
    await prisma.creature.update({
      where: { slug: row.slug },
      data: { evolveToId },
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


