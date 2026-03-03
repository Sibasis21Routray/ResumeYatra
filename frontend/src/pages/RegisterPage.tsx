import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/apiClient'
import { Mail, Lock, Loader2, ArrowRight, Sparkles, User, ShieldCheck, Briefcase, GraduationCap, Star } from 'lucide-react'
import { MotionConfig,motion } from 'framer-motion'

export default function RegisterPage({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.register(email, name, password)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      onSuccess()
      navigate(response.data.user.role === 'admin' ? '/admin-dashboard' : '/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-amber-50">
      
      {/* --- DESIGN BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-[#01467d]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] bg-[#dea42c]/10 rounded-full blur-[120px] animate-pulse delay-700" />
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, #01467d 2px, transparent 2px), 
                              radial-gradient(circle at 80px 80px, #dea42c 2px, transparent 2px)`,
            backgroundSize: '80px 80px, 160px 160px'
          }}
        />
        
        {/* Floating icons */}
        <div className="absolute top-20 left-20 opacity-10 animate-float">
          <Briefcase className="w-24 h-24 text-[#01467d]" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-10 animate-float-delayed">
          <GraduationCap className="w-24 h-24 text-[#dea42c]" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-5 animate-spin-slow">
          <Star className="w-16 h-16 text-[#01467d]" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 opacity-5 animate-bounce-slow">
          <User className="w-20 h-20 text-[#dea42c]" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[500px] animate-in fade-in zoom-in duration-700">
        
        {/* Premium Glass Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(1,70,125,0.3)] p-8 md:p-12 relative overflow-hidden">
          
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#01467d]/20 to-transparent rounded-br-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#dea42c]/20 to-transparent rounded-tl-[100px]"></div>
          
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-30"></div>

          {/* Branding Section */}
          <header className="mb-8 text-center relative">
             {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 flex items-center justify-center"
            >
              <Link to="/" className="block">
                <img 
                  src="../../../public/logo.png"
                  alt="Logo" 
                  className="h-12 sm:h-14 md:h-16 w-auto transition-all duration-300 hover:scale-105" 
                />
              </Link>
            </motion.div>
            <p className="text-slate-600 text-sm font-medium flex items-center justify-center gap-2">
              <span className="w-8 h-[2px] bg-[#01467d]/30"></span>
              Create your account to start your career journey
              <span className="w-8 h-[2px] bg-[#dea42c]/30"></span>
            </p>
          </header>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium animate-bounce-short text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Field */}
            <div className="group space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#01467d]/70 ml-1">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-5 h-5 text-[#01467d]/50 group-focus-within:text-[#01467d] transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-white border border-[#01467d]/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#01467d]/10 focus:border-[#01467d] transition-all placeholder:text-slate-400 text-slate-900"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="group space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#01467d]/70 ml-1">Work Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-[#01467d]/50 group-focus-within:text-[#01467d] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-white border border-[#01467d]/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#01467d]/10 focus:border-[#01467d] transition-all placeholder:text-slate-400 text-slate-900"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#01467d]/70 ml-1">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-5 h-5 text-[#01467d]/50 group-focus-within:text-[#01467d] transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-white border border-[#01467d]/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#01467d]/10 focus:border-[#01467d] transition-all placeholder:text-slate-400 text-slate-900"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="group space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#01467d]/70 ml-1">Confirm</label>
                <div className="relative flex items-center">
                  <ShieldCheck className="absolute left-4 w-5 h-5 text-[#01467d]/50 group-focus-within:text-[#01467d] transition-colors" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-white border border-[#01467d]/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#01467d]/10 focus:border-[#01467d] transition-all placeholder:text-slate-400 text-slate-900"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password strength indicator (optional) */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 h-1">
                  <div className={`flex-1 h-full rounded-full transition-all duration-300 ${
                    password.length > 0 ? 'bg-red-400' : 'bg-gray-200'
                  }`}></div>
                  <div className={`flex-1 h-full rounded-full transition-all duration-300 ${
                    password.length > 5 ? 'bg-yellow-400' : 'bg-gray-200'
                  }`}></div>
                  <div className={`flex-1 h-full rounded-full transition-all duration-300 ${
                    password.length > 8 ? 'bg-green-400' : 'bg-gray-200'
                  }`}></div>
                </div>
                <p className="text-xs text-[#01467d]/60 mt-1">
                  {password.length === 0 && 'Enter a password'}
                  {password.length > 0 && password.length <= 5 && 'Weak'}
                  {password.length > 5 && password.length <= 8 && 'Medium'}
                  {password.length > 8 && 'Strong'}
                </p>
              </div>
            )}

            

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-[60px] bg-gradient-to-r from-[#01467d] to-[#013a66] text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 shadow-lg shadow-[#01467d]/25 hover:shadow-xl hover:shadow-[#01467d]/30 mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#dea42c] to-[#c48b1f] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                ) : (
                  <>
                    Create My Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center pt-4">
            <p className="text-slate-600 text-sm">
              Already a traveler?{' '}
              <Link to="/login" className="relative group font-bold text-[#01467d] hover:text-[#dea42c] transition-colors">
                Sign in instead
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#dea42c] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs font-bold text-[#01467d]/40 uppercase tracking-[0.2em]">
          &copy; 2026 ResumeYatra AI . All rights reserved
        </p>
      </div>

      {/* Add custom animations */}
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
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-5px); }
          75% { transform: translateY(5px); }
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
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-bounce-short {
          animation: bounce-short 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}