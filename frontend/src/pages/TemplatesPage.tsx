import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { resumeAPI } from '../services/apiClient'
import { useTemplateStore, Template } from '../stores/templateStore'
import { ChevronLeft, FileText, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Strict Color Specification ───────────────────────────────────────────────
const BLUE = "#055597"
const ACCENT_YELLOW = "#d29e3f"
const WHITE = "#ffffff"
const TEXT_MUTED = "#64748b"

export function TemplatesPage() {
  const navigate = useNavigate()
  const { templates, loading, error, fetchTemplates } = useTemplateStore()
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [previewLoading, setPreviewLoading] = useState<Record<string, boolean>>({})
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  useEffect(() => {
    if (!templates.length) return
    let cancelled = false

    async function fetchPreviews() {
      for (const t of templates) {
        if (previews[t.id]) continue
        try {
          setPreviewLoading(p => ({ ...p, [t.id]: true }))
          const res = await fetch(`${import.meta.env.VITE_API_URL}/templates/preview/${t.id}`)
          if (res.ok) {
            const data = await res.json()
            const htmlRes = await fetch(data.url)
            const raw = await htmlRes.text()
            const clean = raw + `<style>
              html,body{margin:0!important;padding:0!important;background:#fff!important;width:100%!important;height:100%!important;overflow:hidden!important;}
              .page,.resume-container,.A4{margin:0!important;box-shadow:none!important;}
            </style>`
            if (!cancelled) setPreviews(p => ({ ...p, [t.id]: clean }))
          }
        } catch (e) { console.warn(`Preview failed for ${t.id}`, e) }
        finally { if (!cancelled) setPreviewLoading(p => ({ ...p, [t.id]: false })) }
      }
    }
    fetchPreviews()
    return () => { cancelled = true }
  }, [templates])

  const handleSelectTemplate = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId)
      const resume = await resumeAPI.create({ title: `${template?.name || 'Professional'} Resume`, template: templateId })
      const resumeId = resume.data._id || resume.data.id;

      if (!resumeId || !/^[a-fA-F0-9]{24}$/.test(resumeId)) {
        throw new Error("Invalid resume ID from backend");
      }

      navigate(`/editor/${resumeId}`);
    } catch (err: any) {
      if (err.response?.status !== 401)
        toast.error(err.response?.data?.error || err.message || 'Failed to create resume.')
    }
  }

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'classic', label: 'Classic Templates' },
    { id: 'photo', label: 'Photo Templates' },
    { id: 'modern', label: 'Modern Templates' }
  ]

  const filteredTemplates = templates.filter(t => {
    if (activeCategory === 'all') return true
    const cat = t.category?.toLowerCase() || 'classic'
    if (activeCategory === 'photo') return cat.includes('photo') || cat.includes('creative')
    return cat === activeCategory
  })

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .tp-scroll::-webkit-scrollbar {
          display: none;
        }
        .tp-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#fdfefe",
          fontFamily: "'Inter', sans-serif",
          position: "relative",
        }}
      >
        {/* Header */}
        <header className="bg-white px-6 py-4 flex justify-start gap-3 items-center text-white shadow-lg sticky top-0 z-50 ">
          <button
            onClick={() => navigate("/onboarding")}
            style={{
             
              left: "16px",
              top: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: WHITE,
              border: "1px solid #e2e8f0",
              color: BLUE,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.borderColor = BLUE;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = WHITE;
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <img
              className="h-10 sm:h-12"
              src="./logo.png"
              alt="ResumeYatra Logo"
            />
          </Link>
          {/* <Link to="/templates" className="flex items-center gap-2 hover:opacity-90 transition-opacity ">
                          <img className='h-10 sm:h-12' src="./resume.gif" alt="Resume Templates" />
                          <span className="text-gray-700 hover:text-[#055597]">Use Templates</span>
                        </Link> */}
        </header>

        {/* ── HEADER SECTION ────────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            background: WHITE,
            padding: "48px 24px 36px 24px",
            textAlign: "center",
            borderBottom: "1px solid #eef2f6",
            boxShadow: "0 10px 40px rgba(5, 85, 151, 0.02)",
          }}
        >
          <div className="flex flex-col justify-center items-center">
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 12px 0",
                letterSpacing: "-0.025em",
              }}
            >
              Choose a Resume Template
            </h1>

            <div
              style={{
                width: 48,
                height: 3,
                background: ACCENT_YELLOW,
                borderRadius: 2,
                display: "block",
                border: "none",
              }}
            />

            <p
              style={{
                fontSize: "15px",
                color: TEXT_MUTED,
                lineHeight: "1.5",
                maxWidth: "720px",
                margin: "20px 0",
                fontWeight: 400,
              }}
            >
              Select one of our expertly designed resume templates to kickstart
              your job application. Try out one of our premium resume templates
              to make an impressive resume and land your dream job in no time!
            </p>

            <p
              style={{
                fontSize: "13px",
                color: BLUE,
                fontWeight: 600,
                margin: "0 0 28px 0",
                letterSpacing: "-0.01em",
              }}
            >
              You can easily change your template later.
            </p>

            {/* Filter Tabs Layout */}
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                overflowX: "auto",
                alignItems: "center",
                paddingBottom: "4px",
              }}
              className="tp-scroll"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    className="cat-pill"
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: "9px 20px",
                      borderRadius: 8,
                      border: isActive
                        ? `1px solid ${BLUE}`
                        : `1px solid #e2e8f0`,
                      background: isActive ? BLUE : WHITE,
                      color: isActive ? WHITE : "#334155",
                      fontSize: "13px",
                      fontWeight: isActive ? 600 : 500,
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      boxShadow: isActive
                        ? "0 4px 12px rgba(5, 85, 151, 0.12)"
                        : "0 1px 2px rgba(0,0,0,0.02)",
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.header>

        {/* ── REDUCED CARD SIZE GRID ────────────────────────────────────────── */}
        <main
          style={{
            width: "100%",
            margin: "0 auto",
            padding: "40px 32px 80px 32px",
          }}
        >
          <motion.div
            layout
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: 32,
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template) => {
                const isHovered = hoveredTemplate === template.id;
                return (
                  <motion.div
                    key={template.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: isHovered ? 1.02 : 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{
                      duration: 0.35,
                      cubicBezier: [0.16, 1, 0.3, 1],
                    }}
                    className="tpl-card"
                    onClick={() => handleSelectTemplate(template.id)}
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                    style={{
                      borderRadius: 14,
                      overflow: "hidden",
                      background: WHITE,
                      border: isHovered
                        ? `1px solid ${BLUE}`
                        : "1px solid #eef2f6",
                      boxShadow: isHovered
                        ? "0 20px 40px rgba(5, 85, 151, 0.1), 0 6px 12px rgba(5, 85, 151, 0.04)"
                        : "0 8px 20px rgba(15, 23, 42, 0.02)",
                      cursor: "pointer",
                      position: "relative",
                      transform: isHovered
                        ? "translateY(-3px)"
                        : "translateY(0)",
                      transition:
                        "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {/* Reduced canvas wrapper */}
                    <div
                      ref={(el) => (containerRefs.current[template.id] = el)}
                      style={{
                        position: "relative",
                        aspectRatio: "210/280",
                        overflow: "hidden",
                        background: "#ffffff",
                        borderBottom: "1px solid #f8fafc",
                      }}
                    >
                      {previewLoading[template.id] && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.9)",
                          }}
                        >
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              border: `2px solid #e2e8f0`,
                              borderTopColor: BLUE,
                              animation: "spin 0.6s linear infinite",
                            }}
                          />
                        </div>
                      )}

                      {previews[template.id] ? (
                        <iframe
                          srcDoc={previews[template.id]}
                          scrolling="no"
                          style={{
                            width: "200mm",
                            height: "280mm",
                            position: "absolute",
                            left: "50%",
                            transform: `translateX(-50%) scale(${containerRefs.current[template.id] ? (containerRefs.current[template.id]!.offsetWidth / 794) * 0.95 : 0.45})`,
                            transformOrigin: "top center",
                            border: 0,
                            padding: 0,
                            pointerEvents: "none",
                          }}
                          title={template.name}
                        />
                      ) : (
                        !previewLoading[template.id] && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FileText
                              size={32}
                              color="#cbd5e1"
                              strokeWidth={1.5}
                            />
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#94a3b8",
                                marginTop: 10,
                              }}
                            >
                              {template.name}
                            </span>
                          </div>
                        )
                      )}

                      {/* Cover Action Overlay */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          zIndex: 5,
                          background:
                            "linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.15) 65%, transparent 100%)",
                          opacity: isHovered ? 1 : 0,
                          transition:
                            "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          padding: 24,
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTemplate(template.id);
                          }}
                          style={{
                            width: "100%",
                            padding: "11px 0",
                            borderRadius: 8,
                            border: "none",
                            background: ACCENT_YELLOW,
                            color: WHITE,
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            boxShadow: "0 4px 16px rgba(210, 158, 63, 0.3)",
                            transform: isHovered
                              ? "translateY(0) scale(1)"
                              : "translateY(14px) scale(0.98)",
                            transition:
                              "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          Use Template{" "}
                          <ArrowRight size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                    {/* Reduced metadata */}
                    <div
                      style={{
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#0f172a",
                            margin: 0,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {template.name}
                        </h4>
                        <span
                          style={{
                            fontSize: "11px",
                            color: TEXT_MUTED,
                            textTransform: "capitalize",
                            display: "inline-block",
                            marginTop: 4,
                            fontWeight: 500,
                          }}
                        >
                          {template.category || "Classic"} Layout
                        </span>
                      </div>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: isHovered ? BLUE : "#f8fafc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transform: isHovered
                            ? "translateX(3px)"
                            : "translateX(0)",
                          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <ArrowRight
                          size={14}
                          color={isHovered ? WHITE : "#64748b"}
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </>
  );
}