import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  Plus,
  Briefcase,
  Building2,
  Tag,
} from "lucide-react";
import { RichTextEditor } from "../editor/RichTextEditor";
import { resumeAPI } from "../../services/apiClient";
import { useResumeStore } from "../../stores/resumeStore";

const DEFAULT_SUMMARY_PARAGRAPHS = [
  "Detail-oriented project manager with expertise in Agile methodologies and cross-functional team leadership. Successfully delivered multiple high-impact projects.",
  "Experienced data analyst with strong proficiency in SQL, Python, and data visualization tools. Skilled in transforming complex data into actionable insights.",
  "Creative marketing professional with a passion for digital storytelling and brand development. Expertise in social media strategy and content creation.",
];

interface SummaryFormProps {
  data: {
    summary?: string;
  };
  onChange: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
  onOpenAIModal?: () => void;
  resumeId?: string;
}

export function SummaryForm({
  data,
  onChange,
  onNext,
  onBack,
  onOpenAIModal,
  resumeId,
}: SummaryFormProps) {
  const { updateData, save } = useResumeStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [defaultSuggestions] = useState<string[]>(DEFAULT_SUMMARY_PARAGRAPHS);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"default" | "ai">("default");
  const resumeIdFromStore = useResumeStore((state) => state.resumeId);
  const effectiveResumeId = resumeId || resumeIdFromStore;

  // Helper function to clean HTML content
  const cleanHtmlContent = useCallback((html: string): string => {
    if (!html) return "";
    
    // Remove <br> tags and check if only empty tags remain
    const withoutBr = html.replace(/<br\s*\/?>/gi, "");
    
    // Remove any other empty HTML tags
    const cleaned = withoutBr.replace(/<[^>]*>[\s\n]*<\/[^>]*>/g, "");
    
    // Trim and check if empty
    const trimmed = cleaned.trim();
    
    // If after cleaning it's empty, return empty string
    if (trimmed === "") return "";
    
    // Otherwise return original (but without empty <br> at the end)
    return html.replace(/<br\s*\/?>$/, "").trim();
  }, []);

  // Local state for summary - only updates local state, not the store
  const [localSummary, setLocalSummary] = useState(() => {
    const initialSummary = data.summary || "";
    return cleanHtmlContent(initialSummary);
  });
  
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [keywords, setKeywords] = useState("");

  // Handle local changes without saving to store or API
  const handleChange = useCallback((value: string) => {
    const cleanedValue = cleanHtmlContent(value);
    setLocalSummary(cleanedValue);
    // Only update parent component's local state, not the global store
    // onChange({ summary: cleanedValue });
  }, [onChange, cleanHtmlContent]);

  // Only save to store and API when Continue is clicked
const handleContinue = async () => {
  try {
    const cleanedSummary = cleanHtmlContent(localSummary);

    updateData((draft) => {
      draft.summary = cleanedSummary;
    });

    onChange({ summary: cleanedSummary });

  

    await save();

    onNext?.();
  } catch (error) {
    console.error("Failed to save summary:", error);
  }
};




  return (
    <div className="w-full max-w-full">
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
        <span className="text-accent">Add your professional summary</span>
      </h2>

      {/* Main Card */}
      <div className="overflow-hidden">
        {/* Editor Section */}
        <div className="p-3 sm:p-4 lg:p-6 relative">
          <RichTextEditor
            value={localSummary}
            onChange={handleChange}
            placeholder="Write a professional summary highlighting your experience, skills, and goals…"
            onEnhanceWithAI={onOpenAIModal}
            // onGenerateAI={handleGenerateAIForEditor}
            sectionTitle="Summary"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-gray-700" />
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-2 sm:py-2.5 rounded-full sm:rounded-full border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 font-semibold hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-slate-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
        >
          Back
        </button>

        <button
          onClick={handleContinue}
          className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-2 sm:py-2.5 rounded-full sm:rounded-full bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-bg-primary font-bold shadow-sm hover:shadow-md transition-all duration-200 text-sm sm:text-base"
        >
          Continue
        </button>
      </div>
    </div>
  );
}