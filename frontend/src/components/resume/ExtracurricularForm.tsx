import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, Music, Heart, Calendar, AlertCircle, Plus, Award, Trophy } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface ExtracurricularItem {
    id: string;
    activity: string;
    role?: string;
    year?: string;
}

interface ExtracurricularFormProps {
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
    helperText,
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
    helperText?: string;
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
            {helperText && !error && (
                <p className="mt-1.5 text-xs text-text-muted dark:text-dark-text-muted flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {helperText}
                </p>
            )}
            {error && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                </p>
            )}
        </div>
    );
};

// Year Dropdown Component - FIXED Z-INDEX
const YearDropdown = ({
    value,
    onChange,
    label,
    error,
    onOpenChange,
}: {
    value: string;
    onChange: (value: string) => void;
    label: string;
    error?: string;
    onOpenChange?: (isOpen: boolean) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

    useEffect(() => {
        onOpenChange?.(isOpen);
    }, [isOpen, onOpenChange]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="w-full relative" ref={dropdownRef} style={{ zIndex: isOpen ? 9999 : 'auto' }}>
            <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    readOnly
                    onClick={() => setIsOpen(!isOpen)}
                    placeholder="Select year"
                    className={`w-full pl-10 pr-10 py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-base text-text-primary dark:text-dark-text-primary cursor-pointer ${
                        error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-light-border dark:border-dark-border focus:ring-accent focus:border-accent'
                    }`}
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div 
                    className="absolute z-[10000] w-full mt-1 bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    style={{ 
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                    }}
                >
                    {years.map((year) => (
                        <div
                            key={year}
                            onClick={() => {
                                onChange(year.toString());
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-accent/10 dark:hover:bg-dark-accent/10 cursor-pointer text-text-primary dark:text-dark-text-primary text-sm"
                        >
                            {year}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Section Card Component - FIXED OVERFLOW
const SectionCard = ({ title, description, children, icon, isDropdownOpen }: {
    title: string;
    description?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    isDropdownOpen?: boolean;
}) => (
    <div className={`bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border shadow-sm ${
        isDropdownOpen ? 'overflow-visible' : 'overflow-hidden'
    }`}>
        <div className="px-5 py-4 border-b border-light-border dark:border-dark-border bg-gradient-to-r from-bg-secondary/30 to-transparent">
            <div className="flex items-center gap-3">
                {icon && <div className="text-accent dark:text-dark-accent">{icon}</div>}
                <div>
                    <h4 className="text-base font-semibold text-text-primary dark:text-dark-text-primary">
                        {title}
                    </h4>
                    {description && (
                        <p className="text-sm text-text-muted dark:text-dark-text-muted mt-0.5">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
        <div className="p-5">
            {children}
        </div>
    </div>
);

export function ExtracurricularForm({
    onBack,
    onNext,
}: ExtracurricularFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempActivity, setTempActivity] = useState<Partial<ExtracurricularItem>>({});
    const [errors, setErrors] = useState<{ activity?: string }>({});
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

    const activities = data.extracurricular || [];

    const isSummaryView = activities.length > 0 && !isEditing;

    const currentActivity = tempActivity;

    useEffect(() => {
        if (activities.length === 0) {
            setIsEditing(true);
            setTempActivity({ id: `extracurricular-${Date.now()}` });
        }
    }, [activities.length]);

    const validateData = () => {
        const newErrors: { activity?: string } = {};
        
        if (!tempActivity.activity?.trim()) {
            newErrors.activity = "Activity name is required";
        } else if (tempActivity.activity.length > 120) {
            newErrors.activity = "Activity name must be less than 120 characters";
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
            if (!draft.extracurricular) draft.extracurricular = [];
            if (editingId) {
                const index = draft.extracurricular.findIndex((a) => a.id === editingId);
                if (index !== -1) {
                    draft.extracurricular[index] = tempActivity as ExtracurricularItem;
                }
                toast.success('Activity updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.extracurricular.push(tempActivity as ExtracurricularItem);
                toast.success('Activity added successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            }
        });
        
        // Save to database after updating
        save();
        setIsEditing(false);
        setEditingId(null);
        setTempActivity({});
    };

    const handleEdit = (id: string) => {
        const item = activities.find((a) => a.id === id);
        if (item) {
            setEditingId(id);
            setTempActivity({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this activity?")) {
            updateData((draft) => {
                if (draft.extracurricular) {
                    draft.extracurricular = draft.extracurricular.filter((a) => a.id !== id);
                }
            });
            toast.success('Activity deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            // Save to database after deleting
            save();
            if (activities.length <= 1) {
                setIsEditing(true);
                setTempActivity({ id: `extracurricular-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempActivity({ id: `extracurricular-${Date.now()}` });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempActivity((prev) => ({ ...prev, [field]: value }));
        // Clear error for required fields when user starts typing
        if (field === "activity") {
            setErrors((prev) => ({ ...prev, activity: undefined }));
        }
    };

    const renderSummary = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    Extracurricular <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your extracurricular activities.
                </p>
            </div>

            <div className="space-y-4">
                {activities.map((item, index) => (
                    <div key={item.id} className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Heart className="w-5 h-5 text-accent dark:text-dark-accent" />
                                    <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">
                                        {item.activity}
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {item.role && (
                                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                                            <Award className="w-4 h-4" />
                                            <span>{item.role}</span>
                                        </div>
                                    )}
                                    {item.year && (
                                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                                            <Calendar className="w-4 h-4" />
                                            <span>{item.year}</span>
                                        </div>
                                    )}
                                </div>
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
                    <Plus className="w-5 h-5" /> Add more extracurricular activities
                </button>
            </div>
        </div>
    );

    const renderForm = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    Add non-academic activities
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Sports, cultural, or non-academic activities
                </p>
                <p className="text-sm text-text-muted/70 dark:text-dark-text-muted/70 mt-2">
                    Include activities you actively pursue outside academics or work that reflect your interests or skills.
                </p>
            </div>

            {/* Activity Details */}
            <SectionCard 
                title="Activity Details" 
                description="Information about your extracurricular activity"
                icon={<Heart className="w-5 h-5" />}
                isDropdownOpen={isYearDropdownOpen}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StyledInput
                        label="Activity Name"
                        placeholder="e.g., Playing guitar, recreational sports, photography"
                        value={currentActivity.activity || ""}
                        onChange={(e) => updateField("activity", e.target.value)}
                        required
                        maxLength={120}
                        characterCount
                        icon={<Music className="w-4 h-4" />}
                        error={errors.activity}
                        helperText="Playing guitar, recreational sports, photography"
                    />

                    <StyledInput
                        label="Role / Achievement"
                        placeholder="e.g., Participant, Lead, Organizer"
                        value={currentActivity.role || ""}
                        onChange={(e) => updateField("role", e.target.value)}
                        maxLength={120}
                        characterCount
                        icon={<Award className="w-4 h-4" />}
                        helperText="Participant, Lead, Organizer"
                    />
                </div>
            </SectionCard>

            {/* Year */}
            <SectionCard 
                title="Year" 
                description="When did you participate?"
                icon={<Calendar className="w-5 h-5" />}
                isDropdownOpen={isYearDropdownOpen}
            >
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 max-w-md">
                    <YearDropdown
                        label="Year"
                        value={currentActivity.year || ""}
                        onChange={(value) => updateField("year", value)}
                        onOpenChange={setIsYearDropdownOpen}
                    />
                </div>
            </SectionCard>
        </div>
    );

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

export default ExtracurricularForm;