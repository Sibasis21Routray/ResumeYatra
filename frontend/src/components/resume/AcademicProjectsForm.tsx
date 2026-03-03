import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "../editor/RichTextEditor";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, BookOpen, Calendar, Link, Code, Award, Briefcase, AlertCircle, Plus, X } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface AcademicProjectItem {
    id: string;
    name: string;
    course: string;
    institution: string;
    duration: string;
    description: string;
    technologies: string[];
    url?: string;
}

interface AcademicProjectsFormProps {
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

    let baseInputClass = `w-full ${icon ? 'pl-10' : 'pl-3'} pr-${characterCount ? '16' : '4'} py-2.5 bg-bg-primary dark:bg-dark-bg-primary border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-text-primary dark:text-dark-text-primary placeholder-text-muted dark:placeholder-dark-text-muted shadow-sm hover:shadow-md text-sm sm:text-base`;

    if (error) {
        baseInputClass += " border-red-500 focus:ring-red-500 focus:border-red-500";
    } else if (isFocused) {
        baseInputClass += " border-accent dark:border-dark-accent ring-2 ring-accent/20";
    } else {
        baseInputClass += " border-light-border dark:border-dark-border";
    }

    return (
        <div className="w-full">
            <label className="block text-xs sm:text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
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
                <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {helperText}
                </p>
            )}
            {error && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
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
        <div className="px-4 sm:px-6 py-4 border-b border-light-border dark:border-dark-border bg-gradient-to-r from-bg-secondary/30 to-transparent">
            <div className="flex items-center gap-3">
                {icon && <div className="text-accent dark:text-dark-accent">{icon}</div>}
                <div>
                    <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                        {title}
                    </h4>
                    {description && (
                        <p className="text-xs sm:text-sm text-text-muted dark:text-dark-text-muted mt-0.5">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
        <div className="p-4 sm:p-6">
            {children}
        </div>
    </div>
);

// Info Badge
const InfoBadge = ({ text, type }: { text: string; type: 'required' | 'optional' | 'info' }) => {
    const styles = {
        required: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
        optional: 'bg-gray-100 dark:bg-gray-800 text-text-muted dark:text-dark-text-muted',
        info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
            {text}
        </span>
    );
};

export function AcademicProjectsForm({
    onBack,
    onNext,
}: AcademicProjectsFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempProject, setTempProject] = useState<Partial<AcademicProjectItem>>({
        technologies: [],
    });
    // Use ref to track technologies to avoid stale closure issues
    const technologiesRef = useRef<string[]>([]);
    const [newTech, setNewTech] = useState("");
    const [errors, setErrors] = useState<{ name?: string }>({});

    const projects = data.academicProjects || [];

    const isSummaryView = projects.length > 0 && !isEditing;

    const currentProject = tempProject;

    useEffect(() => {
        if (projects.length === 0) {
            setIsEditing(true);
            setTempProject({ id: `academicproj-${Date.now()}`, technologies: [] });
            technologiesRef.current = [];
        }
    }, [projects.length]);

    const validateData = () => {
        const newErrors: { name?: string } = {};
        
        if (!tempProject.name?.trim()) {
            newErrors.name = "Project title is required";
        } else if (tempProject.name.length > 120) {
            newErrors.name = "Project title must be less than 120 characters";
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

        // Use ref to get current technologies value
        const projectData = {
            ...tempProject,
            technologies: technologiesRef.current,
        };

        updateData((draft) => {
            if (!draft.academicProjects) draft.academicProjects = [];
            if (editingId) {
                const index = draft.academicProjects.findIndex((p) => p.id === editingId);
                if (index !== -1) {
                    draft.academicProjects[index] = projectData as AcademicProjectItem;
                }
                toast.success('Project updated successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            } else {
                draft.academicProjects.push(projectData as AcademicProjectItem);
                toast.success('Project added successfully!', {
                    style: toastStyle.success,
                    duration: 2000,
                });
            }
        });
        
        // Save to database after updating
        save();
        setIsEditing(false);
        setEditingId(null);
        setTempProject({ id: `academicproj-${Date.now()}`, technologies: [] });
        technologiesRef.current = [];
    };

    const handleEdit = (id: string) => {
        const item = projects.find((p) => p.id === id);
        if (item) {
            setEditingId(id);
            setTempProject({ ...item });
            // Also update ref for technologies when editing
            technologiesRef.current = item.technologies ? [...item.technologies] : [];
            setIsEditing(true);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            updateData((draft) => {
                if (draft.academicProjects) {
                    draft.academicProjects = draft.academicProjects.filter((p) => p.id !== id);
                }
            });
            toast.success('Project deleted successfully!', {
                style: toastStyle.success,
                duration: 2000,
            });
            
            if (projects.length <= 1) {
                setIsEditing(true);
                setTempProject({ id: `academicproj-${Date.now()}`, technologies: [] });
            }
        }
    };

    const handleAddMore = () => {
        setEditingId(null);
        setTempProject({ id: `academicproj-${Date.now()}`, technologies: [] });
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setTempProject((prev) => {
            const updated = { ...prev, [field]: value };
            return updated;
        });
        // Clear error for name field when user starts typing
        if (field === "name") {
            setErrors((prev) => ({ ...prev, name: undefined }));
        }
    };

    const addTech = () => {
        if (newTech.trim() && !technologiesRef.current.includes(newTech.trim())) {
            technologiesRef.current = [...technologiesRef.current, newTech.trim()];
            // Also update tempProject state for UI display
            setTempProject((prev) => ({ ...prev, technologies: technologiesRef.current }));
            setNewTech("");
        }
    };

    const removeTech = (tech: string) => {
        technologiesRef.current = technologiesRef.current.filter((t) => t !== tech);
        // Also update tempProject state for UI display
        setTempProject((prev) => ({ ...prev, technologies: technologiesRef.current }));
    };

    const getDescriptionPreview = (html: string) => {
        if (!html) return "";
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const lis = doc.querySelectorAll("li");
        return Array.from(lis)
            .slice(0, 2)
            .map((li) => "• " + (li.textContent || ""))
            .join("\n");
    };

    const renderSummary = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    Academic Projects <span className="text-accent dark:text-dark-accent">Summary</span>
                </h2>
                <p className="text-sm text-text-muted dark:text-dark-text-muted">
                    Review and manage your academic projects.
                </p>
            </div>

            <div className="space-y-4">
                {projects.map((item, index) => (
                    <div key={item.id} className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Briefcase className="w-5 h-5 text-accent dark:text-dark-accent" />
                                    <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">
                                        {item.name}
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                    {item.course && (
                                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{item.course}</span>
                                            {item.institution && <span>· {item.institution}</span>}
                                        </div>
                                    )}
                                    {item.duration && (
                                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                                            <Calendar className="w-4 h-4" />
                                            <span>{item.duration}</span>
                                        </div>
                                    )}
                                </div>

                                {item.technologies && item.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {item.technologies.map((tech, i) => (
                                            <span key={i} className="bg-accent/10 text-accent dark:text-dark-accent px-2 py-1 rounded-lg text-xs">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {item.description && (
                                    <div className="mt-3 p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                                        <p className="text-sm text-text-primary dark:text-dark-text-primary whitespace-pre-line">
                                            {getDescriptionPreview(item.description)}
                                        </p>
                                    </div>
                                )}

                                {item.url && (
                                    <div className="mt-2">
                                        <a 
                                            href={item.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs text-accent hover:underline flex items-center gap-1"
                                        >
                                            <Link className="w-3 h-3" />
                                            Project Link
                                        </a>
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
                    className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add more academic projects
                </button>
            </div>
        </div>
    );

    const renderForm = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    Add <span className="text-accent dark:text-dark-accent">Academic Project</span>
                </h2>
                <p className="text-sm text-text-muted dark:text-dark-text-muted max-w-xl">
                    Include major academic or final-year projects
                </p>
            </div>

            {/* Basic Information */}
            <SectionCard 
                title="Project Details" 
                description="Basic information about your project"
                icon={<Briefcase className="w-5 h-5" />}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StyledInput
                        label="Project Title"
                        placeholder="e.g., Machine Learning Classification Model"
                        value={currentProject.name || ""}
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                        maxLength={120}
                        characterCount
                        icon={<Briefcase className="w-4 h-4" />}
                        error={errors.name}
                        helperText="Name of academic project"
                    />

                    <StyledInput
                        label="Duration"
                        placeholder="e.g., Jan 2024 – Mar 2024"
                        value={currentProject.duration || ""}
                        onChange={(e) => updateField("duration", e.target.value)}
                        maxLength={50}
                        characterCount
                        icon={<Calendar className="w-4 h-4" />}
                        helperText="Example: Jan 2024 – Mar 2024"
                    />
                </div>
            </SectionCard>

            {/* Institution & Course */}
            <SectionCard 
                title="Institution & Course" 
                description="Where did you work on this project?"
                icon={<BookOpen className="w-5 h-5" />}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StyledInput
                        label="Course / Program"
                        placeholder="e.g., Data Science, Computer Science"
                        value={currentProject.course || ""}
                        onChange={(e) => updateField("course", e.target.value)}
                        maxLength={120}
                        characterCount
                        icon={<BookOpen className="w-4 h-4" />}
                        helperText="Course or program name"
                    />

                    <StyledInput
                        label="Institution"
                        placeholder="e.g., Stanford University"
                        value={currentProject.institution || ""}
                        onChange={(e) => updateField("institution", e.target.value)}
                        maxLength={120}
                        characterCount
                        icon={<BookOpen className="w-4 h-4" />}
                        helperText="College, university, or learning platform"
                    />
                </div>
            </SectionCard>

            {/* Technologies Used */}
            <SectionCard 
                title="Technologies Used" 
                description="Tools, languages, and frameworks"
                icon={<Code className="w-5 h-5" />}
            >
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTech}
                            onChange={(e) => setNewTech(e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-text-primary dark:text-dark-text-primary"
                            placeholder="Add a technology (e.g., Python, React, TensorFlow)"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                        />
                        <button
                            type="button"
                            onClick={addTech}
                            className="px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {currentProject.technologies?.map((tech, i) => (
                            <span
                                key={i}
                                className="bg-accent/10 text-accent dark:text-dark-accent px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-accent/20"
                            >
                                <Code className="w-3 h-3" />
                                {tech}
                                <button 
                                    type="button" 
                                    onClick={() => removeTech(tech)} 
                                    className="hover:text-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </span>
                        ))}
                        {(!currentProject.technologies || currentProject.technologies.length === 0) && (
                            <p className="text-sm text-text-muted dark:text-dark-text-muted">
                                No technologies added yet
                            </p>
                        )}
                    </div>
                    <p className="text-xs text-text-muted dark:text-dark-text-muted flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Add key tools, languages, or frameworks used
                    </p>
                </div>
            </SectionCard>

            {/* Key Contributions & Learnings */}
            <SectionCard 
                title="Key Contributions & Learnings" 
                description="What did you build and learn?"
                icon={<Award className="w-5 h-5" />}
            >
                <div className="space-y-2">
                    <RichTextEditor
                        value={currentProject.description || ""}
                        onChange={(value) => updateField("description", value)}
                        placeholder="Briefly explain what you built, your role, and what you learned or achieved (2–4 points)"
                        sectionTitle="Academic Project"
                    />
                    <p className="text-xs text-text-muted dark:text-dark-text-muted flex items-center gap-1 mt-2">
                        <AlertCircle className="w-3 h-3" />
                        Max 200 words recommended. Use bullet points for better readability.
                    </p>
                </div>
            </SectionCard>

            {/* Project URL */}
            <SectionCard 
                title="Project Link" 
                description="Optional - share your work"
                icon={<Link className="w-5 h-5" />}
            >
                <StyledInput
                    label="Project URL"
                    placeholder="https://github.com/username/project"
                    value={currentProject.url || ""}
                    onChange={(e) => updateField("url", e.target.value)}
                    type="url"
                    icon={<Link className="w-4 h-4" />}
                    helperText="Add a link only if the project is publicly accessible"
                />
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
                    className="px-8 py-2.5 rounded-xl border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:bg-accent/10 hover:border-accent transition-all duration-200 text-sm"
                >
                    ← Back
                </button>

                {!isSummaryView && (
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2.5 rounded-xl bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                    >
                        {editingId ? 'Update & Continue' : 'Save & Continue'}
                    </button>
                )}

                {isSummaryView && (
                    <button
                        onClick={onNext}
                        className="px-8 py-2.5 rounded-xl bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                    >
                        Continue →
                    </button>
                )}
            </div>
        </div>
    );
}

export default AcademicProjectsForm;