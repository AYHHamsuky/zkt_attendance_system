# 🏢 On-Premise Server Deployment Guide

> Deploy the ZKTeco Attendance System on your company's local server so ZKTeco devices can push attendance data via the ADMS protocol.

---

## 📋 Prerequisites

| Requirement        | Minimum              |
| ------------------ | -------------------- |
| **OS**             | Ubuntu 22.04+ / Debian 12+ (or any Linux with systemd) |
| **PHP**            | 8.2+                 |
| **Node.js**        | 20+                  |
| **Database**       | MySQL 8.0+ or SQLite |
| **Web Server**     | Nginx                |
| **RAM**            | 2 GB+                |
| **Network**        | Same LAN as ZKTeco devices |

---

## 🚀 Quick Deploy (Automated)

### Option A — Automated Script (Ubuntu/Debian)

1. **Transfer the project** to your server:
   ```bash
   # From your Mac, compress and send the project
   cd ~/Herd/ZKT_Attendance_System
   tar czf zkt-attendance.tar.gz --exclude=node_modules --exclude=vendor --exclude=.env .

   # Copy to server (replace with your server IP)
   scp zkt-attendance.tar.gz user@192.168.1.100:/tmp/
   ```

2. **SSH into the server** and extract:ay
   ```bash
   ssh user@192.168.1.100

   sudo mkdir -p /var/www/zkt-attendance
   sudo tar xzf /tmp/zkt-attendance.tar.gz -C /var/www/zkt-attendance
   ```

3. **Run the deployment script**:
   ```bash
   cd /var/www/zkt-attendance
   sudo bash deployment/deploy.sh
   ```

4. **Save the credentials** printed at the end!

---

### Option B — Manual Step-by-Step

#### 1. Install System Packages

```bash
sudo apt update
sudo apt install -y \
    nginx \
    php8.2-fpm php8.2-cli php8.2-common php8.2-mysql \
    php8.2-sqlite3 php8.2-mbstring php8.2-xml php8.2-curl \
    php8.2-zip php8.2-gd php8.2-bcmath php8.2-intl \
    php8.2-readline php8.2-sockets \
    mysql-server supervisor git unzip curl
```

#### 2. Install Composer

```bash
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

#### 3. Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### 4. Setup MySQL Database

```bash
sudo mysql -u root <<EOF
CREATE DATABASE zkt_attendance;
CREATE USER 'zkt_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON zkt_attendance.* TO 'zkt_user'@'localhost';
FLUSH PRIVILEGES;
EOF
```

#### 5. Deploy Application

```bash
# Create directory and set ownership
sudo mkdir -p /var/www/zkt-attendance
sudo chown $USER:$USER /var/www/zkt-attendance

# Copy project files (from your local machine via scp/rsync)
# Or clone from git if you have a repo

cd /var/www/zkt-attendance

# Configure environment
cp .env.production .env
nano .env   # Edit with your actual values:
            #   APP_URL=http://YOUR_SERVER_IP
            #   DB_PASSWORD=YOUR_STRONG_PASSWORD

# Install dependencies
composer install --no-dev --optimize-autoloader
npm ci
npm run build

# Laravel setup
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link

# Set permissions
sudo chown -R www-data:www-data /var/www/zkt-attendance
sudo chmod -R 755 /var/www/zkt-attendance
sudo chmod -R 775 /var/www/zkt-attendance/storage /var/www/zkt-attendance/bootstrap/cache
```

#### 6. Configure Nginx

```bash
sudo cp /var/www/zkt-attendance/deployment/nginx/zkt-attendance.conf /etc/nginx/sites-available/zkt-attendance

# Edit server_name to your server IP
sudo nano /etc/nginx/sites-available/zkt-attendance

# Enable the site
sudo ln -sf /etc/nginx/sites-available/zkt-attendance /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

#### 7. Configure Supervisor (Queue Worker)

```bash
sudo cp /var/www/zkt-attendance/deployment/supervisor/zkt-attendance.conf /etc/supervisor/conf.d/
sudo supervisorctl reread
sudo supervisorctl update
```

---

## 🔧 ZKTeco Device Configuration

Once the server is running, configure **each ZKTeco device** to push data to it:

### Device Menu Settings

Navigate on the device to: **COMM. → Cloud Server Settings** (or **ADMS Settings**)

| Setting           | Value                    |
| ----------------- | ------------------------ |
| **Enable**        | Yes / On                 |
| **Server Address**| `YOUR_SERVER_IP` (e.g. `192.168.1.100`) |
| **Server Port**   | `80`                     |
| **Domain**        | _(leave empty)_          |
| **Push Protocol** | ADMS or HTTP             |

### For web-based device management:

1. Open the device's web interface: `http://DEVICE_IP`
2. Go to **Communication** → **Cloud Server Setting**
3. Set:
   - **Protocol**: HTTP
   - **Server Address**: `YOUR_SERVER_IP`
   - **Port**: `80`
4. Save and reboot the device

### What happens next:

1. The device sends a **handshake** to `http://YOUR_SERVER_IP/iclock/cdata?SN=SERIAL`
2. The server responds with sync configuration
3. The device starts **pushing attendance** data in real-time
4. The device **auto-registers** in your dashboard

---

## ✅ Verify Deployment

### 1. Check the health endpoint

Open in browser or curl:
```bash
curl http://YOUR_SERVER_IP/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "server_ip": "192.168.1.100",
  "server_time": "2026-02-19T10:00:00+00:00",
  "services": { "app": true, "database": true },
  "devices": { "total": 0, "online": 0 },
  "adms_endpoint": "http://192.168.1.100/iclock/cdata"
}
```

### 2. Check device connectivity

After configuring a device, check the logs:
```bash
tail -f /var/www/zkt-attendance/storage/logs/laravel.log
```

You should see:
```
ADMS: Device handshake { serial_number: "XXXXX", ip: "192.168.1.50" }
```

### 3. Open the dashboard

Visit `http://YOUR_SERVER_IP` in your browser to access the web dashboard.

---

## 🌐 Finding Your Server IP

Run on the server:
```bash
# Show all network interfaces and their IPs
ip addr show | grep "inet " | grep -v 127.0.0.1

# Or simply:
hostname -I
```

The **first IP** is typically your LAN IP (e.g., `192.168.1.100`). This is the IP you'll configure on your ZKTeco devices.

---

## 🛠 Maintenance Commands

```bash
cd /var/www/zkt-attendance

# View application logs
tail -f storage/logs/laravel.log

# View ADMS-specific logs (device pushes)
grep "ADMS:" storage/logs/laravel.log

# Check queue worker status
sudo supervisorctl status

# Restart queue workers after code changes
sudo supervisorctl restart zkt-queue-worker:*

# Clear and rebuild caches after code changes
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations after updates
php artisan migrate --force

# Rebuild frontend after JS/Vue changes
npm run build
```

---

## 🔒 Security Recommendations

1. **Firewall**: Only allow ports 80/443 from your LAN
   ```bash
   sudo ufw allow from 192.168.1.0/24 to any port 80
   sudo ufw allow ssh
   sudo ufw enable
   ```

2. **HTTPS** (optional, recommended for dashboard):
   ```bash
   # Self-signed cert for internal use
   sudo openssl req -x509 -nodes -days 3650 \
       -newkey rsa:2048 \
       -keyout /etc/ssl/private/zkt-attendance.key \
       -out /etc/ssl/certs/zkt-attendance.crt \
       -subj "/CN=YOUR_SERVER_IP"
   ```
   > ⚠️ Note: Most ZKTeco devices only support HTTP (not HTTPS) for ADMS push. Keep port 80 open for `/iclock/*` routes.

3. **Regular backups**:
   ```bash
   # Database backup (add to crontab)
   mysqldump -u zkt_user -p zkt_attendance > /backup/zkt-$(date +%F).sql
   ```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Company LAN (192.168.1.x)             │
│                                                         │
│  ┌──────────────┐         ┌──────────────────────────┐  │
│  │ ZKTeco Device│──HTTP──▸│  On-Premise Server        │  │
│  │ 192.168.1.50 │  PUSH   │  192.168.1.100            │  │
│  │              │◂────────│                            │  │
│  └──────────────┘         │  ┌──────────┐             │  │
│                           │  │  Nginx   │ :80         │  │
│  ┌──────────────┐         │  │  ↓       │             │  │
│  │ ZKTeco Device│──HTTP──▸│  │ PHP-FPM  │             │  │
│  │ 192.168.1.51 │  PUSH   │  │  ↓       │             │  │
│  └──────────────┘         │  │ Laravel  │             │  │
│                           │  │  ↓       │             │  │
│  ┌──────────────┐         │  │ MySQL/   │             │  │
│  │ 👨‍💼 Browser  │──HTTP──▸│  │ SQLite   │             │  │
│  │  Dashboard   │         │  └──────────┘             │  │
│  └──────────────┘         └──────────────────────────┘  │
│                                                         │
│  Devices push to: http://192.168.1.100/iclock/cdata     │
│  Dashboard:       http://192.168.1.100                  │
│  Health check:    http://192.168.1.100/api/health       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| Device shows "Server unreachable" | Verify server IP with `curl http://SERVER_IP/api/health` from another machine on the same LAN |
| No attendance data appearing | Check `storage/logs/laravel.log` for ADMS entries. Ensure device has ADMS/Push enabled |
| 502 Bad Gateway | Restart PHP-FPM: `sudo systemctl restart php8.2-fpm` |
| Permission denied errors | Run: `sudo chown -R www-data:www-data /var/www/zkt-attendance/storage` |
| Queue jobs not processing | Check: `sudo supervisorctl status` and restart if needed |
| Database connection refused | Verify MySQL is running: `sudo systemctl status mysql` |
