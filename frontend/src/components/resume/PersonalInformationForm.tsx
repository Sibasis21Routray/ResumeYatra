import React, { useState } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useUIStore } from "../../stores";
import { useResumeStore } from "../../stores/resumeStore";

// Styled input component
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
}) => {
  const { getFieldValidationState } = useFormValidation();

  let baseInputClass =
    "w-full pl-2 sm:pl-3 pr-6 sm:pr-8 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md hover:border-slate-400 dark:hover:border-gray-500 text-sm sm:text-base";
  const validationState = fieldPath ? getFieldValidationState(fieldPath) : null;

  if (validationState === "error") {
    baseInputClass += " border-red-500 focus:ring-red-500 focus:border-red-500";
  } else if (validationState === "success") {
    baseInputClass +=
      " border-emerald-500 focus:ring-emerald-500 focus:border-emerald-500";
  } else {
    baseInputClass += " focus:ring-[#04477E] focus:border-[#04477E]";
  }

  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-gray-200 mb-1.5 sm:mb-2">
        {label}
      </label>
      <div className="relative w-full">
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          onBlur={onBlur}
          className={`${baseInputClass} ${className}`}
        />
        {validationIcon && validationState === "success" && (
          <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-emerald-500 rounded-full p-0.5 sm:p-1 pointer-events-none">
            <svg
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
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
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
}) => {
  const baseSelectClass =
    "w-full pl-2 sm:pl-3 pr-6 sm:pr-8 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md hover:border-slate-400 dark:hover:border-gray-500 appearance-none cursor-pointer text-sm sm:text-base";

  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-gray-200 mb-1 sm:mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative w-full">
        <select
          value={value}
          onChange={onChange}
          className={`${baseSelectClass} ${className}`}
        >
          <option value="">Select</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface PersonalInformationFormProps {
  data: {
    personal: {
      fathersName?: string;
      nationality?: string;
      dob?: string;
      gender?: string;
      maritalStatus?: string;
      personalInfoDisplay?: "inline" | "separate";
    };
  };
  onChange: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

// Toggle Switch Component
const ToggleSwitch = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-3 px-4 bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700">
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-slate-800 dark:text-white">
        {label}
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {description}
      </span>
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#04477E] focus:ring-offset-2 ${checked
        ? "bg-[#04477E] dark:bg-[#04477E]"
        : "bg-slate-300 dark:bg-gray-600"
        }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`${checked ? "translate-x-6" : "translate-x-1"
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200`}
      />
    </button>
  </div>
);

export default function PersonalInformationForm({
  data,
  onChange,
  onNext,
  onBack,
}: PersonalInformationFormProps) {
  const { updateData } = useResumeStore();
  const { markSectionCompleted } = useUIStore();
  const {
    validateField,
    getFieldError,
    getFieldValidationState,
    markFieldAsTouched,
  } = useFormValidation();

  const [personal, setPersonal] = useState(data.personal || {});
  const [personalInfoDisplay, setPersonalInfoDisplay] = useState<
    "inline" | "separate"
  >(data.personal?.personalInfoDisplay || "inline");

  const validateData = () => {
    // No mandatory fields - all fields are optional
    const errors: string[] = [];
    return errors;
  };

  const handleContinue = () => {
    const errors = validateData();
    if (errors.length > 0) {
      alert(`Please fix the following errors:\n${errors.join("\n")}`);
      return;
    }
    updateData((draft) => {
      draft.personal = {
        ...personal,
        personalInfoDisplay,
      };
    });
    markSectionCompleted("personalInformation");
    onNext?.();
  };

  const handleFieldChange = (fieldPath: string, value: any) => {
    setPersonal((prev) => ({ ...prev, [fieldPath]: value }));
  };

  const handleFieldBlur = (fieldPath: string) => {
    markFieldAsTouched(fieldPath);
  };

  const ValidationIcon = ({ fieldPath }: { fieldPath: string }) => {
    const state = getFieldValidationState(fieldPath);
    if (state === "success") {
      return (
        <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-green-500 rounded-full p-0.5 pointer-events-none">
          <svg
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900">
      <div className="w-full mb-8 sm:mb-12 lg:mb-16 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="w-full mb-6 sm:mb-8 lg:mb-10 px-3 sm:px-6">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-2 sm:mb-3 w-full">
            Personal <span className="text-accent">Information</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 w-full">
            Provide your personal details for a complete profile
          </p>
        </div>

        {/* Toggle for Display Mode */}
        <div className="w-full px-3 sm:px-6 mb-6">
          <ToggleSwitch
            label="Show in Header"
            description="Show personal info inline with contact details"
            checked={personalInfoDisplay === "inline"}
            onChange={(value) =>
              setPersonalInfoDisplay(value ? "inline" : "separate")
            }
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 items-start w-full px-3 sm:px-6">
          {/* ROW 1: Father's Name and Nationality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 w-full">
            <StyledInput
              label="Father's Name"
              placeholder="Enter your father's name"
              value={personal.fathersName || ""}
              onChange={(e) => handleFieldChange("fathersName", e.target.value)}
              required
              fieldPath="personal.fathersName"
              validationIcon
            />

            <StyledInput
              label="Nationality"
              placeholder="e.g., Indian, American"
              value={personal.nationality || ""}
              onChange={(e) => handleFieldChange("nationality", e.target.value)}
              required
              fieldPath="personal.nationality"
              validationIcon
            />
          </div>

          {/* ROW 2: Gender, Marital Status, DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full">
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
              className="w-full"
            />

            <StyledSelect
              label="Marital Status"
              value={personal.maritalStatus || ""}
              onChange={(e) =>
                handleFieldChange("maritalStatus", e.target.value)
              }
              options={[
                { value: "Single", label: "Single" },
                { value: "Married", label: "Married" },
                { value: "Divorced", label: "Divorced" },
                { value: "Widowed", label: "Widowed" },
                { value: "Separated", label: "Separated" },
              ]}
              className="w-full"
            />

            <div className="w-full">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-gray-200 mb-1 sm:mb-1.5">
                Date of Birth
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  value={personal.dob || ""}
                  placeholder="DD/MM/YYYY"
                  maxLength={10}
                  onChange={(e) => handleFieldChange("dob", e.target.value)}
                  onBlur={() => handleFieldBlur("personal.dob")}
                  className="w-full pl-2 sm:pl-3 pr-6 sm:pr-8 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md hover:border-slate-400 dark:hover:border-gray-500 text-sm sm:text-base focus:ring-[#04477E]"
                />
                {personal.dob && <ValidationIcon fieldPath="personal.dob" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="w-full mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-slate-200 dark:border-gray-700 px-3 sm:px-6">
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-4 w-full">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 font-semibold hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-slate-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
          >
            ← Back
          </button>

          <button
            onClick={handleContinue}
            className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-bg-primary font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

