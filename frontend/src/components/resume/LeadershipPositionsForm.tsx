import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "../editor/RichTextEditor";
import { MonthYearPicker } from "./MonthYearPicker";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, Briefcase, Building, Calendar, Award, AlertCircle, Plus, Users } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface LeadershipPositionItem {
    id: string;
    position: string;
    organization: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface LeadershipPositionsFormProps {
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

// Section Card Component
const SectionCard = ({ title, description, children, icon }: {
    title: string;
    description?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}) => (
    <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border overflow-hidden shadow-sm">
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

export function LeadershipPositionsForm({
    onBack,
    onNext,
}: LeadershipPositionsFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempPosition, setTempPosition] = useState<Partial<LeadershipPositionItem>>({});
    const [errors, setErrors] = useState<{ position?: string; organization?: string }>({});
    const [isPresent, setIsPresent] = useState(false);

    const positions = data.leadershipPositions || [];

    const isSummaryView = positions.length > 0 && !isEditing;

    const currentPosition = tempPosition;

    useEffect(() => {
        if (positions.length === 0) {
            setIsEditing(true);
            setTempPosition({ id: `leadership-${Date.now()}` });
        }
    }, [positions.length]);

    useEffect(() => {
        // Check if endDate is "Present" to set the checkbox
        if (currentPosition.endDate === "Present") {
            setIsPresent(true);
        } else {
            setIsPresent(false);
        }
    }, [currentPosition.endDate]);

    const validateData = () => {
        const newErrors: { position?: string; organization?: string } = {};
        
        if (!tempPosition.position?.trim()) {
            newErrors.position = "Position title is required";
        } else if (tempPosition.position.length > 120) {
            newErrors.position = "Position title must be less than 120 characters";
        }
        
        if (!tempPosition.organization?.trim()) {
            newErrors.organization = "Organization is required";
        } else if (tempPosition.organization.length > 120) {
            newErrors.organization = "Organization must be less than 120 characters";
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
            if (!draft.leadershipPositions) draft.leadershipPositions = [];
            if (editingId) {
                const index = draft.leadershipPositions.findIndex((p) => p.id === editingId);
                if (index !== -1) {
                    draft.leadershipPositions[index] = tempPosition as LeadershipPositionItem;
                }
                toast.success('Leadership position updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.leadershipPositions.push(tempPosition as LeadershipPositionItem);
                toast.success('Leadership position added successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            }
        });
        
        // Save to database after updating
        save();
        setIsEditing(false);
        setEditingId(null);
        setTempPosition({});
        setIsPresent(false);
    };

    const handleEdit = (id: string) => {
        const item = positions.find((p) => p.id === id);
        if (item) {
            setEditingId(id);
            setTempPosition({ ...item });
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this leadership position?")) {
            updateData((draft) => {
                if (draft.leadershipPositions) {
                    draft.leadershipPositions = draft.leadershipPositions.filter((p) => p.id !== id);
                }
            });
            toast.success('Leadership position deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            // Save to database after deleting
            save();
            if (positions.length <= 1) {
                setIsEditing(true);
                setTempPosition({ id: `leadership-${Date.now()}` });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempPosition({ id: `leadership-${Date.now()}` });
        setIsEditing(true);
        setIsPresent(false);
    };

    const updateField = (field: string, value: any) => {
        setTempPosition((prev) => ({ ...prev, [field]: value }));
        // Clear error for required fields when user starts typing
        if (field === "position" || field === "organization") {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handlePresentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsPresent(checked);
        if (checked) {
            updateField("endDate", "Present");
        } else {
            updateField("endDate", "");
        }
    };

    const renderSummary = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    Leadership & Positions <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Review and manage your leadership positions.
                </p>
            </div>

            <div className="space-y-4">
                {positions.map((item, index) => (
                    <div key={item.id} className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Briefcase className="w-5 h-5 text-accent dark:text-dark-accent" />
                                    <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">
                                        {item.position}
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                    {item.organization && (
                                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                                            <Building className="w-4 h-4" />
                                            <span>{item.organization}</span>
                                        </div>
                                    )}
                                    {(item.startDate || item.endDate) && (
                                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                                            <Calendar className="w-4 h-4" />
                                            <span>{item.startDate} - {item.endDate}</span>
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
                    <Plus className="w-5 h-5" /> Add more leadership positions
                </button>
            </div>
        </div>
    );

    const renderForm = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    Add <span className="text-accent dark:text-dark-accent">Leadership Position</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Highlight roles in student bodies, clubs, or committees
                </p>
            </div>

            {/* Position Details */}
            <SectionCard 
                title="Position Details" 
                description="Basic information about your leadership role"
                icon={<Users className="w-5 h-5" />}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StyledInput
                        label="Position Title"
                        placeholder="e.g., President, Class Representative"
                        value={currentPosition.position || ""}
                        onChange={(e) => updateField("position", e.target.value)}
                        required
                        maxLength={120}
                        characterCount
                        icon={<Briefcase className="w-4 h-4" />}
                        error={errors.position}
                        helperText="President, Class Representative, Committee Member"
                    />

                    <StyledInput
                        label="Organization / Body"
                        placeholder="e.g., Student Council, Debate Club"
                        value={currentPosition.organization || ""}
                        onChange={(e) => updateField("organization", e.target.value)}
                        required
                        maxLength={120}
                        characterCount
                        icon={<Building className="w-4 h-4" />}
                        error={errors.organization}
                        helperText="College committee, student body, club, or organization"
                    />
                </div>
            </SectionCard>

            {/* Duration */}
            <SectionCard 
                title="Duration" 
                description="When did you hold this position?"
                icon={<Calendar className="w-5 h-5" />}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
                            Start Date
                        </label>
                        <MonthYearPicker
                            value={currentPosition.startDate || ""}
                            onChange={(value) => updateField("startDate", value)}
                            className="w-full"
                            placeholder="Select start date"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
                            End Date
                        </label>
                        <div className="space-y-2">
                            <MonthYearPicker
                                value={currentPosition.endDate === "Present" ? "" : currentPosition.endDate || ""}
                                onChange={(value) => updateField("endDate", value)}
                                className="w-full"
                                placeholder="Select end date"
                                disabled={isPresent}
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="present"
                                    checked={isPresent}
                                    onChange={handlePresentChange}
                                    className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                                />
                                <label htmlFor="present" className="text-sm text-text-primary dark:text-dark-text-primary">
                                    Currently ongoing
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* Key Contributions & Learnings */}
            <SectionCard 
                title="Key Contributions & Learnings" 
                description="What did you achieve in this role?"
                icon={<Award className="w-5 h-5" />}
            >
                <div className="space-y-2">
                    <RichTextEditor
                        value={currentPosition.description || ""}
                        onChange={(value) => updateField("description", value)}
                        placeholder="Briefly describe your leadership responsibilities, initiatives, or impact (2–4 points)."
                        sectionTitle="Leadership"
                    />
                    <p className="text-xs text-text-muted dark:text-dark-text-muted flex items-center gap-1 mt-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Max 200 words recommended. Use bullet points for better readability.
                    </p>
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

export default LeadershipPositionsForm;