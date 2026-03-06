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

interface SocialProfileItem {
    id: string;
    platform: string; // Platform Name (required) - matches schema
    url: string; // Profile URL (required) - matches schema
}

interface SocialProfilesFormProps {
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
    error,
    onBlur,
    tooltip,
    type = "text",
}: {
    label: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    onBlur?: () => void;
    tooltip?: string;
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
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        onBlur?.();
                    }}
                    className={`${baseInputClass}`}
                />
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
    tooltip,
    placeholder,
}: {
    label: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    required?: boolean;
    error?: string;
    onBlur?: () => void;
    tooltip?: string;
    placeholder?: string;
}) => {
    const [isFocused, setIsFocused] = useState(false);

    let baseSelectClass = `w-full px-4 py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-base text-text-primary dark:text-dark-text-primary shadow-sm hover:shadow-md appearance-none cursor-pointer`;

    if (error) {
        baseSelectClass += " border-red-500 focus:ring-red-500 focus:border-red-500";
    } else if (isFocused) {
        baseSelectClass += " border-accent dark:border-dark-accent ring-2 ring-accent/20";
    } else {
        baseSelectClass += " border-light-border dark:border-dark-border";
    }

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-1.5">
                <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                
            </div>
            <div className="relative w-full">
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
                    <option value="">{placeholder || "Select platform"}</option>
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

// Profile Card Component for Summary View
const ProfileCard = ({ profile, onEdit, onDelete }: { 
    profile: SocialProfileItem; 
    onEdit: () => void; 
    onDelete: () => void;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary mb-1">
                    {profile.platform}
                </h3>
                
                {profile.url && (
                    <div className="text-sm text-text-muted dark:text-dark-text-muted">
                        <span className="font-medium">URL:</span>{" "}
                        <a href={profile.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                            {profile.url.length > 40 ? profile.url.substring(0, 40) + '...' : profile.url}
                        </a>
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

export function SocialProfilesForm({
    onBack,
    onNext,
    onNavigateToSection,
}: SocialProfilesFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempItem, setTempItem] = useState<Partial<SocialProfileItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const profiles = data.socialProfiles || [];

    const isSummaryView = profiles.length > 0 && !isEditing;

    const platforms = [
        "LinkedIn",
        "GitHub",
        "Portfolio",
        "Twitter/X",
        "Facebook",
        "Instagram",
        "YouTube",
        "Medium",
        "Stack Overflow",
        "Dribbble",
        "Behance",
        "Other",
    ];

    // Current item being edited
    const currentItem = tempItem;

    // Initial setup
    React.useEffect(() => {
        if (profiles.length === 0) {
            setIsEditing(true);
            setTempItem({ id: `profile-${Date.now()}` });
        }
    }, [profiles.length]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!tempItem.platform?.trim()) {
            newErrors.platform = "Platform is required";
        }

        if (!tempItem.url?.trim()) {
            newErrors.url = "URL is required";
        } else if (!isValidUrl(tempItem.url)) {
            newErrors.url = "Please enter a valid URL";
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

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const isFormValid = () => {
        return tempItem.platform?.trim() !== "" && 
               tempItem.url?.trim() !== "" && 
               isValidUrl(tempItem.url || "");
    };

    const handleSubmit = () => {
        // Mark all fields as touched first
        setTouched({
            platform: true,
            url: true
        });
        
        if (!validateForm()) {
            return;
        }

        updateData((draft) => {
            if (!draft.socialProfiles) draft.socialProfiles = [];
            if (editingId) {
                const index = draft.socialProfiles.findIndex((p) => p.id === editingId);
                if (index !== -1) {
                    draft.socialProfiles[index] = tempItem as SocialProfileItem;
                }
                toast.success('Social profile updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.socialProfiles.push(tempItem as SocialProfileItem);
                toast.success('Social profile added successfully!', {
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
        const item = profiles.find((p) => p.id === id);
        if (item) {
            setEditingId(id);
            setTempItem({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this social profile?")) {
            updateData((draft) => {
                if (draft.socialProfiles) {
                    draft.socialProfiles = draft.socialProfiles.filter((p) => p.id !== id);
                }
            });
            toast.success('Social profile deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            save();
            if (profiles.length <= 1) {
                setIsEditing(true);
                setTempItem({ id: `profile-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempItem({ id: `profile-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempItem((prev) => ({ ...prev, [field]: value }));
        if (field === "platform" && errors.platform) {
            setErrors((prev) => ({ ...prev, platform: undefined }));
        }
        if (field === "url" && errors.url) {
            setErrors((prev) => ({ ...prev, url: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        
        // Validate on blur
        if (field === "platform" && !tempItem.platform?.trim()) {
            setErrors((prev) => ({ ...prev, platform: "Platform is required" }));
        }
        
        if (field === "url") {
            if (!tempItem.url?.trim()) {
                setErrors((prev) => ({ ...prev, url: "URL is required" }));
            } else if (!isValidUrl(tempItem.url)) {
                setErrors((prev) => ({ ...prev, url: "Please enter a valid URL" }));
            }
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
                    Social Profiles <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your social media profiles.
                </p>
            </div>

            <div className="space-y-4">
                {profiles.map((profile) => (
                    <ProfileCard
                        key={profile.id}
                        profile={profile}
                        onEdit={() => handleEdit(profile.id)}
                        onDelete={() => handleDelete(profile.id)}
                    />
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleAddMore}
                    className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-base text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add more social profiles
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
                    {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Social Profile</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Add your social media profiles.
                </p>
            </div>

            <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl  pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StyledSelect
                        label="Platform"
                        value={currentItem.platform}
                        onChange={(e) => updateField("platform", e.target.value)}
                        onBlur={() => handleBlur("platform")}
                        options={platforms}
                        required
                        error={touched.platform ? errors.platform : ""}
                        tooltip="LinkedIn, GitHub, Portfolio, etc."
                        placeholder="Select platform"
                    />

                    <StyledInput
                        label="Profile URL"
                        type="url"
                        placeholder="https://..."
                        value={currentItem.url}
                        onChange={(e) => updateField("url", e.target.value)}
                        onBlur={() => handleBlur("url")}
                        required
                        error={touched.url ? errors.url : ""}
                        tooltip="Public profile link"
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
        <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 ">
            {isSummaryView ? renderSummary() : renderForm()}
        </div>
    );
}