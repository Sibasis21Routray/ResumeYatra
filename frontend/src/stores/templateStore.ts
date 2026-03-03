import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
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
        // TODO: Replace with actual API call
        const mockTemplates: Template[] = [
              {
            id: 'saanvi-patel',
            name: 'Saanvi Patel',
            description: 'Professional two-column layout with gray sidebar for contact details',
            preview: '/templates/saanvi-patel-preview.png',
            category: 'professional',
          },
          {
            id: 'nova',
            name: 'Nova',
            description: 'Professional card-based layout with clean typography',
            preview: '/templates/nova-preview.png',
            category: 'professional',
          },
           {
            id: 'stellar',
            name: 'Stellar',
            description: 'Compact two-column design for efficient information display',
            preview: '/templates/stellar-preview.png',
            category: 'professional',
          },
            {
            id: 'cosmos',
            name: 'Cosmos',
            description: 'Artistic design with gradient headers and elegant styling',
            preview: '/templates/cosmos-preview.png',
            category: 'creative',
          },
          {
            id: 'modern-executive',
            name: 'Modern Executive',
            description: 'Sleek and sophisticated layout for senior professionals',
            preview: '/templates/modern-executive-preview.png',
            category: 'professional',
          },
           {
            id: 'orion',
            name: 'Orion',
            description: 'Modern timeline-style layout with gradient accents',
            preview: '/templates/orion-preview.png',
            category: 'modern',
          },
          {
            id: 'operations-support',
            name: 'Operations & Support',
            description: 'Process-focused template for support roles',
            preview: '/templates/operations-support-preview.png',
            category: 'professional',
          },
          {
            id: 'senior-individual-contributor',
            name: 'Senior Individual Contributor',
            description: 'Technical depth template for senior specialists',
            preview: '/templates/senior-individual-contributor-preview.png',
            category: 'professional',
          },
          {
            id: 'minimal-ats',
            name: 'Minimal ATS',
            description: 'Ultra-fast parsing for high-volume hiring',
            preview: '/templates/minimal-ats-preview.png',
            category: 'minimal',
          },
          {
            id: 'nebula',
            name: 'Nebula',
            description: 'Creative sidebar design with vibrant color schemes',
            preview: '/templates/nebula-preview.png',
            category: 'creative',
          },
          {
            id: 'modern',
            name: 'Modern',
            description: 'Clean and contemporary design',
            preview: '/templates/modern-preview.png',
            category: 'professional',
          },
          {
            id: 'photographic',
            name: 'Photographic',
            description: 'Perfect for creative professionals',
            preview: '/templates/photographic-preview.png',
            category: 'creative',
          },
          {
            id: 'minimal',
            name: 'Minimal',
            description: 'Simple and elegant',
            preview: '/templates/minimal-preview.png',
            category: 'minimal',
          },
          {
            id: 'professional',
            name: 'Professional',
            description: 'Traditional and trustworthy',
            preview: '/templates/professional-preview.png',
            category: 'professional',
          },
          {
            id: 'creative',
            name: 'Creative',
            description: 'Bold and artistic design',
            preview: '/templates/creative-preview.png',
            category: 'creative',
          },
          {
            id: 'executive',
            name: 'Executive',
            description: 'Sophisticated for senior roles',
            preview: '/templates/executive-preview.png',
            category: 'professional',
          },
          {
            id: 'azurill',
            name: 'Azurill',
            description: 'Fresh and vibrant design',
            preview: '/templates/azurill-preview.png',
            category: 'modern',
          },
          {
            id: 'gengar',
            name: 'Gengar',
            description: 'Mysterious and unique',
            preview: '/templates/gengar-preview.png',
            category: 'creative',
          },

          {
            id: 'pikachu',
            name: 'Pikachu',
            description: 'Energetic and fun design',
            preview: '/templates/pikachu-preview.png',
            category: 'creative',
          },
          {
            id: 'charizard',
            name: 'Charizard',
            description: 'Fire-themed design with bold orange gradients',
            preview: '/templates/charizard-preview.png',
            category: 'creative',
          },
          {
            id: 'blastoise',
            name: 'Blastoise',
            description: 'Water-themed design with blue aquatic styling',
            preview: '/templates/blastoise-preview.png',
            category: 'creative',
          },
          {
            id: 'dragonite',
            name: 'Dragonite',
            description: 'Dragon-themed design with powerful yellow colors',
            preview: '/templates/dragonite-preview.png',
            category: 'professional',
          },
          {
            id: 'venusaur',
            name: 'Venusaur',
            description: 'Nature-themed design with green organic styling',
            preview: '/templates/venusaur-preview.png',
            category: 'modern',
          },
          {
            id: 'alakazam',
            name: 'Alakazam',
            description: 'Psychic-themed design with purple mystical colors',
            preview: '/templates/alakazam-preview.png',
            category: 'creative',
          },
          {
            id: 'mewtwo',
            name: 'Mewtwo',
            description: 'Genetic-themed design with blue scientific styling',
            preview: '/templates/mewtwo-preview.png',
            category: 'modern',
          },
          {
            id: 'squirtle',
            name: 'Squirtle',
            description: 'Water-themed design with teal aquatic styling',
            preview: '/templates/squirtle-preview.png',
            category: 'modern',
          },
          {
            id: 'bulbasaur',
            name: 'Bulbasaur',
            description: 'Plant-themed design with green organic styling',
            preview: '/templates/bulbasaur-preview.png',
            category: 'modern',
          },
          {
            id: 'eevee',
            name: 'Eevee',
            description: 'Evolution-themed design with orange adaptive colors',
            preview: '/templates/eevee-preview.png',
            category: 'creative',
          },
          {
            id: 'machamp',
            name: 'Machamp',
            description: 'Fighting-themed design with red powerful styling',
            preview: '/templates/machamp-preview.png',
            category: 'professional',
          },
          {
            id: 'classic-professional',
            name: 'Classic Professional',
            description: 'Traditional ATS-friendly layout for experienced candidates',
            preview: '/templates/classic-professional-preview.png',
            category: 'professional',
          },
          {
            id: 'skills-first',
            name: 'Skills First',
            description: 'ATS-optimized for career transitions and freelancers',
            preview: '/templates/skills-first-preview.png',
            category: 'professional',
          },
          {
            id: 'metrics-driven',
            name: 'Metrics Driven',
            description: 'Results-focused template for sales and business roles',
            preview: '/templates/metrics-driven-preview.png',
            category: 'professional',
          },
          {
            id: 'leadership-managerial',
            name: 'Leadership & Managerial',
            description: 'Executive template for managers and senior roles',
            preview: '/templates/leadership-managerial-preview.png',
            category: 'professional',
          },
          {
            id: 'tech-it',
            name: 'Tech & IT',
            description: 'ATS-optimized for developers and IT professionals',
            preview: '/templates/tech-it-preview.png',
            category: 'professional',
          },
          {
            id: 'fresher-entry-level',
            name: 'Fresher & Entry Level',
            description: 'Perfect for students and first-time job seekers',
            preview: '/templates/fresher-entry-level-preview.png',
            category: 'professional',
          },
          {
            id: 'consultant-freelancer',
            name: 'Consultant & Freelancer',
            description: 'Project-based template for contract professionals',
            preview: '/templates/consultant-freelancer-preview.png',
            category: 'professional',
          },
          
        ];

        set({ templates: mockTemplates, loading: false });
      } catch (err: any) {
        set({
          error: err.response?.data?.error || 'Failed to fetch templates',
          loading: false,
        });
      }
    },

    setTemplates: (templates) => set({ templates }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  }))
);
