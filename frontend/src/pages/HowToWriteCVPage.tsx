import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, FileText, Target, Users, ArrowRight, Star, Lightbulb, BookOpen, Briefcase, ChevronDown, ChevronUp, Download, Award, TrendingUp, Zap } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/home/Navbar';
import "remixicon/fonts/remixicon.css";

type ExampleItem = string | { weak: string; strong: string };

export function HowToWriteCVPage() {
   const [expandedTip, setExpandedTip] = useState<string | null>(null);
   const [showScrollTop, setShowScrollTop] = useState(false);
   const { scrollYProgress } = useScroll();
   const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

   const toggleTip = (id: string) => {
     setExpandedTip(expandedTip === id ? null : id);
   };

   useEffect(() => {
     const handleScroll = () => {
       setShowScrollTop(window.scrollY > 500);
     };
     window.addEventListener('scroll', handleScroll);
     return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const scrollToTop = () => {
     window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const scrollToSection = (sectionId: string) => {
     const element = document.getElementById(sectionId);
     if (element) {
       element.scrollIntoView({ behavior: 'smooth' });
     }
   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#04477E] z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />

      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#04477E] text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#04477E] to-[#0660a9] text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              How to Write a CV
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
            >
              Master the art of CV writing with our comprehensive guide. Learn proven techniques to create a standout CV that gets you noticed.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/templates"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#04477E] hover:bg-gray-50 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Writing Your CV <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#04477E] rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Get Started Free
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <button
              onClick={() => scrollToSection('cv-structure')}
              className="text-gray-600 dark:text-gray-300 hover:text-[#04477E] dark:hover:text-[#DDA337] transition-colors font-medium"
            >
              CV Structure
            </button>
            <button
              onClick={() => scrollToSection('writing-tips')}
              className="text-gray-600 dark:text-gray-300 hover:text-[#04477E] dark:hover:text-[#DDA337] transition-colors font-medium"
            >
              Writing Tips
            </button>
            <button
              onClick={() => scrollToSection('advanced-strategies')}
              className="text-gray-600 dark:text-gray-300 hover:text-[#04477E] dark:hover:text-[#DDA337] transition-colors font-medium"
            >
              Advanced Strategies
            </button>
          </div>
        </div>
      </section>

      {/* CV Structure Section */}
      <section id="main-content" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Essential CV Structure
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Follow this proven structure to create a professional CV that recruiters love to read.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-[#04477E]/10 rounded-xl flex items-center justify-center mb-6">
                <i className="ri-user-line text-2xl text-[#04477E]"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Include your full name, phone number, email address, and location. Keep it professional and up-to-date.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Professional email address
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Current phone number
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  LinkedIn profile (optional)
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-[#DDA337]/10 rounded-xl flex items-center justify-center mb-6">
                <i className="ri-focus-2-line text-2xl text-[#DDA337]"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Professional Summary
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                A 3-5 sentence overview of your professional background, key skills, and career goals.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Tailored to the job
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Quantifiable achievements
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Keywords from job description
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-[#04477E]/10 rounded-xl flex items-center justify-center mb-6">
                <i className="ri-briefcase-line text-2xl text-[#04477E]"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Work Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                List your most recent positions first, including job titles, company names, dates, and achievements.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Reverse chronological order
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Action verbs
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Measurable results
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-[#DDA337]/10 rounded-xl flex items-center justify-center mb-6">
                <i className="ri-book-open-line text-2xl text-[#DDA337]"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Education
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Include your degrees, certifications, and relevant coursework. Focus on recent and relevant education.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Degree and institution
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Graduation dates
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  GPA (if impressive)
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-[#04477E]/10 rounded-xl flex items-center justify-center mb-6">
                <i className="ri-star-line text-2xl text-[#04477E]"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Skills
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Highlight your technical and soft skills relevant to the position. Include proficiency levels when appropriate.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Job-specific skills
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Technical proficiencies
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Soft skills
                </div>
              </div>
            </div>

            {/* Additional Sections */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-[#DDA337]/10 rounded-xl flex items-center justify-center mb-6">
                <i className="ri-file-text-line text-2xl text-[#DDA337]"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Additional Sections
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Include certifications, awards, volunteer work, or projects that demonstrate your qualifications.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Certifications
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Awards and honors
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-2">✓</span>
                  Professional development
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Writing Tips Section */}
      <section id="writing-tips" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              CV Writing Tips & Best Practices
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Follow these expert tips to create a CV that stands out from the competition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                id: 'action-verbs',
                icon: Lightbulb,
                color: '#04477E',
                title: 'Use Action Verbs',
                description: 'Start each bullet point with strong action verbs that demonstrate your accomplishments and responsibilities.',
                examples: [
                  { weak: 'Responsible for managing team projects', strong: 'Led cross-functional team of 8 members to deliver 5 major projects ahead of schedule' },
                  { weak: 'Worked on improving sales', strong: 'Implemented new sales strategy that increased revenue by 40% in Q4' }
                ],
                delay: 0.1
              },
              {
                id: 'quantify-achievements',
                icon: Target,
                color: '#DDA337',
                title: 'Quantify Your Achievements',
                description: 'Use numbers, percentages, and metrics to demonstrate the impact of your work whenever possible.',
                examples: [
                  'Increased sales by 35% in 6 months',
                  'Reduced operational costs by $50K annually',
                  'Managed budget of $2M for department projects',
                  'Trained 15 new team members'
                ],
                delay: 0.2
              },
              {
                id: 'tailor-cv',
                icon: CheckCircle,
                color: '#04477E',
                title: 'Tailor Your CV for Each Job',
                description: 'Customize your CV for each position by incorporating keywords from the job description and highlighting relevant experience.',
                examples: [
                  'Read the job description carefully',
                  'Identify key skills and requirements',
                  'Adjust your summary and experience sections',
                  'Use industry-specific terminology'
                ],
                delay: 0.3
              },
              {
                id: 'ats-friendly',
                icon: FileText,
                color: '#DDA337',
                title: 'Keep It Concise and ATS-Friendly',
                description: 'Aim for 1-2 pages and ensure your CV can be easily read by Applicant Tracking Systems (ATS).',
                examples: [
                  'Use standard fonts (Arial, Calibri, Times New Roman)',
                  'Include keywords from the job posting',
                  'Avoid tables, graphics, and complex formatting',
                  'Use clear section headings'
                ],
                delay: 0.4
              }
            ].map((tip) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: tip.delay }}
                viewport={{ once: true }}
                className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden border border-gray-100 dark:border-gray-700"
                style={{
                  background: `linear-gradient(135deg, ${tip.color}08 0%, ${tip.color}05 100%)`,
                  borderColor: `${tip.color}20`
                }}
              >
                {/* Background gradient overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${tip.color}20 0%, ${tip.color}10 100%)`
                  }}
                />

                <div className="relative z-10">
                  {/* Header with icon and title */}
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{
                        backgroundColor: `${tip.color}15`,
                        boxShadow: `0 8px 32px ${tip.color}20`
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <tip.icon className="w-8 h-8" style={{ color: tip.color }} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                        {tip.title}
                      </h3>
                      <div
                        className="w-12 h-1 rounded-full mt-2"
                        style={{ backgroundColor: tip.color }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                    {tip.description}
                  </p>

                  {/* Expand Button */}
                  <motion.button
                    onClick={() => toggleTip(tip.id)}
                    aria-expanded={expandedTip === tip.id}
                    aria-controls={`tip-content-${tip.id}`}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 group/btn"
                    style={{
                      borderColor: `${tip.color}30`,
                      backgroundColor: expandedTip === tip.id ? `${tip.color}10` : 'transparent'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm font-semibold" style={{ color: tip.color }}>
                      {expandedTip === tip.id ? 'Hide Examples' : 'View Examples'}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedTip === tip.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5" style={{ color: tip.color }} />
                    </motion.div>
                  </motion.button>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {expandedTip === tip.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="mt-6 overflow-hidden"
                      >
                        <div
                          id={`tip-content-${tip.id}`}
                          className="rounded-2xl p-6 border-l-4"
                          style={{
                            backgroundColor: `${tip.color}05`,
                            borderColor: tip.color
                          }}
                        >
                          {tip.title === 'Use Action Verbs' ? (
                            <div className="space-y-6">
                              {(tip.examples as ExampleItem[]).map((example, idx) => {
                                if (typeof example === 'object' && example !== null && 'weak' in example && 'strong' in example) {
                                  return (
                                    <div key={idx} className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <span className="text-sm font-semibold text-red-600 dark:text-red-400">Weak Example</span>
                                          </div>
                                          <p className="text-sm text-gray-600 dark:text-gray-300 italic pl-5">{example.weak}</p>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">Strong Example</span>
                                          </div>
                                          <p className="text-sm text-gray-600 dark:text-gray-300 pl-5">{example.strong}</p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Examples</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(tip.examples as string[]).map((example, idx) => (
                                  <div key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                                    <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{example}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Tips Section */}
      <section id="advanced-strategies" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced CV Writing Strategies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Take your CV to the next level with these advanced techniques used by top professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#04477E] to-[#0660a9] text-white rounded-2xl p-8 text-center"
            >
              <Award className="w-16 h-16 mx-auto mb-6 text-[#DDA337]" />
              <h3 className="text-2xl font-bold mb-4">Power Keywords</h3>
              <p className="text-blue-100 mb-6">
                Use industry-specific keywords that ATS systems and recruiters are looking for.
              </p>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-blue-100">
                  "Strategic planning", "Cross-functional collaboration", "Data-driven decision making"
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#DDA337] to-[#e6b85c] text-white rounded-2xl p-8 text-center"
            >
              <TrendingUp className="w-16 h-16 mx-auto mb-6 text-[#04477E]" />
              <h3 className="text-2xl font-bold mb-4">Impact Metrics</h3>
              <p className="text-gray-800 mb-6">
                Show measurable results and ROI for every achievement you list.
              </p>
              <div className="bg-white/20 rounded-lg p-4">
                <p className="text-sm text-gray-800">
                  "Reduced costs by 40%", "Increased efficiency by 60%", "Generated $2M in revenue"
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#04477E] to-[#0660a9] text-white rounded-2xl p-8 text-center"
            >
              <Zap className="w-16 h-16 mx-auto mb-6 text-[#DDA337]" />
              <h3 className="text-2xl font-bold mb-4">Personal Branding</h3>
              <p className="text-blue-100 mb-6">
                Highlight your unique value proposition and what sets you apart from other candidates.
              </p>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-blue-100">
                  "Innovative problem solver", "Results-oriented leader", "Continuous learner"
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#04477E] to-[#0660a9] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Write Your Perfect CV?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Use our CV builder to create a professional CV that gets results. Start with one of our expertly designed templates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/templates"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#04477E] hover:bg-gray-50 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Choose a Template <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#04477E] rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-[#04477E] hover:bg-[#033a5f] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
            aria-label="Scroll to top"
          >
            <i className="ri-arrow-up-line text-xl"></i>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
