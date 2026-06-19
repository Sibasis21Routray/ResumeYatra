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

// ---------- POST-PROCESSING FUNCTIONS ----------
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

function fixCoreCompetenciesExtraction(data: any): any {
  if (!data) return data;
  if (!data.coreCompetencies) return data;

  if (Array.isArray(data.coreCompetencies)) {
    const cleaned = data.coreCompetencies
      .map((item: any) => {
        if (typeof item === "string") return item.trim();
        if (typeof item === "object" && item !== null) {
          return item.name || item.competency || null;
        }
        return null;
      })
      .filter(Boolean);

    data.coreCompetencies = cleaned;
  }

  return data;
}

function fixSummaryFormat(data: any): any {
  if (!data) return data;

  console.log("🔧 Fixing summary/career objective format...");

  // First, extract all possible summary/objective fields
  let summaryContent = null;
  let careerObjectiveContent = null;

  // Extract summary content
  if (data.summary) {
    if (typeof data.summary === 'object' && data.summary !== null) {
      if (data.summary.description) {
        summaryContent = data.summary.description;
      } else if (data.summary.text) {
        summaryContent = data.summary.text;
      } else if (data.summary.summary) {
        summaryContent = data.summary.summary;
      } else {
        summaryContent = JSON.stringify(data.summary);
      }
    } else if (typeof data.summary === 'string') {
      summaryContent = data.summary;
    }
  }

  // Extract careerObjective content
  if (data.careerObjective) {
    if (typeof data.careerObjective === 'object' && data.careerObjective !== null) {
      if (data.careerObjective.description) {
        careerObjectiveContent = data.careerObjective.description;
      } else if (data.careerObjective.text) {
        careerObjectiveContent = data.careerObjective.text;
      } else if (data.careerObjective.careerObjective) {
        careerObjectiveContent = data.careerObjective.careerObjective;
      } else {
        careerObjectiveContent = JSON.stringify(data.careerObjective);
      }
    } else if (typeof data.careerObjective === 'string') {
      careerObjectiveContent = data.careerObjective;
    }
  }

  // Handle "objective" field (if AI returned it as "objective")
  if (data.objective) {
    if (typeof data.objective === 'string') {
      if (!careerObjectiveContent) {
        careerObjectiveContent = data.objective;
      }
    } else if (typeof data.objective === 'object') {
      const objContent = data.objective.description || data.objective.text || JSON.stringify(data.objective);
      if (!careerObjectiveContent) {
        careerObjectiveContent = objContent;
      }
    }
    delete data.objective;
  }

  // Handle "professionalSummary" field
  if (data.professionalSummary) {
    if (typeof data.professionalSummary === 'string') {
      if (!summaryContent) {
        summaryContent = data.professionalSummary;
      }
    } else if (typeof data.professionalSummary === 'object') {
      const psContent = data.professionalSummary.description || data.professionalSummary.text || JSON.stringify(data.professionalSummary);
      if (!summaryContent) {
        summaryContent = psContent;
      }
    }
    delete data.professionalSummary;
  }

  // CRITICAL: Detect if summary content is actually an objective
  if (summaryContent && typeof summaryContent === 'string') {
    const lowerSummary = summaryContent.toLowerCase().trim();
    // Check if this is actually an objective
    const isObjective = lowerSummary.includes('objective') || 
                        lowerSummary.includes('career objective') ||
                        lowerSummary.includes('career goal') ||
                        lowerSummary.includes('professional objective') ||
                        lowerSummary.startsWith('to obtain') ||
                        lowerSummary.startsWith('seeking a') ||
                        lowerSummary.startsWith('looking for') ||
                        lowerSummary.startsWith('to secure') ||
                        lowerSummary.includes('aim to') ||
                        lowerSummary.includes('goal is to');
    
    if (isObjective && !careerObjectiveContent) {
      // This is an objective, move to careerObjective
      careerObjectiveContent = summaryContent;
      summaryContent = null;
      console.log("📝 Moved Objective content from summary to careerObjective");
    }
  }

  // CRITICAL: Detect if careerObjective content is actually a summary
  if (careerObjectiveContent && typeof careerObjectiveContent === 'string') {
    const lowerCareer = careerObjectiveContent.toLowerCase().trim();
    const isSummary = lowerCareer.includes('summary') || 
                      lowerCareer.includes('professional summary') ||
                      lowerCareer.includes('profile') ||
                      lowerCareer.includes('professional profile') ||
                      lowerCareer.includes('experienced') ||
                      lowerCareer.includes('skilled') ||
                      lowerCareer.includes('proven track record');
    
    if (isSummary && !summaryContent) {
      // This is a summary, move to summary
      summaryContent = careerObjectiveContent;
      careerObjectiveContent = null;
      console.log("📝 Moved Summary content from careerObjective to summary");
    }
  }

  // If we have both summary and careerObjective with same content, remove duplicate
  if (summaryContent && careerObjectiveContent && 
      typeof summaryContent === 'string' && typeof careerObjectiveContent === 'string') {
    if (summaryContent.trim() === careerObjectiveContent.trim()) {
      // Same content, keep only summary
      careerObjectiveContent = null;
      console.log("📝 Removed duplicate careerObjective (same as summary)");
    }
  }

  // Set the final values
  if (summaryContent && typeof summaryContent === 'string' && 
      summaryContent.trim() !== '' && 
      summaryContent !== 'undefined' && 
      summaryContent !== 'null') {
    data.summary = summaryContent.trim();
  } else {
    delete data.summary;
  }

  if (careerObjectiveContent && typeof careerObjectiveContent === 'string' && 
      careerObjectiveContent.trim() !== '' && 
      careerObjectiveContent !== 'undefined' && 
      careerObjectiveContent !== 'null') {
    data.careerObjective = careerObjectiveContent.trim();
  } else {
    delete data.careerObjective;
  }

  console.log(`📝 Summary: ${data.summary ? 'present (' + data.summary.substring(0, 50) + '...)' : 'absent'}`);
  console.log(`📝 Career Objective: ${data.careerObjective ? 'present (' + data.careerObjective.substring(0, 50) + '...)' : 'absent'}`);

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

function fixAchievementsAttachment(data: any): any {
  if (!data || !data.experience || !Array.isArray(data.experience)) return data;

  console.log("🔧 Fixing achievements attachment and removing duplicates...");

  // First, identify which job each achievement belongs to
  // In the resume, achievements appear AFTER the job they belong to
  // Pattern: Job Title 1 -> Responsibilities -> ACHIEVEMENTS -> Job Title 2
  // So achievements belong to Job Title 1, not Job Title 2

  // Check if achievements are attached to the wrong job
  for (let i = 0; i < data.experience.length - 1; i++) {
    const current = data.experience[i];
    const next = data.experience[i + 1];
    
    // If current job has achievements and next job has no achievements,
    // but the current job has very few responsibilities (short description)
    // and the next job has many responsibilities (long description),
    // the achievements likely belong to the next job
    if (current.achievements && !next.achievements) {
      const currentDescLength = (current.description || '').split('\n').filter(line => line.trim().length > 0).length;
      const nextDescLength = (next.description || '').split('\n').filter(line => line.trim().length > 0).length;
      
      // If the next job has significantly more responsibilities, move achievements to it
      if (nextDescLength > currentDescLength * 1.5 && nextDescLength > 5) {
        // Move achievements to the next job
        next.achievements = current.achievements;
        delete current.achievements;
        console.log(`📝 Moved achievements from "${current.title}" to "${next.title}" (next job has ${nextDescLength} responsibilities vs ${currentDescLength})`);
      }
    }
  }

  // Now remove duplicates across all jobs
  const uniqueAchievements = new Set<string>();
  
  for (let i = 0; i < data.experience.length; i++) {
    const exp = data.experience[i];
    
    if (exp.achievements && typeof exp.achievements === 'string') {
      const lines = exp.achievements.split('\n').filter(line => line.trim().length > 0);
      const uniqueForJob: string[] = [];
      
      for (const achievement of lines) {
        const trimmed = achievement.trim();
        // Check if this achievement was already seen
        if (!uniqueAchievements.has(trimmed)) {
          uniqueAchievements.add(trimmed);
          uniqueForJob.push(trimmed);
        } else {
          console.log(`🗑️ Removing duplicate achievement from "${exp.title}": "${trimmed.substring(0, 50)}..."`);
        }
      }
      
      // Update the job's achievements with only unique ones
      if (uniqueForJob.length > 0) {
        exp.achievements = uniqueForJob.join('\n');
      } else {
        delete exp.achievements;
      }
    }
  }

  // If any entry has achievements but no description, remove it
  data.experience = data.experience.filter((exp: any) => {
    if (exp.achievements && (!exp.description || exp.description.trim().length < 5)) {
      console.log(`🗑️ Removing entry "${exp.title}" - it appears to be just an achievements section`);
      return false;
    }
    return true;
  });

  return data;
}

function postProcessParsedData(data: any): any {
  if (!data || typeof data !== 'object') return data;

  console.log("\n🧹 Running optimized post-processing...");

  data = fixSkillsExtraction(data);
  data = fixCoreCompetenciesExtraction(data);
  data = fixSummaryFormat(data);
  data = fixCertifications(data);
  data = fixEducationDates(data);
  data = cleanupEducation(data);
  data = fixLanguages(data);
  data = fixSocialProfiles(data);
  data = cleanBulletPointsFromDescriptions(data);
  data = fixAchievementsAttachment(data);
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
  'summary': 'summary',
  'objective': 'careerObjective',
  'careerObjective': 'careerObjective',
  'professionalSummary': 'summary',
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

  // Clean experience descriptions AND achievements separately
  if (data.experience && Array.isArray(data.experience)) {
    console.log("🧹 Cleaning bullet points from experience descriptions...");

    data.experience = data.experience.map((exp: any) => {
      // Clean description
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
          // Remove "Achievements:" label if it appears in description
          cleaned = cleaned.replace(/^Achievements:\s*/i, '');
          cleaned = cleaned.replace(/^ACHIEVEMENTS:\s*/i, '');
          return cleaned;
        });
        // Join back with newlines to preserve structure
        exp.description = cleanedLines.join('\n');
      }
      
      // Clean achievements separately
      if (exp.achievements && typeof exp.achievements === 'string') {
        const lines = exp.achievements.split(/\r?\n/);
        const cleanedLines = lines.map(line => {
          let cleaned = line.trim();
          cleaned = cleaned.replace(/^[•\-*]\s*/, '');
          cleaned = cleaned.replace(/^\d+\.\s*/, '');
          cleaned = cleaned.replace(/^[a-zA-Z]\)\s*/, '');
          cleaned = cleaned.replace(/^[✓✓✔]\s*/, '');
          cleaned = cleaned.replace(/^[◦▪▸›]\s*/, '');
          // Remove "Achievements:" label if it appears in achievements
          cleaned = cleaned.replace(/^Achievements:\s*/i, '');
          cleaned = cleaned.replace(/^ACHIEVEMENTS:\s*/i, '');
          return cleaned;
        });
        exp.achievements = cleanedLines.join('\n');
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
async function extractDataFromText(userId: string | null, text: string, guestId: string | null = null, resumeId?: string): Promise<any> {
  console.log("🔍 Processing resume text with AI (single call)...");

  // Truncate text if too long
  let processedText = text;
  if (text.length > MAX_TEXT_LENGTH) {
    processedText = text.substring(0, MAX_TEXT_LENGTH);
    console.log(`⚠️ Text truncated from ${text.length} to ${MAX_TEXT_LENGTH} characters`);
  }

  const prompt = `You are a strict resume parser. Extract ALL information from the provided resume text and return it as a JSON object.

⚠️ CRITICAL RULES (MUST FOLLOW STRICTLY):

1. DO NOT hallucinate or invent any content. Only extract what is explicitly present in the resume text.
2. DO NOT merge or combine content from different job entries. Each job MUST be completely separate.

3. Use EXACTLY these section keys (camelCase):
   - personal, careerObjective, summary, skills, coreCompetencies, experience, education,
     internships, trainingPrograms, academicProjects, leadershipPositions,
     coCurricular, extracurricular, languages, certifications, scholarships,
     awards, speakingEngagements, memberships, workshops, professionalContext,
     sectionVisibility, fontSize, fontFamily, portfolio, clientProjects,
     volunteering, militaryService, methodologies, industryExpertise,
     references, socialProfiles, availabilityWorkAuth, teachingExperience,
     mentorshipExperience, researchGrants, testScores, publications, patents,
     toolsTechnologies

4. Field Mapping (CRITICAL - Match EXACTLY):
   
   PERSONAL:
   - name, email, phone, alternatePhone, dob, gender, middleName, 
     maritalStatus, fullAddress, location, pinCode, country, image
   - for phone and alternatePhone: extract only digits, remove any formatting or country codes
   
   SUMMARY / CAREER OBJECTIVE (CRITICAL - MUST DISTINGUISH):
   - "summary": This is for Professional Summary, Professional Profile, or Profile sections
     * Look for section headers like: "Professional Summary", "Professional Profile", "Profile", "Summary"
   - "careerObjective": This is for Career Objective, Objective, or Career Goals sections
     * Look for section headers like: "Career Objective", "Objective", "Career Goals", "Career Aim"
   - These are DIFFERENT sections and should NEVER be merged
   - If you see "Objective" or "Career Objective" in the resume, put it in "careerObjective"
   - If you see "Professional Summary" or "Summary" in the resume, put it in "summary"
   - DO NOT put objective content in summary
   - DO NOT put summary content in careerObjective
   - Return each as a simple string, NOT an object
   - IMPORTANT: If the resume has a section that says "Objective:" or "Career Objective:", the content MUST go in "careerObjective", NOT "summary"
   - If the resume has a section that says "Professional Summary:" or "Summary:", the content MUST go in "summary", NOT "careerObjective"
   
   EXPERIENCE (MOST IMPORTANT - MUST FOLLOW EXACTLY):
   - Each job MUST be a separate object in the "experience" array
   - For each job, extract:
     * title: The exact job title
     * company: The exact company name
     * location: The location (city/state)
     * startDate: The start date in the format shown in the resume
     * endDate: The end date or "Present" if current
     * isCurrent: true if endDate is "Present"
     * description: ONLY the bullet points/responsibilities that belong to THAT SPECIFIC job. Preserve line breaks between bullet points.
     * achievements: ONLY the achievements that belong to THAT SPECIFIC job (if shown separately). Preserve line breaks between achievements.
   
   - CRITICAL: DO NOT mix responsibilities or achievements between different jobs
   - CRITICAL: DO NOT copy content from one job to another
   - CRITICAL: Each job's description must contain ONLY content that appears under that job's section
   - If a job has bullet points, extract them as separate lines with \\n between them
   - If a job has a separate "Achievements:" or "ACHIEVEMENTS:" section, put that in the "achievements" field
   - Keep each job's content completely separate and distinct
   - The achievements from one job must NEVER appear under another job
   - The description from one job must NEVER appear under another job
   - IMPORTANT: Achievements belong to the job that comes BEFORE the achievements section, NOT the job after it
   - CRITICAL: If the same achievements appear multiple times in the resume, they belong to the FIRST job they appear under, and should NOT be duplicated in other jobs

   EDUCATION:
   - school, location, degree, field, startDate, graduationDate, description, grade
   - properly extract date for corresponding education
   - Each education entry MUST be separate
   
   SKILLS:
   - Extract ALL skills as a simple array of strings
   - Look for bullet points or comma-separated lists
   - Example: "skills": ["React.js", "Node.js", "MongoDB", "AWS"]
   - DO NOT include speaking languages here (put in "languages" section)
   - Extract ONLY values that appear under the Skills section
   - NEVER include Core Competencies values in Skills
   
   CORE COMPETENCIES:
   - Core Competencies and Skills are DIFFERENT sections
   - NEVER merge Core Competencies into Skills
   - NEVER place Core Competencies values inside the skills array
   - If the resume contains a section named "Core Competencies", "Core Competency", "Key Competencies", or "Core Strengths", extract those values ONLY into "coreCompetencies"
   - Preserve wording exactly, do not rewrite
   - Do not move values between sections
   
   INTERNSHIPS:
   - title, company, description, duration
   
   LANGUAGES:
   - language, level (Beginner/Intermediate/Advanced), capability (Speak/Read/Write)
   
   CERTIFICATIONS:
   - name, issuer, date, url
   
   AWARDS:
   - title, organization, issueYear, description

5. For all dates: Keep the format exactly as shown in the resume

6. For SKILLS: 
   - ALWAYS return as an array of simple strings
   - DO NOT include any spoken languages (e.g., English, Hindi, Spanish, Bengali, French, etc.) in the skills array
   - Skills must be technical, professional, or domain-specific
   - Spoken/written languages MUST go into the "languages" section only

7. For EXPERIENCE (work experience) - CRITICAL:
   - Each job MUST be a separate object in the "experience" array
   - For each job, the "description" field MUST contain ONLY the bullet points or responsibilities that belong EXCLUSIVELY to that job
   - DO NOT merge responsibilities from different jobs into a single description
   - DO NOT copy responsibilities from Job A into Job B
   - If a job has no bullet points, write a short paragraph describing that role only
   - If you see separate sections like "Achievements:" or "ACHIEVEMENTS:" under a job, include them as a separate "achievements" field for that job
   - IMPORTANT: The achievements MUST stay with the correct job (the job that comes BEFORE the achievements section)
   - The "Achievements:" or "ACHIEVEMENTS:" label itself should NOT be included in the achievements field, only the achievement items
   - Preserve line breaks between achievements using \\n
   - CRITICAL: Do NOT duplicate achievements across multiple jobs. Each achievement should appear only once, in the job where it was first mentioned.

8. If a section has no data, OMIT it completely

9. Return ONLY valid JSON, no explanations

10. DO NOT return "not mentioned", "unknown", "undefined", null, empty string, or similar values. If a field is not present in the resume, simply omit it from the JSON.

11. IMPORTANT: When you see the resume structure like this:
    EXPERIENCE
    Job Title 1
    Date Range 1
    Company 1, Location 1
    • Responsibility 1
    • Responsibility 2
    Achievements:
    • Achievement 1
    • Achievement 2
    
    Job Title 2
    Date Range 2
    Company 2, Location 2
    • Responsibility 3
    • Responsibility 4
    
    You MUST extract:
    - Job 1: title="Job Title 1", company="Company 1", description="Responsibility 1\nResponsibility 2", achievements="Achievement 1\nAchievement 2"
    - Job 2: title="Job Title 2", company="Company 2", description="Responsibility 3\nResponsibility 4"
    
    DO NOT mix Job 1's responsibilities with Job 2's responsibilities.
    DO NOT put Job 1's achievements under Job 2.

12. Each job entry must be completely self-contained. No content should appear in more than one job entry.

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
            resumeId,
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
async function parseResume(userId: string | null, filePath: string, guestId: string | null = null, resumeId?: string) {
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
    aiParsed = await extractDataFromText(userId, extractedText, guestId, resumeId);
    // console.log(JSON.stringify(aiParsed, null, 2));
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