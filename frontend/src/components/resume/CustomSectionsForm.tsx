import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "../editor/RichTextEditor";
import { AutoSuggestionPanel } from "../editor/AutoSuggestionPanel";
import { MonthYearPicker } from "./MonthYearPicker";
import { ResumeData } from "../../stores/resumeStore";
import { 
  CheckCircle, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  BookOpen,
  Award,
  Users,
  Briefcase,
  Wrench,
  Heart,
  Globe,
  GraduationCap,
  Sparkles,
  FileText,
  FolderOpen,
  Grid,
  List,
  Search,
  Filter,
  AlertCircle
} from "lucide-react";

// ── Theme Colors (#00477e) ─────────────────────────────────────────────────
const THEME = {
  primary: "#00477e",
  primaryLight: "#1e6a9e",
  primaryDark: "#00335c",
  primaryGradient: "linear-gradient(135deg, #00477e 0%, #1e6a9e 100%)",
  primaryGlow: "rgba(0, 71, 126, 0.3)",
};

interface CustomSectionEntry {
  id: string;
  title?: string;
  organization?: string;
  date?: string;
  description?: string;
  isVisible: boolean;
}

interface CustomSection {
  id: string;
  heading: string;
  entries: CustomSectionEntry[];
  isVisible: boolean;
}

interface CustomSectionsFormProps {
  data: ResumeData;
  onChange: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
  onOpenAIModal?: () => void;
  resumeId?: string;
  onNavigateToSection?: (section: string) => void;
}

// Section Card Component - Compact version with theme
const SectionCard = ({ 
  title, 
  description, 
  children, 
  icon,
  color = "blue",
  badge 
}: { 
  title: string; 
  description?: string; 
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
  badge?: string;
}) => {
  const colorClasses = {
    blue: `border-[${THEME.primary}]/20`,
    green: "border-green-200 dark:border-green-800",
    purple: "border-purple-200 dark:border-purple-800",
    amber: "border-amber-200 dark:border-amber-800",
    red: "border-red-200 dark:border-red-800"
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border shadow-sm overflow-hidden`} 
      style={{ borderColor: color === 'blue' ? `${THEME.primary}20` : undefined }}>
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          {icon && <div className="text-gray-600 dark:text-gray-300">{icon}</div>}
          <div className="flex items-center gap-2 flex-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </h4>
            {badge && (
              <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

// Section Entry Component - Compact version with theme
const SectionEntry = ({ 
  entry, 
  index, 
  sectionId, 
  sectionHeading,
  onUpdate, 
  onToggleVisibility, 
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  resumeId
}: { 
  entry: CustomSectionEntry; 
  index: number;
  sectionId: string;
  sectionHeading: string;
  onUpdate: (field: keyof CustomSectionEntry, value: any) => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  resumeId?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPlaceholders = () => {
    switch(sectionHeading.toLowerCase()) {
      case 'certifications':
        return {
          title: "Certification Name",
          org: "Issuing Organization",
          date: "Issue Year"
        };
      case 'awards':
        return {
          title: "Award Title",
          org: "Presented By",
          date: "Year Received"
        };
      case 'publications':
        return {
          title: "Publication Title",
          org: "Journal/Publisher",
          date: "Publication Date"
        };
      case 'languages':
        return {
          title: "Language",
          org: "Proficiency Level",
          date: ""
        };
      default:
        return {
          title: "Title / Role",
          org: "Organization",
          date: "Date"
        };
    }
  };

  const placeholders = getPlaceholders();

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm hover:shadow-md mb-2"
      style={{ 
        hoverBorderColor: THEME.primaryLight,
      }}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Drag Handle */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-3.5 h-3.5 text-gray-400" />
      </div>

      {/* Entry Header - Compact */}
      <div className="flex items-center justify-between pl-6 pr-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-medium"
            style={{ background: THEME.primaryGradient }}>
            {index + 1}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
            {entry.title || `New ${sectionHeading.slice(0, -1) || 'Entry'}`}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onToggleVisibility}
            className={`p-1 rounded transition-colors ${
              entry.isVisible
                ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {entry.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 pt-0 space-y-3 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder={placeholders.title}
              value={entry.title || ""}
              onChange={(e) => onUpdate("title", e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 transition-all text-sm"
              style={{ focusRingColor: `${THEME.primary}20` }}
            />
            
            {placeholders.org && (
              <input
                type="text"
                placeholder={placeholders.org}
                value={entry.organization || ""}
                onChange={(e) => onUpdate("organization", e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 transition-all text-sm"
                style={{ focusRingColor: `${THEME.primary}20` }}
              />
            )}
          </div>

          {placeholders.date && (
            <div className="max-w-xs">
              <MonthYearPicker
                value={entry.date || ""}
                onChange={(value) => onUpdate("date", value)}
                placeholder={placeholders.date}
                className="w-full"
                endYear={new Date().getFullYear()}
              />
            </div>
          )}

          <div>
            <RichTextEditor
              value={entry.description || ""}
              onChange={(value) => onUpdate("description", value)}
              placeholder="Add description, achievements, or key details..."
            />
            {resumeId && (
              <AutoSuggestionPanel
                text={entry.description || ""}
                onTextChange={(newText) => onUpdate("description", newText)}
                context="experience"
                resumeId={resumeId}
              />
            )}
          </div>
        </div>
      )}

      {/* Collapsed Preview */}
      {!isExpanded && entry.description && (
        <div className="px-3 pb-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
          {entry.description.replace(/<[^>]*>/g, '').substring(0, 60)}
          {entry.description.length > 60 ? '...' : ''}
        </div>
      )}
    </div>
  );
};

// Section Group Component - Compact with theme
const SectionGroup = ({ 
  group, 
  filledSections, 
  onNavigate 
}: { 
  group: any; 
  filledSections: Set<string>;
  onNavigate: (form: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="text-blue-600 dark:text-blue-400" style={{ color: THEME.primary }}>
            {group.icon}
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {group.title}
          </h4>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
            {group.sections.filter((s: any) => filledSections.has(s.form)).length}/{group.sections.length}
          </span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="p-3 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {group.sections.map((section: any) => {
            const isFilled = filledSections.has(section.form);
            
            return (
              <button
                key={section.name}
                onClick={() => onNavigate(section.form)}
                className={`group relative p-3 rounded-lg border transition-all text-left ${
                  isFilled 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                style={{ 
                  hoverBorderColor: isFilled ? undefined : THEME.primary,
                  hoverBackgroundColor: isFilled ? undefined : `${THEME.primary}10`
                }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    isFilled 
                      ? 'bg-green-500 text-white' 
                      : ''
                  } transition-colors`}
                  style={{ 
                    groupHoverBackground: isFilled ? undefined : THEME.primary 
                  }}>
                    {isFilled ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {section.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function for section descriptions
const getSectionDescription = (form: string): string => {
  const descriptions: Record<string, string> = {
    references: "Add professional references",
    socialProfiles: "Link your professional profiles",
    availabilityWorkAuth: "Set your availability",
    certifications: "Professional certifications",
    awards: "Recognition and honors",
    speakingEngagements: "Conferences and talks",
    memberships: "Professional memberships",
    workshops: "Seminars and training",
    clientProjects: "Notable client work",
    portfolio: "Showcase your work",
    toolsTechnologies: "Software and tools",
    methodologies: "Frameworks and methods",
    industryExpertise: "Domain knowledge",
    volunteering: "Community service",
    militaryService: "Veteran experience",
    languages: "Languages you speak",
    teachingExperience: "Academic teaching",
    mentorshipExperience: "Mentoring roles",
    researchGrants: "Funding received",
    testScores: "Standardized tests",
    publications: "Papers and articles",
    patents: "Intellectual property"
  };
  return descriptions[form] || "Add relevant information";
};

export function CustomSectionsForm({
  data,
  onChange,
  onNext,
  onBack,
  onOpenAIModal,
  resumeId,
  onNavigateToSection,
}: CustomSectionsFormProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [draggedEntry, setDraggedEntry] = useState<{
    sectionId: string;
    entryId: string;
  } | null>(null);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Track which sections have data
  const [filledSections, setFilledSections] = useState<Set<string>>(new Set());

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const updateCustomSections = (customSections: CustomSection[]) => {
    onChange({ ...data, customSections });
  };

  // Check if a section has any data
  const hasSectionData = (sectionName: string): boolean => {
    switch(sectionName) {
      case "teachingExperience": return (data.teachingExperience?.length || 0) > 0;
      case "mentorshipExperience": return (data.mentorshipExperience?.length || 0) > 0;
      case "researchGrants": return (data.researchGrants?.length || 0) > 0;
      case "testScores": return (data.testScores?.length || 0) > 0;
      case "publications": return (data.publications?.length || 0) > 0;
      case "patents": return (data.patents?.length || 0) > 0;
      case "languages": return (data.languages?.length || 0) > 0;
      case "keyAchievements": return (data.keyAchievements?.length || 0) > 0;
      case "responsibilities": return (data.responsibilities?.length || 0) > 0;
      case "references": return (data.references?.length || 0) > 0;
      case "socialProfiles": return (data.socialProfiles?.length || 0) > 0;
      case "availabilityWorkAuth": return data.availabilityWorkAuth ? Object.keys(data.availabilityWorkAuth).length > 0 : false;
      case "certifications": return (data.certifications?.length || 0) > 0;
      case "awards": return (data.awards?.length || 0) > 0;
      case "speakingEngagements": return (data.speakingEngagements?.length || 0) > 0;
      case "memberships": return (data.memberships?.length || 0) > 0;
      case "workshops": return (data.workshops?.length || 0) > 0;
      case "clientProjects": return (data.clientProjects?.length || 0) > 0;
      case "portfolio": return (data.portfolio?.length || 0) > 0;
      case "toolsTechnologies": return (data.toolsTechnologies?.length || 0) > 0;
      case "methodologies": return (data.methodologies?.length || 0) > 0;
      case "industryExpertise": return (data.industryExpertise?.length || 0) > 0;
      case "volunteering": return (data.volunteering?.length || 0) > 0;
      case "militaryService": return (data.militaryService?.length || 0) > 0;
      default: return false;
    }
  };

  // Update filled sections whenever data changes
  useEffect(() => {
    const newFilledSections = new Set<string>();
    
    const allSections = [
      "teachingExperience", "mentorshipExperience", "researchGrants", 
      "testScores", "publications", "patents", "languages",
      "keyAchievements", "responsibilities", "references", 
      "socialProfiles", "availabilityWorkAuth", "certifications", 
      "awards", "speakingEngagements", "memberships", "workshops",
      "clientProjects", "portfolio", "toolsTechnologies", 
      "methodologies", "industryExpertise", "volunteering", "militaryService"
    ];
    
    allSections.forEach(section => {
      if (hasSectionData(section)) {
        newFilledSections.add(section);
      }
    });
    
    setFilledSections(newFilledSections);
  }, [data]);

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: generateId(),
      heading: "",
      entries: [],
      isVisible: true,
    };
    updateCustomSections([...(data.customSections || []), newSection]);
  };

  const updateSectionHeading = (sectionId: string, heading: string) => {
    const updatedSections = (data.customSections || []).map((section) =>
      section.id === sectionId ? { ...section, heading } : section
    );
    updateCustomSections(updatedSections);
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const updatedSections = (data.customSections || []).map((section) =>
      section.id === sectionId
        ? { ...section, isVisible: !section.isVisible }
        : section
    );
    updateCustomSections(updatedSections);
  };

  const deleteSection = (sectionId: string) => {
    const updatedSections = (data.customSections || []).filter(
      (section) => section.id !== sectionId
    );
    updateCustomSections(updatedSections);
  };

  const addEntryToSection = (sectionId: string) => {
    const newEntry: CustomSectionEntry = {
      id: generateId(),
      title: "",
      organization: "",
      date: "",
      description: "",
      isVisible: true,
    };

    const updatedSections = (data.customSections || []).map((section) =>
      section.id === sectionId
        ? { ...section, entries: [...section.entries, newEntry] }
        : section
    );
    updateCustomSections(updatedSections);
  };

  const updateEntry = (
    sectionId: string,
    entryId: string,
    field: keyof CustomSectionEntry,
    value: any
  ) => {
    const updatedSections = (data.customSections || []).map((section) =>
      section.id === sectionId
        ? {
            ...section,
            entries: section.entries.map((entry) =>
              entry.id === entryId ? { ...entry, [field]: value } : entry
            ),
          }
        : section
    );
    updateCustomSections(updatedSections);
  };

  const toggleEntryVisibility = (sectionId: string, entryId: string) => {
    const updatedSections = (data.customSections || []).map((section) =>
      section.id === sectionId
        ? {
            ...section,
            entries: section.entries.map((entry) =>
              entry.id === entryId
                ? { ...entry, isVisible: !entry.isVisible }
                : entry
            ),
          }
        : section
    );
    updateCustomSections(updatedSections);
  };

  const deleteEntry = (sectionId: string, entryId: string) => {
    const updatedSections = (data.customSections || []).map((section) =>
      section.id === sectionId
        ? {
            ...section,
            entries: section.entries.filter((entry) => entry.id !== entryId),
          }
        : section
    );
    updateCustomSections(updatedSections);
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    const sections = [...(data.customSections || [])];
    const [movedSection] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, movedSection);
    updateCustomSections(sections);
  };

  const moveEntry = (sectionId: string, fromIndex: number, toIndex: number) => {
    const updatedSections = (data.customSections || []).map((section) =>
      section.id === sectionId
        ? {
            ...section,
            entries: (() => {
              const entries = [...section.entries];
              const [movedEntry] = entries.splice(fromIndex, 1);
              entries.splice(toIndex, 0, movedEntry);
              return entries;
            })(),
          }
        : section
    );
    updateCustomSections(updatedSections);
  };

  const handleDragStart = (
    e: React.DragEvent,
    type: "section" | "entry",
    id: string,
    sectionId?: string
  ) => {
    if (type === "section") {
      setDraggedSection(id);
    } else {
      setDraggedEntry({ sectionId: sectionId!, entryId: id });
    }
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    const isInteractiveElement =
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.isContentEditable ||
      target.closest('input, textarea, select, [contenteditable="true"]');

    if (!isInteractiveElement) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    type: "section" | "entry",
    targetId: string,
    sectionId?: string
  ) => {
    e.preventDefault();

    if (type === "section" && draggedSection) {
      const fromIndex = (data.customSections || []).findIndex(
        (s) => s.id === draggedSection
      );
      const toIndex = (data.customSections || []).findIndex(
        (s) => s.id === targetId
      );
      if (fromIndex !== -1 && toIndex !== -1) {
        moveSection(fromIndex, toIndex);
      }
      setDraggedSection(null);
    } else if (type === "entry" && draggedEntry && sectionId) {
      const section = (data.customSections || []).find(
        (s) => s.id === sectionId
      );
      if (section) {
        const fromIndex = section.entries.findIndex(
          (e) => e.id === draggedEntry.entryId
        );
        const toIndex = section.entries.findIndex((e) => e.id === targetId);
        if (fromIndex !== -1 && toIndex !== -1) {
          moveEntry(sectionId, fromIndex, toIndex);
        }
      }
      setDraggedEntry(null);
    }
  };

  // Predefined section groups with icons
  const sectionGroups = [
    {
      id: "personal",
      title: "Personal & Administrative",
      icon: <Users className="w-4 h-4" />,
      color: "blue",
      sections: [
        { name: "References", form: "references" },
        { name: "Social Profiles", form: "socialProfiles" },
        { name: "Availability & Work Auth", form: "availabilityWorkAuth" },
      ]
    },
    {
      id: "career",
      title: "Career Enhancers",
      icon: <Award className="w-4 h-4" />,
      color: "amber",
      sections: [
        { name: "Certifications", form: "certifications" },
        { name: "Awards", form: "awards" },
        { name: "Speaking Engagements", form: "speakingEngagements" },
        { name: "Memberships", form: "memberships" },
        { name: "Workshops", form: "workshops" },
      ]
    },
    {
      id: "projects",
      title: "Projects & Domain Work",
      icon: <Briefcase className="w-4 h-4" />,
      color: "purple",
      sections: [
        { name: "Client Projects", form: "clientProjects" },
        { name: "Portfolio", form: "portfolio" },
      ]
    },
    {
      id: "technical",
      title: "Technical Expertise",
      icon: <Wrench className="w-4 h-4" />,
      color: "green",
      sections: [
        { name: "Tools & Technologies", form: "toolsTechnologies" },
        { name: "Methodologies", form: "methodologies" },
        { name: "Industry Expertise", form: "industryExpertise" },
      ]
    },
    {
      id: "volunteering",
      title: "Volunteering & Service",
      icon: <Heart className="w-4 h-4" />,
      color: "red",
      sections: [
        { name: "Volunteering", form: "volunteering" },
        { name: "Military Service", form: "militaryService" },
      ]
    },
    {
      id: "languages",
      title: "Languages",
      icon: <Globe className="w-4 h-4" />,
      color: "blue",
      sections: [
        { name: "Languages", form: "languages" },
      ]
    },
    {
      id: "academic",
      title: "Academic & Research",
      icon: <GraduationCap className="w-4 h-4" />,
      color: "purple",
      sections: [
        { name: "Teaching Experience", form: "teachingExperience" },
        { name: "Mentorship", form: "mentorshipExperience" },
        { name: "Research Grants", form: "researchGrants" },
        { name: "Test Scores", form: "testScores" },
        { name: "Publications", form: "publications" },
        { name: "Patents", form: "patents" },
      ]
    }
  ];

  // Filter sections based on search
  const filteredGroups = sectionGroups
    .map(group => ({
      ...group,
      sections: group.sections.filter(section => 
        section.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(group => group.sections.length > 0)
    .filter(group => !selectedGroup || group.id === selectedGroup);

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 ">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Add-On Sections
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enhance your resume with additional sections
            </p>
          </div>
        </div>
      </div>

      {/* Custom Sections Display */}
      {(data.customSections || []).length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Custom Sections
            </h2>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
              {data.customSections?.length} section{data.customSections?.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {(data.customSections || []).map((section, sectionIndex) => (
              <SectionCard
                key={section.id}
                title={section.heading || "Untitled Section"}
                description={`${section.entries.length} items`}
                icon={<FolderOpen className="w-4 h-4" />}
                color="blue"
                badge={section.isVisible ? "Visible" : "Hidden"}
              >
                {/* Section Controls */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="cursor-move" draggable onDragStart={(e) => handleDragStart(e, "section", section.id)}>
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Section Heading"
                    value={section.heading}
                    onChange={(e) => updateSectionHeading(section.id, e.target.value)}
                    className="flex-1 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:border-blue-500 transition-all"
                    style={{ focusRingColor: `${THEME.primary}20` }}
                  />
                  <button
                    onClick={() => toggleSectionVisibility(section.id)}
                    className={`p-1 rounded transition-colors ${
                      section.isVisible
                        ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                        : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteSection(section.id)}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Section Entries */}
                <div className="space-y-2">
                  {section.entries.map((entry, entryIndex) => (
                    <SectionEntry
                      key={entry.id}
                      entry={entry}
                      index={entryIndex}
                      sectionId={section.id}
                      sectionHeading={section.heading}
                      onUpdate={(field, value) => updateEntry(section.id, entry.id, field, value)}
                      onToggleVisibility={() => toggleEntryVisibility(section.id, entry.id)}
                      onDelete={() => deleteEntry(section.id, entry.id)}
                      onDragStart={(e) => handleDragStart(e, "entry", entry.id, section.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, "entry", entry.id, section.id)}
                      resumeId={resumeId}
                    />
                  ))}
                </div>

                <button
                  onClick={() => addEntryToSection(section.id)}
                  className="mt-3 w-full py-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-1"
                  style={{ hoverBorderColor: THEME.primary, hoverColor: THEME.primary }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </SectionCard>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-500 transition-all"
            style={{ focusRingColor: `${THEME.primary}20` }}
          />
        </div>

        <select
          value={selectedGroup || ''}
          onChange={(e) => setSelectedGroup(e.target.value || null)}
          className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-500 transition-all"
          style={{ focusRingColor: `${THEME.primary}20` }}
        >
          <option value="">All Groups</option>
          {sectionGroups.map(group => (
            <option key={group.id} value={group.id}>{group.title}</option>
          ))}
        </select>
      </div>

      {/* Section Groups */}
      <div className="space-y-3">
        {filteredGroups.map((group) => (
          <SectionGroup
            key={group.id}
            group={group}
            filledSections={filledSections}
            onNavigate={(form) => onNavigateToSection?.(form)}
          />
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">No sections found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 rounded-lg text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          style={{ 
            background: THEME.primaryGradient,
            boxShadow: `0 4px 12px ${THEME.primaryGlow}`
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = `0 8px 20px ${THEME.primary}`;
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = `0 4px 12px ${THEME.primaryGlow}`;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span>Generate Resume</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}