# ResumeIQ-AI

**ResumeIQ-AI** is an AI-powered resume and CV analysis platform designed to score resumes, optimize profiles for Applicant Tracking Systems (ATS), generate tailored cover letters, and provide interactive interview preparation. The project is structured as a monorepo containing `backend/` and `frontend/` workspaces.

---

## ✨ Features

- **📄 Resume Upload & Processing**: Parsing for PDF and DOCX files for fast, accurate text extraction.
- **🤖 AI Analysis & Scoring**: Evaluates resume quality, pinpoints strengths and weaknesses, and suggests actionable improvements.
- **🎯 ATS Optimization & Job Matching**: Optimizes resume content to match specific job descriptions and pass ATS filters.
- **✉️ Dynamic Cover Letter Generation**: Generates customized, context-aware cover letters based on user profiles and target roles.
- **🎙️ Interview Preparation**: Generates realistic interview questions and tailored practice scenarios.
- **🔐 User Management & Security**: Features JWT-based authentication, role-based access control (RBAC), and administrative management.
- **⚡ Real-Time & Background Processing**: Supports file uploads, PDF generation, background tasks, and real-time socket communications.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Routing & State**: React Router v6, Axios, React Hot Toast

### **Backend**
- **Framework**: NestJS / Express
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose, Redis
- **AI Integration**: Google Gemini AI (`@google/genai`)
- **File Parsing & Generation**: `pdf-parse`, `mammoth`, `docx`, `pdfkit`
- **Security & Auth**: `jsonwebtoken`, `bcrypt`, `helmet`, `cors`, `@nestjs/throttler`
- **Media & Communication**: Cloudinary, Nodemailer / Resend, Socket.IO

---

## 📁 Repository Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/        # Database connection, AI config, Cloudinary, JWT
│   │   ├── controllers/   # Request/response handlers
│   │   ├── jobs/          # Background cron jobs & tasks
│   │   ├── middlewares/   # Auth, rate limiting, and security middlewares
│   │   ├── models/        # MongoDB schemas and models
│   │   ├── modules/       # NestJS feature modules (Auth, User, Resume, etc.)
│   │   ├── prompts/       # AI prompt templates
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic & external service integrations
│   │   └── utils/         # Helper functions & utilities
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable React UI components
│   │   ├── pages/         # Application pages/views
│   │   ├── services/      # API communication services
│   │   └── types/         # TypeScript interfaces & types
└── shared/                # Shared constants and types
```

---

## 📋 Prerequisites

- **Node.js**: `v18+` or `v20+`
- **Package Manager**: `npm` or `pnpm`
- **MongoDB**: Active connection string (local or MongoDB Atlas)
- **API Keys**: Google Gemini API key, Cloudinary credentials, and SMTP settings.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HoshinoAquamarine01/AI-Resume-Analyzer-CV-Reviewer.git
cd AI-Resume-Analyzer-CV-Reviewer
```

### 2. Install Dependencies

Install dependencies across workspaces or individually:

```bash
# Install root dependencies
npm install

# Install Frontend dependencies
cd frontend
npm install

# Install Backend dependencies
cd ../backend
npm install
```

---

## 🔑 Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories.

### Backend `.env`

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key

# Optional Integrations
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🏃 Running the Application

Both backend and frontend should be started separately during local development.

### Start Backend

```bash
cd backend
npm run dev
```
*Backend server runs on port `5000` (or configured `PORT`).*

### Start Frontend

```bash
cd frontend
npm run dev
```
*Frontend dev server runs on `http://localhost:5173`.*

---

## 📜 Available Scripts

### Backend (`/backend`)
- `npm run dev`: Starts NestJS development server with watch mode (`nest start --watch`).
- `npm run build`: Compiles TypeScript down to production-ready JS in `dist/`.
- `npm start`: Runs the production server (`node dist/main.js`).

### Frontend (`/frontend`)
- `npm run dev`: Runs Vite dev server.
- `npm run build`: Builds optimized production static assets.
- `npm run preview`: Previews the production build locally.

---

## 📝 Important Notes

- **Database Connection**: The backend server starts after successfully establishing a MongoDB connection.
- **CORS Setup**: Configured to allow origins specified in `FRONTEND_URL` (defaulting to `http://localhost:5173`).
- **Security & Validation**: Production-grade request validation (`class-validator`), rate limiting, and security headers (`helmet`) are enabled.

---

## 📄 License

This project does not currently specify an open-source license.
