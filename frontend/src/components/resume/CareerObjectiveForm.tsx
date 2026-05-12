import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "../editor/RichTextEditor";
import { useResumeStore } from "../../stores";
import { Target, AlertCircle } from "lucide-react";
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

    useEffect(() => {
        // Clear error when user starts typing
        if (isTouched && objective.trim()) {
            setError("");
        }
    }, [objective, isTouched]);

    const updateField = (value: string) => {
        setObjective(value);
        
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

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                        Career <span className="text-accent dark:text-dark-accent">Objective</span>
                    </h2>
                    <p className="text-base text-text-muted dark:text-dark-text-muted">
                        Recommended for students and fresh graduates. This will appear only if Profile Summary is not added.
                    </p>
                </div>

                {/* Career Objective - No header card */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                            Your Objective <span className="text-red-500">*</span>
                        </label>
                        
                    </div>

                    <RichTextEditor
                        value={objective}
                        onChange={updateField}
                        placeholder="Entry-level finance graduate seeking an analyst role to apply accounting and data analysis skills."
                        sectionTitle="Career Objective"
                    />

                    {error && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {error}
                        </p>
                    )}
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