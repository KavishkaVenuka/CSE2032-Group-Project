<?php
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start();

if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}
error_log($_SESSION['company_name']);
error_log($_SESSION['business_type']);

echo json_encode([
    'company_name' => $_SESSION['company_name'] ?? 'Company Name',
    'business_type' => $_SESSION['business_type'] ?? 'Business Type'
]);
?>