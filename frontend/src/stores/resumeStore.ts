import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import { resumeAPI } from "../services/apiClient";
import type { StateCreator } from "zustand";

export interface ResumeData {
  personal: {
    name?: string;
    email?: string;
    phone?: string;
    alternatePhone?: string;
    location?: string;
    pinCode?: string;
    country?: string;
    linkedin?: string;
    linkedinText?: string;
    linkedinUrl?: string;
    github?: string;
    githubText?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    image?: string;
    middleName?: string;
    fathersName?: string;
    nationality?: string;
    dob?: string;
    gender?: string;
    maritalStatus?: string;
    personalInfoDisplay?: "inline" | "separate";
  };
  careerObjective?: string;
  summary?: string;
  experience: Array<{
    id: string;
    company?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  projects: Array<{
    id: string;
    name?: string;
    description?: string;
    technologies?: string;
    url?: string;
    urlText?: string;
  }>;
  education: Array<{
    id: string;
    school?: string;
    degree?: string;
    field?: string;
    graduationDate?: string;
  }>;
  internships: Array<{
    id: string;
    company?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    location?: string;
  }>;
  trainingPrograms?: Array<{
    id: string;
    name?: string;
    provider?: string;
    completionDate?: string;
    duration?: string;
    description?: string;
  }>;
  academicProjects: Array<{
    id: string;
    name?: string;
    course?: string;
    institution?: string;
    duration?: string;
    description?: string;
    technologies?: string[];
    url?: string;
  }>;
  leadershipPositions: Array<{
    id: string;
    position?: string;
    organization?: string;
    duration?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  coCurricular?: Array<{
    id: string;
    activity: string;
    role?: string;
    year?: string;
  }>;
  extracurricular?: Array<{
    id: string;
    activity: string;
    role?: string;
    year?: string;
  }>;
  skills: string;
  languages: Array<{
    language: string;
    level: string;
  }>;
  hobbies: string[];
  tools?: string[];
  keyAchievements?: string[];
  responsibilities?: string[];
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  scholarships?: Array<{
    id: string;
    name?: string;
    provider?: string;
    year?: string;
    description?: string;
  }>;
  awards?: Array<{
    id: string;
    title: string;
    organization: string;
    issueYear: string;
    description: string;
  }>;
  speakingEngagements?: Array<{
    id: string;
    topic: string;
    eventName: string;
    organization: string;
    date: string;
    location?: string;
    description: string;
    url?: string;
  }>;
  memberships?: Array<{
    id: string;
    organization: string;
    membershipType?: string;
    startDate: string;
    endDate?: string;
    description: string;
    url?: string;
  }>;
  workshops?: Array<{
    id: string;
    title: string;
    instructor?: string;
    organization: string;
    date: string;
    location?: string;
    description: string;
    certificateUrl?: string;
  }>;

  socialLinks?: Array<{
    urlText: string;
    url: string;
  }>;

  customSections?: Array<{
    id: string;
    heading: string;
    isVisible: boolean;
    entries: Array<{
      id: string;
      title?: string;
      organization?: string;
      date?: string;
      description?: string;
      isVisible: boolean;
    }>;
  }>;
  sectionOrder?: string[];

  // Section visibility settings
  sectionVisibility?: {
    personal: boolean;
    summary: boolean;
    experience: boolean;
    projects: boolean;
    education: boolean;
    skills: boolean;
    languages: boolean;
    hobbies: boolean;
    certifications: boolean;
    awards: boolean;
    speakingEngagements: boolean;
    memberships: boolean;
    workshops: boolean;
    socialLinks: boolean;
    customSections: boolean;
  };

  // Typography settings
  fontSize: number;
  fontFamily: string;

  // Professional Context
  professionalContext?: {
    totalExperience?: string;
    teamSize?: string;
    industry?: string;
    industryCustom?: string;
    functionalDomain?: string;
    functionalDomainCustom?: string;
    geographicScope?: string;
    revenueResponsibility?: string;
  };
}

export interface ResumeState {
  // Data
  data: ResumeData;
  originalData: ResumeData;
  history: ResumeData[];
  historyIndex: number;

  // UI State
  loading: boolean;
  saving: boolean;
  error: string | null;
  lastSaved: Date | null;
  autoSaving: boolean;

  // Resume metadata
  resumeId: string | null;
  resumeTitle: string;
  ownerId: string | null;
  template: string;

  // Actions
  initialize: (resumeId: string) => Promise<void>;
  updateData: (updater: (draft: ResumeData) => void) => void;
  save: () => Promise<void>;
  autoSave: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  reset: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const initialData: ResumeData = {
  personal: {},
  careerObjective: "",
  summary: "",
  experience: [],
  projects: [],
  education: [],
  internships: [],
  trainingPrograms: [],
  academicProjects: [],
  leadershipPositions: [],
  coCurricular: [],
  extracurricular: [],
  skills: "",
  languages: [],
  hobbies: [],
  tools: [],
  keyAchievements: [],
  responsibilities: [],
  certifications: [],
  scholarships: [],
  awards: [],
  speakingEngagements: [],
  memberships: [],
  workshops: [],
  socialLinks: [],
  customSections: [],
  professionalContext: {},

  sectionOrder: [
    "personal",
    "summary",
    "experience",
    "projects",
    "education",
    "skills",
    "languages",
    "hobbies",
    "certifications",
    "awards",
    "speakingEngagements",
    "memberships",
    "workshops",
    "socialLinks",
    "customSections",
  ],

  // All sections visible by default
  sectionVisibility: {
    personal: true,
    summary: true,
    experience: true,
    projects: true,
    education: true,
    skills: true,
    languages: true,
    hobbies: true,
    certifications: true,
    awards: true,
    speakingEngagements: true,
    memberships: true,
    workshops: true,
    socialLinks: true,
    customSections: true,
  },

  fontSize: 16, // Default font size
  fontFamily: "Arial, sans-serif", // Default font family
};

export const useResumeStore = create<ResumeState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      data: { ...initialData },
      originalData: { ...initialData },
      history: [{ ...initialData }],
      historyIndex: 0,
      loading: false,
      saving: false,
      error: null,
      lastSaved: null,
      autoSaving: false,
      resumeId: null,
      resumeTitle: "Untitled Resume",
      ownerId: null,
      template: "modern",

      initialize: async (resumeId: string) => {
        set({ loading: true, error: null, resumeId });

        try {
          const response = await resumeAPI.get(resumeId);
          const resume = response.data;

          // Get the latest version
          const latestVersion = resume.versions?.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];

          // Helper to ensure hobbies is always an array
          const ensureArray = (value: any, defaultValue: any[] = []) => {
            if (Array.isArray(value)) return value;
            if (typeof value === "string" && value.trim()) {
              return value
                .split(",")
                .map((h) => h.trim())
                .filter((h) => h.length > 0);
            }
            return defaultValue;
          };

          const loadedData = latestVersion?.data
            ? {
                personal: latestVersion.data.personal || {},
                careerObjective: latestVersion.data.careerObjective || "",
                summary: latestVersion.data.summary || "",
                experience: latestVersion.data.experience || [],
                projects: latestVersion.data.projects || [],
                education: latestVersion.data.education || [],
                internships: latestVersion.data.internships || [],
                trainingPrograms: latestVersion.data.trainingPrograms || [],
                academicProjects: latestVersion.data.academicProjects || [],
                leadershipPositions:
                  latestVersion.data.leadershipPositions || [],
                coCurricular: latestVersion.data.coCurricular || [],
                extracurricular: latestVersion.data.extracurricular || [],
                skills: latestVersion.data.skills || "",
                languages: latestVersion.data.languages || [],
                hobbies: ensureArray(latestVersion.data.hobbies, []),
                tools: latestVersion.data.tools || [],
                keyAchievements: latestVersion.data.keyAchievements || [],
                responsibilities: latestVersion.data.responsibilities || [],
                certifications: latestVersion.data.certifications || [],
                scholarships: latestVersion.data.scholarships || [],
                awards: latestVersion.data.awards || [],
                speakingEngagements:
                  latestVersion.data.speakingEngagements || [],
                memberships: latestVersion.data.memberships || [],
                workshops: latestVersion.data.workshops || [],
                socialLinks: latestVersion.data.socialLinks || [],
                customSections: latestVersion.data.customSections || [],
                professionalContext:
                  latestVersion.data.professionalContext || {},
                sectionOrder:
                  latestVersion.data.sectionOrder || initialData.sectionOrder,
                sectionVisibility:
                  latestVersion.data.sectionVisibility ||
                  initialData.sectionVisibility,
                fontSize: latestVersion.data.fontSize || initialData.fontSize,
                fontFamily:
                  latestVersion.data.fontFamily || initialData.fontFamily,
              }
            : { ...initialData };

          set({
            data: loadedData,
            originalData: JSON.parse(JSON.stringify(loadedData)), // Deep copy
            history: [JSON.parse(JSON.stringify(loadedData))],
            historyIndex: 0,
            resumeTitle: resume.title || "Untitled Resume",
            ownerId: resume.ownerId,
            template: resume.template || "modern",
            lastSaved: new Date(),
          });

          // Load from localStorage if available
          const autosaveKey = `resume-${resumeId}-autosave`;
          const autosaveData = localStorage.getItem(autosaveKey);
          if (autosaveData) {
            try {
              const parsed = JSON.parse(autosaveData);
              if (
                parsed.data &&
                new Date(parsed.lastModified) > new Date(resume.updatedAt)
              ) {
                set({ data: parsed.data });
              }
            } catch (err) {
              console.warn("Failed to load autosave data:", err);
            }
          }
        } catch (err: any) {
          set({
            error: err.response?.data?.error || "Failed to load resume",
            loading: false,
          });
        } finally {
          set({ loading: false });
        }
      },

      updateData: (updater) => {
        set((state) => {
          // With immer middleware, state.data is already a draft
          // We need to apply the user's updater to it
          updater(state.data);

          // Create new history entries
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(JSON.parse(JSON.stringify(state.data)));

          // Limit history to 50 entries
          if (newHistory.length > 50) {
            newHistory.shift();
          }

          // Update history and other immutable state directly on draft
          state.history = newHistory;
          state.historyIndex = Math.min(state.historyIndex + 1, 49);
          state.error = null;

          // Return undefined to indicate we modified the draft directly
          return undefined;
        });
      },

      save: async () => {
        const { resumeId, data } = get();
        if (!resumeId) return;

        set({ saving: true, error: null });

        try {
          console.log(
            "[resumeStore.save] Saving resume, data.academicProjects:",
            JSON.stringify(data.academicProjects)
          );
          await resumeAPI.update(resumeId, { data });

          set({
            originalData: JSON.parse(JSON.stringify(data)),
            lastSaved: new Date(),
            saving: false,
          });

          // Clear autosave data
          localStorage.removeItem(`resume-${resumeId}-autosave`);
        } catch (err: any) {
          set({
            error: err.response?.data?.error || "Failed to save resume",
            saving: false,
          });
          throw err;
        }
      },

      autoSave: async () => {
        const { resumeId, data, saving } = get();
        if (!resumeId || saving) return;

        set({ autoSaving: true });

        try {
          await resumeAPI.update(resumeId, { data });

          set({
            lastSaved: new Date(),
            autoSaving: false,
          });

          // Update autosave data
          const autosaveData = {
            data,
            lastModified: new Date().toISOString(),
          };
          localStorage.setItem(
            `resume-${resumeId}-autosave`,
            JSON.stringify(autosaveData)
          );
        } catch (err: any) {
          console.error("Auto-save failed:", err);
          set({ autoSaving: false });
        }
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          set({
            data: JSON.parse(JSON.stringify(history[newIndex])),
            historyIndex: newIndex,
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          set({
            data: JSON.parse(JSON.stringify(history[newIndex])),
            historyIndex: newIndex,
          });
        }
      },

      canUndo: () => get().historyIndex > 0,

      canRedo: () => get().historyIndex < get().history.length - 1,

      reset: () => {
        set({
          data: { ...initialData },
          originalData: { ...initialData },
          history: [{ ...initialData }],
          historyIndex: 0,
          error: null,
          lastSaved: null,
        });
      },

      setError: (error) => set({ error }),

      setLoading: (loading) => set({ loading }),
    }))
  )
);

// Auto-save subscription
let autoSaveTimeout: ReturnType<typeof setTimeout> | undefined;
useResumeStore.subscribe(
  (state) => state.data,
  (data, prevData) => {
    // Only auto-save if data actually changed
    if (JSON.stringify(data) !== JSON.stringify(prevData)) {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        useResumeStore.getState().autoSave();
      }, 5000); // 5 second debounce
    }
  }
);
