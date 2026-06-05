import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/home/Navbar'
import Hero from '../components/home/Hero'
import Benefits from '../components/home/Benefits'
import Strap from '../components/home/Strap'
import { useTemplateStore } from '../stores/templateStore'
import { Loader2, FileText, ArrowRight, Shield, Users, Award, Sparkles, Download, Crown, CheckCircle2, FastForward } from 'lucide-react'
import { CheckCircleIcon } from 'lucide-react';
import { pricingAPI } from '../services/apiClient'
import toast from 'react-hot-toast'

interface PricingData {
  baseAccess: {
    subscriptionFee: number;
    downloadCost: number;
    aiCost: number;
  };
  guest: {
    downloadCost: number;
    aiCost: number;
  };
}

export function HomePage() {
  const navigate = useNavigate()
  const { templates, fetchTemplates, loading } = useTemplateStore()
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [previewLoading, setPreviewLoading] = useState<Record<string, boolean>>({})
  const [scales, setScales] = useState<Record<string, number>>({})
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [pricing, setPricing] = useState<PricingData | null>(null)
  const [pricingLoading, setPricingLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!user)
  }, [])

  // Fetch pricing data
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setPricingLoading(true)
        const response = await pricingAPI.get()
        // console.log('Pricing response:', response.data)
        
        // Handle different response structures
        let pricingData = response.data
        
        // If response has data property, extract it
        if (response.data?.data) {
          pricingData = response.data.data
        }
        
        // Ensure the data has the expected structure
       // Transform backend format → frontend format
if (pricingData?.subscription !== undefined) {
  const transformed = {
    baseAccess: {
      subscriptionFee: pricingData.subscription,
      downloadCost: pricingData.userDownload,
      aiCost: pricingData.userAi
    },
    guest: {
      downloadCost: pricingData.guestDownload,
      aiCost: pricingData.guestAi
    }
  };

  setPricing(transformed);
} 
// Already correct format
else if (pricingData?.baseAccess && pricingData?.guest) {
  setPricing(pricingData);
} 
// Fallback
else {
  setPricing({
    baseAccess: {
      subscriptionFee: 9900,
      downloadCost: 900,
      aiCost: 1900
    },
    guest: {
      downloadCost: 2000,
      aiCost: 4900
    }
  });
}
      } catch (err) {
        console.error('Failed to fetch pricing:', err)
        // Fallback pricing data
        setPricing({
          baseAccess: {
            subscriptionFee: 9900,
            downloadCost: 900,
            aiCost: 1900
          },
          guest: {
            downloadCost: 100,
            aiCost: 4900
          }
        })
      } finally {
        setPricingLoading(false)
      }
    }

    fetchPricing()
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  // Fetch previews for templates
  useEffect(() => {
    if (templates.length === 0) return

    let cancelled = false

    async function fetchPreviews() {
      for (const t of templates.slice(0, 4)) {
        if (previews[t.id]) continue

        try {
          setPreviewLoading(prev => ({ ...prev, [t.id]: true }))
          const response = await fetch(`${import.meta.env.VITE_API_URL}/templates/preview/${t.id}`, {
            method: 'GET'
          })

          if (response.ok) {
            const data = await response.json()
            const htmlResponse = await fetch(data.url)
            const rawHtml = await htmlResponse.text()

            // Clean the HTML for preview with responsive sizing
            const cleanHtml = rawHtml + `
              <style>
                html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  background-color: #ffffff !important;
                  width: 100% !important;
                  height: 100% !important;
                  overflow: hidden !important;
                }
                .page, .resume-container, .A4 {
                  margin: 0 !important;
                  box-shadow: none !important;
                  width: 100% !important;
                  height: 100% !important;
                  max-width: 100% !important;
                  max-height: 100% !important;
                }
              </style>
            `

            if (cancelled) return
            setPreviews(prev => ({ ...prev, [t.id]: cleanHtml }))
          }
        } catch (err) {
          console.warn(`Template preview failed for ${t.id}:`, err)
        } finally {
          if (!cancelled) {
            setPreviewLoading(prev => ({ ...prev, [t.id]: false }))
          }
        }
      }
    }

    fetchPreviews()
    return () => { cancelled = true }
  }, [templates])

  // Calculate scale for each template preview based on container size
  const calculateScale = (templateId: string) => {
    const container = containerRefs.current[templateId]
    if (!container) return 0.22
    
    // A4 width in pixels at 96 DPI: 794px
    // Use container width to calculate scale (similar to TemplatesPage)
    return container.offsetWidth / 794
  }

  // Update scales when window resizes
  useEffect(() => {
    const updateScales = () => {
      const newScales: Record<string, number> = {}
      templates.slice(0, 4).forEach(t => {
        newScales[t.id] = calculateScale(t.id)
      })
      setScales(newScales)
    }

    updateScales()
    window.addEventListener('resize', updateScales)
    return () => window.removeEventListener('resize', updateScales)
  }, [templates])

  // Initial scale calculation after render
  useEffect(() => {
    if (templates.length > 0 && Object.keys(previews).length > 0) {
      const timeoutId = setTimeout(() => {
        const newScales: Record<string, number> = {}
        templates.slice(0, 4).forEach(t => {
          newScales[t.id] = calculateScale(t.id)
        })
        setScales(newScales)
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [previews, templates])




  // Format price from paisa to rupees
  const formatPrice = (priceInPaisa?: number) => {
    if (!priceInPaisa && priceInPaisa !== 0) return '₹0'
    const rupees = priceInPaisa / 100
    return `₹${rupees.toFixed(2)}`
  }

  // Get first 4 templates for preview
  const previewTemplates = templates.slice(0, 4)

  // Show loading spinner while pricing is loading
  if (pricingLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#020617]">
        <Navbar />
        <Hero />
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full" />
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#04477E] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  // Don't render pricing section if pricing data is still loading or not available
  const showPricing = pricing && !pricingLoading

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />
      <Hero />
   
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <section className="">
          <Benefits />
        </section> */}

        
        
        
      </main>
    </div>
  );
}