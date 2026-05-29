import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useResumeStore } from "../../stores";
import { MonthYearPicker } from "./MonthYearPicker";
import { RichTextEditor } from "../editor/RichTextEditor";
import { Briefcase, Building, MapPin, Calendar, Award, AlertCircle, ChevronRight, Edit, Trash2, Plus } from "lucide-react";
import { confirmDeleteToast } from "../../utils/confirmDeleteToast";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface ExperienceFormProps {
  onNext?: () => void;
  onBack?: () => void;
  resumeId?: string;
}

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  achievements?: string;
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
  characterCount,
  onBlur,
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
  onBlur?: () => void;
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

// Helper function to extract text from HTML
const extractTextFromHtml = (html: string) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

// Helper function to get achievement preview
const getAchievementPreview = (html: string) => {
  if (!html) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const lis = doc.querySelectorAll("li");
  return Array.from(lis).map(li => li.textContent || "");
};

// Helper function to generate unique IDs
const generateUniqueId = () => {
  return `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to ensure all experience items have IDs
const ensureExperienceIds = (experiences: any[]): ExperienceItem[] => {
  if (!experiences || !Array.isArray(experiences)) return [];
  
  return experiences.map((exp, index) => {
    // If item already has an ID, keep it
    if (exp.id) return exp;
    
    // Otherwise, generate a new ID
    // console.log(`Experience item missing ID, generating one for index ${index}`);
    return {
      ...exp,
      id: generateUniqueId()
    };
  });
};

// Experience Item Component
const ExperienceItem = ({ 
  item, 
  onEdit, 
  onDelete 
}: { 
  item: ExperienceItem; 
  onEdit: () => void; 
  onDelete: () => void;
}) => {
  const formatDuration = () => {
    if (!item.startDate && !item.endDate && !item.isCurrent) return "";
    if (item.startDate && item.isCurrent) return `${item.startDate} - Present`;
    if (item.startDate && item.endDate) return `${item.startDate} - ${item.endDate}`;
    return item.startDate || item.endDate || "";
  };

  const achievements = getAchievementPreview(item.achievements || "");

  return (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-accent dark:text-dark-accent" />
            <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">
              {item.title} <span className="text-text-muted font-normal">at {item.company}</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {item.location && (
              <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                <MapPin className="w-4 h-4" />
                <span>{item.location}</span>
              </div>
            )}
            {(item.startDate || item.isCurrent || item.endDate) && (
              <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                <Calendar className="w-4 h-4" />
                <span>{formatDuration()}</span>
              </div>
            )}
          </div>

          {item.description && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Role Description</h4>
              <div className="p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                <p className="text-sm text-text-primary">
                  {extractTextFromHtml(item.description)}
                </p>
              </div>
            </div>
          )}

          {achievements.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Key Achievements</h4>
              <div className="p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                <ul className="space-y-1">
                  {achievements.slice(0, 3).map((achievement, idx) => (
                    <li key={idx} className="text-sm text-text-primary flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                  {achievements.length > 3 && (
                    <li className="text-sm text-text-muted mt-1">
                      +{achievements.length - 3} more achievements
                    </li>
                  )}
                </ul>
              </div>
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
};

export default function ExperienceForm({
  onNext,
  onBack,
  resumeId,
}: ExperienceFormProps) {
  const { data, updateData, save } = useResumeStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExperienceItem>({
    id: generateUniqueId(),
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    achievements: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Ensure all experience items have IDs
  const experiencesWithIds = useMemo(() => {
    const rawExperiences = data?.experience || [];
    const experiencesWithIds = ensureExperienceIds(rawExperiences);
    
    // If we added IDs to any items, update the store
    if (JSON.stringify(rawExperiences) !== JSON.stringify(experiencesWithIds)) {
      // console.log('Added missing IDs to experience items');
      updateData((draft) => {
        draft.experience = experiencesWithIds;
      });
    }
    
    return experiencesWithIds;
  }, [data?.experience, updateData]);

  const experiences = experiencesWithIds;
  const isSummaryView = experiences.length > 0 && !isEditing;

  useEffect(() => {
    if (experiences.length === 0 && !isEditing) {
      setIsEditing(true);
    }
  }, [experiences.length, isEditing]);

  const resetForm = useCallback(() => {
    setFormData({
      id: generateUniqueId(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      achievements: "",
    });
    setEditingId(null);
    setErrors({});
    setTouched({});
  }, []);

  const handleChange = useCallback((field: keyof ExperienceItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  const handleBlur = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const handlePresentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    handleChange("isCurrent", checked);
    if (checked) {
      handleChange("endDate", "");
    }
  }, [handleChange]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields', {
        style: toastStyle.error,
        duration: 3000,
      });
      return false;
    }

    return true;
  }, [formData.title, formData.company]);

  const isFormValid = useCallback(() => {
    return formData.title.trim() !== "" && formData.company.trim() !== "";
  }, [formData.title, formData.company]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    const experienceEntry = {
      ...formData,
      id: formData.id || generateUniqueId(),
      endDate: formData.isCurrent ? "" : formData.endDate,
    };

    updateData((draft) => {
      if (!draft.experience) draft.experience = [];
      
      if (editingId) {
        // Update existing
        const index = draft.experience.findIndex((e: ExperienceItem) => e.id === editingId);
        if (index !== -1) {
          draft.experience[index] = experienceEntry;
        }
        toast.success('Experience updated successfully!', {
          style: toastStyle.success,
          duration: 2000,
        });
      } else {
        // Add new
        draft.experience.push(experienceEntry);
        toast.success('Experience added successfully!', {
          style: toastStyle.success,
          duration: 2000,
        });
      }
    });

    await save();
    resetForm();
    setIsEditing(false);
  }, [formData, editingId, updateData, save, validateForm, resetForm]);

  const handleEdit = useCallback((id: string) => {
    // console.log('Editing experience with ID:', id);
    const item = experiences.find((e: ExperienceItem) => e.id === id);
    if (item) {
      setEditingId(id);
      setFormData({ ...item });
      setIsEditing(true);
    } else {
      console.error('Experience item not found with ID:', id);
    }
  }, [experiences]);

  const handleDelete = useCallback(async (id: string) => {
    confirmDeleteToast(async () => {
      try {
        // console.log('========== DELETE OPERATION ==========');
        // console.log('Deleting experience with ID:', id);
        // console.log('Current experiences:', experiences.map(e => ({ id: e.id, title: e.title })));
        
        // Filter out ONLY the item with the matching ID
        const updatedExperiences = experiences.filter((e: ExperienceItem) => {
          const shouldKeep = e.id !== id;
          if (!shouldKeep) {
            // console.log('Removing item:', { id: e.id, title: e.title });
          }
          return shouldKeep;
        });
        
        // console.log('Experiences after deletion:', updatedExperiences.map(e => ({ id: e.id, title: e.title })));
        // console.log('Count before:', experiences.length);
        // console.log('Count after:', updatedExperiences.length);
        // console.log('=====================================');
        
        // Verify we're not deleting everything incorrectly
        if (updatedExperiences.length === experiences.length) {
          console.error('ERROR: No items were filtered out! ID not found:', id);
          toast.error('Failed to delete: Item not found', {
            style: toastStyle.error,
            duration: 3000,
          });
          return;
        }
        
        // Update the store with filtered array
        updateData((draft) => {
          draft.experience = updatedExperiences;
        });
        
        // Save to backend
        await save();
        
        toast.success('Experience deleted successfully!', {
          style: toastStyle.success,
          duration: 2000,
        });
        
        // Update UI based on the NEW count
        if (updatedExperiences.length === 0) {
          setIsEditing(true);
          resetForm();
        } else {
          setIsEditing(false);
          setEditingId(null);
        }
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error('Failed to delete experience', {
          style: toastStyle.error,
          duration: 3000,
        });
      }
    });
  }, [experiences, updateData, save, resetForm]);

  const handleAddMore = useCallback(() => {
    resetForm();
    setIsEditing(true);
  }, [resetForm]);

  const handleBack = useCallback(() => {
    if (editingId) {
      setIsEditing(false);
      setEditingId(null);
      resetForm();
    } else {
      onBack?.();
    }
  }, [editingId, onBack, resetForm]);

  const renderSummary = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          Experience{" "}
          <span className="text-accent dark:text-dark-accent">Summary</span>
        </h2>

        <div className="mt-6 flex  justify-between items-center">
          <p className="text-base text-text-muted dark:text-dark-text-muted">
            Review and manage your work experience.
          </p>
          <button
  onClick={handleAddMore}
  className="
    flex items-center gap-1.5
    px-3 py-1.5
    rounded-lg
    bg-accent
    text-white
    text-sm
    font-medium
    hover:opacity-90
    transition-all
    shadow-sm
  "
>
  <Plus className="w-4 h-4" />
  Add Experience
</button>
        </div>
      </div>

      <div className="space-y-4">
        {experiences.map((item: ExperienceItem) => (
          <ExperienceItem
            key={item.id}
            item={item}
            onEdit={() => handleEdit(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-light-border dark:border-dark-border">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-xl border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:bg-accent/10 hover:border-accent transition-all duration-200 text-base"
        >
          ← Back
        </button>

        <button
          onClick={onNext}
          className="px-8 py-3 rounded-xl bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-base flex items-center gap-2"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Experience</span>
        </h2>
        <p className="text-base text-text-muted dark:text-dark-text-muted">
          Add your work experience to showcase your professional background and achievements.
        </p>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StyledInput
            label="Job Title"
            placeholder="Software Engineer"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            onBlur={() => handleBlur("title")}
            required
            maxLength={100}
            icon={<Briefcase className="w-4 h-4" />}
            error={touched.title ? errors.title : ""}
          />

          <StyledInput
            label="Company"
            placeholder="Google, Microsoft"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            onBlur={() => handleBlur("company")}
            required
            maxLength={100}
            icon={<Building className="w-4 h-4" />}
            error={touched.company ? errors.company : ""}
          />

          <StyledInput
            label="Location"
            placeholder="San Francisco, CA"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            maxLength={100}
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
              Start Date
            </label>
            <MonthYearPicker
              value={formData.startDate || ""}
              onChange={(value) => handleChange("startDate", value)}
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
                value={formData.isCurrent ? "" : formData.endDate || ""}
                onChange={(value) => handleChange("endDate", value)}
                className="w-full"
                placeholder="Select end date"
                disabled={formData.isCurrent}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={formData.isCurrent}
                  onChange={handlePresentChange}
                  className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <label htmlFor="isCurrent" className="text-sm text-text-primary dark:text-dark-text-primary">
                  I currently work here
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Description */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary">
          Role Description
        </label>
        <RichTextEditor
          value={formData.description || ""}
          onChange={(value) => handleChange("description", value)}
          placeholder="Describe your day-to-day responsibilities, scope of work, and key functions..."
          sectionTitle="Experience"
        />
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary">
          Achievements
        </label>
        <RichTextEditor
          value={formData.achievements || ""}
          onChange={(value) => handleChange("achievements", value)}
          placeholder="• Increased sales by 25% in first year\n• Led a team of 5 developers to deliver project ahead of schedule\n• Implemented new process that saved $50k annually"
          sectionTitle="Achievements"
        />
      </div>

      {/* Form Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-light-border dark:border-dark-border">
        <button
          onClick={handleBack}
          className="px-8 py-3 rounded-xl border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:bg-accent/10 hover:border-accent transition-all duration-200 text-base"
        >
          ← Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-base flex items-center gap-2 ${
            isFormValid()
              ? 'bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white cursor-pointer'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {editingId ? 'Update' : 'Save'} & Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      {isSummaryView ? renderSummary() : renderForm()}
    </div>
  );
}