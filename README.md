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
* **Tailwind CSS (minify):** Utility-first framework for fast, responsive styling.
* **JavaScript:** Minor scripting for smooth scrolling, images gallery, mobile navigation toggle and contact form.
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

3. **Install modules for Tailwind and for functions:**
It's needed for local deploy.
```bash
cd ./functions/
npm install
cd ..
npm install
npm run init-tailwind
```

4. **Make sure your Google Cloud project have secrets:**

| Secret Name | Value |
| :--- | :--- |
| SMTP_HOST | `smtp.eu.mailgun.org` or other SMTP service |
| SMTP_PORT | 465 |
| SMTP_USER | Login for MailGun or other SMTP service |
| SMTP_PASS | Password for SMTP user |
| RECEIVING_EMAIL | List of reciepients, devided by commas |


## Deployment

### 1. One-time Setup
* **Install Tools:** Ensure you have Node.js and the Firebase CLI installed.
* **Initialize Project:** Run `firebase init` **only once** when you first clone the repository or set up the project locally. Select *Hosting* and set the public directory to `public`.

### 2. Pre-deployment Checklist (Mandatory)
Before any deployment, you **must** perform these steps:

1.  **Update Sitemap Date:**
    Open `public/sitemap.xml` and update the `<lastmod>` tag to the current date (format: `YYYY-MM-DD`).
    
2.  **Rebuild CSS:**
    If you made changes to HTML classes or styles, regenerate the Tailwind CSS file:
    ```bash
    npm run build
    ```

### 3. Deployment Methods

#### Option A: Automatic Deployment (CI/CD)
The site is configured to deploy automatically via **GitHub Actions** whenever code is merged into the `main` branch. This is the recommended way for production releases.

#### Option B: Manual Full Deployment
If you need to deploy changes manually from your local machine (Hosting + Functions):
```bash
firebase deploy
```

#### Option C: Partial Deployment (Functions Only)
If you only updated the backend logic (Cloud Functions) and didn't touch the website content:
```bash
ffirebase deploy --only functions:submitForm
```

*Note: This is useful for updating secret bindings or backend logic fixes without re-uploading hosting assets.*

---

(c) 2025 Ikigai
