import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { resumeAPI } from '../services/apiClient'

const sampleData = {
  personal: {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA'
  },
  summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, cloud technologies, and agile methodologies.',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      startDate: 'Jan 2022',
      endDate: 'Present',
      description: 'Led development of microservices architecture serving 1M+ users.'
    }
  ],
  projects: [{ name: 'E-commerce Platform', description: 'Full-stack solution with React.' }],
  education: [{ degree: 'B.S. Computer Science', school: 'University of California' }],
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS']
}

export function TemplatePreviewPage() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const [previewHtml, setPreviewHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tempResumeId, setTempResumeId] = useState<string>('')
  
  const iframeWrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    createTempResumeAndRender()
    return () => {
      if (tempResumeId) resumeAPI.delete(tempResumeId).catch(() => {})
    }
  }, [templateId])

  // Responsive Scaling Logic
  useEffect(() => {
    const calculateScale = () => {
      if (iframeWrapperRef.current) {
        // Measure the gray container's current width
        const containerWidth = iframeWrapperRef.current.offsetWidth
        // Standard A4 width in pixels is ~794px. 
        // We scale the 794px resume to fit the current container width.
        const newScale = containerWidth / 794 
        setScale(newScale)
      }
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [previewHtml])

  const createTempResumeAndRender = async () => {
    try {
      setLoading(true)
      const tempResume = await resumeAPI.create({
        title: `Preview - ${templateId}`,
        data: sampleData
      })
      setTempResumeId(tempResume.data.id)
      const response = await resumeAPI.preview(tempResume.data.id, templateId)
      setPreviewHtml(response.data)
    } catch (err: any) {
      setError('Failed to load template preview')
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = async () => {
    try {
      if (!localStorage.getItem('token')) {
        navigate(`/login?next=/templates/preview/${templateId}`)
        return
      }
      const resume = await resumeAPI.create({
        title: `${templateId} Resume`,
        template: templateId
      })
      navigate(`/editor/${resume.data.id}`)
    } catch (error: any) {
      setError('Failed to create resume')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b">
        <button onClick={() => navigate('/templates')} className="text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors">
          <span className="text-xl">←</span> Back to Templates
        </button>
        <button onClick={handleUseTemplate} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold shadow-md transition-all">
          Use This Template
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border overflow-hidden">
          <div className="p-8 border-b bg-gray-50/50">
            <h1 className="text-3xl font-extrabold text-gray-900 capitalize text-center">{templateId} Layout</h1>
          </div>

          <div className="p-6 sm:p-12 flex justify-center bg-white">
            {/* 1. The Aspect Ratio Container (The Gray Box) */}
            <div 
              ref={iframeWrapperRef}
              className="relative w-full max-w-[700px] bg-slate-200 rounded-xl overflow-hidden shadow-inner border-4 border-white"
              style={{ 
                aspectRatio: '210 / 297', // Forces A4 proportions for the box itself
              }}
            >
              {previewHtml ? (
                /* 2. The Scaled Resume Content */
                <div 
                  style={{
                    width: '794px', // Standard A4 width
                    height: '1123px', // Standard A4 height
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                >
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                    title="Template Preview"
                    scrolling="no"
                  />
                  {/* Invisible Overlay to prevent iframe interactions during preview */}
                  <div className="absolute inset-0 z-10" />
                </div>
              ) : null}
            </div>
          </div>

          <div className="p-8 border-t bg-gray-50 flex justify-center gap-4">
             <button onClick={() => navigate('/templates')} className="px-8 py-3 bg-white border rounded-xl font-medium hover:bg-gray-100 transition-colors">
              Explore More
            </button>
            <button onClick={handleUseTemplate} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all">
              Choose This Template
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}