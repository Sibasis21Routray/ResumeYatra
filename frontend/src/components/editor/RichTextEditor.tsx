import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  RotateCcw,
  RotateCw,
  Sparkles,
  X,
  Bold,
  Italic,
  Underline,
  List,
  Type,
} from "lucide-react";
import AISuggestionPanel from "./AISuggestionPanel";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onEnhanceWithAI?: () => void;
  onGenerateAI?: (currentContent: string) => Promise<string[]>;
  sectionTitle?: string;
  context?: "summary" | "experience" | "project" | "skills";
  onKeyDown?: (e: React.KeyboardEvent) => void;
  maxLength?: number;
  skillLimitReached?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Add your skills here...",
  onEnhanceWithAI,
  onGenerateAI,
  sectionTitle = "Content",
  context,
  onKeyDown,
  maxLength,
  skillLimitReached = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  // Track last emitted value to prevent re-render loops
  const lastEmittedRef = useRef(value);

  /* ---------------- AI state ---------------- */
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiContent, setAiContent] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regenerateCount, setRegenerateCount] = useState(0);

  /* -------- Sync external value (SAFE) -------- */
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    // Never overwrite while user is typing
    if (document.activeElement === el) return;

    // Only update if the value actually changed and it's different from what we last emitted
    const normalizedValue = (value == null ? "" : String(value));
    const normalizedLastEmitted = lastEmittedRef.current || "";

    // Compare normalized HTML (handle browser HTML normalization differences)
    const shouldUpdate = el.innerHTML.trim() !== normalizedValue.trim();

    if (shouldUpdate) {
      el.innerHTML = normalizedValue;
      lastEmittedRef.current = normalizedValue;

      // Restore spellcheck attributes after innerHTML change
      el.setAttribute("spellcheck", "true");
      el.setAttribute("lang", "en");
    }
  }, [value]);

  /* -------- Ensure spellcheck is enabled at DOM level -------- */
  useEffect(() => {
    const el = editorRef.current;
    if (el) {
      // Set spellcheck using property (more reliable than attribute)
      el.spellcheck = true;
      el.setAttribute("spellcheck", "true");
      el.setAttribute("lang", "en");
      el.setAttribute("xml:lang", "en");

      // Force browser to recognize spellcheck after DOM changes
      const forceSpellcheck = () => {
        // Toggle spellcheck to force re-evaluation
        el.spellcheck = false;
        requestAnimationFrame(() => {
          el.spellcheck = true;
          el.setAttribute("spellcheck", "true");
        });
      };

      // Periodic reinforcement of spellcheck (less frequent to avoid re-renders)
      const intervalId = setInterval(() => {
        if (el && document.activeElement === el) {
          el.spellcheck = true;
          el.setAttribute("spellcheck", "true");
        }
      }, 2000); // Changed from 500ms to 2000ms

      el.addEventListener("input", forceSpellcheck);

      return () => {
        el.removeEventListener("input", forceSpellcheck);
        clearInterval(intervalId);
      };
    }
  }, []);

  /* ---------------- Commands ---------------- */
  const exec = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command);
    handleInput();
  };

  /* ---------------- Input ---------------- */
  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;

    const html = el.innerHTML;
    const textContent = el.textContent || "";

    // Check maxLength if specified
    if (maxLength && textContent.length > maxLength) {
      // Revert to last emitted value
      el.innerHTML = lastEmittedRef.current;
      return;
    }

    // Only emit if value actually changed
    if (html !== lastEmittedRef.current) {
      lastEmittedRef.current = html;
      onChange(html);
    }
  }, [onChange, maxLength, context, skillLimitReached]);

  /* ---------------- Blur ---------------- */
  const handleBlur = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;

    const html = el.innerHTML;
    const textContent = el.textContent || "";

    // For skills context, convert plain text to list items separated by new lines on blur
    if (context === "skills" && !html.includes("<li>") && !html.includes("<ul>") && !html.includes("<ol>") && !html.includes("<h3>") && textContent.trim()) {
      const lines = textContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length > 0) {
        const newHtml = `<ul>${lines.map(line => `<li>${line}</li>`).join('')}</ul>`;
        el.innerHTML = newHtml;
        lastEmittedRef.current = newHtml;
        onChange(newHtml);
      }
    }
  }, [context, onChange]);

  /* ---------------- Paste ---------------- */
  const handlePaste = (e: React.ClipboardEvent) => {
    if (maxLength) {
      const currentLength = editorRef.current?.textContent?.length || 0;
      const pasteText = e.clipboardData.getData("text/plain");
      const newLength = currentLength + pasteText.length;

      if (newLength > maxLength) {
        // Only allow partial paste
        e.preventDefault();
        const allowedLength = maxLength - currentLength;
        if (allowedLength > 0) {
          document.execCommand("insertText", false, pasteText.substring(0, allowedLength));
        }
        return;
      }
    }
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  /* ---------------- AI handlers ---------------- */
  const handleGenerateAI = useCallback(async () => {
    setIsGenerating(true);
    try {
      if (onGenerateAI) {
        const results = await onGenerateAI(value);
        if (context !== "summary") {
          // For bullet contexts, join all suggestions into one formatted string
          const formatted = results.map(r => `- ${r}`).join('\n');
          setAiContent([formatted]);
        } else {
          setAiContent(results);
        }
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        const mock1 = value
          ? value.replace(/<li>/g, "<li>✨ ")
          : "<ul><li>✨ Enhanced skill</li></ul>";
        const mock2 = "<ul><li>💎 Premium addition</li></ul>";
        setAiContent([mock1, mock2]);
      }
      setRegenerateCount((p) => p + 1);
    } finally {
      setIsGenerating(false);
    }
  }, [value, onGenerateAI, context]);

  const handleEnhanceWithAI = useCallback(() => {
    // If external handler exists, use it (centralized modal)
    if (onEnhanceWithAI) {
      onEnhanceWithAI();
    } else if (onGenerateAI) {
      // Otherwise, use generate AI and open internal panel
      handleGenerateAI();
      setShowAIPanel(true);
    }
  }, [onEnhanceWithAI, onGenerateAI, handleGenerateAI]);

  const handleApplyAI = useCallback(
    (index: number) => {
      const content = aiContent[index];
      if (!content || !editorRef.current) return;

      let html = content;
      if (context !== "summary") {
        // Convert plain text bullets to HTML
        const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length > 0 && lines.every(line => line.startsWith('- '))) {
          const listItems = lines.map(line => `<li>${line.replace(/^-\s*/, '')}</li>`).join('');
          html = `<ul>${listItems}</ul>`;
        }
      }

      editorRef.current.innerHTML = html;
      lastEmittedRef.current = html;
      onChange(html);
      setShowAIPanel(false);
    },
    [aiContent, onChange, context]
  );

  const handleApplyUser = useCallback(() => {
    setShowAIPanel(false);
  }, []);

  /* ---------------- Render ---------------- */
  return (
    <>
      <div className="relative rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 w-full">
        {/* Toolbar - Responsive layout */}
        <div className="flex flex-wrap items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg sm:rounded-t-xl">
          {/* Text formatting buttons */}
          <div className="flex items-center gap-0.5 sm:gap-1 mr-1 sm:mr-2">
            <ToolbarButton
              label="Bold"
              onClick={() => exec("bold")}
              className="px-1.5 sm:px-2 py-1 sm:py-1.5"
            >
              <Bold className="w-3 h-3 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Italic"
              onClick={() => exec("italic")}
              className="px-1.5 sm:px-2 py-1 sm:py-1.5"
            >
              <Italic className="w-3 h-3 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Underline"
              onClick={() => exec("underline")}
              className="px-1.5 sm:px-2 py-1 sm:py-1.5"
            >
              <Underline className="w-3 h-3 sm:w-4 sm:h-4" />
            </ToolbarButton>
          </div>

          {/* Vertical divider */}
          <div className="w-px h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 mx-0.5 sm:mx-1" />

          {/* List button */}
          <ToolbarButton
            label="Bullets"
            onClick={() => exec("insertUnorderedList")}
            className="px-1.5 sm:px-2 py-1 sm:py-1.5"
          >
            <List className="w-3 h-3 sm:w-4 sm:h-4" />
          </ToolbarButton>

          {/* Vertical divider */}
          <div className="w-px h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 mx-0.5 sm:mx-1" />

          {/* Undo/Redo buttons */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <ToolbarButton
              label="Undo"
              onClick={() => exec("undo")}
              className="px-1.5 sm:px-2 py-1 sm:py-1.5"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Redo"
              onClick={() => exec("redo")}
              className="px-1.5 sm:px-2 py-1 sm:py-1.5"
            >
              <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
            </ToolbarButton>
          </div>

          {/* AI Enhance Button - Right aligned */}
          {/* {(onEnhanceWithAI || onGenerateAI) && (
            <button
              onClick={handleEnhanceWithAI}
              className="ml-auto flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800/50 transition-colors"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">
                Enhance with AI
              </span>
              <span className="xs:hidden sm:hidden">AI</span>
            </button>
          )} */}
        </div>

        {/* Editor Area */}
        <div
          ref={editorRef}
          contentEditable
          lang="en"
          spellCheck="true"
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={onKeyDown}
          onBlur={handleBlur}
          data-placeholder={placeholder}
          className={`min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] max-h-[180px] sm:max-h-[200px] lg:max-h-[220px] overflow-y-auto px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
        />

        {/* Inline styles for placeholder and spellcheck */}
        <style>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }
          
          [contenteditable]:empty:focus:before {
            color: #6b7280;
          }
          
          /* Dark mode placeholder */
          .dark [contenteditable]:empty:before {
            color: #6b7280;
          }
          
          .dark [contenteditable]:empty:focus:before {
            color: #9ca3af;
          }
          
          /* Ensure spellcheck is enabled and visible */
          [contenteditable][spellcheck="true"] {
            spellcheck: true !important;
            -webkit-spell-checker-type: en-US !important;
            -webkit-spell-checker-punctuation: true !important;
            -webkit-spell-checker-grammar: true !important;
          }
          
          /* Force spellcheck squiggles to show */
          [contenteditable][spellcheck="true"]:focus {
            outline: none;
          }
          
          /* Better text rendering for spellcheck */
          [contenteditable] {
            text-rendering: auto !important;
            -webkit-text-rendering: auto !important;
          }
          
          /* Custom scrollbar for editor */
          [contenteditable]::-webkit-scrollbar {
            width: 6px;
          }
          
          [contenteditable]::-webkit-scrollbar-track {
            background: transparent;
          }
          
          [contenteditable]::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
          }
          
          .dark [contenteditable]::-webkit-scrollbar-thumb {
            background: #4b5563;
          }
          
          [contenteditable]::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
          
          .dark [contenteditable]::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        `}</style>
      </div>

      {/* AI Panel - Responsive Modal */}
      {showAIPanel && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-2 sm:p-3 lg:p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl sm:shadow-2xl w-full max-w-full sm:max-w-[95%] md:max-w-[90%] lg:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowAIPanel(false)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md sm:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close AI panel"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="p-4 sm:p-5 lg:p-6">
              <AISuggestionPanel
                aiContent={aiContent}
                userContent={value}
                onApplyAI={handleApplyAI}
                onApplyUser={handleApplyUser}
                isGenerating={isGenerating}
                onGenerateAI={handleGenerateAI}
                sectionTitle={sectionTitle}
                regenerateCount={regenerateCount}
                context={context}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Toolbar Button - Responsive */
function ToolbarButton({
  children,
  onClick,
  label,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors ${className}`}
      aria-label={label}
    >
      {children}
    </button>
  );
}
