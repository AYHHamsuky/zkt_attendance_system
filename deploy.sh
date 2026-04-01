#!/bin/bash

# ============================================================
# HRIS System - VPS Deployment Script
# Server: 187.124.112.86
# Usage: bash deploy.sh
# ============================================================

set -e

APP_DIR="/var/www/hris"
REPO="https://github.com/AYHHamsuky/HRIS_system.git"
PHP="php8.2"

echo "=============================="
echo " HRIS Deployment Starting..."
echo "=============================="

# ---- 1. System packages ----
echo "[1/10] Installing system packages..."
apt update -y && apt upgrade -y
apt install -y \
  php8.2 php8.2-cli php8.2-fpm php8.2-mbstring php8.2-xml \
  php8.2-curl php8.2-zip php8.2-bcmath php8.2-mysql php8.2-gd \
  php8.2-intl php8.2-sqlite3 php8.2-redis \
  unzip git nginx mysql-server curl

# ---- 2. Composer ----
echo "[2/10] Installing Composer..."
if ! command -v composer &>/dev/null; then
  curl -sS https://getcomposer.org/installer | php
  mv composer.phar /usr/local/bin/composer
fi

# ---- 3. Node.js ----
echo "[3/10] Installing Node.js..."
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi

# ---- 4. Clone or pull repo ----
echo "[4/10] Cloning/updating repository..."
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
  git pull origin main
else
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# ---- 5. PHP dependencies ----
echo "[5/10] Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# ---- 6. Node dependencies & build ----
echo "[6/10] Installing Node dependencies & building assets..."
npm ci
npm run build

# ---- 7. Environment setup ----
echo "[7/10] Setting up environment..."
if [ ! -f "$APP_DIR/.env" ]; then
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  php artisan key:generate
  echo ""
  echo "⚠️  .env file created. Edit it now: nano $APP_DIR/.env"
  echo "   Set DB_DATABASE, DB_USERNAME, DB_PASSWORD, APP_URL"
  echo "   Then re-run this script."
  exit 0
fi

# ---- 8. Database migration ----
echo "[8/10] Running migrations..."
php artisan migrate --force

# ---- 9. File permissions ----
echo "[9/10] Setting permissions..."
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"
chmod -R 775 "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"
php artisan storage:link || true

# ---- 10. Optimize ----
echo "[10/10] Caching config, routes, views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# ---- Nginx config ----
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/hris <<'NGINX'
server {
    listen 80;
    server_name 187.124.112.86;
    root /var/www/hris/public;
    index index.php;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/hris /etc/nginx/sites-enabled/hris
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
systemctl enable nginx
systemctl start php8.2-fpm
systemctl enable php8.2-fpm

echo ""
echo "=============================="
echo " Deployment Complete!"
echo " Visit: http://187.124.112.86"
echo "=============================="
