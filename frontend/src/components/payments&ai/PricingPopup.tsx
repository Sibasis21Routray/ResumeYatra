import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Crown, Download, Sparkles, ArrowRight, CheckCircle2, FastForward, Zap, Loader2, IndianRupee } from 'lucide-react'
import { pricingAPI } from '../../services/apiClient'

interface PricingPopupProps {
  isOpen: boolean
  onClose: () => void
  resumeId?: string
}

const PricingPopup: React.FC<PricingPopupProps> = ({ isOpen, onClose, resumeId }) => {
  const navigate = useNavigate()
  const [pricing, setPricing] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) fetchPricing()
  }, [isOpen])

  const fetchPricing = async () => {
    try {
      setLoading(true)
      const response = await pricingAPI.get()
      const data = response.data?.data || response.data
      setPricing(data)
    } catch (err) {
      // Fallback default pricing if API fails
      setPricing({
        guestDownload: 900, // ₹9
        guestAi: 4900,      // ₹49
        candidatePrice: 2900,   // ₹29
        candidateDurationMonths: 3,
        candidateResumeLimit: 5,
        candidateAiDiscount: 25,
        freelancerPrice: 9900,   // ₹99
        freelancerDurationMonths: 3,
        freelancerResumeLimit: 100,
        freelancerAiDiscount: 50
      })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (paisa?: number) => {
    if (!paisa && paisa !== 0) return "₹0"
    const rupees = (paisa / 100).toFixed(0)
    return `₹${rupees}`
  }

  const formatPriceDecimal = (paisa?: number) => {
    if (!paisa && paisa !== 0) return "0"
    return (paisa / 100).toFixed(2)
  }

  const handleSignup = (plan: string) => {
    onClose()
    const redirectUrl = `/register?plan=${plan}${resumeId ? `&resumeId=${resumeId}` : ''}`
    navigate(redirectUrl)
  }

  if (!isOpen) return null

  const guestDownloadPrice = pricing ? pricing.guestDownload / 100 : 9
  const guestAiPrice = pricing ? pricing.guestAi / 100 : 49
  const candidatePrice = pricing ? pricing.candidatePrice / 100 : 29
  const freelancerPrice = pricing ? pricing.freelancerPrice / 100 : 99
  const candidateDiscountedAi = pricing ? (pricing.guestAi * (1 - (pricing.candidateAiDiscount || 25) / 100)) / 100 : 36.75
  const freelancerDiscountedAi = pricing ? (pricing.guestAi * (1 - (pricing.freelancerAiDiscount || 50) / 100)) / 100 : 24.5
  const candidateDuration = pricing?.candidateDurationMonths || 3
  const freelancerDuration = pricing?.freelancerDurationMonths || 3
  const candidateResumeLimit = pricing?.candidateResumeLimit || 5
  const freelancerResumeLimit = pricing?.freelancerResumeLimit || 100
  const candidateDiscount = pricing?.candidateAiDiscount || 25
  const freelancerDiscount = pricing?.freelancerAiDiscount || 50

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col animate-scaleIn relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 z-10 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Content */}
        <div className="pricing-section p-4 overflow-y-auto">
          {/* Header */}
          <div className="header text-center mb-4">
            <div className="eyebrow inline-block bg-blue-50 text-[#055597] font-extrabold px-4 py-1.5 rounded-full text-xs mb-2">
              ResumeYatra Pricing Snapshot
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-800 mb-1">
              Compare Plans in One Glance
            </h2>
            <p className="subtitle text-slate-500 text-sm">
              Choose the right plan for creating, saving and optimizing resumes.
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-[#055597] animate-spin" />
              <p className="text-gray-500 font-medium text-sm">Loading pricing plans...</p>
            </div>
          ) : (
            <>
              {/* Pricing Table - More Compact */}
              <div className="table-wrap overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full min-w-[800px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="bg-[#055597] text-white p-3 text-left text-xs uppercase tracking-wide font-bold rounded-tl-xl">
                        Feature / Benefit
                      </th>
                      <th className="bg-[#055597] text-white p-3 text-center text-xs uppercase tracking-wide font-bold">
                        <span className="block text-base font-black">Guest</span>
                        <span className="block text-[11px] font-medium text-blue-100 mt-0.5">Trial users</span>
                      </th>
                      <th className="bg-[#055597] text-white p-3 text-center text-xs uppercase tracking-wide font-bold">
                        <span className="block text-base font-black">Candidate</span>
                        <span className="block text-[11px] font-medium text-blue-100 mt-0.5">Job seekers</span>
                      </th>
                      <th className="bg-[#055597] text-white p-3 text-center text-xs uppercase tracking-wide font-bold rounded-tr-xl">
                        <span className="block text-base font-black">Freelancer</span>
                        <span className="block text-[11px] font-medium text-blue-100 mt-0.5">Resume pros</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Membership Price */}
                    <tr>
                      <td className="p-3 text-left font-bold text-slate-700 bg-slate-50 border-t border-slate-200 text-xs">
                        Membership Price
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-white">
                        <span className="text-slate-500 font-semibold text-xs">No Signup</span>
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-blue-50/30">
                        <span className="price text-2xl font-black text-slate-800">{formatPrice(pricing?.candidatePrice)}</span>
                        <br />
                        <span className="text-[11px] text-slate-500 font-medium">/ {candidateDuration * 30} days</span>
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-amber-50/30">
                        <span className="price text-2xl font-black text-slate-800">{formatPrice(pricing?.freelancerPrice)}</span>
                        <br />
                        <span className="text-[11px] text-slate-500 font-medium">/ {freelancerDuration * 30} days</span>
                      </td>
                    </tr>

                    {/* Single Resume Download */}
                    <tr>
                      <td className="p-3 text-left font-bold text-slate-700 bg-slate-50 border-t border-slate-200 text-xs">
                        Single Resume Download
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-white font-bold text-slate-700 text-sm">
                        ₹{guestDownloadPrice}
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-blue-50/30 font-bold text-slate-700 text-sm">
                        ₹{guestDownloadPrice}
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-amber-50/30 font-bold text-slate-700 text-sm">
                        ₹{guestDownloadPrice}
                      </td>
                    </tr>

                    {/* AI Optimization Price */}
                    <tr>
                      <td className="p-3 text-left font-bold text-slate-700 bg-slate-50 border-t border-slate-200 text-xs">
                        AI Optimization Price
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-white font-bold text-[#d29e3f] text-sm">
                        ₹{guestAiPrice}
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-blue-50/30">
                        <span className="font-bold text-emerald-700 text-base">₹{candidateDiscountedAi.toFixed(2)}</span>
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-amber-50/30">
                        <span className="font-bold text-emerald-700 text-base">₹{freelancerDiscountedAi.toFixed(2)}</span>
                      </td>
                    </tr>

                    {/* Savings on AI Optimization */}
                    <tr>
                      <td className="p-3 text-left font-bold text-slate-700 bg-slate-50 border-t border-slate-200 text-xs">
                        Savings on AI
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-white">
                        <span className="text-slate-500 font-bold text-xs">—</span>
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-blue-50/30">
                        <span className="inline-block bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full text-[11px]">
                          {candidateDiscount}% OFF
                        </span>
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-amber-50/30">
                        <span className="inline-block bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full text-[11px]">
                          {freelancerDiscount}% OFF
                        </span>
                      </td>
                    </tr>

                    {/* Dashboard */}
                    <tr>
                      <td className="p-3 text-left font-bold text-slate-700 bg-slate-50 border-t border-slate-200 text-xs">
                        Dashboard Access
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-white">
                        <span className="text-slate-500 font-bold text-xs">✕ Not included</span>
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-blue-50/30">
                        <span className="text-emerald-600 font-bold text-xs">✓ Personal Dashboard</span>
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-amber-50/30">
                        <span className="text-emerald-600 font-bold text-xs">✓ Professional Dashboard</span>
                      </td>
                    </tr>

                    {/* Resume Saving Limit */}
                    <tr>
                      <td className="p-3 text-left font-bold text-slate-700 bg-slate-50 border-t border-slate-200 text-xs">
                        Resume Saving Limit
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-white">
                        <span className="text-slate-500 font-bold text-xs">✕ No</span>
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-blue-50/30">
                        <span className="text-xs">Save up to {candidateResumeLimit} resumes</span>
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-amber-50/30">
                        <span className="text-xs">Save up to {freelancerResumeLimit} resumes</span>
                      </td>
                    </tr>

                    {/* CTA Buttons */}
                    <tr className="cta-row">
                      <td className="p-3 text-left font-bold text-slate-700 bg-slate-50 border-t border-slate-200 text-xs">
                        Action
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-white">
                        <button
                          onClick={onClose}
                          className="bg-slate-500 text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-slate-600 transition-all"
                        >
                          Continue as Guest
                        </button>
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-blue-50/30">
                        <button
                          onClick={() => handleSignup("candidate")}
                          className="bg-[#055597] text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-[#04447a] transition-all shadow-sm"
                        >
                          Get Candidate Plan →
                        </button>
                      </td>
                      <td className="p-3 text-center border-t border-slate-200 bg-amber-50/30">
                        <button
                          onClick={() => handleSignup("freelancer")}
                          className="bg-[#d29e3f] text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-[#c18c2e] transition-all shadow-sm"
                        >
                          Get Freelancer Plan →
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer Note */}
              <p className="note text-center text-slate-500 text-[11px] mt-4">
                Membership Plan renews every {candidateDuration * 30} days. Cancel anytime.
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

export default PricingPopup