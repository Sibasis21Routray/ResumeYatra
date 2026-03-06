import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MonthYearPicker } from "./MonthYearPicker";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, Briefcase, Building, Calendar, Clock, Award, AlertCircle, Plus } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface TrainingProgramItem {
    id: string;
    name: string;
    provider: string;
    completionDate: string;
    duration: string;
    description: string;
}

interface TrainingProgramsFormProps {
    onBack?: () => void;
    onNext?: () => void;
}

// Styled Input Component - LARGER TEXT
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

// Styled TextArea Component - LARGER TEXT
const StyledTextArea = ({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    maxLength,
    error,
    rows = 4,
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

// Simplified Section Card - no header
const SectionCard = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 shadow-sm">
        {children}
    </div>
);

export function TrainingProgramsForm({
    onBack,
    onNext,
}: TrainingProgramsFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempProgram, setTempProgram] = useState<Partial<TrainingProgramItem>>({});
    const [errors, setErrors] = useState<{ name?: string }>({});

    const programs = data.trainingPrograms || [];

    const isSummaryView = programs.length > 0 && !isEditing;

    const currentProgram = tempProgram;

    useEffect(() => {
        if (programs.length === 0) {
            setIsEditing(true);
            setTempProgram({ id: `training-${Date.now()}` });
        }
    }, [programs.length]);

    const validateData = () => {
        const newErrors: { name?: string } = {};
        
        if (!tempProgram.name?.trim()) {
            newErrors.name = "Program title is required";
        } else if (tempProgram.name.length > 120) {
            newErrors.name = "Program title must be less than 120 characters";
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
            if (!draft.trainingPrograms) draft.trainingPrograms = [];
            if (editingId) {
                const index = draft.trainingPrograms.findIndex((p) => p.id === editingId);
                if (index !== -1) {
                    draft.trainingPrograms[index] = tempProgram as TrainingProgramItem;
                }
                toast.success('Training program updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.trainingPrograms.push(tempProgram as TrainingProgramItem);
                toast.success('Training program added successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            }
        });
        
        // Save to database after updating
        save();
        setIsEditing(false);
        setEditingId(null);
        setTempProgram({});
    };

    const handleEdit = (id: string) => {
        const item = programs.find((p) => p.id === id);
        if (item) {
            setEditingId(id);
            setTempProgram({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this training program?")) {
            updateData((draft) => {
                if (draft.trainingPrograms) {
                    draft.trainingPrograms = draft.trainingPrograms.filter((p) => p.id !== id);
                }
            });
            toast.success('Training program deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            // Save to database after deleting
            save();
            if (programs.length <= 1) {
                setIsEditing(true);
                setTempProgram({ id: `training-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempProgram({ id: `training-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempProgram((prev) => ({ ...prev, [field]: value }));
        // Clear error for required fields when user starts typing
        if (field === "name") {
            setErrors((prev) => ({ ...prev, name: undefined }));
        }
    };

    const renderSummary = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    Training Programs <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your training programs.
                </p>
            </div>

            <div className="space-y-4">
                {programs.map((item, index) => (
                    <div key={item.id} className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Briefcase className="w-5 h-5 text-accent dark:text-dark-accent" />
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
                                    {item.completionDate && (
                                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                                            <Calendar className="w-4 h-4" />
                                            <span>{item.completionDate}</span>
                                        </div>
                                    )}
                                    {item.duration && (
                                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                                            <Clock className="w-4 h-4" />
                                            <span>{item.duration}</span>
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
                    <Plus className="w-5 h-5" /> Add more training programs
                </button>
            </div>
        </div>
    );

    const renderForm = () => (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    List certifications
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Courses or workshops that boosted your skills.
                </p>
            </div>

            {/* Program Details - No header */}
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StyledInput
                        label="Program Title"
                        placeholder="Advanced Data Science"
                        value={currentProgram.name || ""}
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                        maxLength={120}
                        characterCount
                        icon={<Briefcase className="w-4 h-4" />}
                        error={errors.name}
                    />

                    <StyledInput
                        label="Conducted By"
                        placeholder="Coursera, Udemy"
                        value={currentProgram.provider || ""}
                        onChange={(e) => updateField("provider", e.target.value)}
                        maxLength={120}
                        characterCount
                        icon={<Building className="w-4 h-4" />}
                    />
                </div>
            </div>

            {/* Duration & Date - No header */}
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
                            Completion Date
                        </label>
                        <MonthYearPicker
                            value={currentProgram.completionDate || ""}
                            onChange={(value) => updateField("completionDate", value)}
                            className="w-full"
                            placeholder="Select date"
                        />
                    </div>

                    <StyledInput
                        label="Duration"
                        placeholder="12 weeks, 50 hrs"
                        value={currentProgram.duration || ""}
                        onChange={(e) => updateField("duration", e.target.value)}
                        maxLength={50}
                        characterCount
                        icon={<Clock className="w-4 h-4" />}
                    />
                </div>
            </div>

            {/* Key Contributions & Learnings - With Label */}
            <div className="space-y-4">
                <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                    Key Contributions & Learnings
                </label>
                <StyledTextArea
                    // label="Description"
                    value={currentProgram.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Briefly mention skills learned, tools used, or outcomes achieved (2–3 points)."
                    maxLength={200}
                    rows={4}
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

export default TrainingProgramsForm;