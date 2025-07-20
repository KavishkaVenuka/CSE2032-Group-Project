<?php

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Preflight OPTIONS request received");
    header("Access-Control-Allow-Origin: http://localhost:5500");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit;
}


header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");


ini_set('display_errors', 1);
error_reporting(E_ALL);

error_log("========== NEW REQUEST ==========");
session_start();
error_log("Session started with ID: " . session_id());
error_log("Session contents: " . print_r($_SESSION, true));


if (!isset($_SESSION['id'])) {
    error_log("Unauthorized request - no company_id in session");
    http_response_code(401);
    die(json_encode(['error' => 'Unauthorized - Please login first']));
}
error_log("Company authenticated with ID: " . $_SESSION['id']);


$jobId = filter_input(INPUT_GET, 'job_id', FILTER_VALIDATE_INT);
error_log("Received job_id: " . var_export($jobId, true));
if (!$jobId) {
    error_log("Invalid job_id in request");
    http_response_code(400);
    die(json_encode(['error' => 'Invalid job ID']));
}


try {
    error_log("Connecting to database...");
    $pdo = new PDO("mysql:host=localhost;dbname=job_cgu", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("Database connection successful");

  
    $stmt = $pdo->prepare("SELECT job_id FROM job WHERE job_id = ? AND com_id = ?");
    error_log("Executing ownership check query for job_id=$jobId and id=" . $_SESSION['id']);
    $stmt->execute([$jobId, $_SESSION['id']]);
    
    if ($stmt->rowCount() === 0) {
        error_log("Access denied - job does not belong to this company");
        http_response_code(403);
        die(json_encode(['error' => 'You do not have access to this job']));
    }
    error_log("Job ownership verified");

   
    $stmt = $pdo->prepare("
        SELECT 
            a.application_id AS application_id,
            s.id AS student_id,
            s.f_name AS fname,
            s.l_name AS lname,
            s.email AS email,
            s.dgree AS degree,
            s.dep_name AS dep_name
        FROM application a
        JOIN student s ON a.student_id = s.id
        WHERE a.job_id = ?
    ");
    error_log("Fetching applications for job_id=$jobId");
    $stmt->execute([$jobId]);
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    error_log("Fetched " . count($applications) . " applications");

 
    $response = array_map(function($app) {
        return [
            'id' => $app['application_id'],
            'student' => [
                'id' => $app['student_id'],
                'fname' => $app['fname'],
                'lname' => $app['lname'],
                'email' => $app['email'],
                'degree' => $app['degree'],
                'dep_name' => $app['dep_name'],
            ]
        ];
    }, $applications);

    error_log("Response prepared successfully");
    echo json_encode($response);

} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Unexpected system error', 'details' => $e->getMessage()]);
} finally {
    error_log("========== REQUEST COMPLETED ==========");
}
?>
