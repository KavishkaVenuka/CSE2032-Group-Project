// Sidebar toggle functionality
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

allSideMenu.forEach(item => {
	const li = item.parentElement;
	item.addEventListener('click', function () {
		allSideMenu.forEach(i => {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
});

// Dark mode toggle functionality
const switchMode = document.getElementById('switch-mode');
const darkModeCheckbox = document.getElementById('setting-darkmode');

function setDarkMode(enabled) {
	if (enabled) {
		document.body.classList.add('dark');
		if (switchMode) switchMode.checked = true;
		if (darkModeCheckbox) darkModeCheckbox.checked = true;
		localStorage.setItem('darkMode', 'dark');
	} else {
		document.body.classList.remove('dark');
		if (switchMode) switchMode.checked = false;
		if (darkModeCheckbox) darkModeCheckbox.checked = false;
		localStorage.setItem('darkMode', 'light');
	}
}

// On page load, apply dark mode if set
(function () {
	const mode = localStorage.getItem('darkMode');
	if (mode === 'dark') {
		document.body.classList.add('dark');
		if (switchMode) switchMode.checked = true;
		if (darkModeCheckbox) darkModeCheckbox.checked = true;
	} else {
		document.body.classList.remove('dark');
		if (switchMode) switchMode.checked = false;
		if (darkModeCheckbox) darkModeCheckbox.checked = false;
	}
})();

if (switchMode) {
	switchMode.addEventListener('change', function () {
		setDarkMode(this.checked);
	});
}
if (darkModeCheckbox) {
	darkModeCheckbox.addEventListener('change', function () {
		setDarkMode(this.checked);
	});
}

// Search box placeholder change on hover/focus
const searchInput = document.querySelector('.search-box input[type="text"]');
if (searchInput) {
	searchInput.addEventListener('mouseenter', function () {
		this.setAttribute('placeholder', 'Search here...');
	});
	searchInput.addEventListener('mouseleave', function () {
		if (document.activeElement !== this) {
			this.setAttribute('placeholder', ' ');
		}
	});
	searchInput.addEventListener('focus', function () {
		this.setAttribute('placeholder', 'Search here...');
	});
	searchInput.addEventListener('blur', function () {
		this.setAttribute('placeholder', ' ');
	});
}

// Fetch and render recent applications for the logged-in student
function fetchAndRenderRecentApplications() {
	fetch('../../backend/get_recent_applications.php')
		.then(response => response.json())
		.then(data => {
			const tbody = document.getElementById('recentTableBody');
			tbody.innerHTML = '';
			if (data && Array.isArray(data.applications) && data.applications.length > 0) {
				// Show up to 10 most recent applications
				data.applications.slice(0, 10).forEach(app => {
					const tr = document.createElement('tr');
					tr.innerHTML = `
							<td><img src="${app.image}" alt="Company" style="width:32px;height:32px;border-radius:8px;margin-right:10px;object-fit:cover;"><p>${app.com_name}</p></td>
							<td>${app.job_title}</td>
							<td>${app.application_date}</td>
						`;
					tbody.appendChild(tr);
				});
			} else {
				const tr = document.createElement('tr');
				tr.innerHTML = `<td colspan="3" style="text-align:center;color:#888;">No recent applications found.</td>`;
				tbody.appendChild(tr);
			}
		})
		.catch(error => {
			const tbody = document.getElementById('recentTableBody');
			tbody.innerHTML = '';
			const tr = document.createElement('tr');
			tr.innerHTML = `<td colspan="3" style="text-align:center;color:red;">Failed to load applications.</td>`;
			tbody.appendChild(tr);
			console.error('Error fetching recent applications:', error);
		});
}

function fetchAndRenderAllApplications() {
	const tbody = document.getElementById('applicationsTableBody');
	if (!tbody) return;
	fetch('../../backend/get_recent_applications.php')
		.then(response => response.json())
		.then(data => {
			tbody.innerHTML = '';
			if (data && Array.isArray(data.applications) && data.applications.length > 0) {
				data.applications.forEach(app => {
					// If your API returns more fields, use them. Otherwise, show what you have.
					const tr = document.createElement('tr');
					tr.innerHTML = `
							<td>${app.com_name || ''}</td>
							<td>${app.job_title || ''}</td>
							<td>${app.application_date || ''}</td>
						`;
					tbody.appendChild(tr);
				});
			} else {
				const tr = document.createElement('tr');
				tr.innerHTML = `<td colspan="4" style="text-align:center;color:#888;">No applications found.</td>`;
				tbody.appendChild(tr);
			}
		})
		.catch(error => {
			tbody.innerHTML = '';
			const tr = document.createElement('tr');
			tr.innerHTML = `<td colspan="4" style="text-align:center;color:red;">Failed to load applications.</td>`;
			tbody.appendChild(tr);
			console.error('Error fetching applications:', error);
		});
}

document.addEventListener('DOMContentLoaded', function () {
	// Settings Modal Logic
	const settingsModalOverlay = document.getElementById('settingsModalOverlay');
	const settingsModalClose = document.getElementById('settingsModalClose');
	const settingsSaveBtn = document.getElementById('settingsSaveBtn');
	const settingsSidebarLink = Array.from(document.querySelectorAll('.side-menu a')).find(a => a.textContent.trim() === 'Settings');
	const settingDarkMode = document.getElementById('setting-darkmode');
	const settingNotifications = document.getElementById('setting-notifications');
	const settingEmail = document.getElementById('setting-email');

	if (settingsSidebarLink) {
		settingsSidebarLink.addEventListener('click', function (e) {
			e.preventDefault();
			settingsModalOverlay.style.display = 'flex';
		});
	}
	settingsModalClose.addEventListener('click', () => settingsModalOverlay.style.display = 'none');
	settingsModalOverlay.addEventListener('click', e => {
		if (e.target === settingsModalOverlay) settingsModalOverlay.style.display = 'none';
	});

	// Load settings from localStorage or defaults
	function loadSettings() {
		const darkMode = localStorage.getItem('darkMode') === 'dark';
		const notifications = localStorage.getItem('notificationsEnabled') !== 'false';
		const emailUpdates = localStorage.getItem('emailUpdatesEnabled') === 'true';
		settingDarkMode.checked = darkMode;
		settingNotifications.checked = notifications;
		settingEmail.checked = emailUpdates;
	}

	// Save settings to localStorage
	function saveSettings() {
		localStorage.setItem('darkMode', settingDarkMode.checked ? 'dark' : 'light');
		localStorage.setItem('notificationsEnabled', settingNotifications.checked ? 'true' : 'false');
		localStorage.setItem('emailUpdatesEnabled', settingEmail.checked ? 'true' : 'false');
		setDarkMode(settingDarkMode.checked);
	}

	settingsSaveBtn.addEventListener('click', () => {
		saveSettings();
		settingsModalOverlay.style.display = 'none';
	});

	// Sync toggles with global dark mode
	settingDarkMode.addEventListener('change', function () {
		setDarkMode(this.checked);
	});

	// On page load, initialize settings modal toggles
	if (settingsModalOverlay) {
		loadSettings();
	}
	// Profile Modal Logic
	// Remove the large profile modal innerHTML creation and related event listeners
	// If profile editing is needed, redirect to edit-profile.html instead
	const profileSection = document.querySelector('.profile-section');
	if (profileSection) {
		profileSection.addEventListener('click', function () {
			window.location.href = 'edit-profile.html';
		});
	}
	// Avatar preview logic
	// The profile modal overlay is no longer created, so this logic is no longer needed here.
	// If profile editing is needed, the form will be loaded via edit-profile.html

	// CV Upload Modal Logic
	const cvUploadModalOverlay = document.getElementById('cvUploadModalOverlay');
	const cvUploadModalClose = document.getElementById('cvUploadModalClose');
	const cvUploadForm = document.getElementById('cvUploadForm');
	const cvDropArea = document.getElementById('cvDropArea');
	const cvFile = document.getElementById('cvFile');
	const cvFileName = document.getElementById('cvFileName');
	const cvUploadMsg = document.getElementById('cvUploadMsg');
	const uploadCvBtn = document.querySelector('.btn-download');

	if (uploadCvBtn) {
		uploadCvBtn.addEventListener('click', function (e) {
			e.preventDefault();
			cvUploadModalOverlay.style.display = 'flex';
		});
	}

	if (cvUploadModalClose) {
		cvUploadModalClose.addEventListener('click', () => cvUploadModalOverlay.style.display = 'none');
	}

	if (cvUploadModalOverlay) {
		cvUploadModalOverlay.addEventListener('click', e => {
			if (e.target === cvUploadModalOverlay) cvUploadModalOverlay.style.display = 'none';
		});
	}

	// CV file handling
	if (cvFile) {
		cvFile.addEventListener('change', function () {
			showFileName();
		});
	}

	if (cvDropArea) {
		cvDropArea.addEventListener('dragover', function (e) {
			e.preventDefault();
			this.style.borderColor = 'var(--primary)';
			this.style.background = 'rgba(139, 141, 245, 0.05)';
		});

		cvDropArea.addEventListener('dragleave', function (e) {
			e.preventDefault();
			this.style.borderColor = 'var(--primary)';
			this.style.background = 'var(--bg-tertiary)';
		});

		cvDropArea.addEventListener('drop', function (e) {
			e.preventDefault();
			this.style.borderColor = 'var(--primary)';
			this.style.background = 'var(--bg-tertiary)';

			const files = e.dataTransfer.files;
			if (files.length > 0) {
				cvFile.files = files;
				showFileName();
			}
		});
	}

	function showFileName() {
		if (cvFile.files.length > 0) {
			cvFileName.textContent = cvFile.files[0].name;
			cvFileName.style.display = 'block';
		} else {
			cvFileName.style.display = 'none';
		}
	}

	if (cvUploadForm) {
		cvUploadForm.addEventListener('submit', function (e) {
			e.preventDefault();
			// Simulate upload
			cvUploadMsg.textContent = 'CV uploaded successfully!';
			cvUploadMsg.style.display = 'block';
			setTimeout(() => {
				cvUploadModalOverlay.style.display = 'none';
				cvUploadMsg.style.display = 'none';
				cvUploadForm.reset();
				cvFileName.style.display = 'none';
			}, 2000);
		});
	}

	// Notification System
	const notificationModalOverlay = document.getElementById('notificationModalOverlay');
	const notificationModalClose = document.getElementById('notificationModalClose');
	const notificationList = document.getElementById('notificationList');
	const notificationEmpty = document.getElementById('notificationEmpty');
	const markAllReadBtn = document.getElementById('markAllReadBtn');
	const notificationIcon = document.querySelector('.notification');
	const notificationCount = document.querySelector('.notification .num');

	// Load notifications from localStorage or use empty array
	let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

	function renderNotifications() {
		const unreadCount = notifications.filter(n => n.unread).length;

		// Update notification count
		if (notificationCount) {
			notificationCount.textContent = unreadCount;
			notificationCount.style.display = unreadCount > 0 ? 'block' : 'none';
		}

		// Render notification list
		if (notificationList) {
			if (notifications.length === 0) {
				notificationList.style.display = 'none';
				notificationEmpty.style.display = 'block';
			} else {
				notificationList.style.display = 'block';
				notificationEmpty.style.display = 'none';

				notificationList.innerHTML = notifications.map(notification => `
						<div class="notification-item ${notification.unread ? 'unread' : ''}" data-id="${notification.id}">
							<div class="notification-icon ${notification.type}">
								<i class='bx ${notification.icon}'></i>
							</div>
							<div class="notification-content">
								<div class="notification-title">${notification.title}</div>
								<div class="notification-message">${notification.message}</div>
								<div class="notification-time">${notification.time}</div>
							</div>
						</div>
					`).join('');

				// Add click handlers for notification items
				notificationList.querySelectorAll('.notification-item').forEach(item => {
					item.addEventListener('click', function () {
						const notificationId = parseInt(this.dataset.id);
						markAsRead(notificationId);
					});
				});
			}
		}
	}

	function markAsRead(notificationId) {
		const notification = notifications.find(n => n.id === notificationId);
		if (notification) {
			notification.unread = false;
			saveNotifications();
			renderNotifications();
		}
	}

	function markAllAsRead() {
		notifications.forEach(notification => {
			notification.unread = false;
		});
		saveNotifications();
		renderNotifications();
	}

	function saveNotifications() {
		localStorage.setItem('notifications', JSON.stringify(notifications));
	}

	// Notification modal event handlers
	if (notificationIcon) {
		notificationIcon.addEventListener('click', function (e) {
			e.preventDefault();
			notificationModalOverlay.style.display = 'flex';
			renderNotifications();
		});
	}

	if (notificationModalClose) {
		notificationModalClose.addEventListener('click', () => {
			notificationModalOverlay.style.display = 'none';
		});
	}

	if (notificationModalOverlay) {
		notificationModalOverlay.addEventListener('click', e => {
			if (e.target === notificationModalOverlay) {
				notificationModalOverlay.style.display = 'none';
			}
		});
	}

	if (markAllReadBtn) {
		markAllReadBtn.addEventListener('click', markAllAsRead);
	}

	// Initialize notifications on page load
	renderNotifications();

	// Data for Recently Applied
	let recentSortDesc = true;
	function renderRecentTable(data) {
		const tbody = document.getElementById('recentTableBody');
		if (!tbody) return;
		tbody.innerHTML = '';
		data.forEach(row => {
			tbody.innerHTML += `<tr>
					<td><img src="${row.img}" alt="Company"><p>${row.company}</p></td>
					<td>${row.date}</td>
					<td><span class="status ${row.status.toLowerCase()}">${row.status.charAt(0).toUpperCase() + row.status.slice(1)}</span></td>
				</tr>`;
		});
	}
	// Search functionality
	const recentSearchBtn = document.getElementById('recentSearchBtn');
	const recentSearchInput = document.getElementById('recentSearchInput');
	if (recentSearchBtn && recentSearchInput) {
		recentSearchBtn.addEventListener('click', () => {
			recentSearchInput.style.display = recentSearchInput.style.display === 'none' ? 'inline-block' : 'none';
			recentSearchInput.focus();
		});
		recentSearchInput.addEventListener('input', function () {
			const val = this.value.toLowerCase();
			// This part of the logic needs to be implemented based on how recent applications are stored
			// For now, it will just filter an empty array or a placeholder
			// In a real application, you'd fetch recent applications from a backend
			renderRecentTable([]); // Placeholder for actual data
		});
	}
	// Sort functionality
	const recentSortBtn = document.getElementById('recentSortBtn');
	if (recentSortBtn) {
		recentSortBtn.addEventListener('click', () => {
			recentSortDesc = !recentSortDesc;
			// This part of the logic needs to be implemented based on how recent applications are stored
			// For now, it will just sort an empty array or a placeholder
			// In a real application, you'd fetch recent applications from a backend
			renderRecentTable([]); // Placeholder for actual data
		});
	}

	// Load Company Cards from Database
	async function loadCompanyCards() {
		const companyCardsList = document.getElementById('company-cards-list');
		if (!companyCardsList) return;

		try {
			const response = await fetch('http://localhost/WEB_FINAL_CODES/backend/get_pending_companies.php');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const companies = await response.json();

			// Clear existing cards
			companyCardsList.innerHTML = '';

			// Create company cards
			companies.forEach(company => {
				const companyCard = document.createElement('div');
				companyCard.className = 'company-card';
				companyCard.style.cssText = 'display: flex; align-items: center; padding: 16px; background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border); transition: all 0.2s; cursor: pointer;';

				// Generate logo URL based on company name (fallback to a default logo)
				const logoUrl = company.image || `https://logo.clearbit.com/${company.com_name.toLowerCase().replace(/\s+/g, '')}.com`;

				companyCard.innerHTML = `
						<img src="${logoUrl}" alt="${company.com_name}" class="company-logo" style="width:48px;height:48px;border-radius:12px;margin-right:18px;object-fit:cover;" onerror="this.src='https://via.placeholder.com/48x48/6366f1/ffffff?text=${company.com_name.charAt(0)}'">
						<div>
							<h3 style="margin:0 0 6px 0;">${company.com_name}</h3>
							<p style="margin:0;color:var(--text-secondary);font-size:0.98em;">${company.bussiness_type}, ${company.address}</p>
						</div>
					`;

				// Add click event to show company details (optional)
				companyCard.addEventListener('click', () => {
					console.log('Company clicked:', company.com_name);
					// You can add more functionality here like opening a modal with company details
				});
				console.log("jidbfw");
				
				companyCardsList.appendChild(companyCard);
			});

		} catch (error) {
			console.error('Error loading company cards:', error);
			// Show fallback content if API fails
			companyCardsList.innerHTML = '';
		}
	}

	// Load company cards when page loads
	loadCompanyCards();
	fetchAndRenderRecentApplications();
	fetchAndRenderAllApplications();
	// Add click handler for Browse Jobs to go to home.html#jobs
	const browseJobsLink = Array.from(document.querySelectorAll('.side-menu.top li a')).find(a => a.textContent.trim() === 'Browse Jobs');
	if (browseJobsLink) {
		browseJobsLink.addEventListener('click', function (e) {
			e.preventDefault();
			window.location.href = '../html/jobs.html';
		});
	}
	// Add click handler for Companies to go to jobs.html#companies-tab
	const companiesLink = Array.from(document.querySelectorAll('.side-menu.top li a')).find(a => a.textContent.trim() === 'Companies');
	if (companiesLink) {
		companiesLink.addEventListener('click', function (e) {
			e.preventDefault();
			window.location.href = '../html/jobs.html #companies-tab';
		});
	}
	// Logout confirmation popup
	const logoutLink = document.querySelector('.side-menu .logout');
	if (logoutLink) {
		logoutLink.addEventListener('click', function (e) {
			e.preventDefault();
			showLogoutPopup();
		});
	}
});

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

function fetchAndRenderStudentName() {
	fetch('http://localhost/WEB_FINAL_CODES/backend/get_student_profile.php')
		.then(response => response.json())
		.then(data => {
			if (data && data.name) {
				const nameElem = document.querySelector('.profile-info h4');
				if (nameElem) nameElem.textContent = data.name;
			}
		})
		.catch(error => {
			console.error('Error fetching student name:', error);
		});
}

document.addEventListener('DOMContentLoaded', function () {
	fetchAndRenderStudentName();
	fetchAndRenderRecentApplications();
});


function fetchAndRenderNotifications() {
	fetch('http://localhost/WEB_FINAL_CODES/backend/get_notifications.php')
		.then(response => response.json())
		.then(data => {
			const notificationList = document.getElementById('notificationList');
			const notificationEmpty = document.getElementById('notificationEmpty');
			notificationList.innerHTML = '';
			if (data && Array.isArray(data.notifications) && data.notifications.length > 0) {
				notificationList.style.display = 'block';
				notificationEmpty.style.display = 'none';
				data.notifications.forEach(n => {
					const item = document.createElement('div');
					item.className = 'notification-item' + (n.is_read ? '' : ' unread');
					item.innerHTML = `
							<div class="notification-title">${n.title}</div>
							<div class="notification-message">${n.message}</div>
							<div class="notification-time">${n.created_at}</div>
						`;
					notificationList.appendChild(item);
				});
			} else {
				notificationList.style.display = 'none';
				notificationEmpty.style.display = 'block';
			}
		})
		.catch(error => {
			console.error('Error fetching notifications:', error);
		});
}

// Call this when opening the notification modal
document.querySelector('.notification').addEventListener('click', function (e) {
	e.preventDefault();
	document.getElementById('notificationModalOverlay').style.display = 'flex';
	fetchAndRenderNotifications();
});


function fetchAndRenderApplicationCount() {
	fetch('http://localhost/WEB_FINAL_CODES/backend/get_recent_applications.php')
		.then(response => response.json())
		.then(data => {
			if (data && Array.isArray(data.applications)) {
				const countElem = document.querySelector('.box-info li:nth-child(1) h3');
				if (countElem) countElem.textContent = data.applications.length;
			}
		})
		.catch(error => {
			console.error('Error fetching application count:', error);
		});
}

document.addEventListener('DOMContentLoaded', function () {
	fetchAndRenderApplicationCount();
	// ...existing code...
});


const countElem = document.getElementById('applicationsCount');