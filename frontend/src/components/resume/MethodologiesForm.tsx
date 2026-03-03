import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, AlertCircle, Plus } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface MethodologyItem {
    id: string;
    name: string; // Methodology Name (120 chars) - Agile, Scrum, Six Sigma, etc.
    certification: string; // Certification (120 chars) - Related certification if any
    experienceDuration: string; // Experience Duration (50 chars) - Years of usage
}

interface MethodologiesFormProps {
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
    tooltip,
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
    tooltip?: string;
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
            <div className="flex items-center gap-2 mb-1.5">
                <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                
            </div>
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

// Methodology Card Component for Summary View
const MethodologyCard = ({ methodology, onEdit, onDelete }: { 
    methodology: MethodologyItem; 
    onEdit: () => void; 
    onDelete: () => void;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary mb-1">
                    {methodology.name}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {methodology.certification && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Certification:</span> {methodology.certification}
                        </div>
                    )}
                    {methodology.experienceDuration && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Experience:</span> {methodology.experienceDuration}
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

export function MethodologiesForm({
    onBack,
    onNext,
    onNavigateToSection,
}: MethodologiesFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempItem, setTempItem] = useState<Partial<MethodologyItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const methodologies = data.methodologies || [];

    const isSummaryView = methodologies.length > 0 && !isEditing;

    // Current item being edited
    const currentItem = tempItem;

    // Initial setup
    React.useEffect(() => {
        if (methodologies.length === 0) {
            setIsEditing(true);
            setTempItem({ id: `methodology-${Date.now()}` });
        }
    }, [methodologies.length]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!tempItem.name?.trim()) {
            newErrors.name = "Methodology Name is required";
        } else if (tempItem.name.length > 120) {
            newErrors.name = "Methodology Name must be less than 120 characters";
        }

        if (tempItem.certification && tempItem.certification.length > 120) {
            newErrors.certification = "Certification must be less than 120 characters";
        }

        if (tempItem.experienceDuration && tempItem.experienceDuration.length > 50) {
            newErrors.experienceDuration = "Experience Duration must be less than 50 characters";
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
        return tempItem.name?.trim() !== "";
    };

    const handleSubmit = () => {
        // Mark all fields as touched first
        setTouched({
            name: true,
            certification: true,
            experienceDuration: true
        });
        
        if (!validateForm()) {
            return;
        }

        updateData((draft) => {
            if (!draft.methodologies) draft.methodologies = [];
            if (editingId) {
                const index = draft.methodologies.findIndex((m) => m.id === editingId);
                if (index !== -1) {
                    draft.methodologies[index] = tempItem as MethodologyItem;
                }
                toast.success('Methodology updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.methodologies.push(tempItem as MethodologyItem);
                toast.success('Methodology added successfully!', {
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
        const item = methodologies.find((m) => m.id === id);
        if (item) {
            setEditingId(id);
            setTempItem({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this methodology?")) {
            updateData((draft) => {
                if (draft.methodologies) {
                    draft.methodologies = draft.methodologies.filter((m) => m.id !== id);
                }
            });
            toast.success('Methodology deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            save();
            if (methodologies.length <= 1) {
                setIsEditing(true);
                setTempItem({ id: `methodology-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempItem({ id: `methodology-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempItem((prev) => ({ ...prev, [field]: value }));
        if (field === "name" && errors.name) {
            setErrors((prev) => ({ ...prev, name: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        
        // Validate on blur
        if (field === "name" && !tempItem.name?.trim()) {
            setErrors((prev) => ({ ...prev, name: "Methodology Name is required" }));
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
                    Methodologies <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your methodologies expertise.
                </p>
            </div>

            <div className="space-y-4">
                {methodologies.map((item) => (
                    <MethodologyCard
                        key={item.id}
                        methodology={item}
                        onEdit={() => handleEdit(item.id)}
                        onDelete={() => handleDelete(item.id)}
                    />
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleAddMore}
                    className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-base text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add more methodologies
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
                    {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Methodology</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Add methodologies you're experienced in.
                </p>
            </div>

            <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StyledInput
                        label="Methodology Name"
                        placeholder="e.g., Agile, Scrum, Six Sigma"
                        value={currentItem.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        required
                        maxLength={120}
                        characterCount
                        error={touched.name ? errors.name : ""}
                        tooltip="Agile, Scrum, Six Sigma, etc."
                    />

                    <StyledInput
                        label="Certification"
                        placeholder="e.g., Certified Scrum Master"
                        value={currentItem.certification}
                        onChange={(e) => updateField("certification", e.target.value)}
                        maxLength={120}
                        characterCount
                        error={touched.certification ? errors.certification : ""}
                        tooltip="Related certification if any"
                    />

                    <div className="md:col-span-2">
                        <StyledInput
                            label="Experience Duration"
                            placeholder="e.g., 5 years"
                            value={currentItem.experienceDuration}
                            onChange={(e) => updateField("experienceDuration", e.target.value)}
                            maxLength={50}
                            characterCount
                            error={touched.experienceDuration ? errors.experienceDuration : ""}
                            tooltip="Years of usage"
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