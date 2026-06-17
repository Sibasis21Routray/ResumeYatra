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
  defaultFontFamily?: string;
  defaultFontSize?: number;
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
        const { colors, fonts, fontSizes } = metadataRes.data;

        const mockTemplates: Template[] = [
          {
            id: "formal-indian-cv",
            name: "Formal Indian CV",
            description: "Energetic and fun design",
            preview: "/templates/formal-indian-cv-preview.png",
            category: "classic",
          },
          {
            id: "photo-modern-pro",
            name: "Photo Modern Pro",
            description: "Water-themed design with blue aquatic styling",
            preview: "/templates/photo-modern-pro-preview.png",
            category: "photo",
          },
          {
            id: "compact-classic",
            name: "Compact Classic",
            description: "Traditional design with a modern twist",
            preview: "/templates/compact-classic-preview.png",
            category: "classic",
          },
          {
            id: "modern-sidebar",
            name: "Modern Sidebar",
            description: "Sophisticated for senior roles",
            preview: "/templates/modern-sidebar-preview.png",
            category: "modern",
          },
          {
            id: "photo-minimal",
            name: "Photo Minimal",
            description: "Clean and simple design with a focus on the candidate's photo",
            preview: "/templates/photo-minimal-preview.png",
            category: "photo",
          },
          {
            id: "azurill",
            name: "Azurill",
            description: "Fresh and vibrant design",
            preview: "/templates/azurill-preview.png",
            category: "photo",
          },
          {
            id: "ats-classic",
            name: "Ats Classic",
            description: "Professional two-column layout with gray sidebar for contact details",
            preview: "/templates/ats-classic-preview.png",
            category: "classic",
          },
          {
            id: "machamp",
            name: "Machamp",
            description: "Fighting-themed design with red powerful styling",
            preview: "/templates/machamp-preview.png",
            category: "classic",
          },
          {
            id: "stellar",
            name: "Stellar",
            description: "Compact two-column design for efficient information display",
            preview: "/templates/stellar-preview.png",
            category: "classic",
          },
          {
            id: "modern",
            name: "Modern",
            description: "Clean and contemporary design",
            preview: "/templates/modern-preview.png",
            category: "modern",
          },
          {
            id: "orion",
            name: "Orion",
            description: "Modern timeline-style layout with gradient accents",
            preview: "/templates/orion-preview.png",
            category: "modern",
          },
          {
            id: "consultant-freelancer",
            name: "Consultant & Freelancer",
            description: "Project-based template for contract professionals",
            preview: "/templates/consultant-freelancer-preview.png",
            category: "photo",
          },
          {
            id: "photographic",
            name: "Photographic",
            description: "Perfect for creative professionals",
            preview: "/templates/photographic-preview.png",
            category: "classic",
          },
          {
            id: "leadership-managerial",
            name: "Leadership & Managerial",
            description: "Executive template for managers and senior roles",
            preview: "/templates/leadership-managerial-preview.png",
            category: "classic",
          },
          {
            id: "impact-resume",
            name: "Impact Resume",
            description: "Bold design focused on achievements and impact",
            preview: "/templates/impact-resume-preview.png",
            category: "modern",
          },
          {
            id: "modern-corporate",
            name: "Modern Corporate",
            description: "Sleek and professional for modern businesses",
            preview: "/templates/modern-corporate-preview.png",
            category: "modern",
          },
          {
            id: "senior-leadership",
            name: "Senior Leadership",
            description: "Elegant design for executive and senior roles",
            preview: "/templates/senior-leadership-preview.png",
            category: "modern",
          },
          {
            id: "corporate-standard",
            name: "Corporate Standard",
            description: "Classic and reliable corporate layout",
            preview: "/templates/corporate-standard-preview.png",
            category: "classic",
          },
        ];
        //------
        const ALLOWED_TEMPLATES = [
          "formal-indian-cv",
          "photo-modern-pro",
          "compact-classic",
          "modern-sidebar",
          "photo-minimal",
          "azurill",
          "ats-classic",
          "machamp",
          "stellar",
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
          defaultColor: (colors && colors[t.id]) || t.defaultColor,
          defaultFontFamily: (fonts && fonts[t.id]) || t.defaultFontFamily,
          defaultFontSize: (fontSizes && fontSizes[t.id]) || t.defaultFontSize,
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
