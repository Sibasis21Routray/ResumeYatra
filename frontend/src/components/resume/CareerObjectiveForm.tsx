import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "../editor/RichTextEditor";
import { useResumeStore } from "../../stores";
import { Target, AlertCircle, Bold, Italic } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface CareerObjectiveFormProps {
    onBack?: () => void;
    onNext?: () => void;
}

// Section Card Component
const SectionCard = ({ title, description, children, icon }: {
    title: string;
    description?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-light-border dark:border-dark-border bg-gradient-to-r from-bg-secondary/30 to-transparent">
            <div className="flex items-center gap-3">
                {icon && <div className="text-accent dark:text-dark-accent">{icon}</div>}
                <div>
                    <h4 className="text-base font-semibold text-text-primary dark:text-dark-text-primary">
                        {title}
                    </h4>
                    {description && (
                        <p className="text-sm text-text-muted dark:text-dark-text-muted mt-0.5">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
        <div className="p-5">
            {children}
        </div>
    </div>
);

export function CareerObjectiveForm({
    onBack,
    onNext,
}: CareerObjectiveFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();
    const [objective, setObjective] = useState(data.careerObjective || "");
    const [error, setError] = useState("");
    const [isTouched, setIsTouched] = useState(false);

    const MAX_CHARS = 300;
    const charCount = objective.replace(/<[^>]*>/g, '').length; // Count only text content, not HTML tags

    useEffect(() => {
        // Clear error when user starts typing
        if (isTouched && objective.trim()) {
            setError("");
        }
    }, [objective, isTouched]);

    const updateField = (value: string) => {
        // Strip HTML tags for character count
        const textOnly = value.replace(/<[^>]*>/g, '');
        
        // Always enforce max length on text content
        if (textOnly.length <= MAX_CHARS) {
            setObjective(value);
        }
        
        if (!isTouched) {
            setIsTouched(true);
        }
    };

    const validateData = () => {
        const textOnly = objective.replace(/<[^>]*>/g, '').trim();
        
        if (!textOnly) {
            setError("Career objective is required");
            toast.error('Please enter your career objective', {
                style: toastStyle.error,
                duration: 3000,
            });
            return false;
        }
        
        if (textOnly.length > MAX_CHARS) {
            setError(`Maximum ${MAX_CHARS} characters allowed`);
            toast.error(`Career objective must be less than ${MAX_CHARS} characters`, {
                style: toastStyle.error,
                duration: 3000,
            });
            return false;
        }
        
        return true;
    };

    const handleContinue = async () => {
        if (!validateData()) {
            return;
        }

        const objectiveValue = objective.trim();

        updateData((draft) => {
            draft.careerObjective = objectiveValue;
        });

        // Explicitly save to ensure data is persisted
        await save();
        
        toast.success('Career objective saved successfully!', {
            style: toastStyle.success,
            duration: 2000,
        });

        // Navigate to Academic Campus Experience form
        if (onNext) {
            onNext();
        } else {
            navigate(`/preview/${id}`);
        }
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const getProgressColor = () => {
        const percentage = (charCount / MAX_CHARS) * 100;
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 70) return 'bg-yellow-500';
        return 'bg-accent';
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                        Career <span className="text-accent dark:text-dark-accent">Objective</span>
                    </h2>
                    <p className="text-base text-text-muted dark:text-dark-text-muted">
                        Recommended for students and fresh graduates. This will appear only if Profile Summary is not added.
                    </p>
                </div>

                {/* Career Objective Card */}
                <SectionCard 
                    title="Define your goal" 
                    description="This will appear only if Profile Summary is not added."
                    icon={<Target className="w-5 h-5" />}
                >
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                                    Your Objective <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    {/* Formatting indicators */}
                                    <div className="flex items-center gap-1 text-xs text-text-muted dark:text-dark-text-muted">
                                        <Bold className="w-3.5 h-3.5" />
                                        <span>Bold</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-text-muted dark:text-dark-text-muted">
                                        <Italic className="w-3.5 h-3.5" />
                                        <span>Italic</span>
                                    </div>
                                </div>
                            </div>

                            <RichTextEditor
                                value={objective}
                                onChange={updateField}
                                placeholder="Entry-level finance graduate seeking an analyst role to apply accounting and data analysis skills."
                                sectionTitle="Career Objective"
                                maxLength={MAX_CHARS}
                            />

                            {/* Character count and progress */}
                            <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1 text-text-muted dark:text-dark-text-muted">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>Maximum {MAX_CHARS} characters</span>
                                    </div>
                                    <span className={`font-medium ${
                                        charCount > MAX_CHARS ? 'text-red-500' : 
                                        charCount >= MAX_CHARS * 0.9 ? 'text-yellow-500' : 
                                        'text-accent'
                                    }`}>
                                        {charCount}/{MAX_CHARS}
                                    </span>
                                </div>
                                
                                {/* Progress bar */}
                                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-300 ${getProgressColor()}`}
                                        style={{ width: `${Math.min((charCount / MAX_CHARS) * 100, 100)}%` }}
                                    />
                                </div>

                                {error && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Example text */}
                            <div className="mt-4 p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border">
                                <p className="text-xs text-text-muted dark:text-dark-text-muted">
                                    <span className="font-semibold text-accent">Example:</span> "Entry-level finance graduate seeking an analyst role to apply accounting and data analysis skills."
                                </p>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* Tips Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h5 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                                Tips for a great career objective:
                            </h5>
                            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                                <li>Keep it concise (2-3 lines maximum)</li>
                                <li>Mention the specific role you're seeking</li>
                                <li>Highlight key skills relevant to the position</li>
                                <li>Tailor it to the job you're applying for</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between mt-8 pt-6 border-t border-light-border dark:border-dark-border">
                <button
                    onClick={handleBack}
                    className="px-8 py-3 rounded-xl border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:bg-accent/10 hover:border-accent transition-all duration-200 text-base"
                >
                    ← Back
                </button>

                <button
                    onClick={handleContinue}
                    disabled={!objective.replace(/<[^>]*>/g, '').trim()}
                    className={`px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-base ${
                        !objective.replace(/<[^>]*>/g, '').trim()
                            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
                            : "bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white"
                    }`}
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}

export default CareerObjectiveForm;