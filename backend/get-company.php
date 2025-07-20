<?php
header('Content-Type: application/json');
require_once("db.php");

$companiesQuery = "
    SELECT 
        id AS company_id,
        com_name,
        bussiness_type,
        address,
        no_of_employees,
        bio,
        url,
        image
    FROM company
";

$companiesResult = $conn->query($companiesQuery);

$companies = [];

while ($company = $companiesResult->fetch_assoc()) {
    $companyId = $company['company_id'];

    $jobsQuery = "
        SELECT job_title, job_type, job_location 
        FROM job 
        WHERE com_id = $companyId
    ";
    $jobsResult = $conn->query($jobsQuery);

    $companyJobs = [];
    while ($job = $jobsResult->fetch_assoc()) {
        $companyJobs[] = $job;
    }

    $company['jobs'] = $companyJobs;
    $company['open_positions'] = count($companyJobs);

    $companies[] = $company;
}

echo json_encode(["success" => true, "companies" => $companies]);
$conn->close();
