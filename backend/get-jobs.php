<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once("db.php");

$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;

// Prepare jobs
$jobs = [];
$categoryCounts = [];

try {
    // Fetch jobs
    $query = "
        SELECT j.*, c.com_name, c.image
        FROM job j
        JOIN company c ON j.com_id = c.id
        ORDER BY j.created_at DESC
        LIMIT $offset, $limit
    ";
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    while ($row = $result->fetch_assoc()) {
    $jobs[] = [
        "job_id" => $row["job_id"],
        "job_title" => $row["job_title"],
        "job_description" => $row["job_description"],
        "job_tag" => isset($row["job_tags"]) ? $row["job_tags"] : "",
        "job_type" => $row["job_type"],
        "job_location" => $row["job_location"],
        "created_at" => $row["created_at"],
        "no_of_applicants" => $row["no_of_applicants"],
        "requirements" => $row["requirements"],
        "responsibilities" => $row["responsibilities"],
        "com_name" => $row["com_name"],
        "image" => $row["image"]
    ];
}
    // Fetch category counts
    $countQuery = "SELECT job_category, COUNT(*) as count FROM job GROUP BY job_category";
    $countResult = $conn->query($countQuery);
    if ($countResult) {
        while ($row = $countResult->fetch_assoc()) {
            $category = trim($row['job_category']);
            $categoryCounts[$category] = (int)$row['count'];
        }
    }

    // Success response
    echo json_encode([
        "success" => true,
        "jobs" => $jobs,
        "categoryCounts" => $categoryCounts
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();
