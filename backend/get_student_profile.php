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
    $stmt = $pdo->prepare("SELECT f_name, l_name FROM student WHERE id = ?");
    $stmt->execute([$_SESSION['student_id']]);
    $student = $stmt->fetch();
    if ($student) {
        echo json_encode(['name' => $student['f_name'] . ' ' . $student['l_name']]);
    } else {
        echo json_encode(['name' => 'Unknown Student']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}