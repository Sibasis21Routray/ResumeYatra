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
  const { setSelectedTemplate, selectedTheme, setSelectedTheme } = useUIStore();
  const { data: resumeData } = useResumeStore();

  const [selectedTemplateId, setSelectedTemplateId] = useState(currentTemplate);
  const [isTemplateMode, setIsTemplateMode] = useState(false);

  const [templatePreviews, setTemplatePreviews] = useState<
    Record<string, string>
  >({});
  const [loadingPreviews, setLoadingPreviews] = useState<
    Record<string, boolean>
  >({});

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  const colorThemes = [
    { primary: "#04477E", secondary: "#64748b", background: "#ffffff", name: "Blue" },
    { primary: "#10B981", secondary: "#64748b", background: "#ffffff", name: "Green" },
    { primary: "#8B5CF6", secondary: "#64748b", background: "#ffffff", name: "Purple" },
    { primary: "#EF4444", secondary: "#64748b", background: "#ffffff", name: "Red" },
    { primary: "#F97316", secondary: "#64748b", background: "#ffffff", name: "Orange" },
    { primary: "#14B8A6", secondary: "#64748b", background: "#ffffff", name: "Teal" },
  ];

  // Extract primary color from theme (handles both string and object formats)
  const themePrimaryColor = typeof selectedTheme === "string"
    ? selectedTheme
    : (selectedTheme?.primary || "#04477E");

  /* -------------------------------------------------- */
  /* Fetch templates                                    */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (isOpen && templates.length === 0) {
      fetchTemplates();
    }
  }, [isOpen, templates.length, fetchTemplates]);

  /* -------------------------------------------------- */
  /* Generate preview                                   */
  /* -------------------------------------------------- */
  const generatePreview = async (templateId: string) => {
    const key = `${templateId}_${themePrimaryColor}`;
    if (templatePreviews[key] || loadingPreviews[key]) return;

    setLoadingPreviews((p) => ({ ...p, [key]: true }));

    try {
      const res = await resumeAPI.preview(
        resumeId,
        templateId,
        selectedTheme, // Pass full theme object to API
        currentData || resumeData
      );

      const blob = new Blob([res.data], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      setTemplatePreviews((p) => ({ ...p, [key]: url }));
    } catch (e) {
      console.error("Preview failed:", e);
    } finally {
      setLoadingPreviews((p) => ({ ...p, [key]: false }));
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    templates.forEach((t) => generatePreview(t.id));
  }, [isOpen, templates, themePrimaryColor]);

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

  const selectedKey = `${selectedTemplateId}_${themePrimaryColor}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b">
          <h2 className="text-2xl font-bold">
            Select Template
          </h2>

          <div className="flex items-center gap-3">
            <button className="text-black" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT BIG PREVIEW */}
          <div className="flex-1 p-6 bg-gray-50 overflow-auto">
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
                  src={templatePreviews[selectedKey] || ""}
                  className="w-full h-full border-0"
                  scrolling="auto"
                  title="Resume Preview"
                />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-[420px] bg-blue-900 flex flex-col">
            {/* COLORS */}
            <div className="p-6 bg-white">
              <h3 className="text-sm font-medium mb-3">Choose color:</h3>
              <div className="flex gap-3 flex-wrap">
                {colorThemes.map((c) => (
                  <button
                    key={c.primary}
                    onClick={() => setSelectedTheme(c)}
                    className={`w-9 h-9 rounded-full ${c.primary === themePrimaryColor
                      ? "ring-4 ring-blue-600"
                      : "ring-2 ring-gray-300"
                      }`}
                    style={{ backgroundColor: c.primary }}
                  />
                ))}
              </div>
            </div>

            {/* TEMPLATES GRID */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-6">
                {templates.map((t) => {
                  const key = `${t.id}_${themePrimaryColor}`;
                  const url = templatePreviews[key];

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTemplateId(t.id)}
                      className={`relative bg-white rounded-lg shadow-lg cursor-pointer overflow-hidden hover:shadow-xl ${selectedTemplateId === t.id
                        ? "ring-4 ring-[#04477E]"
                        : ""
                        }`}
                    >
                      <div className="aspect-[210/297] relative bg-white overflow-hidden">
                        {url && (
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
                        )}
                      </div>
                      {/* Template Name */}
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
            onClick={() => {
              setSelectedTemplate(selectedTemplateId);
              onClose();
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
