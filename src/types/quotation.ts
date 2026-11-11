/**
 * Eagle Eye Security System - Quotation Type Definitions
 */

export type UserRole = 'admin' | 'sales_manager' | 'estimator' | 'viewer';

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  totalPrice?: number;
  isBullet: boolean; // true = simple specification bullet, false = priced line item
}

export type CustomFieldType = 'text' | 'number' | 'date' | 'select' | 'textarea' | 'badge';
export type CustomFieldSection = 'client' | 'header' | 'specification' | 'pricing' | 'terms';

export interface CustomField {
  id: string;
  name: string;
  value: string;
  type: CustomFieldType;
  section: CustomFieldSection;
  options?: string[]; // For select dropdowns
}

export interface QuotationTerm {
  id: string;
  title: string;
  content: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface Quotation {
  id: string;
  quoteNumber: string;
  quoteDate: string; // YYYY-MM-DD
  validTill: string;  // YYYY-MM-DD
  
  // Client Details
  clientName: string;
  clientCompany?: string;
  clientLocation: string;
  clientPhone?: string;
  clientEmail?: string;
  clientNtn?: string;

  // Quote Scope & Brand
  subject: string;
  brand: string;

  // Items & Specs
  items: QuotationItem[];
  
  // Dynamic custom fields
  customFields: CustomField[];

  // Terms & Conditions
  terms: QuotationTerm[];

  // Financials
  currency: string;
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;

  // Metadata
  closingNote: string;
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CompanyProfile {
  name: string;
  tagline: string;
  address: string;
  email: string;
  phone: string;
  web: string;
  mission: string;
  vision: string;
  services: string[];
  qrCodeUrl: string;
}
