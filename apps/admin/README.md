# @pokechess/admin — Admin Backoffice

App web **separata** dal Player Game App, pensata per la gestione dei contenuti e degli asset di PokeChess.

> Stato attuale: **scaffold**. Layout desktop (sidebar + topbar), router con tutte le rotte dei moduli previste, ciascuna renderizza un placeholder. Nessun modulo CRUD è ancora implementato — la priorità è il Player App.

## Stack

- React 18 + TypeScript + Vite (stesso del Player App per coerenza)
- Tailwind CSS con un **design system indipendente** (palette chiara, tabelle dense, tipografia da data-UI)
- react-router-dom

## Dev

```bash
npm run dev:admin
# → http://localhost:5174
```

Port `5174` (il Player gira su `5173`) — puoi tenere entrambi aperti.

## Struttura

```
apps/admin/src/
├─ App.tsx                         # router
├─ main.tsx
├─ layout/
│  ├─ AdminShell.tsx               # frame desktop: sidebar + topbar + content
│  ├─ AdminSidebar.tsx             # navigazione raggruppata per dominio
│  └─ AdminTopBar.tsx              # placeholder per breadcrumbs / search
├─ pages/
│  ├─ DashboardPage.tsx            # landing con card dei moduli
│  └─ ModulePlaceholderPage.tsx    # usata da tutte le rotte /<slug> finché non costruite
├─ lib/
│  └─ modules.ts                   # catalogo: slug, label, gruppo, descrizione
└─ styles/
   └─ index.css
```

## Moduli previsti (roadmap CRUD)

Elenco canonico — vedi `src/lib/modules.ts`:

### Contenuti

- [ ] **Creature** — anagrafica, tipo, rarità, statistiche, sprite reference
- [ ] **Trainer** — avatar selezionabili dai giocatori
- [ ] **Sfondi** — background di battaglia
- [ ] **Mosse** — pattern standard (orizzontale, verticale, diagonale, L-shape, salto, proiezione)
- [ ] **Mosse Speciali** — abilità attive con cooldown / cost
- [ ] **Abilità** — tratti passivi

### Economia

- [ ] **Bauli** — tier, drop table, costi (gemme / gratis)
- [ ] **Ricompense** — giornaliere, baule vittoria, eventi

### Progressione

- [ ] **Progressione** — regole di sblocco, curve EXP, stagioni
- [ ] **Leader Palestra** — roster e difficoltà

### Live Ops

- [ ] **Squadre NPC** — composizioni IA per allenamento
- [ ] **Trainer Eventi** — NPC a tema per tornei live (es. Torneo del Fuoco)
- [ ] **Sfide Asincrone** — contenuti dedicati al matchmaking asincrono

### Asset

- [ ] **Asset** — upload di immagini / spritesheet e binding a `SpriteRef.key`

## Pattern previsto per ogni modulo

Ogni pagina `/<slug>` seguirà questo schema:

1. **Header**: titolo + CTA "Nuovo"
2. **Filtri**: tipo, rarità, stato, ricerca testuale
3. **Tabella paginata**: colonne rilevanti + azioni per riga (Modifica / Elimina)
4. **Drawer / Modal** per create/edit con form validato
5. **Preview sprite** accanto al form quando applicabile (il campo `key` punta al registry condiviso)

## Relazione con il Player App

Oggi il Player usa dati mock locali (`apps/player/src/data/*`). In futuro:

- il Player leggerà da un backend
- l'Admin scriverà sullo **stesso** backend
- i tipi di dominio andranno estratti in `packages/shared` per garantire coerenza

La separazione è già rispettata: il Player **non** importa nulla da `apps/admin`.
