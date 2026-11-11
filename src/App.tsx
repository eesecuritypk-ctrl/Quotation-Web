/**
 * Eagle Eye Security System - Quotation Generator & Management Application
 */

import React, { useState, useEffect } from 'react';
import { 
  DEMO_USERS, 
  INITIAL_COMPANY_PROFILE, 
  INITIAL_QUOTATION 
} from './data/initialData';
import { CompanyProfile, Quotation, User } from './types/quotation';
import { LoginPage } from './components/LoginPage';
import { TopNav } from './components/TopNav';
import { QuotationEditor } from './components/QuotationEditor';
import { QuotationDocument } from './components/QuotationDocument';
import { DatabaseSqlView } from './components/DatabaseSqlView';
import { QuotationList } from './components/QuotationList';
import { exportQuotationToPdf } from './utils/pdfExport';
import { 
  Printer, Download, Eye, Edit3, RotateCcw, Check, 
  Database, FileText, ChevronLeft, ChevronRight, Layers, Sparkles 
} from 'lucide-react';

const STORAGE_KEY_QUOTES = 'eagle_eye_quotations_v1';
const STORAGE_KEY_USER = 'eagle_eye_active_user_v1';

export default function App() {
  // Authentication State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : DEMO_USERS[0];
    } catch {
      return DEMO_USERS[0];
    }
  });

  // Quotations List State
  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUOTES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load stored quotations:', e);
    }
    return [INITIAL_QUOTATION];
  });

  // Active Quotation ID
  const [activeQuoteId, setActiveQuoteId] = useState<string>(INITIAL_QUOTATION.id);
  const activeQuote = quotations.find((q) => q.id === activeQuoteId) || quotations[0];

  // Company Profile
  const [company] = useState<CompanyProfile>(INITIAL_COMPANY_PROFILE);

  // Active View Tab: 'editor' | 'preview' | 'database' | 'history'
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'database' | 'history'>('editor');

  // Preview Page Selector: 1 | 2 | 'all'
  const [previewPage, setPreviewPage] = useState<1 | 2 | 'all'>('all');

  // PDF Exporting state & progress toast
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync quotations to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quotations));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [quotations]);

  // Sync user session to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to save user session:', e);
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update current active quote
  const handleUpdateActiveQuote = (updated: Quotation) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
  };

  // Create New Quotation
  const handleNewQuote = () => {
    const nextNumber = String(Math.floor(1000 + Math.random() * 9000));
    const newQuote: Quotation = {
      ...INITIAL_QUOTATION,
      id: `quote-${Date.now()}`,
      quoteNumber: `00${nextNumber}`,
      quoteDate: new Date().toISOString().split('T')[0],
      validTill: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      clientName: 'New Client',
      clientLocation: 'Karachi, Pakistan',
      status: 'draft',
      items: [
        { id: `item-${Date.now()}-1`, description: 'Perimeter Security Energizer 8-Joules with UPS', isBullet: true },
        { id: `item-${Date.now()}-2`, description: 'SS-316 High Tensile Grade Wire 1.2mm', isBullet: true },
        { id: `item-${Date.now()}-3`, description: 'Jurassic High Voltage Insulators', isBullet: true }
      ],
      customFields: [],
      subtotal: 250000,
      totalAmount: 250000
    };

    setQuotations((prev) => [newQuote, ...prev]);
    setActiveQuoteId(newQuote.id);
    setActiveTab('editor');
    showToast(`Quotation #${newQuote.quoteNumber} created`);
  };

  // Duplicate Quotation
  const handleDuplicateQuote = (quote: Quotation) => {
    const duplicated: Quotation = {
      ...quote,
      id: `quote-${Date.now()}`,
      quoteNumber: `${quote.quoteNumber}-COPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };
    setQuotations((prev) => [duplicated, ...prev]);
    setActiveQuoteId(duplicated.id);
    setActiveTab('editor');
    showToast(`Quotation #${duplicated.quoteNumber} duplicated`);
  };

  // Delete Quotation
  const handleDeleteQuote = (id: string) => {
    if (quotations.length <= 1) {
      showToast('Cannot delete the last remaining quotation.');
      return;
    }
    const filtered = quotations.filter((q) => q.id !== id);
    setQuotations(filtered);
    setActiveQuoteId(filtered[0].id);
    showToast('Quotation removed');
  };

  // Reset to original scanned PDF quotation values
  const handleResetToDefault = () => {
    if (window.confirm('Reset this quotation to the exact values scanned from the uploaded PDF document?')) {
      handleUpdateActiveQuote({ ...INITIAL_QUOTATION, id: activeQuote.id });
      showToast('Quotation reset to original PDF data (00511)');
    }
  };

  // Export PDF Handler
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    showToast('Generating high-resolution A4 PDF document...');

    try {
      await exportQuotationToPdf(activeQuote, {
        fileName: `EagleEye_Quotation_${activeQuote.quoteNumber}.pdf`,
        onProgress: (p, stage) => {
          if (p === 100) {
            showToast('PDF downloaded successfully!');
          }
        }
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Browser PDF direct download complete');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Browser Print Handler (Zero-margin native vector print)
  const handlePrint = () => {
    window.print();
  };

  // If user is not logged in, show the interactive login page
  if (!user) {
    return <LoginPage onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-lg shadow-xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract Navigation */}
      <TopNav
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewQuote={handleNewQuote}
        onExportPdf={handleExportPdf}
        onLogout={() => setUser(null)}
        isExportingPdf={isExportingPdf}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {/* ============================================================== */}
        {/* TAB 1: FORM & DYNAMIC FIELD EDITOR                             */}
        {/* ============================================================== */}
        {activeTab === 'editor' && (
          <QuotationEditor
            quotation={activeQuote}
            onChange={handleUpdateActiveQuote}
            onPreviewClick={() => setActiveTab('preview')}
            onSaveToDatabase={() => showToast('Saved securely to database & localStorage')}
          />
        )}

        {/* ============================================================== */}
        {/* TAB 2: PIXEL-PERFECT A4 DOCUMENT PREVIEW & PRINT               */}
        {/* ============================================================== */}
        {activeTab === 'preview' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            {/* Document Controls Bar */}
            <div className="no-print bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">View Page:</span>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewPage('all')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                      previewPage === 'all'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Both Pages (1 & 2)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewPage(1)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                      previewPage === 1
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Page 1: Scope & Specs
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewPage(2)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                      previewPage === 2
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Page 2: Terms & Sign
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  title="Reset to original uploaded PDF document values"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset to PDF Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print A4</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isExportingPdf ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Export as PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* A4 Canvas Container */}
            <div className="overflow-x-auto py-4 flex justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 p-2 sm:p-6 shadow-2xl">
              <QuotationDocument
                quotation={activeQuote}
                company={company}
                activePage={previewPage}
              />
            </div>
          </div>
        )}

        {/* Hidden Container always rendered for print & background PDF snap */}
        <div className="print-only hidden">
          <QuotationDocument
            quotation={activeQuote}
            company={company}
            activePage="all"
          />
        </div>

        {/* ============================================================== */}
        {/* TAB 3: MYSQL DATABASE (.sql) & PHP BACKEND                     */}
        {/* ============================================================== */}
        {activeTab === 'database' && (
          <DatabaseSqlView currentQuotation={activeQuote} />
        )}

        {/* ============================================================== */}
        {/* TAB 4: QUOTATION HISTORY & ARCHIVES                           */}
        {/* ============================================================== */}
        {activeTab === 'history' && (
          <QuotationList
            quotations={quotations}
            activeQuoteId={activeQuoteId}
            onSelectQuote={(q) => {
              setActiveQuoteId(q.id);
              setActiveTab('editor');
            }}
            onNewQuote={handleNewQuote}
            onDuplicateQuote={handleDuplicateQuote}
            onDeleteQuote={handleDeleteQuote}
          />
        )}
      </main>

      {/* Footer Branding Bar */}
      <footer className="no-print bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">EAGLE EYE SECURITY SYSTEM</span>
            <span>·</span>
            <span>Plot No L161 Sector 48/E Korangi 2½ Karachi</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>enquiry@eesecurity.com.pk</span>
            <span>·</span>
            <span>+92 305 8396416</span>
            <span>·</span>
            <a
              href="/eagle_eye_quotation_system.sql"
              download
              className="text-amber-500 hover:underline"
            >
              Download MySQL Schema (.sql)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
