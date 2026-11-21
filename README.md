# CareerForge AI 🚀

> **AI-Powered Career & Placement Preparation Platform for Engineering Students**

CareerForge AI is a complete, production-ready full-stack application designed to help university students and job seekers optimize their resumes, diagnose critical technical skill gaps, and prepare for placement interviews against target job descriptions using **Google Gemini AI**.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start: Local Development](#-quick-start-local-development)
- [Quick Start: Docker & Docker Compose](#-quick-start-docker--docker-compose)
- [Configuring the Google Gemini API Key](#-configuring-the-google-gemini-api-key)
- [Pre-Seeded Demo Account](#-pre-seeded-demo-account)
- [API Reference](#-api-reference)
- [Automated Testing](#-automated-testing)
- [Security & Architecture Highlights](#-security--architecture-highlights)
- [Verification Checklist](#-verification-checklist)

---

## 🌟 Key Features

1. **Resume Processing & Parsing**:
   - Supports **PDF** and **DOCX** files with strict MIME type and file-size validation (up to 5MB).
   - Server-side text extraction without exposing files to public URLs.
   - Automatic preliminary technical skill extraction from parsed resume content.
   - Automatic cleanup of storage upon resume deletion.

2. **Server-Side Gemini AI Integration**:
   - Objective match score (0–100%) calculated by Google Gemini.
   - Matching skills vs. missing skill gaps diagnosis.
   - Actionable resume bullet improvement suggestions.
   - Tailored technical interview questions with expandable model concepts.
   - Behavioral interview questions structured with the STAR methodology.
   - Prioritized learning roadmaps with estimated completion timelines.

3. **Placement Dashboard & Aggregate Analytics**:
   - Real-time aggregated statistics from PostgreSQL (total reports, average score, resumes uploaded).
   - Frequency analysis of top missing skills across all target applications.
   - Visual match score distribution buckets.
   - Quick-action buttons to test realistic job description templates.

4. **Security & Data Ownership**:
   - JWT authentication with 7-day expiration.
   - Bcrypt password hashing (10 salt rounds).
   - Strict ownership authorization: users can never access or delete another user's resumes or reports.
   - Express rate limiting for APIs, authentication, and AI analyses.
   - Helmet HTTP security headers and restricted CORS origins.
   - Zod schema validation for all endpoints.

---

## 🛠 Architecture & Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS with custom brand colors & responsive UI
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT interceptors
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js & Express with TypeScript
- **ORM**: Prisma ORM with PostgreSQL database
- **Validation**: Zod
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Parsing**: `pdf-parse` (PDF) & `mammoth` (DOCX)
- **AI Engine**: Google Gemini API (`@google/generative-ai`)
- **Security**: Helmet, CORS, Express-Rate-Limit

---

## 📁 Project Structure

```
careerforgeaiproject/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (User, Resume, AnalysisReport)
│   │   └── seed.ts                # Database seed script with sample student data
│   ├── src/
│   │   ├── config/env.ts          # Validated environment configuration
│   │   ├── controllers/           # Express controllers (auth, resume, analysis, dashboard)
│   │   ├── middleware/            # Auth, validation, rate limiting, upload, error handler
│   │   ├── routes/                # Modular REST API routes
│   │   ├── schemas/               # Zod validation schemas
│   │   ├── services/              # Business logic (Gemini AI, Text extraction, Auth, Prisma)
│   │   ├── utils/                 # Logger and Prisma client singleton
│   │   ├── app.ts                 # Express application configuration
│   │   └── server.ts              # Server startup & graceful shutdown
│   ├── tests/                     # Automated Jest / Supertest test suites
│   ├── uploads/                   # Secure storage for uploaded resumes
│   ├── Dockerfile
│   ├── jest.config.js
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components, ScoreGauge, Navbar, Sidebar
│   │   ├── context/               # AuthContext state management
│   │   ├── pages/                 # All 10 application pages + 404
│   │   ├── services/              # Axios API service clients
│   │   ├── types/                 # Shared TypeScript interfaces
│   │   ├── App.tsx                # App routing & guards
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Tailwind styles
│   ├── Dockerfile
│   ├── nginx.conf                 # Production Nginx reverse proxy
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docker-compose.yml             # Multi-container orchestration (Postgres, Backend, Frontend)
├── .env.example                   # Global environment example
└── README.md
```

---

## 🚀 Quick Start: Local Development

### Prerequisites
- Node.js 18+ (tested on Node.js v24)
- PostgreSQL database (or Docker)
- npm or yarn

### 1. Database Setup
Ensure PostgreSQL is running. You can run PostgreSQL in Docker:
```bash
docker run -d --name careerforge-postgres -e POSTGRES_USER=careerforge -e POSTGRES_PASSWORD=careerforge_secret -e POSTGRES_DB=careerforge_db -p 5433:5432 postgres:16-alpine
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy environment file and configure values:
   ```bash
   cp .env.example .env
   ```
   *Edit `backend/.env` to configure your `DATABASE_URL` and `GEMINI_API_KEY`.*
3. Install dependencies:
   ```bash
   npm install
   ```
4. Push Prisma schema to the database:
   ```bash
   npx prisma db push
   ```
5. Seed demo student data:
   ```bash
   npx tsx prisma/seed.ts
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will be live at `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will be live at `http://localhost:5173`.*

---

## 🐳 Quick Start: Docker & Docker Compose

To launch the full production-style stack with a single command:

1. Copy the global environment configuration:
   ```bash
   cp .env.example .env
   ```
2. Add your Gemini API key inside `.env` (`GEMINI_API_KEY=your_key`).
3. Build and launch all containers:
   ```bash
   docker compose up --build -d
   ```
4. Run migrations and seed the database inside the backend container:
   ```bash
   docker compose exec backend npx prisma db push
   docker compose exec backend npx tsx prisma/seed.ts
   ```
5. Access the application:
   - **Frontend UI**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
   - **Health Endpoint**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Configuring the Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account and click **Create API Key**.
3. Copy the generated key.
4. Paste it in `backend/.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...your_key_here
   ```
5. Restart the backend (`npm run dev` or restart container).

> **Graceful Error Handling**: If no API key is configured or if an invalid key is supplied, CareerForge AI returns a clear, user-friendly 503 / 400 error message with instructions rather than crashing. Automated tests mock the Gemini service so you can run the full test suite without spending API quota.

---

## 👤 Pre-Seeded Demo Account

For rapid evaluation and grading, the database comes pre-seeded with realistic placement data:

- **Email**: `alex@careerforge.ai`
- **Password**: `Student123!`
- **Profile**: Final year Computer Science student targeting Full Stack Engineer roles.
- **Includes**: Pre-uploaded Software Engineer resume and a completed placement match analysis report against a real-world JD.
- *Tip*: On the Login page, click **"Fill Credentials"** for instant 1-click login!

---

## 📡 API Reference

### Health
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health status and database ping | No |

### Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new student account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | No |
| `GET` | `/api/auth/me` | Retrieve profile of authenticated user | Yes |
| `PUT` | `/api/auth/profile` | Update profile goals or change password | Yes |
| `POST` | `/api/auth/logout` | Invalidate client session | No |

### Resumes
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/resumes` | Upload and parse PDF or DOCX document | Yes |
| `GET` | `/api/resumes` | List all resumes belonging to user | Yes |
| `GET` | `/api/resumes/:id` | Get single resume and parsed text | Yes |
| `DELETE` | `/api/resumes/:id` | Delete resume and purge file from disk | Yes |

### Analyses & AI
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/analyses` | Submit resume & JD for Gemini AI evaluation | Yes |
| `GET` | `/api/analyses` | Retrieve all previous analysis reports | Yes |
| `GET` | `/api/analyses/:id` | Retrieve detailed individual report | Yes |
| `DELETE` | `/api/analyses/:id` | Delete an analysis report | Yes |

### Dashboard
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated placement readiness metrics | Yes |

---

## 🧪 Automated Testing

The backend includes a comprehensive automated test suite powered by Jest and Supertest. All external Gemini API calls are mocked in tests.

To run the automated test suite:
```bash
cd backend
npm test
```

### What is Tested:
- ✅ Health endpoint returns 200 OK and database connectivity status.
- ✅ 404 handler for undefined API routes.
- ✅ Registration with validation (rejects invalid email, short password, duplicate account).
- ✅ Login flow (valid credentials, incorrect password, non-existent user).
- ✅ Protected route rejection without token or with malformed token (401).
- ✅ Resume file type validation (rejects unsupported file formats like `.txt`).
- ✅ Resume parsing, storage, and skill extraction.
- ✅ Data ownership & Access Control (users cannot retrieve or delete another user's resume).
- ✅ Analysis input validation (Zod validation for job title and minimum JD length).
- ✅ Access control on AI analysis (rejects analyzing a resume owned by another user).
- ✅ Mocked Gemini AI analysis execution and structured JSON verification.
- ✅ Dashboard statistics aggregation (calculating accurate averages and missing skill counts).
- ✅ Report deletion by owner and rejection for unauthorized users.

---

## 🔒 Security & Architecture Highlights

- **Ownership Isolation**: Every resume and analysis query enforces `userId === req.user.id` at the database level.
- **Protected File Storage**: Resumes are never stored in a public HTTP static folder. Text is parsed on the server and physical files are deleted upon record removal.
- **Strict Input Validation**: Zod schemas validate every parameter, preventing injection attacks and malformed payloads.
- **Layered Rate Limiting**:
  - Global API: 300 requests / 15 min
  - Auth routes: 30 attempts / 15 min
  - AI analysis: 20 analyses / 10 min
- **Safe Error Handling**: Error stack traces are never sent to clients in production mode.

---

## ✅ Verification Checklist

| Requirement | Implementation Status | Verification Details |
|---|---|---|
| **Landing Page** | ✅ Completed | Hero, feature cards, workflow, live score gauge preview, CTAs. |
| **Authentication Flow** | ✅ Completed | Register, login, session expiry redirect, 1-click demo filler. |
| **Resume Upload & Parsing** | ✅ Completed | Drag & drop, PDF/DOCX text extraction, file type/size validation. |
| **Gemini AI Matching** | ✅ Completed | Server-side Gemini 1.5 model with structured JSON output. |
| **Interview Prep** | ✅ Completed | Technical questions with model answers + Behavioral STAR tips. |
| **Learning Roadmap** | ✅ Completed | Prioritized missing skills with estimated study timelines. |
| **Student Dashboard** | ✅ Completed | Aggregated KPI stats, score distribution, top skill gaps. |
| **Report History & Search** | ✅ Completed | Full list with search by title/company, score tier filters. |
| **Profile & Settings** | ✅ Completed | Target role/company goals, name update, secure password change. |
| **Automated Tests** | ✅ Completed | 31/31 unit & integration tests passing with 100% success rate. |
| **Docker Configuration** | ✅ Completed | Multi-stage Dockerfiles + docker-compose with Postgres healthcheck. |
| **Production Build** | ✅ Completed | Frontend Vite build and backend TypeScript compile with zero errors. |
