import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useResumeStore, useUIStore } from "../../stores";
import { resumeAPI } from "../../services/apiClient";
import { Heading } from "../resume/Heading";
import { EducationForm } from "../resume/EducationForm";
import { AcademicCampusExperienceForm } from "../resume/AcademicCampusExperienceForm";
import ExperienceForm from "../resume/ExperienceForm";
import { InternshipsForm } from "../resume/InternshipsForm";
import { AcademicProjectsForm } from "../resume/AcademicProjectsForm";
import { LeadershipPositionsForm } from "../resume/LeadershipPositionsForm";
import { TrainingProgramsForm } from "../resume/TrainingProgramsForm";
import { ScholarshipsForm } from "../resume/ScholarshipsForm";
import { CoCurricularForm } from "../resume/CoCurricularForm";
import { ExtracurricularForm } from "../resume/ExtracurricularForm";
import { HobbiesForm } from "../resume/HobbiesForm";
import { SkillsForm } from "../resume/SkillsForm";
import { CareerObjectiveForm } from "../resume/CareerObjectiveForm";
import { ProfessionalContextForm } from "../resume/ProfessionalContextForm";
import { IndustryForm } from "../resume/IndustryForm";
import { GeographicScopeForm } from "../resume/GeographicScopeForm";
import { RevenueForm } from "../resume/RevenueForm";
import { DomainForm } from "../resume/DomainForm";
import { SummaryForm } from "../resume/SummaryForm";
import { ProjectsForm } from "../resume/ProjectsForm";
import { CustomSectionsForm } from "../resume/CustomSectionsForm";
import { SocialLinksForm } from "../resume/SocialLinksForm";
import { CareerEnhancerForm } from "../resume/CareerEnhancerForm";
import { ProjectsDomainWorkForm } from "../resume/ProjectsDomainWorkForm";
import { VolunteeringServiceForm } from "../resume/VolunteeringServiceForm";
import { TechnicalEnrichmentForm } from "../resume/TechnicalEnrichmentForm";
import { PersonalUtilityForm } from "../resume/PersonalUtilityForm";
import { StudentsEarlyCareerForm } from "../resume/StudentsEarlyCareerForm";
import { AcademicResearchForm } from "../resume/AcademicResearchForm";
import { CertificationsForm } from "../resume/CertificationsForm";
import { AwardsForm } from "../resume/AwardsForm";
import { SpeakingEngagementsForm } from "../resume/SpeakingEngagementsForm";
import { MembershipsForm } from "../resume/MembershipsForm";
import { WorkshopsForm } from "../resume/WorkshopsForm";
import { ClientProjectsForm } from "../resume/ClientProjectsForm";
import { PortfolioForm } from "../resume/PortfolioForm";
import { VolunteeringForm } from "../resume/VolunteeringForm";
import { MilitaryServiceForm } from "../resume/MilitaryServiceForm";
import { ToolsTechnologiesForm } from "../resume/ToolsTechnologiesForm";
import { MethodologiesForm } from "../resume/MethodologiesForm";
import { IndustryExpertiseForm } from "../resume/IndustryExpertiseForm";
import { ReferencesForm } from "../resume/ReferencesForm";
import { SocialProfilesForm } from "../resume/SocialProfilesForm";
import { AvailabilityWorkAuthForm } from "../resume/AvailabilityWorkAuthForm";
import { TestScoresForm } from "../resume/TestScoresForm";
import { PatentsForm } from "../resume/PatentsForm";
import { PublicationsForm } from "../resume/PublicationsForm";
import { TeachingExperienceForm } from "../resume/TeachingExperienceForm";
import { MentorshipExperienceForm } from "../resume/MentorshipExperienceForm";
import { ResearchGrantsForm } from "../resume/ResearchGrantsForm";
import { ResumeData } from "../../stores/resumeStore";
import AISuggestionPanel from "./AISuggestionPanel";
import { LanguagesForm } from "../resume/LanguagesForm";

// Full Screen Loader Component
const FullScreenLoader = ({ message = "Processing..." }: { message?: string }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-md mx-4">
        <div className="relative">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          {/* Optional: Add a logo or icon in the center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-accent/10 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-1">
            {message}
          </h3>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Please wait while we process your request...
          </p>
        </div>

        {/* Progress bar (optional) */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
          <div className="bg-accent h-2 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

// Valid editor sections - including new academic campus experience section
export const VALID_SECTIONS = [
  "personal",
  "careerObjective",
  "summary",
  "education",
  "academicCampus",
  "professionalContext",
  "industry",
  "domain",
  "geographicScope",
  "revenue",
  "internship",
  "academicProject",
  "leadershipPosition",
  "trainingProgram",
  "scholarship",
  "coCurricular",
  "extraCurricular",
  "hobbies",
  "experience",
  "skills",
  "projects",
  "socialLinks",
  "customSections",
  "careerEnhancer",
  "projectsDomainWork",
  "volunteeringService",
  "technicalEnrichment",
  "personalUtility",
  "studentsEarlyCareer",
  "academicResearch",
  // Sub-sections for career enhancer
  "certifications",
  "awards",
  "speakingEngagements",
  "memberships",
  "workshops",
  // Sub-sections for projects domain work
  "clientProjects",
  "portfolio",
  // Sub-sections for volunteering service
  "volunteering",
  "militaryService",
  // Sub-sections for technical enrichment
  "toolsTechnologies",
  "methodologies",
  "industryExpertise",
  // Sub-sections for personal utility
  "references",
  "socialProfiles",
  "availabilityWorkAuth",
  // Sub-sections for academic research
  "testScores",
  "patents",
  "publications",
  "teachingExperience",
  "mentorshipExperience",
  "researchGrants",
  "languages"
] as const;

export type ValidSectionType = (typeof VALID_SECTIONS)[number];

// Helper function to check if a section is valid
export const isValidSection = (
  section: string
): section is ValidSectionType => {
  return VALID_SECTIONS.includes(section as ValidSectionType);
};

// Helper function to get a valid section or default
export const getValidSection = (section: string): ValidSectionType => {
  if (isValidSection(section)) {
    return section;
  }
  return "personal";
};

export function EditorPanel({ sidebarOpen }: { sidebarOpen: boolean }) {
  const { id: resumeId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, updateData, save } = useResumeStore();

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Processing...");

  // Callback to apply AI content to new items (not yet in store)
  const [onApplyAIContentCallback, setOnApplyAIContentCallback] = useState<
    ((aiContent: string) => void) | null
  >(null);

  const {
    selectedSection,
    setSelectedSection,
    aiImproving,
    setAiImproving,
    completedSections,
    markSectionCompleted,
    uploadCompleted,
    previewUrl,
    previewLoading,
  } = useUIStore();

  // AI Suggestion state
  const [aiContent, setAiContent] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const [currentItemData, setCurrentItemData] = useState<any>(null);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const lastSelectedSectionRef = useRef<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sections configuration - including academic campus experience section
  const sections = useMemo(
    () => [
      { id: "personal", label: "Heading", component: Heading },
      { id: "careerObjective", label: "Career Objective", component: CareerObjectiveForm },
      { id: "summary", label: "Summary", component: SummaryForm },
      { id: "education", label: "Education", component: EducationForm },
      { id: "academicCampus", label: "Academic & Campus Experience", component: AcademicCampusExperienceForm },
      { id: "experience", label: "Experience", component: ExperienceForm },
      { id: "professionalContext", label: "Professional Context", component: ProfessionalContextForm },
      { id: "industry", label: "Industry", component: IndustryForm },
      { id: "domain", label: "Domain", component: DomainForm },
      { id: "geographicScope", label: "Geographic Scope", component: GeographicScopeForm },
      { id: "revenue", label: "Revenue Responsibility", component: RevenueForm },
      { id: "internship", label: "Internship", component: InternshipsForm },
      { id: "academicProject", label: "Academic Project", component: AcademicProjectsForm },
      { id: "leadershipPosition", label: "Leadership Position", component: LeadershipPositionsForm },
      { id: "trainingProgram", label: "Training Program", component: TrainingProgramsForm },
      { id: "scholarship", label: "Scholarship", component: ScholarshipsForm },
      { id: "coCurricular", label: "Co-curricular", component: CoCurricularForm },
      { id: "extraCurricular", label: "Extra-curricular", component: ExtracurricularForm },
      { id: "hobbies", label: "Hobbies", component: HobbiesForm },
      { id: "skills", label: "Skills", component: SkillsForm },
      { id: "customSections", label: "Custom Sections", component: CustomSectionsForm },
    ],
    []
  );

  // Clear AI content when section changes
  useEffect(() => {
    setAiContent([]);
    setRegenerateCount(0);
    setCurrentItemIndex(null);
    setCurrentItemData(null);
  }, [selectedSection]);

  // Handle section parameter from URL
  useEffect(() => {
    const sectionParam = searchParams.get("section");
    if (sectionParam && isValidSection(sectionParam)) {
      setSelectedSection(sectionParam);
      // Clear the section parameter from URL to prevent re-navigation on refresh
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("section");
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSelectedSection, setSearchParams]);

  // Validate selectedSection on mount and when it changes
  useEffect(() => {
    if (!isValidSection(selectedSection)) {
      console.warn(
        `Invalid section "${selectedSection}" detected, resetting to "personal"`
      );
      setSelectedSection("personal");
    }
  }, [selectedSection, setSelectedSection]);

  // Listen for resume section click events from preview
  useEffect(() => {
    const handleSectionClick = (event: CustomEvent) => {
      const { sectionId, index } = event.detail;

      if (sectionId) {
        // Switch to the clicked section if it's valid
        if (isValidSection(sectionId)) {
          setSelectedSection(sectionId);

          // Scroll to the section in the editor panel
          setTimeout(() => {
            const sectionElement = document.querySelector(
              `[data-editor-section="${sectionId}"]`
            );
            if (sectionElement) {
              const htmlElement = sectionElement as HTMLElement;
              const offset = isMobile ? 80 : 100; // Smaller offset for mobile
              const elementPosition = htmlElement.getBoundingClientRect().top;
              const offsetPosition =
                elementPosition + window.pageYOffset - offset;

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });

              // Add a temporary highlight effect
              htmlElement.style.transition = "all 0.3s ease";
              htmlElement.style.backgroundColor = "rgba(4, 71, 126, 0.1)";
              htmlElement.style.borderRadius = "8px";
              htmlElement.style.padding = isMobile ? "8px" : "12px";

              setTimeout(() => {
                htmlElement.style.backgroundColor = "transparent";
                htmlElement.style.padding = "0";
              }, 1000);
            }
          }, 100);
        }
      }
    };

    // Add event listener for custom resume section click events
    window.addEventListener(
      "resumeSectionClick",
      handleSectionClick as EventListener
    );

    return () => {
      window.removeEventListener(
        "resumeSectionClick",
        handleSectionClick as EventListener
      );
    };
  }, [setSelectedSection, isMobile]);

  // For forms that don't use local state, update the store directly
  // Forms with local state (like EducationForm) only call this when clicking Continue
  const handleDataChange = (newData: Partial<ResumeData>) => {
    updateData((draft) => {
      Object.assign(draft, newData);
    });
  };

  // Enhanced withLoading function with better error handling and minimum display time
  const withLoading = async <T,>(
    apiCall: () => Promise<T>,
    message: string = "Processing..."
  ): Promise<T> => {
    const minDisplayTime = 500; // Minimum 500ms to prevent flashing
    const startTime = Date.now();
    
    try {
      setIsLoading(true);
      setLoadingMessage(message);
      
      const result = await apiCall();
      
      // Ensure loader shows for at least minDisplayTime
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minDisplayTime) {
        await new Promise(resolve => setTimeout(resolve, minDisplayTime - elapsedTime));
      }
      
      return result;
    } catch (error) {
      // Still ensure minimum display time on error
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minDisplayTime) {
        await new Promise(resolve => setTimeout(resolve, minDisplayTime - elapsedTime));
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // AI Suggestion handlers
  const generateAIContent = async () => {
    if (!resumeId) return;

    try {
      let prompt = "";
      let currentContent = "";
      let sectionOrContent = selectedSection;

      // Check if we have content to enhance
      const hasContent = getCurrentUserContent().trim().length > 0;

      if (
        currentItemIndex !== null &&
        (selectedSection === "experience" || selectedSection === "projects")
      ) {
        // Generate for specific existing item
        if (selectedSection === "experience") {
          const exp = data.experience[currentItemIndex];
          if (exp) {
            prompt = `Improve this work experience description for ${exp.title || "Job Title"
              } at ${exp.company || "Company"}: ${exp.description || "No description provided"
              }`;
            currentContent = exp.description || "";
            sectionOrContent = currentContent || "experience";
          }
        } else if (selectedSection === "projects") {
          const project = data.projects[currentItemIndex];
          if (project) {
            prompt = `Improve this project description for ${project.name || "Project Name"
              }: ${project.description || "No description provided"}`;
            currentContent = project.description || "";
            sectionOrContent = currentContent || "projects";
          }
        }
      } else if (
        currentItemIndex === null &&
        currentItemData !== null &&
        (selectedSection === "experience" || selectedSection === "projects")
      ) {
        // Generate for new item being added (not yet in store)
        if (selectedSection === "experience") {
          prompt = `Write a professional work experience description for ${currentItemData.title || "Job Title"
            } at ${currentItemData.company || "Company"}`;
          currentContent = currentItemData.description || "";
          sectionOrContent = currentContent || "experience";
        } else if (selectedSection === "projects") {
          prompt = `Write a professional project description for ${currentItemData.name || "Project Name"
            }`;
          currentContent = currentItemData.description || "";
          sectionOrContent = currentContent || "projects";
        }
      } else {
        // Generate for entire section
        switch (selectedSection) {
          case "summary":
            prompt = `Improve this professional summary: ${data.summary || "No summary provided"
              }`;
            currentContent = data.summary || "";
            sectionOrContent = currentContent || "summary";
            break;
          case "experience":
            const experienceText = data.experience
              .map(
                (exp) => `${exp.title} at ${exp.company}: ${exp.description}`
              )
              .join("\n\n");
            prompt = `Improve these work experience descriptions: ${experienceText || "No experience provided"
              }`;
            currentContent = experienceText;
            sectionOrContent = currentContent || "experience";
            break;
          case "projects":
            const projectsText = data.projects
              .map((project) => `${project.name}: ${project.description}`)
              .join("\n\n");
            prompt = `Improve these project descriptions: ${projectsText || "No projects provided"
              }`;
            currentContent = projectsText;
            sectionOrContent = currentContent || "projects";
            break;
          case "education":
            const educationText = data.education
              .map((edu) => `${edu.degree} in ${edu.field} from ${edu.school}`)
              .join("\n\n");
            prompt = `Improve these education descriptions: ${educationText || "No education provided"
              }`;
            currentContent = educationText;
            sectionOrContent = currentContent || "education";
            break;
          case "skills":
            const skillsText = Array.isArray(data.skills) ? data.skills.join(", ") : (typeof data.skills === 'string' ? data.skills : "");
            prompt = `Based on this resume content, suggest additional relevant skills. Current skills: ${skillsText || "No skills provided"
              }. Resume summary: ${data.summary || ""
              }. Experience: ${data.experience
                .map((exp) => exp.title)
                .join(", ")}`;
            currentContent = skillsText;
            sectionOrContent = currentContent || "skills";
            break;
          case "hobbies":
            const hobbiesText = Array.isArray(data.hobbies) ? data.hobbies.join(", ") : (typeof data.hobbies === 'string' ? data.hobbies : "");
            prompt = `Suggest professional and interesting hobbies based on this person's background. Current hobbies: ${hobbiesText || "No hobbies provided"
              }. Consider their professional field and suggest hobbies that show well-rounded personality.`;
            currentContent = hobbiesText;
            sectionOrContent = currentContent || "hobbies";
            break;
          default:
            prompt = `Generate content for ${selectedSection} section`;
            currentContent = "";
        }
      }

      // Determine context based on section
      let context: "summary" | "experience" | "project" | "skills" = "experience";
      if (selectedSection === "summary") {
        context = "summary";
      } else if (selectedSection === "experience") {
        context = "experience";
      } else if (selectedSection === "projects") {
        context = "project";
      } else if (selectedSection === "skills") {
        context = "skills";
      }

      // Prepare metadata for context-specific generation
      let metadata: any = undefined;
      if (context === "project" && currentItemIndex !== null) {
        // Use currentItemData if available, as it might be more up-to-date than data.projects
        const project = currentItemData || data.projects[currentItemIndex];
        if (project) {
          // Try to get name from project data, or extract from title
          let projectName = project.name;
          if (!projectName) {
            // Extract name from title: "Project: E-commerce platform" -> "E-commerce platform"
            const title = getSectionTitle();
            const titleMatch = title.match(/^Project:\s*(.+)$/);
            if (titleMatch && titleMatch[1] !== "Project Name") {
              projectName = titleMatch[1].trim();
            }
          }
          metadata = {
            name: projectName || "this project",
            technologies: project.technologies
          };
        }
      }

      // Show loader during API call
      setIsGeneratingAI(true);
      
      const response = await withLoading(
        () => resumeAPI.autoSuggestions(
          resumeId,
          currentContent || sectionOrContent,
          context,
          metadata
        ),
        "Generating AI suggestions..."
      );
      
      const suggestions = response.data.suggestions || [];
      if (suggestions.length > 0) {
        // For summary, take the first suggestion as it's a single paragraph
        // For others, format as plain text bullets
        let newContent = suggestions[0];
        if (context !== "summary") {
          newContent = suggestions.map(s => `- ${s}`).join('\n');
        }
        setAiContent((prev) => [...prev, newContent]);
      }
      setRegenerateCount((prev) => prev + 1);
    } catch (error) {
      console.error("AI generation failed:", error);
      // Show error message to user
      alert("Failed to generate AI content. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const applyAIContent = (selectedVersion: number) => {
    if (!aiContent[selectedVersion]) return;

    let selectedContent = aiContent[selectedVersion];

    // Convert plain text bullets to HTML for experience/projects/skills
    if (selectedSection !== "summary") {
      const lines = selectedContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length > 0 && lines.every(line => line.startsWith('- '))) {
        const listItems = lines.map(line => `<li>${line.replace(/^-\s*/, '')}</li>`).join('');
        selectedContent = `<ul>${listItems}</ul>`;
      }
    }

    // If we have a callback for applying to form state (for new items), use it
    if (onApplyAIContentCallback) {
      onApplyAIContentCallback(selectedContent);
      setAiContent([]);
      setRegenerateCount(0);
      setCurrentItemIndex(null);
      setCurrentItemData(null);
      setOnApplyAIContentCallback(null);
      setIsAIModalOpen(false);
      return;
    }

    // Create new data object with AI content applied
    const newData = JSON.parse(JSON.stringify(data));

    if (
      currentItemIndex !== null &&
      (selectedSection === "experience" || selectedSection === "projects")
    ) {
      // Apply to specific item
      if (selectedSection === "experience") {
        if (newData.experience[currentItemIndex]) {
          newData.experience[currentItemIndex].description = selectedContent;
        }
      } else if (selectedSection === "projects") {
        if (newData.projects[currentItemIndex]) {
          newData.projects[currentItemIndex].description = selectedContent;
        }
      }
    } else {
      // Apply to entire section
      switch (selectedSection) {
        case "summary":
          newData.summary = selectedContent;
          break;
        case "experience":
          // For experience, intelligently apply AI content to descriptions
          if (newData.experience.length > 0) {
            if (
              newData.experience.length === 1 &&
              !newData.experience[0].description?.trim()
            ) {
              newData.experience[0].description = selectedContent;
            } else {
              // Apply to all experiences, enhancing existing descriptions
              newData.experience.forEach((exp: any) => {
                if (exp.description?.trim()) {
                  exp.description = `${exp.description}\n\n${selectedContent}`;
                } else {
                  exp.description = selectedContent;
                }
              });
            }
          } else {
            // Create a new experience with AI content
            newData.experience.push({
              id: `exp-${Date.now()}`,
              title: "AI Enhanced Experience",
              company: "Company Name",
              description: selectedContent,
              startDate: "",
              endDate: "",
            });
          }
          break;
        case "projects":
          // For projects, apply AI content to descriptions
          if (newData.projects.length > 0) {
            if (
              newData.projects.length === 1 &&
              !newData.projects[0].description?.trim()
            ) {
              newData.projects[0].description = selectedContent;
            } else {
              newData.projects.forEach((project: any) => {
                if (project.description?.trim()) {
                  project.description = `${project.description}\n\n${selectedContent}`;
                } else {
                  project.description = selectedContent;
                }
              });
            }
          } else {
            // Create a new project with AI content
            newData.projects.push({
              id: `proj-${Date.now()}`,
              name: "AI Enhanced Project",
              description: selectedContent,
              technologies: "",
            });
          }
          break;
        case "education":
          // For education, apply AI content to field descriptions
          if (newData.education.length > 0) {
            newData.education.forEach((edu: any) => {
              if (edu.field?.trim()) {
                edu.field = `${edu.field}\n\n${selectedContent}`;
              } else {
                edu.field = selectedContent;
              }
            });
          } else {
            // Create new education entry with AI content
            newData.education.push({
              id: `edu-${Date.now()}`,
              degree: "AI Enhanced Degree",
              school: "University Name",
              field: selectedContent,
              graduationDate: "",
            });
          }
          break;
        case "skills":
          // Parse AI content as comma-separated skills and add them
          const skillMatches = selectedContent.match(
            /["']([^"']+)["']|([^,\n\r]+)/g
          );
          if (skillMatches) {
            const newSkills = skillMatches
              .map((skill: string) => skill.replace(/["']/g, "").trim())
              .filter(
                (skill: string) => skill && !newData.skills.includes(skill)
              );
            newData.skills.push(...newSkills);
          } else {
            // Fallback to comma splitting
            const fallbackSkills = selectedContent
              .split(",")
              .map((skill: string) => skill.trim())
              .filter(
                (skill: string) => skill && !newData.skills.includes(skill)
              );
            newData.skills.push(...fallbackSkills);
          }
          break;
        case "hobbies":
          // Parse AI content as comma-separated hobbies and add them
          if (!newData.hobbies) newData.hobbies = [];
          const hobbyMatches = selectedContent.match(
            /["']([^"']+)["']|([^,\n\r]+)/g
          );
          if (hobbyMatches) {
            const newHobbies = hobbyMatches
              .map((hobby: string) => hobby.replace(/["']/g, "").trim())
              .filter(
                (hobby: string) => hobby && !newData.hobbies.includes(hobby)
              );
            newData.hobbies.push(...newHobbies);
          } else {
            // Fallback to comma splitting
            const fallbackHobbies = selectedContent
              .split(",")
              .map((hobby: string) => hobby.trim())
              .filter(
                (hobby: string) => hobby && !newData.hobbies.includes(hobby)
              );
            newData.hobbies.push(...fallbackHobbies);
          }
          break;
      }
    }

    // Update the data which will trigger re-render
    updateData((draft) => {
      Object.assign(draft, newData);
    });

    // Clear AI content after applying
    setAiContent([]);
    setRegenerateCount(0);
    setCurrentItemIndex(null);
    setCurrentItemData(null);
    setOnApplyAIContentCallback(null);
    setIsAIModalOpen(false);
  };

  const applyUserContent = () => {
    // User content is already in the form, so this might just be for confirmation
    // For now, do nothing as the user content is already applied
    alert("Your content is already applied!");
  };

  const openAIModal = (
    index?: number,
    itemData?: any,
    onApplyAI?: (aiContent: string) => void
  ) => {
    setCurrentItemIndex(index ?? null);
    setCurrentItemData(itemData ?? null);
    setOnApplyAIContentCallback(() => onApplyAI);
    setIsAIModalOpen(true);
  };

  const closeAIModal = () => {
    setIsAIModalOpen(false);
  };

  const getCurrentUserContent = () => {
    // If we have a specific item index (editing existing item)
    if (
      currentItemIndex !== null &&
      (selectedSection === "experience" || selectedSection === "projects")
    ) {
      if (selectedSection === "experience") {
        const exp = data.experience[currentItemIndex];
        return exp
          ? `${exp.title || "Job Title"} at ${exp.company || "Company"}: ${exp.description || "No description"
          }`
          : "";
      } else if (selectedSection === "projects") {
        const project = data.projects[currentItemIndex];
        return project
          ? `${project.name || "Project Name"}: ${project.description || "No description"
          }`
          : "";
      }
    }

    // If we have currentItemData (new item being added)
    if (currentItemData !== null && currentItemData !== undefined) {
      if (selectedSection === "experience") {
        return `${currentItemData.title || "Job Title"} at ${currentItemData.company || "Company"
          }: ${currentItemData.description || "No description"}`;
      } else if (selectedSection === "projects") {
        return `${currentItemData.name || "Project Name"}: ${currentItemData.description || "No description"
          }`;
      }
    }

    switch (selectedSection) {
      case "summary":
        return data.summary || "";
      case "experience":
        return data.experience
          .map(
            (exp: any) =>
              `${exp.title || "Job Title"} at ${exp.company || "Company"}: ${exp.description || "No description"
              }`
          )
          .join("\n\n");
      case "projects":
        return data.projects
          .map(
            (project: any) =>
              `${project.name || "Project Name"}: ${project.description || "No description"
              }`
          )
          .join("\n\n");
      case "education":
        return data.education
          .map(
            (edu: any) =>
              `${edu.degree || "Degree"} in ${edu.field || "Field"} from ${edu.school || "School"
              }`
          )
          .join("\n\n");
      case "skills":
        return Array.isArray(data.skills) ? data.skills.join(", ") : (typeof data.skills === 'string' ? data.skills : "No skills listed");
      case "hobbies":
        return Array.isArray(data.hobbies) ? data.hobbies.join(", ") : (typeof data.hobbies === 'string' ? data.hobbies : "No hobbies listed");
      default:
        return "";
    }
  };

  const getSectionTitle = () => {
    const section = sections.find((s) => s.id === selectedSection);
    let title = section?.label || selectedSection;

    // If editing existing item
    if (
      currentItemIndex !== null &&
      (selectedSection === "experience" || selectedSection === "projects")
    ) {
      if (selectedSection === "experience") {
        const exp = data.experience[currentItemIndex];
        title = `Experience: ${exp?.title || "Job Title"} at ${exp?.company || "Company"
          }`;
      } else if (selectedSection === "projects") {
        const project = data.projects[currentItemIndex];
        title = `Project: ${project?.name || "Project Name"}`;
      }
    }

    // If adding new item
    if (
      currentItemData !== null &&
      currentItemData !== undefined &&
      currentItemIndex === null
    ) {
      if (selectedSection === "experience") {
        title = `New Experience: ${currentItemData.title || "Job Title"} at ${currentItemData.company || "Company"
          }`;
      } else if (selectedSection === "projects") {
        title = `New Project: ${currentItemData.name || "Project Name"}`;
      }
    }

    return title;
  };

  const supportsAISuggestions = [
    "summary",
    "experience",
    "education",
    "skills",
    "hobbies",
  ].includes(selectedSection);

  const validateSectionForNavigation = (sectionId: string) => {
    // First validate the section ID is valid
    if (!isValidSection(sectionId)) {
      return false;
    }

    // Allow navigation to any section (users can navigate freely)
    return true;
  };

  // Navigation handlers - including academic campus experience section
  const handleNext = async () => {
    // All sections in navigation order (matching sidebar sections)
    const allSectionOrder = [
      "personal",
      "education",
      "academicCampus",
      "professionalContext",
      "experience",
      "skills",
      "summary",
      "customSections"
    ];

    // For sub-sections of academic campus experience, go back to academic campus
    const academicCampusSubSections = ["careerObjective", "internship", "academicProject", "leadershipPosition", "trainingProgram", "scholarship", "coCurricular", "extraCurricular", "hobbies"];
    if (academicCampusSubSections.includes(selectedSection)) {
      markSectionCompleted(selectedSection);
      setSelectedSection("academicCampus");
      return;
    }

    const currentIndex = allSectionOrder.indexOf(selectedSection);

    // If at the last section, go to preview
    if (currentIndex === allSectionOrder.length - 1) {
      markSectionCompleted(selectedSection);
      try {
        await withLoading(
          () => save(),
          "Saving your resume..."
        );
        navigate(`/preview/${resumeId}`);
      } catch (err) {
        console.error("Failed to save:", err);
        // Still navigate to preview even if save fails
        navigate(`/preview/${resumeId}`);
      }
      return;
    }

    // Go to next section in order
    const nextSection = allSectionOrder[currentIndex + 1];
    markSectionCompleted(selectedSection);
    setSelectedSection(nextSection);
  };

  useEffect(() => {
  console.log("Resume Store Data:", data);
}, [data]);

  const handleBack = () => {
    // All sections in navigation order (matching sidebar sections)
    const allSectionOrder = [
      "personal",
      "education",
      "academicCampus",
      "professionalContext",
      "experience",
      "skills",
      "summary",
      "customSection"
    ];

    // For industry and domain sub-sections, go back to professional context
    if (selectedSection === "industry" || selectedSection === "domain" || selectedSection === "geographicScope" || selectedSection === "revenue") {
      setSelectedSection("professionalContext");
      return;
    }

    // For sub-sections of academic campus experience, go back to academic campus
    const subSections = ["professionalContext", "careerObjective", "internship", "academicProject", "leadershipPosition", "trainingProgram", "scholarship", "coCurricular", "extraCurricular", "hobbies"];
    if (subSections.includes(selectedSection)) {
      setSelectedSection("academicCampus");
      return;
    }

    if (selectedSection === "personal") {
      // Special case: from personal info, go to dashboard
      navigate("/dashboard");
    } else {
      const currentIndex = allSectionOrder.indexOf(selectedSection);
      if (currentIndex > 0) {
        setSelectedSection(allSectionOrder[currentIndex - 1]);
      }
    }
  };

  const handleSectionSelect = (sectionId: string) => {
    if (validateSectionForNavigation(sectionId)) {
      setSelectedSection(sectionId);
    } else {
      alert("Please complete the current section before jumping ahead.");
    }
  };

  const handleCustomSectionNavigate = (sectionId: string) => {
    if (validateSectionForNavigation(sectionId)) {
      setSelectedSection(sectionId);
    } else {
      alert("Please complete the current section before jumping ahead.");
    }
  };

  // Memoize renderCurrentForm to prevent unnecessary re-renders of child forms
  const renderCurrentForm = useCallback(() => {
    const section = sections.find((s) => s.id === selectedSection);

    // Handle upload section
    if (selectedSection === "upload") {
      return (
        <div className="max-w-2xl mx-auto py-4 sm:py-6 lg:py-8">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#DDA337] rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-[#04477E]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Upload Resume
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              Upload an existing resume to automatically parse and populate your
              resume information.
            </p>

            {uploadCompleted ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm sm:text-base text-green-600 dark:text-green-400 font-medium">
                  Resume uploaded and parsed successfully!
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Click continue to proceed with editing your resume.
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-6 lg:p-8 hover:border-[#DDA337] transition-colors">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                  Upload your resume file to get started
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOC, DOCX, or TXT (max 10MB)
                </p>
              </div>
            )}

            <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              💡 Supported formats: PDF, Word (.docx), Text (.txt)
            </p>
          </div>

          {/* Continue Button for Upload Section */}
          {uploadCompleted && (
            <div className="flex justify-center mt-6 sm:mt-8">
              <button
                onClick={() => {
                  markSectionCompleted("upload");
                  setSelectedSection("personal");
                }}
                className="px-6 py-2 sm:px-8 sm:py-2.5 rounded-full bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-bg-primary dark:text-dark-bg-primary font-bold shadow-sm transition-colors text-sm sm:text-base"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      );
    }
    const SectionWrapper = ({
      children,
      sectionId,
    }: {
      children: React.ReactNode;
      sectionId?: string;
    }) => (
      <div
        data-editor-section={sectionId || selectedSection}
        className="w-full max-w-full"
      >
        {children}
      </div>
    );

    const sectionComponent = section;

    switch (selectedSection) {
      case "personal":
        return (
          <SectionWrapper sectionId="personal">
            <Heading
              data={data}
              onChange={handleDataChange}
              resumeId={resumeId || ""}
              onNext={handleNext}
              onBack={handleBack}
            />
          </SectionWrapper>
        );

      case "careerObjective":
        return (
          <SectionWrapper sectionId="careerObjective">
            <CareerObjectiveForm
              onNext={handleNext}
              onBack={handleBack}
            />
          </SectionWrapper>
        );

      case "summary":
        return (
          <SectionWrapper>
            <SummaryForm
              data={data}
              onChange={handleDataChange}
              onNext={handleNext}
              onBack={handleBack}
              onOpenAIModal={openAIModal}
              resumeId={resumeId || ""}
            />
          </SectionWrapper>
        );

      case "experience":
        return (
          <SectionWrapper>
            <ExperienceForm
              data={data}
              onNext={handleNext}
              onBack={handleBack}
              onOpenAIModal={openAIModal}
              resumeId={resumeId || ""}
            />
          </SectionWrapper>
        );

      case "projects":
        return (
          <SectionWrapper>
            <ProjectsForm
              data={data}
              onNext={handleNext}
              onBack={handleBack}
              onOpenAIModal={openAIModal}
              resumeId={resumeId || ""}
            />
          </SectionWrapper>
        );

      case "education":
        return (
          <SectionWrapper sectionId="education">
            <EducationForm
              onNext={handleNext}
              onBack={handleBack}
              onOpenAIModal={openAIModal}
            />
          </SectionWrapper>
        );

      case "academicCampus":
        return (
          <SectionWrapper sectionId="academicCampus">
            <AcademicCampusExperienceForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSubSection={(subsectionId) => setSelectedSection(subsectionId)}
            />
          </SectionWrapper>
        );

      case "professionalContext":
        return (
          <SectionWrapper sectionId="professionalContext">
            <ProfessionalContextForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSubSection={(subsectionId) => setSelectedSection(subsectionId)}
            />
          </SectionWrapper>
        );

      case "industry":
        return (
          <SectionWrapper sectionId="industry">
            <IndustryForm
              onNext={() => setSelectedSection("professionalContext")}
              onBack={() => setSelectedSection("professionalContext")}
            />
          </SectionWrapper>
        );

      case "domain":
        return (
          <SectionWrapper sectionId="domain">
            <DomainForm
              onNext={() => setSelectedSection("professionalContext")}
              onBack={() => setSelectedSection("professionalContext")}
            />
          </SectionWrapper>
        );

      case "geographicScope":
        return (
          <SectionWrapper sectionId="geographicScope">
            <GeographicScopeForm
              onNext={() => setSelectedSection("professionalContext")}
              onBack={() => setSelectedSection("professionalContext")}
            />
          </SectionWrapper>
        );

      case "revenue":
        return (
          <SectionWrapper sectionId="revenue">
            <RevenueForm
              onNext={() => setSelectedSection("professionalContext")}
              onBack={() => setSelectedSection("professionalContext")}
            />
          </SectionWrapper>
        );

      case "internship":
        return (
          <SectionWrapper sectionId="internship">
            <InternshipsForm
              onNext={handleNext}
              onBack={handleBack}
            />
          </SectionWrapper>
        );

      case "academicProject":
        return (
          <SectionWrapper sectionId="academicProject">
            <AcademicProjectsForm
              onNext={handleNext}
              onBack={handleBack}
            />
          </SectionWrapper>
        );

      case "leadershipPosition":
        return (
          <SectionWrapper sectionId="leadershipPosition">
            <LeadershipPositionsForm
              onNext={handleNext}
              onBack={handleBack}
            />
          </SectionWrapper>
        );

      case "trainingProgram":
        return (
          <SectionWrapper sectionId="trainingProgram">
            <TrainingProgramsForm
              onNext={handleNext}
              onBack={handleBack}
            />
          </SectionWrapper>
        );

      case "scholarship":
        return (
          <SectionWrapper sectionId="scholarship">
            <ScholarshipsForm
              onNext={handleNext}
              onBack={handleBack}
            />
          </SectionWrapper>
        );

      case "coCurricular":
        return (
          <SectionWrapper sectionId="coCurricular">
            <CoCurricularForm
              onNext={handleNext}
              onBack={handleBack}
            />
          </SectionWrapper>
        );

      case "extraCurricular":
        return (
          <SectionWrapper sectionId="extraCurricular">
            <ExtracurricularForm
              onNext={handleNext}
              onBack={handleBack}
            />
          </SectionWrapper>
        );

      case "hobbies":
        return (
          <SectionWrapper sectionId="hobbies">
            <HobbiesForm
              data={data}
              onChange={handleDataChange}
              onNext={handleNext}
              onBack={handleBack}
              onOpenAIModal={openAIModal}
              resumeId={resumeId || ""}
            />
          </SectionWrapper>
        );

      case "skills":
        return (
          <SectionWrapper sectionId="skills">
            <SkillsForm
              data={data}
              onChange={handleDataChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          </SectionWrapper>
        );

      // case "projects":
      //   return (
      //     <SectionWrapper sectionId="projects">
      //       <ProjectsForm
      //         data={data}
      //         onNext={handleNext}
      //         onBack={handleBack}
      //         onOpenAIModal={openAIModal}
      //         resumeId={resumeId || ""}
      //       />
      //     </SectionWrapper>
      //   );

      case "socialLinks":
        return (
          <SectionWrapper sectionId="socialLinks">
            <SocialLinksForm
              data={data}
              onChange={handleDataChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          </SectionWrapper>
        );

      case "customSections":
        return (
          <SectionWrapper sectionId="customSections">
            <CustomSectionsForm
              data={data}
              onChange={handleDataChange}
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "careerEnhancer":
        return (
          <SectionWrapper sectionId="careerEnhancer">
            <CareerEnhancerForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "projectsDomainWork":
        return (
          <SectionWrapper sectionId="projectsDomainWork">
            <ProjectsDomainWorkForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "volunteeringService":
        return (
          <SectionWrapper sectionId="volunteeringService">
            <VolunteeringServiceForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "technicalEnrichment":
        return (
          <SectionWrapper sectionId="technicalEnrichment">
            <TechnicalEnrichmentForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "personalUtility":
        return (
          <SectionWrapper sectionId="personalUtility">
            <PersonalUtilityForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "studentsEarlyCareer":
        return (
          <SectionWrapper sectionId="studentsEarlyCareer">
            <StudentsEarlyCareerForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "academicResearch":
        return (
          <SectionWrapper sectionId="academicResearch">
            <AcademicResearchForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      // Sub-sections for career enhancer
      case "certifications":
        return (
          <SectionWrapper sectionId="certifications">
            <CertificationsForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "awards":
        return (
          <SectionWrapper sectionId="awards">
            <AwardsForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "speakingEngagements":
        return (
          <SectionWrapper sectionId="speakingEngagements">
            <SpeakingEngagementsForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "memberships":
        return (
          <SectionWrapper sectionId="memberships">
            <MembershipsForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "workshops":
        return (
          <SectionWrapper sectionId="workshops">
            <WorkshopsForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      // Sub-sections for projects domain work
      case "clientProjects":
        return (
          <SectionWrapper sectionId="clientProjects">
            <ClientProjectsForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "portfolio":
        return (
          <SectionWrapper sectionId="portfolio">
            <PortfolioForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      // Sub-sections for volunteering service
      case "volunteering":
        return (
          <SectionWrapper sectionId="volunteering">
            <VolunteeringForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "militaryService":
        return (
          <SectionWrapper sectionId="militaryService">
            <MilitaryServiceForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      // Sub-sections for technical enrichment
      case "toolsTechnologies":
        return (
          <SectionWrapper sectionId="toolsTechnologies">
            <ToolsTechnologiesForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "methodologies":
        return (
          <SectionWrapper sectionId="methodologies">
            <MethodologiesForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "industryExpertise":
        return (
          <SectionWrapper sectionId="industryExpertise">
            <IndustryExpertiseForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      // Sub-sections for personal utility
      case "references":
        return (
          <SectionWrapper sectionId="references">
            <ReferencesForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "socialProfiles":
        return (
          <SectionWrapper sectionId="socialProfiles">
            <SocialProfilesForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "availabilityWorkAuth":
        return (
          <SectionWrapper sectionId="availabilityWorkAuth">
            <AvailabilityWorkAuthForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

        case "languages":
  return (
    <SectionWrapper sectionId="languages">
      <LanguagesForm
        data={data}
        onChange={handleDataChange}
        onNext={handleNext}
        onBack={handleBack}
        onNavigateToSection={handleCustomSectionNavigate}
      />
    </SectionWrapper>
  );

      // Sub-sections for academic research
      case "testScores":
        return (
          <SectionWrapper sectionId="testScores">
            <TestScoresForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "patents":
        return (
          <SectionWrapper sectionId="patents">
            <PatentsForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "publications":
        return (
          <SectionWrapper sectionId="publications">
            <PublicationsForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "teachingExperience":
        return (
          <SectionWrapper sectionId="teachingExperience">
            <TeachingExperienceForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "mentorshipExperience":
        return (
          <SectionWrapper sectionId="mentorshipExperience">
            <MentorshipExperienceForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      case "researchGrants":
        return (
          <SectionWrapper sectionId="researchGrants">
            <ResearchGrantsForm
              onNext={handleNext}
              onBack={handleBack}
              onNavigateToSection={handleCustomSectionNavigate}
            />
          </SectionWrapper>
        );

      default:
        return null;

    }
  }, [selectedSection, data, resumeId, sections, handleNext, handleBack, openAIModal, handleDataChange, uploadCompleted, markSectionCompleted, setSelectedSection]);

  return (
    <>
      {/* Full Screen Loader */}
      {isLoading && <FullScreenLoader message={loadingMessage} />}

      <div
        className={`flex-1 bg-white dark:bg-gray-800 ${!isMobile ? "border-r border-gray-200 dark:border-gray-700" : "w-full"
          }`}
      >
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="w-full px-0 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10">
            <div className="w-full max-w-full">{renderCurrentForm()}</div>
          </div>
        </div>
      </div>

      {/* AI Modal - Responsive */}
      {isAIModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-full sm:max-w-[95%] md:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate pr-2">
                  AI Content Generator - {getSectionTitle()}
                </h2>
                <button
                  onClick={closeAIModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex-shrink-0"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <AISuggestionPanel
                key={`ai-panel-${selectedSection}-${currentItemIndex || "null"}`}
                aiContent={aiContent}
                userContent={getCurrentUserContent()}
                onApplyAI={(selectedVersion) => {
                  applyAIContent(selectedVersion);
                  closeAIModal();
                }}
                onApplyUser={() => {
                  applyUserContent();
                  closeAIModal();
                }}
                isGenerating={isGeneratingAI}
                onGenerateAI={generateAIContent}
                sectionTitle={getSectionTitle()}
                regenerateCount={regenerateCount}
              />
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.5);
          }
          .dark ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
          }
          .dark ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
          }
          .dark ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }

          @media (max-width: 640px) {
            ::-webkit-scrollbar {
              width: 4px;
            }
          }

          /* Animation for progress bar */
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: progress 2s ease-in-out infinite;
          }
        `,
        }}
      />
    </>
  );
}