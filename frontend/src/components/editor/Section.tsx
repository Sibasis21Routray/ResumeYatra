import React from 'react';

// Utility function to check if a section has content
export const hasContent = (value: any): boolean => {
  if (value == null) return false;
  
  // String content (summary, etc.)
  if (typeof value === 'string') {
    const stripped = value.replace(/<[^>]*>/g, '').trim();
    return stripped.length > 0;
  }
  
  // Array content (experience, education, projects, skills, languages, etc.)
  if (Array.isArray(value)) {
    if (value.length === 0) return false;
    // Check if any item in the array has content
    return value.some(item => {
      if (!item) return false;
      if (typeof item === 'string') {
        return item.replace(/<[^>]*>/g, '').trim().length > 0;
      }
      if (typeof item === 'object') {
        return Object.values(item).some(val => 
          String(val || '').replace(/<[^>]*>/g, '').trim().length > 0
        );
      }
      return false;
    });
  }
  
  // Object content (personal info, etc.)
  if (typeof value === 'object') {
    return Object.values(value).some(val => {
      if (val == null) return false;
      if (typeof val === 'string') {
        return val.replace(/<[^>]*>/g, '').trim().length > 0;
      }
      if (Array.isArray(val)) {
        return val.length > 0 && hasContent(val);
      }
      return false;
    });
  }
  
  return false;
};

// Reusable Section Component
interface SectionProps {
  title: string;
  data?: any;
  children: React.ReactNode;
  className?: string;
  showHeading?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  title,
  data,
  children,
  className = '',
  showHeading = true
}) => {
  const shouldRender = hasContent(data) || children;
  
  if (!shouldRender) return null;
  
  return (
    <div 
      data-section={title.toLowerCase().replace(/\s+/g, '-')} 
      className={`section ${className}`}
    >
      {showHeading && (
        <h2 className="section-title text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

// Conditional wrapper component for inline conditional rendering
interface ConditionalRenderProps {
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  condition,
  children,
  fallback = null
}) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};

// Hook for managing section visibility
export const useSectionVisibility = () => {
  const checkSectionEmpty = (sectionData: any): boolean => {
    return !hasContent(sectionData);
  };
  
  return { checkSectionEmpty, hasContent };
};

export default Section;

