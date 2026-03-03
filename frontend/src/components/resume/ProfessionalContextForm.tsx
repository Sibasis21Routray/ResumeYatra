import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Info, ChevronRight, ChevronDown, X, AlertCircle, Search } from "lucide-react";
import { useResumeStore } from "../../stores";
import toast from 'react-hot-toast';

// Toast configuration
const toastStyle = {
  success: { background: '#10b981', color: '#fff', icon: '✅' },
  error: { background: '#ef4444', color: '#fff', icon: '❌' },
  warning: { background: '#f59e0b', color: '#fff', icon: '⚠️' }
};

interface ProfessionalContextFormProps {
    onBack?: () => void;
    onNext?: () => void;
    onNavigateToSubSection?: (subsectionId: string) => void;
}

// Industry List (Universal Coverage)
const INDUSTRY_OPTIONS = [
    "BFSI & Financial Services",
    "Insurance",
    "Fintech",
    "Information Technology & Software",
    "IT Services & Consulting",
    "Healthcare & Life Sciences",
    "Pharmaceuticals & Biotechnology",
    "Manufacturing & Engineering",
    "Automotive & Mobility",
    "Real Estate & Infrastructure",
    "Construction & EPC",
    "Retail & E-commerce",
    "FMCG / Consumer Goods",
    "Logistics, Supply Chain & Transportation",
    "Telecommunications",
    "Media, Advertising & Entertainment",
    "Education & EdTech",
    "Energy, Power & Utilities",
    "Oil, Gas & Mining",
    "Agriculture & Agribusiness",
    "Hospitality, Travel & Tourism",
    "Aviation & Aerospace",
    "Government & Public Sector",
    "Defense & Security",
    "NGOs & Non-Profit",
    "Legal Services",
    "Accounting, Audit & Tax",
    "Staffing, HR & Recruitment",
    "Research & Analytics",
    "Other / Multi-Industry"
].sort(); // Sort alphabetically

// Functional Domain Options with Groups
const FUNCTIONAL_DOMAIN_GROUPS = [
    {
        group: "A. Business & Management",
        options: [
            "Business Development",
            "Sales & Revenue",
            "Marketing & Growth",
            "Strategy & Planning",
            "Operations & Process Management",
            "General Management / Leadership"
        ].sort() // Alphabetical within group
    },
    {
        group: "B. Technology",
        options: [
            "Software Engineering",
            "Data Analytics & BI",
            "Data Science & AI",
            "Cloud & Infrastructure",
            "Cybersecurity",
            "QA / Testing",
            "IT Support & Systems"
        ].sort()
    },
    {
        group: "C. Product & Delivery",
        options: [
            "Product Management",
            "Program & Project Management",
            "UX / UI Design"
        ].sort()
    },
    {
        group: "D. People & Organization",
        options: [
            "Human Resources",
            "Talent Acquisition",
            "Learning & Development",
            "HR Operations"
        ].sort()
    },
    {
        group: "E. Finance, Risk & Legal",
        options: [
            "Finance & Accounting",
            "Audit & Compliance",
            "Risk Management",
            "Treasury & Investments",
            "Legal & Corporate Affairs"
        ].sort()
    },
    {
        group: "F. Operations & Supply Chain",
        options: [
            "Supply Chain & Logistics",
            "Procurement & Vendor Management",
            "Manufacturing Operations",
            "Quality Control"
        ].sort()
    },
    {
        group: "G. Research & Specialized",
        options: [
            "Research & Development",
            "Regulatory Affairs",
            "Clinical / Medical"
        ].sort()
    },
    {
        group: "H. Customer & Support",
        options: [
            "Customer Success",
            "Customer Support",
            "Relationship Management"
        ].sort()
    },
    {
        group: "I. Other",
        options: [
            "Freelance / Consulting",
            "Entrepreneurship",
            "Internship / Trainee",
            "Academia / Teaching",
            "Other Functional Role"
        ].sort()
    }
];

// Format to Title Case
const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

// Validate custom role input
const validateCustomRole = (value: string): { isValid: boolean; error?: string } => {
    const trimmed = value.trim();
    
    if (!trimmed) return { isValid: false, error: "Role is required" };
    
    if (trimmed.length < 3) return { isValid: false, error: "Must be at least 3 characters" };
    
    if (trimmed.length > 40) return { isValid: false, error: "Must be less than 40 characters" };
    
    // Check for numbers
    if (/\d/.test(trimmed)) return { isValid: false, error: "Numbers are not allowed" };
    
    // Check for emojis and punctuation (allow only letters, spaces, &)
    if (/[^\w\s&]/.test(trimmed)) return { isValid: false, error: "Only letters, spaces, and & are allowed" };
    
    // Check for commas or slashes (multiple roles)
    if (/[,/]/.test(trimmed)) return { isValid: false, error: "Enter one role only (no commas or slashes)" };
    
    // Check for common invalid phrases
    const invalidPhrases = ["multiple roles", "doing everything", "n/a", "na", "none", "various"];
    if (invalidPhrases.some(phrase => trimmed.toLowerCase().includes(phrase))) {
        return { isValid: false, error: "Please enter a specific role name" };
    }
    
    return { isValid: true };
};

// Section Card Component
const SectionCard = ({ title, description, children, icon, required, isDropdownOpen }: {
    title: string;
    description?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    required?: boolean;
    isDropdownOpen?: boolean;
}) => (
    <div className={`bg-bg-primary dark:bg-dark-bg-primary rounded-xl border border-light-border dark:border-dark-border shadow-sm ${
        isDropdownOpen ? 'overflow-visible' : 'overflow-hidden'
    }`}>
        <div className="px-5 py-4 border-b border-light-border dark:border-dark-border bg-gradient-to-r from-bg-secondary/30 to-transparent">
            <div className="flex items-center gap-3">
                {icon && <div className="text-accent dark:text-dark-accent">{icon}</div>}
                <div>
                    <h4 className="text-base font-semibold text-text-primary dark:text-dark-text-primary flex items-center gap-2">
                        {title}
                        {required && (
                            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                                Required
                            </span>
                        )}
                    </h4>
                    {description && (
                        <p className="text-sm text-text-muted dark:text-dark-text-muted mt-0.5">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
        <div className="p-5">
            {children}
        </div>
    </div>
);

// Tooltip Component
const Tooltip = ({ content, children }: { content: string; children: React.ReactNode }) => {
    const [show, setShow] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setShow(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={tooltipRef}>
            <div
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className="cursor-help"
            >
                {children}
            </div>
            {show && (
                <div className="absolute z-[10000] w-64 p-2 text-xs bg-gray-900 text-white rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-1">
                    <div className="relative">
                        {content}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Industry Select Component with Search
const IndustrySelect = ({
    value,
    onChange,
    error,
    onOpenChange
}: {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onOpenChange?: (isOpen: boolean) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        onOpenChange?.(isOpen);
    }, [isOpen, onOpenChange]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch("");
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredIndustries = INDUSTRY_OPTIONS.filter(industry =>
        industry.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative w-full" ref={selectRef} style={{ zIndex: isOpen ? 9999 : 'auto' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg cursor-pointer flex items-center justify-between transition-all ${
                    error 
                        ? 'border-red-500' 
                        : 'border-light-border dark:border-dark-border hover:border-accent'
                }`}
            >
                <span className={value ? 'text-text-primary' : 'text-text-muted'}>
                    {value || "Select industry"}
                </span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div 
                    className="absolute z-[10000] w-full mt-1 bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-lg shadow-lg"
                    style={{ 
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                    }}
                >
                    {/* Search input */}
                    <div className="p-2 border-b border-light-border dark:border-dark-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search industries..."
                                className="w-full pl-9 pr-3 py-2 bg-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Options list */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredIndustries.length > 0 ? (
                            filteredIndustries.map((industry) => (
                                <div
                                    key={industry}
                                    onClick={() => {
                                        onChange(industry);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    className={`px-4 py-2.5 cursor-pointer hover:bg-accent/10 dark:hover:bg-dark-accent/10 text-sm ${
                                        value === industry 
                                            ? 'bg-accent/10 text-accent font-medium' 
                                            : 'text-text-primary'
                                    }`}
                                >
                                    {industry}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-text-muted text-sm">
                                No industries found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Functional Domain Select Component with Groups and Search
const FunctionalDomainSelect = ({
    value,
    onChange,
    error,
    onOpenChange
}: {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onOpenChange?: (isOpen: boolean) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        onOpenChange?.(isOpen);
    }, [isOpen, onOpenChange]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch("");
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter groups based on search
    const filteredGroups = FUNCTIONAL_DOMAIN_GROUPS.map(group => ({
        ...group,
        options: group.options.filter(opt => 
            opt.toLowerCase().includes(search.toLowerCase())
        )
    })).filter(group => group.options.length > 0);

    return (
        <div className="relative w-full" ref={selectRef} style={{ zIndex: isOpen ? 9999 : 'auto' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg cursor-pointer flex items-center justify-between transition-all ${
                    error 
                        ? 'border-red-500' 
                        : 'border-light-border dark:border-dark-border hover:border-accent'
                }`}
            >
                <span className={value ? 'text-text-primary' : 'text-text-muted'}>
                    {value || "Select functional domain"}
                </span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div 
                    className="absolute z-[10000] w-full mt-1 bg-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-lg shadow-lg"
                    style={{ 
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                    }}
                >
                    {/* Search input */}
                    <div className="p-2 border-b border-light-border dark:border-dark-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search functional domains..."
                                className="w-full pl-9 pr-3 py-2 bg-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Grouped options */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <div key={group.group}>
                                    <div className="px-4 py-2 bg-bg-secondary/50 dark:bg-dark-bg-secondary/50 text-xs font-semibold text-text-muted uppercase tracking-wider">
                                        {group.group}
                                    </div>
                                    {group.options.map((option) => (
                                        <div
                                            key={option}
                                            onClick={() => {
                                                onChange(option);
                                                setIsOpen(false);
                                                setSearch("");
                                            }}
                                            className={`px-4 py-2.5 cursor-pointer hover:bg-accent/10 dark:hover:bg-dark-accent/10 text-sm ${
                                                value === option 
                                                    ? 'bg-accent/10 text-accent font-medium' 
                                                    : 'text-text-primary'
                                            }`}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-text-muted text-sm">
                                No functional domains found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export function ProfessionalContextForm({ onBack, onNext, onNavigateToSubSection }: ProfessionalContextFormProps) {
    const navigate = useNavigate();
    const { id: resumeId } = useParams();
    const { data, updateData, save } = useResumeStore();

    // Track which dropdowns are open
    const [openDropdowns, setOpenDropdowns] = useState({
        experience: false,
        teamSize: false,
        industry: false,
        functionalDomain: false,
        geographicScope: false,
        revenue: false
    });

    const [formData, setFormData] = useState({
        totalExperience: data.professionalContext?.totalExperience || "",
        teamSize: data.professionalContext?.teamSize || "",
        industry: data.professionalContext?.industry || "",
        industryCustom: data.professionalContext?.industryCustom || "",
        functionalDomain: data.professionalContext?.functionalDomain || "",
        functionalDomainCustom: data.professionalContext?.functionalDomainCustom || "",
        geographicScope: data.professionalContext?.geographicScope || "",
        revenueResponsibility: data.professionalContext?.revenueResponsibility || "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [customRoleError, setCustomRoleError] = useState<string>("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleCustomRoleChange = (value: string) => {
        // Auto-format to Title Case
        const formatted = toTitleCase(value);
        setFormData(prev => ({ ...prev, functionalDomainCustom: formatted }));
        
        // Validate
        const validation = validateCustomRole(formatted);
        if (!validation.isValid) {
            setCustomRoleError(validation.error || "");
        } else {
            setCustomRoleError("");
        }
    };

    const handleDropdownOpen = (dropdown: keyof typeof openDropdowns, isOpen: boolean) => {
        setOpenDropdowns(prev => ({ ...prev, [dropdown]: isOpen }));
    };

    // Check if any dropdown is open
    const isAnyDropdownOpen = Object.values(openDropdowns).some(Boolean);

    // Check if form is valid for submission
    const isFormValid = () => {
        // Required field: totalExperience must be selected
        if (!formData.totalExperience) return false;

        // Validate industry custom field if "Other / Multi-Industry" is selected
        if (formData.industry === "Other / Multi-Industry") {
            const industry = formData.industryCustom.trim();
            if (!industry || industry.length < 3 || industry.length > 40) return false;
        }

        // Validate functional domain custom field if "Other Functional Role" is selected
        if (formData.functionalDomain === "Other Functional Role") {
            const role = formData.functionalDomainCustom.trim();
            const validation = validateCustomRole(role);
            if (!validation.isValid) return false;
        }

        return true;
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        // Validate total experience
        if (!formData.totalExperience) {
            newErrors.totalExperience = "Total experience is required";
        }

        // Validate industry custom field
        if (formData.industry === "Other / Multi-Industry") {
            const industry = formData.industryCustom.trim();
            if (!industry) {
                newErrors.industryCustom = "Please specify your industry";
            } else if (industry.length < 3 || industry.length > 40) {
                newErrors.industryCustom = "Must be 3-40 characters";
            }
        }

        // Validate functional domain custom field
        if (formData.functionalDomain === "Other Functional Role") {
            const role = formData.functionalDomainCustom.trim();
            if (!role) {
                newErrors.functionalDomainCustom = "Please specify your functional role";
            } else {
                const validation = validateCustomRole(role);
                if (!validation.isValid) {
                    newErrors.functionalDomainCustom = validation.error || "Invalid role format";
                }
            }
        }

        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
            toast.error('Please fill in all required fields correctly', {
                style: toastStyle.error,
                duration: 3000,
            });
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = async () => {
        if (!isFormValid()) {
            // Show validation errors for all required fields
            validateForm();
            return;
        }

        const isValid = validateForm();
        if (!isValid) return;

        updateData((draft) => {
            draft.professionalContext = {
                totalExperience: formData.totalExperience || undefined,
                teamSize: formData.teamSize || undefined,
                industry: formData.industry || undefined,
                industryCustom: formData.industry === "Other / Multi-Industry" ? formData.industryCustom : undefined,
                functionalDomain: formData.functionalDomain || undefined,
                functionalDomainCustom: formData.functionalDomain === "Other Functional Role" ? formData.functionalDomainCustom : undefined,
                geographicScope: formData.geographicScope || undefined,
                revenueResponsibility: formData.revenueResponsibility || undefined,
            };
        });

        toast.success('Professional context saved successfully!', {
            style: toastStyle.success,
            duration: 2000,
        });

        if (onNext) {
            try {
                onNext();
            } catch (e) {
                console.error("[ProfessionalContextForm] onNext threw:", e);
            }
        } else {
            navigate(`/preview/${resumeId}`);
        }
    };

    // Experience options
    const EXPERIENCE_OPTIONS = [
        "Less than 1 year",
        "1–2 years",
        "3–5 years",
        "6–10 years",
        "11–15 years",
        "16+ years"
    ];

    // Team size options
    const TEAM_SIZE_OPTIONS = [
        "None (Individual Contributor)",
        "1–5",
        "6–10",
        "11–25",
        "26–50",
        "51–100",
        "101–250",
        "250+"
    ];

    // Geographic scope options
    const GEO_SCOPE_OPTIONS = [
        "Local",
        "Regional",
        "National",
        "Global"
    ];

    // Revenue options
    const REVENUE_OPTIONS = [
        "Not applicable",
        "Less than ₹1 Cr / $100k",
        "₹1–5 Cr / $100k–$500k",
        "₹5–25 Cr / $500k–$5M",
        "₹25–100 Cr / $5M–$20M",
        "₹100–500 Cr / $20M–$100M",
        "₹500+ Cr / $100M+"
    ];

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    Professional <span className="text-accent dark:text-dark-accent">Context</span>
                </h2>
                <p className="text-base text-text-muted dark:text-dark-text-muted">
                    Help us understand your role so we can generate accurate summaries and skills.
                </p>
            </div>

          

            {/* Form Grid */}
            <div className="space-y-6">
                {/* Total Experience - Required */}
                <SectionCard 
                    title="Total Experience" 
                    description="Your total professional experience across all roles."
                    icon={<Info className="w-5 h-5" />}
                    required
                    isDropdownOpen={isAnyDropdownOpen}
                >
                    <div className="max-w-md">
                        <select
                            value={formData.totalExperience}
                            onChange={(e) => handleChange("totalExperience", e.target.value)}
                            onBlur={() => handleBlur("totalExperience")}
                            className={`w-full px-4 py-3 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                errors.totalExperience && touched.totalExperience
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-light-border focus:ring-accent focus:border-accent'
                            }`}
                        >
                            <option value="">Select years of experience</option>
                            {EXPERIENCE_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        {errors.totalExperience && touched.totalExperience && (
                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.totalExperience}
                            </p>
                        )}
                    </div>
                </SectionCard>

                {/* Team Size */}
                <SectionCard 
                    title="Team Size (People Led)" 
                    description="Total number of people you were responsible for, directly or indirectly"
                    icon={<Info className="w-5 h-5" />}
                    isDropdownOpen={isAnyDropdownOpen}
                >
                    <div className="max-w-md">
                        <select
                            value={formData.teamSize}
                            onChange={(e) => handleChange("teamSize", e.target.value)}
                            className="w-full px-4 py-3 bg-bg-primary dark:bg-dark-bg-primary border border-light-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        >
                            <option value="">Select team size</option>
                            {TEAM_SIZE_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </SectionCard>

                {/* Industry / Sector */}
                <SectionCard 
                    title="Industry / Sector" 
                    description="The industry your company operates in."
                    icon={<Info className="w-5 h-5" />}
                    isDropdownOpen={isAnyDropdownOpen}
                >
                    <div className="space-y-3">
                        <div className="max-w-md">
                            <IndustrySelect
                                value={formData.industry}
                                onChange={(value) => handleChange("industry", value)}
                                error={errors.industry}
                                onOpenChange={(isOpen) => handleDropdownOpen('industry', isOpen)}
                            />
                        </div>
                        
                        {formData.industry === "Other / Multi-Industry" && (
                            <div className="max-w-md mt-3">
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    Specify Industry
                                </label>
                                <input
                                    type="text"
                                    value={formData.industryCustom}
                                    onChange={(e) => handleChange("industryCustom", e.target.value)}
                                    onBlur={() => handleBlur("industryCustom")}
                                    placeholder="e.g., Renewable Energy, EdTech"
                                    className={`w-full px-4 py-2.5 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        errors.industryCustom && touched.industryCustom
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-light-border focus:ring-accent focus:border-accent'
                                    }`}
                                    maxLength={40}
                                />
                                {errors.industryCustom && touched.industryCustom && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.industryCustom}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Tooltip */}
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                            <Tooltip content="This describes the business sector of your employer (e.g., Insurance, Fintech, Healthcare)">
                                <Info className="w-3.5 h-3.5 cursor-help" />
                            </Tooltip>
                            <span>Hover for more info</span>
                        </div>
                    </div>
                </SectionCard>

                {/* Functional Domain */}
                <SectionCard 
                    title="Functional Domain" 
                    description="Your primary area of work across roles."
                    icon={<Info className="w-5 h-5" />}
                    isDropdownOpen={isAnyDropdownOpen}
                >
                    <div className="space-y-3">
                        <div className="max-w-md">
                            <FunctionalDomainSelect
                                value={formData.functionalDomain}
                                onChange={(value) => handleChange("functionalDomain", value)}
                                error={errors.functionalDomain}
                                onOpenChange={(isOpen) => handleDropdownOpen('functionalDomain', isOpen)}
                            />
                        </div>

                        {formData.functionalDomain === "Other Functional Role" && (
                            <div className="max-w-md mt-3">
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    Specify Functional Role
                                </label>
                                <input
                                    type="text"
                                    value={formData.functionalDomainCustom}
                                    onChange={(e) => handleCustomRoleChange(e.target.value)}
                                    onBlur={() => handleBlur("functionalDomainCustom")}
                                    placeholder="e.g., Revenue Operations, Prompt Engineering"
                                    className={`w-full px-4 py-2.5 bg-bg-primary dark:bg-dark-bg-primary border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        (errors.functionalDomainCustom || customRoleError) && touched.functionalDomainCustom
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-light-border focus:ring-accent focus:border-accent'
                                    }`}
                                    maxLength={40}
                                />
                                {(errors.functionalDomainCustom || customRoleError) && touched.functionalDomainCustom && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.functionalDomainCustom || customRoleError}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-text-muted">
                                    Use a clear, commonly used role name. Avoid full sentences.
                                </p>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-text-muted">
                            <Tooltip content="This describes what you do (e.g., Business Development, Software Engineering), not the company's industry">
                                <Info className="w-3.5 h-3.5 cursor-help" />
                            </Tooltip>
                            <span>Hover for more info</span>
                        </div>
                    </div>
                </SectionCard>

                {/* Geographic Scope */}
                <SectionCard 
                    title="Geographic Scope" 
                    description="The geographic reach of your role"
                    icon={<Info className="w-5 h-5" />}
                    isDropdownOpen={isAnyDropdownOpen}
                >
                    <div className="max-w-md">
                        <select
                            value={formData.geographicScope}
                            onChange={(e) => handleChange("geographicScope", e.target.value)}
                            className="w-full px-4 py-3 bg-bg-primary dark:bg-dark-bg-primary border border-light-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        >
                            <option value="">Select geographic scope</option>
                            {GEO_SCOPE_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </SectionCard>

                {/* Revenue / Budget Responsibility */}
                <SectionCard 
                    title="Revenue / Budget Responsibility" 
                    description="Approximate annual revenue or budget you were responsible for."
                    icon={<Info className="w-5 h-5" />}
                    isDropdownOpen={isAnyDropdownOpen}
                >
                    <div className="space-y-3">
                        <div className="max-w-md">
                            <select
                                value={formData.revenueResponsibility}
                                onChange={(e) => handleChange("revenueResponsibility", e.target.value)}
                                className="w-full px-4 py-3 bg-bg-primary dark:bg-dark-bg-primary border border-light-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                            >
                                <option value="">Select range</option>
                                {REVENUE_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                            <Tooltip content="This is used only to improve wording. Numbers are not shown on your resume">
                                <Info className="w-3.5 h-3.5 cursor-help" />
                            </Tooltip>
                            <span>Hover for more info</span>
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
                    disabled={!isFormValid()}
                    className={`px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-base flex items-center gap-2 ${
                        isFormValid()
                            ? 'bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white cursor-pointer'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default ProfessionalContextForm;