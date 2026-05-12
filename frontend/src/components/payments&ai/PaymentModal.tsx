import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { paymentAPI, pricingAPI } from "../../services/apiClient";
import { motion } from "framer-motion";
import {
  X,
  CreditCard,
  Download,
  Sparkles,
  IndianRupee,
  CheckCircle,
  Check,
  Loader2,
  Lock,
  Crown,
  ArrowRight,
  Zap,
  FastForward,
} from "lucide-react";
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
  onSuccess: () => void;
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
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [pricing, setPricing] = useState<any>(null);

  useEffect(() => {
    if (open) {
      setPaymentSuccess(false);
      setLoading(false);

      if (!pricing) {
        pricingAPI
          .get()
          .then((res) => {
            // Handle both response structures
            const data = res.data?.data || res.data;
            setPricing(data);
          })
          .catch((err) => console.error("Failed to load pricing:", err));
      }
    }
  }, [open, pricing]);

  if (!open) return null;

  const isUser = !!localStorage.getItem("token");

  const formatPrice = (paisa?: number) => {
    if (!paisa && paisa !== 0) return "₹0";
    const rupees = (paisa / 100).toFixed(2);
    return `₹${rupees}`;
  };

  const formatPriceNumber = (paisa?: number) => {
    if (!paisa && paisa !== 0) return "0";
    return (paisa / 100).toFixed(2);
  };

  const getPaymentDetails = () => {
    let dynamicAmount = null;
    let discount = 0;
    let originalAmount = null;

    if (pricing) {
      if (type === "download") {
        originalAmount = pricing.guestDownload;
        dynamicAmount = pricing.guestDownload / 100;
      } else {
        originalAmount = pricing.guestAi;
        if (isUser) {
          try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (user.subscriptionPlan === "freelancer") {
              discount = pricing.freelancerAiDiscount || 0;
            } else if (user.subscriptionPlan === "candidate") {
              discount = pricing.candidateAiDiscount || 0;
            } else {
              discount = pricing.candidateAiDiscount || 0;
            }
          } catch (e) {
            discount = pricing.candidateAiDiscount || 0;
          }
        }
        dynamicAmount = (pricing.guestAi * (1 - discount / 100)) / 100;
      }
    }

    if (type === "download") {
      const baseDetails: any = {
        title: "Unlock Premium Export",
        description:
          "Get your professionally crafted resume in industry-standard formats.",
        amount: dynamicAmount,
        originalAmount: originalAmount ? originalAmount / 100 : null,
        discount: discount,
        icon: Download,
        features: [
          "PDF format with perfect ATS layout",
          "Word document for easy fine-tuning",
          "High-quality print ready format",
          "Instant download after secure checkout",
        ],
      };

      if (!isUser && selectedPlan && pricing) {
        const planPrice = (selectedPlan === 'candidate' ? pricing.candidatePrice : pricing.freelancerPrice) / 100;
        baseDetails.totalAmount = baseDetails.amount + planPrice;
        baseDetails.planPrice = planPrice;
      } else {
        baseDetails.totalAmount = baseDetails.amount;
      }
      return baseDetails;
    } else {
      const baseDetails: any = {
        title: "Deep AI Enhancement",
        description:
          "Upgrade your resume sentences with data-driven, ATS-tested improvements.",
        amount: dynamicAmount,
        originalAmount: originalAmount ? originalAmount / 100 : null,
        discount: discount,
        icon: Sparkles,
        features: [
          "Professional high-impact suggestions",
          "Grammar, tone and phrasing improvements",
          "Keyword injection for ATS bypass",
          "Deep clarity and flow adjustments",
          "Data-driven measurable impact metrics",
          "1 free download Docx/Pdf credit",
        ],
      };

      if (!isUser && selectedPlan && pricing) {
        const planPrice = (selectedPlan === 'candidate' ? pricing.candidatePrice : pricing.freelancerPrice) / 100;
        const planDiscount = selectedPlan === 'candidate' ? pricing.candidateAiDiscount : pricing.freelancerAiDiscount;
        const discountedAiPrice = (pricing.guestAi * (1 - (planDiscount || 0) / 100)) / 100;
        
        baseDetails.amount = discountedAiPrice; // Update shown amount to discounted version
        baseDetails.totalAmount = discountedAiPrice + planPrice;
        baseDetails.planPrice = planPrice;
        baseDetails.discount = planDiscount;
      } else {
        baseDetails.totalAmount = baseDetails.amount;
      }
      return baseDetails;
    }
  };

  const details = getPaymentDetails();
  const Icon = details.icon;

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
    if (details.amount === null) return;

    if (!isUser && selectedPlan) {
      onClose();
      const redirectUrl = `/register?plan=${selectedPlan}${resumeId ? `&resumeId=${resumeId}` : ""}&individualType=${type}&redirect=payment`;
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

      const { data: order } = await paymentAPI.createOrder(type);
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
        description: details.title,
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await paymentAPI.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              resumeId,
              type,
            });

            setPaymentSuccess(true);
            toast.success("Payment successful");

            setTimeout(() => {
              onSuccess();
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
      rzp.on("payment.failed", function (response: any) {
        toast.error(response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Try again.");
      setLoading(false);
    }
  };

  const handleSignupForPlan = (plan: string) => {
    if (selectedPlan === plan) {
      setSelectedPlan(null);
    } else {
      setSelectedPlan(plan);
    }
  };

  const getDiscountedPriceForPlan = (discountPercent: number) => {
    if (type === "ai" && pricing) {
      const guestPrice = pricing?.guestAi || 0;
      const discounted = guestPrice * (1 - discountPercent / 100);
      return discounted / 100;
    }
    return null;
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
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-2xl font-bold text-slate-800 relative z-10 mb-2">
            Payment Successful
          </h3>
          <p className="text-slate-500 relative z-10">
            {type === "download"
              ? "Your premium resume is being prepared for download."
              : "Accessing deep AI models to enhance your resume."}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-[#01467d]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto"
      onClick={!loading ? onClose : undefined}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className={`bg-white rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(1,70,125,0.4)] relative my-8 ${
          isUser ? "w-full max-w-md" : "w-full max-w-5xl"
        }`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Close Button - Top Right of Modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-50 bg-white/80 hover:bg-white p-2 rounded-full cursor-pointer shadow-sm"
          disabled={loading}
        >
          <X className="w-5 h-5 pointer-events-none" />
        </button>

        <div className={`${isUser ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2"}`}>
          {/* Left Column - Current Payment */}
          <div className="relative">
            {/* Decorative Header Background */}
            <div className="absolute top-0 left-0 right-0 h-[22vh] bg-gradient-to-br from-[#01467d] to-[#013a66] pointer-events-none rounded-tl-[2rem] md:rounded-tr-none rounded-tr-[2rem]">
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
                <Icon className="w-7 h-7 text-[#dea42c] relative z-10" />
              </div>
              <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">
                {details.title}
              </h2>
              <p className="text-blue-100 text-sm opacity-90 mx-auto max-w-[280px] leading-relaxed">
                {details.description}
              </p>
            </div>

            <div className="p-6 pt-5 bg-white shrink-0">
              <div className="mb-5 flex justify-center">
                <div className="relative overflow-hidden px-5 py-3 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-center w-full">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Total Amount
                  </span>
                  {details.amount === null ? (
                    <div className="flex items-center justify-center gap-2 text-slate-400 h-10">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">
                        Fetching price...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-center gap-2">
                        {details.originalAmount && details.discount > 0 && (
                          <span className="text-lg font-medium text-slate-400 line-through">
                            ₹{details.originalAmount.toFixed(2)}
                          </span>
                        )}
                        <div className="flex items-center text-3xl font-extrabold text-slate-800 tracking-tight">
                          <span className="text-xl mr-0.5 font-bold text-slate-400">
                            ₹
                          </span>
                          {details.totalAmount?.toFixed(2)}
                        </div>
                      </div>
                      {details.discount > 0 && (
                        <div className="mt-1.5 bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> {details.discount}%
                          Discount Applied
                        </div>
                      )}
                      {!isUser && selectedPlan && (
                        <div className="mt-1 text-[10px] text-slate-500 font-medium">
                          Includes {selectedPlan === 'candidate' ? 'Candidate' : 'Freelancer'} Plan (₹{details.planPrice.toFixed(2)})
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6 px-1">
                {details.features.map((feature:any, idx:any) => (
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
                disabled={loading || details.amount === null}
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
                      <Lock className="w-3.5 h-3.5 opacity-70" /> {selectedPlan ? "Sign Up & Pay" : "Pay"} ₹
                      {details.totalAmount !== null ? details.totalAmount.toFixed(2) : "..."}
                    </>
                  )}
                </span>
              </button>

              <p className="text-center text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1.5 font-medium uppercase tracking-wider">
                <Lock className="w-2.5 h-2.5" /> Secure 256-bit Encrypted
                Checkout
              </p>
            </div>
          </div>

          {/* Right Column - Plan Suggestions (Only for non-logged-in users) */}
          {!isUser && (
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-r-[2rem] border-l border-gray-100">
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-800 text-lg">
                    Save More with Plans
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Get unlimited access and exclusive discounts with our
                  subscription plans
                </p>
              </div>

              <div className="space-y-4">
                {/* Candidate Plan */}
                {pricing && (
                  <div
                    className={`bg-white rounded-xl p-4 border transition-all cursor-pointer group relative ${
                      selectedPlan === "candidate" 
                        ? "border-[#01467d] ring-2 ring-[#01467d]/10 shadow-md" 
                        : "border-emerald-100 shadow-sm hover:shadow-md"
                    }`}
                    onClick={() => handleSignupForPlan("candidate")}
                  >
                    {selectedPlan === "candidate" && (
                      <div className="absolute -top-2 -left-2 bg-[#01467d] text-white p-1 rounded-full z-10 shadow-sm transform scale-100 animate-in zoom-in duration-300">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800">
                            Candidate Plan
                          </h4>
                          <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Popular
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Best for active job seekers
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-slate-800">
                          {formatPrice(pricing.candidatePrice)}
                        </div>
                        <div className="text-[9px] text-slate-400">
                          for {pricing.candidateDurationMonths || 3} months
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        Up to {pricing.candidateResumeLimit || 5} resumes
                      </span>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        {pricing.candidateAiDiscount || 25}% AI discount
                      </span>
                    </div>

                    {/* Show discounted price for AI enhancement */}
                    {type === "ai" && (
                      <div className="mb-2 p-2 bg-emerald-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-emerald-700 font-medium">
                            Your price with this plan:
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-400 line-through">
                              ₹{formatPriceNumber(pricing.guestAi)}
                            </span>
                            <span className="text-sm font-bold text-emerald-700">
                              ₹{getDiscountedPriceForPlan(pricing.candidateAiDiscount || 25)?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] text-emerald-600 font-medium">
                          Save {pricing.candidateAiDiscount || 25}% on this
                          purchase
                        </span>
                      </div>
                      <div className="text-emerald-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        {selectedPlan === "candidate" ? "Selected" : "Select Plan"} <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Freelancer Plan */}
                {pricing && (
                  <div
                    className={`bg-white rounded-xl p-4 border transition-all cursor-pointer group relative ${
                      selectedPlan === "freelancer" 
                        ? "border-[#c48b1f] ring-2 ring-[#c48b1f]/10 shadow-md" 
                        : "border-gray-100 shadow-sm hover:shadow-md"
                    }`}
                    onClick={() => handleSignupForPlan("freelancer")}
                  >
                    {selectedPlan === "freelancer" && (
                      <div className="absolute -top-2 -left-2 bg-[#c48b1f] text-white p-1 rounded-full z-10 shadow-sm transform scale-100 animate-in zoom-in duration-300">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800">
                            Freelancer Plan
                          </h4>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          For high-volume professionals
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-slate-800">
                          {formatPrice(pricing.freelancerPrice)}
                        </div>
                        <div className="text-[9px] text-slate-400">
                          for {pricing.freelancerDurationMonths || 3} months
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        Up to {pricing.freelancerResumeLimit || 100} resumes
                      </span>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        {pricing.freelancerAiDiscount || 50}% AI discount
                      </span>
                    </div>

                    {/* Show discounted price for AI enhancement */}
                    {type === "ai" && (
                      <div className="mb-2 p-2 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-blue-700 font-medium">
                            Your price with this plan:
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-400 line-through">
                              ₹{formatPriceNumber(pricing.guestAi)}
                            </span>
                            <span className="text-sm font-bold text-blue-700">
                              ₹{getDiscountedPriceForPlan(pricing.freelancerAiDiscount || 50)?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <FastForward className="w-3 h-3 text-blue-500" />
                        <span className="text-[10px] text-blue-600 font-medium">
                          Save {pricing.freelancerAiDiscount || 50}% on this
                          purchase
                        </span>
                      </div>
                      <div className="text-blue-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        {selectedPlan === "freelancer" ? "Selected" : "Select Plan"} <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Value Comparison */}
                <div className="mt-6 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-700">
                      Value Highlight
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    With Candidate Plan, you get{" "}
                    {pricing?.candidateAiDiscount || 25}% off AI enhancements +
                    {pricing?.candidateResumeLimit || 5} free resume downloads.
                    That's {(pricing?.candidateAiDiscount || 25) + 15}%+
                    savings!
                  </p>
                </div>
              </div>

              
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}