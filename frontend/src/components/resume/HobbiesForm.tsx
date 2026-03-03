import React, { useCallback, useRef, useState, useEffect } from "react";
import { RichTextEditor } from "../editor/RichTextEditor";
import { resumeAPI } from "../../services/apiClient";
import { useResumeStore } from "../../stores/resumeStore";
import { Loader2, Plus, Briefcase, Building2 } from "lucide-react";

interface HobbiesFormProps {
  data: {
    hobbies?: string[];
  };
  onChange: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
  onOpenAIModal?: () => void;
  resumeId?: string;
}

const MAX_CHARS = 240;

// Convert hobbies array to HTML bullet list
const hobbiesToEditorValue = (hobbies?: string[]): string => {
  if (!hobbies || hobbies.length === 0) return "";
  return `<ul>${hobbies.map((h) => `<li>${h}</li>`).join("")}</ul>`;
};

// Convert HTML content to hobbies array
// Also handles plain text (for when user just types without bullets)
const editorValueToArray = (content: string): string[] => {
  // Parse <li> items
  const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
  const items: string[] = [];
  let match;
  while ((match = liRegex.exec(content)) !== null) {
    const item = match[1].replace(/<[^>]*>/g, "").trim(); // Strip any inner HTML
    if (item) items.push(item);
  }
  // Fallback: if no <li>, treat as plain text with newlines
  if (items.length === 0) {
    const text = content.replace(/<[^>]*>/g, "");
    const lines = text
      .split(/\n/)
      .map((h) => h.trim())
      .filter(Boolean);
    return lines
      .map((item) => item.replace(/^[•\-\*]\s*/, "").trim())
      .filter(Boolean);
  }
  return items;
};

export function HobbiesForm({
  data,
  onChange,
  onNext,
  onBack,
  onOpenAIModal,
  resumeId,
}: HobbiesFormProps) {
  const { updateData } = useResumeStore();
  // AI suggestions state
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Input fields for AI suggestions
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [hobbies, setHobbies] = useState(data.hobbies || []);



  const handleContinue = () => {
    updateData((draft) => {
      draft.hobbies = hobbies;
    });
    onNext?.();
  };

  const handleGenerateSuggestions = useCallback(async () => {
    if (!resumeId) {
      console.warn("[HobbiesForm] No resume ID available for AI suggestions");
      return;
    }

    const trimmedJobTitle = jobTitle.trim();
    const trimmedIndustry = industry.trim();

    // Only proceed if we have at least a job title
    if (!trimmedJobTitle && !trimmedIndustry) {
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const response = await resumeAPI.suggestHobbies(
        resumeId,
        trimmedJobTitle || undefined,
        trimmedIndustry || undefined
      );

      const suggestions = response.data?.suggestions || [];
      setAiSuggestions(suggestions);

      if (suggestions.length === 0) {
        setAiError("No suggestions found. Try different keywords.");
      }
    } catch (error: any) {
      console.error("[HobbiesForm] Failed to get AI suggestions:", error);
      setAiError(
        error.response?.data?.error ||
          "Failed to generate suggestions. Please try again."
      );
      setAiSuggestions([]);
    } finally {
      setAiLoading(false);
    }
  }, [resumeId, jobTitle, industry]);

  // Debounced effect to trigger AI suggestions when job title or industry change
  useEffect(() => {
    const trimmedJobTitle = jobTitle.trim();
    const trimmedIndustry = industry.trim();

    // Only auto-trigger if we have meaningful input (at least 2 characters)
    const hasEnoughInput =
      trimmedJobTitle.length >= 2 || trimmedIndustry.length >= 2;

    if (!hasEnoughInput || !resumeId) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      handleGenerateSuggestions();
    }, 1000); // 1 second debounce

    return () => clearTimeout(debounceTimer);
  }, [jobTitle, industry, resumeId, handleGenerateSuggestions]);

  const handleAddHobby = (hobby: string) => {
    if (!hobbies.includes(hobby)) {
      setHobbies([...hobbies, hobby]);
    }
  };

  const handleChange = useCallback((content: string) => {
    if (content.length > MAX_CHARS) return;

    // Ensure content is in bullet list format
    let processedContent = content;
    if (!content.includes("<ul>") && content.trim()) {
      processedContent = `<ul><li>${content
        .replace(/<br\s*\/?>/gi, "</li><li>")
        .replace(/\n/g, "</li><li>")}</li></ul>`;
    }

    const hobbiesArray = editorValueToArray(processedContent);

    setHobbies(hobbiesArray);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Hobbies and <span className="text-accent">interests</span></h2>

      <div className="border rounded-lg overflow-hidden">
        <RichTextEditor
          value={hobbiesToEditorValue(hobbies)}
          onChange={handleChange}
          placeholder={`Reading\nWriting\nTraveling\nPhotography`}
          sectionTitle="Hobbies"
        />
      </div>

      <div className="text-right text-xs text-gray-500 mt-1">
        Limit: {MAX_CHARS} characters
      </div>

      <div className="flex justify-between items-center mt-10">
        <button
          onClick={onBack}
          className="px-10 py-3 rounded-full border-2 border-black font-semibold"
        >
          Back
        </button>

        <button
          onClick={handleContinue}
          className="px-8 py-2.5 rounded-full bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-bg-primary font-bold shadow-sm transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
