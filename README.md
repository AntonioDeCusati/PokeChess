# PokeChess — Monorepo

npm -v
11.0.0

Tre applicazioni nello stesso repository:

1. **`@pokechess/player`** — Player Game App, **mobile-first** (il 95% degli utenti gioca su smartphone).
2. **`@pokechess/admin`** — Admin Backoffice, dashboard desktop per la gestione dei contenuti (solo scaffold).
3. **`@pokechess/api`** — Backend Express + Prisma + Postgres, scope ristretto ai moduli core (auth, user, creature, team).

> Priorità corrente: **Player App + API core**. L'Admin è uno scaffold predisposto, non ancora implementato.

---

## Struttura

```
PokeChess/
├── package.json            # root, npm workspaces
├── tsconfig.base.json      # opzioni TS condivise
├── apps/
│   ├── player/             # Player Game App (React 18 + Vite + TS + Tailwind)
│   │   ├─ src/
│   │   │  ├─ assets/       # registry + immagini / spritesheet
│   │   │  ├─ components/   # UI primitives + componenti specifici (board/, home/, shop/, league/, friends/)
│   │   │  ├─ data/         # mock data (player, team, shop, friends, …)
│   │   │  ├─ layout/       # AppShell mobile, GameHeader, BottomNav
│   │   │  ├─ pages/        # Home, Board, Shop, League, Friends
│   │   │  ├─ types/        # domain types (Creature, Move, ShopItem, …)
│   │   │  ├─ lib/          # routes, format helpers
│   │   │  └─ styles/
│   │   └─ (vite, tailwind, ts configs)
│   ├── admin/              # Admin Backoffice (scaffold)
│   │   ├─ src/
│   │   │  ├─ layout/       # AdminShell desktop: sidebar + topbar
│   │   │  ├─ pages/        # Dashboard + ModulePlaceholder
│   │   │  └─ lib/modules.ts  # catalogo entità da gestire
│   │   └─ (vite, tailwind, ts configs)
│   └── api/                # Backend Express + Prisma + Postgres
│       ├─ prisma/          # schema + seed (creature)
│       ├─ src/             # auth / user / creature / team
│       ├─ docker-compose.yml  # Postgres 16 su porta 5433
│       └─ .env.example
└── screen/                 # mockup di riferimento del Player App
```

## Script root

```bash
# Setup
npm install              # installa le dipendenze di tutti i workspace

# Player (mobile game)
npm run dev:player       # http://localhost:5173
npm run build:player
npm run preview:player

# Admin (dashboard)
npm run dev:admin        # http://localhost:5174
npm run build:admin

# API (backend)
npm run dev:api          # http://localhost:4000
npm run build:api        # compila in apps/api/dist
npm run start:api        # esegue dist (production)

# Database (delegati a @pokechess/api, presume PostgreSQL self-hosted)
npm run db:generate      # prisma generate  (refresh client dopo cambio schema)
npm run db:migrate       # prisma migrate dev  — dev, interattivo (-- --name init)
npm run db:deploy        # prisma migrate deploy  — production, non interattivo
npm run db:seed          # popola il catalogo creature
npm run db:reset         # drop + migrate + seed  ⚠️ solo dev
npm run db:studio        # UI Prisma Studio

# Tutto
npm run build            # build di tutti i workspace
npm run typecheck        # typecheck di tutti i workspace
```

Player, Admin e API possono girare in parallelo (porte 5173 / 5174 / 4000).

## Design system

Le due app usano **due design system deliberatamente diversi**:

- Player → tema scuro, accenti oro/cremisi, tipografia da gioco, max-w 420px, mobile-first
- Admin → tema chiaro, palette neutra, tipografia da data-UI, layout desktop largo, sidebar

Non c'è (e non deve esserci) un design-token file condiviso: sono due prodotti diversi.

## Codice condiviso (futuro)

Quando il Player passerà a leggere dati da backend invece che da mock locale, estrarremo i **domain types** in un pacchetto `packages/shared` consumato da entrambe le app. Per ora i tipi vivono in `apps/player/src/types/` — il refactor è meccanico e non urgente.



DEKU : 
- piu animazioni di transizione