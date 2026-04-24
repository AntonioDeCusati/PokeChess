# PokeChess — Context Handoff

File di contesto pensato per **continuare il lavoro su un altro PC** o per onboardare una nuova sessione agent senza dover rileggere tutta la cronologia.

Tutto quello che serve per: capire il progetto, installarlo da zero, sapere che cos'è stato fatto, che cos'è il prossimo passo, e quali regole rispettare.

---

## 1 · Cos'è PokeChess

Gioco mobile-first di strategia a slot (ispirato a scacchi + collezione creature). Il repo è un **monorepo npm workspaces** con tre applicazioni:

| Workspace              | Ruolo                                              | Stato                                   |
|------------------------|----------------------------------------------------|-----------------------------------------|
| `@pokechess/player`    | Player Game App, **95% mobile**, React+Vite+TS+Tailwind | UI completa su mock data                |
| `@pokechess/admin`     | Admin Backoffice, desktop dashboard                | **Solo scaffold**, non implementato     |
| `@pokechess/api`       | Backend Express + Prisma + PostgreSQL              | **Completo per lo scope core**          |

Priorità attuale: **API completata → deploy self-hosted → far consumare le API reali al Player**.

---

## 2 · Stack tecnico

- **Monorepo**: npm workspaces, Node 18+, npm 10+
- **Player**: React 18, Vite 5, TypeScript 5, Tailwind 3, React Router 6
- **Admin**: stesso stack del Player, tema chiaro (design system separato)
- **API**: Express 4 (ESM), TypeScript 5, Prisma 5, PostgreSQL **14+ self-hosted**, bcryptjs, jsonwebtoken, zod, tsx
- **Assetstack Player**: sistema `SpriteRef` compatibile Phaser (spritesheet / image / fallback placeholder)

---

## 3 · Struttura del repo

```
PokeChess/
├─ package.json            # root, workspaces
├─ tsconfig.base.json      # TS config condivisa
├─ README.md               # overview e script root
├─ CONTEXT.md              # questo file
├─ apps/
│  ├─ player/              # Player Game App
│  │  ├─ src/
│  │  │  ├─ assets/        # registry + immagini/spritesheet
│  │  │  ├─ components/    # UI primitives + board/, home/, shop/, league/, friends/
│  │  │  ├─ data/          # mock data (player, team, shop, friends, …)
│  │  │  ├─ layout/        # AppShell, GameHeader, BottomNav
│  │  │  ├─ pages/         # Home, Board, Shop, League, Friends
│  │  │  ├─ types/         # Creature, Move, ShopItem, PlayerProfile, …
│  │  │  └─ lib/, styles/
│  │  └─ (vite/tailwind/ts configs)
│  ├─ admin/               # Scaffold desktop dashboard (placeholder pages)
│  │  └─ src/ layout/, pages/, lib/modules.ts
│  └─ api/                 # Backend
│     ├─ prisma/
│     │  ├─ schema.prisma  # User, Creature, UserCreature, TeamSlot, Config
│     │  ├─ migrations/
│     │  └─ seed.ts        # popola 15 creature
│     ├─ src/
│     │  ├─ index.ts       # bootstrap + graceful shutdown
│     │  ├─ app.ts         # express app + routing + /dev condizionale
│     │  ├─ env.ts         # zod-validated env + resolveTrustProxy
│     │  ├─ db.ts          # singleton Prisma client
│     │  ├─ http/          # errors.ts, errorHandler.ts, validate.ts
│     │  ├─ auth/          # register / login / me  + password, jwt, requireAuth
│     │  ├─ user/          # GET+PATCH /profile, GET /creatures
│     │  ├─ creature/      # GET /, GET /:id (id o slug)
│     │  ├─ team/          # GET /, POST /update (solo slot)
│     │  ├─ board-config/  # GET /, POST /update (support/trainer/background)
│     │  ├─ app-bootstrap/ # GET /app/bootstrap (aggregato)
│     │  └─ dev/           # POST /dev/grant-creatures (dev-only)
│     ├─ .env.example
│     ├─ package.json
│     └─ tsconfig.json
└─ screen/                 # mockup visivi di riferimento del Player
```

---

## 4 · Setup da zero su nuovo PC

### 4.1 Requisiti

- **Node.js 18+** (testato 18/20) · `node -v`
- **npm 10+**
- **Git**
- **PostgreSQL 14+** (self-hosted, non Docker, non cloud) — può essere su localhost o su un server remoto. Se sul tuo server remoto è già su, sul nuovo PC di sviluppo **non ti serve installarlo**, basta la `DATABASE_URL` giusta.
- (Opzionale) **VSCode / Cursor** con estensioni Tailwind, Prisma, ESLint

### 4.2 Clone + install

```bash
git clone <url-del-repo> PokeChess
cd PokeChess
npm install        # installa le dipendenze di TUTTI i workspace
```

`postinstall` di Prisma genera automaticamente il client in `apps/api/node_modules/.prisma/client`.

### 4.3 Env API

```bash
cp apps/api/.env.example apps/api/.env
```

Poi apri `apps/api/.env` e compila almeno:

| Variabile | Esempio | Note |
|---|---|---|
| `DATABASE_URL` | `postgresql://pokechess:PASSWORD@HOST:5432/pokechess?schema=public` | La tua Postgres self-hosted. Se DB remoto fuori localhost aggiungi `&sslmode=require` e abilita TLS server-side |
| `JWT_SECRET` | stringa random ≥ 16 char | Genera con `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_EXPIRES_IN` | `7d` | |
| `CORS_ORIGINS` | `http://localhost:5173` in dev, `https://play.tuo-dominio.it` in prod | CSV di origin |
| `TRUST_PROXY` | `0` in dev, `true` o `1` dietro nginx in prod | |
| `NODE_ENV` | `development` / `production` | `production` **disabilita** `/dev/*` |
| `PORT` | `4000` | |

> ⚠️ Il `.env` **non è committato** (è in `.gitignore`). Ogni nuova macchina lo ricrea.

### 4.4 Database

**Solo la prima volta** (crea utente + db su Postgres nativo) — istruzioni complete in `apps/api/README.md §1`. In sintesi:

```bash
sudo -u postgres psql
```

```sql
CREATE USER pokechess WITH LOGIN PASSWORD 'STRONG_PW' NOSUPERUSER NOCREATEDB NOCREATEROLE;
CREATE DATABASE pokechess WITH OWNER = pokechess ENCODING = 'UTF8' TEMPLATE = template0;
GRANT ALL PRIVILEGES ON DATABASE pokechess TO pokechess;
```

Poi dalla root del monorepo:

```bash
npm run db:generate                 # refresh Prisma client
npm run db:migrate -- --name init   # applica + crea migrazione (solo prima volta sul DB)
npm run db:seed                     # 15 creature nel catalogo
```

Se il DB è già migrato (es. stai collegandoti da un nuovo PC a un server già in piedi): basta `npm run db:generate`. Non toccare `db:migrate`/`db:reset` su DB già popolati.

### 4.5 Avvio

Tre processi in parallelo (3 terminali):

```bash
npm run dev:api      # http://localhost:4000
npm run dev:player   # http://localhost:5173
npm run dev:admin    # http://localhost:5174   (solo se ti serve)
```

### 4.6 Smoke test rapido

Nel Player dovresti vedere 5 pagine: Home / Board / Shop / League / Friends (con mock data). L'API risponde su `GET http://localhost:4000/health` → `{ status: 'ok' }`.

Per testare il flusso completo API (register → grant creature → team → bootstrap), segui lo smoke test PowerShell/curl in `apps/api/README.md §5`.

---

## 5 · Script root (riferimento rapido)

```bash
# Runtime
npm run dev:player           # Vite dev — http://localhost:5173
npm run dev:admin            # Vite dev — http://localhost:5174
npm run dev:api              # tsx watch — http://localhost:4000

npm run build:player
npm run build:admin
npm run build:api            # tsc → apps/api/dist/
npm run start:api            # node dist/index.js (production)
npm run preview:player

# Database (delegano a @pokechess/api)
npm run db:generate          # prisma generate
npm run db:migrate           # prisma migrate dev   (dev, interattivo)
npm run db:deploy            # prisma migrate deploy (prod/CI, non interattivo)
npm run db:seed              # popola catalogo creature
npm run db:reset             # drop + migrate + seed ⚠️ SOLO dev
npm run db:studio            # Prisma Studio

# Aggregati
npm run build                # build di tutti i workspace (--if-present)
npm run typecheck            # typecheck di tutti i workspace
```

---

## 6 · Stato attuale (cosa è fatto, cosa no)

### Player (`apps/player`) — completato lato UI

- 5 pagine complete: Home, **Board (priorità)**, Shop, League, Friends
- AppShell mobile (GameHeader fisso + BottomNav)
- Board: tabs Scacchiera/Collezione, **Prima Linea 3×2 grid** (no scroll orizzontale), Configurazione (3 card), Collezione grid
- Design system scuro con accenti oro/cremisi
- Sistema asset `SpriteRef` (image / spritesheet / fallback) in `src/assets/`
- Dati ancora da **mock locale** in `src/data/` — non ancora collegato all'API

### API (`apps/api`) — completata per lo scope core

Modelli Prisma: `User`, `Creature`, `UserCreature`, `TeamSlot`, `Config`.

Endpoint operativi:

| Metodo | Path | Note |
|---|---|---|
| GET | `/health` | liveness |
| POST | `/auth/register` | `{ email, username, password }` |
| POST | `/auth/login` | accetta email **o** username |
| GET | `/auth/me` | Bearer |
| GET | `/user/profile` | Bearer |
| PATCH | `/user/profile` | Bearer — aggiorna `username` / `email` |
| GET | `/user/creatures` | Bearer — inventario (solo possedute) |
| GET | `/creatures` | Bearer — catalogo completo |
| GET | `/creatures/:id` | Bearer — id **o** slug |
| GET | `/team` | Bearer — 6 slot |
| POST | `/team/update` | Bearer — solo slot, body `{ slots: [...] }` |
| GET | `/board-config` | Bearer |
| POST | `/board-config/update` | Bearer — `supportId` / `trainerId` / `backgroundId` |
| **GET** | **`/app/bootstrap`** | **Bearer — aggregato one-shot** |
| POST | `/dev/grant-creatures` | Bearer — **dev-only** (404 in prod) |

`GET /app/bootstrap` ritorna:

```json
{
  "profile":     { "id", "username", "email", "level", "exp", "expToNext", "wallet": { "gold", "gems" }, "createdAt" },
  "creatures":   [ /* INTERO catalogo mergiato con inventario utente; ogni creatura ha level/progress/owned */ ],
  "team":        { "slots": [ { "index", "creatureId", "creatureSlug", "moveId" } ] },
  "boardConfig": { "supportId", "trainerId", "backgroundId" }
}
```

### Admin (`apps/admin`) — scaffold

Dashboard desktop con sidebar + topbar + pagine placeholder. **Non implementato**. Da fare solo quando richiesto esplicitamente.

### Prossimi passi logici (in ordine)

1. **Deploy API** sul server self-hosted (systemd unit + nginx reverse proxy — guida completa in `apps/api/README.md §4`).
2. **Wiring Player → API reale**: creare un `apps/player/src/lib/api.ts`, env var `VITE_API_BASE_URL`, `authStore` con JWT, chiamata `/app/bootstrap` al login, rimpiazzare gradualmente i mock in `src/data/` con i dati veri.
3. Onboarding utente (starter creatures) o promozione del `/dev/grant-creatures` a un flow di gioco reale.
4. Admin Backoffice (quando serve).

---

## 7 · Deployment production (API)

Dettaglio completo in `apps/api/README.md §4`. Idea in 4 punti:

1. Build locale o sul server: `npm ci && npm run db:generate && npm run build:api`
2. Applica migrazioni: `npm run db:deploy` (+ `npm run db:seed` solo la prima volta)
3. Systemd unit (`pokechess-api.service`) che lancia `node dist/index.js` con `EnvironmentFile=…/.env` e `NODE_ENV=production`
4. Nginx reverse proxy su `api.tuo-dominio.it` → `127.0.0.1:4000` con TLS Let's Encrypt; nel `.env` imposta `TRUST_PROXY=true` e `CORS_ORIGINS=https://play.tuo-dominio.it`

---

## 8 · Regole / vincoli (non violare)

- **Niente Docker per Postgres**. L'utente ha PostgreSQL nativo sul suo server.
- **Niente over-engineering sul backend**: `/app/bootstrap` + i 5 moduli core sono tutto quello che serve adesso.
- **Fuori scope** (non implementare senza richiesta esplicita):
  - Refresh token / email verification / password reset
  - Rate limiting / helmet / audit log
  - Admin CRUD
  - Moduli Shop / League / Friends sul backend
  - Economy (purchase, drop tables)
  - Realtime, async match
- **Dev endpoints** (`/dev/*`) sono montati **solo** se `NODE_ENV !== 'production'`.
- **Separazione dei concern**: `/team/update` gestisce **solo** gli slot. Support / trainer / background passano da `/board-config/update`.
- **Design system**: Player e Admin hanno **due design system diversi** per scelta. Nessun token condiviso.
- **Mobile-first Player**: portrait, `max-w ~420px`, touch-friendly. Desktop è secondario.

---

## 9 · Convenzioni codice

- **TypeScript strict** in tutti i workspace
- Commenti in inglese nel codice, chat/README in italiano
- **Niente comenti didascalici** ("increment counter") — solo intent / trade-off
- Componenti React: functional + hooks, niente class components
- API: pattern `schemas.ts` (zod) + `service.ts` (Prisma + logic) + `controller.ts` (Express) + `router.ts`
- Validazione body: `validateBody(schema)` middleware — rimpiazza `req.body` con il payload parsato
- Errori API: `HttpError.xxx()` + `asyncHandler` → middleware `errorHandler` (`errors.ts`, `errorHandler.ts`)
- Nomi route: kebab-case (`/board-config`, `/grant-creatures`)

---

## 10 · Troubleshooting rapido

| Sintomo | Causa probabile | Fix |
|---|---|---|
| `EPERM ... query_engine-windows.dll.node.tmp` su Windows durante `build:api` | Prisma engine lockato | Chiudi processi Node; `build:api` **non** chiama più `prisma generate` — usa `npm run db:generate` separato |
| `error TS2307: Cannot find module 'node:path'` | Manca `@types/node` | `npm install` di nuovo; controlla `tsconfig.node.json` |
| API parte, ma `DATABASE_URL is required` | `.env` non creato nella directory giusta | `cp apps/api/.env.example apps/api/.env` **dentro apps/api/** |
| CORS blocca il Player in prod | `CORS_ORIGINS` non include il dominio del Player | Aggiungilo nel `.env` (CSV) |
| `/team/update` risponde 403 "Cannot place unowned creatures" | L'utente non possiede quelle creature | Dev: `POST /dev/grant-creatures` con body `{}` |
| IP sbagliati nei log dietro nginx | `TRUST_PROXY=0` | Metti `TRUST_PROXY=true` nel `.env` di prod |
| Prisma client non trovato | Postinstall non ha girato | `npm run db:generate` |

---

## 11 · File da leggere per primi

Se hai una nuova sessione agent su questo repo, leggi in quest'ordine:

1. `CONTEXT.md` (questo file)
2. `README.md` root — overview + script
3. `apps/api/README.md` — setup DB, env, deployment, smoke test end-to-end
4. `apps/api/prisma/schema.prisma` — modello dati
5. `apps/api/src/app.ts` — wiring di tutti i router
6. `apps/player/src/pages/Board.tsx` — pagina-template per capire layering Player

---

## 12 · Autore / contatto

Repo di **Deku**. Lingua di conversazione: italiano. Backend parla inglese nei commenti/errori.
