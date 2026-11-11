# Eagle Eye Security Systems - Quotation Management System
## Complete Installation & Deployment Documentation

This document contains step-by-step instructions for deploying and running the **Eagle Eye Security Systems** Quotation Generator, Dynamic Fields Manager, and PDF Document Exporter across **WAMP**, **XAMPP**, **Node.js development**, **cPanel**, and **Linux VPS**.

---

## Table of Contents
1. [Project Overview & Architecture](#1-project-overview--architecture)
2. [Quick Deployment on WAMP Server (Windows)](#2-quick-deployment-on-wamp-server-windows)
3. [Deployment on XAMPP (Windows / macOS / Linux)](#3-deployment-on-xampp-windows--macos--linux)
4. [MySQL Database Setup (phpMyAdmin & CLI)](#4-mysql-database-setup-phpmyadmin--cli)
5. [PHP Backend API Configuration](#5-php-backend-api-configuration)
6. [Node.js Development Environment (Vite)](#6-nodejs-development-environment-vite)
7. [Deployment on cPanel / Shared Hosting](#7-deployment-on-cpanel--shared-hosting)
8. [Troubleshooting Common Issues](#8-troubleshooting-common-issues)
9. [Default Staff Credentials](#9-default-staff-credentials)
10. [Project Directory Structure](#10-project-directory-structure)

---

## 1. Project Overview & Architecture

- **Frontend**: Single Page Application (SPA) built with React 19, TypeScript, and Tailwind CSS.
- **Logo & Assets**: Official Eagle Eye Security Systems high-resolution transparent crest badge (`/assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png`).
- **PDF Engine**: Client-side vector and canvas rendering using `jsPDF` and `html2canvas` with `@media print` A4 specifications.
- **Backend**: Native PHP (PDO with prepared statements) providing REST endpoints for CRUD operations.
- **Database**: MySQL 5.7+ / 8.0+ / MariaDB schema with relational tables, foreign key constraints, indexes, and initial seed data for Quote #00511.

---

## 2. Quick Deployment on WAMP Server (Windows)

Use this method if you have **WAMP Server** installed on Windows (`wamp64`).

### Step 2.1: Locate the WAMP Web Directory
Create a dedicated folder named `eesi` inside your WAMP `www` folder:
```text
C:\wamp64\www\eesi\
```

### Step 2.2: Extract the Production Files
1. In the application UI, go to the **"MySQL & PHP"** tab and click **"Download WAMP Package (.zip)"**, or use the file:
   ```text
   public/eesi_wamp_deployment.zip
   ```
   *(Alternatively, copy all contents directly from the project's `dist/` directory)*.
2. Unzip all files into `C:\wamp64\www\eesi\`.
3. **Verify the extracted structure**:
   ```text
   C:\wamp64\www\eesi\
   ├── index.html               <-- Must be directly here!
   ├── .htaccess
   ├── eagle_eye_quotation_system.sql
   ├── favicon.png
   ├── assets\
   │   ├── index-*.js
   │   ├── index-*.css
   │   └── aistudio\
   │       └── Eagle_Eye_Security_Systems_Logo_cbbbecb6.png
   ├── api\
   │   ├── quotations.php
   │   └── auth.php
   └── config\
       └── db.php
   ```

### Step 2.3: Import the MySQL Database
1. Start your WAMP Server and wait until the taskbar icon turns **green**.
2. Open your web browser and navigate to:
   ```text
   http://localhost/phpmyadmin/
   ```
3. Log in (default username is `root`, password is empty).
4. Click on the **"Import"** tab in the top navigation bar.
5. Click **"Choose File"** and select:
   ```text
   C:\wamp64\www\eesi\eagle_eye_quotation_system.sql
   ```
6. Click **"Go"** at the bottom of the page.
7. You should see a green success message confirming that the `eagle_eye_db` database and all 6 tables have been created with seed data.

### Step 2.4: Verify Database Connection in PHP
Open `C:\wamp64\www\eesi\config\db.php` in a code or text editor (e.g. Notepad, VS Code) and verify the settings:
```php
$db_host = 'localhost';
$db_name = 'eagle_eye_db';
$db_user = 'root';     // Default WAMP username
$db_pass = '';         // Default WAMP password is empty
$db_port = '3306';
```

### Step 2.5: Launch the Application
Open your browser and visit:
```text
http://localhost/eesi/
```
The Eagle Eye Security Systems Quotation Portal will load immediately.

---

## 3. Deployment on XAMPP (Windows / macOS / Linux)

### On Windows:
1. Create a folder `eesi` inside `C:\xampp\htdocs\`:
   ```text
   C:\xampp\htdocs\eesi\
   ```
2. Extract the contents of `dist/` or `eesi_wamp_deployment.zip` into `C:\xampp\htdocs\eesi\`.
3. Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
4. Open `http://localhost/phpmyadmin/`, click **Import**, and import `eagle_eye_quotation_system.sql`.
5. Browse to `http://localhost/eesi/`.

### On macOS / Linux:
1. Target directory:
   - macOS (XAMPP): `/Applications/XAMPP/xamppfiles/htdocs/eesi/`
   - Linux (LAMP): `/var/www/html/eesi/`
2. Grant file read permissions:
   ```bash
   chmod -R 755 /var/www/html/eesi/
   ```
3. Import the SQL file:
   ```bash
   mysql -u root -p < /var/www/html/eesi/eagle_eye_quotation_system.sql
   ```
4. Access `http://localhost/eesi/`.

---

## 4. MySQL Database Setup (phpMyAdmin & CLI)

The provided SQL file `eagle_eye_quotation_system.sql` includes DDL and DML statements:

### Tables Created:
| Table Name | Description |
| :--- | :--- |
| `users` | Staff credentials, roles (`admin`, `sales_manager`, `estimator`), bcrypt password hashes. |
| `company_profile` | Eagle Eye Security Systems metadata, contact numbers, address, mission, vision, services, logo path. |
| `quotations` | Master quote records (Quote #, dates, client details, scope, subtotal, tax, total, status). |
| `quotation_items` | Specifications / line items (descriptions, units, rates, bullet flags, sort orders). |
| `quotation_terms` | Commercial clauses (Prices, Payment 50/50, Delivery, Validity, Warranty). |
| `quotation_custom_fields` | Dynamic fields added via the user interface (text, number, date, dropdowns). |

### CLI Import Command:
If you prefer the command line:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS eagle_eye_db;"
mysql -u root -p eagle_eye_db < eagle_eye_quotation_system.sql
```

---

## 5. PHP Backend API Configuration

The PHP API controllers are located in `/api/`:
- `config/db.php`: Database connection using PHP PDO with UTF-8 character encoding and error exceptions.
- `api/quotations.php`: Handles `GET` (fetch all or by ID) and `POST` (create or update quote, line items, and dynamic custom fields in a single atomic database transaction).
- `api/auth.php`: Verifies credentials and issues authorization tokens.

### Enabling Apache mod_rewrite & Headers:
In WAMP or Apache `httpd.conf`, ensure these two modules are enabled:
```apache
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule headers_module modules/mod_headers.so
```
The provided `.htaccess` file handles URL rewrites and CORS automatically.

---

## 6. Node.js Development Environment (Vite)

If you want to modify the React / TypeScript code:

### Prerequisites:
- Node.js version 18.0 or higher.
- npm version 9.0 or higher.

### Installation:
1. Clone or copy the project into a folder:
   ```bash
   git clone <repo-url> eagle-eye-quotations
   cd eagle-eye-quotations
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
   This generates the production bundle in the `dist/` folder with relative `./assets/` paths ready for WAMP/Apache deployment.

---

## 7. Deployment on cPanel / Shared Hosting

1. Log in to your **cPanel** dashboard.
2. Go to **File Manager** -> `public_html` (or a subdomain folder like `quotations.eesecurity.com.pk`).
3. Upload and extract `eesi_wamp_deployment.zip`.
4. Go to **MySQL Database Wizard** in cPanel:
   - Create a database (e.g. `cpaneluser_eagleeye`).
   - Create a user and password.
   - Grant **ALL PRIVILEGES** to the user on this database.
5. Go to **phpMyAdmin** in cPanel, select the new database, and click **Import** -> upload `eagle_eye_quotation_system.sql`.
6. Edit `config/db.php` in File Manager to input your cPanel database name, username, and password:
   ```php
   $db_host = 'localhost';
   $db_name = 'cpaneluser_eagleeye';
   $db_user = 'cpaneluser_dbuser';
   $db_pass = 'YourSecretPassword';
   ```
7. Visit your domain: `https://quotations.eesecurity.com.pk/`

---

## 8. Troubleshooting Common Issues

### Issue 1: Blank White Screen at `http://localhost/eesi/`
- **Cause A**: You copied the raw source code (`.tsx`) instead of the compiled `dist/` directory. Browsers cannot interpret raw TypeScript files.
  - **Fix**: Copy the contents of the `dist/` directory or extract `eesi_wamp_deployment.zip` into `www/eesi/`.
- **Cause B**: Missing `index.html` at the root of `eesi`.
  - **Fix**: Check that `C:\wamp64\www\eesi\index.html` exists directly in the `eesi` directory.

### Issue 2: Console Error: "Failed to load resource: net::ERR_FILE_NOT_FOUND" for `/assets/...`
- **Cause**: Absolute base path `/assets/` used in a subdirectory.
  - **Fix**: In `vite.config.ts`, verify `base: './'`. This is pre-configured in this repository.

### Issue 3: "Database connection failed" in PHP
- **Cause**: MySQL service is not running or incorrect password in `config/db.php`.
  - **Fix**: Check that the WAMP icon is green. For WAMP, the default password for `root` is empty (`""`). For XAMPP, it is also empty.

### Issue 4: PDF export doesn't start
- **Cause**: Browser popup blocker or print dialog blocked.
  - **Fix**: Check the browser's address bar to allow automatic downloads for `localhost`. You can also click the **"Print A4"** button to open your system's native print-to-PDF dialog.

---

## 9. Default Staff Credentials

You can use these credentials to sign in on the interactive login page:

| Role | Username | Password | Email |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin` | `password123` | `admin@eesecurity.com.pk` |
| **Sales Manager** | `sales` | `password123` | `sales@eesecurity.com.pk` |
| **Technical Estimator** | `estimator` | `password123` | `enquiry@eesecurity.com.pk` |

*(You can also click any of the 3 quick-access role cards on the login page for instant authentication).*

---

## 10. Project Directory Structure

```text
eagle-eye-quotation-system/
├── dist/                          # Compiled production build for WAMP/Apache
│   ├── index.html                 # Main entrypoint with relative ./assets
│   ├── .htaccess                  # Apache SPA rewrite rules
│   ├── eagle_eye_quotation_system.sql # MySQL Schema & seed data
│   ├── eesi_wamp_deployment.zip   # Ready-to-unzip archive for WAMP/cPanel
│   ├── assets/                    # Minified JS, CSS, and brand images
│   ├── api/                       # PHP REST controllers
│   └── config/                    # PHP MySQL connection config
├── public/                        # Static assets served by Vite
│   ├── assets/
│   │   ├── logo.png               # Official Eagle Eye logo image
│   │   └── aistudio/
│   │       ├── Eagle_Eye_Security_Systems_Logo_cbbbecb6.png
│   │       └── Quotation_84e49c86.pdf
│   ├── eesi_wamp_deployment.zip
│   ├── eagle_eye_quotation_system.sql
│   └── favicon.png
├── src/                           # TypeScript React source code
│   ├── components/
│   │   ├── EagleEyeLogo.tsx       # Logo component using official asset
│   │   ├── LoginPage.tsx          # Interactive login screen
│   │   ├── TopNav.tsx             # 3-Zone top navigation bar
│   │   ├── QuotationDocument.tsx  # Exact PDF reproduction (Pages 1 & 2)
│   │   ├── QuotationEditor.tsx    # Dynamic quotation builder
│   │   ├── QuotationList.tsx      # Quotation archive & records
│   │   ├── DatabaseSqlView.tsx    # MySQL & PHP integration view
│   │   └── DynamicFieldModal.tsx  # Dynamic custom field creator
│   ├── data/
│   │   └── initialData.ts         # Preloaded Quote #00511 from PDF
│   ├── types/
│   │   └── quotation.ts           # TypeScript interfaces & types
│   ├── utils/
│   │   └── pdfExport.ts           # jsPDF + html2canvas export utility
│   ├── App.tsx                    # Main application root
│   ├── main.tsx                   # React DOM entry point
│   └── index.css                  # Tailwind CSS & print styles
├── vite.config.ts                 # Vite config with base: './'
├── package.json
└── tsconfig.json
```
