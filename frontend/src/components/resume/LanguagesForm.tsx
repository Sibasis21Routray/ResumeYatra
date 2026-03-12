import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2, AlertCircle, Plus, Globe, ChevronDown, ChevronUp } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface LanguageItem {
  language: string; // Will be either just language name or "language - proficiency"
  capability?: string; // Only present for capability type
  // Note: proficiency is not stored as a separate field, it's part of the language string
}

const ALL_LANGUAGES = [
  "English", "Hindi", "Tamil", "Marathi", "Telugu", "Kannada", "Malayalam",
  "Gujarati", "Bengali", "Punjabi", "Odia", "Assamese", "Urdu", "Kashmiri",
  "Sindhi", "Manipuri", "French", "German", "Spanish", "Portuguese", "Italian",
  "Dutch", "Russian", "Chinese (Mandarin)", "Japanese", "Korean", "Arabic",
  "Hebrew", "Turkish", "Vietnamese", "Thai", "Indonesian", "Greek", "Polish",
  "Swedish", "Danish", "Finnish", "Norwegian", "Czech", "Hungarian", "Romanian",
  "Ukrainian", "Bulgarian", "Serbian", "Croatian", "Slovak", "Slovenian",
  "Lithuanian", "Latvian", "Estonian", "Icelandic", "Maltese", "Albanian",
  "Macedonian", "Bosnian", "Montenegrin", "Luxembourgish", "Afrikaans",
  "Swahili", "Zulu", "Xhosa", "Yoruba", "Igbo", "Hausa", "Amharic",
  "Somali", "Nepali", "Sinhala", "Burmese", "Khmer", "Lao", "Mongolian",
  "Persian", "Pashto", "Kurdish", "Armenian", "Georgian", "Azerbaijani",
  "Kazakh", "Uzbek", "Turkmen", "Kyrgyz", "Tajik", "Hebrew", "Yiddish"
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

// Styled Input Component with Autocomplete
const LanguageInputWithAutocomplete = ({
  label,
  value,
  onChange,
  onSelect,
  placeholder,
  required = false,
  error,
  onBlur,
  icon,
  suggestions,
  disabled = false,
}: {
  label: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (language: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onBlur?: () => void;
  icon?: React.ReactNode;
  suggestions: string[];
  disabled?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const filtered = suggestions.filter(lang =>
        lang.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let baseInputClass = `w-full ${icon ? 'pl-10' : 'px-4'} pr-10 py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-base text-text-primary dark:text-dark-text-primary placeholder:text-sm placeholder:text-text-muted/70 dark:placeholder:text-dark-text-muted/70 shadow-sm hover:shadow-md`;

  if (error) {
    baseInputClass += " border-red-500 focus:ring-red-500 focus:border-red-500";
  } else if (isFocused) {
    baseInputClass += " border-accent dark:border-dark-accent ring-2 ring-accent/20";
  } else {
    baseInputClass += " border-light-border dark:border-dark-border";
  }

  if (disabled) {
    baseInputClass += " opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800";
  }

  const handleSuggestionClick = (language: string) => {
    onSelect(language);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full relative">
      <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted z-10">
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={value || ""}
          onChange={onChange}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputClass}`}
        />
        {value && (
          <button
            onClick={() => {
              if (!disabled) {
                onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
            type="button"
          >
            ×
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && !disabled && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-[100] w-full mt-1 bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-lg shadow-xl max-h-60 overflow-y-auto"
          style={{ top: '100%', left: 0, right: 0 }}
        >
          {filteredSuggestions.map((language) => (
            <div
              key={language}
              onClick={() => handleSuggestionClick(language)}
              className="px-4 py-2.5 hover:bg-accent/10 dark:hover:bg-dark-accent/10 cursor-pointer text-text-primary dark:text-dark-text-primary transition-colors"
            >
              {language}
            </div>
          ))}
        </div>
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
  disabled = false,
}: {
  label: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
  error?: string;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
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

  if (disabled) {
    baseSelectClass += " opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800";
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
          disabled={disabled}
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

// Radio Button Component for Level Type Selection
const LevelTypeRadio = ({
  value,
  selected,
  onChange,
  label,
  description
}: {
  value: 'proficiency' | 'capability';
  selected: 'proficiency' | 'capability';
  onChange: (value: 'proficiency' | 'capability') => void;
  label: string;
  description: string;
}) => (
  <label
    className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
      selected === value
        ? 'border-accent dark:border-dark-accent bg-accent/5 dark:bg-dark-accent/5'
        : 'border-light-border dark:border-dark-border hover:border-accent/50 dark:hover:border-dark-accent/50'
    }`}
  >
    <input
      type="radio"
      name="levelType"
      value={value}
      checked={selected === value}
      onChange={() => onChange(value)}
      className="sr-only"
    />
    <div className="flex items-center gap-3">
      <div className={`w-4 h-4 rounded-full border-2 ${
        selected === value
          ? 'border-accent dark:border-dark-accent bg-accent dark:bg-dark-accent'
          : 'border-text-muted'
      }`}>
        {selected === value && (
          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
        )}
      </div>
      <div>
        <p className="font-semibold text-text-primary dark:text-dark-text-primary">{label}</p>
        <p className="text-sm text-text-muted dark:text-dark-text-muted">{description}</p>
      </div>
    </div>
  </label>
);

// Language Card Component for Summary View
const LanguageCard = ({ language, index, onEdit, onDelete }: { 
  language: LanguageItem; 
  index: number;
  onEdit: () => void; 
  onDelete: () => void;
}) => {
  // Parse the language string to extract base language if it contains a dash
  const displayLanguage = language.language.includes(' - ') 
    ? language.language.split(' - ')[0] 
    : language.language;
    
  const levelDisplay = language.language.includes(' - ') 
    ? language.language.split(' - ')[1] 
    : language.capability || '';

  const levelLabel = language.language.includes(' - ') ? 'Proficiency' : 'Capability';

  // Get proficiency level for progress bars
  const proficiencyLevel = language.language.includes(' - ') 
    ? language.language.split(' - ')[1] 
    : '';

  return (
    <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-accent dark:text-dark-accent" />
            <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">
              {displayLanguage}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-2 mb-3">
            <div className="text-sm text-text-muted dark:text-dark-text-muted">
              <span className="font-medium">{levelLabel}:</span> {levelDisplay}
            </div>
          </div>

          {/* Progress bars - only show for proficiency type */}
          {language.language.includes(' - ') && proficiencyLevel && (
            <div className="flex gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 flex-1 rounded-full ${
                    idx < PROFICIENCY_LEVEL_MAP[proficiencyLevel]
                      ? "bg-accent dark:bg-dark-accent"
                      : "bg-light-border dark:bg-dark-border"
                  }`}
                />
              ))}
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
  const [tempLang, setTempLang] = useState<{ 
    baseLanguage: string; 
    proficiency?: string; 
    capability?: string;
    levelType: 'proficiency' | 'capability';
  }>({ 
    baseLanguage: "", 
    proficiency: "", 
    capability: "",
    levelType: 'proficiency' // Default to proficiency
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const formContainerRef = useRef<HTMLDivElement>(null);

  // Sync with parent data
  useEffect(() => {
    if (!isEditing && data?.languages) {
      setLanguages(data.languages);
    }
  }, [data?.languages, isEditing]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!tempLang.baseLanguage?.trim()) {
      newErrors.baseLanguage = "Language is required";
    }

    // Validate based on selected level type
    if (tempLang.levelType === 'proficiency') {
      if (!tempLang.proficiency) {
        newErrors.proficiency = "Proficiency level is required";
      }
    } else {
      if (!tempLang.capability) {
        newErrors.capability = "Capability is required";
      }
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
    if (!tempLang.baseLanguage?.trim()) return false;
    
    if (tempLang.levelType === 'proficiency') {
      return tempLang.proficiency !== "";
    } else {
      return tempLang.capability !== "";
    }
  };

  const startAdding = () => {
    setEditingIndex(null);
    setTempLang({ 
      baseLanguage: "", 
      proficiency: "", 
      capability: "",
      levelType: 'proficiency' 
    });
    setIsEditing(true);
    setErrors({});
    setTouched({});
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingIndex(null);
    setTempLang({ 
      baseLanguage: "", 
      proficiency: "", 
      capability: "",
      levelType: 'proficiency' 
    });
    setErrors({});
    setTouched({});
  };

  const saveLanguage = () => {
    setTouched({
      baseLanguage: true,
      proficiency: true,
      capability: true,
      levelType: true
    });

    if (!validateForm()) {
      return;
    }

    // Create the language item based on level type
    let languageItem: LanguageItem;
    
    if (tempLang.levelType === 'proficiency') {
      // For proficiency: store as "Language - Proficiency"
      languageItem = {
        language: `${tempLang.baseLanguage} - ${tempLang.proficiency}`
        // No capability field
      };
    } else {
      // For capability: store as just the language name with capability field
      languageItem = {
        language: tempLang.baseLanguage,
        capability: tempLang.capability
      };
    }

    // Check for duplicate language
    const isDuplicate = languages.some((lang, index) => {
      if (tempLang.levelType === 'proficiency') {
        // For proficiency: check if same language and proficiency exists
        const existingBaseLang = lang.language.includes(' - ') 
          ? lang.language.split(' - ')[0] 
          : lang.language;
        const existingProficiency = lang.language.includes(' - ') 
          ? lang.language.split(' - ')[1] 
          : '';
        
        return existingBaseLang.toLowerCase() === tempLang.baseLanguage.toLowerCase() &&
               existingProficiency === tempLang.proficiency &&
               index !== editingIndex;
      } else {
        // For capability: check if same language with capability exists
        return lang.language.toLowerCase() === tempLang.baseLanguage.toLowerCase() &&
               lang.capability === tempLang.capability &&
               index !== editingIndex;
      }
    });

    if (isDuplicate) {
      toast.error('This language with the same level has already been added', {
        style: toastStyle.error,
        duration: 3000,
      });
      return;
    }

    let newLanguages;
    if (editingIndex !== null) {
      newLanguages = [...languages];
      newLanguages[editingIndex] = languageItem;
      toast.success('Language updated successfully!', {
        style: toastStyle.success,
        duration: 2000,
      });
    } else {
      newLanguages = [...languages, languageItem];
      toast.success('Language added successfully!', {
        style: toastStyle.success,
        duration: 2000,
      });
    }

    onChange({ ...data, languages: newLanguages });
    
    setEditingIndex(null);
    setTempLang({ 
      baseLanguage: "", 
      proficiency: "", 
      capability: "",
      levelType: 'proficiency' 
    });
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
    
    // Check if it's proficiency type (has dash in language)
    if (lang.language.includes(' - ')) {
      const parts = lang.language.split(' - ');
      const baseLanguage = parts[0];
      const proficiency = parts[1];
      
      setTempLang({ 
        baseLanguage,
        proficiency,
        capability: "",
        levelType: 'proficiency'
      });
    } else {
      // Capability type
      setTempLang({ 
        baseLanguage: lang.language,
        proficiency: "",
        capability: lang.capability || "",
        levelType: 'capability'
      });
    }
    
    setEditingIndex(index);
    setIsEditing(true);
    setErrors({});
    setTouched({});
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

  const handleLevelTypeChange = (levelType: 'proficiency' | 'capability') => {
    setTempLang((prev) => ({ 
      ...prev, 
      levelType,
      // Clear the other field when switching
      proficiency: levelType === 'proficiency' ? prev.proficiency : undefined,
      capability: levelType === 'capability' ? prev.capability : undefined
    }));
    // Clear errors for both fields
    setErrors((prev) => ({ 
      ...prev, 
      proficiency: undefined,
      capability: undefined 
    }));
  };

  const handleLanguageSelect = (language: string) => {
    updateField("baseLanguage", language);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    if (field === "baseLanguage" && !tempLang.baseLanguage?.trim()) {
      setErrors((prev) => ({ ...prev, baseLanguage: "Language is required" }));
    }
    if (field === "proficiency" && tempLang.levelType === 'proficiency' && !tempLang.proficiency) {
      setErrors((prev) => ({ ...prev, proficiency: "Proficiency is required" }));
    }
    if (field === "capability" && tempLang.levelType === 'capability' && !tempLang.capability) {
      setErrors((prev) => ({ ...prev, capability: "Capability is required" }));
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
    if (onNavigateToSection) {
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
          Add each language and choose either proficiency level OR capability
        </p>
      </div>

      {/* Editor Section */}
      {isEditing && (
        <div className="mb-8 bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border p-6">
          <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4">
            {editingIndex !== null ? 'Edit Language' : 'Add New Language'}
          </h3>
          
          <div className="space-y-4">
            <LanguageInputWithAutocomplete
              label="Language"
              placeholder="Start typing to search for a language..."
              value={tempLang.baseLanguage}
              onChange={(e) => updateField("baseLanguage", e.target.value)}
              onSelect={handleLanguageSelect}
              onBlur={() => handleBlur("baseLanguage")}
              required
              icon={<Globe className="w-4 h-4" />}
              error={touched.baseLanguage ? errors.baseLanguage : ""}
              suggestions={ALL_LANGUAGES}
            />

            {/* Level Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                Choose how to describe your language level <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <LevelTypeRadio
                  value="proficiency"
                  selected={tempLang.levelType}
                  onChange={handleLevelTypeChange}
                  label="Proficiency Level"
                  description="Native, Professional, Working, etc."
                />
                <LevelTypeRadio
                  value="capability"
                  selected={tempLang.levelType}
                  onChange={handleLevelTypeChange}
                  label="Capability"
                  description="Speak, Read & Write, etc."
                />
              </div>
            </div>

            {/* Conditional Select based on level type */}
            {tempLang.levelType === 'proficiency' ? (
              <StyledSelect
                label="Proficiency Level"
                value={tempLang.proficiency}
                onChange={(e) => updateField("proficiency", e.target.value)}
                onBlur={() => handleBlur("proficiency")}
                options={PROFICIENCY_OPTIONS}
                required
                error={touched.proficiency ? errors.proficiency : ""}
                placeholder="Select proficiency level"
              />
            ) : (
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
            )}
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
            onClick={startAdding}
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