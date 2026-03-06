import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MonthYearPicker } from "./MonthYearPicker";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, Award, Building, Calendar, AlertCircle, Plus, Trophy } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface ScholarshipItem {
    id: string;
    name: string;
    provider: string;
    year: string;
    description: string;
}

interface ScholarshipsFormProps {
    onBack?: () => void;
    onNext?: () => void;
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
                    onBlur={() => setIsFocused(false)}
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
    rows = 3,
}: {
    label: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
    error?: string;
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
                    onBlur={() => setIsFocused(false)}
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

// Section Card Component - simplified without header
const SectionCard = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5">
        {children}
    </div>
);

export function ScholarshipsForm({
    onBack,
    onNext,
}: ScholarshipsFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempScholarship, setTempScholarship] = useState<Partial<ScholarshipItem>>({});
    const [errors, setErrors] = useState<{ name?: string }>({});

    const scholarships = data.scholarships || [];

    const isSummaryView = scholarships.length > 0 && !isEditing;

    const currentScholarship = tempScholarship;

    useEffect(() => {
        if (scholarships.length === 0) {
            setIsEditing(true);
            setTempScholarship({ id: `scholarship-${Date.now()}` });
        }
    }, [scholarships.length]);

    const validateData = () => {
        const newErrors: { name?: string } = {};
        
        if (!tempScholarship.name?.trim()) {
            newErrors.name = "Scholarship name is required";
        } else if (tempScholarship.name.length > 120) {
            newErrors.name = "Scholarship name must be less than 120 characters";
        }

        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
            toast.error('Please fill in all required fields', {
                style: toastStyle.error,
                duration: 3000,
            });
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateData()) {
            return;
        }

        updateData((draft) => {
            if (!draft.scholarships) draft.scholarships = [];
            if (editingId) {
                const index = draft.scholarships.findIndex((s) => s.id === editingId);
                if (index !== -1) {
                    draft.scholarships[index] = tempScholarship as ScholarshipItem;
                }
                toast.success('Scholarship updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.scholarships.push(tempScholarship as ScholarshipItem);
                toast.success('Scholarship added successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            }
        });
        
        // Save to database after updating
        save();
        setIsEditing(false);
        setEditingId(null);
        setTempScholarship({});
    };

    const handleEdit = (id: string) => {
        const item = scholarships.find((s) => s.id === id);
        if (item) {
            setEditingId(id);
            setTempScholarship({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this scholarship?")) {
            updateData((draft) => {
                if (draft.scholarships) {
                    draft.scholarships = draft.scholarships.filter((s) => s.id !== id);
                }
            });
            toast.success('Scholarship deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            // Save to database after deleting
            save();
            if (scholarships.length <= 1) {
                setIsEditing(true);
                setTempScholarship({ id: `scholarship-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempScholarship({ id: `scholarship-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempScholarship((prev) => ({ ...prev, [field]: value }));
        // Clear error for required fields when user starts typing
        if (field === "name") {
            setErrors((prev) => ({ ...prev, name: undefined }));
        }
    };

    const renderSummary = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    Scholarships <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your scholarships.
                </p>
            </div>

            <div className="space-y-4">
                {scholarships.map((item, index) => (
                    <div key={item.id} className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trophy className="w-5 h-5 text-accent dark:text-dark-accent" />
                                    <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">
                                        {item.name}
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                    {item.provider && (
                                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                                            <Building className="w-4 h-4" />
                                            <span>{item.provider}</span>
                                        </div>
                                    )}
                                    {item.year && (
                                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                                            <Calendar className="w-4 h-4" />
                                            <span>{item.year}</span>
                                        </div>
                                    )}
                                </div>

                                {item.description && (
                                    <div className="mt-3 p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                                        <p className="text-sm text-text-primary dark:text-dark-text-primary whitespace-pre-line">
                                            {item.description.length > 100 
                                                ? item.description.substring(0, 100) + '...' 
                                                : item.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => handleEdit(item.id)}
                                    className="p-2 text-text-muted hover:text-accent dark:hover:text-dark-accent hover:bg-accent/10 rounded-lg transition-all"
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleAddMore}
                    className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-base text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add more scholarships
                </button>
            </div>
        </div>
    );

    const renderForm = () => (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    Add <span className="text-accent dark:text-dark-accent">Scholarship</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Mention scholarships, fellowships or merit awards
                </p>
            </div>

            {/* Scholarship Details - No header */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StyledInput
                        label="Scholarship Name"
                        placeholder="Merit Scholarship, Research Fellowship"
                        value={currentScholarship.name || ""}
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                        maxLength={120}
                        characterCount
                        icon={<Award className="w-4 h-4" />}
                        error={errors.name}
                    />

                    <StyledInput
                        label="Awarding Body"
                        placeholder="University, Foundation, Government"
                        value={currentScholarship.provider || ""}
                        onChange={(e) => updateField("provider", e.target.value)}
                        maxLength={120}
                        characterCount
                        icon={<Building className="w-4 h-4" />}
                    />
                </div>
            </div>

            {/* Year - No header */}
            <div className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
                        Year
                    </label>
                    <MonthYearPicker
                        value={currentScholarship.year || ""}
                        onChange={(value) => updateField("year", value)}
                        className="w-full"
                        placeholder="Select year"
                    />
                </div>
            </div>

            {/* Key Contributions & Learnings - No header */}
            <div className="space-y-4">
                <StyledTextArea
                    label="Description"
                    value={currentScholarship.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Mention selection criteria, scope, or significance of the scholarship (1–2 points)"
                    maxLength={150}
                    rows={3}
                />
            </div>
        </div>
    );

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            {isSummaryView ? renderSummary() : renderForm()}

            {/* Footer */}
            <div className="flex justify-between mt-8 pt-6 border-t border-light-border dark:border-dark-border">
                <button
                    onClick={onBack}
                    className="px-8 py-3 rounded-xl border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:bg-accent/10 hover:border-accent transition-all duration-200 text-base"
                >
                    ← Back
                </button>

                {!isSummaryView && (
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 rounded-xl bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-base"
                    >
                        {editingId ? 'Update & Continue' : 'Save & Continue'}
                    </button>
                )}

                {isSummaryView && (
                    <button
                        onClick={onNext}
                        className="px-8 py-3 rounded-xl bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-base"
                    >
                        Continue →
                    </button>
                )}
            </div>
        </div>
    );
}

export default ScholarshipsForm;