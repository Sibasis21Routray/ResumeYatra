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
  "nova": "#80303d",
  "stellar": "#004B87",
  "venusaur": "#0f172a",
  "cosmos": "#000000",
  "modern-executive": "#7aa333",
  "orion": "#0f172a",
  "operations-support": "#1a1a2e",
  "minimal-ats": "#1a1a1a",
  "nebula": "#abc9eb",
  "modern": "#4b5563",
  "photographic": "#000000",
  "minimal": "#000000",
  "professional": "#5B9BD5",
  "creative": "#2c3e50",
  "gengar": "#7c3aed",
  "dragonite": "#d97706",
  "alakazam": "#004369",
  "mewtwo": "#000000",
  "squirtle": "#373737",
  "bulbasaur": "#15803d",
  "eevee": "#000000",
  "machamp": "#000000",
  "classic-professional": "#000000",
  "skills-first": "#000000",
  "metrics-driven": "#000000",
  "leadership-managerial": "#1e1b4b",
  "tech-it": "#1a1a1a",
  "fresher-entry-level": "#334155",
  "consultant-freelancer": "#2563eb",
  "impact-resume": "#3b82f6",
  "startup-tech": "#2d3e50",
  "modern-corporate": "#000000",
  "corporate-standard": "#000000",
};

export const getDefaultColor = (templateId: string): string => {
  return TEMPLATE_COLORS[templateId] || "#000000";
};
