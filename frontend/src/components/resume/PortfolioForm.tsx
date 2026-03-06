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

interface PortfolioItem {
    id: string;
    name: string; // Name of portfolio item (120 chars)
    type: string; // Type - Dropdown (Website, App, Design, Writing)
    url: string; // URL
    platform: string; // Platform (80 chars) - Will Enter (GitHub/Behance/Dribbble)
    description: string; // Description (200 chars) - Short explanation of work
}

interface PortfolioFormProps {
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
    tooltip,
}: {
    label: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    error?: string;
    onBlur?: () => void;
    tooltip?: string;
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
                    <option value="">Select type</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
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

// Portfolio Card Component for Summary View
const PortfolioCard = ({ item, onEdit, onDelete }: { 
    item: PortfolioItem; 
    onEdit: () => void; 
    onDelete: () => void;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary mb-1">
                    {item.name}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    {item.type && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Type:</span> {item.type}
                        </div>
                    )}
                    {item.platform && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">Platform:</span> {item.platform}
                        </div>
                    )}
                    {item.url && (
                        <div className="text-sm text-text-muted dark:text-dark-text-muted">
                            <span className="font-medium">URL:</span>{" "}
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                                {item.url.length > 30 ? item.url.substring(0, 30) + '...' : item.url}
                            </a>
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

export function PortfolioForm({
    onBack,
    onNext,
    onNavigateToSection,
}: PortfolioFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempItem, setTempItem] = useState<Partial<PortfolioItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const portfolio = data.portfolio || [];

    const isSummaryView = portfolio.length > 0 && !isEditing;

    // Type options for dropdown
    const typeOptions = [
        { value: "Website", label: "Website" },
        { value: "App", label: "App" },
        { value: "Design", label: "Design" },
        { value: "Writing", label: "Writing" }
    ];

    // Current item being edited
    const currentItem = tempItem;

    // Initial setup
    React.useEffect(() => {
        if (portfolio.length === 0) {
            setIsEditing(true);
            setTempItem({ id: `portfolio-${Date.now()}` });
        }
    }, [portfolio.length]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!tempItem.name?.trim()) {
            newErrors.name = "Portfolio item name is required";
        } else if (tempItem.name.length > 120) {
            newErrors.name = "Name must be less than 120 characters";
        }

        if (!tempItem.type) {
            newErrors.type = "Type is required";
        }

        if (tempItem.platform && tempItem.platform.length > 80) {
            newErrors.platform = "Platform must be less than 80 characters";
        }

        if (tempItem.description && tempItem.description.length > 200) {
            newErrors.description = "Description must be less than 200 characters";
        }

        // URL validation (optional)
        if (tempItem.url && !isValidUrl(tempItem.url)) {
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
        return tempItem.name?.trim() !== "" && tempItem.type?.trim() !== "";
    };

    const handleSubmit = () => {
        // Mark all fields as touched first
        setTouched({
            name: true,
            type: true,
            platform: true,
            url: true,
            description: true
        });
        
        if (!validateForm()) {
            return;
        }

        updateData((draft) => {
            if (!draft.portfolio) draft.portfolio = [];
            if (editingId) {
                const index = draft.portfolio.findIndex((p) => p.id === editingId);
                if (index !== -1) {
                    draft.portfolio[index] = tempItem as PortfolioItem;
                }
                toast.success('Portfolio item updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.portfolio.push(tempItem as PortfolioItem);
                toast.success('Portfolio item added successfully!', {
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
        const item = portfolio.find((p) => p.id === id);
        if (item) {
            setEditingId(id);
            setTempItem({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this portfolio item?")) {
            updateData((draft) => {
                if (draft.portfolio) {
                    draft.portfolio = draft.portfolio.filter((p) => p.id !== id);
                }
            });
            toast.success('Portfolio item deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            save();
            if (portfolio.length <= 1) {
                setIsEditing(true);
                setTempItem({ id: `portfolio-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempItem({ id: `portfolio-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempItem((prev) => ({ ...prev, [field]: value }));
        if (field === "name" && errors.name) {
            setErrors((prev) => ({ ...prev, name: undefined }));
        }
        if (field === "type" && errors.type) {
            setErrors((prev) => ({ ...prev, type: undefined }));
        }
        if (field === "url" && errors.url) {
            setErrors((prev) => ({ ...prev, url: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        
        // Validate on blur
        if (field === "name" && !tempItem.name?.trim()) {
            setErrors((prev) => ({ ...prev, name: "Portfolio item name is required" }));
        }
        
        if (field === "type" && !tempItem.type) {
            setErrors((prev) => ({ ...prev, type: "Type is required" }));
        }
        
        if (field === "url" && tempItem.url && !isValidUrl(tempItem.url)) {
            setErrors((prev) => ({ ...prev, url: "Please enter a valid URL" }));
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
                    Portfolio <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your portfolio items.
                </p>
            </div>

            <div className="space-y-4">
                {portfolio.map((item) => (
                    <PortfolioCard
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
                    <Plus className="w-5 h-5" /> Add more portfolio items
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
                    {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Portfolio Item</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Showcase your work and projects.
                </p>
            </div>

            <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl  pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StyledInput
                        label="Portfolio Item Name"
                        placeholder="e.g., E-commerce App Design"
                        value={currentItem.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        required
                        maxLength={120}
                        characterCount
                        error={touched.name ? errors.name : ""}
                    />

                    <StyledSelect
                        label="Type"
                        value={currentItem.type}
                        onChange={(e) => updateField("type", e.target.value)}
                        onBlur={() => handleBlur("type")}
                        options={typeOptions}
                        required
                        error={touched.type ? errors.type : ""}
                    />

                    <StyledInput
                        label="Platform"
                        placeholder="e.g., GitHub, Behance, Dribbble"
                        value={currentItem.platform}
                        onChange={(e) => updateField("platform", e.target.value)}
                        maxLength={80}
                        characterCount
                        error={touched.platform ? errors.platform : ""}
                        tooltip="Will Enter GitHub / Behance / Dribbble"
                    />

                    <StyledInput
                        label="URL"
                        placeholder="https://..."
                        value={currentItem.url}
                        onChange={(e) => updateField("url", e.target.value)}
                        onBlur={() => handleBlur("url")}
                        type="url"
                        maxLength={200}
                        characterCount
                        error={touched.url ? errors.url : ""}
                    />

                    <div className="md:col-span-2">
                        <StyledTextArea
                            label="Description"
                            value={currentItem.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Short explanation of your work..."
                            maxLength={200}
                            rows={3}
                            error={touched.description ? errors.description : ""}
                            tooltip="Short explanation of work"
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
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
            {isSummaryView ? renderSummary() : renderForm()}
        </div>
    );
}