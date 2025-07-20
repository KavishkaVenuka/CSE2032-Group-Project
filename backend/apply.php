<?php
session_start();

// CORS headers — adjust frontend URL as needed
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database config
$db_host = 'localhost';
$db_name = 'job_cgu';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO(
        "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",
        $db_user,
        $db_pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

// Check if student is logged in
if (!isset( $_SESSION['id'] )) {
    echo json_encode([
        "success" => false,
        "message" => "You must be logged in to apply"
    ]);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method"
    ]);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);
$job_id = isset($data['job_id']) ? intval($data['job_id']) : 0;
$student_id = intval( $_SESSION['id'] );

if ($job_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid job ID"
    ]);
    exit;
}

try {
    // Check if already applied
    $checkStmt = $pdo->prepare("SELECT application_id FROM application WHERE student_id = :student_id AND job_id = :job_id");
    $checkStmt->execute([
        ':student_id' => $student_id,
        ':job_id' => $job_id
    ]);
    if ($checkStmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "You have already applied to this job"
        ]);
        exit;
    }

    // Insert application (status defaults to 'pending')
    $insertStmt = $pdo->prepare("INSERT INTO application (student_id, job_id) VALUES (:student_id, :job_id)");
    $insertStmt->execute([
        ':student_id' => $student_id,
        ':job_id' => $job_id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Application submitted successfully"
    ]);
} catch (PDOException $e) {
    error_log("Application error: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Failed to submit application"
    ]);
}