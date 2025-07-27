📅 Interactive Appointment Calendar Application
This project is an interactive appointment calendar application developed to learn and reinforce the use of DOM events.

🎯 Project Purpose
Learn commonly used DOM events through a realistic mini project

Reinforce interactions through form elements, list management, and modal usage

Apply modern web development techniques

✨ Features
📝 Form Management
Name input: Text input field

Date selection: Date picker

Time selection: Time picker

Service selection: Dropdown menu for selecting service type

Form validation: Real-time input validation

🗓️ Appointment Management
Add appointments: Create new appointments via the form

List appointments: View appointments sorted by date

Delete appointments: Remove an appointment with one click

Appointment details: View appointment information in a modal

🎨 User Interface
Modern design: Gradient background and modern UI elements

Responsive layout: Compatible with mobile and desktop

Animations: Hover effects and transition animations

Modal system: Popup window for appointment confirmation

💾 Data Management
LocalStorage: Store appointments in the browser

Auto sorting: Automatically sort appointments by date

Data persistence: Data is preserved on page refresh

🚀 Usage
Open the index.html file in a web browser

Fill out the form fields:

Enter a name

Choose a date

Choose a time

Select a service type

Click the "Add Appointment" button

Review the appointment details in the modal

Click "Confirm" to save the appointment

🛠️ Technologies Used
HTML5: Semantic structure and form elements

CSS3: Modern styling, Flexbox, Grid, animations

JavaScript (ES6+): DOM manipulation, event handling, LocalStorage

📁 File Structure
graphql
Kopyala
Düzenle
domExamples1/
├── index.html        # Main HTML file  
├── style.css         # CSS styles  
├── script.js         # JavaScript functions  
└── README.md         # Project documentation  
🎯 DOM Events Used
Form Events
submit: Form submission

input: Real-time input control

change: Date and time changes

focus/blur: Input field focus

Modal Events
click: Open/close modal

keydown: Close modal with ESC

window.click: Close modal by clicking outside

List Events
click: Delete appointment or view details

DOMContentLoaded: Run on page load

🎨 CSS Features
Grid Layout: Main page layout

Flexbox: Layout for form and list elements

CSS Variables: Color and size variables

Media Queries: Responsive design

Transitions: Smooth animations

Box-shadow: Depth effects

🔧 Customization
Change Color Theme
You can update CSS variables in style.css:

css
Kopyala
Düzenle
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #48bb78;
    --error-color: #e53e3e;
}
Add Service Types
Update the serviceNames object in script.js:

js
Kopyala
Düzenle
const serviceNames = {
    'konsultasyon': 'Consultation',
    'tedavi': 'Treatment',
    'kontrol': 'Check-up',
    'acil': 'Emergency',
    'new-service': 'New Service' // Add your new service
};
📱 Responsive Design
The application is optimized for the following screen sizes:

Desktop: 1200px and above

Tablet: 768px – 1199px

Mobile: 767px and below

🎓 Learning Objectives
Through this project, you can learn:

DOM Manipulation
Element selection

Content updating

Style changes

Event Handling
Form events

Click events

Keyboard events

Form Management
FormData API

Validation

Real-time feedback

Modal Usage
Popup windows

Overlay handling

Accessibility

LocalStorage
Data storage

JSON serialization

Data persistence

🚀 Future Improvements
Edit appointment feature

Calendar view

Appointment reminders

Multi-user support

Export/Import feature

Theme switching options

Note: This project is built for educational purposes and uses only frontend technologies.
