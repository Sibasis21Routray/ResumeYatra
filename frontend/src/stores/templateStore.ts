import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { resumeAPI } from '../services/apiClient';

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  defaultColor?: string;
}

export interface TemplateState {
  // Data
  templates: Template[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchTemplates: () => Promise<void>;
  setTemplates: (templates: Template[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTemplateStore = create<TemplateState>()(
  immer((set, get) => ({
    // Initial state
    templates: [],
    loading: false,
    error: null,

    // Actions
    fetchTemplates: async () => {
      set({ loading: true, error: null });

      try {
        // Fetch the latest colors from the backend
        const metadataRes = await resumeAPI.getMetadata();
        const colors = metadataRes.data;

        const mockTemplates: Template[] = [
          // ... (I'll pass the full list with dynamic colors)
  {
    id: "ats-classic",
    name: "Ats Classic",
    description: "Professional two-column layout with gray sidebar for contact details",
    preview: "/templates/ats-classic-preview.png",
    category: "classic",
    defaultColor: "#002d62",
  },
  {
    id: "photo-minimal",
    name: "Photo Minimal",
    description: "Clean and simple design with a focus on the candidate's photo",
    preview: "/templates/photo-minimal-preview.png",
    category: "photo",
    defaultColor: "#005F5F",
  },
  {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    description: "Sophisticated for senior roles",
    preview: "/templates/modern-sidebar-preview.png",
    category: "modern",
    defaultColor: "#005F5F",
  },
  {
    id: "compact-classic",
    name: "Compact Classic",
    description: "Traditional design with a modern twist",
    preview: "/templates/compact-classic-preview.png",
    category: "classic",
    defaultColor: "#7A0C2E",
  },
  {
    id: "photo-modern-pro",
    name: "Photo Modern Pro",
    description: "Water-themed design with blue aquatic styling",
    preview: "/templates/photo-modern-pro-preview.png",
    category: "photo",
    defaultColor: "#0A2540",
  },
  {
    id: "formal-indian-cv",
    name: "Formal Indian CV",
    description: "Energetic and fun design",
    preview: "/templates/formal-indian-cv-preview.png",
    category: "classic",
    defaultColor: "#0c4354",
  },
  {
    id: "senior-leadership",
    name: "Senior Leadership",
    description: "Elegant design for executive and senior roles",
    preview: "/templates/senior-leadership-preview.png",
    category: "modern",
    defaultColor: "#0B1F3A",
  },
  {
    id: "azurill",
    name: "Azurill",
    description: "Fresh and vibrant design",
    preview: "/templates/azurill-preview.png",
    category: "photo",
    defaultColor: "#004B87",
  },
  {
    id: "nova",
    name: "Nova",
    description: "Professional card-based layout with clean typography",
    preview: "/templates/nova-preview.png",
    category: "classic",
    defaultColor: "#80303d",
  },
  {
    id: "stellar",
    name: "Stellar",
    description: "Compact two-column design for efficient information display",
    preview: "/templates/stellar-preview.png",
    category: "classic",
    defaultColor: "#004B87",
  },
  {
    id: "venusaur",
    name: "Venusaur",
    description: "Nature-themed design with green organic styling",
    preview: "/templates/venusaur-preview.png",
    category: "photo",
    defaultColor: "#0f172a",
  },
  {
    id: "cosmos",
    name: "Cosmos",
    description: "Artistic design with gradient headers and elegant styling",
    preview: "/templates/cosmos-preview.png",
    category: "photo",
    defaultColor: "#000000",
  },
  {
    id: "modern-executive",
    name: "Modern Executive",
    description: "Sleek and sophisticated layout for senior professionals",
    preview: "/templates/modern-executive-preview.png",
    category: "modern",
    defaultColor: "#7aa333",
  },
  {
    id: "orion",
    name: "Orion",
    description: "Modern timeline-style layout with gradient accents",
    preview: "/templates/orion-preview.png",
    category: "modern",
    defaultColor: "#0f172a",
  },
  {
    id: "operations-support",
    name: "Operations & Support",
    description: "Process-focused template for support roles",
    preview: "/templates/operations-support-preview.png",
    category: "classic",
    defaultColor: "#1a1a2e",
  },
  {
    id: "minimal-ats",
    name: "Minimal ATS",
    description: "Ultra-fast parsing for high-volume hiring",
    preview: "/templates/minimal-ats-preview.png",
    category: "classic",
    defaultColor: "#1a1a1a",
  },
  {
    id: "nebula",
    name: "Nebula",
    description: "Creative sidebar design with vibrant color schemes",
    preview: "/templates/nebula-preview.png",
    category: "photo",
    defaultColor: "#abc9eb",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
    preview: "/templates/modern-preview.png",
    category: "modern",
    defaultColor: "#4b5563",
  },
  {
    id: "photographic",
    name: "Photographic",
    description: "Perfect for creative professionals",
    preview: "/templates/photographic-preview.png",
    category: "classic",
    defaultColor: "#000000",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant",
    preview: "/templates/minimal-preview.png",
    category: "classic",
    defaultColor: "#000000",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional and trustworthy",
    preview: "/templates/professional-preview.png",
    category: "classic",
    defaultColor: "#5B9BD5",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and artistic design",
    preview: "/templates/creative-preview.png",
    category: "photo",
    defaultColor: "#2c3e50",
  },
  {
    id: "gengar",
    name: "Gengar",
    description: "Mysterious and unique",
    preview: "/templates/gengar-preview.png",
    category: "photo",
    defaultColor: "#7c3aed",
  },
  {
    id: "dragonite",
    name: "Dragonite",
    description: "Dragon-themed design with powerful yellow colors",
    preview: "/templates/dragonite-preview.png",
    category: "classic",
    defaultColor: "#d97706",
  },
  {
    id: "alakazam",
    name: "Alakazam",
    description: "Psychic-themed design with purple mystical colors",
    preview: "/templates/alakazam-preview.png",
    category: "photo",
    defaultColor: "#004369",
  },
  {
    id: "mewtwo",
    name: "Mewtwo",
    description: "Genetic-themed design with blue scientific styling",
    preview: "/templates/mewtwo-preview.png",
    category: "modern",
    defaultColor: "#000000",
  },
  {
    id: "squirtle",
    name: "Squirtle",
    description: "Water-themed design with teal aquatic styling",
    preview: "/templates/squirtle-preview.png",
    category: "modern",
    defaultColor: "#373737",
  },
  {
    id: "bulbasaur",
    name: "Bulbasaur",
    description: "Plant-themed design with green organic styling",
    preview: "/templates/bulbasaur-preview.png",
    category: "modern",
    defaultColor: "#15803d",
  },
  {
    id: "eevee",
    name: "Eevee",
    description: "Evolution-themed design with orange adaptive colors",
    preview: "/templates/eevee-preview.png",
    category: "photo",
    defaultColor: "#000000",
  },
  {
    id: "machamp",
    name: "Machamp",
    description: "Fighting-themed design with red powerful styling",
    preview: "/templates/machamp-preview.png",
    category: "classic",
    defaultColor: "#000000",
  },
  {
    id: "classic-professional",
    name: "Classic Professional",
    description: "Traditional ATS-friendly layout for experienced candidates",
    preview: "/templates/classic-professional-preview.png",
    category: "classic",
    defaultColor: "#000000",
  },
  {
    id: "skills-first",
    name: "Skills First",
    description: "ATS-optimized for career transitions and freelancers",
    preview: "/templates/skills-first-preview.png",
    category: "classic",
    defaultColor: "#000000",
  },
  {
    id: "metrics-driven",
    name: "Metrics Driven",
    description: "Results-focused template for sales and business roles",
    preview: "/templates/metrics-driven-preview.png",
    category: "classic",
    defaultColor: "#000000",
  },
  {
    id: "leadership-managerial",
    name: "Leadership & Managerial",
    description: "Executive template for managers and senior roles",
    preview: "/templates/leadership-managerial-preview.png",
    category: "classic",
    defaultColor: "#1e1b4b",
  },
  {
    id: "tech-it",
    name: "Tech & IT",
    description: "ATS-optimized for developers and IT professionals",
    preview: "/templates/tech-it-preview.png",
    category: "classic",
    defaultColor: "#1a1a1a",
  },
  {
    id: "fresher-entry-level",
    name: "Fresher & Entry Level",
    description: "Perfect for students and first-time job seekers",
    preview: "/templates/fresher-entry-level-preview.png",
    category: "classic",
    defaultColor: "#334155",
  },
  {
    id: "consultant-freelancer",
    name: "Consultant & Freelancer",
    description: "Project-based template for contract professionals",
    preview: "/templates/consultant-freelancer-preview.png",
    category: "photo",
    defaultColor: "#2563eb",
  },
  {
    id: "impact-resume",
    name: "Impact Resume",
    description: "Bold design focused on achievements and impact",
    preview: "/templates/impact-resume-preview.png",
    category: "modern",
    defaultColor: "#3b82f6",
  },
  {
    id: "startup-tech",
    name: "Startup & Tech",
    description: "Dynamic layout for fast-paced tech environments",
    preview: "/templates/startup-tech-preview.png",
    category: "modern",
    defaultColor: "#2d3e50",
  },
  {
    id: "modern-corporate",
    name: "Modern Corporate",
    description: "Sleek and professional for modern businesses",
    preview: "/templates/modern-corporate-preview.png",
    category: "modern",
    defaultColor: "#000000",
  },
  {
    id: "corporate-standard",
    name: "Corporate Standard",
    description: "Classic and reliable corporate layout",
    preview: "/templates/corporate-standard-preview.png",
    category: "classic",
    defaultColor: "#000000",
  },
];
        //------
        const ALLOWED_TEMPLATES = [
          "formal-indian-cv",
          "photo-modern-pro",
          "compact-classic",
          // "minimal",
          "modern-sidebar",
          "photo-minimal",
          // "minimal-ats",
          "azurill",
          "ats-classic",
          // "venusaur",
          "machamp",
          "stellar",
          // "nebula",
          "modern",
          "orion",
          "consultant-freelancer",
          "photographic",
          "leadership-managerial",
          "impact-resume",
          "modern-corporate",
          "senior-leadership",
          "corporate-standard",
        ];

        const filteredTemplates = mockTemplates.map((t) => ({
          ...t,
          defaultColor: colors[t.id] || t.defaultColor,
        })).filter((t) => ALLOWED_TEMPLATES.includes(t.id));

        set({
          templates: filteredTemplates,
          loading: false,
        });
        //---------------
        // set({ templates: mockTemplates, loading: false });
      } catch (err: any) {
        set({
          error: err.response?.data?.error || "Failed to fetch templates",
          loading: false,
        });
      }
    },

    setTemplates: (templates) => set({ templates }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  })),
);
