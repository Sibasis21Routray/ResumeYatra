import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Zap, 
  CreditCard,
  LogOut,
  Settings,
  Bell,
  UserCircle
} from 'lucide-react';

interface AdminHeaderProps {
  activeTab: 'overview' | 'users' | 'resumes' | 'token-usage' | 'pricing';
  onTabChange: (tab: any) => void;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'blue' },
  { id: 'users', label: 'Users', icon: Users, color: 'green' },
  { id: 'resumes', label: 'Resumes', icon: FileText, color: 'purple' },
  { id: 'token-usage', label: 'Token Usage', icon: Zap, color: 'amber' },
  { id: 'pricing', label: 'Pricing', icon: CreditCard, color: 'indigo' },
];

export const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
              <div className="hidden sm:block h-6 w-px bg-gray-300 dark:bg-gray-700" />
              <span className="hidden sm:inline text-sm font-semibold bg-gradient-to-r from-[#04477E] to-[#0660a9] bg-clip-text text-transparent">
                Admin Portal
              </span>
            </Link>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const colorClasses = {
                blue: isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : '',
                green: isActive ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : '',
                purple: isActive ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : '',
                amber: isActive ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : '',
                indigo: isActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : '',
              };

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as any)}
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? `${colorClasses[item.color as keyof typeof colorClasses]} shadow-sm`
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#04477E] to-[#0660a9] flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex justify-around px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as any)}
                className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                  isActive ? 'text-[#04477E]' : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};