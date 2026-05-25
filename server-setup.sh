#!/bin/bash
################################################################################
# PokeChess – Server Setup (Ubuntu)
# 
# Collegati al server con:   ssh root@89.46.196.235
# Poi lancia questo script:  bash server-setup.sh
#
# PRIMA di lanciarlo, modifica le variabili qui sotto!
################################################################################

set -e

# ─── CONFIGURA QUESTI VALORI ──────────────────────────────────────────────────
DB_USER="pokechess"
DB_PASS="mTpOC3yQPq7N6OtXgi2T"
DB_NAME="pokechess"
JWT_SECRET="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwODA3MTk5NSIsIm5hbWUiOiJBbnRvbmlvRGVDdXNhdGkiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyfQ.DMP1uHTgtK2eGsKOzDzy7onlSy3zRrzfN5j5yoMWal8"
APP_DIR="/var/www/backend/pokechess_hybrid"
API_PORT=4000
# ──────────────────────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

step() { echo -e "\n${CYAN}>> $1${NC}"; }
ok()   { echo -e "   ${GREEN}OK: $1${NC}"; }
err()  { echo -e "   ${RED}ERRORE: $1${NC}"; exit 1; }

if [ "$DB_PASS" = "CAMBIA_QUESTA_PASSWORD" ] || [ "$JWT_SECRET" = "CAMBIA_QUESTO_SEGRETO_LUNGO" ]; then
    err "Devi modificare DB_PASS e JWT_SECRET prima di lanciare lo script!
   Apri server-setup.sh e cambia le variabili in alto."
fi

echo ""
echo "============================================"
echo "   PokeChess – Server Setup"
echo "============================================"

# ─── 1. Node.js ───────────────────────────────────────────────────────────────
step "Verifica Node.js..."
if command -v node &> /dev/null; then
    NODE_VER=$(node -v)
    ok "Node.js $NODE_VER trovato"
else
    step "Installazione Node.js 22..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
    ok "Node.js $(node -v) installato"
fi

# ─── 2. PM2 ───────────────────────────────────────────────────────────────────
step "Installazione PM2..."
if command -v pm2 &> /dev/null; then
    ok "PM2 gia' installato"
else
    npm install -g pm2
    ok "PM2 installato"
fi

# Configura avvio automatico
pm2 startup systemd -u root --hp /root 2>/dev/null || true
ok "PM2 startup configurato"

# ─── 3. Nginx ─────────────────────────────────────────────────────────────────
step "Verifica Nginx..."
if command -v nginx &> /dev/null; then
    ok "Nginx gia' installato ($(nginx -v 2>&1))"
else
    step "Installazione Nginx..."
    apt update -y
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    ok "Nginx installato e avviato"
fi

# ─── 4. PostgreSQL ────────────────────────────────────────────────────────────
step "Verifica PostgreSQL..."
if command -v psql &> /dev/null; then
    ok "PostgreSQL gia' installato"
else
    step "Installazione PostgreSQL..."
    apt install -y postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
    ok "PostgreSQL installato"
fi

# Crea utente e database (ignora errori se esistono gia')
step "Configurazione database..."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || echo "   (utente gia' esistente)"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || echo "   (database gia' esistente)"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true
ok "Database '$DB_NAME' pronto per utente '$DB_USER'"

# ─── 5. Cartelle progetto ─────────────────────────────────────────────────────
step "Creazione cartelle..."
mkdir -p "$APP_DIR/api"
mkdir -p "$APP_DIR/player/dist"
mkdir -p "$APP_DIR/assets/sprite"
mkdir -p "$APP_DIR/assets/portrait"
mkdir -p "$APP_DIR/assets/trainer"
ok "Cartelle create in $APP_DIR"

# ─── 6. File .env ─────────────────────────────────────────────────────────────
step "Creazione file .env per l'API..."
ENV_FILE="$APP_DIR/api/.env"

if [ -f "$ENV_FILE" ]; then
    echo "   File .env gia' esistente, backup in .env.bak"
    cp "$ENV_FILE" "$ENV_FILE.bak"
fi

cat > "$ENV_FILE" <<EOF
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
JWT_SECRET="$JWT_SECRET"
NODE_ENV="production"
PORT=$API_PORT
EOF

chmod 600 "$ENV_FILE"
ok "File .env creato (permessi 600)"

# ─── 7. Nginx config ──────────────────────────────────────────────────────────
step "Configurazione Nginx..."

cat > /etc/nginx/sites-available/pokechess <<'NGINX'
server {
    listen 80;
    server_name _;

    client_max_body_size 10M;

    # Frontend (player app)
    location / {
        root /var/www/backend/pokechess_hybrid/player/dist;
        try_files $uri $uri/ /index.html;
    }

    # API backend (proxy)
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Assets statici (sprite, portrait, trainer)
    location /sprite/ {
        alias /var/www/backend/pokechess_hybrid/assets/sprite/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /portrait/ {
        alias /var/www/backend/pokechess_hybrid/assets/portrait/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /trainer/ {
        alias /var/www/backend/pokechess_hybrid/assets/trainer/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

ln -sf /etc/nginx/sites-available/pokechess /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
if [ $? -eq 0 ]; then
    systemctl reload nginx
    ok "Nginx configurato e ricaricato"
else
    err "Errore nella configurazione Nginx!"
fi

# ─── Riepilogo ─────────────────────────────────────────────────────────────────
echo ""
echo "============================================"
echo -e "   ${GREEN}Setup completato!${NC}"
echo "============================================"
echo ""
echo "   App dir:     $APP_DIR"
echo "   Database:    postgresql://$DB_USER:***@localhost:5432/$DB_NAME"
echo "   API port:    $API_PORT"
echo "   Nginx:       http://$(hostname -I | awk '{print $1}')"
echo ""
echo "   Prossimo passo:"
echo "   Torna su Windows e lancia:  .\\deploy.ps1"
echo ""
