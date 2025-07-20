<?php
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
session_start();


$authenticated = false;

if (isset($_SESSION['email']) && !empty($_SESSION['id'])) {
  
    $authenticated = true;
}

echo json_encode([
    'authenticated' => $authenticated,
    'user_id' => $_SESSION['user_id'] ?? null
]);