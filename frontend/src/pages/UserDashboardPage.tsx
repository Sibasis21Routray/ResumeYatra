import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminAPI } from '../services/apiClient'
import { ThemeToggle } from '../components/ThemeToggle'

interface Resume {
  id: string
  title: string
  candidateName: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  email: string
  name: string
  role: string
}

export function UserDashboardPage() {
  const { userId } = useParams()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const [resumesRes, usersRes] = await Promise.all([
        adminAPI.getUserResumes(userId),
        adminAPI.getUsers()
      ])
      setResumes(resumesRes.data)
      const userData = usersRes.data.find((u: User) => u.id === userId)
      setUser(userData || null)
    } catch (err: any) {
      setError('Failed to fetch user data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04477E] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading user dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">User not found</p>
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="mt-4 bg-[#04477E] text-white px-4 py-2 rounded-lg hover:bg-[#033b66]"
          >
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="text-gray-600 hover:text-[#04477E] dark:text-gray-300 dark:hover:text-[#04477E] font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Admin
            </button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div>
              <h1 className="text-2xl font-bold text-[#04477E] dark:text-white">{user.name}'s Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#04477E] dark:text-white flex items-center gap-2">
            📄 {user.name}'s Resumes
          </h2>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">No resumes yet for this user.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-[#04477E]"
              >
                <h3 className="text-lg font-semibold text-[#04477E] dark:text-white mb-2 group-hover:underline">
                  {resume.candidateName || resume.title || 'Untitled Resume'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/preview/${resume.id}`)}
                    className="flex-1 bg-[#DDA337] hover:bg-[#c4922e] text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    👁️ Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}