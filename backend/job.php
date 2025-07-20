<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
error_log("Setting CORS headers");
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

error_log("Starting session");
session_start();
error_log("Session ID: " . session_id());
error_log("Session data: " . print_r($_SESSION, true));

if (!isset($_SESSION['id'])) {
    $errorMsg = "Unauthorized: Missing id in session";
    error_log("ERROR: $errorMsg");
    http_response_code(401);
    die(json_encode([
        'error' => $errorMsg,
        'session_debug' => $_SESSION,
        'advice' => 'Ensure login sets $_SESSION[\"id\"]'
    ]));
}

error_log("Authenticated as company ID: " . $_SESSION['id']);

error_log("Validating job ID");
$jobId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (!$jobId || $jobId < 1) {
    $errorMsg = "Invalid job ID: " . var_export($_GET['id'], true);
    error_log("ERROR: $errorMsg");
    http_response_code(400);
    die(json_encode([
        'error' => 'Invalid job ID',
        'received_value' => $_GET['id'] ?? 'null',
        'expected_format' => 'Positive integer'
    ]));
}

error_log("Valid job ID received: $jobId");


try {
    error_log("Attempting database connection");
    $pdo = new PDO(
        "mysql:host=localhost;dbname=job_cgu;charset=utf8mb4",
        "root",
        "",
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
    error_log("Database connected successfully");

   
    $query = "SELECT * FROM job WHERE job_id = ? AND com_id = ? LIMIT 1";
    error_log("Prepared query: $query");
    error_log("Parameters: [job_id=$jobId, company_id=" . $_SESSION['id'] . "]");

    $stmt = $pdo->prepare($query);
    $stmt->execute([$jobId, $_SESSION['id']]);

    $job = $stmt->fetch();

    if (!$job) {
        $errorMsg = "Job not found or access denied";
        error_log("ERROR: $errorMsg");
        http_response_code(404);
        die(json_encode([
            'error' => $errorMsg,
            'debug' => [
                'queried_job_id' => $jobId,
                'company_reference' => $_SESSION['id'],
                'advice' => 'Verify job exists and belongs to this company'
            ]
        ]));
    }

    
    error_log("Job found: " . json_encode($job));
    echo json_encode([
        'success' => true,
        'data' => $job,
        'debug' => [
            'session_id' => session_id(),
            'execution_time' => microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"]
        ]
    ]);

} catch (PDOException $e) {
    $errorMsg = "Database error: " . $e->getMessage();
    error_log("CRITICAL ERROR: $errorMsg");
    http_response_code(500);
    echo json_encode([
        'error' => 'Database operation failed',
        'technical_details' => $e->getMessage(),
        'query' => $query ?? 'Not prepared',
        'advice' => 'Check database schema matches query expectations'
    ]);
} catch (Exception $e) {
    $errorMsg = "General error: " . $e->getMessage();
    error_log("UNEXPECTED ERROR: $errorMsg");
    http_response_code(500);
    echo json_encode([
        'error' => 'Unexpected system error',
        'details' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
} finally {
    error_log("REQUEST COMPLETED");
}
?>
