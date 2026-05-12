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
} from "lucide-react";
import toast from "react-hot-toast";

interface UploadFormProps {
  onUploadSuccess: (resumeId: string) => void;
}

const LOADING_STEPS = [
  { icon: <Search size={18} />, text: "Scanning document structure..." },
  { icon: <Cpu size={18} />, text: "AI identifying data..." },
  { icon: <Zap size={18} />, text: "Extracting information..." },
  { icon: <ShieldCheck size={18} />, text: "Finalizing data formatting..." },
];

// Allowed file types
const ALLOWED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (uploading && !success) {
      const interval = setInterval(() => {
        setCurrentStep((prev) =>
          prev < LOADING_STEPS.length - 1 ? prev + 1 : prev,
        );
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [uploading, success]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      // Check file type
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
    if (!file) return <Upload className="text-[#055597]" size={24} />;
    
    const isPDF = file.type === "application/pdf";
    const isDOCX = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    
    if (isPDF) return <FileText size={24} className="text-[#055597]" />;
    if (isDOCX) return <File size={24} className="text-[#055597]" />;
    return <FileText size={24} className="text-[#055597]" />;
  };

  const getFileTypeLabel = () => {
    if (!file) return "";
    
    const isPDF = file.type === "application/pdf";
    const isDOCX = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    
    if (isPDF) return "PDF";
    if (isDOCX) return "DOCX";
    return "Document";
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    setCurrentStep(0);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      let token = localStorage.getItem("token");
      let guestId = localStorage.getItem("guestId");

      if (!token && !guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("guestId", guestId);
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

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

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || data.error || "Upload failed");

      if (!data.resume || !data.resume.id) {
        throw new Error("Invalid response from server: missing resume ID");
      }

      const resumeId = data.resume.id;
      if (
        !resumeId ||
        resumeId === "undefined" ||
        resumeId === "null" ||
        resumeId.trim() === ""
      ) {
        throw new Error("Invalid resume ID generated");
      }

      // Finish the steps visually
      setCurrentStep(LOADING_STEPS.length - 1);
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => onUploadSuccess(resumeId), 1500);
      }, 800);
    } catch (err: any) {
      console.error("[UploadForm] Upload error:", err);
      setError(err.message || "Failed to parse resume. Please try again.");
      toast.error(err.message || "Failed to parse resume. Please try again.");
      setUploading(false);
      setCurrentStep(0);
      setUploadProgress(0);
    }
  };

  return (
    <div className=" w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* LEFT COLUMN: COMPACT UPLOAD FORM */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 lg:p-10 h-full flex flex-col justify-between transition-all duration-500">
          <div>
            <header className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#055597]/5 border border-[#055597]/10 text-[#055597] text-[10px] font-black uppercase tracking-widest mb-4">
                <Sparkles size={12} className="fill-current" />
                AI Smart Import
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Ready to Start?
              </h1>
              <p className="text-gray-500 mt-2 text-sm font-medium">
                Upload your PDF or DOCX and let our AI handle the rest.
              </p>
            </header>

            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  isDragActive
                    ? "border-[#055597] bg-[#055597]/5"
                    : "border-gray-200 bg-gray-50/50 hover:border-[#055597]/40"
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-[#055597]" size={24} />
                </div>
                <p className="text-sm font-bold text-gray-700">
                  Drag your PDF or DOCX here
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Maximum size: 10MB • Supports PDF and DOCX
                </p>
              </div>
            ) : (
              <div className="relative bg-[#055597]/5 border border-[#055597]/10 p-5 rounded-3xl flex items-center gap-4 animate-scaleIn">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  {getFileIcon()}
                </div>
                <div className="flex-grow overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {getFileTypeLabel()}
                  </p>
                </div>
                {!uploading && (
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} />
                <span className="text-xs font-bold">{error}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="mt-8 w-full group flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold transition-all hover:bg-[#055597] disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
          >
            <span >
              {uploading ? "Analyzing..." : "Process with ResumeYatra"}
            </span>
            <ArrowLeft
              size={20}
              className={`rotate-180 transition-transform ${uploading ? "animate-pulse" : "group-hover:translate-x-1"}`}
            />
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: IMAGE -> LOADER TRANSITION */}
      <div className="lg:col-span-7 relative min-h-[500px] ">
        {!uploading && !success ? (
          /* INITIAL IMAGE STATE */
          <div className="h-full w-full  rounded-[2.5rem] shadow-xl border bg-white border-gray-100 overflow-hidden flex flex-col items-center justify-center p-12 animate-fadeIn">
            <img
              src="https://img.freepik.com/premium-vector/man-with-resume_118813-4837.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Resume Illustration"
              className="w-full max-w-sm object-contain mb-8 "
            />
            <div className="text-center">
              <h3 className="text-xl font-black text-gray-900">
                AI-Powered Extraction
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Our neural networks identify sections, skills, and metrics to
                build your perfect profile. Supports PDF and DOCX formats.
              </p>
            </div>
          </div>
        ) : (
          /* LOADING & SUCCESS STATE */
          <div
            className={`h-full  w-full rounded-[2.5rem] p-12 text-center border transition-all duration-500 flex flex-col items-center justify-center ${
              success
                ? "bg-white border-gray-100 shadow-2xl animate-scaleIn"
                : "bg-white backdrop-blur-xl border-white shadow-2xl animate-fadeIn"
            }`}
          >
            {success ? (
              <>
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                   <img
              src="./like.gif"
              alt="Success"
              className="w-full max-w-sm object-contain mb-8 "
            />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-2">
                  Success!
                </h2>
                <p className="text-gray-500 text-lg">
                  Your data is ready for the editor.
                </p>
              </>
            ) : (
              <>
                <div className="relative w-28 h-28 mx-auto mb-10">
                  <div className="absolute inset-0 border-4 border-[#055597]/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-[#055597] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="./upload-file.gif"
                      alt="Upload"
                      className="w-20 h-20 rounded-full"
                    />
                  </div>
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">
                  AI is Analyzing...
                </h2>

                <div className="w-full max-w-xs space-y-5">
                  {LOADING_STEPS.map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-4 transition-all duration-500 font-semibold ${
                        idx === currentStep
                          ? "text-[#055597] scale-105 font-bold"
                          : idx < currentStep
                            ? "text-gray-800"
                            : "text-gray-300"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          idx < currentStep
                            ? " text-green-500"
                            : idx === currentStep
                              ? "bg-[#055597] text-white"
                              : "bg-gray-100"
                        }`}
                      >
                        {idx < currentStep ? (
                          <CheckCircle size={32} />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <span className="text-md text-left">{step.text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Update the Page component to handle the new width
export function UploadPage() {
  const navigate = useNavigate();

  return (
          <div
  className="min-h-screen flex flex-col font-sans bg-cover bg-center bg-no-repeat backdrop-blur-sm "
  // style={{
  //   backgroundImage: "url('https://sb.kaleidousercontent.com/67418/2270x1314/2115cfbc52/screenshot-2022-04-21-at-17-31-59.png')"
  // }}
>
  {/* <div className="absolute inset-0 bg-[radial-gradient(transparent_40%,rgba(0,0,0,0.8))]" /> */}

      {/* Content (needs relative z-index) */}
      <div className="relative z-10 flex-1">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#055597]/5 blur-[120px]" />
          <div className="absolute bottom-[-5%] left-[5%] w-[30%] h-[30%] rounded-full bg-[#055597]/5 blur-[100px]" />
        </div>

         <header className="bg-white px-6 py-4 flex justify-between items-center text-white shadow-lg sticky top-0 z-50 ">
                <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <img className='h-10 sm:h-12' src="./logo.png" alt="ResumeYatra Logo" />
                </Link>
                 <Link to="/templates" className="flex items-center gap-2 hover:opacity-90 transition-opacity ">
                  <img className='h-10 sm:h-12' src="./resume.gif" alt="Resume Templates" />
                  <span className="text-gray-700 hover:text-[#055597]">Use Templates</span>
                </Link>
              
              </header>

        <main className="relative flex-grow flex items-center justify-center py-16 px-6 lg:px-12 ">
          <UploadForm onUploadSuccess={(id) => navigate(`/editor/${id}`)} />
        </main>
      </div>
    </div>
  );
}