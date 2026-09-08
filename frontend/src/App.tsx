import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ResumeListPage = lazy(() => import("./pages/ResumeListPage"));
const ResumeDetailPage = lazy(() => import("./pages/ResumeDetailPage"));
const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const CoverLetterPage = lazy(() => import("./pages/CoverLetterPage"));
const AtsMatchPage = lazy(() => import("./pages/AtsMatchPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const PaymentCallbackPage = lazy(() => import("./pages/PaymentCallbackPage"));
const InterviewPage = lazy(() => import("./pages/InterviewPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

export function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-blue-400">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resumes"
              element={
                <ProtectedRoute>
                  <ResumeListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/templates"
              element={
                <ProtectedRoute>
                  <TemplatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resumes/:id"
              element={
                <ProtectedRoute>
                  <ResumeDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ats-match"
              element={
                <ProtectedRoute>
                  <AtsMatchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cover-letter"
              element={
                <ProtectedRoute>
                  <CoverLetterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <InterviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route path="/pricing" element={<PricingPage />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/payment/callback" element={<PaymentCallbackPage />} />
            <Route path="/payment-success" element={<PaymentCallbackPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
