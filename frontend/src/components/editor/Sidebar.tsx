import React, { useEffect, useState, useRef } from "react";
import { useUIStore, useResumeStore } from "../../stores";
import { resumeAPI } from "../../services/apiClient";
import { isValidSection } from "./EditorPanel";
import {
  User, FileText, Briefcase, Settings, GraduationCap,
  Lightbulb, Globe, Heart, Trophy, Clipboard, Wrench,
  Link, Plus, ChevronRight, Users, Building, Menu, X, ChevronLeft,
  CircleUserRound, LogOut, ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/logo.png";

const ALL_SECTIONS = [
  { id: "personal",           label: "Professional & Contact",      iconName: "user" },
  { id: "summary",            label: "Summary",                      iconName: "document" },
  { id: "experience",         label: "Work Experience",              iconName: "briefcase" },
  { id: "projects",           label: "Projects",                     iconName: "cog" },
  { id: "education",          label: "Education",                    iconName: "graduation" },
  { id: "academicCampus",     label: "Student Life",                 iconName: "academicCampus" },
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

// ── Your Original Palette (#01467d) ─────────────────────────────────────────
const BLUE  = "#01467d";
const WHITE = "#ffffff";
const W06   = "rgba(255,255,255,0.06)";
const W10   = "rgba(255,255,255,0.10)";
const W15   = "rgba(255,255,255,0.15)";
const W22   = "rgba(255,255,255,0.22)";
const W55   = "rgba(255,255,255,0.55)";
const W80   = "rgba(255,255,255,0.80)";

// Theme-specific enhanced colors
const BLUE_LIGHT = "#1e6a9e";
const BLUE_GLOW = "rgba(1, 70, 125, 0.3)";
const ACCENT_GRADIENT = `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_LIGHT} 100%)`;

export function Sidebar({ resumeId }: { resumeId: string }) {
  const { selectedSection, sidebarOpen, setSelectedSection, setSidebarOpen, completedSections } = useUIStore();
  const { data, updateData } = useResumeStore();

  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [sidebarSections, setSidebarSections] = useState(
    CORE_SECTIONS.map(id => ALL_SECTIONS.find(s => s.id === id)).filter(Boolean) as any[]
  );
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const documentFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);

  useEffect(() => { if (isMobile && sidebarOpen) setSidebarOpen(false); }, [isMobile]);
  useEffect(() => { setSidebarSections(getSidebarSections(data, completedSections, selectedSection)); }, [data, completedSections, selectedSection]);

  const validateSectionForNavigation = (id: string) => isValidSection(id);

  const getIcon = (iconName: string, size = 20, isActive = false) => {
    const p = { size, strokeWidth: isActive ? 2.2 : 1.7 };
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

  // ── Enhanced Section row ───────────────────────────────────────────────────
  const SectionBtn = ({ section, isActive, isDisabled, expanded }: {
    section: any; isActive: boolean; isDisabled: boolean; expanded: boolean;
  }) => {
    const isHovered = hoveredSection === section.id;
    
    return (
      <div style={{ 
        position: "relative", 
        padding: expanded ? "0 0px" : "0 8px",
        marginBottom: "2px"
      }}>
        {isActive && (
          <div style={{
            position: "absolute",
            left: expanded ? "8px" : "4px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "3px",
            height: "24px",
            background: ACCENT_GRADIENT,
            borderRadius: "4px",
            boxShadow: `0 0 12px ${BLUE}`,
            zIndex: 2,
            transition: "all 0.3s ease"
          }} />
        )}
        
        <button
          onClick={() => handleSectionClick(section.id)}
          disabled={isDisabled}
          title={!expanded ? section.label : undefined}
          onMouseEnter={() => setHoveredSection(section.id)}
          onMouseLeave={() => setHoveredSection(null)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: expanded ? 14 : 0,
            justifyContent: expanded ? "flex-start" : "center",
            padding: expanded ? "12px 16px 12px 20px" : "12px 8px",
            borderRadius: "12px",
            border: "none",
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? 0.38 : 1,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            background: isActive 
              ? W22 
              : isHovered && !isDisabled 
                ? W10 
                : "transparent",
            color: isActive 
              ? WHITE 
              : isDisabled 
                ? "rgba(255, 255, 255, 0.2)" 
                : W80,
            position: "relative",
            overflow: "hidden"
          }}
        >
          {isHovered && !isActive && !isDisabled && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 30% 50%, ${BLUE}20 0%, transparent 70%)`,
              pointerEvents: "none"
            }} />
          )}

          {/* Icon tile */}
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isActive ? W22 : W10,
            color: isActive ? WHITE : W80,
            transition: "all 0.2s ease",
            transform: isActive ? "scale(1.1)" : "scale(1)",
          }}>
            {getIcon(section.iconName || "", expanded ? 20 : 18, isActive)}
          </div>

          {/* Label */}
          {expanded && (
            <div style={{ 
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minWidth: 0
            }}>
              <span style={{
                fontSize: "14.5px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? WHITE : W80,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "-0.01em",
                textAlign: "left",
              }}>
                {section.label}
              </span>
              
              {isActive && (
                <ChevronRight size={14} color={WHITE} style={{ opacity: 0.7, marginLeft: 8 }} />
              )}
            </div>
          )}
        </button>
      </div>
    );
  };

  // ── Mobile menu button - FAB style with theme ─────────────────────────────
  const MobileMenuButton = () => (
    <button
      onClick={() => setSidebarOpen(true)}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        background: ACCENT_GRADIENT,
        border: "none",
        boxShadow: `0 10px 25px -5px ${BLUE_GLOW}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 95,
        transition: "all 0.2s ease",
        animation: "pulse 2s infinite"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = `0 20px 30px -5px ${BLUE}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = `0 10px 25px -5px ${BLUE_GLOW}`;
      }}
    >
      <Menu size={24} color="white" strokeWidth={2} />
    </button>
  );

  const getSidebarWidth = () => {
    if (isMobile) return sidebarOpen ? "85vw" : "0px";
    if (isTablet) return sidebarOpen ? "260px" : "72px";
    return sidebarOpen ? "272px" : "70px";
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const BASE: React.CSSProperties = {
    background: BLUE,
    display: "flex",
    flexDirection: "column",
    boxShadow: `4px 0 24px ${BLUE_GLOW}`,
  };

  const HEADER: React.CSSProperties = {
    borderBottom: `1px solid ${W10}`,
    background: `linear-gradient(180deg, ${BLUE_LIGHT}20 0%, ${BLUE} 100%)`,
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
        .sb-custom::-webkit-scrollbar { width: 4px; }
        .sb-custom::-webkit-scrollbar-track { background: transparent; }
        .sb-custom::-webkit-scrollbar-thumb { 
          background: ${BLUE_LIGHT}80; 
          border-radius: 20px;
          transition: all 0.2s ease;
        }
        .sb-custom::-webkit-scrollbar-thumb:hover { background: ${BLUE_LIGHT}; }
        
        body { font-family: 'DM Sans', sans-serif; }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 10px 25px -5px ${BLUE_GLOW}; }
          50% { box-shadow: 0 15px 30px -5px ${BLUE}; }
          100% { box-shadow: 0 10px 25px -5px ${BLUE_GLOW}; }
        }
        
        .sidebar-enter {
          animation: slideIn 0.3s ease forwards;
        }
      `}} />

      {/* ── Mobile FAB ─────────────────────────────────────────────────────── */}
      {isMobile && !sidebarOpen && <MobileMenuButton />}

      {/* ── Mobile backdrop ─────────────────────────────────────────────────── */}
      {isMobile && sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: `${BLUE}80`, zIndex: 40, backdropFilter: "blur(8px)", animation: "fadeIn 0.2s ease" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Sidebar (Mobile & Desktop) ─────────────────────────────────── */}
      <div style={{
        position: isMobile ? "fixed" : "fixed",
        top: isMobile ? "0" : "16px",
        left: isMobile ? "0" : "16px",
        bottom: isMobile ? "0" : "16px",
        width: getSidebarWidth(),
        background: BLUE,
        backdropFilter: isMobile ? "none" : "blur(32px)",
        WebkitBackdropFilter: isMobile ? "none" : "blur(32px)",
        borderRadius: isMobile ? (sidebarOpen ? "0 24px 24px 0" : "0") : "24px",
        border: isMobile ? "none" : `1px solid ${W10}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1), left 0.4s ease, border-radius 0.4s ease",
        zIndex: 100,
        overflow: "hidden",
        boxShadow: isMobile 
          ? (sidebarOpen ? "10px 0 30px rgba(0,0,0,0.3)" : "none")
          : `0 25px 50px -12px ${BLUE_GLOW}`,
      }}>
        
        {/* Enhanced Header Area */}
        <div style={{ 
          ...HEADER,
          padding: isMobile ? "20px" : "24px 20px",
          justifyContent: (sidebarOpen && !isMobile) || (isMobile && sidebarOpen) ? "space-between" : "center",
          minHeight: isMobile ? "70px" : "80px"
        }}>
          {((sidebarOpen && !isMobile) || (isMobile && sidebarOpen)) ? (
            <>
              <img 
                src={logo} 
                alt="logo" 
                style={{ 
                  height: isMobile ? 52 : 52, 
                  filter: "brightness(0) invert(1)",
                  cursor: "pointer",
                  transition: "opacity 0.2s ease"
                }} 
                onClick={() => {
                  navigate("/");
                  if (isMobile) setSidebarOpen(false);
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              />
              
              <button 
                onClick={() => setSidebarOpen(false)}
                style={iconBtnStyle()}
                onMouseEnter={e => {
                  e.currentTarget.style.background = W22;
                  e.currentTarget.style.color = WHITE;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = W10;
                  e.currentTarget.style.color = WHITE;
                }}
              >
                {isMobile ? <X size={16} /> : <ChevronLeft size={16} />}
              </button>
            </>
          ) : (
            !isMobile && (
              <button 
                onClick={() => setSidebarOpen(true)}
                style={iconBtnStyle({ width: 40, height: 40, borderRadius: 10 })}
                title="Expand"
                onMouseEnter={e => {
                  e.currentTarget.style.background = W22;
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = W10;
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <Menu size={20} />
              </button>
            )
          )}
        </div>

        {/* Navigation List */}
        {(!isMobile || (isMobile && sidebarOpen)) && (
          <>
            <div className="sb-custom" style={{ 
              flex: 1, 
              overflowY: "auto", 
              padding: "20px 0",
              scrollBehavior: "smooth"
            }}>
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: W55,
                marginBottom: "16px",
                paddingLeft: (sidebarOpen && !isMobile) || (isMobile && sidebarOpen) ? "24px" : "0",
                textAlign: (sidebarOpen && !isMobile) || (isMobile && sidebarOpen) ? "left" : "center"
              }}>
                {((sidebarOpen && !isMobile) || (isMobile && sidebarOpen)) ? "Sections" : "•••"}
              </div>
              
              {sidebarSections.map((section: any, index: number) => (
                <div 
                  key={section.id} 
                  style={{
                    animation: `slideIn 0.3s ease ${index * 0.03}s forwards`,
                    opacity: 0,
                    transform: "translateX(-10px)"
                  }}
                >
                  <SectionBtn 
                    section={section} 
                    isActive={selectedSection === section.id}
                    isDisabled={!validateSectionForNavigation(section.id)}
                    expanded={(sidebarOpen && !isMobile) || (isMobile && sidebarOpen)}
                  />
                </div>
              ))}
            </div>

            {/* Enhanced User Footer */}
<div style={{ 
  padding: isMobile ? "16px" : "10px",
  borderTop: `1px solid ${W10}`, 
  background: `linear-gradient(180deg, ${BLUE} 0%, ${BLUE}CC 100%)`,
  display: "flex",
  alignItems: "center",
  gap: "14px",
  minHeight: isMobile ? "80px" : "88px",
  position: "relative",
  overflow: "hidden"
}}>
  
  {/* Decorative gradient overlay */}
  <div style={{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background: `linear-gradient(90deg, transparent, ${WHITE}20, transparent)`,
  }} />

  {/* User Avatar with Status Indicator */}
  <div style={{ position: "relative" }}>
    <div style={{ 
      width: isMobile ? 40 : 44, 
      height: isMobile ? 40 : 44, 
      borderRadius: "14px", 
      background: ACCENT_GRADIENT,
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      flexShrink: 0,
      boxShadow: `0 8px 20px ${BLUE_GLOW}`,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      cursor: "pointer"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = `0 12px 25px ${BLUE}`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = `0 8px 20px ${BLUE_GLOW}`;
    }}>
      <CircleUserRound size={isMobile ? 22 : 24} color="white" strokeWidth={1.8} />
    </div>
    
   
  </div>

  {((sidebarOpen && !isMobile) || (isMobile && sidebarOpen)) && (
    <>
      <div style={{ flex: 1, minWidth: 0 }}>
        
        {/* User Name with Greeting */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "2px"
        }}>
          <span style={{
            color: WHITE,
            fontSize: "14px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            letterSpacing: "-0.01em"
          }}>
            {user?.name || "Guest User"}
          </span>
         
        </div>

        {/* User Email with Copy Icon */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "8px",
          color: W55,
          fontSize: "11px",
          cursor: "pointer",
          transition: "color 0.2s ease",
          width: "fit-content"
        }}
        onMouseEnter={e => e.currentTarget.style.color = WHITE}
        onMouseLeave={e => e.currentTarget.style.color = W55}
        onClick={() => {
          if (user?.email) {
            navigator.clipboard.writeText(user.email);
            // You can add a toast notification here
          }
        }}
        title="Click to copy email">
          <span style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "120px"
          }}>
            {user?.email || "guest@example.com"}
          </span>
          {/* <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg> */}
        </div>

        {/* Plan Badge with Usage Indicator */}
        {/* <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          flexWrap: "wrap"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "6px",
            background: W10,
            padding: "4px 10px",
            borderRadius: "20px",
            width: "fit-content",
            border: `1px solid ${W15}`,
            transition: "all 0.2s ease",
            cursor: "pointer"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = W15;
            e.currentTarget.style.borderColor = W22;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = W10;
            e.currentTarget.style.borderColor = W15;
          }}>
            <ShieldCheck size={11} color={WHITE} />
            <span style={{ color: WHITE, fontSize: "11px", fontWeight: 600 }}>
              {user?.role === "user" ? "Free" : "Pro"}
            </span>
          </div>

         
        </div> */}
      </div>

    
    </>
  )}
</div>
          </>
        )}
      </div>
    </>
  );
}