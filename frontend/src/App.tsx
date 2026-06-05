import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { TemplatePreviewPage } from './pages/TemplatePreviewPage'
import { EditorPage } from './pages/EditorPage'
import { UploadPage } from './pages/UploadPage'
import PreviewPage from './pages/PreviewPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { UserDashboardPage } from './pages/UserDashboardPage'
import { AboutPage } from './pages/AboutPage'
import { CareerCenterPage } from './pages/CareerCenterPage'
import { HowToWriteCVPage } from './pages/HowToWriteCVPage'
import LiveCareerPages from './pages/LiveCareerPages'
import GlobalLoader from './components/GlobalLoader'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('user'))
  const [userRole, setUserRole] = useState(
    JSON.parse(localStorage.getItem('user') || '{}').role || 'guest'
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const syncAuth = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      setIsAuth(!!user.id)
      setUserRole(user.role || 'guest')
    }

    syncAuth()
    setLoading(false)

    window.addEventListener('storage', syncAuth)
    window.addEventListener('auth-change', syncAuth)

    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('auth-change', syncAuth)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  /* ================= ADMIN HARD LOCK ================= */
  if (isAuth && userRole === 'admin') {
    return (
      <BrowserRouter>
        <GlobalLoader />
        <Routes>
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/user/:userId" element={<UserDashboardPage />} />
          <Route path="*" element={<Navigate to="/admin-dashboard" />} />
        </Routes>
      </BrowserRouter>
    )
  }

  /* ================= NORMAL FLOW ================= */

  const AuthRedirect = ({ children }: { children: React.ReactNode }) =>
    isAuth ? <Navigate to="/dashboard" /> : <>{children}</>

  const AdminRoute = ({ children }: { children: React.ReactNode }) =>
    isAuth && userRole === 'admin'
      ? <>{children}</>
      : <Navigate to="/login" />

  const UserRoute = ({ children }: { children: React.ReactNode }) =>
    isAuth ? <>{children}</> : <Navigate to="/login" />

  return (
    <BrowserRouter>
      <GlobalLoader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/career-center" element={<CareerCenterPage />} />
        <Route path="/how-to-write-cv" element={<HowToWriteCVPage />} />

        {/* Guest only */}
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <LoginPage onSuccess={() => {}} />
            </AuthRedirect>
          }
        />

        <Route
          path="/register"
          element={
            <AuthRedirect>
              <RegisterPage onSuccess={() => {}} />
            </AuthRedirect>
          }
        />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* User routes */}
        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <DashboardPage />
            </UserRoute>
          }
        />

        <Route path="/onboarding" element={<LiveCareerPages />} />
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/preview/:id" element={<PreviewPage />} />

        <Route path="/templates" element={<TemplatesPage />} />
        <Route
          path="/template-preview/:templateId"
          element={<TemplatePreviewPage />}
        />

        {/* Admin routes (won't be reached due to hard lock above) */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/user/:userId"
          element={
            <AdminRoute>
              <UserDashboardPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}