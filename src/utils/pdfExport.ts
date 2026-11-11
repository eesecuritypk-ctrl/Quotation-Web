/**
 * Eagle Eye Security System - PDF Export Utility
 * Uses jsPDF and html2canvas for seamless client-side PDF downloads
 * matching exact A4 dimensions (210mm x 297mm).
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Quotation } from '../types/quotation';

export interface ExportPdfOptions {
  fileName?: string;
  onProgress?: (progress: number, stage: string) => void;
}

export async function exportQuotationToPdf(
  quotation: Quotation,
  options?: ExportPdfOptions
): Promise<void> {
  const page1Element = document.getElementById('quotation-page-1');
  const page2Element = document.getElementById('quotation-page-2');

  if (!page1Element) {
    throw new Error('Quotation Page 1 element not found in DOM');
  }

  options?.onProgress?.(10, 'Initializing PDF renderer...');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const a4WidthMm = 210;
  const a4HeightMm = 297;

  // Helper with 4.5s timeout protection to prevent hanging
  const renderCanvasWithTimeout = (el: HTMLElement): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('html2canvas rendering timed out'));
      }, 4500);

      html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 794,
        windowHeight: 1123
      })
        .then((canvas) => {
          clearTimeout(timer);
          resolve(canvas);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  };

  // Render Page 1
  options?.onProgress?.(30, 'Rendering Quotation Specifications (Page 1)...');
  const canvas1 = await renderCanvasWithTimeout(page1Element);

  const imgData1 = canvas1.toDataURL('image/jpeg', 0.98);
  pdf.addImage(imgData1, 'JPEG', 0, 0, a4WidthMm, a4HeightMm, undefined, 'FAST');

  // If Page 2 exists, render it
  if (page2Element) {
    options?.onProgress?.(70, 'Rendering Terms & Conditions (Page 2)...');
    pdf.addPage('a4', 'portrait');

    const canvas2 = await renderCanvasWithTimeout(page2Element);
    const imgData2 = canvas2.toDataURL('image/jpeg', 0.98);
    pdf.addImage(imgData2, 'JPEG', 0, 0, a4WidthMm, a4HeightMm, undefined, 'FAST');
  }

  options?.onProgress?.(95, 'Generating file...');
  const fileName = options?.fileName || `EagleEye_Quotation_${quotation.quoteNumber || 'Draft'}.pdf`;
  pdf.save(fileName);
  options?.onProgress?.(100, 'Complete');
}

/**
 * Generate standalone SQL INSERT statements for the current quotation
 */
export function generateQuotationSql(quotation: Quotation): string {
  const sanitize = (str: string = '') => str.replace(/'/g, "''");

  const quoteSql = `
-- Insert Quotation #${quotation.quoteNumber}
INSERT INTO \`quotations\` (
  \`quote_number\`, \`quote_date\`, \`valid_till\`, 
  \`client_name\`, \`client_company\`, \`client_location\`, \`client_phone\`, \`client_email\`, 
  \`subject\`, \`brand\`, \`currency\`, \`subtotal\`, \`tax_percent\`, \`tax_amount\`, 
  \`discount_amount\`, \`total_amount\`, \`status\`, \`closing_note\`
) VALUES (
  '${sanitize(quotation.quoteNumber)}',
  '${quotation.quoteDate}',
  '${quotation.validTill}',
  '${sanitize(quotation.clientName)}',
  '${sanitize(quotation.clientCompany || '')}',
  '${sanitize(quotation.clientLocation || '')}',
  '${sanitize(quotation.clientPhone || '')}',
  '${sanitize(quotation.clientEmail || '')}',
  '${sanitize(quotation.subject)}',
  '${sanitize(quotation.brand)}',
  '${sanitize(quotation.currency)}',
  ${quotation.subtotal},
  ${quotation.taxPercent},
  ${quotation.taxAmount},
  ${quotation.discountAmount},
  ${quotation.totalAmount},
  '${quotation.status}',
  '${sanitize(quotation.closingNote)}'
);

SET @quote_id = LAST_INSERT_ID();

-- Insert Quotation Items
${quotation.items
  .map(
    (item, idx) => `INSERT INTO \`quotation_items\` (\`quotation_id\`, \`description\`, \`quantity\`, \`unit\`, \`unit_price\`, \`total_price\`, \`is_bullet\`, \`sort_order\`)
VALUES (@quote_id, '${sanitize(item.description)}', ${item.quantity || 1}, '${sanitize(item.unit || '')}', ${item.unitPrice || 0}, ${item.totalPrice || 0}, ${item.isBullet ? 1 : 0}, ${idx + 1});`
  )
  .join('\n')}

-- Insert Dynamic Custom Fields
${quotation.customFields
  .map(
    (f, idx) => `INSERT INTO \`quotation_custom_fields\` (\`quotation_id\`, \`field_name\`, \`field_value\`, \`field_type\`, \`field_section\`, \`sort_order\`)
VALUES (@quote_id, '${sanitize(f.name)}', '${sanitize(f.value)}', '${f.type}', '${f.section}', ${idx + 1});`
  )
  .join('\n')}

-- Insert Quotation Terms
${quotation.terms
  .map(
    (term, idx) => `INSERT INTO \`quotation_terms\` (\`quotation_id\`, \`term_title\`, \`term_content\`, \`sort_order\`)
VALUES (@quote_id, '${sanitize(term.title)}', '${sanitize(term.content)}', ${idx + 1});`
  )
  .join('\n')}
`;

  return quoteSql.trim();
}
