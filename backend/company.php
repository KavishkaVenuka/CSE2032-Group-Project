<?php
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
error_log($_SESSION['id']);

if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized - Please login"]);
    exit;
} 
error_log($_SESSION['email']);
error_log($_SESSION['id']); 


try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=job_cgu;charset=utf8',
        'root',
        ''
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

try {
   
    $stmt = $pdo->prepare("
        SELECT id, com_name, bussiness_type, image ,status
        FROM company 
        WHERE id = ?
    ");
    $stmt->execute([$_SESSION['id']]);
    $company = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$company) {
        http_response_code(404);
        echo json_encode(["error" => "Company not found"]);
        exit;
    }

    
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as activeJobs
        FROM job 
        WHERE com_id = ? AND closing_date >= CURDATE()
    ");
    $stmt->execute([$company['id']]);
    $metrics = $stmt->fetch(PDO::FETCH_ASSOC);
    
  
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as totalApplications
        FROM application a
        JOIN job j ON a.job_id = j.job_id
        WHERE j.com_id = ?
    ");
    $stmt->execute([$company['id']]);
    $appMetrics = $stmt->fetch(PDO::FETCH_ASSOC);
    $metrics['totalApplications'] = $appMetrics['totalApplications'];
    $_SESSION['company_name'] = $company['com_name'];
    $_SESSION['business_type'] = $company['bussiness_type'];
   
    $metrics['profileViews'] = 1847;
    $metrics['avgResponseTime'] = "2.4h";


    $stmt = $pdo->prepare("
        SELECT 
            job_id as id,
            `job_title` as title,
            job_type as type,
            job_location as location,
            job_description as description,
            created_at
        FROM job 
        WHERE com_id = ? AND closing_date >= CURDATE()
        ORDER BY created_at DESC
    ");
    $stmt->execute([$company['id']]);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    
    foreach ($jobs as &$job) {
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as applicant_count 
            FROM application 
            WHERE job_id = ?
        ");
        $stmt->execute([$job['id']]);
        $countData = $stmt->fetch(PDO::FETCH_ASSOC);
        $job['applicants'] = $countData['applicant_count'] ?? 0;
        
       
        $created = new DateTime($job['created_at']);
        $now = new DateTime();
        $interval = $created->diff($now);
        
        if ($interval->d > 0) {
            $job['postedDate'] = $interval->d == 1 ? '1 day ago' : $interval->d . ' days ago';
        } elseif ($interval->h > 0) {
            $job['postedDate'] = $interval->h == 1 ? '1 hour ago' : $interval->h . ' hours ago';
        } else {
            $job['postedDate'] = 'Just now';
        }
        
        
        unset($job['created_at']);
    }

    
    $responseData = [
        "company" => [
            "name" => $company['com_name'],
            "logo" => !empty($company['image']) ? $company['image'] : 
                     "https://via.placeholder.com/56x56/8b5cf6/ffffff?text=" . substr($company['com_name'], 0, 2),
            "category" => $company['bussiness_type'],
            "status" => $company['status']
        ],
        "metrics" => $metrics,
        "jobs" => array_map(function($job) use ($company) {
            return [
                "id" => $job['id'],
                "title" => $job['title'],
                "company" => $company['com_name'],
                "description" => $job['description'],
                "type" => $job['type'],
                "applicants" => $job['applicants'],
                "postedDate" => $job['postedDate'],
                "location" => $job['location']
            ];
        }, $jobs)
    ];

    echo json_encode($responseData);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
}
?>