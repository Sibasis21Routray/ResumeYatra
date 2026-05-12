import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Activity, 
  ArrowUp, 
  ArrowDown,
  Zap,
  CreditCard,
  Briefcase,
  GraduationCap,
  Eye,
  ArrowRight,
  DollarSign,
  Clock,
  CheckCircle,
  Sparkles,
  Shield,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FaMoneyCheck } from 'react-icons/fa';

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

interface StatsOverviewProps {
  stats: Stats | null;
  onTabChange?: (tab: 'overview' | 'users' | 'resumes' | 'token-usage' | 'pricing') => void;
}

interface MetricCardProps {
  title: string;
  value: any;
  icon: React.ElementType;
  color: string;
  suffix?: string;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  suffix = '',
  onClick
}) => {
  const colorMap: Record<string, any> = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', progress: 'bg-blue-500' },
    green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800', progress: 'bg-green-500' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', progress: 'bg-purple-500' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', progress: 'bg-amber-500' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', progress: 'bg-indigo-500' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', progress: 'bg-emerald-500' },
  };
  
  const colors = colorMap[color] || colorMap.blue;
  
  // Dynamic progress calculation based on value
  const maxValue = Math.max(value, 100);
  const progressPercentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border ${colors.border} p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {suffix}{value.toLocaleString()}
          </p>
        </div>
        
        <div className={`p-4 ${colors.bg} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-7 h-7 ${colors.text}`} />
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors.progress} rounded-full transition-all duration-500`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Link indicator */}
      {onClick && (
        <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-gray-400">View details</span>
          <ArrowRight className="w-3 h-3 text-gray-400 ml-1" />
        </div>
      )}
    </motion.div>
  );
};

interface QuickLinkCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  tabId: 'overview' | 'users' | 'resumes' | 'token-usage' | 'pricing';
  gradient: string;
  badge?: string;
  stats?: number | string;
  onTabChange: (tab: 'overview' | 'users' | 'resumes' | 'token-usage' | 'pricing') => void;
}

const QuickLinkCard: React.FC<QuickLinkCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  tabId, 
  gradient, 
  badge, 
  stats,
  onTabChange 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onTabChange(tabId)}
      className={`group relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-5 text-left transition-all duration-300 shadow-sm hover:shadow-xl w-full`}
    >
      {badge && (
        <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-white/20 backdrop-blur rounded-full text-white">
          {badge}
        </span>
      )}
      
      <div className="relative z-10">
        <div className="p-3 bg-white/20 rounded-xl inline-block mb-3">
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-white/80 mb-3">{description}</p>
        
        {stats !== undefined && (
          <div className="mb-3">
            <p className="text-2xl font-bold text-white">{stats}</p>
            <p className="text-xs text-white/70">Total records</p>
          </div>
        )}
        
        <div className="flex items-center gap-1 text-white/90 text-sm font-medium group-hover:gap-2 transition-all">
          <span>Manage</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
      
      {/* Decorative background */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
    </motion.button>
  );
};

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, onTabChange }) => {
  const navigate = useNavigate();
  
  if (!stats) return null;

  // Calculate derived metrics from actual data
  const conversionRate = stats.users > 0 ? Math.round((stats.resumes / stats.users) * 100) : 0;
  
  // Calculate plan percentages from actual data
  const totalActiveSubscriptions = stats.activeSubscriptions || 0;
  const freelancerPercentage = totalActiveSubscriptions > 0 && stats.freelancerCount 
    ? Math.round((stats.freelancerCount / totalActiveSubscriptions) * 100) 
    : 0;
  const candidatePercentage = totalActiveSubscriptions > 0 && stats.candidateCount 
    ? Math.round((stats.candidateCount / totalActiveSubscriptions) * 100) 
    : 0;
  
  // Calculate AI adoption rate
  const aiAdoptionRate = stats.aiAdoptionRate 
    || (stats.users > 0 ? Math.round(((stats.totalAiEnhancements || 0) / stats.users) * 100) : 0);
  
  // Calculate AI usage percentage (assuming 1000 as monthly limit - adjust based on your actual limit)
  const aiUsagePercentage = stats.aiCreditsUsed 
    ? Math.min(Math.round((stats.aiCreditsUsed / 10000) * 100), 100)
    : 0;
  
  // Primary metrics - only show if values exist
  const metrics: MetricCardProps[] = [];
  
  // Always show users if > 0
  if (stats.users > 0) {
    metrics.push({
      title: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'blue',
      onClick: () => onTabChange ? onTabChange('users') : navigate('/admin?tab=users')
    });
  }
  
  // Always show resumes if > 0
  if (stats.resumes > 0) {
    metrics.push({
      title: 'Total Resumes',
      value: stats.resumes,
      icon: FileText,
      color: 'green',
      onClick: () => onTabChange ? onTabChange('resumes') : navigate('/admin?tab=resumes')
    });
  }
  

  

  
  // Add optional metrics if available from API
  if (stats.activeSubscriptions !== undefined && stats.activeSubscriptions > 0) {
    metrics.push({
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: CreditCard,
      color: 'indigo',
      onClick: () => onTabChange ? onTabChange('pricing') : navigate('/admin?tab=pricing')
    });
  }
  
 if (stats.revenue !== undefined && stats.revenue > 0) {
    metrics.push({
      title: 'Revenue (MTD)',
      value: stats.revenue,  
      icon: FaMoneyCheck,   
      color: 'emerald',
      suffix: '₹',           
      onClick: () => onTabChange ? onTabChange('pricing') : navigate('/admin?tab=pricing')
    });
}
  


  // Quick links configuration with dynamic stats
  const quickLinks: { title: string; description: string; icon: any; tabId: 'overview' | 'users' | 'resumes' | 'token-usage' | 'pricing'; gradient: string; stats: any; badge?: string }[] = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      icon: Users,
      tabId: 'users',
      gradient: 'from-blue-600 to-blue-700',
      stats: stats.users
    },
    {
      title: 'Resume Management',
      description: 'Review, moderate, and manage user resumes',
      icon: FileText,
      tabId: 'resumes',
      gradient: 'from-green-600 to-green-700',
      stats: stats.resumes
    },
    {
      title: 'AI Token Analytics',
      description: 'Monitor OpenAI usage and costs',
      icon: Zap,
      tabId: 'token-usage',
      gradient: 'from-amber-500 to-orange-600',
      badge: stats.aiCreditsUsed && stats.aiCreditsUsed > 0 ? 'Active' : 'Ready',
      stats: stats.aiCreditsUsed || 0
    },
    {
      title: 'Pricing Configuration',
      description: 'Update subscription plans and rates',
      icon: CreditCard,
      tabId: 'pricing',
      gradient: 'from-purple-600 to-purple-700',
      stats: stats.activeSubscriptions || 0
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Dynamic */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#04477E] to-[#0660a9] rounded-2xl shadow-lg p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Admin Dashboard
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Platform Overview
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl">
            {stats.users > 0 
              ? `You have ${stats.users.toLocaleString()} active users who have created ${stats.resumes.toLocaleString()} resumes.`
              : 'Your platform is ready. Start by adding users and content.'}
          </p>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>Data as of {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>System operational</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>

      {/* Plan Distribution & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Distribution - Dynamic */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subscription Distribution</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active plan breakdown</p>
              </div>
              {onTabChange && totalActiveSubscriptions > 0 && (
                <button 
                  onClick={() => onTabChange('pricing')}
                  className="text-sm text-[#04477E] hover:text-[#0660a9] font-medium"
                >
                  Manage plans
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {totalActiveSubscriptions > 0 ? (
              <div className="space-y-4">
                {/* Freelancer Plan */}
                <div>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">Freelancer Plan</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">{stats.freelancerCount || 0}</span>
                      <span className="text-gray-500"> users</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${freelancerPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{freelancerPercentage}% of active subscriptions</p>
                </div>
                
                {/* Candidate Plan */}
                <div>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Candidate Plan</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">{stats.candidateCount || 0}</span>
                      <span className="text-gray-500"> users</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${candidatePercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{candidatePercentage}% of active subscriptions</p>
                </div>
                
                {/* Total Active */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Active Subscriptions</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{totalActiveSubscriptions}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No active subscriptions yet</p>
                <p className="text-xs text-gray-400 mt-1">Subscriptions will appear here once users purchase plans</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights - Dynamic */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Feature Insights</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Usage  metrics</p>
              </div>
              {onTabChange && (stats.aiCreditsUsed || 0) > 0 && (
                <button 
                  onClick={() => onTabChange('token-usage')}
                  className="text-sm text-[#04477E] hover:text-[#0660a9] font-medium"
                >
                  View analytics
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Sparkles className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {(stats.totalAiEnhancements || stats.aiCreditsUsed || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.totalAiEnhancements ? 'Total AI Enhancements' : 'AI Credits Used'}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <Eye className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {stats.aiCreditsUsed}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">AI Credits Used</p>
              </div>
            </div>
            
            {/* Progress to next milestone */}
            {(stats.aiCreditsUsed || 0) > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <span>AI Feature Usage</span>
                  <span>{aiUsagePercentage}% of estimated capacity</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${aiUsagePercentage}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Dynamic Insight tip based on actual data */}
            <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex gap-2">
                <Award className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300">AI Usage Insight</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    {(stats.totalAiEnhancements || stats.aiCreditsUsed || 0) > 100
                      ? `Great adoption! Users have performed ${(stats.totalAiEnhancements || stats.aiCreditsUsed || 0).toLocaleString()} AI actions. Consider highlighting AI features more prominently.`
                      : (stats.users > 0 && (stats.aiCreditsUsed || 0) === 0)
                      ? "No AI features used yet. Consider running a tutorial or campaign to promote AI enhancement tools to your users."
                      : `${(stats.totalAiEnhancements || stats.aiCreditsUsed || 0)} AI ${stats.totalAiEnhancements ? 'enhancements' : 'credits'} used. Continue educating users on AI benefits for better resumes.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};