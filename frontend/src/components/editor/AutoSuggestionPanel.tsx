
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Sparkles, Clock, Check } from 'lucide-react'
import { resumeAPI } from '../../services/apiClient'

interface AutoSuggestionPanelProps {
  text: string
  onTextChange: (newText: string) => void
  context: 'summary' | 'experience' | 'project' | 'skills'
  resumeId: string
  metadata?: any
  disabled?: boolean
  className?: string
}

interface Suggestion {
  text: string
  applied: boolean
}

export function AutoSuggestionPanel({
  text,
  onTextChange,
  context,
  resumeId,
  metadata,
  disabled = false,
  className = ''
}: AutoSuggestionPanelProps) {
  const safeText = typeof text === 'string' ? text : ''
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)


  const [lastRequestId, setLastRequestId] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const currentRequestId = useRef(0)



  // Debounced function to fetch suggestions
  const fetchSuggestions = useCallback(async (requestId: number, currentText: string) => {
    if (disabled || currentText.length < 3) {
      setSuggestions([])
      return
    }

    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await resumeAPI.autoSuggestions(resumeId, currentText, context, metadata)

      // Only update if this is the most recent request
      if (requestId === currentRequestId.current) {
        const suggestions = response.data.suggestions?.map((suggestion: string) => ({
          text: suggestion,
          applied: false
        })) || []
        setSuggestions(suggestions)
      }
    } catch (error) {
      console.error('[AutoSuggestionPanel] Failed to fetch auto suggestions:', error)
      setSuggestions([])
    } finally {
      if (requestId === currentRequestId.current) {
        setIsLoading(false)
      }
    }
  }, [context, resumeId, disabled])

  // Debounced effect
  useEffect(() => {
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      const requestId = ++currentRequestId.current
      setLastRequestId(requestId)
      fetchSuggestions(requestId, safeText)
    }, 1500) // 1500ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [safeText, fetchSuggestions])


  const applySuggestion = (suggestionText: string) => {
    // Add space if needed before the suggestion
    const needsSpace = safeText.length > 0 && !safeText.endsWith(' ')
    const newText = safeText + (needsSpace ? ' ' : '') + suggestionText
    onTextChange(newText)

    // Clear suggestions after applying
    setSuggestions([])
  }

  if (disabled || safeText.length < 3) {
    return null
  }

  return (
    <div className={`mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
          Autocomplete
        </span>
        {isLoading && <Clock className="w-3 h-3 text-blue-500 animate-spin" />}
      </div>

      {suggestions.length > 0 ? (
        <div className="space-y-1">
          <p className="text-xs text-blue-600 dark:text-blue-300 mb-1">
            Next words:
          </p>
          <div className="flex flex-wrap gap-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => applySuggestion(suggestion.text)}
                className="px-2 py-1 text-xs bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-300 border border-blue-200 dark:border-blue-700 rounded transition-colors"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
          <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
            Click to add word(s)
          </p>
        </div>
      ) : safeText.length >= 3 ? (
        <p className="text-xs text-blue-500 dark:text-blue-400">
          {safeText.length < 10 ? 'Keep typing...' : 'No suggestions'}
        </p>
      ) : null}
    </div>
  )
}
