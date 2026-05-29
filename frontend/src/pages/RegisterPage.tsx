import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { authAPI, paymentAPI, pricingAPI } from "../services/apiClient";
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  User,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Check,
  Sparkles,
  Download,
  Star,
  CreditCard,
  RefreshCw,
  Save,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface PricingData {
  freelancerPrice: number;
  freelancerDurationMonths: number;
  freelancerResumeLimit: number;
  freelancerAiDiscount: number;
  candidatePrice: number;
  candidateDurationMonths: number;
  candidateResumeLimit: number;
  candidateAiDiscount: number;
  guestAi: number;
  guestDownload: number;
}

export default function RegisterPage({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoPay, setAutoPay] = useState(true); // Default to true for better conversion, or false if you prefer
  const [pricingLoading, setPricingLoading] = useState(true);
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const defaultPlan =
    searchParams.get("plan") === "freelancer" ? "freelancer" : "candidate";
  const [selectedPlan, setSelectedPlan] = useState<"candidate" | "freelancer">(
    defaultPlan,
  );

  useEffect(() => {
    pricingAPI
      .get()
      .then((res) => {
        const data = res.data?.data || res.data;
        setPricing(data);
      })
      .catch(() => {
        // Use hardcoded defaults if API fails
        setPricing({
          freelancerPrice: 9900,
          freelancerDurationMonths: 3,
          freelancerResumeLimit: 100,
          freelancerAiDiscount: 50,
          candidatePrice: 2900,
          candidateDurationMonths: 3,
          candidateResumeLimit: 5,
          candidateAiDiscount: 25,
          guestAi: 4900,
          guestDownload: 900,
        });
      })
      .finally(() => setPricingLoading(false));
  }, []);

  const formatPrice = (paise: number) => `₹${(paise / 100).toFixed(0)}`;
  const formatPriceExact = (paise: number) => `₹${(paise / 100).toFixed(2)}`;

  const plans = pricing
    ? [
        {
          id: "candidate" as const,
          label: "Candidate",
          tagline: "For Active Job Seekers",
          icon: GraduationCap,
          price: pricing.candidatePrice,
          duration: pricing.candidateDurationMonths,
          color: "#01467d",
          gradient: "from-[#01467d] to-[#0966b8]",
          bgGradient: "from-blue-50 to-blue-100/50",
          border: "border-[#01467d]",
          buttonText: "Get Started",
          features: [
            { text: "Personal Dashboard", icon: User },
            {
              text: `Save up to ${pricing.candidateResumeLimit} Job-Specific Resumes`,
              icon: Save,
            },
            {
              text: `${pricing.candidateAiDiscount}% off on AI Optimization`,
              icon: Sparkles,
            },
            {
              text: "AI Optimization Includes 1 Download Credit",
              icon: CreditCard,
            },
          ],
        },
        {
          id: "freelancer" as const,
          label: "Freelancer",
          tagline: "Showcase Better. Pitch Smarter. Earn More.",
          icon: Briefcase,
          price: pricing.freelancerPrice,
          duration: pricing.freelancerDurationMonths,
          color: "#c48b1f",
          gradient: "from-[#dea42c] to-[#c48b1f]",
          bgGradient: "from-amber-50 to-amber-100/50",
          border: "border-[#dea42c]",
          buttonText: "Start Your Journey",
          features: [
            { text: "Professional Dashboard", icon: Briefcase },
            {
              text: `Save up to ${pricing.freelancerResumeLimit} Different Resumes`,
              icon: Save,
            },
            {
              text: `${pricing.freelancerAiDiscount}% off on AI Optimization`,
              icon: Sparkles,
            },
            {
              text: "AI Optimization Includes 1 Download Credit",
              icon: CreditCard,
            },
          ],
        },
      ]
    : [];

  const activePlan = plans.find((p) => p.id === selectedPlan);

  const individualType = searchParams.get("individualType") as "ai" | "download" | null;
  const resumeId = searchParams.get("resumeId");

  const getCombinedTotal = () => {
    if (!activePlan || !pricing) return 0;
    let total = activePlan.price;

    if (individualType) {
      if (individualType === "ai") {
        const discount = selectedPlan === "freelancer" ? pricing.freelancerAiDiscount : pricing.candidateAiDiscount;
        const discountedPrice = pricing.guestAi * (1 - (discount || 0) / 100);
        total += discountedPrice;
      } else if (individualType === "download") {
        total += pricing.guestDownload;
      }
    }
    return total;
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  // Password validation
  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  // Name
  if (!/^[A-Za-z ]{3,}$/.test(name.trim())) {
    toast.error("Enter valid full name");
    return;
  }

  // Email
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    toast.error("Enter valid email");
    return;
  }

  // Mobile
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    toast.error("Enter valid 10 digits mobile number");
    return;
  }

  // State
  if (!state.trim()) {
    toast.error("State is required");
    return;
  }

  // City
  if (!city.trim()) {
    toast.error("City is required");
    return;
  }

  // PIN
  if (!/^[1-9][0-9]{5}$/.test(pin)) {
    toast.error("Enter valid 6-digit PIN code");
    return;
  }

  setLoading(true);
  const subscriptionType = `subscription_${selectedPlan}`;

  try {
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Failed to load payment gateway. Please try again.");
      setLoading(false);
      return;
    }

    const { data: order } = await paymentAPI.createOrder(subscriptionType, {
      autoPay,
      includeItem: individualType,
      resumeId: resumeId
    });

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      toast.error("Payment configuration error. Please contact support.");
      setLoading(false);
      return;
    }

    const planLabel =
      selectedPlan === "freelancer" ? "Freelancer" : "Candidate";

    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "ResumeYatra",
      description: `${planLabel} Plan — ${activePlan?.duration}-Month Subscription${individualType ? ` + ${individualType === 'ai' ? 'AI Enhancement' : 'Download Credit'}` : ''}`,
      image: "/logo.png",
      order_id: order.isSubscription ? undefined : order.id,
      subscription_id: order.isSubscription ? order.id : undefined,
      prefill: { name, email },

      handler: async function (response: any) {
        try {
          const registerRes = await authAPI.register(email, name, password, {
            mobile,
            state,
            city,
            pin,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_subscription_id:
              response.razorpay_subscription_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            type: subscriptionType,
            autoPay: autoPay,
            includeItem: individualType,
            resumeId: resumeId
          });

          localStorage.setItem("token", registerRes.data.token);
          localStorage.setItem("user", JSON.stringify(registerRes.data.user));
          window.dispatchEvent(new Event('auth-change'));
          toast.success("Registration successful 🎉");
          onSuccess();
          const resumeRedirectId = searchParams.get("resumeId");
          if (resumeRedirectId) {
            navigate(`/preview/${resumeRedirectId}`);
          } else {
            navigate(
              registerRes.data.user.role === "admin"
                ? "/admin-dashboard"
                : "/dashboard"
            );
          }
        } catch (err: any) {
          toast.error(
            err.response?.data?.error ||
              "Registration failed after payment"
          );
          setLoading(false);
        }
      },

      modal: {
        ondismiss: () => setLoading(false),
      },

      theme: { color: activePlan?.color || "#01467d" },
    };

    const rzp = new (window as any).Razorpay(options);

    rzp.on("payment.failed", (response: any) => {
      toast.error(
        response.error.description || "Payment failed. Please try again."
      );
      setLoading(false);
    });

    rzp.open();
  } catch (err: any) {
    toast.error(
      err.response?.data?.error ||
        "Could not initiate payment. Try again later."
    );
    setLoading(false);
  }
};

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-white">
     
        <div className="relative z-10 w-full max-w-5xl">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link to="/">
              <img
                src="logo.png"
                alt="ResumeYatra"
                className="h-12 mx-auto hover:scale-105 transition-transform"
              />
            </Link>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Create your account to start your career journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* ── Plan Selection Panel ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-slate-700 px-1">
                Choose your plan
              </h2>

              {pricingLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-[#01467d]" />
                </div>
              ) : (
                plans.map((plan) => {
                  const isActive = selectedPlan === plan.id;
                  const Icon = plan.icon;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-300 relative overflow-hidden
                        ${
                          isActive
                            ? `${plan.border} bg-gradient-to-br ${plan.bgGradient} shadow-lg scale-[1.02]`
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                        }`}
                    >
                      {/* Popular badge for freelancer */}
                      {plan.id === "freelancer" && (
                        <span className="absolute top-3 right-3 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" /> Popular
                        </span>
                      )}

                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2.5 rounded-xl bg-gradient-to-br ${plan.gradient} text-white flex-shrink-0`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 text-base">
                              {plan.label}
                            </span>
                            <span
                              className="text-2xl font-extrabold"
                              style={{ color: plan.color }}
                            >
                              {formatPrice(plan.price)}
                            </span>
                            <span className="text-slate-400 text-xs">
                              / {plan.duration * 30} days
                            </span>
                          </div>

                          {/* Tagline */}
                          <p
                            className="text-xs font-medium mt-1"
                            style={{ color: plan.color }}
                          >
                            {plan.tagline}
                          </p>

                          <ul className="mt-3 space-y-2">
                            {plan.features.map((feature, i) => {
                              const FeatureIcon = feature.icon;
                              return (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-slate-700"
                                >
                                  <FeatureIcon
                                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                                    style={{ color: plan.color }}
                                  />
                                  <span>{feature.text}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}

              {/* What you get reminder - Common features */}
              {!pricingLoading && (
                <div className="bg-white/70 backdrop-blur rounded-xl border border-slate-200 p-4 text-xs text-slate-500 space-y-1.5">
                  <p className="font-semibold text-slate-600 text-sm mb-2">
                    ✨ Common Features
                  </p>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green-500" /> No Watermark
                    on downloaded resumes
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" /> AI
                    Enhancement with 1 free download credit
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── Registration Form Panel ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(1,70,125,0.2)] p-7 relative overflow-hidden">
                {/* Corner accents */}
                {/* <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#01467d]/10 to-transparent rounded-br-[80px]" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#dea42c]/10 to-transparent rounded-tl-[80px]" /> */}

                <h2 className="text-lg font-bold text-slate-800 mb-5 relative">
                  {activePlan ? (
                    <span>
                      Sign up —{" "}
                      <span style={{ color: activePlan.color }}>
                        {activePlan.label} Plan
                      </span>
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </h2>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 relative">
                  {/* Name */}
                  <div className="group space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#01467d]/60 ml-1">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-4 h-4 text-[#01467d]/40 group-focus-within:text-[#01467d] transition-colors" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#01467d]/20 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#01467d]/10 focus:border-[#01467d] transition-all placeholder:text-slate-300 text-slate-900 text-sm"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#01467d]/60 ml-1">
                      Email
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 w-4 h-4 text-[#01467d]/40 group-focus-within:text-[#01467d] transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#01467d]/20 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#01467d]/10 focus:border-[#01467d] transition-all placeholder:text-slate-300 text-slate-900 text-sm"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="group space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#01467d]/60 ml-1">
                      Mobile
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-4 py-3.5 border border-[#01467d]/20 rounded-xl"
                      placeholder="9876543210"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* State */}
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="px-4 py-3.5 border border-[#01467d]/20 rounded-xl"
                      placeholder="State"
                      required
                    />

                    {/* City */}
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="px-4 py-3.5 border border-[#01467d]/20 rounded-xl"
                      placeholder="City"
                      required
                    />

                    {/* PIN */}
                    <input
                      type="text"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="px-4 py-3.5 border border-[#01467d]/20 rounded-xl"
                      placeholder="PIN"
                      required
                    />
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="group space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#01467d]/60 ml-1">
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3 w-4 h-4 text-[#01467d]/40 group-focus-within:text-[#01467d] transition-colors" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-3 py-3.5 bg-white border border-[#01467d]/20 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#01467d]/10 focus:border-[#01467d] transition-all placeholder:text-slate-300 text-slate-900 text-sm"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    <div className="group space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#01467d]/60 ml-1">
                        Confirm
                      </label>
                      <div className="relative flex items-center">
                        <ShieldCheck className="absolute left-3 w-4 h-4 text-[#01467d]/40 group-focus-within:text-[#01467d] transition-colors" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-3 py-3.5 bg-white border border-[#01467d]/20 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#01467d]/10 focus:border-[#01467d] transition-all placeholder:text-slate-300 text-slate-900 text-sm"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password strength */}
                  {password && (
                    <div>
                      <div className="flex gap-1 h-1">
                        <div
                          className={`flex-1 rounded-full transition-all ${password.length > 0 ? "bg-red-400" : "bg-gray-200"}`}
                        />
                        <div
                          className={`flex-1 rounded-full transition-all ${password.length > 5 ? "bg-yellow-400" : "bg-gray-200"}`}
                        />
                        <div
                          className={`flex-1 rounded-full transition-all ${password.length > 8 ? "bg-green-400" : "bg-gray-200"}`}
                        />
                      </div>
                      <p className="text-xs text-[#01467d]/50 mt-1">
                        {password.length <= 5
                          ? "Weak"
                          : password.length <= 8
                            ? "Medium"
                            : "Strong"}
                      </p>
                    </div>
                  )}

                  {/* Auto-Pay Toggle */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex items-center justify-between group-hover:border-[#01467d]/20 transition-all">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <RefreshCw className="w-3 h-3 text-[#01467d]" />
                        Automatic Renewal
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Stay professional without gaps
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoPay(!autoPay)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${autoPay ? "bg-emerald-500 shadow-sm shadow-emerald-500/20" : "bg-slate-300"}`}
                    >
                      <div
                        className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${autoPay ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </div>

                  {/* Submit — shows selected plan button text */}
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !name ||
                      !email ||
                      !password ||
                      !mobile ||
                      !state ||
                      !city ||
                      !pin
                    }
                    className="group relative w-full h-[56px] rounded-xl font-bold text-base overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 shadow-lg mt-2"
                    style={{
                      background: activePlan
                        ? `linear-gradient(135deg, ${activePlan.color}, ${activePlan.color}cc)`
                        : "#01467d",
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          {activePlan?.buttonText || "Sign Up"} —{" "}
                          {activePlan ? (individualType ? formatPriceExact(getCombinedTotal()) : formatPrice(activePlan.price)) : ""}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>

                  <p className="text-center text-xs text-slate-400 mt-1">
                    Secure payment via Razorpay ·{" "}
                    {activePlan?.duration ? activePlan.duration * 30 : 90}-day
                    access
                  </p>
                </form>

                <div className="mt-5 text-center border-t border-slate-100 pt-4">
                  <p className="text-slate-500 text-sm">
                    Already have an account?{" "}
                    <Link
                      to={`/login${searchParams.get("resumeId") ? `?resumeId=${searchParams.get("resumeId")}` : ''}`}
                      className="font-bold text-[#01467d] hover:text-[#dea42c] transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-[#01467d]/30 uppercase tracking-widest">
                © 2026 ResumeYatra AI · All rights reserved
              </p>
            </motion.div>
          </div>
        </div>

      {/* Add custom animations (from LoginPage) */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-bounce-short {
          animation: bounce-short 0.5s ease-in-out;
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-5px); }
          75% { transform: translateY(5px); }
        }
      `}</style>
    </div>
  );
}