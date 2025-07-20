let companyData = {};
let hasUnsavedChanges = false;
let isDraft = false;

document.addEventListener('DOMContentLoaded', function() {
    fetchCompanyData();  // Load from backend now
    setupFormHandlers();
    setupUnsavedChangesWarning();
    setupAutoSave();
    loadDraftIfExists(); // check for any saved draft
});

async function fetchCompanyData() {
    try {
        const response = await fetch('http://localhost/WEB_FINAL_CODES/backend/companydata.php', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch company data');
        }

        const data = await response.json();
        if (data.company) {
            companyData = {
                com_name: data.company.com_name,
                reg_no: data.company.reg_no,
                email: data.company.email,
                bussiness_type: data.company.bussiness_type,
                url: data.company.url,
                bio: data.company.bio,
                contact_no: data.company.contact_no,
                address: data.company.address,
                no_of_employees: data.company.no_of_employees
            };

            populateForm(companyData);
        }

    } catch (error) {
        console.error('Error fetching company data:', error);
        showNotification('Error loading company data from server', 'error');
        companyData = getDefaultCompanyData();
        populateForm(companyData);
    }
}


    const backBtn = document.querySelector('.back-btn');
    backBtn.addEventListener('click', function() {
       
            window.location.href = '../html/company.html'; 
        
    });


function getDefaultCompanyData() {
    return {
        com_name: "Your Company Name",
        reg_no: "",
        email: "contact@yourcompany.com",
        bussiness_type: "",
        url: "https://yourcompany.com",
        bio: "Tell us about your company...",
        contact_no: "",
        address: "",
        no_of_employees: 1
    };
}

function populateForm(data) {
    setFieldValue('com_name', data.com_name);
    setFieldValue('reg_no', data.reg_no);
    setFieldValue('email', data.email);
    setFieldValue('bussiness_type', data.bussiness_type);
    setFieldValue('url', data.url);
    setFieldValue('bio', data.bio);
    setFieldValue('contact_no', data.contact_no);
    setFieldValue('address', data.address);
    setFieldValue('no_of_employees', data.no_of_employees);

    const companyNameHeader = document.getElementById('companyNameHeader');
    if (companyNameHeader && data.com_name) {
        companyNameHeader.textContent = data.com_name;
    }
}

function setFieldValue(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (field && value !== undefined && value !== null) {
        field.value = value;
    }
}

function setupFormHandlers() {
    const form = document.getElementById('companyEditForm');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                hasUnsavedChanges = true;
                updateButtonStates();
            });
            input.addEventListener('input', () => {
                hasUnsavedChanges = true;
                updateButtonStates();
            });
        });
    }
}

function updateButtonStates() {
    const draftBtn = document.querySelector('.draft-btn');
    const publishBtn = document.querySelector('.publish-btn');

    if (hasUnsavedChanges) {
        draftBtn.style.opacity = '1';
        publishBtn.style.opacity = '1';
    }
}

async function saveAsDraft() {
    try {
        const draftBtn = document.querySelector('.draft-btn');
        draftBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        draftBtn.disabled = true;

        const formData = collectFormData();
        await saveDraftData(formData);

        localStorage.setItem('companyDataDraft', JSON.stringify(formData));
        showNotification('Draft saved successfully!', 'success');

        hasUnsavedChanges = false;
        isDraft = true;

    } catch (error) {
        console.error('Error saving draft:', error);
        showNotification(error.message || 'Error saving draft', 'error');
    } finally {
        const draftBtn = document.querySelector('.draft-btn');
        draftBtn.innerHTML = '<i class="fas fa-file-alt"></i> Save as Draft';
        draftBtn.disabled = false;
    }
}

// async function publishChanges() {
//     try {
//         const publishBtn = document.querySelector('.publish-btn');
//         publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
//         publishBtn.disabled = true;

//         const formData = collectFormData();

//         if (!validateFormData(formData)) {
//             throw new Error('Please fill in all required fields');
//         }

//         await publishCompanyData(formData);

//         localStorage.setItem('companyData', JSON.stringify(formData));
//         showNotification('Company details updated successfully!', 'success');

//         hasUnsavedChanges = false;
//         isDraft = false;

//     } catch (error) {
//         console.error('Error publishing changes:', error);
//         showNotification(error.message || 'Error updating company details', 'error');
//     } finally {
//         const publishBtn = document.querySelector('.publish-btn');
//         publishBtn.innerHTML = '<i class="fas fa-check-circle"></i> Publish Changes';
//         publishBtn.disabled = false;
//     }
// }
async function publishChanges() {
    try {
        // Disable button during processing
        const publishBtn = document.querySelector('.publish-btn');
        publishBtn.disabled = true;
        publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        // Collect and validate data
        const formData = collectFormData();
        
        // Basic validation
        if (!formData.com_name || !formData.email || !formData.contact_no) {
            throw new Error('Company name, email, and contact number are required');
        }

        // Send to backend
        const response = await fetch('http://localhost/WEB_FINAL_CODES/backend/updatedetails.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });

        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Update failed');
        }

        // Update local data
        companyData = { ...companyData, ...formData };
        
        // Force refresh from server to confirm changes
        await fetchCompanyData();
        
        showNotification('Changes saved successfully!', 'success');
        hasUnsavedChanges = false;

    } catch (error) {
        console.error('Publish error:', error);
        showNotification(error.message, 'error');
        
        // Highlight problematic fields
        if (error.message.includes('name')) highlightError('com_name', error.message);
        if (error.message.includes('email')) highlightError('email', error.message);
        if (error.message.includes('contact')) highlightError('contact_no', error.message);
        
    } finally {
        const publishBtn = document.querySelector('.publish-btn');
        publishBtn.innerHTML = '<i class="fas fa-check-circle"></i> Publish Changes';
        publishBtn.disabled = false;
    }
}

function highlightError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('is-invalid');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message text-danger';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
}
// function collectFormData() {
//     const form = document.getElementById('companyEditForm');
//     const formData = new FormData(form);

//     return {
//         com_name: formData.get('com_name'),
//         reg_no: formData.get('reg_no'),
//         email: formData.get('email'),
//         bussiness_type: formData.get('bussiness_type'),
//         url: formData.get('url'),
//         bio: formData.get('bio'),
//         contact_no: formData.get('contact_no'),
//         address: formData.get('address'),
//         no_of_employees: parseInt(formData.get('no_of_employees')),
//         lastUpdated: new Date().toISOString()
//     };
// }
function collectFormData() {
    // Get all form elements
    const form = document.getElementById('companyEditForm');
    const elements = form.elements;
    
    // Prepare data object
    const formData = {
        com_name: elements.com_name.value.trim(),
        reg_no: elements.reg_no.value.trim(),
        email: elements.email.value.trim(),
        bussiness_type: elements.bussiness_type.value.trim(),
        url: elements.url.value.trim(),
        bio: elements.bio.value.trim(),
        contact_no: elements.contact_no.value.trim(),
        address: elements.address.value.trim(),
        no_of_employees: parseInt(elements.no_of_employees.value) || 1
    };

    console.log('Collected form data:', formData); // Debug log
    return formData;
}
function validateFormData(data) {
    const requiredFields = ['com_name', 'reg_no', 'email', 'bussiness_type', 'url', 'bio', 'contact_no', 'address', 'no_of_employees'];

    for (const field of requiredFields) {
        if (!data[field] || data[field].toString().trim() === '') {
            return false;
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address');
    }

    const phoneRegex = /^[0-9]{10,12}$/;
    if (!phoneRegex.test(data.contact_no)) {
        throw new Error('Please enter a valid contact number (10-12 digits)');
    }

    try {
        new URL(data.url);
    } catch {
        throw new Error('Please enter a valid website URL');
    }

    if (isNaN(data.no_of_employees) || data.no_of_employees < 1) {
        throw new Error('Please enter a valid number of employees');
    }

    return true;
}

async function saveDraftData(data) {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Draft data saved:', data);
    return data;
}

async function publishCompanyData(data) {
    try {
        const response = await fetch('http://localhost/WEB_FINAL_CODES/backend/updatedetails.php', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
console.log("hutto");
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Update failed:', error);
        throw error;
    }
}

function setupAutoSave() {
    let autoSaveTimer;
    const form = document.getElementById('companyEditForm');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(autoSaveTimer);
                autoSaveTimer = setTimeout(() => {
                    if (hasUnsavedChanges) {
                        autoSaveDraft();
                    }
                }, 3000);
            });
        });
    }
}

async function autoSaveDraft() {
    try {
        const formData = collectFormData();
        localStorage.setItem('companyDataDraft', JSON.stringify(formData));
        showNotification('Auto-saved as draft', 'info', 2000);
    } catch (error) {
        console.error('Auto-save failed:', error);
    }
}

function setupUnsavedChangesWarning() {
    window.addEventListener('beforeunload', function(event) {
        if (hasUnsavedChanges) {
            event.preventDefault();
            event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return event.returnValue;
        }
    });
}

function showNotification(message, type = 'info', duration = 4000) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function loadDraftIfExists() {
    const draftData = localStorage.getItem('companyDataDraft');
    if (draftData) {
        try {
            const draft = JSON.parse(draftData);
            if (confirm('You have unsaved draft changes. Would you like to load them?')) {
                populateForm(draft);
                hasUnsavedChanges = true;
                isDraft = true;
                showNotification('Draft data loaded', 'info');
            }
        } catch (error) {
            console.error('Error loading draft data:', error);
        }
    }
}
