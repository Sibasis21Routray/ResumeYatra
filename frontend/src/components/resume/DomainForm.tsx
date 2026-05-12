import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Info, Search, ChevronDown, ChevronRight, Check } from "lucide-react";
import { useResumeStore } from "../../stores";

interface DomainOption {
  value: string;
  label: string;
  group: string;
}

const DOMAIN_OPTIONS_GROUPED: { [key: string]: DomainOption[] } = {
  "Business & Management": [
    { value: "BUSINESS_DEVELOPMENT", label: "Business Development", group: "Business & Management" },
    { value: "SALES", label: "Sales & Revenue", group: "Business & Management" },
    { value: "MARKETING", label: "Marketing & Growth", group: "Business & Management" },
    { value: "STRATEGY", label: "Strategy & Planning", group: "Business & Management" },
    { value: "OPERATIONS", label: "Operations & Process Management", group: "Business & Management" },
    { value: "GENERAL_MANAGEMENT", label: "General Management / Leadership", group: "Business & Management" },
  ],
  "Technology": [
    { value: "SOFTWARE_ENGINEERING", label: "Software Engineering", group: "Technology" },
    { value: "DATA_ANALYTICS", label: "Data Analytics & BI", group: "Technology" },
    { value: "DATA_SCIENCE", label: "Data Science & AI", group: "Technology" },
    { value: "CLOUD_INFRASTRUCTURE", label: "Cloud & Infrastructure", group: "Technology" },
    { value: "CYBERSECURITY", label: "Cybersecurity", group: "Technology" },
    { value: "QA_TESTING", label: "QA / Testing", group: "Technology" },
    { value: "IT_SUPPORT", label: "IT Support & Systems", group: "Technology" },
  ],
  "Product & Delivery": [
    { value: "PRODUCT_MANAGEMENT", label: "Product Management", group: "Product & Delivery" },
    { value: "PROGRAM_PROJECT", label: "Program & Project Management", group: "Product & Delivery" },
    { value: "UX_UI_DESIGN", label: "UX / UI Design", group: "Product & Delivery" },
  ],
  "People & Organization": [
    { value: "HUMAN_RESOURCES", label: "Human Resources", group: "People & Organization" },
    { value: "TALENT_ACQUISITION", label: "Talent Acquisition", group: "People & Organization" },
    { value: "LEARNING_DEVELOPMENT", label: "Learning & Development", group: "People & Organization" },
    { value: "HR_OPERATIONS", label: "HR Operations", group: "People & Organization" },
  ],
  "Finance, Risk & Legal": [
    { value: "FINANCE_ACCOUNTING", label: "Finance & Accounting", group: "Finance, Risk & Legal" },
    { value: "AUDIT_COMPLIANCE", label: "Audit & Compliance", group: "Finance, Risk & Legal" },
    { value: "RISK_MANAGEMENT", label: "Risk Management", group: "Finance, Risk & Legal" },
    { value: "TREASURY", label: "Treasury & Investments", group: "Finance, Risk & Legal" },
    { value: "LEGAL", label: "Legal & Corporate Affairs", group: "Finance, Risk & Legal" },
  ],
  "Operations & Supply Chain": [
    { value: "SUPPLY_CHAIN", label: "Supply Chain & Logistics", group: "Operations & Supply Chain" },
    { value: "PROCUREMENT", label: "Procurement & Vendor Management", group: "Operations & Supply Chain" },
    { value: "MANUFACTURING", label: "Manufacturing Operations", group: "Operations & Supply Chain" },
    { value: "QUALITY_CONTROL", label: "Quality Control", group: "Operations & Supply Chain" },
  ],
  "Research & Specialized": [
    { value: "RESEARCH_DEVELOPMENT", label: "Research & Development", group: "Research & Specialized" },
    { value: "REGULATORY", label: "Regulatory Affairs", group: "Research & Specialized" },
    { value: "CLINICAL", label: "Clinical / Medical", group: "Research & Specialized" },
  ],
  "Customer & Support": [
    { value: "CUSTOMER_SUCCESS", label: "Customer Success", group: "Customer & Support" },
    { value: "CUSTOMER_SUPPORT", label: "Customer Support", group: "Customer & Support" },
    { value: "RELATIONSHIP_MANAGEMENT", label: "Relationship Management", group: "Customer & Support" },
  ],
  "Other": [
    { value: "FREELANCE", label: "Freelance / Consulting", group: "Other" },
    { value: "ENTREPRENEURSHIP", label: "Entrepreneurship", group: "Other" },
    { value: "INTERNSHIP", label: "Internship / Trainee", group: "Other" },
    { value: "ACADEMIA", label: "Academia / Teaching", group: "Other" },
    { value: "OTHER", label: "Other Functional Role", group: "Other" },
  ],
};

interface DomainFormProps {
  onBack?: () => void;
  onNext?: () => void;
}

export function DomainForm({ onBack, onNext }: DomainFormProps) {
  const navigate = useNavigate();
  const { id: resumeId } = useParams();
  const { data, updateData, save } = useResumeStore();

  const [selectedDomain, setSelectedDomain] = useState<string>(
    data.professionalContext?.functionalDomain || ""
  );
  const [domainCustom, setDomainCustom] = useState<string>(
    data.professionalContext?.functionalDomainCustom || ""
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get all options as flat array for easy searching
  const allOptions = useMemo(() => {
    return Object.values(DOMAIN_OPTIONS_GROUPED).flat();
  }, []);

  // Initialize expanded groups when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && !searchQuery) {
      // Expand all groups when dropdown opens
      const allGroups = new Set(Object.keys(DOMAIN_OPTIONS_GROUPED));
      setExpandedGroups(allGroups);
    }
  }, [isDropdownOpen, searchQuery]);

  // Filter options based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return DOMAIN_OPTIONS_GROUPED;
    }

    const query = searchQuery.toLowerCase();
    const filtered: { [key: string]: DomainOption[] } = {};

    Object.entries(DOMAIN_OPTIONS_GROUPED).forEach(([groupName, options]) => {
      const matchingOptions = options.filter((option) =>
        option.label.toLowerCase().includes(query) ||
        groupName.toLowerCase().includes(query)
      );
      if (matchingOptions.length > 0) {
        filtered[groupName] = matchingOptions;
        // Auto-expand groups that have search results
        if (!expandedGroups.has(groupName)) {
          setExpandedGroups(prev => new Set([...prev, groupName]));
        }
      }
    });

    return filtered;
  }, [searchQuery, expandedGroups]);

  // Update dropdown position when opened
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Calculate optimal height (leaving 40px padding from edges)
      const maxHeight = Math.max(spaceBelow, spaceAbove) - 80;

      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 400), // Minimum width for better readability
        height: Math.min(maxHeight, 500), // Max 500px height
      });
    }
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        const dropdownElement = document.getElementById('domain-dropdown-portal');
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setIsDropdownOpen(false);
          setSearchQuery("");
        }
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const handleDomainSelect = (value: string) => {
    setSelectedDomain(value);
    setIsDropdownOpen(false);
    setSearchQuery("");
    if (errors.functionalDomain) setErrors((prev) => ({ ...prev, functionalDomain: "" }));
    if (errors.functionalDomainCustom) setErrors((prev) => ({ ...prev, functionalDomainCustom: "" }));
  };

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleCustomChange = (value: string) => {
    const formatted = toTitleCase(value);
    setDomainCustom(formatted);
    if (errors.functionalDomainCustom) setErrors((prev) => ({ ...prev, functionalDomainCustom: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedDomain) {
      newErrors.functionalDomain = "Please select a functional domain";
    }

    if (selectedDomain === "OTHER") {
      const role = domainCustom.trim();
      if (!role) {
        newErrors.functionalDomainCustom = "Please specify your functional role";
      } else if (role.length < 3 || role.length > 40) {
        newErrors.functionalDomainCustom = "Must be 3-40 characters";
      } else if (!/^[a-zA-Z\s]+$/.test(role)) {
        newErrors.functionalDomainCustom = "Only letters and spaces allowed";
      } else if (/[,\/]/.test(role)) {
        newErrors.functionalDomainCustom = "No commas or slashes allowed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    updateData((draft) => {
      if (!draft.professionalContext) {
        draft.professionalContext = {};
      }
      draft.professionalContext.functionalDomain = selectedDomain || undefined;
      draft.professionalContext.functionalDomainCustom =
        selectedDomain === "OTHER" ? domainCustom : undefined;
    });

    await save();
    onNext ? onNext() : navigate(`/preview/${resumeId}`);
  };

  const getSelectedLabel = () => {
    if (!selectedDomain) return "Select functional domain";
    const option = allOptions.find((opt) => opt.value === selectedDomain);
    return option ? option.label : "Select functional domain";
  };

  return (
    <div className="w-full px-4 max-w-4xl mx-auto">
      <header className="mb-8">
        <h2 className="text-4xl font-bold mb-3">
          Select Functional <span className="text-[#8150CC]">Domain</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Choose your primary functional domain or area of expertise. This defines what you do professionally.
        </p>
      </header>

      {/* Trust Note */}
      <div className="mb-10 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex gap-4">
        <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
            Your Privacy Matters
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            This information improves your resume content but won't be shown directly on the final document.
          </p>
        </div>
      </div>

      {/* Grouped Dropdown with Search */}
      <div className="mb-10">
        <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Functional Domain <span className="text-red-500">*</span>
        </label>

        {/* Custom Dropdown */}
        <div className="relative">
          {/* Selected value display */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full px-5 py-4 rounded-xl border-2 bg-white dark:bg-gray-800 transition-all flex items-center justify-between ${errors.functionalDomain
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-[#8150CC] focus:ring-2 focus:ring-[#8150CC]/20"
              } focus:outline-none`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${selectedDomain ? "border-[#8150CC] bg-[#8150CC]/10" : "border-gray-300 dark:border-gray-600"
                }`}>
                {selectedDomain && (
                  <Check className="w-4 h-4 text-[#8150CC]" />
                )}
              </div>
              <span className={`text-lg ${selectedDomain ? "text-gray-900 dark:text-white font-medium" : "text-gray-500"}`}>
                {getSelectedLabel()}
              </span>
            </div>
            <ChevronDown
              className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* Dropdown panel - rendered via Portal */}
          {isDropdownOpen && createPortal(
            <div
              id="domain-dropdown-portal"
              style={{
                position: 'absolute',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                height: `${dropdownPosition.height}px`,
                zIndex: 9999,
              }}
              className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm bg-white/95 dark:bg-gray-800/95"
            >
              {/* Search input */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/95 dark:bg-gray-800/95 z-20 backdrop-blur-sm">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search domains or groups..."
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#8150CC] focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Options list */}
              <div className="overflow-y-auto" style={{ height: `calc(${dropdownPosition.height}px - 73px)` }}>
                {Object.keys(filteredGroups).length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="text-gray-400 mb-2">
                      <Search className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                      No results found
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {Object.entries(filteredGroups).map(([groupName, options]) => (
                      <div key={groupName} className="group">
                        {/* Group header - clickable to expand/collapse */}
                        <button
                          type="button"
                          onClick={() => toggleGroup(groupName)}
                          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group-hover:bg-gray-50 dark:group-hover:bg-gray-750"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8150CC]/10 to-[#8150CC]/5 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-[#8150CC]/20 flex items-center justify-center">
                                <ChevronRight className={`w-4 h-4 text-[#8150CC] transition-transform duration-300 ${expandedGroups.has(groupName) ? "rotate-90" : ""
                                  }`} />
                              </div>
                            </div>
                            <div className="text-left">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {groupName}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {options.length} option{options.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </button>

                        {/* Group options - animated expand/collapse */}
                        <div className={`overflow-hidden transition-all duration-300 ${expandedGroups.has(groupName) ? 'max-h-96' : 'max-h-0'
                          }`}>
                          <div className="pb-2">
                            {options.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handleDomainSelect(option.value)}
                                className={`w-full px-5 py-3.5 text-left transition-all flex items-center gap-4 hover:pl-6 ${selectedDomain === option.value
                                  ? "bg-gradient-to-r from-[#8150CC]/10 to-transparent border-r-4 border-[#8150CC]"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-750"
                                  }`}
                              >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedDomain === option.value
                                  ? "border-[#8150CC] bg-[#8150CC]"
                                  : "border-gray-300 dark:border-gray-600"
                                  }`}>
                                  {selectedDomain === option.value && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <span className={`text-base ${selectedDomain === option.value
                                  ? "text-[#8150CC] font-medium"
                                  : "text-gray-700 dark:text-gray-300"
                                  }`}>
                                  {option.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>,
            document.body
          )}
        </div>

        {errors.functionalDomain && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">!</span>
            {errors.functionalDomain}
          </p>
        )}
      </div>

      {/* Custom Domain Field */}
      {selectedDomain === "OTHER" && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-lg font-semibold  text-gray-900 dark:text-white">
            Specify Functional Role <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Use a clear, commonly used role name. Avoid full sentences - Only role name (3–40 characters).
          </p>
          <div className="relative">
            <input
              type="text"
              value={domainCustom}
              onChange={(e) => handleCustomChange(e.target.value)}
              className={`w-full px-5 py-4 rounded-xl border-2 bg-white dark:bg-gray-800 text-lg transition-all ${errors.functionalDomainCustom
                ? "border-red-500 focus:ring-2 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-[#8150CC] focus:ring-2 focus:ring-[#8150CC]/20"
                } focus:outline-none`}
              placeholder="e.g., Revenue Operations, Prompt Engineering"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              ✏️
            </div>
          </div>
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">

          </div>
          {errors.functionalDomainCustom && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
              <span className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">!</span>
              {errors.functionalDomainCustom}
            </p>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        {onBack && (
          <button
            onClick={onBack}
            className="px-8 py-3.5 rounded-full border-2 border-gray-300 dark:border-gray-600 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
            Back
          </button>
        )}
        <button
          onClick={handleContinue}
          disabled={!selectedDomain}
          className={`px-10 py-3.5 rounded-full font-bold text-lg transition-all flex items-center gap-3 ml-auto ${!selectedDomain
            ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            : "bg-accent text-white hover:shadow-lg hover:shadow-[#8150CC]/25 hover:scale-[1.02] active:scale-[0.98]"
            }`}
        >
          Continue
          <ChevronDown className="w-5 h-5 -rotate-90" />
        </button>
      </div>
    </div>
  );
}

export default DomainForm;