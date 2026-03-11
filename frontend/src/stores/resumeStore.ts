import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import { resumeAPI } from "../services/apiClient";

export interface ResumeData {
  personal: any;
  careerObjective?: string;
  summary?: string;
  experience: any[];
  projects: any[];
  education: any[];
  internships?: any[];
  trainingPrograms?: any[];
  academicProjects?: any[];
  leadershipPositions?: any[];
  coCurricular?: any[];
  extracurricular?: any[];
  skills: any;
  languages: any[];
  hobbies: any[];
  certifications?: any[];
  scholarships?: any[];
  awards?: any[];
  speakingEngagements?: any[];
  memberships?: any[];
  workshops?: any[];
  socialLinks?: any[];
  customSections?: any[];
  professionalContext?: any;

  sectionOrder?: string[];
  sectionVisibility?: any;

  fontSize?: number;
  fontFamily?: string;
}

export interface ResumeState {
  data: ResumeData;
  originalData: ResumeData;

  loading: boolean;
  saving: boolean;
  autoSaving: boolean;
  initialized: boolean;

  resumeId: string | null;
  error: string | null;
  lastSaved: Date | null;

  initialize: (resumeId: string) => Promise<void>;
  updateData: (updater: (draft: ResumeData) => void) => void;
  save: () => Promise<void>;
  autoSave: () => Promise<void>;
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

  fontSize: 16,
  fontFamily: "Arial, sans-serif",
};

let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null;

export const useResumeStore = create<ResumeState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      data: { ...initialData },
      originalData: { ...initialData },

      loading: false,
      saving: false,
      autoSaving: false,
      initialized: false,

      resumeId: null,
      error: null,
      lastSaved: null,

      // -----------------------------
      // INITIALIZE
      // -----------------------------
      initialize: async (resumeId: string) => {
        set({ loading: true, resumeId, initialized: false });

        try {
          const response = await resumeAPI.get(resumeId);
          const resume = response.data;

          const latestVersion = resume.versions?.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )[0];

          const loadedData = latestVersion?.data
            ? {
                ...initialData,
                ...latestVersion.data,
              }
            : { ...initialData };

          set({
            data: loadedData,
            originalData: JSON.parse(JSON.stringify(loadedData)),
            loading: false,
            initialized: true,
            lastSaved: new Date(),
          });
        } catch (err: any) {
          set({
            error: err.message || "Failed to load resume",
            loading: false,
          });
        }
      },

      // -----------------------------
      // UPDATE DATA
      // -----------------------------
      updateData: (updater) => {
        set((state) => {
          updater(state.data);
        });
      },

      // -----------------------------
      // MANUAL SAVE
      // -----------------------------
      save: async () => {
        const { resumeId, data } = get();
        if (!resumeId) return;

        if (autoSaveTimeout) {
          clearTimeout(autoSaveTimeout);
        }

        set({ saving: true });

        try {
          await resumeAPI.update(resumeId, { data });

          set({
            saving: false,
            originalData: JSON.parse(JSON.stringify(data)),
            lastSaved: new Date(),
          });
        } catch (err: any) {
          set({
            error: err.message || "Save failed",
            saving: false,
          });
          throw err;
        }
      },

      // -----------------------------
      // AUTO SAVE
      // -----------------------------
      autoSave: async () => {
        const { resumeId, data, saving } = get();

        if (!resumeId || saving) return;

        set({ autoSaving: true });

        try {
          await resumeAPI.update(resumeId, { data });

          set({
            autoSaving: false,
            lastSaved: new Date(),
          });
        } catch (err) {
          console.error("AutoSave failed:", err);
          set({ autoSaving: false });
        }
      },
    }))
  )
);

// ------------------------------------
// AUTO SAVE SUBSCRIPTION
// ------------------------------------

useResumeStore.subscribe(
  (state) => state.data,
  (data, prevData) => {
    const { initialized, saving } = useResumeStore.getState();

    if (!initialized || saving) return;

    if (JSON.stringify(data) === JSON.stringify(prevData)) return;

    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    autoSaveTimeout = setTimeout(() => {
      useResumeStore.getState().autoSave();
    }, 2000);
  }
);