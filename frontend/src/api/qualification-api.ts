// qualification-api.ts
export interface Qualification {
  id: string;
  name: string;
  type: 'degree' | 'certificate' | 'diploma' | 'professional' | 'vocational';
  category: string;
  abbreviation?: string;
  description?: string;
  duration?: string;
  level?: string;
}

export interface FieldOfStudy {
  id: string;
  name: string;
  category: 'business' | 'technology' | 'science' | 'arts' | 'health' | 'engineering' | 'law' | 'education';
  relatedQualifications: string[];
}

export interface EducationInstitution {
  id: string;
  name: string;
  type: 'university' | 'college' | 'institute' | 'school' | 'online';
  location: string;
  country: string;
  accreditation?: string[];
}

// Qualification suggestions database
export const qualifications: Qualification[] = [
  // Degrees
  { id: 'bsc', name: 'Bachelor of Science', type: 'degree', category: 'science', abbreviation: 'BSc', level: 'undergraduate' },
  { id: 'ba', name: 'Bachelor of Arts', type: 'degree', category: 'arts', abbreviation: 'BA', level: 'undergraduate' },
  { id: 'bcom', name: 'Bachelor of Commerce', type: 'degree', category: 'business', abbreviation: 'BCom', level: 'undergraduate' },
  { id: 'btech', name: 'Bachelor of Technology', type: 'degree', category: 'engineering', abbreviation: 'BTech', level: 'undergraduate' },
  { id: 'bca', name: 'Bachelor of Computer Applications', type: 'degree', category: 'technology', abbreviation: 'BCA', level: 'undergraduate' },
  { id: 'beng', name: 'Bachelor of Engineering', type: 'degree', category: 'engineering', abbreviation: 'BEng', level: 'undergraduate' },
  { id: 'bba', name: 'Bachelor of Business Administration', type: 'degree', category: 'business', abbreviation: 'BBA', level: 'undergraduate' },
  
  { id: 'msc', name: 'Master of Science', type: 'degree', category: 'science', abbreviation: 'MSc', level: 'postgraduate' },
  { id: 'ma', name: 'Master of Arts', type: 'degree', category: 'arts', abbreviation: 'MA', level: 'postgraduate' },
  { id: 'mba', name: 'Master of Business Administration', type: 'degree', category: 'business', abbreviation: 'MBA', level: 'postgraduate' },
  { id: 'mtech', name: 'Master of Technology', type: 'degree', category: 'engineering', abbreviation: 'MTech', level: 'postgraduate' },
  { id: 'mca', name: 'Master of Computer Applications', type: 'degree', category: 'technology', abbreviation: 'MCA', level: 'postgraduate' },
  { id: 'mphil', name: 'Master of Philosophy', type: 'degree', category: 'research', abbreviation: 'MPhil', level: 'postgraduate' },
  
  { id: 'phd', name: 'Doctor of Philosophy', type: 'degree', category: 'research', abbreviation: 'PhD', level: 'doctorate' },
  { id: 'edd', name: 'Doctor of Education', type: 'degree', category: 'education', abbreviation: 'EdD', level: 'doctorate' },
  
  // Diplomas
  { id: 'diploma', name: 'Diploma', type: 'diploma', category: 'general', level: 'diploma' },
  { id: 'pgd', name: 'Post Graduate Diploma', type: 'diploma', category: 'general', abbreviation: 'PGD', level: 'postgraduate' },
  { id: 'adv_diploma', name: 'Advanced Diploma', type: 'diploma', category: 'general', level: 'advanced' },
  
  // Certificates
  { id: 'cert', name: 'Certificate', type: 'certificate', category: 'general', level: 'certificate' },
  { id: 'prof_cert', name: 'Professional Certificate', type: 'certificate', category: 'professional', level: 'professional' },
  { id: 'voc_cert', name: 'Vocational Certificate', type: 'certificate', category: 'vocational', level: 'vocational' },
  
  // Professional Qualifications
  { id: 'cpa', name: 'Certified Public Accountant', type: 'professional', category: 'business', abbreviation: 'CPA' },
  { id: 'cfa', name: 'Chartered Financial Analyst', type: 'professional', category: 'business', abbreviation: 'CFA' },
  { id: 'pmp', name: 'Project Management Professional', type: 'professional', category: 'business', abbreviation: 'PMP' },
  { id: 'aws_cert', name: 'AWS Certified Solutions Architect', type: 'professional', category: 'technology' },
  { id: 'google_cert', name: 'Google Professional Cloud Architect', type: 'professional', category: 'technology' },
  { id: 'cisco_ccna', name: 'Cisco Certified Network Associate', type: 'professional', category: 'technology', abbreviation: 'CCNA' },
  { id: 'comptia_a+', name: 'CompTIA A+', type: 'professional', category: 'technology' },
  { id: 'scrum_master', name: 'Certified Scrum Master', type: 'professional', category: 'technology', abbreviation: 'CSM' },
];

export const fieldsOfStudy: FieldOfStudy[] = [
  { id: 'cs', name: 'Computer Science', category: 'technology', relatedQualifications: ['bsc', 'msc', 'btech', 'mtech'] },
  { id: 'it', name: 'Information Technology', category: 'technology', relatedQualifications: ['bsc', 'msc', 'bca', 'mca'] },
  { id: 'se', name: 'Software Engineering', category: 'technology', relatedQualifications: ['beng', 'meng', 'btech', 'mtech'] },
  { id: 'accounting', name: 'Accounting', category: 'business', relatedQualifications: ['bcom', 'mcom', 'cpa', 'acca'] },
  { id: 'finance', name: 'Finance', category: 'business', relatedQualifications: ['bcom', 'mba', 'cfa'] },
  { id: 'marketing', name: 'Marketing', category: 'business', relatedQualifications: ['bba', 'mba'] },
  { id: 'mechanical', name: 'Mechanical Engineering', category: 'engineering', relatedQualifications: ['beng', 'meng', 'btech', 'mtech'] },
  { id: 'civil', name: 'Civil Engineering', category: 'engineering', relatedQualifications: ['beng', 'meng', 'btech', 'mtech'] },
  { id: 'electrical', name: 'Electrical Engineering', category: 'engineering', relatedQualifications: ['beng', 'meng', 'btech', 'mtech'] },
  { id: 'biology', name: 'Biology', category: 'science', relatedQualifications: ['bsc', 'msc', 'phd'] },
  { id: 'chemistry', name: 'Chemistry', category: 'science', relatedQualifications: ['bsc', 'msc', 'phd'] },
  { id: 'physics', name: 'Physics', category: 'science', relatedQualifications: ['bsc', 'msc', 'phd'] },
  { id: 'psychology', name: 'Psychology', category: 'science', relatedQualifications: ['ba', 'ma', 'phd'] },
  { id: 'english', name: 'English Literature', category: 'arts', relatedQualifications: ['ba', 'ma', 'phd'] },
  { id: 'history', name: 'History', category: 'arts', relatedQualifications: ['ba', 'ma', 'phd'] },
  { id: 'medicine', name: 'Medicine', category: 'health', relatedQualifications: ['mbbs', 'md', 'ms'] },
  { id: 'nursing', name: 'Nursing', category: 'health', relatedQualifications: ['bsc', 'msc'] },
  { id: 'law', name: 'Law', category: 'law', relatedQualifications: ['llb', 'llm', 'jd'] },
  { id: 'education', name: 'Education', category: 'education', relatedQualifications: ['bed', 'med', 'edd'] },
];

export const institutions: EducationInstitution[] = [
  { id: 'oxford', name: 'University of Oxford', type: 'university', location: 'Oxford', country: 'UK', accreditation: ['Russell Group'] },
  { id: 'cambridge', name: 'University of Cambridge', type: 'university', location: 'Cambridge', country: 'UK', accreditation: ['Russell Group'] },
  { id: 'harvard', name: 'Harvard University', type: 'university', location: 'Cambridge, MA', country: 'USA', accreditation: ['Ivy League'] },
  { id: 'mit', name: 'Massachusetts Institute of Technology', type: 'university', location: 'Cambridge, MA', country: 'USA' },
  { id: 'stanford', name: 'Stanford University', type: 'university', location: 'Stanford, CA', country: 'USA' },
  { id: 'iitb', name: 'Indian Institute of Technology Bombay', type: 'university', location: 'Mumbai', country: 'India' },
  { id: 'iitd', name: 'Indian Institute of Technology Delhi', type: 'university', location: 'New Delhi', country: 'India' },
  { id: 'du', name: 'University of Delhi', type: 'university', location: 'New Delhi', country: 'India' },
  { id: 'umich', name: 'University of Michigan', type: 'university', location: 'Ann Arbor, MI', country: 'USA' },
  { id: 'waterloo', name: 'University of Waterloo', type: 'university', location: 'Waterloo', country: 'Canada' },
  { id: 'coursera', name: 'Coursera', type: 'online', location: 'Online', country: 'Global' },
  { id: 'udemy', name: 'Udemy', type: 'online', location: 'Online', country: 'Global' },
  { id: 'edx', name: 'edX', type: 'online', location: 'Online', country: 'Global' },
];

// API Functions
export class QualificationAPI {
  
  // Search qualifications by name or abbreviation
  static searchQualifications(query: string): Qualification[] {
    const searchTerm = query.toLowerCase();
    return qualifications.filter(q => 
      q.name.toLowerCase().includes(searchTerm) ||
      (q.abbreviation && q.abbreviation.toLowerCase().includes(searchTerm))
    );
  }
  
  // Get qualifications by type
  static getQualificationsByType(type: Qualification['type']): Qualification[] {
    return qualifications.filter(q => q.type === type);
  }
  
  // Get qualifications by category
  static getQualificationsByCategory(category: string): Qualification[] {
    return qualifications.filter(q => q.category === category);
  }
  
  // Get all degree qualifications
  static getDegrees(): Qualification[] {
    return this.getQualificationsByType('degree');
  }
  
  // Get undergraduate degrees
  static getUndergraduateDegrees(): Qualification[] {
    return qualifications.filter(q => q.type === 'degree' && q.level === 'undergraduate');
  }
  
  // Get postgraduate degrees
  static getPostgraduateDegrees(): Qualification[] {
    return qualifications.filter(q => q.type === 'degree' && q.level === 'postgraduate');
  }
  
  // Get professional certifications
  static getProfessionalCertifications(): Qualification[] {
    return this.getQualificationsByType('professional');
  }
  
  // Search fields of study
  static searchFields(query: string): FieldOfStudy[] {
    const searchTerm = query.toLowerCase();
    return fieldsOfStudy.filter(f => 
      f.name.toLowerCase().includes(searchTerm) ||
      f.category.toLowerCase().includes(searchTerm)
    );
  }
  
  // Get fields by category
  static getFieldsByCategory(category: FieldOfStudy['category']): FieldOfStudy[] {
    return fieldsOfStudy.filter(f => f.category === category);
  }
  
  // Get suggested qualifications for a field
  static getQualificationsForField(fieldId: string): Qualification[] {
    const field = fieldsOfStudy.find(f => f.id === fieldId);
    if (!field) return [];
    
    return qualifications.filter(q => field.relatedQualifications.includes(q.id));
  }
  
  // Search institutions
  static searchInstitutions(query: string): EducationInstitution[] {
    const searchTerm = query.toLowerCase();
    return institutions.filter(i => 
      i.name.toLowerCase().includes(searchTerm) ||
      i.location.toLowerCase().includes(searchTerm) ||
      i.country.toLowerCase().includes(searchTerm)
    );
  }
  
  // Get institutions by type
  static getInstitutionsByType(type: EducationInstitution['type']): EducationInstitution[] {
    return institutions.filter(i => i.type === type);
  }
  
  // Get institutions by country
  static getInstitutionsByCountry(country: string): EducationInstitution[] {
    return institutions.filter(i => i.country.toLowerCase() === country.toLowerCase());
  }
  
  // Get all countries
  static getCountries(): string[] {
    return Array.from(new Set(institutions.map(i => i.country))).sort();
  }
  
  // Get popular qualifications (top 10)
  static getPopularQualifications(): Qualification[] {
    return qualifications.slice(0, 10);
  }
  
  // Get recent trends (AI, Data Science, etc.)
  static getTrendingQualifications(): Qualification[] {
    const trendingIds = ['msc', 'mba', 'pmp', 'aws_cert', 'google_cert', 'scrum_master'];
    return qualifications.filter(q => trendingIds.includes(q.id));
  }
  
  // Validate qualification name
  static isValidQualification(name: string): boolean {
    return qualifications.some(q => 
      q.name.toLowerCase() === name.toLowerCase() ||
      (q.abbreviation && q.abbreviation.toLowerCase() === name.toLowerCase())
    );
  }
  
  // Get qualification details by name
  static getQualificationDetails(name: string): Qualification | null {
    return qualifications.find(q => 
      q.name.toLowerCase() === name.toLowerCase() ||
      (q.abbreviation && q.abbreviation.toLowerCase() === name.toLowerCase())
    ) || null;
  }
  
  // Suggest similar qualifications
  static suggestSimilarQualifications(name: string): Qualification[] {
    const details = this.getQualificationDetails(name);
    if (!details) return [];
    
    return qualifications.filter(q => 
      q.type === details.type && 
      q.id !== details.id
    ).slice(0, 5);
  }
}