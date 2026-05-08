/**
 * Catalogo delle entità gestite dall'Admin Backoffice.
 *
 * Ogni entry rappresenta un modulo CRUD che verrà implementato. Le route
 * sono già prenotate; le pagine per ora puntano a un placeholder.
 *
 * Mantenere questo elenco allineato con `apps/admin/README.md`.
 */

export interface AdminModule {
  slug: string;
  label: string;
  description: string;
  group: ModuleGroup;
  implemented?: boolean;
}

export type ModuleGroup =
  | 'users'        // gestione utenti
  | 'content'      // entità di contenuto del gioco
  | 'economy'      // bauli, ricompense, pacchi
  | 'progression'  // regole di sblocco, ranking, stagioni
  | 'ops'          // eventi live, sfide asincrone
  | 'assets';      // upload / binding di sprite e immagini

export const adminModules: readonly AdminModule[] = [
  // Users ------------------------------------------------------------------
  { slug: 'users',           label: 'Utenti',          description: 'Gestione utenti registrati: profilo, livello, valute, creature.',  group: 'users', implemented: true },

  // Content ----------------------------------------------------------------
  { slug: 'creatures',       label: 'Creature',        description: 'Anagrafica creature: tipo, rarità, statistiche, sprite.',     group: 'content', implemented: true },
  { slug: 'trainers',        label: 'Trainer',         description: 'Avatar allenatori selezionabili dai giocatori.',              group: 'content', implemented: true },
  { slug: 'backgrounds',     label: 'Sfondi',          description: 'Sfondi di battaglia (Board background).',                     group: 'content', implemented: true },
  { slug: 'supports',        label: 'Supporti',        description: 'Unità di supporto selezionabili nella configurazione.',       group: 'content', implemented: true },
  { slug: 'moves',           label: 'Mosse',           description: 'Mosse standard (orizzontale, verticale, …).',                 group: 'content' },
  { slug: 'special-moves',   label: 'Mosse Speciali',  description: 'Abilità speciali con cooldown / cost.',                       group: 'content' },
  { slug: 'abilities',       label: 'Abilità',         description: 'Tratti passivi delle creature.',                              group: 'content' },

  // Economy ----------------------------------------------------------------
  { slug: 'chests',          label: 'Bauli',           description: 'Tier bauli, drop table, costi.',                          group: 'economy' },
  { slug: 'rewards',         label: 'Ricompense',      description: 'Ricompense giornaliere / evento / baule vittoria.',        group: 'economy' },

  // Progression ------------------------------------------------------------
  { slug: 'progression',     label: 'Progressione',    description: 'Regole di sblocco, curve di EXP, stagioni.',              group: 'progression' },
  { slug: 'gym-leaders',     label: 'Leader Palestra', description: 'Roster + difficoltà dei leader palestra.',                group: 'progression' },

  // Ops --------------------------------------------------------------------
  { slug: 'npc-teams',       label: 'Squadre NPC',     description: 'Composizioni delle squadre IA di allenamento.',           group: 'ops' },
  { slug: 'event-trainers',  label: 'Trainer Eventi',  description: 'NPC speciali per tornei a tema (es. Torneo del Fuoco).',  group: 'ops' },
  { slug: 'async-content',   label: 'Sfide Asincrone', description: 'Contenuti dedicati alle partite asincrone.',              group: 'ops' },

  // Assets -----------------------------------------------------------------
  { slug: 'assets',          label: 'Asset',           description: 'Upload e binding di immagini / spritesheet agli entity key.', group: 'assets' },
];

export const moduleGroups: Record<ModuleGroup, { label: string }> = {
  users:       { label: 'Utenti' },
  content:     { label: 'Contenuti' },
  economy:     { label: 'Economia' },
  progression: { label: 'Progressione' },
  ops:         { label: 'Live Ops' },
  assets:      { label: 'Asset' },
};
