import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2, AlertCircle, Plus, Globe } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface LanguageItem {
  language: string;
  proficiency: string; // Native/Bilingual, Full Professional, Professional Working, Limited Working, Elementary
  capability: string; // Speak, Read & Write, Read, Write & Speak
}

const COMMON_LANGUAGES = ["English", "Hindi", "Tamil", "Marathi"];
const ALL_LANGUAGES = [
  "English", "Hindi", "Tamil", "Marathi", "Telugu", "Kannada", "Malayalam",
  "Gujarati", "Bengali", "Punjabi", "Odia", "Assamese", "Urdu", "Kashmiri",
  "Sindhi", "Manipuri", "French", "German", "Spanish", "Portuguese", "Italian",
  "Dutch", "Russian", "Chinese (Mandarin)", "Japanese", "Korean", "Arabic",
  "Hebrew", "Turkish", "Vietnamese"
];

const PROFICIENCY_OPTIONS = [
  "Native/Bilingual",
  "Full Professional",
  "Professional Working",
  "Limited Working",
  "Elementary"
];

const CAPABILITY_OPTIONS = [
  "Speak",
  "Read & Write",
  "Read, Write & Speak"
];

const PROFICIENCY_LEVEL_MAP: Record<string, number> = {
  "Elementary": 1,
  "Limited Working": 2,
  "Professional Working": 3,
  "Full Professional": 4,
  "Native/Bilingual": 5
};

interface LanguagesFormProps {
  data: { languages?: LanguageItem[] };
  onChange: (data: any) => void;
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
  error,
  onBlur,
  icon,
}: {
  label: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onBlur?: () => void;
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          className={`${baseInputClass}`}
        />
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
  placeholder,
}: {
  label: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
  error?: string;
  onBlur?: () => void;
  placeholder?: string;
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
      <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
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
          <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
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

// Language Card Component for Summary View
const LanguageCard = ({ language, index, onEdit, onDelete }: { 
  language: LanguageItem; 
  index: number;
  onEdit: () => void; 
  onDelete: () => void;
}) => (
  <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-accent dark:text-dark-accent" />
          <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">
            {language.language}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-2 mb-3">
          <div className="text-sm text-text-muted dark:text-dark-text-muted">
            <span className="font-medium">Proficiency:</span> {language.proficiency}
          </div>
          <div className="text-sm text-text-muted dark:text-dark-text-muted">
            <span className="font-medium">Capability:</span> {language.capability}
          </div>
        </div>

        {/* Progress bars */}
        <div className="flex gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded ${idx < PROFICIENCY_LEVEL_MAP[language.proficiency]
                ? "bg-accent dark:bg-dark-accent"
                : "bg-light-border dark:bg-dark-border"}`}
            />
          ))}
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

export const LanguagesForm: React.FC<LanguagesFormProps> = ({ 
  data, 
  onChange, 
  onBack, 
  onNext,
  onNavigateToSection 
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [languages, setLanguages] = useState<LanguageItem[]>(data?.languages || []);
  const [isEditing, setIsEditing] = useState(false);
  const [tempLang, setTempLang] = useState<LanguageItem>({ language: "", proficiency: "", capability: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const languageInputRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Sync with parent data
  useEffect(() => {
    if (!isEditing && data?.languages) {
      setLanguages(data.languages);
    }
  }, [data?.languages, isEditing]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!tempLang.language?.trim()) {
      newErrors.language = "Language is required";
    }

    if (!tempLang.proficiency) {
      newErrors.proficiency = "Proficiency is required";
    }

    if (!tempLang.capability) {
      newErrors.capability = "Capability is required";
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
    return tempLang.language?.trim() !== "" && 
           tempLang.proficiency !== "" && 
           tempLang.capability !== "";
  };

  const startAdding = (language = "") => {
    setEditingIndex(null);
    setTempLang({ language, proficiency: "", capability: "" });
    setIsEditing(true);
    setErrors({});
    setTouched({});

    setTimeout(() => {
      languageInputRef.current?.focus();
    }, 100);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingIndex(null);
    setTempLang({ language: "", proficiency: "", capability: "" });
    setErrors({});
    setTouched({});
  };

  const saveLanguage = () => {
    setTouched({
      language: true,
      proficiency: true,
      capability: true
    });

    if (!validateForm()) {
      return;
    }

    let newLanguages;
    if (editingIndex !== null) {
      newLanguages = [...languages];
      newLanguages[editingIndex] = tempLang;
      toast.success('Language updated successfully!', {
        style: toastStyle.success,
        duration: 2000,
      });
    } else {
      newLanguages = [...languages, tempLang];
      toast.success('Language added successfully!', {
        style: toastStyle.success,
        duration: 2000,
      });
    }

    onChange({ ...data, languages: newLanguages });
    
    setEditingIndex(null);
    setTempLang({ language: "", proficiency: "", capability: "" });
    setIsEditing(false);
    setErrors({});
    setTouched({});
  };

  const removeLanguage = (index: number) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    onChange({ ...data, languages: newLanguages });
    toast.success('Language deleted successfully!', {
      style: toastStyle.success,
      duration: 2000,
    });
  };

  const editLanguage = (index: number) => {
    const lang = languages[index];
    setTempLang({ ...lang });
    setEditingIndex(index);
    setIsEditing(true);
    setErrors({});
    setTouched({});

    setTimeout(() => {
      languageInputRef.current?.focus();
    }, 100);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      removeLanguage(deleteIndex);
    }
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const updateField = (field: string, value: any) => {
    setTempLang((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    if (field === "language" && !tempLang.language?.trim()) {
      setErrors((prev) => ({ ...prev, language: "Language is required" }));
    }
    if (field === "proficiency" && !tempLang.proficiency) {
      setErrors((prev) => ({ ...prev, proficiency: "Proficiency is required" }));
    }
    if (field === "capability" && !tempLang.capability) {
      setErrors((prev) => ({ ...prev, capability: "Capability is required" }));
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (onNavigateToSection) {
      onNavigateToSection("customSections");
    } else {
      navigate(`/preview/${id}`);
    }
  };

  const handleContinue = () => {
    if (onNext) {
      onNext();
    } else if (onNavigateToSection) {
      onNavigateToSection("customSections");
    } else {
      navigate(`/preview/${id}`);
    }
  };

  return (
    <div ref={formContainerRef} className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          Languages <span className="text-accent dark:text-dark-accent">you know</span>
        </h2>
        <p className="text-base text-text-muted dark:text-dark-text-muted">
          Add each language and then select proficiency and capability
        </p>
      </div>

      {/* Quick Add Languages */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-3">
          Quick Add Common Languages
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COMMON_LANGUAGES.map((lang) => {
            const isAlreadySelected = languages.some(l => l.language.toLowerCase() === lang.toLowerCase());
            return (
              <button
                key={lang}
                type="button"
                onClick={() => !isAlreadySelected && startAdding(lang)}
                disabled={isAlreadySelected}
                className={`px-4 py-3 rounded-lg border transition-all duration-200 text-center ${
                  isAlreadySelected
                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500'
                    : 'border-light-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent hover:bg-accent/5 text-text-primary dark:text-dark-text-primary'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Section */}
      {isEditing && (
        <div className="mb-8 bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border p-6">
          <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4">
            {editingIndex !== null ? 'Edit Language' : 'Add New Language'}
          </h3>
          
          <div className="space-y-4">
            <StyledInput
              label="Language"
              placeholder="Type or select a language"
              value={tempLang.language}
              onChange={(e) => updateField("language", e.target.value)}
              onBlur={() => handleBlur("language")}
              required
              icon={<Globe className="w-4 h-4" />}
              error={touched.language ? errors.language : ""}
            />

            <StyledSelect
              label="Proficiency"
              value={tempLang.proficiency}
              onChange={(e) => updateField("proficiency", e.target.value)}
              onBlur={() => handleBlur("proficiency")}
              options={PROFICIENCY_OPTIONS}
              required
              error={touched.proficiency ? errors.proficiency : ""}
              placeholder="Select proficiency"
            />

            <StyledSelect
              label="Capability"
              value={tempLang.capability}
              onChange={(e) => updateField("capability", e.target.value)}
              onBlur={() => handleBlur("capability")}
              options={CAPABILITY_OPTIONS}
              required
              error={touched.capability ? errors.capability : ""}
              placeholder="Select capability"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-2.5 rounded-xl border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:bg-accent/10 hover:border-accent transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveLanguage}
              disabled={!isFormValid()}
              className={`px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 ${
                isFormValid()
                  ? 'bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white cursor-pointer'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {editingIndex !== null ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Languages List */}
      <div className="mb-8">
        {languages.length > 0 ? (
          <div className="space-y-4">
            {languages.map((lang, index) => (
              <LanguageCard
                key={`${lang.language}-${index}`}
                language={lang}
                index={index}
                onEdit={() => editLanguage(index)}
                onDelete={() => handleDeleteClick(index)}
              />
            ))}
          </div>
        ) : !isEditing && (
          <div className="text-center py-12 text-text-muted dark:text-dark-text-muted border border-dashed border-light-border dark:border-dark-border rounded-xl">
            <Globe className="w-12 h-12 mx-auto mb-3 text-accent/50" />
            <p className="text-base mb-1">No languages added yet</p>
            <p className="text-sm opacity-75">Click "Add Language" to get started</p>
          </div>
        )}

        {/* Add Language Button */}
        {!isEditing && (
          <button
            type="button"
            onClick={() => startAdding()}
            className="mt-4 w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-base text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Language
          </button>
        )}
      </div>

      {/* Footer Buttons */}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl shadow-xl max-w-md w-full mx-auto border border-light-border dark:border-dark-border p-6">
            <h3 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-3">
              Confirm Deletion
            </h3>
            <p className="text-text-muted dark:text-dark-text-muted mb-6">
              Are you sure you want to delete the language "{languages[deleteIndex!]?.language}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary hover:bg-accent/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguagesForm;