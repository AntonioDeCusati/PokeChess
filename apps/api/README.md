# @pokechess/api

Backend del Player Game App. Pensato per essere **deploiato su server self-hosted** con PostgreSQL nativo.

> Scope intenzionalmente stretto: solo i 5 modelli e gli endpoint strettamente necessari perché il Player App sia usabile con dati reali. Niente admin, niente eventi, niente economy avanzata, niente realtime.

## Stack

- Express 4 + TypeScript (ESM)
- Prisma 5 + PostgreSQL 14+ (self-hosted)
- bcryptjs, jsonwebtoken, zod
- tsx (dev runner)

## Modelli (Prisma)

- `User` — account + wallet + progressione
- `Creature` — catalogo (seed)
- `UserCreature` — inventario del giocatore (level, progress, owned)
- `TeamSlot` — 6 slot della Prima Linea
- `Config` — Support / Trainer / Background scelti

## Endpoint

Tutti gli endpoint "Bearer" richiedono l'header `Authorization: Bearer <token>`.

| Metodo | Path | Auth | Descrizione |
|---|---|---|---|
| GET  | `/health`                 | —      | Readiness probe |
| POST | `/auth/register`          | —      | Crea account, restituisce `{ token, user }` |
| POST | `/auth/login`             | —      | Login con email **o** username, restituisce `{ token, user }` |
| GET  | `/auth/me`                | Bearer | Utente della sessione |
| GET  | `/user/profile`           | Bearer | Profilo completo (header + stats) |
| PATCH| `/user/profile`           | Bearer | Aggiorna `username` e/o `email` (parziale, unicità garantita) |
| GET  | `/user/creatures`         | Bearer | Inventario — solo le creature effettivamente possedute |
| GET  | `/creatures`              | Bearer | Catalogo completo |
| GET  | `/creatures/:id`          | Bearer | Catalogo single-item (accetta `id` o `slug`) |
| GET  | `/team`                   | Bearer | 6 slot della prima linea |
| POST | `/team/update`            | Bearer | Aggiorna gli slot (parziale o completo) |
| GET  | `/board-config`           | Bearer | Selezione support / trainer / background |
| POST | `/board-config/update`    | Bearer | Aggiorna i 3 campi (parziale, `null` = clear) |
| GET  | `/app/bootstrap`          | Bearer | **Aggregato one-shot**: profile + creatures + team + boardConfig |
| POST | `/dev/grant-creatures`    | Bearer | **dev-only**, montato solo se `NODE_ENV !== 'production'` |

JWT firmato con `JWT_SECRET`, scadenza `JWT_EXPIRES_IN` (default `7d`).

### Shape di `GET /app/bootstrap`

L'endpoint che il client chiama una volta dopo il login per popolare tutto lo stato iniziale:

```json
{
  "profile":  { "id": "...", "username": "...", "email": "...", "level": 1, "exp": 0, "expToNext": 100, "wallet": { "gold": 0, "gems": 0 }, "createdAt": "..." },
  "creatures": [
    { "id": "...", "slug": "flarepup", "name": "Flarepup", "type": "fire", "rarity": "common",
      "sprite": { "key": "creature-flarepup", "type": "image", "fallbackColor": "#f97316", "fallbackLabel": "F" },
      "defaultProgressMax": 10, "level": 3, "progressCurrent": 2, "progressMax": 10, "owned": true },
    { "id": "...", "slug": "gravel", ..., "level": 0, "progressCurrent": 0, "progressMax": 10, "owned": false }
  ],
  "team": { "slots": [ { "index": 1, "creatureId": "...", "creatureSlug": "flarepup", "moveId": "horizontal" }, ... ] },
  "boardConfig": { "supportId": "support-umbril", "trainerId": "trainer-deku", "backgroundId": "bg-meadow" }
}
```

`creatures` è **l'intero catalogo mergiato con l'inventario dell'utente**: ogni creatura compare sempre, `owned: false` per quelle non ancora possedute. Questo serve al grid Collezione a renderizzare anche le "locked".

---

## 1 · Requisiti PostgreSQL (self-hosted)

Il backend presume un PostgreSQL nativo installato sul server. Niente Docker, niente Neon/Supabase, niente provider gestito.

### Prerequisiti minimi

| Requisito | Valore |
|---|---|
| Versione | **PostgreSQL 14+** (testato su 14/15/16) |
| Database dedicato | `pokechess` |
| Utente applicativo dedicato | `pokechess` (password robusta) |
| Schema | `public` (default) |
| Collation/encoding | `UTF8` |
| Accesso | loopback (`127.0.0.1`) oppure LAN privata |
| SSL | obbligatorio se API e DB su host diversi su rete non fidata |

### Setup del database (una tantum, come superuser)

```bash
sudo -u postgres psql
```

```sql
CREATE USER pokechess WITH
  LOGIN
  PASSWORD 'CAMBIAMI_con_una_password_robusta'
  NOSUPERUSER
  NOCREATEROLE
  NOCREATEDB;

CREATE DATABASE pokechess
  WITH OWNER = pokechess
       ENCODING = 'UTF8'
       TEMPLATE = template0;

GRANT ALL PRIVILEGES ON DATABASE pokechess TO pokechess;
```

### `pg_hba.conf` — regole di connessione

Stesso host: basta la regola di default loopback (`host all all 127.0.0.1/32 scram-sha-256`).

Host distinti (esempio rete privata `10.0.0.0/24`):

```conf
# TYPE  DATABASE    USER       ADDRESS          METHOD
host    pokechess   pokechess  10.0.0.0/24      scram-sha-256
```

In `postgresql.conf`:

```conf
listen_addresses = 'localhost, 10.0.0.1'   # IP privato, non esporre a internet
```

Reload: `sudo systemctl reload postgresql`.

### TLS

Se il DB non è su loopback, abilita TLS sul server Postgres (`ssl = on`, `ssl_cert_file`, `ssl_key_file`) e aggiungi `?sslmode=require` alla `DATABASE_URL`.

### Verifica connettività

```bash
psql "postgresql://pokechess:<password>@127.0.0.1:5432/pokechess" -c "SELECT version();"
```

---

## 2 · Environment variables

L'API legge tutto da un `.env` in `apps/api/`. Template completo: `apps/api/.env.example`.

```bash
cp apps/api/.env.example apps/api/.env
```

| Variabile | Required | Default | Note |
|---|---|---|---|
| `PORT` | no | `4000` | Porta HTTP |
| `NODE_ENV` | no | `development` | `production` **disabilita** `/dev/*` |
| `CORS_ORIGINS` | no | `http://localhost:5173` | CSV di origin ammessi |
| `TRUST_PROXY` | no | `0` | `true` / `1` / `N hops` / CIDR per funzionare dietro nginx |
| `DATABASE_URL` | **sì** | — | Connection string Postgres |
| `JWT_SECRET` | **sì** | — | Almeno 16 caratteri |
| `JWT_EXPIRES_IN` | no | `7d` | Formato `jsonwebtoken` |

Generare `JWT_SECRET`:

```bash
openssl rand -hex 48
# oppure
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Caratteri speciali nella password vanno **percent-encoded**.

---

## 3 · Sequenza bootstrap

Tutti i comandi dalla root del monorepo.

### 3.1 Install + generate client

```bash
npm install
npm run db:generate
```

### 3.2 Prima migrazione + seed (development)

```bash
npm run db:migrate -- --name init
npm run db:seed
```

Opzionale, per vedere i dati:

```bash
npm run db:studio
# → http://localhost:5555
```

### 3.3 Deploy su un ambiente già migrato (production)

Sul server, **solo applicare** le migrazioni già presenti nel repo:

```bash
npm run db:deploy
```

`db:deploy` applica le migrazioni pendenti senza prompt e senza modificare i file di migrazione: è il comando corretto per CI e per il boot di produzione.

Per popolare il catalogo la prima volta anche in produzione:

```bash
npm run db:seed
```

### 3.4 Reset totale (⚠️ solo dev)

```bash
npm run db:reset
# drop + migrate + seed
```

### 3.5 Avviare l'API

Dev (watch):

```bash
npm run dev:api
# → http://localhost:4000
```

Production:

```bash
npm run build:api
NODE_ENV=production npm run start:api
```

---

## 4 · Deployment su server self-hosted

### 4.1 Layout consigliato sul server

```
/opt/pokechess/
├─ app/                   # clone del monorepo o solo apps/api builddato
│  ├─ apps/api/
│  │  ├─ dist/            # output di `npm run build:api`
│  │  ├─ prisma/          # schema + migrations
│  │  ├─ node_modules/
│  │  ├─ package.json
│  │  └─ .env             # **non** committato, permessi 600
│  └─ node_modules/       # (se installi dalla root del monorepo)
└─ logs/
```

Permessi del file `.env`:

```bash
chmod 600 /opt/pokechess/app/apps/api/.env
chown pokechess:pokechess /opt/pokechess/app/apps/api/.env
```

### 4.2 Flusso di deploy raccomandato

Dal tuo host di build (o direttamente sul server):

```bash
git pull
npm ci                               # reinstalla in modo riproducibile
npm run db:generate                  # rigenera Prisma client
npm run build:api                    # compila TypeScript → dist/
npm run db:deploy                    # applica migrazioni pendenti
# (prima volta sul server:)  npm run db:seed
sudo systemctl restart pokechess-api # vedi systemd unit sotto
```

### 4.3 Systemd service (esempio)

`/etc/systemd/system/pokechess-api.service`:

```ini
[Unit]
Description=PokeChess API
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=pokechess
WorkingDirectory=/opt/pokechess/app/apps/api
EnvironmentFile=/opt/pokechess/app/apps/api/.env
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=3

# Hardening minimo
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/pokechess/logs
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Abilitare e avviare:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now pokechess-api
sudo journalctl -u pokechess-api -f
```

### 4.4 Nginx reverse proxy (esempio)

`/etc/nginx/sites-available/pokechess-api`:

```nginx
server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate     /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    client_max_body_size 2m;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;

        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Con questa configurazione, nel `.env` imposta `TRUST_PROXY=true` così Express riconoscerà correttamente IP e schema della richiesta reale.

`CORS_ORIGINS` in produzione deve puntare al dominio del Player App (es. `https://play.example.com`), non a localhost.

---

## 5 · Test flow con dati reali

Finché non esiste un vero modulo "acquisisci creatura" (fuori scope), serve un modo rapido per assegnare creature a un utente affinché `POST /team/update` possa validare l'ownership. Per questo esiste un endpoint **dev-only**:

### `POST /dev/grant-creatures`

- Attivo solo se `NODE_ENV !== 'production'`. In produzione il route non viene nemmeno montato (404).
- Richiede Bearer token (opera sull'utente autenticato).
- Idempotente (`upsert` su `(userId, creatureId)` con `owned = true`).
- Body opzionale:

```json
{
  "slugs": ["flarepup", "voidbat"],
  "level": 10,
  "progressCurrent": 5
}
```

Se `slugs` è omesso, garantisce l'**intero** catalogo.

All'avvio l'API logga un warning esplicito quando i route dev sono montati:

```
[api] dev-only routes enabled at /dev (NODE_ENV=development). Do NOT deploy with this flag.
```

### Smoke test end-to-end (PowerShell)

```powershell
$base = "http://localhost:4000"

# 1. Register
$r = irm "$base/auth/register" -Method POST -ContentType "application/json" `
     -Body (@{ email="a@b.it"; username="deku"; password="testtest" } | ConvertTo-Json)
$token = $r.token
$h = @{ Authorization = "Bearer $token" }

# 2. Sanity check
irm "$base/auth/me"      -Headers $h
irm "$base/user/profile" -Headers $h
irm "$base/creatures"    -Headers $h

# 3. DEV: concedi tutto il catalogo
irm "$base/dev/grant-creatures" -Method POST -Headers $h -ContentType "application/json" -Body "{}"

# 4. Team (6 slot — stessi del mockup)
$body = @{
  slots = @(
    @{ index=1; creatureSlug="flarepup";  moveId="horizontal" },
    @{ index=2; creatureSlug="voidbat";   moveId="vertical"   },
    @{ index=3; creatureSlug="leafling";  moveId="diagonal"   },
    @{ index=4; creatureSlug="bubblet";   moveId="l-shape"    },
    @{ index=5; creatureSlug="sparkit";   moveId="jump"       },
    @{ index=6; creatureSlug="blushling"; moveId="projection" }
  )
} | ConvertTo-Json -Depth 5
irm "$base/team/update" -Method POST -Headers $h -ContentType "application/json" -Body $body

# 5. Board config (support / trainer / background)
$cfg = @{ supportId="support-umbril"; trainerId="trainer-deku"; backgroundId="bg-meadow" } | ConvertTo-Json
irm "$base/board-config/update" -Method POST -Headers $h -ContentType "application/json" -Body $cfg

# 6. Aggregate bootstrap (quello che il client userà all'avvio)
irm "$base/app/bootstrap" -Headers $h
```

Equivalente `curl`:

```bash
BASE=http://localhost:4000

TOKEN=$(curl -s -X POST "$BASE/auth/register" \
  -H 'content-type: application/json' \
  -d '{"email":"a@b.it","username":"deku","password":"testtest"}' \
  | jq -r .token)

curl -s -X POST "$BASE/dev/grant-creatures" \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' -d '{}' | jq

curl -s -X POST "$BASE/team/update" \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{ "slots": [
    {"index":1,"creatureSlug":"flarepup","moveId":"horizontal"},
    {"index":2,"creatureSlug":"voidbat","moveId":"vertical"},
    {"index":3,"creatureSlug":"leafling","moveId":"diagonal"},
    {"index":4,"creatureSlug":"bubblet","moveId":"l-shape"},
    {"index":5,"creatureSlug":"sparkit","moveId":"jump"},
    {"index":6,"creatureSlug":"blushling","moveId":"projection"}
  ] }' | jq

curl -s -X POST "$BASE/board-config/update" \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"supportId":"support-umbril","trainerId":"trainer-deku","backgroundId":"bg-meadow"}' | jq

curl -s "$BASE/app/bootstrap" -H "authorization: Bearer $TOKEN" | jq
```

---

## Script disponibili

Tutti i comandi sono esposti alla root del monorepo.

```bash
# Runtime
npm run dev:api            # tsx watch
npm run build:api          # tsc → dist
npm run start:api          # node dist/index.js (production)

# Database
npm run db:generate        # prisma generate
npm run db:migrate         # prisma migrate dev (prima volta: -- --name init)
npm run db:deploy          # applica migrazioni pendenti (production / CI)
npm run db:seed            # popola il catalogo creature
npm run db:reset           # drop + migrate + seed (⚠️ solo dev)
npm run db:studio          # UI Prisma Studio
```

---

## Regole / vincoli

- **Password**: bcryptjs, 10 round. L'hash non esce mai dal service layer.
- **Ownership**: `POST /team/update` rifiuta creature non possedute dall'utente (`UserCreature.owned = true`).
- **Unicità team**: la stessa creatura non può occupare 2 slot diversi (controllo su stato merged, non solo incoming).
- **MoveId**: enum stretto (`horizontal | vertical | diagonal | l-shape | jump | projection`).
- **Board config**: `supportId / trainerId / backgroundId` sono stringhe che puntano ai cataloghi statici lato client. Nessuna tabella dedicata finché non serve.
- **Separazione dei concern**: `/team/update` manipola **solo** gli slot. Support / trainer / background passano da `/board-config/update`.
- **Dev endpoints**: montati solo se `NODE_ENV !== 'production'`. In produzione il route non esiste.
- **Reverse proxy**: `TRUST_PROXY` va impostato a `true` (o al numero di hops) quando dietro nginx/Caddy.

---

## Struttura

```
apps/api/
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seed.ts
├─ src/
│  ├─ index.ts                    # bootstrap + graceful shutdown
│  ├─ app.ts                      # express app + routing + /dev condizionale
│  ├─ env.ts                      # zod-validated env + resolveTrustProxy
│  ├─ db.ts                       # singleton Prisma client
│  ├─ http/
│  │  ├─ errors.ts                # HttpError + asyncHandler
│  │  ├─ errorHandler.ts          # terminal error middleware
│  │  └─ validate.ts              # zod body validator middleware
│  ├─ auth/                       # register / login / me
│  ├─ user/                       # profile (GET/PATCH) + creatures (inventory)
│  ├─ creature/                   # catalog list + get by id-or-slug
│  ├─ team/                       # get / update (solo slot)
│  ├─ board-config/               # get / update (support, trainer, background)
│  ├─ app-bootstrap/              # GET /app/bootstrap (aggregato)
│  └─ dev/                        # 🔧 dev-only helpers
├─ .env.example
├─ package.json
└─ tsconfig.json
```

---

## Out of scope (esplicito)

Non implementati, e non vanno implementati finché non richiesti:

- Refresh token, rotazione, blacklist
- Email verification / password reset / cambio password
- Rate limiting / audit log / helmet
- Admin endpoints
- Moduli Shop / League / Friends
- Economy (purchase, drop tables, currency transactions)
- Async match / realtime
- Inventory flow "vero" (il `/dev/grant-creatures` è **temporaneo**)
