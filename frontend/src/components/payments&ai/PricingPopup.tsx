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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn relative">
        
        {/* Close Button inside popup */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Content */}
        <div className="pricing-section p-8 overflow-y-auto">
          {/* Header */}
          <div className="header text-center mb-6">
            <div className="eyebrow inline-block bg-sky-100 text-sky-800 font-extrabold px-5 py-2 rounded-full text-sm mb-3">
              ResumeYatra Pricing Snapshot
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">
              Compare Plans in One Glance
            </h2>
            <p className="subtitle text-slate-500 text-lg">
              Choose the right plan for creating, saving and optimizing resumes.
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-gray-500 font-medium">Loading pricing plans...</p>
            </div>
          ) : (
            <>
              {/* Pricing Table with reduced height */}
              <div className="table-wrap overflow-x-auto rounded-2xl border border-slate-200 shadow-lg bg-white">
                <table className="w-full min-w-[920px] border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-[#0b1f3a] text-white p-4 text-left text-sm uppercase tracking-wide font-bold">
                        Feature / Benefit
                      </th>
                      <th className="bg-[#0b1f3a] text-white p-4 text-center text-sm uppercase tracking-wide font-bold">
                        <span className="block text-lg font-black">Guest</span>
                        <span className="block text-xs font-medium text-slate-300 mt-1">Trial users</span>
                      </th>
                      <th className="bg-[#0b1f3a] text-white p-4 text-center text-sm uppercase tracking-wide font-bold">
                        <span className="block text-lg font-black">Candidate Membership</span>
                        <span className="block text-xs font-medium text-slate-300 mt-1">Active job seekers</span>
                      </th>
                      <th className="bg-[#0b1f3a] text-white p-4 text-center text-sm uppercase tracking-wide font-bold">
                        <span className="block text-lg font-black">Freelancer Membership</span>
                        <span className="block text-xs font-medium text-slate-300 mt-1">Resume pros & freelancers</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Membership Price */}
                    <tr>
                      <td className="p-4 text-left font-black text-slate-800 bg-slate-50 border-t border-slate-200">
                        Membership Price
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-white">
                        <span className="text-slate-400 font-semibold">No Signup Required</span>
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-emerald-50/30">
                        <span className="price text-3xl font-black text-slate-800">{formatPrice(pricing?.candidatePrice)}</span>
                        <br />
                        <span className="text-xs text-slate-400 font-medium">/ {candidateDuration * 30} days</span>
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-amber-50/30">
                        <span className="price text-3xl font-black text-slate-800">{formatPrice(pricing?.freelancerPrice)}</span>
                        <br />
                        <span className="text-xs text-slate-400 font-medium">/ {freelancerDuration * 30} days</span>
                      </td>
                    </tr>

                    {/* Single Resume Download */}
                    <tr>
                      <td className="p-4 text-left font-black text-slate-800 bg-slate-50 border-t border-slate-200">
                        Single Resume Download
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-white font-bold text-slate-800">
                        ₹{guestDownloadPrice}
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-emerald-50/30 font-bold text-slate-800">
                        ₹{guestDownloadPrice}
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-amber-50/30 font-bold ttext-slate-800">
                        ₹{guestDownloadPrice}
                      </td>
                    </tr>

                    {/* AI Optimization Price */}
                    <tr>
                      <td className="p-4 text-left font-black text-slate-800 bg-slate-50 border-t border-slate-200">
                        AI Optimization Price
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-white font-bold text-orange-600">
                        ₹{guestAiPrice}
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-emerald-50/30">
                        <span className="font-bold text-emerald-700 text-lg">₹{candidateDiscountedAi.toFixed(2)}</span>
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-amber-50/30">
                        <span className="font-bold text-emerald-700 text-lg">₹{freelancerDiscountedAi.toFixed(2)}</span>
                      </td>
                    </tr>

                    {/* Savings on AI Optimization */}
                    <tr>
                      <td className="p-4 text-left font-black text-slate-800 bg-slate-50 border-t border-slate-200">
                        Savings on AI Optimization
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-white">
                        <span className="text-slate-300 font-bold">—</span>
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-emerald-50/30">
                        <span className="inline-block bg-green-100 text-green-700 font-black px-3 py-1 rounded-full text-xs">
                          {candidateDiscount}% OFF
                        </span>
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-amber-50/30">
                        <span className="inline-block bg-amber-100 text-amber-700 font-black px-3 py-1 rounded-full text-xs">
                          {freelancerDiscount}% OFF
                        </span>
                      </td>
                    </tr>

                    {/* Dashboard */}
                    <tr>
                      <td className="p-4 text-left font-black text-slate-800 bg-slate-50 border-t border-slate-200">
                        Dashboard
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-white">
                        <span className="text-slate-300 font-black">✕ Not included</span>
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-emerald-50/30">
                        <span className="text-emerald-600 font-black">✓ Personal Dashboard</span>
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-amber-50/30">
                        <span className="text-emerald-600 font-black">✓ Professional Dashboard</span>
                      </td>
                    </tr>

                    {/* Resume Saving Limit */}
                    <tr>
                      <td className="p-4 text-left font-black text-slate-800 bg-slate-50 border-t border-slate-200">
                        Resume Saving Limit
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-white">
                        <span className="text-slate-300 font-black">✕ No</span>
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-emerald-50/30">
                        Save up to {candidateResumeLimit} resumes
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-amber-50/30">
                        Save up to {freelancerResumeLimit} resumes
                      </td>
                    </tr>

                    {/* CTA Buttons */}
                    <tr className="cta-row">
                      <td className="p-4 text-left font-black text-slate-800 bg-slate-50 border-t border-slate-200">
                        Action
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-white">
                        <button
                          onClick={onClose}
                          className="bg-slate-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all"
                        >
                          Continue as Guest
                        </button>
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-emerald-50/30">
                        <button
                          onClick={() => handleSignup("candidate")}
                          className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-md"
                        >
                          Get Candidate Plan →
                        </button>
                      </td>
                      <td className="p-4 text-center border-t border-slate-200 bg-amber-50/30">
                        <button
                          onClick={() => handleSignup("freelancer")}
                          className="bg-amber-500 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-amber-600 transition-all shadow-md"
                        >
                          Get Freelancer Plan →
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer Note */}
              <p className="note text-center text-slate-400 text-sm mt-5">
                Membership Plan renews every {candidateDuration * 30} days, Cancel anytime.
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