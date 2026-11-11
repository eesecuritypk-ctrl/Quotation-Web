/**
 * Eagle Eye Security System - Quotation Form Editor
 * Dynamic form supporting real-time addition/removal of specifications,
 * custom fields, terms, and automatic financial calculations.
 */

import React, { useState } from 'react';
import { CustomField, CustomFieldSection, Quotation, QuotationItem, QuotationStatus, QuotationTerm } from '../types/quotation';
import { DynamicFieldModal } from './DynamicFieldModal';
import { 
  Plus, Trash2, GripVertical, Sparkles, SlidersHorizontal, 
  HelpCircle, CheckCircle, Calculator, FileCheck, Layers, Eye
} from 'lucide-react';

interface QuotationEditorProps {
  quotation: Quotation;
  onChange: (updated: Quotation) => void;
  onPreviewClick: () => void;
  onSaveToDatabase: () => void;
}

const PRESET_SPECS = [
  '1000 Running feet Perimeter Wire',
  'Original NEMTEX ENERGIZERS with Built-In UPS',
  'Multi-Zone Controller Panel with LCD',
  '12V 7Ah Maintenance Free Sealed Lead Battery',
  'Total Poles Height 40 Inch SS 304',
  'Stainless Steel Square Tube Poles 1.5" x 1.5"',
  'Jurassic High Voltage Insulators NEMTEX',
  'Copper Clad Earth Spike with Chemical Compound',
  '120dB Weatherproof Electronic Siren with Strobe Light',
  'High Tension 15kV Double Insulated HT Cable',
  'S.S Wire 1.2mm High Tensile Grade 316 L',
  'IP66 Weatherproof Metal Enclosure with Lock',
  'GSM Communicator with SMS & Call Alerts on Intrusion',
  'Solar PV Charging System with 50W Monocrystalline Panel'
];

export const QuotationEditor: React.FC<QuotationEditorProps> = ({
  quotation,
  onChange,
  onPreviewClick,
  onSaveToDatabase
}) => {
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [modalDefaultSection, setModalDefaultSection] = useState<CustomFieldSection>('client');

  // Helper updates
  const updateField = <K extends keyof Quotation>(key: K, value: Quotation[K]) => {
    const updated = { ...quotation, [key]: value, updatedAt: new Date().toISOString() };
    
    // Auto recalculate financials if subtotal, tax, or discount changed
    if (key === 'subtotal' || key === 'taxPercent' || key === 'discountAmount') {
      const sub = Number(key === 'subtotal' ? value : quotation.subtotal) || 0;
      const taxRate = Number(key === 'taxPercent' ? value : quotation.taxPercent) || 0;
      const discount = Number(key === 'discountAmount' ? value : quotation.discountAmount) || 0;
      
      const tax = (sub * taxRate) / 100;
      const total = Math.max(0, sub + tax - discount);
      
      updated.taxAmount = tax;
      updated.totalAmount = total;
    }

    onChange(updated);
  };

  // Line Item Handlers
  const handleAddItem = (description: string = '') => {
    const newItem: QuotationItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      description: description || 'New Specification Component',
      isBullet: true
    };
    onChange({
      ...quotation,
      items: [...quotation.items, newItem]
    });
  };

  const handleUpdateItem = (id: string, updates: Partial<QuotationItem>) => {
    const items = quotation.items.map((it) => (it.id === id ? { ...it, ...updates } : it));
    onChange({ ...quotation, items });
  };

  const handleDeleteItem = (id: string) => {
    const items = quotation.items.filter((it) => it.id !== id);
    onChange({ ...quotation, items });
  };

  // Custom Fields Handlers
  const handleOpenAddField = (section: CustomFieldSection) => {
    setModalDefaultSection(section);
    setIsFieldModalOpen(true);
  };

  const handleAddCustomField = (newField: CustomField) => {
    onChange({
      ...quotation,
      customFields: [...quotation.customFields, newField]
    });
  };

  const handleDeleteCustomField = (id: string) => {
    onChange({
      ...quotation,
      customFields: quotation.customFields.filter((f) => f.id !== id)
    });
  };

  const handleUpdateCustomField = (id: string, value: string) => {
    onChange({
      ...quotation,
      customFields: quotation.customFields.map((f) => (f.id === id ? { ...f, value } : f))
    });
  };

  // Terms Handlers
  const handleAddTerm = () => {
    const newTerm: QuotationTerm = {
      id: `term-${Date.now()}`,
      title: 'SPECIAL CLAUSE',
      content: 'Standard warranty and commercial compliance terms apply.'
    };
    onChange({
      ...quotation,
      terms: [...quotation.terms, newTerm]
    });
  };

  const handleUpdateTerm = (id: string, updates: Partial<QuotationTerm>) => {
    const terms = quotation.terms.map((t) => (t.id === id ? { ...t, ...updates } : t));
    onChange({ ...quotation, terms });
  };

  const handleDeleteTerm = (id: string) => {
    const terms = quotation.terms.filter((t) => t.id !== id);
    onChange({ ...quotation, terms });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-slate-100">
      {/* Dynamic Field Modal */}
      <DynamicFieldModal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        onAddField={handleAddCustomField}
        defaultSection={modalDefaultSection}
      />

      {/* Editor Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Interactive Quotation Builder</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Quotation #{quotation.quoteNumber}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Edit parameters, dynamically add specifications, and calibrate commercial totals
          </p>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSaveToDatabase}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Save to MySQL / Local</span>
          </button>

          <button
            type="button"
            onClick={onPreviewClick}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Document View</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column (Main Form): 8 Cols */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Quote Header & Client */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Client & Recipient Information
              </h2>
              <button
                type="button"
                onClick={() => handleOpenAddField('client')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Client Field</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Recipient Name / Attention *
                </label>
                <input
                  type="text"
                  value={quotation.clientName}
                  onChange={(e) => updateField('clientName', e.target.value)}
                  placeholder="Mr, Aamir Rind"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Location / Site City *
                </label>
                <input
                  type="text"
                  value={quotation.clientLocation}
                  onChange={(e) => updateField('clientLocation', e.target.value)}
                  placeholder="Hub Chowkey"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Client Phone / Contact
                </label>
                <input
                  type="text"
                  value={quotation.clientPhone || ''}
                  onChange={(e) => updateField('clientPhone', e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Client Email Address
                </label>
                <input
                  type="email"
                  value={quotation.clientEmail || ''}
                  onChange={(e) => updateField('clientEmail', e.target.value)}
                  placeholder="client@company.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Dynamic Client Fields Rendered */}
            {quotation.customFields.filter((f) => f.section === 'client').length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                  Custom Client Fields
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quotation.customFields
                    .filter((f) => f.section === 'client')
                    .map((field) => (
                      <div key={field.id} className="relative flex items-center gap-2">
                        <div className="flex-1">
                          <label className="block text-[11px] font-medium text-slate-400 mb-0.5">
                            {field.name}
                          </label>
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => handleUpdateCustomField(field.id, e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomField(field.id)}
                          className="mt-4 p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete Field"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Subject & Brand */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Project Scope & System Brand
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Quotation Subject Title *
              </label>
              <input
                type="text"
                value={quotation.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                placeholder="Supply & Installation Perimeter Security Electric Fence System (No. of Strands Wire-8)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Equipment Brand *
              </label>
              <input
                type="text"
                value={quotation.brand}
                onChange={(e) => updateField('brand', e.target.value)}
                placeholder="NEMTEX SOUTH AFRICA"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Section 3: Description & Dynamic Specifications */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Description & Specifications ({quotation.items.length} items)
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Line items rendered with golden bullet points on the official PDF document
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAddField('specification')}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Technical Param</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddItem()}
                  className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line Item</span>
                </button>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="mb-4 p-3 bg-slate-950 rounded-lg border border-slate-800/80">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Insert Security Fence Components</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {PRESET_SPECS.map((spec, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddItem(spec)}
                    className="text-[11px] px-2 py-1 rounded bg-slate-800/60 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700/60 hover:border-amber-500/40 text-slate-300 transition-colors cursor-pointer"
                  >
                    + {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {quotation.items.map((item, index) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-3 p-2 bg-slate-950/70 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
                >
                  {/* Golden bullet icon */}
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 ml-1.5 ring-2 ring-amber-500/30" />

                  {/* Input description */}
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                    placeholder="Specification component..."
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                  />

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Dynamic Technical Custom Fields */}
            {quotation.customFields.filter((f) => f.section === 'specification').length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                  Custom Technical Parameters
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quotation.customFields
                    .filter((f) => f.section === 'specification')
                    .map((field) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <div className="flex-1">
                          <label className="block text-[11px] font-medium text-slate-400 mb-0.5">
                            {field.name}
                          </label>
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => handleUpdateCustomField(field.id, e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomField(field.id)}
                          className="mt-4 p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Terms & Conditions */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Terms & Conditions (Page 2)
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Payment milestones, delivery timelines, warranty, and price validity
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddTerm}
                className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Condition Clause</span>
              </button>
            </div>

            <div className="space-y-4">
              {quotation.terms.map((term) => (
                <div
                  key={term.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={term.title}
                      onChange={(e) => handleUpdateTerm(term.id, { title: e.target.value })}
                      placeholder="TERM TITLE (e.g., PAYMENT, WARRANTY)"
                      className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-black text-amber-400 uppercase tracking-wide focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteTerm(term.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete term"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={term.content}
                    onChange={(e) => handleUpdateTerm(term.id, { content: e.target.value })}
                    placeholder="Enter condition details..."
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              ))}
            </div>

            {/* Closing Script Line */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Closing Handwriting Calligraphy Note
              </label>
              <input
                type="text"
                value={quotation.closingNote}
                onChange={(e) => updateField('closingNote', e.target.value)}
                placeholder="Thank you for your business"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column (Metadata & Commercials): 4 Cols */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quote Meta Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <FileCheck className="w-4 h-4 text-amber-500" />
              Document Metadata
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Quote Number *
              </label>
              <input
                type="text"
                value={quotation.quoteNumber}
                onChange={(e) => updateField('quoteNumber', e.target.value)}
                placeholder="00511"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Quote Date
                </label>
                <input
                  type="date"
                  value={quotation.quoteDate}
                  onChange={(e) => updateField('quoteDate', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Valid Till
                </label>
                <input
                  type="date"
                  value={quotation.validTill}
                  onChange={(e) => updateField('validTill', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Quotation Status
              </label>
              <select
                value={quotation.status}
                onChange={(e) => updateField('status', e.target.value as QuotationStatus)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 capitalize cursor-pointer"
              >
                <option value="draft">Draft Proposal</option>
                <option value="sent">Sent to Client</option>
                <option value="approved">Approved & Commissioned</option>
                <option value="rejected">Declined</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Currency
              </label>
              <select
                value={quotation.currency}
                onChange={(e) => updateField('currency', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="PKR">Pakistani Rupee (PKR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="AED">UAE Dirham (AED)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
            </div>
          </div>

          {/* Commercial & Financials Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Calculator className="w-4 h-4 text-amber-500" />
              Commercial Pricing
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Subtotal Amount ({quotation.currency}) *
              </label>
              <input
                type="number"
                value={quotation.subtotal}
                onChange={(e) => updateField('subtotal', parseFloat(e.target.value) || 0)}
                placeholder="460000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  GST / Tax %
                </label>
                <input
                  type="number"
                  value={quotation.taxPercent}
                  onChange={(e) => updateField('taxPercent', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Discount
                </label>
                <input
                  type="number"
                  value={quotation.discountAmount}
                  onChange={(e) => updateField('discountAmount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Total Display */}
            <div className="pt-3 border-t border-slate-800 bg-slate-950/80 p-3 rounded-lg border">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Quotation Value
              </div>
              <div className="text-xl font-black font-mono text-amber-400 tabular-nums mt-1">
                <span className="text-xs text-slate-400 mr-1.5">{quotation.currency}</span>
                {quotation.totalAmount.toLocaleString('en-US')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
