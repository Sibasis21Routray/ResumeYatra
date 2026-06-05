import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

// console.log("[API] Initializing with base URL:", API_BASE_URL);

function formatMongooseError(raw: string): string {
  if (!raw) return "Something went wrong";

  // Extract model name
  const modelMatch = raw.match(/^(\w+)\svalidation failed/);

  // Extract field name
  const fieldMatch = raw.match(/Path `(.+?)` is required/);

  if (modelMatch && fieldMatch) {
    const model = modelMatch[1];
    const field = fieldMatch[1];

    return `${model} validation failed, ${field} is required.`;
  }

  return raw; // fallback
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ CRITICAL for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

  // Add guest ID to requests (Authentication is now handled by cookies automatically)
  api.interceptors.request.use((config: any) => {
    const guestId = localStorage.getItem("guestId");
    const user = localStorage.getItem("user");

    if (guestId && !user) {
      config.headers["x-guest-id"] = guestId;
    } else if (!user) {
      // If no user and no guestId, generate one for the guest session
      const newGuestId = crypto.randomUUID();
      localStorage.setItem("guestId", newGuestId);
      config.headers["x-guest-id"] = newGuestId;
    }

    return config;
  });

// Handle response errors
api.interceptors.response.use(
  (response) => {
    // console.log(
    //   "[API] ✓ Response success",
    //   `(${response.config.method?.toUpperCase()} ${
    //     response.config.url
    //   }) status: ${response.status}`
    // );
    return response;
  },
  (error) => {
const rawMessage =
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

const formattedMessage = formatMongooseError(rawMessage);

const isPaymentRequired = error?.response?.status === 402;
const isSubscriptionRequired = error?.response?.data?.type === 'subscription_required';

if (!isPaymentRequired && !isSubscriptionRequired) {
  toast.error(formattedMessage);
}

 if (error.response?.status === 401) {
    const user = localStorage.getItem("user");

    if (user) {
      console.warn("[API] Session might be invalid or expired");
    }
  }

  return Promise.reject(error);
}
);

// Auth endpoints
export const authAPI = {
  register: (email: string, name: string, password: string, paymentData?: any) =>
    api.post("/auth/register", { email, name, password, ...paymentData }),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),
  resetPassword: (password: string, token: string) => api.post(`/auth/reset-password/${token}`, { password }),
};

// Resume endpoints
export const resumeAPI = {
  create: (payload: { title: string; template?: string; data?: any }) => {
    // console.log("[resumeAPI] Creating resume with payload:", payload);
    return api.post("/resumes", payload).then((response) => {
      // console.log("[resumeAPI] Resume creation response:", response);

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
  throw new Error("Invalid Mongo ID received from backend");
}
      // console.log(
      //   "[resumeAPI] ✓ Resume created successfully with ID:",
      //   resumeId
      // );
      return response;
    });
  },
  list: () => api.get("/resumes"),
  get: (id: string) => api.get(`/resumes/${id}`),

  rename: (id: string, title: string) =>
  api.patch(`/resumes/${id}/rename`, { title }),

  // update: (
  //   id: string,
  //   payload: { data?: any; template?: string; title?: string }
  // ) => api.put(`/resumes/${id}`, payload),

  update: (
  id: string,
  payload: { data?: any; template?: string; title?: string }
) => {
  // console.log("[resumeAPI] Updating resume:", id, payload);

  return api
    .put(`/resumes/${id}`, payload)
    .then((response) => {
      // console.log("[resumeAPI] Update response:", response);
      return response;
    })
    .catch((error: any) => {
      console.error("[resumeAPI] Update error:", error);

      // 🔥 Extract backend error properly
      const message =
        error?.response?.data?.error ||   // your backend format
        error?.response?.data?.message || // fallback
        error?.message ||
        "Failed to update resume";

      console.error("[resumeAPI] Clean error message:", message);

      throw new Error(message); // VERY IMPORTANT
    });
},

  delete: (id: string) => api.delete(`/resumes/${id}`),
  markDownloaded: (id: string) => api.post(`/resumes/${id}/mark-downloaded`),
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
    section?: string,
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
  // getResume: (id: string) => api.get(`/admin/resumes/${id}`),
  getResume: (id: string) => api.get(`/admin/resumes/${id}`),
  getStats: () => api.get("/admin/stats"),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  deleteResume: (id: string) => api.delete(`/admin/resumes/${id}`),
  getUserResumes: (userId: string) => api.get(`/admin/user/${userId}/resumes`),
  getTokenUsage: () => api.get("/admin/token-usage"),
  uploadSignature: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/admin/settings/signature", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const paymentAPI = {
  createOrder: (type: string, data: any = {}) =>
    api.post("/payment/create-order", { type, ...data }),

  verifyPayment: (payload: any) =>
    api.post("/payment/verify", payload),
  
  // Add this method to check payment status
  checkPaymentStatus: (resumeId: string, type: string) =>
    api.get(`/payment/status/${resumeId}?type=${type}`),

  toggleAutoPay: (autoPay: boolean) =>
    api.post("/payment/toggle-autopay", { autoPay }),

  getAutoPayStatus: () =>
    api.get("/payment/autopay-status"),

  getInvoice: (resumeId: string, type?: 'ai' | 'download') =>
    api.get(`/payment/invoice/${resumeId}${type ? `?type=${type}` : ''}`),
};

export const pricingAPI = {
  get: () => api.get("/payment/pricing"),
  update: (data: any) => api.put("/admin/pricing", data),
};
export default api;


