// resume-parser.dispatcher.ts
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { normalizeParsedResume } from "../utils/normalizeParsedResume";
import mammoth from "mammoth";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import pdfParse from "pdf-parse";
import TokenUsage from "../models/TokenUsage";

// DeepInfra configuration
const deepinfra = new OpenAI({
  baseURL: "https://api.deepinfra.com/v1/openai",
  apiKey: process.env.DEEPINFRA_API_KEY!,
});

// Performance optimizations
const API_TIMEOUT = 120000; // 120 seconds timeout
const MAX_TEXT_LENGTH = 40000; // Max characters to send to AI (approx 10,000 tokens)

// Cache for processed data to avoid re-processing
const processedCache = new Map<string, any>();

// ---------- TOKEN COUNTING ----------
function countTokens(text: string): number {
  // Simple estimation: ~4 characters per token for English text
  return Math.ceil(text.length / 4);
}

// ---------- FILE TYPE DETECTION ----------
function detectFileType(filePath: string): "pdf" | "docx" | "unknown" {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".pdf") return "pdf";
  if (ext === ".docx") return "docx";
  return "unknown";
}

// ---------- DOCX TO TEXT CONVERSION (mammoth) ----------
async function extractTextFromDocx(filePath: string): Promise<string> {
  console.log("🔄 Extracting text from DOCX using mammoth...");

  try {
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;
    const messages = result.messages;

    if (messages.length > 0) {
      console.log("⚠️ Conversion warnings:", messages);
    }

    if (!text || text.trim().length === 0) {
      throw new Error("No text content found in DOCX file");
    }

    console.log(`📝 Extracted ${text.length} characters from DOCX`);
    return text;
  } catch (err: any) {
    console.error("DOCX text extraction error:", err.message);
    throw new Error(`Failed to extract text from DOCX: ${err.message}`);
  }
}

// ---------- PDF TO TEXT EXTRACTION (pdf-parse) ----------
async function extractTextFromPDF(filePath: string): Promise<string> {
  console.log("🔄 Extracting text from PDF using pdf-parse...");

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer, {
      max: 0, // No page limit
      version: 'v1.10.100'
    });

    const text = data.text;

    if (!text || text.trim().length === 0) {
      throw new Error("No text content found in PDF file");
    }

    console.log(`📝 Extracted ${text.length} characters from PDF (${data.numpages} pages)`);
    return text;
  } catch (err: any) {
    console.error("PDF text extraction error:", err.message);
    throw new Error(`Failed to extract text from PDF: ${err.message}`);
  }
}

// ---------- ENHANCED JSON FIXING FUNCTION ----------
function fixMalformedJSON(text: string): string {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  // Try to extract JSON object if there's other text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  // Fix common JSON errors
  cleaned = cleaned
    .replace(/\}\s*\{/g, '},{')
    .replace(/"\s*"/g, '","')
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
    .replace(/\s+/g, ' ')
    .replace(/\[\s*\]/g, '[]')
    .replace(/\{\s*\}/g, '{}');

  // Fix trailing commas
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

  // Quick brace count and fix
  const openBraces = (cleaned.match(/{/g) || []).length;
  const closeBraces = (cleaned.match(/}/g) || []).length;

  if (openBraces > closeBraces) {
    cleaned = cleaned + '}'.repeat(openBraces - closeBraces);
  }

  return cleaned;
}

// ---------- POST-PROCESSING FUNCTIONS (Preserved from original) ----------
function fixSkillsExtraction(data: any): any {
  if (!data) return data;
  if (!data.skills) return data;

  console.log("🔧 Fixing skills extraction...");

  if (Array.isArray(data.skills)) {
    const cleanedSkills = data.skills
      .map((skill: any) => {
        if (typeof skill === 'string') {
          return skill.trim();
        } else if (typeof skill === 'object' && skill !== null) {
          return skill.name || skill.skill || skill.skillName || null;
        }
        return null;
      })
      .filter((skill: any) => skill && skill !== '' && skill !== 'undefined')
      .filter((skill: any, index: number, self: any[]) =>
        self.findIndex((s: any) => s.toLowerCase() === skill.toLowerCase()) === index
      );

    if (cleanedSkills.length > 0) {
      data.skills = cleanedSkills;
      console.log(`✅ Extracted ${cleanedSkills.length} unique skills`);
    } else {
      delete data.skills;
    }
    return data;
  }

  if (typeof data.skills === 'object') {
    if (data.skills.list && Array.isArray(data.skills.list)) {
      data.skills = data.skills.list;
      return fixSkillsExtraction(data);
    }
    if (data.skills.skills && Array.isArray(data.skills.skills)) {
      data.skills = data.skills.skills;
      return fixSkillsExtraction(data);
    }
    if (data.skills.technical && Array.isArray(data.skills.technical)) {
      data.skills = data.skills.technical;
      return fixSkillsExtraction(data);
    }

    const skillValues = Object.values(data.skills).filter(v => typeof v === 'string' && v.length > 0);
    if (skillValues.length > 0) {
      data.skills = skillValues;
      return fixSkillsExtraction(data);
    }
  }

  return data;
}

function fixSummaryFormat(data: any): any {
  if (!data) return data;

  if (data.summary) {
    if (typeof data.summary === 'object' && data.summary !== null) {
      if (data.summary.description) {
        data.careerObjective = data.summary.description;
        delete data.summary;
      } else if (data.summary.text) {
        data.careerObjective = data.summary.text;
        delete data.summary;
      }
    } else if (typeof data.summary === 'string') {
      data.careerObjective = data.summary;
      delete data.summary;
    }
  }

  if (data.careerObjective && typeof data.careerObjective === 'object') {
    data.careerObjective = data.careerObjective.description || data.careerObjective.text || data.careerObjective;
  }

  return data;
}

function fixEducationDates(data: any): any {
  if (!data.education || !Array.isArray(data.education)) return data;

  data.education = data.education.map((edu: any) => {
    if (edu.startDate && typeof edu.startDate === 'string' && edu.startDate.includes('-')) {
      const [start, end] = edu.startDate.split('-').map((s: string) => s.trim());
      edu.startDate = start;
      if (!edu.graduationDate || edu.graduationDate === '') {
        edu.graduationDate = end;
      }
    }

    if ((!edu.graduationDate || edu.graduationDate === '') && edu.endDate) {
      if (typeof edu.endDate === 'string' && edu.endDate !== 'undefined') {
        edu.graduationDate = edu.endDate;
      }
      delete edu.endDate;
    }

    if (edu.graduationDate && typeof edu.graduationDate === 'string' && edu.graduationDate.includes('-') && (!edu.startDate || edu.startDate === '')) {
      const [start, end] = edu.graduationDate.split('-').map((s: string) => s.trim());
      edu.startDate = start;
      edu.graduationDate = end;
    }

    delete edu.endDate;
    delete edu.duration;

    return edu;
  });

  return data;
}

function cleanupEducation(data: any): any {
  if (!data.education || !Array.isArray(data.education)) return data;

  data.education = data.education.map((edu: any) => {
    const cleanedEdu: any = {};

    cleanedEdu.id = edu.id || `edu-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    cleanedEdu.school = edu.school || edu.institution || edu.college || edu.university;
    if (cleanedEdu.school && cleanedEdu.school !== 'undefined') {
      cleanedEdu.school = cleanedEdu.school.trim();
    } else {
      delete cleanedEdu.school;
    }

    if (edu.location && edu.location !== 'undefined' && edu.location !== '') {
      cleanedEdu.location = edu.location.trim();
    }

    if (edu.degree && edu.degree !== 'undefined' && edu.degree !== '') {
      let degree = edu.degree.trim();
      const degreeMap: { [key: string]: string } = {
        'bcom': 'B.Com', 'b.com': 'B.Com', 'bachelor of commerce': 'B.Com',
        'bca': 'BCA', 'mca': 'MCA', 'bba': 'BBA', 'mba': 'MBA',
        'bsc': 'B.Sc', 'msc': 'M.Sc', 'ba': 'B.A.', 'ma': 'M.A.',
        'btech': 'B.Tech', 'mtech': 'M.Tech', 'be': 'B.E.', 'me': 'M.E.',
        'higher secondary': 'Higher Secondary', 'secondary': 'Secondary',
        '12th': 'Higher Secondary', '10th': 'Secondary', 'ssc': 'SSC', 'hsc': 'HSC'
      };
      cleanedEdu.degree = degreeMap[degree.toLowerCase()] || degree;
    }

    if (edu.field && edu.field !== 'undefined' && edu.field !== '') {
      cleanedEdu.field = edu.field.trim();
    }

    if (edu.startDate && edu.startDate !== 'undefined' && edu.startDate !== '') {
      cleanedEdu.startDate = edu.startDate.includes('-') ? edu.startDate.split('-')[0].trim() : edu.startDate;
    }

    if (edu.graduationDate && edu.graduationDate !== 'undefined' && edu.graduationDate !== '') {
      cleanedEdu.graduationDate = edu.graduationDate.includes('-')
        ? edu.graduationDate.split('-').pop().trim()
        : edu.graduationDate;
    }

    if (edu.grade && edu.grade !== 'undefined' && edu.grade !== '') {
      cleanedEdu.grade = edu.grade.trim();
    } else if (edu.percentage) {
      cleanedEdu.grade = `Percentage: ${edu.percentage}%`;
    } else if (edu.cgpa) {
      cleanedEdu.grade = `CGPA: ${edu.cgpa}`;
    } else if (edu.gpa) {
      cleanedEdu.grade = `GPA: ${edu.gpa}`;
    }

    if (edu.description && edu.description !== 'undefined' && edu.description !== '') {
      cleanedEdu.description = edu.description.trim();
    }

    return Object.keys(cleanedEdu).length > 1 ? cleanedEdu : null;
  }).filter(Boolean);

  data.education.sort((a: any, b: any) => (b.startDate || '0').localeCompare(a.startDate || '0'));

  return data;
}

function fixCertifications(data: any): any {
  if (!data.education || !Array.isArray(data.education)) return data;

  const certsToMove = [];
  const remainingEducation = [];

  for (const edu of data.education) {
    const eduString = JSON.stringify(edu).toLowerCase();
    if (eduString.includes('company secretary') ||
      (eduString.includes('company') && eduString.includes('secretary')) ||
      (edu.degree && edu.degree.toLowerCase().includes('company secretary')) ||
      (edu.school && edu.school.toLowerCase().includes('icsi'))) {

      certsToMove.push({
        name: 'Company Secretary',
        issuer: edu.school === 'secretary' ? 'ICSI' : (edu.school || 'ICSI'),
        date: edu.graduationDate || edu.startDate || '',
        url: edu.url || ''
      });
    } else {
      remainingEducation.push(edu);
    }
  }

  data.education = remainingEducation;

  if (certsToMove.length > 0) {
    if (!data.certifications) data.certifications = [];

    for (const cert of certsToMove) {
      const exists = data.certifications.some((c: any) =>
        c.name && c.name.toLowerCase() === cert.name.toLowerCase()
      );
      if (!exists) {
        data.certifications.push(cert);
      }
    }
  }

  return data;
}

function fixLanguages(data: any): any {
  if (!data.languages || !Array.isArray(data.languages)) return data;

  data.languages = data.languages.map((lang: any) => {
    const cleanedLang: any = {};

    if (lang.language && lang.language !== 'undefined') {
      cleanedLang.language = lang.language.trim();
    }

    if (lang.level) {
      const level = lang.level.toString().toLowerCase();
      if (level.includes('native') || level.includes('bilingual')) {
        cleanedLang.level = 'Native/Bilingual';
      } else if (level.includes('professional')) {
        cleanedLang.level = 'Full Professional';
      } else if (level.includes('advanced')) {
        cleanedLang.level = 'Advanced';
      } else if (level.includes('intermediate')) {
        cleanedLang.level = 'Intermediate';
      } else if (level.includes('beginner')) {
        cleanedLang.level = 'Beginner';
      } else {
        cleanedLang.level = lang.level;
      }
    }

    if (lang.capability) {
      cleanedLang.capability = lang.capability.toString().replace(/\//g, ', ');
    } else if (cleanedLang.level) {
      const levelMap: any = {
        'Native/Bilingual': 'Speak, Read, Write',
        'Full Professional': 'Speak, Read, Write',
        'Advanced': 'Speak, Read, Write',
        'Intermediate': 'Speak, Read',
        'Beginner': 'Speak'
      };
      cleanedLang.capability = levelMap[cleanedLang.level];
    }

    return cleanedLang;
  }).filter((lang: any) => lang.language);

  return data;
}

function fixSocialProfiles(data: any): any {
  if (!data.socialProfiles || !Array.isArray(data.socialProfiles)) return data;

  data.socialProfiles = data.socialProfiles
    .map((profile: any) => ({
      platform: profile.platform?.trim(),
      url: profile.url?.trim()
    }))
    .filter((profile: any) => profile.platform && profile.platform !== 'undefined');

  return data;
}

function removeEmptyFields(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj
      .map(item => removeEmptyFields(item))
      .filter(item => {
        if (!item) return false;
        if (typeof item === 'object') return Object.keys(item).length > 0;
        if (typeof item === 'string') return item && item !== '' && item !== 'undefined' && item !== 'null';
        return true;
      });
  }

  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const cleanedValue = removeEmptyFields(value);

    if (cleanedValue === null || cleanedValue === undefined) continue;

    if (typeof cleanedValue === 'string') {
      if (cleanedValue === '' || cleanedValue === 'undefined' || cleanedValue === 'null') continue;
      cleaned[key] = cleanedValue;
    } else if (typeof cleanedValue === 'object') {
      if (Array.isArray(cleanedValue) && cleanedValue.length === 0) continue;
      if (!Array.isArray(cleanedValue) && Object.keys(cleanedValue).length === 0) continue;
      cleaned[key] = cleanedValue;
    } else {
      cleaned[key] = cleanedValue;
    }
  }

  return cleaned;
}

function postProcessParsedData(data: any): any {
  if (!data || typeof data !== 'object') return data;

  console.log("\n🧹 Running optimized post-processing...");

  data = fixSkillsExtraction(data);
  data = fixSummaryFormat(data);
  data = fixCertifications(data);
  data = fixEducationDates(data);
  data = cleanupEducation(data);
  data = fixLanguages(data);
  data = fixSocialProfiles(data);
  // ADD THIS LINE - Clean bullet points but preserve structure
  data = cleanBulletPointsFromDescriptions(data);

  data = removeEmptyFields(data);



  console.log("✅ Post-processing complete");
  return data;
}

// ---------- FIELD NAME MAPPING ----------
const fieldMappings: { [key: string]: string } = {
  'alt_phone': 'alternatePhone',
  'marital_status': 'maritalStatus',
  'full_address': 'fullAddress',
  'pin_code': 'pinCode',
  'professional_context': 'professionalContext',
  'total_experience': 'totalExperience',
  'team_size': 'teamSize',
  'functional_domain': 'functionalDomain',
  'geographic_scope': 'geographicScope',
  'revenue_responsibility': 'revenueResponsibility',
  'availability_work_authorization': 'availabilityWorkAuth',
  'notice_period': 'availabilityNoticePeriod',
  'work_auth': 'workAuthorizationStatus',
  'preferred_location': 'preferredLocation',
  'career_objective': 'careerObjective',
  'professional_summary': 'summary',
  'workExperience': 'experience',
  'work_experience': 'experience',
  'start': 'startDate',
  'end': 'endDate',
  'coCurricularActivities': 'coCurricular',
  'extracurricularActivities': 'extracurricular',
  'training_programs': 'trainingPrograms',
  'academic_projects': 'academicProjects',
  'leadership_positions': 'leadershipPositions',
  'tools_technologies': 'toolsTechnologies',
  'tool': 'name',
  'industry_expertise': 'industryExpertise',
  'domain': 'industry',
  'domainArea': 'domainArea',
  'teaching_experience': 'teachingExperience',
  'mentorship_experience': 'mentorshipExperience',
  'research_grants': 'researchGrants',
  'test_scores': 'testScores',
  'social_profiles': 'socialProfiles',
  'military_service': 'militaryService',
  'client_projects': 'clientProjects',
  'tools': 'toolsTechnologies',
  'cause': 'causeArea'
};

// ---------- CLEAN BULLET POINTS BUT PRESERVE LINE BREAKS ----------
function cleanBulletPointsFromDescriptions(data: any): any {
  if (!data || typeof data !== 'object') return data;

  // Clean experience descriptions
  if (data.experience && Array.isArray(data.experience)) {
    console.log("🧹 Cleaning bullet points from experience descriptions...");

    data.experience = data.experience.map((exp: any) => {
      if (exp.description && typeof exp.description === 'string') {
        // Split into lines while preserving line breaks
        const lines = exp.description.split(/\r?\n/);
        const cleanedLines = lines.map(line => {
          let cleaned = line.trim();
          // Remove bullet point markers but keep the text
          cleaned = cleaned.replace(/^[•\-*]\s*/, '');      // Remove •, -, *
          cleaned = cleaned.replace(/^\d+\.\s*/, '');        // Remove numbered lists (1., 2., etc.)
          cleaned = cleaned.replace(/^[a-zA-Z]\)\s*/, '');   // Remove lettered lists (a), b), etc.)
          cleaned = cleaned.replace(/^[✓✓✔]\s*/, '');       // Remove checkmarks
          cleaned = cleaned.replace(/^[◦▪▸›]\s*/, '');      // Remove other bullet symbols
          return cleaned;
        });

        // Join back with newlines to preserve structure
        exp.description = cleanedLines.join('\n');
      }
      return exp;
    });
  }

  // Clean internship descriptions
  if (data.internships && Array.isArray(data.internships)) {
    data.internships = data.internships.map((item: any) => {
      if (item.description && typeof item.description === 'string') {
        const lines = item.description.split(/\r?\n/);
        const cleanedLines = lines.map(line => {
          let cleaned = line.trim();
          cleaned = cleaned.replace(/^[•\-*]\s*/, '');
          cleaned = cleaned.replace(/^\d+\.\s*/, '');
          cleaned = cleaned.replace(/^[a-zA-Z]\)\s*/, '');
          return cleaned;
        });
        item.description = cleanedLines.join('\n');
      }
      return item;
    });
  }

  // Clean project descriptions
  if (data.projects && Array.isArray(data.projects)) {
    data.projects = data.projects.map((project: any) => {
      if (project.description && typeof project.description === 'string') {
        const lines = project.description.split(/\r?\n/);
        const cleanedLines = lines.map(line => {
          let cleaned = line.trim();
          cleaned = cleaned.replace(/^[•\-*]\s*/, '');
          cleaned = cleaned.replace(/^\d+\.\s*/, '');
          return cleaned;
        });
        project.description = cleanedLines.join('\n');
      }
      return project;
    });
  }

  // Clean academicProjects descriptions
  if (data.academicProjects && Array.isArray(data.academicProjects)) {
    data.academicProjects = data.academicProjects.map((project: any) => {
      if (project.description && typeof project.description === 'string') {
        const lines = project.description.split(/\r?\n/);
        const cleanedLines = lines.map(line => {
          let cleaned = line.trim();
          cleaned = cleaned.replace(/^[•\-*]\s*/, '');
          cleaned = cleaned.replace(/^\d+\.\s*/, '');
          return cleaned;
        });
        project.description = cleanedLines.join('\n');
      }
      return project;
    });
  }

  // Clean clientProjects descriptions
  if (data.clientProjects && Array.isArray(data.clientProjects)) {
    data.clientProjects = data.clientProjects.map((project: any) => {
      if (project.description && typeof project.description === 'string') {
        const lines = project.description.split(/\r?\n/);
        const cleanedLines = lines.map(line => {
          let cleaned = line.trim();
          cleaned = cleaned.replace(/^[•\-*]\s*/, '');
          cleaned = cleaned.replace(/^\d+\.\s*/, '');
          return cleaned;
        });
        project.description = cleanedLines.join('\n');
      }
      return project;
    });
  }

  return data;
}

function mapFieldNames(data: any): any {
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(item => mapFieldNames(item));
  }

  const mapped: any = {};
  for (const [key, value] of Object.entries(data)) {
    const mappedKey = fieldMappings[key] || key;
    mapped[mappedKey] = value && typeof value === 'object' ? mapFieldNames(value) : value;
  }
  return mapped;
}

// ---------- SINGLE AI CALL WITH TEXT ----------
async function extractDataFromText(userId: string | null, text: string, guestId: string | null = null): Promise<any> {
  console.log("🔍 Processing resume text with AI (single call)...");

  // Truncate text if too long
  let processedText = text;
  if (text.length > MAX_TEXT_LENGTH) {
    processedText = text.substring(0, MAX_TEXT_LENGTH);
    console.log(`⚠️ Text truncated from ${text.length} to ${MAX_TEXT_LENGTH} characters`);
  }

  const prompt = `You are a strict resume parser. Extract ALL information from the provided resume text and return it as a JSON object.

⚠️ CRITICAL RULES (MUST FOLLOW STRICTLY):

1. Hallucinate data a little for better completeness and field mapping.
2. Use EXACTLY these section keys (camelCase):
   - personal, careerObjective, summary, skills, experience, education,
     internships, trainingPrograms, academicProjects, leadershipPositions,
     coCurricular, extracurricular, languages, certifications, scholarships,
     awards, speakingEngagements, memberships, workshops, professionalContext,
     sectionVisibility, fontSize, fontFamily, portfolio, clientProjects,
     volunteering, militaryService, methodologies, industryExpertise,
     references, socialProfiles, availabilityWorkAuth, teachingExperience,
     mentorshipExperience, researchGrants, testScores, publications, patents,
     toolsTechnologies

3. Field Mapping (CRITICAL - Match EXACTLY):
   
   PERSONAL:
   - name, email, phone, alternatePhone, dob, gender, middleName, 
     maritalStatus, fullAddress, location, pinCode, country, image
   - for phone and alternatePhone: extract only digits, remove any formatting or country codes
   
   EXPERIENCE:
- title, company, location, startDate, endDate, isCurrent, description, achievements
- Each job MUST be a separate object
- NEVER merge responsibilities from different companies
- Only include content that belongs to that specific company and date range
- If multiple roles exist, create multiple entries
- description MUST contain ONLY that job's responsibilities
- DO NOT combine multiple jobs into one
- IMPORTANT: 
  - DO NOT include bullet point symbols (•, -, *, 1., etc.) in the description text
  - Instead, write each responsibility on a new line
  - Use line breaks to separate different points
  - For example, write:
    "Sourcing candidates from different job portals
     Screening and shortlisting candidates as per requirements
     Coordinating with hiring managers for interview scheduling"
  - The template will handle formatting and add proper bullets
- If the resume has bullet points, convert them to new lines without symbols
- If there are no bullet points, preserve the original line breaks
- If you see separate sections like "Achievements" under a job, include them on new lines

   EDUCATION:
   - school, location, degree, field, startDate, graduationDate, description, grade
   - properly extract date for coresponding education
   
   SKILLS (IMPORTANT - Must be extracted properly):
   - Extract ALL skills as a simple array of strings
   - Look for bullet points (•, -, *, etc.) or comma-separated lists
   - Example: "skills": ["React.js", "Node.js", "MongoDB", "AWS"]
   - DO NOT put skills inside objects, just simple strings
   - Include ALL technical skills, programming languages, frameworks, tools, etc.
   - Do not include  speaking languages like English, Spanish, etc. here, they should go in the "languages" section
   - If you see a "Skills" section with bullet points, extract each bullet point as a separate skill
   - For skills like "React.js" → extract as "React.js"
   - For skills like "• React.js" → extract as "React.js" (remove the bullet)
   
   INTERNSHIPS:
   - title, company, description, duration
   
   TRAINING PROGRAMS:
   - name, provider, completionDate, duration, description
   
   ACADEMIC PROJECTS:
   - name, course, institution, duration, description, technologies (array), url
   
   LEADERSHIP POSITIONS:
   - position, organization, startDate, endDate, description
   
   CO-CURRICULAR / EXTRA-CURRICULAR:
   - activity, role, year
   
   LANGUAGES:
   - language, level (Beginner/Intermediate/Advanced), capability (Speak/Read/Write)
   
   CERTIFICATIONS:
   - name, issuer, date, url
   
   SCHOLARSHIPS:
   - name, provider, organization, year, description
   
   AWARDS:
   - title, organization, issueYear, description
   
   SPEAKING ENGAGEMENTS:
   - topic, eventName, date, description
   
   MEMBERSHIPS:
   - membershipName, organizationName, year, description
   
   WORKSHOPS:
   - programTitle, conductedBy, year, description
   
   PROFESSIONAL CONTEXT:
   - totalExperience, teamSize, industry, functionalDomain, geographicScope, revenueResponsibility
   
   SECTION VISIBILITY:
   - personal, summary, experience, projects, education, skills, languages, 
     hobbies, certifications, awards, speakingEngagements, memberships, 
     workshops, socialLinks, customSections (all boolean)
   
   PORTFOLIO:
   - name, description, url, type, platform
   
   CLIENT PROJECTS:
   - name, role, description, clientOrganization, duration, toolsTechnologies, projectUrl
   
   VOLUNTEERING:
   - organization, role, description, causeArea, duration
   
   MILITARY SERVICE:
   - branch, rank, description, duration, specialization
   
   METHODOLOGIES:
   - name, certification, experienceDuration
   
   INDUSTRY EXPERTISE:
   - industry, domainArea, experienceDuration
   
   REFERENCES:
   - name, designationRelationship, organization, contactInformation
   
   SOCIAL PROFILES:
   - platform, url
   
   AVAILABILITY WORK AUTH:
   - availabilityNoticePeriod, workAuthorizationStatus, preferredLocation
   
   TEACHING EXPERIENCE:
   - title, institution, description, subjectCourseTaught, duration
   
   MENTORSHIP EXPERIENCE:
   - description, mentorshipArea, organizationPlatform, menteeLevel, duration
   
   RESEARCH GRANTS:
   - title, agency, amount, description, year
   
   TEST SCORES:
   - testName, score, year, percentileRank
   
   PUBLICATIONS:
   - title, journalPublisher, publicationType, year, urlDoi, authors
   
   PATENTS:
   - title, patentNumber, status, issuingAuthority, year
   
   TOOLS TECHNOLOGIES:
   - name, category, proficiency, experienceDuration

4. For EDUCATION dates: ALWAYS split into startDate and graduationDate separately
5. For SUMMARY/CAREER OBJECTIVE: Return as a simple string, NOT an object
6. For SKILLS: 
   - ALWAYS return as an array of simple strings.
   - DO NOT include any spoken languages (e.g., English, Hindi, Spanish, Bengali, French, etc.) in the skills array.
   - Skills must be technical, professional, or domain-specific (e.g., "BFSI Hiring", "Recruitment", "Client Acquisition", "Team Handling", "Communication").
   - Spoken/written languages MUST go into the "languages" section only.
7. For EXPERIENCE (work experience):
   - Each job MUST be a separate object in the "experience" array.
   - For each job, the "description" field MUST contain ONLY the bullet points or responsibilities that belong EXCLUSIVELY to that job.
   - DO NOT merge responsibilities from different jobs into a single description.
   - DO NOT copy responsibilities from Job A into Job B.
   - If a job has no bullet points, write a short paragraph describing that role only.
   - If you see separate sections like "Achievements" under a job, include them as part of that job's description, but clearly separated (e.g., "Achievements: ...").

8. Keep dates in original format but split ranges
9. If a section has no data, OMIT it completely
10. Return ONLY valid JSON, no explanations
11. do not return not mentioned , unknown, undefined, null, empty string, or similar values. If a field is not present in the resume, simply omit it from the JSON.

Now extract and return the structured JSON from the provided resume text:

${processedText}`;

  const maxRetries = 2;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      console.log(`📤 Sending text to DeepInfra API (attempt ${attempt + 1})...`);

      const response = await Promise.race([
        deepinfra.chat.completions.create({
          model: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
          max_tokens: 8000,
          temperature: 0.1,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("API timeout")), API_TIMEOUT)
        )
      ]) as any;

      const responseContent = response.choices?.[0]?.message?.content?.trim() || "";

      // Log usage to database
      if ((userId || guestId) && response.usage) {
        try {
          const usage = response.usage as any;
          await TokenUsage.create({
            userId,
            guestId,
            promptTokens: usage.prompt_tokens ?? usage.promptTokens ?? usage.input_tokens ?? usage.inputTokens ?? 0,
            completionTokens: usage.completion_tokens ?? usage.completionTokens ?? usage.output_tokens ?? usage.outputTokens ?? 0,
            totalTokens: usage.total_tokens ?? usage.totalTokens ?? 0,
            aiModel: response.model || "meta-llama/Llama-4-Scout-17B-16E-Instruct",
            action: 'resume_parsing'
          });
          console.log(`📊 Logged parsing token usage for ${userId ? `user ${userId}` : `guest ${guestId}`}`);
        } catch (logErr) {
          console.error("Failed to log parsing token usage:", logErr);
        }
      }

      if (!responseContent || responseContent.length < 50) {
        throw new Error("Insufficient content extracted");
      }

      try {
        let cleanJson = responseContent
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();
        const parsedData = JSON.parse(cleanJson);
        console.log(`✅ Resume processed successfully`);
        return parsedData;
      } catch (err) {
        const fixedJson = fixMalformedJSON(responseContent);
        const parsedData = JSON.parse(fixedJson);
        console.log(`✅ Resume processed successfully (after fixing)`);
        return parsedData;
      }

    } catch (err: any) {
      console.log(`⚠️ Processing failed on attempt ${attempt + 1}: ${err.message}`);
      attempt++;
      if (attempt > maxRetries) {
        console.error(`❌ Failed to process resume after ${maxRetries} attempts`);
        return {};
      }
      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  }

  return {};
}

// ---------- MAIN FUNCTION (Handles both PDF and DOCX) ----------
async function parseResume(userId: string | null, filePath: string, guestId: string | null = null) {
  console.log("🚀 Starting resume parsing pipeline (Text-based)...");
  console.log(`📂 File: ${filePath}`);

  // Check cache
  const cacheKey = `${filePath}-${fs.statSync(filePath).mtimeMs}`;
  if (processedCache.has(cacheKey)) {
    console.log("✅ Returning cached result");
    return processedCache.get(cacheKey);
  }

  const fileType = detectFileType(filePath);
  let extractedText = "";

  // Extract text based on file type
  if (fileType === "docx") {
    console.log("📄 Detected DOCX file, extracting text...");
    extractedText = await extractTextFromDocx(filePath);
  } else if (fileType === "pdf") {
    console.log("📄 Detected PDF file, extracting text...");
    extractedText = await extractTextFromPDF(filePath);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }

  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error("No text content extracted from file");
  }

  console.log(`📝 Extracted ${extractedText.length} characters of text`);

  // Count tokens and enforce limit
  const tokenCount = countTokens(extractedText);
  console.log(`📊 Estimated tokens: ${tokenCount}`);

  if (tokenCount > 10000) {
    console.error("Token count exceeds limit (10,000)");
    throw new Error("Exceed token limit , plese upload a smaller file");
  }

  // Single AI call with the extracted text
  console.log("🤖 Sending text to AI for parsing...");
  let aiParsed = {};

  try {
    aiParsed = await extractDataFromText(userId, extractedText, guestId);
  } catch (extractError: any) {
    console.error("❌ AI processing failed:", extractError.message);
    console.log("⚠️ Returning empty result");
    return normalizeParsedResume({});
  }

  // Log what the AI returned BEFORE normalization (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log("\n📥 RAW AI PARSED DATA (before normalization):");
    console.log(JSON.stringify(aiParsed, null, 2));
  }

  // Apply field mapping
  console.log("\n🔄 Mapping field names...");
  const mappedData = mapFieldNames(aiParsed);

  // Apply post-processing to fix all issues
  console.log("\n🔄 Post-processing parsed data...");
  const processedData = postProcessParsedData(mappedData);

  // Normalize and return
  console.log("\n🔄 Normalizing parsed data...");
  const result = normalizeParsedResume(processedData);

  console.log("\n🎉 FINAL PARSING RESULT READY");

  // Cache result
  processedCache.set(cacheKey, result);
  return result;
}

export default parseResume;