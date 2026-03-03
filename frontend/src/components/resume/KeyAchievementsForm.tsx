import React, { useCallback, useState } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import {
  Trophy,
  Plus,
  X,
  Target,
  TrendingUp,
  Award,
  Zap,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { RichTextEditor } from "../editor/RichTextEditor";
import { resumeAPI } from "../../services/apiClient";
import { useResumeStore } from "../../stores/resumeStore";

interface KeyAchievementsFormProps {
  data: {
    keyAchievements?: string[];
  };
  onChange: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
  onOpenAIModal?: () => void;
  resumeId?: string;
}

export function KeyAchievementsForm({
  data,
  onChange,
  onNext,
  onBack,
  onOpenAIModal,
  resumeId,
}: KeyAchievementsFormProps) {
  const { updateData } = useResumeStore();
  const {
    getFieldError,
    getFieldValidationState,
    markFieldAsTouched,
    validateField,
  } = useFormValidation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Get resumeId from store if not provided as prop
  const resumeIdFromStore = useResumeStore((state) => state.resumeId);
  const effectiveResumeId = resumeId || resumeIdFromStore;

  const [keyAchievements, setKeyAchievements] = useState(
    data.keyAchievements || []
  );



  const handleContinue = () => {
    
    updateData((draft) => {
      draft.keyAchievements = keyAchievements;
    });
    onNext?.();
  };

  const handleGenerateAI = useCallback(
    async (currentContent: string): Promise<string[]> => {
      if (!effectiveResumeId) {
        console.warn(
          "[KeyAchievementsForm] No resume ID available for AI generation"
        );
        return [];
      }

      try {
        const response = await resumeAPI.suggestKeyAchievements(
          effectiveResumeId,
          undefined,
          undefined,
          keyAchievements
        );

        const suggestions = response.data?.suggestions || [];
        return suggestions;
      } catch (error: any) {
        console.error(
          "[KeyAchievementsForm] Failed to generate AI achievements:",
          error
        );
        return [];
      }
    },
    [effectiveResumeId, keyAchievements]
  );

  const handleAchievementChange = useCallback(
    async (index: number, value: string) => {
      const newAchievements = [...keyAchievements];
      newAchievements[index] = value;
      setKeyAchievements(newAchievements);

      // Validate the achievement
      await validateField(`keyAchievements.${index}`, value);
      markFieldAsTouched(`keyAchievements.${index}`);
    },
    [keyAchievements, validateField, markFieldAsTouched]
  );

  const addAchievement = useCallback(() => {
    setKeyAchievements([...keyAchievements, ""]);
    // Focus on the new achievement after it's added
    setTimeout(() => {
      setActiveIndex(keyAchievements.length);
    }, 100);
  }, [keyAchievements]);

  const removeAchievement = useCallback(
    (index: number) => {
      const newAchievements = keyAchievements.filter((_, i) => i !== index);
      setKeyAchievements(newAchievements);
      setActiveIndex(null);
    },
    [keyAchievements]
  );

  const getAchievementColor = (index: number) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-blue-600",
      "from-teal-500 to-green-600",
    ];
    return colors[index % colors.length];
  };

  const getValidationIcon = (fieldPath: string) => {
    const state = getFieldValidationState(fieldPath);
    const error = getFieldError(fieldPath);

    if (state === "error") {
      return (
        <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      );
    }

    if (state === "success") {
      return (
        <div className="flex items-center gap-1 mt-1 text-green-500 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Great achievement!</span>
        </div>
      );
    }

    return null;
  };

  // Calculate achievements metrics
  const metrics = {
    total: keyAchievements.length,
    completed: keyAchievements.filter((ach) => ach.trim().length > 10).length,
    hasQuantifiable: keyAchievements.filter(
      (ach) =>
        /\d/.test(ach) ||
        /%\s/.test(ach) ||
        /increased|reduced|improved|achieved/i.test(ach)
    ).length,
  };

  return (
    <div className="mb-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-start">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-white mb-3">
            Key <span className=" text-accent">Achievements</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-lg">
          Showcase your most significant accomplishments with measurable impact
        </p>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Your Key Achievements
          </h3>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {metrics.completed}/{metrics.total} complete
          </span>
        </div>

        {/* Achievements List */}
        {keyAchievements.length > 0 ? (
          <div className="space-y-5">
            {keyAchievements.map((achievement, idx) => {
              const isActive = activeIndex === idx;
              const hasContent = achievement.trim().length > 0;
              const hasQuantifiable =
                /\d/.test(achievement) || /%\s/.test(achievement);

              return (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? "border-[#0660a9] shadow-lg ring-2 ring-[#0660a9]/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                  }`}
                  onClick={() => setActiveIndex(idx)}
                >
                  {/* Left accent bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${getAchievementColor(
                      idx
                    )}`}
                  ></div>

                  <div className="pl-5 pr-4 py-4">
                    <div className="flex items-start gap-4">
                      {/* Achievement number */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          hasContent
                            ? "bg-gradient-to-r from-[#04477E] to-[#0660a9] text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                        }`}
                      >
                        <span className="text-sm font-bold">{idx + 1}</span>
                      </div>

                      {/* Achievement content */}
                      <div className="flex-1">
                        <RichTextEditor
                          value={achievement}
                          onChange={(value) =>
                            handleAchievementChange(idx, value)
                          }
                          placeholder="Example: Increased sales by 30% through targeted marketing campaigns..."
                          onEnhanceWithAI={onOpenAIModal}
                          onGenerateAI={handleGenerateAI}
                          sectionTitle="Achievement"
                        />

                        {/* Validation feedback */}
                        {getValidationIcon(`keyAchievements.${idx}`)}

                        {/* Achievement metrics */}
                        {hasContent && (
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            {hasQuantifiable && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-full">
                                <Target className="w-3 h-3" />
                                Quantifiable
                              </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {achievement.trim().split(/\s+/).length} words
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAchievement(idx);
                        }}
                        className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                        title="Remove achievement"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 border-2 border-dashed border-blue-200 dark:border-blue-800/30 rounded-2xl bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-800/50 dark:to-gray-900 mb-8">
            <div className="inline-flex p-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl mb-6">
              <Sparkles className="w-16 h-16 text-[#0660a9] dark:text-blue-400" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              No achievements added yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              Start by adding your most significant accomplishments with
              measurable results
            </p>
          </div>
        )}

        {/* Add Achievement Button */}
        <button
          onClick={addAchievement}
          className="group relative w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-dashed border-blue-200 dark:border-blue-800/50 text-[#0660a9] dark:text-blue-400 hover:border-[#04477E] hover:bg-blue-50 dark:hover:bg-blue-900/10 px-6 py-5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="relative">
            <Plus className="w-5 h-5 relative z-10" />
            <div className="absolute inset-0 bg-blue-400/20 blur-md group-hover:bg-blue-400/30 rounded-full transition-all duration-300"></div>
          </div>
          Add New Achievement
        </button>
      </div>

      {/* Tips Section */}
      <div className="mb-12 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Pro Tips for Great Achievements
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Make your achievements stand out
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
                Quantify Results
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use numbers, percentages, and measurable impact. Example:
              "Increased revenue by 45%"
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Action Verbs
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start with strong verbs: Led, Achieved, Improved, Reduced,
              Developed, Implemented
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Award className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Be Specific
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mention tools, technologies, and methodologies used to achieve the
              results
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Recent & Relevant
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Prioritize recent achievements and those most relevant to your
              target role
            </p>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
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
