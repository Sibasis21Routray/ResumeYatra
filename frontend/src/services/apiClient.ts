import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

console.log("[API] Initializing with base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "[API] ✓ Authorization header set",
        `(${config.method?.toUpperCase()} ${config.url})`
      );
    } else {
      console.warn(
        "[API] ✗ No token found in localStorage",
        `(${config.method?.toUpperCase()} ${config.url})`
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log(
      "[API] ✓ Response success",
      `(${response.config.method?.toUpperCase()} ${
        response.config.url
      }) status: ${response.status}`
    );
    return response;
  },
  (error) => {
    console.error("[API] ✗ Response error", {
      url: error.config?.url,
      status: error.response?.status,
      method: error.config?.method,
      message: error.response?.data?.error || error.message,
    });

    if (error.response?.status === 401) {
      console.warn("[API] 401 Unauthorized - Clearing auth tokens");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (email: string, name: string, password: string) =>
    api.post("/auth/register", { email, name, password }),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  me: () => api.get("/auth/me"),
};

// Resume endpoints
export const resumeAPI = {
  create: (payload: { title: string; template?: string; data?: any }) => {
    console.log("[resumeAPI] Creating resume with payload:", payload);
    return api.post("/resumes", payload).then((response) => {
      console.log("[resumeAPI] Resume creation response:", response);

      // Comprehensive validation of the response structure
      if (!response || !response.data) {
        console.error("[resumeAPI] No response data received:", response);
        throw new Error("No response data from resume creation API");
      }

      // The backend returns the resume object directly, so response.data is the resume
      const resume = response.data;

      // Validate that we have a valid resume object
      if (!resume || typeof resume !== "object") {
        console.error("[resumeAPI] Response data is not an object:", resume);
        throw new Error("Invalid resume object received from API");
      }

      // Validate the resume ID
      const resumeId = resume.id || resume._id;
      if (
        !resumeId ||
        resumeId === "undefined" ||
        resumeId === "null" ||
        typeof resumeId !== "string" ||
        resumeId.trim() === "" ||
        resumeId.length < 10
      ) {
        // MongoDB ObjectId is typically 24 chars
        console.error("[resumeAPI] Invalid resume ID received:", resumeId);
        console.error("[resumeAPI] Full resume object:", resume);
        throw new Error(`Invalid resume ID: ${resumeId}`);
      }

      // Ensure id is set for consistency
      resume.id = resumeId;

      // Validate MongoDB ObjectId format (basic check)
      if (!/^[a-fA-F0-9]{24}$/.test(resumeId)) {
        console.warn(
          "[resumeAPI] Resume ID does not look like a valid MongoDB ObjectId:",
          resumeId
        );
        // Don't throw here, just warn, as it might still be valid
      }

      console.log(
        "[resumeAPI] ✓ Resume created successfully with ID:",
        resumeId
      );
      return response;
    });
  },
  list: () => api.get("/resumes"),
  get: (id: string) => api.get(`/resumes/${id}`),
  update: (
    id: string,
    payload: { data?: any; template?: string; title?: string }
  ) => api.put(`/resumes/${id}`, payload),
  delete: (id: string) => api.delete(`/resumes/${id}`),
  upload: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/resumes/${id}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/resumes/${id}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  render: (id: string, template: string = "modern", theme?: any) => {
    const params = new URLSearchParams({ template });
    if (theme) params.append("theme", JSON.stringify(theme));
    return api.get(`/resumes/${id}/render?${params.toString()}`);
  },
  preview: (
    id: string,
    template: string = "modern",
    theme?: any,
    data?: any
  ) => {
    return api.post(
      `/resumes/${id}/preview`,
      {
        template,
        theme,
        data,
      },
      {
        headers: { Accept: "text/html" },
        responseType: "text",
      }
    );
  },
  enhance: (
    id: string,
    section: string,
    tone: string = "professional",
    maxWords?: number
  ) => api.post(`/resumes/${id}/enhance`, { section, tone, maxWords }),
  suggestions: (id: string, section: string) =>
    api.post(`/resumes/${id}/suggestions`, { section }),

  suggestSkills: (id: string, summary?: string) =>
    api.post(`/resumes/${id}/suggest-skills`, summary ? { summary } : {}),
  suggestSkillsByJobTitle: (id: string, jobTitle: string, industry?: string) =>
    api.post(`/resumes/${id}/suggest-skills-by-title`, { jobTitle, industry }),
  suggestHobbies: (id: string, jobTitle?: string, industry?: string) =>
    api.post(`/resumes/${id}/suggest-hobbies`, { jobTitle, industry }),
  autoSuggestions: (
    id: string,
    text: string,
    context: "summary" | "experience" | "project" | "skills",
    metadata?: any
  ) => api.post(`/resumes/${id}/auto-suggestions`, { text, context, metadata }),
  suggestDescriptionParagraphs: (
    id: string,
    context: "experience" | "project",
    currentDescription?: string,
    metadata?: any
  ) =>
    api.post(`/resumes/${id}/suggest-description-paragraphs`, {
      context,
      currentDescription,
      metadata,
    }),
  suggestSummaryParagraphs: (
    id: string,
    currentSummary?: string,
    jobTitle?: string,
    industry?: string,
    keywords?: string[]
  ) =>
    api.post(`/resumes/${id}/suggest-summary-paragraphs`, {
      currentSummary,
      jobTitle,
      industry,
      keywords,
    }),
  suggestKeyAchievements: (
    id: string,
    jobTitle?: string,
    industry?: string,
    existingAchievements?: string[]
  ) =>
    api.post(`/resumes/${id}/suggest-key-achievements`, {
      jobTitle,
      industry,
      existingAchievements,
    }),
  translate: (id: string, text: string, targetLanguage: string) =>
    api.post(`/resumes/${id}/translate`, { text, targetLanguage }),
  export: (
    id: string,
    format: "pdf" | "docx" | "txt",
    theme?: any,
    template: string = "modern",
    data?: any
  ) => {
    const params = new URLSearchParams({ template });
    if (theme) params.append("theme", JSON.stringify(theme));
    const query = params.toString();
    const url = query
      ? `/resumes/${id}/export/${format}?${query}`
      : `/resumes/${id}/export/${format}`;

    // Set longer timeout for PDF exports
    const timeout = format === "pdf" ? 90000 : 60000; // 90s for PDF, 60s for others

    if (data) {
      // Use POST with data in body
      return api.post(
        url,
        { template, theme, data },
        {
          responseType: "blob",
          validateStatus: (status) => status < 400, // Don't reject on 4xx/5xx, handle manually
          timeout: timeout,
        }
      );
    } else {
      // Use GET for backward compatibility
      return api.get(url, {
        responseType: "blob",
        validateStatus: (status) => status < 400, // Don't reject on 4xx/5xx, handle manually
        timeout: timeout,
      });
    }
  },
  downloadDocx: async (
    id: string,
    theme?: any,
    template: string = "modern",
    data?: any
  ) => {
    try {
      const response = await resumeAPI.export(
        id,
        "docx",
        theme,
        template,
        data
      );

      if (response.status !== 200) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error: any) {
      console.error("Error downloading DOCX:", error);
      throw new Error(`Failed to download DOCX: ${error.message || error}`);
    }
  },
  sendEmail: (
    id: string,
    emailData: {
      to: string;
      subject: string;
      body: string;
      format?: "pdf" | "docx";
    }
  ) => api.post(`/resumes/${id}/email`, emailData),
};

// Admin endpoints
export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
  getResumes: () => api.get("/admin/resumes"),
  getStats: () => api.get("/admin/stats"),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  deleteResume: (id: string) => api.delete(`/admin/resumes/${id}`),
  getUserResumes: (userId: string) => api.get(`/admin/user/${userId}/resumes`),
};

export default api;
