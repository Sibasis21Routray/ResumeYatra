import React, { useEffect, useMemo, useState } from 'react'
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCw
} from 'lucide-react'

interface AISuggestionPanelProps {
  aiContent: string[]
  userContent: string
  onApplyAI: (selectedVersion: number) => void
  onApplyUser: () => void
  isGenerating: boolean
  onGenerateAI: () => Promise<void>
  sectionTitle: string
  regenerateCount: number
  context?: "summary" | "experience" | "project" | "skills"
}

/**
 * Helper function to convert plain text to HTML paragraphs.
 * Detects if content is already HTML or plain text and formats accordingly.
 * For summary content, ensures single paragraph display with line breaks preserved.
 */
function formatContentAsHtml(content: string, context?: string): string {
  if (!content) return '';

  // Check if content contains HTML tags
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);

  if (hasHtmlTags) {
    // Content already has HTML, return as-is
    return content;
  }

  // Special handling for skills context - content is already properly formatted HTML
  if (context === "skills") {
    // Return as-is since it's already formatted with h3 and ul/li
    return content;
  }

  // Check if content is bullet points (starts with - or •)
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const isBulletList = lines.length > 0 && lines.every(line =>
    line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')
  );

  if (isBulletList) {
    // Convert bullet points to HTML list
    const listItems = lines.map(line => {
      const bulletText = line.replace(/^[-•*]\s*/, '');
      return `<li>${bulletText}</li>`;
    });
    return `<ul>${listItems.join('')}</ul>`;
  }

  // Content is plain text - convert to proper HTML formatting
  // For single paragraph content (common for summaries), wrap in single <p> tag
  // Preserve single line breaks as <br> tags within the paragraph

  // Check if content appears to be a single paragraph (no double newlines)
  const hasParagraphBreaks = /\n\n/.test(content);

  if (!hasParagraphBreaks) {
    // Single paragraph - replace single newlines with <br/> and wrap in <p>
    const formattedText = content.trim().replace(/\n/g, '<br/>');
    return `<p>${formattedText}</p>`;
  }

  // Content has multiple paragraphs - split and wrap each
  const paragraphs = content
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  if (paragraphs.length > 0) {
    return paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  // Fallback: wrap entire content
  return `<p>${content}</p>`;
}

export default function AISuggestionPanel({
  aiContent,
  userContent,
  onApplyAI,
  onApplyUser,
  isGenerating,
  onGenerateAI,
  sectionTitle,
  regenerateCount,
  context
}: AISuggestionPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<'original' | 'ai'>('ai')

  /** Auto move to first AI version after generation */
  useEffect(() => {
    if (aiContent.length > 0 && currentIndex === 0) {
      setCurrentIndex(1)
      setSelected('ai')
    }
  }, [aiContent.length])

  const total = 1 + aiContent.length
  const isOriginalView = currentIndex === 0
  const isSummaryContext = context === "summary"
  const isSkillsContext = context === "skills"

  // Format content to handle both plain text and HTML
  const formattedUserContent = formatContentAsHtml(userContent, context)
  const aiText = aiContent[currentIndex - 1] || ''
  const formattedAiContent = formatContentAsHtml(aiText, context)

  const handleApply = () => {
    if (selected === 'original') {
      onApplyUser()
    } else {
      onApplyAI(currentIndex - 1)
    }
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-indigo-600" />
        <h2 className="text-lg font-semibold">
          {isSummaryContext ? "AI-generated professional summary" :
            isSkillsContext ? "AI-generated categorized skills" :
              "AI-enhanced for clarity and readability"}
        </h2>
      </div>

      {/* ORIGINAL */}
      <div className="mb-4">
        <span className="inline-block mb-2 rounded bg-black px-3 py-1 text-xs font-medium text-white">
          Original
        </span>

        <div
          onClick={() => setSelected('original')}
          className={`rounded-xl border p-4 text-sm cursor-pointer transition
            ${selected === 'original'
              ? 'border-blue-500 ring-2 ring-blue-200 bg-slate-100'
              : 'bg-slate-50'}
          `}
        >
          <div
            className="prose prose-sm max-w-none text-slate-700"
            dangerouslySetInnerHTML={{ __html: formattedUserContent }}
          />
        </div>
      </div>

      {/* AI ENHANCED */}
      <div>
        <span className="inline-block mb-2 rounded bg-black px-3 py-1 text-xs font-medium text-white">
          AI Enhanced
        </span>

        <div
          onClick={() => setSelected('ai')}
          className={`rounded-xl border p-4 text-sm cursor-pointer transition min-h-[120px]
            ${selected === 'ai'
              ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50'
              : 'border-indigo-200 bg-indigo-50'}
          `}
        >
          {isGenerating ? (
            <p className="italic text-slate-400">Generating…</p>
          ) : (
            <div
              className="prose prose-sm max-w-none text-slate-700"
              dangerouslySetInnerHTML={{ __html: formattedAiContent }}
            />
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 flex items-center justify-between">

        {/* Pagination */}
        <div className="flex items-center gap-3 text-sm">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(i => i - 1)}
            className="disabled:opacity-30"
          >
            <ChevronLeft />
          </button>

          <span>
            {currentIndex + 1}/{total}
          </span>

          <button
            disabled={currentIndex >= total - 1}
            onClick={() => setCurrentIndex(i => i + 1)}
            className="disabled:opacity-30"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGenerateAI}
            disabled={isGenerating || regenerateCount >= 3}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            <RotateCw size={16} />
            Regenerate
          </button>

          <button
            onClick={handleApply}
            disabled={
              isGenerating ||
              (selected === 'ai' && !aiText)
            }
            className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Hint */}
      <p className="mt-4 text-xs text-center text-slate-500">
        Click a version to select it before applying
      </p>
    </div>
  )
}

