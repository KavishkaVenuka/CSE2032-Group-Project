<?php
session_start();
// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// For development (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// DB configuration
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
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Handle preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Handle login POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Email and password are required"]);
        exit;
    }

    // Tables to search: table_name => [id, email, password, display_name_column]
    $userTables = [
        'student' => ['id', 'email', 'password', 'f_name'],
        'company' => ['id', 'email', 'password', 'com_name'],
        'admin' => ['id', 'email', 'password', 'admin_name']
    ];

    foreach ($userTables as $table => $fields) {
        $selectFields = implode(", ", $fields);
        try {
            $stmt = $pdo->prepare("SELECT $selectFields FROM `$table` WHERE email = :email COLLATE utf8mb4_bin");
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            $user = $stmt->fetch();

            $isValid = false;
            if ($user) {
                if ($table === 'admin') {
                    // Admin password is stored as plain text
                    $isValid = ($password === $user['password']);
                } else {
                    // Students and companies use hashed passwords
                    $isValid = password_verify($password, $user['password']);
                }
            }

            if ($isValid) {
                session_regenerate_id(true);

                // Save user info in session
                $_SESSION['email'] = $user['email'];
                $_SESSION['id'] = $user['id'];
                $_SESSION['user'] = [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'name' => $user[$fields[3]],
                    'role' => $table,
                    'logged_in' => true
                ];
                
                // Set student_id in session if user is a student
                if ($table === 'student') {
                    $_SESSION['student_id'] = $user['id'];
                }

                // For debugging
                error_log("Login successful for: " . $user['email']);
                error_log("Session ID: " . session_id());

                echo json_encode([
                    "success" => true,
                    "user" => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'name' => $user[$fields[3]],
                        'role' => $table
                    ]
                ]);
                exit;
            }
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            echo json_encode([
                "success" => false,
                "message" => "Database error"
            ]);
            exit;
        }
    }

    // If not found in any table
    error_log("Login failed for: " . $email);
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    exit;
}

// If not POST
echo json_encode(["success" => false, "message" => "Invalid request method"]);