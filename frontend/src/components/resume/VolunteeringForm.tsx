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

interface VolunteeringItem {
    id: string;
    role: string; // Role/Position (120 chars)
    organization: string; // Organization Name (120 chars)
    causeArea: string; // Cause/Area (120 chars) - Education, Health, Environment, etc.
    duration: string; // Duration (50 chars) - Example: 2021 – 2023
    description: string; // Description (200 chars) - Brief description of contribution
}

interface VolunteeringFormProps {
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
    tooltip,
}: {
    label: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    maxLength?: number;
    error?: string;
    onBlur?: () => void;
    rows?: number;
    tooltip?: string;
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
            <div className="flex items-center gap-2 mb-1.5">
                <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                    {label}
                </label>
                {tooltip && (
                    <div className="group relative">
                        <div className="cursor-help text-text-muted dark:text-dark-text-muted text-xs bg-gray-200 dark:bg-gray-700 rounded-full w-4 h-4 flex items-center justify-center">
                            ?
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10">
                            {tooltip}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                )}
            </div>
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

// Volunteering Card Component for Summary View
const VolunteeringCard = ({ item, onEdit, onDelete }: { 
    item: VolunteeringItem; 
    onEdit: () => void; 
    onDelete: () => void;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary mb-1">
                    {item.role}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    {item.organization && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Organization:</span> {item.organization}
                        </div>
                    )}
                    {item.causeArea && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Cause:</span> {item.causeArea}
                        </div>
                    )}
                    {item.duration && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Duration:</span> {item.duration}
                        </div>
                    )}
                </div>

                {item.description && (
                    <div className="mt-3 p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                        <p className="text-sm text-text-primary dark:text-dark-text-primary">
                            {item.description.length > 150 
                                ? item.description.substring(0, 150) + '...' 
                                : item.description}
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

export function VolunteeringForm({
    onBack,
    onNext,
    onNavigateToSection,
}: VolunteeringFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempItem, setTempItem] = useState<Partial<VolunteeringItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const volunteering = data.volunteering || [];

    const isSummaryView = volunteering.length > 0 && !isEditing;

    // Current item being edited
    const currentItem = tempItem;

    // Initial setup
    React.useEffect(() => {
        if (volunteering.length === 0) {
            setIsEditing(true);
            setTempItem({ id: `volunteering-${Date.now()}` });
        }
    }, [volunteering.length]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!tempItem.role?.trim()) {
            newErrors.role = "Role/Position is required";
        } else if (tempItem.role.length > 120) {
            newErrors.role = "Role/Position must be less than 120 characters";
        }

        if (tempItem.organization && tempItem.organization.length > 120) {
            newErrors.organization = "Organization Name must be less than 120 characters";
        }

        if (tempItem.causeArea && tempItem.causeArea.length > 120) {
            newErrors.causeArea = "Cause/Area must be less than 120 characters";
        }

        if (tempItem.duration && tempItem.duration.length > 50) {
            newErrors.duration = "Duration must be less than 50 characters";
        }

        if (tempItem.description && tempItem.description.length > 200) {
            newErrors.description = "Description must be less than 200 characters";
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
        return tempItem.role?.trim() !== "";
    };

    const handleSubmit = () => {
        // Mark all fields as touched first
        setTouched({
            role: true,
            organization: true,
            causeArea: true,
            duration: true,
            description: true
        });
        
        if (!validateForm()) {
            return;
        }

        updateData((draft) => {
            if (!draft.volunteering) draft.volunteering = [];
            if (editingId) {
                const index = draft.volunteering.findIndex((v) => v.id === editingId);
                if (index !== -1) {
                    draft.volunteering[index] = tempItem as VolunteeringItem;
                }
                toast.success('Volunteering experience updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.volunteering.push(tempItem as VolunteeringItem);
                toast.success('Volunteering experience added successfully!', {
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
        const item = volunteering.find((v) => v.id === id);
        if (item) {
            setEditingId(id);
            setTempItem({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this volunteering experience?")) {
            updateData((draft) => {
                if (draft.volunteering) {
                    draft.volunteering = draft.volunteering.filter((v) => v.id !== id);
                }
            });
            toast.success('Volunteering experience deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            save();
            if (volunteering.length <= 1) {
                setIsEditing(true);
                setTempItem({ id: `volunteering-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempItem({ id: `volunteering-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempItem((prev) => ({ ...prev, [field]: value }));
        if (field === "role" && errors.role) {
            setErrors((prev) => ({ ...prev, role: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        
        // Validate on blur
        if (field === "role" && !tempItem.role?.trim()) {
            setErrors((prev) => ({ ...prev, role: "Role/Position is required" }));
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
                    Volunteering <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your volunteering experience.
                </p>
            </div>

            <div className="space-y-4">
                {volunteering.map((item) => (
                    <VolunteeringCard
                        key={item.id}
                        item={item}
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
                    <Plus className="w-5 h-5" /> Add more volunteering experience
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
                    {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Volunteering Experience</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Add details about your volunteer work and contributions.
                </p>
            </div>

            <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StyledInput
                        label="Role / Position"
                        placeholder="e.g., Volunteer Coordinator"
                        value={currentItem.role}
                        onChange={(e) => updateField("role", e.target.value)}
                        onBlur={() => handleBlur("role")}
                        required
                        maxLength={120}
                        characterCount
                        error={touched.role ? errors.role : ""}
                        tooltip="Volunteer role or position"
                    />

                    <StyledInput
                        label="Organization Name"
                        placeholder="e.g., Red Cross"
                        value={currentItem.organization}
                        onChange={(e) => updateField("organization", e.target.value)}
                        maxLength={120}
                        characterCount
                        error={touched.organization ? errors.organization : ""}
                        tooltip="NGO or organization name"
                    />

                    <StyledInput
                        label="Cause / Area"
                        placeholder="e.g., Education, Health, Environment"
                        value={currentItem.causeArea}
                        onChange={(e) => updateField("causeArea", e.target.value)}
                        maxLength={120}
                        characterCount
                        error={touched.causeArea ? errors.causeArea : ""}
                        tooltip="Education, Health, Environment, etc."
                    />

                    <StyledInput
                        label="Duration"
                        placeholder="e.g., 2021 – 2023"
                        value={currentItem.duration}
                        onChange={(e) => updateField("duration", e.target.value)}
                        maxLength={50}
                        characterCount
                        error={touched.duration ? errors.duration : ""}
                        tooltip="Example: 2021 – 2023"
                    />

                    <div className="md:col-span-2">
                        <StyledTextArea
                            label="Description"
                            value={currentItem.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Brief description of your contribution..."
                            maxLength={200}
                            rows={3}
                            error={touched.description ? errors.description : ""}
                            tooltip="Brief description of contribution"
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