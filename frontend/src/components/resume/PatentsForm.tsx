import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, AlertCircle, Plus, FileText, Hash, Building, Calendar, Award } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface PatentItem {
    id: string;
    title: string; // Patent Title (150 chars) - required
    patentNumber: string; // Patent Number (80 chars) - optional
    issuingAuthority: string; // Issuing Authority (120 chars) - optional - Patent office
    year: string; // Year (4 digits) - optional - Year granted
    status: string; // Status (dropdown) - optional - Filed / Published / Granted
}

interface PatentsFormProps {
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
                    <option value="">{placeholder || "Select status"}</option>
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

// Patent Card Component for Summary View
const PatentCard = ({ patent, onEdit, onDelete }: { 
    patent: PatentItem; 
    onEdit: () => void; 
    onDelete: () => void;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-accent dark:text-dark-accent" />
                    <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">
                        {patent.title}
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-2 mb-2">
                    {patent.patentNumber && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <Hash className="w-4 h-4" />
                            <span>Patent #: {patent.patentNumber}</span>
                        </div>
                    )}
                    {patent.issuingAuthority && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <Building className="w-4 h-4" />
                            <span>Authority: {patent.issuingAuthority}</span>
                        </div>
                    )}
                    {patent.year && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <Calendar className="w-4 h-4" />
                            <span>Year: {patent.year}</span>
                        </div>
                    )}
                    {patent.status && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <Award className="w-4 h-4" />
                            <span>Status: {patent.status}</span>
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

export function PatentsForm({
    onBack,
    onNext,
    onNavigateToSection,
}: PatentsFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempItem, setTempItem] = useState<Partial<PatentItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const patents = data.patents || [];

    const isSummaryView = patents.length > 0 && !isEditing;

    const statusOptions = [
        "Filed",
        "Published",
        "Granted"
    ];

    // Current item being edited
    const currentItem = tempItem;

    // Initial setup
    useEffect(() => {
        if (patents.length === 0) {
            setIsEditing(true);
            setTempItem({ id: `patent-${Date.now()}` });
        }
    }, [patents.length]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!tempItem.title?.trim()) {
            newErrors.title = "Patent Title is required";
        } else if (tempItem.title.length > 150) {
            newErrors.title = "Patent Title must be less than 150 characters";
        }

        if (tempItem.patentNumber && tempItem.patentNumber.length > 80) {
            newErrors.patentNumber = "Patent Number must be less than 80 characters";
        }

        if (tempItem.issuingAuthority && tempItem.issuingAuthority.length > 120) {
            newErrors.issuingAuthority = "Issuing Authority must be less than 120 characters";
        }

        if (tempItem.year && !/^\d{4}$/.test(tempItem.year)) {
            newErrors.year = "Year must be a 4-digit number";
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
        return tempItem.title?.trim() !== "";
    };

    const handleSubmit = () => {
        // Mark all fields as touched first
        setTouched({
            title: true,
            patentNumber: true,
            issuingAuthority: true,
            year: true,
            status: true
        });
        
        if (!validateForm()) {
            return;
        }

        updateData((draft) => {
            if (!draft.patents) draft.patents = [];
            if (editingId) {
                const index = draft.patents.findIndex((p) => p.id === editingId);
                if (index !== -1) {
                    draft.patents[index] = tempItem as PatentItem;
                }
                toast.success('Patent updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.patents.push(tempItem as PatentItem);
                toast.success('Patent added successfully!', {
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
        const item = patents.find((p) => p.id === id);
        if (item) {
            setEditingId(id);
            setTempItem({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this patent?")) {
            updateData((draft) => {
                if (draft.patents) {
                    draft.patents = draft.patents.filter((p) => p.id !== id);
                }
            });
            toast.success('Patent deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            save();
            if (patents.length <= 1) {
                setIsEditing(true);
                setTempItem({ id: `patent-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempItem({ id: `patent-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempItem((prev) => ({ ...prev, [field]: value }));
        if (field === "title" && errors.title) {
            setErrors((prev) => ({ ...prev, title: undefined }));
        }
        if (field === "year" && errors.year) {
            setErrors((prev) => ({ ...prev, year: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        
        // Validate on blur
        if (field === "title" && !tempItem.title?.trim()) {
            setErrors((prev) => ({ ...prev, title: "Patent Title is required" }));
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
                    Patents <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your patents.
                </p>
            </div>

            <div className="space-y-4">
                {patents.map((patent) => (
                    <PatentCard
                        key={patent.id}
                        patent={patent}
                        onEdit={() => handleEdit(patent.id)}
                        onDelete={() => handleDelete(patent.id)}
                    />
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleAddMore}
                    className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-base text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add more patents
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
                    {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Patent</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Add details about your patents.
                </p>
            </div>

            <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl  pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StyledInput
                        label="Patent Title"
                        placeholder="Title of patent"
                        value={currentItem.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        onBlur={() => handleBlur("title")}
                        required
                        maxLength={150}
                        characterCount
                        icon={<FileText className="w-4 h-4" />}
                        error={touched.title ? errors.title : ""}
                    />

                    <StyledInput
                        label="Patent Number"
                        placeholder="  US 10,123,456"
                        value={currentItem.patentNumber}
                        onChange={(e) => updateField("patentNumber", e.target.value)}
                        maxLength={80}
                        characterCount
                        icon={<Hash className="w-4 h-4" />}
                        error={touched.patentNumber ? errors.patentNumber : ""}
                    />

                    <StyledInput
                        label="Issuing Authority"
                        placeholder="Patent office name"
                        value={currentItem.issuingAuthority}
                        onChange={(e) => updateField("issuingAuthority", e.target.value)}
                        maxLength={120}
                        characterCount
                        icon={<Building className="w-4 h-4" />}
                        error={touched.issuingAuthority ? errors.issuingAuthority : ""}
                    />

                    <StyledInput
                        label="Year"
                        placeholder="  2023"
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
                        <StyledSelect
                            label="Status"
                            value={currentItem.status}
                            onChange={(e) => updateField("status", e.target.value)}
                            options={statusOptions}
                            icon={<Award className="w-4 h-4" />}
                            error={touched.status ? errors.status : ""}
                            placeholder="Select status"
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

export default PatentsForm;