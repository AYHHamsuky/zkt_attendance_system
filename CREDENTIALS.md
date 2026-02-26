# Kaduna Electric Attendance System — Credentials

> **CONFIDENTIAL — Do not commit this file to a public repository.**

## Application URL

```
http://192.168.172.14:8000
```

---

## User Accounts

### Administrator

| Field    | Value                              |
|----------|------------------------------------|
| Name     | Yahya Hamza                        |
| Email    | abubakar.hamza@kadunaelectric.com  |
| Password | *(set during initial setup)*       |
| Role     | `admin`                            |

**Admin can:** Dashboard · Devices · Employees · Attendance · Reports · Settings

---

### HR Officer

| Field    | Value                     |
|----------|---------------------------|
| Name     | HR Officer                |
| Email    | hr@kadunaelectric.com     |
| Password | `KE-HR@2026#`             |
| Role     | `hr`                      |

**HR can:** Dashboard · Employees · Attendance · Reports · Settings
**HR cannot:** Manage or configure biometric devices

---

## Role Permissions Summary

| Feature              | Admin | HR  |
|----------------------|-------|-----|
| Dashboard            | ✅    | ✅  |
| Devices (manage)     | ✅    | ❌  |
| Employees            | ✅    | ✅  |
| Attendance logs      | ✅    | ✅  |
| Reports + CSV export | ✅    | ✅  |
| Settings             | ✅    | ✅  |

---

## Adding New Users

Run the following in a terminal from the project root:

```bash
php artisan tinker
```

```php
use App\Models\User;

User::create([
    'name'              => 'Full Name',
    'email'             => 'user@kadunaelectric.com',
    'password'          => bcrypt('SecurePassword123!'),
    'role'              => 'hr',       // or 'admin'
    'email_verified_at' => now(),
]);
```

---

*Generated: February 25, 2026*
