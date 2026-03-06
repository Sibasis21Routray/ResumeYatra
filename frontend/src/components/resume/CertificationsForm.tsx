import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MonthYearPicker } from "./MonthYearPicker";
import { useResumeStore } from "../../stores";
import { Edit, Trash2, Award, Building2, Calendar, Link, AlertCircle, Plus, ChevronRight } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

interface CertificationsFormProps {
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
  type = "text",
  required = false,
  icon,
  error,
  onBlur,
}: {
  label: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
  onBlur?: () => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  let baseInputClass = `w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-base text-text-primary dark:text-dark-text-primary placeholder:text-sm placeholder:text-text-muted/70 dark:placeholder:text-dark-text-muted/70 shadow-sm hover:shadow-md`;

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

// Simplified Section Card - no header
const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 shadow-sm">
    {children}
  </div>
);

// Certification Card Component for Summary View
const CertificationCard = ({ certification, onEdit, onDelete }: { 
  certification: CertificationItem; 
  onEdit: () => void; 
  onDelete: () => void;
}) => (
  <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-accent dark:text-dark-accent" />
          <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">
            {certification.name}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          {certification.issuer && (
            <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
              <Building2 className="w-4 h-4" />
              <span>{certification.issuer}</span>
            </div>
          )}
          {certification.date && (
            <div className="flex items-center gap-2 text-sm text-text-muted dark:text-dark-text-muted">
              <Calendar className="w-4 h-4" />
              <span>{certification.date}</span>
            </div>
          )}
        </div>

        {certification.url && (
          <a 
            href={certification.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline flex items-center gap-1 mt-1"
          >
            <Link className="w-3 h-3" />
            View Certificate
          </a>
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

export function CertificationsForm({
  onBack,
  onNext,
  onNavigateToSection,
}: CertificationsFormProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, updateData, save } = useResumeStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempCertification, setTempCertification] = useState<Partial<CertificationItem>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const certifications = data.certifications || [];

  const isSummaryView = certifications.length > 0 && !isEditing;

  // Current certification being edited
  const currentCertification = tempCertification;

  // Initial setup
  useEffect(() => {
    if (certifications.length === 0) {
      setIsEditing(true);
      setTempCertification({ id: `cert-${Date.now()}` });
    }
  }, [certifications.length]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!tempCertification.name?.trim()) {
      newErrors.name = "Certification name is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields', {
        style: toastStyle.error,
        duration: 3000,
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return tempCertification.name?.trim() !== "";
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    updateData((draft) => {
      if (!draft.certifications) draft.certifications = [];
      if (editingId) {
        const index = draft.certifications.findIndex((c) => c.id === editingId);
        if (index !== -1) {
          draft.certifications[index] = tempCertification as CertificationItem;
        }
        toast.success('Certification updated successfully!', {
          style: toastStyle.success,
          duration: 2000,
        });
      } else {
        draft.certifications.push(tempCertification as CertificationItem);
        toast.success('Certification added successfully!', {
          style: toastStyle.success,
          duration: 2000,
        });
      }
    });

    save();
    setIsEditing(false);
    setEditingId(null);
    setTempCertification({});
  };

  const handleEdit = (id: string) => {
    const cert = certifications.find((c) => c.id === id);
    if (cert) {
      setEditingId(id);
      setTempCertification({ ...cert });
      setIsEditing(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      updateData((draft) => {
        if (draft.certifications) {
          draft.certifications = draft.certifications.filter((c) => c.id !== id);
        }
      });
      toast.success('Certification deleted successfully!', {
        style: toastStyle.success,
        duration: 2000,
      });
      
      save();
      if (certifications.length <= 1) {
        setIsEditing(true);
        setTempCertification({ id: `cert-${Date.now()}` });
      }
    }
  };

  const handleAddMore = () => {
    setEditingId(null);
    setTempCertification({ id: `cert-${Date.now()}` });
    setIsEditing(true);
  };

  const updateField = (field: string, value: any) => {
    setTempCertification((prev) => ({ ...prev, [field]: value }));
    if (field === "name" && errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Validate on blur
    if (field === "name" && !tempCertification.name?.trim()) {
      setErrors((prev) => ({ ...prev, name: "Certification name is required" }));
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

  const renderSummary = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          Certifications <span className="text-accent dark:text-dark-accent">Summary</span>
        </h2>
        <p className="text-base text-text-muted dark:text-dark-text-muted">
          Review and manage your professional certifications.
        </p>
      </div>

      <div className="space-y-4">
        {certifications.map((cert) => (
          <CertificationCard
            key={cert.id}
            certification={cert}
            onEdit={() => handleEdit(cert.id)}
            onDelete={() => handleDelete(cert.id)}
          />
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleAddMore}
          className="w-full border-2 border-dashed border-light-border dark:border-dark-border rounded-xl py-4 text-base text-text-muted dark:text-dark-text-muted hover:bg-accent/5 hover:border-accent dark:hover:border-dark-accent transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add more certifications
        </button>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-light-border dark:border-dark-border">
        <button
          onClick={handleBack}
          className="px-8 py-3 rounded-xl border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:bg-accent/10 hover:border-accent transition-all duration-200 text-base"
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
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
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          {editingId ? "Edit" : "Add"} <span className="text-accent dark:text-dark-accent">Certification</span>
        </h2>
        <p className="text-base text-text-muted dark:text-dark-text-muted">
          Add your professional certifications and credentials.
        </p>
      </div>

      {/* Certification Details - No header */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StyledInput
            label="Certification Name"
            placeholder="AWS Certified Solutions Architect"
            value={currentCertification.name}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            required
            icon={<Award className="w-4 h-4" />}
            error={touched.name ? errors.name : ""}
          />

          <StyledInput
            label="Issuing Organization"
            placeholder="Amazon Web Services"
            value={currentCertification.issuer}
            onChange={(e) => updateField("issuer", e.target.value)}
            icon={<Building2 className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1.5">
              Issue Date
            </label>
            <MonthYearPicker
              value={currentCertification.date || ""}
              onChange={(value) => updateField("date", value)}
              className="w-full"
              placeholder="Select date"
            />
          </div>

          <StyledInput
            label="Certificate URL"
            type="url"
            placeholder="https://..."
            value={currentCertification.url}
            onChange={(e) => updateField("url", e.target.value)}
            icon={<Link className="w-4 h-4" />}
          />
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-light-border dark:border-dark-border">
        <button
          onClick={() => {
            if (editingId) {
              setIsEditing(false);
              setEditingId(null);
            } else {
              handleBack();
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
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      {isSummaryView ? renderSummary() : renderForm()}
    </div>
  );
}