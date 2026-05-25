/**
 * Bulk seed — fetches all 1025 Pokemon from PokeAPI GraphQL and upserts
 * them into the Creature table. Portraits are assumed to exist at:
 *   apps/assets/portrait/{pokedexPath}/Normal.png
 *
 * Run:  npx tsx prisma/seed-pokemon.ts
 */
import { PrismaClient, type CreatureType, type CreatureRarity } from '@prisma/client';

const prisma = new PrismaClient();

const POKEAPI_GRAPHQL = 'https://beta.pokeapi.co/graphql/v1beta';
const MAX_POKEDEX = 1025;

// Map official Pokemon types → our CreatureType enum.
function mapType(pokemonType: string): CreatureType {
  const valid: Set<string> = new Set([
    'normal','fire','water','grass','electric','ice','fighting','poison',
    'ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy',
  ]);
  return (valid.has(pokemonType) ? pokemonType : 'normal') as CreatureType;
}

function calcRarity(bst: number, isLegendary: boolean, isMythical: boolean): CreatureRarity {
  if (isLegendary || isMythical) return 'legendary';
  if (bst >= 540) return 'epic';
  if (bst >= 420) return 'rare';
  return 'common';
}

function padDex(n: number): string {
  return String(n).padStart(4, '0');
}

interface GqlPokemon {
  id: number;
  name: string;
  pokemon_v2_pokemontypes: Array<{ pokemon_v2_type: { name: string } }>;
  pokemon_v2_pokemonstats: Array<{ base_stat: number }>;
  pokemon_v2_pokemonspecy: { is_legendary: boolean; is_mythical: boolean } | null;
}

async function fetchAllPokemon(): Promise<GqlPokemon[]> {
  console.log(`[seed-pokemon] fetching ${MAX_POKEDEX} Pokemon from PokeAPI GraphQL…`);

  const query = `{
    pokemon_v2_pokemon(
      where: { id: { _lte: ${MAX_POKEDEX} }, is_default: { _eq: true } }
      order_by: { id: asc }
    ) {
      id
      name
      pokemon_v2_pokemontypes { pokemon_v2_type { name } }
      pokemon_v2_pokemonstats { base_stat }
      pokemon_v2_pokemonspecy { is_legendary is_mythical }
    }
  }`;

  const res = await fetch(POKEAPI_GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`PokeAPI GraphQL returned ${res.status}: ${await res.text()}`);
  }

  const json = await res.json() as { data: { pokemon_v2_pokemon: GqlPokemon[] } };
  return json.data.pokemon_v2_pokemon;
}

async function main() {
  const pokemon = await fetchAllPokemon();
  console.log(`[seed-pokemon] received ${pokemon.length} Pokemon. Upserting…`);

  let created = 0;
  let updated = 0;

  for (const p of pokemon) {
    const types = p.pokemon_v2_pokemontypes
      .sort((a, b) => a.pokemon_v2_type.name.localeCompare(b.pokemon_v2_type.name))
      .map((t) => t.pokemon_v2_type.name);

    // pokemon_v2_pokemontypes is ordered by slot, so first = primary type
    const rawTypes = p.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name);
    const type1 = mapType(rawTypes[0] ?? 'normal');
    const type2 = rawTypes[1] ? mapType(rawTypes[1]) : null;

    const bst = p.pokemon_v2_pokemonstats.reduce((sum, s) => sum + s.base_stat, 0);
    const isLegendary = p.pokemon_v2_pokemonspecy?.is_legendary ?? false;
    const isMythical = p.pokemon_v2_pokemonspecy?.is_mythical ?? false;
    const rarity = calcRarity(bst, isLegendary, isMythical);

    const slug = p.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const pokedexPath = padDex(p.id);

    const expMax =
      rarity === 'legendary' ? 300 :
      rarity === 'epic' ? 200 :
      rarity === 'rare' ? 150 : 100;

    const data = {
      slug,
      pokedexNumber: p.id,
      pokedexPath,
      name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
      type1,
      type2: type2 !== type1 ? type2 : null,
      rarity,
      expMax,
      canEvolve: false,
      evolveToId: null,
    };

    const existing = await prisma.creature.findUnique({ where: { pokedexNumber: p.id } });

    if (existing) {
      await prisma.creature.update({ where: { id: existing.id }, data });
      updated++;
    } else {
      await prisma.creature.create({ data });
      created++;
    }

    if ((created + updated) % 100 === 0) {
      console.log(`[seed-pokemon] progress: ${created + updated}/${pokemon.length}`);
    }
  }

  console.log(`[seed-pokemon] done. Created: ${created}, Updated: ${updated}, Total: ${created + updated}`);

  // --- Wire up evolution chains ---
  console.log('[seed-pokemon] fetching evolution data…');
  await wireEvolutions();
}

async function wireEvolutions() {
  const query = `{
    pokemon_v2_pokemonspecies(
      where: { id: { _lte: ${MAX_POKEDEX} }, evolves_from_species_id: { _is_null: false } }
      order_by: { id: asc }
    ) {
      id
      evolves_from_species_id
    }
  }`;

  const res = await fetch(POKEAPI_GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const json = await res.json() as {
    data: { pokemon_v2_pokemonspecies: Array<{ id: number; evolves_from_species_id: number }> }
  };

  const evos = json.data.pokemon_v2_pokemonspecies;
  console.log(`[seed-pokemon] wiring ${evos.length} evolution links…`);

  const dexToId = new Map(
    (await prisma.creature.findMany({ select: { id: true, pokedexNumber: true } }))
      .map((c) => [c.pokedexNumber, c.id]),
  );

  let wired = 0;
  for (const evo of evos) {
    const fromId = dexToId.get(evo.evolves_from_species_id);
    const toId = dexToId.get(evo.id);
    if (!fromId || !toId) continue;

    await prisma.creature.update({
      where: { id: fromId },
      data: { canEvolve: true, evolveToId: toId },
    });
    wired++;
  }

  console.log(`[seed-pokemon] evolution chains wired: ${wired}`);
}

main()
  .catch((err) => {
    console.error('[seed-pokemon] failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
