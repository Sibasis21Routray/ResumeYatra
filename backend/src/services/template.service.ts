import Resume from "../models/Resume";
import ResumeVersion from "../models/ResumeVersion";
import * as pdfService from "./pdf.service";
import * as storageService from "./storage.service";
import * as cloudinaryService from "./cloudinary.service";
import { buildModernTemplate } from "../templates/modern";
import { buildPhotographicTemplate } from "../templates/photographic";
import { buildCreativeTemplate } from "../templates/creative";
import { buildProfessionalTemplate } from "../templates/professional";
import { buildAzurillTemplate } from "../templates/azurill";
import { buildGengarTemplate } from "../templates/gengar";
import { buildMinimalTemplate } from "../templates/minimal";
import { buildExecutiveTemplate } from "../templates/executive";
import { buildPikachuTemplate } from "../templates/pikachu";
import { buildCharizardTemplate } from "../templates/charizard";
import { buildBlastoiseTemplate } from "../templates/blastoise";
import { buildDragoniteTemplate } from "../templates/dragonite";
import { buildVenusaurTemplate } from "../templates/venusaur";
import { buildAlakazamTemplate } from "../templates/alakazam";
import { buildMewtwoTemplate } from "../templates/mewtwo";
import { buildSquirtleTemplate } from "../templates/squirtle";
import { buildBulbasaurTemplate } from "../templates/bulbasaur";
import { buildEeveeTemplate } from "../templates/eevee";
import { buildMachampTemplate } from "../templates/machamp";
import { buildClassicProfessionalTemplate } from "../templates/classic-professional";
import { buildSkillsFirstTemplate } from "../templates/skills-first";
import { buildMetricsDrivenTemplate } from "../templates/metrics-driven";
import { buildLeadershipManagerialTemplate } from "../templates/leadership-managerial";
import { buildTechItTemplate } from "../templates/tech-it";
import { buildFresherEntryLevelTemplate } from "../templates/fresher-entry-level";
import { buildConsultantFreelancerTemplate } from "../templates/consultant-freelancer";
import { buildOperationsSupportTemplate } from "../templates/operations-support";
import { buildSeniorIndividualContributorTemplate } from "../templates/senior-individual-contributor";
import { buildMinimalAtsTemplate } from "../templates/minimal-ats";
import { buildCosmosTemplate } from "../templates/cosmos";
import { buildNovaTemplate } from "../templates/nova";
import { buildStellarTemplate } from "../templates/stellar";
import { buildOrionTemplate } from "../templates/orion";
import { buildNebulaTemplate } from "../templates/nebula";
import { buildSaanviPatelTemplate } from "../templates/saanvi-patel";
import { buildModernExecutiveTemplate } from "../templates/modern-executive";

// Simple in-memory cache for template previews
const previewCache: Record<string, { url: string; expiresAt: number }> = {};
const PREVIEW_TTL_MS = 1000 * 60 * 60; // 1 hour

// Cache for processed images (base64 encoded)
const imageCache: Record<string, { base64: string; expiresAt: number }> = {};
const IMAGE_CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

export async function renderResume(
  resumeId: string,
  templateId?: string,
  theme?: any
) {
  const template = templateId || "modern";

  // Only fetch latest version from database
  const latestVersion = await ResumeVersion.findOne({ resumeId })
    .sort({ createdAt: -1 })
    .select("data")
    .lean();

  const data = (latestVersion?.data as any) || {};
  const processedData = await processImageForTemplate(data);
  const html = buildHtml(processedData, template, theme);
  return pdfService.generatePdf(html);
}

export async function renderResumeHtml(
  resumeId: string,
  templateId?: string,
  theme?: any,
  currentData?: any
) {
  const template = templateId || "modern";
  console.log("[renderResumeHtml] Called with:", {
    resumeId,
    template,
    hasTheme: !!theme,
    hasCurrentData: !!currentData,
    currentDataKeys: currentData ? Object.keys(currentData) : null,
  });

  let data: any = {};

  if (currentData) {
    // Use currentData if provided (for live preview from frontend)
    data = currentData;
    console.log("[renderResumeHtml] Using provided currentData");
  } else {
    // Only fetch latest version from database when no currentData provided
    console.log(
      "[renderResumeHtml] Fetching from database for resumeId:",
      resumeId
    );
    const latestVersion = await ResumeVersion.findOne({ resumeId })
      .sort({ createdAt: -1 })
      .select("data")
      .lean();

    if (latestVersion?.data) {
      data = latestVersion.data;
      console.log(
        "[renderResumeHtml] Loaded from database, data keys:",
        Object.keys(data)
      );
    } else {
      console.warn(
        "[renderResumeHtml] No version found for resumeId:",
        resumeId
      );
    }
  }

  const processedData =
    template === "photographic" ? await processImageForTemplate(data) : data;
  console.log("[renderResumeHtml] Building HTML for template:", template);
  const html = buildHtml(processedData, template, theme);
  console.log("[renderResumeHtml] Generated HTML length:", html.length);

  return html;
}

// Render a sample resume for a given template (public, used for thumbnails/previews)
export async function renderTemplateSample(templateId?: string, theme?: any) {
  const template = templateId || "modern";
  console.log(
    "[TemplateService] renderTemplateSample called for template:",
    template
  );
  // Use cache key based on template and theme
  const cacheKey = `${template}:${theme ? JSON.stringify(theme) : "default"}`;
  const now = Date.now();
  const cached = previewCache[cacheKey];
  if (cached && cached.expiresAt > now) {
    console.log("[TemplateService] returning cached preview for", cacheKey);
    return cached.url;
  }

  // Minimal sample data used for public previews
  const sampleData = {
    personal: {
      name: "John Doe",
      email: "email@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      portfolioUrl: "https://johndoe.com",
      image: undefined as string | undefined,
    },
    summary:
      "Experienced software engineer with 5+ years of expertise in full-stack development, cloud technologies, and agile methodologies.",
    experience: [
      {
        id: "exp1",
        title: "Senior Software Engineer",
        company: "TechCorp Inc.",
        startDate: "Jan 2022",
        endDate: "Present",
        description:
          "Led development of microservices architecture serving large user bases.",
      },
    ],
    projects: [
      {
        id: "proj1",
        name: "E-commerce Platform",
        description:
          "Built a scalable e-commerce platform handling 10k+ daily transactions.",
        technologies: "React, Node.js, MongoDB, AWS",
        url: "https://github.com/johndoe/ecommerce",
      },
    ],
    education: [
      {
        id: "edu1",
        degree: "B.Sc. Computer Science",
        school: "University of Somewhere",
        field: "Computer Science",
        graduationDate: "May 2020",
      },
    ],
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS"],
    languages: [
      { language: "English", level: "Native" },
      { language: "Spanish", level: "Intermediate" },
    ],
    hobbies: ["Photography", "Hiking", "Reading"],
    fontSize: 16,
    fontFamily: "Arial, sans-serif",
  };

  // Add default image for photographic template if missing
  if (template === "photographic" && !sampleData.personal?.image) {
    sampleData.personal.image = "https://via.placeholder.com/150x150.jpg";
  }

  // Clear cache for photographic to force update
  if (template === "photographic") {
    clearPreviewCache(template, theme);
  }

  const processedData =
    template === "photographic"
      ? await processImageForTemplate(sampleData)
      : sampleData;
  const html = buildHtml(processedData, template, theme);

  // Upload HTML to Cloudinary
  const buffer = Buffer.from(html, "utf-8");
  const filename = `${template}-preview-${Date.now()}.html`;
  const uploadResult = await storageService.uploadBufferToCloudinary(
    buffer,
    filename,
    "templates"
  );

  // Store URL in cache
  const url = uploadResult.secure_url || uploadResult.url;
  previewCache[cacheKey] = { url, expiresAt: Date.now() + PREVIEW_TTL_MS };
  return url;
}

export function clearPreviewCache(templateId?: string, theme?: any) {
  if (!templateId) {
    // clear all
    for (const k of Object.keys(previewCache)) delete previewCache[k];
    return;
  }
  const cacheKey = `${templateId}:${theme ? JSON.stringify(theme) : "default"}`;
  delete previewCache[cacheKey];
}

async function processImageForTemplate(data: any): Promise<any> {
  if (
    data.personal?.image &&
    typeof data.personal.image === "string" &&
    data.personal.image.startsWith("http")
  ) {
    const imageUrl = data.personal.image;
    const now = Date.now();
    const cached = imageCache[imageUrl];

    if (cached && cached.expiresAt > now) {
      console.log("Using cached image for:", imageUrl);
      data.personal.image = cached.base64;
      return data;
    }

    try {
      console.log("Processing image for template:", imageUrl);
      // Try to fetch the image and convert to base64
      const https = require("https");
      const url = new URL(imageUrl);
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: "GET",
        headers: {
          "User-Agent": "ResumeMaker/1.0",
        },
      };

      const response = await new Promise<any>((resolve, reject) => {
        const req = https.request(options, (res: any) => {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`));
            return;
          }
          const chunks: Buffer[] = [];
          res.on("data", (chunk: Buffer) => chunks.push(chunk));
          res.on("end", () => {
            const buffer = Buffer.concat(chunks);
            resolve({
              buffer,
              contentType: res.headers["content-type"] || "image/jpeg",
            });
          });
        });
        req.on("error", reject);
        req.setTimeout(10000, () =>
          reject(new Error("Image download timeout"))
        );
        req.end();
      });

      const base64Data = `data:${
        response.contentType
      };base64,${response.buffer.toString("base64")}`;
      data.personal.image = base64Data;

      // Cache the processed image
      imageCache[imageUrl] = {
        base64: base64Data,
        expiresAt: Date.now() + IMAGE_CACHE_TTL_MS,
      };

      console.log("Successfully processed and cached image");
    } catch (error) {
      console.error("Failed to process image:", error);
      // Keep the original URL if conversion fails
    }
  }
  return data;
}

function buildHtml(data: any, template: string, theme?: any): string {
  switch (template) {
    case "operations-support":
      return buildOperationsSupportTemplate(data, theme);
    case "senior-individual-contributor":
      return buildSeniorIndividualContributorTemplate(data, theme);
    case "minimal-ats":
      return buildMinimalAtsTemplate(data, theme);
    case "cosmos":
      return buildCosmosTemplate(data, theme);
    case "modern-executive":
      return buildModernExecutiveTemplate(data, theme);
    case "nova":
      return buildNovaTemplate(data, theme);
    case "stellar":
      return buildStellarTemplate(data, theme);
    case "orion":
      return buildOrionTemplate(data, theme);
    case "nebula":
      return buildNebulaTemplate(data, theme);
    case "saanvi-patel":
      return buildSaanviPatelTemplate(data, theme);
    case "modern":
      return buildModernTemplate(data, theme);
    case "photographic":
      return buildPhotographicTemplate(data, theme);
    case "creative":
      return buildCreativeTemplate(data, theme);
    case "professional":
      return buildProfessionalTemplate(data, theme);
    case "azurill":
      return buildAzurillTemplate(data, theme);
    case "gengar":
      return buildGengarTemplate(data, theme);
    case "minimal":
      return buildMinimalTemplate(data, theme);
    case "executive":
      return buildExecutiveTemplate(data, theme);
    case "pikachu":
      return buildPikachuTemplate(data, theme);
    case "charizard":
      return buildCharizardTemplate(data, theme);
    case "blastoise":
      return buildBlastoiseTemplate(data, theme);
    case "dragonite":
      return buildDragoniteTemplate(data, theme);
    case "venusaur":
      return buildVenusaurTemplate(data, theme);
    case "alakazam":
      return buildAlakazamTemplate(data, theme);
    case "mewtwo":
      return buildMewtwoTemplate(data, theme);
    case "squirtle":
      return buildSquirtleTemplate(data, theme);
    case "bulbasaur":
      return buildBulbasaurTemplate(data, theme);
    case "eevee":
      return buildEeveeTemplate(data, theme);
    case "machamp":
      return buildMachampTemplate(data, theme);
    case "classic-professional":
      return buildClassicProfessionalTemplate(data, theme);
    case "skills-first":
      return buildSkillsFirstTemplate(data, theme);
    case "metrics-driven":
      return buildMetricsDrivenTemplate(data, theme);
    case "leadership-managerial":
      return buildLeadershipManagerialTemplate(data, theme);
    case "tech-it":
      return buildTechItTemplate(data, theme);
    case "fresher-entry-level":
      return buildFresherEntryLevelTemplate(data, theme);
    case "consultant-freelancer":
      return buildConsultantFreelancerTemplate(data, theme);
    default:
      return buildModernTemplate(data, theme);
  }
}
