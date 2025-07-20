<?php
header('Content-Type: application/json');
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once __DIR__ . '/DBConnector.php';

// If ?categories=1, return unique business types
if (isset($_GET['categories']) && $_GET['categories'] == '1') {
    try {
        $pdo = DBConnector::getDBInstance();
        $stmt = $pdo->prepare('SELECT DISTINCT bussiness_type FROM company');
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo json_encode(['success' => true, 'categories' => $categories]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $companyId = isset($data['id']) ? intval($data['id']) : 0;
    $isDelete = isset($data['delete']) && $data['delete'] ? true : false;
    if (!$companyId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid company id']);
        exit;
    }
    try {
        $pdo = DBConnector::getDBInstance();
        if ($isDelete) {
            $stmt = $pdo->prepare('UPDATE company SET isDeleted = 1 WHERE id = ?');
        } else {
            $stmt = $pdo->prepare('UPDATE company SET status = 1 WHERE id = ?');
        }
        $stmt->execute([$companyId]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error']);
    }
    exit;
}

// Default: GET pending companies
try {
    $pdo = DBConnector::getDBInstance();
    $stmt = $pdo->prepare('SELECT id, com_name, reg_no, email, bussiness_type, url, bio, contact_no, address, no_of_employees, image FROM company WHERE status = 0 AND isDeleted = 0');
    $stmt->execute();
    $companies = $stmt->fetchAll();
    echo json_encode(['success' => true, 'companies' => $companies]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error']);
} 
