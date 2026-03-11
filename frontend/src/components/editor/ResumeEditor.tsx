import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  File,
  Upload,
  Sparkles,
  Save,
  Undo,
  Redo,
} from "lucide-react";
import { useResumeStore, useUIStore, useTemplateStore } from "../../stores";
import { ThemeToggle } from "../ThemeToggle";
import { Sidebar } from "./Sidebar";
import { EditorPanel } from "./EditorPanel";
import { LivePreview } from "./LivePreview";
import { resumeAPI } from "../../services/apiClient";

export function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loading,
    saving,
    error,
    lastSaved,
    autoSaving,
    resumeTitle,
    initialize,
    save,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useResumeStore();

  const {
    sidebarOpen,
    selectedTemplate,
    selectedTheme,
    previewLoading,
    previewUrl,
    showExportMenu,
    exporting,
    validationErrors,
    setSidebarOpen,
    setSelectedTemplate,
    setSelectedTheme,
    setPreviewLoading,
    setPreviewUrl,
    setShowExportMenu,
    setExporting,
    setValidationErrors,
  } = useUIStore();

  const { fetchTemplates } = useTemplateStore();

  useEffect(() => {
    if (id) {
      initialize(id).then(() => {
        setSelectedTemplate(useResumeStore.getState().template);
      });
      fetchTemplates();
    }
  }, [id, initialize, fetchTemplates, setSelectedTemplate]);

  const handleSave = async () => {
    try {
      await save();
      navigate(`/preview/${id}`);
    } catch (err) {
      // Error is handled in the store
    }
  };

  const handleTemplateChange = async (template: string) => {
    try {
      await resumeAPI.update(id!, { template } as any);
      setSelectedTemplate(template);
    } catch (error) {
      console.error("Failed to update template:", error);
    }
  };

  const handleExport = async (format: "pdf" | "docx" | "txt") => {
    if (!id) return;
    setExporting(format);

    // Set a timeout for PDF exports specifically
    const timeoutMs = format === "pdf" ? 120000 : 60000; // 2 minutes for PDF, 1 minute for others

    // Get current resume data from store
    const { data: resumeData } = useResumeStore.getState();
    const exportPromise = resumeAPI.export(
      id,
      format,
      selectedTheme,
      selectedTemplate,
      resumeData
    );

    try {
      // Use Promise.race to implement timeout
      const exportResponse: any = await Promise.race([
        exportPromise,
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `Export timeout after ${timeoutMs / 1000
                  } seconds. Please try again.`
                )
              ),
            timeoutMs
          )
        ),
      ]);

      const mimeType =
        format === "pdf"
          ? "application/pdf"
          : format === "docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "text/plain";
      const blob = new Blob([exportResponse.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resumeTitle || "resume"}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`Successfully exported as ${format.toUpperCase()}`);
    } catch (err: any) {
      console.error(`Failed to export as ${format.toUpperCase()}:`, err);

      // Provide specific error messages for common issues
      let errorMessage = `Failed to export as ${format.toUpperCase()}`;
      if (err.message?.includes("timeout")) {
        errorMessage = `Export is taking longer than expected. Please try again or contact support if the issue persists.`;
      } else if (err.message?.includes("Network")) {
        errorMessage =
          "Network error occurred. Please check your connection and try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      // You could show a toast notification here
      alert(errorMessage);
    } finally {
      setExporting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        {/* <div className="text-center">
          <div className="w-8 h-8 sm:w-12 sm:h-12 border border-slate-400 border-t-[#04477E] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">
            Loading resume...
          </p>
        </div> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex">
      <Sidebar resumeId={id!} />

      <div
        className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}
      >
        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[2fr_1fr] overflow-hidden">
          {/* ================= Editor Panel ================= */}
          <div className="overflow-y-auto bg-white  border-r border-slate-200 dark:border-gray-800">
            <div className="flex justify-center px-4 sm:px-6 py-6 sm:py-8">
              <div className="w-full max-w-full sm:max-w-[1000px]">
                <EditorPanel sidebarOpen={sidebarOpen} />
              </div>
            </div>
          </div>

          {/* ================= Live Preview ================= */}
          <div className="hidden md:flex bg-slate-100 dark:bg-gray-800 overflow-y-auto">
            <div className="w-full flex justify-center px-4 sm:px-6 py-6 sm:py-8">
              <div className="w-full max-w-full sm:max-w-[500px]">
                <LivePreview previewUrl={previewUrl} loading={previewLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
