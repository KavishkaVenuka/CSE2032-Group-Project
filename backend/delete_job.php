<?php


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5500");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit;
}


header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if (!isset($_SESSION['email'])) {
    http_response_code(401); 
    echo json_encode(["error" => "Not logged in"]);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); 
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}


$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data || !isset($data['job_id'])) {
    http_response_code(400); 
    echo json_encode(["error" => "Invalid JSON or missing job_id"]);
    exit;
}

$job_id = $data['job_id'];
$company_id = $_SESSION['id'];

try {
    $pdo = new PDO("mysql:host=localhost;dbname=job_cgu;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	error_log("Connected successfully");
    
    $verifyStmt = $pdo->prepare("SELECT com_id FROM job WHERE job_id = ?");
    $verifyStmt->execute([$job_id]);
    $job = $verifyStmt->fetch(PDO::FETCH_ASSOC);

    if (!$job) {
        http_response_code(404); 
        echo json_encode(["error" => "Job not found"]);
        exit;
    }

    if ($job['com_id'] != $company_id) {
        http_response_code(403); 
        echo json_encode(["error" => "You don't have permission to delete this job"]);
        exit;
    }

    
    $deleteStmt = $pdo->prepare("DELETE FROM job WHERE job_id = ?");
    $deleteStmt->execute([$job_id]);

    if ($deleteStmt->rowCount() > 0) {
        error_log("Job successfully deleted");
        echo json_encode(["success" => "Job successfully deleted"]);
    } else {
        http_response_code(404); 
        echo json_encode(["error" => "Job not found or already deleted"]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>