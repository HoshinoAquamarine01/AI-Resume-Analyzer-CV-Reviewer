# Project Changelog & System Updates

This document tracks all system architecture updates, feature additions, bug fixes, and design revisions for **CVPulse (AI Resume Analyzer)**.

---

## 🚀 [Latest Updates] - 2026-10-22

### 🔑 Google OAuth Authentication Architecture
- **Backend NestJS Integration**:
  - Implemented `GET /api/auth/google` in `AuthController` to initiate standard Google OAuth 2.0 consent flow.
  - Implemented `GET /api/auth/google/callback` in `AuthController`:
    - Exchanges Google authorization `code` for access tokens using Google OAuth token endpoints.
    - Fetches profile info (`sub` / `googleId`, `email`, `name`, `picture`) via Google UserInfo API.
    - Finds or creates user record in MongoDB, sets HTTP-only `refreshToken` cookie, and issues application JWT.
    - Gracefully handles missing credentials or cancelled consent by redirecting to frontend with clear error messages instead of throwing unhandled 500 server crashes.
  - Updated [`backend/src/models/User.ts`](file:///d:/AI%20resume%20analyze/backend/src/models/User.ts):
    - Made `password` optional for social logins.
    - Added `googleId` and `authProvider` (`'local' | 'google' | 'github'`) fields.
    - Guarded password hashing pre-save hooks and `comparePassword` checks against missing passwords.
  - Updated [`backend/.env.example`](file:///d:/AI%20resume%20analyze/backend/.env.example) with `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL`.

- **Frontend React Integration**:
  - Created [`frontend/src/pages/AuthCallbackPage.tsx`](file:///d:/AI%20resume%20analyze/frontend/src/pages/AuthCallbackPage.tsx):
    - Handles `/auth/callback?token=...` redirect, stores token in `localStorage`, fetches user profile, displays a success toast, and transitions to `/dashboard`.
  - Registered `/auth/callback` route in [`frontend/src/App.tsx`](file:///d:/AI%20resume%20analyze/frontend/src/App.tsx).
  - Updated [`frontend/src/hooks/useLoginForm.ts`](file:///d:/AI%20resume%20analyze/frontend/src/hooks/useLoginForm.ts) to display server redirect errors in the alert banner.
  - Removed obsolete orphan Next.js `frontend/src/middleware.ts` to ensure clean TypeScript compilation in Vite.

---

### 🎨 Branding & Browser Tab Identity
- **Custom CVPulse Favicon & App Icons**:
  - Replaced the default browser globe placeholder icon with the official CVPulse brand symbol.
  - Added vector `favicon.svg` with dark squircle container, emerald gradient border, and ATS pulse/heartbeat waveform.
  - Generated multi-resolution `favicon.ico` (16x16, 32x32, 48x48) for legacy and desktop browser support.
  - Generated high-DPI raster assets: `favicon-16x16.png`, `favicon-32x32.png`, and `apple-touch-icon.png` (180x180) for mobile shortcuts and bookmarks.
- **HTML Meta & Head Configuration**:
  - Updated [`frontend/index.html`](file:///d:/AI%20resume%20analyze/frontend/index.html) to link SVG, PNG, and ICO favicon resources with proper MIME types.

---

### 🖥️ Frontend & UI/UX Redesign
- **Landing Page Modernization**:
  - Redesigned Hero section with dynamic value propositions, live ATS score preview badges, and social proof counters.
  - Revamped Navbar with scroll-detection, transparent-to-solid backdrop blur, responsive mobile navigation drawer, and CVPulse branding.
  - Added interactive feature cards, step-by-step workflow visualizer (`HowItWorks`), and recruiter statistics showcase.
- **Administrative & Analytics Dashboards**:
  - Added `TransactionsTable` with real-time status filtering, currency formatting, and pagination.
  - Added `SubscriptionPlanBreakdown` visual charts illustrating tier distribution (Free, Pro, Enterprise).
  - Enhanced User Detail views with `UserActivityTimeline` and `UserResumesList`.
- **Application Pages & Modals**:
  - Built comprehensive `TermsPage`, `PrivacyPage`, `FaqPage`, `ContactPage`, and `SettingsPage`.
  - Added `CoverLetterHistoryModal` with quick preview and export actions.
  - Implemented secure `PasswordInput` toggle and `SocialLogin` integrations.

---

### ⚙️ Backend Logic & Infrastructure
- **Document Generator Engine (PDF & DOCX)**:
  - Created [`backend/src/common/helpers/document-generator.helper.ts`](file:///d:/AI%20resume%20analyze/backend/src/common/helpers/document-generator.helper.ts).
  - Integrated `pdfkit` for in-memory, high-performance PDF rendering (A4 format, custom margins, color palette, auto-pagination, and footer page numbering).
  - Integrated `docx` for generating formatted Word documents with native heading levels and bullet lists.
  - Updated `ResumeService` and `CoverLetterService` to support both PDF and DOCX exports.
- **Payments & Billing**:
  - Stabilized payment gateway workflows and callback verification handlers (`PaymentCallbackPage`).
  - Handled status transitions for user subscriptions.
- **Redis & Database Stability**:
  - Added `ioredis` driver with safe connection fallback to prevent application crashes when cache stores are unreachable.
  - Fixed TypeScript typing discrepancies across services and models.
