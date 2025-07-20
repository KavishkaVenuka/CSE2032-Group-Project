<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user']) || !$_SESSION['user']['logged_in']) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

require_once __DIR__ . '/DBConnector.php';
$user = $_SESSION['user'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $updates = [];
    $params = [];
    $table = $user['role'];
    $id = $user['id'];

    if (isset($data['name']) && $data['name'] !== '') {
        $updates[] = ($table === 'student' ? 'f_name' : ($table === 'company' ? 'com_name' : 'admin_name')) . ' = ?';
        $params[] = $data['name'];
        $_SESSION['user']['name'] = $data['name'];
    }
    if (isset($data['email']) && $data['email'] !== '') {
        $updates[] = 'email = ?';
        $params[] = $data['email'];
        $_SESSION['user']['email'] = $data['email'];
    }
    if (isset($data['password']) && $data['password'] !== '') {
        $updates[] = 'password = ?';
        $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
    }
    if (count($updates) > 0) {
        $params[] = $id;
        try {
            $pdo = DBConnector::getDBInstance();
            $sql = "UPDATE `$table` SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo json_encode(['success' => true]);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update profile']);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No data to update']);
        exit;
    }
}

// GET: Return name and email for the logged-in user
$response = [
    'name' => $user['name'],
    'email' => $user['email']
];
echo json_encode($response); 