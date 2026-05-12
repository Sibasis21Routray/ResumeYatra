import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Star, Users, Zap, Award, Target, Rocket 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/home/Navbar';

export function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-blue-100 selection:text-[#04477E]">
      <Navbar />

      {/* --- Hero Section --- */}
      <section className="relative pt-10 pb-32 overflow-hidden mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 dark:bg-blue-900/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 dark:bg-indigo-900/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-[#04477E] dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-900/30 rounded-full">
                Our Story
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-8">
                Crafting the future of <span className="text-[#04477E] dark:text-blue-400">Professional Identity.</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
                At ResumeYatra, we believe every professional deserves a platform that truly reflects their potential. By combining cutting-edge AI with intuitive, human-centric design, we empower you to craft impactful resumes that stand out and open doors to your next opportunity.
              </p>
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#04477E] text-white rounded-xl hover:bg-[#033a5e] transition-all duration-300 shadow-lg shadow-blue-900/20 font-bold"
              >
                Start Building <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img src="https://img.freepik.com/premium-vector/man-with-resume_118813-4837.jpg?semt=ais_hybrid&w=740&q=80" alt="Our Story" className=" w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Stats Section --- */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Active Users', value: '50k+' },
            { label: 'Success Rate', value: '94%' },
            { label: 'Templates', value: '8+' },
            { label: 'Resumes Built', value: '10K+' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-[#04477E] dark:text-blue-400">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started in <span className="text-[#04477E] dark:text-blue-400">5 Minutes</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Building a career-defining resume shouldn't take all day. Our streamlined process gets you from blank page to "Hired."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
  {[
    {
      t: 'Sign Up or Continue as Guest',
      d: 'Create an account or continue as a guest to start building your resume instantly.'
    },
    {
      t: 'Choose Template or Upload Resume',
      d: 'Pick a professional template or upload your existing resume for smart parsing.'
    },
    {
      t: 'Build & Enhance with AI',
      d: 'Edit your resume, add details, and use AI to enhance content, skills, and descriptions.'
    },
    {
      t: 'Download & Apply',
      d: 'Download your polished resume in PDF format and start applying with confidence.'
    }
  ].map((step, i) => (
    <motion.div 
      key={i} 
      whileHover={{ x: 10 }}
      className="flex gap-6 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 transition-all group"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-[#04477E] dark:text-blue-400 font-bold group-hover:bg-[#04477E] group-hover:text-white transition-colors">
        {i + 1}
      </div>
      <div>
        <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-1">
          {step.t}
        </h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {step.d}
        </p>
      </div>
    </motion.div>
  ))}
</div>
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="relative lg:block hidden"
            >
              <div className="p-4 rounded-3xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">
                <img src="res.png" alt="Preview" className="rounded-2xl shadow-sm w-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Final CTA --- */}
      <section className="py-24 text-center bg-[#04477E] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to land your dream job?</h2>
          <p className="text-xl  mb-10">
            Join thousands of successful professionals using ResumeYatra to build their careers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/templates"
              className="w-full sm:w-auto px-10 py-4 text-[#04477E] bg-white rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-blue-900/20"
            >
              Start Building Now
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 py-4 border-2 border-gray-200 dark:border-gray-800 hover:border-[#04477E] dark:hover:border-blue-400 rounded-xl font-bold text-lg transition-all"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}