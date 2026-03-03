import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Info, Search, ChevronDown, ChevronRight, Check } from "lucide-react";
import { useResumeStore } from "../../stores";

interface IndustryOption {
  id: string;
  label: string;
  description: string;
  value: string;
  group: string;
}

// Grouped by industry categories
const INDUSTRY_GROUPS: { [key: string]: IndustryOption[] } = {
  "Finance & Technology": [
    { id: "BFSI", label: "BFSI & Financial Services", description: "Banking, Financial Services, Insurance", value: "BFSI", group: "Finance & Technology" },
    { id: "INSURANCE", label: "Insurance", description: "Insurance companies and services", value: "INSURANCE", group: "Finance & Technology" },
    { id: "FINTECH", label: "Fintech", description: "Financial Technology", value: "FINTECH", group: "Finance & Technology" },
    { id: "ACCOUNTING", label: "Accounting & Tax", description: "Accounting, Audit, Tax, Finance", value: "ACCOUNTING", group: "Finance & Technology" },
  ],
  "Technology & IT": [
    { id: "IT_SOFTWARE", label: "IT & Software", description: "Software Development, Technology", value: "IT_SOFTWARE", group: "Technology & IT" },
    { id: "IT_SERVICES", label: "IT Services & Consulting", description: "IT Services, Consulting, Outsourcing", value: "IT_SERVICES", group: "Technology & IT" },
    { id: "TELECOM", label: "Telecommunications", description: "Telecom, Networking, Communications", value: "TELECOM", group: "Technology & IT" },
    { id: "RESEARCH", label: "Research & Analytics", description: "Research, Analytics, Data Science", value: "RESEARCH", group: "Technology & IT" },
  ],
  "Healthcare & Life Sciences": [
    { id: "HEALTHCARE", label: "Healthcare & Life Sciences", description: "Healthcare, Pharmaceuticals, Biotechnology", value: "HEALTHCARE", group: "Healthcare & Life Sciences" },
    { id: "PHARMA_BIOTECH", label: "Pharmaceuticals & Biotech", description: "Pharma, Biotechnology, Research", value: "PHARMA_BIOTECH", group: "Healthcare & Life Sciences" },
  ],
  "Manufacturing & Industrial": [
    { id: "MANUFACTURING", label: "Manufacturing & Engineering", description: "Manufacturing, Engineering, Industrial", value: "MANUFACTURING", group: "Manufacturing & Industrial" },
    { id: "AUTOMOTIVE", label: "Automotive & Mobility", description: "Automobile, EV, Transportation", value: "AUTOMOTIVE", group: "Manufacturing & Industrial" },
    { id: "AVIATION", label: "Aviation & Aerospace", description: "Aviation, Aerospace, Defense", value: "AVIATION", group: "Manufacturing & Industrial" },
  ],
  "Construction & Real Estate": [
    { id: "REAL_ESTATE", label: "Real Estate & Infrastructure", description: "Real Estate, Construction, Infrastructure", value: "REAL_ESTATE", group: "Construction & Real Estate" },
    { id: "CONSTRUCTION", label: "Construction & EPC", description: "Construction, Engineering, Projects", value: "CONSTRUCTION", group: "Construction & Real Estate" },
  ],
  "Retail & Consumer": [
    { id: "RETAIL_ECOMMERCE", label: "Retail & E-commerce", description: "Retail, E-commerce, Consumer", value: "RETAIL_ECOMMERCE", group: "Retail & Consumer" },
    { id: "FMCG", label: "FMCG / Consumer Goods", description: "Fast Moving Consumer Goods", value: "FMCG", group: "Retail & Consumer" },
    { id: "HOSPITALITY", label: "Hospitality & Tourism", description: "Hotels, Travel, Tourism", value: "HOSPITALITY", group: "Retail & Consumer" },
  ],
  "Energy & Resources": [
    { id: "ENERGY", label: "Energy & Utilities", description: "Energy, Power, Utilities", value: "ENERGY", group: "Energy & Resources" },
    { id: "OIL_GAS", label: "Oil, Gas & Mining", description: "Oil, Gas, Mining, Resources", value: "OIL_GAS", group: "Energy & Resources" },
    { id: "AGRICULTURE", label: "Agriculture & Agribusiness", description: "Agriculture, Farming, Agribusiness", value: "AGRICULTURE", group: "Energy & Resources" },
  ],
  "Services & Logistics": [
    { id: "LOGISTICS", label: "Logistics & Supply Chain", description: "Logistics, Supply Chain, Transportation", value: "LOGISTICS", group: "Services & Logistics" },
    { id: "STAFFING", label: "Staffing & HR", description: "HR, Recruitment, Staffing", value: "STAFFING", group: "Services & Logistics" },
    { id: "LEGAL", label: "Legal Services", description: "Legal, Law Firms, Compliance", value: "LEGAL", group: "Services & Logistics" },
  ],
  "Media & Education": [
    { id: "MEDIA", label: "Media & Entertainment", description: "Media, Advertising, Entertainment", value: "MEDIA", group: "Media & Education" },
    { id: "EDUCATION", label: "Education & EdTech", description: "Education, EdTech, Training", value: "EDUCATION", group: "Media & Education" },
  ],
  "Government & Public": [
    { id: "GOVERNMENT", label: "Government & Public Sector", description: "Government, Public Administration", value: "GOVERNMENT", group: "Government & Public" },
    { id: "DEFENSE", label: "Defense & Security", description: "Defense, Security, Military", value: "DEFENSE", group: "Government & Public" },
    { id: "NGOS", label: "NGOs & Non-Profit", description: "Non-Profit, NGOs, Social Sector", value: "NGOS", group: "Government & Public" },
  ],
  "Other": [
    { id: "OTHER", label: "Other / Multi-Industry", description: "Other industry or multiple industries", value: "OTHER", group: "Other" },
  ],
};

interface IndustryFormProps {
  onBack?: () => void;
  onNext?: () => void;
}

export function IndustryForm({ onBack, onNext }: IndustryFormProps) {
  const navigate = useNavigate();
  const { id: resumeId } = useParams();
  const { data, updateData, save } = useResumeStore();

  const [selectedIndustry, setSelectedIndustry] = useState<string>(
    data.professionalContext?.industry || ""
  );
  const [industryCustom, setIndustryCustom] = useState<string>(
    data.professionalContext?.industryCustom || ""
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get all options as flat array
  const allOptions = useMemo(() => {
    return Object.values(INDUSTRY_GROUPS).flat();
  }, []);

  // Initialize expanded groups when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && !searchQuery) {
      // Expand all groups when dropdown opens
      const allGroups = new Set(Object.keys(INDUSTRY_GROUPS));
      setExpandedGroups(allGroups);
    }
  }, [isDropdownOpen, searchQuery]);

  // Filter options based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return INDUSTRY_GROUPS;
    }

    const query = searchQuery.toLowerCase();
    const filtered: { [key: string]: IndustryOption[] } = {};

    Object.entries(INDUSTRY_GROUPS).forEach(([groupName, options]) => {
      const matchingOptions = options.filter((option) =>
        option.label.toLowerCase().includes(query) ||
        option.description.toLowerCase().includes(query) ||
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
        width: Math.max(rect.width, 400),
        height: Math.min(maxHeight, 500),
      });
    }
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        const dropdownElement = document.getElementById('industry-dropdown-portal');
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

  const handleIndustrySelect = (value: string) => {
    setSelectedIndustry(value);
    setIsDropdownOpen(false);
    setSearchQuery("");
    if (errors.industry) setErrors((prev) => ({ ...prev, industry: "" }));
    if (errors.industryCustom) setErrors((prev) => ({ ...prev, industryCustom: "" }));
  };

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleCustomChange = (value: string) => {
    // Auto-format to Title Case
    const formatted = toTitleCase(value);
    setIndustryCustom(formatted);
    if (errors.industryCustom) setErrors((prev) => ({ ...prev, industryCustom: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedIndustry) {
      newErrors.industry = "Please select an industry";
    }

    // Validate industry custom field
    if (selectedIndustry === "OTHER") {
      const industry = industryCustom.trim();
      if (!industry) {
        newErrors.industryCustom = "Please specify your industry";
      } else if (industry.length < 3 || industry.length > 40) {
        newErrors.industryCustom = "Must be 3-40 characters";
      } else if (!/^[a-zA-Z\s]+$/.test(industry)) {
        newErrors.industryCustom = "Only letters and spaces allowed";
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
      draft.professionalContext.industry = selectedIndustry || undefined;
      draft.professionalContext.industryCustom = selectedIndustry === "OTHER" ? industryCustom : undefined;
    });

    await save();
    onNext ? onNext() : navigate(`/preview/${resumeId}`);
  };

  const getSelectedLabel = () => {
    if (!selectedIndustry) return "Select industry";
    const option = allOptions.find((opt) => opt.value === selectedIndustry);
    return option ? option.label : "Select industry";
  };

  return (
    <div className="w-full px-4 max-w-4xl mx-auto">
      <header className="mb-8">
        <h2 className="text-4xl font-bold mb-3">
          Select <span className="text-[#8150CC]">Industry</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Choose the industry that best describes your professional background.
          This helps us tailor your resume content.
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
            This information improves your resume content but won't be shown directly on the final
            document.
          </p>
        </div>
      </div>

      {/* Grouped Dropdown with Search */}
      <div className="mb-10">
        <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Industry <span className="text-red-500">*</span>
        </label>

        {/* Custom Dropdown */}
        <div className="relative">
          {/* Selected value display */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full px-5 py-4 rounded-xl border-2 bg-white dark:bg-gray-800 transition-all flex items-center justify-between ${errors.industry
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-[#8150CC] focus:ring-2 focus:ring-[#8150CC]/20"
              } focus:outline-none`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${selectedIndustry ? "border-[#8150CC] bg-[#8150CC]/10" : "border-gray-300 dark:border-gray-600"
                }`}>
                {selectedIndustry && (
                  <Check className="w-4 h-4 text-[#8150CC]" />
                )}
              </div>
              <span className={`text-lg ${selectedIndustry ? "text-gray-900 dark:text-white font-medium" : "text-gray-500"}`}>
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
              id="industry-dropdown-portal"
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
                    placeholder="Search industries..."
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
                                onClick={() => handleIndustrySelect(option.value)}
                                className={`w-full px-5 py-3.5 text-left transition-all flex items-center gap-4 hover:pl-6 ${selectedIndustry === option.value
                                  ? "bg-gradient-to-r from-[#8150CC]/10 to-transparent border-r-4 border-[#8150CC]"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-750"
                                  }`}
                              >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedIndustry === option.value
                                  ? "border-[#8150CC] bg-[#8150CC]"
                                  : "border-gray-300 dark:border-gray-600"
                                  }`}>
                                  {selectedIndustry === option.value && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <span className={`text-base ${selectedIndustry === option.value
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

        {errors.industry && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">!</span>
            {errors.industry}
          </p>
        )}
      </div>

      {/* Custom Industry Field */}
      {selectedIndustry === "OTHER" && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Specify Industry <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={industryCustom}
              onChange={(e) => handleCustomChange(e.target.value)}
              className={`w-full px-5 py-4 rounded-xl border-2 bg-white dark:bg-gray-800 text-lg transition-all ${errors.industryCustom
                ? "border-red-500 focus:ring-2 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-[#8150CC] focus:ring-2 focus:ring-[#8150CC]/20"
                } focus:outline-none`}
              placeholder="e.g., Renewable Energy, Maritime, Sports"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              ✏️
            </div>
          </div>
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Requirements:</span> 3-40 characters • Letters and spaces only • Use clear, commonly used industry names
            </p>
          </div>
          {errors.industryCustom && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
              <span className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">!</span>
              {errors.industryCustom}
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
          disabled={!selectedIndustry}
          className={`px-10 py-3.5 rounded-full font-bold text-lg transition-all flex items-center gap-3 ml-auto ${!selectedIndustry
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

export default IndustryForm;
