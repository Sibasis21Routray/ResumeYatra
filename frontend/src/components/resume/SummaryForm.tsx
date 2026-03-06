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
  const { updateData } = useResumeStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [defaultSuggestions] = useState<string[]>(DEFAULT_SUMMARY_PARAGRAPHS);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"default" | "ai">("default");
  const resumeIdFromStore = useResumeStore((state) => state.resumeId);
  const effectiveResumeId = resumeId || resumeIdFromStore;

  const [summary, setSummary] = useState(data.summary || "");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleChange = useCallback((value: string) => {
    setSummary(value);
  }, []);



  const handleContinue = () => {
    updateData((draft) => {
      draft.summary = summary;
    });
    onNext?.();
  };

  const handleGenerateSuggestions = useCallback(async () => {
    if (!effectiveResumeId) {
      console.warn("[SummaryForm] No resume ID available for AI suggestions");
      return;
    }

    const trimmedJobTitle = jobTitle.trim();
    const trimmedIndustry = industry.trim();
    const keywordsArray = keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    // Always allow generation - will use resume experience data even without inputs

    setActiveTab("ai");
    setAiLoading(true);
    setAiError(null);

    try {
      const response = await resumeAPI.suggestSummaryParagraphs(
        effectiveResumeId,
        data.summary || "", // Pass empty string if no summary exists
        trimmedJobTitle || undefined,
        trimmedIndustry || undefined,
        keywordsArray.length > 0 ? keywordsArray : undefined
      );

      const suggestions = response.data?.suggestions || [];
      setAiSuggestions(suggestions);

      if (suggestions.length === 0) {
        setAiError("Unable to generate suggestions. Please ensure your resume has experience data.");
      }
    } catch (error: any) {
      console.error("[SummaryForm] Failed to get AI suggestions:", error);
      setAiError(
        error.response?.data?.error ||
        "Failed to generate suggestions. Please try again."
      );
      setAiSuggestions([]);
    } finally {
      setAiLoading(false);
    }
  }, [effectiveResumeId, data.summary, jobTitle, industry, keywords]);

  // Wrapper function for RichTextEditor onGenerateAI prop
  const handleGenerateAIForEditor = useCallback(async (currentContent: string): Promise<string[]> => {
    await handleGenerateSuggestions();
    return aiSuggestions;
  }, [handleGenerateSuggestions, aiSuggestions]);

  // Debounced effect to trigger AI suggestions when job title, industry or keywords change
  useEffect(() => {
    const trimmedJobTitle = jobTitle.trim();
    const trimmedIndustry = industry.trim();
    const hasKeywords = keywords.split(",").some((k) => k.trim().length > 0);

    // Only auto-trigger if we have meaningful input (at least 2 characters)
    const hasEnoughInput =
      trimmedJobTitle.length >= 2 || trimmedIndustry.length >= 2 || hasKeywords;

    if (!hasEnoughInput || !effectiveResumeId) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      handleGenerateSuggestions();
    }, 1000); // 1 second debounce

    return () => clearTimeout(debounceTimer);
  }, [
    jobTitle,
    industry,
    keywords,
    effectiveResumeId,
    handleGenerateSuggestions,
  ]);

  return (
    <div className="w-full max-w-full">
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
        <span className="text-accent">Add your professional summary</span>
      </h2>

      {/* Main Card */}
      <div className=" overflow-hidden ">
        {/* Editor Section */}
        <div className="p-3 sm:p-4 lg:p-6 relative">
          <RichTextEditor
            value={summary}
            onChange={handleChange}
            placeholder="Write a professional summary highlighting your experience, skills, and goals…"
            onEnhanceWithAI={onOpenAIModal}
            onGenerateAI={handleGenerateAIForEditor}
            sectionTitle="Summary"
            
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-gray-700" />

        {/* Suggestions Section */}
        {/* <div className="p-3 sm:p-4 lg:p-6 bg-slate-50 dark:bg-gray-900/50">
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 sm:mb-4">
            Enter the job title, industry, or keywords to get AI-generated
            summary suggestions.
          </p>

          {/* Search Input Fields 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
            {/* Job Title Field 
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Title
              </label>
              <div className="relative">
                <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" />
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-sm border border-slate-200 dark:border-gray-600 rounded-lg sm:rounded-lg focus:ring-2 focus:ring-offset-0 focus:outline-none focus:ring-[#04477E] dark:focus:ring-blue-500 hover:border-slate-300 dark:hover:border-gray-500 transition-all duration-200 bg-white dark:bg-gray-800 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Industry Field 
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Industry
              </label>
              <div className="relative">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" />
                <input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Technology, Finance"
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-sm border border-slate-200 dark:border-gray-600 rounded-lg sm:rounded-lg focus:ring-2 focus:ring-offset-0 focus:outline-none focus:ring-[#04477E] dark:focus:ring-blue-500 hover:border-slate-300 dark:hover:border-gray-500 transition-all duration-200 bg-white dark:bg-gray-800 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Keywords Field 
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Keywords
              </label>
              <div className="relative">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4 absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" />
                <input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. Leadership, Cloud"
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-sm border border-slate-200 dark:border-gray-600 rounded-lg sm:rounded-lg focus:ring-2 focus:ring-offset-0 focus:outline-none focus:ring-[#04477E] dark:focus:ring-blue-500 hover:border-slate-300 dark:hover:border-gray-500 transition-all duration-200 bg-white dark:bg-gray-800 text-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Suggestions List 
          <div className="space-y-2 sm:space-y-3">
            {aiLoading && activeTab === "ai" ? (
              <div className="text-center py-4 sm:py-6">
                <Loader2 className="animate-spin mx-auto text-blue-600 dark:text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Generating suggestion…
                </p>
              </div>
            ) : aiError && activeTab === "ai" ? (
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 text-center py-2">
                {aiError}
              </p>
            ) : (
              <>
                {/* Display all suggestions 
                {(() => {
                  const suggestions =
                    activeTab === "default"
                      ? defaultSuggestions
                      : aiSuggestions;

                  if (suggestions.length === 0) {
                    return (
                      <div className="text-center py-3 sm:py-4">
                        <button
                          onClick={handleGenerateSuggestions}
                          disabled={aiLoading}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-bg-primary font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {aiLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                          Generate AI Summary
                        </button>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                          Get personalized suggestions based on your resume experience
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1 sm:pr-2">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSummary(suggestion)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setSummary(suggestion);
                            }
                          }}
                          className="flex gap-2 sm:gap-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 cursor-pointer
                            hover:shadow-sm hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20
                            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        >
                          {/* Visual + icon only 
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-bg-primary dark:text-dark-bg-primary disabled:opacity-50 transition-colors">
                            <Plus size={12} className="sm:w-4 sm:h-4" />
                          </div>

                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                            {suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div> */}
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
          className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-2 sm:py-2.5 rounded-full sm:rounded-full  bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-bg-primary font-bold shadow-sm hover:shadow-md transition-all duration-200 text-sm sm:text-base"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
