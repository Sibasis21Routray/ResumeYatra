import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { paymentAPI, pricingAPI } from "../../services/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Download, Sparkles, Check, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  resumeId?: string;
  type: "download" | "ai";
  onSuccess: (finalType: "download" | "ai") => void;
}

export default function PaymentModal({
  open,
  onClose,
  resumeId,
  type,
  onSuccess,
}: PaymentModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"guest" | "candidate" | "freelancer">("guest");
  const [downloadType, setDownloadType] = useState<"no_ai" | "ai">("no_ai");
  const [pricing, setPricing] = useState<any>(null);

  useEffect(() => {
    if (open) {
      setPaymentSuccess(false);
      setLoading(false);
      // Sync initial type prop to current selection state
      setDownloadType(type === "ai" ? "ai" : "no_ai");

      if (!pricing) {
        pricingAPI
          .get()
          .then((res) => {
            const data = res.data?.data || res.data;
            setPricing(data);
          })
          .catch((err) => console.error("Failed to load pricing:", err));
      }
    }
  }, [open, type, pricing]);

  if (!open) return null;

  const isUser = !!localStorage.getItem("token");

  // Helper functions to format prices with 2 decimals
  const formatPrice = (rupees: number) => {
    return rupees.toFixed(2);
  };

  // Dynamic values from backend
  const getPlanPrice = (plan: string) => {
    if (!pricing) return plan === "guest" ? 0 : plan === "candidate" ? 29 : 99;
    if (plan === "guest") return 0;
    if (plan === "candidate") return pricing.candidatePrice / 100;
    return pricing.freelancerPrice / 100;
  };

  const getDownloadPrice = (dlType: string) => {
    if (!pricing) return dlType === "no_ai" ? 9 : 49;
    if (dlType === "no_ai") return pricing.guestDownload / 100;
    return pricing.guestAi / 100;
  };

  const getPlanDuration = (plan: string) => {
    if (!pricing) return 3;
    if (plan === "candidate") return pricing.candidateDurationMonths || 3;
    if (plan === "freelancer") return pricing.freelancerDurationMonths || 3;
    return 0;
  };

  const getResumeLimit = (plan: string) => {
    if (!pricing) return plan === "candidate" ? 5 : 100;
    if (plan === "candidate") return pricing.candidateResumeLimit || 5;
    if (plan === "freelancer") return pricing.freelancerResumeLimit || 100;
    return 0;
  };

  const getAIDiscount = (plan: string) => {
    if (!pricing) return plan === "candidate" ? 25 : 50;
    if (plan === "candidate") return pricing.candidateAiDiscount || 25;
    if (plan === "freelancer") return pricing.freelancerAiDiscount || 50;
    return 0;
  };

  const getUserDiscount = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.subscriptionPlan === "freelancer") {
        return pricing?.freelancerAiDiscount || 50;
      } else if (user.subscriptionPlan === "candidate") {
        return pricing?.candidateAiDiscount || 25;
      }
    } catch (e) {
      return 0;
    }
    return 0;
  };

  const getDiscountedAIPrice = () => {
    if (downloadType !== "ai") return getDownloadPrice("ai");
    let discount = 0;
    if (isUser) {
      discount = getUserDiscount();
    } else {
      discount = getAIDiscount(selectedPlan);
    }
    const originalPrice = getDownloadPrice("ai");
    return originalPrice * (1 - discount / 100);
  };

  const calculateTotal = () => {
    let planCost = 0;
    let downloadCost = getDownloadPrice(downloadType);
    
    if (isUser) {
      // For logged-in users, no plan cost, but apply their subscription discount
      if (downloadType === "ai") {
        const discount = getUserDiscount();
        downloadCost = downloadCost * (1 - discount / 100);
      }
    } else {
      planCost = getPlanPrice(selectedPlan);
      // Apply membership discount logic to AI choice if applicable
      if (downloadType === "ai" && selectedPlan !== "guest") {
        const discount = getAIDiscount(selectedPlan);
        downloadCost = downloadCost * (1 - discount / 100);
      }
    }
    
    return planCost + downloadCost;
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!resumeId) {
      toast.error("Resume ID not found");
      return;
    }

    // For non-logged-in users who selected a paid plan, redirect to signup
    if (!isUser && selectedPlan !== "guest") {
      onClose();
      const redirectUrl = `/register?plan=${selectedPlan}&resumeId=${resumeId}&individualType=${downloadType === "ai" ? "ai" : "download"}&redirect=payment`;
      navigate(redirectUrl);
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Failed to load payment gateway");
        setLoading(false);
        return;
      }

      const { data: order } = await paymentAPI.createOrder(downloadType === "ai" ? "ai" : "download");
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        toast.error("Razorpay key missing");
        setLoading(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "ResumeYatra Pro",
        description: downloadType === "ai" ? "Deep AI Enhancement" : "Unlock Premium Export",
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await paymentAPI.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              resumeId,
              type: downloadType === "ai" ? "ai" : "download",
            });

            setPaymentSuccess(true);
            toast.success("Payment successful");

            setTimeout(() => {
              onSuccess(downloadType === "ai" ? "ai" : "download");
              onClose();
            }, 1800);
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Payment verification failed.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        theme: {
          color: "#01467d",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Try again.");
      setLoading(false);
    }
  };

  const getPlanLabel = () => {
    if (isUser) return "Member";
    if (selectedPlan === "guest") return "Guest";
    return selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);
  };

  const getDownloadLabel = () => {
    return downloadType === "ai" ? "AI Optimized" : "No AI";
  };

  const getFeatures = () => {
    if (downloadType === "no_ai") {
      return [
        "PDF format with perfect ATS layout",
        "Word document for easy fine-tuning",
        "High-quality print ready format",
        "Instant download after secure checkout",
      ];
    } else {
      return [
        "Professional high-impact suggestions",
        "Grammar, tone and phrasing improvements",
        "Keyword injection for ATS bypass",
        "Deep clarity and flow adjustments",
        "Data-driven measurable impact metrics",
        "1 free download Docx/Pdf credit",
      ];
    }
  };

  const getTitle = () => {
    if (downloadType === "no_ai") {
      return "Unlock Premium Export";
    } else {
      return "Deep AI Enhancement";
    }
  };

  const getDescription = () => {
    if (downloadType === "no_ai") {
      return "Get your professionally crafted resume in industry-standard formats.";
    } else {
      return "Upgrade your resume sentences with data-driven, ATS-tested improvements.";
    }
  };

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-[#01467d]/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 text-center shadow-[0_30px_60px_-15px_rgba(1,70,125,0.3)] max-w-sm w-full relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent z-0 pointer-events-none"></div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="relative z-10"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl font-bold">✓</span>
            </div>
          </motion.div>
          <h3 className="text-2xl font-bold text-slate-800 relative z-10 mb-2">
            Payment Successful
          </h3>
          <p className="text-slate-500 relative z-10">
            {downloadType as any === "download"
              ? "Your premium resume is being prepared for download."
              : "Accessing deep AI models to enhance your resume."}
          </p>
        </motion.div>
      </div>
    );
  }

  // Logged-in user UI - Clean professional design
  if (isUser) {
    const discount = downloadType === "ai" ? getUserDiscount() : 0;
    const originalPrice = getDownloadPrice(downloadType);
    const finalPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
    
    return (
      <div
        className="fixed inset-0 bg-[#01467d]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto"
        onClick={!loading ? onClose : undefined}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(1,70,125,0.4)] relative my-8 w-full max-w-md"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-50 bg-white/80 hover:bg-white p-2 rounded-full cursor-pointer shadow-sm"
            disabled={loading}
          >
            <X className="w-5 h-5 pointer-events-none" />
          </button>

          <div className="relative">
            {/* Decorative Header Background */}
            <div className="absolute top-0 left-0 right-0 h-[22vh] bg-gradient-to-br from-[#01467d] to-[#013a66] pointer-events-none rounded-t-[2rem]">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              ></div>
            </div>

            <div className="relative z-10 pt-8 px-6 pb-6 text-center text-white pointer-events-none">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
                {downloadType === "no_ai" ? (
                  <Download className="w-7 h-7 text-[#dea42c] relative z-10" />
                ) : (
                  <Sparkles className="w-7 h-7 text-[#dea42c] relative z-10" />
                )}
              </div>
              <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">
                {getTitle()}
              </h2>
              <p className="text-blue-100 text-sm opacity-90 mx-auto max-w-[280px] leading-relaxed">
                {getDescription()}
              </p>
            </div>

            <div className="p-6 pt-5 bg-white shrink-0">
              <div className="mb-5 flex justify-center">
                <div className="relative overflow-hidden px-5 py-3 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-center w-full">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Total Amount
                  </span>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2">
                      {discount > 0 && (
                        <span className="text-lg font-medium text-slate-400 line-through">
                          ₹{formatPrice(originalPrice)}
                        </span>
                      )}
                      <div className="flex items-center text-3xl font-extrabold text-slate-800 tracking-tight">
                        <span className="text-xl mr-0.5 font-bold text-slate-400">
                          ₹
                        </span>
                        {formatPrice(finalPrice)}
                      </div>
                    </div>
                    {discount > 0 && (
                      <div className="mt-1.5 bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> {discount}% Discount Applied
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6 px-1">
                {getFeatures().map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-[#01467d]/10 border border-[#01467d]/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#01467d]" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="group relative w-full h-[52px] bg-[#01467d] text-white rounded-[1rem] font-bold text-sm overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 shadow-[0_10px_20px_-10px_rgba(1,70,125,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(1,70,125,0.6)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#dea42c] to-[#c48b1f] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />{" "}
                      Processing Securely...
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 opacity-70" /> Pay ₹
                      {formatPrice(finalPrice)}
                    </>
                  )}
                </span>
              </button>

              <p className="text-center text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1.5 font-medium uppercase tracking-wider">
                <Lock className="w-2.5 h-2.5" /> Secure 256-bit Encrypted Checkout
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Non-logged-in user UI - Plan selection UI
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-[#f7f8fa] rounded-3xl shadow-2xl overflow-hidden w-full max-w-[600px] border border-gray-100 relative"
          >
            {/* Close Button Header */}
            <div className="bg-white pt-5 pb-4 px-6 flex flex-col items-center relative border-b border-gray-50">
              <button
                onClick={onClose}
                className="absolute -top-5 bg-[#334155] text-white hover:bg-slate-800 rounded-full p-2.5 transition-all shadow-md transform translate-y-1/2"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mt-4 self-start">
                <div className="bg-[#e0f2fe] text-[#0369a1] font-black text-lg p-2.5 rounded-xl tracking-tight w-11 h-11 flex items-center justify-center shadow-sm">
                  RY
                </div>
                <div>
                  <h2 className="text-[21px] font-extrabold text-[#0f172a] tracking-tight">ResumeYatra Checkout</h2>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Choose your plan and download type before payment</p>
                </div>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-6">
              {/* SECTION 1: Choose Your Plan */}
              <div>
                <h3 className="text-[15px] font-bold text-[#0f172a] mb-0.5">Choose Your Plan</h3>
                <p className="text-xs text-gray-400 font-medium mb-3">Select any 1</p>
                
                <div className="space-y-2.5">
                  {/* Guest Option */}
                  <label className={`flex items-center justify-between bg-white border rounded-2xl p-4 cursor-pointer transition-all ${selectedPlan === "guest" ? "border-emerald-500 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plan"
                        checked={selectedPlan === "guest"}
                        onChange={() => setSelectedPlan("guest")}
                        className="w-5 h-5 accent-emerald-600 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-[#1e293b] text-[15px] block">Guest Plan</span>
                        <span className="text-xs text-gray-400 font-medium">No Signup Required</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1e293b] text-base">₹0.00</span>
                      <div className="w-[3px] h-4 bg-orange-400 rounded-full" />
                    </div>
                  </label>

                  {/* Candidate Option */}
                  <label className={`flex items-center justify-between bg-white border rounded-2xl p-4 cursor-pointer transition-all ${selectedPlan === "candidate" ? "border-emerald-500 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plan"
                        checked={selectedPlan === "candidate"}
                        onChange={() => setSelectedPlan("candidate")}
                        className="w-5 h-5 accent-emerald-600 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1e293b] text-[15px]">Candidate Membership</span>
                          <span className="bg-emerald-50 text-[10px] text-emerald-600 font-bold px-1.5 py-0.5 rounded-md tracking-wide uppercase">Popular</span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          ₹{formatPrice(getPlanPrice("candidate"))} / {getPlanDuration("candidate") * 30} days · 
                          Save up to {getResumeLimit("candidate")} resumes · 
                          {getAIDiscount("candidate")}% AI discount
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1e293b] text-base">+ ₹{formatPrice(getPlanPrice("candidate"))}</span>
                      <div className="w-[3px] h-4 bg-slate-300 rounded-full" />
                    </div>
                  </label>

                  {/* Freelancer Option */}
                  <label className={`flex items-center justify-between bg-white border rounded-2xl p-4 cursor-pointer transition-all ${selectedPlan === "freelancer" ? "border-emerald-500 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plan"
                        checked={selectedPlan === "freelancer"}
                        onChange={() => setSelectedPlan("freelancer")}
                        className="w-5 h-5 accent-emerald-600 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-[#1e293b] text-[15px] block">Freelancer Membership</span>
                        <span className="text-xs text-gray-400 font-medium">
                          ₹{formatPrice(getPlanPrice("freelancer"))} / {getPlanDuration("freelancer") * 30} days · 
                          Save up to {getResumeLimit("freelancer")} resumes · 
                          {getAIDiscount("freelancer")}% AI discount
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1e293b] text-base">+ ₹{formatPrice(getPlanPrice("freelancer"))}</span>
                      <div className="w-[3px] h-4 bg-slate-300 rounded-full" />
                    </div>
                  </label>
                </div>
              </div>

              {/* SECTION 2: Choose Resume Download */}
              <div>
                <h3 className="text-[15px] font-bold text-[#0f172a] mb-0.5">Choose Resume Download</h3>
                <p className="text-xs text-gray-400 font-medium mb-3">Select any 1</p>

                <div className="space-y-2.5">
                  {/* No AI Option */}
                  <div 
                    className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${downloadType === "no_ai" ? "border-emerald-500 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                    onClick={() => setDownloadType("no_ai")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${downloadType === "no_ai" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}>
                          {downloadType === "no_ai" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <div>
                          <span className="font-bold text-[#1e293b] text-[15px] block">No AI</span>
                          <span className="text-xs text-gray-400 font-medium">Clean resume download in PDF/DOC</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1e293b] text-base">₹{formatPrice(getDownloadPrice("no_ai"))}</span>
                        <div className="w-[3px] h-4 bg-orange-400 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* AI Optimized Option */}
                  <div 
                    className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${downloadType === "ai" ? "border-emerald-500 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                    onClick={() => setDownloadType("ai")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${downloadType === "ai" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}>
                          {downloadType === "ai" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-pink-500 block mb-0.5">Recommended</span>
                          <span className="font-bold text-[#1e293b] text-[15px] block">AI Optimized</span>
                          <span className="text-xs text-gray-400 font-medium">Profile summary rewrite · role-specific summary · structured skills</span>
                          {selectedPlan !== "guest" && downloadType === "ai" && (
                            <span className="text-[10px] text-emerald-600 font-medium block mt-1">
                              {getAIDiscount(selectedPlan)}% discount applied with {getPlanLabel()} plan
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedPlan !== "guest" && downloadType === "ai" && (
                          <span className="text-xs text-gray-400 line-through">₹{formatPrice(getDownloadPrice("ai"))}</span>
                        )}
                        <span className="font-bold text-[#1e293b] text-base">
                          ₹{selectedPlan !== "guest" && downloadType === "ai" 
                            ? formatPrice(getDiscountedAIPrice())
                            : formatPrice(getDownloadPrice("ai"))
                          }
                        </span>
                        <div className="w-[3px] h-4 bg-slate-300 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="bg-white border-t border-gray-100 p-4 flex gap-3 items-center">
              <div className="bg-[#f8fafc] border border-gray-200/60 rounded-xl py-2 px-3 flex flex-col justify-center min-w-[140px] max-w-[160px] shadow-inner">
                <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">SELECTED</span>
                <span className="text-xs font-black text-slate-800 truncate mt-0.5">
                  {getPlanLabel()} + {getDownloadLabel()}
                </span>
                {selectedPlan !== "guest" && downloadType === "ai" && (
                  <span className="text-[9px] text-emerald-600 font-medium mt-0.5">
                    {getAIDiscount(selectedPlan)}% off on AI
                  </span>
                )}
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white text-base font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Pay & Download | ₹{formatPrice(calculateTotal())}</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}