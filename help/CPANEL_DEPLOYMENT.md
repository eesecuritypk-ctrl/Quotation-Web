# cPanel & Live Web Hosting Deployment Guide

Deploy the Eagle Eye Security Systems Quotation Portal onto shared hosting (cPanel, DirectAdmin, or VPS).

---

## 1. Upload Files

1. Log into your **cPanel**.
2. Go to **File Manager**.
3. Open `public_html/` (for your main domain) or a subdirectory like `public_html/eesi/` (or subdomain document root).
4. Upload the project files (or zip archive) and extract them.
5. Verify that `index.php` is directly in the target web folder.

---

## 2. Setup MySQL Database in cPanel

1. In cPanel, click **MySQL Databases** (or **MySQL Database Wizard**).
2. Create a new database: e.g. `cpaneluser_eagleeye`.
3. Create a new database user: e.g. `cpaneluser_dbuser` and set a strong password.
4. Add the user to the database and check **ALL PRIVILEGES**.
5. Save changes.

---

## 3. Import SQL Schema in phpMyAdmin

1. In cPanel, open **phpMyAdmin**.
2. In the left sidebar, click your newly created database (`cpaneluser_eagleeye`).
3. Click the **Import** tab at the top.
4. Choose file `eagle_eye_quotation_system.sql` and click **Go**.

---

## 4. Configure `config/db.php`

In cPanel File Manager, edit `config/db.php`:
```php
<?php
$db_host = 'localhost';
$db_name = 'cpaneluser_eagleeye';
$db_user = 'cpaneluser_dbuser';
$db_pass = 'YourActualDatabasePassword';
$db_port = '3306';
```

---

## 5. Test Live Website

Open your domain URL in your browser:
```text
https://yourdomain.com/eesi/
```
The application is live and secured!
