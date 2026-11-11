-- ==========================================================
-- EAGLE EYE SECURITY SYSTEM - DATABASE SCHEMA & SEED DATA
-- Target DBMS: MySQL 5.7+ / MariaDB 10.3+ / MySQL 8.0+
-- File: eagle_eye_quotation_system.sql
-- Description: Complete schema for Quotations, Dynamic Custom Fields,
--              Line Items, Terms & Conditions, Users, and Company Info.
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `eagle_eye_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `eagle_eye_db`;

-- ----------------------------------------------------------
-- 1. Table structure for table `users`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `quotation_custom_fields`;
DROP TABLE IF EXISTS `quotation_terms`;
DROP TABLE IF EXISTS `quotation_items`;
DROP TABLE IF EXISTS `quotations`;
DROP TABLE IF EXISTS `company_profile`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `role` ENUM('admin', 'sales_manager', 'estimator', 'viewer') NOT NULL DEFAULT 'sales_manager',
  `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. Table structure for table `company_profile`
-- ----------------------------------------------------------
CREATE TABLE `company_profile` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(150) NOT NULL DEFAULT 'EAGLE EYE SECURITY SYSTEM',
  `tagline` VARCHAR(200) NOT NULL DEFAULT 'SECURE TODAY, SAFE TOMMOROW',
  `address` VARCHAR(255) NOT NULL DEFAULT 'Plot No L161 Sector 48/E Korangi 2½ Karachi',
  `email` VARCHAR(150) NOT NULL DEFAULT 'enquiry@eesecurity.com.pk',
  `phone` VARCHAR(80) NOT NULL DEFAULT '+92 305 8396416',
  `website` VARCHAR(150) NOT NULL DEFAULT 'www.eesecurity.com.pk',
  `mission` TEXT,
  `vision` TEXT,
  `services` TEXT,
  `logo_path` VARCHAR(255) DEFAULT '/assets/logo.png',
  `qr_code_url` VARCHAR(255) DEFAULT 'https://www.eesecurity.com.pk',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. Table structure for table `quotations`
-- ----------------------------------------------------------
CREATE TABLE `quotations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `quote_number` VARCHAR(50) NOT NULL UNIQUE,
  `quote_date` DATE NOT NULL,
  `valid_till` DATE NOT NULL,
  `client_name` VARCHAR(150) NOT NULL,
  `client_company` VARCHAR(150) DEFAULT NULL,
  `client_location` VARCHAR(200) DEFAULT NULL,
  `client_phone` VARCHAR(80) DEFAULT NULL,
  `client_email` VARCHAR(150) DEFAULT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `brand` VARCHAR(120) DEFAULT 'NEMTEX SOUTH AFRICA',
  `currency` VARCHAR(10) NOT NULL DEFAULT 'PKR',
  `subtotal` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `tax_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `tax_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('draft', 'sent', 'approved', 'rejected', 'expired') NOT NULL DEFAULT 'sent',
  `closing_note` TEXT,
  `created_by` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_quotation_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_quote_number` (`quote_number`),
  INDEX `idx_quote_date` (`quote_date`),
  INDEX `idx_client_name` (`client_name`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. Table structure for table `quotation_items` (Specifications / Line Items)
-- ----------------------------------------------------------
CREATE TABLE `quotation_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `quotation_id` INT UNSIGNED NOT NULL,
  `description` TEXT NOT NULL,
  `quantity` DECIMAL(12, 2) DEFAULT 1.00,
  `unit` VARCHAR(50) DEFAULT NULL,
  `unit_price` DECIMAL(15, 2) DEFAULT 0.00,
  `total_price` DECIMAL(15, 2) DEFAULT 0.00,
  `is_bullet` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_items_quotation` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE,
  INDEX `idx_quotation_items` (`quotation_id`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 5. Table structure for table `quotation_terms` (Terms & Conditions)
-- ----------------------------------------------------------
CREATE TABLE `quotation_terms` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `quotation_id` INT UNSIGNED NOT NULL,
  `term_title` VARCHAR(100) NOT NULL,
  `term_content` TEXT NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_terms_quotation` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE,
  INDEX `idx_quotation_terms` (`quotation_id`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 6. Table structure for table `quotation_custom_fields` (Dynamic Fields)
-- ----------------------------------------------------------
CREATE TABLE `quotation_custom_fields` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `quotation_id` INT UNSIGNED NOT NULL,
  `field_name` VARCHAR(100) NOT NULL,
  `field_value` TEXT NOT NULL,
  `field_type` ENUM('text', 'number', 'date', 'select', 'textarea', 'badge') NOT NULL DEFAULT 'text',
  `field_section` ENUM('header', 'client', 'specification', 'pricing', 'terms', 'footer') NOT NULL DEFAULT 'client',
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_fields_quotation` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE,
  INDEX `idx_quotation_fields` (`quotation_id`, `field_section`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- INITIAL SEED DATA (Exact match to uploaded document 00511)
-- ==========================================================

-- Seed Users (Default admin and sales accounts with password 'password123' bcrypt hash)
INSERT INTO `users` (`id`, `username`, `password_hash`, `full_name`, `email`, `role`, `status`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin@eesecurity.com.pk', 'admin', 'active'),
(2, 'sales', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sales Executive', 'sales@eesecurity.com.pk', 'sales_manager', 'active'),
(3, 'estimator', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Technical Estimator', 'enquiry@eesecurity.com.pk', 'estimator', 'active');

-- Seed Company Profile
INSERT INTO `company_profile` (`id`, `company_name`, `tagline`, `address`, `email`, `phone`, `website`, `mission`, `vision`, `services`, `logo_path`, `qr_code_url`) VALUES
(1, 
 'EAGLE EYE SECURITY SYSTEM', 
 'SECURE TODAY, SAFE TOMMOROW', 
 'Plot No L161 Sector 48/E Korangi 2½ Karachi', 
 'enquiry@eesecurity.com.pk', 
 '+92 305 8396416', 
 'www.eesecurity.com.pk', 
 'To deliver advanced security solution that protect people, property, and peace of mind.', 
 'To be a leading security solution provide, renowned for innovation, reliability, and customer trust.', 
 'Electric Fance System, CCTV Solutions, DVR / NVR Solution, Smart Security Solutions, Installation & Maintenance.', 
 '/assets/logo.png', 
 'https://www.eesecurity.com.pk');

-- Seed Sample Quotation (Quote 00511 from PDF)
INSERT INTO `quotations` (
  `id`, `quote_number`, `quote_date`, `valid_till`, 
  `client_name`, `client_company`, `client_location`, `client_phone`, `client_email`, 
  `subject`, `brand`, `currency`, `subtotal`, `tax_percent`, `tax_amount`, `discount_amount`, `total_amount`, 
  `status`, `closing_note`, `created_by`
) VALUES (
  1, 
  '00511', 
  '2026-08-24', 
  '2026-09-03', 
  'Mr, Aamir Rind', 
  '', 
  'Hub Chowkey', 
  '+92 300 0000000', 
  'aamir.rind@client.com', 
  'Supply & Installation Perimeter Security Electric Fence System (No. of Strands Wire-8)', 
  'NEMTEX SOUTH AFRICA', 
  'PKR', 
  460000.00, 
  0.00, 
  0.00, 
  0.00, 
  460000.00, 
  'sent', 
  'Thank you for your business', 
  1
);

-- Seed Quotation Items / Specifications for Quote 00511
INSERT INTO `quotation_items` (`quotation_id`, `description`, `quantity`, `unit`, `unit_price`, `total_price`, `is_bullet`, `sort_order`) VALUES
(1, '1000 Running feet', 1000.00, 'RFT', 0.00, 0.00, 1, 1),
(1, '1 Original NEMTEX ENEGIZERS with Built-In UPS.', 1.00, 'Unit', 0.00, 0.00, 1, 2),
(1, 'Single Zones', 1.00, 'Zone', 0.00, 0.00, 1, 3),
(1, '7 Amp Maintenance Free Battery', 1.00, 'Unit', 0.00, 0.00, 1, 4),
(1, 'Total Poles Height 40 Inch.', 1.00, 'Lot', 0.00, 0.00, 1, 5),
(1, 'Stainless Steel Square Tube Poles.', 1.00, 'Lot', 0.00, 0.00, 1, 6),
(1, 'Stainless Steel Sport Pipes.', 1.00, 'Lot', 0.00, 0.00, 1, 7),
(1, 'With PVC coated', 1.00, 'Lot', 0.00, 0.00, 1, 8),
(1, 'Jurassic Insulators NEMTEX.', 1.00, 'Lot', 0.00, 0.00, 1, 9),
(1, 'Number of Strands Wire Every 4', 1.00, 'Lot', 0.00, 0.00, 1, 10),
(1, 'Earth Spike.', 1.00, 'Set', 0.00, 0.00, 1, 11),
(1, '2Siren.', 2.00, 'Nos', 0.00, 0.00, 1, 12),
(1, 'Light.', 1.00, 'Set', 0.00, 0.00, 1, 13),
(1, 'HT cable.', 1.00, 'Roll', 0.00, 0.00, 1, 14),
(1, 'S.S Wire 1.2mm grade 316 L', 1.00, 'Lot', 0.00, 0.00, 1, 15),
(1, 'Metal Enclosure.', 1.00, 'Unit', 0.00, 0.00, 1, 16),
(1, 'With GSM', 1.00, 'Unit', 0.00, 0.00, 1, 17);

-- Seed Quotation Terms & Conditions for Quote 00511
INSERT INTO `quotation_terms` (`quotation_id`, `term_title`, `term_content`, `sort_order`) VALUES
(1, 'PRICES', 'Delivered and installed in Karachi, prices are in Pakistani Rupees without GST.', 1),
(1, 'PAYMENT', '50% Advance along with order 50% After Commissioning.', 2),
(1, 'DELIVERY', 'within 15 days of receiving the advance payment and the confirmed order.', 3),
(1, 'VALIDITY', 'The prices are only available for a period of 15 days.', 4),
(1, 'WARRANTY', 'Two years for System and One year for other maintenance.', 5);

-- Seed Dynamic Custom Fields for Quote 00511
INSERT INTO `quotation_custom_fields` (`quotation_id`, `field_name`, `field_value`, `field_type`, `field_section`, `sort_order`) VALUES
(1, 'Strands Configuration', '8-Strands High Tension Perimeter Wire', 'text', 'specification', 1),
(1, 'Site Location Code', 'Hub-Chowkey Sector 2B', 'text', 'client', 2),
(1, 'Warranty Period', '2 Years System / 1 Year Maintenance', 'text', 'terms', 3),
(1, 'Commissioning Lead Time', '15 Days from Advance Payment', 'text', 'terms', 4);
