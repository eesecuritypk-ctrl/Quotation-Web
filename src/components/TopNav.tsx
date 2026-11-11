/**
 * Eagle Eye Security System - Top Navigation Bar
 * Follows the strict 3-zone Top Bar Contract:
 * [Brand Wordmark] - [4-5 Nav Links] - [Primary Action / User]
 */

import React from 'react';
import { User } from '../types/quotation';
import { EagleEyeLogo } from './EagleEyeLogo';
import { LogOut, Database, FileText, PlusCircle, Printer, Download } from 'lucide-react';

interface TopNavProps {
  user: User;
  activeTab: 'editor' | 'preview' | 'database' | 'history';
  setActiveTab: (tab: 'editor' | 'preview' | 'database' | 'history') => void;
  onNewQuote: () => void;
  onExportPdf: () => void;
  onLogout: () => void;
  isExportingPdf?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  user,
  activeTab,
  setActiveTab,
  onNewQuote,
  onExportPdf,
  onLogout,
  isExportingPdf = false
}) => {
  return (
    <header className="no-print bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <EagleEyeLogo size="sm" showText={true} theme="dark" />
        </div>

        {/* Zone 2: Navigation Links (Single-line, 4-5 links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              activeTab === 'editor'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quotation Editor
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              activeTab === 'preview'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Document Preview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              activeTab === 'history'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quote Archives
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'database'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MySQL & PHP</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Profile Area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick PDF Export Primary Button */}
          <button
            type="button"
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm shadow-amber-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
          >
            {isExportingPdf ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </>
            )}
          </button>

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
            <div className="hidden sm:block text-right">
              <div className="font-semibold text-white truncate max-w-[120px]">
                {user.fullName}
              </div>
              <div className="text-[10px] text-amber-400/90 capitalize truncate">
                {user.role.replace('_', ' ')}
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
