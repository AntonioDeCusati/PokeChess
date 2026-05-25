/**
 * Seed NPC trainers from allenatori.json.
 *
 * For each trainer, resolves Pokemon names to Creature IDs and creates
 * NpcTrainer + NpcTrainerSlot rows for all 3 team tiers.
 *
 * Run:  npx tsx prisma/seed-trainers.ts
 */
import { PrismaClient, type TrainerRole, type TeamTier } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const ROLE_MAP: Record<string, TrainerRole> = {
  'Professore':           'professor',
  'Capopalestra':         'gym_leader',
  'Superquattro':         'elite_four',
  'Campione':             'champion',
  'Kahuna':               'kahuna',
  'Capitano':             'captain',
  'Rivale':               'rival',
  'Rivale/Capopalestra':  'rival',
  'Campione/Rivale':      'champion',
  'Leader':               'leader',
  'Elite':                'elite',
};

interface RawTrainer {
  nome: string;
  ruolo: string;
  tipo: string;
  team_base: string[];
  team_intermedio: string[];
  team_finale: string[];
}

// Maps trainer JSON names → actual DB creature names (lowercase → lowercase)
const NAME_FIXES: Record<string, string> = {
  'aegislash':        'aegislash-shield',
  'dudunsparce':      'dudunsparce-two-segment',
  'flutter mane':     'flutter-mane',
  'gourgeist':        'gourgeist-average',
  'great tusk':       'great-tusk',
  'indeedee':         'indeedee-male',
  'iron hands':       'iron-hands',
  'krookorok':        'krokorok',
  'lycanroc':         'lycanroc-midday',
  'lycanroc dusk':    'lycanroc-dusk',
  'maushold':         'maushold-family-of-four',
  'meowstic':         'meowstic-male',
  'mimikyu':          'mimikyu-disguised',
  'mr. mime':         'mr-mime',
  'nidoran♀':         'nidoran-f',
  'nidoran♂':         'nidoran-m',
  'palafin':          'palafin-zero',
  'paldean wooper':   'wooper',
  'raichu_alola':     'raichu',
  'rotom-wash':       'rotom',
  'sandshrew_alola':  'sandshrew',
  'sandslash_alola':  'sandslash',
  'toxtricity':       'toxtricity-amped',
  'tyroguer':         'tyrogue',
  'spewpa':           'spewpa',
};

function slugify(region: string, name: string): string {
  return `${region}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  const jsonPath = path.resolve(__dirname, '../../../allenatori.json');
  const raw: Record<string, RawTrainer[]> = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Build a name→id lookup from the DB
  const allCreatures = await prisma.creature.findMany({ select: { id: true, name: true } });
  const creatureByName = new Map<string, string>();
  for (const c of allCreatures) {
    creatureByName.set(c.name.toLowerCase(), c.id);
  }
  console.log(`[seed-trainers] ${creatureByName.size} creatures in DB`);

  const missing = new Set<string>();
  let created = 0;
  let updated = 0;

  const regions = Object.keys(raw);

  for (const region of regions) {
    const trainers = raw[region];
    for (const t of trainers) {
      const slug = slugify(region, t.nome);
      const role = ROLE_MAP[t.ruolo] ?? 'elite';

      // Resolve all 3 teams
      const teams: { tier: TeamTier; names: string[] }[] = [
        { tier: 'base',         names: t.team_base ?? [] },
        { tier: 'intermediate', names: t.team_intermedio ?? [] },
        { tier: 'final',        names: t.team_finale ?? [] },
      ];

      // Upsert the NpcTrainer
      const existing = await prisma.npcTrainer.findUnique({ where: { slug } });
      const trainer = await prisma.npcTrainer.upsert({
        where: { slug },
        create: { slug, name: t.nome, role, region, typeSpecialty: t.tipo },
        update: { name: t.nome, role, region, typeSpecialty: t.tipo },
      });
      if (existing) updated++;
      else created++;

      // Delete old slots and recreate
      await prisma.npcTrainerSlot.deleteMany({ where: { trainerId: trainer.id } });

      const slotsToCreate: Array<{
        trainerId: string;
        tier: TeamTier;
        slotIndex: number;
        creatureId: string;
      }> = [];

      for (const { tier, names } of teams) {
        for (let i = 0; i < names.length; i++) {
          const rawName = names[i].trim();
          const lookupName = NAME_FIXES[rawName.toLowerCase()] ?? rawName.toLowerCase();
          const creatureId = creatureByName.get(lookupName);
          if (!creatureId) {
            missing.add(rawName);
            continue;
          }
          slotsToCreate.push({
            trainerId: trainer.id,
            tier,
            slotIndex: i,
            creatureId,
          });
        }
      }

      if (slotsToCreate.length > 0) {
        await prisma.npcTrainerSlot.createMany({ data: slotsToCreate });
      }
    }
  }

  console.log(`[seed-trainers] done. Created: ${created}, Updated: ${updated}`);

  if (missing.size > 0) {
    console.log(`\n[seed-trainers] WARNING: ${missing.size} Pokemon names NOT found in DB:`);
    const sorted = [...missing].sort();
    for (const name of sorted) {
      console.log(`  - ${name}`);
    }
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
