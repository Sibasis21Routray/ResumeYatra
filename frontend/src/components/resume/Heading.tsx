import React, { useRef, useState, useEffect } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useUIStore } from "../../stores";
import { useResumeStore } from "../../stores/resumeStore";
import { resumeAPI } from "../../services/apiClient";
import PhotoEditorModal from "../editor/PhotoEditorModal";
import { Edit2, Trash, Camera, User, Mail, Phone, MapPin, Globe, Calendar, Users, ChevronLeft, ChevronRight, AlertCircle, ChevronDown } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

// Custom Date Picker Component with improved navigation
const DatePicker = ({
  label,
  value,
  onChange,
  required = false,
  error,
}: {
  label: string;
  value: string;
  onChange: (date: string) => void;
  required?: boolean;
  error?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setViewMode('days');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrev = () => {
    if (viewMode === 'days') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    } else if (viewMode === 'months') {
      setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1));
    } else if (viewMode === 'years') {
      setCurrentMonth(new Date(currentMonth.getFullYear() - 12, currentMonth.getMonth(), 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'days') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    } else if (viewMode === 'months') {
      setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1));
    } else if (viewMode === 'years') {
      setCurrentMonth(new Date(currentMonth.getFullYear() + 12, currentMonth.getMonth(), 1));
    }
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = newDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
    onChange(formattedDate);
    setIsOpen(false);
    setViewMode('days');
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setViewMode('days');
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setViewMode('months');
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`h-8 w-8 rounded-full text-sm flex items-center justify-center transition-all
            ${isSelected 
              ? 'bg-accent dark:bg-dark-accent text-white' 
              : isToday
                ? 'border border-accent dark:border-dark-accent text-accent dark:text-dark-accent'
                : 'hover:bg-accent/10 dark:hover:bg-dark-accent/10 text-text-primary dark:text-dark-text-primary'
            }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const renderMonths = () => {
    return months.map((month, index) => {
      const isCurrentMonth = index === currentMonth.getMonth();
      return (
        <button
          key={month}
          onClick={() => handleMonthSelect(index)}
          className={`h-12 rounded-lg text-sm font-medium transition-all
            ${isCurrentMonth 
              ? 'bg-accent/10 text-accent dark:text-dark-accent border border-accent' 
              : 'hover:bg-accent/10 dark:hover:bg-dark-accent/10 text-text-primary dark:text-dark-text-primary'
            }`}
        >
          {month.slice(0, 3)}
        </button>
      );
    });
  };

  const renderYears = () => {
    const currentYear = currentMonth.getFullYear();
    const startYear = Math.floor(currentYear / 12) * 12;
    const years = [];

    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      const isCurrentYear = year === new Date().getFullYear();
      
      years.push(
        <button
          key={year}
          onClick={() => handleYearSelect(year)}
          className={`h-12 rounded-lg text-sm font-medium transition-all
            ${year === currentYear 
              ? 'bg-accent/10 text-accent dark:text-dark-accent border border-accent' 
              : isCurrentYear
                ? 'border border-accent/30 text-accent dark:text-dark-accent'
                : 'hover:bg-accent/10 dark:hover:bg-dark-accent/10 text-text-primary dark:text-dark-text-primary'
            }`}
        >
          {year}
        </button>
      );
    }

    return years;
  };

  const getHeaderText = () => {
    if (viewMode === 'days') {
      return `${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
    } else if (viewMode === 'months') {
      return `${currentMonth.getFullYear()}`;
    } else {
      const startYear = Math.floor(currentMonth.getFullYear() / 12) * 12;
      return `${startYear} - ${startYear + 11}`;
    }
  };

  return (
    <div className="w-full relative" ref={pickerRef}>
      <label className="block text-xs sm:text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5 sm:mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          value={formatDisplayDate(selectedDate)}
          placeholder="DD/MM/YYYY"
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full pl-10 pr-4 py-2 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer text-text-primary dark:text-dark-text-primary placeholder-text-muted ${
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-light-border dark:border-dark-border focus:ring-accent focus:border-accent'
          }`}
        />
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
      </div>

      {/* Calendar Dropdown - Fixed z-index */}
      {isOpen && (
        <div className="absolute z-[100] mt-2 w-72 bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl shadow-xl p-4">
          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-accent/10 dark:hover:bg-dark-accent/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-text-primary dark:text-dark-text-primary" />
            </button>
            
            <button
              onClick={() => {
                if (viewMode === 'days') setViewMode('months');
                else if (viewMode === 'months') setViewMode('years');
              }}
              className="px-3 py-1.5 text-sm font-semibold text-text-primary dark:text-dark-text-primary hover:bg-accent/10 dark:hover:bg-dark-accent/10 rounded-lg transition-colors"
            >
              {getHeaderText()}
              <ChevronDown className="w-3.5 h-3.5 inline-block ml-1 opacity-60" />
            </button>

            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-accent/10 dark:hover:bg-dark-accent/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-text-primary dark:text-dark-text-primary" />
            </button>
          </div>

          {/* Calendar Grid */}
          {viewMode === 'days' && (
            <>
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="h-8 w-8 flex items-center justify-center text-xs font-medium text-text-muted dark:text-dark-text-muted">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {renderDays()}
              </div>
            </>
          )}

          {viewMode === 'months' && (
            <div className="grid grid-cols-3 gap-2">
              {renderMonths()}
            </div>
          )}

          {viewMode === 'years' && (
            <div className="grid grid-cols-3 gap-2">
              {renderYears()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-4 pt-3 border-t border-light-border dark:border-dark-border">
            <button
              onClick={() => {
                setSelectedDate(null);
                onChange('');
                setIsOpen(false);
                setViewMode('days');
              }}
              className="text-xs text-text-muted dark:text-dark-text-muted hover:text-accent dark:hover:text-dark-accent transition-colors px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setViewMode('days');
              }}
              className="text-xs bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white px-3 py-1 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
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

// Styled input component with icons
const StyledInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  maxLength,
  fieldPath,
  className = "",
  onBlur,
  validationIcon = false,
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
  fieldPath?: string;
  className?: string;
  onBlur?: () => void;
  validationIcon?: boolean;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
}) => {
  const { getFieldValidationState } = useFormValidation();
  const [isFocused, setIsFocused] = useState(false);

  let baseInputClass = `w-full ${icon ? 'pl-10' : 'pl-3'} pr-10 py-2 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-text-primary dark:text-dark-text-primary placeholder-text-muted dark:placeholder-dark-text-muted shadow-sm hover:shadow-md text-sm sm:text-base`;
  
  const validationState = fieldPath ? getFieldValidationState(fieldPath) : null;

  if (error || validationState === "error") {
    baseInputClass += " border-red-500 focus:ring-red-500 focus:border-red-500";
  } else if (validationState === "success") {
    baseInputClass += " border-emerald-500 focus:ring-emerald-500 focus:border-emerald-500";
  } else if (isFocused) {
    baseInputClass += " border-accent dark:border-dark-accent ring-2 ring-accent/20";
  } else {
    baseInputClass += " border-light-border dark:border-dark-border";
  }

  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5 sm:mb-2">
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
        {maxLength && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted dark:text-dark-text-muted">
            {value?.length || 0}/{maxLength}
          </div>
        )}
      </div>
      {helperText && !error && (
        <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
          {helperText}
        </p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

// Styled select component
const StyledSelect = ({
  label,
  value,
  onChange,
  options,
  required = false,
  className = "",
  icon,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
  icon?: React.ReactNode;
  helperText?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseSelectClass = `w-full ${icon ? 'pl-10' : 'pl-3'} pr-10 py-2 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-text-primary dark:text-dark-text-primary appearance-none cursor-pointer text-sm sm:text-base ${
    isFocused 
      ? 'border-accent dark:border-dark-accent ring-2 ring-accent/20' 
      : 'border-light-border dark:border-dark-border'
  }`;

  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5 sm:mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted pointer-events-none z-10">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${baseSelectClass} ${className}`}
        >
          <option value="">Select</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted dark:text-dark-text-muted">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {helperText && (
        <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">{helperText}</p>
      )}
    </div>
  );
};

interface PersonalInfoFormProps {
  data: {
    personal: {
      name?: string;
      email?: string;
      phone?: string;
      alternatePhone?: string;
      location?: string;
      pinCode?: string;
      country?: string;
      dob?: string;
      maritalStatus?: string;
      gender?: string;
      fathersName?: string;
      nationality?: string;
      fullAddress?: string;
      image?: string;
      middleName?: string;
    };
  };
  onChange: (data: any) => void;
  resumeId: string;
  onNext?: () => void;
  onBack?: () => void;
}

export function Heading({
  data,
  onChange,
  resumeId,
  onNext,
  onBack,
}: PersonalInfoFormProps) {
  const { updateData } = useResumeStore();
  const { markSectionCompleted } = useUIStore();
  const {
    validateField,
    markFieldAsTouched,
  } = useFormValidation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<{
    firstName?: string;
    phone?: string;
    email?: string;
  }>({});
  const [personal, setPersonal] = useState(
    data.personal || {
      fathersName: undefined,
      nationality: undefined,
    }
  );

  const validateData = () => {
    const errors: typeof formErrors = {};

    // Validate First Name
    const fullName = personal.name || "";
    const firstName = fullName.split(" ")[0] || "";
    if (!firstName.trim()) {
      errors.firstName = "First Name is required";
    } else if (firstName.length < 2) {
      errors.firstName = "First Name must be at least 2 characters";
    }

    // Validate Phone
    const phone = personal.phone || "";
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    // Validate Email
    const email = personal.email || "";
    if (!email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the errors before continuing', {
        style: toastStyle.error,
        duration: 4000,
      });
    }

    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    const isValid = validateData();
    if (!isValid) {
      const firstError = Object.keys(formErrors).find(key => formErrors[key as keyof typeof formErrors]);
      if (firstError) {
        const element = document.getElementById(`error-${firstError}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    
    updateData((draft) => {
      draft.personal = personal;
    });
    markSectionCompleted("personal");
    toast.success('Personal information saved successfully!', {
      style: toastStyle.success,
      duration: 3000,
    });
    onNext?.();
  };

  const handleFieldChange = (fieldPath: string, value: any) => {
    setPersonal((prev) => ({ ...prev, [fieldPath]: value }));
    const fieldKey = fieldPath.replace("personal.", "") as keyof typeof formErrors;
    if (formErrors[fieldKey]) {
      setFormErrors(prev => ({ ...prev, [fieldKey]: undefined }));
    }
  };

  const handleFieldBlur = (fieldPath: string) => {
    markFieldAsTouched(fieldPath);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)', {
        style: toastStyle.error,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB', {
        style: toastStyle.error,
      });
      return;
    }

    setSelectedImage(file);
    setShowPhotoEditor(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUploadSuccess = (imageUrl: string) => {
    setPersonal((prev) => ({ ...prev, image: imageUrl }));
    updateData((draft) => {
      if (!draft.personal) draft.personal = {};
      draft.personal.image = imageUrl;
    });
    toast.success('Profile photo updated successfully!', {
      style: toastStyle.success,
    });
  };

  const handleRemoveImage = () => {
    if (window.confirm("Are you sure you want to remove the profile photo?")) {
      setPersonal((prev) => ({ ...prev, image: undefined }));
      toast.success('Profile photo removed', {
        style: toastStyle.success,
      });
    }
  };

  const handleEditImage = async () => {
    if (!personal.image) return;

    try {
      const response = await fetch(personal.image);
      const blob = await response.blob();
      const file = new File([blob], "current-image.jpg", { type: blob.type });
      setSelectedImage(file);
      setShowPhotoEditor(true);
    } catch (error) {
      toast.error('Failed to load image for editing', {
        style: toastStyle.error,
      });
    }
  };

  const getInitials = () => {
    const name = personal.name || "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Image section class
  const imageSectionClass = `w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-dashed border-light-border dark:border-dark-border overflow-hidden flex items-center justify-center relative rounded-xl cursor-pointer group shadow-md hover:shadow-lg transition-all duration-300 ${
    personal.image ? 'border-solid border-accent' : ''
  }`;

  return (
    <div className="w-full min-h-screen pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-bg-primary/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                Personal Information
              </h2>
              <p className="text-sm text-text-muted dark:text-dark-text-muted mt-1">
                You control what appears on your resume
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Single Card with Photo and Form */}
        <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl  shadow-sm">
          <div className="p-4 sm:p-6">
            {/* Profile Photo Section */}
<div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">

  {/* Avatar */}
  <div
    className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center"
    onMouseEnter={() => setIsImageHovered(true)}
    onMouseLeave={() => setIsImageHovered(false)}
  >
    {personal.image ? (
      <>
        <img
          src={personal.image}
          alt="Profile"
          className="w-full h-full object-cover"
        />

        {/* Hover overlay */}
        {isImageHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3">
            <button
              onClick={handleEditImage}
              className="p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition"
              title="Edit photo"
            >
              <Edit2 className="w-4 h-4 text-gray-800" />
            </button>

            <button
              onClick={handleRemoveImage}
              className="p-2 bg-red-500 rounded-lg shadow hover:bg-red-600 transition"
              title="Remove photo"
            >
              <Trash className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </>
    ) : (
      <div className="flex items-center justify-center text-gray-400 dark:text-gray-500">
        <Camera className="w-10 h-10" />
      </div>
    )}
  </div>

  {/* Upload Controls */}
  <div className="flex flex-col gap-2">

    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={handleFileUpload}
      className="hidden"
    />

    <button
      onClick={triggerFileUpload}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover rounded-lg transition shadow-sm"
    >
      <Camera className="w-4 h-4" />
      {personal.image ? "Change Photo" : "Upload Photo"}
    </button>

    <span className="text-xs text-gray-500 dark:text-gray-400">
      JPG, PNG, WebP • Max size 5MB
    </span>

  </div>

</div>

            {/* Form Fields - Compact Grid with Clean Placeholders */}
            <div className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <StyledInput
                  label="First Name"
                  placeholder="John"
                  value={(() => {
                    if (!personal.name) return "";
                    return personal.name.split(" ")[0] || "";
                  })()}
                  onChange={(e) => {
                    const parts = personal.name?.split(" ") || [];
                    const middle = personal.middleName || "";
                    const last = parts.slice(2).join(" ");
                    handleFieldChange("name", `${e.target.value} ${middle} ${last}`.trim());
                  }}
                  onBlur={() => handleFieldBlur("personal.name")}
                  required
                  icon={<User className="w-4 h-4" />}
                  error={formErrors.firstName}
                />

                <StyledInput
                  label="Middle Name"
                  placeholder="Michael"
                  value={personal.middleName || ""}
                  onChange={(e) => {
                    const first = personal.name?.split(" ")[0] || "";
                    const last = personal.name?.split(" ").slice(2).join(" ") || "";
                    handleFieldChange("middleName", e.target.value);
                    handleFieldChange("name", `${first} ${e.target.value} ${last}`.trim());
                  }}
                  icon={<User className="w-4 h-4" />}
                />

                <StyledInput
                  label="Last Name"
                  placeholder="Doe"
                  value={personal.name?.split(" ").slice(2).join(" ") || ""}
                  onChange={(e) => {
                    const first = personal.name?.split(" ")[0] || "";
                    const middle = personal.middleName || "";
                    handleFieldChange("name", `${first} ${middle} ${e.target.value}`.trim());
                  }}
                  icon={<User className="w-4 h-4" />}
                />
              </div>

              {/* Contact Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <StyledInput
                  label="Phone"
                  placeholder="9876543210"
                  value={personal.phone || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    handleFieldChange("phone", value);
                  }}
                  onBlur={() => handleFieldBlur("personal.phone")}
                  type="tel"
                  maxLength={10}
                  required
                  icon={<Phone className="w-4 h-4" />}
                  error={formErrors.phone}
                />

                <StyledInput
                  label="Alternate Phone"
                  placeholder="9876543211"
                  value={personal.alternatePhone || ""}
                  onChange={(e) => handleFieldChange("alternatePhone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  type="tel"
                  maxLength={10}
                  icon={<Phone className="w-4 h-4" />}
                />

                <StyledInput
                  label="Email"
                  placeholder="john.doe@example.com"
                  value={personal.email || ""}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleFieldBlur("personal.email")}
                  type="email"
                  required
                  icon={<Mail className="w-4 h-4" />}
                  error={formErrors.email}
                />
              </div>

              {/* Demographics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <StyledSelect
                  label="Gender"
                  value={personal.gender || ""}
                  onChange={(e) => handleFieldChange("gender", e.target.value)}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                    { value: "Prefer not to say", label: "Prefer not to say" },
                  ]}
                  icon={<Users className="w-4 h-4" />}
                />

                <StyledSelect
                  label="Marital Status"
                  value={personal.maritalStatus || ""}
                  onChange={(e) => handleFieldChange("maritalStatus", e.target.value)}
                  options={[
                    { value: "Single", label: "Single" },
                    { value: "Married", label: "Married" },
                    { value: "Divorced", label: "Divorced" },
                    { value: "Widowed", label: "Widowed" },
                  ]}
                  icon={<Users className="w-4 h-4" />}
                />

                <DatePicker
                  label="Date of Birth"
                  value={personal.dob || ""}
                  onChange={(date) => handleFieldChange("dob", date)}
                />
              </div>

              {/* Address Row */}
              <div className="space-y-3">
                <StyledInput
                  label="Address / Locality"
                  placeholder="123 Main Street, Downtown"
                  value={personal.fullAddress || ""}
                  onChange={(e) => handleFieldChange("fullAddress", e.target.value)}
                  icon={<MapPin className="w-4 h-4" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <StyledInput
                    label="City"
                    placeholder="Mumbai"
                    value={personal.location || ""}
                    onChange={(e) => handleFieldChange("location", e.target.value)}
                    icon={<MapPin className="w-4 h-4" />}
                  />

                  <StyledInput
                    label="Pin Code"
                    placeholder="400001"
                    value={personal.pinCode || ""}
                    onChange={(e) => handleFieldChange("pinCode", e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    icon={<MapPin className="w-4 h-4" />}
                  />

                  <StyledInput
                    label="Country"
                    placeholder="India"
                    value={personal.country || ""}
                    onChange={(e) => handleFieldChange("country", e.target.value)}
                    icon={<Globe className="w-4 h-4" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-light-border dark:border-dark-border">
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:bg-accent/10 hover:border-accent transition-all duration-200 text-sm"
          >
            ← Back
          </button>

          <button
            onClick={handleContinue}
            className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
          >
            Save & Continue →
          </button>
        </div>
      </div>

      {/* Photo Editor Modal */}
      <PhotoEditorModal
        isOpen={showPhotoEditor}
        onClose={() => {
          setShowPhotoEditor(false);
          setSelectedImage(null);
        }}
        selectedImage={selectedImage}
        resumeId={resumeId}
        onImageUpload={handleImageUploadSuccess}
      />
    </div>
  );
}