# Changelog & Recent Architecture Updates

This document details all recent modifications across the frontend design system, dashboard components, backend integration, and Vercel multi-service deployment setup.

---

## 1. Frontend Redesign (Eliminating Generic "AI Clichés")

Guided by the design principles, tokens, and UX patterns in `.agents/skills` (`ui-ux-pro-max`, `design-system`, `brand`, and `ui-styling`), the frontend was redesigned to eliminate the look of generic AI templates and elevate the platform into a high-trust, executive SaaS product.

### Design System & Visual Aesthetics
- **Palette Overhaul**: Replaced pitch-black backgrounds and 500px glowing neon blobs (`glow-effect blur-[100px]`) with a sophisticated Slate/Navy dark palette (`#090d16` canvas, `#0d1322` card surface) and crisp 1px borders (`#1e293b`).
- **Accent Color Shift**: Standardized on high-trust **Emerald Green** (`#10b981` / `#059669`) for ATS pass indicators and career success metrics, paired with **Royal Blue** (`#2563eb`). Removed tacky cyan-to-purple rainbow gradients.
- **Typography**: Integrated **Plus Jakarta Sans** via Google Fonts across [index.html](file:///d:/AI%20resume%20analyze/frontend/index.html) and [tailwind.config.js](file:///d:/AI%20resume%20analyze/frontend/tailwind.config.js), replacing default sans-serif fonts with modern, crisp letterforms.
- **Tokens & CSS Utilities**: Added `.saas-card`, `.saas-card-interactive`, `.bento-pattern-bg`, and `.saas-highlight-emerald` utility classes in [index.css](file:///d:/AI%20resume%20analyze/frontend/src/index.css).

### Component Modernization
- **[Hero.tsx](file:///d:/AI%20resume%20analyze/frontend/src/components/landing/Hero.tsx)**:
  - Removed floating neon radial gradients.
  - Added enterprise ATS compatibility pill (`Taleo, Greenhouse & Workday Compatible`).
  - Added social proof strip featuring target enterprise employers (Google, Microsoft, Amazon, Shopee, Grab).
  - Built a tangible candidate audit preview container featuring ATS pass rate (`94.8%`), parse speed, and Google XYZ action metrics.
- **[Features.tsx](file:///d:/AI%20resume%20analyze/frontend/src/components/landing/Features.tsx)**:
  - Restructured into an Apple/Linear-inspired **Bento Box Grid** with varied card ratios (2x1 and 1x1).
  - Integrated interactive visual widgets:
    - Multi-ATS Compatibility Scanner with live parser diagnostics.
    - Line-by-Line Impact Formula (`Accomplished [X] as measured by [Y], by doing [Z]`).
    - Job Description Gap Radar with matched vs. missing skill tags.
    - ATS Formatting & Layout Inspector.
    - STAR Interview Simulation question cards.
- **[AiAnalysisPreview.tsx](file:///d:/AI%20resume%20analyze/frontend/src/components/landing/AiAnalysisPreview.tsx)**:
  - Re-engineered into a recruiter-grade audit demo with segmented controls for:
    1. *ATS Diagnostic Breakdown* (Overall score 94, category bars).
    2. *Before vs. After Bullet Rewriter* (Weak 3.5/10 duty statement vs. 9.7/10 quantified achievement with recruiter rationale).
    3. *Target Keyword Gap Matrix* (Identified tech stack gaps against vacancy requirements).
- **[HowItWorks.tsx](file:///d:/AI%20resume%20analyze/frontend/src/components/landing/HowItWorks.tsx)**:
  - Replaced vague AI buzzwords with a clear 3-step candidate acceleration journey (Upload -> Deep Diagnostic -> 1-Click Polish & Apply).
- **[CtaSection.tsx](file:///d:/AI%20resume%20analyze/frontend/src/components/landing/CtaSection.tsx) & [Footer.tsx](file:///d:/AI%20resume%20analyze/frontend/src/components/landing/Footer.tsx)**:
  - Cleaned up borders, replaced animated server terminal status badges with clean recruiter-grade indicators, and added structured navigation links.
- **[PricingPage.tsx](file:///d:/AI%20resume%20analyze/frontend/src/pages/PricingPage.tsx)**:
  - Updated background to `#090d16` and hero heading to `.saas-highlight-emerald` for visual consistency.

### Brand Unification
- Unified product naming to **CVPulse** (*ATS Resume Intelligence & Career Optimization*) across Landing, Dashboard, Sidebar, Navbar, and Footer (resolving previous inconsistencies between `ResumAI PRO`, `CVPulse`, and `ResumeIQ-AI`).

---

## 2. Dashboard & Layout Enhancements

- **[Sidebar.tsx](file:///d:/AI%20resume%20analyze/frontend/src/components/layout/Sidebar.tsx)**:
  - Updated logo to CVPulse emblem.
  - Cleaned up active navigation states with subtle elevation.
  - Simplified navigation label from *"AI Interview Prep"* to *"Interview Prep"*.
- **[DashboardHeader.tsx](file:///d:/AI%20resume%20analyze/frontend/src/components/dashboard/DashboardHeader.tsx)**:
  - Removed blurry 3xl backdrop orbs.
  - Replaced *"Realtime AI Connected"* with *"ATS Parser Ready"*.
  - Cleaned up greeting typography and action button styling.
- **[QuickActions.tsx](file:///d:/AI%20resume%20analyze/frontend/src/components/dashboard/QuickActions.tsx)**:
  - Replaced noisy multi-color gradient cards with cohesive `.saas-card-interactive` surfaces.
- **[StatCard.tsx](file:///d:/AI%20resume%20analyze/frontend/src/components/dashboard/StatCard.tsx) & [UpgradeBanner.tsx](file:///d:/AI%20resume%20analyze/frontend/src/components/dashboard/UpgradeBanner.tsx)**:
  - Standardized card backgrounds and updated copy to reflect CVPulse Pro benefits.

---

## 3. Vercel Multi-Service Deployment Setup

Configured the repository to deploy as a unified multi-service project on Vercel.

### Root [vercel.json](file:///d:/AI%20resume%20analyze/vercel.json)
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "services": {
    "backend": {
      "root": "backend",
      "framework": "nestjs",
      "bindings": [
        {
          "type": "service",
          "service": "frontend",
          "format": "url",
          "env": "FRONTEND_URL"
        }
      ]
    },
    "frontend": {
      "root": "frontend",
      "framework": "vite"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": {
        "service": "backend"
      }
    },
    {
      "source": "/(.*)",
      "destination": {
        "service": "frontend"
      }
    }
  ]
}
```

### Application Code Adjustments
1. **Frontend API Resolution**:
   - In [axiosInstance.ts](file:///d:/AI%20resume%20analyze/frontend/src/services/axiosInstance.ts): Configured `API_BASE_URL` to fallback to `""` in production (and `http://localhost:5000` in local development). All client requests (`/api/...`) resolve relatively to the current domain and are proxied to the `backend` service by Vercel's rewrite rule.
   - In [authService.ts](file:///d:/AI%20resume%20analyze/frontend/src/services/authService.ts): Updated `loginWithProvider` to use relative `/api/auth/${provider}` paths in production.
2. **Backend Service Binding Usage**:
   - In [payment.service.ts](file:///d:/AI%20resume%20analyze/backend/src/modules/payment/payment.service.ts): Updated payment return callback fallback to read `FRONTEND_URL` injected by Vercel's service binding.
   - In [main.ts](file:///d:/AI%20resume%20analyze/backend/src/main.ts): Added `/api/docs` in addition to `/docs` so Swagger documentation is directly accessible through the public `/api/(.*)` rewrite.

---

## 4. Verification

- **Backend Build**: `nest build` passed with exit code `0`.
- **Frontend Build**: `tsc && vite build` passed with exit code `0`.
- **Browser Subagent Test**: Visually verified responsive Bento Grid layout, interactive diagnostic tabs, typography, and contrast at `http://localhost:5173/`.
