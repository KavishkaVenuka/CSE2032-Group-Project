<?php
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
error_log("Session company id: " . ($_SESSION['id'] ?? 'not set'));

if (!isset($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized - Please login"]);
    exit;
}

$company_id = $_SESSION['id'];

try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=job_cgu;charset=utf8',
        'root',
        ''
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id, com_name, reg_no, email, bussiness_type, url, bio, contact_no, address, no_of_employees, image 
        FROM company 
        WHERE id = ?
    ");
    $stmt->execute([$company_id]);
    $company = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$company) {
        http_response_code(404);
        echo json_encode(["error" => "Company not found"]);
        exit;
    }

    $responseData = [
        "company" => [
            "id" => $company['id'],
            "com_name" => $company['com_name'],
            "reg_no" => $company['reg_no'],
            "email" => $company['email'],
            "bussiness_type" => $company['bussiness_type'],
            "url" => $company['url'],
            "bio" => $company['bio'],
            "contact_no" => $company['contact_no'],
            "address" => $company['address'],
            "no_of_employees" => (int)$company['no_of_employees'],
            "logo" => !empty($company['image']) 
                ? $company['image'] 
                : "https://via.placeholder.com/56x56/8b5cf6/ffffff?text=" . substr($company['com_name'], 0, 2),
        ]
    ];

    echo json_encode($responseData);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
}
?>
