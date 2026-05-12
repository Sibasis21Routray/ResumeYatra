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
  template?: string
  status?: string
}

interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt?: string
  _count?: {
    resumes: number
  }
}

export function UserDashboardPage() {
  const { userId } = useParams()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest')
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

  // Filter and sort resumes
  const filteredAndSortedResumes = React.useMemo(() => {
    let filtered = resumes.filter(resume => 
      (resume.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       resume.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
      case 'name':
        return filtered.sort((a, b) => (a.title || a.candidateName || '').localeCompare(b.title || b.candidateName || ''))
      default:
        return filtered
    }
  }, [resumes, searchTerm, sortBy])

  const handleBackToAdmin = () => {
    navigate('/admin-dashboard')
  }

  const handlePreviewResume = (resumeId: string) => {
    navigate(`/preview/${resumeId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-[#04477E]"></div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading user dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">The user you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={handleBackToAdmin}
            className="inline-flex items-center px-4 py-2 bg-[#04477E] text-white text-sm font-medium rounded-lg hover:bg-[#03315c] transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleBackToAdmin}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#04477E] dark:hover:text-[#04477E] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
              
              <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-[#04477E] to-[#0a5b9e] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </h1>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email} · Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* <ThemeToggle /> */}
              
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Title and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="bg-[#04477E] w-1.5 h-8 rounded-full"></span>
                Resumes by {user.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage and preview all resumes created by this user
              </p>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resumes..."
                  className="w-full sm:w-64 px-3 py-2 pl-9 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-[#04477E] focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-[#04477E] focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
              </select>
            </div>
          </div>

          {/* Search Results Summary */}
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Found {filteredAndSortedResumes.length} resume{filteredAndSortedResumes.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {filteredAndSortedResumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No resumes found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm 
                ? `No resumes matching "${searchTerm}"` 
                : `${user.name} hasn't created any resumes yet.`}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-[#04477E] hover:text-[#03315c] text-sm font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Resume Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedResumes.map((resume) => (
                <div
                  key={resume.id}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Card Header with Color Accent */}
                  <div className="h-2 bg-gradient-to-r from-[#04477E] to-[#0a5b9e]"></div>
                  
                  <div className="p-6">
                    {/* Resume Icon and Title */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <svg className="w-6 h-6 text-[#04477E] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      
                      {/* Status Badge (if available) */}
                      {resume.status && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          {resume.status}
                        </span>
                      )}
                    </div>

                    {/* Resume Details */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {resume.title || resume.candidateName || 'Untitled Resume'}
                    </h3>
                    
                    {resume.candidateName && resume.title !== resume.candidateName && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Candidate: {resume.candidateName}
                      </p>
                    )}

                    {/* Template Info (if available) */}
                    {resume.template && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                        Template: {resume.template}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Updated {new Date(resume.updatedAt).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreviewResume(resume.id)}
                        className="flex-1 bg-[#04477E] hover:bg-[#03315c] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview
                      </button>
                      
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Results Summary */}
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
              Showing {filteredAndSortedResumes.length} of {resumes.length} total resumes
            </div>
          </>
        )}
      </main>
    </div>
  )
}