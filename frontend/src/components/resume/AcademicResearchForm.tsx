import React from "react";
import { useNavigate, useParams } from "react-router-dom";

interface AcademicResearchFormProps {
    onBack?: () => void;
    onNext?: () => void;
    onNavigateToSection?: (section: string) => void;
}

export function AcademicResearchForm({
    onBack,
    onNext,
    onNavigateToSection,
}: AcademicResearchFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();

    const academicResearchOptions = [
        { name: "Teaching Experience", form: "teachingExperience" },
        { name: "Mentorship Experience", form: "mentorshipExperience" },
        { name: "Research Grants", form: "researchGrants" },
        { name: "Test Scores", form: "testScores" },
        { name: "Publications", form: "publications" },
        { name: "Patents", form: "patents" },
    ];

    return (
        <div className="mb-8">
            <div className="relative bg-gradient-to-r from-[#04477E] to-[#0a5a9e] rounded-xl p-6 mb-6 shadow-lg">
                <div className="absolute inset-0 bg-black/10 rounded-xl" />
                <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Academic & Research</h3>
                        <div className="text-white/80 text-sm">Showcase your academic and research achievements.</div>
                    </div>
                    <div className="mt-3 sm:mt-0">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                            <span className="text-white text-sm font-medium">6 Options</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {academicResearchOptions.map((option) => (
                    <button
                        key={option.name}
                        onClick={() => {
                            if (onNavigateToSection) {
                                onNavigateToSection(option.form);
                            }
                        }}
                        className="group relative px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-[#04477E] dark:hover:border-[#0a5a9e] hover:shadow-md transition-all text-left"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-[#04477E]/10 rounded-lg flex items-center justify-center group-hover:bg-[#04477E]/20 transition-colors">
                                <svg className="w-4 h-4 text-[#04477E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#04477E] dark:group-hover:text-[#0a5a9e] transition-colors">{option.name}</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center mt-8 sm:mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={onBack}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all text-sm sm:text-base"
                >
                    <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back</span>
                    </span>
                </button>
                <button
                    onClick={() => navigate("/preview/" + id)}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#04477E] to-[#0a5a9e] text-white font-bold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base hover:from-[#033b66] hover:to-[#0956a8]"
                >
                    <span className="flex items-center space-x-2">
                        <span>Continue</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    );
}