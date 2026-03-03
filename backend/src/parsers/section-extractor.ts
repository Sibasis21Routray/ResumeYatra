import * as cheerio from 'cheerio';

const SECTION_KEYWORDS: Record<string, string[]> = {
  personal: ['personal', 'contact', 'details', 'information'],
  summary: ['summary', 'professional summary', 'profile', 'about', 'objective'],
  experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience'],
  education: ['education', 'academic', 'academics', 'qualifications', 'educational background'],
  skills: ['skills', 'technical skills', 'key skills', 'competencies', 'expertise'],
  projects: ['projects', 'personal projects', 'project experience', 'key projects'],
  certifications: ['certifications', 'certificates', 'awards', 'licenses'],
  languages: ['languages', 'language proficiency'],
  hobbies: ['hobbies', 'interests', 'activities', 'extracurricular'],
};

export function extractSections($: cheerio.Root) {
  const sections: Record<string, string[]> = {};
  let currentSection: string | null = null;

  $('p, h1, h2, h3, h4, li, div').each((_: number, el: cheerio.Element) => {
    const text = $(el).text().trim();
    if (!text) return;

    const detected = detectSection(text);

    // 🧠 Section header detected
    if (detected) {
      currentSection = detected;
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
      return;
    }

    // 🧠 Normal content
    if (currentSection) {
      sections[currentSection].push(text);
    } else {
      // Content before any section header - assume it's personal info
      if (!sections.personal) {
        sections.personal = [];
      }
      sections.personal.push(text);
    }
  });

  return normalizeSections(sections);
}

/**
 * Detects if a line is a section header
 */
function detectSection(text: string): string | null {
  const normalized = text.toLowerCase().replace(/[^a-z\s]/g, '').trim();

  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some(k => normalized.includes(k) || text.toLowerCase().includes(k))) {
      return section;
    }
  }

  // ALL CAPS heuristic for section headers
  if (
    text === text.toUpperCase() &&
    text.length > 3 &&
    text.length < 50 &&
    !text.includes('@') && // Not email
    !/\d{10,}/.test(text.replace(/\D/g, '')) // Not phone number
  ) {
    // Check if it matches any section keyword
    const capsNormalized = text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
      if (keywords.some(k => capsNormalized.includes(k))) {
        return section;
      }
    }
    
    // Common resume section headers in ALL CAPS
    const commonCapsSections: Record<string, string[]> = {
      experience: ['EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE'],
      education: ['EDUCATION', 'ACADEMIC BACKGROUND', 'QUALIFICATIONS'],
      skills: ['SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES'],
      projects: ['PROJECTS', 'PROJECT EXPERIENCE'],
      summary: ['SUMMARY', 'PROFILE', 'OBJECTIVE'],
    };
    
    for (const [section, patterns] of Object.entries(commonCapsSections)) {
      if (patterns.some(pattern => text.includes(pattern))) {
        return section;
      }
    }
  }

  return null;
}

/**
 * Converts arrays to strings
 */
function normalizeSections(sections: Record<string, string[]>) {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(sections)) {
    normalized[key] = value.join('\n');
  }

  return normalized;
}