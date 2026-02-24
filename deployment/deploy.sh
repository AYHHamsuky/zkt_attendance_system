#!/bin/bash
# =============================================================================
# ZKTeco Attendance System — Server Deployment Script
# =============================================================================
# Run this script on your on-premise server (Ubuntu/Debian) as root or sudo.
# Usage: sudo bash deploy.sh
# =============================================================================

set -e

# ===== Configuration =====
APP_DIR="/var/www/zkt-attendance"
REPO_URL=""  # Optional: set your git repo URL
DB_NAME="zkt_attendance"
DB_USER="zkt_user"
DB_PASS="$(openssl rand -base64 24)"
SERVER_IP=$(hostname -I | awk '{print $1}')

echo "============================================="
echo " ZKTeco Attendance System — Deployment"
echo "============================================="
echo " Server IP: $SERVER_IP"
echo " Install Dir: $APP_DIR"
echo "============================================="
echo ""

# ===== Step 1: System packages =====
echo "▸ [1/10] Installing system packages..."
apt-get update -qq
apt-get install -y -qq \
    nginx \
    php8.2-fpm php8.2-cli php8.2-common \
    php8.2-mysql php8.2-sqlite3 php8.2-mbstring php8.2-xml \
    php8.2-curl php8.2-zip php8.2-gd php8.2-bcmath \
    php8.2-intl php8.2-readline php8.2-sockets \
    mysql-server \
    supervisor \
    git \
    unzip \
    curl

# Check if php8.2 is not available, try php8.3
if ! command -v php8.2 &> /dev/null; then
    echo "  → PHP 8.2 not found, trying PHP 8.3..."
    apt-get install -y -qq \
        php8.3-fpm php8.3-cli php8.3-common \
        php8.3-mysql php8.3-sqlite3 php8.3-mbstring php8.3-xml \
        php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath \
        php8.3-intl php8.3-readline php8.3-sockets
fi

echo "  ✓ System packages installed"

# ===== Step 2: Install Composer =====
echo "▸ [2/10] Installing Composer..."
if ! command -v composer &> /dev/null; then
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
fi
echo "  ✓ Composer ready"

# ===== Step 3: Install Node.js (for building frontend) =====
echo "▸ [3/10] Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
fi
echo "  ✓ Node.js $(node -v) ready"

# ===== Step 4: Setup MySQL database =====
echo "▸ [4/10] Setting up MySQL database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};" 2>/dev/null || true
mysql -u root -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';" 2>/dev/null || true
mysql -u root -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';" 2>/dev/null || true
mysql -u root -e "FLUSH PRIVILEGES;" 2>/dev/null || true
echo "  ✓ Database '${DB_NAME}' created"
echo "  ✓ User '${DB_USER}' created with password: ${DB_PASS}"

# ===== Step 5: Deploy application files =====
echo "▸ [5/10] Deploying application..."
mkdir -p "$APP_DIR"

if [ -n "$REPO_URL" ]; then
    if [ -d "$APP_DIR/.git" ]; then
        cd "$APP_DIR" && git pull origin main
    else
        git clone "$REPO_URL" "$APP_DIR"
    fi
else
    # Manual copy — run this script from the project root
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
    if [ -f "$SCRIPT_DIR/../artisan" ]; then
        echo "  → Copying project files..."
        rsync -a --exclude='node_modules' --exclude='vendor' --exclude='.env' \
            "$SCRIPT_DIR/../" "$APP_DIR/"
    else
        echo "  ⚠ No git repo URL set and no project files found."
        echo "    Please copy your project files to: $APP_DIR"
        echo "    Or set REPO_URL in this script."
    fi
fi

cd "$APP_DIR"
echo "  ✓ Application files deployed"

# ===== Step 6: Configure environment =====
echo "▸ [6/10] Configuring environment..."
if [ ! -f "$APP_DIR/.env" ]; then
    cp "$APP_DIR/.env.production" "$APP_DIR/.env" 2>/dev/null || cp "$APP_DIR/.env.example" "$APP_DIR/.env"
fi

# Update .env with actual values
sed -i "s|APP_URL=.*|APP_URL=http://${SERVER_IP}|" "$APP_DIR/.env"
sed -i "s|DB_CONNECTION=.*|DB_CONNECTION=mysql|" "$APP_DIR/.env"
sed -i "s|DB_DATABASE=.*|DB_DATABASE=${DB_NAME}|" "$APP_DIR/.env"
sed -i "s|DB_USERNAME=.*|DB_USERNAME=${DB_USER}|" "$APP_DIR/.env"
sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=${DB_PASS}|" "$APP_DIR/.env"
sed -i "s|APP_ENV=.*|APP_ENV=production|" "$APP_DIR/.env"
sed -i "s|APP_DEBUG=.*|APP_DEBUG=false|" "$APP_DIR/.env"

echo "  ✓ Environment configured"

# ===== Step 7: Install dependencies & build =====
echo "▸ [7/10] Installing dependencies..."
cd "$APP_DIR"
composer install --no-dev --optimize-autoloader --no-interaction
npm ci
echo "  ✓ Dependencies installed"

echo "▸ [8/10] Building frontend..."
npm run build
echo "  ✓ Frontend built"

# ===== Step 8: Laravel setup =====
echo "▸ [9/10] Running Laravel setup..."
php artisan key:generate --force
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
echo "  ✓ Laravel configured"

# ===== Step 9: Set permissions =====
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"
chmod -R 775 "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"
echo "  ✓ Permissions set"

# ===== Step 10: Configure Nginx & Supervisor =====
echo "▸ [10/10] Configuring web server..."

# Detect PHP-FPM version
PHP_FPM_SOCK=$(ls /var/run/php/php*-fpm.sock 2>/dev/null | head -1)
if [ -z "$PHP_FPM_SOCK" ]; then
    PHP_FPM_SOCK="/var/run/php/php8.2-fpm.sock"
fi

# Copy and configure Nginx
cp "$APP_DIR/deployment/nginx/zkt-attendance.conf" /etc/nginx/sites-available/zkt-attendance

# Update server_name with actual IP
sed -i "s|server_name .*|server_name ${SERVER_IP};|" /etc/nginx/sites-available/zkt-attendance

# Update PHP-FPM socket path
sed -i "s|fastcgi_pass unix:.*|fastcgi_pass unix:${PHP_FPM_SOCK};|" /etc/nginx/sites-available/zkt-attendance

# Enable site
ln -sf /etc/nginx/sites-available/zkt-attendance /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Copy Supervisor config
cp "$APP_DIR/deployment/supervisor/zkt-attendance.conf" /etc/supervisor/conf.d/

# Restart services
nginx -t && systemctl reload nginx
systemctl restart php*-fpm
supervisorctl reread
supervisorctl update

echo "  ✓ Web server configured"

# ===== Done! =====
echo ""
echo "============================================="
echo " ✅ DEPLOYMENT COMPLETE!"
echo "============================================="
echo ""
echo " 🌐 Web Dashboard:  http://${SERVER_IP}"
echo " 📡 ADMS Endpoint:  http://${SERVER_IP}/iclock/cdata"
echo " 💓 Health Check:   http://${SERVER_IP}/api/health"
echo ""
echo " 📋 Database Credentials:"
echo "    Database: ${DB_NAME}"
echo "    Username: ${DB_USER}"
echo "    Password: ${DB_PASS}"
echo ""
echo " ============================================="
echo " 🔧 ZKTeco DEVICE CONFIGURATION"
echo " ============================================="
echo " On each ZKTeco device, set:"
echo ""
echo "   • Communication Mode: ADMS / Push"
echo "   • Server Address:     ${SERVER_IP}"
echo "   • Server Port:        80"
echo "   • Domain (if asked):  (leave empty)"
echo "   • Enable Push:        Yes"
echo ""
echo " The device menu path is usually:"
echo "   COMM. → Cloud Server Settings"
echo "   or COMM. → ADMS Settings"
echo " ============================================="
echo ""
echo " ⚠ SAVE THESE CREDENTIALS — they won't be shown again!"
echo ""
