# 🌿 VanaOshadhi — Herbal Treatment & Remedy Finder

**VanaOshadhi** is a web-based herbal treatment and remedy recommendation platform designed to help users explore traditional Ayurvedic and herbal remedies based on their symptoms and health information.

The application provides a simple, user-friendly interface for discovering herbal remedies while clearly encouraging users to consult qualified medical professionals for serious or persistent conditions.

---

## ✨ Features

### 🔐 User Authentication

* User registration and sign-in
* Email and password authentication
* Forgot-password functionality
* User profile management
* Logout functionality

### 🌿 Herbal Remedy Recommender

Users can provide information such as:

* Age
* Gender
* Symptoms
* Duration of symptoms
* Severity
* Existing health conditions
* Additional information

The system uses this information to provide relevant traditional herbal remedy suggestions.

### 📚 Herb Library

* Browse available herbs
* Search herbs and conditions
* View information about herbal treatments
* Explore traditional uses of different herbs

### 📊 Personal Dashboard

* View personal health/remedy information
* Track previous remedy searches
* Access remedy history
* View feedback and ratings

### 👤 User Profile

* View personal information
* Edit profile details
* View previous remedy searches
* View submitted feedback
* Clear remedy history

### ⭐ Feedback System

Users can rate remedies and provide feedback based on their experience.

### 🌍 Multilingual Support

The application includes multilingual interface support, including:

* English
* Hindi

This makes the platform more accessible to a wider range of users.

### 🌓 Theme Support

* Light mode
* Dark mode

### 📱 Responsive Design

The interface is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Responsive Web Design

### Libraries & Tools

* Font Awesome
* Google Fonts
* Firebase

### Development Concepts

* DOM manipulation
* Client-side authentication
* Local/user state management
* Form validation
* Responsive UI
* Multi-step forms
* Search and filtering
* User feedback and history management

---

## 📂 Project Structure

```text
Herbal-Treatment/
│
├── index.html              # Home page
├── login.html              # Login & registration page
├── recommender.html        # Herbal remedy recommendation system
├── herbs.html              # Herb library
├── dashboard.html          # User dashboard
├── profile.html            # User profile and history
│
├── css/
│   └── main.css            # Main stylesheet
│
└── js/
    ├── app.js              # Main application functionality
    ├── auth.js             # Authentication functionality
    ├── data.js             # Herbal/remedy data
    ├── firebase-config.js  # Firebase configuration
    ├── recommender.js      # Remedy recommendation logic
    ├── reminders.js        # Reminder functionality
    └── translations.js     # Language translations
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Herbal-Treatment.git
```

### 2. Navigate to the Project

```bash
cd Herbal-Treatment
```

### 3. Run the Project

Since this is a frontend web application, you can open:

```text
index.html
```

directly in a browser.

For a better development experience, use **VS Code Live Server** or another local development server.

---

## 🔥 Firebase Configuration

If Firebase authentication/database functionality is enabled, configure your Firebase project before running the application.

Update:

```text
js/firebase-config.js
```

with your Firebase configuration.

**Do not upload private credentials, API keys, service-account files, or other secrets to GitHub.**

---

## 🔄 Application Flow

```text
                    ┌──────────────────┐
                    │   VanaOshadhi    │
                    │      Home        │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Login / Register │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────▼─────┐ ┌──────▼──────┐ ┌────▼─────┐
       │   Remedy   │ │ Herb Library │ │Dashboard │
       │ Recommender│ │              │ │          │
       └──────┬─────┘ └──────────────┘ └────┬─────┘
              │                             │
       ┌──────▼─────────┐            ┌──────▼──────┐
       │ User Symptoms  │            │History /    │
       │ & Health Info  │            │Feedback     │
       └──────┬─────────┘            └─────────────┘
              │
       ┌──────▼──────────┐
       │ Herbal Remedy   │
       │ Recommendation  │
       └─────────────────┘
```

---

## 🎯 Project Objectives

The main objectives of VanaOshadhi are:

* Make information about traditional herbal remedies easier to explore.
* Provide a simple symptom-based remedy discovery experience.
* Create an accessible digital herb library.
* Maintain user remedy history and feedback.
* Support multiple languages.
* Provide a clean and responsive healthcare-oriented interface.
* Encourage responsible use of traditional remedies alongside professional medical care.

---

## ⚠️ Medical Disclaimer

VanaOshadhi provides information and recommendations related to traditional herbal and Ayurvedic practices for educational and informational purposes.

The recommendations provided by this application **are not a substitute for professional medical diagnosis, treatment, or medical advice**.

Users should consult a qualified healthcare professional for serious, persistent, worsening, or emergency medical conditions.

**In an emergency in India, call 112.**

---

## 🔮 Future Enhancements

Potential future improvements include:

* 🤖 AI-powered personalized remedy recommendations
* 🧠 Machine-learning-based symptom analysis
* 🗣️ Voice-based symptom input
* 🌐 Additional Indian language support
* 📍 Nearby Ayurvedic/healthcare center discovery
* 📱 Progressive Web App (PWA) support
* 🔔 Personalized medicine/remedy reminders
* 📈 Health and remedy analytics
* 🩺 Doctor consultation integration
* 🔎 More extensive verified herbal medicine database
* 🛡️ Improved security and privacy controls

---

## 👨‍💻 Project

**Project Name:** VanaOshadhi
**Repository:** Herbal-Treatment
**Category:** Healthcare / Herbal Medicine / Web Application

---

## 📜 Disclaimer

This project is developed for **educational and demonstration purposes**. Herbal information should be independently verified using reliable medical and Ayurvedic sources before being used for healthcare decisions.
