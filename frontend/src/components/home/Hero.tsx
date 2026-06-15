import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { pricingAPI } from '../../services/apiClient';

interface PricingData {
  guestDownload: number;
  guestAi: number;
  candidatePrice: number;
  candidateDurationMonths: number;
  candidateResumeLimit: number;
  candidateAiDiscount: number;
  freelancerPrice: number;
  freelancerDurationMonths: number;
  freelancerResumeLimit: number;
  freelancerAiDiscount: number;
}

const Hero: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const navigate = useNavigate();
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const response = await pricingAPI.get();
      let pricingData = response.data;
      
      if (response.data?.data) {
        pricingData = response.data.data;
      }
      
      setPricing(pricingData);
    } catch (err) {
      console.error('Failed to fetch pricing:', err);
      // Fallback values
      setPricing({
        guestDownload: 900,
        guestAi: 4900,
        candidatePrice: 2900,
        candidateDurationMonths: 3,
        candidateResumeLimit: 5,
        candidateAiDiscount: 25,
        freelancerPrice: 9900,
        freelancerDurationMonths: 3,
        freelancerResumeLimit: 100,
        freelancerAiDiscount: 50
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceInPaisa?: number) => {
    if (!priceInPaisa && priceInPaisa !== 0) return '₹0';
    const rupees = priceInPaisa / 100;
    return `₹${rupees.toFixed(0)}`;
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    const user = localStorage.getItem('user');
    return !!user;
  };

  // Handle navigation for membership plans
  const handleMembershipClick = (plan: 'candidate' | 'freelancer') => {
    if (isLoggedIn()) {
      navigate('/onboarding');
    } else {
      navigate(`/register?plan=${plan}`);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, x: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 },
    },
  };

  const floatAnimation = {
    y: [0, -6, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'easeInOut',
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Handle navigation with scroll to section
  const handleNavClick = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-12 lg:pb-20">
        {/* Background decorative elements */}
       

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column - Hero Copy */}
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06497f]/10 border border-[#06497f]/20">
                  <span className="w-2 h-2 rounded-full bg-[#dda431] " />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#06497f]">
                    AI Resume Builder + Freelancer Opportunity
                  </span>
                </div>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]"
              >
                Create or Upgrade Your Resume in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06497f] to-[#06497f]">
                  Minutes
                </span>{' '}
                — No Skills Needed
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl"
              >
                Upload your CV or build from scratch. Edit, improve with AI, and download instantly in a
                structured ATS-friendly format. 
              </motion.p>

              {/* Feature Stack */}
              <motion.div variants={itemVariants} className="space-y-3">
                {[
                  'Upload → Edit → AI Optimize → Download',
                  'Generate a structured ATS-friendly CV in 2 minutes',
                  'No signup required for instant upgrades and downloads',
                  'Start your resume business with investment as low as ₹99',
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.08 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-[#06497f]/20 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#06497f] to-[#06497f]/80 flex items-center justify-center shadow-md">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Hero Actions */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => navigate('/onboarding')}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#06497f] to-[#06497f]/80 shadow-lg shadow-[#06497f]/20 hover:shadow-xl hover:shadow-[#06497f]/30 transition-all duration-300"
                  >
                    Create My Resume
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button 
                    onClick={() => navigate('/upload')}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-all duration-300"
                  >
                    Upload My CV
                  </button>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Hero Card */}
            <motion.div variants={cardVariants} animate={floatAnimation} className="relative">
              <div className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                

                <div className="relative p-5 sm:p-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#dda431]" />
                    World-class SaaS Experience
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    Built for Job Seekers and Resume Professionals
                  </h3>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                    Resume Yatra is designed to feel effortless for first-time users and commercially useful for
                    professional resume writers.
                  </p>

                  <div className="grid grid-cols-4 gap-2 mb-5">
                    {[
                      { label: 'Upload', desc: 'Import CV instantly' },
                      { label: 'Edit', desc: 'Fix structure fast' },
                      { label: 'Optimize', desc: 'Apply AI upgrades' },
                      { label: 'Download', desc: 'Get ATS-ready CV' },
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className="text-center p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <strong className="block text-xs font-bold text-gray-900">{step.label}</strong>
                        <span className="text-[10px] text-gray-500 font-medium">{step.desc}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: 'Turnaround',
                        value: '2 Min',
                        desc: 'Generate a clean, structured resume fast with minimal effort.',
                      },
                      {
                        label: 'Startup Cost',
                        value: `${formatPrice(pricing?.freelancerPrice || 499)}`,
                        desc: 'Low-entry business model for freelance resume writers.',
                      },
                      {
                        label: 'Workflow',
                        value: '4 Steps',
                        desc: 'Simple process designed for speed and clarity.',
                      },
                      {
                        label: 'Access',
                        value: 'No Signup',
                        desc: 'Instant use for quick upgrades and downloads.',
                      },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#06497f]/20 transition-all duration-200"
                      >
                        <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                          {stat.label}
                        </div>
                        <div className="text-xl font-black text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-[11px] text-gray-500 font-medium leading-tight" id="products">{stat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Use Cases Section - Below Hero */}
          <motion.div
          
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid md:grid-cols-2 gap-5 mt-12"
            
          >
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="inline-flex px-3 py-1 rounded-full bg-[#06497f]/10 text-[#06497f] text-xs font-bold mb-3">
                For Job Seekers
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create a Better Resume Faster</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Ideal for candidates who want a professional resume without learning formatting and structure resume, or ATS
                rules.
              </p>
              <div className="space-y-2 mb-5">
                {[
                  'Build or upload your CV in minutes',
                  'Edit content before downloading',
                  'Upgrade with AI when needed',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-[#06497f] font-bold">✓</span> {item}
                  </div>
                ))}
              </div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <button
                  onClick={() => handleNavClick('pricing')}
                  className=" inline-flex items-center justify-center w-fit px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#06497f] to-[#06497f]/80 hover:shadow-lg transition-all duration-300 text-center"
                >
                  Get Started
                </button>
              </motion.div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-[#dda431]/5 border border-[#dda431]/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="inline-flex px-3 py-1 rounded-full bg-[#dda431]/20 text-[#b8770a] text-xs font-bold mb-3">
                For Resume Writers
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Start a Resume Business with Low Investment</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Use Resume Yatra as your production engine, serve more clients, and monetize resume writing with a
                simple workflow.
              </p>
              <div className="space-y-2 mb-5">
                {[
                  'Serve multiple candidates quickly',
                  'Earn from each resume you create',
                  `Start with investment as low as ${formatPrice(pricing?.candidatePrice || 29)}`,
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-[#dda431] font-bold">✓</span> {item}
                  </div>
                ))}
              </div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <button
                  onClick={() => handleNavClick('pricing')}
                  className="w-fit inline-flex items-center justify-center  px-4 py-3 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-[#dda431] to-[#dda431]/80 hover:shadow-lg transition-all duration-300 text-center"
                >
                  Start Earning
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06497f]/10 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#06497f]">How It Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-3">
              Simple Enough for Everyone. Fast Enough for Scale.
            </h2>
            <p className='text-gray-500 text-lg font-light'>Explore without signing up—membership is optional.
            </p>
            
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {[
              { number: '1', title: 'Upload or Create', desc: 'Start with an existing CV or build from scratch using a guided workflow.' },
              { number: '2', title: 'Edit with Ease', desc: 'Edit → Choose Template → Pay & Download' },
              { number: '3', title: 'Optimize with AI', desc: 'Pay → Get a smarter, sharper, AI-polished profile designed to stand out → Download' },
              { number: '4', title: 'Become A Member', desc: 'Save your Resume in the dashboard to manage multiple resumes—plus offers on AI optimization.' },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black text-white bg-gradient-to-br from-[#06497f] to-[#06497f]/80 shadow-md mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-6 lg:py-14 bg-white">
        <div className="container mx-auto px-4 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06497f]/10 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#06497f]">Pricing Overview</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-3">
              Choose the Plan That Matches Your Goal
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-4xl mx-auto">
              Use the platform once, come back for future edits, or scale it as a resume-writing business.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              {/* <div className="rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#06497f]"></div> */}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid lg:grid-cols-4 gap-6"
            >
              {/* Foundation Plan Card */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold mb-4 bg-[#06497f]/10 text-[#06497f] w-fit">
                  Foundation Plan
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Quick Start, No Commitment</h3>
                <div className="text-4xl font-black mb-3 text-gray-900">
                  {formatPrice(pricing?.guestDownload || 900)}
                </div>
                <span className='bg-[#06497f]/20 w-fit rounded-xl px-4 text-sm py-1'>One Time payment </span>
                <span className='text-gray-700 my-4'>
                 Build or Parse, Edit, and Download your resume.
                </span>
                <div className="space-y-2 mb-6 flex-grow ">
                  {[
                    'Create or Upload Resume',
                    'Preview and Edit before download',
                    'Grammar and Spelling corrected',
                    'ATS Friendly & Professional Formatting',
                    'All Templates Included',
                    'Instant Access, No Signup',
                    'Download (PDF/DOC)',
                    'No Watermark',
                  ].map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span className="text-[#06497f]">✓</span> {feature}
                    </div>
                  ))}
                 
                </div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <button
                    onClick={() => navigate('/onboarding')}
                    className="inline-flex items-center justify-start w-fit px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#06497f] to-[#06497f]/80 hover:shadow-lg transition-all duration-300 text-center"
                  >
                    Create Now
                  </button>
                </motion.div>
              </motion.div>

              {/* AI Optimization Plan Card */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-[#dda431]/30 shadow-2xl transition-all duration-300 flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-[#dda431] to-amber-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg ">
                    Most Popular
                  </div>
                </div>
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold mb-4 bg-[#dda431]/20 text-[#ffd98a] w-fit">
                  AI Optimization
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Start Smarter, Better Results</h3>
                <div className="text-4xl font-black mb-3 text-white">
                  {formatPrice(pricing?.guestAi || 4900)}
                </div>
                <span className='bg-[#dda431]/20 text-[#dda431] w-fit rounded-xl px-4 text-sm py-1'>One Time payment </span>
                 <span className='text-white my-4'>
                  Build and download your resume with the help of AI.
                </span>
                <div className="space-y-2 mb-6 flex-grow">
                  {[
                    'Includes everything in Foundation plan',
                    'Profile Summary Professionally Rewritten',
                    'AI Generated Role-Specific Summary',
                    'AI Extracted & Structured Skills Section',
                    'Keyword Optimisation for Stronger ATS Alignment',
                    'Achievement Phrasing Improvement',
                    'Download (PDF/DOC)',
                    'No Watermark',
                  ].map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                      <span className="text-[#dda431]">✓</span> {feature}
                    </div>
                  ))}
                 
                </div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <button
                    onClick={() => navigate('/onboarding')}
                    className="inline-flex items-center justify-start w-fit px-4 py-2.5 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-[#dda431] to-[#dda431] hover:shadow-lg transition-all duration-300 text-center"
                  >
                    Improve My Resume
                  </button>
                </motion.div>
              </motion.div>

              {/* Candidate Membership Plan Card */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold mb-4 bg-green-100 text-green-700 w-fit">
                  Candidate Membership
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">For Active Job Seekers</h3>
                <span className='flex items-end gap-2 mt-3'> 
                   <div className="text-4xl font-black mb-1 text-gray-900">
                  {formatPrice(pricing?.candidatePrice || 2900)}
                </div>
                <div className="text-sm text-gray-500 mb-3">/ {(pricing?.candidateDurationMonths || 3) * 30} days</div>
                </span>
               
                  <span className='bg-green-100 text-green-700 w-fit rounded-xl px-4 text-sm py-1'>Autopay Enabled  </span>
               
                <span className='text-gray-700 mb-4 my-4'>
                  Built for candidates to Create, Save and Manage resumes.
                </span>


                <div className="space-y-2 mb-6 flex-grow">
                  {[
                    'Personal Dashboard',
                    `Save upto ${pricing?.candidateResumeLimit || 5} Job-Specific Resumes`,
                    `${pricing?.candidateAiDiscount || 25}% off on AI Optimization`,
                    'AI Optimization Includes 1 Download Credit',
                    'No Watermark',
                    `Auto renewed every ${(pricing?.candidateDurationMonths || 3) * 30} days. Cancel anytime.`
                  ].map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span className="text-green-600">✓</span> {feature}
                    </div>
                  ))}
               
                </div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <button
                    onClick={() => handleMembershipClick('candidate')}
                    className="inline-flex items-center justify-start w-fit px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:shadow-lg transition-all duration-300 text-center"
                  >
                    Get Started
                  </button>
                </motion.div>
              </motion.div>

              {/* Freelancer Membership Plan Card */}
<motion.div
  variants={itemVariants}
  whileHover={{ y: -8 }}
  className="p-6 rounded-2xl bg-gradient-to-br from-[#dda431]/20 to-amber-50 border border-[#dda431]/40 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden"
>
  <div className="absolute top-0 right-0">
    <div className="bg-gradient-to-r from-[#dda431] to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
      <span>⭐</span> Popular
    </div>
  </div>
  <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold mb-4 bg-[#dda431]/15 text-[#b87d1a] w-fit">
    Freelancer Membership
  </div>
  <h3 className="text-2xl font-bold text-gray-900 mb-1">Showcase Better. Pitch Smarter. Earn More.</h3>
  <span className='flex items-end gap-2 mt-3'><div className="text-4xl font-black mb-1 text-gray-900">
    {formatPrice(pricing?.freelancerPrice || 9900)}
  </div>
  <div className="text-sm text-gray-500 mb-3">/ {(pricing?.candidateDurationMonths || 3) * 30} days</div></span>
  <span className='bg-[#b87d1a]/20 text-[#b87d1a] w-fit rounded-xl px-4 text-sm py-1'>Autopay Enabled  </span>

  <span className='text-gray-700 my-4'>    
    Built for professional resume writers who want to manage more clients and grow faster.
  </span>

  <div className="space-y-2 mb-6 flex-grow">
    {[
      'Professional Dashboard',
      `Save upto ${pricing?.freelancerResumeLimit || 100} Different resumes`,
      `${pricing?.freelancerAiDiscount || 50}% off on AI Optimization`,
      'AI Optimization Includes 1 Download Credit',
      'No Watermark',
      `Auto renewed every ${(pricing?.candidateDurationMonths || 3) * 30} days. Cancel anytime.`
    ].map((feature, fIdx) => (
      <div key={fIdx} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <span className="text-[#dda431]">✓</span> {feature}
      </div>
    ))}
  </div>
  <motion.div whileHover={{ scale: 1.02 }}>
    <button
      onClick={() => handleMembershipClick('freelancer')}
      className="inline-flex items-center justify-start w-fit px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#dda431] to-amber-500 hover:shadow-lg transition-all duration-300 text-center"
    >
      Start Your Journey
    </button>
  </motion.div>
</motion.div>
            </motion.div>
          )}
        </div>
      </section>


      {/* Feature Comparison Table */}
 <section className="py-16 lg:py-24 mx-auto px-4 max-w-screen-2xl">

  <div className="text-center mb-8">
    <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Feature Comparison</h3>
    <p className="text-gray-500">See what's included in each plan</p>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b-2 border-gray-200">
          <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50 rounded-l-xl">Features</th>
          <th className="text-center py-4 px-4 font-semibold text-[#06497f] bg-gray-50">Foundation</th>
          <th className="text-center py-4 px-4 font-semibold text-[#dda431] bg-gray-50 rounded-r-xl">AI Optimization</th>
        </tr>
      </thead>
      <tbody>
        {/* Core Features */}
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium">Create or Upload Resume</td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
        
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium">Preview & Edit Download</td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
        
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium">All Templates Included</td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
        
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium">Download (PDF / DOCX)</td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
        
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium">Grammar & Spelling Corrected</td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
        
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium">ATS Friendly & Professional Formatting</td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
        
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium">Instant Access, No Signup</td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
        
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium">No Watermark</td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>

        {/* AI Exclusive Features */}
        <tr className="border-b border-gray-200 bg-blue-50/30">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium text-blue-700">Profile Summary Re-Written</td>
          <td className="text-center py-3 px-4"><span className="text-red-400 text-xl">✗</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
        
        <tr className="border-b border-gray-100 bg-blue-50/30">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium text-blue-700">AI Generated Role-Specific Summary</td>
          <td className="text-center py-3 px-4"><span className="text-red-400 text-xl">✗</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
        
        <tr className="border-b border-gray-100 bg-blue-50/30">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium text-blue-700">AI Extracted & Structured Skills Section</td>
          <td className="text-center py-3 px-4"><span className="text-red-400 text-xl">✗</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
        
        <tr className="border-b border-gray-100 bg-blue-50/30">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium text-blue-700">Keyword Optimisation for ATS Alignment</td>
          <td className="text-center py-3 px-4"><span className="text-red-400 text-xl">✗</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
        
        <tr className="border-b border-gray-100 bg-blue-50/30">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium text-blue-700">Achievement Phrasing Improvement</td>
          <td className="text-center py-3 px-4"><span className="text-red-400 text-xl">✗</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
        
        <tr className="border-b border-gray-100 bg-blue-50/30">
          <td className="py-3 px-4 text-sm text-gray-700 font-medium text-blue-700">AI Optimisation Access</td>
          <td className="text-center py-3 px-4"><span className="text-red-400 text-xl">✗</span></td>
          <td className="text-center py-3 px-4"><span className="text-green-500 text-xl">✓</span></td>
        </tr>
      </tbody>
    </table>
</div>

  <p className="text-center text-xs text-gray-400 mt-4">
    Save Resume feature requires membership. All prices are in INR
  </p>
</section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 ">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
              Build Faster. Apply Smarter. Earn Bigger.
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Whether you are creating your own resume or starting a professional service, Resume Yatra gives you a
              fast, modern, SaaS-grade experience from the first click.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                <button
                  onClick={() => navigate('/onboarding')}
                  className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-[#dda431] to-[#dda431] shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Create My Resume
                </button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                <button
                  onClick={() => handleNavClick('pricing')}
                  className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-white bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                >
                  See Pricing
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <ScrollToTopButton />

      {/* Footer */}
      <footer className="py-10 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
        © 2026 Resume Yatra. All rights reserved.
      </footer>
    </div>
  );
};

export default Hero;

const ScrollToTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300); // show after scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!show) return null;

  return (
    <motion.button
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-[#06497f] to-[#06497f]/80 text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
    >
      <svg
  className="w-5 h-5"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
</svg>
    </motion.button>
  );
};