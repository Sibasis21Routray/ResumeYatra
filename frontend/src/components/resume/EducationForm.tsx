import React, { useState, useEffect, useRef } from "react";
import { RichTextEditor } from "../editor/RichTextEditor";
// import { MonthYearPicker } from "../resume/MonthYearPicker";
import { useResumeStore } from "../../stores";
import { Edit, Trash, ChevronDown, ChevronUp, GraduationCap, MapPin, BookOpen, Award, Calendar, AlertCircle, X } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface EducationFormProps {
  onNext: () => void;
  onBack: () => void;
  onOpenAIModal?: (
    index?: number,
    itemData?: any,
    onApplyAI?: (aiContent: string) => void
  ) => void;
}

const QUALIFICATION_OPTIONS = [
  "GCSEs",
  "A-Levels",
  "Scottish Qualifications Certificate",
  "NVQ Level 1",
  "NVQ Level 2",
  "SVQ Level 1",
  "SVQ Level 2",
  "NVQ Level 3",
  "SVQ Level 3",
  "Certificate of Higher Education",
  "Diploma of Higher Education",
  "Higher National Diploma",
  "Foundation Degree in Arts",
  "Foundation Degree in Science",
  "NVQ Level 4",
  "SVQ Level 4",
  "Bachelor of Arts",
  "Bachelor of Science",
  "Bachelor of Business Administration",
  "Master of Arts",
  "Master of Science",
  "Master of Business Administration",
  "NVQ Level 5",
  "SVQ Level 5",
  "Doctor of Philosophy",
  "Doctor of Medicine",
  "Juris Doctor",
];

// CGPA options for dropdown
const CGPA_OPTIONS = [
  "10.0", "9.9", "9.8", "9.7", "9.6", "9.5", "9.4", "9.3", "9.2", "9.1", "9.0",
  "8.9", "8.8", "8.7", "8.6", "8.5", "8.4", "8.3", "8.2", "8.1", "8.0",
  "7.9", "7.8", "7.7", "7.6", "7.5", "7.4", "7.3", "7.2", "7.1", "7.0",
  "6.9", "6.8", "6.7", "6.6", "6.5", "6.4", "6.3", "6.2", "6.1", "6.0",
  "5.9", "5.8", "5.7", "5.6", "5.5", "5.4", "5.3", "5.2", "5.1", "5.0",
  "4.9", "4.8", "4.7", "4.6", "4.5", "4.4", "4.3", "4.2", "4.1", "4.0",
  "3.9", "3.8", "3.7", "3.6", "3.5", "3.4", "3.3", "3.2", "3.1", "3.0",
  "2.9", "2.8", "2.7", "2.6", "2.5", "2.4", "2.3", "2.2", "2.1", "2.0",
  "1.9", "1.8", "1.7", "1.6", "1.5", "1.4", "1.3", "1.2", "1.1", "1.0",
];

// Percentage/Grade options
const GRADE_OPTIONS = [
  "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F",
  "First Class", "Upper Second Class", "Lower Second Class", "Third Class",
  "Pass", "Merit", "Distinction"
];

// Styled Input Component
const StyledInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  maxLength,
  className = "",
  onBlur,
  icon,
  error,
  helperText,
}: {
  label: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
  onBlur?: () => void;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  let baseInputClass = `w-full ${icon ? 'pl-10' : 'pl-3'} pr-4 py-2.5 bg-bg-primary dark:bg-dark-bg-primary border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-text-primary dark:text-dark-text-primary placeholder-text-muted dark:placeholder-dark-text-muted shadow-sm hover:shadow-md text-sm sm:text-base`;

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
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onFocus={() => setIsFocused(true)}
          className={`${baseInputClass} ${className}`}
        />
      </div>
      {helperText && !error && (
        <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
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

// Dropdown Component with Search - FIXED Z-INDEX
const DropdownWithSearch = ({
  label,
  value,
  onChange,
  options,
  required = false,
  icon,
  error,
  helperText,
  placeholder = "Search or enter value",
  onOpenChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
  placeholder?: string;
  onOpenChange?: (isOpen: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(value);
  }, [value]);

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

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setSearch(option);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={dropdownRef} style={{ zIndex: isOpen ? 50 : 'auto' }}>
      <label className="block text-xs sm:text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted z-10">
            {icon}
          </div>
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-10 py-2.5 bg-bg-primary dark:bg-dark-bg-primary border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-text-primary dark:text-dark-text-primary ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-light-border dark:border-dark-border focus:ring-accent focus:border-accent'
          }`}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted hover:text-accent transition-colors"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div 
          className="absolute z-[100] w-full mt-1 bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl shadow-lg max-h-60 overflow-y-auto"
          style={{ 
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
          }}
        >
          {search && !options.some(opt => opt.toLowerCase() === search.toLowerCase()) && (
            <div
              onClick={() => handleSelect(search)}
              className="px-4 py-2 hover:bg-accent/10 dark:hover:bg-dark-accent/10 cursor-pointer text-accent dark:text-dark-accent font-medium border-b border-light-border dark:border-dark-border"
            >
              Use "{search}"
            </div>
          )}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 hover:bg-accent/10 dark:hover:bg-dark-accent/10 cursor-pointer text-text-primary dark:text-dark-text-primary"
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-text-muted dark:text-dark-text-muted">
              No options found
            </div>
          )}
        </div>
      )}

      {helperText && !error && (
        <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">{helperText}</p>
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

// MonthYearPicker Component - UPDATED TO YEAR ONLY WITH AUTO-CLOSE
const MonthYearPicker = ({ 
  value, 
  onChange, 
  className = "",
  placeholder = "Select year",
  onOpenChange
}: { 
  value: string; 
  onChange: (value: string) => void; 
  className?: string;
  placeholder?: string;
  onOpenChange?: (isOpen: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 71 }, (_, i) => currentYear - 50 + i);

  useEffect(() => {
    if (value) {
      // Handle both MM/YYYY and YYYY formats
      if (value.includes('/')) {
        const [, year] = value.split('/');
        setSelectedYear(parseInt(year));
      } else {
        setSelectedYear(parseInt(value));
      }
    }
  }, [value]);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (year: number) => {
    setSelectedYear(year);
    // Store as YYYY format and close immediately
    onChange(year.toString());
    setIsOpen(false);
  };

  const formatDisplayDate = () => {
    if (selectedYear) {
      return selectedYear.toString();
    }
    return '';
  };

  const handleClear = () => {
    setSelectedYear(null);
    onChange('');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef} style={{ zIndex: isOpen ? 40 : 'auto' }}>
      <div className="relative">
        <input
          type="text"
          value={formatDisplayDate()}
          placeholder={placeholder}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className="w-full pl-10 pr-4 py-2.5 bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 text-text-primary dark:text-dark-text-primary placeholder-text-muted cursor-pointer"
        />
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
        {selectedYear && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
            title="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div 
          className="absolute z-[90] mt-1 w-64 bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl shadow-xl p-4"
          style={{ 
            position: 'absolute',
            top: '100%',
            left: 0,
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-muted dark:text-dark-text-muted mb-2">
                Select Year
              </label>
              <div className="max-h-60 overflow-y-auto grid grid-cols-3 gap-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleSelect(year)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedYear === year
                        ? 'bg-accent text-white'
                        : 'hover:bg-accent/10 text-text-primary dark:text-dark-text-primary'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Section Card Component - FIXED OVERFLOW
const SectionCard = ({ title, description, children, icon, required, isDropdownOpen }: {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  required?: boolean;
  isDropdownOpen?: boolean;
}) => (
  <div className={`bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border shadow-sm ${
    isDropdownOpen ? '' : 'overflow-hidden'
  }`}>
    <div className="px-4 sm:px-6 py-4 border-b border-light-border dark:border-dark-border bg-gradient-to-r from-bg-secondary/30 to-transparent">
      <div className="flex items-center gap-3">
        {icon && <div className="text-accent dark:text-dark-accent">{icon}</div>}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-text-primary dark:text-dark-text-primary flex items-center gap-2">
            {title}
            {required && (
              <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                Required
              </span>
            )}
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
const InfoBadge = ({ text, type }: { text: string; type: 'required' | 'optional' }) => {
  const styles = {
    required: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    optional: 'bg-gray-100 dark:bg-gray-800 text-text-muted dark:text-dark-text-muted'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
      {text}
    </span>
  );
};

export const EducationForm: React.FC<EducationFormProps> = ({
  onNext,
  onBack,
  onOpenAIModal,
}) => {
  const { data, updateData } = useResumeStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempEducation, setTempEducation] = useState<any>({});
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [gradeType, setGradeType] = useState<'cgpa' | 'percentage' | 'grade'>('cgpa');
  
  // Dropdown open states for z-index management
  const [isDegreeDropdownOpen, setIsDegreeDropdownOpen] = useState(false);
  const [isCgpaDropdownOpen, setIsCgpaDropdownOpen] = useState(false);
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const [formErrors, setFormErrors] = useState<{
    degree?: string;
  }>({});

  const isSummaryView =
    data.education && data.education.length > 0 && !isEditing;

  // Current education being edited
  const currentEducation = tempEducation;

  // Check if any dropdown is open
  const isAnyDropdownOpen = isDegreeDropdownOpen || isCgpaDropdownOpen || isGradeDropdownOpen || isStartDateOpen || isEndDateOpen;

  const onGenerateAI = React.useCallback(
    async (currentContent: string): Promise<string[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const enhanced1 = currentContent
            ? currentContent
              .replace(/<li>/g, "<li>✨ ")
              .replace(/<\/li>/g, " with honors</li>")
            : "<ul><li>✨ Completed coursework in relevant subjects</li><li>✨ Achieved academic excellence</li></ul>";
          const enhanced2 = currentContent
            ? currentContent.replace(
              /<ul>/,
              "<ul><li>💎 Additional achievement: Dean's List</li>"
            )
            : "<ul><li>💎 Dean's List recognition</li></ul>";
          resolve([enhanced1, enhanced2]);
        }, 1000);
      });
    },
    []
  );

  const handleApplyAI = React.useCallback((aiContent: string) => {
    updateField("description", aiContent);
  }, []);

  // Initial setup
  useEffect(() => {
    if (!data.education || data.education.length === 0) {
      setIsEditing(true);
      setTempEducation({ id: `edu-${Date.now()}` });
    }
  }, [data.education]);

  const validateData = () => {
    const errors: typeof formErrors = {};

    const degree = currentEducation.degree || "";
    if (!degree.trim()) {
      errors.degree = "Degree is required";
    }

    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error('Please fill in all required fields', {
        style: toastStyle.error,
        duration: 3000,
      });
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    const isValid = validateData();
    if (!isValid) {
      return;
    }

    updateData((draft) => {
      if (!draft.education) draft.education = [];
      if (editingId) {
        const index = draft.education.findIndex((e) => e.id === editingId);
        if (index !== -1) {
          draft.education[index] = tempEducation;
        }
      } else {
        draft.education.push(tempEducation);
      }
    });

    toast.success('Education saved successfully!', {
      style: toastStyle.success,
      duration: 3000,
    });

    setIsEditing(false);
    setEditingId(null);
    setTempEducation({});
  };

  const handleEdit = (id: string) => {
    const edu = data.education?.find((e) => e.id === id);
    if (edu) {
      setEditingId(id);
      setTempEducation({ ...edu });
      setIsEditing(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this education entry?")) {
      updateData((draft) => {
        if (draft.education) {
          draft.education = draft.education.filter((e) => e.id !== id);
        }
      });
      
      toast.success('Education entry deleted', {
        style: toastStyle.success,
        duration: 2000,
      });

      if (data.education && data.education.length <= 1) {
        setIsEditing(true);
        setTempEducation({ id: `edu-${Date.now()}` });
      }
    }
  };

  const handleAddMore = () => {
    setEditingId(null);
    setTempEducation({ id: `edu-${Date.now()}` });
    setIsEditing(true);
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

  const updateField = (field: string, value: any) => {
    setTempEducation((prev: any) => ({ ...prev, [field]: value }));
    if (field === 'degree' && formErrors.degree) {
      setFormErrors(prev => ({ ...prev, degree: undefined }));
    }
  };

  const renderSummary = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          Education <span className="text-accent dark:text-dark-accent">Summary</span>
        </h2>
        <p className="text-sm text-text-muted dark:text-dark-text-muted">
          Review and manage your education entries.
        </p>
      </div>

      <div className="space-y-4">
        {data.education?.map((edu, index) => {
          const education = edu as any;
          return (
            <div key={edu.id} className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-accent dark:text-dark-accent" />
                    <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">
                      {education.degree}
                      {education.field && <span className="font-normal text-text-muted dark:text-dark-text-muted ml-1">in {education.field}</span>}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {education.school && (
                      <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                        <BookOpen className="w-4 h-4" />
                        <span>{education.school}</span>
                      </div>
                    )}
                    {education.location && (
                      <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                        <MapPin className="w-4 h-4" />
                        <span>{education.location}</span>
                      </div>
                    )}
                    {education.graduationDate && (
                      <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                        <Calendar className="w-4 h-4" />
                        <span>{education.graduationDate}</span>
                      </div>
                    )}
                    {education.cgpa && (
                      <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
                        <Award className="w-4 h-4" />
                        <span>CGPA: {education.cgpa}</span>
                      </div>
                    )}
                  </div>

                  {education.description && (
                    <div className="mt-3 p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                      <p className="text-sm text-text-primary dark:text-dark-text-primary whitespace-pre-line">
                        {getDescriptionPreview(education.description)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(edu.id)}
                    className="p-2 text-text-muted hover:text-accent dark:hover:text-dark-accent hover:bg-accent/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <button
          onClick={handleAddMore}
          className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span> Add more education
        </button>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          List your formal education <span className="text-accent dark:text-dark-accent">details</span>
        </h2>
        <p className="text-sm text-text-muted dark:text-dark-text-muted max-w-xl">
          Tell us about any colleges, vocational programs, or training courses you took. 
          Even if you didn't finish, it's important to list them.
        </p>
      </div>

      {/* Institution Details */}
      <SectionCard 
        title="Institution Information" 
        description="Where did you study?"
        icon={<GraduationCap className="w-5 h-5" />}
        isDropdownOpen={isAnyDropdownOpen}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StyledInput
            label="Institution Name"
            placeholder="e.g., Nalanda Institute of Technology"
            value={currentEducation.school || ""}
            onChange={(e) => updateField("school", e.target.value)}
            icon={<BookOpen className="w-4 h-4" />}
            // helperText="Optional"
          />

          <StyledInput
            label="Institution Location"
            placeholder="e.g., Bhubaneswar, India"
            value={currentEducation.location || ""}
            onChange={(e) => updateField("location", e.target.value)}
            icon={<MapPin className="w-4 h-4" />}
            // helperText="Optional"
          />
        </div>
      </SectionCard>

      {/* Degree Information */}
      <SectionCard 
        title="Degree Information" 
        description="What did you study?"
        icon={<Award className="w-5 h-5" />}
        required
        isDropdownOpen={isAnyDropdownOpen}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DropdownWithSearch
              label="Degree"
              value={currentEducation.degree || ""}
              onChange={(value) => updateField("degree", value)}
              options={QUALIFICATION_OPTIONS}
              required
              icon={<Award className="w-4 h-4" />}
              error={formErrors.degree}
              placeholder="Search or enter degree"
              onOpenChange={setIsDegreeDropdownOpen}
            />

            <StyledInput
              label="Field of Study"
              placeholder="e.g., Accounting and Finance"
              value={currentEducation.field || ""}
              onChange={(e) => updateField("field", e.target.value)}
              icon={<BookOpen className="w-4 h-4" />}
              // helperText="Optional"
            />
          </div>
        </div>
      </SectionCard>

      {/* Duration */}
      <SectionCard 
        title="Duration" 
        description="When did you study?"
        icon={<Calendar className="w-5 h-5" />}
        isDropdownOpen={isAnyDropdownOpen}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
              Start Date
            </label>
            <MonthYearPicker
              value={currentEducation.startDate || ""}
              onChange={(value) => updateField("startDate", value)}
              className="w-full"
              placeholder="Start Date"
              onOpenChange={setIsStartDateOpen}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
              End Date
            </label>
            <MonthYearPicker
              value={currentEducation.graduationDate || ""}
              onChange={(value) => updateField("graduationDate", value)}
              className="w-full"
              placeholder="End Date"
              onOpenChange={setIsEndDateOpen}
            />
          </div>
        </div>
      </SectionCard>

      {/* Grade/GPA */}
      <SectionCard 
        title="Grade / GPA" 
        description="Your academic performance (optional)"
        icon={<Award className="w-5 h-5" />}
        isDropdownOpen={isAnyDropdownOpen}
      >
        <div className="space-y-4">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setGradeType('cgpa')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                gradeType === 'cgpa'
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary dark:bg-dark-bg-secondary text-text-muted hover:text-accent'
              }`}
            >
              CGPA
            </button>
            <button
              onClick={() => setGradeType('percentage')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                gradeType === 'percentage'
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary dark:bg-dark-bg-secondary text-text-muted hover:text-accent'
              }`}
            >
              Percentage
            </button>
            <button
              onClick={() => setGradeType('grade')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                gradeType === 'grade'
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary dark:bg-dark-bg-secondary text-text-muted hover:text-accent'
              }`}
            >
              Grade
            </button>
          </div>

          {gradeType === 'cgpa' && (
            <DropdownWithSearch
              label="CGPA"
              value={currentEducation.cgpa || ""}
              onChange={(value) => updateField("cgpa", value)}
              options={CGPA_OPTIONS}
              icon={<Award className="w-4 h-4" />}
              placeholder="Select or enter CGPA"
              onOpenChange={setIsCgpaDropdownOpen}
            />
          )}

          {gradeType === 'percentage' && (
            <StyledInput
              label="Percentage"
              placeholder="e.g., 85%"
              value={currentEducation.percentage || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                updateField("percentage", value ? `${value}%` : '');
              }}
              icon={<Award className="w-4 h-4" />}
              helperText="Enter percentage (e.g., 85%)"
            />
          )}

          {gradeType === 'grade' && (
            <DropdownWithSearch
              label="Grade"
              value={currentEducation.grade || ""}
              onChange={(value) => updateField("grade", value)}
              options={GRADE_OPTIONS}
              icon={<Award className="w-4 h-4" />}
              placeholder="Select or enter grade"
              onOpenChange={setIsGradeDropdownOpen}
            />
          )}
        </div>
      </SectionCard>

      {/* Additional Academic Details - Collapsible */}
      <div className="border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        <button
          onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
          className="w-full px-6 py-4 bg-bg-primary dark:bg-dark-bg-primary flex items-center justify-between hover:bg-accent/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-accent dark:text-dark-accent" />
            <span className="font-semibold text-text-primary dark:text-dark-text-primary">
              Additional Academic Details
            </span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-text-muted dark:text-dark-text-muted px-2 py-0.5 rounded-full">
              Optional
            </span>
          </div>
          {showAdditionalDetails ? (
            <ChevronUp className="w-5 h-5 text-text-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-muted" />
          )}
        </button>

        {showAdditionalDetails && (
          <div className="p-6 border-t border-light-border dark:border-dark-border bg-bg-secondary/50">
            <RichTextEditor
              value={currentEducation.description || ""}
              onChange={(value) => updateField("description", value)}
              placeholder="Add key coursework, academic projects, or distinctions (optional)"
              sectionTitle="Education"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto px-4  ">
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
            Save & Continue →
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
};

export default EducationForm;