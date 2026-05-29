import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Zap,
  Search,
  Cpu,
  X,
  File,
  ArrowRight,
  Clock,
  Award,
  Building2,
  GraduationCap,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Calendar,
  Code,
  Languages,
  Trophy,
  BookOpen,
  Heart,
  Lightbulb,
  Target,
  Users,
  BarChart,
  PenTool,
  Settings,
  Star,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";

interface UploadFormProps {
  onUploadSuccess: (resumeId: string) => void;
}

const BLUE = "#055597"
const ACCENT_YELLOW = "#d29e3f"
const WHITE = "#ffffff"
const TEXT_MUTED = "#64748b"

const LOADING_STEPS = [
  { icon: <Search size={16} />, text: "Scanning document structure" },
  { icon: <Cpu size={16} />, text: "AI identifying data patterns" },
  { icon: <Zap size={16} />, text: "Extracting key information" },
  { icon: <ShieldCheck size={16} />, text: "Formatting and validation" },
];

const ALLOWED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

// Feature cards data
const FEATURES = [
  { icon: <User size={18} />, title: "Personal Details", description: "Name, email, phone, location, LinkedIn, portfolio" },
  { icon: <Briefcase size={18} />, title: "Work Experience", description: "Extract job history, roles, and achievements" },
  { icon: <GraduationCap size={18} />, title: "Education", description: "Parse degrees, institutions, and dates" },
  { icon: <Award size={18} />, title: "Skills", description: "Identify technical and soft skills" },
  { icon: <Building2 size={18} />, title: "Projects", description: "Extract project details and accomplishments" },
  { icon: <Star size={18} />, title: "Many More", description: "Certifications, languages, achievements, references & more" },
];

function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (uploading && !success) {
      const interval = setInterval(() => {
        setCurrentStep((prev) =>
          prev < LOADING_STEPS.length - 1 ? prev + 1 : prev,
        );
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [uploading, success]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      const isPDF = selectedFile.type === "application/pdf";
      const isDOCX = selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      
      if (!isPDF && !isDOCX) {
        setError("Please upload a PDF or DOCX file only.");
        setFile(null);
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB.");
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_FILE_TYPES,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: uploading,
  });

  const getFileIcon = () => {
    if (!file) return <Upload size={22} />;
    const isPDF = file.type === "application/pdf";
    return isPDF ? <FileText size={22} /> : <File size={22} />;
  };

  const getFileTypeLabel = () => {
    if (!file) return "";
    const isPDF = file.type === "application/pdf";
    return isPDF ? "PDF" : "DOCX";
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    setCurrentStep(0);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      let token = localStorage.getItem("token");
      let guestId = localStorage.getItem("guestId");

      if (!token && !guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("guestId", guestId);
      }

      const headers: any = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else if (guestId) {
        headers["x-guest-id"] = guestId;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/resumes/upload`,
        {
          method: "POST",
          headers,
          body: formData,
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || data.error || "Upload failed");

      if (!data.resume || !data.resume.id) {
        throw new Error("Invalid response from server: missing resume ID");
      }

      const resumeId = data.resume.id;
      if (!resumeId || resumeId === "undefined" || resumeId === "null" || resumeId.trim() === "") {
        throw new Error("Invalid resume ID generated");
      }

      setCurrentStep(LOADING_STEPS.length - 1);
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => onUploadSuccess(resumeId), 1200);
      }, 600);
    } catch (err: any) {
      console.error("[UploadForm] Upload error:", err);
      setError(err.message || "Failed to parse resume. Please try again.");
      toast.error(err.message || "Failed to parse resume. Please try again.");
      setUploading(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      
 {/* ── HEADER SECTION ────────────────────────────────────────────────── */}
        <header
         
          style={{
            background: WHITE,
            padding: "48px 24px 36px 24px",
            textAlign: "center",
            borderBottom: "1px solid #eef2f6",
            boxShadow: "0 10px 40px rgba(5, 85, 151, 0.02)",
          }}
        >
          <div className="flex flex-col justify-center items-center">
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 12px 0",
                letterSpacing: "-0.025em",
              }}
            >
              Upload Your Resume
            </h1>

            <div
              style={{
                width: 48,
                height: 3,
                background: ACCENT_YELLOW,
                borderRadius: 2,
                display: "block",
                border: "none",
              }}
            />

            <p
              style={{
                fontSize: "15px",
                color: TEXT_MUTED,
                lineHeight: "1.5",
                maxWidth: "720px",
                margin: "20px 0",
                fontWeight: 400,
              }}
            >
             Our AI extracts your information and creates an ATS-optimized resume in seconds.


            </p>

            <p
              style={{
                fontSize: "13px",
                color: BLUE,
                fontWeight: 600,
                margin: "0 0 28px 0",
                letterSpacing: "-0.01em",
              }}
            >
              AI-Powered Resume Parser
            </p>

          </div>
        </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Upload Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Upload Document</h2>
              <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOCX (Max 10MB)</p>
            </div>

            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  isDragActive
                    ? "border-[#055597] bg-[#055597]/5"
                    : "border-gray-300 bg-gray-50 hover:border-[#055597]/40 hover:bg-gray-100/50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-12 h-12  rounded-lg flex items-center justify-center mx-auto mb-3 ">
                  <Upload size={20} className="text-[#055597]" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Drag & drop or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF or DOCX up to 10MB</p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10  flex items-center justify-center ">
                  {getFileIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {getFileTypeLabel()}
                  </p>
                </div>
                {!uploading && (
                  <button
                    onClick={() => setFile(null)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-100">
                <AlertCircle size={14} />
                <span className="text-xs">{error}</span>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#055597] text-white rounded-lg font-medium transition-all hover:bg-[#04447a] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{uploading ? "Processing..." : "Process Resume"}</span>
              {!uploading && <ArrowRight size={16} />}
            </button>

            {/* Secure notice */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} />
                Secure & Private
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="flex items-center gap-1">
                <Clock size={12} />
                Instant Parsing
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - AI Processing / Features */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
            {!uploading && !success ? (
              // Features Showcase
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-5 bg-[#055597] rounded-full" />
                  <h3 className="text-base font-semibold text-gray-800">What gets extracted</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {FEATURES.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/30">
                      <div className="text-[#055597] mt-0.5">{feature.icon}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{feature.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-3 bg-blue-50/30 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#055597]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles size={12} className="text-[#055597]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold">AI Intelligence:</span> Our parser identifies contact details, work history, education, skills, certifications, and project experience from your document.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Processing State
              <div className="p-8 text-center">
                {success ? (
                  <div className="animate-in fade-in duration-500">
                    <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Resume Parsed Successfully</h3>
                    <p className="text-gray-500 text-sm">Redirecting to editor...</p>
                  </div>
                ) : (
                  <>
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 border-3 border-gray-100 rounded-full" />
                      <div className="absolute inset-0 border-3 border-t-[#055597] rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText size={24} className="text-[#055597]" />
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-5">AI Processing Your Resume</h3>

                    <div className="max-w-xs mx-auto space-y-3">
                      {LOADING_STEPS.map((step, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 transition-all duration-300 ${
                            idx === currentStep
                              ? "opacity-100"
                              : idx < currentStep
                              ? "opacity-60"
                              : "opacity-30"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${
                              idx < currentStep
                                ? "bg-green-100 text-green-500"
                                : idx === currentStep
                                ? "bg-[#055597] text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {idx < currentStep ? (
                              <CheckCircle size={14} />
                            ) : (
                              step.icon
                            )}
                          </div>
                          <span className={`text-sm ${
                            idx === currentStep ? "text-gray-800 font-medium" : "text-gray-500"
                          }`}>
                            {step.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Upload Page Component
export function UploadPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  font-sans">


      {/* Header */}
        <header className=" px-6 py-4 flex justify-start gap-3 items-center text-white shadow-lg sticky top-0 z-50 ">
           <button
            onClick={() => navigate("/onboarding")}
            style={{
             
              left: "16px",
              top: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: WHITE,
              border: "1px solid #e2e8f0",
              color: BLUE,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.borderColor = BLUE;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = WHITE;
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
                <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <img className='h-10 sm:h-12' src="./logo.png" alt="ResumeYatra Logo" />
                </Link>
                 {/* <Link to="/templates" className="flex items-center gap-2 hover:opacity-90 transition-opacity ">
                  <img className='h-10 sm:h-12' src="./resume.gif" alt="Resume Templates" />
                  <span className="text-gray-700 hover:text-[#055597]">Use Templates</span>
                </Link> */}
              
              </header>

      {/* Main Content */}
      <main className="py-2 px-6">
        <UploadForm onUploadSuccess={(id) => navigate(`/editor/${id}`)} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400">
            © 2024 ResumeYatra. All rights reserved. Your data is secure.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .border-3 {
          border-width: 3px;
        }
        .animate-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}