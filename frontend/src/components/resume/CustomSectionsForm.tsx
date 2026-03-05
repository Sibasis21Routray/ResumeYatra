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

// Section Card Component
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
    blue: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800",
    green: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800",
    purple: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800",
    amber: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800",
    red: "from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-200 dark:border-red-800"
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} rounded-xl border shadow-sm overflow-hidden`}>
      <div className="px-5 py-4 border-b border-inherit bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="text-gray-700 dark:text-gray-300">{icon}</div>}
            <div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {title}
                {badge && (
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </h4>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};

// Section Entry Component
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
      className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm hover:shadow-md mb-3"
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Drag Handle */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Entry Header */}
      <div className="flex items-center justify-between pl-8 pr-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
            {index + 1}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {entry.title || `New ${sectionHeading.slice(0, -1) || 'Entry'}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleVisibility}
            className={`p-1.5 rounded-lg transition-colors ${
              entry.isVisible
                ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {entry.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={placeholders.title}
              value={entry.title || ""}
              onChange={(e) => onUpdate("title", e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
            
            {placeholders.org && (
              <input
                type="text"
                placeholder={placeholders.org}
                value={entry.organization || ""}
                onChange={(e) => onUpdate("organization", e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
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
        <div className="px-4 pb-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {entry.description.replace(/<[^>]*>/g, '').substring(0, 100)}
          {entry.description.length > 100 ? '...' : ''}
        </div>
      )}
    </div>
  );
};

// Section Group Component
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
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-blue-600 dark:text-blue-400">
            {group.icon}
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {group.title}
          </h4>
          <span className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
            {group.sections.filter((s: any) => filledSections.has(s.form)).length}/{group.sections.length}
          </span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {group.sections.map((section: any) => {
            const isFilled = filledSections.has(section.form);
            
            return (
              <button
                key={section.name}
                onClick={() => onNavigate(section.form)}
                className={`group relative p-4 rounded-xl border-2 transition-all text-left ${
                  isFilled 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isFilled 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:text-blue-600'
                  } transition-colors`}>
                    {isFilled ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </div>
                  {isFilled && (
                    <span className="text-xs bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-2 py-1 rounded-full">
                      Added
                    </span>
                  )}
                </div>
                
                <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                  {section.name}
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {getSectionDescription(section.form)}
                </p>
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

// Stats Card Component
const StatsCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-600",
    green: "bg-green-50 dark:bg-green-950/30 text-green-600",
    purple: "bg-purple-50 dark:bg-purple-950/30 text-purple-600",
    amber: "bg-amber-50 dark:bg-amber-950/30 text-amber-600"
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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

  const addPredefinedCustomSection = (heading: string, subsections: string[]) => {
    const newSection: CustomSection = {
      id: generateId(),
      heading,
      entries: subsections.map(sub => ({
        id: generateId(),
        title: sub,
        organization: "",
        date: "",
        description: "",
        isVisible: true,
      })),
      isVisible: true,
    };
    updateCustomSections([...(data.customSections || []), newSection]);
  };

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
      icon: <Users className="w-5 h-5" />,
      color: "blue",
      sections: [
        { name: "References", form: "references" },
        { name: "Social Profiles", form: "socialProfiles" },
        { name: "Availability & Work Authorization", form: "availabilityWorkAuth" },
      ]
    },
    {
      id: "career",
      title: "Career Enhancers",
      icon: <Award className="w-5 h-5" />,
      color: "amber",
      sections: [
        { name: "Certifications", form: "certifications" },
        { name: "Awards", form: "awards" },
        { name: "Speaking Engagements", form: "speakingEngagements" },
        { name: "Memberships & Affiliations", form: "memberships" },
        { name: "Workshops & Seminars", form: "workshops" },
      ]
    },
    {
      id: "projects",
      title: "Projects & Domain Work",
      icon: <Briefcase className="w-5 h-5" />,
      color: "purple",
      sections: [
        { name: "Client Projects", form: "clientProjects" },
        { name: "Portfolio", form: "portfolio" },
      ]
    },
    {
      id: "technical",
      title: "Technical Expertise",
      icon: <Wrench className="w-5 h-5" />,
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
      icon: <Heart className="w-5 h-5" />,
      color: "red",
      sections: [
        { name: "Volunteering", form: "volunteering" },
        { name: "Military Service", form: "militaryService" },
      ]
    },
    {
      id: "languages",
      title: "Languages",
      icon: <Globe className="w-5 h-5" />,
      color: "blue",
      sections: [
        { name: "Languages", form: "languages" },
      ]
    },
    {
      id: "academic",
      title: "Academic & Research",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "purple",
      sections: [
        { name: "Teaching Experience", form: "teachingExperience" },
        { name: "Mentorship Experience", form: "mentorshipExperience" },
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

  const totalSections = sectionGroups.reduce((acc, group) => acc + group.sections.length, 0);
  const completedSections = filledSections.size;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-accent dark:text-white mb-2">
              Add-On Sections
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Enhance your resume with additional sections that showcase your complete profile
            </p>
          </div>
          
          {/* <button
            onClick={addCustomSection}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create Custom Section</span>
          </button> */}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard 
            icon={<FileText className="w-5 h-5" />}
            label="Total Sections"
            value={totalSections}
            color="blue"
          />
          <StatsCard 
            icon={<CheckCircle className="w-5 h-5" />}
            label="Completed"
            value={completedSections}
            color="green"
          />
          <StatsCard 
            icon={<Sparkles className="w-5 h-5" />}
            label="Remaining"
            value={totalSections - completedSections}
            color="purple"
          />
          {/* <StatsCard 
            icon={<FolderOpen className="w-5 h-5" />}
            label="Custom Sections"
            value={data.customSections?.length || 0}
            color="amber"
          /> */}
        </div>


      </div>

      {/* Custom Sections Display */}
      {(data.customSections || []).length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Custom Sections
            </h2>
            <span className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full">
              {data.customSections?.length} section{data.customSections?.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-4">
            {(data.customSections || []).map((section, sectionIndex) => (
              <SectionCard
                key={section.id}
                title={section.heading || "Untitled Section"}
                description={`${section.entries.length} item${section.entries.length !== 1 ? 's' : ''}`}
                icon={<FolderOpen className="w-5 h-5" />}
                color="blue"
                badge={section.isVisible ? "Visible" : "Hidden"}
              >
                {/* Section Controls */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="cursor-move" draggable onDragStart={(e) => handleDragStart(e, "section", section.id)}>
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Section Heading (e.g., Publications, Awards)"
                      value={section.heading}
                      onChange={(e) => updateSectionHeading(section.id, e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSectionVisibility(section.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        section.isVisible
                          ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                          : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Section Entries */}
                <div className="space-y-3">
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
                  className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Item to Section</span>
                </button>
              </SectionCard>
            ))}
          </div>
        </div>
      )}

      {/* Section Groups Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Available Sections
          </h2>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
              />
            </div>

            {/* Filter */}
            <select
              value={selectedGroup || ''}
              onChange={(e) => setSelectedGroup(e.target.value || null)}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">All Groups</option>
              {sectionGroups.map(group => (
                <option key={group.id} value={group.id}>{group.title}</option>
              ))}
            </select>

            
          </div>
        </div>
      </div>

      {/* Section Groups */}
      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <SectionGroup
            key={group.id}
            group={group}
            filledSections={filledSections}
            onNavigate={(form) => onNavigateToSection?.(form)}
          />
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No sections found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        {/* <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all flex items-center gap-2"
        >
          <span>← Back</span>
        </button> */}

        <button
          onClick={() => navigate("/dashboard")}
          className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <span>Generate Resume</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}