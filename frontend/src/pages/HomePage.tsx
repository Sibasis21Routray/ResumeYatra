import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/home/Navbar'
import Hero from '../components/home/Hero'
import Benefits from '../components/home/Benefits'
import Strap from '../components/home/Strap'
import { useTemplateStore } from '../stores/templateStore'
import { Loader2, FileText, ArrowRight, Shield, Users, Award } from 'lucide-react'
import { CheckCircleIcon } from 'lucide-react';
import motion from 'framer-motion'

export function HomePage() {
  const navigate = useNavigate()
  const { templates, fetchTemplates, loading } = useTemplateStore()
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [previewLoading, setPreviewLoading] = useState<Record<string, boolean>>({})
  const [scales, setScales] = useState<Record<string, number>>({})
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  // Fetch previews for templates
  useEffect(() => {
    if (templates.length === 0) return

    let cancelled = false

    async function fetchPreviews() {
      for (const t of templates.slice(0, 4)) {
        if (previews[t.id]) continue

        try {
          setPreviewLoading(prev => ({ ...prev, [t.id]: true }))
          const response = await fetch(`${import.meta.env.VITE_API_URL}/templates/preview/${t.id}`, {
            method: 'GET'
          })

          if (response.ok) {
            const data = await response.json()
            const htmlResponse = await fetch(data.url)
            const rawHtml = await htmlResponse.text()

            // Clean the HTML for preview with responsive sizing
            const cleanHtml = rawHtml + `
              <style>
                html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  background-color: #ffffff !important;
                  width: 100% !important;
                  height: 100% !important;
                  overflow: hidden !important;
                }
                .page, .resume-container, .A4 {
                  margin: 0 !important;
                  box-shadow: none !important;
                  width: 100% !important;
                  height: 100% !important;
                  max-width: 100% !important;
                  max-height: 100% !important;
                }
              </style>
            `

            if (cancelled) return
            setPreviews(prev => ({ ...prev, [t.id]: cleanHtml }))
          }
        } catch (err) {
          console.warn(`Template preview failed for ${t.id}:`, err)
        } finally {
          if (!cancelled) {
            setPreviewLoading(prev => ({ ...prev, [t.id]: false }))
          }
        }
      }
    }

    fetchPreviews()
    return () => { cancelled = true }
  }, [templates])

  // Calculate scale for each template preview based on container size
  const calculateScale = (templateId: string) => {
    const container = containerRefs.current[templateId]
    if (!container) return 0.22
    
    // A4 width in pixels at 96 DPI: 794px
    // Use container width to calculate scale (similar to TemplatesPage)
    return container.offsetWidth / 794
  }

  // Update scales when window resizes
  useEffect(() => {
    const updateScales = () => {
      const newScales: Record<string, number> = {}
      templates.slice(0, 4).forEach(t => {
        newScales[t.id] = calculateScale(t.id)
      })
      setScales(newScales)
    }

    updateScales()
    window.addEventListener('resize', updateScales)
    return () => window.removeEventListener('resize', updateScales)
  }, [templates])

  // Initial scale calculation after render
  useEffect(() => {
    if (templates.length > 0 && Object.keys(previews).length > 0) {
      const timeoutId = setTimeout(() => {
        const newScales: Record<string, number> = {}
        templates.slice(0, 4).forEach(t => {
          newScales[t.id] = calculateScale(t.id)
        })
        setScales(newScales)
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [previews, templates])

  // Get first 4 templates for preview
  const previewTemplates = templates.slice(0, 4)

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />
        <Hero />
   
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <section className="py-8 md:py-12">
          <Strap />
        </section> */}
        <section className="">
          <Benefits />
        </section>

        {/* Workflow Selection */}
        {/* <section className="py-8 md:py-12">
          <div className="grid md:grid-cols-1 gap-6 md:gap-8 max-w-2xl mx-auto"> */}
        {/* Start from Scratch */}
        {/* <div
              onClick={() => navigate('/templates')}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#DDA337] hover:scale-105"
            >
              <div className="text-center flex items-center justify-center flex-col">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-[#04477E]/20 rounded-full blur-xl group-hover:bg-[#04477E]/30 transition-all duration-300" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-[#04477E] to-[#0660a9] rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-[head] dark:text-white mb-4">Start from Scratch</h3>
                <p className="text-gray-600 font-[content] dark:text-gray-300 mb-6 max-w-md">
                  Create a brand new resume with our guided process. Choose from professional templates
                  and fill in your information step by step.
                </p>
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6 w-full max-w-sm mx-auto">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-[content]">Professional templates</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-[content]">Step-by-step guidance</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-[content]">AI-powered suggestions</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-[#04477E] to-[#0660a9] text-white font-[head] py-3.5 px-6 rounded-xl hover:from-[#033b66] hover:to-[#04477E] font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                  Create New Resume
                </button>
              </div>
            </div> */}
        {/* </div>
        </section> */}

        {/* Pricing Section */}
        <section className="">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-medium text-[#04477E] dark:text-blue-400 uppercase tracking-wider">
                Pricing
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-4">
                Simple, transparent plans
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Choose the plan that's right for your career goals
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-full">
                <div className="p-8 pb-0">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Basic
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    For quick, simple CVs
                  </p>

                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ₹29
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      one-time
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 p-8 flex flex-col flex-grow">
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Access to all templates
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Manual entry only
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Single download (PDF)
                      </span>
                    </li>
                  </ul>

                  <div className="mt-auto">
                    <button className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 group-hover:border-[#04477E] dark:group-hover:border-blue-500 group-hover:text-[#04477E] dark:group-hover:text-blue-400 transition-all duration-300">
                      Select Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* Starter Plan - Recommended */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-[#04477E] dark:border-blue-500 relative hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-[#04477E] dark:bg-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                    Most Popular
                  </span>
                </div>

                <div className="p-8 pt-10 pb-0">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    AI Starter
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Perfect for AI-assisted CVs
                  </p>

                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ₹49
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      one-time
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 p-8 flex flex-col flex-grow">
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Everything in Basic
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        One AI generation per section
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Skills & summaries generation
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-400">
                        No content regeneration
                      </span>
                    </li>
                  </ul>

                  <div className="mt-auto">
                    <button className="w-full bg-[#04477E] dark:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-[#033b66] dark:hover:bg-blue-700 transition-colors duration-200 shadow-sm group-hover:shadow-md">
                      Select Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* Professional Plan */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-full">
                <div className="p-8 pb-0">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Professional
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Advanced AI features
                  </p>

                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ₹199
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      one-time
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 p-8 flex flex-col flex-grow">
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Everything in AI Starter
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Unlimited AI generations
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        JD matching & optimization
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Resume parsing included
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Multiple downloads (PDF + DOCX)
                      </span>
                    </li>
                  </ul>

                  <div className="mt-auto">
                    <button className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 group-hover:border-[#04477E] dark:group-hover:border-blue-500 group-hover:text-[#04477E] dark:group-hover:text-blue-400 transition-all duration-300">
                      Select Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Comparison Note */}
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-12">
              All plans include 50+ professional templates and 24/7 support
            </p>
          </div>
        </section>

        {/* Templates Preview Section */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center p-2 px-4 bg-[#04477E]/10 dark:bg-[#04477E]/20 rounded-full mb-4">
              <span className="text-xs font-semibold text-[#04477E] dark:text-blue-400 uppercase tracking-wider">
                Professional Collection
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-[head] text-gray-900 dark:text-white mb-4">
              Professional Templates
            </h2>
            <p className="text-lg text-gray-600 font-[content] dark:text-gray-300 max-w-2xl mx-auto">
              Choose from our collection of professionally designed templates
              that get noticed by employers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full" />
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#04477E] border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            ) : previewTemplates.length > 0 ? (
              previewTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => navigate("/templates")}
                  className="group relative cursor-pointer"
                >
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-[#04477E] dark:hover:border-[#04477E] hover:scale-105">
                    {/* Template Preview */}
                    <div
                      ref={(el) => (containerRefs.current[template.id] = el)}
                      className="relative aspect-[210/297] w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden"
                    >
                      {previewLoading[template.id] ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                          <div className="relative">
                            <div className="w-10 h-10 border-3 border-gray-200 dark:border-gray-700 rounded-full" />
                            <div className="absolute top-0 left-0 w-10 h-10 border-3 border-[#04477E] border-t-transparent rounded-full animate-spin" />
                          </div>
                          <span className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Loading preview...
                          </span>
                        </div>
                      ) : previews[template.id] ? (
                        <div className="absolute inset-0 overflow-hidden">
                          <iframe
                            srcDoc={previews[template.id]}
                            className="absolute border-0 pointer-events-none"
                            scrolling="no"
                            title={template.name}
                            style={{
                              width: "210mm",
                              height: "297mm",
                              left: "50%",
                              top: 0,
                              transform: `translateX(-50%) scale(${scales[template.id] || 0.22})`,
                              transformOrigin: "top center",
                            }}
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                            <FileText className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="text-white font-semibold text-lg mb-2">
                          {template.name}
                        </h4>
                        <button className="w-full px-4 py-2.5 bg-white text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                          Use This Template
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl mb-4">
                  <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No templates available
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please check back later for our professional templates
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/templates")}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#04477E] to-[#0660a9] hover:from-[#033b66] hover:to-[#04477E] text-white font-[head] rounded-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>View All Templates</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}