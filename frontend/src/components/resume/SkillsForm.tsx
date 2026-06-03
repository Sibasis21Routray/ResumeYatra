import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useResumeStore } from "../../stores";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

// Validation constants
const MIN_SKILL_LENGTH = 2;
const MAX_SKILL_LENGTH = 40;

interface SkillsFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

// Styled Input Component
const StyledInput = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  error,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  error?: string;
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
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`${baseInputClass}`}
    />
  );
};

// Section Card Component
const SectionCard = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 shadow-sm">
    <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4 pb-2 border-b border-light-border dark:border-dark-border">
      {title}
    </h3>
    {children}
  </div>
);

// Tag Component
const Tag = ({ item, onRemove, colorScheme = "accent" }: { item: string; onRemove: () => void; colorScheme?: "accent" | "secondary" }) => {
  const colorClasses = colorScheme === "accent" 
    ? "bg-accent/10 text-accent dark:text-dark-accent border-accent/20"
    : "bg-secondary/10 text-secondary dark:text-dark-secondary border-secondary/20";
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colorClasses}`}>
      <span className="text-sm">{item}</span>
      <button
        onClick={onRemove}
        className="hover:text-red-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export function SkillsForm({
  onNext,
  onBack,
}: SkillsFormProps) {
  const { data, updateData, save } = useResumeStore();

  // Skills state
  const [skills, setSkills] = useState<string[]>(() => {
    const existingSkills = data.skills;
    if (typeof existingSkills === 'string') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(existingSkills, 'text/html');
      const lis = doc.querySelectorAll('li');
      if (lis.length > 0) {
        return Array.from(lis).map(li => li.textContent?.trim() || '').filter(Boolean);
      }
      const text = existingSkills.trim();
      if (text.includes(',')) {
        return text.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (text.includes('\n')) {
        return text.split('\n').map(s => s.trim()).filter(Boolean);
      }
    }
    return [];
  });

  const [newSkill, setNewSkill] = useState("");
  const [skillError, setSkillError] = useState("");

  // Core competencies state
  const [competencies, setCompetencies] = useState<string[]>(() => {
    const existingCompetencies = data.coreCompetencies;
    if (typeof existingCompetencies === 'string') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(existingCompetencies, 'text/html');
      const lis = doc.querySelectorAll('li');
      if (lis.length > 0) {
        return Array.from(lis).map(li => li.textContent?.trim() || '').filter(Boolean);
      }
      const text = existingCompetencies.trim();
      if (text.includes(',')) {
        return text.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (text.includes('\n')) {
        return text.split('\n').map(s => s.trim()).filter(Boolean);
      }
    }
    return [];
  });

  const [newCompetency, setNewCompetency] = useState("");
  const [competencyError, setCompetencyError] = useState("");

  const validateItem = (item: string, existingItems: string[]): { valid: boolean; message?: string } => {
    const trimmed = item.trim();

    if (!trimmed) {
      return { valid: false, message: "Field cannot be empty" };
    }

    if (trimmed.length < MIN_SKILL_LENGTH) {
      return { valid: false, message: `Must be at least ${MIN_SKILL_LENGTH} characters` };
    }

    if (trimmed.length > MAX_SKILL_LENGTH) {
      return { valid: false, message: `Must be under ${MAX_SKILL_LENGTH} characters` };
    }

    if (existingItems.includes(trimmed)) {
      return { valid: false, message: "Item already added" };
    }

    return { valid: true };
  };

  // Skills handlers
  const handleAddSkill = () => {
    const validation = validateItem(newSkill, skills);
    
    if (!validation.valid) {
      setSkillError(validation.message || "Invalid skill");
      return;
    }

    const trimmed = newSkill.trim();
    setSkills(prev => [...prev, trimmed]);
    setNewSkill("");
    setSkillError("");

    toast.success('Skill added!', {
      style: toastStyle.success,
      duration: 1500,
    });
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Core competencies handlers
  const handleAddCompetency = () => {
    const validation = validateItem(newCompetency, competencies);
    
    if (!validation.valid) {
      setCompetencyError(validation.message || "Invalid competency");
      return;
    }

    const trimmed = newCompetency.trim();
    setCompetencies(prev => [...prev, trimmed]);
    setNewCompetency("");
    setCompetencyError("");

    toast.success('Core competency added!', {
      style: toastStyle.success,
      duration: 1500,
    });
  };

  const handleRemoveCompetency = (competencyToRemove: string) => {
    setCompetencies(prev => prev.filter(comp => comp !== competencyToRemove));
  };

  const handleCompetencyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCompetency();
    }
  };

  const handleContinue = () => {
    // Convert skills array to HTML format for storage
    const skillsHtml = skills.length > 0
      ? `<ul>${skills.map(skill => `<li>${skill}</li>`).join('')}</ul>`
      : "";

    // Convert core competencies array to HTML format for storage
    const competenciesHtml = competencies.length > 0
      ? `<ul>${competencies.map(comp => `<li>${comp}</li>`).join('')}</ul>`
      : "";

    updateData((draft) => {
      draft.skills = skillsHtml;
      draft.coreCompetencies = competenciesHtml;
    });

    save();

    toast.success('Skills and competencies saved successfully!', {
      style: toastStyle.success,
      duration: 2000,
    });

    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          Add Your <span className="text-accent dark:text-dark-accent">Skills & Competencies</span>
        </h2>
        <p className="text-base text-text-muted dark:text-dark-text-muted max-w-2xl">
          List your technical skills and core competencies to showcase your expertise.
        </p>
      </div>

      <div className="space-y-8">
        {/* Skills Section */}
        <SectionCard title="Technical Skills">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <StyledInput
                  value={newSkill}
                  onChange={(e) => {
                    setNewSkill(e.target.value);
                    setSkillError("");
                  }}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="JavaScript, Project Management, Python, Figma"
                  error={skillError}
                />
                {skillError && (
                  <p className="mt-1 text-xs text-red-500">{skillError}</p>
                )}
              </div>
              <button
                onClick={handleAddSkill}
                className="px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 bg-accent hover:bg-accent-hover text-white"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>

            {/* Skills list */}
            {skills.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Tag
                      key={`skill-${index}`}
                      item={skill}
                      onRemove={() => handleRemoveSkill(skill)}
                      colorScheme="accent"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Skills counter */}
            <div className="mt-4 p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-muted">{skills.length} skill{skills.length !== 1 ? 's' : ''} added</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Core Competencies Section */}
        <SectionCard title="Core Competencies">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <StyledInput
                  value={newCompetency}
                  onChange={(e) => {
                    setNewCompetency(e.target.value);
                    setCompetencyError("");
                  }}
                  onKeyDown={handleCompetencyKeyDown}
                  placeholder="Strategic Planning, Team Leadership, Problem Solving"
                  error={competencyError}
                />
                {competencyError && (
                  <p className="mt-1 text-xs text-red-500">{competencyError}</p>
                )}
              </div>
              <button
                onClick={handleAddCompetency}
                className="px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 bg-accent hover:bg-accent-hover text-white"
              >
                <Plus className="w-5 h-5" />Add
              </button>
            </div>

            {/* Competencies list */}
            {competencies.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {competencies.map((competency, index) => (
                    <Tag
                      key={`comp-${index}`}
                      item={competency}
                      onRemove={() => handleRemoveCompetency(competency)}
                      colorScheme="secondary"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Competencies counter */}
            <div className="mt-4 p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-muted">{competencies.length} core {competencies.length !== 1 ? 'competencies' : 'competency'} added</span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-light-border dark:border-dark-border">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-xl border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:bg-accent/10 hover:border-accent transition-all duration-200 text-base"
        >
          ← Back
        </button>

        <button
          onClick={handleContinue}
          className="px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-base bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}