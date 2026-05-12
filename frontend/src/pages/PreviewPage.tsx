import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FileText, File, Pen, Download, X, Menu, ChevronRight,
  Eye, ZoomIn, ZoomOut, Check,
  AlertCircle, Sparkles,
  Palette as PaletteIcon, Type as TypeIcon,
  RotateCcw, Link as LinkIcon,
  Loader2,
  Search,
  Cpu,
  ShieldCheck,
  LayoutTemplateIcon,
  Activity
} from 'lucide-react'
import { paymentAPI, resumeAPI } from '../services/apiClient'
import { useTemplateStore, useUIStore, useResumeStore } from '../stores'
import toast from 'react-hot-toast'
import PaymentModal from '../components/payments&ai/PaymentModal'
import PricingPopup from '../components/payments&ai/PricingPopup'
import { confirmDeleteToast } from '../utils/confirmDeleteToast'
import { FaMoneyBill } from 'react-icons/fa'

// AI Enhancement Loading Steps
const AI_ENHANCEMENT_STEPS = [
  { icon: <Search size={20} />, text: "Analyzing your resume structure..." },
  { icon: <Cpu size={20} />, text: "AI optimizing content and keywords..." },
  { icon: <Sparkles size={20} />, text: "Enhancing descriptions with STAR format..." },
  { icon: <ShieldCheck size={20} />, text: "Applying ATS-friendly formatting..." },
];

// Section icon mapping function


// Enhanced color palettes with 50+ colors across all categories
const colorPalettes = [
  { name: 'Deep Navy', primary: '#0A1929', secondary: '#1A2A3A', background: '#ffffff', category: 'blue' },
  { name: 'Classic Blue', primary: '#04477E', secondary: '#0660a9', background: '#ffffff', category: 'blue' },
  { name: 'Ocean Blue', primary: '#0ea5e9', secondary: '#0284c7', background: '#ffffff', category: 'blue' },
  { name: 'Electric Blue', primary: '#2563eb', secondary: '#3b82f6', background: '#ffffff', category: 'blue' },
  { name: 'Cobalt', primary: '#0047AB', secondary: '#1A5F9E', background: '#ffffff', category: 'blue' },
  { name: 'Forest Green', primary: '#166534', secondary: '#15803d', background: '#ffffff', category: 'green' },
  { name: 'Emerald', primary: '#047857', secondary: '#065f46', background: '#ffffff', category: 'green' },
  { name: 'Mint Fresh', primary: '#10b981', secondary: '#059669', background: '#ffffff', category: 'green' },
  { name: 'Jade', primary: '#00A86B', secondary: '#1FB37B', background: '#ffffff', category: 'green' },
  { name: 'Burgundy', primary: '#7f1d1d', secondary: '#881337', background: '#ffffff', category: 'red' },
  { name: 'Ruby Red', primary: '#b91c1c', secondary: '#991b1b', background: '#ffffff', category: 'red' },
  { name: 'Terracotta', primary: '#c2410c', secondary: '#9a3412', background: '#ffffff', category: 'red' },
  { name: 'Crimson', primary: '#DC143C', secondary: '#B22222', background: '#ffffff', category: 'red' },
  { name: 'Royal Purple', primary: '#7e22ce', secondary: '#6b21a8', background: '#ffffff', category: 'purple' },
  { name: 'Violet', primary: '#6d28d9', secondary: '#5b21b6', background: '#ffffff', category: 'purple' },
  { name: 'Lavender', primary: '#a78bfa', secondary: '#8b5cf6', background: '#ffffff', category: 'purple' },
  { name: 'Sunset Orange', primary: '#ea580c', secondary: '#c2410c', background: '#ffffff', category: 'orange' },
  { name: 'Amber', primary: '#f59e0b', secondary: '#d97706', background: '#ffffff', category: 'orange' },
  { name: 'Golden Yellow', primary: '#eab308', secondary: '#ca8a04', background: '#ffffff', category: 'orange' },
  { name: 'Slate Gray', primary: '#475569', secondary: '#334155', background: '#ffffff', category: 'neutral' },
  { name: 'Charcoal', primary: '#1e293b', secondary: '#0f172a', background: '#ffffff', category: 'neutral' },
  { name: 'Graphite', primary: '#2C3E50', secondary: '#34495E', background: '#ffffff', category: 'neutral' },
  { name: 'Dark Blue', primary: '#60a5fa', secondary: '#3b82f6', background: '#0f172a', category: 'dark' },
  { name: 'Dark Green', primary: '#4ade80', secondary: '#22c55e', background: '#0f172a', category: 'dark' },
];

// Font families
const fontFamilies = [
  { name: 'Arial', value: 'Arial, sans-serif', category: 'sans' },
  { name: 'Times New Roman', value: 'Times New Roman, serif', category: 'serif' },
  { name: 'Georgia', value: 'Georgia, serif', category: 'serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif', category: 'sans' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif', category: 'sans' },
  { name: 'Tahoma', value: 'Tahoma, sans-serif', category: 'sans' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif', category: 'sans' },
  { name: 'Impact', value: 'Impact, sans-serif', category: 'display' },
  { name: 'Garamond', value: 'Garamond, serif', category: 'serif' },
  { name: 'Palatino', value: 'Palatino, serif', category: 'serif' },
  { name: 'Inter', value: 'Inter, system-ui, sans-serif', category: 'sans' },
  { name: 'Roboto', value: 'Roboto, sans-serif', category: 'sans' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif', category: 'sans' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif', category: 'sans' },
  { name: 'Poppins', value: 'Poppins, sans-serif', category: 'sans' },
  { name: 'Lato', value: 'Lato, sans-serif', category: 'sans' },
  { name: 'Source Code Pro', value: 'Source Code Pro, monospace', category: 'mono' },
  { name: 'Calibri', value: 'Calibri, sans-serif', category: 'sans' },
  { name: 'Cambria', value: 'Cambria, serif', category: 'serif' },
  { name: 'Gill Sans', value: 'Gill Sans, sans-serif', category: 'sans' },
]

export default function PreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { templates, fetchTemplates } = useTemplateStore()
  const { data: resumeData, updateData, save } = useResumeStore()
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
  const [showSettings, setShowSettings] = useState(true)
  const [showTemplates, setShowTemplates] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedFontFamily, setSelectedFontFamily] = useState('Arial, sans-serif')
  const [bodyFontSize, setBodyFontSize] = useState(14)
  const [templateView, setTemplateView] = useState<'grid' | 'list'>('grid')
  

  
  // Payment modal state
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentType, setPaymentType] = useState<"download" | "ai">("download")
  const [pendingExportFormat, setPendingExportFormat] = useState<string | null>(null)
  
  // AI Enhancement states
  const [enhancing, setEnhancing] = useState(false)
  const [enhancementStep, setEnhancementStep] = useState(0)
  const [enhancementSuccess, setEnhancementSuccess] = useState(false)

  // AI Comparison states
  const [originalResumeData, setOriginalResumeData] = useState<any>(null)
  const [aiEnhancedData, setAiEnhancedData] = useState<any>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<'original' | 'enhanced'>('enhanced')

  // pricing popup state
  const [showPricingPopup, setShowPricingPopup] = useState(false)

  // Filename modal state
  const [showFilenameModal, setShowFilenameModal] = useState(false)
  const [pendingFilenameFormat, setPendingFilenameFormat] = useState<string | null>(null)
  const [customFilename, setCustomFilename] = useState('')
  const filenameInputRef = useRef<HTMLInputElement>(null)
  const [downloadingInvoice, setDownloadingInvoice] = useState(false)

  // Keep previous preview URL to prevent flicker
  const previousPreviewUrlRef = useRef<string>('')

  // Function to accept AI data and save it
  const acceptAIData = async () => {
    const dataToAccept = selectedVersion === 'original' ? originalResumeData : aiEnhancedData
    if (!dataToAccept) return

    // Update store and save
    updateData((draft) => {
      Object.assign(draft, dataToAccept)
    })
    await save()

    // Refresh resume data
    await fetchResume()

    // Clear comparison mode
    setShowComparison(false)
    setOriginalResumeData(null)
    setAiEnhancedData(null)
    toast.success(`${selectedVersion === 'original' ? 'Original' : 'AI Enhanced'} resume accepted!`)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const guestId = localStorage.getItem('guestId')
    
    if (!token && guestId) {
      const timer = setTimeout(() => {
        setShowPricingPopup(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Animation for AI enhancement steps
  useEffect(() => {
    if (enhancing && !enhancementSuccess) {
      const interval = setInterval(() => {
        setEnhancementStep((prev) =>
          prev < AI_ENHANCEMENT_STEPS.length - 1 ? prev + 1 : prev
        )
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [enhancing, enhancementSuccess])

  // Get filtered sections function
  const getFilteredSections = (currentResumeData: any) => {
    const sections = [
      { id: 'personal', label: 'Professional & Contact Information', iconName: 'user' },
      { id: 'education', label: 'Education', iconName: 'graduation' },
      { id: 'academicCampus', label: 'Academic & Campus Experience', iconName: 'academicCampus' },
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

  const mainPreviewIframeRef = useRef<HTMLIFrameElement>(null)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  // Filter palettes by category
  const filteredPalettes = useMemo(() => {
    if (selectedCategory === 'all') return colorPalettes
    return colorPalettes.filter(p => p.category === selectedCategory)
  }, [selectedCategory])

  
  // Handle section click - if in comparison mode, accept the active version first
  const handleSectionClick = async (sectionId: string) => {
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      toast.error('Cannot edit resume: Invalid resume ID. Please return to dashboard and try again.')
      return
    }

    if (!sectionId || sectionId.trim() === '') {
      return
    }

    // If in comparison mode, accept the active version first
    if (showComparison) {
      await acceptAIData()
    }
    
    navigate(`/editor/${id}?section=${sectionId}`);
  };

  // AI Enhance handler with comparison mode
  const handleAIEnhance = async () => {
    if (enhancing) return;
    
    try {
      setEnhancing(true)
      setEnhancementStep(0)
      setEnhancementSuccess(false)

      const currentVersion = resume?.versions?.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
      const currentData = currentVersion?.data || {}
      setOriginalResumeData(currentData)

      const response = await resumeAPI.enhance(id!)

      if (response.data && (response.data.data || response.data.versionId)) {
        const enhancedData = response.data.data || {};
        setEnhancementStep(AI_ENHANCEMENT_STEPS.length - 1)
        setTimeout(() => {
          setEnhancementSuccess(true)
          setTimeout(() => {
            setAiEnhancedData(enhancedData)
            setEnhancing(false)
            setShowComparison(true)
            setEnhancementSuccess(false)
            toast.success("AI enhancement complete! Compare the versions below.")
          }, 800)
        }, 500)
      } else {
        setEnhancing(false)
        setEnhancementSuccess(false)
        toast.error("AI enhancement completed but no data returned.")
      }
    } catch (err: any) {
      setEnhancing(false)
      setEnhancementSuccess(false)
      
      if (err.response?.status === 402) {
        setPaymentType("ai")
        setPaymentOpen(true)
        return
      }

      console.error("AI error:", err)
      toast.error("Failed to enhance resume. Please try again.")
    }
  };

  const handleDownloadInvoice = async () => {
    if (!id) return;
    setDownloadingInvoice(true);
    try {
      const response = await paymentAPI.getInvoice(id);
      if (response.data.success && response.data.pdfUrl) {
        try {
          // Attempt to download the file with custom filename
          const fileRes = await fetch(response.data.pdfUrl);
          const blob = await fileRes.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          // Use invoice number as filename if available
          const filename = response.data.invoiceNumber || `invoice-${id}`;
          link.download = `${filename}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast.success('Invoice downloaded!');
        } catch (fetchErr) {
          // Fallback to opening in new tab if blob download fails (e.g. CORS)
          console.warn('Blob download failed, falling back to window.open', fetchErr);
          window.open(response.data.pdfUrl, '_blank');
          toast.success('Opening invoice...');
        }
      } else {
        toast.error('Invoice URL not found');
      }
    } catch (err: any) {
      console.error('Invoice download error:', err);
      if (err.response?.status === 404) {
        toast.error('Invoice not found. It might still be generating or no successful payment found.');
      } else {
        toast.error('Failed to download invoice');
      }
    } finally {
      setDownloadingInvoice(false);
    }
  };

  // Get formatted data for comparison preview
  const getComparisonFormattedData = () => {
    const baseData = selectedVersion === 'original' ? originalResumeData : aiEnhancedData
    return {
      ...baseData,
      formatting: {
        primary: selectedTheme?.primary,
        fontFamily: selectedFontFamily,
        bodyFontSize: bodyFontSize,
        theme: selectedTheme
      },
      template: template
    }
  }

  // Enhanced export handler for AI version - accepts the data and removes comparison
  const handleEnhancedExport = async (format: string, version: 'original' | 'enhanced') => {
    if (!id) return;
    
    const dataToExport = version === 'original' ? originalResumeData : aiEnhancedData;
    if (!dataToExport) {
      toast.error('No data available for export');
      return;
    }

    setExporting(format);
    
    try {
      const formattedData = {
        ...dataToExport,
        formatting: {
          primary: selectedTheme?.primary,
          fontFamily: selectedFontFamily,
          bodyFontSize: bodyFontSize,
          theme: selectedTheme
        },
        template: template
      };

      const exportOptions = {
        ...formattedData,
        exportFormat: format,
        includeStyles: true,
        templateId: template
      };

      const response: any = await resumeAPI.export(
        id,
        format as any,
        selectedTheme,
        template,
        exportOptions
      );

      const mimeTypes: Record<string, string> = {
        pdf: 'application/pdf',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };

      const blob = new Blob([response.data], { type: mimeTypes[format] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `${customFilename.trim() || resume?.versions?.[0]?.data?.personal?.name || resume?.title || 'resume'}`;
      link.download = `${filename}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Resume exported as ${format.toUpperCase()} successfully!`);
      
      // If downloading AI enhanced version, accept the AI data
      if (version === 'enhanced') {
        await acceptAIData();
      } else {
        // If downloading original version, just close comparison
        setShowComparison(false);
        setOriginalResumeData(null);
        setAiEnhancedData(null);
      }
      
    } catch (err: any) {
      if (err.response?.status === 402) {
        setPendingExportFormat(format);
        setPaymentType("download");
        setPaymentOpen(true);
        return;
      }
      console.error(`Export error for ${format}:`, err);
      toast.error(`Failed to export as ${format.toUpperCase()}. Please try again.`);
    } finally {
      setExporting(null);
    }
  };

  // Regular export handler - also closes comparison if active
  const handleRegularExport = async (format: string) => {
    if (!id) return;

    // If in comparison mode, close it before exporting regular version
    if (showComparison) {
      setShowComparison(false);
      setOriginalResumeData(null);
      setAiEnhancedData(null);
    }

    const defaultName = resume?.versions?.[0]?.data?.personal?.name || resume?.title || 'resume'
    setCustomFilename(defaultName)
    setPendingFilenameFormat(format)
    setShowFilenameModal(true)

    setTimeout(() => filenameInputRef.current?.focus(), 100)
  };

  const handleFilenameConfirm = () => {
    if (!pendingFilenameFormat) return
    setShowFilenameModal(false)
    performExport(pendingFilenameFormat)
    setPendingFilenameFormat(null)
  }

  const performExport = async (format: string) => {
    if (!id) return
    setExporting(format)
    setShowExportModal(false)

    try {
      const currentFormattedData = getCurrentFormattedData()
      
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
      const filename = customFilename.trim() || resume?.versions?.[0]?.data?.personal?.name || resume?.title || 'resume'
      link.download = `${filename}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      await resumeAPI.markDownloaded(id);

      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
      toast.success(`Resume exported as ${format.toUpperCase()} successfully!`)
    } catch (err: any) {
      if (err.response?.status === 402) {
        setPendingExportFormat(format)
        setPaymentType("download")
        setPaymentOpen(true)
        return
      }
      console.error(`Export error for ${format}:`, err)
      toast.error(`Failed to export as ${format.toUpperCase()}. Please try again.`)
    } finally {
      setExporting(null)
    }
  }

  // Inject section detection script into iframe
  const injectSectionDetectionScript = (iframe: HTMLIFrameElement) => {
    if (!iframe.contentDocument) return;

    const PRIMARY_COLOR = selectedTheme?.primary || "#04477E"

    try {
      const script = `
        (function() {
          const PRIMARY_COLOR = '${PRIMARY_COLOR}';
          
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
            if (e.target.closest('button')) return;

            const sectionData = findSectionElement(e.target);
            if (sectionData) {
              e.preventDefault();
              e.stopPropagation();

              sectionData.element.style.transition = 'all 0.2s ease';
              sectionData.element.style.backgroundColor = PRIMARY_COLOR + '1A';
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
            sectionElement.style.transition = 'all 0.3s ease';
            sectionElement.style.position = 'relative';

            const hoverIndicator = document.createElement('div');
            hoverIndicator.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ' + PRIMARY_COLOR + '0D; border: 2px solid transparent; border-radius: 4px; pointer-events: none; opacity: 0; transition: all 0.3s ease; z-index: 10;';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'position: absolute; top: 6px; right: 6px; display: flex; gap: 8px; opacity: 0; transition: all 0.3s ease; z-index: 20; pointer-events: auto;';

            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>';
            editBtn.style.cssText = 'background: ' + PRIMARY_COLOR + '; color: white; border: none; border-radius: 4px; padding: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s;';
            editBtn.onmouseenter = function() { this.style.transform = "scale(1.1)"; };
            editBtn.onmouseleave = function() { this.style.transform = "scale(1)"; };
            
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
            deleteBtn.style.cssText = 'background: #DC2626; color: white; border: none; border-radius: 4px; padding: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s;';
            deleteBtn.onmouseenter = function() { this.style.transform = "scale(1.1)"; };
            deleteBtn.onmouseleave = function() { this.style.transform = "scale(1)"; };

            buttonContainer.appendChild(editBtn);
            buttonContainer.appendChild(deleteBtn);

            sectionElement.appendChild(hoverIndicator);
            sectionElement.appendChild(buttonContainer);

            sectionElement.addEventListener('mouseenter', function() {
              hoverIndicator.style.opacity = '1';
              hoverIndicator.style.borderColor = PRIMARY_COLOR;
              buttonContainer.style.opacity = '1';
            });

            sectionElement.addEventListener('mouseleave', function() {
              hoverIndicator.style.opacity = '0';
              hoverIndicator.style.borderColor = 'transparent';
              buttonContainer.style.opacity = '0';
            });

            editBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              const sectionId = sectionElement.getAttribute('data-section');
              const index = sectionElement.getAttribute('data-index');
              window.parent.postMessage({
                type: 'SECTION_EDIT',
                sectionId: sectionId,
                index: index ? parseInt(index) : null
              }, '*');
            });

            deleteBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              const sectionId = sectionElement.getAttribute('data-section');
              const index = sectionElement.getAttribute('data-index');
              window.parent.postMessage({
                type: 'SECTION_DELETE',
                sectionId: sectionId,
                index: index !== null ? parseInt(index) : null
              }, '*');
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

  // Handle section delete
  const handleSectionDelete = async (sectionId: string, index: number | null) => {
    if (!sectionId) return;

    confirmDeleteToast(async () => {
      try {
        updateData((draft: any) => {
          if (index !== null && Array.isArray(draft[sectionId])) {
            draft[sectionId].splice(index, 1);
          } else {
            if (Array.isArray(draft[sectionId])) {
              draft[sectionId] = [];
            } else if (typeof draft[sectionId] === 'string') {
              draft[sectionId] = '';
            } else {
              draft[sectionId] = {};
              if (draft.sectionVisibility && draft.sectionVisibility[sectionId] !== undefined) {
                draft.sectionVisibility[sectionId] = false;
              }
            }
          }
        });
        await save();
        await fetchResume();
        toast.success('Item deleted successfully');
      } catch (err) {
        console.error('Failed to delete relative item:', err);
        toast.error('Failed to delete item');
      }
    });
  };

  // Listen for section click messages from iframe
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'SECTION_CLICK' && event.data.sectionId) {
        await handleSectionClick(event.data.sectionId);
      } else if (event.data.type === 'SECTION_EDIT' && event.data.sectionId) {
        await handleSectionClick(event.data.sectionId);
      } else if (event.data.type === 'SECTION_DELETE' && event.data.sectionId) {
        await handleSectionDelete(event.data.sectionId, event.data.index);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [id, showComparison, selectedVersion, originalResumeData, aiEnhancedData]);

  const fetchResume = async () => {
    try {
      const response = await resumeAPI.get(id!)
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

  useEffect(() => {
    fetchResume()
    fetchTemplates()
  }, [id])

  useEffect(() => {
    if (templates.length > 0 && resumeData) {
      loadTemplatePreviews()
    }
  }, [templates, resumeData, selectedTheme, selectedFontFamily, bodyFontSize])

  useEffect(() => {
    if (resume) {
      renderPreview()
    }
  }, [template, resume, selectedTheme, selectedFontFamily, bodyFontSize, showComparison, selectedVersion, originalResumeData, aiEnhancedData])

  const getCurrentFormattedData = () => {
    const currentVersion = resume?.versions?.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]
    const baseData = currentVersion?.data || {}
    
    return {
      ...baseData,
      formatting: {
        primary: selectedTheme?.primary,
        fontFamily: selectedFontFamily,
        bodyFontSize: bodyFontSize,
        theme: selectedTheme
      },
      template: template
    }
  }

  const renderPreview = async (overrideData?: any) => {
    setRendering(true)
    try {
      let formattedResumeData
      if (overrideData) {
        formattedResumeData = {
          ...overrideData,
          formatting: {
            primary: selectedTheme?.primary,
            fontFamily: selectedFontFamily,
            bodyFontSize: bodyFontSize,
            theme: selectedTheme
          },
          template: template
        }
      } else if (showComparison && (originalResumeData || aiEnhancedData)) {
        formattedResumeData = getComparisonFormattedData()
      } else {
        formattedResumeData = getCurrentFormattedData()
      }

      const themeToPass = selectedTheme?.name === 'None' ? null : selectedTheme
      
      const response = await resumeAPI.preview(id!, template, themeToPass, formattedResumeData)
      let htmlContent = response.data

      const scrollbarStyles = `
        <style id="custom-scrollbar-styles">
          * {
            scrollbar-width: thin !important;
            scrollbar-color: ${selectedTheme?.primary || '#04477E'} #f1f5f9 !important;
          }
          *::-webkit-scrollbar {
            width: 8px !important;
          }
          *::-webkit-scrollbar-track {
            background: #f1f5f9 !important;
            border-radius: 4px !important;
          }
          *::-webkit-scrollbar-thumb {
            background: ${selectedTheme?.primary || '#04477E'} !important;
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
        previousPreviewUrlRef.current = previewUrl
      }

      setPreviewUrl(url)
      setError('')
      
      setTimeout(() => {
        if (previousPreviewUrlRef.current && previousPreviewUrlRef.current !== url) {
          URL.revokeObjectURL(previousPreviewUrlRef.current)
          previousPreviewUrlRef.current = ''
        }
      }, 100)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to render preview')
    } finally {
      setRendering(false)
    }
  }

  const loadTemplatePreviews = async () => {
    if (!id || !resumeData) return;
    
    const previews: Record<string, string> = {}
    const themeToUse = selectedTheme?.name === "None" ? null : selectedTheme;
    
    const formattedData = {
      ...resumeData,
      formatting: {
        primary: selectedTheme?.primary,
        fontFamily: selectedFontFamily,
        bodyFontSize: bodyFontSize,
        theme: selectedTheme
      }
    };

    for (const templateOption of templates) {
      try {
        const response = await resumeAPI.preview(id!, templateOption.id, themeToUse, formattedData)
        previews[templateOption.id] = response.data
      } catch (error) {
        console.error(`Failed to load preview for ${templateOption.id}:`, error)
      }
    }
    setTemplatePreviews(previews)
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("guestId");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  const handlePaymentSuccess = async () => {
    try {
      await fetchResume();

      if (paymentType === "download" && pendingExportFormat) {
        await performExport(pendingExportFormat);
        setPendingExportFormat(null);
      } else if (paymentType === "ai") {
        await handleAIEnhance();
      }
    } catch (err) {
      console.error("Post payment error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 w-full overflow-hidden">
      {/* Top Bar with Logo and Logout */}
      <div
        className="bg-[#055597] w-full fixed top-0 left-0 right-0 z-[70]"
        style={{ height: "64px" }}
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
            background: ${selectedTheme?.primary || "#04477E"};
            border-radius: 4px;
          }
          iframe[title="Resume Preview"] {
            scrollbar-width: thin;
            scrollbar-color: ${selectedTheme?.primary || "#04477E"} #f1f5f9;
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
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out forwards;
          }
        `,
        }}
      />

      <header
        className="bg-white w-full fixed top-[64px] left-0 right-0 z-[60] border-b border-gray-200"
        style={{ height: "84px" }}
      >
        <div className="flex items-center justify-between h-full px-3 sm:px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
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

          <div className="flex items-center gap-4 p-2 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2.5 rounded-xl transition-all ${
                  showSettings 
                    ? "bg-[#04477E] text-white shadow-lg shadow-[#04477E]/30" 
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <LayoutTemplateIcon className="w-5 h-5" />
              </button>

              <button
                onClick={handleAIEnhance}
                disabled={enhancing}
                className="relative group flex items-center gap-2 px-3 py-2 bg-[#04477E] text-white rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-[#04477E] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                <div className="relative flex items-center gap-2">
                  {enhancing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span className="text-sm font-semibold">
                    {enhancing ? "Enhancing..." : "AI Enhance"}
                  </span>
                </div>
              </button>

             
            </div>

            <div className="flex flex-col gap-1.5 px-2 border-r border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest pl-1">
                Editor
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSectionClick('personal')}
                  className="group flex items-center gap-2 px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl hover:border-[#04477E] hover:shadow-sm transition-all duration-300"
                >
                  <Pen className="w-3.5 h-3.5 text-[#04477E]" />
                  <span className="text-sm font-semibold">Edit</span>
                </button>
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-1.5 px-2 border-r border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest pl-1">
                Font
              </span>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={selectedFontFamily}
                    onChange={(e) => setSelectedFontFamily(e.target.value)}
                    className="appearance-none h-9 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#04477E]/10"
                    style={{ fontFamily: selectedFontFamily }}
                  >
                    {fontFamilies.map((font) => (
                      <option key={font.name} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-900 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col gap-1.5 px-2">
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest pl-1">
                Font Size
              </span>
              <div className="flex items-center bg-slate-100/50 rounded-lg p-0.5 border border-slate-200">
                <button
                  onClick={() => setBodyFontSize(Math.max(10, bodyFontSize - 1))}
                  className="p-1.5 hover:bg-white rounded-md text-slate-500 transition-all"
                >
                  -
                </button>
                <span className="px-2 text-xs font-bold text-slate-700">
                  {bodyFontSize}px
                </span>
                <button
                  onClick={() => setBodyFontSize(Math.min(24, bodyFontSize + 1))}
                  className="p-1.5 hover:bg-white rounded-md text-slate-500 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            <div className="hidden md:flex flex-col gap-1.5 px-2">
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest pl-1">
                View
              </span>
              <div className="flex items-center gap-2 bg-slate-100/50 rounded-full px-2 py-1 border border-slate-200">
                <button
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                  className="p-1 text-slate-500 hover:text-[#04477E] transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold text-slate-600 min-w-[32px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                  className="p-1 text-slate-500 hover:text-[#04477E] transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="sm:hidden p-2 text-slate-600 hover:text-[#04477E] hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="w-full" style={{ paddingTop: "162px" }}>
        {error && (
          <div className="w-full px-3 sm:px-4 pt-2">
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="w-full min-h-[calc(100vh-112px)] max-w-screen-2xl mx-auto">
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className="flex w-full px-2 sm:px-3">
            {/* Left Sidebar */}
            <div
              className={`
                fixed top-[112px] left-0 h-[calc(100vh-112px)] w-72 max-w-[85vw] z-50
                transform transition-transform duration-300 ease-out
                sm:relative sm:top-0 sm:translate-x-0 sm:h-auto sm:w-64 sm:max-w-none sm:mr-4 sm:z-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
              `}
            >
              <div className="bg-white rounded-2xl h-full sm:h-auto overflow-hidden backdrop-blur-sm">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-br from-slate-50 via-white to-white">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-xl tracking-wide">
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
                  <div className="space-y-1">
                    {sections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => handleSectionClick(section.id)}
                        className="w-full px-3 py-2.5 flex items-center gap-3 rounded-lg transition-all duration-150 group text-left"
                      >
                        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#055597] text-white text-md font-semibold p-3">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-900 font-semibold">
                          {section.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-4 px-1">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <Download className="w-4 h-4 text-[#04477E]" />
                      </div>
                      <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                        Export Options
                      </h4>
                    </div>

                    <div className="space-y-2.5">
                      {/* Regular PDF Download - hides during comparison */}
                      {!showComparison && (
                        <button
                          onClick={() => handleRegularExport("pdf")}
                          className="w-full px-4 py-3 bg-gradient-to-r from-[#04477E] to-[#0660a9] text-white rounded-xl hover:shadow-lg hover:shadow-blue-200/50 transition-all flex items-center justify-between gap-2 text-sm font-medium group disabled:opacity-70 disabled:cursor-not-allowed"
                          disabled={exporting === "pdf"}
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span>Download PDF</span>
                          </span>
                          {exporting === "pdf" ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <span className="text-xs opacity-70 group-hover:opacity-100">↓</span>
                          )}
                        </button>
                      )}

                      {/* Regular Word Download - hides during comparison */}
                      {!showComparison && (
                        <button
                          onClick={() => handleRegularExport("docx")}
                          className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-[#04477E] hover:shadow-md transition-all flex items-center justify-between gap-2 text-sm font-medium group disabled:opacity-70 disabled:cursor-not-allowed"
                          disabled={exporting === "docx"}
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Download Word</span>
                          </span>
                          {exporting === "docx" ? (
                            <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <span className="text-xs text-gray-400 group-hover:text-[#04477E]">↓</span>
                          )}
                        </button>
                      )}

                      {/* Enhanced Export Options - Only shown during comparison */}
                      {showComparison && (
                        <>
                          <div className="pt-2">
                            <p className="text-xs text-gray-500 mb-2">Export {selectedVersion === 'original' ? 'Original' : 'AI Enhanced'} Version:</p>
                          </div>
                          <button
                            onClick={() => handleEnhancedExport("pdf", selectedVersion)}
                            disabled={exporting === "pdf"}
                            className="w-full px-4 py-3 bg-[#04477E] text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-between gap-2 text-sm font-medium group disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <span>Download {selectedVersion === 'original' ? 'Original' : 'AI Enhanced'} PDF</span>
                            </span>
                            {exporting === "pdf" ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <span className="text-xs opacity-70 group-hover:opacity-100">↓</span>
                            )}
                          </button>

                          <button
                            onClick={() => handleEnhancedExport("docx", selectedVersion)}
                            disabled={exporting === "docx"}
                            className="w-full px-4 py-3 bg-white border-2 border-[#04477E] text-[#04477E] rounded-xl hover:shadow-lg transition-all flex items-center justify-between gap-2 text-sm font-medium group disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Download {selectedVersion === 'original' ? 'Original' : 'AI Enhanced'} Word</span>
                            </span>
                            {exporting === "docx" ? (
                              <div className="w-4 h-4 border-2 border-[#04477E] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <span className="text-xs text-[#04477E] group-hover:text-[#04477E]/80">↓</span>
                            )}
                          </button>
                        </>
                      )}

                      {(resume?.isDownloadPaid || resume?.isAiPaid) && (
                        <button
                          onClick={handleDownloadInvoice}
                          className="w-full px-4 py-3 bg-white border border-[#04477E] text-[#04477E] rounded-xl hover:bg-[#04477E]/5 hover:shadow-md transition-all flex items-center justify-between gap-2 text-sm font-medium group disabled:opacity-70 disabled:cursor-not-allowed"
                          disabled={downloadingInvoice}
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>Download Invoice</span>
                          </span>
                          {downloadingInvoice ? (
                            <div className="w-4 h-4 border-2 border-[#04477E] border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <span className="text-xs opacity-70 group-hover:opacity-100">↓</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 sm:hidden">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2.5 text-sm font-medium group"
                    >
                      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="flex-1 min-w-0 relative">
              {/* AI Enhancement Loading Overlay */}
              {enhancing && !enhancementSuccess && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fadeIn">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 border-4 border-purple-100 rounded-full" />
                      <div className="absolute inset-0 border-4 border-t-[#04477E] border-r-[#04477E] border-b-[#04477E] border-l-transparent rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-[#04477E] animate-pulse" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      AI is Enhancing Your Resume
                    </h2>

                    <div className="space-y-4">
                      {AI_ENHANCEMENT_STEPS.map((step, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 transition-all duration-500 ${
                            idx === enhancementStep
                              ? "text-[#04477E] scale-105 font-medium"
                              : idx < enhancementStep
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              idx < enhancementStep
                                ? "bg-green-100 text-green-600"
                                : idx === enhancementStep
                                ? "bg-[#04477E] text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {idx < enhancementStep ? <Check size={18} /> : step.icon}
                          </div>
                          <span className="text-sm text-left">{step.text}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-6">
                      This may take 10-15 seconds
                    </p>
                  </div>
                </div>
              )}

              {/* Success Animation Overlay */}
              {enhancementSuccess && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scaleIn">
                    <div className="w-20 h-20 mx-auto mb-4">
                      <img src="/like.gif" alt="Success" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Resume Enhanced!
                    </h2>
                    <p className="text-gray-500">
                      Your resume has been professionally optimized
                    </p>
                  </div>
                </div>
              )}

              {/* Loading overlay for rendering/exporting */}
              {(rendering || exporting) && !enhancing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                      <div className="w-12 h-12 border-4 border-[#04477E] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="text-gray-600 mt-4 text-sm">
                      {exporting
                        ? `Exporting as ${exporting.toUpperCase()}...`
                        : "Updating preview..."}
                    </p>
                  </div>
                </div>
              )}

              {/* Iframe */}
              {previewUrl && (
                <div className="flex justify-center p-2 sm:p-3">
                  <div
                    className="bg-white shadow-lg transition-all duration-300"
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
                      className="w-full h-full border-[1px] border-gray-200 bg-white"
                      title="Resume Preview"
                      sandbox="allow-same-origin allow-scripts"
                      onLoad={() => {
                        if (mainPreviewIframeRef.current) {
                          injectSectionDetectionScript(mainPreviewIframeRef.current);
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Loading state */}
              {!previewUrl && loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                      <div className="w-12 h-12 border-4 border-[#04477E] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="text-gray-600 mt-4 text-sm">Loading preview...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div
              className={`
                fixed top-[112px] right-0 h-[calc(100vh-112px)] w-80 max-w-[90vw] z-50
                transform transition-transform duration-300 ease-out
                sm:relative sm:top-0 sm:translate-x-0 sm:h-auto sm:w-80 sm:max-w-none sm:ml-3 sm:z-0
                ${showTemplates || showSettings ? "translate-x-0" : "translate-x-full sm:translate-x-0"}
              `}
            >
              <div className="rounded-xl h-full sm:h-auto">
                <div className="p-4">
                  {showSettings && showTemplates && (
                    <div>
                      <div className="mb-6">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Color Themes
                        </label>
                        <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                          {filteredPalettes.map((palette) => (
                            <button
                              key={palette.name}
                              onClick={() => setSelectedTheme(palette)}
                              className={`relative aspect-square rounded-full border-2 transition-all h-8 ${
                                selectedTheme?.primary === palette.primary
                                  ? "border-[#04477E] ring-2 ring-[#04477E]/20 scale-105"
                                  : "border-transparent hover:border-gray-300"
                              }`}
                              style={{ backgroundColor: palette.primary }}
                              title={palette.name}
                            >
                              {selectedTheme?.primary === palette.primary && (
                                <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

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
                          <div className={templateView === "grid" ? "grid grid-cols-2 gap-3" : "space-y-2"}>
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
                                    console.error("Failed to update template:", error);
                                    toast.error("Failed to update template. Please try again.");
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
                                            srcDoc={templatePreviews[templateOption.id]}
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

                      <button
                        onClick={() => {
                          setSelectedTheme(colorPalettes[1]);
                          setSelectedFontFamily("Arial, sans-serif");
                          setBodyFontSize(14);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-xs font-medium flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset to Defaults
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Comparison Bar - Only Toggle */}
      {showComparison && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#d8a23b] rounded-xl shadow-2xl border border-purple-200 p-4 flex items-center gap-6 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${selectedVersion === "original" ? "text-white" : "text-white"}`}>
              Original
            </span>
            <button
              onClick={() => setSelectedVersion((prev) => prev === "original" ? "enhanced" : "original")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#04477E] focus:ring-offset-2 ${
                selectedVersion === "enhanced" ? "bg-[#04477E]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  selectedVersion === "enhanced" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${selectedVersion === "enhanced" ? "text-white" : "text-white"}`}>
              AI Enhanced
            </span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex gap-2">
            <span className="text-xs text-white">
              Use the export buttons below to download your chosen version
            </span>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <Check className="w-4 h-4" />
          <span className="text-sm">Export completed successfully!</span>
        </div>
      )}

      {/* Filename Modal */}
      {showFilenameModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-[#04477E]/10 rounded-xl">
                <Download className="w-5 h-5 text-[#04477E]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base">Name your file</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Downloading as <span className="font-medium text-[#04477E]">.{pendingFilenameFormat?.toUpperCase()}</span>
                </p>
              </div>
            </div>

            <div className="relative mb-5">
              <input
                ref={filenameInputRef}
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFilenameConfirm();
                  if (e.key === "Escape") setShowFilenameModal(false);
                }}
                placeholder="Enter filename..."
                className="w-full px-4 py-3 pr-16 border-2 border-gray-200 rounded-xl text-sm text-gray-900 
                  focus:outline-none focus:border-[#04477E] focus:ring-4 focus:ring-[#04477E]/10
                  transition-all placeholder:text-gray-400"
                maxLength={100}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#04477E]/10 text-[#04477E] text-xs font-semibold px-2 py-1 rounded-lg pointer-events-none">
                .{pendingFilenameFormat}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-5 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-500 truncate">
                <span className="font-medium text-gray-700">{customFilename.trim() || "resume"}</span>
                <span className="text-gray-400">.{pendingFilenameFormat}</span>
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFilenameModal(false);
                  setPendingFilenameFormat(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFilenameConfirm}
                disabled={!customFilename.trim()}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#04477E] to-[#0660a9] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-200/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      

      <PricingPopup isOpen={showPricingPopup} onClose={() => setShowPricingPopup(false)} resumeId={id} />

      <PaymentModal
        open={paymentOpen}
        onClose={() => {
          setPaymentOpen(false);
          setPendingExportFormat(null);
        }}
        resumeId={id}
        type={paymentType}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}