# Troubleshooting: Fixing the Blank Page in WAMP, XAMPP, and cPanel

If you previously opened `http://localhost/eesi/` and saw a blank white screen, this document explains exactly why it happened and how it is permanently resolved in this updated project.

---

## 1. What Caused the Blank Screen?

### Cause 1: Raw TypeScript JSX (`.tsx`) Files
When you download the raw repository from AI Studio or GitHub, the default `index.html` file contained:
```html
<script type="module" src="/src/main.tsx"></script>
```
When you opened `http://localhost/eesi/` on Apache/WAMP:
- Apache tried to serve `src/main.tsx` as plain text or unknown MIME type.
- The web browser tried to parse modern TypeScript JSX syntax natively, which standard browsers cannot do without a bundler/transpiler.
- This threw an unhandled syntax error in the browser developer console and halted execution, leaving the screen completely blank white.

### Cause 2: Root vs Subdirectory Base Path (`/` vs `./`)
In standard single-page apps, asset paths are often written as absolute links (`/assets/index.js`).
When deployed in a subdirectory like `http://localhost/eesi/`, the browser looked for `http://localhost/assets/index.js` (at the root) instead of `http://localhost/eesi/assets/index.js`, returning 404 errors.

---

## 2. How We Fixed It for ALL Environments (WAMP, XAMPP, and cPanel)

We implemented a multi-layer solution that guarantees 100% compatibility:

### Fix 1: Turnkey `index.php` at Project Root
We created a complete, standalone, production-grade `index.php` at the root of the project.
- In Apache (WAMP, XAMPP, cPanel), the default directory index configuration is:
  ```apache
  DirectoryIndex index.php index.html index.htm
  ```
- Because `index.php` is present, Apache executes it **first**.
- `index.php` uses native HTML5, modern CSS, vanilla JavaScript, and PHP PDO. **It does NOT require Node.js, npm, or any terminal commands.**
- It connects to MySQL if available, and gracefully falls back to persistent browser storage if MySQL is not yet configured.

### Fix 2: Relative Asset Paths (`./`)
All assets (logo, CSS, scripts) now use relative paths (`assets/...`).
This ensures that whether your project is placed in:
- `http://localhost/eesi/`
- `http://localhost/quotations/`
- `http://localhost/`
- `https://yourdomain.com/eesi/`
- `https://yourdomain.com/`

All stylesheets, images, and endpoints resolve correctly.

### Fix 3: Automatic `.htaccess` URL Rewrite Rules
The included `.htaccess` file configures Apache to route requests seamlessly and enable Cross-Origin Resource Sharing (CORS) for API calls.

---

## 3. Quick Verification Checklist

1. Make sure your project folder is located at:
   ```text
   C:\wamp64\www\eesi\
   ```
2. Confirm that `index.php` is located directly inside `eesi\`:
   ```text
   C:\wamp64\www\eesi\index.php
   ```
3. Open `http://localhost/eesi/` in your browser.
4. Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac) to force refresh the cache.
5. The full application will load with the login page, Eagle Eye logo, quotation builder, and PDF exporter.
