import React, { useCallback, useState } from 'react'
import { useFormValidation } from '../../hooks/useFormValidation'
import { Link, Trash2, Plus } from 'lucide-react'

const PLATFORM_OPTIONS = [
  'LinkedIn',
  'Blog',
  'Medium',
  'Behance',
  'Instagram',
  'GitHub',
  'Portfolio',
  'Twitter',
  'Facebook',
  'YouTube',
  'Dribbble',
  'CodePen',
  'StackOverflow',
  'Dev.to',
  'HashNode',
  'Kaggle',
  'GitLab',
  'Bitbucket',
  'Personal Website'
]

interface SocialLinksFormProps {
  data: {
    socialLinks?: { urlText: string; url: string }[]
  }
  onChange: (data: any) => void
  onNext?: () => void
  onBack?: () => void
}

export function SocialLinksForm({ data, onChange, onNext, onBack }: SocialLinksFormProps) {
  const { validateField, markFieldAsTouched } = useFormValidation()

  const socialLinks = data.socialLinks || []
  const [platformSearch, setPlatformSearch] = useState('')
  const [showPlatformDropdown, setShowPlatformDropdown] = useState<number | null>(null)
  const [customPlatforms, setCustomPlatforms] = useState<Set<number>>(new Set())

  const handleChange = useCallback(
    async (index: number, field: 'urlText' | 'url', value: string) => {
      const updated = [...socialLinks]
      updated[index] = { ...updated[index], [field]: value }
      onChange({ ...data, socialLinks: updated })

      await validateField(`socialLinks.${index}.${field}`, value)
      markFieldAsTouched(`socialLinks.${index}.${field}`)
    },
    [socialLinks, data, onChange, validateField, markFieldAsTouched]
  )

  const addRow = () => {
    onChange({
      ...data,
      socialLinks: [...socialLinks, { urlText: 'LinkedIn', url: '' }]
    })
  }

  const removeRow = (index: number) => {
    onChange({
      ...data,
      socialLinks: socialLinks.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-2">Websites, portfolios, <span className='text-accent'>profiles</span></h2>
      <p className="text-slate-500 mb-8">
        List links to your website, portfolio, blog, LinkedIn, Skype and more.
      </p>

      {/* Rows */}
      <div className="space-y-4">
        {socialLinks.map((link, idx) => (
          <div key={idx} className="grid grid-cols-[180px_1fr_44px] gap-4 items-start">
            {/* Platform */}
            <div className="relative z-10">
              <label className="text-sm font-medium block mb-1">Website</label>
              <div className="relative">
                {customPlatforms.has(idx) ? (
                  <input
                    type="text"
                    value={link.urlText}
                    onChange={(e) => handleChange(idx, 'urlText', e.target.value)}
                    placeholder="Enter custom platform name"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg bg-white focus:ring-2 focus:ring-offset-0 focus:outline-none focus:ring-[#04477E] hover:border-slate-300 transition-all duration-200"
                  />
                ) : (
                  <input
                    type="text"
                    value={showPlatformDropdown === idx ? platformSearch : link.urlText}
                    onChange={(e) => {
                      setPlatformSearch(e.target.value)
                      setShowPlatformDropdown(idx)
                    }}
                    onFocus={() => {
                      setShowPlatformDropdown(idx)
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowPlatformDropdown(null), 200)
                    }}
                    placeholder="Search or select platform"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg bg-white focus:ring-2 focus:ring-offset-0 focus:outline-none focus:ring-[#04477E] hover:border-slate-300 transition-all duration-200"
                  />
                )}
                
                {showPlatformDropdown === idx && !customPlatforms.has(idx) && (
                  <div className="absolute top-full left-0 right-0 mt-1 border border-slate-200 rounded-lg bg-white shadow-lg z-[100] max-h-48 overflow-y-auto">
                    {PLATFORM_OPTIONS.filter((platform) =>
                      platform.toLowerCase().includes(platformSearch.toLowerCase())
                    ).length > 0 ? (
                      <>
                        {PLATFORM_OPTIONS.filter((platform) =>
                          platform.toLowerCase().includes(platformSearch.toLowerCase())
                        ).map((platform) => (
                          <button
                            key={platform}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              handleChange(idx, 'urlText', platform)
                              setCustomPlatforms(new Set([...Array.from(customPlatforms)].filter(i => i !== idx)))
                              setShowPlatformDropdown(null)
                              setPlatformSearch('')
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 transition text-sm"
                          >
                            {platform}
                          </button>
                        ))}
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault()
                            setCustomPlatforms(new Set([...customPlatforms, idx]))
                            handleChange(idx, 'urlText', '')
                            setShowPlatformDropdown(null)
                            setPlatformSearch('')
                          }}
                          className="w-full text-left px-4 py-2 border-t font-medium text-[#04477E] hover:bg-blue-50 transition text-sm flex items-center gap-2"
                        >
                          <Plus size={16} /> Add Custom Link
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 text-sm text-slate-500 text-center">
                          No platforms found
                        </div>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault()
                            setCustomPlatforms(new Set([...customPlatforms, idx]))
                            handleChange(idx, 'urlText', '')
                            setShowPlatformDropdown(null)
                            setPlatformSearch('')
                          }}
                          className="w-full text-left px-4 py-2 border-t font-medium text-[#04477E] hover:bg-blue-50 transition text-sm flex items-center gap-2"
                        >
                          <Plus size={16} /> Add Custom Link
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* URL */}
            <div>
              <label className="text-sm font-medium block mb-1">Link / URL</label>
              <input
                type="url"
                value={link.url}
                onChange={(e) => handleChange(idx, 'url', e.target.value)}
                placeholder="ex. linkedin.com/in/yourname"
                className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-offset-0 focus:outline-none focus:ring-[#04477E] hover:border-slate-300 transition-all duration-200"
              />
            </div>

            {/* Delete */}
            <button
              onClick={() => removeRow(idx)}
              className="mt-7 h-10 w-10 flex items-center justify-center rounded-lg bg-black text-white hover:bg-red-600 transition"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add more */}
      <button
        onClick={addRow}
        className="mt-6 w-full border-2 border-dashed border-[#04477E] text-[#04477E] py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition"
      >
        <Plus className="w-4 h-4" />
        Add more
      </button>

      {/* Footer */}
      <div className="flex justify-between mt-12">
        <button
          onClick={onBack}
          className="px-10 py-3 rounded-lg border-2 border-slate-300 font-semibold hover:bg-slate-50 transition"
        >
          Back
        </button>

        <button
          onClick={onNext}
          className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-bg-primary font-bold shadow-sm transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
