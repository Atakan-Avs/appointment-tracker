// dom elementleri secme 
const appointmentForm = document.getElementById('appointmentForm');
const appointmentList = document.getElementById('appointments');
const modal = document.getElementById('modal');
const modalDetails = document.getElementById('modalDetails');
const closeBtn = document.querySelector('.close');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const filterInput = document.getElementById('filter');


//randevu saklamak icin array
let appointments = [];
let currentAppointment = null;
let filteredAppointments = [];


//sayfa yüklenince calısacak fonksiyon
document.addEventListener('DOMContentLoaded', function() {
    //form submit dinle
    appointmentForm.addEventListener('submit', handleFormSubmit);

    //modal eventleri
    closeBtn.addEventListener('click', closeModal);
    confirmBtn.addEventListener('click', confirmAppointment);
    cancelBtn.addEventListener('click', closeModal);

    //modalın disina tiklandıgında kapat
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    //esc ile modalı kapat
    document.addEventListener('keydown',function(event) {
        if (event.key === 'Escape'&& modal.style.display === 'block') {
            closeModal();
        }
    });
    

    //bugünün tarihini min olarak ayarla
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;

    //form alanina focus eventlerini ekle
    addFormFocusEvents();

    //arama filtreleme eventini ekle
    filterInput.addEventListener('input', filterAppointments);

    //randevu listesine eventleri ekle
    addAppointmentListEvents();

    //sağ tık eventleri ekle
    addContextMenuEvents();

    //hosgeldin mesajı
    showWelcomeMessage();

    //baslangicta bos listeyi goster
    renderAppointments();
});


//load event - hosgeldin mesajı
function showWelcomeMessage() {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-alert';
    welcomeDiv.textContent = 'Randevu takviminize hoş geldiniz!';

    document.body.appendChild(welcomeDiv);

    //3 saniye sonra mesajı kaldır
    setTimeout(() => {
        welcomeDiv.remove();
    }, 3000);
}

//focus/blur eventleri
function addFormFocusEvents() {
    const formGroups = appointmentForm.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('input, select');

        input.addEventListener('focus' , function() {
            group.classList.add('focused');
            showValidationMessage(this , 'valid' , 'Bu alan zorunludur!');
        });

        input.addEventListener('blur', function() {
            group.classList.remove('focused');
            removeValidationMessage(this);
        });
    });
}

//input/Change eventleri - Real-time validasyon
function addInputChangeEvents() {
    const nameInput = document.getElementById('name');
    const dateInput = document.getElementById('date');
    const doctorSelect = document.getElementById('doctor');
    const serviceSelect = document.getElementById('service');
    
    // İsim input event'i
    nameInput.addEventListener('input', function() {
        if (this.value.trim().length < 2) {
            this.style.borderColor = '#e53e3e';
            showValidationMessage(this, 'invalid', 'İsim en az 2 karakter olmalıdır.');
        } else {
            this.style.borderColor = '#48bb78';
            showValidationMessage(this, 'valid', 'İsim geçerli!');
        }
    });
    
    // Tarih change event'i
    dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            this.style.borderColor = '#e53e3e';
            showValidationMessage(this, 'invalid', 'Geçmiş bir tarih seçemezsiniz.');
        } else {
            this.style.borderColor = '#48bb78';
            showValidationMessage(this, 'valid', 'Tarih seçildi!');
        }
    });
    
    // Doktor change event'i
    doctorSelect.addEventListener('change', function() {
        if (this.value) {
            this.style.borderColor = '#48bb78';
            showValidationMessage(this, 'valid', `${this.options[this.selectedIndex].text} seçildi!`);
            
            // Doktor seçildiğinde hizmetleri filtrele
            filterServicesByDoctor(this.value);
        } else {
            this.style.borderColor = '#e53e3e';
            showValidationMessage(this, 'invalid', 'Lütfen bir doktor seçiniz.');
            
            // Doktor seçimi kaldırıldığında tüm hizmetleri göster
            resetServiceOptions();
        }
    });
    
    // Hizmet change event'i
    serviceSelect.addEventListener('change', function() {
        if (this.value) {
            this.style.borderColor = '#48bb78';
            showValidationMessage(this, 'valid', `${this.options[this.selectedIndex].text} seçildi!`);
        } else {
            this.style.borderColor = '#e53e3e';
            showValidationMessage(this, 'invalid', 'Lütfen bir hizmet seçiniz.');
        }
    });
}

// Validasyon mesajı göster
function showValidationMessage(element, type, message) {
    // Önceki mesajı kaldır
    removeValidationMessage(element);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `validation-message ${type}`;
    messageDiv.textContent = message;
    
    element.parentElement.appendChild(messageDiv);
}

// Validasyon mesajını kaldır
function removeValidationMessage(element) {
    const existingMessage = element.parentElement.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Submit event - Form gönderimini engelle
function handleFormSubmit(event) {
    event.preventDefault(); // Form gönderimini engelle
    
    // Form verilerini al
    const formData = new FormData(appointmentForm);
    const appointment = {
        id: Date.now(), // Benzersiz ID
        name: formData.get('name'),
        date: formData.get('date'),
        time: formData.get('time'),
        doctor: formData.get('doctor'),
        service: formData.get('service'),
        createdAt: new Date().toISOString(),
        confirmed: false // Onay durumu
    };
    
    // Form validasyonu
    if (!validateAppointment(appointment)) {
        return;
    }
    
    // Modal'da randevu detaylarını göster
    showAppointmentModal(appointment);
}

// Randevu validasyonu
function validateAppointment(appointment) {
    if (!appointment.name.trim()) {
        showMessage('Lütfen isim giriniz.', 'error');
        return false;
    }
    
    if (!appointment.date) {
        showMessage('Lütfen tarih seçiniz.', 'error');
        return false;
    }
    
    if (!appointment.time) {
        showMessage('Lütfen saat seçiniz.', 'error');
        return false;
    }
    
    if (!appointment.doctor) {
        showMessage('Lütfen doktor seçiniz.', 'error');
        return false;
    }
    
    if (!appointment.service) {
        showMessage('Lütfen hizmet seçiniz.', 'error');
        return false;
    }
    
    // Geçmiş tarih kontrolü
    const selectedDate = new Date(appointment.date + ' ' + appointment.time);
    const now = new Date();
    
    if (selectedDate < now) {
        showMessage('Geçmiş bir tarih seçemezsiniz.', 'error');
        return false;
    }
    
    return true;
}

// Modal'da randevu detaylarını göster
function showAppointmentModal(appointment) {
    currentAppointment = appointment;
    
    const serviceNames = {
        'konsultasyon': 'Konsültasyon',
        'tedavi': 'Tedavi',
        'kontrol': 'Kontrol',
        'acil': 'Acil'
    };
    
    const doctorNames = {
        'dr-ahmet-yilmaz': 'Dr. Yüksel Kaya - Kardiyoloji',
        'dr-ayse-demir': 'Dr. Oğuzhan Özgür - Dahiliye',
        'dr-mehmet-kaya': 'Dr. Berke Algün - Ortopedi',
        'dr-fatma-ozturk': 'Dr. Atakan Avsever - Çocuk Sağlığı',
        'dr-ali-celik': 'Dr. Emircan Üye - Nöroloji',
        'dr-zeynep-arslan': 'Dr. Muzaffer Bayrak - Dermatoloji',
        'acil-doktor': 'Acil Servis Doktoru'
    };
    
    // Eğer randevu zaten mevcut ise (düzenleme modu)
    const isExistingAppointment = appointments.find(apt => apt.id === appointment.id);
    const modalTitle = isExistingAppointment ? 'Randevu Detayları' : 'Yeni Randevu Onayı';
    const confirmButtonText = isExistingAppointment ? 'Onayla' : 'Ekle';
    
    modalDetails.innerHTML = `
        <div style="background: #f7fafc; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
            <p><strong>İsim:</strong> ${appointment.name}</p>
            <p><strong>Tarih:</strong> ${formatDate(appointment.date)}</p>
            <p><strong>Saat:</strong> ${appointment.time}</p>
            <p><strong>Doktor:</strong> ${doctorNames[appointment.doctor] || appointment.doctor}</p>
            <p><strong>Hizmet:</strong> ${serviceNames[appointment.service]}</p>
        </div>
        <p style="color: #4a5568; font-size: 0.9rem;">
            ${isExistingAppointment ? 'Bu randevuyu onaylıyor musunuz?' : 'Bu randevu bilgilerini onaylıyor musunuz?'}
        </p>
    `;
    
    // Modal başlığını güncelle
    modal.querySelector('h2').textContent = modalTitle;
    
    // Onay butonunu güncelle
    confirmBtn.textContent = confirmButtonText;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Scroll'u engelle
}

// Modal'ı kapat
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Scroll'u geri aç
    currentAppointment = null;
}

// Randevuyu onayla
function confirmAppointment() {
    if (currentAppointment) {
        // Eğer randevu zaten mevcut ise (düzenleme modu)
        const existingIndex = appointments.findIndex(apt => apt.id === currentAppointment.id);
        
        if (existingIndex !== -1) {
            // Mevcut randevuyu onayla (yeşil yap)
            appointments[existingIndex].confirmed = true;
            showMessage('Randevu onaylandı!', 'success');
        } else {
            // Yeni randevu ekle
            appointments.push(currentAppointment);
            showMessage('Randevu başarıyla eklendi!', 'success');
            
            // Formu temizle (sadece yeni randevu eklendiğinde)
            appointmentForm.reset();
        }
        
        // Filtrelenmiş listeyi güncelle
        filterAppointments();
        
        // Modal'ı kapat
        closeModal();
    }
}

// Randevuları listele
function renderAppointments() {
    if (filteredAppointments.length === 0) {
        appointmentList.innerHTML = '<li class="empty-message">Henüz randevu bulunmuyor.</li>';
        return;
    }
    
    // Randevuları tarihe göre sırala
    filteredAppointments.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
    
    appointmentList.innerHTML = filteredAppointments.map(appointment => {
        const serviceNames = {
            'konsultasyon': 'Konsültasyon',
            'tedavi': 'Tedavi',
            'kontrol': 'Kontrol',
            'acil': 'Acil'
        };
        
        const doctorNames = {
            'dr-ahmet-yilmaz': 'Dr. Yüksel Kaya - Kardiyoloji',
            'dr-ayse-demir': 'Dr. Oğuzhan Özgür - Dahiliye',
            'dr-mehmet-kaya': 'Dr. Berke Algün - Ortopedi',
            'dr-fatma-ozturk': 'Dr. Atakan Avsever - Çocuk Sağlığı',
            'dr-ali-celik': 'Dr. Emircan Üye - Nöroloji',
            'dr-zeynep-arslan': 'Dr. Muzaffer Bayrak - Dermatoloji',
            'acil-doktor': 'Acil Servis Doktoru'
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
                    <button class="detail-btn" onclick="showAppointmentDetails(${appointment.id})">Detay</button>
                    <button class="delete-btn" onclick="deleteAppointment(${appointment.id})">Sil</button>
                </div>
            </li>
        `;
    }).join('');
}

// Randevu detaylarını göster
function showAppointmentDetails(id) {
    const appointment = appointments.find(apt => apt.id === id);
    if (appointment) {
        showAppointmentModal(appointment);
    }
}

// Randevu sil
function deleteAppointment(id) {
    if (confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
        appointments = appointments.filter(appointment => appointment.id !== id);
        filteredAppointments = filteredAppointments.filter(appointment => appointment.id !== id);
        renderAppointments();
        showMessage('Randevu silindi.', 'success');
    }
}

// Dblclick event - Çift tıklama ile silme
function addAppointmentListEvents() {
    appointmentList.addEventListener('dblclick', function(event) {
        const appointmentItem = event.target.closest('.appointment-item');
        if (appointmentItem) {
            const appointmentId = parseInt(appointmentItem.dataset.id);
            if (confirm('Çift tıklama ile randevuyu silmek istediğinizden emin misiniz?')) {
                deleteAppointment(appointmentId);
            }
        }
    });
}

// Contextmenu event - Sağ tık engelleme
function addContextMenuEvents() {
    appointmentList.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Sağ tık menüsünü engelle
        
        // Uyarı mesajı göster
        showContextMenuWarning();
    });
}

// Sağ tık uyarısı göster
function showContextMenuWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'context-menu-warning';
    warningDiv.textContent = '⚠️ Sağ tık devre dışı.';
    
    document.body.appendChild(warningDiv);
    
    // 2 saniye sonra uyarıyı kaldır
    setTimeout(() => {
        warningDiv.remove();
    }, 2000);
}

// Arama filtreleme
function filterAppointments() {
    const searchTerm = filterInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredAppointments = [...appointments];
    } else {
        filteredAppointments = appointments.filter(appointment => {
            const doctorNames = {
                'dr-ahmet-yilmaz': 'Dr. Yüksel Kaya - Kardiyoloji',
                'dr-ayse-demir': 'Dr. Oğuzhan Özgür - Dahiliye',
                'dr-mehmet-kaya': 'Dr. Berke Algün - Ortopedi',
                'dr-fatma-ozturk': 'Dr. Atakan Avsever - Çocuk Sağlığı',
                'dr-ali-celik': 'Dr. Emircan Üye - Nöroloji',
                'dr-zeynep-arslan': 'Dr. Muzaffer Bayrak - Dermatoloji',
                'acil-doktor': 'Acil Servis Doktoru'
            };
            
            const doctorName = doctorNames[appointment.doctor] || appointment.doctor;
            
            return appointment.name.toLowerCase().includes(searchTerm) ||
                   doctorName.toLowerCase().includes(searchTerm);
        });
    }
    
    renderAppointments();
}

// Tarih formatla
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('tr-TR', options);
}

// Doktor seçimine göre hizmetleri filtrele
function filterServicesByDoctor(doctorId) {
    const serviceSelect = document.getElementById('service');
    const doctorServices = {
        'dr-ahmet-yilmaz': ['konsultasyon', 'tedavi', 'kontrol'], // Kardiyoloji
        'dr-ayse-demir': ['konsultasyon', 'tedavi', 'kontrol'], // Dahiliye
        'dr-mehmet-kaya': ['tedavi', 'kontrol'], // Ortopedi
        'dr-fatma-ozturk': ['konsultasyon', 'tedavi', 'kontrol'], // Çocuk Sağlığı
        'dr-ali-celik': ['konsultasyon', 'tedavi'], // Nöroloji
        'dr-zeynep-arslan': ['konsultasyon', 'tedavi', 'kontrol'], // Dermatoloji
        'acil-doktor': ['acil'] // Acil Servis
    };
    
    const availableServices = doctorServices[doctorId] || [];
    
    // Mevcut seçimi temizle
    serviceSelect.value = '';
    
    // Tüm option'ları gizle
    Array.from(serviceSelect.options).forEach(option => {
        if (option.value === '') return; // "Hizmet seçiniz" option'ını atla
        
        if (availableServices.includes(option.value)) {
            option.style.display = '';
            option.disabled = false;
        } else {
            option.style.display = 'none';
            option.disabled = true;
        }
    });
    
    // Hizmet seçimini sıfırla
    serviceSelect.style.borderColor = '#e2e8f0';
    removeValidationMessage(serviceSelect);
}

// Hizmet seçeneklerini sıfırla
function resetServiceOptions() {
    const serviceSelect = document.getElementById('service');
    
    // Tüm option'ları göster
    Array.from(serviceSelect.options).forEach(option => {
        option.style.display = '';
        option.disabled = false;
    });
    
    // Hizmet seçimini sıfırla
    serviceSelect.value = '';
    serviceSelect.style.borderColor = '#e2e8f0';
    removeValidationMessage(serviceSelect);
}

// Mesaj göster
function showMessage(message, type) {
    // Önceki mesajları temizle
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Mesajı sayfanın üstüne ekle
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    // 3 saniye sonra mesajı kaldır
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Sayfa yüklendiğinde input/change event'lerini ekle
window.addEventListener('load', function() {
    addInputChangeEvents();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
});