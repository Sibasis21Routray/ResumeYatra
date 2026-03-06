import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, AlertCircle, Plus, Award, Calendar, Percent, TrendingUp } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface TestScoreItem {
    id: string;
    testName: string; // Test Name (80 chars) - required - GRE, GMAT, GATE, TOEFL, etc.
    score: string; // Score (50 chars) - required - Score obtained
    year: string; // Year (4 digits) - optional - Year of test
    percentileRank: string; // Percentile / Rank (50 chars) - optional - Optional percentile or rank
}

interface TestScoresFormProps {
    onBack?: () => void;
    onNext?: () => void;
    onNavigateToSection?: (section: string) => void;
}

// Styled Input Component
const StyledInput = ({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    maxLength,
    error,
    onBlur,
    characterCount,
    icon,
    type = "text",
}: {
    label: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
    error?: string;
    onBlur?: () => void;
    characterCount?: boolean;
    icon?: React.ReactNode;
    type?: string;
}) => {
    const [isFocused, setIsFocused] = useState(false);

    let baseInputClass = `w-full ${icon ? 'pl-10' : 'px-4'} py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-base text-text-primary dark:text-dark-text-primary placeholder:text-sm placeholder:text-text-muted/70 dark:placeholder:text-dark-text-muted/70 shadow-sm hover:shadow-md`;

    if (error) {
        baseInputClass += " border-red-500 focus:ring-red-500 focus:border-red-500";
    } else if (isFocused) {
        baseInputClass += " border-accent dark:border-dark-accent ring-2 ring-accent/20";
    } else {
        baseInputClass += " border-light-border dark:border-dark-border";
    }

    return (
        <div className="w-full">
            <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative w-full">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    value={value || ""}
                    onChange={onChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        onBlur?.();
                    }}
                    className={`${baseInputClass}`}
                />
                {characterCount && maxLength && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted dark:text-dark-text-muted">
                        {value?.length || 0}/{maxLength}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                </p>
            )}
        </div>
    );
};

// Styled Select Component
const StyledSelect = ({
    label,
    value,
    onChange,
    options,
    required = false,
    error,
    onBlur,
    icon,
    placeholder,
}: {
    label: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    required?: boolean;
    error?: string;
    onBlur?: () => void;
    icon?: React.ReactNode;
    placeholder?: string;
}) => {
    const [isFocused, setIsFocused] = useState(false);

    let baseSelectClass = `w-full ${icon ? 'pl-10' : 'px-4'} py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-base text-text-primary dark:text-dark-text-primary shadow-sm hover:shadow-md appearance-none cursor-pointer`;

    if (error) {
        baseSelectClass += " border-red-500 focus:ring-red-500 focus:border-red-500";
    } else if (isFocused) {
        baseSelectClass += " border-accent dark:border-dark-accent ring-2 ring-accent/20";
    } else {
        baseSelectClass += " border-light-border dark:border-dark-border";
    }

    return (
        <div className="w-full">
            <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative w-full">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted">
                        {icon}
                    </div>
                )}
                <select
                    value={value || ""}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        onBlur?.();
                    }}
                    className={`${baseSelectClass}`}
                >
                    <option value="">{placeholder || "Select test"}</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted dark:text-dark-text-muted">
                    ▼
                </div>
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                </p>
            )}
        </div>
    );
};

// Test Score Card Component for Summary View
const TestScoreCard = ({ score, onEdit, onDelete }: { 
    score: TestScoreItem; 
    onEdit: () => void; 
    onDelete: () => void;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-accent dark:text-dark-accent" />
                    <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">
                        {score.testName}
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-2 mb-2">
                    {score.score && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Score:</span> {score.score}
                        </div>
                    )}
                    {score.year && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <Calendar className="w-4 h-4" />
                            <span>Year: {score.year}</span>
                        </div>
                    )}
                    {score.percentileRank && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <TrendingUp className="w-4 h-4" />
                            <span>Percentile/Rank: {score.percentileRank}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-2 ml-4">
                <button
                    onClick={onEdit}
                    className="p-2 text-text-muted hover:text-accent dark:hover:text-dark-accent hover:bg-accent/10 rounded-lg transition-all"
                    title="Edit"
                >
                    <Edit size={18} />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    </div>
);

export function TestScoresForm({
    onBack,
    onNext,
    onNavigateToSection,
}: TestScoresFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempItem, setTempItem] = useState<Partial<TestScoreItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const scores = data.testScores || [];

    const isSummaryView = scores.length > 0 && !isEditing;

    const testTypes = [
        "GRE",
        "GMAT",
        "GATE",
        "TOEFL",
        "IELTS",
        "SAT",
        "ACT",
        "LSAT",
        "MCAT",
        "CAT",
        "MAT",
        "XAT",
        "Other",
    ];

    // Current item being edited
    const currentItem = tempItem;

    // Initial setup
    useEffect(() => {
        if (scores.length === 0) {
            setIsEditing(true);
            setTempItem({ id: `testscore-${Date.now()}` });
        }
    }, [scores.length]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!tempItem.testName?.trim()) {
            newErrors.testName = "Test Name is required";
        } else if (tempItem.testName.length > 80) {
            newErrors.testName = "Test Name must be less than 80 characters";
        }

        if (!tempItem.score?.trim()) {
            newErrors.score = "Score is required";
        } else if (tempItem.score.length > 50) {
            newErrors.score = "Score must be less than 50 characters";
        }

        if (tempItem.year && !/^\d{4}$/.test(tempItem.year)) {
            newErrors.year = "Year must be a 4-digit number";
        }

        if (tempItem.percentileRank && tempItem.percentileRank.length > 50) {
            newErrors.percentileRank = "Percentile/Rank must be less than 50 characters";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error('Please fix the validation errors', {
                style: toastStyle.error,
                duration: 3000,
            });
        }

        return Object.keys(newErrors).length === 0;
    };

    const isFormValid = () => {
        return tempItem.testName?.trim() !== "" && 
               tempItem.score?.trim() !== "";
    };

    const handleSubmit = () => {
        // Mark all fields as touched first
        setTouched({
            testName: true,
            score: true,
            year: true,
            percentileRank: true
        });
        
        if (!validateForm()) {
            return;
        }

        updateData((draft) => {
            if (!draft.testScores) draft.testScores = [];
            if (editingId) {
                const index = draft.testScores.findIndex((s) => s.id === editingId);
                if (index !== -1) {
                    draft.testScores[index] = tempItem as TestScoreItem;
                }
                toast.success('Test score updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.testScores.push(tempItem as TestScoreItem);
                toast.success('Test score added successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            }
        });

        save();
        setIsEditing(false);
        setEditingId(null);
        setTempItem({});
    };

    const handleEdit = (id: string) => {
        const item = scores.find((s) => s.id === id);
        if (item) {
            setEditingId(id);
            setTempItem({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this test score?")) {
            updateData((draft) => {
                if (draft.testScores) {
                    draft.testScores = draft.testScores.filter((s) => s.id !== id);
                }
            });
            toast.success('Test score deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            save();
            if (scores.length <= 1) {
                setIsEditing(true);
                setTempItem({ id: `testscore-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempItem({ id: `testscore-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempItem((prev) => ({ ...prev, [field]: value }));
        if (field === "testName" && errors.testName) {
            setErrors((prev) => ({ ...prev, testName: undefined }));
        }
        if (field === "score" && errors.score) {
            setErrors((prev) => ({ ...prev, score: undefined }));
        }
        if (field === "year" && errors.year) {
            setErrors((prev) => ({ ...prev, year: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        
        // Validate on blur
        if (field === "testName" && !tempItem.testName?.trim()) {
            setErrors((prev) => ({ ...prev, testName: "Test Name is required" }));
        }
        
        if (field === "score" && !tempItem.score?.trim()) {
            setErrors((prev) => ({ ...prev, score: "Score is required" }));
        }

        if (field === "year" && tempItem.year && !/^\d{4}$/.test(tempItem.year)) {
            setErrors((prev) => ({ ...prev, year: "Year must be a 4-digit number" }));
        }
    };

    const handleBack = () => {
        if (onNavigateToSection) {
            onNavigateToSection("customSections");
        } else if (onBack) {
            onBack();
        }
    };

    const handleContinue = () => {
        if (isSummaryView) {
            if (onNavigateToSection) {
                onNavigateToSection("customSections");
            } else {
                navigate(`/preview/${id}`);
            }
        }
    };

    const renderSummary = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    Test Scores <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your test scores.
                </p>
            </div>

            <div className="space-y-4">
                {scores.map((score) => (
                    <TestScoreCard
                        key={score.id}
                        score={score}
                        onEdit={() => handleEdit(score.id)}
                        onDelete={() => handleDelete(score.id)}
                    />
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleAddMore}
                    className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-base text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add more test scores
                </button>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-light-border dark:border-dark-border">
                <button
                    onClick={handleBack}
                    className="px-8 py-3 rounded-xl border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:bg-accent/10 hover:border-accent transition-all duration-200 text-base"
                >
                    ← Back
                </button>
                <button
                    onClick={handleContinue}
                    className="px-8 py-3 rounded-xl bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-base"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderForm = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Test Score</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Add your standardized test scores.
                </p>
            </div>

            <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StyledSelect
                        label="Test Name"
                        value={currentItem.testName}
                        onChange={(e) => updateField("testName", e.target.value)}
                        onBlur={() => handleBlur("testName")}
                        options={testTypes}
                        required
                        icon={<Award className="w-4 h-4" />}
                        error={touched.testName ? errors.testName : ""}
                        placeholder="Select test"
                    />

                    <StyledInput
                        label="Score"
                        placeholder=" 330"
                        value={currentItem.score}
                        onChange={(e) => updateField("score", e.target.value)}
                        onBlur={() => handleBlur("score")}
                        required
                        maxLength={50}
                        characterCount
                        icon={<Percent className="w-4 h-4" />}
                        error={touched.score ? errors.score : ""}
                    />

                    <StyledInput
                        label="Year"
                        placeholder=" 2023"
                        value={currentItem.year}
                        onChange={(e) => updateField("year", e.target.value)}
                        onBlur={() => handleBlur("year")}
                        maxLength={4}
                        characterCount
                        icon={<Calendar className="w-4 h-4" />}
                        error={touched.year ? errors.year : ""}
                        type="number"
                    />

                    <StyledInput
                        label="Percentile / Rank"
                        placeholder=" 95th percentile"
                        value={currentItem.percentileRank}
                        onChange={(e) => updateField("percentileRank", e.target.value)}
                        maxLength={50}
                        characterCount
                        icon={<TrendingUp className="w-4 h-4" />}
                        error={touched.percentileRank ? errors.percentileRank : ""}
                    />
                </div>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-light-border dark:border-dark-border">
                <button
                    onClick={() => {
                        if (editingId) {
                            setIsEditing(false);
                            setEditingId(null);
                        } else {
                            handleBack();
                        }
                    }}
                    className="px-8 py-3 rounded-xl border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:bg-accent/10 hover:border-accent transition-all duration-200 text-base"
                >
                    ← Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    className={`px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-base ${
                        isFormValid()
                            ? 'bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white cursor-pointer'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {editingId ? 'Update' : 'Save'} & Continue
                </button>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
            {isSummaryView ? renderSummary() : renderForm()}
        </div>
    );
}

export default TestScoresForm;