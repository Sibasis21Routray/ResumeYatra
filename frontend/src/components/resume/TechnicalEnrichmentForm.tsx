import React from "react";
import { useNavigate, useParams } from "react-router-dom";

interface TechnicalEnrichmentFormProps {
    onBack?: () => void;
    onNext?: () => void;
    onNavigateToSection?: (section: string) => void;
}

export function TechnicalEnrichmentForm({
    onBack,
    onNext,
    onNavigateToSection,
}: TechnicalEnrichmentFormProps) {
    const navigate = useNavigate();
    const { id } = useParams();

    const technicalEnrichmentOptions = [
        { name: "Tools & Technologies", form: "toolsTechnologies" },
        { name: "Methodologies", form: "methodologies" },
        { name: "Industry Expertise", form: "industryExpertise" },
    ];

    return (
        <div className="mb-8">
            <div className="relative bg-gradient-to-r from-[#04477E] to-[#0a5a9e] rounded-xl p-6 mb-6 shadow-lg">
                <div className="absolute inset-0 bg-black/10 rounded-xl" />
                <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Technical Enrichment</h3>
                        <div className="text-white/80 text-sm">Showcase your technical skills and expertise.</div>
                    </div>
                    <div className="mt-3 sm:mt-0">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                            <span className="text-white text-sm font-medium">3 Options</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {technicalEnrichmentOptions.map((option) => (
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
                    onClick={() => {
                        if (onNavigateToSection) {
                            onNavigateToSection("customSections");
                        }
                    }}
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