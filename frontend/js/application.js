function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function goBack() {
  window.location.href = "../html/company.html";
}

async function loadApplications() {
  try {
    const jobId = localStorage.getItem("selectedJobId");
    if (!jobId) {
      throw new Error("No job selected");
    }

    const container = document.getElementById("applications-list");
    container.innerHTML = '<div class="loading">Loading applications...</div>';

    const jobResponse = await fetch(
      `http://localhost/WEB_FINAL_CODES/backend/job.php?id=${jobId}`,
      {
        credentials: "include",
      }
    );

    if (!jobResponse.ok) {
      throw new Error("Failed to load job details");
    }
    const job = await jobResponse.json();

    document.getElementById(
      "job-title"
    ).textContent = `Applications for ${job.data.job_title}`;

    const appsResponse = await fetch(
      `http://localhost/WEB_FINAL_CODES/backend/application.php?job_id=${jobId}`,
      {
        credentials: "include",
      }
    );

    if (!appsResponse.ok) {
      throw new Error("Failed to load applications");
    }
    const applications = await appsResponse.json();

    document.getElementById(
      "applicant-count"
    ).textContent = `${applications.length} applicants`;

    container.innerHTML = "";
    if (applications.length === 0) {
      container.innerHTML =
        '<div class="no-applications">No applications found for this job</div>';
      return;
    }

    applications.forEach((app) => {
      const initials = `${app.student.fname.charAt(
        0
      )}${app.student.lname.charAt(0)}`;

      const card = document.createElement("div");
      card.className = "application-card";
      card.innerHTML = `
                <div class="student-avatar">${initials}</div>
                <div class="student-info">
                    <h3>${app.student.fname} ${app.student.lname}</h3>
                    <div class="student-details">
                        <span>📧 ${app.student.email}</span>
                        <span>🎓 ${app.student.degree}</span>       
                    </div>
                    <div class="student-address">📍${app.student.dep_name}</div>
                    <div class="application-date">
                        Applied: ${formatDate(app.applied_date)}
                    </div>
                </div>
                <div class="application-actions">
                    <button class="btn-contact" onclick="contactStudent(${
                      app.student.id
                    }, '${app.student.email}')">
    ✉ Contact
</button>
                </div>
            `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error:", error);
    const container = document.getElementById("applications-list");
    container.innerHTML = `
            <div class="error">
                <p>${error.message}</p>
                <button onclick="loadApplications()">⟳ Retry</button>
            </div>
        `;
  }
}



async function loadCompanyInfo() {
  try {
    const response = await fetch(
      "http://localhost/WEB_FINAL_CODES/backend/get_company_info.php",
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load company info");
    }

    const company = await response.json();
    document.querySelector(".company-name").textContent = company.company_name;
    document.querySelector(".company-type").textContent = company.business_type;
  } catch (error) {
    console.error("Error loading company info:", error);
  }
}


function contactStudent(studentId, email) {
      const subject = encodeURIComponent("Regarding your job application");
  const body = encodeURIComponent(`Hello,\n\nWe are reaching out regarding your application.\n\nBest regards,\n${document.querySelector(".company-name")?.textContent || "Our Company"}`);
  
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
  
  window.open(gmailUrl, '_blank');
}

document.addEventListener("DOMContentLoaded", function () {
  loadApplications();
  loadCompanyInfo();
});