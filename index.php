<?php
/**
 * Eagle Eye Security Systems - Quotation Management System
 * Universal Standalone PHP/HTML5/CSS/JavaScript Application
 * Optimized for WAMP, XAMPP, LAMP, and cPanel Web Hosting
 * Automatically connects to MySQL database if available, with offline fallback.
 */

// Explicitly send text/html header so browser never mistakes page for JSON
if (!headers_sent()) {
    header('Content-Type: text/html; charset=UTF-8');
}

// Attempt database connection gracefully
$db_connected = false;
$db_error = null;
$pdo = null;

if (file_exists(__DIR__ . '/config/db.php')) {
    try {
        require_once __DIR__ . '/config/db.php';
        if (isset($pdo) && $pdo instanceof PDO) {
            $db_connected = true;
        }
    } catch (Throwable $e) {
        $db_error = $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eagle Eye Security - Quotation Generator & Management System</title>
  <meta name="description" content="Official quotation generator, PDF document exporter, and MySQL manager for Eagle Eye Security Systems.">
  <link rel="icon" type="image/png" href="assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN for guaranteed rendering in all environments -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  
  <!-- html2pdf.js & QRCode for universal client-side PDF export without Node.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    .font-script {
      font-family: 'Great Vibes', cursive;
    }
    .font-mono-num {
      font-family: 'JetBrains Mono', monospace;
      font-variant-numeric: tabular-nums;
    }

    /* Print Styles for Pixel-Perfect A4 Quotation Output */
    @media print {
      @page {
        size: A4 portrait;
        margin: 0;
      }
      html, body {
        background: white !important;
        color: black !important;
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
      .print-sheet {
        width: 210mm !important;
        height: 297mm !important;
        max-height: 297mm !important;
        overflow: hidden !important;
        padding: 0 !important;
        margin: 0 auto !important;
        page-break-after: always !important;
        break-after: page !important;
        box-shadow: none !important;
        border: none !important;
        background: white !important;
      }
    }

    /* Custom scrollbars */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.6); }
    ::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.4); border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(245, 158, 11, 0.6); }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">

  <!-- ========================================== -->
  <!-- VIEW 1: FIRST PAGE - INTERACTIVE LOGIN PAGE -->
  <!-- ========================================== -->
  <div id="view-login" class="min-h-screen bg-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 relative select-none">
    <!-- Ambient glow -->
    <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(circle at 50% 50%, #f59e0b 1px, transparent 1px); background-size: 36px 36px;"></div>
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
      <!-- Brand Logo Header -->
      <div class="text-center flex flex-col items-center">
        <div class="p-3 bg-slate-900/95 rounded-2xl border border-amber-500/30 shadow-2xl backdrop-blur-md mb-3 flex flex-col items-center">
          <img src="assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png" 
               alt="Eagle Eye Security Systems" 
               class="w-24 h-24 object-contain drop-shadow-xl">
        </div>
        <h1 class="text-xl font-black tracking-tight text-white mt-1 uppercase">
          EAGLE EYE SECURITY SYSTEMS
        </h1>
        <p class="text-xs text-slate-400 mt-1 max-w-xs">
          Commercial Quotation & Billing Management Portal
        </p>
      </div>

      <!-- Login Form Card -->
      <div class="mt-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 backdrop-blur-xl">
        <form onsubmit="handleManualLogin(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Username or Email</label>
            <input type="text" id="login-username" value="admin@eesecurity.com.pk" required class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div class="relative">
              <input type="password" id="login-password" value="password123" required class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500">
              <button type="button" onclick="togglePasswordVisibility()" class="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs cursor-pointer">
                <span id="pwd-toggle-text">Show</span>
              </button>
            </div>
          </div>

          <div id="login-error" class="hidden p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs"></div>

          <button type="submit" id="btn-login-submit" class="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer">
            Sign In to Portal
          </button>
        </form>

        <!-- Divider -->
        <div class="my-5 flex items-center gap-3">
          <div class="h-px flex-1 bg-slate-800"></div>
          <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Quick Demo Access</span>
          <div class="h-px flex-1 bg-slate-800"></div>
        </div>

        <!-- 3 Role Demo Buttons -->
        <div class="space-y-2">
          <!-- Administrator -->
          <button type="button" onclick="loginUser('Engr. Naveed Kauser', 'Administrator', 'admin@eesecurity.com.pk')" class="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between cursor-pointer group">
            <div>
              <div class="text-xs font-bold text-amber-400 group-hover:text-amber-300">Administrator</div>
              <div class="text-[10px] text-slate-400">Engr. Naveed Kauser &middot; Full System Access</div>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">All Menus</span>
          </button>

          <!-- Sales Manager -->
          <button type="button" onclick="loginUser('Tariq Mehmood', 'Sales Manager', 'sales@eesecurity.com.pk')" class="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/50 transition-all flex items-center justify-between cursor-pointer group">
            <div>
              <div class="text-xs font-bold text-sky-400 group-hover:text-sky-300">Sales Manager</div>
              <div class="text-[10px] text-slate-400">Tariq Mehmood &middot; Quotations & Estimation</div>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono">No Database</span>
          </button>

          <!-- Technical Estimator -->
          <button type="button" onclick="loginUser('Zeeshan Ahmed', 'Technical Estimator', 'estimator@eesecurity.com.pk')" class="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between cursor-pointer group">
            <div>
              <div class="text-xs font-bold text-emerald-400 group-hover:text-emerald-300">Technical Estimator</div>
              <div class="text-[10px] text-slate-400">Zeeshan Ahmed &middot; Tech Specs & Pricing Only</div>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">Editor Only</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- VIEW 2: MAIN APPLICATION DASHBOARD         -->
  <!-- ========================================== -->
  <div id="view-dashboard" class="hidden min-h-screen flex flex-col">
    <!-- TOP NAVIGATION BAR (Strict Role-Based Contract) -->
    <header class="no-print bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        
        <!-- Zone 1: Official Brand Logo -->
        <div class="flex items-center gap-3 shrink-0">
          <img src="assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png" 
               alt="Eagle Eye Security Systems" 
               class="w-10 h-10 object-contain drop-shadow-md">
          <div class="flex flex-col">
            <span class="font-black text-sm tracking-tight text-white leading-none uppercase">EAGLE EYE</span>
            <span class="font-bold text-[9px] tracking-widest text-amber-400 uppercase mt-0.5">SECURITY SYSTEMS</span>
          </div>
        </div>

        <!-- Zone 2: Navigation Tabs (Filtered strictly by user role) -->
        <nav class="hidden md:flex items-center gap-6 text-xs font-semibold">
          <button type="button" onclick="switchTab('editor')" id="nav-editor" class="text-amber-400 font-bold border-b-2 border-amber-400 py-1 transition-colors cursor-pointer">
            Quotation Editor
          </button>
          <button type="button" onclick="switchTab('preview')" id="nav-preview" class="text-slate-400 hover:text-white py-1 transition-colors cursor-pointer">
            Document Preview
          </button>
          <!-- MySQL & PHP Tab: Administrator ONLY (Hidden for Sales Manager & Technical Estimator) -->
          <button type="button" onclick="switchTab('database')" id="nav-database" class="text-slate-400 hover:text-white py-1 transition-colors cursor-pointer flex items-center gap-1.5">
            <span>MySQL & PHP</span>
          </button>
          <!-- Help Docs: Administrator and Sales Manager only (Hidden for Technical Estimator) -->
          <a href="help/" target="_blank" id="nav-help" class="text-slate-400 hover:text-amber-400 py-1 transition-colors flex items-center gap-1">
            <span>Help Center</span>
            <span class="text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded font-mono">Docs</span>
          </a>
        </nav>

        <!-- Zone 3: Actions & User Info -->
        <div class="flex items-center gap-3 shrink-0">
          <button type="button" onclick="exportPdf()" id="btn-export-pdf" class="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-xs shadow-sm shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>Export PDF</span>
          </button>

          <!-- Current User Profile & Sign Out Button -->
          <div class="flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
            <div class="hidden sm:block text-right">
              <div class="font-bold text-white truncate max-w-[140px]" id="current-user-name">Engr. Naveed Kauser</div>
              <div class="text-[10px] text-amber-400 font-bold" id="current-user-role">Administrator</div>
            </div>
            <button type="button" onclick="logout()" title="Sign Out & Return to Login" class="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span class="hidden lg:inline text-[11px] font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>

  <!-- ========================================== -->
  <!-- MAIN APPLICATION VIEW CONTAINER           -->
  <!-- ========================================== -->
  <main class="flex-1 pb-16 max-w-7xl mx-auto w-full px-4 sm:px-6 mt-6">

    <!-- Database Connection Status Banner -->
    <?php if ($db_connected): ?>
      <div class="no-print mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span><strong>MySQL Connected:</strong> Connected to <code class="text-white">eagle_eye_db</code> via PDO. Quotations are auto-synced to your MySQL database.</span>
        </div>
        <a href="eagle_eye_quotation_system.sql" download class="text-amber-400 hover:underline font-semibold text-[11px]">Download .sql Schema</a>
      </div>
    <?php else: ?>
      <div class="no-print mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          <span><strong>Local Offline Mode Active:</strong> All quotations, specs, and dynamic fields save securely in your browser's persistent storage. Import <code class="text-white font-mono">eagle_eye_quotation_system.sql</code> into phpMyAdmin to enable MySQL sync.</span>
        </div>
        <a href="help/" target="_blank" class="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[11px] hover:bg-amber-400">Setup MySQL Guide</a>
      </div>
    <?php endif; ?>

    <!-- ========================================== -->
    <!-- TAB 1: QUOTATION FORM & DYNAMIC BUILDER   -->
    <!-- ========================================== -->
    <div id="tab-editor" class="space-y-8">
      <!-- Title & Actions Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div class="flex items-center gap-3.5">
          <img src="assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png" alt="Logo" class="w-12 h-12 object-contain shrink-0 drop-shadow">
          <div>
            <span class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Commercial Quotation Builder</span>
            <h1 class="text-2xl font-black text-white tracking-tight" id="form-title">Quotation #00511</h1>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <button type="button" onclick="saveQuotation()" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span>Save Quotation</span>
          </button>
          <button type="button" onclick="switchTab('preview')" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            <span>Preview Document</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Main Form (8 Cols) -->
        <div class="lg:col-span-8 space-y-6">

          <!-- Card 1: Client & Scope Details -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 class="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                Recipient & Client Information
              </h2>
              <button type="button" onclick="openCustomFieldModal('client')" class="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">
                + Add Client Field
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Recipient Name / Attention *</label>
                <input type="text" id="input-client-name" value="Mr, Aamir Rind" oninput="updateLive()" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Site Location / City *</label>
                <input type="text" id="input-client-location" value="Hub Chowkey" oninput="updateLive()" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Client Phone</label>
                <input type="text" id="input-client-phone" value="+92 300 1234567" oninput="updateLive()" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Client Email</label>
                <input type="email" id="input-client-email" value="aamir.rind@client.com" oninput="updateLive()" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500">
              </div>
            </div>

            <!-- Dynamic Client Custom Fields Container -->
            <div id="dynamic-client-fields" class="space-y-2 pt-2"></div>
          </div>

          <!-- Card 2: Scope & Equipment Brand -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 class="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              Project Scope & System Brand
            </h2>
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Quotation Scope Subject *</label>
              <input type="text" id="input-subject" value="Supply & Installation Perimeter Security Electric Fence System (No. of Strands Wire-8)" oninput="updateLive()" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Equipment Brand *</label>
              <input type="text" id="input-brand" value="NEMTEX SOUTH AFRICA" oninput="updateLive()" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-500">
            </div>
          </div>

          <!-- Card 3: Dynamic Specifications & Line Items -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                  Description & Specifications (<span id="items-count">16</span> items)
                </h2>
                <p class="text-[11px] text-slate-400 mt-0.5">Rendered with golden bullet points on the official PDF document</p>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" onclick="openCustomFieldModal('specification')" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded cursor-pointer">
                  + Custom Param
                </button>
                <button type="button" onclick="addItem()" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded cursor-pointer">
                  + Add Line Item
                </button>
              </div>
            </div>

            <!-- Quick Presets -->
            <div class="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">1-Click Preset Security Components:</span>
              <div class="flex flex-wrap gap-1.5">
                <button type="button" onclick="addItem('Perimeter Energizer 8-Joules with UPS')" class="text-[10px] px-2 py-1 bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 rounded cursor-pointer">+ Energizer 8J</button>
                <button type="button" onclick="addItem('High Tensile Grade SS-316L Wire 1.2mm')" class="text-[10px] px-2 py-1 bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 rounded cursor-pointer">+ SS 316L Wire</button>
                <button type="button" onclick="addItem('Jurassic Heavy Duty Insulators NEMTEX')" class="text-[10px] px-2 py-1 bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 rounded cursor-pointer">+ Insulators</button>
                <button type="button" onclick="addItem('Copper Clad Chemical Earth Pit')" class="text-[10px] px-2 py-1 bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 rounded cursor-pointer">+ Earth Pit</button>
                <button type="button" onclick="addItem('Solar 50W Monocrystalline Backup Panel')" class="text-[10px] px-2 py-1 bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 rounded cursor-pointer">+ Solar Backup</button>
                <button type="button" onclick="addItem('GSM Auto-Dialer & SMS Alert Module')" class="text-[10px] px-2 py-1 bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 rounded cursor-pointer">+ GSM Dialer</button>
              </div>
            </div>

            <!-- List of Line Items -->
            <div id="items-list-container" class="space-y-2"></div>

            <!-- Custom Tech Specs -->
            <div id="dynamic-spec-fields" class="space-y-2 pt-2"></div>
          </div>

          <!-- Card 4: Terms & Conditions -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 class="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                Commercial Terms & Conditions (Page 2)
              </h2>
              <button type="button" onclick="addTerm()" class="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">
                + Add Clause
              </button>
            </div>

            <div id="terms-list-container" class="space-y-3"></div>

            <div class="pt-2">
              <label class="block text-xs font-semibold text-slate-400 mb-1">Closing Handwriting Script Note</label>
              <input type="text" id="input-closing-note" value="Thank you for your business" oninput="updateLive()" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-amber-300 font-semibold focus:outline-none focus:border-amber-500">
            </div>
          </div>
        </div>

        <!-- Sidebar (4 Cols) -->
        <div class="lg:col-span-4 space-y-6">
          <!-- Metadata Card -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 class="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-slate-800">
              Document Parameters
            </h2>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Quote Number *</label>
              <input type="text" id="input-quote-number" value="00511" oninput="updateLive()" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Quote Date</label>
                <input type="date" id="input-quote-date" value="2026-08-24" oninput="updateLive()" class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Valid Till</label>
                <input type="date" id="input-valid-till" value="2026-09-03" oninput="updateLive()" class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500">
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Currency</label>
              <select id="input-currency" onchange="updateLive()" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500">
                <option value="PKR" selected>Pakistani Rupee (PKR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="AED">UAE Dirham (AED)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
          </div>

          <!-- Financial Commercials Card -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 class="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-slate-800">
              Commercial Totals
            </h2>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Subtotal (PKR) *</label>
              <input type="number" id="input-subtotal" value="460000" oninput="calculateTotals()" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-base font-mono font-bold text-white focus:outline-none focus:border-amber-500">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Tax / GST %</label>
                <input type="number" id="input-tax-percent" value="0" oninput="calculateTotals()" class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Discount</label>
                <input type="number" id="input-discount" value="0" oninput="calculateTotals()" class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500">
              </div>
            </div>

            <div class="pt-3 border-t border-slate-800 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Quotation Value</span>
              <div class="text-2xl font-black font-mono-num text-amber-400 mt-1" id="display-total-sidebar">
                PKR 460,000
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 2: A4 PRINTABLE DOCUMENT PREVIEW      -->
    <!-- ========================================== -->
    <div id="tab-preview" class="hidden space-y-6">
      <!-- Toolbar -->
      <div class="no-print bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-400">View Page:</span>
          <button type="button" onclick="setDocPage('all')" id="btn-page-all" class="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded text-xs">Both Pages (1 & 2)</button>
          <button type="button" onclick="setDocPage('1')" id="btn-page-1" class="px-3 py-1 bg-slate-800 text-slate-300 hover:text-white font-bold rounded text-xs">Page 1</button>
          <button type="button" onclick="setDocPage('2')" id="btn-page-2" class="px-3 py-1 bg-slate-800 text-slate-300 hover:text-white font-bold rounded text-xs">Page 2</button>
        </div>

        <div class="flex items-center gap-2.5">
          <button type="button" onclick="window.print()" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            <span>Print A4</span>
          </button>
          <button type="button" onclick="exportPdf()" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>Export as PDF</span>
          </button>
        </div>
      </div>

      <!-- Quotation Printable Canvas Wrapper -->
      <div id="quotation-export-wrapper" class="flex flex-col items-center space-y-8 overflow-x-auto py-2">
        
        <!-- PAGE 1: Scope, Specifications, and Financial Totals -->
        <div id="quote-doc-page-1" class="print-sheet relative bg-white text-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between" style="width: 210mm; height: 297mm; max-height: 297mm; box-sizing: border-box; overflow: hidden;">
          
          <!-- Document Header -->
          <div class="relative w-full">
            <div class="relative w-full h-8 overflow-hidden flex items-stretch">
              <div class="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" style="width: 42%;"></div>
              <div class="h-full bg-amber-500" style="width: 32px; clip-path: polygon(0 0, 100% 0, 0 100%); margin-left: -1px;"></div>
              <div class="flex-1 bg-white"></div>
              <div class="h-full bg-slate-950 flex items-stretch justify-end" style="width: 28%; clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%);">
                <div class="w-3 h-full bg-amber-500"></div>
              </div>
            </div>

            <div class="px-8 pt-4 pb-3 flex items-center justify-between">
              <!-- Official Logo Lockup -->
              <div class="flex items-center gap-3">
                <img src="assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png" alt="Logo" class="w-16 h-16 object-contain drop-shadow-sm">
                <div>
                  <div class="font-black text-xl tracking-tight leading-none text-slate-950 uppercase">EAGLE EYE</div>
                  <div class="font-bold text-xs tracking-[0.24em] text-slate-800 uppercase mt-0.5">SECURITY SYSTEM</div>
                  <div class="w-full h-[2px] bg-amber-500 my-1"></div>
                  <div class="font-extrabold text-[9px] tracking-wider text-slate-900 uppercase">SECURE TODAY, SAFE TOMMOROW</div>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="text-right text-[11px] leading-relaxed max-w-[340px]">
                <div><span class="font-bold text-amber-600">Address:</span> <span class="font-medium text-slate-800">Plot No L161 Sector 48/E Korangi 2½ Karachi</span></div>
                <div><span class="font-bold text-amber-600">Email:</span> <span class="font-semibold text-slate-900">enquiry@eesecurity.com.pk</span></div>
                <div><span class="font-bold text-amber-600">Phone:</span> <span class="font-semibold text-slate-900 font-mono-num">+92 305 8396416</span></div>
                <div><span class="font-bold text-amber-600">Web:</span> <span class="font-semibold text-slate-900">www.eesecurity.com.pk</span></div>
              </div>
            </div>

            <div class="relative w-full h-[6px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>
          </div>

          <!-- Central Security Crest Watermark -->
          <div class="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.055] select-none overflow-hidden z-0">
            <img src="assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png" alt="Watermark" class="w-[450px] h-[450px] object-contain filter grayscale contrast-125">
          </div>

          <!-- Document Body -->
          <div class="relative z-10 px-8 py-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="grid grid-cols-12 gap-6 items-start pb-4 border-b border-slate-200">
                <div class="col-span-7">
                  <div class="text-sm font-black text-slate-900 uppercase mb-1">To</div>
                  <div class="text-base font-extrabold text-slate-950" id="doc-client-name">Mr, Aamir Rind</div>
                  <div class="text-xs text-slate-700 font-medium mt-0.5" id="doc-client-location">Hub Chowkey</div>
                  <div class="text-[11px] text-slate-600 mt-0.5" id="doc-client-contact">Phone: +92 300 1234567</div>
                  <div id="doc-custom-client-fields" class="mt-1 space-y-0.5"></div>
                </div>

                <div class="col-span-5 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                  <div class="flex justify-between py-1 border-b border-slate-200">
                    <span class="font-bold text-slate-700">Quote:</span>
                    <span class="font-black text-slate-950 font-mono-num" id="doc-quote-number">00511</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-slate-200">
                    <span class="font-bold text-slate-700">Quote Date:</span>
                    <span class="font-medium text-slate-900 font-mono-num" id="doc-quote-date">24-08-2026</span>
                  </div>
                  <div class="flex justify-between py-1">
                    <span class="font-bold text-slate-700">Valid Till:</span>
                    <span class="font-medium text-slate-900 font-mono-num" id="doc-valid-till">03-09-2026</span>
                  </div>
                </div>
              </div>

              <!-- Scope & Brand -->
              <div class="mt-4 mb-3">
                <h2 class="text-sm font-bold text-slate-900 leading-snug" id="doc-subject">
                  Supply & Installation Perimeter Security Electric Fence System (No. of Strands Wire-8)
                </h2>
                <div class="text-xs font-black text-amber-700 tracking-wide mt-1 uppercase">
                  Brand: <span class="text-slate-900 font-extrabold" id="doc-brand">NEMTEX SOUTH AFRICA</span>
                </div>
              </div>

              <!-- Description Header -->
              <div class="w-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1.5 rounded-t-sm shadow-xs flex items-center justify-between">
                <span class="text-white font-extrabold tracking-wider text-xs uppercase">Description</span>
                <span class="text-amber-100 font-medium text-[10px]">Specifications & Components</span>
              </div>

              <!-- Bullet Specifications -->
              <div class="border border-t-0 border-slate-200 rounded-b-sm bg-white/95 p-4 min-h-[360px]">
                <ul id="doc-items-list" class="space-y-1.5 text-xs text-slate-900 leading-normal"></ul>
                <div id="doc-custom-spec-fields" class="mt-3 pt-2 border-t border-slate-100 text-xs"></div>
              </div>
            </div>

            <!-- Financial Totals -->
            <div class="mt-4 flex flex-col items-end">
              <div class="w-72 bg-slate-50 border border-slate-200 rounded p-3 text-right">
                <div class="flex justify-between items-baseline py-1 text-xs">
                  <span class="font-bold text-slate-700">Subtotal</span>
                  <span class="font-bold font-mono-num text-slate-900" id="doc-subtotal">460.000</span>
                </div>
                <div class="flex justify-between items-baseline pt-2 mt-1 border-t-2 border-slate-900 text-sm">
                  <span class="font-black text-slate-900 uppercase">Total</span>
                  <div class="font-black font-mono-num text-base text-slate-950">
                    <span class="text-xs font-bold text-slate-700 mr-1.5" id="doc-currency">PKR</span>
                    <span id="doc-total">460.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Document Footer -->
          <footer class="w-full bg-black text-white border-t-2 border-amber-500 mt-auto pt-3 pb-2 px-6">
            <div class="grid grid-cols-12 gap-3 items-center">
              <div class="col-span-4 border-r border-slate-800 pr-3">
                <div class="text-amber-400 font-extrabold text-[10px] tracking-wider uppercase mb-1">OUR MISSION</div>
                <p class="text-[9px] text-slate-300 leading-snug">To deliver advanced security solution that protect people, property, and peace of mind.</p>
              </div>
              <div class="col-span-4 border-r border-slate-800 pr-3">
                <div class="text-amber-400 font-extrabold text-[10px] tracking-wider uppercase mb-1">OUR VISION</div>
                <p class="text-[9px] text-slate-300 leading-snug">To be a leading security solution provide, renowned for innovation, reliability, and customer trust.</p>
              </div>
              <div class="col-span-3">
                <div class="text-amber-400 font-extrabold text-[10px] tracking-wider uppercase mb-1">OUR SERVICES</div>
                <div class="text-[8.5px] text-slate-300 leading-tight space-y-0.5">
                  <div>Electric Fance System &middot; CCTV Solutions</div>
                  <div>DVR / NVR Solution &middot; Smart Security</div>
                  <div>Installation & Maintenance</div>
                </div>
              </div>
              <div class="col-span-1 flex justify-center">
                <div class="bg-white p-1 rounded border border-amber-500 shadow-sm" id="qr-container-1"></div>
              </div>
            </div>
          </footer>
        </div>

        <!-- PAGE 2: Terms & Conditions & Signatures -->
        <div id="quote-doc-page-2" class="print-sheet relative bg-white text-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between" style="width: 210mm; height: 297mm; max-height: 297mm; box-sizing: border-box; overflow: hidden;">
          <!-- Header (Page 2) -->
          <div class="relative w-full">
            <div class="relative w-full h-8 overflow-hidden flex items-stretch">
              <div class="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" style="width: 42%;"></div>
              <div class="h-full bg-amber-500" style="width: 32px; clip-path: polygon(0 0, 100% 0, 0 100%); margin-left: -1px;"></div>
              <div class="flex-1 bg-white"></div>
              <div class="h-full bg-slate-950 flex items-stretch justify-end" style="width: 28%; clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%);">
                <div class="w-3 h-full bg-amber-500"></div>
              </div>
            </div>
            <div class="px-8 pt-4 pb-3 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img src="assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png" alt="Logo" class="w-16 h-16 object-contain drop-shadow-sm">
                <div>
                  <div class="font-black text-xl tracking-tight leading-none text-slate-950 uppercase">EAGLE EYE</div>
                  <div class="font-bold text-xs tracking-[0.24em] text-slate-800 uppercase mt-0.5">SECURITY SYSTEM</div>
                  <div class="w-full h-[2px] bg-amber-500 my-1"></div>
                  <div class="font-extrabold text-[9px] tracking-wider text-slate-900 uppercase">SECURE TODAY, SAFE TOMMOROW</div>
                </div>
              </div>
              <div class="text-right text-[11px] leading-relaxed max-w-[340px]">
                <div><span class="font-bold text-amber-600">Address:</span> <span class="font-medium text-slate-800">Plot No L161 Sector 48/E Korangi 2½ Karachi</span></div>
                <div><span class="font-bold text-amber-600">Email:</span> <span class="font-semibold text-slate-900">enquiry@eesecurity.com.pk</span></div>
                <div><span class="font-bold text-amber-600">Phone:</span> <span class="font-semibold text-slate-900 font-mono-num">+92 305 8396416</span></div>
                <div><span class="font-bold text-amber-600">Web:</span> <span class="font-semibold text-slate-900">www.eesecurity.com.pk</span></div>
              </div>
            </div>
            <div class="relative w-full h-[6px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>
          </div>

          <!-- Central Watermark (Page 2) -->
          <div class="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.055] select-none overflow-hidden z-0">
            <img src="assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png" alt="Watermark" class="w-[450px] h-[450px] object-contain filter grayscale contrast-125">
          </div>

          <!-- Terms Content -->
          <div class="relative z-10 px-10 py-8 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3 mb-6">
                <h2 class="text-xl font-black text-slate-950 tracking-tight">Terms & Conditions:</h2>
                <div class="h-0.5 flex-1 bg-gradient-to-r from-amber-400 to-transparent"></div>
              </div>
              <div id="doc-terms-list" class="space-y-4 text-xs"></div>
            </div>

            <!-- Closing Note & Signatures -->
            <div class="mt-12 space-y-10">
              <div class="text-center">
                <div class="font-script text-4xl md:text-5xl text-amber-500 tracking-wide" id="doc-closing-note">
                  Thank you for your business
                </div>
              </div>

              <div class="grid grid-cols-2 gap-12 pt-8 border-t border-slate-200">
                <div class="text-left">
                  <div class="h-16 flex items-end">
                    <div class="border-b border-slate-400 w-48 mb-2"></div>
                  </div>
                  <div class="text-xs font-bold text-slate-900">Authorized Signature</div>
                  <div class="text-[11px] font-medium text-slate-600">Eagle Eye Security System</div>
                </div>

                <div class="text-right flex flex-col items-end">
                  <div class="h-16 flex items-end">
                    <div class="border-b border-slate-400 w-48 mb-2"></div>
                  </div>
                  <div class="text-xs font-bold text-slate-900">Client Acceptance & Seal</div>
                  <div class="text-[11px] font-medium text-slate-600" id="doc-client-acceptance">Mr, Aamir Rind</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer (Page 2) -->
          <footer class="w-full bg-black text-white border-t-2 border-amber-500 mt-auto pt-3 pb-2 px-6">
            <div class="grid grid-cols-12 gap-3 items-center">
              <div class="col-span-4 border-r border-slate-800 pr-3">
                <div class="text-amber-400 font-extrabold text-[10px] tracking-wider uppercase mb-1">OUR MISSION</div>
                <p class="text-[9px] text-slate-300 leading-snug">To deliver advanced security solution that protect people, property, and peace of mind.</p>
              </div>
              <div class="col-span-4 border-r border-slate-800 pr-3">
                <div class="text-amber-400 font-extrabold text-[10px] tracking-wider uppercase mb-1">OUR VISION</div>
                <p class="text-[9px] text-slate-300 leading-snug">To be a leading security solution provide, renowned for innovation, reliability, and customer trust.</p>
              </div>
              <div class="col-span-3">
                <div class="text-amber-400 font-extrabold text-[10px] tracking-wider uppercase mb-1">OUR SERVICES</div>
                <div class="text-[8.5px] text-slate-300 leading-tight space-y-0.5">
                  <div>Electric Fance System &middot; CCTV Solutions</div>
                  <div>DVR / NVR Solution &middot; Smart Security</div>
                  <div>Installation & Maintenance</div>
                </div>
              </div>
              <div class="col-span-1 flex justify-center">
                <div class="bg-white p-1 rounded border border-amber-500 shadow-sm" id="qr-container-2"></div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 3: MYSQL & PHP INTEGRATION CENTER      -->
    <!-- ========================================== -->
    <div id="tab-database" class="hidden space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <img src="assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png" alt="Logo" class="w-12 h-12 object-contain shrink-0 drop-shadow">
          <div>
            <span class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Database & Deployment Center</span>
            <h1 class="text-2xl font-black text-white tracking-tight">MySQL Schema & PHP Backend</h1>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <a href="help/" target="_blank" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-lg text-xs flex items-center gap-2">
            <span>View Help Documentation</span>
          </a>
          <a href="eagle_eye_quotation_system.sql" download class="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-2">
            <span>Download .sql File</span>
          </a>
        </div>
      </div>

      <!-- Quick Deployment Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 class="text-base font-bold text-white mb-2">Deploy in 3 Steps to WAMP / XAMPP / cPanel</h3>
        <ol class="list-decimal list-inside text-xs text-slate-300 space-y-2 leading-relaxed">
          <li><strong>Import Database:</strong> Open <code class="text-amber-400">http://localhost/phpmyadmin/</code>, click <em>Import</em>, and upload <code class="text-amber-300">eagle_eye_quotation_system.sql</code>.</li>
          <li><strong>Verify DB Credentials:</strong> Open <code class="text-amber-400">config/db.php</code> and confirm username <code class="text-slate-200">root</code> and password (empty by default).</li>
          <li><strong>Launch in Browser:</strong> Open <code class="text-amber-400 font-bold">http://localhost/eesi/</code>. Everything is ready to generate and export quotations!</li>
        </ol>
      </div>
    </div>

  </main>

  <!-- ========================================== -->
  <!-- MODALS                                     -->
  <!-- ========================================== -->

  <!-- Modal: Dynamic Custom Field -->
  <div id="modal-custom-field" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <h3 class="text-sm font-bold text-white">+ Add Dynamic Custom Field</h3>
        <button type="button" onclick="closeCustomFieldModal()" class="text-slate-400 hover:text-white text-lg">&times;</button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Field Name / Parameter Label *</label>
          <input type="text" id="modal-field-name" placeholder="e.g. NTN Number, Battery Backup, Site Engineer" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Target Section</label>
          <select id="modal-field-section" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500">
            <option value="client">Client & Billing Section</option>
            <option value="specification">Technical Specifications</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Default / Initial Value</label>
          <input type="text" id="modal-field-value" placeholder="Enter value..." class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500">
        </div>
        <div class="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
          <button type="button" onclick="closeCustomFieldModal()" class="px-3 py-1.5 text-xs text-slate-400 hover:text-white">Cancel</button>
          <button type="button" onclick="saveCustomField()" class="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs">Save Field</button>
        </div>
      </div>
    </div>
  </div> <!-- End #view-dashboard -->

  <!-- Notification Toast -->
  <div id="toast" class="hidden fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-lg shadow-2xl font-bold text-xs flex items-center gap-2">
    <span id="toast-text">Action completed successfully</span>
  </div>

  <!-- ========================================== -->
  <!-- JAVASCRIPT STATE ENGINE                    -->
  <!-- ========================================== -->
  <script>
    // Initial Seed Data matching uploaded PDF Quote 00511
    const defaultData = {
      quoteNumber: '00511',
      quoteDate: '2026-08-24',
      validTill: '2026-09-03',
      clientName: 'Mr, Aamir Rind',
      clientLocation: 'Hub Chowkey',
      clientPhone: '+92 300 1234567',
      clientEmail: 'aamir.rind@client.com',
      subject: 'Supply & Installation Perimeter Security Electric Fence System (No. of Strands Wire-8)',
      brand: 'NEMTEX SOUTH AFRICA',
      currency: 'PKR',
      subtotal: 460000,
      taxPercent: 0,
      taxAmount: 0,
      discount: 0,
      total: 460000,
      closingNote: 'Thank you for your business',
      items: [
        '1000 Running feet',
        '1 Original NEMTEX ENEGIZERS with Built-In UPS.',
        'Single Zones',
        '7 Amp Maintenance Free Battery',
        'Total Poles Height 40 Inch.',
        'Stainless Steel Square Tube Poles.',
        'Stainless Steel Sport Pipes.',
        'With PVC coated',
        'Jurassic Insulators NEMTEX.',
        'Number of Strands Wire Every 4',
        'Earth Spike.',
        '2Siren.',
        'Light.',
        'HT cable.',
        'S.S Wire 1.2mm grade 316 L',
        'Metal Enclosure.',
        'With GSM'
      ],
      terms: [
        { title: 'PRICES', content: 'Delivered and installed in Karachi, prices are in Pakistani Rupees without GST.' },
        { title: 'PAYMENT', content: '50% Advance along with order 50% After Commissioning.' },
        { title: 'DELIVERY', content: 'within 15 days of receiving the advance payment and the confirmed order.' },
        { title: 'VALIDITY', content: 'The prices are only available for a period of 15 days.' },
        { title: 'WARRANTY', content: 'Two years for System and One year for other maintenance.' }
      ],
      customFields: [
        { id: 'f1', name: 'Fence Wire Strands', value: '8-Strands High Tensile Grade 316L', section: 'specification' },
        { id: 'f2', name: 'Site Sector Code', value: 'Hub Industrial Perimeter Zone-A', section: 'client' }
      ]
    };

    // Load state from localStorage or defaults
    let appData = defaultData;
    try {
      const stored = localStorage.getItem('eagle_eye_php_data_v1');
      if (stored) appData = JSON.parse(stored);
    } catch(e) {}

    // Current authenticated user session
    let currentUser = null;
    let currentTab = 'editor';

    // Initialize application: First page MUST be login page!
    function init() {
      try {
        renderForm();
        updateLive();
        generateQR();

        // Check if there is an active session in sessionStorage
        const saved = sessionStorage.getItem('eagle_eye_session_user_v1');
        if (saved) {
          try {
            const u = JSON.parse(saved);
            if (u && u.name && u.role) {
              loginUser(u.name, u.role, u.email, false);
              return;
            }
          } catch(e) {}
        }

        // Default: FIRST PAGE IS ALWAYS LOGIN PAGE!
        showLoginView();
      } catch (err) {
        console.error('Safe initialization caught:', err);
        showLoginView();
      }
    }

    function showLoginView() {
      document.getElementById('view-login').classList.remove('hidden');
      document.getElementById('view-dashboard').classList.add('hidden');
    }

    function handleManualLogin(e) {
      if (e) e.preventDefault();
      const u = (document.getElementById('login-username').value || '').trim();
      const p = (document.getElementById('login-password').value || '').trim();
      const errEl = document.getElementById('login-error');

      if (!u || !p) {
        errEl.innerText = 'Please enter username and password.';
        errEl.classList.remove('hidden');
        return;
      }
      errEl.classList.add('hidden');

      const lower = u.toLowerCase();
      if (lower.includes('admin') || lower.includes('kauser')) {
        loginUser('Engr. Naveed Kauser', 'Administrator', u);
      } else if (lower.includes('sales') || lower.includes('mehmood') || lower.includes('asif')) {
        loginUser('Tariq Mehmood', 'Sales Manager', u);
      } else if (lower.includes('estimator') || lower.includes('ahmed') || lower.includes('tech')) {
        loginUser('Zeeshan Ahmed', 'Technical Estimator', u);
      } else {
        loginUser(u.split('@')[0], 'Sales Manager', u);
      }
    }

    function togglePasswordVisibility() {
      const pwd = document.getElementById('login-password');
      const txt = document.getElementById('pwd-toggle-text');
      if (pwd.type === 'password') {
        pwd.type = 'text';
        txt.innerText = 'Hide';
      } else {
        pwd.type = 'password';
        txt.innerText = 'Show';
      }
    }

    function loginUser(name, role, email, notify = true) {
      currentUser = { name, role, email };
      try {
        sessionStorage.setItem('eagle_eye_session_user_v1', JSON.stringify(currentUser));
      } catch(e) {}

      document.getElementById('current-user-name').innerText = name;
      applyRoleMenus(role);

      document.getElementById('view-login').classList.add('hidden');
      document.getElementById('view-dashboard').classList.remove('hidden');

      switchTab('editor');
      if (notify) {
        showToast('Signed in as ' + name + ' (' + role + ')');
      }
    }

    function logout() {
      currentUser = null;
      try {
        sessionStorage.removeItem('eagle_eye_session_user_v1');
      } catch(e) {}
      showLoginView();
      showToast('Signed out successfully');
    }

    function applyRoleMenus(role) {
      const navEditor = document.getElementById('nav-editor');
      const navPreview = document.getElementById('nav-preview');
      const navDatabase = document.getElementById('nav-database');
      const navHelp = document.getElementById('nav-help');
      const userRoleEl = document.getElementById('current-user-role');

      if (userRoleEl) {
        userRoleEl.innerText = role;
        if (role === 'Administrator') userRoleEl.className = 'text-[10px] text-amber-400 font-bold';
        else if (role === 'Sales Manager') userRoleEl.className = 'text-[10px] text-sky-400 font-bold';
        else if (role === 'Technical Estimator') userRoleEl.className = 'text-[10px] text-emerald-400 font-bold';
      }

      // 1. Editor & Preview: Visible to all
      if (navEditor) navEditor.style.display = 'inline-block';
      if (navPreview) navPreview.style.display = 'inline-block';

      // 2. MySQL & PHP: Administrator ONLY (Hidden for Sales Manager & Technical Estimator)
      if (navDatabase) {
        if (role === 'Administrator') {
          navDatabase.style.display = 'inline-flex';
        } else {
          navDatabase.style.display = 'none';
        }
      }

      // 3. Help: Administrator & Sales Manager (Hidden for Technical Estimator)
      if (navHelp) {
        if (role === 'Technical Estimator') {
          navHelp.style.display = 'none';
        } else {
          navHelp.style.display = 'inline-flex';
        }
      }
    }

    function renderForm() {
      // Items list
      const itemsContainer = document.getElementById('items-list-container');
      itemsContainer.innerHTML = '';
      appData.items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'flex items-center gap-2 p-1.5 bg-slate-950 rounded border border-slate-800';
        div.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0 ml-1"></span>
          <input type="text" value="${escapeHtml(item)}" oninput="updateItem(${index}, this.value)" class="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-amber-500">
          <button type="button" onclick="removeItem(${index})" class="text-slate-500 hover:text-rose-400 p-1 text-xs cursor-pointer">&times;</button>
        `;
        itemsContainer.appendChild(div);
      });
      document.getElementById('items-count').innerText = appData.items.length;

      // Terms list
      const termsContainer = document.getElementById('terms-list-container');
      termsContainer.innerHTML = '';
      appData.terms.forEach((term, index) => {
        const div = document.createElement('div');
        div.className = 'p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5';
        div.innerHTML = `
          <div class="flex items-center justify-between">
            <input type="text" value="${escapeHtml(term.title)}" oninput="updateTermTitle(${index}, this.value)" class="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs font-black text-amber-400 uppercase">
            <button type="button" onclick="removeTerm(${index})" class="text-slate-500 hover:text-rose-400 text-xs cursor-pointer">&times;</button>
          </div>
          <textarea rows="2" oninput="updateTermContent(${index}, this.value)" class="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200">${escapeHtml(term.content)}</textarea>
        `;
        termsContainer.appendChild(div);
      });

      renderCustomFields();
    }

    function renderCustomFields() {
      const clientContainer = document.getElementById('dynamic-client-fields');
      const specContainer = document.getElementById('dynamic-spec-fields');
      clientContainer.innerHTML = '';
      specContainer.innerHTML = '';

      appData.customFields.forEach(f => {
        const div = document.createElement('div');
        div.className = 'flex items-center gap-2 p-1.5 bg-slate-950 rounded border border-slate-800';
        div.innerHTML = `
          <span class="text-xs font-bold text-amber-500 w-36 truncate">${escapeHtml(f.name)}:</span>
          <input type="text" value="${escapeHtml(f.value)}" oninput="updateCustomFieldValue('${f.id}', this.value)" class="flex-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white">
          <button type="button" onclick="deleteCustomField('${f.id}')" class="text-slate-500 hover:text-rose-400 text-xs cursor-pointer">&times;</button>
        `;
        if (f.section === 'client') clientContainer.appendChild(div);
        else specContainer.appendChild(div);
      });
    }

    function updateLive() {
      // Collect form inputs
      appData.quoteNumber = document.getElementById('input-quote-number').value;
      appData.quoteDate = document.getElementById('input-quote-date').value;
      appData.validTill = document.getElementById('input-valid-till').value;
      appData.clientName = document.getElementById('input-client-name').value;
      appData.clientLocation = document.getElementById('input-client-location').value;
      appData.clientPhone = document.getElementById('input-client-phone').value;
      appData.clientEmail = document.getElementById('input-client-email').value;
      appData.subject = document.getElementById('input-subject').value;
      appData.brand = document.getElementById('input-brand').value;
      appData.currency = document.getElementById('input-currency').value;
      appData.closingNote = document.getElementById('input-closing-note').value;

      // Update Printable Document Elements
      document.getElementById('form-title').innerText = 'Quotation #' + appData.quoteNumber;
      document.getElementById('doc-quote-number').innerText = appData.quoteNumber;
      document.getElementById('doc-quote-date').innerText = formatDate(appData.quoteDate);
      document.getElementById('doc-valid-till').innerText = formatDate(appData.validTill);
      document.getElementById('doc-client-name').innerText = appData.clientName || 'Valued Client';
      document.getElementById('doc-client-location').innerText = appData.clientLocation || '';
      document.getElementById('doc-client-contact').innerText = appData.clientPhone ? 'Phone: ' + appData.clientPhone : '';
      document.getElementById('doc-subject').innerText = appData.subject;
      document.getElementById('doc-brand').innerText = appData.brand;
      document.getElementById('doc-currency').innerText = appData.currency;
      document.getElementById('doc-closing-note').innerText = appData.closingNote || 'Thank you for your business';
      document.getElementById('doc-client-acceptance').innerText = appData.clientName || 'Client';

      // Document Items
      const docItemsList = document.getElementById('doc-items-list');
      docItemsList.innerHTML = '';
      appData.items.forEach(it => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2.5';
        li.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1 ring-2 ring-amber-200"></span>
          <span class="font-medium text-slate-900">${escapeHtml(it)}</span>
        `;
        docItemsList.appendChild(li);
      });

      // Document Terms
      const docTermsList = document.getElementById('doc-terms-list');
      docTermsList.innerHTML = '';
      appData.terms.forEach(term => {
        const div = document.createElement('div');
        div.className = 'flex items-start gap-3';
        div.innerHTML = `
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1 ring-2 ring-amber-200"></span>
          <div>
            <div class="font-black text-slate-950 uppercase text-xs">${escapeHtml(term.title)}</div>
            <div class="text-slate-800 font-medium text-xs mt-0.5 leading-relaxed">${escapeHtml(term.content)}</div>
          </div>
        `;
        docTermsList.appendChild(div);
      });

      // Custom fields on document
      const docClientFields = document.getElementById('doc-custom-client-fields');
      const docSpecFields = document.getElementById('doc-custom-spec-fields');
      docClientFields.innerHTML = '';
      docSpecFields.innerHTML = '';
      appData.customFields.forEach(f => {
        if (!f.value) return;
        if (f.section === 'client') {
          docClientFields.innerHTML += `<div class="text-[11px] text-slate-700 font-medium"><strong class="text-amber-700">${escapeHtml(f.name)}:</strong> ${escapeHtml(f.value)}</div>`;
        } else {
          docSpecFields.innerHTML += `<div class="text-xs text-slate-800 font-medium mb-1"><strong class="text-amber-700">&bull; ${escapeHtml(f.name)}:</strong> ${escapeHtml(f.value)}</div>`;
        }
      });

      calculateTotals();
    }

    function calculateTotals() {
      const subtotal = parseFloat(document.getElementById('input-subtotal').value) || 0;
      const taxPercent = parseFloat(document.getElementById('input-tax-percent').value) || 0;
      const discount = parseFloat(document.getElementById('input-discount').value) || 0;

      const taxAmount = (subtotal * taxPercent) / 100;
      const total = Math.max(0, subtotal + taxAmount - discount);

      appData.subtotal = subtotal;
      appData.taxPercent = taxPercent;
      appData.taxAmount = taxAmount;
      appData.discount = discount;
      appData.total = total;

      const formattedSubtotal = formatNumber(subtotal);
      const formattedTotal = formatNumber(total);

      document.getElementById('doc-subtotal').innerText = formattedSubtotal;
      document.getElementById('doc-total').innerText = formattedTotal;
      document.getElementById('display-total-sidebar').innerText = appData.currency + ' ' + formattedTotal;

      saveLocal();
    }

    function addItem(text = '') {
      appData.items.push(text || 'New Perimeter Specification Component');
      renderForm();
      updateLive();
      showToast('Line item added');
    }

    function removeItem(index) {
      appData.items.splice(index, 1);
      renderForm();
      updateLive();
      showToast('Line item removed');
    }

    function updateItem(index, val) {
      appData.items[index] = val;
      updateLive();
    }

    function addTerm() {
      appData.terms.push({ title: 'SPECIAL CONDITION', content: 'Commercial delivery and warranty terms apply.' });
      renderForm();
      updateLive();
      showToast('Clause added');
    }

    function removeTerm(index) {
      appData.terms.splice(index, 1);
      renderForm();
      updateLive();
    }

    function updateTermTitle(index, val) {
      appData.terms[index].title = val;
      updateLive();
    }

    function updateTermContent(index, val) {
      appData.terms[index].content = val;
      updateLive();
    }

    // Dynamic Custom Field Handlers
    let currentModalSection = 'client';
    function openCustomFieldModal(sec) {
      currentModalSection = sec;
      document.getElementById('modal-field-section').value = sec;
      document.getElementById('modal-field-name').value = '';
      document.getElementById('modal-field-value').value = '';
      document.getElementById('modal-custom-field').classList.remove('hidden');
    }

    function closeCustomFieldModal() {
      document.getElementById('modal-custom-field').classList.add('hidden');
    }

    function saveCustomField() {
      const name = document.getElementById('modal-field-name').value.trim();
      const section = document.getElementById('modal-field-section').value;
      const value = document.getElementById('modal-field-value').value.trim();
      if (!name) return;

      appData.customFields.push({
        id: 'f_' + Date.now(),
        name,
        section,
        value
      });

      closeCustomFieldModal();
      renderCustomFields();
      updateLive();
      showToast('Custom field added');
    }

    function updateCustomFieldValue(id, val) {
      const target = appData.customFields.find(f => f.id === id);
      if (target) { target.value = val; updateLive(); }
    }

    function deleteCustomField(id) {
      appData.customFields = appData.customFields.filter(f => f.id !== id);
      renderCustomFields();
      updateLive();
      showToast('Field deleted');
    }

    // Tabs Switcher with Role Enforcement
    function switchTab(tab) {
      if (currentUser && currentUser.role !== 'Administrator' && tab === 'database') {
        tab = 'editor';
      }

      currentTab = tab;
      ['editor', 'preview', 'database'].forEach(t => {
        const el = document.getElementById('tab-' + t);
        if (el) el.classList.add('hidden');
        const nav = document.getElementById('nav-' + t);
        if (nav) {
          nav.className = 'text-slate-400 hover:text-white py-1 transition-colors cursor-pointer';
        }
      });

      const activeEl = document.getElementById('tab-' + tab);
      if (activeEl) activeEl.classList.remove('hidden');
      const activeNav = document.getElementById('nav-' + tab);
      if (activeNav) {
        activeNav.className = 'text-amber-400 font-bold border-b-2 border-amber-400 py-1 transition-colors cursor-pointer';
      }

      if (tab === 'preview') {
        updateLive();
        generateQR();
      }
    }

    function setDocPage(page) {
      const p1 = document.getElementById('quote-doc-page-1');
      const p2 = document.getElementById('quote-doc-page-2');
      if (page === '1') { 
        if (p1) p1.classList.remove('hidden'); 
        if (p2) p2.classList.add('hidden'); 
      } else if (page === '2') { 
        if (p1) p1.classList.add('hidden'); 
        if (p2) p2.classList.remove('hidden'); 
      } else { 
        if (p1) p1.classList.remove('hidden'); 
        if (p2) p2.classList.remove('hidden'); 
      }
    }

    // Export PDF via html2pdf with strict 3.5s timeout and native A4 print fallback
    function exportPdf() {
      const btn = document.getElementById('btn-export-pdf');
      const originalText = btn ? btn.innerHTML : '';
      if (btn) {
        btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg><span>Preparing PDF...</span>`;
        btn.disabled = true;
      }

      // Switch to preview tab so the element is rendered in DOM
      switchTab('preview');
      setDocPage('all');
      showToast('Generating official A4 PDF document...');

      const restoreBtn = () => {
        if (btn) {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      };

      let completed = false;
      // Safety timeout: 3.5 seconds MAX. Never let the browser freeze or hang!
      const safetyTimer = setTimeout(() => {
        if (!completed) {
          completed = true;
          restoreBtn();
          showToast('Opening native high-resolution A4 print dialog...');
          window.print();
        }
      }, 3500);

      try {
        const element = document.getElementById('quotation-export-wrapper');
        if (typeof html2pdf !== 'undefined' && element) {
          const opt = {
            margin: 0,
            filename: 'EagleEye_Quotation_' + (appData.quoteNumber || '00511') + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(() => {
              if (!completed) {
                completed = true;
                clearTimeout(safetyTimer);
                restoreBtn();
                showToast('PDF downloaded successfully!');
              }
            })
            .catch(err => {
              console.warn('html2pdf catch, falling back to print:', err);
              if (!completed) {
                completed = true;
                clearTimeout(safetyTimer);
                restoreBtn();
                window.print();
              }
            });
        } else {
          clearTimeout(safetyTimer);
          restoreBtn();
          window.print();
        }
      } catch (err) {
        console.warn('PDF export catch:', err);
        if (!completed) {
          completed = true;
          clearTimeout(safetyTimer);
          restoreBtn();
          window.print();
        }
      }
    }

    // Save to Local & MySQL
    function saveQuotation() {
      saveLocal();
      fetch('api/quotations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote_number: appData.quoteNumber,
          quote_date: appData.quoteDate,
          valid_till: appData.validTill,
          client_name: appData.clientName,
          client_location: appData.clientLocation,
          client_phone: appData.clientPhone,
          client_email: appData.clientEmail,
          subject: appData.subject,
          brand: appData.brand,
          currency: appData.currency,
          subtotal: appData.subtotal,
          total_amount: appData.total,
          items: appData.items.map(it => ({ description: it, is_bullet: 1 })),
          terms: appData.terms,
          custom_fields: appData.customFields
        })
      }).then(r => r.json()).then(res => {
        if (res.success) showToast('Saved to MySQL Database & Local Storage');
        else showToast('Saved locally in browser');
      }).catch(() => {
        showToast('Saved locally in browser');
      });
    }

    function saveLocal() {
      try { localStorage.setItem('eagle_eye_php_data_v1', JSON.stringify(appData)); } catch(e){}
    }

    // QR Code with Offline SVG Fallback
    function generateQR() {
      const q1 = document.getElementById("qr-container-1");
      const q2 = document.getElementById("qr-container-2");
      if (!q1 && !q2) return;

      try {
        if (typeof QRCode !== 'undefined') {
          if (q1) {
            q1.innerHTML = '';
            new QRCode(q1, { text: "https://www.eesecurity.com.pk", width: 44, height: 44 });
          }
          if (q2) {
            q2.innerHTML = '';
            new QRCode(q2, { text: "https://www.eesecurity.com.pk", width: 44, height: 44 });
          }
          return;
        }
      } catch (e) {
        console.warn('QRCode JS warning, rendering offline SVG:', e);
      }

      // Safe standalone SVG QR fallback (Works 100% offline, zero network dependencies)
      const svg = `<svg viewBox="0 0 33 33" class="w-11 h-11 text-slate-900" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0h11v11H0V0zm2 2v7h7V2H2zm2 2h3v3H4V4zM22 0h11v11H22V0zm2 2v7h7V2h-7zm2 2h3v3h-3V4zM0 22h11v11H0V22zm2 2v7h7v-7H2zm2 2h3v3H4v-3zm14-10h4v2h-4v-2zm-4 4h2v2h-2v-2zm4 0h2v4h-2v-4zm-4 6h4v2h-4v-2zm8-6h2v2h-2v-2zm2 4h3v2h-3v-2zm-2 2h2v4h-2v-4zm4-4h2v6h-2v-6zm3-8h2v2h-2v-2zm-6 2h2v2h-2v-2zm4 2h2v2h-2v-2zm-4 2h2v2h-2v-2zm-8-6h2v2h-2v-2zm2 2h2v2h-2v-2zm0-4h2v2h-2v-2zm-2 0h-2v-2h2v2zm6-4h2v2h-2V6zm2 2h2v2h-2V8zm-2 2h2v2h-2v-2z"/>
      </svg>`;
      if (q1) q1.innerHTML = svg;
      if (q2) q2.innerHTML = svg;
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-text').innerText = msg;
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 3500);
    }

    function formatNumber(num) {
      return Number(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    function formatDate(isoStr) {
      if (!isoStr) return '';
      const parts = isoStr.split('-');
      if (parts.length === 3) return parts[2] + '-' + parts[1] + '-' + parts[0];
      return isoStr;
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Run on startup
    document.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>
