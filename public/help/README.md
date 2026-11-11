# Eagle Eye Security Systems - Help & Documentation Center

Welcome to the documentation folder for Eagle Eye Security Systems Quotation & Management Portal.

## Documentation Index:
1. [WAMP Server Installation Guide](WAMP_INSTALLATION.md) - Complete instructions for running inside `C:\wamp64\www\eesi\`.
2. [XAMPP Installation Guide](XAMPP_INSTALLATION.md) - Instructions for XAMPP on Windows, macOS, and Linux.
3. [cPanel & Web Hosting Deployment](CPANEL_DEPLOYMENT.md) - Instructions for shared hosting, VPS, and live domain deployment.
4. [Fixing Blank Page Bug](TROUBLESHOOTING_BLANK_PAGE.md) - Detailed explanation of why the page was blank and how it is permanently fixed.
5. [Database Schema & Seed Setup](MYSQL_SETUP.md) - How to import `eagle_eye_quotation_system.sql` in phpMyAdmin or CLI.

## Quick Start (Deploy in 60 Seconds):
1. Copy the entire repository into your web server folder:
   - **WAMP**: `C:\wamp64\www\eesi\`
   - **XAMPP**: `C:\xampp\htdocs\eesi\`
   - **cPanel**: `public_html/eesi/` or `public_html/`
2. Open `http://localhost/phpmyadmin/` and import `eagle_eye_quotation_system.sql`.
3. Open your browser and navigate to:
   ```text
   http://localhost/eesi/
   ```
4. Done! The portal will load with the interactive login, logo, quotation builder, and PDF export!
