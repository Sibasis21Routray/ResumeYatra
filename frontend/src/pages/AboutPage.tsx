import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Database, Cloud, Cpu, ArrowRight, Star, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/home/Navbar';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" style={{ minHeight: '50vh' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-[head] mb-6">
                About ResumeYatra
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-[content] mb-8 leading-relaxed">
                Empowering careers through innovative resume building tools. Our mission is to help professionals create standout resumes that open doors to new opportunities, combining AI-powered insights with beautiful, ATS-friendly templates.
              </p>
              <Link
                to="/career-center"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#04477E] text-white rounded-lg hover:bg-[#033a5e] transition-all duration-300 font-[head] font-semibold"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Side Visual */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Resume Illustration SVG */}
                <svg
                  width="300"
                  height="250"
                  viewBox="0 0 300 250"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-lg"
                >
                  {/* Document background */}
                  <rect x="50" y="30" width="200" height="180" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2"/>
                  {/* Header */}
                  <rect x="70" y="50" width="60" height="8" rx="4" fill="#04477E"/>
                  <rect x="140" y="50" width="80" height="8" rx="4" fill="#DDA337"/>
                  {/* Content lines */}
                  <rect x="70" y="70" width="160" height="4" rx="2" fill="#cbd5e1"/>
                  <rect x="70" y="85" width="140" height="4" rx="2" fill="#cbd5e1"/>
                  <rect x="70" y="100" width="120" height="4" rx="2" fill="#cbd5e1"/>
                  {/* Section divider */}
                  <line x1="70" y1="125" x2="230" y2="125" stroke="#e2e8f0" strokeWidth="1"/>
                  {/* More content */}
                  <rect x="70" y="140" width="100" height="4" rx="2" fill="#cbd5e1"/>
                  <rect x="70" y="155" width="150" height="4" rx="2" fill="#cbd5e1"/>
                  <rect x="70" y="170" width="80" height="4" rx="2" fill="#cbd5e1"/>
                  {/* Career ladder elements */}
                  <circle cx="150" cy="220" r="15" fill="#04477E" opacity="0.8"/>
                  <circle cx="150" cy="190" r="12" fill="#DDA337" opacity="0.8"/>
                  <circle cx="150" cy="160" r="10" fill="#04477E" opacity="0.6"/>
                  <line x1="150" y1="175" x2="150" y2="205" stroke="#04477E" strokeWidth="2"/>
                  <line x1="150" y1="205" x2="150" y2="235" stroke="#DDA337" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-[head] dark:text-white mb-3">
              Everything You Need to Build Amazing Resumes
            </h2>
            <div className="w-16 h-1 bg-[#04477E] mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-[content] dark:text-gray-300 max-w-2xl mx-auto">
              From AI-powered content suggestions to professional templates, we've got you covered with tools designed for success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop&crop=center',
                title: 'AI-Powered Writing',
                description: 'Smart suggestions to enhance your resume content and make it stand out.',
              },
              {
                imageUrl: './imgs/templates.jpg',
                title: 'Professional Templates',
                description: 'ATS-friendly templates designed by experts for various industries.',
              },
              {
                imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=225&fit=crop&crop=center',
                title: 'Cloud Storage',
                description: 'Secure access to your resumes anywhere, anytime from any device.',
              },
              {
                imageUrl: './imgs/smart_parsing.jpg',
                title: 'Smart Parsing',
                description: 'AI extracts and organizes your information automatically.',
              },
              {
                imageUrl: './imgs/multi_user.jpg',
                title: 'Multi-User Support',
                description: 'Multiple accounts for different purposes and team collaboration.',
              },
              {
                imageUrl: './imgs/hero_home.jpg',
                title: 'Real-time Preview',
                description: 'Instant PDF preview and download with live editing feedback.',
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={feature.imageUrl}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 font-[head] dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 font-[content] dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Quick Start Flow */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-20 w-32 h-32 bg-[#04477E]/20 rounded-full blur-xl"
          ></motion.div>
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-[#DDA337]/20 rounded-full blur-xl"
          ></motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-[head] text-gray-900 dark:text-white mb-4">
              Get Started in 5 Minutes
            </h2>
            <p className="text-xl text-gray-600 font-[content] dark:text-gray-300 max-w-2xl mx-auto">
              Follow our simple setup guide to start building professional resumes immediately.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Animated Progress Flow */}
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-[#04477E] via-[#04477E]/50 to-[#DDA337]"></div>

              <div className="space-y-12">
                {[
                  {
                    step: 1,
                    title: 'Set Up Your Account',
                    description: 'Create a free account and get access to all features. No credit card required.',
                    color: '#04477E',
                    delay: 0.2
                  },
                  {
                    step: 2,
                    title: 'Choose a Template',
                    description: 'Browse our collection of professional templates designed for different industries.',
                    color: '#04477E',
                    delay: 0.4
                  },
                  {
                    step: 3,
                    title: 'Add Your Information',
                    description: 'Fill in your details or upload an existing resume. Our AI will help optimize your content.',
                    color: '#DDA337',
                    delay: 0.6
                  },
                  {
                    step: 4,
                    title: 'Download & Apply',
                    description: 'Preview your resume and download it as PDF. Start applying to jobs with confidence!',
                    color: '#DDA337',
                    delay: 0.8
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: step.delay }}
                    viewport={{ once: true }}
                    className="relative flex items-start gap-6"
                  >
                    {/* Animated Step Indicator */}
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg relative z-10"
                      style={{ backgroundColor: step.color }}
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: step.delay + 0.3, type: "spring", stiffness: 500 }}
                        viewport={{ once: true }}
                      >
                        {step.step}
                      </motion.span>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <motion.h3
                        className="text-lg font-semibold font-[head] text-gray-900 dark:text-white mb-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: step.delay + 0.4 }}
                        viewport={{ once: true }}
                      >
                        {step.title}
                      </motion.h3>
                      <motion.p
                        className="text-gray-600 font-[content] dark:text-gray-300 leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: step.delay + 0.5 }}
                        viewport={{ once: true }}
                      >
                        {step.description}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src="https://cdn-images.livecareer.co.uk/pages/hero-homepage-lcuk@2x.png"
                alt="ResumeMaker Hero Image"
                className="w-full h-full rounded-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

     

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#04477E] to-[#0660a9] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have landed their dream jobs with ResumeMaker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/templates"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#04477E] hover:bg-gray-50 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Building Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#04477E] rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
