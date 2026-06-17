import Resume from "../models/Resume";
import ResumeVersion from "../models/ResumeVersion";
import * as pdfService from "./pdf.service";
import * as storageService from "./storage.service";
import * as cloudinaryService from "./cloudinary.service";
import { TEMPLATE_COLORS, getTemplateMetadata } from "../config/template-colors";
import { buildModernTemplate } from "../templates/modern";
import { buildPhotographicTemplate } from "../templates/photographic";
import { buildAzurillTemplate } from "../templates/azurill";
import { buildModernSidebarTemplate } from "../templates/modern-sidebar";
import { buildFormalIndianCvTemplate } from "../templates/formal-indian-cv";
import { buildPhotoMinimalTemplate } from "../templates/photo-minimal";
import { buildPhotoModernProTemplate } from "../templates/photo-modern-pro";
import { buildMachampTemplate } from "../templates/machamp";
import { buildLeadershipManagerialTemplate } from "../templates/leadership-managerial";
import { buildConsultantFreelancerTemplate } from "../templates/consultant-freelancer";
import { buildCompactClassicTemplate } from "../templates/compact-classic";
import { buildStellarTemplate } from "../templates/stellar";
import { buildOrionTemplate } from "../templates/orion";
import { buildAtsClassicTemplate } from "../templates/ats-classic";
import { buildImpactResumeTemplate } from "../templates/impactResume";
import { buildModernCorporateTemplate } from "../templates/modernCorporate";
import { buildSeniorLeadershipTemplate } from "../templates/seniorLeadership";
import { buildCorporateStandardTemplate } from "../templates/corporateStandard";

// Simple in-memory cache for template previews
const previewCache: Record<string, { url: string; expiresAt: number }> = {};
const PREVIEW_TTL_MS = 1000 * 60 * 60; // 1 hour

// Cache for processed images (base64 encoded)
const imageCache: Record<string, { base64: string; expiresAt: number }> = {};
const IMAGE_CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

export function getAllTemplatesMetadata() {
  return getTemplateMetadata();
}

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

  // Normalize formatting for backwards compatibility
  if (data.formatting) {
    if (data.formatting.fontFamily) data.fontFamily = data.formatting.fontFamily;
    if (data.formatting.bodyFontSize) data.fontSize = data.formatting.bodyFontSize;
    if (data.formatting.fontSize) {
      data.fontSize = data.formatting.fontSize;
      data.formatting.bodyFontSize = data.formatting.bodyFontSize || data.formatting.fontSize;
    }
    if (!theme && data.formatting.theme) theme = data.formatting.theme;
  }

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

  let data: any = {};

  if (currentData) {
    // Use currentData if provided (for live preview from frontend)
    data = currentData;
  } else {
    // Only fetch latest version from database when no currentData provided
    const latestVersion = await ResumeVersion.findOne({ resumeId })
      .sort({ createdAt: -1 })
      .select("data")
      .lean();

    if (latestVersion?.data) {
      data = latestVersion.data;
    }
  }

  // Normalize formatting
  if (data.formatting) {
    if (data.formatting.fontFamily) {
      data.fontFamily = data.formatting.fontFamily;
    }
    if (data.formatting.bodyFontSize) {
      data.fontSize = data.formatting.bodyFontSize;
    }
    if (data.formatting.fontSize) {
      data.fontSize = data.formatting.fontSize;
      data.formatting.bodyFontSize = data.formatting.bodyFontSize || data.formatting.fontSize;
    }
    if (!theme && data.formatting.theme) {
      theme = data.formatting.theme;
    }
  }

  const processedData =
    template === "photographic" ? await processImageForTemplate(data) : data;
  let html = buildHtml(processedData, template, theme);
  
  // Inject Google Fonts if needed to ensure font changes work
  html = injectGoogleFonts(html, data.fontFamily || data.formatting?.fontFamily);
  
  return html;
}

/**
 * Injects Google Font link tags into the HTML head based on the chosen fontFamily.
 */
function injectGoogleFonts(html: string, fontFamily?: string): string {
  if (!fontFamily) return html;
  
  // Clean font family string (remove quotes and fallbacks for matching)
  const cleanFont = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
  
  const fontMap: Record<string, string> = {
    'Inter': 'Inter:wght@300;400;500;600;700;800',
    'Roboto': 'Roboto:wght@300;400;500;700;900',
    'Open Sans': 'Open+Sans:wght@300;400;600;700;800',
    'Montserrat': 'Montserrat:wght@300;400;500;600;700;800;900',
    'Poppins': 'Poppins:wght@200;300;400;500;600;700;800;900',
    'Lato': 'Lato:wght@100;300;400;700;900',
    'Garamond': 'EB+Garamond:wght@400;500;600;700;800',
    'Palatino': 'Palatino',
    'Source Code Pro': 'Source+Code+Pro:wght@200;300;400;500;600;700;800;900',
    'Verdana': 'Verdana',
    'Georgia': 'Georgia',
    'Times New Roman': 'Times+New+Roman',
    'Trebuchet MS': 'Trebuchet+MS',
  };

  const matchedFont = Object.keys(fontMap).find(key => 
    cleanFont.toLowerCase() === key.toLowerCase() || 
    fontFamily.toLowerCase().includes(key.toLowerCase())
  );
  
  if (matchedFont) {
    const fontQuery = fontMap[matchedFont];
    const googleFontLink = `<link href="https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap" rel="stylesheet">`;
    
    // Check if it's already there
    if (html.includes(`family=${fontQuery}`)) return html;

    const headRegex = /<\/head>/i;
    if (headRegex.test(html)) {
      return html.replace(headRegex, `${googleFontLink}\n</head>`);
    } else {
      return `${googleFontLink}\n${html}`;
    }
  }
  
  return html;
}

// Render a sample resume for a given template (public, used for thumbnails/previews)
export async function renderTemplateSample(templateId?: string, theme?: any) {
  const template = templateId || "modern";
  // Use cache key based on template and theme
  const defaultColor = TEMPLATE_COLORS[template] || "default";
  const cacheKey = `${template}:${theme ? JSON.stringify(theme) : `default-${defaultColor}`}`;
  const now = Date.now();
  const cached = previewCache[cacheKey];
  if (cached && cached.expiresAt > now) {
    return cached.url;
  }

  // Minimal sample data used for public previews

const sampleData = {
  personal: {
    name: "Ajay Dugger",
    email: "ajay@gmail.com",
    phone: "+91 98765 43210",
    location: "Kolkata, West Bengal, India",
    linkedin: "https://linkedin.com/in/ajaydugger",
    github: "https://github.com/ajaydugger",
    portfolioUrl: "https://ajaydugger.dev",
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
      url: "https://github.com/ajaydugger/ecommerce-platform",
    },

    {
      id: "proj2",
      name: "Hospital Management System",
      description:
        "Built a comprehensive healthcare management system for patient records, appointments, billing, and reporting.",
      technologies: "React, Express.js, PostgreSQL",
      url: "https://github.com/ajaydugger/hospital-management",
    },

    {
      id: "proj3",
      name: "Employee Attendance Portal",
      description:
        "Designed and developed a cloud-based attendance and leave management portal with real-time reporting.",
      technologies: "TypeScript, React, Firebase",
      url: "https://github.com/ajaydugger/attendance-portal",
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
      data.personal.image = cached.base64;
      return data;
    }

    try {
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

    } catch (error) {
      console.error("Failed to process image:", error);
    }
  }
  return data;
}

function buildHtml(data: any, template: string, theme?: any): string {
  // Ensure we use the central branding colors as a default theme
  const finalTheme = {
    primary: TEMPLATE_COLORS[template] || "#000000",
    ...(theme || {}),
  };

  switch (template) {
    case "compact-classic":
      return buildCompactClassicTemplate(data, finalTheme);
    case "stellar":
      return buildStellarTemplate(data, finalTheme);
    case "orion":
      return buildOrionTemplate(data, finalTheme);
    case "impact-resume":
      return buildImpactResumeTemplate(data, finalTheme);
    case "modern-corporate":
      return buildModernCorporateTemplate(data, finalTheme);
    case "senior-leadership":
      return buildSeniorLeadershipTemplate(data, finalTheme);
    case "corporate-standard":
      return buildCorporateStandardTemplate(data, finalTheme);
    case "ats-classic":
      return buildAtsClassicTemplate(data, finalTheme);
    case "modern":
      return buildModernTemplate(data, finalTheme);
    case "photographic":
      return buildPhotographicTemplate(data, finalTheme);
    case "azurill":
      return buildAzurillTemplate(data, finalTheme);
    case "modern-sidebar":
      return buildModernSidebarTemplate(data, finalTheme);
    case "formal-indian-cv":
      return buildFormalIndianCvTemplate(data, finalTheme);
    case "photo-minimal":
      return buildPhotoMinimalTemplate(data, finalTheme);
    case "photo-modern-pro":
      return buildPhotoModernProTemplate(data, finalTheme);
    case "machamp":
      return buildMachampTemplate(data, finalTheme);
    case "leadership-managerial":
      return buildLeadershipManagerialTemplate(data, finalTheme);
    case "consultant-freelancer":
      return buildConsultantFreelancerTemplate(data, finalTheme);
    default:
      return buildModernTemplate(data, theme);
  }
}
