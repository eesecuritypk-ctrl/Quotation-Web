/**
 * Eagle Eye Security System - Dynamic Field Adder Modal
 * Allows adding unlimited custom fields to any section of the quotation.
 */

import React, { useState } from 'react';
import { CustomField, CustomFieldSection, CustomFieldType } from '../types/quotation';
import { X, Plus, Sparkles, Check } from 'lucide-react';

interface DynamicFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddField: (field: CustomField) => void;
  defaultSection?: CustomFieldSection;
}

const PRESET_SUGGESTIONS = [
  { name: 'Client NTN Number', type: 'text' as CustomFieldType, section: 'client' as CustomFieldSection, val: '1234567-8' },
  { name: 'Site In-charge Phone', type: 'text' as CustomFieldType, section: 'client' as CustomFieldSection, val: '+92 321 0000000' },
  { name: 'Battery Autonomy (Hours)', type: 'number' as CustomFieldType, section: 'specification' as CustomFieldSection, val: '24' },
  { name: 'Earth Pit Resistance', type: 'text' as CustomFieldType, section: 'specification' as CustomFieldSection, val: '< 0.5 Ohms' },
  { name: 'Wire Material Grade', type: 'text' as CustomFieldType, section: 'specification' as CustomFieldSection, val: 'SS-316L Marine Grade' },
  { name: 'Civil Works Responsibility', type: 'text' as CustomFieldType, section: 'terms' as CustomFieldSection, val: 'Civil & Foundation works in Client scope' },
  { name: 'Target Commissioning Date', type: 'date' as CustomFieldType, section: 'header' as CustomFieldSection, val: '2026-09-15' },
];

export const DynamicFieldModal: React.FC<DynamicFieldModalProps> = ({
  isOpen,
  onClose,
  onAddField,
  defaultSection = 'client'
}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState<CustomFieldType>('text');
  const [section, setSection] = useState<CustomFieldSection>(defaultSection);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddField({
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      value: value.trim(),
      type,
      section
    });

    setName('');
    setValue('');
    onClose();
  };

  const handleApplyPreset = (preset: typeof PRESET_SUGGESTIONS[0]) => {
    setName(preset.name);
    setValue(preset.val);
    setType(preset.type);
    setSection(preset.section);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" />
              <span>Add Dynamic Field</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inject custom parameters into the quotation form & document
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Popular Security Field Presets</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_SUGGESTIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-800/80 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700 hover:border-amber-500/50 transition-colors text-slate-300 cursor-pointer"
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Field Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Field Label / Parameter Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Client NTN, Battery Backup, Site Location"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Section & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Section
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as CustomFieldSection)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="client">Client & Billing Details</option>
                <option value="specification">Technical Specifications</option>
                <option value="header">Quote Header (Dates/Refs)</option>
                <option value="terms">Terms & Conditions</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Data Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CustomFieldType)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="text">Single-line Text</option>
                <option value="number">Numeric Value</option>
                <option value="date">Date Picker</option>
                <option value="textarea">Multi-line Paragraph</option>
              </select>
            </div>
          </div>

          {/* Field Value */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Initial / Default Value
            </label>
            {type === 'textarea' ? (
              <textarea
                rows={3}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter field value or description..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            ) : (
              <input
                type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Custom Field</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
