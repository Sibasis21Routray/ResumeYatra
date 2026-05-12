import React, { useState, useCallback, useRef, useEffect } from "react";
import { RichTextEditor } from "../../editor/RichTextEditor";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Sparkles,
  Loader2,
  Briefcase,
  Building2,
  Tag,
  Wrench,
  Check,
  AlertCircle,
  Bot,
  Clock,
  Globe,
} from "lucide-react";
import { resumeAPI } from "../../../services/apiClient";
import { calculateDuration } from "../../../utils/dateUtils";

// Bullet point suggestion type
export interface BulletSuggestion {
  id: string;
  text: string;
  category?: string;
}

export interface DescriptionStepProps {
  title: string;
  subtitle?: string;
  initialDescription?: string;
  initialAchievements?: string;
  initialData?: Record<string, any>;
  bulletSuggestions?: BulletSuggestion[];
  searchPlaceholder?: string;
  onSubmit: (data: {
    description: string;
    achievements?: string;
    metadata?: Record<string, any>;
  }) => void;
  onBack: () => void;
  onSave?: () => void;
  onEnhanceWithAI?: () => void;
  submitButtonText?: string;
  resumeId?: string;
  context?: "summary" | "experience" | "project";
  metadata?: Record<string, any>;
  isEditing?: boolean;
  isLoading?: boolean;
  onDescriptionChange?: (description: string) => void;
  onAchievementsChange?: (achievements: string) => void;
}

// Default description paragraphs for experience
export const DEFAULT_EXPERIENCE_DESCRIPTIONS = [
  "As a Software Engineer, I led the development of scalable web applications using React and Node.js. I collaborated with cross-functional teams to deliver high-quality solutions that improved user experience and business outcomes, resulting in a 25% increase in user engagement.",
  "In my role as a Project Manager, I successfully managed multiple projects from inception to delivery. I coordinated with stakeholders, mitigated risks, and ensured timely completion within budget constraints, achieving a 95% on-time delivery rate.",
  "As a Data Analyst, I transformed complex datasets into actionable insights using SQL, Python, and Tableau. I developed comprehensive reports and dashboards that drove strategic decisions, contributing to a 15% improvement in operational efficiency.",
  "During my tenure as a Marketing Specialist, I developed and executed digital marketing campaigns across multiple channels. I increased brand awareness and lead generation by 40% through targeted content creation and social media strategies.",
];

// Default description paragraphs for projects
export const DEFAULT_PROJECT_DESCRIPTIONS = [
  "This e-commerce platform was built using React, Node.js, and MongoDB. It features user authentication, payment integration, and real-time inventory management, serving over 10,000 users with 99% uptime and processing transactions worth $2M annually.",
  "Developed a mobile application using React Native and Firebase that connects local service providers with customers. The app includes real-time messaging, GPS tracking, and secure payment processing, achieving 4.8-star rating with 50,000+ downloads.",
  "Created a data visualization dashboard using D3.js and Python that processes large datasets in real-time. The system provides interactive charts and predictive analytics, helping businesses make data-driven decisions with 40% faster reporting cycles.",
  "Built a RESTful API using Express.js and PostgreSQL that powers multiple client applications. The API handles 1M+ requests daily with sub-100ms response times, featuring comprehensive authentication, rate limiting, and automated testing.",
];

export function DescriptionStep({
  title,
  subtitle,
  initialDescription = "",
  initialAchievements = "",
  initialData = {},
  searchPlaceholder = "Search bullet points...",
  onSubmit,
  onBack,
  onSave,
  onEnhanceWithAI,
  submitButtonText = "Save & Continue",
  resumeId,
  context = "experience",
  metadata = {},
  isEditing = false,
  isLoading = false,
  onDescriptionChange,
  onAchievementsChange,
}: DescriptionStepProps) {
  const [description, setDescription] = useState(initialDescription);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);

  // AI suggestions state
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Default suggestions
  const [defaultSuggestions] = useState<string[]>(
    context === "experience"
      ? DEFAULT_EXPERIENCE_DESCRIPTIONS
      : DEFAULT_PROJECT_DESCRIPTIONS
  );

  // Input fields for AI suggestions
  const [jobTitle, setJobTitle] = useState(
    metadata?.title || metadata?.name || ""
  );
  const [company, setCompany] = useState(metadata?.company || "");
  const [domain, setDomain] = useState(metadata?.domain || "");
  const [duration, setDuration] = useState(metadata?.duration || "");
  const [technologies, setTechnologies] = useState(
    metadata?.technologies || ""
  );
  const [keywords, setKeywords] = useState("");

  // Character count
  const characterCount = description.length;
  const wordCount = description
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Update local state when description changes
  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    onDescriptionChange?.(value);
  };

  // Handle achievements change
  const handleAchievementsChange = (value: string) => {
    setAchievements(value);
    onAchievementsChange?.(value);
  };

  // Handle AI suggestions for description
  const handleGenerateAI = useCallback(
    async (currentContent: string) => {
      if (!resumeId || (context !== "experience" && context !== "project")) {
        return [];
      }

      try {
        const metadataObj: any = {};
        if (context === "experience") {
          if (jobTitle) metadataObj.title = jobTitle;
          if (company) metadataObj.company = company;
          if (domain) metadataObj.domain = domain;
          if (duration) metadataObj.duration = duration;
        } else if (context === "project") {
          if (jobTitle) metadataObj.name = jobTitle;
          if (technologies) metadataObj.technologies = technologies;
        }
        if (keywords) metadataObj.keywords = keywords.split(",").map((k: string) => k.trim()).filter((k: string) => k.length > 0);

        const response = await resumeAPI.suggestDescriptionParagraphs(
          resumeId,
          context as "experience" | "project",
          currentContent,
          metadataObj
        );
        return response.data.suggestions || [];
      } catch (error) {
        console.error(
          "[DescriptionStep] Failed to generate AI suggestions:",
          error
        );
        return [];
      }
    },
    [resumeId, context, jobTitle, company, domain, duration, technologies, keywords]
  );

  // Handle AI suggestions for achievements
  const handleGenerateAchievementsAI = useCallback(
    async (currentContent: string) => {
      if (!resumeId || context !== "experience") {
        return [];
      }

      try {
        // Split current achievements by newlines or bullet points to create array
        const existingAchievements = currentContent
          .split(/\n|•|\-/)
          .map(line => line.trim())
          .filter(line => line.length > 0);

        const response = await resumeAPI.suggestKeyAchievements(
          resumeId,
          jobTitle || "",
          domain || "",
          existingAchievements
        );
        return response.data.suggestions || [];
      } catch (error) {
        console.error(
          "[DescriptionStep] Failed to generate AI achievements:",
          error
        );
        return [];
      }
    },
    [resumeId, context, jobTitle, domain]
  );

  const handleAddBullet = (suggestion: BulletSuggestion) => {
    setActiveSuggestion(suggestion.id);
    const bulletText = suggestion.text.startsWith("•")
      ? suggestion.text
      : `• ${suggestion.text}`;

    if (description) {
      setDescription((prev) => `${prev}\n${bulletText}`);
    } else {
      setDescription(bulletText);
    }

    // Reset active suggestion after animation
    setTimeout(() => setActiveSuggestion(null), 500);
  };

  const handleGenerateSuggestions = useCallback(async () => {
    if (!resumeId || (context !== "experience" && context !== "project" && context !== "summary")) {
      console.warn(
        "[DescriptionStep] No resume ID available or unsupported context for AI suggestions"
      );
      return;
    }

    const trimmedJobTitle = jobTitle.trim();
    const trimmedCompany = company.trim();
    const trimmedDomain = domain.trim();
    const trimmedDuration = duration.trim();
    const trimmedTechnologies = technologies.trim();
    const keywordsArray = keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    // Only proceed if we have at least some input
    if (
      !trimmedJobTitle &&
      !trimmedCompany &&
      !trimmedDomain &&
      !trimmedDuration &&
      !trimmedTechnologies &&
      keywordsArray.length === 0
    ) {
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      if (context === "summary") {
        // For summary context, use suggestSummaryParagraphs
        const response = await resumeAPI.suggestSummaryParagraphs(
          resumeId,
          description,
          trimmedJobTitle,
          trimmedDomain,
          keywordsArray.length > 0 ? keywordsArray : undefined
        );

        const suggestions = response.data?.suggestions || [];
        setAiSuggestions(suggestions);

        if (suggestions.length === 0) {
          setAiError("No suggestions found. Try different keywords.");
        }
      } else {
        // For experience/project context, use suggestDescriptionParagraphs
        const metadataObj: any = {};
        if (context === "experience") {
          if (trimmedJobTitle) metadataObj.title = trimmedJobTitle;
          if (trimmedCompany) metadataObj.company = trimmedCompany;
          if (trimmedDomain) metadataObj.domain = trimmedDomain;
          if (trimmedDuration) metadataObj.duration = trimmedDuration;
        } else if (context === "project") {
          if (trimmedJobTitle) metadataObj.name = trimmedJobTitle;
          if (trimmedTechnologies) metadataObj.technologies = trimmedTechnologies;
        }
        if (keywordsArray.length > 0) metadataObj.keywords = keywordsArray;

        const response = await resumeAPI.suggestDescriptionParagraphs(
          resumeId,
          context as "experience" | "project",
          description,
          metadataObj
        );

        const suggestions = response.data?.suggestions || [];
        setAiSuggestions(suggestions);

        if (suggestions.length === 0) {
          setAiError("No suggestions found. Try different keywords.");
        }
      }
    } catch (error: any) {
      console.error("[DescriptionStep] Failed to get AI suggestions:", error);
      setAiError(
        error.response?.data?.error ||
        "Failed to generate suggestions. Please try again."
      );
      setAiSuggestions([]);
    } finally {
      setAiLoading(false);
    }
  }, [
    resumeId,
    context,
    description,
    jobTitle,
    company,
    domain,
    duration,
    technologies,
    keywords,
  ]);

  // Debounced effect to trigger AI suggestions when inputs change
  useEffect(() => {
    const trimmedJobTitle = jobTitle.trim();
    const trimmedCompany = company.trim();
    const trimmedDomain = domain.trim();
    const trimmedDuration = duration.trim();
    const trimmedTechnologies = technologies.trim();
    const hasKeywords = keywords.split(",").some((k) => k.trim().length > 0);

    // Only auto-trigger if we have meaningful input (at least 2 characters)
    const hasEnoughInput =
      trimmedJobTitle.length >= 2 ||
      trimmedCompany.length >= 2 ||
      trimmedDomain.length >= 2 ||
      trimmedDuration.length >= 2 ||
      trimmedTechnologies.length >= 2 ||
      hasKeywords;

    if (!hasEnoughInput || !resumeId) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      handleGenerateSuggestions();
    }, 1000); // 1 second debounce

    return () => clearTimeout(debounceTimer);
  }, [
    jobTitle,
    company,
    domain,
    duration,
    technologies,
    keywords,
    resumeId,
    handleGenerateSuggestions,
  ]);

  const handleSubmit = () => {
    onSubmit({ description, achievements, metadata });
  };

  // Helper function to highlight the last word of a title
  const highlightLastWord = (text: string) => {
    const words = text.split(" ");
    if (words.length === 0) return null;

    const lastWord = words.pop();
    return (
      <>
        <span className="bg-accent bg-clip-text text-transparent">
          {words.join(" ")} <span className="font-extrabold">{lastWord}</span>
        </span>
      </>
    );
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-start">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
          {highlightLastWord(title)}
        </h2>
        {subtitle && (
          <p className="text-text-muted dark:text-dark-text-muted text-lg max-w-lg">
            {subtitle}
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Rich Text Editor - Description */}
        <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-2xl border border-light-border dark:border-dark-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-lg font-bold text-text-primary dark:text-dark-text-primary">
              <Briefcase className="w-5 h-5 mr-2" />
              {context === "project"
                ? "Project Description"
                : context === "summary"
                  ? "Professional Summary"
                  : "Role Description"}
            </label>
          </div>
          <RichTextEditor
            value={description}
            onChange={handleDescriptionChange}
            placeholder={`Describe your ${context === "project"
              ? "project details, technologies used, and outcomes achieved..."
              : context === "summary"
                ? "professional summary highlighting your key strengths and career goals..."
                : "role, responsibilities, and key contributions..."
              }`}
            onGenerateAI={context === "summary" ? handleGenerateSuggestions : (context === "experience" || context === "project" ? handleGenerateAI : undefined)}
            sectionTitle={
              context === "project"
                ? "Project"
                : context === "summary"
                  ? "Summary"
                  : "Experience"
            }
            context={context}
          />
        </div>

        {/* Rich Text Editor - Achievements */}
        {context === "experience" && (
          <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-2xl border border-light-border dark:border-dark-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-lg font-bold text-text-primary dark:text-dark-text-primary">
                <Check className="w-5 h-5 mr-2" />
                Key Achievements
              </label>
            </div>
            <RichTextEditor
              value={achievements}
              onChange={handleAchievementsChange}
              placeholder="List your key achievements and accomplishments in this role..."
              onGenerateAI={handleGenerateAchievementsAI}
              sectionTitle="Achievements"
            />
            <p className="mt-3 text-sm text-text-muted dark:text-dark-text-muted">
              Highlight quantifiable results, awards, promotions, or significant contributions.
            </p>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-light-border dark:border-dark-border">
        <button
          type="button"
          onClick={onBack}
          className="group flex items-center gap-3 px-8 py-3 rounded-full border-2 border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:border-accent hover:text-accent dark:hover:text-dark-accent hover:bg-accent/10 transition-all duration-300 hover:shadow-md w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`group relative flex items-center gap-3 px-10 py-3.5 rounded-full font-bold shadow-lg transition-all duration-300 overflow-hidden w-full sm:w-auto justify-center ${isLoading
            ? "bg-light-border dark:bg-dark-border text-text-muted dark:text-dark-text-muted cursor-not-allowed"
            : "bg-accent dark:bg-dark-accent text-bg-primary dark:text-dark-bg-primary hover:shadow-xl hover:scale-105 active:scale-95"
            }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : (
            <>
              {submitButtonText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}


