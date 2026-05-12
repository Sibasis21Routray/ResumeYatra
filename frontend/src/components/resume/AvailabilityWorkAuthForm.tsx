import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResumeStore } from "../../stores";
import { AlertCircle } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface AvailabilityWorkAuthItem {
    id: string;
    availabilityNoticePeriod: string; // Availability/Notice Period (50 chars) - Immediate, 30 days, etc.
    workAuthorizationStatus: string; // Work Authorization Status (80 chars) - Citizen, Visa type, etc.
    preferredLocation: string; // Preferred Location (120 chars) - CITY/Country
}

interface AvailabilityWorkAuthFormProps {
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
    maxLength,
    error,
    onBlur,
    characterCount,
    tooltip,
}: {
    label: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
    error?: string;
    onBlur?: () => void;
    characterCount?: boolean;
    tooltip?: string;
}) => {
    const [isFocused, setIsFocused] = useState(false);

    let baseInputClass = `w-full px-4 py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-base text-text-primary dark:text-dark-text-primary placeholder:text-sm placeholder:text-text-muted/70 dark:placeholder:text-dark-text-muted/70 shadow-sm hover:shadow-md`;

    if (error) {
        baseInputClass += " border-red-500 focus:ring-red-500 focus:border-red-500";
    } else if (isFocused) {
        baseInputClass += " border-accent dark:border-dark-accent ring-2 ring-accent/20";
    } else {
        baseInputClass += " border-light-border dark:border-dark-border";
    }

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-1.5">
                <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                
            </div>
            <div className="relative w-full">
                <input
                    type="text"
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

export function AvailabilityWorkAuthForm({
    onBack,
    onNext,
    onNavigateToSection,
}: AvailabilityWorkAuthFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, updateData, save } = useResumeStore();

    const [availability, setAvailability] = useState<Partial<AvailabilityWorkAuthItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const currentData = data.availabilityWorkAuth || {};

    // Initialize with existing data if available
    React.useEffect(() => {
        if (currentData && Object.keys(currentData).length > 0) {
            setAvailability(currentData);
        }
    }, []);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!availability.availabilityNoticePeriod?.trim()) {
            newErrors.availabilityNoticePeriod = "Availability/Notice Period is required";
        } else if (availability.availabilityNoticePeriod.length > 50) {
            newErrors.availabilityNoticePeriod = "Availability/Notice Period must be less than 50 characters";
        }

        if (availability.workAuthorizationStatus && availability.workAuthorizationStatus.length > 80) {
            newErrors.workAuthorizationStatus = "Work Authorization Status must be less than 80 characters";
        }

        if (availability.preferredLocation && availability.preferredLocation.length > 120) {
            newErrors.preferredLocation = "Preferred Location must be less than 120 characters";
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
        return availability.availabilityNoticePeriod?.trim() !== "";
    };

    const updateField = (field: string, value: any) => {
        setAvailability((prev) => ({ ...prev, [field]: value }));
        if (field === "availabilityNoticePeriod" && errors.availabilityNoticePeriod) {
            setErrors((prev) => ({ ...prev, availabilityNoticePeriod: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        
        // Validate on blur
        if (field === "availabilityNoticePeriod" && !availability.availabilityNoticePeriod?.trim()) {
            setErrors((prev) => ({ ...prev, availabilityNoticePeriod: "Availability/Notice Period is required" }));
        }
    };

    const handleSubmit = () => {
        // Mark all fields as touched first
        setTouched({
            availabilityNoticePeriod: true,
            workAuthorizationStatus: true,
            preferredLocation: true
        });
        
        if (!validateForm()) {
            return;
        }

        updateData((draft) => {
            draft.availabilityWorkAuth = availability as AvailabilityWorkAuthItem;
        });

        save();
        toast.success('Availability & Work Authorization saved successfully!', {
            style: toastStyle.success,
            duration: 2000,
        });
    };

    const handleContinue = () => {
        handleSubmit();
        
        // Only navigate if form is valid
        if (validateForm()) {
            if (onNavigateToSection) {
                onNavigateToSection("customSections");
            } else {
                navigate(`/preview/${id}`);
            }
        }
    };

    return (
        <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 ">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                        Availability & Work <span className="text-accent dark:text-dark-accent">Authorization</span>
                    </h2>
                    <p className="text-base text-text-muted dark:text-dark-text-muted">
                        Let employers know about your availability and work authorization status.
                    </p>
                </div>

                <div className="bg-bg-primary dark:bg-dark-bg-primary rounded-xl  pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StyledInput
                            label="Availability / Notice Period"
                            placeholder="e.g., Immediate, 30 days, 2 weeks"
                            value={availability.availabilityNoticePeriod}
                            onChange={(e) => updateField("availabilityNoticePeriod", e.target.value)}
                            onBlur={() => handleBlur("availabilityNoticePeriod")}
                            required
                            maxLength={50}
                            characterCount
                            error={touched.availabilityNoticePeriod ? errors.availabilityNoticePeriod : ""}
                            tooltip="Immediate, 30 days, etc."
                        />

                        <StyledInput
                            label="Work Authorization Status"
                            placeholder="e.g., US Citizen, H1B Visa, Green Card"
                            value={availability.workAuthorizationStatus}
                            onChange={(e) => updateField("workAuthorizationStatus", e.target.value)}
                            maxLength={80}
                            characterCount
                            error={touched.workAuthorizationStatus ? errors.workAuthorizationStatus : ""}
                            tooltip="Citizen, Visa type, etc."
                        />

                        <div className="md:col-span-2">
                            <StyledInput
                                label="Preferred Location"
                                placeholder="e.g., New York, USA or Remote"
                                value={availability.preferredLocation}
                                onChange={(e) => updateField("preferredLocation", e.target.value)}
                                maxLength={120}
                                characterCount
                                error={touched.preferredLocation ? errors.preferredLocation : ""}
                                tooltip="CITY/Country"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-light-border dark:border-dark-border">
                    <button
                        onClick={() => {
  if (onNavigateToSection) {
    onNavigateToSection("customSections");
  }
}}
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
            </div>
        </div>
    );
}