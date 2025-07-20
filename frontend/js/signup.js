document.addEventListener("DOMContentLoaded", () => {
    const typeOptions = document.querySelectorAll(".type-option");
    const studentForm = document.getElementById("studentForm");
    const companyForm = document.getElementById("companyForm");
    const signupForm = document.getElementById("signupForm");

    // Switch between Student and Company forms
    typeOptions.forEach((option) => {
        option.addEventListener("click", function () {
            // Toggle active class on buttons
            typeOptions.forEach(opt => opt.classList.remove("active"));
            this.classList.add("active");

            const selectedType = this.getAttribute("data-type");
            if (selectedType === "student") {
                studentForm.classList.add("active");
                companyForm.classList.remove("active");
                clearFormFields(companyForm);
                updateRequiredFields(studentForm, true);
                updateRequiredFields(companyForm, false);
            } else if (selectedType === "company") {
                companyForm.classList.add("active");
                studentForm.classList.remove("active");
                clearFormFields(studentForm);
                updateRequiredFields(companyForm, true);
                updateRequiredFields(studentForm, false);
            }
        });
    });

    // On page load, set required fields correctly
    if (studentForm.classList.contains("active")) {
        updateRequiredFields(studentForm, true);
        updateRequiredFields(companyForm, false);
    } else {
        updateRequiredFields(companyForm, true);
        updateRequiredFields(studentForm, false);
    }

    // Form submission handler
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const activeType = document.querySelector(".type-option.active").dataset.type;

        // Validate form before submit
        if (!validateForm(signupForm, activeType)) {
            return;
        }

        // Prepare payload
        let payload = {};
        if (activeType === "student") {
            payload = {
                type: "student",
                firstName: document.getElementById("firstName").value.trim(),
                lastName: document.getElementById("lastName").value.trim(),
                email: document.getElementById("studentEmail").value.trim(),
                password: document.getElementById("studentPassword").value,
                confirmPassword: document.getElementById("studentConfirmPassword").value,
                degree: document.getElementById("degree").value,
                department: document.getElementById("department").value,
                year: document.getElementById("year").value,
                reg_no: document.getElementById("registrationNo").value.trim(),
                linkedin: document.getElementById("linkedinUrl").value.trim(),
            };
        } else {
            payload = {
                type: "company",
                com_name: document.getElementById("companyName").value.trim(),
                reg_no: document.getElementById("companyRegNo").value.trim(),
                email: document.getElementById("companyEmail").value.trim(),
                password: document.getElementById("companyPassword").value,
                confirmPassword: document.getElementById("companyConfirmPassword").value,
                business_type: document.getElementById("businessType").value,
                contact_no: document.getElementById("contactNo").value.trim(),
                no_of_employees: document.getElementById("employeeCount").value,
                address: document.getElementById("address").value.trim(),
            };
        }

        // Set API endpoint
        const endpoint = activeType === "student"
            ? "http://localhost/WEB_Final_codes/backend/signup-student.php"
            : "http://localhost/WEB_Final_codes/backend/signup-company.php";

        // Disable submit button & show loading
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                showMessage(result.message || "Account created successfully!", "success");
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                showMessage(result.message || "Error creating account.", "error");
            }
        } catch (error) {
            console.error("Signup error:", error);
            showMessage("Server error. Please try again later.", "error");
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // --- Helper functions ---

    function clearFormFields(form) {
        if (!form) return;
        form.querySelectorAll("input, select, textarea").forEach(input => {
            if (input.type === "checkbox" || input.type === "radio") {
                input.checked = false;
            } else {
                input.value = "";
            }
            input.classList.remove("error");
        });
    }

    function updateRequiredFields(form, isRequired) {
        if (!form) return;
        form.querySelectorAll("input, select, textarea").forEach(input => {
            if (isRequired) {
                input.setAttribute("required", "");
            } else {
                input.removeAttribute("required");
            }
        });
    }

    function validateForm(form, userType) {
        let isValid = true;
        const activeForm = form.querySelector(".form-content.active");

        // Clear previous errors
        form.querySelectorAll(".error").forEach(input => input.classList.remove("error"));

        // Check required fields
        activeForm.querySelectorAll("input[required], select[required], textarea[required]").forEach(input => {
            if (!input.value.trim()) {
                input.classList.add("error");
                isValid = false;
            }
        });

        // Validate email
        const emailInput = activeForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value && !isValidEmail(emailInput.value)) {
            emailInput.classList.add("error");
            showMessage("Please enter a valid email address.", "error");
            isValid = false;
            console.log("Email value:", emailValue, "Is valid:", isValidEmail(emailValue));

        }

        // Validate password length & match
        const passwordInput = activeForm.querySelector('input[name="password"]');
        const confirmPasswordInput = activeForm.querySelector('input[name="confirmPassword"]');
        if (passwordInput && confirmPasswordInput) {
            if (passwordInput.value.length < 6) {
                passwordInput.classList.add("error");
                showMessage("Password must be at least 6 characters long.", "error");
                isValid = false;
            }
            if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.classList.add("error");
                showMessage("Passwords do not match.", "error");
                isValid = false;
            }
        }

        // Validate LinkedIn URL if present (only for students)
        const linkedinInput = activeForm.querySelector('input[name="linkedinUrl"]');
        if (linkedinInput && linkedinInput.value && !isValidLinkedInUrl(linkedinInput.value)) {
            linkedinInput.classList.add("error");
            showMessage("Please enter a valid LinkedIn profile URL.", "error");
            isValid = false;
        }

        if (!isValid) {
            showMessage("Please correct the highlighted fields.", "error");
            console.log("Fields with error:", document.querySelectorAll(".error"));

        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidLinkedInUrl(url) {
        const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
        return linkedinRegex.test(url);
    }

    function showMessage(message, type) {
        // Remove existing messages
        document.querySelectorAll(".message").forEach(msg => msg.remove());

        // Create message div
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        // Insert above the form
        const form = document.querySelector(".auth-form");
        if (form) {
            form.insertBefore(messageDiv, form.firstChild);
            // Remove message after 5 seconds
            setTimeout(() => messageDiv.remove(), 5000);
        }
    }
});



