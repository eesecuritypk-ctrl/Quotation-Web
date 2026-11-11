/**
 * Eagle Eye Security System - Printable Quotation Document
 * Exact replica of the uploaded PDF (Quotation 00511), supporting multi-page A4
 * formatting, page breaks, watermarks, dynamic custom fields, and interactive editing.
 */

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CompanyProfile, Quotation } from '../types/quotation';
import { EagleEyeLogo } from './EagleEyeLogo';
import { ShieldCheck, Eye, Wrench, CheckCircle2 } from 'lucide-react';

interface QuotationDocumentProps {
  quotation: Quotation;
  company: CompanyProfile;
  activePage?: 1 | 2 | 'all';
  previewMode?: boolean;
}

export const QuotationDocument: React.FC<QuotationDocumentProps> = ({
  quotation,
  company,
  activePage = 'all',
  previewMode = false,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(company.qrCodeUrl || 'https://www.eesecurity.com.pk', {
      margin: 1,
      width: 140,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
      .then(setQrCodeDataUrl)
      .catch((err) => console.error('QR code generation failed:', err));
  }, [company.qrCodeUrl]);

  // Format currency with standard thousands separators (matching the document format: 460.000 or 460,000)
  const formatMoney = (val: number) => {
    return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  // Reusable Header Component for both pages
  const renderHeader = () => (
    <header className="relative w-full">
      {/* Top Graphic Accent Bar */}
      <div className="relative w-full h-8 overflow-hidden flex items-stretch">
        {/* Left Gold Polygon */}
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"
          style={{ width: '42%' }}
        />
        {/* Slanted divider */}
        <div 
          className="h-full bg-amber-500"
          style={{
            width: '32px',
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            marginLeft: '-1px'
          }}
        />
        {/* White gap */}
        <div className="flex-1 bg-white" />
        {/* Right angled black polygon with gold tip */}
        <div 
          className="h-full bg-slate-950 flex items-stretch justify-end"
          style={{
            width: '28%',
            clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%)'
          }}
        >
          <div className="w-3 h-full bg-amber-500" />
        </div>
      </div>

      {/* Main Header Row: Logo on Left, Contacts on Right */}
      <div className="px-8 pt-4 pb-3 flex items-center justify-between">
        {/* Brand Lockup */}
        <EagleEyeLogo size="md" showText={true} theme="light" />

        {/* Company Contact Details */}
        <div className="text-right text-[11px] leading-relaxed max-w-[340px]">
          <div className="flex justify-end gap-1.5 items-baseline">
            <span className="font-bold text-amber-600">Address:</span>
            <span className="font-medium text-slate-800 text-left">{company.address}</span>
          </div>
          <div className="flex justify-end gap-1.5 items-baseline">
            <span className="font-bold text-amber-600">Email:</span>
            <span className="font-semibold text-slate-900">{company.email}</span>
          </div>
          <div className="flex justify-end gap-1.5 items-baseline">
            <span className="font-bold text-amber-600">Phone:</span>
            <span className="font-semibold text-slate-900 tabular-nums">{company.phone}</span>
          </div>
          <div className="flex justify-end gap-1.5 items-baseline">
            <span className="font-bold text-amber-600">Web:</span>
            <span className="font-semibold text-slate-900">{company.web}</span>
          </div>
        </div>
      </div>

      {/* Bottom Gold Accent Bar with angled notch */}
      <div className="relative w-full h-[6px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600">
        <div 
          className="absolute right-[22%] top-0 w-8 h-3 bg-amber-500"
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
        />
      </div>
    </header>
  );

  // Reusable Footer Component for both pages
  const renderFooter = () => (
    <footer className="w-full bg-black text-white border-t-2 border-amber-500 mt-auto pt-3 pb-2 px-6">
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Mission */}
        <div className="col-span-4 border-r border-slate-800 pr-3">
          <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[10px] tracking-wider uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>OUR MISSION</span>
          </div>
          <p className="text-[9px] text-slate-300 leading-snug">
            {company.mission}
          </p>
        </div>

        {/* Vision */}
        <div className="col-span-4 border-r border-slate-800 pr-3">
          <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[10px] tracking-wider uppercase mb-1">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>OUR VISION</span>
          </div>
          <p className="text-[9px] text-slate-300 leading-snug">
            {company.vision}
          </p>
        </div>

        {/* Services */}
        <div className="col-span-3">
          <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[10px] tracking-wider uppercase mb-1">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>OUR SERVICES</span>
          </div>
          <div className="text-[8.5px] text-slate-300 leading-tight space-y-0.5">
            <div>Electric Fance System &middot; CCTV Solutions</div>
            <div>DVR / NVR Solution &middot; Smart Security</div>
            <div>Installation & Maintenance</div>
          </div>
        </div>

        {/* QR Code */}
        <div className="col-span-1 flex justify-center">
          <div className="bg-white p-1 rounded border border-amber-500/80 shadow-sm">
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                className="w-12 h-12 object-contain"
              />
            ) : (
              <div className="w-12 h-12 bg-slate-200 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </footer>
  );

  // Background Watermark Shield
  const renderWatermark = () => (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.045] select-none overflow-hidden">
      <div className="transform scale-[2.4] rotate-[-5deg]">
        <EagleEyeLogo size="xl" showText={true} theme="light" />
      </div>
    </div>
  );

  return (
    <div className={`quotation-document-container mx-auto ${previewMode ? '' : 'space-y-8'}`}>
      {/* ============================================================== */}
      {/* PAGE 1: Quotation Details, Scope, and Line Item Specifications */}
      {/* ============================================================== */}
      {(activePage === 'all' || activePage === 1) && (
        <section
          id="quotation-page-1"
          className="print-sheet relative bg-white text-slate-900 shadow-xl overflow-hidden flex flex-col justify-between"
          style={{
            width: '210mm',
            minHeight: '297mm',
            boxSizing: 'border-box'
          }}
        >
          {/* Header */}
          {renderHeader()}

          {/* Watermark */}
          {renderWatermark()}

          {/* Page Content Body */}
          <div className="relative z-10 px-8 py-5 flex-1 flex flex-col justify-between">
            {/* Top Meta Grid: Client "To" vs Quote Details */}
            <div>
              <div className="grid grid-cols-12 gap-6 items-start pb-4 border-b border-slate-200">
                {/* To: Client Info */}
                <div className="col-span-7">
                  <div className="text-sm font-black text-slate-900 tracking-wide uppercase mb-1 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-amber-500 inline-block rounded-xs" />
                    To
                  </div>
                  <div className="text-base font-extrabold text-slate-950">
                    {quotation.clientName || 'Valued Client'}
                  </div>
                  {quotation.clientCompany && (
                    <div className="text-xs font-semibold text-slate-700">
                      {quotation.clientCompany}
                    </div>
                  )}
                  {quotation.clientLocation && (
                    <div className="text-xs text-slate-700 font-medium mt-0.5">
                      {quotation.clientLocation}
                    </div>
                  )}
                  {quotation.clientPhone && (
                    <div className="text-[11px] text-slate-600 mt-0.5 tabular-nums">
                      Phone: {quotation.clientPhone}
                    </div>
                  )}
                  {quotation.clientEmail && (
                    <div className="text-[11px] text-slate-600">
                      Email: {quotation.clientEmail}
                    </div>
                  )}

                  {/* Client Section Dynamic Custom Fields */}
                  {quotation.customFields
                    .filter((f) => f.section === 'client' && f.value)
                    .map((f) => (
                      <div key={f.id} className="text-[11px] text-slate-700 mt-1 flex gap-1.5">
                        <span className="font-bold text-amber-700">{f.name}:</span>
                        <span>{f.value}</span>
                      </div>
                    ))}
                </div>

                {/* Quote Number & Dates */}
                <div className="col-span-5 bg-slate-50/80 p-3 rounded-md border border-slate-200 text-xs leading-relaxed">
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="font-bold text-slate-700">Quote:</span>
                    <span className="font-black text-slate-950 font-mono tracking-wide">
                      {quotation.quoteNumber}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="font-bold text-slate-700">Quote Date:</span>
                    <span className="font-medium text-slate-900 tabular-nums font-mono">
                      {quotation.quoteDate}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-bold text-slate-700">Valid Till:</span>
                    <span className="font-medium text-slate-900 tabular-nums font-mono">
                      {quotation.validTill}
                    </span>
                  </div>

                  {/* Header Section Dynamic Custom Fields */}
                  {quotation.customFields
                    .filter((f) => f.section === 'header' && f.value)
                    .map((f) => (
                      <div
                        key={f.id}
                        className="flex justify-between py-1 border-t border-slate-200 text-[11px]"
                      >
                        <span className="font-bold text-slate-700">{f.name}:</span>
                        <span className="font-semibold text-slate-900">{f.value}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Subject & Brand Lockup */}
              <div className="mt-4 mb-3">
                <h2 className="text-sm font-bold text-slate-900 leading-snug">
                  {quotation.subject}
                </h2>
                {quotation.brand && (
                  <div className="text-xs font-black text-amber-700 tracking-wide mt-1 uppercase">
                    Brand: <span className="text-slate-900 font-extrabold">{quotation.brand}</span>
                  </div>
                )}
              </div>

              {/* Description Section Header */}
              <div className="w-full bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 px-4 py-1.5 rounded-t-sm shadow-xs flex items-center justify-between">
                <span className="text-white font-extrabold tracking-wider text-xs uppercase">
                  Description
                </span>
                <span className="text-amber-100 font-medium text-[10px]">
                  Specifications & Components
                </span>
              </div>

              {/* Specifications / Line Items */}
              <div className="border border-t-0 border-slate-200 rounded-b-sm bg-white/95 p-4 min-h-[360px]">
                <ul className="space-y-1.5 text-xs text-slate-900 leading-normal">
                  {quotation.items.map((item, idx) => (
                    <li key={item.id || idx} className="flex items-start gap-2.5">
                      {/* Golden Dot matching document */}
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1 ring-2 ring-amber-200/60" />
                      
                      <div className="flex-1 flex justify-between items-baseline">
                        <span className="font-medium text-slate-900">
                          {item.description}
                        </span>

                        {/* Optional pricing if user entered quantities or prices */}
                        {!item.isBullet && (item.totalPrice || item.quantity) && (
                          <span className="text-[11px] font-mono tabular-nums text-slate-700 ml-3">
                            {item.quantity} {item.unit || ''} {item.totalPrice ? `@ ${quotation.currency} ${formatMoney(item.totalPrice)}` : ''}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Specification Section Dynamic Custom Fields */}
                {quotation.customFields
                  .filter((f) => f.section === 'specification' && f.value)
                  .length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1.5">
                      Additional Technical Parameters
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {quotation.customFields
                        .filter((f) => f.section === 'specification' && f.value)
                        .map((f) => (
                          <div key={f.id} className="flex items-baseline gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-700">{f.name}:</span>
                            <span className="font-medium text-slate-900">{f.value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Summary Block (Right Aligned matching PDF) */}
            <div className="mt-4 flex flex-col items-end">
              <div className="w-72 bg-slate-50 border border-slate-200 rounded p-3 text-right">
                <div className="flex justify-between items-baseline py-1 text-xs">
                  <span className="font-bold text-slate-700">Subtotal</span>
                  <span className="font-bold font-mono text-slate-900 tabular-nums">
                    {formatMoney(quotation.subtotal)}
                  </span>
                </div>

                {quotation.taxAmount > 0 && (
                  <div className="flex justify-between items-baseline py-1 text-xs text-slate-600">
                    <span>GST / Tax ({quotation.taxPercent}%)</span>
                    <span className="font-mono tabular-nums">
                      {formatMoney(quotation.taxAmount)}
                    </span>
                  </div>
                )}

                {quotation.discountAmount > 0 && (
                  <div className="flex justify-between items-baseline py-1 text-xs text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">
                      -{formatMoney(quotation.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-2 mt-1 border-t-2 border-slate-900 text-sm">
                  <span className="font-black text-slate-900 uppercase tracking-wide">
                    Total
                  </span>
                  <div className="font-black font-mono text-base text-slate-950">
                    <span className="text-xs font-bold text-slate-700 mr-1.5">{quotation.currency}</span>
                    <span className="tabular-nums">{formatMoney(quotation.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {renderFooter()}
        </section>
      )}

      {/* ============================================================== */}
      {/* PAGE 2: Terms & Conditions, Signatures, Closing Remark        */}
      {/* ============================================================== */}
      {(activePage === 'all' || activePage === 2) && (
        <section
          id="quotation-page-2"
          className="print-sheet relative bg-white text-slate-900 shadow-xl overflow-hidden flex flex-col justify-between"
          style={{
            width: '210mm',
            minHeight: '297mm',
            boxSizing: 'border-box'
          }}
        >
          {/* Header */}
          {renderHeader()}

          {/* Watermark */}
          {renderWatermark()}

          {/* Terms Content Body */}
          <div className="relative z-10 px-10 py-8 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-black text-slate-950 tracking-tight">
                  Terms & Conditions:
                </h2>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-amber-400 to-transparent" />
              </div>

              {/* Terms List */}
              <div className="space-y-4 text-xs">
                {quotation.terms.map((term, idx) => (
                  <div key={term.id || idx} className="flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1 ring-2 ring-amber-200" />
                    <div>
                      <div className="font-black text-slate-950 tracking-wide uppercase text-xs">
                        {term.title}
                      </div>
                      <div className="text-slate-800 font-medium text-xs mt-0.5 leading-relaxed">
                        {term.content}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Additional Terms from Custom Fields */}
                {quotation.customFields
                  .filter((f) => f.section === 'terms' && f.value)
                  .map((f) => (
                    <div key={f.id} className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1 ring-2 ring-amber-200" />
                      <div>
                        <div className="font-black text-slate-950 tracking-wide uppercase text-xs">
                          {f.name}
                        </div>
                        <div className="text-slate-800 font-medium text-xs mt-0.5 leading-relaxed">
                          {f.value}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Closing Script & Signatures */}
            <div className="mt-12 space-y-10">
              {/* Thank you for your business in gold script */}
              <div className="text-center">
                <div
                  className="font-script text-4xl md:text-5xl text-amber-500 tracking-wide drop-shadow-xs"
                  style={{ textShadow: '0 1px 2px rgba(245, 158, 11, 0.2)' }}
                >
                  {quotation.closingNote || 'Thank you for your business'}
                </div>
              </div>

              {/* Signatures & Seal Box */}
              <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-200">
                {/* Company Authorized Signatory */}
                <div className="text-left">
                  <div className="h-16 flex items-end">
                    <div className="border-b border-slate-400 w-48 mb-2" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    Authorized Signature
                  </div>
                  <div className="text-[11px] font-medium text-slate-600">
                    Eagle Eye Security System
                  </div>
                </div>

                {/* Client Acceptance */}
                <div className="text-right flex flex-col items-end">
                  <div className="h-16 flex items-end">
                    <div className="border-b border-slate-400 w-48 mb-2" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    Client Acceptance & Seal
                  </div>
                  <div className="text-[11px] font-medium text-slate-600">
                    {quotation.clientName}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {renderFooter()}
        </section>
      )}
    </div>
  );
};
