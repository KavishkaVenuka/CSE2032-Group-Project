<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Debug logging
error_log("Received request: " . file_get_contents('php://input'));

// Verify session
if (!isset($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// Get input data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid data"]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=localhost;dbname=job_cgu;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("
        UPDATE company 
        SET com_name = :name,
            reg_no = :reg_no,
            email = :email,
            bussiness_type = :type,
            url = :url,
            bio = :bio,
            contact_no = :phone,
            address = :address,
            no_of_employees = :employees
        WHERE id = :id
    ");

    $stmt->execute([
        ':name' => $data['com_name'],
        ':reg_no' => $data['reg_no'] ?? null,
        ':email' => $data['email'],
        ':type' => $data['bussiness_type'] ?? null,
        ':url' => $data['url'] ?? null,
        ':bio' => $data['bio'] ?? null,
        ':phone' => $data['contact_no'],
        ':address' => $data['address'] ?? null,
        ':employees' => $data['no_of_employees'] ?? 1,
        ':id' => $_SESSION['id']
    ]);

    // Verify update
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Updated successfully"]);
    } else {
        echo json_encode(["error" => "No changes made"]);
    }

} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Database error"]);
}
?>