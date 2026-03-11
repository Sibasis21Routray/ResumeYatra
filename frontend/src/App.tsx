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
import  PreviewPage  from './pages/PreviewPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { UserDashboardPage } from './pages/UserDashboardPage'
import { AboutPage } from './pages/AboutPage'
import { CareerCenterPage } from './pages/CareerCenterPage'
import { HowToWriteCVPage } from './pages/HowToWriteCVPage'
import LiveCareerPages from './pages/LiveCareerPages'
import GlobalLoader from './components/GlobalLoader'

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check token on mount
    const token = localStorage.getItem('token')
    setIsAuth(!!token)
    setLoading(false)

    // Listen for storage changes (for multiple tabs)
    const handleStorageChange = () => {
      const token = localStorage.getItem('token')
      setIsAuth(!!token)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
    <GlobalLoader/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/career-center" element={<CareerCenterPage />} />
        <Route path="/how-to-write-cv" element={<HowToWriteCVPage />} />
        <Route path="/login" element={<LoginPage onSuccess={() => setIsAuth(true)} />} />
        <Route path="/register" element={<RegisterPage onSuccess={() => setIsAuth(true)} />} />
        
        <Route path="/dashboard" element={isAuth ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={isAuth ? <LiveCareerPages /> : <Navigate to="/login" />} />
        <Route path="/templates" element={isAuth ? <TemplatesPage /> : <Navigate to="/login" />} />
        <Route path="/template-preview/:templateId" element={<TemplatePreviewPage />} />
        <Route path="/editor/:id" element={isAuth ? <EditorPage /> : <Navigate to="/login" />} />
        <Route path="/upload" element={isAuth ? <UploadPage /> : <Navigate to="/login" />} />
        <Route path="/preview/:id" element={isAuth ? <PreviewPage /> : <Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={isAuth ? <AdminDashboardPage /> : <Navigate to="/login" />} />
        <Route path="/admin/user/:userId" element={isAuth ? <UserDashboardPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
