import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FileText, File, Palette, Type, Minus, Plus, Pen,
  Layout, Download, X, Menu, ChevronRight,
  Eye, ZoomIn, ZoomOut, Check,
  AlertCircle, Sparkles, Settings,
  Moon, Sun, Droplet, Zap, Flower2,
  Mountain, Waves, Leaf, Flame, Gem,
  Palette as PaletteIcon, Type as TypeIcon,
  RotateCcw, Save, Copy, Printer,
  Briefcase, GraduationCap, Lightbulb, Globe, Heart, 
  Trophy, Clipboard, Wrench, Link as LinkIcon, Users, 
  Building, Star, Award,
  Mail,
  List,
  Grid,
  Pencil
} from 'lucide-react'
import { resumeAPI } from '../services/apiClient'
import { useTemplateStore, useUIStore, useResumeStore } from '../stores'

// Section icon mapping function
const getSectionIcon = (iconName: string) => {
  switch (iconName) {
    case 'user':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case 'document':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8" />
        </svg>
      );
    case 'graduation':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      );
    case 'academicCampus':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'building':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case 'lightbulb':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    default:
      return (<Pencil size={16} />);
  }
};

// Enhanced color palettes with 50+ colors across all categories
const colorPalettes = [
  // Professional Blues (10)
  { name: 'Deep Navy', primary: '#0A1929', secondary: '#1A2A3A', background: '#ffffff', category: 'blue' },
  { name: 'Classic Blue', primary: '#04477E', secondary: '#0660a9', background: '#ffffff', category: 'blue' },
  { name: 'Ocean Blue', primary: '#0ea5e9', secondary: '#0284c7', background: '#ffffff', category: 'blue' },
  { name: 'Sky Blue', primary: '#7dd3fc', secondary: '#38bdf8', background: '#ffffff', category: 'blue' },
  { name: 'Electric Blue', primary: '#2563eb', secondary: '#3b82f6', background: '#ffffff', category: 'blue' },
  { name: 'Steel Blue', primary: '#4B5563', secondary: '#6B7280', background: '#ffffff', category: 'blue' },
  { name: 'Cornflower', primary: '#6366F1', secondary: '#818CF8', background: '#ffffff', category: 'blue' },
  { name: 'Deep Sapphire', primary: '#0c4a6e', secondary: '#0369a1', background: '#ffffff', category: 'blue' },
  { name: 'Azure', primary: '#0077BE', secondary: '#0095D9', background: '#ffffff', category: 'blue' },
  { name: 'Cobalt', primary: '#0047AB', secondary: '#1A5F9E', background: '#ffffff', category: 'blue' },
  
  // Sophisticated Greens (8)
  { name: 'Forest Green', primary: '#166534', secondary: '#15803d', background: '#ffffff', category: 'green' },
  { name: 'Mint Fresh', primary: '#10b981', secondary: '#059669', background: '#ffffff', category: 'green' },
  { name: 'Olive', primary: '#4d7c0f', secondary: '#3f6212', background: '#ffffff', category: 'green' },
  { name: 'Emerald', primary: '#047857', secondary: '#065f46', background: '#ffffff', category: 'green' },
  { name: 'Sage', primary: '#84cc16', secondary: '#65a30d', background: '#ffffff', category: 'green' },
  { name: 'Pine', primary: '#2C5530', secondary: '#3D6B41', background: '#ffffff', category: 'green' },
  { name: 'Seafoam', primary: '#2E8B57', secondary: '#3CB371', background: '#ffffff', category: 'green' },
  { name: 'Jade', primary: '#00A86B', secondary: '#1FB37B', background: '#ffffff', category: 'green' },
  
  // Elegant Reds & Burgundies (8)
  { name: 'Burgundy', primary: '#7f1d1d', secondary: '#881337', background: '#ffffff', category: 'red' },
  { name: 'Ruby Red', primary: '#b91c1c', secondary: '#991b1b', background: '#ffffff', category: 'red' },
  { name: 'Rose Pink', primary: '#e11d48', secondary: '#be123c', background: '#ffffff', category: 'red' },
  { name: 'Terracotta', primary: '#c2410c', secondary: '#9a3412', background: '#ffffff', category: 'red' },
  { name: 'Coral', primary: '#f43f5e', secondary: '#e11d48', background: '#ffffff', category: 'red' },
  { name: 'Maroon', primary: '#800000', secondary: '#A52A2A', background: '#ffffff', category: 'red' },
  { name: 'Crimson', primary: '#DC143C', secondary: '#B22222', background: '#ffffff', category: 'red' },
  { name: 'Scarlet', primary: '#FF2400', secondary: '#D22B2B', background: '#ffffff', category: 'red' },
  
  // Royal Purples (6)
  { name: 'Royal Purple', primary: '#7e22ce', secondary: '#6b21a8', background: '#ffffff', category: 'purple' },
  { name: 'Lavender', primary: '#a78bfa', secondary: '#8b5cf6', background: '#ffffff', category: 'purple' },
  { name: 'Violet', primary: '#6d28d9', secondary: '#5b21b6', background: '#ffffff', category: 'purple' },
  { name: 'Plum', primary: '#86198f', secondary: '#701a75', background: '#ffffff', category: 'purple' },
  { name: 'Orchid', primary: '#c084fc', secondary: '#a855f7', background: '#ffffff', category: 'purple' },
  { name: 'Lilac', primary: '#9B6B9E', secondary: '#B784B2', background: '#ffffff', category: 'purple' },
  
  // Warm Oranges & Golds (6)
  { name: 'Sunset Orange', primary: '#ea580c', secondary: '#c2410c', background: '#ffffff', category: 'orange' },
  { name: 'Golden Yellow', primary: '#eab308', secondary: '#ca8a04', background: '#ffffff', category: 'orange' },
  { name: 'Amber', primary: '#f59e0b', secondary: '#d97706', background: '#ffffff', category: 'orange' },
  { name: 'Peach', primary: '#f97316', secondary: '#ea580c', background: '#ffffff', category: 'orange' },
  { name: 'Honey', primary: '#d97706', secondary: '#b45309', background: '#ffffff', category: 'orange' },
  { name: 'Bronze', primary: '#CD7F32', secondary: '#B87333', background: '#ffffff', category: 'orange' },
  
  // Professional Neutrals (6)
  { name: 'Slate Gray', primary: '#475569', secondary: '#334155', background: '#ffffff', category: 'neutral' },
  { name: 'Warm Gray', primary: '#78716c', secondary: '#57534e', background: '#ffffff', category: 'neutral' },
  { name: 'Charcoal', primary: '#1e293b', secondary: '#0f172a', background: '#ffffff', category: 'neutral' },
  { name: 'Stone', primary: '#57534e', secondary: '#44403c', background: '#ffffff', category: 'neutral' },
  { name: 'Zinc', primary: '#52525b', secondary: '#3f3f46', background: '#ffffff', category: 'neutral' },
  { name: 'Graphite', primary: '#2C3E50', secondary: '#34495E', background: '#ffffff', category: 'neutral' },
  
  // Dark Mode Options (6)
  { name: 'Dark Blue', primary: '#60a5fa', secondary: '#3b82f6', background: '#0f172a', category: 'dark' },
  { name: 'Dark Purple', primary: '#c084fc', secondary: '#a855f7', background: '#0f172a', category: 'dark' },
  { name: 'Dark Green', primary: '#4ade80', secondary: '#22c55e', background: '#0f172a', category: 'dark' },
  { name: 'Dark Orange', primary: '#fb923c', secondary: '#f97316', background: '#0f172a', category: 'dark' },
  { name: 'Dark Teal', primary: '#2DD4BF', secondary: '#14B8A6', background: '#0f172a', category: 'dark' },
  { name: 'Dark Pink', primary: '#F472B6', secondary: '#EC4899', background: '#0f172a', category: 'dark' },
]

// Font families
const fontFamilies = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Tahoma', value: 'Tahoma, sans-serif' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Garamond', value: 'Garamond, serif' },
  { name: 'Palatino', value: 'Palatino, serif' },
  { name: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Source Code Pro', value: 'Source Code Pro, monospace' },
  { name: 'Calibri', value: 'Calibri, sans-serif' },
  { name: 'Cambria', value: 'Cambria, serif' },
  { name: 'Gill Sans', value: 'Gill Sans, sans-serif' },
]

// Category icons
const categoryIcons: Record<string, any> = {
  blue: Droplet,
  green: Leaf,
  red: Flame,
  purple: Gem,
  orange: Zap,
  neutral: Mountain,
  dark: Moon,
}

const exportFormats = [
  { format: 'pdf', label: 'PDF Document', icon: FileText, description: 'Best for printing and sharing' },
  { format: 'docx', label: 'Word Document', icon: File, description: 'Fully formatted with template styles' },
  { format: 'txt', label: 'Plain Text', icon: Type, description: 'Simple text format' },
]

export default function PreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { templates, fetchTemplates } = useTemplateStore()
  const { data: resumeData, updateData } = useResumeStore()
  const { selectedTheme, setSelectedTheme, selectedTemplate, setSelectedTemplate } = useUIStore()
  
  const [resume, setResume] = useState<any>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [template, setTemplate] = useState<string>('modern')
  const [loading, setLoading] = useState(true)
  const [rendering, setRendering] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [templatePreviews, setTemplatePreviews] = useState<Record<string, string>>({})
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTemplates, setShowTemplates] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedColor, setSelectedColor] = useState('#04477E')
  const [selectedFontFamily, setSelectedFontFamily] = useState('Arial, sans-serif')
  const [bodyFontSize, setBodyFontSize] = useState(14)
  const [templateView, setTemplateView] = useState<'grid' | 'list'>('grid')
  const [fontCategory, setFontCategory] = useState<string>('all')

  // Get filtered sections function
  const getFilteredSections = (currentResumeData: any) => {
    const sections = [
      { id: 'personal', label: 'Professional & Contact Information', iconName: 'user' },
      { id: 'education', label: 'Education', iconName: 'graduation' },
      { id: 'academicCampus', label: 'Academic & Campus Experience', iconName: 'academicCampus' },
      { id: 'professionalContext', label: 'Professional Context', iconName: 'building' },
      { id: 'experience', label: 'Work Experience', iconName: 'briefcase' },
      { id: 'skills', label: 'Skills', iconName: 'lightbulb' },
      { id: 'summary', label: 'Summary', iconName: 'document' },
      { id: 'customSections', label: 'Custom Sections', iconName: 'pen' },
    ];
    return sections;
  };

  const sections = useMemo(() => {
    return getFilteredSections(resumeData);
  }, [resumeData]);

  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const templatePreviewContainerRef = useRef<HTMLDivElement>(null)
  const mainPreviewIframeRef = useRef<HTMLIFrameElement>(null)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  // Filter palettes by category
  const filteredPalettes = useMemo(() => {
    if (selectedCategory === 'all') return colorPalettes
    return colorPalettes.filter(p => p.category === selectedCategory)
  }, [selectedCategory])

  // Filter fonts by category
  const filteredFonts = useMemo(() => {
    if (fontCategory === 'all') return fontFamilies
    return fontFamilies.filter(f => f.category === fontCategory)
  }, [fontCategory])

  // Group palettes by category for counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: colorPalettes.length }
    colorPalettes.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [])

  // Handle section click
  const handleSectionClick = (sectionId: string) => {
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      alert('Cannot edit resume: Invalid resume ID. Please return to dashboard and try again.')
      return
    }

    if (!sectionId || sectionId.trim() === '') {
      return
    }

    navigate(`/editor/${id}?section=${sectionId}`);
  };

  // Inject section detection script into iframe
  const injectSectionDetectionScript = (iframe: HTMLIFrameElement) => {
    if (!iframe.contentDocument) return;

    try {
      const script = `
        (function() {
          function findSectionElement(element) {
            let current = element;
            while (current && current !== document.body) {
              const sectionId = current.getAttribute('data-section');
              if (sectionId) {
                return {
                  element: current,
                  sectionId: sectionId,
                  index: current.getAttribute('data-index') || null
                };
              }
              current = current.parentElement;
            }
            return null;
          }

          document.addEventListener('click', function(e) {
            const sectionData = findSectionElement(e.target);
            if (sectionData) {
              e.preventDefault();
              e.stopPropagation();

              sectionData.element.style.transition = 'all 0.2s ease';
              sectionData.element.style.backgroundColor = 'rgba(4, 71, 126, 0.1)';
              setTimeout(() => {
                sectionData.element.style.backgroundColor = 'transparent';
              }, 200);

              window.parent.postMessage({
                type: 'SECTION_CLICK',
                sectionId: sectionData.sectionId,
                index: sectionData.index ? parseInt(sectionData.index) : null
              }, '*');
            }
          });

          const sectionsWithData = document.querySelectorAll('[data-section]');
          sectionsWithData.forEach(function(sectionElement) {
            sectionElement.style.cursor = 'pointer';
            sectionElement.style.transition = 'all 0.3s ease';
            sectionElement.style.position = 'relative';

            const hoverIndicator = document.createElement('div');
            hoverIndicator.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(4, 71, 126, 0.05); border: 2px solid transparent; border-radius: 4px; pointer-events: none; opacity: 0; transition: all 0.3s ease;';

            sectionElement.appendChild(hoverIndicator);

            sectionElement.addEventListener('mouseenter', function() {
              hoverIndicator.style.opacity = '1';
              hoverIndicator.style.borderColor = '#04477E';
            });

            sectionElement.addEventListener('mouseleave', function() {
              hoverIndicator.style.opacity = '0';
              hoverIndicator.style.borderColor = 'transparent';
            });
          });
        })();
      `;

      const scriptElement = iframe.contentDocument.createElement('script');
      scriptElement.textContent = script;
      iframe.contentDocument.head.appendChild(scriptElement);
    } catch (error) {
      console.error('Failed to inject section detection script:', error);
    }
  };

  // Click outside handler for export modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportModal(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Listen for section click messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'SECTION_CLICK' && event.data.sectionId) {
        handleSectionClick(event.data.sectionId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [id]);

  useEffect(() => {
    fetchResume()
    fetchTemplates()
  }, [id])

  useEffect(() => {
    if (templates.length > 0 && resumeData) {
      loadTemplatePreviews()
    }
  }, [templates, resumeData])

  useEffect(() => {
    if (resume) {
      renderPreview()
    }
  }, [template, resume, selectedTheme, selectedColor, selectedFontFamily, bodyFontSize])

  const fetchResume = async () => {
    try {
      const response = await resumeAPI.get(id!)
      console.log('Fetched resume data:>>>>>>>>>>>>>>>>>>>>>>>>>>', response.data)
      setResume(response.data)

      const currentVersion = response.data?.versions?.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
      
      if (currentVersion?.data) {
        updateData((draft) => {
          Object.assign(draft, currentVersion.data)
        })
      }

      const templateValue = response.data.template || 'modern'
      setTemplate(templateValue)
      setSelectedTemplate(templateValue)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch resume')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentFormattedData = () => {
    const currentVersion = resume?.versions?.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]
    const baseData = currentVersion?.data || {}
    
    return {
      ...baseData,
      formatting: {
        selectedColor: selectedColor,
        fontFamily: selectedFontFamily,
        bodyFontSize: bodyFontSize,
        theme: selectedTheme
      },
      template: template // Include template in export data
    }
  }

  const renderPreview = async () => {
    setRendering(true)
    try {
      const formattedResumeData = getCurrentFormattedData()
      const themeToPass = selectedTheme.name === 'None' ? null : selectedTheme
      
      const response = await resumeAPI.preview(id!, template, themeToPass, formattedResumeData)
      let htmlContent = response.data

      const scrollbarStyles = `
        <style id="custom-scrollbar-styles">
          * {
            scrollbar-width: thin !important;
            scrollbar-color: ${selectedColor} #f1f5f9 !important;
          }
          *::-webkit-scrollbar {
            width: 8px !important;
          }
          *::-webkit-scrollbar-track {
            background: #f1f5f9 !important;
            border-radius: 4px !important;
          }
          *::-webkit-scrollbar-thumb {
            background: ${selectedColor} !important;
            border-radius: 4px !important;
          }
        </style>
      `

      if (htmlContent.includes('</head>')) {
        htmlContent = htmlContent.replace('</head>', `${scrollbarStyles}</head>`)
      }

      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }

      setPreviewUrl(url)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to render preview')
    } finally {
      setRendering(false)
    }
  }

  const loadTemplatePreviews = async () => {
    const previews: Record<string, string> = {}
    for (const template of templates) {
      try {
        const themeToUse = selectedTheme.name === 'None' ? null : selectedTheme
        const response = await resumeAPI.preview(id!, template.id, themeToUse, resumeData)
        previews[template.id] = response.data
      } catch (error) {
        console.error(`Failed to load preview for ${template.id}:`, error)
      }
    }
    setTemplatePreviews(previews)
  }

  const handleExport = async (format: string) => {
    if (!id) return
    setExporting(format)
    setShowExportModal(false)

    try {
      const currentFormattedData = getCurrentFormattedData()
      
      // Add export options based on format
      const exportOptions = {
        ...currentFormattedData,
        exportFormat: format,
        includeStyles: true,
        templateId: template
      }

      const response: any = await resumeAPI.export(
        id, 
        format as any, 
        selectedTheme, 
        template, 
        exportOptions
      )

      const mimeTypes: Record<string, string> = {
        pdf: 'application/pdf',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        txt: 'text/plain'
      }

      const blob = new Blob([response.data], { type: mimeTypes[format] })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const filename = resume?.versions?.[0]?.data?.personal?.name || resume?.title || 'resume'
      link.download = `${filename}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err: any) {
      console.error(`Export error for ${format}:`, err)
      alert(`Failed to export as ${format.toUpperCase()}. Please try again.`)
    } finally {
      setExporting(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-slate-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-[#04477E] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-700 font-medium text-lg mt-6">Loading your resume</p>
          <p className="text-slate-500 text-sm mt-2">Preparing your preview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 w-full overflow-hidden">
      {/* Top Bar with Logo and Logout */}
      <div
        className="bg-[#055597] w-full fixed top-0 left-0 right-0 z-[70]"
        style={{ height: "48px" }}
      >
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          <div className="flex items-center h-8 w-28">
            <Link to="/">
              <img
                src="/white_logo.png"
                alt="Logo"
                className="h-full object-contain"
              />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white hover:text-gray-200 transition-colors text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .template-scroll::-webkit-scrollbar,
          .preview-scroll::-webkit-scrollbar,
          .section-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .template-scroll::-webkit-scrollbar-track,
          .preview-scroll::-webkit-scrollbar-track,
          .section-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .template-scroll::-webkit-scrollbar-thumb,
          .preview-scroll::-webkit-scrollbar-thumb,
          .section-scroll::-webkit-scrollbar-thumb {
            background: #04477E;
            border-radius: 4px;
          }
          iframe[title="Resume Preview"] {
            scrollbar-width: thin;
            scrollbar-color: #04477E #f1f5f9;
          }
          .section-button {
            animation: slideInFromLeft 0.3s ease-out forwards;
          }
          @keyframes slideInFromLeft {
            from {
              transform: translateX(-10px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `,
        }}
      />

      <header
        className="bg-white w-full fixed top-[48px] left-0 right-0 z-[60] border-b border-gray-200"
        style={{ height: "64px" }}
      >
        <div className="flex items-center justify-between h-full px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1 text-slate-600 hover:text-[#04477E] transition-colors text-xs sm:text-sm whitespace-nowrap"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span className="hidden xs:inline">Back</span>
            </button>
            <div className="h-5 w-px bg-gray-300"></div>
            <span className="text-xs sm:text-sm font-medium text-slate-900 truncate max-w-[150px] sm:max-w-[250px]">
              {resume?.versions?.[0]?.data?.personal?.name || resume?.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                showTemplates
                  ? "text-[#04477E] bg-slate-100 border border-[#04477E]/30"
                  : "text-slate-600 hover:text-[#04477E] hover:bg-slate-100"
              }`}
              title="Templates"
            >
              <Layout className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                showSettings
                  ? "text-[#04477E] bg-slate-100 border border-[#04477E]/30"
                  : "text-slate-600 hover:text-[#04477E] hover:bg-slate-100"
              }`}
              title="Colors & Fonts"
            >
              <PaletteIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="sm:hidden p-1.5 text-slate-600 hover:text-[#04477E] hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="hidden md:flex items-center gap-2">
              <select
                value={selectedFontFamily}
                onChange={(e) => setSelectedFontFamily(e.target.value)}
                className="h-8 px-2 border border-gray-300 rounded text-xs bg-white min-w-[120px] focus:outline-none focus:ring-1 focus:ring-[#04477E]"
                style={{ fontFamily: selectedFontFamily }}
              >
                {fontFamilies.map((font) => (
                  <option key={font.name} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center border border-gray-300 rounded h-8">
                <button
                  onClick={() =>
                    setBodyFontSize(Math.max(10, bodyFontSize - 1))
                  }
                  className="w-7 h-full flex items-center justify-center text-xs hover:bg-gray-50 border-r border-gray-300"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-medium">
                  {bodyFontSize}
                </span>
                <button
                  onClick={() =>
                    setBodyFontSize(Math.min(24, bodyFontSize + 1))
                  }
                  className="w-7 h-full flex items-center justify-center text-xs hover:bg-gray-50 border-l border-gray-300"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 ml-2">
                <button
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                  className="p-1.5 rounded hover:bg-white text-slate-600"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="w-12 text-center text-xs font-medium">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                  className="p-1.5 rounded hover:bg-white text-slate-600"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportModal(!showExportModal)}
                className="px-3 py-1.5 bg-[#04477E] hover:bg-[#055597] text-white rounded-lg flex items-center gap-1.5 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {showExportModal && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">
                      Export Resume
                    </h3>
                  </div>
                  <div className="p-2">
                    {exportFormats.map(
                      ({ format, label, icon: Icon, description }) => (
                        <button
                          key={format}
                          onClick={() => handleExport(format)}
                          disabled={exporting === format}
                          className="w-full px-3 py-2 flex items-center gap-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-left"
                        >
                          <div className="p-1.5 bg-[#04477E]/10 rounded">
                            <Icon className="w-4 h-4 text-[#04477E]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {exporting === format ? "Exporting..." : label}
                            </p>
                            <p className="text-xs text-gray-500">
                              {description}
                            </p>
                          </div>
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="w-full" style={{ paddingTop: "112px" }}>
        {error && (
          <div className="w-full px-3 sm:px-4 pt-2">
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="w-full min-h-[calc(100vh-112px)]">
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className="flex w-full px-2 sm:px-3 ">
            {/* Left Sidebar - Sections Navigation */}
            <div
  className={`
    fixed top-[112px] left-0 h-[calc(100vh-112px)] w-72 max-w-[85vw] z-50
    transform transition-transform duration-300 ease-out
    sm:relative sm:top-0 sm:translate-x-0 sm:h-auto sm:w-64 sm:max-w-none sm:mr-4 sm:z-0
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
  `}
>
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-full sm:h-auto overflow-hidden backdrop-blur-sm">
    {/* Header with gradient and better spacing */}
    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-br from-slate-50 via-white to-white">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-6 bg-gradient-to-b from-[#04477E] to-[#0660a9] rounded-full"></div>
        <h3 className="font-semibold text-gray-900 text-sm tracking-wide">
          Resume Sections
        </h3>
      </div>
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="sm:hidden text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Close sidebar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>

    <div className="flex-1 overflow-y-auto p-4 section-scroll max-h-[calc(100vh-180px)] sm:max-h-none">
      {/* Sections with improved styling */}
      {/* <div className="space-y-1 mb-6">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-slate-600 hover:text-[#04477E] hover:bg-blue-50/50 rounded-xl transition-all duration-200 group section-button text-sm"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex-shrink-0 w-5 h-5 text-slate-400 group-hover:text-[#04477E] transition-colors">
              {getSectionIcon(section.iconName)}
            </div>
            <span className="font-medium truncate group-hover:translate-x-0.5 transition-transform">
              {section.label}
            </span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 text-[#04477E] text-xs transition-opacity">
              →
            </span>
          </button>
        ))}
      </div> */}

      {/* Download Options with improved cards */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Download className="w-4 h-4 text-[#04477E]" />
          </div>
          <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
            Export Options
          </h4>
        </div>
        
        <div className="space-y-2.5">
          {/* PDF Button - Primary */}
          <button
            onClick={() => handleExport("pdf")}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#04477E] to-[#0660a9] text-white rounded-xl hover:shadow-lg hover:shadow-blue-200/50 transition-all flex items-center justify-between gap-2 text-sm font-medium group disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={exporting === "pdf"}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>PDF Document</span>
            </span>
            {exporting === "pdf" ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="text-xs opacity-70 group-hover:opacity-100">↓</span>
            )}
          </button>

          {/* DOCX Button - Secondary */}
          <button
            onClick={() => handleExport("docx")}
            className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-[#04477E] hover:shadow-md transition-all flex items-center justify-between gap-2 text-sm font-medium group disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={exporting === "docx"}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Word Document</span>
            </span>
            {exporting === "docx" ? (
              <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="text-xs text-gray-400 group-hover:text-[#04477E]">↓</span>
            )}
          </button>

          {/* TXT Button - Tertiary */}
          <button
            onClick={() => handleExport("txt")}
            className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-[#04477E] hover:shadow-md transition-all flex items-center justify-between gap-2 text-sm font-medium group disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={exporting === "txt"}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span>Plain Text</span>
            </span>
            {exporting === "txt" ? (
              <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="text-xs text-gray-400 group-hover:text-[#04477E]">↓</span>
            )}
          </button>
        </div>
      </div>

      {/* Logout for mobile with improved styling */}
      <div className="mt-6 pt-4 border-t border-gray-100 sm:hidden">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2.5 text-sm font-medium group"
        >
          <svg
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </div>

    {/* Subtle gradient overlay at bottom for scroll indication */}
    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none sm:hidden"></div>
  </div>
</div>

            {/* Resume Preview */}
            <div className="flex-1 min-w-0">
              <div className="bg-gray-100 rounded-xl shadow-xl border border-gray-200 overflow-auto">
                {(rendering || exporting) && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                        <div className="w-12 h-12 border-4 border-[#04477E] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                      </div>
                      <p className="text-gray-600 mt-4 text-sm">
                        {exporting
                          ? `Exporting as ${exporting.toUpperCase()}...`
                          : "Rendering preview..."}
                      </p>
                    </div>
                  </div>
                )}

                {previewUrl && !rendering && !exporting && (
                  <div className="flex justify-center p-2 sm:p-3">
                    <div
                      className="bg-white shadow-lg"
                      style={{
                        width: `${210 * (zoomLevel / 100)}mm`,
                        minHeight: `${297 * (zoomLevel / 100)}mm`,
                        transform: `scale(${zoomLevel / 100})`,
                        transformOrigin: "top center",
                      }}
                    >
                      <iframe
                        ref={mainPreviewIframeRef}
                        src={previewUrl}
                        className="w-full h-full border-0"
                        title="Resume Preview"
                        sandbox="allow-same-origin allow-scripts"
                        onLoad={() => {
                          if (mainPreviewIframeRef.current) {
                            injectSectionDetectionScript(
                              mainPreviewIframeRef.current,
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Templates & Colors Panel */}
            {/* Right Panel - Templates & Colors Panel */}
            <div
                className={`
              fixed top-[112px] right-0 h-[calc(100vh-112px)] w-80 max-w-[90vw] z-50
              transform transition-transform duration-300 ease-out
              sm:relative sm:top-0 sm:translate-x-0 sm:h-auto sm:w-80 sm:max-w-none sm:ml-3 sm:z-0
              ${showTemplates || showSettings ? "translate-x-0" : "translate-x-full sm:translate-x-0"}
            `}
                        >
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full sm:h-auto overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">
                    {showSettings && showTemplates
                      ? "Templates & Colors"
                      : showSettings
                        ? "Colors & Fonts"
                        : "Templates"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowTemplates(false);
                      setShowSettings(false);
                    }}
                    className="sm:hidden text-gray-500 hover:text-gray-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-180px)]">
                  {/* Show both when both are toggled on */}
                  {showSettings && showTemplates && (
                    <div>
                      {/* Template View Toggle */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-gray-700">
                            Templates View
                          </span>
                          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                            <button
                              onClick={() => setTemplateView("grid")}
                              className={`p-1.5 rounded ${templateView === "grid" ? "bg-white shadow" : ""}`}
                            >
                              <Grid className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setTemplateView("list")}
                              className={`p-1.5 rounded ${templateView === "list" ? "bg-white shadow" : ""}`}
                            >
                              <List className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Color Categories */}
                      <div className="mb-6">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Color Categories
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-2 py-1 text-xs rounded-full border ${
                              selectedCategory === "all"
                                ? "bg-[#04477E] text-white border-[#04477E]"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            All ({categoryCounts.all})
                          </button>
                          {Object.entries(categoryIcons).map(([cat, Icon]) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-2 py-1 text-xs rounded-full border flex items-center gap-1 ${
                                selectedCategory === cat
                                  ? "bg-[#04477E] text-white border-[#04477E]"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <Icon className="w-3 h-3" />
                              <span className="capitalize">
                                {cat} ({categoryCounts[cat] || 0})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Themes */}
                      <div className="mb-6">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Color Themes
                        </label>
                        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                          {filteredPalettes.map((palette) => (
                            <button
                              key={palette.name}
                              onClick={() => {
                                setSelectedColor(palette.primary);
                                setSelectedTheme(palette);
                              }}
                              className={`relative aspect-square rounded-lg border-2 transition-all ${
                                selectedColor === palette.primary
                                  ? "border-[#04477E] ring-2 ring-[#04477E]/20 scale-105"
                                  : "border-transparent hover:border-gray-300"
                              }`}
                              style={{ backgroundColor: palette.primary }}
                              title={palette.name}
                            >
                              {selectedColor === palette.primary && (
                                <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                              )}
                              {palette.background === "#0f172a" && (
                                <Moon className="w-2 h-2 text-white absolute bottom-0.5 right-0.5 opacity-50" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font Family */}
                      <div className="mb-6">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Font Family
                        </label>
                        <select
                          value={selectedFontFamily}
                          onChange={(e) =>
                            setSelectedFontFamily(e.target.value)
                          }
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#04477E]"
                          style={{ fontFamily: selectedFontFamily }}
                        >
                          {fontFamilies.map((font) => (
                            <option
                              key={font.name}
                              value={font.value}
                              style={{ fontFamily: font.value }}
                            >
                              {font.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Font Size */}
                      <div className="mb-6">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Font Size: {bodyFontSize}px
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setBodyFontSize(Math.max(10, bodyFontSize - 1))
                            }
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="range"
                            min="10"
                            max="24"
                            value={bodyFontSize}
                            onChange={(e) =>
                              setBodyFontSize(parseInt(e.target.value))
                            }
                            className="flex-1"
                          />
                          <button
                            onClick={() =>
                              setBodyFontSize(Math.min(24, bodyFontSize + 1))
                            }
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Templates */}
                      <div className="mb-6 pt-4 border-t border-gray-200">
                        <h4 className="text-xs font-medium text-gray-700 mb-3">
                          Choose Template
                        </h4>
                        {templates.length === 0 ? (
                          <div className="text-center py-4">
                            <div className="relative inline-block">
                              <div className="w-8 h-8 border-4 border-gray-200 rounded-full"></div>
                              <div className="w-8 h-8 border-4 border-[#04477E] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                            </div>
                            <p className="text-gray-500 text-xs mt-2">
                              Loading templates...
                            </p>
                          </div>
                        ) : (
                          <div
                            className={
                              templateView === "grid"
                                ? "grid grid-cols-2 gap-3"
                                : "space-y-2"
                            }
                          >
                            {templates.map((templateOption: any) => (
                              <button
                                key={templateOption.id}
                                onClick={async () => {
                                  try {
                                    await resumeAPI.update(id!, {
                                      template: templateOption.id,
                                    });
                                    setTemplate(templateOption.id);
                                    setSelectedTemplate(templateOption.id);
                                  } catch (error) {
                                    console.error(
                                      "Failed to update template:",
                                      error,
                                    );
                                    alert(
                                      "Failed to update template. Please try again.",
                                    );
                                  }
                                }}
                                className={`
                      relative group overflow-hidden rounded-lg border-2 transition-all
                      ${
                        template === templateOption.id
                          ? "border-[#04477E] shadow-md"
                          : "border-transparent hover:border-slate-300"
                      }
                      ${templateView === "list" ? "flex items-center gap-3 p-2" : ""}
                    `}
                              >
                                {templateView === "grid" ? (
                                  <>
                                    <div className="aspect-[210/297] w-full bg-gray-100">
                                      {templatePreviews[templateOption.id] ? (
                                        <div className="w-full h-full relative">
                                          <iframe
                                            srcDoc={
                                              templatePreviews[
                                                templateOption.id
                                              ]
                                            }
                                            className="absolute inset-0 w-full h-full pointer-events-none"
                                            style={{
                                              transform: "scale(0.25)",
                                              transformOrigin: "0 0",
                                              width: "400%",
                                              height: "400%",
                                            }}
                                            title={templateOption.name}
                                          />
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-center h-full">
                                          <File className="w-6 h-6 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                      <p className="text-xs text-white font-medium truncate">
                                        {templateOption.name}
                                      </p>
                                    </div>
                                    {template === templateOption.id && (
                                      <div className="absolute top-1 right-1 bg-[#04477E] rounded-full p-0.5">
                                        <Check className="w-3 h-3 text-white" />
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                      {templatePreviews[templateOption.id] ? (
                                        <div className="w-6 h-6 bg-white rounded shadow-sm" />
                                      ) : (
                                        <File className="w-4 h-4 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 text-left">
                                      <p className="text-sm font-medium text-gray-900">
                                        {templateOption.name}
                                      </p>
                                    </div>
                                    {template === templateOption.id && (
                                      <Check className="w-4 h-4 text-[#04477E]" />
                                    )}
                                  </>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Reset Button */}
                      <button
                        onClick={() => {
                          setSelectedColor("#04477E");
                          setSelectedFontFamily("Arial, sans-serif");
                          setBodyFontSize(14);
                          setSelectedTheme(colorPalettes[1]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-xs font-medium flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset to Defaults
                      </button>
                    </div>
                  )}

                  {/* Settings Panel Only */}
                  {showSettings && !showTemplates && (
                    <div>
                      {/* Color Categories */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Color Categories
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-2 py-1 text-xs rounded-full border ${
                              selectedCategory === "all"
                                ? "bg-[#04477E] text-white border-[#04477E]"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            All ({categoryCounts.all})
                          </button>
                          {Object.entries(categoryIcons).map(([cat, Icon]) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-2 py-1 text-xs rounded-full border flex items-center gap-1 ${
                                selectedCategory === cat
                                  ? "bg-[#04477E] text-white border-[#04477E]"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <Icon className="w-3 h-3" />
                              <span className="capitalize">
                                {cat} ({categoryCounts[cat] || 0})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Themes */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Color Themes
                        </label>
                        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                          {filteredPalettes.map((palette) => (
                            <button
                              key={palette.name}
                              onClick={() => {
                                setSelectedColor(palette.primary);
                                setSelectedTheme(palette);
                              }}
                              className={`relative aspect-square rounded-lg border-2 transition-all ${
                                selectedColor === palette.primary
                                  ? "border-[#04477E] ring-2 ring-[#04477E]/20 scale-105"
                                  : "border-transparent hover:border-gray-300"
                              }`}
                              style={{ backgroundColor: palette.primary }}
                              title={palette.name}
                            >
                              {selectedColor === palette.primary && (
                                <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                              )}
                              {palette.background === "#0f172a" && (
                                <Moon className="w-2 h-2 text-white absolute bottom-0.5 right-0.5 opacity-50" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font Family */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Font Family
                        </label>
                        <select
                          value={selectedFontFamily}
                          onChange={(e) =>
                            setSelectedFontFamily(e.target.value)
                          }
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#04477E]"
                          style={{ fontFamily: selectedFontFamily }}
                        >
                          {fontFamilies.map((font) => (
                            <option
                              key={font.name}
                              value={font.value}
                              style={{ fontFamily: font.value }}
                            >
                              {font.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Font Size */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Font Size: {bodyFontSize}px
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setBodyFontSize(Math.max(10, bodyFontSize - 1))
                            }
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="range"
                            min="10"
                            max="24"
                            value={bodyFontSize}
                            onChange={(e) =>
                              setBodyFontSize(parseInt(e.target.value))
                            }
                            className="flex-1"
                          />
                          <button
                            onClick={() =>
                              setBodyFontSize(Math.min(24, bodyFontSize + 1))
                            }
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Reset Button */}
                      <button
                        onClick={() => {
                          setSelectedColor("#04477E");
                          setSelectedFontFamily("Arial, sans-serif");
                          setBodyFontSize(14);
                          setSelectedTheme(colorPalettes[1]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-xs font-medium flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset to Defaults
                      </button>
                    </div>
                  )}

                  {/* Templates Panel Only */}
                  {showTemplates && !showSettings && (
                    <div>
                      {/* Template View Toggle */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            View mode
                          </span>
                          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                            <button
                              onClick={() => setTemplateView("grid")}
                              className={`p-1.5 rounded ${templateView === "grid" ? "bg-white shadow" : ""}`}
                            >
                              <Grid className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setTemplateView("list")}
                              className={`p-1.5 rounded ${templateView === "list" ? "bg-white shadow" : ""}`}
                            >
                              <List className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <h4 className="text-xs font-medium text-gray-700 mb-3">
                        Choose Template
                      </h4>
                      {templates.length === 0 ? (
                        <div className="text-center py-4">
                          <div className="relative inline-block">
                            <div className="w-8 h-8 border-4 border-gray-200 rounded-full"></div>
                            <div className="w-8 h-8 border-4 border-[#04477E] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                          </div>
                          <p className="text-gray-500 text-xs mt-2">
                            Loading templates...
                          </p>
                        </div>
                      ) : (
                        <div
                          className={
                            templateView === "grid"
                              ? "grid grid-cols-2 gap-3"
                              : "space-y-2"
                          }
                        >
                          {templates.map((templateOption: any) => (
                            <button
                              key={templateOption.id}
                              onClick={async () => {
                                try {
                                  await resumeAPI.update(id!, {
                                    template: templateOption.id,
                                  });
                                  setTemplate(templateOption.id);
                                  setSelectedTemplate(templateOption.id);
                                } catch (error) {
                                  console.error(
                                    "Failed to update template:",
                                    error,
                                  );
                                  alert(
                                    "Failed to update template. Please try again.",
                                  );
                                }
                              }}
                              className={`
                    relative group overflow-hidden rounded-lg border-2 transition-all
                    ${
                      template === templateOption.id
                        ? "border-[#04477E] shadow-md"
                        : "border-transparent hover:border-slate-300"
                    }
                    ${templateView === "list" ? "flex items-center gap-3 p-2" : ""}
                  `}
                            >
                              {templateView === "grid" ? (
                                <>
                                  <div className="aspect-[210/297] w-full bg-gray-100">
                                    {templatePreviews[templateOption.id] ? (
                                      <div className="w-full h-full relative">
                                        <iframe
                                          srcDoc={
                                            templatePreviews[templateOption.id]
                                          }
                                          className="absolute inset-0 w-full h-full pointer-events-none"
                                          style={{
                                            transform: "scale(0.25)",
                                            transformOrigin: "0 0",
                                            width: "400%",
                                            height: "400%",
                                          }}
                                          title={templateOption.name}
                                        />
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center h-full">
                                        <File className="w-6 h-6 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                    <p className="text-xs text-white font-medium truncate">
                                      {templateOption.name}
                                    </p>
                                  </div>
                                  {template === templateOption.id && (
                                    <div className="absolute top-1 right-1 bg-[#04477E] rounded-full p-0.5">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                    {templatePreviews[templateOption.id] ? (
                                      <div className="w-6 h-6 bg-white rounded shadow-sm" />
                                    ) : (
                                      <File className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-gray-900">
                                      {templateOption.name}
                                    </p>
                                  </div>
                                  {template === templateOption.id && (
                                    <Check className="w-4 h-4 text-[#04477E]" />
                                  )}
                                </>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Toast */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <Check className="w-4 h-4" />
          <span className="text-sm">Export completed successfully!</span>
        </div>
      )}
    </div>
  );
}