import { useState, useEffect, useCallback } from 'react';
import { useResumeStore } from '../stores';
import { validateSection, validateResume, getFieldError, getFieldValidationState } from '../utils/validation';

interface ValidationState {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

interface UseFormValidationReturn {
  validationState: ValidationState;
  validateField: (fieldPath: string, value: any) => Promise<void>;
  validateSection: (section: string) => Promise<boolean>;
  validateAll: () => Promise<boolean>;
  markFieldAsTouched: (fieldPath: string) => void;
  getFieldError: (fieldPath: string) => string | null;
  getFieldValidationState: (fieldPath: string) => 'default' | 'error' | 'success';
  resetValidation: () => void;
  isSectionValid: (section: string) => boolean;
}

export function useFormValidation(): UseFormValidationReturn {
  const { data } = useResumeStore();

  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: true,
    errors: {},
    touched: {},
  });

  // Debounced validation for real-time feedback
  const debouncedValidateField = useCallback(
    debounce(async (fieldPath: string, value: any) => {
      try {
        // Use the validation utility for field-level validation
        const error = await validateField(fieldPath, value);
        setValidationState(prev => ({
          ...prev,
          errors: { ...prev.errors, [fieldPath]: error || '' },
        }));
      } catch (error: any) {
        setValidationState(prev => ({
          ...prev,
          errors: { ...prev.errors, [fieldPath]: error.message },
        }));
      }
    }, 300),
    []
  );

  const validateField = useCallback(async (fieldPath: string, value: any) => {
    await debouncedValidateField(fieldPath, value);
  }, [debouncedValidateField]);

  const validateSectionData = useCallback(async (section: string) => {
    const sectionData = getSectionData(section, data);
    const result = await validateSection(section, sectionData);

    setValidationState(prev => ({
      ...prev,
      isValid: Object.keys(prev.errors).length === 0 && result.isValid,
      errors: { ...prev.errors, ...result.errors },
    }));

    return result.isValid;
  }, [data]);

  const validateAll = useCallback(async () => {
    const result = await validateResume(data);
    setValidationState(prev => ({
      ...prev,
      isValid: result.isValid,
      errors: result.errors,
    }));
    return result.isValid;
  }, [data]);

  const markFieldAsTouched = useCallback((fieldPath: string) => {
    setValidationState(prev => ({
      ...prev,
      touched: { ...prev.touched, [fieldPath]: true },
    }));
  }, []);

  const getFieldErrorMessage = useCallback((fieldPath: string) => {
    return getFieldError(validationState.errors, fieldPath);
  }, [validationState.errors]);

  const getFieldValidationStateValue = useCallback((fieldPath: string) => {
    return getFieldValidationState(validationState.errors, fieldPath, validationState.touched[fieldPath]);
  }, [validationState.errors, validationState.touched]);

  const resetValidation = useCallback(() => {
    setValidationState({
      isValid: true,
      errors: {},
      touched: {},
    });
  }, []);

  const isSectionValid = useCallback((section: string) => {
    const sectionFields = getSectionFields(section);
    return sectionFields.every(field => !validationState.errors[field]);
  }, [validationState.errors]);

  // Auto-validate when data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateAll();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [data, validateAll]);

  return {
    validationState,
    validateField,
    validateSection: validateSectionData,
    validateAll,
    markFieldAsTouched,
    getFieldError: getFieldErrorMessage,
    getFieldValidationState: getFieldValidationStateValue,
    resetValidation,
    isSectionValid,
  };
}

// Helper functions
function getSectionData(section: string, data: any) {
  switch (section) {
    case 'personal':
      return data.personal;
    case 'summary':
      return data.summary;
    case 'experience':
      return data.experience;
    case 'projects':
      return data.projects;
    case 'education':
      return data.education;
    case 'skills':
      return data.skills;
    default:
      return null;
  }
}

function getSectionFields(section: string): string[] {
  switch (section) {
    case 'personal':
      return ['personal.name', 'personal.email', 'personal.phone', 'personal.location', 'personal.linkedin', 'personal.github'];
    case 'summary':
      return ['summary'];
    case 'experience':
      return ['experience'];
    case 'projects':
      return ['projects'];
    case 'education':
      return ['education'];
    case 'skills':
      return ['skills'];
    default:
      return [];
  }
}

function getFieldSchema(fieldPath: string) {
  // This would need to be implemented based on your validation schemas
  // For now, return null to skip individual field validation
  return null;
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
