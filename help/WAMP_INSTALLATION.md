# WAMP Server Complete Installation Guide

Deploy the Eagle Eye Security Systems Quotation Portal into your local WAMP environment on Windows in under 2 minutes.

---

## Step 1: Copy Project into WAMP

1. Open Windows File Explorer.
2. Go to your WAMP `www` folder:
   ```text
   C:\wamp64\www\
   ```
   *(For 32-bit WAMP: `C:\wamp\www\`)*
3. Create a folder named `eesi` (or copy this entire project folder into `eesi`).
4. Ensure the file structure looks like this:
   ```text
   C:\wamp64\www\eesi\
   ├── index.php                      <-- Main application
   ├── index.html                     <-- Fallback HTML
   ├── .htaccess                      <-- Apache configuration
   ├── eagle_eye_quotation_system.sql <-- MySQL Database Schema
   ├── favicon.png                    <-- Official Logo Icon
   ├── assets/                        <-- Logo & media
   ├── api/                           <-- PHP backend endpoints
   │   ├── quotations.php
   │   └── auth.php
   ├── config/                        <-- Database connection
   │   └── db.php
   └── help/                          <-- Help and documentation
   ```

---

## Step 2: Start WAMP Services

1. Launch **WampServer** from your Desktop or Start Menu.
2. Look at the notification area on your Windows taskbar (near the clock).
3. Wait until the **WAMP icon turns solid green** (meaning Apache and MySQL are both running).

---

## Step 3: Import the Database into MySQL

1. Open your web browser and go to:
   ```text
   http://localhost/phpmyadmin/
   ```
2. Log in (default username is `root`, password leave blank).
3. Click the **"Import"** tab in the top navigation bar.
4. Click **"Choose File"** and browse to:
   ```text
   C:\wamp64\www\eesi\eagle_eye_quotation_system.sql
   ```
5. Click **"Go"** at the bottom of the page.
6. A success message will appear confirming that the database `eagle_eye_db` has been created with all tables and Quote #00511.

---

## Step 4: Verify Database Connection

Open `C:\wamp64\www\eesi\config\db.php` in any text editor:
```php
$db_host = 'localhost';
$db_name = 'eagle_eye_db';
$db_user = 'root';     // Default WAMP username
$db_pass = '';         // Default WAMP password is empty
$db_port = '3306';
```
These match standard WAMP settings out of the box.

---

## Step 5: Open in Your Browser

Open Google Chrome, Microsoft Edge, or Firefox and go to:
```text
http://localhost/eesi/
```

The portal will load immediately!

---

## Default Staff Login Credentials:

- **System Administrator**: `admin` / `password123`
- **Sales Manager**: `sales` / `password123`
- **Technical Estimator**: `estimator` / `password123`
