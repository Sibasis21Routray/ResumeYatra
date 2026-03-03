import React from 'react';
import { Building2 } from 'lucide-react';

// Import images (you'll need to add these to your project)
// For Next.js, you might use next/image
const Strap = () => {
  const companies = [
    { 
      name: 'Google', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      width: 90,
      height: 30
    },
    { 
      name: 'Amazon', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      width: 90,
      height: 30
    },
    { 
      name: 'IBM', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
      width: 70,
      height: 30
    },
    { 
      name: 'Accenture', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
      width: 100,
      height: 30
    }
  ];

  // Create duplicate array for infinite scroll
  const scrollingCompanies = [...companies, ...companies, ...companies];

  return (
    <div className="w-full bg-white dark:bg-gray-900  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        {/* Heading */}
        <div className="text-center mb-12">
         
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Our customers work at world-class companies
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands of professionals who've advanced their careers at these renowned organizations
          </p>
        </div>

        {/* Desktop - Infinite Scrolling Strip */}
        <div className="hidden md:block overflow-hidden relative">
          {/* Gradient overlays */}
          {/* <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white dark:from-gray-900 via-white/80 dark:via-gray-900/80 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white dark:from-gray-900 via-white/80 dark:via-gray-900/80 to-transparent z-10"></div>
           */}
          <div className="flex animate-scroll">
            {scrollingCompanies.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex-shrink-0 mx-10 group"
              >
                <div className="flex items-center justify-center h-20 px-6">
                  {/* Company Logo with fallback */}
                  <div className="relative">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      width={company.width}
                      height={company.height}
                      className="object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 filter grayscale group-hover:grayscale-0"
                      style={{ maxHeight: '40px', width: 'auto' }}
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback text */}
                    <div className="hidden absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-400 dark:text-gray-500">
                        {company.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile - Grid Layout with Images */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-4">
            {companies.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 group"
              >
                <div className="relative h-12 flex items-center justify-center">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={company.width}
                    height={company.height}
                    className="object-contain opacity-70 group-hover:opacity-100 transition-all duration-300"
                    style={{ maxHeight: '32px', width: 'auto' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback text */}
                  <span className="hidden text-base font-medium text-gray-600 dark:text-gray-300">
                    {company.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

       
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 2rem));
          }
        }
        
        .animate-scroll {
          animation: scroll 50s linear infinite;
          width: fit-content;
          will-change: transform;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        
        /* Smooth performance */
        .animate-scroll {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }
        
        /* Image optimization */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
};

export default Strap;