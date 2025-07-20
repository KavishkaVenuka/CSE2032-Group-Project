<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once("db.php");

$data = json_decode(file_get_contents('php://input'), true);

if (
    empty($data['com_name']) ||
    empty($data['reg_no']) ||
    empty($data['email']) ||
    empty($data['password']) ||
    empty($data['business_type']) ||
    empty($data['contact_no']) ||
    empty($data['no_of_employees']) ||
    empty($data['address'])
) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit;
}

// Check if email already exists in student or company tables
$email = $data['email'];

$emailCheckQuery = "SELECT email FROM student WHERE email = ? UNION SELECT email FROM company WHERE email = ?";
$stmt = $conn->prepare($emailCheckQuery);
$stmt->bind_param("ss", $email, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email is already registered."]);
    exit;
}

// Check for duplicate registration number
$stmt = $conn->prepare("SELECT id FROM company WHERE reg_no = ?");
$stmt->bind_param("s", $data['reg_no']);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Registration number already registered. Please use a different registration number."]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Hash the password
$hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
// Prepare insert
$stmt = $conn->prepare("INSERT INTO company (com_name, reg_no, email, password, bussiness_type, contact_no, no_of_employees, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param(
    "ssssssss",
    $data['com_name'],
    $data['reg_no'],
    $data['email'],
    $hashedPassword,
    $data['business_type'],
    $data['contact_no'],
    $data['no_of_employees'],
    $data['address']
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Company registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
