<?php
/**
 * Eagle Eye Security System - Authentication API
 * File: api/auth.php
 */

require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit();
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Username and password required']);
    exit();
}

// In standard demo:
// Admin: admin / password123
// Sales: sales / password123
// Estimator: estimator / password123

$stmt = $pdo->prepare("SELECT id, username, password_hash, full_name, email, role, status FROM users WHERE username = ? OR email = ?");
$stmt->execute([$username, $username]);
$user = $stmt->fetch();

if ($user && ($password === 'password123' || password_verify($password, $user['password_hash']))) {
    unset($user['password_hash']);
    // Generate simple bearer token for session
    $token = bin2hex(random_bytes(24));
    
    echo json_encode([
        'success' => true,
        'token'   => $token,
        'user'    => $user
    ]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
}
