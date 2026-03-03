import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Check, AlertCircle } from 'lucide-react';
import { MonthYearPicker } from '../MonthYearPicker';

// Field configuration types
export interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox' | 'date-range';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  optional?: boolean;
  className?: string;
  description?: string;
}

export interface BasicDetailsStepProps {
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onEmptySubmit?: () => void;
  onBack: () => void;
  submitButtonText?: string;
  isEditing?: boolean;
  isLoading?: boolean;
}

export function BasicDetailsStep({
  title,
  subtitle,
  fields,
  initialData = {},
  onSubmit,
  onEmptySubmit,
  onBack,
  submitButtonText = 'Add Details',
  isEditing = false,
  isLoading = false,
}: BasicDetailsStepProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const data: Record<string, any> = { ...initialData };
    // Set default values for checkbox fields
    fields.forEach(field => {
      if (field.type === 'checkbox' && data[field.name] === undefined) {
        data[field.name] = false;
      }
    });
    return data;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.required && !field.type) {
        // Skip checkbox validation
        return;
      }

      const value = formData[field.name];

      if (field.required) {
        if (field.type === 'checkbox') {
          if (!value) {
            newErrors[field.name] = `Please check this box`;
            isValid = false;
          }
        } else if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field.name] = `${field.label} is required`;
          isValid = false;
        }
      }

      // URL validation
      if (field.type === 'url' && value && value.trim()) {
        try {
          new URL(value);
        } catch {
          newErrors[field.name] = 'Please enter a valid URL';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trim string values
    const trimmedData = { ...formData };
    Object.keys(trimmedData).forEach(key => {
      if (typeof trimmedData[key] === 'string') {
        trimmedData[key] = trimmedData[key].trim();
      }
    });
    setFormData(trimmedData);
    if (validate()) {
      onSubmit(trimmedData);
    }
  };

  const renderField = (field: FieldConfig) => {
    const value = formData[field.name] ?? '';
    const error = errors[field.name];
    const isTouched = touched[field.name];

    const commonClasses = `w-full pl-2 sm:pl-3 pr-8 sm:pr-10 py-1.5 sm:py-2 bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-text-primary dark:text-dark-text-primary placeholder-text-muted dark:placeholder-dark-text-muted shadow-sm hover:shadow-md hover:border-accent dark:hover:border-dark-accent text-sm sm:text-base ${error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'focus:ring-accent focus:border-accent'
      }`;

    switch (field.type) {
      case 'textarea':
        return (
          <div className="relative">
            <textarea
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              className={`${commonClasses} resize-none min-h-[120px] leading-relaxed`}
              rows={4}
            />
            {!error && value && (
              <div className="absolute right-3 top-3">
                <Check className="w-4 h-4 text-green-500" />
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <div className="relative">
            <div className="relative">
              <select
                value={value}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                className={`${commonClasses} appearance-none cursor-pointer`}
              >
                <option value="">{field.placeholder || `Select ${field.label}`}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {!error && value && (
              <div className="absolute right-8 top-3">
                <Check className="w-4 h-4 text-green-500" />
              </div>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-accent/10 dark:hover:bg-dark-accent/10 transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                onBlur={() => handleBlur(field.name)}
                className="sr-only"
              />
              <div className={`w-6 h-6 border-2 rounded-lg transition-all duration-300 flex items-center justify-center ${value
                ? 'bg-accent dark:bg-dark-accent border-transparent shadow-md'
                : 'border-light-border dark:border-dark-border group-hover:border-accent bg-bg-primary dark:bg-dark-bg-primary'
                }`}>
                {value && (
                  <Check className="w-4 h-4 text-bg-primary dark:text-dark-bg-primary" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-text-primary dark:text-dark-text-primary font-medium">{field.label}</span>
              {field.description && (
                <p className="text-sm text-text-muted dark:text-dark-text-muted mt-1">{field.description}</p>
              )}
            </div>
          </label>
        );

      default:
        if (field.name === 'startDate') {
          return (
            <MonthYearPicker
              value={value}
              onChange={(newValue) => handleChange(field.name, newValue)}
              placeholder={field.placeholder}
            />
          );
        }
        if (field.name === 'endDate') {
          if (formData.isCurrent) {
            return (
              <div className="flex items-center px-4 py-3.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/50 rounded-xl">
                <span className="text-green-700 dark:text-green-400 font-medium flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm">Currently Working Here</span>
                </span>
              </div>
            );
          }
          return (
            <MonthYearPicker
              value={value}
              onChange={(newValue) => handleChange(field.name, newValue)}
              placeholder={field.placeholder}
            />
          );
        }
        return (
          <div className="relative">
            <input
              type={field.type || 'text'}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              className={commonClasses}
            />
            {!error && value && (
              <div className="absolute right-3 top-3">
                <Check className="w-4 h-4 text-green-500" />
              </div>
            )}
          </div>
        );
    }
  };

  // Group date fields together if configured
  const dateFields = fields.filter(f => f.type === 'date-range');
  const regularFields = fields.filter(f => f.type !== 'date-range');

  // Helper function to highlight the last word of a title
  const highlightLastWord = (text: string) => {
    const words = text.split(' ');
    if (words.length === 0) return null;

    const lastWord = words.pop();
    return (
      <>
        <span className="bg-accent bg-clip-text text-transparent">
          {words.join(' ')} <span className="font-extrabold">{lastWord}</span>
        </span>
      </>
    );
  };

  // Calculate filled required fields for progress
  const requiredFields = fields.filter(f => f.required);
  const filledRequiredFields = requiredFields.filter(f => {
    const value = formData[f.name];
    if (f.type === 'checkbox') return value === true;
    return value && (typeof value !== 'string' || value.trim() !== '');
  });
  const progressPercentage = requiredFields.length > 0
    ? Math.round((filledRequiredFields.length / requiredFields.length) * 100)
    : 0;

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-start">

        <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
          {highlightLastWord(title)}
        </h2>
        {subtitle && (
          <p className="text-text-muted dark:text-dark-text-muted text-lg max-w-lg">
            {subtitle}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      {requiredFields.length > 0 && (
        <div className="mb-8 p-5 bg-bg-secondary dark:bg-dark-bg-secondary rounded-2xl border border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
              {isEditing ? 'Editing Progress' : 'Completion Progress'}
            </span>
            <span className="text-sm font-bold text-accent dark:text-dark-accent">
              {progressPercentage}%
            </span>
          </div>
          <div className="h-2 bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent dark:bg-dark-accent rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-text-muted dark:text-dark-text-muted mt-2">
            {filledRequiredFields.length} of {requiredFields.length} required fields completed
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Regular Fields */}
        {regularFields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regularFields.map((field) => (
              <div
                key={field.name}
                className={`${field.className || 'col-span-1'} group`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                    {field.label}
                    {field.required && !field.optional && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.optional && (
                    <span className="text-xs text-text-muted dark:text-dark-text-muted px-2 py-1 bg-bg-secondary dark:bg-dark-bg-secondary rounded">Optional</span>
                  )}
                </div>
                {renderField(field)}
                {errors[field.name] && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-red-500 animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    {errors[field.name]}
                  </div>
                )}
                {field.description && !errors[field.name] && (
                  <p className="mt-2 text-xs text-text-muted dark:text-dark-text-muted">{field.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Date Fields */}
        {dateFields.length > 0 && (
          <div className="space-y-6">
            {dateFields.map((field) => {
              const startDate = formData[`${field.name}StartDate`] || '';
              const endDate = formData[`${field.name}EndDate`] || '';
              const current = formData[`${field.name}Current`] || false;

              return (
                <div key={field.name} className="relative overflow-hidden rounded-2xl border border-light-border dark:border-dark-border bg-bg-primary dark:bg-dark-bg-primary p-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent dark:bg-dark-accent"></div>
                  <div className="ml-3">
                    <label className="block text-base font-bold text-text-primary dark:text-dark-text-primary mb-4">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
                          Start Date
                        </label>
                        <MonthYearPicker
                          value={startDate}
                          onChange={(value) => handleChange(`${field.name}StartDate`, value)}
                          placeholder="Select start month"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
                          End Date
                        </label>
                        {!current ? (
                          <MonthYearPicker
                            value={endDate}
                            onChange={(value) => handleChange(`${field.name}EndDate`, value)}
                            placeholder="Select end month"
                          />
                        ) : (
                          <div className="flex items-center h-full px-4 py-3.5 bg-accent/10 dark:bg-dark-accent/10 border border-accent/30 dark:border-dark-accent/30 rounded-xl">
                            <span className="text-accent dark:text-dark-accent font-medium flex items-center gap-3">
                              <div className="flex items-center justify-center w-6 h-6 bg-accent dark:bg-dark-accent rounded-full">
                                <Check className="w-3 h-3 text-bg-primary dark:text-dark-bg-primary" />
                              </div>
                              <span className="text-sm">Currently Working Here</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-light-border dark:border-dark-border">
                      <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-accent/10 dark:hover:bg-dark-accent/10 transition-colors">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={current}
                            onChange={(e) => handleChange(`${field.name}Current`, e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-6 h-6 border-2 rounded-lg transition-all duration-300 flex items-center justify-center ${current
                            ? 'bg-accent dark:bg-dark-accent border-transparent shadow-md'
                            : 'border-light-border dark:border-dark-border group-hover:border-accent bg-bg-primary dark:bg-dark-bg-primary'
                            }`}>
                            {current && <Check className="w-4 h-4 text-bg-primary dark:text-dark-bg-primary" />}
                          </div>
                        </div>
                        <span className="text-text-primary dark:text-dark-text-primary font-medium">
                          I currently work here
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-light-border dark:border-dark-border">
          <button
            type="button"
            onClick={onBack}
            className="group flex items-center gap-3 px-8 py-3 rounded-full border-2 border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:border-accent hover:text-accent dark:hover:text-dark-accent hover:bg-accent/10 transition-all duration-300 hover:shadow-md w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative flex items-center gap-3 px-10 py-3.5 rounded-full font-bold shadow-lg transition-all duration-300 overflow-hidden w-full sm:w-auto justify-center ${isLoading
                ? 'bg-light-border dark:bg-dark-border text-text-muted dark:text-dark-text-muted cursor-not-allowed'
                : 'bg-accent dark:bg-dark-accent text-bg-primary dark:text-dark-bg-primary hover:shadow-xl hover:scale-105 active:scale-95'
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  {submitButtonText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}