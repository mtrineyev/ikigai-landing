# Ikigai - Private Senior Care Landing Page

A modern, responsive, single-page landing website developed for the "Ikigai" Private Senior Care and Nursing Home (Ukraine).

This project focuses on providing clear, accessible information for family members aged 30-55 seeking reliable and comprehensive care for their elderly relatives.


## Key Features

* **Responsive Design:** Fully adaptive layout using Tailwind CSS for optimal viewing on desktop, tablet, and mobile devices.
* **Single-Page Layout:** All essential information (About, Services, Advantages, Gallery, Contact) is contained within one page.
* **Energy Resilience Highlight:** Dedicated section detailing crucial advantages, including battery backup, generator, and Starlink internet connectivity to ensure uninterrupted care and communication.
* **SEO Optimized:** Comprehensive meta-tags for improved search engine visibility and social media sharing.
* **Modern Aesthetics:** Clean, professional design suitable for a mature audience making critical family decisions.


## Technology Stack

* **HTML5:** Semantic structure.
* **Tailwind CSS (via CDN):** Utility-first framework for fast, responsive styling.
* **JavaScript:** Minor scripting for smooth scrolling and mobile navigation toggle.
* **Hosting:** Designed for easy deployment on Firebase Hosting.


## Project Structure

The project follows a standard structure optimized for Firebase deployment:
```
/
├── public/
│   ├── index.html          # Main landing page file
│   └── assets/             # Directory for images and other static files
├── LICENSE                 # MIT License
├── README.md               # This
├── firebase.json           # Firebase Hosting configuration file
└── .firebaserc             # Firebase project configuration
```


## Getting Started

To run and deploy this project:

1. **Clone the repository:**
```bash
git clone git@github.com:mtrineyev/ikigai-landing.git
cd ikigai-landing
```
2. **Add Images:** Replace the placeholder images in `index.html` with your actual assets (preferably place them in the `public/assets/images/` directory).

3. **Deployment (Firebase):**
* Ensure you have the Firebase CLI installed.
* Initialize your project: `firebase init` (select Hosting and set the public directory to `public`).
* Deploy: `firebase deploy`

---

(c) 2025 Ikigai
