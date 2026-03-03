import React from "react";
import {
  Mail,
  FileText,
  Send,
  Star,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Strap from "./Strap";

const Hero = () => {
  const navigate = useNavigate();

  const features = ["Smart suggestions", "Real-time edits", "Tailored content"];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative  bg-[#fcfdfe] dark:bg-[#020617] overflow-hidden font-sans text-[#022c4e] dark:text-slate-100 transition-colors duration-300"
    >
      {/* Solid Blue Half-Circle at Top - More circular at top, straighter at bottom */}
      {/* Solid Blue Half-Circle - Circular at bottom, straight at top */}
      <motion.div 
        
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1500px] sm:w-[1800px] md:w-[2000px] h-[420px] sm:h-[500px] md:h-[550px] lg:h-[550px] xl:h-[600px] 2xl:h-[650px] overflow-hidden pointer-events-none"
      >
        {/* Main circle - rounded at bottom, straight at top */}
        <div className="absolute inset-0 bg-[#04477E] dark:bg-[#1e3a8a] rounded-bl-[50%] rounded-br-[50%] rounded-tl-[30%] rounded-tr-[30%] transform scale-x-110"></div>
        
        {/* Additional layer to flatten the top */}
        <div className="absolute top-0 left-0 right-0 h-[100px] bg-[#04477E] dark:bg-[#1e3a8a]"></div>
        
        {/* Gradient overlay for smooth transition */}
        <div className="absolute top-[100px] left-0 right-0 h-[50px] bg-gradient-to-t from-[#04477E] to-[#04477E] dark:from-[#1e3a8a] dark:to-[#1e3a8a] opacity-90"></div>
        
        {/* Very subtle inner glow for depth only */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-bl-[50%] rounded-br-[50%] rounded-tl-[30%] rounded-tr-[30%]"></div>
      </motion.div>

      {/* Optional: Add a second layer for more depth */}
      {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] sm:w-[1900px] md:w-[2100px] h-[380px] sm:h-[430px] md:h-[480px] lg:h-[530px] xl:h-[580px] 2xl:h-[630px] overflow-hidden pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[#0ea5e9] dark:bg-[#2563eb] rounded-bl-[45%] rounded-br-[45%] rounded-tl-[25%] rounded-tr-[25%] transform scale-x-105"></div>
      </div> */}

      <header className="relative z-10 pt-10 sm:pt-12 md:pt-14 lg:pt-16 xl:pt-20 pb-8 sm:pb-10 md:pb-12 text-center mx-auto px-4 sm:px-6">
        {/* Trustpilot Section - Improved UI */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10"
        >
          {/* Trustpilot badge with better styling */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg"
          >
            {/* Star rating */}
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <Star 
                      size={14} 
                      className="sm:w-4 sm:h-4 md:w-5 md:h-5" 
                      fill="#00b67a" 
                      stroke="none" 
                    />
                  </motion.div>
                ))}
              </div>
              <span className="text-xs sm:text-sm font-bold text-white ml-1">5.0</span>
            </div>
            
            {/* Divider */}
            <div className="w-px h-4 bg-white/20"></div>
            
            {/* Trustpilot text with logo */}
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <div className="absolute -inset-1 bg-white/20 blur-sm rounded-full"></div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center"
                >
                  <span className="text-[10px] sm:text-xs font-black text-[#00b67a]">★</span>
                </motion.div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white">Trustpilot</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Heading - 3D Text Effect with responsive sizing */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative inline-block max-w-[95%] sm:max-w-[90%] mx-auto"
        >
          {/* 3D Shadow Layer 1 */}
          <motion.div 
            variants={fadeInUp}
            className="absolute inset-0 transform translate-y-1 sm:translate-y-2 blur-[1px] opacity-30"
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-blue-900 dark:text-blue-950">
              AI-powered free CV maker
              <br className="hidden sm:block" />
              <span className="block sm:inline">Build a CV in minutes</span>
            </h1>
          </motion.div>
          
          {/* 3D Shadow Layer 2 */}
          <motion.div 
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="absolute inset-0 transform translate-y-0.5 sm:translate-y-1 blur-[0.5px] opacity-50"
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-blue-800 dark:text-blue-900">
              AI-powered free CV maker
              <br className="hidden sm:block" />
              <span className="block sm:inline">Build a CV in minutes</span>
            </h1>
          </motion.div>

          {/* Main Text with 3D effect */}
          <motion.h1 
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="relative text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-3 sm:mb-4 md:mb-6 leading-tight sm:leading-[1.1] md:leading-[1.05] text-white dark:text-white px-2"
            style={{
              textShadow: `
                0px 1px 0px rgba(255,255,255,0.3),
                0px 2px 0px rgba(0,0,0,0.1),
                0px 3px 0px rgba(0,0,0,0.1),
                0px 4px 0px rgba(0,0,0,0.1),
                0px 5px 0px rgba(0,0,0,0.1),
                0px 6px 0px rgba(0,0,0,0.1),
                0px 8px 10px rgba(0,0,0,0.3)
              `,
              transform: 'perspective(500px) translateZ(0)'
            }}>
            AI-powered free CV maker
            <br className="hidden sm:block" />
            <span className="block sm:inline relative">
              Build a CV in minutes
              <motion.span 
                animate={{ 
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/10 to-white/0 blur-md opacity-50"
              ></motion.span>
            </span>
          </motion.h1>
        </motion.div>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative text-white/80 dark:text-slate-200 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl max-w-[95%] sm:max-w-[90%] md:max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 font-medium px-2"
          style={{
            textShadow: '0px 2px 4px rgba(0,0,0,0.2)'
          }}>
          Our AI-backed CV builder helps you write your best CV yet. Choose from
          over forty recruiter-approved CV templates and make a job-winning CV
          in minutes.
        </motion.p>

        {/* Bullet Points */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 px-2"
        >
          {features.map((item, index) => (
            <motion.div
              key={item}
              variants={fadeInUp}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-1 sm:gap-2 text-white/90 dark:text-white text-xs sm:text-sm md:text-base font-semibold transform hover:scale-105 transition-transform duration-200"
              style={{
                textShadow: '0px 2px 3px rgba(0,0,0,0.2)'
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              >
                <CheckCircle2 size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-white flex-shrink-0 filter drop-shadow-md" />
              </motion.div>
              <span>{item}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 px-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/templates")}
            className="bg-white text-[#04477E] px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-3 md:py-4 rounded-full text-sm sm:text-base md:text-lg lg:text-xl font-bold flex items-center gap-2 sm:gap-3 shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-all active:scale-95 w-full sm:w-auto justify-center relative group"
            style={{
              boxShadow: '0 10px 20px -5px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset'
            }}
          >
            <span className="relative z-10">Create your CV</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.div>
            <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/50 to-transparent opacity-50"></span>
            <span className="absolute bottom-0 inset-x-0 h-1/2 bg-black/10 rounded-full blur-sm"></span>
          </motion.button>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm font-medium text-white/80 dark:text-slate-300"
            style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.2)' }}
          >
            <div className="flex -space-x-1 sm:-space-x-2">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
              ].map((url, i) => (
                <motion.img
                  key={i}
                  src={url}
                  alt={`User ${i + 1}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  className="w-6 sm:w-7 md:w-8 lg:w-9 h-6 sm:h-7 md:h-8 lg:h-9 rounded-full border-2 border-white dark:border-slate-800 object-cover shadow-xl transform hover:scale-110 transition-transform duration-200"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}
                />
              ))}
            </div>
            <motion.span
              animate={{ 
                textShadow: [
                  '0px 0px 8px rgba(255,255,0,0.3)',
                  '0px 0px 12px rgba(255,255,0,0.5)',
                  '0px 0px 8px rgba(255,255,0,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-yellow-300 drop-shadow-lg">★★★★★</span> Loved by <span className="whitespace-nowrap font-semibold">1,166,440 users</span>
            </motion.span>
          </motion.div>
        </motion.div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <Strap />
      </motion.div>

      {/* Custom responsive styles */}
      <style>{`
        @media (min-width: 640px) {
          .text-shadow-3d {
            text-shadow: 
              0px 1px 0px rgba(255,255,255,0.3),
              0px 2px 0px rgba(0,0,0,0.1),
              0px 3px 0px rgba(0,0,0,0.1),
              0px 4px 0px rgba(0,0,0,0.1),
              0px 5px 0px rgba(0,0,0,0.1),
              0px 6px 0px rgba(0,0,0,0.1),
              0px 8px 10px rgba(0,0,0,0.3);
          }
        }
        
        @media (max-width: 639px) {
          .text-shadow-3d-mobile {
            text-shadow: 
              0px 1px 0px rgba(255,255,255,0.3),
              0px 2px 0px rgba(0,0,0,0.1),
              0px 3px 0px rgba(0,0,0,0.1),
              0px 4px 5px rgba(0,0,0,0.2);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Hero;