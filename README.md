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
├── functions/
│   ├── index.js            # Code for communicating with Firebase
│   ├── package-lock.json   # Node modules lock
│   └── package.json        # Dependencies file for functions
├── public/
│   ├── assets/             # Directory for images and other static files
│   ├── css/                # Directory for CSS
│   ├── 404.html            # 404 page not found file
│   └── index.html          # Main landing page file
├── src/
│   └── inputs.css          # Instructions for Tailwindcss
├── LICENSE                 # MIT License
├── README.md               # This
├── package-lock.json       # Node modules lock
├── package.json            # Dependencies file for Tailwindcss builder
├── tailwind.config.js      # File with folders list for Tailwindcss builder
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

3. **Install modules for contact form:**
```bash
cd functions
npm install
cd ..
npm install
npm run init-tailwind
```
Then follow the instructions to set Google Cloud secrets as described in `functions/index.js`.

4. **Deployment (Firebase):**
* Ensure you have the Firebase CLI installed.
* Initialize your project: `firebase init` (select Hosting and set the public directory to `public`).
* Create Tailwindcss CSS: `npm run build` (if there were some changes in html styles)
* Deploy: `firebase deploy`

---

(c) 2025 Ikigai
