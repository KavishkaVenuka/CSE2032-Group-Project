<?php
session_start();
header('Content-Type: application/json');
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Check if student is logged in
if (!isset($_SESSION['student_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$student_id = $_SESSION['student_id'];

require_once __DIR__ . '/DBConnector.php';

try {
    $pdo = DBConnector::getDBInstance();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Fetch recent applications with job and company details
$sql = "
    SELECT 
        a.application_date,
        j.job_title,
        c.com_name,
        c.image
    FROM application a
    JOIN job j ON a.job_id = j.job_id
    JOIN company c ON j.com_id = c.id
    WHERE a.student_id = ?
    ORDER BY a.application_date DESC
    
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$student_id]);
$applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['applications' => $applications]);
