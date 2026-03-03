import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams } from "react-router-dom";
import { useUIStore, useResumeStore } from "../../stores";
import { resumeAPI } from "../../services/apiClient";
import PhotoEditorModal from "./PhotoEditorModal";
import { TemplateSelectionModal } from "./TemplateSelectionModal";
import { ThemeToggle } from "../ThemeToggle";

interface LivePreviewProps {
  previewUrl: string;
  loading: boolean;
}

// Constants for better maintainability
const PREVIEW_DEBOUNCE_MS = 1500;
const IMAGE_MAX_SIZE_MB = 5;
const VALID_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const DPI = 96;

export function LivePreview({ previewUrl, loading }: LivePreviewProps) {
  const { id } = useParams();
  const { selectedTemplate, selectedTheme, setPreviewLoading } = useUIStore();
  const { data, updateData } = useResumeStore();

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewDebounceRef = useRef<number>();

  const resumeId = id;

  // State
  const [error, setError] = useState<string>("");
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isPreviewStale, setIsPreviewStale] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [previewData, setPreviewData] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false); // Added back for PhotoEditorModal

  // Responsive state
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // ========== Helper Functions ==========
  const calculateScale = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0.3;

    const containerWidth = container.offsetWidth;
    const a4WidthPx = (A4_WIDTH_MM * DPI) / 25.4;

    if (isMobile) {
      return (containerWidth - 32) / a4WidthPx;
    } else if (isTablet) {
      return (containerWidth * 0.9) / a4WidthPx;
    } else {
      const maxWidth = 920;
      const targetWidth = Math.min(containerWidth - 64, maxWidth);
      return targetWidth / a4WidthPx;
    }
  }, [isMobile, isTablet]);

  const validateImageFile = (file: File): boolean => {
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WebP).");
      return false;
    }

    if (file.size > IMAGE_MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image size should be less than ${IMAGE_MAX_SIZE_MB}MB.`);
      return false;
    }

    return true;
  };

  // ========== Preview Management ==========
  const updatePreviewData = useCallback((newData: any, immediate = false) => {
    if (previewDebounceRef.current) {
      clearTimeout(previewDebounceRef.current);
    }

    if (immediate) {
      setPreviewData(newData);
      setIsPreviewStale(false);
    } else {
      setIsPreviewStale(true);
      previewDebounceRef.current = setTimeout(() => {
        setPreviewData(newData);
        setIsPreviewStale(false);
      }, PREVIEW_DEBOUNCE_MS);
    }
  }, []);

  const forcePreviewUpdate = useCallback(() => {
    if (data) {
      updatePreviewData(data, true);
    }
  }, [data, updatePreviewData]);

  // ========== Event Handlers ==========
  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (file: File) => {
    if (!resumeId) return;

    if (!validateImageFile(file)) return;

    setSelectedImage(file);
    setShowPhotoEditor(true);
    setError("");
  };

  const handleImageUploadSuccess = (imageUrl: string) => {
    updateData((draft) => {
      if (!draft.personal) draft.personal = {};
      draft.personal.image = imageUrl;
    });

    setTimeout(() => forcePreviewUpdate(), 100);

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
    }, 1500);
  };

  const handleImageInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await handleImageUpload(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ========== Drag and Drop Handlers ==========
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      await handleImageUpload(file);
    }
  };

  // ========== Preview Generation ==========
  const generatePreview = async () => {
    if (!id || !previewData) return;

    setPreviewLoading(true);
    setError("");

    try {
      const response = await resumeAPI.preview(
        id,
        selectedTemplate,
        selectedTheme,
        previewData
      );
      const htmlContent = response.data;
      const processedHtml = processPreviewHtml(htmlContent);
      setPreviewHtml(processedHtml);
      setIframeKey(Date.now());
    } catch (err: any) {
      console.error("Preview generation failed:", err);
      setError(err.response?.data?.error || "Failed to generate preview");
    } finally {
      setPreviewLoading(false);
    }
  };

  const processPreviewHtml = (htmlContent: string): string => {
    const styleInjection = `
      <style>
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
          background-color: #ffffff !important;
          min-height: 100% !important;
        }
        .resume-page, .page, .resume-container, .A4, [class*="resume"], [class*="cv"] {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      </style>
    `;

    if (htmlContent.includes('</head>')) {
      return htmlContent.replace('</head>', `${styleInjection}</head>`);
    }

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${styleInjection}
</head>
<body>${htmlContent}</body>
</html>`;
  };

  // ========== Memoized Components ==========
  const MemoizedIframe = useMemo(() => {
    const scale = calculateScale();

    return (
      <iframe
        key={iframeKey}
        ref={iframeRef}
        srcDoc={previewHtml || undefined}
        className="absolute inset-0 w-full h-full border-0"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: isMobile ? "100%" : "210mm",
          height: isMobile ? "100%" : "297mm",
        }}
        title="Resume Preview"
        loading="lazy"
      />
    );
  }, [previewHtml, iframeKey, calculateScale, isMobile]);

  // ========== Icons ==========
  const Icons = {
    Template: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    Photo: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    Document: () => (
      <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    Upload: () => (
      <svg className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    Error: () => (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    Sparkle: () => (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  };

  // ========== Effects ==========
  useEffect(() => {
    if (data) {
      setPreviewData(data);
    }
  }, [data]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (previewData && id) {
      generatePreview();
    }
  }, [previewData, id, selectedTemplate, selectedTheme]);

  useEffect(() => {
    return () => {
      if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current);
    };
  }, []);

  // ========== Loading State ==========
  if (loading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
            Generating your preview...
          </p>
        </div>
      </div>
    );
  }

  // ========== Error State ==========
  if (error) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icons.Error />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Preview Error
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={generatePreview}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ========== Main Render ==========
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageInputChange}
        className="hidden"
        id="profile-image-upload"
      />

      <div
        className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Live Preview
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200/50 dark:border-gray-700/50">
                    {selectedTemplate}
                  </span>
                </div>
                {isPreviewStale && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                    Updating...
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Preview Container */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto relative"
          >
            <div className={`min-h-full flex flex-col items-center ${isMobile ? 'p-3' : 'p-6'}`}>
              {/* Resume Preview Card */}
              <div className="relative w-full max-w-[920px]">
                <div className="relative bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
                  {/* Preview Content */}
                  <div className="relative w-full" style={{ aspectRatio: isMobile ? 'auto' : '210/297' }}>
                    {previewHtml ? (
                      <div className="absolute inset-0 overflow-auto">
                        {MemoizedIframe}
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                          <Icons.Document />
                        </div>
                        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">
                          No Preview Available
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                          Add content to your resume to see the live preview here
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={() => setShowTemplateModal(true)}
                    className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
                  >
                    <Icons.Template />
                    <span className="text-accent">Change Templates</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 px-1.5 py-0.5 rounded-md transition-colors">
                      12+
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drag-over overlay */}
            {dragOver && (
              <div className="absolute inset-0 z-50 bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 backdrop-blur-sm border-4 border-dashed border-blue-400/50 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-sm text-center mx-4 border border-blue-100 dark:border-blue-900">
                  <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icons.Upload />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Drop to Upload Photo
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Release your image to add it to your resume
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PhotoEditorModal
        isOpen={showPhotoEditor}
        onClose={() => {
          setShowPhotoEditor(false);
          setSelectedImage(null);
        }}
        selectedImage={selectedImage}
        resumeId={resumeId || ""}
        onImageUpload={handleImageUploadSuccess}
      />

      <TemplateSelectionModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        resumeId={resumeId || ""}
        currentData={data}
        currentTemplate={selectedTemplate}
      />
    </>
  );
}