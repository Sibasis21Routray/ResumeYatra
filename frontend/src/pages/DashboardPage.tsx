import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  resumeAPI,
  paymentAPI,
  pricingAPI,
  authAPI,
} from "../services/apiClient";
import {
  Edit,
  Eye,
  Trash2,
  Plus,
  Upload, // Added Upload import
  FileText,
  LogOut,
  Calendar,
  RefreshCw,
  X,
  ArrowLeft,
  Menu,
  MoreVertical,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Shield,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Lock,
  Loader2,
  Target,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/home/Navbar";
import { confirmDeleteToast } from "../utils/confirmDeleteToast";
import toast from "react-hot-toast";

interface Resume {
  id: string;
  title: string;
  candidateName: string;
  createdAt: string;
  updatedAt: string;
  isParsed?: boolean;
  isAiEnhanced?: boolean;
  isDownloaded?: boolean;
  template?: string;
}

export function DashboardPage() {
  const { theme } = useTheme();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [totalResumeCount, setTotalResumeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [formatPickerId, setFormatPickerId] = useState<string | null>(null); // which resume's format picker is open
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState<string | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [autoPay, setAutoPay] = useState(false);
  const [togglingAutoPay, setTogglingAutoPay] = useState(false);

  // Renewal states
  const [isSubscriptionExpired, setIsSubscriptionExpired] = useState(false);
  const [pricing, setPricing] = useState<any>(null);
  const [processingRenewal, setProcessingRenewal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paginatedResumes, setPaginatedResumes] = useState<Resume[]>([]);

  // Sorting and filtering
  const [sortField, setSortField] = useState<
    "createdAt" | "updatedAt" | "candidateName"
  >("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Calculate pagination
  const totalPages = Math.ceil(resumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  //rename resume
  const canRename = currentUser?.subscriptionPlan === "freelancer";
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [renaming, setRenaming] = useState(false);

  const startRename = (resume: Resume) => {
    if (!canRename) {
      toast.error("Upgrade to Freelancer to rename resumes");
      return;
    }

    setEditingId(resume.id);
    setNewTitle(resume.title || "");
  };

  const handleRename = async (id: string) => {
    const trimmed = newTitle.trim();

    if (!trimmed) {
      toast.error("Title cannot be empty");
      return;
    }

    const current = resumes.find((r) => r.id === id);
    if (current?.title === trimmed) {
      setEditingId(null);
      return; // ✅ no API call if same
    }

    try {
      setRenaming(true);

      await resumeAPI.rename(id, trimmed);

      setResumes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, title: trimmed } : r)),
      );

      toast.success("Title updated");
      setEditingId(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast.error("Only Freelancer plan can rename");
      }
    } finally {
      setRenaming(false);
    }
  };

  const cancelRename = () => {
    setEditingId(null);
    setNewTitle("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  useEffect(() => {
    // Load cached user immediately for fast render
    try {
      const raw = localStorage.getItem("user");
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }

    // Fetch pricing first, then use it when loading resumes so limits apply correctly
    pricingAPI
      .get()
      .then((res) => {
        const pricingData = res.data?.data || res.data;
        setPricing(pricingData);
        fetchResumes(pricingData);
      })
      .catch(() => {
        // If pricing fails, still load resumes (no slicing will apply)
        fetchResumes();
      });
  }, []);

  // Apply sorting and filtering whenever resumes, sortField, sortDirection, or searchTerm changes
  useEffect(() => {
    let filtered = [...resumes];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (resume) =>
          resume.candidateName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          resume.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resume.id?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setPaginatedResumes(filtered.slice(startIndex, endIndex));
  }, [
    resumes,
    sortField,
    sortDirection,
    searchTerm,
    currentPage,
    itemsPerPage,
    startIndex,
    endIndex,
  ]);

  const fetchResumes = async (pricingData?: any) => {
    setLoading(true);
    setError("");
    try {
      // Get fresh user to determine plan
      let user = currentUser;
      try {
        const res = await authAPI.me();
        user = {
          ...JSON.parse(localStorage.getItem("user") || "{}"),
          ...res.data,
        };
        setCurrentUser(user);
        setAutoPay(user.autoPay || false);
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        /* use cached user */
        if (user) setAutoPay(user.autoPay || false);
      }

      const response = await resumeAPI.list();
      const resumeArray = Array.isArray(response.data) ? response.data : [];

      const validResumes = resumeArray.filter((resume: Resume) => {
        const isValid =
          resume &&
          resume.id &&
          resume.id !== "undefined" &&
          resume.id !== "null" &&
          typeof resume.id === "string" &&
          resume.id.trim() !== "" &&
          resume.id.length >= 10;
        return isValid;
      });

      // Store total count for display
      setTotalResumeCount(validResumes.length);

      // Determine display limit from plan
      const activePricing = pricingData || pricing;
      let displayLimit = Infinity;
      if (user?.subscriptionPlan === "freelancer") {
        displayLimit = activePricing?.freelancerResumeLimit ?? 100;
      } else if (user?.subscriptionPlan === "candidate") {
        displayLimit = activePricing?.candidateResumeLimit ?? 5;
      }

      // Slice to display limit (most recent first)
      const limitedResumes = validResumes.slice(0, displayLimit);
      setResumes(limitedResumes);
      setCurrentPage(1);
    } catch (err: any) {
      console.error("[DashboardPage] Fetch resumes error:", err);
      let errorMessage = "Failed to fetch resumes. Please try again.";

      if (err.response?.data?.type === "subscription_required") {
        setIsSubscriptionExpired(true);
        pricingAPI
          .get()
          .then((res) => setPricing(res.data))
          .catch(console.error);
        errorMessage =
          "Your 3-month subscription has expired. Please renew to continue.";
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (err.response?.status === 403) {
        errorMessage =
          "Access denied. You may not have permission to view these resumes.";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

 
  const [showAutoPayCancelModal, setShowAutoPayCancelModal] = useState(false);

  // ... (existing code)

  const handleToggleAutoPay = async () => {
    if (togglingAutoPay) return;
    
    // If turning OFF, show confirmation modal first
    if (autoPay) {
      setShowAutoPayCancelModal(true);
      return;
    }

    // Direct toggle for turning ON (only if allowed)
    performAutoPayToggle(true);
  };

  const performAutoPayToggle = async (targetState: boolean) => {
    setTogglingAutoPay(true);
    try {
      const response = await paymentAPI.toggleAutoPay(targetState);
      const newState = response.data.autoPay;
      setAutoPay(newState);
      if (!newState) {
        toast.success("Auto-Pay Disabled. You can reactivate it during your next renewal.", { icon: 'ℹ️' });
      } else {
        toast.success("Auto-Pay Enabled");
      }
      
      if (currentUser) {
        const updatedUser = { ...currentUser, autoPay: newState };
        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      toast.error("Failed to update Auto-Pay status");
    } finally {
      setTogglingAutoPay(false);
      setShowAutoPayCancelModal(false);
    }
  };

  const handleConfirmAutoPayCancel = () => performAutoPayToggle(false);

  const handleCreateResume = () => navigate("/onboarding");
  const handleUploadResume = () => navigate("/upload"); // Added from old dashboard

  const handleDeleteResume = async (id: string) => {
    // 🔒 Validation (keep this)
    if (!id || id === "undefined" || id === "null" || id.trim() === "") {
      console.error("[DashboardPage] Invalid resume ID for deletion:", id);
      setError("Invalid resume ID. Please refresh the page and try again.");
      return;
    }

    // 🚀 Replace confirm with toast
    confirmDeleteToast(async () => {
      setDeletingId(id);

      try {
        await resumeAPI.delete(id);

        setResumes((prev) => prev.filter((r) => r.id && r.id !== id));

        toast.success("Resume deleted successfully");
      } catch (err: any) {
        console.error("[DashboardPage] Failed to delete resume:", err);

        const message =
          err.response?.data?.error ||
          "Failed to delete resume. Please try again.";

        setError(message);
        toast.error(message);
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleDownloadEnhanced = async (
    resume: Resume,
    format: "pdf" | "docx",
  ) => {
    if (downloadingId) return;
    setDownloadingId(resume.id);
    setFormatPickerId(null); // close picker
    const template = resume.template || "modern";
    try {
      const response = await resumeAPI.export(
        resume.id,
        format,
        undefined,
        template,
      );
      if (response.status !== 200) throw new Error("Export failed");

      const mimeType =
        format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const ext = format === "pdf" ? "pdf" : "docx";

      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.candidateName || "resume"}-enhanced.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Mark as downloaded on backend, then update local state
      await resumeAPI.markDownloaded(resume.id);
      setResumes((prev) =>
        prev.map((r) =>
          r.id === resume.id ? { ...r, isDownloaded: true } : r,
        ),
      );
      toast.success(`Resume downloaded as ${format.toUpperCase()}! ✅`);
    } catch (err: any) {
      toast.error(err?.message || "Download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Close format picker when clicking outside
  const handleFormatPickerToggle = (resumeId: string) => {
    setFormatPickerId((prev) => (prev === resumeId ? null : resumeId));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("guestId");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
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

  const handleRenewSubscription = async () => {
    setProcessingRenewal(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Failed to load payment gateway");
        setProcessingRenewal(false);
        return;
      }

      const planType = currentUser?.subscriptionPlan || "candidate";
      const subscriptionType = `subscription_${planType}`;

      const { data: order } = await paymentAPI.createOrder(subscriptionType, { autoPay });

      const razorpayKey = (import.meta as any).env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        toast.error("Razorpay key missing");
        setProcessingRenewal(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "ResumeYatra Pro",
        description: `Plan Renewal — 3-Month Access`,
        image: "/logo.png",
        order_id: order.isSubscription ? undefined : order.id,
        subscription_id: order.isSubscription ? order.id : undefined,
        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
        },
        handler: async function (response: any) {
          try {
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              type: subscriptionType,
              autoPay: autoPay // Use current autoPay preference
            });

            toast.success("Subscription Renewed! ✅");
            setIsSubscriptionExpired(false);
            setError("");
            fetchResumes();
          } catch (err) {
            console.error("Renewal verification failed:", err);
            toast.error("Payment verification failed.");
          } finally {
            setProcessingRenewal(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessingRenewal(false);
          },
        },
        theme: {
          color: "#01467d",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(response.error.description);
        setProcessingRenewal(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Renewal initiation failed", err);
      toast.error("Renewal failed. Try again.");
      setProcessingRenewal(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((p: string) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const recentResumes = resumes.slice(0, 3);

  const toggleSort = (field: "createdAt" | "updatedAt" | "candidateName") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}

      <Navbar />

      {/* Logout Confirmation Modal */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setLogoutConfirmOpen(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sign Out
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to sign out?
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setLogoutConfirmOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setLogoutConfirmOpen(false);
                  setProfileOpen(false);
                  handleLogout();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* EXACT SUBSCRIPTION OVERLAY */}
        {isSubscriptionExpired && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center p-4 rounded-xl overflow-hidden backdrop-blur-md bg-white/60 dark:bg-gray-950/60 mt-4 mb-4"
            style={{ minHeight: "600px" }}
          >
            <div className="bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900 shadow-2xl rounded-2xl p-10 max-w-lg w-full text-center relative pointer-events-auto">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex flex-col items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-red-500" />
              </div>

              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
                Subscription Expired
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Your 3-month foundational access has ended. To regain full
                access to edit, download, and create AI-driven resumes, simply
                renew your subscription below.
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-8 border border-gray-100 dark:border-gray-700 mx-auto w-3/4">
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                  Renewal Amount
                </div>
                {pricing ? (
                  <div className="text-4xl font-black text-gray-900 dark:text-white">
                    ₹{((currentUser?.subscriptionPlan === 'freelancer' ? pricing.freelancerPrice : pricing.candidatePrice) || 0) / 100}
                  </div>
                ) : (
                  <div className="text-4xl font-black text-gray-400 animate-pulse">
                    ₹...
                  </div>
                )}
              </div>

              {/* AutoPay Option during renewal */}
              <div className="flex flex-col items-center gap-2 mb-8">
                <button 
                  onClick={handleToggleAutoPay}
                  disabled={togglingAutoPay || (!autoPay && currentUser?.subscriptionPlan !== 'none')}
                  title={!autoPay ? "Auto-Pay is disabled. You can reactivate it during your next renewal." : "Toggle Auto-Pay"}
                  className={`flex items-center gap-3 px-4 py-1.5 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900 shadow-sm transition-all hover:border-red-400 active:scale-95 ${(togglingAutoPay || (!autoPay && currentUser?.subscriptionPlan !== 'none')) ? 'opacity-70 grayscale cursor-not-allowed' : ''}`}
                >
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${autoPay ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${autoPay ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
                    {autoPay ? 'Auto-Pay Active' : 'Auto-Pay Disabled'}
                  </span>
                </button>
                <p className="text-[10px] text-gray-400 italic">
                  {autoPay 
                    ? "Next time, you'll be charged automatically to prevent gaps." 
                    : "Turn on Auto-Pay to prevent service interruptions."}
                </p>
              </div>

              <button
                onClick={handleRenewSubscription}
                disabled={processingRenewal || !pricing}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#01467d] hover:bg-[#013a66] text-white rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:hover:scale-100 disabled:opacity-75"
              >
                {processingRenewal ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Renewing
                    Access...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" /> Securely Renew Now
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Normal content wrapped in conditional blur if expired */}
        <div
          className={
            isSubscriptionExpired
              ? "opacity-20 pointer-events-none select-none filter blur-sm transition-all duration-300"
              : ""
          }
        >
          {/* --- Dashboard Identity Header --- */}
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 pb-8 border-b border-gray-100 dark:border-gray-800/60">
            {/* Decorative Glow based on Plan */}
            <div
              className={`absolute -top-10 -left-10 w-40 h-40 blur-[100px] opacity-20 pointer-events-none rounded-full
    ${currentUser?.subscriptionPlan === "freelancer" ? "bg-[#dda431]" : "bg-[#06497f]"}
  `}
            />

            {/* LEFT SIDE: Identity & Welcome */}
            <div className="relative space-y-4">
              {/* DASHBOARD TYPE INDICATOR */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border
        ${
          currentUser?.subscriptionPlan === "freelancer"
            ? "bg-[#dda431] text-white border-[#dda431]"
            : "bg-[#06497f] text-white border-[#06497f]"
        }
      `}
                >
                  {currentUser?.subscriptionPlan === "freelancer" ? (
                    <>
                      <Users className="w-3 h-3" /> Freelancer Dashboard
                    </>
                  ) : (
                    <>
                      <Target className="w-3 h-3" /> Candidate Dashboard
                    </>
                  )}
                </div>
                <span className="h-[1px] w-12 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                  Welcome,{" "}
                  <span
                    className={`bg-gradient-to-r bg-clip-text text-transparent
          ${
            currentUser?.subscriptionPlan === "freelancer"
              ? "from-[#dda431] to-[#b87d1a]"
              : "from-[#06497f] to-[#0a6cb9]"
          }
        `}
                  >
                    {currentUser?.name?.split(" ")[0] || "User"}
                  </span>
                </h1>

                <p className="text-gray-500 dark:text-gray-400 max-w-lg text-sm md:text-base font-medium leading-relaxed">
                  {currentUser?.subscriptionPlan === "freelancer"
                    ? "Manage client projects, track resume versions, and deliver professional results."
                    : "Optimize your career path and manage your applications with AI-powered tools."}
                </p>
              </div>

              {/* Metadata Row: Usage & Status */}
                <div className="flex items-center gap-4 flex-wrap pt-2">
                  {/* Usage Pill */}
                  <div className="flex items-center gap-3 px-4 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
                    <div className="flex -space-x-1">
                      <div className="w-2 h-2 rounded-full bg-[#06497f] animate-pulse" />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      {loading ? "---" : `${resumes.length} Resumes Active`}
                    </span>
                    <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                      Limit:{" "}
                      {currentUser?.subscriptionPlan === "freelancer"
                        ? "100"
                        : "5"}
                    </span>
                  </div>

                  {/* AutoPay Toggle Pill (Only show if Active) */}
                  {autoPay && currentUser?.subscriptionPlan !== 'none' && (
                    <button 
                      onClick={handleToggleAutoPay}
                      disabled={togglingAutoPay}
                      className={`flex items-center gap-3 px-4 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm transition-all hover:border-[#06497f]/30 active:scale-95 ${togglingAutoPay ? 'opacity-50' : ''}`}
                    >
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${autoPay ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${autoPay ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
                        Auto-Pay Active
                      </span>
                    </button>
                  )}
                </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex flex-row items-center gap-3">
              <button
                onClick={fetchResumes}
                disabled={loading}
                className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-500 hover:text-[#06497f] hover:border-[#06497f]/30 transition-all active:scale-90"
                title="Refresh Data"
              >
                <RefreshCw
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>

              <button
                onClick={handleCreateResume}
                className={`flex items-center gap-3 px-7 py-3.5 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95
        ${
          currentUser?.subscriptionPlan === "freelancer"
            ? "bg-[#dda431] hover:bg-[#c59128] shadow-[#dda431]/20"
            : "bg-[#06497f] hover:bg-[#053a66] shadow-[#06497f]/20"
        }
      `}
              >
                <Plus className="h-5 w-5 stroke-[3px]" />
                <span>New Resume</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {!loading && resumes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {resumes.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Updated this week
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {
                        resumes.filter(
                          (r) =>
                            new Date(r.updatedAt) >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Latest
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                      {formatDate(
                        resumes.reduce(
                          (latest, r) =>
                            new Date(r.updatedAt) > new Date(latest)
                              ? r.updatedAt
                              : latest,
                          resumes[0]?.updatedAt || "",
                        ),
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Completion
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {Math.round(
                        (resumes.filter((r) => r.title && r.candidateName)
                          .length /
                          resumes.length) *
                          100,
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-8">
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="flex-1 text-sm text-red-800 dark:text-red-300">
                  {error}
                </p>
                <button
                  onClick={() => setError("")}
                  className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                >
                  <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-gray-200 dark:border-gray-800 border-t-blue-600 rounded-full animate-spin" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Loading your resumes...
              </p>
            </div>
          ) : resumes.length === 0 ? (
            /* Empty State - Updated with Upload button from old dashboard */
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No resumes yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                Start by creating your first resume or upload an existing one to
                get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleUploadResume}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Upload className="h-4 w-4" />
                  Upload Resume
                </button>
                <button
                  onClick={handleCreateResume}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#06497f] hover:bg-[#053a6a] text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Create New Resume
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resumes..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>

                  <button
                    onClick={() =>
                      setViewMode(viewMode === "table" ? "grid" : "table")
                    }
                    className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {viewMode === "table" ? (
                      <Grid className="h-5 w-5" />
                    ) : (
                      <List className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Grid View */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                                {resume.candidateName || "Untitled"}
                                {resume.isAiEnhanced && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-[#dea333] text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                    AI Enhanced
                                  </span>
                                )}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {resume.title || "No title"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>Updated {formatDate(resume.updatedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>Created {formatDate(resume.createdAt)}</span>
                          </div>
                        </div>

                        {/* AI-Enhanced Download Banner */}
                        {resume.isAiEnhanced && !resume.isDownloaded && (
                          <div className="relative mb-3">
                            <div className="flex w-full group">
                              <button
                                onClick={() =>
                                  handleDownloadEnhanced(resume, "pdf")
                                }
                                disabled={downloadingId === resume.id}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-l-lg text-xs font-semibold text-white transition-all border-r border-white/20"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #7c3aed, #4f46e5)",
                                  boxShadow:
                                    downloadingId === resume.id
                                      ? "none"
                                      : "0 0 12px rgba(124,58,237,0.3)",
                                  animation:
                                    downloadingId === resume.id
                                      ? "none"
                                      : "pulse 2s infinite",
                                }}
                              >
                                {downloadingId === resume.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Download className="h-3.5 w-3.5" />
                                )}
                                <span>PDF</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleFormatPickerToggle(resume.id)
                                }
                                className="px-2 py-2 rounded-r-lg text-white transition-all border-l border-black/10 hover:bg-white/10"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #7c3aed, #4f46e5)",
                                }}
                              >
                                <ChevronDown
                                  className={`h-3.5 w-3.5 transition-transform ${formatPickerId === resume.id ? "rotate-180" : ""}`}
                                />
                              </button>
                            </div>

                            {formatPickerId === resume.id && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                  onClick={() =>
                                    handleDownloadEnhanced(resume, "pdf")
                                  }
                                  className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors border-b border-gray-100 dark:border-gray-700"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                  Download as PDF
                                </button>
                                <button
                                  onClick={() =>
                                    handleDownloadEnhanced(resume, "docx")
                                  }
                                  className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                  Download as Word (DOCX)
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/editor/${resume.id}`)}
                            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => navigate(`/preview/${resume.id}`)}
                            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleDeleteResume(resume.id)}
                            disabled={deletingId === resume.id}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                          >
                            {deletingId === resume.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Table View */
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                          <th className="text-left py-3 px-4">
                            <button
                              onClick={() => toggleSort("candidateName")}
                              className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white"
                            >
                              Resume
                              {sortField === "candidateName" &&
                                (sortDirection === "asc" ? (
                                  <SortAsc className="h-3 w-3" />
                                ) : (
                                  <SortDesc className="h-3 w-3" />
                                ))}
                            </button>
                          </th>
                          <th className="text-left py-3 px-4">
                            <button
                              onClick={() => toggleSort("createdAt")}
                              className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white"
                            >
                              Created
                              {sortField === "createdAt" &&
                                (sortDirection === "asc" ? (
                                  <SortAsc className="h-3 w-3" />
                                ) : (
                                  <SortDesc className="h-3 w-3" />
                                ))}
                            </button>
                          </th>
                          <th className="text-left py-3 px-4">
                            <button
                              onClick={() => toggleSort("updatedAt")}
                              className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white"
                            >
                              Modified
                              {sortField === "updatedAt" &&
                                (sortDirection === "asc" ? (
                                  <SortAsc className="h-3 w-3" />
                                ) : (
                                  <SortDesc className="h-3 w-3" />
                                ))}
                            </button>
                          </th>
                          <th className="text-right py-3 px-4">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {paginatedResumes.map((resume) => (
                          <tr
                            key={resume.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white flex gap-2 items-center flex-wrap">
                                  {resume.candidateName || "Untitled"}
                                  {resume.isParsed && (
                                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                      Parsed
                                    </span>
                                  )}
                                  {resume.isAiEnhanced && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-[#dea333] text-white dark:bg-purple-900/30 dark:text-purple-300">
                                      AI Enhanced
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                                  {editingId === resume.id ? (
                                    <>
                                      <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
                                        <input
                                          value={newTitle}
                                          onChange={(e) =>
                                            setNewTitle(e.target.value)
                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                              handleRename(resume.id);
                                            if (e.key === "Escape")
                                              cancelRename();
                                          }}
                                          onBlur={() => handleRename(resume.id)}
                                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                                          autoFocus
                                        />

                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() =>
                                              handleRename(resume.id)
                                            }
                                            disabled={renaming}
                                            className="p-1 rounded-md text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors disabled:opacity-50"
                                            title="Save"
                                          >
                                            {renaming ? (
                                              <svg
                                                className="w-3.5 h-3.5 animate-spin"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                              >
                                                <circle
                                                  className="opacity-25"
                                                  cx="12"
                                                  cy="12"
                                                  r="10"
                                                  stroke="currentColor"
                                                  strokeWidth="4"
                                                ></circle>
                                                <path
                                                  className="opacity-75"
                                                  fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                              </svg>
                                            ) : (
                                              <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M5 13l4 4L19 7"
                                                />
                                              </svg>
                                            )}
                                          </button>

                                          <button
                                            onClick={cancelRename}
                                            className="p-1 rounded-md text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                            title="Cancel"
                                          >
                                            <svg
                                              className="w-3.5 h-3.5"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <span className="truncate max-w-[180px]">
                                        {resume.title || "Untitled"}
                                      </span>

                                      {canRename && (
                                        <button
                                          onClick={() => startRename(resume)}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                                        >
                                          <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                            />
                                          </svg>
                                          Rename
                                        </button>
                                      )}
                                    </>
                                  )}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-gray-700 dark:text-gray-300">
                                {formatDate(resume.createdAt)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(resume.createdAt).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-gray-700 dark:text-gray-300">
                                {formatDate(resume.updatedAt)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(resume.updatedAt).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                {/* AI-Enhanced Download button — table row */}
                                {resume.isAiEnhanced &&
                                  !resume.isDownloaded && (
                                    <div className="relative">
                                      <div className="flex">
                                        <button
                                          onClick={() =>
                                            handleDownloadEnhanced(
                                              resume,
                                              "pdf",
                                            )
                                          }
                                          disabled={downloadingId === resume.id}
                                          className="flex items-center gap-1 px-3 py-1.5 rounded-l-lg text-xs font-semibold text-white transition-all disabled:opacity-70 border-r border-white/20"
                                          style={{
                                            background: "#dea333",
                                            boxShadow:
                                              downloadingId === resume.id
                                                ? "none"
                                                : "0 0 10px rgba(124,58,237,0.3)",
                                          }}
                                        >
                                          {downloadingId === resume.id ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                          ) : (
                                            <Download className="h-3.5 w-3.5" />
                                          )}
                                          <span>PDF</span>
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleFormatPickerToggle(resume.id)
                                          }
                                          className="px-1.5 py-1.5 rounded-r-lg text-white transition-all border-l border-black/10 hover:bg-white/10"
                                          style={{
                                            background: "#dea333",
                                          }}
                                        >
                                          <ChevronDown
                                            className={`h-3.5 w-3.5 transition-transform ${formatPickerId === resume.id ? "rotate-180" : ""}`}
                                          />
                                        </button>
                                      </div>

                                      {formatPickerId === resume.id && (
                                        <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                          <button
                                            onClick={() =>
                                              handleDownloadEnhanced(
                                                resume,
                                                "pdf",
                                              )
                                            }
                                            className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors border-b border-gray-100 dark:border-gray-700"
                                          >
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            PDF Document
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDownloadEnhanced(
                                                resume,
                                                "docx",
                                              )
                                            }
                                            className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                                          >
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            Word (DOCX)
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                <button
                                  onClick={() =>
                                    navigate(`/editor/${resume.id}`)
                                  }
                                  className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    navigate(`/preview/${resume.id}`)
                                  }
                                  className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-colors"
                                  title="Preview"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteResume(resume.id)}
                                  disabled={deletingId === resume.id}
                                  className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                                  title="Delete"
                                >
                                  {deletingId === resume.id ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {resumes.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.min(endIndex, resumes.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {resumes.length}
                    </span>{" "}
                    results
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={i}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === pageNum
                                  ? "bg-[#06497f] text-white"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* AUTO-PAY CANCEL CONFIRMATION MODAL */}
      {showAutoPayCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-800 scale-in-center">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Disable Auto-Pay?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8 px-2">
              If you disable auto-pay, your subscription will end on <span className="font-bold text-gray-700 dark:text-gray-300">{currentUser?.subscriptionExpiry ? format(new Date(currentUser.subscriptionExpiry), 'dd MMM yyyy') : 'expiry'}</span> and will not be renewed automatically.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmAutoPayCancel}
                disabled={togglingAutoPay}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
              >
                {togglingAutoPay ? 'Disabling...' : 'Yes, Stop Auto-Pay'}
              </button>
              <button
                onClick={() => setShowAutoPayCancelModal(false)}
                className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Keep it On
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
