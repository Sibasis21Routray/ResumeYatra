import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Info, ChevronRight, Check, Search, ChevronDown } from "lucide-react";
import { useResumeStore } from "../../stores";
import { FORM_OPTIONS } from "../../utils/professionalContext.config";

interface GeographicScopeFormProps {
  onBack?: () => void;
  onNext?: () => void;
}

export function GeographicScopeForm({ onBack, onNext }: GeographicScopeFormProps) {
  const navigate = useNavigate();
  const { id: resumeId } = useParams();
  const { data, updateData, save } = useResumeStore();

  const [selectedGeographicScope, setSelectedGeographicScope] = useState<string>(
    data.professionalContext?.geographicScope || ""
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return FORM_OPTIONS.geoScope.slice(1); // Skip the first empty option
    }
    const query = searchQuery.toLowerCase();
    return FORM_OPTIONS.geoScope.slice(1).filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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
        const dropdownElement = document.getElementById('geographic-scope-dropdown-portal');
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

  const handleGeographicScopeSelect = (value: string) => {
    setSelectedGeographicScope(value);
    if (errors.geographicScope) setErrors((prev) => ({ ...prev, geographicScope: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    // Geographic scope is optional, no validation needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    updateData((draft) => {
      if (!draft.professionalContext) {
        draft.professionalContext = {};
      }
      draft.professionalContext.geographicScope = selectedGeographicScope || undefined;
    });

    await save();
    onNext ? onNext() : navigate(`/preview/${resumeId}`);
  };

  const getSelectedLabel = () => {
    if (!selectedGeographicScope) return "Select geographic scope (Optional)";
    const option = FORM_OPTIONS.geoScope.find((opt) => opt.value === selectedGeographicScope);
    return option ? option.label : "Select geographic scope (Optional)";
  };

  return (
    <div className="w-full px-4 max-w-4xl mx-auto">
      <header className="mb-8">
        <h2 className="text-4xl font-bold mb-3">
          Select <span className="text-[#8150CC]">Geographic Scope</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          The geographic reach of your role.
        </p>
      </header>

      {/* Geographic Scope Selection */}
      <div className="mb-10">
        <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Geographic Scope
        </label>

        {/* Custom Dropdown */}
        <div className="relative">
          {/* Selected value display */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full px-5 py-4 rounded-xl border-2 bg-white dark:bg-gray-800 transition-all flex items-center justify-between ${errors.geographicScope
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-[#8150CC] focus:ring-2 focus:ring-[#8150CC]/20"
              } focus:outline-none`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${selectedGeographicScope ? "border-[#8150CC] bg-[#8150CC]/10" : "border-gray-300 dark:border-gray-600"
                }`}>
                {selectedGeographicScope && (
                  <Check className="w-4 h-4 text-[#8150CC]" />
                )}
              </div>
              <span className={`text-lg ${selectedGeographicScope ? "text-gray-900 dark:text-white font-medium" : "text-gray-500"}`}>
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
              id="geographic-scope-dropdown-portal"
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
                    placeholder="Search geographic scopes..."
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
                {filteredOptions.length === 0 ? (
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
                    {filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleGeographicScopeSelect(option.value)}
                        className={`w-full px-5 py-3.5 text-left transition-all flex items-center gap-4 hover:pl-6 ${selectedGeographicScope === option.value
                          ? "bg-gradient-to-r from-[#8150CC]/10 to-transparent border-r-4 border-[#8150CC]"
                          : "hover:bg-gray-50 dark:hover:bg-gray-750"
                          }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedGeographicScope === option.value
                          ? "border-[#8150CC] bg-[#8150CC]"
                          : "border-gray-300 dark:border-gray-600"
                          }`}>
                          {selectedGeographicScope === option.value && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="text-left">
                          <span className={`text-base ${selectedGeographicScope === option.value
                            ? "text-[#8150CC] font-medium"
                            : "text-gray-700 dark:text-gray-300"
                            }`}>
                            {option.label}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {option.value === "local" && "City or local area"}
                            {option.value === "regional" && "State, province, or regional area"}
                            {option.value === "national" && "Country-wide operations"}
                            {option.value === "global" && "International or worldwide scope"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>,
            document.body
          )}
        </div>

        {errors.geographicScope && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">!</span>
            {errors.geographicScope}
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        {onBack && (
          <button
            onClick={onBack}
            className="px-8 py-3.5 rounded-full border-2 border-gray-300 dark:border-gray-600 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back
          </button>
        )}
        <button
          onClick={handleContinue}
          className="px-10 py-3.5 rounded-full font-bold text-lg bg-accent text-white hover:shadow-lg hover:shadow-[#8150CC]/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 ml-auto"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default GeographicScopeForm;
