#!/bin/bash

# ============================================================
# HRIS System - VPS Deployment Script
# Server: 187.124.112.86
# Usage: bash deploy.sh
# ============================================================

set -e

APP_DIR="/var/www/hris"
REPO="https://github.com/AYHHamsuky/HRIS_system.git"
DB_NAME="hris"
DB_USER="hris_user"
DB_PASS="itapps@001"

echo "=============================="
echo " HRIS Deployment Starting..."
echo "=============================="

# ---- 1. System packages ----
echo "[1/11] Installing system packages..."
apt update -y && apt upgrade -y
apt install -y \
  php8.2 php8.2-cli php8.2-fpm php8.2-mbstring php8.2-xml \
  php8.2-curl php8.2-zip php8.2-bcmath php8.2-mysql php8.2-gd \
  php8.2-intl php8.2-sqlite3 php8.2-redis \
  unzip git nginx mysql-server curl

# ---- 2. Composer ----
echo "[2/11] Installing Composer..."
if ! command -v composer &>/dev/null; then
  curl -sS https://getcomposer.org/installer | php
  mv composer.phar /usr/local/bin/composer
fi

# ---- 3. Node.js ----
echo "[3/11] Installing Node.js..."
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi

# ---- 4. Fix MySQL root auth & create DB/user ----
echo "[4/11] Configuring MySQL..."
# Ubuntu 24.04: root uses auth_socket plugin — must connect via socket (no password)
mysql --user=root --socket=/var/run/mysqld/mysqld.sock <<SQL
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASS}';
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL

# ---- 5. Clone or pull repo ----
echo "[5/11] Cloning/updating repository..."
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
  git pull origin main
else
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

cd "$APP_DIR"

# ---- 6. PHP dependencies ----
echo "[6/11] Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# ---- 7. Node dependencies & build ----
echo "[7/11] Installing Node dependencies & building assets..."
npm ci
npm run build

# ---- 8. Environment setup ----
echo "[8/11] Setting up environment..."
if [ ! -f "$APP_DIR/.env" ]; then
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
fi

# Write production .env values
cat > "$APP_DIR/.env" <<ENV
APP_NAME="Kaduna Electric HRIS"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://187.124.112.86

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=${DB_NAME}
DB_USERNAME=${DB_USER}
DB_PASSWORD=${DB_PASS}

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database

MAIL_MAILER=smtp
MAIL_SCHEME=smtps
MAIL_HOST=server.kadunaelectric.com
MAIL_PORT=465
MAIL_USERNAME=erp@kadunaelectric.com
MAIL_PASSWORD=",Se.R\$OA0])z"
MAIL_FROM_ADDRESS="erp@kadunaelectric.com"
MAIL_FROM_NAME="Kaduna Electric ERP"

PERFORMANCE_MAIL_FROM="performance@kadunaelectric.com"
LEAVE_MAIL_FROM="hr@kadunaelectric.com"

SCOUT_DRIVER=database

VITE_APP_NAME="Kaduna Electric HRIS"
ENV

php artisan key:generate --force

# ---- 9. Database migration ----
echo "[9/11] Running migrations..."
php artisan migrate --force
php artisan db:seed --force || true

# ---- 10. File permissions ----
echo "[10/11] Setting permissions..."
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"
chmod -R 775 "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"
php artisan storage:link || true

# ---- 11. Optimize ----
echo "[11/11] Caching config, routes, views..."
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
systemctl enable nginx php8.2-fpm
systemctl start php8.2-fpm

echo ""
echo "=============================="
echo " Deployment Complete!"
echo " Visit: http://187.124.112.86"
echo "=============================="
