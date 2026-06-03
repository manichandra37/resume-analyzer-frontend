# Resume Analyzer — Frontend

A modern React-based frontend for the AI Resume Analyzer application. Upload your resume, analyze it against job descriptions using AI, and download an improved version.

![React](https://img.shields.io/badge/React-19.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3-06B6D4)
![Parcel](https://img.shields.io/badge/Parcel-2.x-orange)

---

## Features

- **Authentication** — Login and Register with JWT-based authentication
- **Resume Upload** — Upload resumes (PDF/DOCX) for AI analysis
- **AI-Powered Analysis** — Analyze resumes against job descriptions with score, matched skills, missed skills, and summary
- **Template Selection** — Choose between Service, Product, and Hybrid resume templates
- **Download Improved Resume** — Download an AI-enhanced version of your resume as DOCX
- **Route Protection** — Protected pages redirect unauthenticated users to login
- **Loading Jokes** — Developer jokes displayed while the AI analyzes your resume

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Parcel | Build tool and dev server |
| Tailwind CSS 4 | Utility-first styling |
| Axios | HTTP client for API calls |
| React Router DOM 6 | Client-side routing |

---

## Pages

| Page | Route | Description |
|---|---|---|
| Login / Register | `/` | Authentication with toggle between login and register forms |
| Upload Resume | `/upload` | Upload resume files to the backend |
| Dashboard | `/analysis` | Analyze resumes, view reports, download improved resume |

---

## Project Structure

```
src/
├── assets/             # Static assets (logo, images)
├── components/         # Reusable components
│   ├── Navbar.jsx      # Navigation bar with links and logout
│   └── ProtectedRoute.jsx  # Route guard for authenticated pages
├── context/            # Shared state (future use)
├── pages/              # Page components
│   ├── LoginPage.jsx   # Login and Register forms
│   ├── UploadPage.jsx  # Resume file upload
│   ├── DashboardPage.jsx  # Analysis form, results, and download
│   └── HomePage        # Analysis Screen
├── services/
│   └── api.js          # Axios instance and API functions
├── App.jsx             # Root component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles and Tailwind import
```

---

## Prerequisites

- Node.js v18+
- Backend server running at `http://localhost:8080` ([Backend Repo](https://github.com/manichandra37/resume-analyzer))

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/manichandra37/resume-analyzer-frontend.git
   cd resume-analyzer-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:1234
   ```

---

## API Endpoints Used

### Authentication (No token required)
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password, phoneNumber }` |
| POST | `/api/auth/login` | `{ email, password }` |

### Resume (Token required)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resumes/upload` | Multipart file upload |
| GET | `/api/resumes/My-resumes` | Get logged-in user's resumes |

### Analysis (Token required)
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/resumes/{resumeId}` | `{ jobDescription, templateType }` |

### Download (Token required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/resumes/generate/{reportId}` | Downloads improved resume as DOCX |

---

## Design

The app uses a **Garden Bloom** theme with:
- Warm cream background (`#faf6f1`)
- Dark forest green accents (`#3d5a3e`)
- Playfair Display serif font for headings
- Inter sans-serif font for body text
- Rounded cards with subtle shadows
- Green/red skill badges for matched/missed skills

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start development server on port 1234 |
| `npm run build` | Build for production |

---

## Backend

This frontend connects to the Resume Analyzer Spring Boot backend.

- **Backend Repo:** [github.com/manichandra37/resume-analyzer](https://github.com/manichandra37/resume-analyzer)
- **Tech:** Spring Boot 4.0.4, Java 21, PostgreSQL, Claude AI (Haiku), JWT Auth

---

## Author

**Manichandra Maddi**

- GitHub: [@manichandra37](https://github.com/manichandra37)
