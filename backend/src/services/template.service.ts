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
import { buildModernSidebarTemplate } from "../templates/modern-sidebar";
import { buildFormalIndianCvTemplate } from "../templates/formal-indian-cv";
import { buildPhotoMinimalTemplate } from "../templates/photo-minimal";
import { buildPhotoModernProTemplate } from "../templates/photo-modern-pro";
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
import { buildCompactClassicTemplate } from "../templates/compact-classic";
import { buildMinimalAtsTemplate } from "../templates/minimal-ats";
import { buildCosmosTemplate } from "../templates/cosmos";
import { buildNovaTemplate } from "../templates/nova";
import { buildStellarTemplate } from "../templates/stellar";
import { buildOrionTemplate } from "../templates/orion";
import { buildNebulaTemplate } from "../templates/nebula";
import { buildAtsClassicTemplate } from "../templates/ats-classic";
import { buildModernExecutiveTemplate } from "../templates/modern-executive";
import { buildImpactResumeTemplate } from "../templates/impactResume";
import { buildStartupAndTechTemplate } from "../templates/startup&Tech";
import { buildModernCorporateTemplate } from "../templates/modernCorporate";
import { buildSeniorLeadershipTemplate } from "../templates/seniorLeadership";
import { buildCorporateStandardTemplate } from "../templates/corporateStandard";

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
  // console.log("[renderResumeHtml] Called with:", {
  //   resumeId,
  //   template,
  //   hasTheme: !!theme,
  //   hasCurrentData: !!currentData,
  //   currentDataKeys: currentData ? Object.keys(currentData) : null,
  // });

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
    name: "Ajaya Dugar",
    email: "ajaya@gmail.com",
    phone: "+91 98765 43210",
    location: "Kolkata, West Bengal, India",
    linkedin: "https://linkedin.com/in/ajayadugar",
    github: "https://github.com/ajayadugar",
    portfolioUrl: "https://ajayadugar.dev",
    image: undefined as string | undefined,
  },

  summary:
    "Results-driven Full Stack Developer with 6+ years of experience designing and developing scalable web applications. Skilled in React, Node.js, TypeScript, cloud technologies, and modern software development practices. Strong background in delivering high-performance solutions and collaborating with cross-functional teams.",

  experience: [
    {
      id: "exp1",
      title: "Senior Software Engineer",
      company: "Infosys Limited",
      startDate: "Jan 2022",
      endDate: "Present",
      description: `
      Led development of enterprise-grade web applications using React and Node.js.
      Improved application performance by 40% through code optimization and caching strategies.
      Collaborated with product managers and designers to deliver customer-focused features.
      Mentored junior developers and conducted code reviews.
      Integrated third-party APIs and cloud services to improve scalability.
      `,
    },

    {
      id: "exp2",
      title: "Software Engineer",
      company: "Tata Consultancy Services (TCS)",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      description: `
       Developed and maintained client-facing applications using JavaScript and React.
        Implemented RESTful APIs and backend services using Node.js.
        Participated in Agile sprint planning, development, and deployment activities.
        Reduced production bugs through comprehensive testing and quality assurance.
        Worked closely with stakeholders to gather requirements and deliver solutions.
      `,
    },

    {
      id: "exp3",
      title: "Junior Software Developer",
      company: "Webskitters Technology Solutions",
      startDate: "Jul 2018",
      endDate: "May 2019",
      description: `
        Built responsive websites using HTML, CSS, JavaScript, and Bootstrap.
        Assisted in database design and backend integration.
        Fixed bugs and enhanced existing application features.
        Collaborated with senior developers on multiple client projects.
      `,
    },
  ],

  projects: [
    {
      id: "proj1",
      name: "E-Commerce Marketplace",
      description:
        "Developed a scalable multi-vendor e-commerce platform supporting secure payments, product management, and order tracking.",
      technologies: "React, Node.js, MongoDB, AWS",
      url: "https://github.com/ajayadugar/ecommerce-platform",
    },

    {
      id: "proj2",
      name: "Hospital Management System",
      description:
        "Built a comprehensive healthcare management system for patient records, appointments, billing, and reporting.",
      technologies: "React, Express.js, PostgreSQL",
      url: "https://github.com/ajayadugar/hospital-management",
    },

    {
      id: "proj3",
      name: "Employee Attendance Portal",
      description:
        "Designed and developed a cloud-based attendance and leave management portal with real-time reporting.",
      technologies: "TypeScript, React, Firebase",
      url: "https://github.com/ajayadugar/attendance-portal",
    },
  ],

  education: [
    {
      id: "edu1",
      degree: "Master of Computer Applications (MCA)",
      school: "University of Calcutta",
      field: "Computer Applications",
      graduationDate: "2020",
    },

    {
      id: "edu2",
      degree: "Bachelor of Computer Applications (BCA)",
      school: "Techno India University, Kolkata",
      field: "Computer Applications",
      graduationDate: "2018",
    },

    {
      id: "edu3",
      degree: "Higher Secondary Education",
      school: "St. Xavier's Collegiate School, Kolkata",
      field: "Science",
      graduationDate: "2015",
    },
  ],

  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Git",
    "REST APIs",
    "HTML",
    "CSS",
  ],

  languages: [
    { language: "English", level: "Professional" },
    { language: "Hindi", level: "Native" },
    { language: "Bengali", level: "Native" },
  ],

  hobbies: [
    "Photography",
    "Traveling",
    "Reading",
    "Cricket",
    "Technology Blogging",
  ],

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
    case "compact-classic":
      return buildCompactClassicTemplate(data, theme);
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
    case "impact-resume":
      return buildImpactResumeTemplate(data, theme);
    case "startup-tech":
      return buildStartupAndTechTemplate(data, theme);
    case "modern-corporate":
      return buildModernCorporateTemplate(data, theme);
    case "senior-leadership":
      return buildSeniorLeadershipTemplate(data, theme);
    case "corporate-standard":
      return buildCorporateStandardTemplate(data, theme);
    case "ats-classic":
      return buildAtsClassicTemplate(data, theme);
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
    case "modern-sidebar":
      return buildModernSidebarTemplate(data, theme);
    case "formal-indian-cv":
      return buildFormalIndianCvTemplate(data, theme);
    case "photo-minimal":
      return buildPhotoMinimalTemplate(data, theme);
    case "photo-modern-pro":
      return buildPhotoModernProTemplate(data, theme);
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
