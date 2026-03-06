import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MonthYearPicker } from "./MonthYearPicker";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, Award, Building2, Calendar, FileText, AlertCircle, Plus, ChevronRight } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface AwardItem {
    id: string;
    title: string;
    organization: string;
    issueYear: string;
    description: string;
}

interface AwardsFormProps {
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
    type = "text",
    required = false,
    maxLength,
    icon,
    error,
    onBlur,
    characterCount,
}: {
    label: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    maxLength?: number;
    icon?: React.ReactNode;
    error?: string;
    onBlur?: () => void;
    characterCount?: boolean;
}) => {
    const [isFocused, setIsFocused] = useState(false);

    let baseInputClass = `w-full ${icon ? 'pl-10' : 'pl-3'} pr-${characterCount ? '16' : '3'} py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-base text-text-primary dark:text-dark-text-primary placeholder:text-sm placeholder:text-text-muted/70 dark:placeholder:text-dark-text-muted/70 shadow-sm hover:shadow-md`;

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

// Styled TextArea Component
const StyledTextArea = ({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    maxLength,
    error,
    onBlur,
    rows = 4,
}: {
    label: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
    error?: string;
    onBlur?: () => void;
    rows?: number;
}) => {
    const [isFocused, setIsFocused] = useState(false);

    let baseInputClass = `w-full px-4 py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-base text-text-primary dark:text-dark-text-primary placeholder:text-sm placeholder:text-text-muted/70 dark:placeholder:text-dark-text-muted/70 shadow-sm hover:shadow-md resize-none`;

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
                <textarea
                    value={value || ""}
                    onChange={onChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    rows={rows}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        onBlur?.();
                    }}
                    className={`${baseInputClass}`}
                />
                {maxLength && (
                    <div className="absolute right-3 bottom-3 text-xs text-text-muted dark:text-dark-text-muted">
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

// Simplified Section Card - no header
const SectionCard = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 shadow-sm">
        {children}
    </div>
);

// Award Card Component for Summary View
const AwardCard = ({ award, onEdit, onDelete }: { 
    award: AwardItem; 
    onEdit: () => void; 
    onDelete: () => void;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-accent dark:text-dark-accent" />
                    <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">
                        {award.title}
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {award.organization && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <Building2 className="w-4 h-4" />
                            <span>{award.organization}</span>
                        </div>
                    )}
                    {award.issueYear && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <Calendar className="w-4 h-4" />
                            <span>{award.issueYear}</span>
                        </div>
                    )}
                </div>

                {award.description && (
                    <div className="mt-3 p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                        <p className="text-sm text-text-primary dark:text-dark-text-primary whitespace-pre-line">
                            {award.description.length > 100 
                                ? award.description.substring(0, 100) + '...' 
                                : award.description}
                        </p>
                    </div>
                )}
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

export function AwardsForm({
    onBack,
    onNext,
    onNavigateToSection,
}: AwardsFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempAward, setTempAward] = useState<Partial<AwardItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const awards = data.awards || [];

    const isSummaryView = awards.length > 0 && !isEditing;

    // Current award being edited
    const currentAward = tempAward;

    // Initial setup
    useEffect(() => {
        if (awards.length === 0) {
            setIsEditing(true);
            setTempAward({ id: `award-${Date.now()}` });
        }
    }, [awards.length]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!tempAward.title?.trim()) {
            newErrors.title = "Award title is required";
        } else if (tempAward.title.length > 120) {
            newErrors.title = "Award title must be less than 120 characters";
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
        return tempAward.title?.trim() !== "";
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        updateData((draft) => {
            if (!draft.awards) draft.awards = [];
            if (editingId) {
                const index = draft.awards.findIndex((a) => a.id === editingId);
                if (index !== -1) {
                    draft.awards[index] = tempAward as AwardItem;
                }
                toast.success('Award updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.awards.push(tempAward as AwardItem);
                toast.success('Award added successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            }
        });

        save();
        setIsEditing(false);
        setEditingId(null);
        setTempAward({});
    };

    const handleEdit = (id: string) => {
        const award = awards.find((a) => a.id === id);
        if (award) {
            setEditingId(id);
            setTempAward({ ...award });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this award?")) {
            updateData((draft) => {
                if (draft.awards) {
                    draft.awards = draft.awards.filter((a) => a.id !== id);
                }
            });
            toast.success('Award deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            save();
            if (awards.length <= 1) {
                setIsEditing(true);
                setTempAward({ id: `award-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempAward({ id: `award-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempAward((prev) => ({ ...prev, [field]: value }));
        if (field === "title" && errors.title) {
            setErrors((prev:any) => ({ ...prev, title: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        
        // Validate on blur
        if (field === "title" && !tempAward.title?.trim()) {
            setErrors((prev) => ({ ...prev, title: "Award title is required" }));
        } else if (field === "title" && tempAward.title && tempAward.title.length > 120) {
            setErrors((prev) => ({ ...prev, title: "Award title must be less than 120 characters" }));
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
        if (onNavigateToSection) {
            onNavigateToSection("customSections");
        } else {
            navigate(`/preview/${id}`);
        }
    };

    const renderSummary = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    Awards <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your awards and achievements.
                </p>
            </div>

            <div className="space-y-4">
                {awards.map((award) => (
                    <AwardCard
                        key={award.id}
                        award={award}
                        onEdit={() => handleEdit(award.id)}
                        onDelete={() => handleDelete(award.id)}
                    />
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleAddMore}
                    className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-base text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add more awards
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
                    className="px-8 py-3 rounded-xl bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-base flex items-center gap-2"
                >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    const renderForm = () => (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Award</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Add your achievements and awards.
                </p>
            </div>

            {/* Award Details - No header */}
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StyledInput
                        label="Award Title"
                        placeholder="Employee of the Year"
                        value={currentAward.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        onBlur={() => handleBlur("title")}
                        required
                        maxLength={120}
                        characterCount
                        icon={<Award className="w-4 h-4" />}
                        error={touched.title ? errors.title : ""}
                    />

                    <StyledInput
                        label="Issuing Organization"
                        placeholder="Google"
                        value={currentAward.organization}
                        onChange={(e) => updateField("organization", e.target.value)}
                        maxLength={120}
                        characterCount
                        icon={<Building2 className="w-4 h-4" />}
                    />
                </div>

                <div className="max-w-md">
                    <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
                        Issue Year
                    </label>
                    <MonthYearPicker
                        value={currentAward.issueYear || ""}
                        onChange={(value) => updateField("issueYear", value)}
                        className="w-full"
                        placeholder="Select year"
                    />
                </div>
            </div>

            {/* Description - No header */}
            <div className="space-y-4">
                <StyledTextArea
                    label="Award Description"
                    value={currentAward.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Add details about this award and what you achieved..."
                    maxLength={500}
                    rows={4}
                    error={touched.description ? errors.description : ""}
                />
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
                    className={`px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-base flex items-center gap-2 ${
                        isFormValid()
                            ? 'bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white cursor-pointer'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {editingId ? 'Update' : 'Save'} & Continue
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            {isSummaryView ? renderSummary() : renderForm()}
        </div>
    );
}