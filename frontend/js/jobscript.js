
let requirements = [];
let responsibilities = [];


document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

function initializeForm() {
    setMinDate();
    bindEvents();
}

function setMinDate() {
    const closingDateInput = document.getElementById('closingDate');
    const today = new Date().toISOString().split('T')[0];
    closingDateInput.min = today;
    
   
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    closingDateInput.value = defaultDate.toISOString().split('T')[0];
}

function bindEvents() {

    const addRequirementBtn = document.getElementById('addRequirementBtn');
    const requirementInput = document.getElementById('requirementInput');
    
    addRequirementBtn.addEventListener('click', addRequirement);
    requirementInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addRequirement();
        }
    });

   
    const addResponsibilityBtn = document.getElementById('addResponsibilityBtn');
    const responsibilityInput = document.getElementById('responsibilityInput');
    
    addResponsibilityBtn.addEventListener('click', addResponsibility);
    responsibilityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addResponsibility();
        }
    });


    const saveDraftBtns = [document.getElementById('saveDraftBtn'), document.getElementById('saveDraftBtn2')];
    const publishJobBtns = [document.getElementById('publishJobBtn'), document.getElementById('publishJobBtn2')];

    saveDraftBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                saveJob('draft');
            });
        }
    });

    publishJobBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                saveJob('published');
            });
        }
    });

    const backBtn = document.querySelector('.back-btn');
    backBtn.addEventListener('click', function() {
       
            window.location.href = '../html/company.html'; 
        
    });

   
    addFocusEffects();
}

function addFocusEffects() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
}

function addRequirement() {
    const input = document.getElementById('requirementInput');
    const value = input.value.trim();
    
    if (value && !requirements.includes(value)) {
        requirements.push(value);
        renderRequirements();
        input.value = '';
        updateRequirementsTextarea();
        
        
        const lastItem = document.querySelector('#requirementsList .item-tag:last-child');
        if (lastItem) {
            lastItem.style.animation = 'slideIn 0.3s ease';
        }
    }
}

function addResponsibility() {
    const input = document.getElementById('responsibilityInput');
    const value = input.value.trim();
    
    if (value && !responsibilities.includes(value)) {
        responsibilities.push(value);
        renderResponsibilities();
        input.value = '';
        updateResponsibilitiesTextarea();
        
       
        const lastItem = document.querySelector('#responsibilitiesList .item-tag:last-child');
        if (lastItem) {
            lastItem.style.animation = 'slideIn 0.3s ease';
        }
    }
}

function removeRequirement(index) {
    requirements.splice(index, 1);
    renderRequirements();
    updateRequirementsTextarea();
}

function removeResponsibility(index) {
    responsibilities.splice(index, 1);
    renderResponsibilities();
    updateResponsibilitiesTextarea();
}

function renderRequirements() {
    const container = document.getElementById('requirementsList');
    container.innerHTML = '';

    requirements.forEach(function(requirement, index) {
        const tag = document.createElement('div');
        tag.className = 'item-tag';
        tag.innerHTML = `
            <span>${requirement}</span>
            <button type="button" class="remove-btn" onclick="removeRequirement(${index})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        container.appendChild(tag);
    });
}

function renderResponsibilities() {
    const container = document.getElementById('responsibilitiesList');
    container.innerHTML = '';

    responsibilities.forEach(function(responsibility, index) {
        const tag = document.createElement('div');
        tag.className = 'item-tag';
        tag.innerHTML = `
            <span>${responsibility}</span>
            <button type="button" class="remove-btn" onclick="removeResponsibility(${index})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        container.appendChild(tag);
    });
}

function updateRequirementsTextarea() {
    const textarea = document.getElementById('requirements');
    textarea.value = requirements.join('\n');
}

function updateResponsibilitiesTextarea() {
    const textarea = document.getElementById('responsibilities');
    textarea.value = responsibilities.join('\n');
}

function validateForm() {
    const form = document.getElementById('jobForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;

    
    requiredFields.forEach(function(field) {
        field.classList.remove('error');
    });

   
    requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        }
    });

   
    if (requirements.length === 0) {
        showNotification('Please add at least one requirement.', 'error');
        isValid = false;
    }

    if (responsibilities.length === 0) {
        showNotification('Please add at least one responsibility.', 'error');
        isValid = false;
    }

    if (!isValid && firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
}

function collectFormData() {
    const form = document.getElementById('jobForm');
    const formData = new FormData(form);
    
    return {
        com_id: parseInt(formData.get('comId')),
        job_title: formData.get('jobTitle'),
        job_type: formData.get('jobType'),
        job_category: formData.get('jobCategory'),
        job_location: formData.get('jobLocation'),
        job_description: formData.get('jobDescription'),
        requirements: requirements.join('\n'),
        responsibilities: responsibilities.join('\n'),
        job_tag: formData.get('jobTag') || '',
        closing_date: formData.get('closingDate')
    };
}

function saveJob(status) {
    if (!validateForm()) {
        return;
    }

    const jobData = collectFormData();
    jobData.status = status; 
    
    
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(function(button) {
        button.disabled = true;
        const originalText = button.innerHTML;
        button.innerHTML = status === 'draft' ? 
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Saving...' : 
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Publishing...';
        button.dataset.originalText = originalText;
    });

    
    fetch('http://localhost/WEB_FINAL_CODES/backend/insert.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(jobData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showNotification(
                status === 'draft' ? 'Job saved as draft successfully!' : 'Job published successfully!',
                'success'
            );
            console.log('Success:', data);
        } else {
            throw new Error(data.message || 'Unknown error occurred');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification(error.message || 'An error occurred while saving the job. Please try again.', 'error');
    })
    .finally(() => {
        
        buttons.forEach(function(button) {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText;
        });
    });
}

function showNotification(message, type) {
 
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(function(notification) {
        notification.remove();
    });

    const notification = document.createElement('div');
    notification.className = 'notification';
    
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
    
    notification.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success' ? 
                '<polyline points="20,6 9,17 4,12"></polyline>' : 
                '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
            }
        </svg>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.remove();
    }, 4000);
}