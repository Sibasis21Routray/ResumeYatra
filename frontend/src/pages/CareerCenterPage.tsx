import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, TrendingUp, Users, Award, ArrowRight, 
  Target, Briefcase, Lightbulb, ChevronRight, Star,
  Clock, CheckCircle, FileText, Calendar, Zap,
  BarChart, Globe, Shield, Download, PlayCircle
} from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/home/Navbar';

// ─── Brand Tokens ──────────────────────────────────────────────────────────
const B = '#01467d';   // primary blue
const Y = '#dea42c';   // accent yellow
const W = '#ffffff';

export function CareerCenterPage() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.85]);
  const heroScale  = useTransform(scrollYProgress, [0, 0.25], [1, 0.97]);

  // ── Data ──────────────────────────────────────────────────────────────────
  const resources = [
    {
      imageUrl: './imgs/resumewriting.jpg',
      accentColor: B,
      title: 'Resume Writing',
      description: 'Craft compelling resumes that pass ATS filters and catch recruiter attention at a glance.',
      features: ['Resume structure & formatting', 'Keyword optimisation', 'Industry-specific tips'],
      stats: { views: '12.5k', time: '15 min' },
      icon: FileText,
      delay: 0.05
    },
    {
      imageUrl: './imgs/job_search.jpg',
      accentColor: Y,
      title: 'Job Search Strategies',
      description: 'Master the art of finding and applying to roles that match your skills and ambitions.',
      features: ['LinkedIn optimisation', 'Networking techniques', 'Application tracking'],
      stats: { views: '8.2k', time: '12 min' },
      icon: Target,
      delay: 0.10
    },
    {
      imageUrl: './imgs/interview_preparation.jpg',
      accentColor: B,
      title: 'Interview Preparation',
      description: 'Walk into every interview with confidence using proven techniques and practice questions.',
      features: ['Common interview questions', 'Behavioural interviews', 'Virtual interview tips'],
      stats: { views: '15.8k', time: '20 min' },
      icon: Users,
      delay: 0.15
    },
    {
      imageUrl: './imgs/career_development.jpg',
      accentColor: Y,
      title: 'Career Development',
      description: 'Map your professional path and build the skills needed to reach your peak potential.',
      features: ['Career planning', 'Skill development', 'Salary negotiation'],
      stats: { views: '10.1k', time: '18 min' },
      icon: TrendingUp,
      delay: 0.20
    },
    {
      imageUrl: './imgs/industry_insights.jpg',
      accentColor: B,
      title: 'Industry Insights',
      description: 'Stay ahead with the latest trends, technologies, and emerging opportunities.',
      features: ['Industry trends', 'Emerging technologies', 'Market analysis'],
      stats: { views: '6.7k', time: '10 min' },
      icon: BarChart,
      delay: 0.25
    },
    {
      imageUrl: './imgs/success_stories.jpg',
      accentColor: Y,
      title: 'Success Stories',
      description: 'Learn from real professionals who have transformed their careers with our tools.',
      features: ['Career transitions', 'Job search success', 'Professional growth'],
      stats: { views: '9.3k', time: '8 min' },
      icon: Award,
      delay: 0.30
    }
  ];

  const quickStats = [
    { icon: Users,    value: '5K+',  label: 'Active Users'    },
    { icon: FileText, value: '10K+', label: 'Resumes Built'   },
    { icon: Award,    value: '95%',   label: 'Success Rate'    },
    { icon: Globe,    value: '30+',   label: 'Industries'      }
  ];

  const successStories = [
    {
      name: 'Sarah Johnson', role: 'Marketing Director', company: 'Google',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      quote: 'This platform helped me land my dream job at Google. The resume builder and interview prep were game-changers.'
    },
    {
      name: 'Michael Chen', role: 'Senior Software Engineer', company: 'Microsoft',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      quote: 'The career resources and networking tips helped me transition from a startup to a tech giant.'
    },
    {
      name: 'Emily Rodriguez', role: 'Product Manager', company: 'Amazon',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      quote: 'From resume optimisation to interview preparation, every resource was incredibly valuable.'
    }
  ];

  const tips = [
    {
      step: 1, color: B,
      title: 'Tailor Your Resume for Each Job',
      description: 'Customise your resume for each position by weaving in keywords from the job description and spotlighting the most relevant experience.',
      tips: ['Read the job posting carefully', 'Identify key skills and requirements', 'Adjust your resume content accordingly', 'Use industry-specific terminology'],
      delay: 0.1
    },
    {
      step: 2, color: Y,
      title: 'Network Actively and Consistently',
      description: 'Building professional relationships opens doors to opportunities that are never publicly advertised.',
      tips: ['Attend industry events and conferences', 'Join professional associations', 'Connect thoughtfully on LinkedIn', 'Follow up and maintain relationships'],
      delay: 0.2
    },
    {
      step: 3, color: B,
      title: 'Continuously Learn and Upskill',
      description: 'The market evolves fast. Stay competitive by picking up new capabilities and deepening existing expertise.',
      tips: ['Take online courses and certifications', 'Learn new tools and technologies', 'Read industry publications', 'Seek mentorship opportunities'],
      delay: 0.3
    },
    {
      step: 4, color: Y,
      title: 'Track Applications and Follow Up',
      description: 'Stay organised and proactive throughout your job search by tracking each application and following up thoughtfully.',
      tips: ['Use a spreadsheet to track applications', 'Follow up 1–2 weeks after applying', 'Send personalised thank-you notes', 'Keep notes on every interaction'],
      delay: 0.4
    }
  ];

  useEffect(() => {
    resources.forEach(r => { const img = new Image(); img.src = r.imageUrl; });
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
      <Navbar />

{/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
<motion.section
  style={{ opacity: heroOpacity, scale: heroScale, background: B }}
  className="relative overflow-hidden flex flex-col min-h-[600px] lg:min-h-[650px]"
>
  {/* ── Full-bleed background: left blue / right image ── */}
  <div className="absolute inset-0 flex">
    {/* Left panel – brand blue */}
    <div className="w-full lg:w-[55%] h-full" style={{ background: B }} />
    {/* Right panel – photo */}
    <div className="hidden lg:block lg:w-[45%] h-full relative">
      <img
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=900&fit=crop&q=80"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* darkening scrim */}
      <div className="absolute inset-0" style={{ background: 'rgba(1,70,125,0.38)' }} />
    </div>
  </div>

  {/* ── Diagonal clip connecting left → right ── */}
  <div className="hidden lg:block absolute inset-y-0 left-[52%] w-[8%] z-10"
    style={{
      background: B,
      clipPath: 'polygon(0 0, 60% 0, 100% 100%, 0 100%)',
    }}
  />

  {/* ── Decorative dot grid (left panel only) ── */}
  <div className="absolute inset-0 lg:w-[60%] pointer-events-none opacity-[0.06]"
    style={{
      backgroundImage: `radial-gradient(circle, #fff 1.2px, transparent 1.2px)`,
      backgroundSize: '26px 26px',
    }}
  />

  {/* ── Accent glow blob ── */}
  <motion.div
    animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.28, 0.18] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none"
    style={{ background: `radial-gradient(circle, ${Y}55 0%, transparent 70%)` }}
  />

  {/* ── Floating yellow accent bar ── */}
  <motion.div
    initial={{ scaleX: 0, originX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="absolute top-0 left-0 h-1 w-[55%] z-20"
    style={{ background: `linear-gradient(to right, ${Y}, ${Y}00)` }}
  />

  {/* ── Main content grid ── */}
  <div className="relative z-20 flex-1 mx-auto lg:mx-12  w-full  px-6  lg:px-12 flex items-center">
    <div className="grid lg:grid-cols-[1.2fr_0.8fr] w-full items-center gap-8">

      {/* LEFT: Copy - Bigger and tighter */}
      <motion.div
        className="w-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } }
        }}
      >
        {/* Eyebrow */}
        <motion.div
          variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="block w-10 h-[3px]" style={{ background: Y }} />
          <span className="text-sm font-bold uppercase tracking-[0.15em]" style={{ color: Y }}>
            Career Center
          </span>
        </motion.div>

        {/* Headline - Bigger, 2 straight lines */}
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-black text-white leading-[0.95] tracking-tight mb-3"
        >
           Build a Resume That
          <br />
          <span className="relative inline-block mt-1">
            <span style={{ color: Y }}>Gets You Hired</span>
            {/* underline squiggle - thicker */}
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              viewBox="0 0 350 16" 
              className="absolute -bottom-3 left-0 w-full"
              preserveAspectRatio="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M0 12 Q90 3 175 12 Q260 21 350 12"
                fill="none" 
                stroke={Y} 
                strokeWidth="5"
                strokeLinecap="round"
              />
            </motion.svg>
          </span>
        </motion.h1>

        {/* Body - More prominent */}
        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg lg:text-xl leading-relaxed mb-6 max-w-xl"
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          AI-powered resume builder with ATS analysis, keyword optimization, and recruiter-ready templates — built to maximize your hiring success.
        </motion.p>

        {/* CTAs - Bigger */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Link
            to="/templates"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200"
            style={{ background: Y, color: B }}
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>

        {/* Stats bar - Bigger numbers */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 pt-6 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.15)' }}
        >
          {quickStats.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.09, duration: 0.4 }}
            >
              <div className="text-2xl md:text-3xl font-black text-white mb-0.5">{s.value}</div>
              <div className="flex items-center gap-1.5">
                <s.icon className="w-4 h-4 opacity-60 text-white" />
                <span className="text-xs font-medium tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {s.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* RIGHT: Floating cards over the photo */}
      <div className="hidden lg:flex flex-col gap-4 relative z-30 mt-0 ml-auto">
        {/* Success rate card - Bigger */}
        <motion.div
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.16,1,0.3,1] }}
          whileHover={{ y: -4 }}
          className="bg-white rounded-xl px-5 py-4 shadow-2xl flex items-center gap-4 w-64"
        >
          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: B }}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-black text-gray-900">85% Success Rate</div>
            <div className="text-xs text-gray-500 mt-0.5">Interviews within 30 days</div>
          </div>
        </motion.div>

        {/* Resumes built card - Bigger */}
        <motion.div
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.16,1,0.3,1] }}
          whileHover={{ y: -4 }}
          className="bg-white rounded-xl px-5 py-4 shadow-2xl flex items-center gap-4 w-64 ml-8"
        >
          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: Y }}>
            <FileText className="w-5 h-5" style={{ color: B }} />
          </div>
          <div>
            <div className="text-sm font-black text-gray-900">10K+ Resumes</div>
            <div className="text-xs text-gray-500 mt-0.5">Built with our platform</div>
          </div>
        </motion.div>

        {/* Live users pill - Bigger */}
        <motion.div
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: [0.16,1,0.3,1] }}
          className="flex items-center gap-2.5 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-xl self-start"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: '#22c55e' }} />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#22c55e' }} />
          </span>
          <span className="text-xs font-semibold text-gray-800">5K+ active users</span>
        </motion.div>
      </div>
    </div>
  </div>

  {/* ── Wave divider ── */}
  {/* <div className="relative z-20 leading-none overflow-hidden mt-auto">
    <svg 
      viewBox="0 0 1440 56" 
      preserveAspectRatio="none"
      className="block w-full h-[56px] md:h-[64px] align-bottom" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', marginBottom: '-2px' }}
    >
      <path
        d="M0 56 L0 28 Q180 0 360 22 Q540 44 720 28 Q900 12 1080 24 Q1260 36 1440 20 L1440 56 Z"
        fill="white" 
        className="dark:fill-gray-950"
      />
    </svg>
  </div> */}
</motion.section>

{/* ═════════════════════════ RESOURCES HUB ═════════════════════════── */}
<section className="py-24 bg-white dark:bg-gray-950">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    
    {/* Simple header - minimal */}
    <div className="mb-16">
      <span className="text-sm font-medium text-gray-400 dark:text-gray-500 block mb-3">LEARNING LIBRARY</span>
      <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white">
        Guides that<br />actually help
      </h2>
    </div>

    {/* Simple 3-column grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource, idx) => {
        const Icon = resource.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 h-full hover:bg-white dark:hover:bg-gray-800 transition-colors duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
              
              {/* Icon */}
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5" style={{ color: resource.accentColor }} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {resource.description}
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <span>{resource.stats.views} reads</span>
                <span>•</span>
                <span>{resource.stats.time}</span>
              </div>

              
            </div>
          </motion.div>
        );
      })}
    </div>

  
  </div>
</section>

{/* ══════════════════════════ TIPS TIMELINE ════════════════════════════ */}
<section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
  {/* Background decorative elements */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-5" style={{ background: B, filter: 'blur(80px)' }} />
    <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-5" style={{ background: Y, filter: 'blur(80px)' }} />
  </div>

  <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
    <motion.div 
      initial={{ opacity: 0, y: 24 }} 
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} 
      viewport={{ once: true, margin: "-100px" }}
      className="text-center max-w-3xl mx-auto mb-20"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 shadow-sm"
        style={{ background: `${Y}15`, border: `1px solid ${Y}30` }}>
        <Lightbulb className="w-4 h-4" style={{ color: Y }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: Y }}>Pro Tips</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
        Career Tips That <span style={{ color: Y }}>Work</span>
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Practical, actionable steps distilled from thousands of successful job seekers. Follow these proven strategies to accelerate your career growth.
      </p>
    </motion.div>

    <div className="relative">
      {/* Modern gradient line - hidden on mobile, visible on md and up */}
      <motion.div 
        initial={{ height: 0 }}
        whileInView={{ height: '100%' }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-[#01467d] via-[#dea42c] to-[#01467d] rounded-full shadow-lg hidden md:block"
        style={{ 
          background: `linear-gradient(180deg, ${B} 0%, ${Y} 50%, ${B} 100%)`,
          boxShadow: `0 0 20px ${B}40`
        }}
      />

      {tips.map((tip, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: tip.delay }}
          viewport={{ once: true, margin: "-50px" }}
          className={`relative flex items-start mb-16 last:mb-0 ${
            i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          {/* Timeline node - hidden on mobile, visible on md and up */}
          <motion.div
            whileHover={{ scale: 1.3, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full hidden md:flex items-center justify-center z-20 shadow-xl"
            style={{ 
              background: `linear-gradient(135deg, ${tip.color}, ${tip.color === B ? '#013a66' : '#c48b1f'})`,
              border: '3px solid white',
              boxShadow: `0 0 0 4px ${tip.color}20, 0 10px 20px -5px ${tip.color}80`
            }}
          >
            <span className="text-white font-bold text-sm">{tip.step}</span>
          </motion.div>

          {/* Content card */}
          <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`w-full md:w-[calc(50%-3rem)] ${
              i % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
            }`}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
              style={{
                border: `1px solid ${tip.color}20`,
                background: `linear-gradient(135deg, white 0%, ${tip.color}02 100%)`,
              }}
            >
              {/* Decorative corner accent */}
              <div 
                className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at top right, ${tip.color}, transparent 70%)`
                }}
              />

              {/* Step indicator - visible on mobile only */}
              <div className="flex md:hidden items-center gap-3 mb-5">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${tip.color}, ${tip.color === B ? '#013a66' : '#c48b1f'})`,
                    boxShadow: `0 5px 15px -3px ${tip.color}80`
                  }}
                >
                  {tip.step}
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: tip.color }}>
                    Step {tip.step}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tip.title.split(' ').slice(0, 3).join(' ')}...</h3>
                </div>
              </div>

              {/* Step badge - hidden on mobile, visible on md and up */}
              <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: `${tip.color}14`, color: tip.color }}>
                <span>Step {tip.step}</span>
              </div>

              {/* Title - hidden on mobile (shown in mobile step indicator) */}
              <h3 className="hidden md:block text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:translate-x-1 transition-transform duration-300">
                {tip.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                {tip.description}
              </p>

              {/* Tips grid */}
              <div className="grid gap-3 mt-6">
                {tip.tips.map((item, ti) => (
                  <motion.div
                    key={ti}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: tip.delay + ti * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group/item"
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md group-hover/item:scale-110 transition-transform duration-300"
                      style={{ 
                        background: `linear-gradient(135deg, ${tip.color}, ${tip.color === B ? '#013a66' : '#c48b1f'})`,
                        boxShadow: `0 2px 8px ${tip.color}60`
                      }}
                    >
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-200 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Progress indicator */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Step {tip.step} of {tips.length}</span>
                  <div className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(tip.step / tips.length) * 100}%` }}
                      transition={{ duration: 0.8, delay: tip.delay + 0.3 }}
                      viewport={{ once: true }}
                      className="h-full rounded-full"
                      style={{ background: tip.color }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>

  
  </div>
</section>

      {/* ═════════════════════════ SUCCESS STORIES ═══════════════════════════ */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
              style={{ background: `${B}12` }}>
              <Award className="w-3.5 h-3.5" style={{ color: B }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: B }}>Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              Real People, Real Results
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              See how professionals like you have transformed their careers using our platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-7">
            {successStories.map((story, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }} viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-5">
                  <img src={story.image} alt={story.name}
                    className="w-14 h-14 rounded-full object-cover ring-2"
                    style={{ '--tw-ring-color': `${B}40` } as React.CSSProperties} />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{story.name}</h4>
                    <p className="text-xs font-semibold" style={{ color: B }}>{story.role}</p>
                    <p className="text-xs text-gray-400">{story.company}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5" style={{ fill: Y, color: Y }} />
                  ))}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed italic">"{story.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CTA SECTION ══════════════════════════── */}
      <section className="relative overflow-hidden py-24"
        style={{ background: `linear-gradient(135deg, ${B} 0%, #01559e 50%, #0163b5 100%)` }}>
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

        <motion.div animate={{ scale: [1,1.15,1], rotate: [0,60,0] }} transition={{ duration: 22, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: Y }} />
        <motion.div animate={{ scale: [1,1.2,1], rotate: [0,-60,0] }} transition={{ duration: 28, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: W }} />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
              Ready to Advance<br />Your Career?
            </h2>
            <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
              Join over 50,000 professionals who have already transformed their careers with our platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/templates"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:opacity-90 shadow-lg"
                style={{ background: Y, color: B }}>
                Create Your Resume
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[
                { icon: Shield, label: 'Secure Platform' },
                { icon: Users,  label: '5K+ Active Users' },
                { icon: Award,  label: '85% Success Rate' }
              ].map((b, bi) => (
                <div key={bi} className="flex items-center gap-2">
                  <b.icon className="w-4 h-4 text-white/50" />
                  <span className="text-sm text-white/70">{b.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}