<?php
/**
 * Eagle Eye Security System - Quotations API
 * File: api/quotations.php
 * Handles CRUD operations, dynamic fields insertion, and line items.
 */

require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}

function handleGet($pdo) {
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare("SELECT * FROM quotations WHERE id = ?");
        $stmt->execute([$id]);
        $quotation = $stmt->fetch();

        if (!$quotation) {
            http_response_code(404);
            echo json_encode(['error' => 'Quotation not found']);
            return;
        }

        // Fetch Items
        $stmtItems = $pdo->prepare("SELECT * FROM quotation_items WHERE quotation_id = ? ORDER BY sort_order ASC, id ASC");
        $stmtItems->execute([$id]);
        $quotation['items'] = $stmtItems->fetchAll();

        // Fetch Terms
        $stmtTerms = $pdo->prepare("SELECT * FROM quotation_terms WHERE quotation_id = ? ORDER BY sort_order ASC, id ASC");
        $stmtTerms->execute([$id]);
        $quotation['terms'] = $stmtTerms->fetchAll();

        // Fetch Dynamic Custom Fields
        $stmtFields = $pdo->prepare("SELECT * FROM quotation_custom_fields WHERE quotation_id = ? ORDER BY sort_order ASC, id ASC");
        $stmtFields->execute([$id]);
        $quotation['custom_fields'] = $stmtFields->fetchAll();

        echo json_encode(['success' => true, 'data' => $quotation]);
    } else {
        $query = "SELECT q.*, COUNT(qi.id) as item_count 
                  FROM quotations q 
                  LEFT JOIN quotation_items qi ON q.id = qi.quotation_id 
                  GROUP BY q.id 
                  ORDER BY q.id DESC";
        $stmt = $pdo->query($query);
        $quotations = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $quotations]);
    }
}

function handlePost($pdo) {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (!$data || empty($data['quote_number']) || empty($data['client_name'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing required fields: quote_number and client_name']);
        return;
    }

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            INSERT INTO quotations (
                quote_number, quote_date, valid_till, client_name, client_company,
                client_location, client_phone, client_email, subject, brand,
                currency, subtotal, tax_percent, tax_amount, discount_amount,
                total_amount, status, closing_note, created_by
            ) VALUES (
                :quote_number, :quote_date, :valid_till, :client_name, :client_company,
                :client_location, :client_phone, :client_email, :subject, :brand,
                :currency, :subtotal, :tax_percent, :tax_amount, :discount_amount,
                :total_amount, :status, :closing_note, :created_by
            )
            ON DUPLICATE KEY UPDATE
                quote_date = VALUES(quote_date),
                valid_till = VALUES(valid_till),
                client_name = VALUES(client_name),
                client_company = VALUES(client_company),
                client_location = VALUES(client_location),
                client_phone = VALUES(client_phone),
                client_email = VALUES(client_email),
                subject = VALUES(subject),
                brand = VALUES(brand),
                currency = VALUES(currency),
                subtotal = VALUES(subtotal),
                tax_percent = VALUES(tax_percent),
                tax_amount = VALUES(tax_amount),
                discount_amount = VALUES(discount_amount),
                total_amount = VALUES(total_amount),
                status = VALUES(status),
                closing_note = VALUES(closing_note)
        ");

        $stmt->execute([
            ':quote_number'    => $data['quote_number'],
            ':quote_date'      => $data['quote_date'] ?? date('Y-m-d'),
            ':valid_till'      => $data['valid_till'] ?? date('Y-m-d', strtotime('+15 days')),
            ':client_name'     => $data['client_name'],
            ':client_company'  => $data['client_company'] ?? '',
            ':client_location' => $data['client_location'] ?? '',
            ':client_phone'    => $data['client_phone'] ?? '',
            ':client_email'    => $data['client_email'] ?? '',
            ':subject'         => $data['subject'] ?? '',
            ':brand'           => $data['brand'] ?? 'NEMTEX SOUTH AFRICA',
            ':currency'        => $data['currency'] ?? 'PKR',
            ':subtotal'        => $data['subtotal'] ?? 0.00,
            ':tax_percent'     => $data['tax_percent'] ?? 0.00,
            ':tax_amount'      => $data['tax_amount'] ?? 0.00,
            ':discount_amount' => $data['discount_amount'] ?? 0.00,
            ':total_amount'    => $data['total_amount'] ?? 0.00,
            ':status'          => $data['status'] ?? 'draft',
            ':closing_note'    => $data['closing_note'] ?? 'Thank you for your business',
            ':created_by'      => $data['created_by'] ?? 1,
        ]);

        $quotationId = $pdo->lastInsertId();
        if (!$quotationId) {
            $stmtFind = $pdo->prepare("SELECT id FROM quotations WHERE quote_number = ?");
            $stmtFind->execute([$data['quote_number']]);
            $quotationId = $stmtFind->fetchColumn();
        }

        // Clean existing items & terms & dynamic fields if updating
        $pdo->prepare("DELETE FROM quotation_items WHERE quotation_id = ?")->execute([$quotationId]);
        $pdo->prepare("DELETE FROM quotation_terms WHERE quotation_id = ?")->execute([$quotationId]);
        $pdo->prepare("DELETE FROM quotation_custom_fields WHERE quotation_id = ?")->execute([$quotationId]);

        // Insert Items
        if (!empty($data['items']) && is_array($data['items'])) {
            $stmtItem = $pdo->prepare("
                INSERT INTO quotation_items (quotation_id, description, quantity, unit, unit_price, total_price, is_bullet, sort_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            foreach ($data['items'] as $index => $item) {
                $stmtItem->execute([
                    $quotationId,
                    $item['description'] ?? '',
                    $item['quantity'] ?? 1,
                    $item['unit'] ?? '',
                    $item['unit_price'] ?? 0,
                    $item['total_price'] ?? 0,
                    isset($item['is_bullet']) ? ($item['is_bullet'] ? 1 : 0) : 1,
                    $index + 1
                ]);
            }
        }

        // Insert Terms
        if (!empty($data['terms']) && is_array($data['terms'])) {
            $stmtTerm = $pdo->prepare("
                INSERT INTO quotation_terms (quotation_id, term_title, term_content, sort_order)
                VALUES (?, ?, ?, ?)
            ");
            foreach ($data['terms'] as $index => $term) {
                $stmtTerm->execute([
                    $quotationId,
                    $term['term_title'] ?? $term['title'] ?? '',
                    $term['term_content'] ?? $term['content'] ?? '',
                    $index + 1
                ]);
            }
        }

        // Insert Dynamic Custom Fields
        if (!empty($data['custom_fields']) && is_array($data['custom_fields'])) {
            $stmtField = $pdo->prepare("
                INSERT INTO quotation_custom_fields (quotation_id, field_name, field_value, field_type, field_section, sort_order)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            foreach ($data['custom_fields'] as $index => $field) {
                $stmtField->execute([
                    $quotationId,
                    $field['field_name'] ?? $field['name'] ?? '',
                    $field['field_value'] ?? $field['value'] ?? '',
                    $field['field_type'] ?? $field['type'] ?? 'text',
                    $field['field_section'] ?? $field['section'] ?? 'client',
                    $index + 1
                ]);
            }
        }

        $pdo->commit();
        echo json_encode([
            'success'      => true,
            'message'      => 'Quotation and dynamic fields saved successfully',
            'quotation_id' => $quotationId
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error'   => 'Failed to save quotation: ' . $e->getMessage()
        ]);
    }
}
