# CareerHub — Comprehensive Project Architecture & File-by-File Documentation

This document contains a complete architectural guide and detailed breakdown of **every file and folder** in the CareerHub project.

---

## Table of Contents
1. [High-Level Architecture & Tech Stack](#1-high-level-architecture--tech-stack)
2. [Data Flow & Lifecycle](#2-data-flow--lifecycle)
3. [Root Configuration Files](#3-root-configuration-files)
4. [Database & Migration Scripts (`scripts/`)](#4-database--migration-scripts-scripts)
5. [Core Application Files (`src/`)](#5-core-application-files-src)
6. [Services Layer (`src/services/`)](#6-services-layer-srcservices)
7. [Utilities & Data Store (`src/utils/`)](#7-utilities--data-store-srcutils)
8. [Reusable Components (`src/components/`)](#8-reusable-components-srccomponents)
9. [Application Pages (`src/pages/`)](#9-application-pages-srcpages)
   - [Public & Shared Pages](#public--shared-pages)
   - [Candidate Pages](#candidate-pages)
   - [Recruiter Pages](#recruiter-pages)
   - [Authentication & Policy](#authentication--policy)

---

## 1. High-Level Architecture & Tech Stack

CareerHub is a single-page web application (SPA) serving as an **Applicant Tracking System (ATS)** and **Job Portal**.

- **Frontend Core**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Styling**: Native CSS3 ([index.css](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/index.css)) utilizing design tokens (CSS variables), glassmorphism, responsive grid systems, and micro-interactions without third-party CSS frameworks.
- **Client Routing**: Hash-based router (`window.location.hash` and `hashchange` listeners in [App.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/App.jsx)).
- **Backend / Storage Architecture (Hybrid)**:
  - **MockAPI.io REST API**: Real-time CRUD backend for dynamic shared entities: `jobs` and `applications`.
  - **Browser LocalStorage**: Retains user sessions (`me`), registered credentials (`users`), bookmarked jobs (`saved`), in-app alerts (`notifications`), and email logs.
  - **Fallback Layer**: When MockAPI is not configured or in offline demo mode, seed data from [data.js](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/utils/data.js) automatically takes over.
- **External Integrations**: [@emailjs/browser](https://www.emailjs.com/) for candidate emails during status transitions or interview scheduling.

---

## 2. Data Flow & Lifecycle

```
[Browser Loads index.html]
         │
         ▼
  [src/main.jsx] ──> Mounts <App /> inside React.StrictMode
         │
         ▼
  [src/App.jsx]
   ├── 1. Initializes db state via utils/data.js: load() from localStorage
   ├── 2. Simultaneously queries MockAPI.io via services/api.js (getJobs, getApplications)
   ├── 3. Listens to window hashchange (#/jobs, #/rdash, #/applicants, etc.)
   ├── 4. Evaluates Role-Based Access Control (Candidate vs. Recruiter vs. Guest)
   └── 5. Injects common prop bag P = { db, up, go, me, id, toast, ... } into active page
```

---

## 3. Root Configuration Files

### `package.json`
- **Location**: [package.json](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/package.json)
- **Purpose**: Defines npm scripts and dependencies.
- **Scripts**:
  - `npm run dev`: Boots Vite local development server with Hot Module Replacement (HMR).
  - `npm run build`: Compiles production assets into the `/dist` directory.
  - `npm run preview`: Previews the production build locally.
  - `npm run migrate`: Runs the database seeding script `node scripts/migrate.js`.
- **Dependencies**: `react`, `react-dom`, `@emailjs/browser`.
- **DevDependencies**: `vite`, `@vitejs/plugin-react`.

### `vite.config.js`
- **Location**: [vite.config.js](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/vite.config.js)
- **Purpose**: Configures the Vite bundler with `@vitejs/plugin-react` to support Fast Refresh, JSX compilation, and build chunking.

### `index.html`
- **Location**: [index.html](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/index.html)
- **Purpose**: Entry HTML template.
- **Key Elements**:
  - Loads Google Fonts (`Inter` and `Outfit`) for modern typography.
  - Declares the root mounting node: `<div id="root"></div>`.
  - Links to the main script entry point: `<script type="module" src="/src/main.jsx"></script>`.

### `.env` & `.env.example`
- **Location**: [.env](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/.env) and [.env.example](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/.env.example)
- **Purpose**: Environment variable templates for local deployment.
- **Variables**:
  - `VITE_MOCKAPI_URL`: Root URL of your MockAPI.io project (e.g. `https://xxxxxx.mockapi.io`).
  - `VITE_EMAILJS_SERVICE_ID`: EmailJS service ID for sending candidate notifications.
  - `VITE_EMAILJS_TEMPLATE_ID`: EmailJS template identifier.
  - `VITE_EMAILJS_PUBLIC_KEY`: EmailJS account public key.

### `.gitignore`
- **Location**: [.gitignore](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/.gitignore)
- **Purpose**: Prevents checking generated artifacts (`node_modules`, `dist`, `.env`) into git version control.

### `README.md`
- **Location**: [README.md](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/README.md)
- **Purpose**: Project onboarding guide detailing setup steps, demo credentials, and MockAPI resource schema definitions (`jobs` and `applications`).

---

## 4. Database & Migration Scripts (`scripts/`)

### `scripts/migrate.js`
- **Location**: [scripts/migrate.js](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/scripts/migrate.js)
- **Purpose**: Node.js migration CLI tool to seed MockAPI.io with jobs and applications.
- **Workflow**:
  1. Resolves `VITE_MOCKAPI_URL` from command-line arguments or `.env`.
  2. Queries `GET /jobs` to check existing records on MockAPI to prevent duplicate inserts.
  3. Iterates over 16 pre-configured job postings (`sampleJobs`) and sends `POST /jobs` for any missing listings.
  4. Maps generated remote IDs and seeds sample candidate applications into `POST /applications`.
  5. Outputs a summary table displaying old dummy IDs mapped to newly created MockAPI IDs.

---

## 5. Core Application Files (`src/`)

### `src/main.jsx`
- **Location**: [src/main.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/main.jsx)
- **Purpose**: React initialization file.
- **Operation**: Finds DOM element `#root` and renders `<App />` within `<React.StrictMode>`.

### `src/App.jsx`
- **Location**: [src/App.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/App.jsx)
- **Purpose**: The central coordinator and orchestrator of the entire application.
- **Key Responsibilities**:
  1. **Global State**: Holds the unified `db` state initialized from `load()` in [data.js](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/utils/data.js).
  2. **API Synchronization**: Runs `loadApiData()` to fetch live jobs and applications from MockAPI. Gracefully falls back to seed data if MockAPI is unconfigured or returns empty.
  3. **Hash Router**: Tracks `location.hash` and extracts the current route (`pg`) and route identifier (`id`).
  4. **Access Control**: Guards protected routes (`cdash`, `rdash`, `applicants`, `post`, `apply`, etc.). Redirects unauthenticated users to `<Auth mode="login" />`.
  5. **Prop Factory (`P`)**: Packages and passes down state modifiers (`up`), navigation handlers (`go`), toast dispatchers (`toast`), current user (`me`), and route IDs to views.
  6. **Layout Management**:
     - Global navigation bar with role-specific menu items and notification bell.
     - Mobile burger menu toggle.
     - Authenticated dashboard sidebar (`.side`) vs. public full-page view (`.wrap`).
     - Toast alerts overlay (`<ToastContainer />`).
     - Status banners alerting users if MockAPI is unconfigured or has connectivity issues.

### `src/index.css`
- **Location**: [src/index.css](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/index.css)
- **Purpose**: The single-source design system for the entire application.
- **Includes**:
  - CSS variables for colors (`--primary`, `--primary-light`, `--bg`, `--card`, `--text`, `--border`), spacing, typography, and shadows.
  - Flexbox and CSS Grid layout utility classes (`.row`, `.grid`, `.shell`, `.side`, `.main`).
  - Button styling variations (`.btn`, `.btn.o` outline, `.btn.or` orange, `.btn.d` danger).
  - Status badge colors matching ATS pipeline stages (`.st-applied`, `.st-interview`, etc.).
  - Modal overlay system, toast slide-in animations, responsive media queries, and mobile drawer styles.

---

## 6. Services Layer (`src/services/`)

### `src/services/api.js`
- **Location**: [src/services/api.js](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/services/api.js)
- **Purpose**: The REST client layer communicating with MockAPI.io endpoints.
- **Key Functions**:
  - `isApiConfigured()`: Validates that `VITE_MOCKAPI_URL` is set and non-empty.
  - `request(endpoint, options)`: Internal helper configuring headers (`Content-Type: application/json`), executing `fetch()`, parsing JSON, and returning friendly errors upon network or HTTP failure.
  - **Jobs API**:
    - `getJobs()`: `GET /jobs`
    - `getJobById(id)`: `GET /jobs/:id`
    - `createJob(jobData)`: `POST /jobs`
    - `updateJob(id, jobData)`: `PUT /jobs/:id`
    - `patchJob(id, partialData)`: `PATCH /jobs/:id`
    - `deleteJob(id)`: `DELETE /jobs/:id`
  - **Applications API**:
    - `getApplications()`: `GET /applications`
    - `getApplicationById(id)`: `GET /applications/:id`
    - `createApplication(appData)`: `POST /applications`
    - `updateApplication(id, appData)`: `PUT /applications/:id`
    - `patchApplication(id, partialData)`: `PATCH /applications/:id`
    - `deleteApplication(id)`: `DELETE /applications/:id`

---

## 7. Utilities & Data Store (`src/utils/`)

### `src/utils/data.js`
- **Location**: [src/utils/data.js](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/utils/data.js)
- **Purpose**: Application constants, mock data fixtures, factory helpers, and LocalStorage engine.
- **Key Components**:
  - `ST`: Array of application pipeline stages: `["Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"]`.
  - `today()`: Helper producing current date string formatted as `YYYY-MM-DD`.
  - `J(...)`: Factory helper generating standardized job objects with full defaults.
  - `seed`: Comprehensive mock database with:
    - 5 demo accounts (candidates: Shalini, Priya, Arun; recruiters: Rohit, Ananya).
    - 16 diverse job listings across Indian tech hubs (Bengaluru, Hyderabad, Chennai, Coimbatore, Mumbai, Pune, Remote).
    - 7 initial applications with realistic interview dates, cover letters, and statuses.
    - Saved bookmarks and default in-app notifications.
  - `load()`: Hydrates the app on initial launch from `localStorage.getItem("careerhub")`, gracefully falling back to `seed` if records are missing.
  - `saveLocal(state)`: Serializes user records, sessions, bookmarks, notifications, and contacts to `localStorage` while leaving API-managed entities (`jobs`, `apps`) independent.
  - `sal(j)`: Formats numeric salary ranges into Indian Rupee denomination: `₹{min}–{max} LPA`.

### `src/utils/email.js`
- **Location**: [src/utils/email.js](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/utils/email.js)
- **Purpose**: EmailJS service wrapper for automated candidate messaging.
- **Key Functions**:
  - `emailReady`: Boolean flag evaluating if EmailJS environment variables are configured.
  - `log(entry)`: Records each outbound email attempt (recipient, subject, timestamp, status) into `localStorage` ("careerhub_emails") for audit and debugging.
  - `sendEmail(params)`: Sends an email via `@emailjs/browser`. If EmailJS is not configured, logs a mock attempt and returns safely without throwing exceptions or breaking UI flows.

---

## 8. Reusable Components (`src/components/`)

### `JobCard.jsx`
- **Location**: [src/components/JobCard.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/components/JobCard.jsx)
- **Purpose**: Displays a job preview card used in job listings and search results.
- **Features**: Shows job title, company logo, location, mode (Remote/Hybrid/On-site), salary range tag, bookmark toggle button (saving/unsaving to `db.saved`), and quick-action buttons ("View Details", "Apply Now").

### `StatusBadge.jsx`
- **Location**: [src/components/StatusBadge.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/components/StatusBadge.jsx)
- **Purpose**: Renders a standardized colored pill badge representing application status (`Applied`, `Under Review`, `Shortlisted`, `Interview`, `Selected`, `Rejected`).

### `SummaryCard.jsx`
- **Location**: [src/components/SummaryCard.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/components/SummaryCard.jsx)
- **Purpose**: Dashboard metric widget displaying an icon, numeric counter, and title label (e.g. "Active Jobs: 16", "Pending Interviews: 3").

### `Modal.jsx`
- **Location**: [src/components/Modal.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/components/Modal.jsx)
- **Purpose**: Reusable dialog overlay with a frosted-glass backdrop, click-outside dismissal, header with close icon, and flexible children content.

### `Toast.jsx`
- **Location**: [src/components/Toast.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/components/Toast.jsx)
- **Purpose**: Floating toast notification system. Renders `<ToastContainer />` which animates alerts (success, info, warning, error) in the top-right corner with timed dismissal.

### `Notifications.jsx`
- **Location**: [src/components/Notifications.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/components/Notifications.jsx)
- **Purpose**: Notification bell widget and slide-over drawer in the navbar.
- **Features**: Displays unread notification count badge, lists user-specific notifications, marks individual alerts as read, supports clearing all alerts, and redirects to relevant internal links.

### `AppList.jsx`
- **Location**: [src/components/AppList.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/components/AppList.jsx)
- **Purpose**: Candidate's applications table/list view with status filters, interview date badges, and application withdrawal confirmation modal.

### `Upcoming.jsx`
- **Location**: [src/components/Upcoming.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/components/Upcoming.jsx)
- **Purpose**: Widget displaying upcoming scheduled candidate interviews (date, time, platform link, candidate name).

### `IV.jsx`
- **Location**: [src/components/IV.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/components/IV.jsx)
- **Purpose**: Interview scheduling dialog component. Enables recruiters to select date, time, platform (Google Meet, Zoom, On-site), meeting link, and preparation notes.

### `Logo.jsx`
- **Location**: [src/components/Logo.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/components/Logo.jsx)
- **Purpose**: Renders the CareerHub brand icon and stylized company badges with automatic color generation based on company name.

### `Footer.jsx`
- **Location**: [src/components/Footer.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/components/Footer.jsx)
- **Purpose**: Global footer rendering platform navigation, category links, copyright information, and social links.

---

## 9. Application Pages (`src/pages/`)

### Public & Shared Pages

#### `Home.jsx`
- **Location**: [src/pages/Home.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/Home.jsx)
- **Purpose**: Main landing page.
- **Key Sections**:
  - Hero banner with headline and instant keyword/location search bar.
  - Live statistics counter (total jobs, verified employers, active candidates).
  - Category browse pills (Frontend, Backend, UI/UX, Data, Cloud).
  - Featured recent jobs grid using `<JobCard />`.
  - Recruiter call-to-action banner ("Hiring? Post a job today").
  - Testimonial highlights.

#### `Jobs.jsx`
- **Location**: [src/pages/Jobs.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/Jobs.jsx)
- **Purpose**: Full-featured job discovery and search engine.
- **Capabilities**:
  - Full-text search querying job title, company name, skills, and categories.
  - Multi-facet filters: Location, Job Type (Full Time, Contract, Internship), Workplace Mode (Remote, Hybrid, On-site), Experience Level, Company.
  - Interactive minimum salary slider (0 to 35+ LPA).
  - Sorting options: Latest posted, Salary: High to Low, Salary: Low to High, Title A-Z.
  - Pagination (6 jobs per page).

#### `Detail.jsx`
- **Location**: [src/pages/Detail.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/Detail.jsx)
- **Purpose**: Comprehensive single job posting view (`#/job/:id`).
- **Features**:
  - Full role overview (Salary, Department, Experience, Mode, Location, Application Deadline).
  - Formatted sections for Job Description, Core Responsibilities, Qualifications, Preferred Skills, and Employee Benefits.
  - Action buttons: "Apply for this Role" (navigates to `#/apply/:id`), "Save Job", and company profile links.

#### `Companies.jsx`
- **Location**: [src/pages/Companies.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/Companies.jsx)
- **Purpose**: Hiring partners directory.
- **Functionality**: Dynamically groups all active jobs in `db.jobs` by company name and displays company cards showing open headcount, primary location, and links to filtered job lists.

#### `CompanyProfile.jsx`
- **Location**: [src/pages/CompanyProfile.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/CompanyProfile.jsx)
- **Purpose**: Single employer profile page (`#/company/:name`).
- **Features**: Displays company background, culture description, locations, and list of all active openings currently posted by that organization.

#### `About.jsx`
- **Location**: [src/pages/About.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/About.jsx)
- **Purpose**: Informational page detailing the CareerHub mission, vision, and core team.

#### `Contact.jsx`
- **Location**: [src/pages/Contact.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/Contact.jsx)
- **Purpose**: User support and inquiries page.
- **Features**: Contact information cards (Email, Office, Phone) and interactive contact form with field validation that logs submitted queries to `db.contacts`.

---

### Candidate Pages

#### `CDash.jsx`
- **Location**: [src/pages/CDash.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/CDash.jsx)
- **Purpose**: Candidate Dashboard (`#/cdash`).
- **Features**:
  - Top summary cards: Total Applied, In Review, Shortlisted/Interview, Saved Jobs.
  - Upcoming scheduled interviews list with video meeting links.
  - Recent applications list with live status tracking.
  - Quick recommendations matching the candidate's declared profile skills.

#### `Apply.jsx`
- **Location**: [src/pages/Apply.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/Apply.jsx)
- **Purpose**: Multi-step job application form (`#/apply/:id`).
- **Workflow**:
  1. Auto-populates candidate data from profile (Name, Email, Phone, Location, Notice Period, Resume link, Experience).
  2. Step 1: Personal & contact info, resume URL/file attachment, terms acceptance.
  3. Step 2: Role-specific questionnaire, cover letter, salary expectations.
  4. Duplicate check: Prevents applying to the same job twice.
  5. Submission: Submits application payload to MockAPI via `createApplication()`, creates in-app notifications for candidate and recruiter, and sends confirmation emails via `sendEmail()`.

#### `Apps.jsx`
- **Location**: [src/pages/Apps.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/Apps.jsx)
- **Purpose**: "My Applications" view (`#/apps`).
- **Features**: Renders candidate's full application history with status filter tabs, detailed interview information, and withdrawal capabilities.

#### `Saved.jsx`
- **Location**: [src/pages/Saved.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/Saved.jsx)
- **Purpose**: Saved Jobs bookmarks page (`#/saved`).
- **Features**: Filters `db.jobs` against `db.saved` IDs, allowing candidates to review and quickly apply to bookmarked positions or remove them from their saved list.

#### `Profile.jsx`
- **Location**: [src/pages/Profile.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/Profile.jsx)
- **Purpose**: Candidate profile editor (`#/profile`).
- **Capabilities**: Edits contact phone, current location, notice period, expected salary, experience summary, key skills list, education history, work experience, and resume URL/PDF file data. Saves directly into `me.profile` and persists locally.

---

### Recruiter Pages

#### `RDash.jsx`
- **Location**: [src/pages/RDash.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/RDash.jsx)
- **Purpose**: Recruiter Dashboard (`#/rdash`).
- **Features**:
  - Metrics cards: Total Active Jobs, Total Applicants Received, Interviews Scheduled, Selected/Hired candidates.
  - Pipeline breakdown bar chart showing candidate distribution across stages.
  - Upcoming scheduled interviews with quick actions.
  - Quick shortcuts: "Post New Job", "Manage Jobs", "Review All Applicants".

#### `Post.jsx`
- **Location**: [src/pages/Post.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/Post.jsx)
- **Purpose**: Job requisition creation and editing form (`#/post` or `#/post/:id`).
- **Fields**: Job title, department, company name, location, job type, mode, min/max salary, experience required, application deadline, skills tags, detailed description, key responsibilities, qualifications, and benefits.
- **Backend Action**: Calls `createJob()` or `updateJob()` in [api.js](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/services/api.js) and creates a success toast alert.

#### `MyJobs.jsx`
- **Location**: [src/pages/MyJobs.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/MyJobs.jsx)
- **Purpose**: Recruiter's job management list (`#/myjobs`).
- **Features**:
  - Lists all jobs posted by the logged-in recruiter.
  - Displays applicant count badge per job.
  - Actions: Edit job (`#/post/:id`), View candidates (`#/applicants/:id`), toggle status between Active and Closed, and Delete job (with confirmation modal and API deletion).

#### `Applicants.jsx`
- **Location**: [src/pages/Applicants.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/Applicants.jsx)
- **Purpose**: Full ATS (Applicant Tracking System) candidate pipeline (`#/applicants` or `#/applicants/:jobId`).
- **Features**:
  - Dual view modes: **Pipeline Board** (kanban-style columns per status) and **Table View**.
  - Search applicants by name, email, or skills.
  - Filter applicants by specific job requisition.
  - Candidate modal inspector: View full contact info, resume link, cover letter, experience, and recruiter notes.
  - Status transition dropdown: Changing candidate status sends `patchApplication()` to MockAPI and optionally triggers an automated email to the candidate via EmailJS.
  - Interview scheduler: Launches `<IV />` modal to set interview date, time, and meeting URL.
  - Export to CSV: Generates and downloads a clean `.csv` file containing filtered applicant data.

---

### Authentication & Policy

#### `Auth.jsx`
- **Location**: [src/pages/Auth.jsx](file:///c:/Users/shali/Downloads/careerhub-vite%20(1)/careerhub-vite/src/pages/Auth.jsx)
- **Purpose**: Unified Login & Registration portal (`#/login` and `#/register`).
- **Capabilities**:
  - Tab toggle between Login and Register.
  - Role selector (**Job Seeker** vs. **Employer / Recruiter**).
  - Streamlined input fields (Name, Email, Password, Confirm Password) with clean validation and error states.
  - "Forgot Password?" dialog providing temporary password recovery.

---

*Documentation generated for CareerHub.*
