<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['student_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

require_once __DIR__ . '/DBConnector.php';

try {
    $pdo = DBConnector::getDBInstance();
    $stmt = $pdo->prepare("SELECT notification_id, title, message, is_read, created_at FROM student_notifications WHERE student_id = ? ORDER BY created_at DESC");
    $stmt->execute([$_SESSION['student_id']]);
    $notifications = $stmt->fetchAll();
    echo json_encode(['notifications' => $notifications]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}