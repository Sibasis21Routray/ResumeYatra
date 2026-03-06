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

interface ReferenceItem {
    id: string;
    name: string; // Referee Name (120 chars) - required
    designationRelationship: string; // Designation/Relationship (120 chars) - required
    organization: string; // Organization (120 chars) - required
    contactInformation: string; // Contact Information (120 chars) - required
}

interface ReferencesFormProps {
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
    type?: string;
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

// Reference Card Component for Summary View
const ReferenceCard = ({ reference, onEdit, onDelete }: { 
    reference: ReferenceItem; 
    onEdit: () => void; 
    onDelete: () => void;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary mb-1">
                    {reference.name}
                </h3>
                
                <div className="grid grid-cols-1 gap-2">
                    {reference.designationRelationship && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Designation:</span> {reference.designationRelationship}
                        </div>
                    )}
                    {reference.organization && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Organization:</span> {reference.organization}
                        </div>
                    )}
                    {reference.contactInformation && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Contact:</span> {reference.contactInformation}
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

export function ReferencesForm({
    onBack,
    onNext,
    onNavigateToSection,
}: ReferencesFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempItem, setTempItem] = useState<Partial<ReferenceItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const references = data.references || [];

    const isSummaryView = references.length > 0 && !isEditing;

    // Current item being edited
    const currentItem = tempItem;

    // Initial setup
    React.useEffect(() => {
        if (references.length === 0) {
            setIsEditing(true);
            setTempItem({ id: `ref-${Date.now()}` });
        }
    }, [references.length]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!tempItem.name?.trim()) {
            newErrors.name = "Referee Name is required";
        } else if (tempItem.name.length > 120) {
            newErrors.name = "Referee Name must be less than 120 characters";
        }

        if (!tempItem.designationRelationship?.trim()) {
            newErrors.designationRelationship = "Designation/Relationship is required";
        } else if (tempItem.designationRelationship.length > 120) {
            newErrors.designationRelationship = "Designation/Relationship must be less than 120 characters";
        }

        if (!tempItem.organization?.trim()) {
            newErrors.organization = "Organization is required";
        } else if (tempItem.organization.length > 120) {
            newErrors.organization = "Organization must be less than 120 characters";
        }

        if (!tempItem.contactInformation?.trim()) {
            newErrors.contactInformation = "Contact Information is required";
        } else if (tempItem.contactInformation.length > 120) {
            newErrors.contactInformation = "Contact Information must be less than 120 characters";
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
        return tempItem.name?.trim() !== "" && 
               tempItem.designationRelationship?.trim() !== "" && 
               tempItem.organization?.trim() !== "" && 
               tempItem.contactInformation?.trim() !== "";
    };

    const handleSubmit = () => {
        // Mark all fields as touched first
        setTouched({
            name: true,
            designationRelationship: true,
            organization: true,
            contactInformation: true
        });
        
        if (!validateForm()) {
            return;
        }

        updateData((draft) => {
            if (!draft.references) draft.references = [];
            if (editingId) {
                const index = draft.references.findIndex((r) => r.id === editingId);
                if (index !== -1) {
                    draft.references[index] = tempItem as ReferenceItem;
                }
                toast.success('Reference updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.references.push(tempItem as ReferenceItem);
                toast.success('Reference added successfully!', {
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
        const item = references.find((r) => r.id === id);
        if (item) {
            setEditingId(id);
            setTempItem({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this reference?")) {
            updateData((draft) => {
                if (draft.references) {
                    draft.references = draft.references.filter((r) => r.id !== id);
                }
            });
            toast.success('Reference deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            save();
            if (references.length <= 1) {
                setIsEditing(true);
                setTempItem({ id: `ref-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        // Check if already have 2 references (max)
        if (references.length >= 2) {
            toast.error('Maximum 2 references allowed', {
                style: toastStyle.error,
                duration: 3000,
            });
            return;
        }
        
        setEditingId(null);
        setTempItem({ id: `ref-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempItem((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        
        // Validate on blur
        if (field === "name" && !tempItem.name?.trim()) {
            setErrors((prev) => ({ ...prev, name: "Referee Name is required" }));
        }
        
        if (field === "designationRelationship" && !tempItem.designationRelationship?.trim()) {
            setErrors((prev) => ({ ...prev, designationRelationship: "Designation/Relationship is required" }));
        }
        
        if (field === "organization" && !tempItem.organization?.trim()) {
            setErrors((prev) => ({ ...prev, organization: "Organization is required" }));
        }
        
        if (field === "contactInformation" && !tempItem.contactInformation?.trim()) {
            setErrors((prev) => ({ ...prev, contactInformation: "Contact Information is required" }));
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
                    References <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your professional references. Maximum 2 references allowed.
                </p>
                <p className="mt-2 text-sm text-text-muted dark:text-dark-text-muted">
                    {references.length}/2 references added
                </p>
            </div>

            <div className="space-y-4">
                {references.map((reference) => (
                    <ReferenceCard
                        key={reference.id}
                        reference={reference}
                        onEdit={() => handleEdit(reference.id)}
                        onDelete={() => handleDelete(reference.id)}
                    />
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleAddMore}
                    disabled={references.length >= 2}
                    className={`w-full border-2 border-dashed rounded-xl py-4 text-base transition-all flex items-center justify-center gap-2 ${
                        references.length >= 2
                            ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
                            : 'border-light-border dark:border-dark-border text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent'
                    }`}
                >
                    <Plus className="w-5 h-5" /> 
                    {references.length >= 2 ? 'Maximum references reached' : 'Add more references'}
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
                    {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Reference</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Add professional references who can vouch for your work. Maximum 2 references.
                </p>
               
            </div>

            <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl  pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StyledInput
                        label="Referee Name"
                        placeholder="e.g., John Smith"
                        value={currentItem.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        required
                        maxLength={120}
                        characterCount
                        error={touched.name ? errors.name : ""}
                    />

                    <StyledInput
                        label="Designation / Relationship"
                        placeholder="e.g., Manager, Client, Mentor"
                        value={currentItem.designationRelationship}
                        onChange={(e) => updateField("designationRelationship", e.target.value)}
                        onBlur={() => handleBlur("designationRelationship")}
                        required
                        maxLength={120}
                        characterCount
                        error={touched.designationRelationship ? errors.designationRelationship : ""}
                    />

                    <StyledInput
                        label="Organization"
                        placeholder="e.g., ABC Corporation"
                        value={currentItem.organization}
                        onChange={(e) => updateField("organization", e.target.value)}
                        onBlur={() => handleBlur("organization")}
                        required
                        maxLength={120}
                        characterCount
                        error={touched.organization ? errors.organization : ""}
                    />

                    <StyledInput
                        label="Contact Information"
                        placeholder="e.g., email@example.com or +1 (555) 123-4567"
                        value={currentItem.contactInformation}
                        onChange={(e) => updateField("contactInformation", e.target.value)}
                        onBlur={() => handleBlur("contactInformation")}
                        required
                        maxLength={120}
                        characterCount
                        error={touched.contactInformation ? errors.contactInformation : ""}
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
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 ">
            {isSummaryView ? renderSummary() : renderForm()}
        </div>
    );
}