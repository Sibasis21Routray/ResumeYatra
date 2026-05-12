import { Request, Response } from "express";
import Resume from "../models/Resume";
import ResumeVersion from "../models/ResumeVersion";
import mongoose from "mongoose";
import OpenAI from "openai";
import { normalizeParsedResume } from "../utils/normalizeParsedResume";
import TokenUsage from "../models/TokenUsage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getGuestId(headers: any): string | null {
  const guestId = headers["x-guest-id"];
  return Array.isArray(guestId) ? guestId[0] : guestId || null;
}

function fixMalformedJSON(text: string): string {
  let cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];
  cleaned = cleaned
    .replace(/\}\s*\{/g, "},{")
    .replace(/"\s*"/g, '","')
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
    .replace(/\s+/g, " ")
    .replace(/\[\s*\]/g, "[]")
    .replace(/\{\s*\}/g, "{}")
    .replace(/,(\s*[}\]])/g, "$1");
  const open = (cleaned.match(/{/g) || []).length;
  const close = (cleaned.match(/}/g) || []).length;
  if (open > close) cleaned += "}".repeat(open - close);
  return cleaned;
}

// ─────────────────────────────────────────────
// CLEAN PHONE NUMBER (remove country code)
// ─────────────────────────────────────────────
function cleanPhoneNumber(phone: string): string {
  if (!phone || typeof phone !== "string") return phone;
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");
  
  // If number starts with country code (91 for India, 1 for US, etc.)
  // Remove common country codes
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith("1") && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith("44") && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith("61") && cleaned.length === 11) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith("86") && cleaned.length === 13) {
    cleaned = cleaned.substring(2);
  }
  
  // For Indian numbers: if 10 digits after removing 91, keep as is
  // For US numbers: if 10 digits after removing 1, keep as is
  
  return cleaned;
}

// ─────────────────────────────────────────────
// AI-POWERED SKILL SUGGESTION
// ─────────────────────────────────────────────
async function enhanceSkillsWithAI(
  userId: string | null, 
  currentSkills: any, 
  experience: any[], 
  summary: string,
  options?: { skipLogging?: boolean; guestId?: string | null }
): Promise<{ skills: string[], usage: any }> {
  const guestId = options?.guestId || null;
  // ... (rest of the prompt logic)
  // Parse current skills
  let existingSkills: string[] = [];
  if (Array.isArray(currentSkills)) {
    existingSkills = currentSkills;
  } else if (typeof currentSkills === "string") {
    if (currentSkills.includes("<ul>")) {
      const ulMatch = currentSkills.match(/<ul>(.*?)<\/ul>/s);
      if (ulMatch) {
        const liMatches = ulMatch[1].match(/<li>(.*?)<\/li>/g);
        if (liMatches) {
          existingSkills = liMatches.map((li: string) => li.replace(/<\/?li>/g, "").trim());
        }
      }
    } else if (currentSkills.includes(",")) {
      existingSkills = currentSkills.split(",").map((s: string) => s.trim());
    } else {
      existingSkills = [currentSkills];
    }
  }
  
  // Extract job titles and tech from experience
  const jobTitles = experience?.map((exp: any) => exp.title).filter(Boolean) || [];
  const techFromExp: string[] = [];
  
  // Extract technologies from experience descriptions
  if (experience) {
    for (const exp of experience) {
      if (exp.description) {
        const techKeywords = ["React", "Angular", "Vue", "Node", "Python", "Java", "JavaScript", 
          "TypeScript", "AWS", "Azure", "Docker", "Kubernetes", "MongoDB", "PostgreSQL", 
          "MySQL", "GraphQL", "REST", "API", "CI/CD", "Jenkins", "Git", "Agile", "Scrum"];
        for (const tech of techKeywords) {
          if (exp.description.toLowerCase().includes(tech.toLowerCase())) {
            techFromExp.push(tech);
          }
        }
      }
    }
  }
  
  const uniqueTechFromExp = [...new Set(techFromExp)];
  
  const skillPrompt = `You are a technical skills analyst. Based on the following information, suggest 10-15 RELEVANT professional skills.

EXISTING SKILLS: ${existingSkills.join(", ")}
JOB TITLES: ${jobTitles.join(", ")}
TECHNOLOGIES MENTIONED: ${uniqueTechFromExp.join(", ")}
${summary ? `SUMMARY CONTEXT: ${summary.substring(0, 200)}` : ""}

RULES:
1. Combine existing skills with inferred skills from job titles
2. Add relevant technologies, frameworks, and methodologies
3. Expand abbreviations (py → Python, js → JavaScript, ts → TypeScript)
4. Remove duplicates
5. Return ONLY a JSON object: { "skills": ["skill1", "skill2", ...] }
6. Skills should be professional, technical, and industry-relevant
7. Include both hard skills and relevant soft skills
8. Do NOT include spoken languages (English, Hindi, etc.) in skills

Return ONLY valid JSON.`;

  try {
    const response = (await openai.responses.create({
      model: "gpt-5.2",
      input: skillPrompt,
      temperature: 0.2,
      max_output_tokens: 1024,
      text: {
        format: {
          type: "json_schema",
          name: "skills",
          schema: {
            type: "object",
            properties: {
              skills: { type: "array", items: { type: "string" } }
            },
            required: ["skills"],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    })) as any;

    const usage = response.usage as any;
    const usageData = {
      promptTokens: usage.prompt_tokens ?? usage.promptTokens ?? usage.input_tokens ?? usage.inputTokens ?? 0,
      completionTokens: usage.completion_tokens ?? usage.completionTokens ?? usage.output_tokens ?? usage.outputTokens ?? 0,
      totalTokens: usage.total_tokens ?? usage.totalTokens ?? 0,
      model: response.model || "gpt-5.2"
    };

    // Only log if called directly (not from enhanceResume)
    if ((userId || guestId) && usage && !options?.skipLogging) {
      await TokenUsage.create({
        userId,
        guestId,
        ...usageData,
        aiModel: usageData.model,
        action: "enhanceSkillsWithAI",
      });
    }

    let aiText = response.output_text?.trim() || "";
    aiText = aiText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(aiText);
    
    const suggestedSkills = parsed.skills || [];
    // Merge existing with suggested, remove duplicates
    const allSkills = [...new Set([...existingSkills, ...suggestedSkills])];
    console.log(`[enhanceSkillsWithAI] Enhanced from ${existingSkills.length} to ${allSkills.length} skills`);
    
    return { skills: allSkills, usage: usageData };
  } catch (err: any) {
    console.error("[enhanceSkillsWithAI] Failed:", err.message);
    return { skills: existingSkills, usage: null };
  }
}

// ─────────────────────────────────────────────
// CALCULATE TOTAL YEARS OF EXPERIENCE
// ─────────────────────────────────────────────
function calculateTotalExperience(experience: any[]): string {
  if (!experience || !Array.isArray(experience) || experience.length === 0) {
    return "";
  }

  let totalMonths = 0;
  const currentDate = new Date();

  for (const exp of experience) {
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (exp.startDate) {
      startDate = new Date(exp.startDate);
      if (isNaN(startDate.getTime())) {
        const monthYearMatch = exp.startDate.match(/([A-Za-z]+)\s+(\d{4})/);
        if (monthYearMatch) {
          startDate = new Date(monthYearMatch[2], getMonthNumber(monthYearMatch[1]), 1);
        }
      }
    }

    if (exp.isCurrent) {
      endDate = currentDate;
    } else if (exp.endDate) {
      endDate = new Date(exp.endDate);
      if (isNaN(endDate.getTime())) {
        const monthYearMatch = exp.endDate.match(/([A-Za-z]+)\s+(\d{4})/);
        if (monthYearMatch) {
          endDate = new Date(monthYearMatch[2], getMonthNumber(monthYearMatch[1]), 1);
        }
      }
    }

    if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                     (endDate.getMonth() - startDate.getMonth());
      totalMonths += Math.max(0, months);
    }
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0 && months === 0) return "";
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
}

function getMonthNumber(monthName: string): number {
  const months: Record<string, number> = {
    "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
    "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
  };
  return months[monthName] || 0;
}

// ─────────────────────────────────────────────
// POST-PROCESSING: Clean bullet symbols and ensure proper line breaks
// ─────────────────────────────────────────────
function cleanBulletSymbols(data: any): any {
  if (!data || typeof data !== "object") return data;

  const cleanText = (text: string): string => {
    if (!text || typeof text !== "string") return text;

    const hasLineBreaks = text.includes("\n");

    let text2 = text;
    if (!hasLineBreaks) {
      text2 = text2.replace(/\s+[•·●○▪▫►▸◆◇■□◦›\*]\s+/g, "\n");
      text2 = text2.replace(/\s+-\s+(?=[A-Z])/g, "\n");
      text2 = text2.replace(/^[•·●○▪▫►▸◆◇■□◦›\-\*]\s*/g, "");
    }

    let processed = text2;
    if (!processed.includes("\n") && processed.length > 100) {
      const sentences = processed.split(/\.\s+(?=[A-Z])/);
      if (sentences.length > 1) {
        processed = sentences
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
          .join("\n");
      }
    }

    const lines = processed.split(/\r?\n/);
    const cleanedLines = lines.map((line) => {
      let cleaned = line;
      cleaned = cleaned.replace(/^[•\-*]\s*/, "");
      cleaned = cleaned.replace(/^\d+\.\s*/, "");
      cleaned = cleaned.replace(/^[a-zA-Z]\)\s*/, "");
      cleaned = cleaned.replace(/^[◦▪▸›]\s*/, "");
      cleaned = cleaned.replace(/^[•·●○▪▫►▸◆◇■□]\s*/, "");
      return cleaned.trim();
    });

    const nonEmptyLines = cleanedLines.filter((line) => line.length > 0);
    return nonEmptyLines.length > 1
      ? nonEmptyLines.join("\n")
      : nonEmptyLines[0] || "";
  };

  const sectionsWithDescriptions = [
    "experience", "internships", "projects", "academicProjects",
    "clientProjects", "leadershipPositions", "volunteering",
    "teachingExperience", "mentorshipExperience"
  ];

  for (const section of sectionsWithDescriptions) {
    if (data[section] && Array.isArray(data[section])) {
      data[section] = data[section].map((item: any) => {
        if (item.description && typeof item.description === "string") {
          item.description = cleanText(item.description);
        }
        if (item.achievements && typeof item.achievements === "string") {
          item.achievements = cleanText(item.achievements);
        }
        return item;
      });
    }
  }

  if (data.trainingPrograms && Array.isArray(data.trainingPrograms)) {
    data.trainingPrograms = data.trainingPrograms.map((item: any) => {
      if (item.description && typeof item.description === "string") {
        item.description = cleanText(item.description);
      }
      return item;
    });
  }

  return data;
}

// ─────────────────────────────────────────────
// CLEAN PHONE NUMBERS IN PERSONAL DATA
// ─────────────────────────────────────────────
function cleanPhoneNumbersInData(data: any): any {
  if (!data || typeof data !== "object") return data;
  
  if (data.personal) {
    if (data.personal.phone) {
      data.personal.phone = cleanPhoneNumber(data.personal.phone);
    }
    if (data.personal.alternatePhone) {
      data.personal.alternatePhone = cleanPhoneNumber(data.personal.alternatePhone);
    }
  }
  
  return data;
}

// ─────────────────────────────────────────────
// ENHANCED PROMPT BUILDER with experience calculation
// ─────────────────────────────────────────────
function buildEnhancementPrompt(data: any): string {
  const totalExperience = calculateTotalExperience(data.experience);
  const totalYearsText = totalExperience ? `Total Experience: ${totalExperience}` : "";

  const skillsList = Array.isArray(data.skills) ? data.skills : 
                     (typeof data.skills === "string" ? data.skills.split(/[,\n]/) : []);
  const topSkills = skillsList.slice(0, 5).join(", ");

  return `You are a world-class career strategist, ATS optimization expert, and professional resume writer with 20+ years of experience.

${totalYearsText ? `📊 CONTEXT FROM RESUME: ${totalYearsText}` : ""}
${topSkills ? `🔧 KEY SKILLS IDENTIFIED: ${topSkills}` : ""}

Your task: Transform the provided resume JSON into a **TOP 1% ELITE** professional document.

═══════════════════════════════════════════════════════
CRITICAL RULES - NO REPETITION OF YEARS OF EXPERIENCE
═══════════════════════════════════════════════════════

⚠️ IMPORTANT: The total years of experience should ONLY appear ONCE in the ENTIRE resume.
- Put it ONLY in the SUMMARY section
- Do NOT repeat it in careerObjective
- Do NOT repeat it in experience descriptions

═══════════════════════════════════════════════════════
CRITICAL FORMATTING RULES
═══════════════════════════════════════════════════════

For ALL description fields:
✅ CORRECT: Each point on its own line, NO bullet symbols
"Architected microservices handling 1M+ daily requests
Led team of 5 engineers to deliver project 2 weeks early
Reduced cloud costs by 35% through optimization"

❌ WRONG: Single paragraph, bullet symbols, or numbered lists

═══════════════════════════════════════════════════════
PROFESSIONAL ENHANCEMENT RULES
═══════════════════════════════════════════════════════

1. Use POWERFUL action verbs: 
   - "Worked on" → "Engineered", "Architected", "Implemented"
   - "Responsible for" → "Led", "Owned", "Directed"
   - "Helped" → "Drove", "Spearheaded", "Championed"


2. Add QUALITATIVE impact when metrics unavailable:
   - "Delivered significant business value"
   - "Drove measurable operational improvements"

═══════════════════════════════════════════════════════
PRIORITY SECTIONS (Enhance these with EXTRA care)
═══════════════════════════════════════════════════════

🔴 HIGHEST PRIORITY:
1. SUMMARY - Include total experience ONCE, top skills, key achievements
2. EXPERIENCE - Each entry: 3-5 powerful bullet points with metrics
3. SKILLS - Clean array, expanded abbreviations

🟡 HIGH PRIORITY:
4. CAREER OBJECTIVE - Clear, focused, NO experience repetition
5. EDUCATION - Enhanced descriptions
6. PROJECTS - Impact-focused descriptions

═══════════════════════════════════════════════════════
SECTION-SPECIFIC ENHANCEMENT GUIDELINES
═══════════════════════════════════════════════════════

── SUMMARY (MOST IMPORTANT) ──
- Include total experience ONCE (from context above)
- Highlight 3-5 top skills
- Mention 1-2 key achievements
- Length: 3-4 powerful sentences

── CAREER OBJECTIVE ──
- NO mention of years of experience
- Focus on career goals and what you offer
- Length: 2-3 sentences

── EXPERIENCE ──
For EACH job:
- Enhance title if vague
- description: 4-5 achievement points
- Each point: Action verb + what + impact

── SKILLS ──
- Return as array: ["React.js", "Node.js", "MongoDB"]
- Expand abbreviations: "py" → "Python", "js" → "JavaScript"
- Remove duplicates

── EDUCATION ──
- Enhance description with 1-2 sentences

═══════════════════════════════════════════════════════
INPUT RESUME JSON:
═══════════════════════════════════════════════════════
${JSON.stringify(data, null, 2)}

Return ONLY the enhanced resume as valid JSON.`;
}

// ─────────────────────────────────────────────
// DEEP MERGE: preserve keys the AI might drop
// ─────────────────────────────────────────────
function deepMergePreserveOriginal(original: any, enhanced: any): any {
  if (!enhanced || typeof enhanced !== "object") return original;
  if (!original || typeof original !== "object") return enhanced;
  if (Array.isArray(original) && Array.isArray(enhanced)) {
    return enhanced.length > 0 ? enhanced : original;
  }

  const result: any = { ...original };
  for (const key of Object.keys(enhanced)) {
    const origVal = original[key];
    const enhVal = enhanced[key];

    if (key === "id" || key === "_id") {
      result[key] = origVal ?? enhVal;
      continue;
    }

    if (enhVal === null || enhVal === undefined) continue;

    if (
      typeof enhVal === "object" &&
      !Array.isArray(enhVal) &&
      typeof origVal === "object" &&
      !Array.isArray(origVal)
    ) {
      result[key] = deepMergePreserveOriginal(origVal, enhVal);
    } else {
      result[key] = enhVal;
    }
  }
  return result;
}

// ─────────────────────────────────────────────
// POST-ENHANCEMENT CLEANUP
// ─────────────────────────────────────────────
function postEnhancementCleanup(data: any): any {
  if (!data || typeof data !== "object") return data;

  if (data.careerObjective && typeof data.careerObjective === "string") {
    data.careerObjective = data.careerObjective.replace(/\d+\+?\s*(?:years?|yrs?)\s*(?:of\s*)?experience/gi, "");
    data.careerObjective = data.careerObjective.replace(/\s+/g, " ").trim();
  }

  if (data.summary && typeof data.summary === "string") {
    const sentences = data.summary.split(/[.!?]+/);
    const seenPhrases = new Set();
    const uniqueSentences = sentences.filter(sentence => {
      const trimmed = sentence.trim();
      if (!trimmed) return false;
      const expPattern = trimmed.match(/\d+\+?\s*(?:years?|yrs?)\s*(?:of\s*)?experience/i);
      if (expPattern) {
        const pattern = expPattern[0].toLowerCase();
        if (seenPhrases.has(pattern)) return false;
        seenPhrases.add(pattern);
      }
      return true;
    });
    data.summary = uniqueSentences.join(". ") + ".";
  }

  return data;
}

// ─────────────────────────────────────────────
// MAIN CONTROLLER
// ─────────────────────────────────────────────
export async function enhanceResume(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const userId = (req as any).userId || null;
    const guestId = getGuestId(req.headers);

    console.log(`[enhanceResume] ID: ${id} | userId: ${userId} | guestId: ${guestId}`);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid resume ID" });
    }

    const resume = await Resume.findOne({
      _id: new mongoose.Types.ObjectId(id),
      $or: [
        ...(userId ? [{ ownerId: userId }] : []),
        ...(guestId ? [{ guestId }] : []),
      ],
    });

    if (!resume) {
      console.warn(`[enhanceResume] Not found or access denied: ${id}`);
      return res.status(404).json({ error: "Resume not found or access denied" });
    }

    console.log(`[enhanceResume] Resume found: ${resume._id} | isAiPaid: ${resume.isAiPaid}`);

    if (!resume.isAiPaid) {
      return res.status(402).json({
        error: "Payment required for AI enhancement",
        type: "ai",
      });
    }

    const latestVersion = await ResumeVersion.findOne({
      resumeId: new mongoose.Types.ObjectId(id),
    }).sort({ createdAt: -1 });

    if (!latestVersion?.data) {
      return res.status(400).json({ error: "No resume data found to enhance" });
    }

    let currentData = latestVersion.data;

    // STEP 1: Clean phone numbers (remove country codes)
    currentData = cleanPhoneNumbersInData(currentData);
    console.log("[enhanceResume] Phone numbers cleaned");

    // STEP 2: Enhance skills with AI
    const { skills: enhancedSkills, usage: skillsUsage } = await enhanceSkillsWithAI(
      userId,
      currentData.skills,
      currentData.experience,
      currentData.summary,
      { skipLogging: true, guestId }
    );
    if (enhancedSkills.length > 0) {
      currentData.skills = enhancedSkills;
      console.log(`[enhanceResume] Skills enhanced to ${enhancedSkills.length} skills`);
    }

    // STEP 3: Calculate total experience for debugging
    const totalExp = calculateTotalExperience(currentData.experience);
    console.log(`[enhanceResume] Calculated total experience: ${totalExp}`);

    // STEP 4: Build prompt and call AI
    const prompt = buildEnhancementPrompt(currentData);
    const MAX_RETRIES = 3;
    let enhancedRaw: any = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[enhanceResume] AI call attempt ${attempt}/${MAX_RETRIES}...`);

        const response = (await openai.responses.create({
          model: "gpt-5.2",
          input: prompt,
          temperature: 0.25,
          max_output_tokens: 8192,
        })) as any;

        const usage = response.usage as any;
        if ((userId || guestId) && usage) {
          const currentCallUsage = {
            promptTokens: usage.prompt_tokens ?? usage.promptTokens ?? usage.input_tokens ?? usage.inputTokens ?? 0,
            completionTokens: usage.completion_tokens ?? usage.completionTokens ?? usage.output_tokens ?? usage.outputTokens ?? 0,
            totalTokens: usage.total_tokens ?? usage.totalTokens ?? 0,
          };

          await TokenUsage.create({
            userId,
            guestId,
            promptTokens: currentCallUsage.promptTokens + (skillsUsage?.promptTokens || 0),
            completionTokens: currentCallUsage.completionTokens + (skillsUsage?.completionTokens || 0),
            totalTokens: currentCallUsage.totalTokens + (skillsUsage?.totalTokens || 0),
            aiModel: response.model || "gpt-5.2",
            action: "enhanceResume",
          });
        }

        let aiText = response.output_text?.trim() || "";

        if (!aiText || aiText.length < 100) {
          throw new Error("AI returned insufficient content");
        }

        try {
          const cleanText = aiText
            .replace(/```json\s*/g, "")
            .replace(/```\s*/g, "")
            .trim();
          enhancedRaw = JSON.parse(cleanText);
        } catch {
          enhancedRaw = JSON.parse(fixMalformedJSON(aiText));
        }

        if (enhancedRaw && Object.keys(enhancedRaw).length > 3) {
          console.log(`[enhanceResume] AI success on attempt ${attempt}`);
          break;
        }

        throw new Error("AI returned an empty or near-empty object");
      } catch (err: any) {
        console.warn(`[enhanceResume] Attempt ${attempt} failed: ${err.message}`);
        if (attempt === MAX_RETRIES) {
          throw new Error(`AI failed after ${MAX_RETRIES} attempts: ${err.message}`);
        }
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }
    }

    console.log("[enhanceResume] AI response received, processing...");

    // STEP 5: Clean bullet symbols
    const cleanedData = cleanBulletSymbols(enhancedRaw);
    
    // STEP 6: Apply post-enhancement cleanup
    const cleanedData2 = postEnhancementCleanup(cleanedData);
    
    // STEP 7: Ensure phone numbers remain clean in AI output
    const cleanedData3 = cleanPhoneNumbersInData(cleanedData2);
    
    // STEP 8: Normalize
    const normalized = normalizeParsedResume(cleanedData3);
    
    // STEP 9: Deep merge
    const mergedData = deepMergePreserveOriginal(currentData, normalized);

    // Save new version
    const newVersion = new ResumeVersion({
      resumeId: resume._id,
      resume: resume._id,
      data: mergedData,
    });

    await newVersion.save();
    resume.versions.push(newVersion._id);

    resume.isAiPaid = false;
    resume.isAiEnhanced = true;
    resume.isDownloaded = false;
    await resume.save();

    console.log(`[enhanceResume] New version saved: ${newVersion._id}`);

    return res.json({
      success: true,
      message: "AI enhancement complete. Your resume has been professionally upgraded.",
      versionId: newVersion._id,
      data: newVersion.data,
    });
  } catch (err: any) {
    console.error("[enhanceResume] Fatal error:", err);
    return res.status(500).json({
      error: err.message || "Internal server error during AI enhancement",
    });
  }
}

// ─────────────────────────────────────────────
// Stubs for future features
// ─────────────────────────────────────────────
export async function getSuggestions(req: Request, res: Response) {
  res.status(501).json({ error: "Feature not yet available" });
}
export async function suggestSkills(req: Request, res: Response) {
  res.status(501).json({ error: "Feature not yet available" });
}
export async function suggestSkillsByJobTitle(req: Request, res: Response) {
  res.status(501).json({ error: "Feature not yet available" });
}
export async function getAutoSuggestions(req: Request, res: Response) {
  res.status(501).json({ error: "Feature not yet available" });
}
export async function suggestHobbies(req: Request, res: Response) {
  res.status(501).json({ error: "Feature not yet available" });
}
export async function suggestDescriptionParagraphs(req: Request, res: Response) {
  res.status(501).json({ error: "Feature not yet available" });
}
export async function suggestSummaryParagraphs(req: Request, res: Response) {
  res.status(501).json({ error: "Feature not yet available" });
}
export async function suggestKeyAchievements(req: Request, res: Response) {
  res.status(501).json({ error: "Feature not yet available" });
}
export async function translateText(req: Request, res: Response) {
  res.status(501).json({ error: "Feature not yet available" });
}