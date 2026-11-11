/**
 * Eagle Eye Security System - Quotation Archives & History Manager
 */

import React, { useState } from 'react';
import { Quotation, QuotationStatus } from '../types/quotation';
import { 
  FileText, Plus, Search, Filter, ArrowUpRight, Copy, Trash2, 
  Download, Eye, Edit3, Calendar, CheckCircle2 
} from 'lucide-react';

interface QuotationListProps {
  quotations: Quotation[];
  activeQuoteId: string;
  onSelectQuote: (quote: Quotation) => void;
  onNewQuote: () => void;
  onDuplicateQuote: (quote: Quotation) => void;
  onDeleteQuote: (id: string) => void;
}

export const QuotationList: React.FC<QuotationListProps> = ({
  quotations,
  activeQuoteId,
  onSelectQuote,
  onNewQuote,
  onDuplicateQuote,
  onDeleteQuote
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredQuotes = quotations.filter((q) => {
    const matchesSearch =
      q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.clientLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'approved':
        return <span className="text-[11px] font-bold text-emerald-400">Approved</span>;
      case 'sent':
        return <span className="text-[11px] font-bold text-amber-400">Sent</span>;
      case 'draft':
        return <span className="text-[11px] font-bold text-slate-400">Draft</span>;
      case 'rejected':
        return <span className="text-[11px] font-bold text-rose-400">Declined</span>;
      case 'expired':
        return <span className="text-[11px] font-bold text-neutral-500">Expired</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <img
            src="/assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png"
            alt="Eagle Eye Logo"
            className="w-12 h-12 object-contain shrink-0 drop-shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-0.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Commercial Document Archives</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Quotation Library & Records
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Search, duplicate, and manage all issued security proposals
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNewQuote}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Quotation</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by quote #, client, or site..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'draft', 'sent', 'approved', 'expired'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Quotation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {filteredQuotes.map((quote) => {
          const isActive = quote.id === activeQuoteId;
          return (
            <div
              key={quote.id}
              className={`bg-slate-900 border rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-lg ${
                isActive
                  ? 'border-amber-500/80 shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Row: Quote # & Status */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      #{quote.quoteNumber}
                    </span>
                    {isActive && (
                      <span className="text-[10px] text-amber-500 font-semibold">Active</span>
                    )}
                  </div>
                  <div>{getStatusBadge(quote.status)}</div>
                </div>

                {/* Client & Scope */}
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-white truncate">
                    {quote.clientName}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">
                    {quote.clientLocation}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed font-medium">
                    {quote.subject}
                  </p>
                </div>

                {/* Specs Count & Date */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{quote.items.length} Specifications</span>
                  <span className="tabular-nums font-mono">{quote.quoteDate}</span>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Total
                  </div>
                  <div className="text-base font-black font-mono text-amber-400 tabular-nums">
                    {quote.currency} {quote.totalAmount.toLocaleString('en-US')}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onDuplicateQuote(quote)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="Duplicate Quotation"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectQuote(quote)}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 mt-6">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No Quotations Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or create a fresh proposal
          </p>
        </div>
      )}
    </div>
  );
};
