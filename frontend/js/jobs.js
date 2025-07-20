// ✅ Emoji-based Category Data
const categories = [
  {
    value: "education",
    name: "Education",
    icon: "📚",
    description: "Teaching, academic, and educational services",
    count: 98,
  },
  {
    value: "technology",
    name: "Technology",
    icon: "💻",
    description: "Software development, IT, and tech innovation roles",
    count: 156,
  },
  {
    value: "healthcare",
    name: "Healthcare",
    icon: "🩺",
    description: "Medical and healthcare-related positions",
    count: 84,
  },
  {
    value: "retail",
    name: "Retail",
    icon: "🏬",
    description: "Sales, merchandising, and retail management",
    count: 72,
  },
  {
    value: "finance",
    name: "Finance",
    icon: "💰",
    description: "Banking, accounting, and financial analysis",
    count: 63,
  },
  {
    value: "manufacturing",
    name: "Manufacturing",
    icon: "🏭",
    description: "Production, factories, and mechanical roles",
    count: 47,
  },
  {
    value: "hospitality_tourism",
    name: "Hospitality and Tourism",
    icon: "🏨",
    description: "Hotel, travel, and guest services",
    count: 58,
  },
  {
    value: "agriculture",
    name: "Agriculture",
    icon: "🚜",
    description: "Farming, food production, and rural development",
    count: 39,
  },
  {
    value: "construction_real_estate",
    name: "Construction and Real Estate",
    icon: "👷",
    description: "Building, property, and real estate services",
    count: 45,
  },
  {
    value: "transportation_logistics",
    name: "Transportation and Logistics",
    icon: "🚚",
    description: "Supply chain, delivery, and mobility roles",
    count: 52,
  },
  {
    value: "media_entertainment",
    name: "Media and Entertainment",
    icon: "🎬",
    description: "Creative, film, publishing, and journalism",
    count: 34,
  },
  {
    value: "professional_services",
    name: "Professional Services",
    icon: "🧑‍💼",
    description: "Consulting, legal, and business support",
    count: 61,
  },
  {
    value: "energy_utilities",
    name: "Energy and Utilities",
    icon: "⚡",
    description: "Power, water, and utility services",
    count: 22,
  },
  {
    value: "telecommunications",
    name: "Telecommunications",
    icon: "📡",
    description: "Network, telecom, and communication services",
    count: 29,
  },
  {
    value: "fashion_beauty",
    name: "Fashion and Beauty",
    icon: "👗",
    description: "Apparel, cosmetics, and lifestyle brands",
    count: 38,
  },
  {
    value: "other",
    name: "Other",
    icon: "❓",
    description: "Uncategorized or unique job roles",
    count: 19,
  },
];

// ✅ Render Category Cards
function renderCategoryCards() {
  const container = document.getElementById("categoriesContainer");
  if (!container) {
    console.warn('No element with id "categoriesContainer" found.');
    return;
  }

  container.innerHTML = "";

  categories.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "category-card";
    card.setAttribute("data-category", cat.value);
    card.innerHTML = `
      <div class="category-icon">${cat.icon}</div>
      <h3 class="category-name">${cat.name}</h3>
      <p class="category-description">${cat.description}</p>
      <span class="category-count">${cat.count}</span>
    `;
    container.appendChild(card);
  });
}

// ✅ Run after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  renderCategoryCards();
});

//company section
// 🔁 Function to fetch companies and their posted jobs from backend
async function fetchAndRenderCompanies() {
  try {
    // 🔗 Send request to the PHP backend that returns company data
    const response = await fetch("../../backend/get-company.php");
    const data = await response.json();

    // ❌ If data fetching fails, log an error
    if (!data.success) {
      console.error("Failed to fetch companies");
      return;
    }

    // 🎯 Target the container in HTML where companies will be rendered
    const container = document.getElementById("companyList");
    container.innerHTML = ""; // Clear previous contents

    // 🔄 Loop through each company and create its card
    data.companies.forEach((company) => {
      const companyCard = document.createElement("div");
      companyCard.className = "company-card";
      companyCard.dataset.companyId = company.company_id;

      // 🧱 Build HTML for the jobs listed under this company
      const jobItems = company.jobs
        .map(
          (job) => `
        <div class="company-job-item">
          <div class="company-job-title">${job.job_title}</div>
          <div class="company-job-meta">
            <span><i class="fas fa-briefcase"></i> ${job.job_type}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${job.job_location}</span>
          </div>
        </div>
      `
        )
        .join(""); // Convert array of job HTML to a single string

      // 🧱 Build the company card HTML
      companyCard.innerHTML = `
        <div class="company-header">
          <div class="company-logo-large">${company.com_name
            .slice(0, 2)
            .toUpperCase()}</div>
          <div class="company-details">
            <h3>${company.com_name}</h3>
            <div class="company-industry-tag">${company.bussiness_type.toUpperCase()}</div>
          </div>
        </div>
        <p class="company-description">${company.bio}</p>
        <div class="company-stats">
          <div class="company-stat">
            <i class="fas fa-map-marker-alt"></i>
            <span class="company-stat-value">${company.address}</span>
          </div>
          <div class="company-stat">
            <i class="fas fa-users"></i>
            <span class="company-stat-value">${
              company.no_of_employees
            } employees</span>
          </div>
          <div class="company-stat">
            <i class="fas fa-briefcase"></i>
            <span class="company-stat-value">${
              company.open_positions
            } open positions</span>
          </div>
        </div>
        <div class="company-actions">
          <a href="${company.url}" class="website-btn" target="_blank">
            <i class="fas fa-external-link-alt"></i>
            <span>Website</span>
          </a>
          <button class="view-jobs-btn" data-company-id="${company.company_id}">
            <span>View Jobs (${company.open_positions})</span>
          </button>
        </div>
        <div class="company-jobs" id="company-jobs-${company.company_id}">
          ${jobItems}
        </div>
      `;

      // 🧩 Add the final company card into the DOM container
      container.appendChild(companyCard);
    });
  } catch (error) {
    // 🚨 If anything goes wrong, log it
    console.error("Error loading companies:", error);
  }
}

// 🟢 Call this function once DOM is ready (or manually after page load)
fetchAndRenderCompanies();

//main funcitons in jobs
let currentTab = "jobs";
let expandedJobId = null;
let expandedCompanyId = null;

const elements = {
  navTabs: document.querySelectorAll(".nav-tab"),
  tabContents: document.querySelectorAll(".tab-content"),
  // jobCards: document.querySelectorAll(".job-card"),
  get jobCards() {
    return document.querySelectorAll(".job-card");
  },
  companyCards: document.querySelectorAll(".company-card"),
  searchInput: document.getElementById("search-input"),
  searchButton: document.getElementById("search-button"),
  filterCheckboxes: document.querySelectorAll(".filter-checkbox"),
  clearFilters: document.getElementById("clear-filters"),
  sortDropdown: document.getElementById("sort-dropdown"),
  jobsCount: document.getElementById("jobs-count"),
  loadMore: document.getElementById("load-more"),
  categoryCards: document.querySelectorAll(".category-card"),
};

function initializeApp() {
  setupEventListeners();
  updateJobsCount();
}

function setupEventListeners() {
  elements.navTabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  elements.searchButton.addEventListener("click", performSearch);
  elements.searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch();
  });
  elements.searchInput.addEventListener("input", debounce(performSearch, 300));

  elements.filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilters);
  });

  elements.clearFilters.addEventListener("click", clearAllFilters);
  elements.sortDropdown.addEventListener("change", sortJobs);
  elements.loadMore.addEventListener("click", loadMoreJobs);

  elements.categoryCards.forEach((item) => {
    item.addEventListener("click", () => {
      const category = item.dataset.category;
      switchTab("jobs");
      filterByCategory(category);
    });
  });

  // Event delegation for view details
  document.body.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".view-details-btn");
    if (viewBtn) {
      const jobId = parseInt(viewBtn.dataset.jobId);
      toggleJobDetails(jobId);
    }

    const viewCompanyBtn = e.target.closest(".view-jobs-btn");
    if (viewCompanyBtn) {
      const companyId = parseInt(viewCompanyBtn.dataset.companyId);
      toggleCompanyJobs(companyId);
    }
  });
}

function switchTab(tabName) {
  currentTab = tabName;

  elements.navTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });

  elements.tabContents.forEach((content) => {
    content.classList.toggle("active", content.id === `${tabName}-tab`);
  });
}

function toggleJobDetails(jobId) {
  const detailsElement = document.getElementById(`job-details-${jobId}`);
  const button = document.querySelector(
    `[data-job-id="${jobId}"].view-details-btn span`
  );

  if (!detailsElement || !button) return;

  if (expandedJobId === jobId) {
    detailsElement.classList.remove("expanded");
    button.textContent = "View Details";
    expandedJobId = null;
  } else {
    if (expandedJobId) {
      const prevDetails = document.getElementById(
        `job-details-${expandedJobId}`
      );
      const prevButton = document.querySelector(
        `[data-job-id="${expandedJobId}"].view-details-btn span`
      );
      if (prevDetails) prevDetails.classList.remove("expanded");
      if (prevButton) prevButton.textContent = "View Details";
    }

    detailsElement.classList.add("expanded");
    button.textContent = "Hide Details";
    expandedJobId = jobId;
  }
}

function toggleCompanyJobs(companyId) {
  const jobsElement = document.getElementById(`company-jobs-${companyId}`);
  const button = document.querySelector(
    `[data-company-id="${companyId}"].view-jobs-btn span`
  );

  if (!jobsElement || !button) return;

  if (expandedCompanyId === companyId) {
    jobsElement.classList.remove("expanded");
    button.textContent = button.textContent.replace("Hide Jobs", "View Jobs");
    expandedCompanyId = null;
  } else {
    if (expandedCompanyId) {
      const prevJobs = document.getElementById(
        `company-jobs-${expandedCompanyId}`
      );
      const prevButton = document.querySelector(
        `[data-company-id="${expandedCompanyId}"].view-jobs-btn span`
      );
      if (prevJobs) prevJobs.classList.remove("expanded");
      if (prevButton)
        prevButton.textContent = prevButton.textContent.replace(
          "Hide Jobs",
          "View Jobs"
        );
    }

    jobsElement.classList.add("expanded");
    button.textContent = "Hide Jobs";
    expandedCompanyId = companyId;
  }
}

function performSearch() {
  const searchTerm = elements.searchInput.value.toLowerCase().trim();
  
  elements.jobCards.forEach((card) => {
     
    const title = card.querySelector(".job-title").textContent.toLowerCase();
    const company = card
      .querySelector(".company-name")
      .textContent.toLowerCase();
    const description = card
      .querySelector(".job-description")
      .textContent.toLowerCase();
    const tags = Array.from(card.querySelectorAll(".job-tag")).map((tag) =>
      tag.textContent.toLowerCase()
    );
    const location = card
      .querySelector(".job-meta-item span")
      .textContent.toLowerCase();

    const matches =
      searchTerm === "" ||
      title.includes(searchTerm) ||
      company.includes(searchTerm) ||
      description.includes(searchTerm) ||
      tags.some((tag) => tag.includes(searchTerm)) ||
      location.includes(searchTerm);

    card.style.display = matches ? "block" : "none";
  });

  applyFilters();
}

function applyFilters() {
  const selectedTypes = Array.from(elements.filterCheckboxes)
    .filter((cb) => cb.dataset.filter === "type" && cb.checked)
    .map((cb) => cb.value);

  const selectedLocations = Array.from(elements.filterCheckboxes)
    .filter((cb) => cb.dataset.filter === "location" && cb.checked)
    .map((cb) => cb.value);

  elements.jobCards.forEach((card) => {
    let visible = card.style.display !== "none";

    if (visible && selectedTypes.length > 0) {
      const jobType = card
        .querySelector(".job-type-badge")
        .textContent.toLowerCase();
      visible = selectedTypes.includes(jobType);
    }

    if (visible && selectedLocations.length > 0) {
      const jobLocation = card
        .querySelector(".job-meta-item span")
        .textContent.toLowerCase();
      visible = selectedLocations.some((location) =>
        jobLocation.includes(location)
      );
    }

    card.style.display = visible ? "block" : "none";
  });

  updateJobsCount();
}

function filterByCategory(category) {
  clearAllFilters();

  const categoryCheckbox = document.querySelector(
    `input[data-filter="type"][value="${category}"]`
  );
  if (categoryCheckbox) {
    categoryCheckbox.checked = true;
    applyFilters();
  }
}

function clearAllFilters() {
  elements.searchInput.value = "";
  elements.filterCheckboxes.forEach((cb) => (cb.checked = false));

  elements.jobCards.forEach((card) => {
    card.style.display = "block";
  });

  updateJobsCount();
}

function sortJobs() {
  const sortValue = elements.sortDropdown.value;
  const jobsContainer = document.querySelector(".jobs-container");
  const jobCards = Array.from(elements.jobCards);

  jobCards.sort((a, b) => {
    switch (sortValue) {
      case "newest":
        const dateA = a.querySelector(
          ".job-meta-item:last-child span"
        ).textContent;
        const dateB = b.querySelector(
          ".job-meta-item:last-child span"
        ).textContent;
        return dateA.localeCompare(dateB);
      case "company":
        const companyA = a.querySelector(".company-name").textContent;
        const companyB = b.querySelector(".company-name").textContent;
        return companyA.localeCompare(companyB);
      default:
        return 0;
    }
  });

  jobCards.forEach((card) => {
    jobsContainer.appendChild(card);
  });
}

function updateJobsCount() {
  const visibleJobs = Array.from(elements.jobCards).filter(
    (card) => card.style.display !== "none"
  ).length;

    if (elements.jobsCount) {
    elements.jobsCount.textContent = `${visibleJobs} jobs found`;
  }
}

function loadMoreJobs() {
  elements.loadMore.innerHTML = '<div class="loading"></div> Loading...';

  setTimeout(() => {
    elements.loadMore.innerHTML =
      '<span>Load More Jobs</span><i class="fas fa-chevron-down"></i>';
  }, 1500);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

document.addEventListener("DOMContentLoaded", initializeApp);

// === Backend connection ===
let offset = 0;
const limit = 10;
let totalJobs = 0;
let isLoading = false;
let selectedCategory = null;

const jobsContainer = document.querySelector(".jobs-container");
const loadMoreBtn = document.getElementById("load-more");

// ⬇️ FETCH JOBS with optional category
async function fetchJobs(category = null) {
  if (isLoading) return;
  isLoading = true;
  loadMoreBtn.innerHTML = '<div class="loading"></div> Loading...';

  try {
    let url = `../../backend/get-jobs.php?offset=${offset}&limit=${limit}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    if (!data.jobs || !Array.isArray(data.jobs)) {
      console.error("Invalid data format", data);
      loadMoreBtn.innerHTML =
        "<span>Load More Jobs</span><i class='fas fa-chevron-down'></i>";
      isLoading = false;
      return;
    }

    // ✅ Render updated category counts
    if (data.categoryCounts) {
      renderCategoryCards(data.categoryCounts);
    }

    renderJobs(data.jobs);
    updateJobsCount(); 
    offset += limit;
    totalJobs = data.total;

    if (offset >= totalJobs) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.innerHTML =
        "<span>Load More Jobs</span><i class='fas fa-chevron-down'></i>";
    }
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    loadMoreBtn.innerHTML =
      "<span>Load More Jobs</span><i class='fas fa-chevron-down'></i>";
  }

  isLoading = false;
}

// ✅ RENDER JOB CARDS
function renderJobs(jobs) {
  jobs.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.dataset.jobId = job.job_id;

    card.innerHTML = `
      <div class="job-header">
        <div class="job-info">
          <div class="job-title-row">
            <h3 class="job-title">${job.job_title}</h3>
            <span class="job-type-badge">${job.job_type}</span>
          </div>
          <div class="company-row">
            <div class="company-logo">${job.com_name.charAt(0)}</div>
            <span class="company-name">${job.com_name}</span>
          </div>
          <div class="job-meta">
            <div class="job-meta-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>${job.job_location}</span>
            </div>
            <div class="job-meta-item">
              <i class="fas fa-clock"></i>
              <span>${new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="job-description">${job.job_description}</div>
      <div class="job-tags">
        ${(job.job_tags || "")
          .split(",")
          .filter((tag) => tag.trim() !== "")
          .map((tag) => `<span class="job-tag">${tag.trim()}</span>`)
          .join("")}

      </div>
      <div class="job-footer">
        <div class="job-stats">
          <div class="job-stat">
            <i class="fas fa-users"></i>
            <span>${job.no_of_applicants} applicants</span>
          </div>
        </div>
        <button class="view-details-btn" data-job-id="${job.job_id}">
          <i class="fas fa-eye"></i>
          <span>View Details</span>
        </button>
      </div>
      <div class="job-details" id="job-details-${job.job_id}">
        <div class="details-grid">
          <div class="details-section">
            <h4><i class="fas fa-list-ul"></i> Requirements</h4>
            <ul class="details-list">
              ${job.requirements
                .split("\n")
                .map((item) => `<li>${item.trim()}</li>`)
                .join("")}
            </ul>
          </div>
          <div class="details-section">
            <h4><i class="fas fa-tasks"></i> Responsibilities</h4>
            <ul class="details-list">
              ${job.responsibilities
                .split("\n")
                .map((item) => `<li>${item.trim()}</li>`)
                .join("")}
            </ul>
          </div>
        </div>
        <button class="apply-btn" data-job-id="${job.job_id}">
          <i class="fas fa-paper-plane"></i>
          <span>Apply Now</span>
        </button>
      </div>
    `;

    jobsContainer.appendChild(card);

 const applyButton = card.querySelector(".apply-btn");
applyButton.addEventListener("click", () => {
  const jobId = applyButton.getAttribute("data-job-id");
  applyToJob(jobId);
});
  });
}

async function applyToJob(jobId) {
  try {
    const response = await fetch("http://localhost/WEB_FINAL_CODES/backend/apply.php", {
      method: "POST",
      credentials: "include", // to send cookies/session
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id: jobId }),
    });
    const data = await response.json();
    alert(data.message); // or show in UI nicely
  } catch (error) {
    alert("Failed to apply. Please try again.");
    console.error(error);
  }
}

// ✅ RENDER CATEGORY CARDS WITH UPDATED COUNTS
function renderCategoryCards(categoryCounts = {}) {
  const container = document.getElementById("categoriesContainer");
  if (!container) return;

  container.innerHTML = "";

  categories.forEach((cat) => {
    const count = categoryCounts[cat.value] || 0;
    const card = document.createElement("div");
    card.className = "category-card";
    card.setAttribute("data-category", cat.value);
    card.innerHTML = `
      <div class="category-icon">${cat.icon}</div>
      <h3 class="category-name">${cat.name}</h3>
      <p class="category-description">${cat.description}</p>
      <span class="category-count">${count}</span>
    `;
    container.appendChild(card);
  });
}

// ✅ INITIAL FETCH
fetchJobs();

// ✅ LOAD MORE
loadMoreBtn.addEventListener("click", () => {
  fetchJobs(selectedCategory);
});

// ✅ FILTER BY CATEGORY (on click)
document.addEventListener("click", (e) => {
  const catCard = e.target.closest(".category-card");
  if (catCard) {
    selectedCategory = catCard.getAttribute("data-category");
    offset = 0;
    jobsContainer.innerHTML = ""; // clear old
    fetchJobs(selectedCategory); // fetch new
  }
});
