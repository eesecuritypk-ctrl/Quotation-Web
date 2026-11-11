/**
 * Eagle Eye Security System - Initial Seed Data
 * Scanned and faithfully matched from the uploaded PDF document (Quote 00511)
 */

import { CompanyProfile, Quotation, User } from '../types/quotation';

export const INITIAL_COMPANY_PROFILE: CompanyProfile = {
  name: 'EAGLE EYE SECURITY SYSTEM',
  tagline: 'SECURE TODAY, SAFE TOMMOROW',
  address: 'Plot No L161 Sector 48/E Korangi 2½ Karachi',
  email: 'enquiry@eesecurity.com.pk',
  phone: '+92 305 8396416',
  web: 'www.eesecurity.com.pk',
  mission: 'To deliver advanced security solution that protect people, property, and peace of mind.',
  vision: 'To be a leading security solution provide, renowned for innovation, reliability, and customer trust.',
  services: [
    'Electric Fance System',
    'CCTV Solutions',
    'DVR / NVR Solution',
    'Smart Security Solutions',
    'Installation & Maintenance.'
  ],
  qrCodeUrl: 'https://www.eesecurity.com.pk'
};

export const INITIAL_QUOTATION: Quotation = {
  id: 'quote-00511',
  quoteNumber: '00511',
  quoteDate: '2026-08-24',
  validTill: '2026-09-03',
  clientName: 'Mr, Aamir Rind',
  clientCompany: '',
  clientLocation: 'Hub Chowkey',
  clientPhone: '+92 300 1234567',
  clientEmail: 'aamir.rind@hub.pk',
  clientNtn: '',
  subject: 'Supply & Installation Perimeter Security Electric Fence System (No. of Strands Wire-8)',
  brand: 'NEMTEX SOUTH AFRICA',
  currency: 'PKR',
  subtotal: 460000,
  taxPercent: 0,
  taxAmount: 0,
  discountAmount: 0,
  totalAmount: 460000,
  closingNote: 'Thank you for your business',
  status: 'sent',
  createdAt: '2026-08-24T10:00:00Z',
  updatedAt: '2026-08-24T10:00:00Z',
  createdBy: 'Sales Department',
  items: [
    { id: 'item-1', description: '1000 Running feet', isBullet: true },
    { id: 'item-2', description: '1 Original NEMTEX ENEGIZERS with Built-In UPS.', isBullet: true },
    { id: 'item-3', description: 'Single Zones', isBullet: true },
    { id: 'item-4', description: '7 Amp Maintenance Free Battery', isBullet: true },
    { id: 'item-5', description: 'Total Poles Height 40 Inch.', isBullet: true },
    { id: 'item-6', description: 'Stainless Steel Square Tube Poles.', isBullet: true },
    { id: 'item-7', description: 'Stainless Steel Sport Pipes.', isBullet: true },
    { id: 'item-8', description: 'With PVC coated', isBullet: true },
    { id: 'item-9', description: 'Jurassic Insulators NEMTEX.', isBullet: true },
    { id: 'item-10', description: 'Number of Strands Wire Every 4', isBullet: true },
    { id: 'item-11', description: 'Earth Spike.', isBullet: true },
    { id: 'item-12', description: '2Siren.', isBullet: true },
    { id: 'item-13', description: 'Light.', isBullet: true },
    { id: 'item-14', description: 'HT cable.', isBullet: true },
    { id: 'item-15', description: 'S.S Wire 1.2mm grade 316 L', isBullet: true },
    { id: 'item-16', description: 'Metal Enclosure.', isBullet: true },
    { id: 'item-17', description: 'With GSM', isBullet: true }
  ],
  customFields: [
    {
      id: 'field-1',
      name: 'Fence Wire Strands',
      value: '8-Strands High Tensile Grade 316L',
      type: 'text',
      section: 'specification'
    },
    {
      id: 'field-2',
      name: 'Site Location Sector',
      value: 'Hub Industrial Perimeter Zone-A',
      type: 'text',
      section: 'client'
    },
    {
      id: 'field-3',
      name: 'GSM SIM Module',
      value: 'Quad-Band Auto SMS Alerting Included',
      type: 'text',
      section: 'specification'
    }
  ],
  terms: [
    {
      id: 'term-1',
      title: 'PRICES',
      content: 'Delivered and installed in Karachi, prices are in Pakistani Rupees without GST.'
    },
    {
      id: 'term-2',
      title: 'PAYMENT',
      content: '50% Advance along with order 50% After Commissioning.'
    },
    {
      id: 'term-3',
      title: 'DELIVERY',
      content: 'within 15 days of receiving the advance payment and the confirmed order.'
    },
    {
      id: 'term-4',
      title: 'VALIDITY',
      content: 'The prices are only available for a period of 15 days.'
    },
    {
      id: 'term-5',
      title: 'WARRANTY',
      content: 'Two years for System and One year for other maintenance.'
    }
  ]
};

export const DEMO_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    fullName: 'Engr. Naveed Kauser',
    email: 'admin@eesecurity.com.pk',
    role: 'admin'
  },
  {
    id: 2,
    username: 'sales',
    fullName: 'M. Asif - Sales Lead',
    email: 'sales@eesecurity.com.pk',
    role: 'sales_manager'
  },
  {
    id: 3,
    username: 'estimator',
    fullName: 'Tariq Mehmood - Security Estimator',
    email: 'enquiry@eesecurity.com.pk',
    role: 'estimator'
  }
];
