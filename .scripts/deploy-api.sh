#!/usr/bin/env bash
# =============================================================================
# Deploy script for the PokeChess API on a self-hosted Linux server.
#
# Idempotent: safe to re-run for every deploy. Fails fast on any error.
#
# Expected layout on the server (created during the FIRST install — see
# the README at the bottom of this file):
#   /opt/pokechess/app/                ← git repo (sparse-checkout: apps/api only)
#   /opt/pokechess/app/apps/api/.env   ← real secrets, chmod 600, owned by pokechess
#
# Usage on the server:
#   sudo -iu pokechess
#   cd /opt/pokechess/app
#   ./.scripts/deploy-api.sh
#
# What it does, in order:
#   1. git pull --ff-only           (no merge commits sneaked in by accident)
#   2. npm ci --omit=dev            (reproducible install, prod deps only)
#   3. npm run db:generate          (rebuild Prisma client for *this* OS)
#   4. npm run build:api            (TypeScript -> dist/)
#   5. npm run db:deploy            (apply pending migrations, no prompts)
#   6. systemctl restart pokechess-api  (only if the unit exists)
# =============================================================================

set -euo pipefail

# Move to repo root regardless of where the script is invoked from.
cd "$(dirname "$0")/.."

cyan()  { printf '\033[36m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
red()   { printf '\033[31m%s\033[0m\n' "$*" >&2; }

# --- 0. preconditions --------------------------------------------------------
[[ -d apps/api ]]            || { red "apps/api not found — wrong cwd?"; exit 1; }
[[ -f apps/api/.env ]]       || { red "apps/api/.env missing — create it first"; exit 1; }
command -v node >/dev/null   || { red "node not in PATH"; exit 1; }
command -v npm  >/dev/null   || { red "npm not in PATH";  exit 1; }

cyan "[1/6] git pull --ff-only origin main"
git pull --ff-only origin main

cyan "[2/6] npm ci --omit=dev"
npm ci --omit=dev

cyan "[3/6] npm run db:generate (Prisma client for this OS)"
npm run db:generate

cyan "[4/6] npm run build:api"
npm run build:api

cyan "[5/6] npm run db:deploy (apply pending migrations)"
npm run db:deploy

cyan "[6/6] restart systemd unit (if present)"
if systemctl list-unit-files | grep -q '^pokechess-api\.service'; then
  sudo systemctl restart pokechess-api
  sudo systemctl --no-pager --lines=10 status pokechess-api || true
else
  printf '  systemd unit not installed yet — skipping restart.\n'
  printf '  Start manually with:  NODE_ENV=production npm run start:api\n'
fi

green "DEPLOY DONE."
