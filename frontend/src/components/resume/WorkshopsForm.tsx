import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MonthYearPicker } from "./MonthYearPicker";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface WorkshopItem {
    id: string;
    programTitle: string; // Program Title (required)
    conductedBy: string; // Conducted By
    year: string; // Year
    description: string; // Description (120 chars)
}

interface WorkshopsFormProps {
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
}) => {
    const [isFocused, setIsFocused] = useState(false);

    let baseInputClass = `w-full px-4 py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-base text-text-primary dark:text-dark-text-primary placeholder:text-sm placeholder:text-text-muted/70 dark:placeholder:text-dark-text-muted/70 shadow-sm hover:shadow-md`;

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
                <input
                    type="text"
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
    maxLength,
    error,
    onBlur,
    rows = 3,
}: {
    label: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
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
                {label}
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

// Workshop Card Component for Summary View
const WorkshopCard = ({ workshop, onEdit, onDelete }: { 
    workshop: WorkshopItem; 
    onEdit: () => void; 
    onDelete: () => void;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary mb-1">
                    {workshop.programTitle}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    {workshop.conductedBy && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Conducted By:</span> {workshop.conductedBy}
                        </div>
                    )}
                    {workshop.year && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Year:</span> {workshop.year}
                        </div>
                    )}
                </div>

                {workshop.description && (
                    <div className="mt-3 p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                        <p className="text-sm text-text-primary dark:text-dark-text-primary">
                            {workshop.description.length > 100 
                                ? workshop.description.substring(0, 100) + '...' 
                                : workshop.description}
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

export function WorkshopsForm({
    onBack,
    onNext,
    onNavigateToSection,
}: WorkshopsFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempItem, setTempItem] = useState<Partial<WorkshopItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const workshops = data.workshops || [];

    const isSummaryView = workshops.length > 0 && !isEditing;

    // Current item being edited
    const currentItem = tempItem;

    // Initial setup
    React.useEffect(() => {
        if (workshops.length === 0) {
            setIsEditing(true);
            setTempItem({ id: `workshop-${Date.now()}` });
        }
    }, [workshops.length]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!tempItem.programTitle?.trim()) {
            newErrors.programTitle = "Program Title is required";
        } else if (tempItem.programTitle.length > 120) {
            newErrors.programTitle = "Program Title must be less than 120 characters";
        }

        if (tempItem.conductedBy && tempItem.conductedBy.length > 120) {
            newErrors.conductedBy = "Conducted By must be less than 120 characters";
        }

        if (tempItem.description && tempItem.description.length > 120) {
            newErrors.description = "Description must be less than 120 characters";
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
        return tempItem.programTitle?.trim() !== "";
    };

    const handleSubmit = () => {
        // Mark all fields as touched first
        setTouched({
            programTitle: true,
            conductedBy: true,
            description: true
        });
        
        if (!validateForm()) {
            return;
        }

        updateData((draft) => {
            if (!draft.workshops) draft.workshops = [];
            if (editingId) {
                const index = draft.workshops.findIndex((a) => a.id === editingId);
                if (index !== -1) {
                    draft.workshops[index] = tempItem as WorkshopItem;
                }
                toast.success('Workshop updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.workshops.push(tempItem as WorkshopItem);
                toast.success('Workshop added successfully!', {
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
        const item = workshops.find((a) => a.id === id);
        if (item) {
            setEditingId(id);
            setTempItem({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this workshop?")) {
            updateData((draft) => {
                if (draft.workshops) {
                    draft.workshops = draft.workshops.filter((a) => a.id !== id);
                }
            });
            toast.success('Workshop deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            save();
            if (workshops.length <= 1) {
                setIsEditing(true);
                setTempItem({ id: `workshop-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempItem({ id: `workshop-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempItem((prev) => ({ ...prev, [field]: value }));
        if (field === "programTitle" && errors.programTitle) {
            setErrors((prev) => ({ ...prev, programTitle: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        
        // Validate on blur
        if (field === "programTitle" && !tempItem.programTitle?.trim()) {
            setErrors((prev) => ({ ...prev, programTitle: "Program Title is required" }));
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
                    Workshops <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage workshops you've attended or conducted.
                </p>
            </div>

            <div className="space-y-4">
                {workshops.map((workshop) => (
                    <WorkshopCard
                        key={workshop.id}
                        workshop={workshop}
                        onEdit={() => handleEdit(workshop.id)}
                        onDelete={() => handleDelete(workshop.id)}
                    />
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleAddMore}
                    className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-base text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
                >
                    + Add more workshops
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
                    {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Workshop</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    List workshops you've attended or conducted to showcase continuous learning.
                </p>
            </div>

            <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StyledInput
                        label="Program Title"
                        placeholder="e.g., Advanced React Patterns Workshop"
                        value={currentItem.programTitle}
                        onChange={(e) => updateField("programTitle", e.target.value)}
                        onBlur={() => handleBlur("programTitle")}
                        required
                        maxLength={120}
                        characterCount
                        error={touched.programTitle ? errors.programTitle : ""}
                    />

                    <StyledInput
                        label="Conducted By"
                        placeholder="e.g., Udemy, Coursera, Pluralsight"
                        value={currentItem.conductedBy}
                        onChange={(e) => updateField("conductedBy", e.target.value)}
                        maxLength={120}
                        characterCount
                        error={touched.conductedBy ? errors.conductedBy : ""}
                    />

                    <div>
                        <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
                            Year
                        </label>
                        <MonthYearPicker
                            value={currentItem.year || ""}
                            onChange={(value) => updateField("year", value)}
                            className="w-full"
                            placeholder="Select year"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <StyledTextArea
                            label="Description"
                            value={currentItem.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Describe what you learned and key takeaways..."
                            maxLength={120}
                            rows={3}
                            error={touched.description ? errors.description : ""}
                        />
                    </div>
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
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isSummaryView ? renderSummary() : renderForm()}
        </div>
    );
}