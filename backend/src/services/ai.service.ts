import OpenAI from "openai";
import config from "../config/api";
import { retryWithQualityCheck, spellCheckContent } from "../utils/spellCheck";

// Skill validation constants
const MAX_SKILLS_PER_CATEGORY = 5;
const MAX_TOTAL_SKILLS = 20;
const MIN_SKILL_LENGTH = 2;
const MAX_SKILL_LENGTH = 40;

// Helper function to validate and truncate skill names
const validateSkill = (skill: string): string => {
  // Trim whitespace
  let validated = skill.trim();

  // Truncate to max length
  if (validated.length > MAX_SKILL_LENGTH) {
    validated = validated.substring(0, MAX_SKILL_LENGTH);
  }

  // Remove any special characters except hyphens, slashes, ampersands and spaces
  validated = validated.replace(/[^\w\s\-\/&]/g, "");

  // Ensure minimum length
  if (validated.length < MIN_SKILL_LENGTH) {
    return "";
  }

  return validated;
};

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

// Context-specific prompt builders
function summaryPromptBuilder(
  text: string,
  numSuggestions: number,
  metadata?: any
): { prompt: string; systemMessage: string } {
  const {
    totalYears,
    experienceSummary,
    keyAchievements,
    experienceCount,
    techStack,
  } = metadata || {};

  const prompt = `Generate exactly 1 professional resume summary paragraph for a candidate with the following background:

Experience: ${totalYears || 0} years total experience${
    experienceSummary ? `, including: ${experienceSummary}` : ""
  }
Key Achievements: ${keyAchievements || "No specific achievements provided"}
Tech Stack: ${techStack || "No specific tech stack provided"}
Current summary text: "${text || "No current summary"}"

CRITICAL REQUIREMENTS:
- Generate EXACTLY 1 paragraph (2-4 sentences) written in FIRST PERSON (using "I", not "the candidate")
- MUST incorporate the tech stack, key achievements and experience details provided above
- Focus on career progression and technical skills from the tech stack and achievements
- Make it professional and suitable for a resume summary section
- Keep it under 150 words
- NO bullet points, NO hyphens, NO numbering, NO line breaks
- Return ONLY the paragraph text, no explanations or formatting.

Example: "As a dynamic software developer with current experience at Quotus, I have pioneered the creation of 5 impactful features for the core product that significantly enhanced functionality and revolutionized user experience through innovative feature introductions."

Generate a first-person summary that incorporates the candidate's actual experience and achievements.`;

  const systemMessage =
    "You are a professional resume writing expert. Generate exactly 1 first-person summary paragraph (using 'I') that reflects the candidate's actual experience background provided. Return ONLY the paragraph text, no bullet points or formatting.";

  return { prompt, systemMessage };
}

function bulletPromptBuilder(
  context: "experience" | "project" | "skills",
  text: string,
  numSuggestions: number,
  metadata?: any
): { prompt: string; systemMessage: string } {
  let contextSpecific = "";
  let requirements = "";
  const hasContent = text && text.trim().length > 10;

  if (context === "experience") {
    const { title, company, keywords } = metadata || {};
    if (hasContent) {
      contextSpecific = `Generate ${numSuggestions} professional bullet points to enhance this work experience${
        title ? ` as ${title}` : ""
      }${company ? ` at ${company}` : ""}${
        keywords && keywords.length > 0
          ? `. Focus on skills and achievements related to: ${keywords.join(
              ", "
            )}`
          : ""
      }.`;
    } else {
      contextSpecific = `Generate ${numSuggestions} professional bullet points for a work experience${
        title ? ` as ${title}` : ""
      }${company ? ` at ${company}` : ""}${
        keywords && keywords.length > 0
          ? ` focusing on skills: ${keywords.join(", ")}`
          : ""
      }.`;
    }
    requirements = `- Generate EXACTLY ${numSuggestions} professional bullet points (complete sentences)
- Each bullet point should start with a strong action verb
- Include measurable results and achievements where possible
- Use professional resume language and terminology`;
  } else if (context === "project") {
    const { name, technologies, keywords } = metadata || {};
    if (hasContent) {
      contextSpecific = `Generate ${numSuggestions} professional bullet points to enhance this project description${
        name ? ` for ${name}` : ""
      }${technologies ? ` using ${technologies}` : ""}${
        keywords && keywords.length > 0
          ? `. Focus on features including: ${keywords.join(", ")}`
          : ""
      }.`;
    } else {
      const techList = technologies || "React and Node.js";
      const techArray = techList.split(",").map((t: string) => t.trim());
      const tech1 = techArray[0] || "React";
      const tech2 = techArray[1] || "Node.js";
      const tech3 = techArray[2] || "Express.js";
      const tech4 = techArray[3] || "PostgreSQL";
      const tech5 = techArray[4] || "Angular";

      contextSpecific = `Generate ${numSuggestions} bullet points for a resume project section about "${
        name || "this project"
      }" built with ${techList}.

Examples:
- Developed "${
        name || "this project"
      }" using ${tech1} and ${tech2}, implementing user authentication and data management features
- Built RESTful APIs for "${
        name || "this project"
      }" using ${tech3}, enabling seamless frontend-backend communication
- Designed database schemas for "${
        name || "this project"
      }" with ${tech4}, optimizing data storage and retrieval
- Created responsive UI components for "${
        name || "this project"
      }" using ${tech5}, enhancing user experience across devices

Generate ${numSuggestions} similar bullet points:`;
    }
    const projectName = name || "this project";
    const techList = technologies || "modern web technologies";
    requirements = `- Each bullet point must start with a strong action verb (Developed, Built, Implemented, Created, etc.)
- Every bullet must specifically mention "${projectName}" by name
- CRITICAL: You MUST use technologies from this exact list: ${techList}
- Do NOT use any technologies outside of: ${techList}
- Focus on technical implementation details, not generic management
- Make each bullet unique and specific to this project's features
- Use professional resume language
- Replace generic terms like "the project" with the actual project name "${projectName}"`;
  } else if (context === "skills") {
    contextSpecific = `Analyze the existing skills and generate ${numSuggestions} complementary professional skill/tool/technology names that match the same level and category.`;
    requirements = `- Generate EXACTLY ${numSuggestions} new skill/tool/technology NAMES (not verbs or actions)
- CRITICAL: Each skill MUST be 1-3 words MAXIMUM - NO EXCEPTIONS
- CRITICAL: Only generate actual skill/tool/technology names - NO action verbs like "Implement", "Integrate", "Optimize", "Develop", etc.
- Analyze the existing skills and suggest COMPLEMENTARY SKILLS OF THE SAME TYPE
- Each suggestion must be a NOUN (skill/tool name), not a VERB (action)
- NO sentences, NO descriptions, NO action words
- Use only ACTUAL technology/tool/skill names that appear in resumes
- Match the professional level of existing skills`;
  }

  const prompt = `${contextSpecific}

Current text: "${text}"

IMPORTANT REQUIREMENTS:
${requirements}
- Each item MUST be spelled correctly and professionally
- Use only common, well-spelled words and terms
- Avoid rare words that might be misspelled
- Focus on standard resume terminology
- Each suggestion must be contextually relevant

Return the suggestions in bullet format:
${Array.from({ length: numSuggestions }, (_, i) => `- suggestion${i + 1}`).join(
  "\n"
)}

Return ONLY the bullet points, no other text or explanations.`;

  const systemMessage = `You are a professional resume writing expert. Generate exactly ${numSuggestions} ${
    context === "skills" ? "skill words" : "bullet points"
  } in bullet format. Return ONLY the bullet points.`;

  return { prompt, systemMessage };
}

// Post-processing safety guards
function processSummaryResponse(responseText: string): string[] {
  // Strip bullets + merge lines into one paragraph
  let processed = responseText
    .replace(/^- /gm, "") // Remove bullet prefixes
    .replace(/^\d+\.\s*/gm, "") // Remove numbering
    .replace(/^\*\s*/gm, "") // Remove asterisks
    .replace(/\n+/g, " ") // Merge lines into one paragraph
    .trim();

  // Ensure it's one paragraph without line breaks
  processed = processed.replace(/\s+/g, " ");

  return processed ? [processed] : [];
}

function processBulletResponse(responseText: string): string[] {
  // Filter only - prefixed lines
  const lines = responseText.split("\n");
  const bullets = lines
    .filter((line) => line.trim().startsWith("-"))
    .map((line) => line.replace(/^- /, "").trim())
    .filter((bullet) => bullet.length > 0);

  return bullets;
}

export async function getAutoSuggestions(
  text: string,
  context: "summary" | "experience" | "project" | "skills",
  metadata?: any,
  numSuggestions?: number
): Promise<string[]> {
  if (!config.openaiApiKey) {
    throw new Error(
      "OpenAI API key not configured. Set OPENAI_API_KEY in environment."
    );
  }

  const model = "gpt-5.2";

  // Determine number of suggestions based on context
  let defaultNum = 1;
  if (context === "experience" || context === "project") {
    defaultNum = 4;
  } else if (context === "skills") {
    defaultNum = 5;
  }
  const suggestionsCount = numSuggestions || defaultNum;

  try {
    let suggestions: string[];

    if (context === "skills") {
      // For skills context, use categorized skills generation
      const jobTitle = text || "Software Developer"; // Use text as job title
      const categorizedSkills = await suggestSkillsByCategories(jobTitle);

      // Format as HTML with categories
      const htmlFormatted = categorizedSkills
        .map(
          (group) =>
            `<h3>${group.category}</h3><ul>${group.skills
              .map((skill) => `<li>${skill}</li>`)
              .join("")}</ul>`
        )
        .join("");

      suggestions = [htmlFormatted];
    } else {
      let promptData: { prompt: string; systemMessage: string };

      if (context === "summary") {
        promptData = summaryPromptBuilder(text, suggestionsCount, metadata);
      } else {
        promptData = bulletPromptBuilder(
          context,
          text,
          suggestionsCount,
          metadata
        );
      }

      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: promptData.systemMessage,
          },
          {
            role: "user",
            content: promptData.prompt,
          },
        ],
        temperature: 0.4,
        max_completion_tokens: 1000,
      });

      let responseText = completion.choices[0]?.message?.content || "";

      // Clean up any markdown or formatting
      responseText = responseText.replace(/```.*?```/gs, "").trim();
      responseText = responseText.replace(/^#+\s*/gm, "").trim();

      // Apply post-processing based on context
      if (context === "summary") {
        suggestions = processSummaryResponse(responseText);
      } else {
        suggestions = processBulletResponse(responseText);
      }
    }

    // Validate and filter suggestions to the exact number needed
    const validSuggestions = suggestions.slice(0, suggestionsCount);

    // Apply spell-check to each suggestion to ensure quality
    const qualityChecked = validSuggestions
      .map((suggestion) => {
        const { corrected } = spellCheckContent(suggestion);
        return corrected;
      })
      .filter((s) => s.length > 0); // Remove empty suggestions

    return qualityChecked;
  } catch (err) {
    console.error("Failed to get auto-suggestions:", err);

    // Fallback suggestions based on context
    const fallbacks: Record<
      "summary" | "experience" | "project" | "skills",
      string[]
    > = {
      summary: [
        "Professional with experience in delivering high-quality results and driving team success.",
      ],
      experience: [
        "Developed and implemented new features and processes",
        "Managed team collaborations and project deliverables",
        "Improved efficiency and streamlined operations",
        "Led cross-functional initiatives and drove results",
      ],
      project: [
        "Scalable and responsive architecture",
        "Modern tech stack with best practices",
        "Efficient performance and optimization",
        "Comprehensive testing and quality assurance",
      ],
      skills: [
        `<h3>Core / Technical Skills</h3><ul><li>Project Management</li><li>Data Analysis</li></ul><h3>Tools & Technologies</h3><ul><li>Communication</li><li>Problem Solving</li></ul>`,
      ],
    };

    return fallbacks[context].slice(0, suggestionsCount);
  }
}

// Legacy functions for backward compatibility
export async function enhanceText(
  text: string,
  tone: string = "professional",
  maxWords?: number,
  format: "bullets" | "paragraphs" = "bullets"
): Promise<string> {
  // For paragraphs, use summary context
  if (format === "paragraphs") {
    const suggestions = await getAutoSuggestions(text, "summary", undefined, 1);
    return suggestions[0] || text;
  }
  // For bullets, use experience context as default
  const suggestions = await getAutoSuggestions(
    text,
    "experience",
    undefined,
    4
  );
  return suggestions.map((s) => `- ${s}`).join("\n");
}

export async function suggestImprovements(
  text: string
): Promise<{ suggestion: string; reason: string }[]> {
  // This function is not directly related to the core requirement, return empty for now
  return [];
}

export async function suggestSkills(summary: string): Promise<string[]> {
  return await getAutoSuggestions(summary, "skills", undefined, 6);
}

export async function suggestSkillsByCategories(
  jobTitle: string,
  industry?: string,
  experienceData?: any[]
): Promise<{ category: string; skills: string[] }[]> {
  if (!config.openaiApiKey) {
    throw new Error(
      "OpenAI API key not configured. Set OPENAI_API_KEY in environment."
    );
  }

  const categories = [
    "Core / Technical Skills",
    "Tools & Technologies",
    "Functional / Domain Skills",
    "Soft / Professional Skills",
  ];

  const results: { category: string; skills: string[] }[] = [];

  for (const category of categories) {
    let categorySpecificPrompt = "";
    switch (category) {
      case "Core / Technical Skills":
        categorySpecificPrompt =
          "technical skills, programming languages, frameworks, algorithms, system design";
        break;
      case "Tools & Technologies":
        categorySpecificPrompt =
          "software tools, development environments, cloud platforms, databases, version control";
        break;
      case "Functional / Domain Skills":
        categorySpecificPrompt =
          "business analysis, project management, quality assurance, data processing, system integration";
        break;
      case "Soft / Professional Skills":
        categorySpecificPrompt =
          "communication, leadership, problem-solving, teamwork, time management";
        break;
    }

    const prompt = `Based on the job title "${jobTitle}"${
      industry ? ` in the ${industry} industry` : ""
    }, suggest exactly 5 SHORT relevant ${categorySpecificPrompt} that would be valuable for this role.

CRITICAL REQUIREMENTS:
- Each skill MUST be a SHORT NAME (1-3 words max, max 40 characters)
- Examples: "JavaScript", "Project Management", "React", "Python", "Communication", "AWS", "Docker", "Agile", "Leadership"
- Examples of BAD responses (do NOT include): "Experienced in JavaScript", "Strong communication skills", "Ability to manage projects"
- Each skill must be 2-40 characters long
- Focus on ${categorySpecificPrompt} only
- Return ONLY 5 bullet points with skill names, no explanations or other text.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `You are a professional career advisor. For the category "${category}", return exactly 5 skill names in bullet format. CRITICAL: Return ONLY the bullet points with skill names. No introductions, no explanations, no category headers, no "AI enhanced" labels, no extra text. Each skill must be 1-3 words, max 40 characters.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_completion_tokens: 150,
      });

      let responseText = completion.choices[0]?.message?.content || "";

      // Clean up any markdown or formatting
      responseText = responseText.trim();

      // Remove any AI attribution labels
      responseText = responseText
        .replace(/AI-enhanced for clarity and readability/gi, "")
        .trim();
      responseText = responseText.replace(/Original[:\s]*/gi, "").trim();
      responseText = responseText.replace(/AI Enhanced[:\s]*/gi, "").trim();
      responseText = responseText.replace(/Enhanced by AI[:\s]*/gi, "").trim();
      responseText = responseText
        .replace(/:: Enhanced by AI[:\s]*/gi, "")
        .trim();
      responseText = responseText
        .replace(/Core \/ Technical Skills[:\s]*/gi, "")
        .trim();
      responseText = responseText
        .replace(/Tools & Technologies[:\s]*/gi, "")
        .trim();
      responseText = responseText
        .replace(/Functional \/ Domain Skills[:\s]*/gi, "")
        .trim();
      responseText = responseText
        .replace(/Soft \/ Professional Skills[:\s]*/gi, "")
        .trim();
      responseText = responseText.replace(/\d+\/\d+/g, "").trim(); // Remove "2/3", "3/3" etc.
      responseText = responseText.replace(/\n\s*\n/g, "\n").trim(); // Remove extra blank lines

      // Parse bullet points - handle various formats
      const skills: string[] = [];
      const lines = responseText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      for (const line of lines) {
        // Skip category headers
        if (
          line.includes("Core / Technical Skills") ||
          line.includes("Tools & Technologies") ||
          line.includes("Functional / Domain Skills") ||
          line.includes("Soft / Professional Skills")
        ) {
          continue;
        }

        // Check if line is a bullet point
        if (
          line.startsWith("-") ||
          line.match(/^\d+\./) ||
          line.match(/^[•·*]/)
        ) {
          let skill = line.replace(/^[-•·*\d+\.\s]+/, "").trim();
          // Remove any remaining formatting or extra text
          skill = skill.replace(/\s*[:-]\s*.*$/, "").trim();

          // Validate skill using helper function
          const validatedSkill = validateSkill(skill);
          if (validatedSkill && !skills.includes(validatedSkill)) {
            skills.push(validatedSkill);
          }
        } else if (
          line.length > 1 &&
          line.length <= 50 &&
          !line.includes(":") &&
          !line.match(/^\d+$/)
        ) {
          // If no bullet format, treat as direct skill name with validation
          const validatedSkill = validateSkill(line);
          if (validatedSkill && !skills.includes(validatedSkill)) {
            skills.push(validatedSkill);
          }
        }
      }

      // Ensure we have exactly 5 skills, pad with fallbacks if needed
      const finalSkills = skills.slice(0, 5);
      while (finalSkills.length < 5) {
        const fallbacks = {
          "Core / Technical Skills": [
            "JavaScript",
            "Python",
            "Java",
            "C++",
            "SQL",
          ],
          "Tools & Technologies": [
            "Docker",
            "AWS",
            "Git",
            "Kubernetes",
            "Jenkins",
          ],
          "Functional / Domain Skills": [
            "Project Management",
            "Data Analysis",
            "Agile",
            "Scrum",
            "Requirements Gathering",
          ],
          "Soft / Professional Skills": [
            "Communication",
            "Leadership",
            "Problem Solving",
            "Teamwork",
            "Time Management",
          ],
        };
        const fallbackSkill =
          fallbacks[category as keyof typeof fallbacks][finalSkills.length];
        if (fallbackSkill && !finalSkills.includes(fallbackSkill)) {
          finalSkills.push(fallbackSkill);
        } else {
          break; // Avoid infinite loop
        }
      }

      results.push({ category, skills: finalSkills });
    } catch (error: any) {
      console.error(`OpenAI skills suggestion for ${category} failed:`, error);
      // Add fallback skills for the category
      const fallbacks: Record<string, string[]> = {
        "Core / Technical Skills": [
          "JavaScript",
          "Python",
          "SQL",
          "React",
          "Node.js",
        ],
        "Tools & Technologies": [
          "Docker",
          "AWS",
          "Git",
          "Kubernetes",
          "Jenkins",
        ],
        "Functional / Domain Skills": [
          "Project Management",
          "Data Analysis",
          "System Design",
          "Agile",
          "Testing",
        ],
        "Soft / Professional Skills": [
          "Communication",
          "Leadership",
          "Problem Solving",
          "Teamwork",
          "Time Management",
        ],
      };
      results.push({ category, skills: fallbacks[category] || [] });
    }
  }

  return results;
}

export async function suggestHobbies(
  jobTitle?: string,
  industry?: string,
  existingHobbies?: string[]
): Promise<string[]> {
  // Simplified implementation
  return ["Reading", "Travel", "Sports", "Music", "Cooking"];
}

export async function suggestDescriptionParagraphs(
  context: "experience" | "project",
  currentDescription: string = "",
  metadata?: any
): Promise<string[]> {
  return await getAutoSuggestions(currentDescription, context, metadata, 4);
}

export async function suggestSummaryParagraphs(
  currentSummary: string = "",
  jobTitle?: string,
  industry?: string,
  keywords?: string[],
  experienceSummary?: string,
  projectSummary?: string,
  experienceCount: number = 0
): Promise<string[]> {
  return await getAutoSuggestions(currentSummary, "summary", undefined, 1);
}

export async function suggestKeyAchievements(
  jobTitle?: string,
  industry?: string,
  existingAchievements?: string[],
  metadata?: any
): Promise<string[]> {
  return await getAutoSuggestions(jobTitle || "", "experience", undefined, 4);
}
