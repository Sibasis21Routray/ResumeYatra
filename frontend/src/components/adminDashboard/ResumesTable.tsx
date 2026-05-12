import React, { useState, useMemo } from 'react';
import { Search, FileText, Eye, Trash2, Calendar, User, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Resume {
  id: string;
  title: string;
  template: string;
  createdAt: string;
  updatedAt: string;
  isParsed: boolean;
  owner: {
    id: string;
    email: string;
    name: string;
  };
}

interface ResumesTableProps {
  resumes: Resume[];
  onViewResume: (id: string, title: string) => void;
  onDownloadResume: (id: string, title: string) => void;
  onDeleteResume: (id: string, title: string) => void;
}

export const ResumesTable: React.FC<ResumesTableProps> = ({ resumes, onViewResume, onDownloadResume, onDeleteResume }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const filteredResumes = useMemo(() => {
    return resumes.filter(resume => {
      const matchesSearch = resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resume.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resume.owner.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUser = userFilter === 'all' || resume.owner.id === userFilter;
      return matchesSearch && matchesUser;
    });
  }, [resumes, searchTerm, userFilter]);

  const paginatedResumes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredResumes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredResumes, currentPage]);

  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);

  const getTemplateBadgeColor = (template: string) => {
    const colors: Record<string, string> = {
      modern: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      professional: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      creative: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      minimal: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[template] || colors.modern;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resume Management</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and manage user resumes</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-[#04477E] focus:border-transparent dark:bg-gray-700 dark:text-white min-w-[180px]"
              >
                {uniqueUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.id === 'all' ? '👥 All Users' : `👤 ${user.name}`}
                  </option>
                ))}
              </select>
              
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, name, or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-[#04477E] focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          {(searchTerm || userFilter !== 'all') && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Found {filteredResumes.length} resume{filteredResumes.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          )}
        </div>
      </div>

      {/* Resume List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <AnimatePresence>
          {paginatedResumes.length > 0 ? (
            paginatedResumes.map((resume, idx) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                            {resume.title}
                          </h4>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTemplateBadgeColor(resume.template)}`}>
                            {resume.template}
                          </span>
                          {resume.isParsed && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              ✓ Parsed
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            by {resume.owner.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Updated {new Date(resume.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button
                      onClick={() => onDownloadResume(resume.id, resume.title)}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => onViewResume(resume.id, resume.title)}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => onDeleteResume(resume.id, resume.title)}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-12 h-12 text-gray-300" />
                <p className="text-gray-500 dark:text-gray-400">No resumes found</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {filteredResumes.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredResumes.length)}</span> of{' '}
            <span className="font-medium">{filteredResumes.length}</span> resumes
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};