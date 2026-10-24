# 💼 CareerHub

> A modern, full-featured **Job Portal & Applicant Tracking System (ATS)** built with React + Vite.  
> Designed for both **job seekers** and **recruiters** — with real-time pipeline tracking, email notifications, and a clean glassmorphism UI.

---

## ✨ Features

### 👤 For Job Seekers (Candidates)
- Browse, search & filter jobs by title, skill, company, location, type, and mode
- 3-step application form with **auto-fill from saved profile**
- Real-time application tracking: Applied → Shortlisted → Interview → Selected
- Save / bookmark jobs for later
- Full profile editor with resume upload (PDF/DOC, max 300KB)
- In-app notification bell for all status updates

### 🏢 For Recruiters
- Post, edit, close, and delete job listings
- **Kanban pipeline board** + Table view for applicant management
- Advance candidate stages with one click
- Schedule interviews (date, time, mode)
- Internal recruiter notes per applicant
- Export applicants to CSV
- Automated email alerts on every stage change

### 🔒 General
- Email + password auth with role selection (Candidate / Recruiter)
- Forgot password via temporary password (EmailJS)
- Full form validation across every screen (phone, email, name, URL, salary)
- Works completely offline — no backend required (falls back to localStorage + seed data)
- Responsive design — mobile, tablet & desktop

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Build Tool | Vite 5 |
| Routing | Hash-based client router |
| Styling | CSS |
| State / Persistence | React `useState` + `localStorage` |
| Backend (optional) | [MockAPI.io](https://mockapi.io) |
| Email (optional) | [EmailJS](https://emailjs.com) |
| Font | Inter via Google Fonts |

---

## 📂 Project Structure

```
careerhub-vite/
├── scripts/
│   └── migrate.js          # Seeds demo jobs to MockAPI
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AppList.jsx
│   │   ├── Footer.jsx
│   │   ├── IV.jsx          # Interview scheduler
│   │   ├── JobCard.jsx
│   │   ├── Modal.jsx
│   │   ├── Notifications.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── SummaryCard.jsx
│   │   ├── Toast.jsx
│   │   └── Upcoming.jsx
│   ├── pages/              # Route-level page components
│   │   ├── About.jsx
│   │   ├── Applicants.jsx  # Recruiter ATS (Kanban + Table)
│   │   ├── Apply.jsx       # Candidate 3-step application form
│   │   ├── Apps.jsx        # My Applications
│   │   ├── Auth.jsx        # Login / Register
│   │   ├── CDash.jsx       # Candidate Dashboard
│   │   ├── Companies.jsx
│   │   ├── Contact.jsx
│   │   ├── Detail.jsx
│   │   ├── Home.jsx
│   │   ├── Jobs.jsx
│   │   ├── MyJobs.jsx      # Recruiter job management
│   │   ├── Post.jsx        # Post / Edit job
│   │   ├── Profile.jsx
│   │   ├── RDash.jsx       # Recruiter Dashboard
│   │   └── Saved.jsx
│   ├── services/
│   │   └── api.js          # MockAPI CRUD service
│   ├── utils/
│   │   ├── data.js         # Seed data, localStorage helpers
│   │   ├── email.js        # EmailJS wrapper
│   │   └── validate.js     # Shared form validation rules
│   ├── App.jsx             # Root component + hash router
│   ├── index.css           # Global styles + design tokens
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
```

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/careerhub.git
cd careerhub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Optional: MockAPI backend (https://mockapi.io)
VITE_MOCKAPI_URL=https://YOUR_PROJECT_ID.mockapi.io

# Optional: EmailJS (https://emailjs.com)
VITE_EMAILJS_SERVICE=your_service_id
VITE_EMAILJS_TEMPLATE=your_template_id
VITE_EMAILJS_KEY=your_public_key

# Optional: Contact form recipient
VITE_CONTACT_EMAIL=you@example.com
```

> All variables are **optional**. The app works fully without a backend using built-in seed data.

### 4. Start development server

```bash
npm run dev
```


### 5. (Optional) Seed MockAPI with demo jobs

```bash
npm run migrate
```

---
