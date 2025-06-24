// ==============================================
// Módulo principal de la aplicación
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el calendario
    const datepicker = initDatePicker();
    
    // Inicializar los slots de tiempo
    initTimeSlots();
    
    // Manejar el evento de envío del formulario
    document.getElementById('reservationForm').addEventListener('submit', handleFormSubmit);
    
    // Manejar el botón de nueva reserva
    document.getElementById('new-reservation').addEventListener('click', resetForm);
});

// ==============================================
// Inicialización del calendario con Flatpickr
// ==============================================
function initDatePicker() {
    // Configuración del datepicker
    return flatpickr("#datepicker", {
        locale: "es",
        minDate: "today",
        dateFormat: "d-m-Y",
        disable: [
            function(date) {
                // Deshabilitar los martes (día de descanso)
                return (date.getDay() === 2);
            }
        ],
        onChange: function(selectedDates) {
            // Cuando se selecciona una fecha, actualizar los horarios disponibles
            updateTimeSlots(selectedDates[0]);
            document.getElementById('date-error').style.display = 'none';
        }
    });
}

// ==============================================
// Inicialización de los slots de tiempo
// ==============================================
function initTimeSlots() {
    const timeSlotsContainer = document.getElementById('time-slots');
    timeSlotsContainer.innerHTML = '';
    
    // Mostrar mensaje inicial
    const message = document.createElement('div');
    message.textContent = 'Seleccione una fecha primero';
    message.classList.add('time-slot');
    message.style.gridColumn = '1 / -1';
    timeSlotsContainer.appendChild(message);
}

// ==============================================
// Actualizar los slots de tiempo según la fecha seleccionada
// ==============================================
function updateTimeSlots(selectedDate) {
    const timeSlotsContainer = document.getElementById('time-slots');
    timeSlotsContainer.innerHTML = '';
    
    // Generar horarios disponibles (ejemplo)
    const hours = [];
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const currentHour = now.getHours();
    
    // Horario del restaurante
    const openingHour = selectedDate.getDay() === 0 || selectedDate.getDay() === 6 ? 11 : 12;
    const closingHour = selectedDate.getDay() === 0 || selectedDate.getDay() === 6 ? 24 : 23;
    
    // Generar slots cada 30 minutos
    for (let hour = openingHour; hour < closingHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            // No mostrar horarios pasados para hoy
            if (isToday && (hour < currentHour || (hour === currentHour && minute < now.getMinutes()))) {
                continue;
            }
            
            // Simular disponibilidad (algunos horarios "ocupados")
            const isAvailable = Math.random() > 0.3;
            
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');
            timeSlot.textContent = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            
            if (!isAvailable) {
                timeSlot.classList.add('unavailable');
                timeSlot.title = 'No disponible';
            } else {
                timeSlot.addEventListener('click', function() {
                    // Deseleccionar cualquier otro slot seleccionado
                    document.querySelectorAll('.time-slot.selected').forEach(slot => {
                        slot.classList.remove('selected');
                    });
                    
                    // Seleccionar este slot
                    this.classList.add('selected');
                    document.getElementById('time-error').style.display = 'none';
                });
            }
            
            timeSlotsContainer.appendChild(timeSlot);
        }
    }
}

// ==============================================
// Manejar el envío del formulario
// ==============================================
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar formulario
    if (validateForm()) {
        // Mostrar confirmación
        showConfirmation();
    }
}

// ==============================================
// Validar los datos del formulario
// ==============================================
function validateForm() {
    let isValid = true;
    
    // Validar nombre
    const name = document.getElementById('name').value.trim();
    if (!name) {
        document.getElementById('name-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('name-error').style.display = 'none';
    }
    
    // Validar email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('email-error').style.display = 'none';
    }
    
    // Validar teléfono
    const phone = document.getElementById('phone').value.trim();
    const phoneRegex = /^[0-9]{9,15}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById('phone-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('phone-error').style.display = 'none';
    }
    
    // Validar número de personas
    const people = document.getElementById('people').value;
    if (!people) {
        document.getElementById('people-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('people-error').style.display = 'none';
    }
    
    // Validar fecha
    const date = document.getElementById('datepicker').value;
    if (!date) {
        document.getElementById('date-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('date-error').style.display = 'none';
    }
    
    // Validar hora
    const timeSelected = document.querySelector('.time-slot.selected');
    if (!timeSelected) {
        document.getElementById('time-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('time-error').style.display = 'none';
    }
    
    return isValid;
}

// ==============================================
// Mostrar la confirmación de reserva
// ==============================================
function showConfirmation() {
    // Obtener datos del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const people = document.getElementById('people').value;
    const special = document.getElementById('special').value || 'Ninguno';
    const date = document.getElementById('datepicker').value;
    const time = document.querySelector('.time-slot.selected').textContent;
    
    // Actualizar detalles de confirmación
    document.getElementById('conf-name').textContent = name;
    document.getElementById('conf-date').textContent = date;
    document.getElementById('conf-time').textContent = time;
    document.getElementById('conf-people').textContent = `${people} ${people === '1' ? 'persona' : 'personas'}`;
    document.getElementById('conf-phone').textContent = phone;
    document.getElementById('conf-special').textContent = special;
    
    // Mostrar sección de confirmación y ocultar formulario
    document.getElementById('confirmation').style.display = 'block';
    document.querySelector('.reservation-container').style.display = 'none';
    
    // Desplazar a la sección de confirmación
    document.getElementById('confirmation').scrollIntoView({ behavior: 'smooth' });
}

// ==============================================
// Reiniciar el formulario para una nueva reserva
// ==============================================
function resetForm() {
    // Limpiar formulario
    document.getElementById('reservationForm').reset();
    document.getElementById('datepicker').value = '';
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Reiniciar slots de tiempo
    initTimeSlots();
    
    // Ocultar mensajes de error
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    
    // Mostrar formulario y ocultar confirmación
    document.querySelector('.reservation-container').style.display = 'flex';
    document.getElementById('confirmation').style.display = 'none';
    
    // Desplazar al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}