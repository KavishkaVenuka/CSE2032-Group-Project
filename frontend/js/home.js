// Modern JavaScript with Advanced Animations and Interactions
// DOM Elements
const navbar = document.querySelector(".navbar")
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")
const navLinks = document.querySelectorAll(".nav-link")
const loadingOverlay = document.getElementById("loadingOverlay")


// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeAnimations()
  initializeCounters()
  initializeScrollEffects()
  initializeInteractions()
  hideLoading()
})

// Navigation Functions
function initializeNavigation() {
  // Mobile menu toggle
  hamburger.addEventListener("click", toggleMobileMenu)

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      updateActiveLink(link)
    })
  })

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Navbar scroll effect
  window.addEventListener("scroll", handleNavbarScroll)
}

function toggleMobileMenu() {
  navMenu.classList.toggle("active")
  hamburger.classList.toggle("active")
}

function updateActiveLink(activeLink) {
  navLinks.forEach((link) => link.classList.remove("active"))
  activeLink.classList.add("active")
}

function handleNavbarScroll() {
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)"
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)"
    navbar.style.boxShadow = "none"
  }
}

// Animation Functions
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in")

        // Special animations for different elements
        if (entry.target.classList.contains("step-card")) {
          animateStepCards()
        }

        if (entry.target.classList.contains("category-card")) {
          animateCategoryCards()
        }

        if (entry.target.classList.contains("job-card")) {
          animateJobCards()
        }
      }
    })
  }, observerOptions)

  // Observe elements for animations
  const animatedElements = document.querySelectorAll(
    ".step-card, .category-card, .job-card, .service-card, .account-card",
  )
  animatedElements.forEach((el) => observer.observe(el))
}

function animateStepCards() {
  const stepCards = document.querySelectorAll(".step-card")
  stepCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    }, index * 200)
  })
}

function animateCategoryCards() {
  const categoryCards = document.querySelectorAll(".category-card")
  categoryCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "1"
      card.style.transform = "translateY(0) scale(1)"
    }, index * 100)
  })
}

function animateJobCards() {
  const jobCards = document.querySelectorAll(".job-card")
  jobCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    }, index * 150)
  })
}

// Counter Animation
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number")

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target)
          counterObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  counters.forEach((counter) => counterObserver.observe(counter))
}

function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    element.textContent = formatNumber(Math.floor(current))
  }, 16)
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k"
  }
  return num.toString()
}

// Scroll Effects
function initializeScrollEffects() {
  // Parallax effect for hero section
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    // const hero = document.querySelector(".hero")
    const shapes = document.querySelectorAll(".shape")

    // if (hero) {
    //   hero.style.transform = `translateY(${scrolled * 0.5}px)`
    // }

    shapes.forEach((shape, index) => {
      const speed = 0.5 + index * 0.1
      shape.style.transform = `translateY(${scrolled * speed}px)`
    })
  })

  // Update active navigation based on scroll position
  window.addEventListener("scroll", updateActiveNavigation)
}

function updateActiveNavigation() {
  const sections = document.querySelectorAll("section[id]")
  const scrollPos = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  })
}

// Interactive Functions
function initializeInteractions() {
  // Account type selection
  const accountCards = document.querySelectorAll(".account-card")
  accountCards.forEach((card) => {
    card.addEventListener("click", () => {
      selectAccountType(card)
    })
  })

  // Category card interactions
  const categoryCards = document.querySelectorAll(".category-card")
  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      exploreCategory(card)
    })
  })

  // Job card interactions
  initializeJobCardInteractions()

  // Button interactions
  initializeButtonInteractions()

  // Form interactions
  initializeFormInteractions()
}

function selectAccountType(card) {
  // Remove active class from all cards
  document.querySelectorAll(".account-card").forEach((c) => c.classList.remove("selected"))

  // Add active class to selected card
  card.classList.add("selected")

  // Add selection animation
  card.style.transform = "scale(1.02)"
  setTimeout(() => {
    card.style.transform = ""
  }, 200)

  // Show success message
  showNotification("Account type selected! Ready to get started.", "success")
}

function exploreCategory(card) {
  const categoryName = card.querySelector(".category-title").textContent
  showLoading()

  // Simulate navigation to category page
  setTimeout(() => {
    hideLoading()
    showNotification(`Register first...`, "info")
  }, 1500)
}

function initializeJobCardInteractions() {
  // View Details buttons
  const viewDetailsButtons = document.querySelectorAll(".job-card .btn-outline")
  viewDetailsButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const jobCard = button.closest(".job-card")
      const jobTitle = jobCard.querySelector(".job-title").textContent
      showJobDetails(jobTitle)
    })
  })

  // Apply Now buttons
  const applyButtons = document.querySelectorAll(".job-card .btn-primary")
  applyButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const jobCard = button.closest(".job-card")
      const jobTitle = jobCard.querySelector(".job-title").textContent
      applyToJob(jobTitle)
    })
  })
}

function showJobDetails(jobTitle) {
  showLoading()

  setTimeout(() => {
    hideLoading()
    showNotification(`First register..`, "info")
  }, 1000)
}

function applyToJob(jobTitle) {
  showLoading()

  setTimeout(() => {
    hideLoading()
    showNotification(`First register..`, "info")
  }, 1500)
}

function initializeButtonInteractions() {
  // Hero buttons
  const exploreJobsBtn = document.querySelector(".hero-buttons .btn-primary")
  const howItWorksBtn = document.querySelector(".hero-buttons .btn-secondary")

  if (exploreJobsBtn) {
    exploreJobsBtn.addEventListener("click", () => {
      document.querySelector("#jobs").scrollIntoView({ behavior: "smooth" })
    })
  }

  if (howItWorksBtn) {
    howItWorksBtn.addEventListener("click", () => {
      document.querySelector("#how-it-works").scrollIntoView({ behavior: "smooth" })
    })
  }

  // Account buttons
  const accountButtons = document.querySelectorAll(".account-btn")
  accountButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const accountType = button.textContent.includes("Student") ? "Student" : "Company"
      showRegistrationForm(accountType)
    })
  })

  // View All Jobs button
  const viewAllJobsBtn = document.querySelector(".view-all-jobs .btn")
  if (viewAllJobsBtn) {
    viewAllJobsBtn.addEventListener("click", () => {
      showLoading()
      setTimeout(() => {
        hideLoading()
        showNotification("Register first", "info")
      }, 1000)
    })
  }
}

function showRegistrationForm(accountType) {
  showLoading()

  setTimeout(() => {
    hideLoading()
    showNotification(`Opening ${accountType} registration form...`, "info")
  }, 1000)
}

function initializeFormInteractions() {
  // Newsletter form
  const newsletterForm = document.querySelector(".newsletter-form")
  const newsletterInput = document.querySelector(".newsletter-input")
  const newsletterBtn = document.querySelector(".newsletter-btn")

  if (newsletterForm) {
    newsletterBtn.addEventListener("click", (e) => {
      e.preventDefault()
      const email = newsletterInput.value.trim()

      if (validateEmail(email)) {
        subscribeToNewsletter(email)
      } else {
        showNotification("Please enter a valid email address.", "error")
      }
    })

    newsletterInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        newsletterBtn.click()
      }
    })
  }
}

function subscribeToNewsletter(email) {
  showLoading()

  setTimeout(() => {
    hideLoading()
    document.querySelector(".newsletter-input").value = ""
    showNotification("Successfully subscribed to newsletter!", "success")
  }, 1500)
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Utility Functions
function showLoading() {
  loadingOverlay.classList.add("active")
}

function hideLoading() {
  loadingOverlay.classList.remove("active")
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        padding: var(--space-md);
        box-shadow: var(--shadow-xl);
        backdrop-filter: blur(20px);
        z-index: 10000;
        transform: translateX(100%);
        transition: var(--transition-normal);
        max-width: 400px;
        min-width: 300px;
    `

  // Add notification to DOM
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    removeNotification(notification)
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification)
  }, 5000)
}

function removeNotification(notification) {
  notification.style.transform = "translateX(100%)"
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 300)
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "check-circle"
    case "error":
      return "exclamation-circle"
    case "warning":
      return "exclamation-triangle"
    default:
      return "info-circle"
  }
}

// Add notification styles to head
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
    .notification {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-md);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        flex: 1;
    }
    
    .notification-content i {
        font-size: 1.25rem;
    }
    
    .notification-success .notification-content i {
        color: var(--success-color);
    }
    
    .notification-error .notification-content i {
        color: var(--error-color);
    }
    
    .notification-warning .notification-content i {
        color: var(--warning-color);
    }
    
    .notification-info .notification-content i {
        color: var(--accent-color);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--gray-500);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--radius-sm);
        transition: var(--transition-fast);
    }
    
    .notification-close:hover {
        background: var(--gray-200);
        color: var(--gray-700);
    }
`
document.head.appendChild(notificationStyles)

// Performance optimization
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
  handleNavbarScroll()
  updateActiveNavigation()
}, 10)

window.addEventListener("scroll", optimizedScrollHandler)

// Fetch latest 6 job posts and render on homepage
document.addEventListener('DOMContentLoaded', () => {
  fetch('../../backend/get-jobs.php?offset=0&limit=6')
    .then(response => response.json())
    .then(data => {
      if (!data.success || !Array.isArray(data.jobs)) {
        console.error('Invalid data format');
        return;
      }

      const jobGrid = document.querySelector('.jobs-grid');
      if (!jobGrid) return;

      jobGrid.innerHTML = '';

      data.jobs.forEach(job => {
        const posted = timeSince(new Date(job.created_at));

        jobGrid.innerHTML += `
          <div class="job-card">
            <div class="job-header">
              <div class="company-logo">
                
              </div>
              <div class="job-badge hot">Hot</div>
            </div>
            <div class="job-content">
              <h3 class="job-title">${job.job_title}</h3>
              <p class="company-name">${job.com_name}</p>
              <div class="job-details">
                <span class="location"><i class="fas fa-map-marker-alt"></i> ${job.job_location || 'N/A'}</span>
                <span class="type"><i class="fas fa-clock"></i> ${job.job_type}</span>
              </div>
              <p class="job-description">${job.job_description}</p>
            </div>
            <div class="job-footer">
              <span class="posted-time">${posted}</span>
              <div class="job-actions">
                <button class="btn btn-outline btn-sm">View Details</button>
                <button class="btn btn-primary btn-sm">Apply Now</button>
              </div>
            </div>
          </div>`;
      });
    })
    .catch(err => console.error('Error:', err));
});

// Helper function to show friendly time ago text
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + " years ago";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " months ago";
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + " days ago";
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + " hours ago";
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + " minutes ago";
  return "Just now";
}
