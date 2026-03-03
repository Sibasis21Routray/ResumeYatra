import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';


export interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarTab: string;
  selectedSection: string;

  // Template & Theme
  selectedTemplate: string;
  selectedTheme: any;

  // Preview
  previewLoading: boolean;
  previewUrl: string;

  // Export
  showExportMenu: boolean;
  exporting: string | null;

  // Validation
  validationErrors: Record<string, string>;
  completedSections: string[];

  // AI
  aiImproving: string | null;

  // Upload
  uploadCompleted: boolean;


  // Actions
  setSidebarOpen: (open: boolean) => void;
  setSidebarTab: (tab: string) => void;
  setSelectedSection: (section: string) => void;
  setSelectedTemplate: (template: string) => void;
  setSelectedTheme: (theme: any) => void;
  setPreviewLoading: (loading: boolean) => void;
  setPreviewUrl: (url: string) => void;
  setShowExportMenu: (show: boolean) => void;
  setExporting: (format: string | null) => void;
  setValidationErrors: (errors: Record<string, string>) => void;
  setCompletedSections: (sections: string[]) => void;
  markSectionCompleted: (section: string) => void;
  setAiImproving: (improving: string | null) => void;
  setUploadCompleted: (completed: boolean) => void;
}

export const useUIStore = create<UIState>()(
  immer((set) => ({

    // Initial state
    sidebarOpen: false,
    sidebarTab: 'sections',
    // Valid sections: personal, summary, experience, projects, education, skills, customSections, personalInformation, languages, hobbies, keyAchievements, responsibilities, tools, socialLinks
    // upload is handled separately and is not a selectable editor section
    selectedSection: 'personal',
    selectedTemplate: 'modern',
    selectedTheme: { primary: '#04477E' },
    previewLoading: false,
    previewUrl: '',
    showExportMenu: false,
    exporting: null,
    validationErrors: {},
    completedSections: [],
    aiImproving: null,
    uploadCompleted: false,


    // Actions
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setSidebarTab: (tab) => set({ sidebarTab: tab }),
    setSelectedSection: (section) => set({ selectedSection: section }),
    setSelectedTemplate: (template) => set({ selectedTemplate: template }),
    setSelectedTheme: (theme) => set({ selectedTheme: theme }),
    setPreviewLoading: (loading) => set({ previewLoading: loading }),
    setPreviewUrl: (url) => set({ previewUrl: url }),
    setShowExportMenu: (show) => set({ showExportMenu: show }),
    setExporting: (format) => set({ exporting: format }),
    setValidationErrors: (errors) => set({ validationErrors: errors }),
    setCompletedSections: (sections) => set({ completedSections: sections }),
    markSectionCompleted: (section) => set((state) => {
      if (!state.completedSections.includes(section)) {
        return { completedSections: [...state.completedSections, section] };
      }
      return state;
    }),
    setAiImproving: (improving) => set({ aiImproving: improving }),
    setUploadCompleted: (completed) => set({ uploadCompleted: completed }),
  }))
);
