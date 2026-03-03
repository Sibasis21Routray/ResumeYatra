import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Edit, Download, ChevronRight, LogOut, CheckCircle2, ChevronLeft } from 'lucide-react';

type ExperienceLevel = 'Student' | 'Fresher' | 'Experienced' | '';
type CompanyType = 'Local' | 'Multinational' | 'Abroad' | 'Other' | '';
type Industry = 'Technology' | 'Finance and business' | 'Healthcare' | 'Education' | 'Other';

function LiveCareerApp() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('');
  const [companyType, setCompanyType] = useState<CompanyType>('');
  const [industries, setIndustries] = useState<Industry[]>([]);

  const navigate = useNavigate();

  const handleNext = (): void => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    } else {
      console.log('Form completed with:', { experienceLevel, companyType, industries });
      navigate('/templates');
    }
  };

  const handleBack = (): void => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const isCurrentStepValid = (): boolean => {
    switch (currentPage) {
      case 1: return experienceLevel !== '';
      case 2: return companyType !== '';
      case 3: return industries.length > 0;
      default: return true;
    }
  };

  const renderStepContent = () => {
    switch (currentPage) {
      case 0:
        return (
          <div className="flex flex-col items-center animate-fadeIn w-full">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 text-center leading-tight px-2">
              Create a <span className="text-[#044981] relative">
                job-winning
                <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 3.5C50 1.5 150 1.5 199 3.5" stroke="#0660a9" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span> CV in minutes
            </h1>
            <p className="text-gray-600 text-sm xs:text-base sm:text-lg mb-12 sm:mb-16 md:mb-20 text-center max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl px-4">
              Stand out from the crowd with a professionally crafted resume that gets you noticed
            </p>

            <div className="flex flex-col lg:flex-row items-start justify-center w-full gap-8 lg:gap-6 mb-12 sm:mb-16 max-w-5xl px-2 sm:px-4">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center flex-1 group">
                <div className="relative mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 bg-[#000066] rounded-full text-white text-xs sm:text-sm flex items-center justify-center font-bold shadow-lg z-10">
                    1
                  </div>
                  <div className="bg-gradient-to-br from-[#f4f7ff] to-[#e8f0ff] p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300">
                    <FileText className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-[#044981]" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">Choose Template</h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-[180px] xs:max-w-[200px] sm:max-w-[220px] leading-relaxed">
                  Select from professionally designed templates tailored to your industry
                </p>
              </div>

              {/* Arrow for medium+ screens */}
              <div className="hidden md:flex items-center px-4 lg:px-6 xl:px-8 self-start mt-8 lg:mt-10 xl:mt-12">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#0660a9] opacity-40" />
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#0660a9] opacity-40 -ml-2 sm:-ml-3" />
              </div>

              {/* Arrow for small screens */}
              <div className="md:hidden flex justify-center my-2">
                <ChevronRight className="w-5 h-5 text-[#0660a9] opacity-40 rotate-90" />
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center flex-1 group">
                <div className="relative mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 bg-[#000066] rounded-full text-white text-xs sm:text-sm flex items-center justify-center font-bold shadow-lg z-10">
                    2
                  </div>
                  <div className="bg-gradient-to-br from-[#f4f7ff] to-[#e8f0ff] p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300">
                    <Edit className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-[#044981]" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">Customize Content</h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-[180px] xs:max-w-[200px] sm:max-w-[220px] leading-relaxed">
                  Add pre-written examples and personalize each section with ease
                </p>
              </div>

              {/* Arrow for medium+ screens */}
              <div className="hidden md:flex items-center px-4 lg:px-6 xl:px-8 self-start mt-8 lg:mt-10 xl:mt-12">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#0660a9] opacity-40" />
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#0660a9] opacity-40 -ml-2 sm:-ml-3" />
              </div>

              {/* Arrow for small screens */}
              <div className="md:hidden flex justify-center my-2">
                <ChevronRight className="w-5 h-5 text-[#0660a9] opacity-40 rotate-90" />
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center flex-1 group">
                <div className="relative mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 bg-[#000066] rounded-full text-white text-xs sm:text-sm flex items-center justify-center font-bold shadow-lg z-10">
                    3
                  </div>
                  <div className="bg-gradient-to-br from-[#f4f7ff] to-[#e8f0ff] p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300">
                    <Download className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-[#044981]" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">Download & Apply</h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-[180px] xs:max-w-[200px] sm:max-w-[220px] leading-relaxed">
                  Export your resume and start applying to your dream jobs
                </p>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg mx-auto animate-fadeIn px-2 sm:px-4">
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <div className="inline-block bg-[#f4f7ff] text-[#044981] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                Step 1 of 3
              </div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 px-2">
                Experience Level
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base px-2">
                Select your current experience level
              </p>
            </div>
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {(['Student', 'Fresher', 'Experienced'] as ExperienceLevel[]).map((level, idx) => (
                <button
                  key={level}
                  onClick={() => setExperienceLevel(level)}
                  style={{ animationDelay: `${idx * 100}ms` }}
                  className={`w-full p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl border-2 text-left transition-all duration-300 flex justify-between items-center animate-slideIn hover:scale-[1.02] active:scale-[0.98] ${experienceLevel === level
                    ? 'border-[#044981] bg-gradient-to-r from-[#f4f7ff] to-[#e8f0ff] shadow-md sm:shadow-lg'
                    : 'border-gray-200 bg-white hover:border-[#0660a9] hover:shadow-sm sm:hover:shadow-md'
                    }`}
                >
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">{level}</span>
                  {experienceLevel === level && (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#044981] animate-scaleIn" fill="currentColor" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg mx-auto animate-fadeIn px-2 sm:px-4">
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <div className="inline-block bg-[#f4f7ff] text-[#044981] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                Step 2 of 3
              </div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 px-2">
                Company Type
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base px-2">
                Select the type of company you prefer
              </p>
            </div>
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {(['Local', 'Multinational', 'Abroad', 'Other'] as CompanyType[]).map((type, idx) => (
                <button
                  key={type}
                  onClick={() => setCompanyType(type)}
                  style={{ animationDelay: `${idx * 100}ms` }}
                  className={`w-full p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl border-2 text-left transition-all duration-300 flex justify-between items-center animate-slideIn hover:scale-[1.02] active:scale-[0.98] ${companyType === type
                    ? 'border-[#044981] bg-gradient-to-r from-[#f4f7ff] to-[#e8f0ff] shadow-md sm:shadow-lg'
                    : 'border-gray-200 bg-white hover:border-[#0660a9] hover:shadow-sm sm:hover:shadow-md'
                    }`}
                >
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">{type}</span>
                  {companyType === type && (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#044981] animate-scaleIn" fill="currentColor" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg mx-auto animate-fadeIn px-2 sm:px-4">
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <div className="inline-block bg-[#f4f7ff] text-[#044981] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                Step 3 of 3
              </div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 px-2">
                Target Industries
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base px-2">
                Select all that apply to personalize your content
              </p>
            </div>
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {(['Technology', 'Finance and business', 'Healthcare', 'Education', 'Other'] as Industry[]).map((industry, idx) => (
                <button
                  key={industry}
                  onClick={() => {
                    setIndustries(prev => prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]);
                  }}
                  style={{ animationDelay: `${idx * 100}ms` }}
                  className={`w-full p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl border-2 text-left transition-all duration-300 flex justify-between items-center animate-slideIn hover:scale-[1.02] active:scale-[0.98] ${industries.includes(industry)
                    ? 'border-[#044981] bg-gradient-to-r from-[#f4f7ff] to-[#e8f0ff] shadow-md sm:shadow-lg'
                    : 'border-gray-200 bg-white hover:border-[#0660a9] hover:shadow-sm sm:hover:shadow-md'
                    }`}
                >
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">{industry}</span>
                  {industries.includes(industry) && (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#044981] animate-scaleIn" fill="currentColor" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fafcff] to-[#f4f7ff] flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#044981] to-[#0660a9] px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        <button
          onClick={() => setCurrentPage(0)}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity z-10"
        >
          <div className="flex flex-col gap-0.5 leading-none">
            <Link to="/">
              <img className='h-10 sm:h-12 md:h-14' src="./white_logo.png" alt="ResumeYatra Logo" />
            </Link>
          </div>
        </button>
        <button
          onClick={() => {
            console.log('Logout clicked');
          }}
          className="hover:bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all flex items-center gap-2 font-medium z-10 active:scale-95 text-sm sm:text-base"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden xs:inline">Logout</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-2 xs:px-4 pt-6 sm:pt-10 md:pt-12 lg:pt-16 xl:pt-20 pb-12 sm:pb-16 md:pb-20">
        {/* Progress Bar */}
        {currentPage > 0 && (
          <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg mb-6 sm:mb-8 px-2">
            <div className="flex gap-1.5 sm:gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 sm:h-2 flex-1 rounded-full transition-all duration-500 ${step <= currentPage ? 'bg-[#044981]' : 'bg-gray-200'
                    }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="w-full max-w-6xl px-2 sm:px-4">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 sm:mt-12 md:mt-16 flex flex-col items-center gap-4 sm:gap-5 w-full px-4">
          <button
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className={`group px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all duration-300 shadow-lg flex items-center gap-2 sm:gap-3 w-full max-w-xs sm:max-w-sm md:max-w-md ${isCurrentStepValid()
              ? 'bg-gradient-to-r from-[#04477E] to-[#0660a9] text-white hover:shadow-xl hover:scale-105 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <span className="flex-1">
              {currentPage === 0 ? "Let's Get Started" : currentPage === 3 ? "Complete Setup" : "Continue"}
            </span>
            {isCurrentStepValid() && (
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            )}
          </button>

          {currentPage > 0 && (
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-[#044981] font-medium flex items-center gap-2 group transition-colors text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Go Back
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 sm:py-6 border-t border-gray-200 text-center bg-white/50 backdrop-blur-sm px-4">
        <p className="text-xs text-gray-500">© 2024 ResumeYatra. All rights reserved. Terms & Privacy.</p>
      </footer>
    </div>
  );
}

export default LiveCareerApp;