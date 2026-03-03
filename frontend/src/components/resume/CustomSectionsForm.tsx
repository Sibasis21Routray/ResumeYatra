import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "../editor/RichTextEditor";
import { AutoSuggestionPanel } from "../editor/AutoSuggestionPanel";
import { MonthYearPicker } from "./MonthYearPicker";
import { ResumeData } from "../../stores/resumeStore";
import { CheckCircle } from "lucide-react";

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

  // Track which sections have data
  const [filledSections, setFilledSections] = useState<Set<string>>(new Set());

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const updateCustomSections = (customSections: CustomSection[]) => {
    onChange({ ...data, customSections });
  };

  // Check if a section has any data
  const hasSectionData = (sectionName: string): boolean => {
    switch(sectionName) {
      // Academic & Research
      case "teachingExperience":
        return (data.teachingExperience?.length || 0) > 0;
      case "mentorshipExperience":
        return (data.mentorshipExperience?.length || 0) > 0;
      case "researchGrants":
        return (data.researchGrants?.length || 0) > 0;
      case "testScores":
        return (data.testScores?.length || 0) > 0;
      case "publications":
        return (data.publications?.length || 0) > 0;
      case "patents":
        return (data.patents?.length || 0) > 0;
      
      // Languages
      case "languages":
        return (data.languages?.length || 0) > 0;
      
      // Key Achievements & Responsibilities
      case "keyAchievements":
        return (data.keyAchievements?.length || 0) > 0;
      case "responsibilities":
        return (data.responsibilities?.length || 0) > 0;
      
      // References & Social
      case "references":
        return (data.references?.length || 0) > 0;
      case "socialProfiles": // Changed from "socialLinks" to match the form name
        return (data.socialProfiles?.length || 0) > 0;
      case "availabilityWorkAuth": // Added this case
        return data.availabilityWorkAuth ? Object.keys(data.availabilityWorkAuth).length > 0 : false;
      
      // Career Enhancers
      case "certifications":
        return (data.certifications?.length || 0) > 0;
      case "awards":
        return (data.awards?.length || 0) > 0;
      case "speakingEngagements":
        return (data.speakingEngagements?.length || 0) > 0;
      case "memberships":
        return (data.memberships?.length || 0) > 0;
      case "workshops":
        return (data.workshops?.length || 0) > 0;
      
      // Projects & Domain Work
      case "clientProjects":
        return (data.clientProjects?.length || 0) > 0;
      case "portfolio":
        return (data.portfolio?.length || 0) > 0;
      
      // Technical Expertise
      case "toolsTechnologies":
        return (data.toolsTechnologies?.length || 0) > 0;
      case "methodologies":
        return (data.methodologies?.length || 0) > 0;
      case "industryExpertise":
        return (data.industryExpertise?.length || 0) > 0;
      
      // Volunteering & Service
      case "volunteering":
        return (data.volunteering?.length || 0) > 0;
      case "militaryService":
        return (data.militaryService?.length || 0) > 0;
      
      default:
        return false;
    }
  };

  // Update filled sections whenever data changes
  useEffect(() => {
    const newFilledSections = new Set<string>();
    
    // Check all section types
    const allSections = [
      // Academic & Research
      "teachingExperience", "mentorshipExperience", "researchGrants", 
      "testScores", "publications", "patents",
      
      // Languages
      "languages",
      
      // Key Achievements & Responsibilities
      "keyAchievements", "responsibilities",
      
      // References & Social
      "references", "socialProfiles", "availabilityWorkAuth", // Updated these
      
      // Career Enhancers
      "certifications", "awards", "speakingEngagements",
      "memberships", "workshops",
      
      // Projects & Domain Work
      "clientProjects", "portfolio",
      
      // Technical Expertise
      "toolsTechnologies", "methodologies", "industryExpertise",
      
      // Volunteering & Service
      "volunteering", "militaryService"
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

  // Predefined section groups (with Group F removed)
  const sectionGroups = [
    {
      title: "Group A — Personal & Administrative",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      sections: [
        { name: "References", form: "references" },
        { name: "Social Profiles", form: "socialProfiles" },
        { name: "Availability & Work Authorization", form: "availabilityWorkAuth" },
      ]
    },
    {
      title: "Group B — Career Enhancers",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      sections: [
        { name: "Certifications", form: "certifications" },
        { name: "Awards", form: "awards" },
        { name: "Speaking Engagements", form: "speakingEngagements" },
        { name: "Memberships & Affiliations", form: "memberships" },
        { name: "Workshops & Seminars", form: "workshops" },
      ]
    },
    {
      title: "Group C — Projects & Domain Work",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      ),
      sections: [
        { name: "Client Projects", form: "clientProjects" },
        { name: "Portfolio", form: "portfolio" },
      ]
    },
    {
      title: "Group D — Technical Expertise & Tools",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      sections: [
        { name: "Tools & Technologies", form: "toolsTechnologies" },
        { name: "Methodologies", form: "methodologies" },
        { name: "Industry Expertise", form: "industryExpertise" },
      ]
    },
    {
      title: "Group E — Volunteering & Service",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      sections: [
        { name: "Volunteering", form: "volunteering" },
        { name: "Military Service", form: "militaryService" },
      ]
    },
    {
      title: "Group F — Languages",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      sections: [
        { name: "Languages", form: "languages" },
      ]
    },
    {
      title: "Group G — Academic & Research",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
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

  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-[#04477E] to-[#0a5a9e] rounded-xl p-6 mb-6 shadow-lg">
        <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
        <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Add-On Section Panel</h3>
            <div className="text-white/80 text-sm">
              Enhance your resume with additional sections
            </div>
          </div>
          <div className="mt-3 sm:mt-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <span className="text-white text-sm font-medium">
                {filledSections.size} Section{filledSections.size !== 1 ? 's' : ''} Filled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Sections Display */}
      <div className="space-y-6 mb-8">
        {(data.customSections || []).map((section, sectionIndex) => (
          <div
            key={section.id}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            draggable
            onDragStart={(e) => handleDragStart(e, "section", section.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "section", section.id)}
          >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-[#04477E] to-[#0a5a9e] px-4 sm:px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="cursor-move text-white/80 hover:text-white">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8h16M4 16h16"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Publications, Volunteer Work, Awards"
                    value={section.heading}
                    onChange={(e) =>
                      updateSectionHeading(section.id, e.target.value)
                    }
                    className="bg-transparent border-none text-white placeholder-white/70 font-semibold text-base sm:text-lg focus:outline-none w-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSectionVisibility(section.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      section.isVisible
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                    title={section.isVisible ? "Hide section" : "Show section"}
                  >
                    {section.isVisible ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => deleteSection(section.id)}
                    className="p-1.5 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white rounded-lg transition-colors"
                    title="Delete section"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Section Body */}
            <div className="p-4 sm:p-6">
              {/* Section Entries */}
              <div className="space-y-4">
                {section.entries.map((entry, entryIndex) => (
                  <div
                    key={entry.id}
                    className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, "entry", entry.id, section.id)
                    }
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "entry", entry.id, section.id)}
                  >
                    {/* Entry Number Badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#04477E] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                      {entryIndex + 1}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="cursor-move text-gray-400 hover:text-gray-600">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 8h16M4 16h16"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() =>
                            toggleEntryVisibility(section.id, entry.id)
                          }
                          className={`p-1.5 rounded transition-colors ${
                            entry.isVisible
                              ? "text-green-600 hover:bg-green-100"
                              : "text-gray-400 hover:bg-gray-200"
                          }`}
                          title={entry.isVisible ? "Hide entry" : "Show entry"}
                        >
                          {entry.isVisible ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => deleteEntry(section.id, entry.id)}
                          className="p-1.5 text-red-500 hover:bg-red-100 rounded transition-colors"
                          title="Delete entry"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={section.heading === "Certifications" ? "Certification Name" : section.heading === "Awards" ? "Award Title" : "Title / Role"}
                          value={entry.title || ""}
                          onChange={(e) =>
                            updateEntry(
                              section.id,
                              entry.id,
                              "title",
                              e.target.value
                            )
                          }
                          className="w-full px-3 sm:px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04477E] focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={section.heading === "Certifications" || section.heading === "Awards" ? "Issuing Organization" : "Organization / Platform"}
                          value={entry.organization || ""}
                          onChange={(e) =>
                            updateEntry(
                              section.id,
                              entry.id,
                              "organization",
                              e.target.value
                            )
                          }
                          className="w-full px-3 sm:px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04477E] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {section.heading === "Certifications" || section.heading === "Awards" ? "Issue Year" : "Date"}
                      </label>
                      <MonthYearPicker
                        value={entry.date || ""}
                        onChange={(value) =>
                          updateEntry(section.id, entry.id, "date", value)
                        }
                        placeholder={section.heading === "Certifications" || section.heading === "Awards" ? "Select year" : "Select month & year"}
                        className="w-full"
                        endYear={new Date().getFullYear()}
                      />
                    </div>

                    <div className="mb-2">
                      <RichTextEditor
                        value={entry.description || ""}
                        onChange={(value) =>
                          updateEntry(section.id, entry.id, "description", value)
                        }
                        placeholder={section.heading === "Certifications" || section.heading === "Awards" ? "Description" : "Describe your responsibilities, achievements, or details. Use bullet points for better readability."}
                      />
                      {resumeId && (
                        <AutoSuggestionPanel
                          text={entry.description || ""}
                          onTextChange={(newText) =>
                            updateEntry(
                              section.id,
                              entry.id,
                              "description",
                              newText
                            )
                          }
                          context="experience"
                          resumeId={resumeId}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addEntryToSection(section.id)}
                className="mt-4 w-full bg-gradient-to-r from-[#04477E] to-[#0a5a9e] text-white px-4 py-2.5 rounded-lg hover:from-[#033b66] hover:to-[#0956a8] transition-all shadow-md hover:shadow-lg text-sm font-medium flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Another Item</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Predefined Section Groups */}
      <div className="space-y-6">
        {sectionGroups.map((group) => (
          <div key={group.title}>
            <div className="flex items-center space-x-2 mb-3">
              <div className="text-[#04477E]">
                {group.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-600 dark:text-gray-400">
                {group.title}
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.sections.map((section) => {
                const isFilled = filledSections.has(section.form);
                
                return (
                  <button
                    key={section.name}
                    onClick={() => {
                      console.log("Navigating to section:", section.form);
                      if (onNavigateToSection) {
                        onNavigateToSection(section.form);
                      }
                    }}
                    className={`group relative px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 border rounded-lg hover:border-[#04477E] dark:hover:border-[#0a5a9e] hover:shadow-md transition-all text-left ${
                      isFilled 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isFilled 
                            ? 'bg-green-500 text-white' 
                            : 'bg-[#04477E]/10 group-hover:bg-[#04477E]/20'
                        }`}>
                          {isFilled ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <svg className="w-4 h-4 text-[#04477E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${
                          isFilled 
                            ? 'text-green-700 dark:text-green-400' 
                            : 'text-gray-700 dark:text-gray-300 group-hover:text-[#04477E] dark:group-hover:text-[#0a5a9e]'
                        } transition-colors`}>
                          {section.name}
                        </span>
                      </div>
                      {isFilled && (
                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full ml-2">
                          Added
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between items-center mt-8 sm:mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all text-sm sm:text-base"
        >
          <span className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </span>
        </button>
        <button
          onClick={() => {
            if (onNavigateToSection) {
              onNavigateToSection("customSections");
            }
          }}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#04477E] to-[#0a5a9e] text-white font-bold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base hover:from-[#033b66] hover:to-[#0956a8]"
        >
          <span className="flex items-center space-x-2">
            <span>Continue</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}