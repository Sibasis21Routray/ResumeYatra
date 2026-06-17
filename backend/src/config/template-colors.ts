/**
 * Central configuration for template-specific branding colors.
 * Changing a color here will update:
 * 1. The default color for that template in the backend rendering.
 * 2. The Cloudinary thumbnail generation.
 * 3. The metadata sent to the frontend.
 */
export const TEMPLATE_COLORS: Record<string, string> = {
  "ats-classic": "#002d62",
  "photo-minimal": "#005F5F",
  "modern-sidebar": "#005F5F",
  "compact-classic": "#7A0C2E",
  "photo-modern-pro": "#0A2540",
  "formal-indian-cv": "#0c4354",
  "senior-leadership": "#0B1F3A",
  "azurill": "#004B87",
  "stellar": "#004B87",
  "orion": "#0f172a",
  "modern": "#4b5563",
  "photographic": "#000000",
  "machamp": "#000000",
  "leadership-managerial": "#1e1b4b",
  "consultant-freelancer": "#2563eb",
  "impact-resume": "#3b82f6",
  "modern-corporate": "#000000",
  "corporate-standard": "#000000",
};

export const TEMPLATE_FONTS: Record<string, string> = {
  "ats-classic": "Arial, sans-serif",
  "photo-minimal": "Helvetica, sans-serif",
  "modern-sidebar": "Roboto, sans-serif",
  "compact-classic": "Verdana, sans-serif",
  "photo-modern-pro": "Georgia, serif",
  "formal-indian-cv": "Times New Roman, serif",
  "senior-leadership": "Garamond, sans-serif",
  "azurill": "Montserrat, sans-serif",
  "stellar": "Lato, sans-serif",
  "orion": "Trebuchet MS, sans-serif",
  "modern": "Inter, system-ui, sans-serif",
  "photographic": "Roboto, sans-serif",
  "machamp": "Impact, sans-serif",
  "leadership-managerial": "Garamond, serif",
  "consultant-freelancer": "Lato, sans-serif",
  "impact-resume": "Montserrat, sans-serif",
  "modern-corporate": "Inter, system-ui, sans-serif",
  "corporate-standard": "Arial, sans-serif",
};

export const TEMPLATE_FONT_SIZES: Record<string, number> = {
  "ats-classic": 11,
  "photo-minimal": 11,
  "modern-sidebar": 11,
  "compact-classic": 10,
  "photo-modern-pro": 11,
  "formal-indian-cv": 11,
  "senior-leadership": 12,
  "azurill": 10,
  "stellar": 11,
  "orion": 12,
  "modern": 12,
  "photographic": 12,
  "machamp": 11,
  "leadership-managerial": 12,
  "consultant-freelancer": 11,
  "impact-resume": 11,
  "modern-corporate": 11,
  "corporate-standard": 12,
};

export const getDefaultColor = (templateId: string): string => {
  return TEMPLATE_COLORS[templateId] || "#000000";
};

export const getDefaultFont = (templateId: string): string => {
  return TEMPLATE_FONTS[templateId] || "Arial, sans-serif";
};

export const getDefaultFontSize = (templateId: string): number => {
  return TEMPLATE_FONT_SIZES[templateId] || 14;
};

export const getTemplateMetadata = () => {
  return {
    colors: TEMPLATE_COLORS,
    fonts: TEMPLATE_FONTS,
    fontSizes: TEMPLATE_FONT_SIZES,
  };
};
