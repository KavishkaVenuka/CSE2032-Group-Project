<?php


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5500");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit;
}


header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

session_start();
error_log($_SESSION['email']."Hello world");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (!isset($_SESSION['email'])) {
    http_response_code(401); 
    echo json_encode(["error" => "Not logged in"]);
    exit;
}


$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// validate data
if (!$data) {
    http_response_code(400); 
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}


$company_id       = $_SESSION['id'];  
$job_title        = $data['job_title'] ?? '';
$job_type         = $data['job_type'] ?? '';
$job_category     = $data['job_category'] ?? '';
$job_location     = $data['job_location'] ?? '';
$job_tags         = $data['job_tags'] ?? '';
$closing_date     = $data['closing_date'] ?? '';
$job_description  = $data['job_description'] ?? '';
$requirements     = $data['requirements'] ?? '';
$responsibilities = $data['responsibilities'] ?? '';


if (
    empty($job_title) ||
    empty($job_type) ||
    empty($job_category) ||
    empty($job_location) ||
    empty($closing_date) ||
    empty($job_description) ||
    empty($requirements) ||
    empty($responsibilities)
) {
    http_response_code(422); 
    echo json_encode(["error" => "Please fill all required fields"]);
    exit;
}


try {
    $pdo = new PDO("mysql:host=localhost;dbname=job_cgu;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	 error_log("Connected successfully") ;

    $stmt = $pdo->prepare("
        INSERT INTO job (
            com_id,
            job_title,
            job_type,
            job_category,
            job_location,
            job_tags,
            closing_date,
            job_description,
            requirements,
            responsibilities
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

try {
    $stmt->execute([
        $company_id,
        $job_title,
        $job_type,
        $job_category,
        $job_location,
        $job_tags,
        $closing_date,
        $job_description,
        $requirements,
        $responsibilities
    ]);
    error_log("Job successfully added");
} catch (PDOException $e) {
    error_log("Insert error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Insert failed: " . $e->getMessage()]);
    exit;
}

	error_log( "Job successfully added");
    echo json_encode(["success" => "Job successfully added"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
