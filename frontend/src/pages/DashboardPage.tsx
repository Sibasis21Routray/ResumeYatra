import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resumeAPI } from '../services/apiClient';
import {
  Edit,
  Eye,
  Trash2,
  Plus,
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
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { format } from 'date-fns';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/home/Navbar';

interface Resume {
  id: string;
  title: string;
  candidateName: string;
  createdAt: string;
  updatedAt: string;
}

export function DashboardPage() {
  const { theme } = useTheme();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paginatedResumes, setPaginatedResumes] = useState<Resume[]>([]);
  
  // Sorting and filtering
  const [sortField, setSortField] = useState<'createdAt' | 'updatedAt' | 'candidateName'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Calculate pagination
  const totalPages = Math.ceil(resumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  useEffect(() => {
    fetchResumes();
    try {
      const raw = localStorage.getItem('user');
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch (err) {
      // ignore
    }
  }, []);

  // Apply sorting and filtering whenever resumes, sortField, sortDirection, or searchTerm changes
  useEffect(() => {
    let filtered = [...resumes];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(resume => 
        (resume.candidateName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resume.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resume.id?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setPaginatedResumes(filtered.slice(startIndex, endIndex));
  }, [resumes, sortField, sortDirection, searchTerm, currentPage, itemsPerPage, startIndex, endIndex]);

  const fetchResumes = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await resumeAPI.list();
      const resumeArray = Array.isArray(response.data) ? response.data : [];

      const validResumes = resumeArray.filter((resume: Resume) => {
        const isValid = resume &&
          resume.id &&
          resume.id !== 'undefined' &&
          resume.id !== 'null' &&
          typeof resume.id === 'string' &&
          resume.id.trim() !== '' &&
          resume.id.length >= 10;

        return isValid;
      });

      setResumes(validResumes);
      setCurrentPage(1); // Reset to first page on new data
    } catch (err: any) {
      console.error('[DashboardPage] Fetch resumes error:', err);
      let errorMessage = 'Failed to fetch resumes. Please try again.';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. You may not have permission to view these resumes.';
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

  const handleCreateResume = () => navigate('/onboarding');

  const handleDeleteResume = async (id: string) => {
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      console.error('[DashboardPage] Invalid resume ID for deletion:', id)
      setError('Invalid resume ID. Please refresh the page and try again.')
      return;
    }

    if (!window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      await resumeAPI.delete(id);
      setResumes((prev) => prev.filter((r) => r.id && r.id !== id));
    } catch (err: any) {
      console.error('[DashboardPage] Failed to delete resume:', err)
      setError(err.response?.data?.error || 'Failed to delete resume. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase();
  };

  const recentResumes = resumes.slice(0, 3);

  const toggleSort = (field: 'createdAt' | 'updatedAt' | 'candidateName') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      
      <Navbar/>

      {/* Logout Confirmation Modal */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setLogoutConfirmOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sign Out</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Are you sure you want to sign out?</p>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome back, {currentUser?.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {loading ? 'Loading your resumes...' : `You have ${resumes.length} resume${resumes.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className='flex gap-2'>
            <button
                onClick={fetchResumes}
                disabled={loading}
                className=" flex items-center gap-2  p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Refresh"
              >Refresh
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
          <button
            onClick={handleCreateResume}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            New Resume
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{resumes.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Updated this week</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {resumes.filter(r => new Date(r.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">Latest</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                    {formatDate(resumes.reduce((latest, r) =>
                      new Date(r.updatedAt) > new Date(latest) ? r.updatedAt : latest, resumes[0]?.updatedAt || ''
                    ))}
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completion</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {Math.round((resumes.filter(r => r.title && r.candidateName).length / resumes.length) * 100)}%
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
              <p className="flex-1 text-sm text-red-800 dark:text-red-300">{error}</p>
              <button
                onClick={() => setError('')}
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
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading your resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No resumes yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
              Create your first professional resume to get started.
            </p>
            <button
              onClick={handleCreateResume}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Create New Resume
            </button>
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
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                  className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {viewMode === 'table' ? <Grid className="h-5 w-5" /> : <List className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' ? (
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
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {resume.candidateName || 'Untitled'}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {resume.title || 'No title'}
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
                            onClick={() => toggleSort('candidateName')}
                            className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white"
                          >
                            Resume
                            {sortField === 'candidateName' && (
                              sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                            )}
                          </button>
                        </th>
                        <th className="text-left py-3 px-4">
                          <button
                            onClick={() => toggleSort('createdAt')}
                            className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white"
                          >
                            Created
                            {sortField === 'createdAt' && (
                              sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                            )}
                          </button>
                        </th>
                        <th className="text-left py-3 px-4">
                          <button
                            onClick={() => toggleSort('updatedAt')}
                            className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white"
                          >
                            Modified
                            {sortField === 'updatedAt' && (
                              sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                            )}
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
                        <tr key={resume.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {resume.candidateName || 'Untitled'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {resume.title || 'No title'}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              {formatDate(resume.createdAt)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(resume.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              {formatDate(resume.updatedAt)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(resume.updatedAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => navigate(`/editor/${resume.id}`)}
                                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => navigate(`/preview/${resume.id}`)}
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
                  Showing <span className="font-medium text-gray-900 dark:text-white">{startIndex + 1}</span> to{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.min(endIndex, resumes.length)}
                  </span>{' '}
                  of <span className="font-medium text-gray-900 dark:text-white">{resumes.length}</span> results
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
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
      </main>
    </div>
  );
}