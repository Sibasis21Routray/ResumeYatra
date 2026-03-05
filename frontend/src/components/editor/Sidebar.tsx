import React, { useEffect, useState, useRef } from "react";
import { useUIStore, useResumeStore } from "../../stores";
import { resumeAPI } from "../../services/apiClient";
import { isValidSection } from "./EditorPanel";
import {
  User, FileText, Briefcase, Settings, GraduationCap,
  Lightbulb, Globe, Heart, Trophy, Clipboard, Wrench,
  Link, Plus, ChevronRight, Users, Building, Menu, X, ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ALL_SECTIONS = [
  { id: "personal",           label: "Professional & Contact",      iconName: "user" },
  { id: "summary",            label: "Summary",                      iconName: "document" },
  { id: "experience",         label: "Work Experience",              iconName: "briefcase" },
  { id: "projects",           label: "Projects",                     iconName: "cog" },
  { id: "education",          label: "Education",                    iconName: "graduation" },
  { id: "academicCampus",     label: "Academic & Campus",            iconName: "academicCampus" },
  { id: "professionalContext",label: "Professional Context",         iconName: "building" },
  { id: "skills",             label: "Skills",                       iconName: "lightbulb" },
  { id: "languages",          label: "Languages",                    iconName: "globe" },
  { id: "hobbies",            label: "Hobbies",                      iconName: "heart" },
  { id: "keyAchievements",    label: "Key Achievements",             iconName: "trophy" },
  { id: "responsibilities",   label: "Responsibilities",             iconName: "clipboard" },
  { id: "tools",              label: "Tools & Technologies",         iconName: "wrench" },
  { id: "socialLinks",        label: "Social Links",                 iconName: "link" },
  { id: "customSections",     label: "Custom Sections",              iconName: "plus" },
];

const sectionHasData = (sectionId: string, data: any): boolean => {
  switch (sectionId) {
    case "personal":            return !!(data.fullName || data.email || data.phone || data.address);
    case "summary":             return !!data.summary;
    case "experience":          return !!(data.experience?.length);
    case "projects":            return !!(data.projects?.length);
    case "education":           return !!(data.education?.length);
    case "academicCampus":      return !!(data.internships?.length || data.academicProjects?.length || data.leadershipPositions?.length || data.trainingPrograms?.length || data.scholarships?.length || data.coCurricular?.length || data.extracurricular?.length);
    case "professionalContext": return !!(data.professionalContext?.totalExperience || data.professionalContext?.teamSize || data.professionalContext?.industry);
    case "skills":              return !!(data.skills?.length);
    case "languages":           return !!(data.languages?.length);
    case "hobbies":             return !!(data.hobbies?.length);
    case "keyAchievements":     return !!(data.keyAchievements?.length);
    case "responsibilities":    return !!(data.responsibilities?.length);
    case "tools":               return !!(data.tools?.length);
    case "socialLinks":         return !!(data.socialLinks?.length);
    case "customSections":      return !!(data.customSections?.length);
    default:                    return false;
  }
};

const CORE_SECTIONS    = ["personal","education","academicCampus","professionalContext","experience","skills","summary","customSections"];
const HIDDEN_SECTIONS  = ["projects","hobbies","keyAchievements","responsibilities","tools","socialLinks"];

const getSidebarSections = (data: any, completedSections: string[], selectedSection: string) => {
  const core     = CORE_SECTIONS.filter(id => id !== "customSections").map(id => ALL_SECTIONS.find(s => s.id === id)).filter(Boolean);
  const optional = ALL_SECTIONS.filter(s => !CORE_SECTIONS.includes(s.id) && !HIDDEN_SECTIONS.includes(s.id) && completedSections.includes(s.id) && sectionHasData(s.id, data));
  const selOpt   = ALL_SECTIONS.find(s => s.id === selectedSection && !CORE_SECTIONS.includes(s.id) && !HIDDEN_SECTIONS.includes(s.id) && !optional.find(o => o.id === s.id) && !completedSections.includes(s.id));
  const custom   = [ALL_SECTIONS.find(s => s.id === "customSections")].filter(Boolean);
  return [...core, ...optional, ...(selOpt ? [selOpt] : []), ...custom];
};

// ── Palette ──────────────────────────────────────────────────────────────────
const BLUE  = "#01467d";
const WHITE = "#ffffff";
const W06   = "rgba(255,255,255,0.06)";
const W10   = "rgba(255,255,255,0.10)";
const W15   = "rgba(255,255,255,0.15)";
const W22   = "rgba(255,255,255,0.22)";
const W55   = "rgba(255,255,255,0.55)";
const W80   = "rgba(255,255,255,0.80)";

export function Sidebar({ resumeId }: { resumeId: string }) {
  const { selectedSection, sidebarOpen, setSelectedSection, setSidebarOpen, completedSections } = useUIStore();
  const { data, updateData } = useResumeStore();

  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const [sidebarSections, setSidebarSections] = useState(
    CORE_SECTIONS.map(id => ALL_SECTIONS.find(s => s.id === id)).filter(Boolean) as any[]
  );
  const documentFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { if (isMobile && sidebarOpen) setSidebarOpen(false); }, [isMobile]);
  useEffect(() => { setSidebarSections(getSidebarSections(data, completedSections, selectedSection)); }, [data, completedSections, selectedSection]);

  const validateSectionForNavigation = (id: string) => isValidSection(id);

  const getIcon = (iconName: string, size = 20) => {
    const p = { size, strokeWidth: 1.7 };
    switch (iconName) {
      case "user":          return <User {...p} />;
      case "document":      return <FileText {...p} />;
      case "briefcase":     return <Briefcase {...p} />;
      case "cog":           return <Settings {...p} />;
      case "graduation":    return <GraduationCap {...p} />;
      case "academicCampus":return <Users {...p} />;
      case "building":      return <Building {...p} />;
      case "lightbulb":     return <Lightbulb {...p} />;
      case "globe":         return <Globe {...p} />;
      case "heart":         return <Heart {...p} />;
      case "trophy":        return <Trophy {...p} />;
      case "clipboard":     return <Clipboard {...p} />;
      case "wrench":        return <Wrench {...p} />;
      case "link":          return <Link {...p} />;
      case "plus":          return <Plus {...p} />;
      default:              return null;
    }
  };

  const handleSectionClick = (sectionId: string) => {
    if (validateSectionForNavigation(sectionId)) {
      setSelectedSection(sectionId);
      if (!completedSections.includes(sectionId)) useUIStore.getState().markSectionCompleted(sectionId);
      if (isMobile) setSidebarOpen(false);
    } else {
      alert("Please click the Continue button in the current section before jumping ahead.");
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/msword"];
    if (!allowed.includes(file.type)) { alert("Please select a valid PDF or Word document."); return; }
    if (file.size > 10 * 1024 * 1024) { alert("Document size should be less than 10MB."); return; }
    try {
      setUploadingDocument(true);
      const res = await resumeAPI.upload(resumeId, file);
      if (res.data.structured) { updateData(d => { Object.assign(d, res.data.structured); }); alert("Resume uploaded!"); }
      else throw new Error("Failed to parse");
    } catch (e: any) { alert(`Upload failed: ${e.response?.data?.error || e.message}`); }
    finally { setUploadingDocument(false); }
    if (documentFileInputRef.current) documentFileInputRef.current.value = "";
  };

  // ── Section row ───────────────────────────────────────────────────────────
  const SectionBtn = ({ section, isActive, isDisabled, expanded }: {
    section: any; isActive: boolean; isDisabled: boolean; expanded: boolean;
  }) => (
    <button
      onClick={() => handleSectionClick(section.id)}
      disabled={isDisabled}
      title={!expanded ? section.label : undefined}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: expanded ? 13 : 0,
        justifyContent: expanded ? "flex-start" : "center",
        padding: expanded ? "11px 16px" : "11px 0",
        borderRadius: 12,
        border: "none",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.38 : 1,
        transition: "background 0.15s ease",
        background: isActive ? W22 : "transparent",
        borderLeft: isActive ? `3px solid ${WHITE}` : "3px solid transparent",
      }}
      onMouseEnter={e => { if (!isActive && !isDisabled) (e.currentTarget as HTMLElement).style.background = W10; }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {/* Icon tile */}
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: isActive ? W22 : W10,
        color: isActive ? WHITE : W80,
        transition: "all 0.15s",
      }}>
        {getIcon(section.iconName || "")}
      </div>

      {/* Label */}
      {expanded && (
        <span style={{
          fontSize: 14.5,
          fontWeight: isActive ? 600 : 400,
          color: isActive ? WHITE : W80,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "-0.01em",
          textAlign: "left",
          flex: 1,
          minWidth: 0,
        }}>
          {section.label}
        </span>
      )}
    </button>
  );

  // ── Shared styles ─────────────────────────────────────────────────────────
  const BASE: React.CSSProperties = {
    background: BLUE,
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 24px rgba(0,0,0,0.22)",
  };

  const HEADER: React.CSSProperties = {
    borderBottom: `1px solid ${W10}`,
    background: "rgba(0,0,0,0.16)",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    minHeight: 76,
  };

  const iconBtnStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    width: 36, height: 36, borderRadius: 9, border: "none",
    background: W10, color: WHITE, cursor: "pointer", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.15s",
    ...extra,
  });
const navigate = useNavigate();
  return (
    <>
      <input ref={documentFileInputRef} type="file" accept=".pdf,.doc,.docx"
        onChange={handleDocumentUpload} disabled={uploadingDocument} className="hidden" />

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .sb::-webkit-scrollbar { width: 4px; }
        .sb::-webkit-scrollbar-track { background: transparent; }
        .sb::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        @keyframes slideIn { from { transform:translateX(-100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
      `}} />

      {/* ── Mobile FAB ─────────────────────────────────────────────────────── */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: "fixed", bottom: 20, right: 20, zIndex: 60,
            width: 54, height: 54, borderRadius: "50%",
            background: BLUE, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.30)", color: WHITE,
            transition: "transform 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.06)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
        >
          <Menu size={24} strokeWidth={2} />
        </button>
      )}

      {/* ── Mobile backdrop ─────────────────────────────────────────────────── */}
      {isMobile && sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.52)", zIndex: 40, backdropFilter: "blur(2px)", animation: "fadeIn 0.2s ease" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile sidebar ──────────────────────────────────────────────────── */}
      {isMobile && sidebarOpen && (
        <div style={{ ...BASE, position: "fixed", top: 0, left: 0, bottom: 0, width: "min(340px, 88vw)", zIndex: 50, animation: "slideIn 0.25s ease" }}>
          <div style={{ ...HEADER, padding: "0 18px", justifyContent: "space-between" }}>
            
            <img src="../../../public/logo.png" alt="Logo" onClick={()=>{navigate("/")}}
              style={{ height: 48, width: "auto", filter: "brightness(0) invert(1)" }} />
            <button
              style={iconBtnStyle()}
              onClick={() => setSidebarOpen(false)}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = W22}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = W10}
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          <div style={{ padding: "8px 14px 4px", borderBottom: `1px solid ${W06}` }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: W55, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
              Sections
            </span>
          </div>

          <div className="sb" style={{ flex: 1, overflowY: "auto", padding: "8px 12px 16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sidebarSections.map(section => (
                <SectionBtn key={section.id} section={section}
                  isActive={selectedSection === section.id}
                  isDisabled={!validateSectionForNavigation(section.id)}
                  expanded={true} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      {!isMobile && (
        <div style={{
          ...BASE,
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 30,
          width: sidebarOpen ? 272 : 70,
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}>
          {/* Header */}
          <div style={{
            ...HEADER,
            padding: sidebarOpen ? "0 16px" : "0",
            justifyContent: sidebarOpen ? "space-between" : "center",
          }}>
            {sidebarOpen ? (
              <>
                 <img src="../../../public/logo.png" alt="Logo" onClick={()=>{navigate("/")}}
              style={{ height: 68, width: "auto", filter: "brightness(0) invert(1)" }} />
                <button
                  style={iconBtnStyle()}
                  onClick={() => setSidebarOpen(false)}
                  title="Collapse"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = W22; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = W10; }}
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                </button>
              </>
            ) : (
              <button
                style={iconBtnStyle({ width: 40, height: 40, borderRadius: 10 })}
                onClick={() => setSidebarOpen(true)}
                title="Expand"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = W22; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = W10; }}
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Section group label (expanded only) */}
          {sidebarOpen && (
            <div style={{ padding: "10px 18px 6px", borderBottom: `1px solid ${W06}` }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: W55, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
                Sections
              </span>
            </div>
          )}

          {/* List */}
          <div className="sb" style={{ flex: 1, overflowY: "auto", padding: sidebarOpen ? "8px 12px 16px" : "8px 8px 16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sidebarSections.map(section => (
                <SectionBtn key={section.id} section={section}
                  isActive={selectedSection === section.id}
                  isDisabled={!validateSectionForNavigation(section.id)}
                  expanded={sidebarOpen} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}