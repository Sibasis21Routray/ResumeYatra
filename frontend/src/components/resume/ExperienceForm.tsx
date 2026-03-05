// import React, { useState } from "react";
// import { useResumeStore } from "../../stores";
// import { ReviewListStep, ItemConfig } from "./steps/ReviewListStep";
// import { BasicDetailsStep, FieldConfig } from "./steps/BasicDetailsStep";
// import { DescriptionStep } from "./steps/DescriptionStep";
// import { calculateDuration } from "../../utils/dateUtils";

// type ExperienceStep = "review" | "basic" | "description";

// interface ExperienceData {
//   id: string;
//   company?: string;
//   title?: string;
//   domain?: string;
//   location?: string;
//   startDate?: string;
//   endDate?: string;
//   description?: string;
//   achievements?: string;
//   duration?: string;
//   isCurrent?: boolean;
// }

// interface ExperienceFormProps {
//   data?: any;
//   onNext?: () => void;
//   onBack?: () => void;
//   onOpenAIModal?: () => void;
//   resumeId?: string;
// }

// export default function ExperienceForm({
//   data,
//   onNext,
//   onBack,
//   onOpenAIModal,
//   resumeId,
// }: ExperienceFormProps) {
//   const updateData = useResumeStore((s) => s.updateData);
//   const experience = data?.experience || useResumeStore((s) => s.data.experience || []);

//   const [step, setStep] = useState<ExperienceStep>(
//     experience.length === 0 ? "basic" : "review"
//   );

//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [draft, setDraft] = useState<ExperienceData | null>(null);
//   const [showSkipModal, setShowSkipModal] = useState(false);

//   const basicFields: FieldConfig[] = [
//     { name: "title", label: "Job Title", type: "text", placeholder: "e.g., Software Engineer" },
//     { name: "company", label: "Employer", type: "text", placeholder: "e.g., Google, Microsoft" },
//     { name: "domain", label: "Domain", type: "text", placeholder: "e.g., Technology, Healthcare, Finance" },
//     { name: "location", label: "Company Location", type: "text", placeholder: "e.g., San Francisco, CA" },
//     { name: "startDate", label: "Start Date", type: "text" },
//     { name: "endDate", label: "End Date", type: "text" },
//     { name: "isCurrent", label: "I currently work here", type: "checkbox" },
//   ];

//   const itemConfig: ItemConfig = {
//     titleField: "title",
//     subtitleField: "company",
//     dateRangeFields: { start: "startDate", end: "endDate" },
//     descriptionField: "description",
//   };

//   const activeExperience =
//     editingId
//       ? experience.find((e: ExperienceData) => e.id === editingId)
//       : draft;

//   const handleAdd = () => {
//     setEditingId(null);
//     setDraft(null);
//     setStep("basic");
//   };

//   const handleDelete = (id: string) => {
//     updateData((d) => {
//       d.experience = d.experience.filter((e: ExperienceData) => e.id !== id);
//     });
//   };

//   const handleBasicSubmit = (data: Record<string, any>) => {
//     if (editingId) {
//       updateData((d) => {
//         const exp = d.experience.find((e: ExperienceData) => e.id === editingId);
//         if (exp) Object.assign(exp, data);
//       });
//     } else {
//       setDraft({
//         id: `exp-${Date.now()}`,
//         ...data,
//       });
//     }
//     setStep("description");
//   };

//   const handleDescriptionSubmit = ({ description, achievements }: { description: string; achievements?: string }) => {
//     if (editingId) {
//       updateData((d) => {
//         const exp = d.experience.find((e: ExperienceData) => e.id === editingId);
//         if (exp) {
//           exp.description = description;
//           exp.achievements = achievements;
//         }
//       });
//       setEditingId(null);
//       setStep("review");
//     } else if (draft) {
//       updateData((d) => {
//         d.experience.push({ ...draft, description, achievements } as ExperienceData);
//       });
//       setDraft(null);
//       setStep("review");
//     }
//   };

//   const handleBack = () => {
//     if (step === "description") {
//       setStep("basic");
//       return;
//     }
//     if (step === "basic") {
//       experience.length === 0 ? onBack?.() : setStep("review");
//       return;
//     }
//     onBack?.();
//   };

//   return (
//     <>
//       {step === "review" && (
//         <ReviewListStep
//           title="Review your work history"
//           items={experience}
//           itemConfig={itemConfig}
//           emptyTitle="No Experience Added"
//           emptyDescription="Add your work experience to showcase your professional background and achievements."
//           addButtonText="+ Add more experience"
//           onAdd={handleAdd}
//           onEditBasic={(id) => {
//             setEditingId(id);
//             setDraft(null);
//             setStep("basic");
//           }}
//           onEditDescription={(id) => {
//             setEditingId(id);
//             setDraft(null);
//             setStep("description");
//           }}
//           onDelete={handleDelete}
//           onBack={onBack}
//           onContinue={onNext}
//           canContinue={true}
//           isContinueLoading={false}
//         />
//       )}

//       {step === "basic" && (
//         <BasicDetailsStep
//           title={editingId ? "Edit experience" : "Add your experience"}
//           fields={basicFields}
//           initialData={activeExperience || {}}
//           onSubmit={handleBasicSubmit}
//           onEmptySubmit={() => setShowSkipModal(true)}
//           onBack={handleBack}
//           submitButtonText="Continue"
//         />
//       )}

//       {step === "description" && (
//         <DescriptionStep
//           title="Add role description and achievements"
//           initialDescription={activeExperience?.description || ""}
//           initialAchievements={activeExperience?.achievements || ""}
//           onSubmit={handleDescriptionSubmit}
//           onBack={handleBack}
//           resumeId={resumeId}
//           context="experience"
//           metadata={{
//             title: activeExperience?.title || "",
//             company: activeExperience?.company || "",
//             domain: activeExperience?.domain || "",
//             duration: calculateDuration(
//               activeExperience?.startDate || "",
//               activeExperience?.isCurrent ? "" : activeExperience?.endDate || ""
//             ),
//           }}
//           onEnhanceWithAI={onOpenAIModal}
//         />
//       )}

//       {showSkipModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-lg p-6 max-w-md w-full">
//             <h3 className="text-lg font-semibold mb-3 text-text-primary dark:text-dark-text-primary">
//               Skip Experience Section?
//             </h3>

//             <p className="text-text-muted dark:text-dark-text-muted mb-6">
//               You have not added any experience details.
//               Are you sure you want to skip this section?
//             </p>

//             <div className="flex gap-4">
//               <button
//                 onClick={() => {
//                   setShowSkipModal(false);
//                   onNext?.();
//                 }}
//                 className="flex-1 bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-bg-primary dark:text-dark-bg-primary py-2 rounded font-medium transition-colors"
//               >
//                 Yes, skip
//               </button>

//               <button
//                 onClick={() => setShowSkipModal(false)}
//                 className="flex-1 border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary py-2 rounded font-medium hover:bg-accent/10 transition-colors"
//               >
//                 No, I will add
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }




import React, { useState, useEffect } from "react";
import { useResumeStore } from "../../stores";
import { MonthYearPicker } from "./MonthYearPicker";
import { RichTextEditor } from "../editor/RichTextEditor";
import { Briefcase, Building, MapPin, Calendar, Award, AlertCircle, ChevronRight, Edit, Trash2, Plus } from "lucide-react";
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
const SectionCard = ({ title, description, children, icon, required }: {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  required?: boolean;
}) => (
  <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border overflow-hidden shadow-sm">
    <div className="px-5 py-4 border-b border-light-border dark:border-dark-border bg-gradient-to-r from-bg-secondary/30 to-transparent">
      <div className="flex items-center gap-3">
        {icon && <div className="text-accent dark:text-dark-accent">{icon}</div>}
        <div>
          <h4 className="text-base font-semibold text-text-primary dark:text-dark-text-primary flex items-center gap-2">
            {title}
            {required && (
              <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                Required
              </span>
            )}
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
    id: "",
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

  const experiences = data.experience || [];
  const isSummaryView = experiences.length > 0 && !isEditing;

  useEffect(() => {
    if (experiences.length === 0) {
      setIsEditing(true);
      setFormData({ 
        id: `exp-${Date.now()}`, 
        title: "", 
        company: "", 
        location: "", 
        startDate: "", 
        endDate: "", 
        isCurrent: false, 
        description: "", 
        achievements: "" 
      });
    }
  }, [experiences.length]);

  const handleChange = (field: keyof ExperienceItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handlePresentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    handleChange("isCurrent", checked);
    if (checked) {
      handleChange("endDate", "");
    }
  };

  const validateForm = () => {
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
  };

  const isFormValid = () => {
    return formData.title.trim() !== "" && formData.company.trim() !== "";
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const experienceEntry = {
      ...formData,
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

    save();

    // Reset form
    setFormData({
      id: `exp-${Date.now()}`,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      achievements: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const item = experiences.find((e: ExperienceItem) => e.id === id);
    if (item) {
      setEditingId(id);
      setFormData({ ...item });
      setIsEditing(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      updateData((draft) => {
        if (draft.experience) {
          draft.experience = draft.experience.filter((e: ExperienceItem) => e.id !== id);
        }
      });
      save();
      toast.success('Experience deleted successfully!', {
        style: toastStyle.success,
        duration: 2000,
      });

      if (experiences.length <= 1) {
        setIsEditing(true);
        setFormData({ 
          id: `exp-${Date.now()}`, 
          title: "", 
          company: "", 
          location: "", 
          startDate: "", 
          endDate: "", 
          isCurrent: false, 
          description: "", 
          achievements: "" 
        });
      }
    }
  };

  const handleAddMore = () => {
    setEditingId(null);
    setFormData({ 
      id: `exp-${Date.now()}`, 
      title: "", 
      company: "", 
      location: "", 
      startDate: "", 
      endDate: "", 
      isCurrent: false, 
      description: "", 
      achievements: "" 
    });
    setIsEditing(true);
  };

  const renderSummary = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          Experience <span className="text-accent dark:text-dark-accent">Summary</span>
        </h2>
        <p className="text-base text-text-muted dark:text-dark-text-muted">
          Review and manage your work experience.
        </p>
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

      <div className="mt-6">
        <button
          onClick={handleAddMore}
          className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-base text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add more experience
        </button>
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
    <div className="space-y-6">
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
      <SectionCard 
        title="Basic Information" 
        description="Tell us about your role"
        icon={<Briefcase className="w-5 h-5" />}
        required
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StyledInput
            label="Job Title"
            placeholder="e.g., Software Engineer"
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
            placeholder="e.g., Google, Microsoft"
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
            placeholder="e.g., San Francisco, CA"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            maxLength={100}
            icon={<MapPin className="w-4 h-4" />}
            helperText="City, state, or remote"
          />
        </div>
      </SectionCard>

      {/* Duration */}
      <SectionCard 
        title="Duration" 
        description="When did you work here?"
        icon={<Calendar className="w-5 h-5" />}
      >
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
      </SectionCard>

      {/* Role Description */}
      <SectionCard 
        title="Role Description" 
        description="Describe your role and responsibilities in brief"
        icon={<Briefcase className="w-5 h-5" />}
      >
        <RichTextEditor
          value={formData.description || ""}
          onChange={(value) => handleChange("description", value)}
          placeholder="Describe your day-to-day responsibilities, scope of work, and key functions..."
          sectionTitle="Experience"
        />
        <p className="mt-2 text-xs text-text-muted flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          Briefly describe your role and key responsibilities
        </p>
      </SectionCard>

      {/* Achievements */}
      <SectionCard 
        title="Achievements" 
        description="3–5 bullet achievements"
        icon={<Award className="w-5 h-5" />}
      >
        <RichTextEditor
          value={formData.achievements || ""}
          onChange={(value) => handleChange("achievements", value)}
          placeholder="• Increased sales by 25% in first year
• Led a team of 5 developers to deliver project ahead of schedule
• Implemented new process that saved $50k annually"
          sectionTitle="Achievements"
        />
        <p className="mt-2 text-xs text-text-muted flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          Use bullet points for better readability. Quantify achievements where possible.
        </p>
      </SectionCard>

      {/* Form Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-light-border dark:border-dark-border">
        <button
          onClick={() => {
            if (editingId) {
              setIsEditing(false);
              setEditingId(null);
            } else {
              onBack?.();
            }
          }}
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
    <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 ">
      {isSummaryView ? renderSummary() : renderForm()}
    </div>
  );
}