import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, AlertCircle, Plus, BookOpen, Building, Calendar, Link, Type } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface PublicationItem {
    id: string;
    title: string; // Publication Title (150 chars) - required
    journalPublisher: string; // Journal / Publisher (120 chars) - optional
    publicationType: string; // Publication Type (dropdown) - optional - Journal / Conference / Book
    year: string; // Year (4 digits) - optional
    urlDoi: string; // URL / DOI - optional
}

interface PublicationsFormProps {
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
                    <option value="">{placeholder || "Select type"}</option>
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

// Publication Card Component for Summary View
const PublicationCard = ({ publication, onEdit, onDelete }: { 
    publication: PublicationItem; 
    onEdit: () => void; 
    onDelete: () => void;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-accent dark:text-dark-accent" />
                    <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">
                        {publication.title}
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-2 mb-2">
                    {publication.journalPublisher && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <Building className="w-4 h-4" />
                            <span>{publication.journalPublisher}</span>
                        </div>
                    )}
                    {publication.publicationType && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <Type className="w-4 h-4" />
                            <span>Type: {publication.publicationType}</span>
                        </div>
                    )}
                    {publication.year && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <Calendar className="w-4 h-4" />
                            <span>Year: {publication.year}</span>
                        </div>
                    )}
                    {publication.urlDoi && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <Link className="w-4 h-4" />
                            <a href={publication.urlDoi} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate max-w-xs">
                                {publication.urlDoi}
                            </a>
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

export function PublicationsForm({
    onBack,
    onNext,
    onNavigateToSection,
}: PublicationsFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempItem, setTempItem] = useState<Partial<PublicationItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const publications = data.publications || [];

    const isSummaryView = publications.length > 0 && !isEditing;

    const publicationTypeOptions = [
        "Journal",
        "Conference",
        "Book"
    ];

    // Current item being edited
    const currentItem = tempItem;

    // Initial setup
    useEffect(() => {
        if (publications.length === 0) {
            setIsEditing(true);
            setTempItem({ id: `publication-${Date.now()}` });
        }
    }, [publications.length]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!tempItem.title?.trim()) {
            newErrors.title = "Publication Title is required";
        } else if (tempItem.title.length > 150) {
            newErrors.title = "Publication Title must be less than 150 characters";
        }

        if (tempItem.journalPublisher && tempItem.journalPublisher.length > 120) {
            newErrors.journalPublisher = "Journal/Publisher must be less than 120 characters";
        }

        if (tempItem.year && !/^\d{4}$/.test(tempItem.year)) {
            newErrors.year = "Year must be a 4-digit number";
        }

        // URL validation (optional)
        if (tempItem.urlDoi && !isValidUrl(tempItem.urlDoi)) {
            newErrors.urlDoi = "Please enter a valid URL or DOI";
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
        return tempItem.title?.trim() !== "";
    };

    const handleSubmit = () => {
        // Mark all fields as touched first
        setTouched({
            title: true,
            journalPublisher: true,
            publicationType: true,
            year: true,
            urlDoi: true
        });
        
        if (!validateForm()) {
            return;
        }

        updateData((draft) => {
            if (!draft.publications) draft.publications = [];
            if (editingId) {
                const index = draft.publications.findIndex((p) => p.id === editingId);
                if (index !== -1) {
                    draft.publications[index] = tempItem as PublicationItem;
                }
                toast.success('Publication updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.publications.push(tempItem as PublicationItem);
                toast.success('Publication added successfully!', {
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
        const item = publications.find((p) => p.id === id);
        if (item) {
            setEditingId(id);
            setTempItem({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this publication?")) {
            updateData((draft) => {
                if (draft.publications) {
                    draft.publications = draft.publications.filter((p) => p.id !== id);
                }
            });
            toast.success('Publication deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            save();
            if (publications.length <= 1) {
                setIsEditing(true);
                setTempItem({ id: `publication-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempItem({ id: `publication-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempItem((prev) => ({ ...prev, [field]: value }));
        if (field === "title" && errors.title) {
            setErrors((prev) => ({ ...prev, title: undefined }));
        }
        if (field === "urlDoi" && errors.urlDoi) {
            setErrors((prev) => ({ ...prev, urlDoi: undefined }));
        }
        if (field === "year" && errors.year) {
            setErrors((prev) => ({ ...prev, year: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        
        // Validate on blur
        if (field === "title" && !tempItem.title?.trim()) {
            setErrors((prev) => ({ ...prev, title: "Publication Title is required" }));
        }

        if (field === "year" && tempItem.year && !/^\d{4}$/.test(tempItem.year)) {
            setErrors((prev) => ({ ...prev, year: "Year must be a 4-digit number" }));
        }
        
        if (field === "urlDoi" && tempItem.urlDoi && !isValidUrl(tempItem.urlDoi)) {
            setErrors((prev) => ({ ...prev, urlDoi: "Please enter a valid URL or DOI" }));
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
                    Publications <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your publications.
                </p>
            </div>

            <div className="space-y-4">
                {publications.map((publication) => (
                    <PublicationCard
                        key={publication.id}
                        publication={publication}
                        onEdit={() => handleEdit(publication.id)}
                        onDelete={() => handleDelete(publication.id)}
                    />
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleAddMore}
                    className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-base text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add more publications
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
                    {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Publication</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Add details about your publications.
                </p>
            </div>

            <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StyledInput
                        label="Publication Title"
                        placeholder="Title of paper/book"
                        value={currentItem.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        onBlur={() => handleBlur("title")}
                        required
                        maxLength={150}
                        characterCount
                        icon={<BookOpen className="w-4 h-4" />}
                        error={touched.title ? errors.title : ""}
                    />

                    <StyledInput
                        label="Journal / Publisher"
                        placeholder="Journal or publisher name"
                        value={currentItem.journalPublisher}
                        onChange={(e) => updateField("journalPublisher", e.target.value)}
                        maxLength={120}
                        characterCount
                        icon={<Building className="w-4 h-4" />}
                        error={touched.journalPublisher ? errors.journalPublisher : ""}
                    />

                    <StyledSelect
                        label="Publication Type"
                        value={currentItem.publicationType}
                        onChange={(e) => updateField("publicationType", e.target.value)}
                        options={publicationTypeOptions}
                        icon={<Type className="w-4 h-4" />}
                        error={touched.publicationType ? errors.publicationType : ""}
                        placeholder="Select type"
                    />

                    <StyledInput
                        label="Year"
                        placeholder="e.g., 2023"
                        value={currentItem.year}
                        onChange={(e) => updateField("year", e.target.value)}
                        onBlur={() => handleBlur("year")}
                        maxLength={4}
                        characterCount
                        icon={<Calendar className="w-4 h-4" />}
                        error={touched.year ? errors.year : ""}
                        type="number"
                    />

                    <div className="md:col-span-2">
                        <StyledInput
                            label="URL / DOI"
                            placeholder="https://doi.org/..."
                            value={currentItem.urlDoi}
                            onChange={(e) => updateField("urlDoi", e.target.value)}
                            onBlur={() => handleBlur("urlDoi")}
                            icon={<Link className="w-4 h-4" />}
                            error={touched.urlDoi ? errors.urlDoi : ""}
                            type="url"
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

export default PublicationsForm;