import React, { useState, useEffect, useRef } from 'react';
import { adminAPI, pricingAPI, resumeAPI } from '../services/apiClient';
import toast from 'react-hot-toast';
import { X, AlertCircle, RefreshCw } from 'lucide-react';
import { AdminHeader } from '../components/adminDashboard/AdminHeader';
import { StatsOverview } from '../components/adminDashboard/StatsOverview';
import { UsersTable } from '../components/adminDashboard/UsersTable';
import { ResumesTable } from '../components/adminDashboard/ResumesTable';
import { TokenUsageTable } from '../components/adminDashboard/TokenUsageTable';
import { PricingConfig } from '../components/adminDashboard/PricingConfig';

// --- Interfaces ---

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  subscriptionPlan: string;
  _count: { resumes: number };
}

interface Resume {
  id: string;
  title: string;
  template: string;
  createdAt: string;
  updatedAt: string;
  isParsed: boolean;
  owner: { id: string; email: string; name: string };
}

interface Stats {
  users: number;
  resumes: number;
  templates: number;
  activeSubscriptions?: number;
  revenue?: number;
  aiCreditsUsed?: number;
  freelancerCount?: number;
  candidateCount?: number;
  totalAiEnhancements?: number;
  aiAdoptionRate?: number;
}

// --- Modals ---

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-center mb-4">
          <div className={`p-3 rounded-full ${type === 'user' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
            <AlertCircle className={`w-6 h-6 ${type === 'user' ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`} />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ResumeViewModal = ({ isOpen, onClose, resumeId, resumeTitle }: any) => {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen && resumeId) {
      fetchResumePreview();
    }
  }, [isOpen, resumeId]);

  const fetchResumePreview = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminAPI.getResume(resumeId);
      const resumeData = response.data;
      
      if (!resumeData) {
        throw new Error('No resume data found');
      }
      
      const currentVersion = resumeData?.versions?.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      
      const template = resumeData.template || 'modern';
      const resumeContent = currentVersion?.data || {};
      
      if (!resumeContent || Object.keys(resumeContent).length === 0) {
        throw new Error('Resume has no content to display');
      }
      
      const previewResponse = await resumeAPI.preview(
        resumeId,
        template,
        null,
        resumeContent
      );
      
      let htmlContent = previewResponse.data;
      
      const modalStyles = `
        <style>
          * { box-sizing: border-box; }
          html {
            background-color: #f3f4f6 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
          }
          body {
            background-color: white !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 30px auto !important;
            padding: 40px 50px !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02) !important;
            color: #1a1a1a !important;
            position: relative !important;
          }
          /* Ensure all templates fill the A4 width */
          .resume-container, .resume-wrapper, .page, .A4, [class*="resume-content"] {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #f1f1f1; }
          ::-webkit-scrollbar-thumb { background: #04477E; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #03315c; }
        </style>
      `;
      
      // Clean the HTML from any pre-existing margins/auto-centering that might conflict
      let cleanedHtml = htmlContent.replace(/margin:\s*0\s*auto/g, 'margin: 0');
      cleanedHtml = cleanedHtml.replace(/max-width:\s*\d+px/g, 'max-width: 100%');
      
      if (cleanedHtml.includes('</head>')) {
        htmlContent = cleanedHtml.replace('</head>', `${modalStyles}</head>`);
      } else if (cleanedHtml.includes('<body')) {
        htmlContent = cleanedHtml.replace('<body', `<head>${modalStyles}</head><body`);
      } else {
        htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8">${modalStyles}</head><body>${cleanedHtml}</body></html>`;
      }
      
      setPreviewHtml(htmlContent);
    } catch (err: any) {
      console.error('Failed to load resume preview:', err);
      setError(err.message || 'Failed to load resume preview.');
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => setZoomLevel(Math.min(200, zoomLevel + 10));
  const handleZoomOut = () => setZoomLevel(Math.max(50, zoomLevel - 10));
  const handleZoomReset = () => setZoomLevel(100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resume Preview</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{resumeTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 dark:bg-gray-900 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Zoom:</span>
            <button onClick={handleZoomOut} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" disabled={zoomLevel <= 50}>
              <X className="w-3 h-1 bg-gray-500" />
            </button>
            <span className="text-sm font-medium min-w-[60px] text-center dark:text-gray-300">{zoomLevel}%</span>
            <button onClick={handleZoomIn} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" disabled={zoomLevel >= 200}>
              <span className="text-lg leading-none dark:text-gray-300">+</span>
            </button>
            <button onClick={handleZoomReset} className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-300">Reset</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-gray-900">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw className="w-10 h-10 text-[#04477E] animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                <p className="text-red-500">{error}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center origin-top" style={{ transform: `scale(${zoomLevel / 100})` }}>
              <iframe 
                ref={iframeRef} 
                srcDoc={previewHtml} 
                className="w-[210mm] h-[297mm] border-0 bg-white shadow-xl"
                title="Resume Preview"
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-xl font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [tokenUsage, setTokenUsage] = useState([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'resumes' | 'token-usage' | 'pricing'>('overview');
  const [pricing, setPricing] = useState(null);
  
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: 'user' as 'user' | 'resume',
    id: '',
    name: ''
  });
  
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    id: '',
    title: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, resumesRes, pricingRes, tokenRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getResumes(),
        pricingAPI.get().catch(() => ({ data: null })),
        adminAPI.getTokenUsage().catch(() => ({ data: [] }))
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setTokenUsage(tokenRes.data);
      if (pricingRes.data) setPricing(pricingRes.data);
      setResumes((resumesRes.data || []).filter((r: Resume) => r.id && r.id !== 'undefined'));
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await adminAPI.deleteUser(deleteModal.id);
      setUsers(users.filter(u => u.id !== deleteModal.id));
      setStats(prev => prev ? { ...prev, users: prev.users - 1 } : null);
      toast.success('User deleted successfully');
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleteModal({ isOpen: false, type: 'user', id: '', name: '' });
    }
  };

  const handleDeleteResume = async () => {
    try {
      await adminAPI.deleteResume(deleteModal.id);
      setResumes(resumes.filter(r => r.id !== deleteModal.id));
      setStats(prev => prev ? { ...prev, resumes: prev.resumes - 1 } : null);
      toast.success('Resume deleted successfully');
    } catch {
      toast.error('Failed to delete resume');
    } finally {
      setDeleteModal({ isOpen: false, type: 'resume', id: '', name: '' });
    }
  };

  const handleDownloadResume = async (id: string, title: string) => {
    try {
      toast.loading('Preparing download...', { id: 'download' });
      const response = await resumeAPI.export(id, 'pdf');
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started', { id: 'download' });
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Failed to download resume', { id: 'download' });
    }
  };

  const handleSavePricing = async (newPricing: any) => {
    try {
      await pricingAPI.update(newPricing);
      setPricing(newPricing);
      toast.success('Pricing configuration updated');
    } catch {
      toast.error('Failed to update pricing');
    }
  };

  const handleUploadSignature = async (file: File) => {
    try {
      const response = await (adminAPI as any).uploadSignature(file);
      return response.data.signatureUrl;
    } catch {
      toast.error('Failed to upload signature');
      throw new Error('Upload failed');
    }
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen  flex items-center justify-center">
  //       <div className="text-center">
  //         <RefreshCw className="w-12 h-12 text-[#04477E] animate-spin mx-auto mb-4" />
  //         <p className="text-gray-500 font-medium">Loading Admin Dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={deleteModal.type === 'user' ? handleDeleteUser : handleDeleteResume}
        title={`Delete ${deleteModal.type === 'user' ? 'User' : 'Resume'}`}
        message={`Are you sure you want to delete ${deleteModal.name}? This action cannot be undone.`}
        type={deleteModal.type}
      />

      <ResumeViewModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, id: '', title: '' })}
        resumeId={viewModal.id}
        resumeTitle={viewModal.title}
      />

      <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && (
          <StatsOverview stats={stats} onTabChange={setActiveTab} />
        )}

        {activeTab === 'users' && (
          <UsersTable users={users} onDeleteUser={(id, name) => setDeleteModal({ isOpen: true, type: 'user', id, name })} />
        )}

        {activeTab === 'resumes' && (
          <ResumesTable 
            resumes={resumes} 
            onViewResume={(id, title) => setViewModal({ isOpen: true, id, title })}
            onDownloadResume={handleDownloadResume}
            onDeleteResume={(id, title) => setDeleteModal({ isOpen: true, type: 'resume', id, name: title })}
          />
        )}

        {activeTab === 'token-usage' && (
          <TokenUsageTable tokenUsage={tokenUsage} onRefresh={fetchData} />
        )}

        {activeTab === 'pricing' && pricing && (
          <PricingConfig 
            pricing={pricing} 
            onSave={handleSavePricing}
            onUploadSignature={handleUploadSignature}
          />
        )}
      </main>

      {loading && (
        <div className="absolute inset-0  backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-[#04477E] animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}