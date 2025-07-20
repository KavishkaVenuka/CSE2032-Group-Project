<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once("db.php");

// Read JSON data from JS
$data = json_decode(file_get_contents('php://input'), true);

// Validate fields coming from JS (fixing names)
if (
    empty($data['firstName']) ||
    empty($data['lastName']) ||
    empty($data['email']) ||
    empty($data['password']) ||
    empty($data['degree']) ||
    empty($data['department']) ||
    empty($data['year']) ||
    empty($data['reg_no'])
) {
    echo json_encode(["success" => false, "message" => "All required fields are mandatory."]);
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


$hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

// LinkedIn is optional
$linkedin = $data['linkedin'] ?? null;

// Insert into `student` table
$stmt = $conn->prepare("INSERT INTO student (f_name, l_name, email, password, dgree, dep_name, year, reg_no, linkedin_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param(
    "sssssssss",
    $data['firstName'],
    $data['lastName'],
    $data['email'],
    $hashedPassword,
    $data['degree'],
    $data['department'],
    $data['year'],
    $data['reg_no'],
    $linkedin
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Student registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
