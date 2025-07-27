// Selecting DOM elements
const appointmentForm = document.getElementById('appointmentForm');
const appointmentList = document.getElementById('appointments');
const modal = document.getElementById('modal');
const modalDetails = document.getElementById('modalDetails');
const closeBtn = document.querySelector('.close');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const filterInput = document.getElementById('filter');

// Array to store appointments
let appointments = [];
let currentAppointment = null;
let filteredAppointments = [];

// Function to run when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Listen to form submit
    appointmentForm.addEventListener('submit', handleFormSubmit);

    // Modal events
    closeBtn.addEventListener('click', closeModal);
    confirmBtn.addEventListener('click', confirmAppointment);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal if clicked outside of modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Set today’s date as minimum for date input
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;

    // Add focus and blur events to form inputs
    addFormFocusEvents();

    // Add search filter event
    filterInput.addEventListener('input', filterAppointments);

    // Add events for appointment list (like double-click delete)
    addAppointmentListEvents();

    // Disable right-click context menu
    addContextMenuEvents();

    // Show welcome message
    showWelcomeMessage();

    // Show empty appointment list at start
    renderAppointments();
});

// Show welcome message when page loads
function showWelcomeMessage() {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-alert';
    welcomeDiv.textContent = 'Welcome to your appointment calendar!';

    document.body.appendChild(welcomeDiv);

    // Remove message after 3 seconds
    setTimeout(() => {
        welcomeDiv.remove();
    }, 3000);
}

// Add focus and blur event listeners to form fields
function addFormFocusEvents() {
    const formGroups = appointmentForm.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('input, select');

        input.addEventListener('focus', function() {
            group.classList.add('focused');
            showValidationMessage(this, 'valid', 'This field is required!');
        });

        input.addEventListener('blur', function() {
            group.classList.remove('focused');
            removeValidationMessage(this);
        });
    });
}

// Add input/change event listeners for real-time validation
function addInputChangeEvents() {
    const nameInput = document.getElementById('name');
    const dateInput = document.getElementById('date');
    const doctorSelect = document.getElementById('doctor');
    const serviceSelect = document.getElementById('service');

    // Name input event
    nameInput.addEventListener('input', function() {
        if (this.value.trim().length < 2) {
            this.style.borderColor = '#e53e3e';
            showValidationMessage(this, 'invalid', 'Name must be at least 2 characters.');
        } else {
            this.style.borderColor = '#48bb78';
            showValidationMessage(this, 'valid', 'Name looks good!');
        }
    });

    // Date change event
    dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            this.style.borderColor = '#e53e3e';
            showValidationMessage(this, 'invalid', 'You cannot select a past date.');
        } else {
            this.style.borderColor = '#48bb78';
            showValidationMessage(this, 'valid', 'Date selected!');
        }
    });

    // Doctor select change event
    doctorSelect.addEventListener('change', function() {
        if (this.value) {
            this.style.borderColor = '#48bb78';
            showValidationMessage(this, 'valid', `${this.options[this.selectedIndex].text} selected!`);

            // Filter services based on doctor selection
            filterServicesByDoctor(this.value);
        } else {
            this.style.borderColor = '#e53e3e';
            showValidationMessage(this, 'invalid', 'Please select a doctor.');

            // Reset services if no doctor selected
            resetServiceOptions();
        }
    });

    // Service select change event
    serviceSelect.addEventListener('change', function() {
        if (this.value) {
            this.style.borderColor = '#48bb78';
            showValidationMessage(this, 'valid', `${this.options[this.selectedIndex].text} selected!`);
        } else {
            this.style.borderColor = '#e53e3e';
            showValidationMessage(this, 'invalid', 'Please select a service.');
        }
    });
}

// Show validation message below input
function showValidationMessage(element, type, message) {
    // Remove previous message
    removeValidationMessage(element);

    const messageDiv = document.createElement('div');
    messageDiv.className = `validation-message ${type}`;
    messageDiv.textContent = message;

    element.parentElement.appendChild(messageDiv);
}

// Remove validation message
function removeValidationMessage(element) {
    const existingMessage = element.parentElement.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Handle form submit event (prevent default and validate)
function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(appointmentForm);
    const appointment = {
        id: Date.now(), // Unique ID
        name: formData.get('name'),
        date: formData.get('date'),
        time: formData.get('time'),
        doctor: formData.get('doctor'),
        service: formData.get('service'),
        createdAt: new Date().toISOString(),
        confirmed: false
    };

    // Validate appointment data
    if (!validateAppointment(appointment)) {
        return;
    }

    // Show appointment details in modal
    showAppointmentModal(appointment);
}

// Validate appointment fields
function validateAppointment(appointment) {
    if (!appointment.name.trim()) {
        showMessage('Please enter a name.', 'error');
        return false;
    }

    if (!appointment.date) {
        showMessage('Please select a date.', 'error');
        return false;
    }

    if (!appointment.time) {
        showMessage('Please select a time.', 'error');
        return false;
    }

    if (!appointment.doctor) {
        showMessage('Please select a doctor.', 'error');
        return false;
    }

    if (!appointment.service) {
        showMessage('Please select a service.', 'error');
        return false;
    }

    const selectedDate = new Date(appointment.date + ' ' + appointment.time);
    const now = new Date();

    if (selectedDate < now) {
        showMessage('You cannot select a past date and time.', 'error');
        return false;
    }

    return true;
}

// Show appointment details modal
function showAppointmentModal(appointment) {
    currentAppointment = appointment;

    const serviceNames = {
        'konsultasyon': 'Consultation',
        'tedavi': 'Treatment',
        'kontrol': 'Check-up',
        'acil': 'Emergency'
    };

    const doctorNames = {
        'dr-ahmet-yilmaz': 'Dr. Yüksel Kaya - Cardiology',
        'dr-ayse-demir': 'Dr. Oğuzhan Özgür - Internal Medicine',
        'dr-mehmet-kaya': 'Dr. Berke Algün - Orthopedics',
        'dr-fatma-ozturk': 'Dr. Atakan Avsever - Pediatrics',
        'dr-ali-celik': 'Dr. Emircan Üye - Neurology',
        'dr-zeynep-arslan': 'Dr. Muzaffer Bayrak - Dermatology',
        'acil-doktor': 'Emergency Room Doctor'
    };

    const isExistingAppointment = appointments.find(apt => apt.id === appointment.id);
    const modalTitle = isExistingAppointment ? 'Appointment Details' : 'New Appointment Confirmation';
    const confirmButtonText = isExistingAppointment ? 'Confirm' : 'Add';

    modalDetails.innerHTML = `
        <div style="background: #f7fafc; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
            <p><strong>Name:</strong> ${appointment.name}</p>
            <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <p><strong>Doctor:</strong> ${doctorNames[appointment.doctor] || appointment.doctor}</p>
            <p><strong>Service:</strong> ${serviceNames[appointment.service]}</p>
        </div>
        <p style="color: #4a5568; font-size: 0.9rem;">
            ${isExistingAppointment ? 'Do you confirm this appointment?' : 'Do you confirm the details of this appointment?'}
        </p>
    `;

    modal.querySelector('h2').textContent = modalTitle;
    confirmBtn.textContent = confirmButtonText;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentAppointment = null;
}

// Confirm appointment (add or update)
function confirmAppointment() {
    if (currentAppointment) {
        const existingIndex = appointments.findIndex(apt => apt.id === currentAppointment.id);

        if (existingIndex !== -1) {
            appointments[existingIndex].confirmed = true;
            showMessage('Appointment confirmed!', 'success');
        } else {
            appointments.push(currentAppointment);
            showMessage('Appointment added successfully!', 'success');
            appointmentForm.reset();
        }

        filterAppointments();
        closeModal();
    }
}

// Render appointment list
function renderAppointments() {
    if (filteredAppointments.length === 0) {
        appointmentList.innerHTML = '<li class="empty-message">No appointments found yet.</li>';
        return;
    }

    filteredAppointments.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

    appointmentList.innerHTML = filteredAppointments.map(appointment => {
        const serviceNames = {
            'konsultasyon': 'Consultation',
            'tedavi': 'Treatment',
            'kontrol': 'Check-up',
            'acil': 'Emergency'
        };

        const doctorNames = {
            'dr-ahmet-yilmaz': 'Dr. Yüksel Kaya - Cardiology',
            'dr-ayse-demir': 'Dr. Oğuzhan Özgür - Internal Medicine',
            'dr-mehmet-kaya': 'Dr. Berke Algün - Orthopedics',
            'dr-fatma-ozturk': 'Dr. Atakan Avsever - Pediatrics',
            'dr-ali-celik': 'Dr. Emircan Üye - Neurology',
            'dr-zeynep-arslan': 'Dr. Muzaffer Bayrak - Dermatology',
            'acil-doktor': 'Emergency Room Doctor'
        };

        const confirmedClass = appointment.confirmed ? 'confirmed' : '';
        const emergencyClass = appointment.doctor === 'acil-doktor' ? 'emergency' : '';
        const doctorName = doctorNames[appointment.doctor] || appointment.doctor;

        return `
            <li class="appointment-item ${confirmedClass} ${emergencyClass}" data-id="${appointment.id}" data-date="${appointment.date}" data-time="${appointment.time}">
                <div class="appointment-header">
                    <span class="appointment-name">${appointment.name}</span>
                </div>
                <div class="appointment-date">${formatDate(appointment.date)}</div>
                <div class="appointment-time">${appointment.time}</div>
                <div class="appointment-doctor">👨‍⚕️ ${doctorName}</div>
                <span class="appointment-service">${serviceNames[appointment.service]}</span>
                <div class="appointment-buttons">
                    <button class="detail-btn" onclick="showAppointmentDetails(${appointment.id})">Details</button>
                    <button class="delete-btn" onclick="deleteAppointment(${appointment.id})">Delete</button>
                </div>
            </li>
        `;
    }).join('');
}

// Show appointment details modal by ID
function showAppointmentDetails(id) {
    const appointment = appointments.find(apt => apt.id === id);
    if (appointment) {
        showAppointmentModal(appointment);
    }
}

// Delete appointment by ID
function deleteAppointment(id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        appointments = appointments.filter(appointment => appointment.id !== id);
        filteredAppointments = filteredAppointments.filter(appointment => appointment.id !== id);
        renderAppointments();
        showMessage('Appointment deleted.', 'success');
    }
}

// Add double-click event for deleting appointment
function addAppointmentListEvents() {
    appointmentList.addEventListener('dblclick', function(event) {
        const appointmentItem = event.target.closest('.appointment-item');
        if (appointmentItem) {
            const appointmentId = parseInt(appointmentItem.dataset.id);
            if (confirm('Are you sure you want to delete this appointment by double-click?')) {
                deleteAppointment(appointmentId);
            }
        }
    });
}

// Disable right-click context menu on appointment list
function addContextMenuEvents() {
    appointmentList.addEventListener('contextmenu', function(event) {
        event.preventDefault();

        // Show warning message
        showContextMenuWarning();
    });
}

// Show right-click disabled warning
function showContextMenuWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'context-menu-warning';
    warningDiv.textContent = '⚠️ Right-click is disabled.';

    document.body.appendChild(warningDiv);

    setTimeout(() => {
        warningDiv.remove();
    }, 2000);
}

// Filter appointments based on search input
function filterAppointments() {
    const searchTerm = filterInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        filteredAppointments = [...appointments];
    } else {
        filteredAppointments = appointments.filter(appointment => {
            const doctorNames = {
                'dr-ahmet-yilmaz': 'Dr. Yüksel Kaya - Cardiology',
                'dr-ayse-demir': 'Dr. Oğuzhan Özgür - Internal Medicine',
                'dr-mehmet-kaya': 'Dr. Berke Algün - Orthopedics',
                'dr-fatma-ozturk': 'Dr. Atakan Avsever - Pediatrics',
                'dr-ali-celik': 'Dr. Emircan Üye - Neurology',
                'dr-zeynep-arslan': 'Dr. Muzaffer Bayrak - Dermatology',
                'acil-doktor': 'Emergency Room Doctor'
            };

            const doctorName = doctorNames[appointment.doctor] || appointment.doctor;

            return appointment.name.toLowerCase().includes(searchTerm) ||
                   doctorName.toLowerCase().includes(searchTerm);
        });
    }

    renderAppointments();
}

// Format date to readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Filter service options based on selected doctor
function filterServicesByDoctor(doctorId) {
    const serviceSelect = document.getElementById('service');
    const doctorServices = {
        'dr-ahmet-yilmaz': ['consultation', 'treatment', 'check-up'], // Cardiology
        'dr-ayse-demir': ['consultation', 'treatment', 'check-up'], // Internal Medicine
        'dr-mehmet-kaya': ['treatment', 'check-up'], // Orthopedics
        'dr-fatma-ozturk': ['consultation', 'treatment', 'check-up'], // Pediatrics
        'dr-ali-celik': ['consultation', 'treatment'], // Neurology
        'dr-zeynep-arslan': ['consultation', 'treatment', 'check-up'], // Dermatology
        'emergency-doctor': ['emergency'] // Emergency Room
    };

    const availableServices = doctorServices[doctorId] || [];

    serviceSelect.value = '';

    Array.from(serviceSelect.options).forEach(option => {
        if (option.value === '') return;

        if (availableServices.includes(option.value)) {
            option.style.display = '';
            option.disabled = false;
        } else {
            option.style.display = 'none';
            option.disabled = true;
        }
    });

    serviceSelect.style.borderColor = '#e2e8f0';
    removeValidationMessage(serviceSelect);
}

// Reset service select options to show all
function resetServiceOptions() {
    const serviceSelect = document.getElementById('service');

    Array.from(serviceSelect.options).forEach(option => {
        option.style.display = '';
        option.disabled = false;
    });

    serviceSelect.value = '';
    serviceSelect.style.borderColor = '#e2e8f0';
    removeValidationMessage(serviceSelect);
}

// Show message at top of page (success or error)
function showMessage(message, type) {
    // Remove previous messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Add input/change event listeners after page load
window.addEventListener('load', function() {
    addInputChangeEvents();

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
});
