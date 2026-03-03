import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, AlertCircle, Plus, BookOpen, School, GraduationCap, Calendar } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface TeachingExperienceItem {
    id: string;
    subjectCourseTaught: string; // Subject/Course Taught (120 chars) - required
    institution: string; // Institution Name (120 chars) - required
    title: string; // Role/Position (120 chars) - required
    duration: string; // Duration (50 chars) - optional, e.g., 2019 – 2023
    description: string; // Description (200 chars) - optional, Brief teaching responsibilities
}

interface TeachingExperienceFormProps {
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

// Teaching Experience Card Component for Summary View
const TeachingExperienceCard = ({ experience, onEdit, onDelete }: { 
    experience: TeachingExperienceItem; 
    onEdit: () => void; 
    onDelete: () => void;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-accent dark:text-dark-accent" />
                    <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">
                        {experience.subjectCourseTaught}
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-2 mb-2">
                    {experience.institution && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <School className="w-4 h-4" />
                            <span>{experience.institution}</span>
                        </div>
                    )}
                    {experience.title && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <GraduationCap className="w-4 h-4" />
                            <span>{experience.title}</span>
                        </div>
                    )}
                    {experience.duration && (
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                            <Calendar className="w-4 h-4" />
                            <span>{experience.duration}</span>
                        </div>
                    )}
                </div>

                {experience.description && (
                    <div className="mt-3 p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                        <p className="text-sm text-text-primary dark:text-dark-text-primary">
                            {experience.description.length > 150 
                                ? experience.description.substring(0, 150) + '...' 
                                : experience.description}
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

export function TeachingExperienceForm({
    onBack,
    onNext,
    onNavigateToSection,
}: TeachingExperienceFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempItem, setTempItem] = useState<Partial<TeachingExperienceItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const experiences = data.teachingExperience || [];

    const isSummaryView = experiences.length > 0 && !isEditing;

    // Current item being edited
    const currentItem = tempItem;

    // Initial setup
    useEffect(() => {
        if (experiences.length === 0) {
            setIsEditing(true);
            setTempItem({ id: `teaching-${Date.now()}` });
        }
    }, [experiences.length]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!tempItem.subjectCourseTaught?.trim()) {
            newErrors.subjectCourseTaught = "Subject/Course Taught is required";
        } else if (tempItem.subjectCourseTaught.length > 120) {
            newErrors.subjectCourseTaught = "Subject/Course Taught must be less than 120 characters";
        }

        if (!tempItem.institution?.trim()) {
            newErrors.institution = "Institution Name is required";
        } else if (tempItem.institution.length > 120) {
            newErrors.institution = "Institution Name must be less than 120 characters";
        }

        if (!tempItem.title?.trim()) {
            newErrors.title = "Role/Position is required";
        } else if (tempItem.title.length > 120) {
            newErrors.title = "Role/Position must be less than 120 characters";
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
        return tempItem.subjectCourseTaught?.trim() !== "" && 
               tempItem.institution?.trim() !== "" &&
               tempItem.title?.trim() !== "";
    };

    const handleSubmit = () => {
        // Mark all fields as touched first
        setTouched({
            subjectCourseTaught: true,
            institution: true,
            title: true,
            duration: true,
            description: true
        });
        
        if (!validateForm()) {
            return;
        }

        updateData((draft) => {
            if (!draft.teachingExperience) draft.teachingExperience = [];
            if (editingId) {
                const index = draft.teachingExperience.findIndex((e) => e.id === editingId);
                if (index !== -1) {
                    draft.teachingExperience[index] = tempItem as TeachingExperienceItem;
                }
                toast.success('Teaching experience updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.teachingExperience.push(tempItem as TeachingExperienceItem);
                toast.success('Teaching experience added successfully!', {
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
        const item = experiences.find((e) => e.id === id);
        if (item) {
            setEditingId(id);
            setTempItem({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this teaching experience?")) {
            updateData((draft) => {
                if (draft.teachingExperience) {
                    draft.teachingExperience = draft.teachingExperience.filter((e) => e.id !== id);
                }
            });
            toast.success('Teaching experience deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            save();
            if (experiences.length <= 1) {
                setIsEditing(true);
                setTempItem({ id: `teaching-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempItem({ id: `teaching-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempItem((prev) => ({ ...prev, [field]: value }));
        if (field === "subjectCourseTaught" && errors.subjectCourseTaught) {
            setErrors((prev) => ({ ...prev, subjectCourseTaught: undefined }));
        }
        if (field === "institution" && errors.institution) {
            setErrors((prev) => ({ ...prev, institution: undefined }));
        }
        if (field === "title" && errors.title) {
            setErrors((prev) => ({ ...prev, title: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        
        // Validate on blur
        if (field === "subjectCourseTaught" && !tempItem.subjectCourseTaught?.trim()) {
            setErrors((prev) => ({ ...prev, subjectCourseTaught: "Subject/Course Taught is required" }));
        }
        
        if (field === "institution" && !tempItem.institution?.trim()) {
            setErrors((prev) => ({ ...prev, institution: "Institution Name is required" }));
        }

        if (field === "title" && !tempItem.title?.trim()) {
            setErrors((prev) => ({ ...prev, title: "Role/Position is required" }));
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
                    Teaching Experience <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your teaching experience.
                </p>
            </div>

            <div className="space-y-4">
                {experiences.map((experience) => (
                    <TeachingExperienceCard
                        key={experience.id}
                        experience={experience}
                        onEdit={() => handleEdit(experience.id)}
                        onDelete={() => handleDelete(experience.id)}
                    />
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleAddMore}
                    className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-base text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add more teaching experience
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
                    {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Teaching Experience</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Add details about your teaching experience.
                </p>
            </div>

            <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StyledInput
                        label="Subject / Course Taught"
                        placeholder="e.g., Introduction to Computer Science"
                        value={currentItem.subjectCourseTaught}
                        onChange={(e) => updateField("subjectCourseTaught", e.target.value)}
                        onBlur={() => handleBlur("subjectCourseTaught")}
                        required
                        maxLength={120}
                        characterCount
                        icon={<BookOpen className="w-4 h-4" />}
                        error={touched.subjectCourseTaught ? errors.subjectCourseTaught : ""}
                    />

                    <StyledInput
                        label="Institution Name"
                        placeholder="e.g., Stanford University"
                        value={currentItem.institution}
                        onChange={(e) => updateField("institution", e.target.value)}
                        onBlur={() => handleBlur("institution")}
                        required
                        maxLength={120}
                        characterCount
                        icon={<School className="w-4 h-4" />}
                        error={touched.institution ? errors.institution : ""}
                    />

                    <StyledInput
                        label="Role / Position"
                        placeholder="e.g., Lecturer, Assistant Professor, Trainer"
                        value={currentItem.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        onBlur={() => handleBlur("title")}
                        required
                        maxLength={120}
                        characterCount
                        icon={<GraduationCap className="w-4 h-4" />}
                        error={touched.title ? errors.title : ""}
                    />

                    <StyledInput
                        label="Duration"
                        placeholder="e.g., 2019 – 2023"
                        value={currentItem.duration}
                        onChange={(e) => updateField("duration", e.target.value)}
                        maxLength={50}
                        characterCount
                        icon={<Calendar className="w-4 h-4" />}
                        error={touched.duration ? errors.duration : ""}
                    />

                    <div className="md:col-span-2">
                        <StyledTextArea
                            label="Description"
                            value={currentItem.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Brief teaching responsibilities..."
                            maxLength={200}
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

export default TeachingExperienceForm;