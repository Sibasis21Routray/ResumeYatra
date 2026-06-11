import React, { useState, useMemo } from 'react';
import { Download, Search, FileText, Eye, Trash2, Calendar, User, ChevronLeft, ChevronRight, Option, LucideOption, Brain, BrainCircuit, Grid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {  ChevronDown, Zap, Users, X } from 'lucide-react';

interface Resume {
  id: string;
  title: string;
  template: string;
  createdAt: string;
  updatedAt: string;
  isParsed: boolean;
  isAiEnhanced: boolean;
  owner: {
    id: string;
    email: string;
    name: string;
  };
}

// Updated to perfectly match the TokenUsage type signature from your code snippet
interface TokenUsageRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  category: string;
  action: string;
  resumeId?: string;
  model: string;
  date: string;
}

interface ResumesTableProps {
  resumes: Resume[];
  tokenUsage?: TokenUsageRecord[];
  onViewResume: (id: string, title: string) => void;
  onDownloadResume: (id: string, title: string) => void;
  onDeleteResume: (id: string, title: string) => void;
}

export const ResumesTable: React.FC<ResumesTableProps> = ({ 
  resumes, 
  tokenUsage = [], 
  onViewResume, 
  onDownloadResume, 
  onDeleteResume 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all'); // Added Category state filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Group token logs uniquely by RESUME identifier (new) AND User identifier (legacy)
  const categorizedTokenStats = useMemo(() => {
    const resumeStats: Record<string, Record<string, { input: number; output: number; total: number }>> = {};
    const legacyUserStats: Record<string, Record<string, { input: number; output: number; total: number }>> = {};
    
    tokenUsage.forEach((log) => {
      const category = log.category || 'Parsing';
      const stats = { input: log.inputTokens || 0, output: log.outputTokens || 0, total: log.totalTokens || 0 };

      // 1. Precise Mapping (Preferred)
      if (log.resumeId) {
        const rKey = log.resumeId.toString();
        if (!resumeStats[rKey]) resumeStats[rKey] = {};
        if (!resumeStats[rKey][category]) resumeStats[rKey][category] = { input: 0, output: 0, total: 0 };
        resumeStats[rKey][category].input += stats.input;
        resumeStats[rKey][category].output += stats.output;
        resumeStats[rKey][category].total += stats.total;
      } 
      // 2. Legacy Mapping (Fallback for logs created before the resumeId fix)
      else {
        const uKey = (log.userEmail || log.userId || '').toString().toLowerCase().trim();
        if (uKey) {
          if (!legacyUserStats[uKey]) legacyUserStats[uKey] = {};
          if (!legacyUserStats[uKey][category]) legacyUserStats[uKey][category] = { input: 0, output: 0, total: 0 };
          legacyUserStats[uKey][category].input += stats.input;
          legacyUserStats[uKey][category].output += stats.output;
          legacyUserStats[uKey][category].total += stats.total;
        }
      }
    });
    
    return { resumeStats, legacyUserStats };
  }, [tokenUsage]);

  // Safely grab contextual metrics mapped to an individual resume
  const getMetricsForResume = (resume: Resume) => {
    const { resumeStats, legacyUserStats } = categorizedTokenStats;
    const rKey = resume.id;
    const uKey = (resume.owner.email || resume.owner.id || '').toLowerCase().trim();

    const getCategoryStats = (category: string) => {
      // 1. Precise Match (Always prioritized)
      if (resumeStats[rKey]?.[category]) {
        return resumeStats[rKey][category];
      }
      
      // 2. Specialized Fallback Logic
      
      // For AI Enhancement: Only show legacy tokens if the resume is actually marked as enhanced
      // This prevents historic tokens from showing up on a new parse
      if (category === 'AI Enhancement') {
        if (!resume.isAiEnhanced) return { input: 0, output: 0, total: 0 };
      }
      
      // For Parsing: Only show legacy tokens if the resume is marked as parsed
      if (category === 'Parsing') {
        if (!resume.isParsed) return { input: 0, output: 0, total: 0 };
      }

      // Otherwise fallback to legacy user stats for logs that don't have a resumeId
      return legacyUserStats[uKey]?.[category] || { input: 0, output: 0, total: 0 };
    };
    
    return {
      parsing: getCategoryStats('Parsing'),
      aiEnhancement: getCategoryStats('AI Enhancement')
    };
  };

  const uniqueUsers = useMemo(() => {
    const userMap = new Map();
    resumes.forEach(resume => {
      if (!userMap.has(resume.owner.id)) {
        userMap.set(resume.owner.id, {
          id: resume.owner.id,
          name: resume.owner.name,
          email: resume.owner.email
        });
      }
    });
    return [{ id: 'all', name: 'All Users', email: '' }, ...Array.from(userMap.values())];
  }, [resumes]);

  // Synchronous multi-step evaluation block
  const filteredResumes = useMemo(() => {
    return resumes.filter(resume => {
      const matchesSearch = 
        resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.owner.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUser = userFilter === 'all' || resume.owner.id === userFilter;
      
      let matchesCategory = true;
      if (categoryFilter !== 'all') {
        const { parsing, aiEnhancement } = getMetricsForResume(resume);
        if (categoryFilter === 'Parsing') {
          matchesCategory = parsing.total > 0 || resume.isParsed;
        } else if (categoryFilter === 'AI Enhancement') {
          matchesCategory = aiEnhancement.total > 0;
        }
      }

      return matchesSearch && matchesUser && matchesCategory;
    });
  }, [resumes, searchTerm, userFilter, categoryFilter, categorizedTokenStats]);

  const paginatedResumes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredResumes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredResumes, currentPage]);

  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);



  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Search and Filters Layout — Styled exactly like Image 1 */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#114E7F]">Resume Management</h3>
              <p className="text-sm text-gray-500 mt-1">Review user resumes alongside comprehensive metric logs</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
  {/* Category Dropdown */}
  <div className="relative">
    <Grid className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    <select
      value={categoryFilter}
      onChange={(e) => {
        setCategoryFilter(e.target.value);
        setCurrentPage(1);
      }}
      className="pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#114E7F]/20 focus:border-[#114E7F] bg-white text-gray-700 cursor-pointer hover:bg-gray-50 transition-all appearance-none min-w-[150px]"
    >
      <option value="all">All Categories</option>
      <option value="Parsing">Parsing</option>
      <option value="AI Enhancement">AI Enhancement</option>
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>

  {/* Users Dropdown */}
  <div className="relative">
    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    <select
      value={userFilter}
      onChange={(e) => {
        setUserFilter(e.target.value);
        setCurrentPage(1);
      }}
      className="pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#114E7F]/20 focus:border-[#114E7F] bg-white text-gray-700 cursor-pointer hover:bg-gray-50 transition-all appearance-none min-w-[160px]"
    >
      {uniqueUsers.map(user => (
        <option key={user.id} value={user.id}>
          {user.id === 'all' ? 'All Users' : user.name}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
  
  {/* Search Input */}
  <div className="relative flex-1 min-w-[240px]">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      placeholder="Search by title, name, or email..."
      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#114E7F]/20 focus:border-[#114E7F] bg-white text-gray-700 placeholder:text-gray-400 transition-all"
    />
  </div>
</div>
          </div>
        </div>
      </div>

      {/* Main Table Content Body */}
      <div className="divide-y divide-gray-200">
        <AnimatePresence mode="popLayout">
          {paginatedResumes.length > 0 ? (
            paginatedResumes.map((resume, idx) => {
              const { parsing, aiEnhancement } = getMetricsForResume(resume);

              return (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.15,
                    delay: Math.min(idx * 0.02, 0.15),
                  }}
                  className="px-6 py-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    {/* Left Info Frame: File Title and Metadata Badge Markers */}
                    <div className="flex-1 w-full">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-xl mt-0.5">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-semibold text-gray-900">
                              {resume.title.replace(
                                /^Uploaded Resume\s*-\s*/i,
                                "",
                              )}
                            </h4>
                            {/* <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700`}
                            >
                              {resume.template}
                            </span>
                            {resume.isParsed && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                Parsed
                              </span>
                            )}
                            {resume.isAiEnhanced && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-[#DA9F33]">
                                AI Enhanced
                              </span>
                            )} */}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              by{" "}
                              <span className="font-medium text-gray-700">
                                {resume.owner.name}
                              </span>
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Updated{" "}
                              {new Date(resume.updatedAt).toLocaleString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Info Frame: Operations Buttons & Dynamic Metrics Aggregators */}
<div className="flex flex-col items-end gap-2 w-full lg:w-auto">
  {/* Action Buttons Group */}
  <div className="flex items-center gap-1">
    <button
      onClick={() => onDownloadResume(resume.id, resume.title)}
      className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all duration-200"
      title="Download Resume"
    >
      <Download className="w-4 h-4" />
    </button>
    <button
      onClick={() => onViewResume(resume.id, resume.title)}
      className="p-1.5 text-gray-400 hover:text-[#114E7F] hover:bg-blue-50 rounded-md transition-all duration-200"
      title="View Resume"
    >
      <Eye className="w-4 h-4" />
    </button>
    <button
      onClick={() => onDeleteResume(resume.id, resume.title)}
      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
      title="Delete Resume"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>

  {/* Token Metrics - Compact Row Format */}
  <div className="flex items-center gap-2 flex-wrap justify-end">
    {/* AI Enhancement Metrics */}
    {(categoryFilter === "all" || categoryFilter === "AI Enhancement") &&
      (aiEnhancement.total > 0 || categoryFilter === "AI Enhancement") && (
        <div className="flex items-center gap-2 text-xs">
          <span className="px-1.5 py-0.5 text-amber-600 font-semibold text-[10px] tracking-wider">
            AI
          </span>
          <span className="text-gray-400">In <span className="font-mono text-gray-600">{aiEnhancement.input.toLocaleString()}</span></span>
          <span className="text-gray-400">Out <span className="font-mono text-gray-600">{aiEnhancement.output.toLocaleString()}</span></span>
          <span className="text-amber-600 font-bold">Total  : {aiEnhancement.total.toLocaleString()}</span>
        </div>
      )}

    {/* Separator */}
    {(categoryFilter === "all" || 
      (aiEnhancement.total > 0 && parsing.total > 0)) && (
      <div className="w-px h-3 bg-gray-200"></div>
    )}

    {/* Parsing Metrics */}
    {(categoryFilter === "all" || categoryFilter === "Parsing") &&
      (parsing.total > 0 || resume.isParsed || categoryFilter === "Parsing") && (
        <div className="flex items-center gap-2 text-xs">
          <span className="px-1.5 py-0.5 text-[#114E7F] font-semibold text-[10px] tracking-wider">
            PARSE
          </span>
          <span className="text-gray-400">In <span className="font-mono text-gray-600">{parsing.input.toLocaleString()}</span></span>
          <span className="text-gray-400">Out <span className="font-mono text-gray-600">{parsing.output.toLocaleString()}</span></span>
          <span className="text-[#114E7F] font-bold">Total  : {parsing.total.toLocaleString()}</span>
        </div>
      )}
  </div>
</div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-12 h-12 text-gray-300" />
                <p className="text-gray-500 text-sm">No resumes match your applied combination filters</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Footer */}
      {filteredResumes.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredResumes.length)}</span> of{' '}
            <span className="font-medium">{filteredResumes.length}</span> resumes
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};