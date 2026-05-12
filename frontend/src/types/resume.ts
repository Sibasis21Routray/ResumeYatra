export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  fathersName?: string;
  nationality?: string;
  dob?: string;
  gender?: string;
  maritalStatus?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  startDate?: string;
  endDate?: string;
  url?: string;
}

export interface Language {
  id: string;
  language: string;
  level: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface SectionStyles {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

export interface ResumeStyles {
  personalInfo?: SectionStyles;
  experience?: SectionStyles;
  education?: SectionStyles;
  skills?: SectionStyles;
  sectionTitles?: SectionStyles;
  global?: SectionStyles;
}

export interface CustomSectionEntry {
  id: string;
  title?: string;
  organization?: string;
  date?: string;
  description?: string;
  isVisible: boolean;
}

export interface CustomSection {
  id: string;
  heading: string;
  entries: CustomSectionEntry[];
  isVisible: boolean;
}

export interface Resume {
  id?: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects?: Project[];
  languages?: Language[];
  hobbies?: string[];
  certifications?: Certification[];
  keyAchievements?: string[];

  responsibilities?: string;
  tools?: string;
  customSections?: CustomSection[];
  styles: ResumeStyles;
  createdAt?: string;
  updatedAt?: string;
}
