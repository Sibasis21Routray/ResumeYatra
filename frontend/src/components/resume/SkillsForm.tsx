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

// Skill validation constants
const MAX_SKILLS = 20;
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

// Simplified Section Card - no header
const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-xl p-5 shadow-sm">
    {children}
  </div>
);

// Skill Tag Component
const SkillTag = ({ skill, onRemove }: { skill: string; onRemove: () => void }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent dark:text-dark-accent rounded-lg border border-accent/20">
    <span className="text-sm">{skill}</span>
    <button
      onClick={onRemove}
      className="hover:text-red-600 transition-colors"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

export function SkillsForm({
  onNext,
  onBack,
}: SkillsFormProps) {
  const { data, updateData, save } = useResumeStore();

  const [skills, setSkills] = useState<string[]>(() => {
    // Parse existing skills from store
    const existingSkills = data.skills;
    if (typeof existingSkills === 'string') {
      // Try to parse HTML to extract skills
      const parser = new DOMParser();
      const doc = parser.parseFromString(existingSkills, 'text/html');
      const lis = doc.querySelectorAll('li');
      if (lis.length > 0) {
        return Array.from(lis).map(li => li.textContent?.trim() || '').filter(Boolean);
      }
      // If no list items, try to split by commas or newlines
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
  const [error, setError] = useState("");

  const validateSkill = (skill: string): { valid: boolean; message?: string } => {
    const trimmed = skill.trim();

    if (!trimmed) {
      return { valid: false, message: "Skill cannot be empty" };
    }

    if (trimmed.length < MIN_SKILL_LENGTH) {
      return { valid: false, message: `Skill must be at least ${MIN_SKILL_LENGTH} characters` };
    }

    if (trimmed.length > MAX_SKILL_LENGTH) {
      return { valid: false, message: `Skill must be under ${MAX_SKILL_LENGTH} characters` };
    }

    if (skills.includes(trimmed)) {
      return { valid: false, message: "Skill already added" };
    }

    return { valid: true };
  };

  const handleAddSkill = () => {
    const validation = validateSkill(newSkill);
    
    if (!validation.valid) {
      setError(validation.message || "Invalid skill");
      return;
    }

    if (skills.length >= MAX_SKILLS) {
      toast.error(`Maximum ${MAX_SKILLS} skills allowed`, {
        style: toastStyle.error,
        duration: 3000,
      });
      return;
    }

    const trimmed = newSkill.trim();
    setSkills(prev => [...prev, trimmed]);
    setNewSkill("");
    setError("");

    toast.success('Skill added!', {
      style: toastStyle.success,
      duration: 1500,
    });
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleContinue = () => {
    // Convert skills array to HTML format for storage
    const skillsHtml = skills.length > 0
      ? `<ul>${skills.map(skill => `<li>${skill}</li>`).join('')}</ul>`
      : "";

    updateData((draft) => {
      draft.skills = skillsHtml;
    });

    save();

    toast.success('Skills saved successfully!', {
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
          Add Your <span className="text-accent dark:text-dark-accent">Skills</span>
        </h2>
        <p className="text-base text-text-muted dark:text-dark-text-muted max-w-2xl">
          List your professional skills to showcase your expertise.
        </p>
      </div>

      {/* Skills Input */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <StyledInput
              value={newSkill}
              onChange={(e) => {
                setNewSkill(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="JavaScript, Project Management, Python, Figma"
              error={error}
            />
            {error && (
              <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
          </div>
          <button
            onClick={handleAddSkill}
            disabled={skills.length >= MAX_SKILLS}
            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              skills.length >= MAX_SKILLS
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-accent hover:bg-accent-hover text-white'
            }`}
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
                <SkillTag
                  key={`${skill}-${index}`}
                  skill={skill}
                  onRemove={() => handleRemoveSkill(skill)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-4 p-3 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-muted">{skills.length}/{MAX_SKILLS} skills</span>
            <span className="text-xs text-text-muted">{MAX_SKILLS - skills.length} left</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${(skills.length / MAX_SKILLS) * 100}%` }}
            />
          </div>
        </div>
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
          disabled={skills.length === 0}
          className={`px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-base ${
            skills.length > 0
              ? 'bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>

      
    </div>
  );
}