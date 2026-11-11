# XAMPP Installation Guide (Windows, macOS, Linux)

Deploy the Eagle Eye Security Systems Quotation Portal into XAMPP.

---

## 1. Directory Setup

Copy all project files into your XAMPP web root:

- **Windows**: `C:\xampp\htdocs\eesi\`
- **macOS**: `/Applications/XAMPP/xamppfiles/htdocs/eesi/`
- **Linux**: `/opt/lampp/htdocs/eesi/`

Make sure `index.php` is located directly in that folder:
```text
htdocs/eesi/index.php
```

---

## 2. Start Services

Open **XAMPP Control Panel**:
1. Click **Start** next to **Apache**.
2. Click **Start** next to **MySQL**.

---

## 3. Database Import

1. Navigate to: `http://localhost/phpmyadmin/`
2. Click **Import**.
3. Choose `eagle_eye_quotation_system.sql` from your `eesi` directory.
4. Click **Go**.

---

## 4. Run Application

Open your browser and visit:
```text
http://localhost/eesi/
```
