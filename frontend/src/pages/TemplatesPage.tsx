import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeAPI, authAPI } from '../services/apiClient'
import { useTemplateStore, Template } from '../stores/templateStore'
import {
  ChevronLeft, FileText, Grid, Sparkles,
  Briefcase, Palette, Minimize2, Crown, ArrowRight,
} from 'lucide-react'

// ── Brand ────────────────────────────────────────────────────────────────────
const BLUE   = "#01467d"
const YELLOW = "#dea42c"
const WHITE  = "#ffffff"

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; desc: string }> = {
  professional: {
    icon: <Briefcase size={15} strokeWidth={1.8} />,
    color: BLUE,
    desc: "Clean, corporate-ready layouts",
  },
  modern: {
    icon: <Sparkles size={15} strokeWidth={1.8} />,
    color: "#0891b2",
    desc: "Fresh designs with bold typography",
  },
  creative: {
    icon: <Palette size={15} strokeWidth={1.8} />,
    color: "#7c3aed",
    desc: "Stand out with artistic flair",
  },
  minimal: {
    icon: <Minimize2 size={15} strokeWidth={1.8} />,
    color: "#374151",
    desc: "Less is more — pure elegance",
  },
}

export function TemplatesPage() {
  const navigate = useNavigate()
  const { templates, loading, error, fetchTemplates } = useTemplateStore()
  const [previews, setPreviews]           = useState<Record<string, string>>({})
  const [previewLoading, setPreviewLoading] = useState<Record<string, boolean>>({})
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)
  const [activeCategory, setActiveCategory]   = useState<string>('all')
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
          const res  = await fetch(`${import.meta.env.VITE_API_URL}/templates/preview/${t.id}`)
          if (res.ok) {
            const data    = await res.json()
            const htmlRes = await fetch(data.url)
            const raw     = await htmlRes.text()
            const clean   = raw + `<style>
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
      const token = localStorage.getItem('token')
      if (!token) { navigate(`/login?next=/templates&use=${encodeURIComponent(templateId)}`); return }
      try { await authAPI.me() } catch { navigate(`/login?next=/templates&use=${encodeURIComponent(templateId)}`); return }
      const template = templates.find(t => t.id === templateId)
      const resume   = await resumeAPI.create({ title: `${template?.name || 'Professional'} Resume`, template: templateId })
      if (!resume?.data?.id) throw new Error('Invalid resume ID')
      navigate(`/editor/${resume.data.id}`)
    } catch (err: any) {
      if (err.response?.status !== 401)
        alert(err.response?.data?.error || err.message || 'Failed to create resume.')
    }
  }

  const categories = ['all', 'professional', 'modern', 'creative', 'minimal']

  const groupedTemplates = templates.reduce((acc, t) => {
    const cat = t.category || 'professional'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t)
    return acc
  }, {} as Record<string, Template[]>)

  const filteredCategories = activeCategory === 'all'
    ? ['professional', 'modern', 'creative', 'minimal']
    : [activeCategory]

  const totalTemplates = templates.length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes shimmer  { 0%,100%{opacity:.6}50%{opacity:1} }
        .tpl-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .tpl-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(1,70,125,0.18) !important; }
        .cat-pill { transition: all 0.15s ease; cursor: pointer; }
        .use-btn  { transition: all 0.15s ease; }
        .use-btn:hover { background: ${BLUE} !important; color: ${WHITE} !important; }
        .tp-scroll::-webkit-scrollbar { display:none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, #f0f6fc 0%, #e8f1f8 60%, #edf3f9 100%)`, fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Subtle dot grid bg ── */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: `radial-gradient(${BLUE}08 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />

        {/* ── Header ── */}
        
        <main style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px 64px", position: "relative", zIndex: 1 }}>

          {/* ── Category filter tabs ── */}
          <div style={{ display: "flex", gap: 8, marginBottom: 40, overflowX: "auto" }} className="tp-scroll">
            {categories.map(cat => {
              const isActive = activeCategory === cat
              const meta     = CATEGORY_META[cat]
              return (
                <button
                  key={cat}
                  className="cat-pill"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 18px",
                    borderRadius: 24,
                    border: `1.5px solid ${isActive ? BLUE : `${BLUE}20`}`,
                    background: isActive ? BLUE : WHITE,
                    color: isActive ? WHITE : "#475569",
                    fontSize: 13, fontWeight: isActive ? 700 : 500,
                    whiteSpace: "nowrap",
                    boxShadow: isActive ? `0 4px 14px ${BLUE}33` : "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {cat !== 'all' && (
                    <span style={{ color: isActive ? "rgba(255,255,255,0.85)" : meta?.color }}>
                      {meta?.icon}
                    </span>
                  )}
                  <span style={{ textTransform: "capitalize" }}>{cat === 'all' ? 'All Templates' : cat}</span>
                  {cat !== 'all' && groupedTemplates[cat]?.length > 0 && (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      background: isActive ? "rgba(255,255,255,0.2)" : `${BLUE}12`,
                      color: isActive ? WHITE : BLUE,
                      padding: "1px 7px", borderRadius: 10,
                    }}>
                      {groupedTemplates[cat].length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* ── States ── */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 0" }}>
              <div style={{ position: "relative", width: 56, height: 56 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${BLUE}18` }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${BLUE}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
              </div>
              <p style={{ marginTop: 20, fontSize: 15, fontWeight: 600, color: "#1a2e40" }}>Loading templates…</p>
              <p style={{ marginTop: 4, fontSize: 13, color: "#94a3b8" }}>Preparing the best designs for you</p>
            </div>
          ) : error ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: "#fff1f1", border: "1.5px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <FileText size={32} color="#ef4444" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Failed to load templates</h3>
              <p style={{ fontSize: 13, color: "#64748b", maxWidth: 340, marginBottom: 24 }}>{error || "We couldn't load the templates. Please try again."}</p>
              <button
                onClick={fetchTemplates}
                style={{
                  padding: "10px 24px", borderRadius: 12,
                  background: `linear-gradient(135deg, ${BLUE}, #025fa8)`,
                  color: WHITE, border: "none", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", boxShadow: `0 4px 16px ${BLUE}40`,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
              {filteredCategories.map(category =>
                groupedTemplates[category]?.length > 0 && (
                  <section key={category} style={{ animation: "fadeUp 0.4s ease" }}>

                    {/* ── Category heading ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "8px 16px", borderRadius: 12,
                        background: WHITE,
                        border: `1.5px solid ${BLUE}18`,
                        boxShadow: `0 2px 8px ${BLUE}08`,
                      }}>
                        <span style={{ color: CATEGORY_META[category]?.color || BLUE }}>
                          {CATEGORY_META[category]?.icon}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", textTransform: "capitalize" }}>
                          {category}
                        </span>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          background: `${BLUE}10`, color: BLUE,
                          padding: "1px 8px", borderRadius: 8,
                        }}>
                          {groupedTemplates[category].length}
                        </span>
                      </div>

                      <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                        {CATEGORY_META[category]?.desc}
                      </span>

                      <div style={{ flex: 1, height: 1, background: `${BLUE}10` }} />
                    </div>

                    {/* ── Grid ── */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                      gap: 20,
                    }}>
                      {groupedTemplates[category].map(template => {
                        const isHovered = hoveredTemplate === template.id
                        return (
                          <div
                            key={template.id}
                            className="tpl-card"
                            onClick={() => handleSelectTemplate(template.id)}
                            onMouseEnter={() => setHoveredTemplate(template.id)}
                            onMouseLeave={() => setHoveredTemplate(null)}
                            style={{
                              borderRadius: 16,
                              overflow: "hidden",
                              background: WHITE,
                              border: `1.5px solid ${isHovered ? BLUE + "44" : BLUE + "14"}`,
                              boxShadow: `0 2px 12px ${BLUE}0a`,
                              cursor: "pointer",
                              position: "relative",
                            }}
                          >
                            {/* ── A4 preview area ── */}
                            <div
                              ref={el => (containerRefs.current[template.id] = el)}
                              style={{
                                position: "relative",
                                aspectRatio: "210/297",
                                background: "#f8fafc",
                                overflow: "hidden",
                              }}
                            >
                              {/* Top accent */}
                              <div style={{
                                position: "absolute", top: 0, left: 0, right: 0,
                                height: 3, zIndex: 3,
                                background: isHovered ? `linear-gradient(90deg, ${BLUE}, #025fa8)` : "transparent",
                                transition: "background 0.2s",
                              }} />

                              {/* Loading */}
                              {previewLoading[template.id] && (
                                <div style={{
                                  position: "absolute", inset: 0, zIndex: 10,
                                  display: "flex", flexDirection: "column",
                                  alignItems: "center", justifyContent: "center",
                                  background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)",
                                }}>
                                  <div style={{ position: "relative", width: 36, height: 36 }}>
                                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2.5px solid ${BLUE}18` }} />
                                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2.5px solid ${BLUE}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                                  </div>
                                  <span style={{ marginTop: 10, fontSize: 11, fontWeight: 600, color: `${BLUE}99` }}>Loading…</span>
                                </div>
                              )}

                              {/* iframe preview */}
                              {previews[template.id] ? (
                                <iframe
                                  srcDoc={previews[template.id]}
                                  className="absolute border-0 pointer-events-none"
                                  scrolling="no"
                                  style={{
                                    width: "210mm", height: "297mm",
                                    left: "50%", position: "absolute",
                                    transform: `translateX(-50%) scale(${containerRefs.current[template.id] ? containerRefs.current[template.id]!.offsetWidth / 794 : 0.3})`,
                                    transformOrigin: "top center",
                                    border: 0,
                                  }}
                                  title={template.name}
                                />
                              ) : !previewLoading[template.id] && (
                                <div style={{
                                  position: "absolute", inset: 0,
                                  display: "flex", flexDirection: "column",
                                  alignItems: "center", justifyContent: "center", gap: 10,
                                }}>
                                  <div style={{
                                    width: 52, height: 52, borderRadius: 14,
                                    background: `${BLUE}0a`, border: `1.5px dashed ${BLUE}28`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                  }}>
                                    <FileText size={24} color={`${BLUE}55`} strokeWidth={1.5} />
                                  </div>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: `${BLUE}88`, textAlign: "center" }}>{template.name}</span>
                                </div>
                              )}

                              {/* Hover overlay */}
                              <div style={{
                                position: "absolute", inset: 0, zIndex: 5,
                                background: "linear-gradient(to top, rgba(1,70,125,0.88) 0%, rgba(1,70,125,0.3) 50%, transparent 100%)",
                                opacity: isHovered ? 1 : 0,
                                transition: "opacity 0.25s ease",
                                display: "flex", flexDirection: "column",
                                justifyContent: "flex-end", padding: 16,
                              }}>
                                <div style={{
                                  transform: isHovered ? "translateY(0)" : "translateY(10px)",
                                  transition: "transform 0.25s ease",
                                }}>
                                  <p style={{ fontSize: 13, fontWeight: 700, color: WHITE, margin: "0 0 8px" }}>{template.name}</p>
                                  <button
                                    className="use-btn"
                                    onClick={e => { e.stopPropagation(); handleSelectTemplate(template.id); }}
                                    style={{
                                      width: "100%", padding: "9px 0",
                                      borderRadius: 10, border: "none",
                                      background: WHITE, color: BLUE,
                                      fontSize: 12, fontWeight: 700,
                                      cursor: "pointer", display: "flex",
                                      alignItems: "center", justifyContent: "center", gap: 6,
                                      fontFamily: "'DM Sans', sans-serif",
                                    }}
                                  >
                                    Use Template <ArrowRight size={13} strokeWidth={2.5} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* ── Card footer ── */}
                            <div style={{
                              padding: "12px 14px",
                              borderTop: `1px solid ${BLUE}0e`,
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                            }}>
                              <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>{template.name}</p>
                                <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0", fontWeight: 500, textTransform: "capitalize" }}>{category}</p>
                              </div>
                              <div style={{
                                width: 28, height: 28, borderRadius: 8,
                                background: isHovered ? BLUE : `${BLUE}10`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s",
                              }}>
                                <ArrowRight size={13} color={isHovered ? WHITE : BLUE} strokeWidth={2.2} />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                )
              )}
            </div>
          )}
        </main>
      </div>
    </>
  )
}