import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ResumeListPage = lazy(() => import("./pages/ResumeListPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const CoverLetterPage = lazy(() => import("./pages/CoverLetterPage"));
const AtsMatchPage = lazy(() => import("./pages/AtsMatchPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const PaymentCallbackPage = lazy(() => import("./pages/PaymentCallbackPage"));

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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
