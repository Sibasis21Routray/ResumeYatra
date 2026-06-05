import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTemplateStore, useUIStore, useResumeStore } from "../../stores";
import { resumeAPI } from "../../services/apiClient";

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeId: string;
  currentData: any;
  currentTemplate: string;
}

export function TemplateSelectionModal({
  isOpen,
  onClose,
  resumeId,
  currentData,
  currentTemplate,
}: TemplateSelectionModalProps) {
  const { templates, fetchTemplates } = useTemplateStore();
  const { setSelectedTemplate, setSelectedTheme } = useUIStore();
  const { data: resumeData } = useResumeStore();

  const [selectedTemplateId, setSelectedTemplateId] = useState(currentTemplate);

  const [templatePreviews, setTemplatePreviews] = useState<
    Record<string, string>
  >({});
  const [loadingPreviews, setLoadingPreviews] = useState<
    Record<string, boolean>
  >({});

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  /* -------------------------------------------------- */
  /* Fetch templates                                    */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (isOpen && templates.length === 0) {
      fetchTemplates();
    }
  }, [isOpen, templates.length, fetchTemplates]);

  /* -------------------------------------------------- */
  /* Generate previews — each template uses its own     */
  /* defaultColor from template-colors.ts               */
  /* (same pattern as loadTemplatePreviews in PreviewPage) */
  /* -------------------------------------------------- */
  const loadAllPreviews = async () => {
    if (!resumeId || (!currentData && !resumeData)) return;

    for (const templateOption of templates) {
      if (templatePreviews[templateOption.id] || loadingPreviews[templateOption.id]) continue;

      setLoadingPreviews((p) => ({ ...p, [templateOption.id]: true }));

      try {
        // Use this template's own default color — same as PreviewPage's loadTemplatePreviews
        const previewTheme = templateOption.defaultColor
          ? { primary: templateOption.defaultColor, secondary: templateOption.defaultColor }
          : null;

        const previewData = {
          ...(currentData || resumeData),
          formatting: {
            ...((currentData || resumeData) as any)?.formatting,
          },
        };

        const res = await resumeAPI.preview(
          resumeId,
          templateOption.id,
          previewTheme,
          previewData
        );

        const blob = new Blob([res.data], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        setTemplatePreviews((p) => ({ ...p, [templateOption.id]: url }));
      } catch (e) {
        console.error(`Preview failed for ${templateOption.id}:`, e);
      } finally {
        setLoadingPreviews((p) => ({ ...p, [templateOption.id]: false }));
      }
    }
  };

  useEffect(() => {
    if (!isOpen || templates.length === 0) return;
    loadAllPreviews();
  }, [isOpen, templates]);

  /* -------------------------------------------------- */
  /* Scale big preview                                  */
  /* -------------------------------------------------- */
  const updateScale = useCallback(() => {
    if (!previewContainerRef.current) return;
    const w = previewContainerRef.current.clientWidth;
    const scale = Math.min(w / 794, 1);
    setPreviewScale(scale);
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b">
          <h2 className="text-2xl font-bold">Select Template</h2>
          <button className="text-black" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT — big preview of selected template with its own default color */}
          <div className="flex-1 p-6 bg-white overflow-hidden">
            <div
              ref={previewContainerRef}
              className="bg-white mx-auto shadow-lg rounded-lg w-full max-w-[900px]"
            >
              <div
                style={{
                  width: 794,
                  height: 1123,
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top center",
                }}
              >
                <iframe
                  src={templatePreviews[selectedTemplateId] || ""}
                  className="w-full h-full border-0"
                  scrolling="auto"
                  title="Resume Preview"
                />
              </div>
            </div>
          </div>

          {/* RIGHT — template thumbnail grid */}
          <div className="w-[420px] bg-blue-900 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-6">
                {templates.map((t) => {
                  const url = templatePreviews[t.id];
                  const isLoading = loadingPreviews[t.id];

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTemplateId(t.id)}
                      className={`relative bg-white rounded-lg shadow-lg cursor-pointer overflow-hidden hover:shadow-xl ${
                        selectedTemplateId === t.id
                          ? "ring-4 ring-[#04477E]"
                          : ""
                      }`}
                    >
                      <div className="aspect-[210/297] relative bg-white overflow-hidden">
                        {url ? (
                          <div
                            className="absolute inset-0"
                            style={{
                              transform: "scale(0.25)",
                              transformOrigin: "top left",
                              width: "400%",
                              height: "400%",
                            }}
                          >
                            <iframe
                              src={url}
                              className="w-full h-full border-0 pointer-events-none select-none"
                              scrolling="no"
                              title={t.name}
                            />
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                            {isLoading && (
                              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                        )}
                      </div>
                      {/* Template name overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-medium text-center truncate px-1">
                          {t.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t flex justify-end">
          <button
            onClick={async () => {
              try {
                // Find the selected template's default color from template-colors.ts
                const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
                const newColor = selectedTemplate?.defaultColor || "#000000";
                const newTheme = { primary: newColor, secondary: newColor };

                // Save template + new theme color to backend together
                await resumeAPI.update(resumeId, {
                  template: selectedTemplateId,
                  formatting: { theme: newTheme, primary: newColor },
                });

                // Update UIStore so PreviewPage re-renders with correct color immediately
                setSelectedTemplate(selectedTemplateId);
                setSelectedTheme(newTheme);

                onClose();
              } catch (err) {
                console.error("Failed to update template in backend:", err);
              }
            }}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
}
