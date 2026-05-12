import React, { useCallback } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import {
  Wrench,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Cpu,
  Code,
  Database,
  Globe,
} from "lucide-react";
import { RichTextEditor } from "../editor/RichTextEditor";
import { resumeAPI } from "../../services/apiClient";
import { useResumeStore } from "../../stores/resumeStore";

interface ToolsFormProps {
  data: {
    tools?: string[];
  };
  onChange: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
  onOpenAIModal?: () => void;
  resumeId?: string;
}

// Convert tools array to HTML bullet list
const toolsToEditorValue = (tools?: string[]): string => {
  if (!tools || tools.length === 0) return "";
  return `<ul>${tools.map((t) => `<li>${t}</li>`).join("")}</ul>`;
};

// Convert HTML content to tools array
const editorValueToArray = (content: string): string[] => {
  // Parse <li> items
  const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
  const items: string[] = [];
  let match;
  while ((match = liRegex.exec(content)) !== null) {
    const item = match[1].replace(/<[^>]*>/g, "").trim();
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

export function ToolsForm({
  data,
  onChange,
  onNext,
  onBack,
  onOpenAIModal,
  resumeId,
}: ToolsFormProps) {
  const { updateData } = useResumeStore();
  const {
    getFieldError,
    getFieldValidationState,
    markFieldAsTouched,
    validateField,
  } = useFormValidation();

  // Get resumeId from store if not provided as prop
  const resumeIdFromStore = useResumeStore((state) => state.resumeId);
  const effectiveResumeId = resumeId || resumeIdFromStore;

  const [tools, setTools] = React.useState(data.tools || []);



  const handleContinue = () => {
    updateData((draft) => {
      draft.tools = tools;
    });
    onNext?.();
  };

  const handleGenerateAI = useCallback(
    async (currentContent: string): Promise<string[]> => {
      if (!effectiveResumeId) {
        console.warn("[ToolsForm] No resume ID available for AI generation");
        return [];
      }

      try {
        const response = await resumeAPI.autoSuggestions(
          effectiveResumeId,
          currentContent,
          "skills",
          {}
        );

        const suggestions = response.data?.suggestions || [];
        return suggestions;
      } catch (error: any) {
        console.error("[ToolsForm] Failed to generate AI tools:", error);
        return [];
      }
    },
    [effectiveResumeId]
  );

  const handleToolsChange = useCallback(
    async (value: string) => {
      const toolsArray = editorValueToArray(value);
      setTools(toolsArray);

      // Validate the field
      await validateField("tools", value);
      markFieldAsTouched("tools");
    },
    [validateField, markFieldAsTouched]
  );

  const getValidationFeedback = () => {
    const state = getFieldValidationState("tools");
    const error = getFieldError("tools");

    if (state === "error" && error) {
      return (
        <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      );
    }

    if (state === "success") {
      return (
        <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Good tools list!</span>
        </div>
      );
    }

    return null;
  };

  // Calculate metrics
  const metrics = {
    total: tools.length,
    characters: tools.join("\n").length,
  };

  return (
    <div className="mb-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-start">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-white mb-3">
            Tools & <span className="text-accent">Technologies</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-lg">
          List the tools, software, and technologies you work with
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        <Wrench className="w-5 h-5 text-[#0660a9] dark:text-blue-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Your Tools & Technologies
        </h3>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-auto">
          {metrics.total} {metrics.total === 1 ? "tool" : "tools"}
        </span>
      </div>

      {/* Tools Section */}
      <div className="mb-8">
        <div className="border rounded-xl overflow-hidden">
          <RichTextEditor
            value={toolsToEditorValue(tools)}
            onChange={handleToolsChange}
            placeholder="• Microsoft Office Suite&#10;• Adobe Creative Suite&#10;• Git, Docker, AWS&#10;• Python, JavaScript, React"
            onEnhanceWithAI={onOpenAIModal}
            onGenerateAI={handleGenerateAI}
            sectionTitle="Tools"
          />
        </div>

        {/* Validation feedback */}
        {getValidationFeedback()}

        <div className="flex justify-end mt-3">
          {tools.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-full">
              <Target className="w-3 h-3" />
              {metrics.total} listed
            </span>
          )}
        </div>
      </div>

      {/* Tools Tips */}
      <div className="mb-12 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Tips for Tools & Technologies
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Make your tech stack stand out
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Target className="w-3 h-3 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Be Comprehensive
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Include both hardware and software tools relevant to your role and
              industry
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Code className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Programming Languages
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              List programming languages, frameworks, and libraries you
              specialize in
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Database className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Databases & Cloud
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Include databases, cloud platforms, and DevOps tools you work with
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Globe className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Stay Current
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Highlight modern tools and keep your skills updated with industry
              trends
            </p>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        {onBack && (
          <button
            onClick={onBack}
            className="group flex items-center gap-3 px-8 py-3 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:border-[#04477E] hover:text-[#04477E] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-md w-full sm:w-auto justify-center"
          >
            Back
          </button>
        )}

        {onNext && (
          <button
            onClick={handleContinue}
            className="group relative flex items-center gap-3 px-10 py-3.5 rounded-full font-bold shadow-lg transition-all duration-300 overflow-hidden w-full sm:w-auto justify-center bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-bg-primary hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
