import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Briefcase,
    GraduationCap,
    Users,
    Award,
    BookOpen,
    Star,
    Trophy,
    ChevronRight,
    CheckCircle,
    Plus,
    Heart,
} from "lucide-react";
import { useResumeStore } from "../../stores";

interface SubOption {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    dataKey: string;
    count: number;
}

const SUB_OPTIONS: SubOption[] = [
  {
    id: "careerObjective",
    label: "Career Objective",
    description: "Define your goal",
    icon: <Plus className="w-6 h-6" />,
    dataKey: "careerObjective",
    count: 0,
  },
  {
    id: "internship",
    label: "Internship",
    description: "Add internships",
    icon: <Briefcase className="w-6 h-6" />,
    dataKey: "internships",
    count: 0,
  },
  {
    id: "academicProject",
    label: "Academic Project",
    description: "Highlight your projects",
    icon: <GraduationCap className="w-6 h-6" />,
    dataKey: "academicProjects",
    count: 0,
  },
  {
    id: "trainingProgram",
    label: "Training Program",
    description: "List certifications",
    icon: <BookOpen className="w-6 h-6" />,
    dataKey: "trainingPrograms",
    count: 0,
  },
  {
    id: "leadershipPosition",
    label: "Leadership Positions",
    description: "Highlight leadership roles",
    icon: <Users className="w-6 h-6" />,
    dataKey: "leadershipPositions",
    count: 0,
  },
  {
    id: "scholarship",
    label: "Scholarships",
    description: "List your scholarships",
    icon: <Award className="w-6 h-6" />,
    dataKey: "scholarships",
    count: 0,
  },
  {
    id: "coCurricular",
    label: "Co-curricular",
    description: "Add academic activities",
    icon: <Star className="w-6 h-6" />,
    dataKey: "coCurricular",
    count: 0,
  },
  {
    id: "extraCurricular",
    label: "Extra-curricular",
    description: "Add non-academic activities",
    icon: <Trophy className="w-6 h-6" />,
    dataKey: "extracurricular",
    count: 0,
  },
];

interface AcademicCampusExperienceFormProps {
    onBack?: () => void;
    onNext?: () => void;
    onNavigateToSubSection?: (subsectionId: string) => void;
}

export function AcademicCampusExperienceForm({
    onBack,
    onNext,
    onNavigateToSubSection,
}: AcademicCampusExperienceFormProps) {
    const navigate = useNavigate();
    const { data } = useResumeStore();
    const [selectedSubSection, setSelectedSubSection] = useState<string | null>(null);

    // Calculate counts for each sub-option based on actual data
    const subOptionsWithCounts = SUB_OPTIONS.map((option) => {
        let count = 0;
        if (option.id === "careerObjective") {
            // careerObjective is a string, check if it has content
            count = (data.careerObjective && typeof data.careerObjective === 'string' && data.careerObjective.trim().length > 0) ? 1 : 0;
        } else {
            count = (data as any)?.[option.dataKey]?.length || 0;
        }
        return {
            ...option,
            count,
        };
    });

    const handleSubOptionClick = (subOptionId: string) => {
        setSelectedSubSection(subOptionId);
        if (onNavigateToSubSection) {
            onNavigateToSubSection(subOptionId);
        }
    };

    const totalEntries = subOptionsWithCounts.reduce((sum, opt) => sum + opt.count, 0);

    const renderSubOptions = () => (
        <div>
            <h2 className="text-3xl font-bold mb-2">
                For Student, Fresher & Early Career
            </h2>
             <p className="text-sm text-gray-600 mb-8 max-w-xl">
              Add academic wins, internships, and campus roles to stand out.
            </p>

            {/* Summary Stats */}
            {totalEntries > 0 && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">
                        ✓ You have added {totalEntries} entry/totalEntries across all categories
                    </p>
                </div>
            )}

            {/* Sub-options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subOptionsWithCounts.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleSubOptionClick(option.id)}
                        className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left group"
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-200">
                            {option.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">
                                    {option.label}
                                </h3>
                                {option.count > 0 && (
                                    <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                                        <CheckCircle className="w-4 h-4" />
                                        {option.count}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        </div>
                        <ChevronRight className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="w-full px-4">
            {renderSubOptions()}

            <h4 className="mb-10 mt-5 text-gray-600">Add only sections that strengthen your profile. You don't need to fill everything.</h4>

            {/* Footer */}
            <div className="flex justify-between mt-12">
                <button
                    onClick={onBack}
                    className="px-10 py-3 rounded-full border-2 border-black font-semibold hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="px-8 py-2.5 rounded-full bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-bg-primary font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default AcademicCampusExperienceForm;