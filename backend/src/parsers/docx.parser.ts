// docx.parser.ts
import mammoth from "mammoth";
import * as cheerio from "cheerio";
import { extractSections } from "./section-extractor";
import {
  extractPersonalInfo,
  parseSkillsImproved,
  parseExperienceImproved,
  parseEducationImproved,
  parseProjectsImproved,
} from "./text.parser";

// Define proper return type
export async function parseDocxHtml(docxBuffer: Buffer): Promise<any> {
  try {
    const { value: html } = await mammoth.convertToHtml({ buffer: docxBuffer });

    // Enhance HTML with data-section attributes for better parsing
    const enhancedHtml = enhanceDocxHtml(html);
    const $ = cheerio.load(enhancedHtml);

    // Get all text for personal info extraction
    const allText = $("body")
      .find("p, div, li, h1, h2, h3, h4, h5, h6, br")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean)
      .join("\n");

    // Extract sections
    const sections = extractSections($);

    console.log("Parsed DOCX Sections:", Object.keys(sections));

    // Parse each section using the same logic as text.parser
    const parsed = {
      personal: extractPersonalInfo(allText),
      summary: sections.summary || null,
      skills: parseSkillsImproved(sections.skills || ""),
      experience: parseExperienceImproved(sections.experience || ""),
      education: parseEducationImproved(sections.education || ""),
      projects: parseProjectsImproved(sections.projects || ""),
      certifications: parseCertificationsImproved(
        sections.certifications || ""
      ),
      languages: parseLanguagesImproved(sections.languages || ""),
      hobbies: parseHobbiesImproved(sections.hobbies || ""),
      socialLinks: [] as Array<{ label: string; url: string }>,
      keyAchievements: [] as string[],
      responsibilities: [] as string[],
      tools: [] as string[],
      customSections: [] as Array<{
        heading: string;
        entries: Array<{
          title?: string;
          organization?: string;
          date?: string;
          description?: string;
        }>;
      }>,
    };

    return parsed;
  } catch (error) {
    console.error("DOCX parsing failed:", error);
    throw error;
  }
}

// Helper functions with proper typing
function parseCertificationsImproved(
  text: string
): Array<{ name: string; issuer?: string; date?: string; url?: string }> {
  const certifications: Array<{
    name: string;
    issuer?: string;
    date?: string;
    url?: string;
  }> = [];
  const lines = text.split("\n").filter((line) => line.trim());

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length < 5) continue;

    // Look for certification patterns
    if (
      /\b(certified|certification|certificate|aws|azure|google|pmp|scrum)\b/i.test(
        trimmed
      )
    ) {
      certifications.push({
        name: trimmed,
        issuer: undefined,
        date: undefined,
        url: undefined,
      });
    }
  }

  return certifications;
}

function parseLanguagesImproved(text: string): string[] {
  const languages: string[] = [];
  const candidates = text
    .split(/[,;•\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 30);

  const languageKeywords = [
    "english",
    "hindi",
    "spanish",
    "french",
    "german",
    "chinese",
    "japanese",
    "arabic",
    "russian",
    "portuguese",
    "italian",
  ];

  for (const candidate of candidates) {
    const lower = candidate.toLowerCase();
    if (languageKeywords.some((lang) => lower.includes(lang))) {
      languages.push(candidate);
    } else if (
      /\b(native|fluent|proficient|intermediate|basic)\b/i.test(lower)
    ) {
      // Likely a language proficiency statement
      languages.push(candidate);
    }
  }

  return [...new Set(languages)];
}

function parseHobbiesImproved(text: string): string[] {
  const hobbies: string[] = [];
  const candidates = text
    .split(/[,;•\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 50);

  const hobbyKeywords = [
    "reading",
    "writing",
    "music",
    "sports",
    "travel",
    "photography",
    "cooking",
    "gaming",
    "hiking",
    "cycling",
    "swimming",
    "yoga",
    "painting",
    "drawing",
    "gardening",
    "volunteering",
  ];

  for (const candidate of candidates) {
    const lower = candidate.toLowerCase();
    if (hobbyKeywords.some((hobby) => lower.includes(hobby))) {
      hobbies.push(candidate);
    } else if (
      !/\b(skills|experience|education|work|professional)\b/i.test(lower)
    ) {
      // Avoid including section headers
      hobbies.push(candidate);
    }
  }

  return [...new Set(hobbies)];
}

// Enhance DOCX HTML with data-section attributes for better parsing
function enhanceDocxHtml(html: string): string {
  // This is a simplified version. In a real implementation, you might use
  // more sophisticated heuristics to identify sections based on headings,
  // styles, etc. For now, we'll wrap it in a basic HTML structure if needed

  if (!html.includes("<html>")) {
    html = `<html><body>${html}</body></html>`;
  }

  // Basic enhancement: add data-section attributes based on common patterns
  // This is a placeholder - you might need more sophisticated logic
  const $ = cheerio.load(html);

  // Try to identify headings and add data-section attributes
  $("h1, h2, h3, h4, strong, b").each((_, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (
      text.includes("summary") ||
      text.includes("profile") ||
      text.includes("objective")
    ) {
      $(el).attr("data-section", "summary");
    } else if (text.includes("experience") || text.includes("work")) {
      $(el).attr("data-section", "experience");
    } else if (text.includes("education") || text.includes("academic")) {
      $(el).attr("data-section", "education");
    } else if (text.includes("skills") || text.includes("expertise")) {
      $(el).attr("data-section", "skills");
    } else if (text.includes("projects")) {
      $(el).attr("data-section", "projects");
    }
  });

  return $.html();
}
