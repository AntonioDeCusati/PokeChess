################################################################################
# PokeChess – Build & Deploy
# Usage:  .\deploy.ps1                  (build + deploy tutto)
#         .\deploy.ps1 -SkipBuild       (solo upload)
#         .\deploy.ps1 -SkipDeploy      (solo build, no upload)
#         .\deploy.ps1 -BuildOnly api    (solo backend)
#         .\deploy.ps1 -BuildOnly player (solo frontend/APK)
################################################################################

param(
    [switch]$SkipBuild,
    [switch]$SkipDeploy,
    [string]$BuildOnly  # "api" | "player" | vuoto = entrambi
)

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

# ─── Configurazione server ────────────────────────────────────────────────────
# Modifica questi valori con i dati del tuo server Ubuntu
$REMOTE_USER   = "root"          # es: "pokechess" o "root"
$REMOTE_HOST   = "89.46.196.235"          # es: "123.45.67.89" o "mioserver.it"
$REMOTE_PATH   = "/var/www/backend/pokechess_hybrid"    # cartella remota dove caricare
$SSH_KEY_PATH  = "$HOME\.ssh\id_ed25519" # percorso chiave SSH privata
$SSH_PORT      = 22

# ─── Colori output ────────────────────────────────────────────────────────────
function Write-Step($msg)    { Write-Host "`n>> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)      { Write-Host "   OK: $msg" -ForegroundColor Green }
function Write-Err($msg)     { Write-Host "   ERRORE: $msg" -ForegroundColor Red }
function Write-Warn($msg)    { Write-Host "   WARN: $msg" -ForegroundColor Yellow }

# ─── Controllo configurazione ─────────────────────────────────────────────────
function Test-Config {
    if ($REMOTE_USER -eq "CAMBIAMI" -or $REMOTE_HOST -eq "CAMBIAMI") {
        Write-Err "Devi configurare REMOTE_USER e REMOTE_HOST in deploy.ps1"
        Write-Host ""
        Write-Host "   Apri deploy.ps1 e modifica le variabili:" -ForegroundColor White
        Write-Host '   $REMOTE_USER = "tuo_utente"'
        Write-Host '   $REMOTE_HOST = "tuo_ip_o_dominio"'
        Write-Host '   $REMOTE_PATH = "/percorso/remoto"'
        Write-Host ""
        Write-Host "   Per usare le chiavi SSH (consigliato):" -ForegroundColor White
        Write-Host "   1. ssh-keygen -t ed25519 (se non hai gia' una chiave)"
        Write-Host "   2. ssh-copy-id utente@server"
        Write-Host ""
        exit 1
    }

    if (-not (Test-Path $SSH_KEY_PATH)) {
        Write-Warn "Chiave SSH non trovata in $SSH_KEY_PATH"
        Write-Host "   Il deploy usera' la password interattiva." -ForegroundColor Yellow
        Write-Host "   Per evitarlo: ssh-keygen -t ed25519" -ForegroundColor Yellow
    }
}

# ─── Build Backend ─────────────────────────────────────────────────────────────
function Build-Api {
    Write-Step "Build Backend (API)..."

    Push-Location "$ROOT\apps\api"
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "Build API fallita" }
        Write-Ok "Backend compilato in apps/api/dist/"
    } finally {
        Pop-Location
    }
}

# ─── Build Frontend + Capacitor ────────────────────────────────────────────────
function Build-Player {
    Write-Step "Build Frontend (Player)..."

    Push-Location "$ROOT\apps\player"
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "Build Player fallita" }
        Write-Ok "Frontend compilato in apps/player/dist/"

        Write-Step "Sync Capacitor..."
        npx cap sync
        if ($LASTEXITCODE -ne 0) { throw "Cap sync fallito" }
        Write-Ok "Piattaforme native sincronizzate"
    } finally {
        Pop-Location
    }
}

# ─── Deploy via SCP/rsync ─────────────────────────────────────────────────────
function Deploy-ToServer {
    Test-Config

    $target = "${REMOTE_USER}@${REMOTE_HOST}"
    $keyArg = ""
    if (Test-Path $SSH_KEY_PATH) {
        $keyArg = "-i `"$SSH_KEY_PATH`""
    }

    Write-Step "Deploy su $target`:$REMOTE_PATH ..."
    Write-Host "   Usando scp..." -ForegroundColor Gray

    # Crea la struttura remota
    Invoke-Expression "ssh $keyArg -p $SSH_PORT -o StrictHostKeyChecking=accept-new $target `"mkdir -p $REMOTE_PATH/api/dist $REMOTE_PATH/api/prisma $REMOTE_PATH/player/dist`""

    # Backend: dist
    Invoke-Expression "scp -r -P $SSH_PORT $keyArg `"$ROOT\apps\api\dist`" `"${target}:${REMOTE_PATH}/api/`""

    # Backend: prisma
    Invoke-Expression "scp -r -P $SSH_PORT $keyArg `"$ROOT\apps\api\prisma`" `"${target}:${REMOTE_PATH}/api/`""

    # Backend: package.json
    Invoke-Expression "scp -P $SSH_PORT $keyArg `"$ROOT\apps\api\package.json`" `"${target}:${REMOTE_PATH}/api/`""

    # Frontend: dist
    Invoke-Expression "scp -r -P $SSH_PORT $keyArg `"$ROOT\apps\player\dist`" `"${target}:${REMOTE_PATH}/player/`""

    Write-Ok "Upload completato"

    # Installa dipendenze e riavvia il server remoto
    Write-Step "Installazione dipendenze e riavvio servizio sul server..."

    $remoteCmd = "cd $REMOTE_PATH/api && npm install --omit=dev && npx prisma generate && npx prisma db push --accept-data-loss 2>/dev/null; pm2 restart pokechess-api 2>/dev/null || pm2 start dist/index.js --name pokechess-api"

    Invoke-Expression "ssh $keyArg -p $SSH_PORT $target `"$remoteCmd`""
    Write-Ok "Deploy completato!"
}

# ─── Main ──────────────────────────────────────────────────────────────────────
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

Write-Host ""
Write-Host "============================================" -ForegroundColor Magenta
Write-Host "   PokeChess - Build and Deploy Pipeline"      -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta

if (-not $SkipBuild) {
    $buildApi    = ($BuildOnly -eq "" -or $BuildOnly -eq "api")
    $buildPlayer = ($BuildOnly -eq "" -or $BuildOnly -eq "player")

    if ($buildApi)    { Build-Api }
    if ($buildPlayer) { Build-Player }
} else {
    Write-Warn "Build skippata (-SkipBuild)"
}

if (-not $SkipDeploy) {
    Deploy-ToServer
} else {
    Write-Warn "Deploy skippato (-SkipDeploy)"
}

$stopwatch.Stop()
$elapsed = '{0:mm}:{0:ss}' -f $stopwatch.Elapsed

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "   Tutto completato in $elapsed"              -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
