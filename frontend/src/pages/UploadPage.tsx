import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadForm } from '../components/resume/UploadForm'

export function UploadPage() {
  const navigate = useNavigate()

  const handleUploadSuccess = (resumeId: string) => {
    console.log('[UploadPage] Upload success, navigating to editor with ID:', resumeId)
    
    // Validate resumeId before navigation
    if (!resumeId || resumeId === 'undefined' || resumeId === 'null') {
      console.error('[UploadPage] Invalid resume ID received:', resumeId)
      alert('Invalid resume ID. Please try uploading again.')
      return
    }
    
    navigate(`/editor/${resumeId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <UploadForm onUploadSuccess={handleUploadSuccess} />
      </main>
    </div>
  )
}
