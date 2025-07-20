
const companyLogo = document.getElementById('companyLogo');
const companyName = document.getElementById('companyName');
const companyCategory = document.getElementById('companyCategory');
const jobCount = document.getElementById('jobCount');
const activeJobs = document.getElementById('activeJobs');
const totalApplications = document.getElementById('totalApplications');
const profileViews = document.getElementById('profileViews');
const avgResponseTime = document.getElementById('avgResponseTime');
const jobsContainer = document.getElementById('jobsContainer');
const loadingContainer = document.getElementById('loadingContainer');


async function loadDashboardData() {
    try {
        showLoading(true);
        
        const response = await fetch("http://localhost/WEB_FINAL_CODES/backend/company.php", {
            method: "GET",
            credentials: "include"
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.company) {
            throw new Error("Invalid data format from server");
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        updateCompanyInfo(data.company);
        updateMetrics(data.metrics);
        updateJobListings(data.jobs);
        
        showLoading(false);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        const errorMsg = error.message.includes('401') 
            ? 'Session expired. Please login again.' 
            : 'Failed to load data. Please try again.';
        showErrorMessage(errorMsg);
        showLoading(false);
    }
}
// Logout confirmation popup
	const logoutLink = document.querySelector('.side-menu #logout');
	if (logoutLink) {
		logoutLink.addEventListener('click', function (e) {
			e.preventDefault();
			showLogoutPopup();
		});
	}
function showLogoutPopup() {
	// Remove existing popup if any
	document.querySelectorAll('.logout-popup-overlay').forEach(el => el.remove());
	const overlay = document.createElement('div');
	overlay.className = 'logout-popup-overlay';
	overlay.style.position = 'fixed';
	overlay.style.top = 0;
	overlay.style.left = 0;
	overlay.style.width = '100vw';
	overlay.style.height = '100vh';
	overlay.style.background = 'rgba(0,0,0,0.25)';
	overlay.style.display = 'flex';
	overlay.style.alignItems = 'center';
	overlay.style.justifyContent = 'center';
	overlay.style.zIndex = 9999;
	const popup = document.createElement('div');
	popup.style.background = '#fff';
	popup.style.padding = '32px 28px';
	popup.style.borderRadius = '16px';
	popup.style.boxShadow = '0 4px 32px rgba(0,0,0,0.12)';
	popup.style.textAlign = 'center';
	popup.innerHTML = `
			<p style="font-size:1.2em;margin-bottom:24px;">Are you sure you want to logout?</p>
			<button id="logoutConfirmBtn" style="margin-right:18px;padding:8px 22px;border-radius:8px;background:#b91c1c;color:#fff;border:none;font-size:1em;cursor:pointer;">Logout</button>
			<button id="logoutCancelBtn" style="padding:8px 22px;border-radius:8px;background:#eee;color:#333;border:none;font-size:1em;cursor:pointer;">Cancel</button>
		`;
	overlay.appendChild(popup);
	document.body.appendChild(overlay);
	document.getElementById('logoutCancelBtn').onclick = () => overlay.remove();
	document.getElementById('logoutConfirmBtn').onclick = () => {
		// Call backend to destroy session, then redirect
		fetch('/backend/logout.php', { method: 'POST', credentials: 'include' })
			.finally(() => { window.location.href = 'home.html'; });
	};
}


function handleProfileButtonClick() {
    console.log('Profile button clicked - start');
    const profileBtn = document.getElementById('profileBtn');
    
    if (!profileBtn) {
        console.error('Profile button element not found!');
        return;
    }
    
    const originalText = profileBtn.innerHTML;
    profileBtn.innerHTML = '<span class="loading-spinner">⌛</span> Loading...';

    fetch('http://localhost/WEB_FINAL_CODES/backend/check_auth.php', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        console.log('Auth response received, status:', response.status);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log('Auth data:', data);
        if (data.authenticated) {
            console.log('Redirecting to edit profile');
            window.location.href = '../html/edit-company.html';
        } else {
            console.log('Redirecting to login');
            window.location.href = '../html/login.html?redirect=edit-company';
        }
    })
    .catch(error => {
        console.error('Profile click error:', error);
        showErrorMessage('Failed to verify authentication. Please try again.');
    })
    .finally(() => {
        profileBtn.innerHTML = originalText;
    });   
}



function handlePostNewJob() {
    const btn = document.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="loading-spinner">⌛</span> Checking...';
    btn.disabled = true;

    fetch('http://localhost/WEB_FINAL_CODES/backend/check_auth.php', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error('Authentication check failed');
        return response.json();
    })
    .then(data => {
        if (data.authenticated) {
            window.location.href = '../html/addjob.html';
        } else {
            window.location.href = '../html/login.html?redirect=addjob';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error checking authentication. Please try again.');
    })
    .finally(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}
function showErrorMessage(message = 'Please check your connection and try again later.') {
    if (!jobsContainer) return;
    
    jobsContainer.innerHTML = '';
    
    const errorContainer = document.createElement('div');
    errorContainer.style.cssText = 'text-align: center; padding: 60px 20px; color: var(--gray-500);';
    
    const errorIcon = document.createElement('div');
    errorIcon.style.cssText = 'font-size: 48px; margin-bottom: 16px;';
    errorIcon.textContent = '😞';
    
    const errorTitle = document.createElement('h3');
    errorTitle.style.cssText = 'margin-bottom: 8px; color: var(--gray-700);';
    errorTitle.textContent = 'Unable to load job data';
    
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    
    const retryButton = document.createElement('button');
    retryButton.style.cssText = 'margin-top: 16px; padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer;';
    retryButton.textContent = 'Retry';
    retryButton.addEventListener('click', loadDashboardData);
    
    errorContainer.appendChild(errorIcon);
    errorContainer.appendChild(errorTitle);
    errorContainer.appendChild(errorMessage);
    errorContainer.appendChild(retryButton);
    
    jobsContainer.appendChild(errorContainer);
}


function showLoading(show) {
    if (loadingContainer) {
        loadingContainer.style.display = show ? 'flex' : 'none';
    }
    if (jobsContainer) {
        jobsContainer.style.display = show ? 'none' : 'grid';
    }
}


// function updateCompanyInfo(company) {
//     if (companyLogo && company.logo) {
//         companyLogo.src = company.logo;
//         companyLogo.alt = `${company.name} Logo`;
//     }
//     if (companyName) {
//         companyName.textContent = company.name;
//     }
//     if (companyCategory) {
//         companyCategory.textContent = company.category;
//     }
// }
function updateCompanyInfo(company) {
    if (companyLogo && company.logo) {
        companyLogo.src = company.logo;
        companyLogo.alt = `${company.name} Logo`;
    }
    if (companyName) companyName.textContent = company.name;
    if (companyCategory) companyCategory.textContent = company.category;

    const statusSpan = document.getElementById('status');
    const postJobBtn = document.querySelector('.btn-primary');

    const isActive = Number(company.status) === 1;

    console.log("Company Status:", company.status); // Debugging line

    // Status badge text & color
    if (statusSpan) {
        statusSpan.textContent = isActive ? "Active" : "Deactive";
        statusSpan.classList.remove("active", "deactive");
        statusSpan.classList.add(isActive ? "active" : "deactive");
    }

    // Button logic
    if (postJobBtn) {
        if (!isActive) {
            postJobBtn.disabled = true;
            postJobBtn.style.pointerEvents = "none";
            postJobBtn.style.opacity = "0.5";
            postJobBtn.style.cursor = "not-allowed";
            postJobBtn.title = "Deactivated account. Contact admin to post jobs.";
        } else {
            postJobBtn.disabled = false;
            postJobBtn.style.pointerEvents = "auto";
            postJobBtn.style.opacity = "1";
            postJobBtn.style.cursor = "pointer";
            postJobBtn.title = "";
        }
    }
}



function updateMetrics(metrics) {
    animateCounter(activeJobs, metrics.activeJobs);
    animateCounter(totalApplications, metrics.totalApplications);
    animateCounter(profileViews, metrics.profileViews);
    
    if (avgResponseTime) {
        avgResponseTime.textContent = metrics.avgResponseTime;
    }
    if (jobCount) {
        jobCount.textContent = metrics.activeJobs;
    }
}


function animateCounter(element, targetValue) {
    if (!element) return;
    
    const startValue = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}


function updateJobListings(jobs) {
    if (!jobsContainer) return;
    
    jobsContainer.innerHTML = '';
    
    jobs.forEach((job, index) => {
        const jobCard = createJobCard(job);
        jobCard.style.opacity = '0';
        jobCard.style.transform = 'translateY(20px)';
        jobsContainer.appendChild(jobCard);
        
        setTimeout(() => {
            jobCard.style.transition = 'all 0.6s ease';
            jobCard.style.opacity = '1';
            jobCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}


function createJobCard(job) {
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    
    const jobHeader = document.createElement('div');
    jobHeader.className = 'job-header';
    
    const jobTitleSection = document.createElement('div');
    jobTitleSection.className = 'job-title-section';
    
    const jobTitle = document.createElement('h3');
    jobTitle.className = 'job-title';
    jobTitle.textContent = job.title;
    
    const jobCompany = document.createElement('div');
    jobCompany.className = 'job-company';
    jobCompany.textContent = job.company || 'Grag Gig';
    
    jobTitleSection.appendChild(jobTitle);
    jobTitleSection.appendChild(jobCompany);
    
    const jobType = document.createElement('span');
    jobType.className = `job-type ${job.type.toLowerCase().replace(/\s+/g, '-')}`;
    jobType.textContent = job.type;
    
    jobHeader.appendChild(jobTitleSection);
    jobHeader.appendChild(jobType);
    
    const jobDescription = document.createElement('p');
    jobDescription.className = 'job-description';
    jobDescription.textContent = job.description;
    
    const jobStats = document.createElement('div');
    jobStats.className = 'job-stats';
    
    function createJobStat(icon, text) {
        const stat = document.createElement('div');
        stat.className = 'job-stat';
        
        const statIcon = document.createElement('div');
        statIcon.className = 'job-stat-icon';
        statIcon.textContent = icon;
        
        const statText = document.createElement('span');
        statText.textContent = text;
        
        stat.appendChild(statIcon);
        stat.appendChild(statText);
        return stat;
    }
    
    jobStats.appendChild(createJobStat('👥', `${job.applicants} applicants`));
    jobStats.appendChild(createJobStat('📅', `Posted ${job.postedDate}`));
    jobStats.appendChild(createJobStat('📍', job.location));
    
    const jobFooter = document.createElement('div');
    jobFooter.className = 'job-footer';
    
    const jobActions = document.createElement('div');
    jobActions.className = 'job-actions';
    
    const viewDetailsBtn = document.createElement('button');
    viewDetailsBtn.className = 'job-btn job-btn-primary';
    viewDetailsBtn.textContent = '👁️ View Details';
    viewDetailsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        viewJobDetails(job.id);
    });
    
    const analyticsBtn = document.createElement('button');
    analyticsBtn.className = 'job-btn job-btn-secondary';
    analyticsBtn.textContent = '📊 Analytics';
    analyticsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        viewJobAnalytics(job.id);
    });
    const deleteBtn = document.createElement('button');
    deleteBtn .className = 'job-btn job-btn-secondary';
    deleteBtn .textContent = 'Delete';
deleteBtn.addEventListener('click', async (e) => {
    try {
        const response = await fetch('http://localhost/WEB_FINAL_CODES/backend/delete_job.php', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                job_id: job.id
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            alert('Job deleted successfully');
          
        } else {
            alert(result.error || 'Failed to delete job');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the job');
    }
    window.location.reload()
});
    
    jobActions.appendChild(viewDetailsBtn);
    jobActions.appendChild(analyticsBtn);
    jobActions.appendChild(deleteBtn);
    
    const applicantsBadge = document.createElement('div');
    applicantsBadge.className = 'applicants-badge';
    applicantsBadge.textContent = `${job.applicants} Applications`;
    
    jobFooter.appendChild(jobActions);
    jobFooter.appendChild(applicantsBadge);
    
    jobCard.appendChild(jobHeader);
    jobCard.appendChild(jobDescription);
    jobCard.appendChild(jobStats);
    jobCard.appendChild(jobFooter);
    
    jobCard.addEventListener('click', (e) => {
        if (!e.target.closest('.job-btn')) {
            viewJobDetails(job.id);
        }
    });
    
    return jobCard;
}

function viewJobDetails(jobId) {
    console.log('Viewing job details for job ID:', jobId);
    
  
    localStorage.setItem('selectedJobId', jobId);
    
  
    fetch('http://localhost/WEB_FINAL_CODES/backend/check_auth.php', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.authenticated) {
        
            window.location.href = '../html/applications.html';
        } else {
           
            window.location.href = '../html/login.html?redirect=applications';
        }
    })
    .catch(error => {
        console.error('Error checking authentication:', error);
        alert('Error verifying authentication. Please try again.');
    });
}

function viewJobAnalytics(jobId) {
    console.log('Viewing job analytics for job ID:', jobId);
    alert(`Viewing analytics for job ID: ${jobId}`);
}


function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterJobs(searchTerm);
        }, 300);
    });
}


function filterJobs(searchTerm) {
    const jobCards = document.querySelectorAll('.job-card');
    
    jobCards.forEach(card => {
        const title = card.querySelector('.job-title').textContent.toLowerCase();
        const description = card.querySelector('.job-description').textContent.toLowerCase();
        const company = card.querySelector('.job-company').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       company.includes(searchTerm);
        
        if (matches || searchTerm === '') {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}


function initializeMobileMenu() {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.textContent = '☰';
    mobileMenuBtn.style.cssText = `
        display: none;
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1001;
        background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
        color: white;
        border: none;
        padding: 12px;
        border-radius: 12px;
        font-size: 18px;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(mobileMenuBtn);
    
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
        } else {
            mobileMenuBtn.style.display = 'none';
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('mobile-open');
            }
        }
    }
    
    mobileMenuBtn.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
            mobileMenuBtn.style.transform = sidebar.classList.contains('mobile-open') 
                ? 'rotate(90deg)' : 'rotate(0deg)';
        }
    });
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.mobile-menu-btn')) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('mobile-open');
                mobileMenuBtn.style.transform = 'rotate(0deg)';
            }
        }
    });
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}


function initializeNavigation() {
    document.addEventListener('click', (e) => {
 
        if (e.target.closest('.nav-link')) {
            e.preventDefault();
            
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const navItem = e.target.closest('.nav-item');
            if (navItem) navItem.classList.add('active');
        }
 
        if (e.target.matches('.btn-primary') || e.target.closest('.btn-primary')) {
            e.preventDefault();
            handlePostNewJob();
        }
        
        
        if (e.target.id === 'profileBtn' || e.target.closest('#profileBtn')) {
            console.log('Profile button clicked');
            e.preventDefault();
            handleProfileButtonClick();
        }
        
        if (e.target.matches('.btn-secondary') || e.target.closest('.btn-secondary')) {
            console.log('Export Data clicked');
            alert('Export Data functionality would be implemented here');
        }
    });
}


function initializeTimeFilter() {
    const timeFilter = document.querySelector('.time-filter');
    if (!timeFilter) return;
    
    timeFilter.addEventListener('change', (e) => {
        console.log('Time filter changed to:', e.target.value);
        const metrics = document.querySelectorAll('.metric-value');
        metrics.forEach(metric => {
            metric.style.opacity = '0.5';
        });
        
        setTimeout(() => {
            metrics.forEach(metric => {
                metric.style.opacity = '1';
            });
            console.log('Metrics updated for time period:', e.target.value);
        }, 500);
    });
}


function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .metric-card {
            animation: slideInLeft 0.6s ease forwards;
        }
        
        .metric-card:nth-child(2) { animation-delay: 0.1s; }
        .metric-card:nth-child(3) { animation-delay: 0.2s; }
        .metric-card:nth-child(4) { animation-delay: 0.3s; }
        
        .loading-spinner {
            display: inline-block;
            width: 1em;
            height: 1em;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard initializing...');
    
    addAnimations();
    loadDashboardData();
    initializeMobileMenu();
    initializeNavigation();
    initializeSearch();
    initializeTimeFilter();
    
    console.log('Dashboard initialized successfully');
});

window.addEventListener('load', () => {
    console.log('Dashboard fully loaded');
});