/**
 * Eagle Eye Security System - MySQL Database Schema & PHP Integration Center
 * Displays complete .sql file, table schemas, PHP backend scripts, and 1-click downloads.
 */

import React, { useState } from 'react';
import { Quotation } from '../types/quotation';
import { generateQuotationSql } from '../utils/pdfExport';
import { Database, Download, Copy, Check, FileCode, Server, Terminal, Play, Table } from 'lucide-react';

interface DatabaseSqlViewProps {
  currentQuotation: Quotation;
  onClose?: () => void;
}

export const DatabaseSqlView: React.FC<DatabaseSqlViewProps> = ({ currentQuotation }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'current_quote' | 'php' | 'query'>('schema');
  const [copied, setCopied] = useState(false);
  const [queryInput, setQueryInput] = useState('SELECT quote_number, client_name, client_location, total_amount, status FROM quotations;');
  const [queryOutput, setQueryOutput] = useState<any[] | null>(null);

  // Read the schema code
  const fullSqlSchema = `-- ==========================================================
-- EAGLE EYE SECURITY SYSTEM - DATABASE SCHEMA & SEED DATA
-- Target DBMS: MySQL 5.7+ / MariaDB 10.3+ / MySQL 8.0+
-- File: eagle_eye_quotation_system.sql
-- ==========================================================

CREATE DATABASE IF NOT EXISTS \`eagle_eye_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`eagle_eye_db\`;

-- 1. Table structure for table \`users\`
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(60) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`full_name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`role\` ENUM('admin', 'sales_manager', 'estimator', 'viewer') NOT NULL DEFAULT 'sales_manager',
  \`status\` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table structure for table \`company_profile\`
CREATE TABLE IF NOT EXISTS \`company_profile\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`company_name\` VARCHAR(150) NOT NULL DEFAULT 'EAGLE EYE SECURITY SYSTEM',
  \`tagline\` VARCHAR(200) NOT NULL DEFAULT 'SECURE TODAY, SAFE TOMMOROW',
  \`address\` VARCHAR(255) NOT NULL DEFAULT 'Plot No L161 Sector 48/E Korangi 2½ Karachi',
  \`email\` VARCHAR(150) NOT NULL DEFAULT 'enquiry@eesecurity.com.pk',
  \`phone\` VARCHAR(80) NOT NULL DEFAULT '+92 305 8396416',
  \`website\` VARCHAR(150) NOT NULL DEFAULT 'www.eesecurity.com.pk',
  \`mission\` TEXT,
  \`vision\` TEXT,
  \`services\` TEXT,
  \`logo_path\` VARCHAR(255) DEFAULT '/assets/logo.png',
  \`qr_code_url\` VARCHAR(255) DEFAULT 'https://www.eesecurity.com.pk',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table structure for table \`quotations\`
CREATE TABLE IF NOT EXISTS \`quotations\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`quote_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`quote_date\` DATE NOT NULL,
  \`valid_till\` DATE NOT NULL,
  \`client_name\` VARCHAR(150) NOT NULL,
  \`client_company\` VARCHAR(150) DEFAULT NULL,
  \`client_location\` VARCHAR(200) DEFAULT NULL,
  \`client_phone\` VARCHAR(80) DEFAULT NULL,
  \`client_email\` VARCHAR(150) DEFAULT NULL,
  \`subject\` VARCHAR(255) NOT NULL,
  \`brand\` VARCHAR(120) DEFAULT 'NEMTEX SOUTH AFRICA',
  \`currency\` VARCHAR(10) NOT NULL DEFAULT 'PKR',
  \`subtotal\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`tax_percent\` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  \`tax_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`discount_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`total_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`status\` ENUM('draft', 'sent', 'approved', 'rejected', 'expired') NOT NULL DEFAULT 'sent',
  \`closing_note\` TEXT,
  \`created_by\` INT UNSIGNED DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_quotation_user\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL,
  INDEX \`idx_quote_number\` (\`quote_number\`),
  INDEX \`idx_quote_date\` (\`quote_date\`),
  INDEX \`idx_client_name\` (\`client_name\`),
  INDEX \`idx_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table structure for table \`quotation_items\`
CREATE TABLE IF NOT EXISTS \`quotation_items\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`quotation_id\` INT UNSIGNED NOT NULL,
  \`description\` TEXT NOT NULL,
  \`quantity\` DECIMAL(12, 2) DEFAULT 1.00,
  \`unit\` VARCHAR(50) DEFAULT NULL,
  \`unit_price\` DECIMAL(15, 2) DEFAULT 0.00,
  \`total_price\` DECIMAL(15, 2) DEFAULT 0.00,
  \`is_bullet\` TINYINT(1) NOT NULL DEFAULT 1,
  \`sort_order\` INT NOT NULL DEFAULT 0,
  CONSTRAINT \`fk_items_quotation\` FOREIGN KEY (\`quotation_id\`) REFERENCES \`quotations\` (\`id\`) ON DELETE CASCADE,
  INDEX \`idx_quotation_items\` (\`quotation_id\`, \`sort_order\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table structure for table \`quotation_terms\`
CREATE TABLE IF NOT EXISTS \`quotation_terms\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`quotation_id\` INT UNSIGNED NOT NULL,
  \`term_title\` VARCHAR(100) NOT NULL,
  \`term_content\` TEXT NOT NULL,
  \`sort_order\` INT NOT NULL DEFAULT 0,
  CONSTRAINT \`fk_terms_quotation\` FOREIGN KEY (\`quotation_id\`) REFERENCES \`quotations\` (\`id\`) ON DELETE CASCADE,
  INDEX \`idx_quotation_terms\` (\`quotation_id\`, \`sort_order\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table structure for table \`quotation_custom_fields\` (Dynamic Custom Fields)
CREATE TABLE IF NOT EXISTS \`quotation_custom_fields\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`quotation_id\` INT UNSIGNED NOT NULL,
  \`field_name\` VARCHAR(100) NOT NULL,
  \`field_value\` TEXT NOT NULL,
  \`field_type\` ENUM('text', 'number', 'date', 'select', 'textarea', 'badge') NOT NULL DEFAULT 'text',
  \`field_section\` ENUM('header', 'client', 'specification', 'pricing', 'terms', 'footer') NOT NULL DEFAULT 'client',
  \`sort_order\` INT NOT NULL DEFAULT 0,
  CONSTRAINT \`fk_fields_quotation\` FOREIGN KEY (\`quotation_id\`) REFERENCES \`quotations\` (\`id\`) ON DELETE CASCADE,
  INDEX \`idx_quotation_fields\` (\`quotation_id\`, \`field_section\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed Data: Quote 00511 from PDF
INSERT INTO \`quotations\` (\`quote_number\`, \`quote_date\`, \`valid_till\`, \`client_name\`, \`client_location\`, \`subject\`, \`brand\`, \`currency\`, \`subtotal\`, \`total_amount\`, \`status\`, \`closing_note\`)
VALUES ('00511', '2026-08-24', '2026-09-03', 'Mr, Aamir Rind', 'Hub Chowkey', 'Supply & Installation Perimeter Security Electric Fence System (No. of Strands Wire-8)', 'NEMTEX SOUTH AFRICA', 'PKR', 460000.00, 460000.00, 'sent', 'Thank you for your business');
`;

  const phpBackendCode = `<?php
/**
 * Eagle Eye Security System - PHP & MySQL Integration
 * Save this file to: /api/quotations.php
 */
header('Content-Type: application/json; charset=utf-8');

$pdo = new PDO("mysql:host=localhost;dbname=eagle_eye_db;charset=utf8mb4", "root", "", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM quotations ORDER BY id DESC");
    echo json_encode(['success' => true, 'quotations' => $stmt->fetchAll()]);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("
        INSERT INTO quotations (quote_number, quote_date, valid_till, client_name, client_location, subject, brand, total_amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $input['quoteNumber'],
        $input['quoteDate'],
        $input['validTill'],
        $input['clientName'],
        $input['clientLocation'],
        $input['subject'],
        $input['brand'],
        $input['totalAmount'],
        $input['status']
    ]);
    
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
}`;

  const currentQuoteSql = generateQuotationSql(currentQuotation);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSqlFile = () => {
    const blob = new Blob([fullSqlSchema], { type: 'application/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'eagle_eye_quotation_system.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRunSimulatedQuery = () => {
    // Simulated SQL response on current loaded data
    const q = queryInput.toLowerCase();
    if (q.includes('quotations') || q.includes('quote')) {
      setQueryOutput([
        {
          quote_number: currentQuotation.quoteNumber,
          client_name: currentQuotation.clientName,
          client_location: currentQuotation.clientLocation,
          total_amount: currentQuotation.totalAmount,
          currency: currentQuotation.currency,
          status: currentQuotation.status,
          date: currentQuotation.quoteDate
        }
      ]);
    } else if (q.includes('items') || q.includes('description')) {
      setQueryOutput(
        currentQuotation.items.map((it, i) => ({
          id: i + 1,
          description: it.description,
          is_bullet: it.isBullet ? 1 : 0
        }))
      );
    } else if (q.includes('fields') || q.includes('custom')) {
      setQueryOutput(
        currentQuotation.customFields.map((f, i) => ({
          id: i + 1,
          field_name: f.name,
          field_value: f.value,
          section: f.section
        }))
      );
    } else {
      setQueryOutput([
        { message: 'Query executed successfully. 1 row affected.', status: 'OK' }
      ]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>MySQL Database & PHP Backend Architecture</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Database Schema & Backend API Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Import the generated .sql schema into phpMyAdmin or MySQL to host persistent data with PHP.
          </p>
        </div>

        {/* 1-Click Download Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadSqlFile}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .sql File</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-6 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('schema')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'schema'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Full Database Schema (.sql)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('current_quote')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'current_quote'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Active Quote #{currentQuotation.quoteNumber} INSERT SQL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('php')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'php'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>PHP REST API Script</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('query')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'query'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Live SQL Query Inspector</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2.5 rounded-t-xl border border-slate-800">
              <span className="text-xs font-mono text-amber-400 font-semibold">
                file: eagle_eye_quotation_system.sql
              </span>
              <button
                type="button"
                onClick={() => handleCopy(fullSqlSchema)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-5 rounded-b-xl border border-t-0 border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[540px] leading-relaxed">
              <code>{fullSqlSchema}</code>
            </pre>
          </div>
        )}

        {activeTab === 'current_quote' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2.5 rounded-t-xl border border-slate-800">
              <span className="text-xs font-mono text-amber-400 font-semibold">
                INSERT Statements for Quote #{currentQuotation.quoteNumber} (including dynamic fields)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(currentQuoteSql)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-5 rounded-b-xl border border-t-0 border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[540px] leading-relaxed">
              <code>{currentQuoteSql}</code>
            </pre>
          </div>
        )}

        {activeTab === 'php' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2.5 rounded-t-xl border border-slate-800">
              <span className="text-xs font-mono text-amber-400 font-semibold">
                PHP Backend Controller (PDO Prepared Statements)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(phpBackendCode)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy PHP Code'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-5 rounded-b-xl border border-t-0 border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[540px] leading-relaxed">
              <code>{phpBackendCode}</code>
            </pre>
          </div>
        )}

        {activeTab === 'query' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                SQL Query Console
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleRunSimulatedQuery}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Query</span>
                </button>
              </div>

              {/* Sample Quick Queries */}
              <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
                <span>Quick Queries:</span>
                <button
                  type="button"
                  onClick={() => {
                    setQueryInput('SELECT * FROM quotations;');
                    setTimeout(handleRunSimulatedQuery, 50);
                  }}
                  className="hover:text-amber-400 underline cursor-pointer"
                >
                  SELECT * FROM quotations;
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setQueryInput('SELECT * FROM quotation_custom_fields;');
                    setTimeout(handleRunSimulatedQuery, 50);
                  }}
                  className="hover:text-amber-400 underline cursor-pointer"
                >
                  SELECT * FROM quotation_custom_fields;
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setQueryInput('SELECT * FROM quotation_items;');
                    setTimeout(handleRunSimulatedQuery, 50);
                  }}
                  className="hover:text-amber-400 underline cursor-pointer"
                >
                  SELECT * FROM quotation_items;
                </button>
              </div>
            </div>

            {/* Query Result Grid */}
            {queryOutput && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto">
                <div className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5" />
                  <span>Query Results ({queryOutput.length} records returned)</span>
                </div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                      {Object.keys(queryOutput[0] || {}).map((col) => (
                        <th key={col} className="p-2 font-mono uppercase text-[10px]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryOutput.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-900 hover:bg-slate-900/40">
                        {Object.values(row).map((val: any, cIdx) => (
                          <td key={cIdx} className="p-2 font-mono text-slate-300">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
