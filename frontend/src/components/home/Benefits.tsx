import React, { useState } from 'react';
import { ArrowRightIcon, ChevronDownIcon, HelpCircleIcon, FileTextIcon, DownloadIcon, SparklesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-4 overflow-hidden hover:shadow-xl transition-shadow duration-300"
  >
    <button
      className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-[#04477E]/20 rounded-2xl"
      onClick={onToggle}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8">{question}</h3>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 w-8 h-8 bg-[#04477E]/10 dark:bg-[#04477E]/20 rounded-full flex items-center justify-center"
        >
          <ChevronDownIcon className={`w-5 h-5 text-[#04477E] dark:text-[#04477E] transition-colors ${isOpen ? 'rotate-180' : ''}`} />
        </motion.div>
      </div>
    </button>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6">
            <div className="h-px w-full bg-gray-100 dark:bg-gray-700 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{answer}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const Benefits: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [currentImage, setCurrentImage] = useState<string>("https://cdn-images.livecareer.co.uk/pages/step4-lcuk@2x.webp");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I choose the right CV template?",
      answer: "Select from our professional, modern, and creative templates that suit your industry and experience level. We have options for various careers including tech, creative, corporate, and more.",
      image: "https://cdn-images.livecareer.co.uk/pages/step1-lcuk@2x.webp",
      icon: FileTextIcon
    },
    {
      question: "Is the CV builder easy to use?",
      answer: "Yes, our guided process helps you create a perfect CV with expert tips at each step of the way. No design skills required. Just fill in your details and let our AI do the rest.",
      image: "https://cdn-images.livecareer.co.uk/pages/step2-lcuk@2x.webp",
      icon: SparklesIcon
    },
    {
      question: "Can I use ready-made content?",
      answer: "Absolutely! Use our professionally written examples and phrases to showcase your skills and experience effectively. Choose from thousands of industry-specific bullet points and achievements.",
      image: "https://cdn-images.livecareer.co.uk/pages/step2-lcuk@2x.webp",
      icon: FileTextIcon
    },
    {
      question: "What formats can I download my CV in?",
      answer: "Download your CV in PDF or DOC format, fully formatted and ready to send to employers. Both formats are ATS-friendly and maintain perfect formatting across all devices.",
      image: "https://cdn-images.livecareer.co.uk/pages/step2-lcuk@2x.webp",
      icon: DownloadIcon
    }
  ];

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
      setActiveIndex(null);
    } else {
      newOpenItems.add(index);
      setCurrentImage(faqs[index].image);
      setActiveIndex(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-16 md:py-24  dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
         
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
          >
            Everything you need to know <br />
            <span className="bg-gradient-to-r from-[#04477E] to-[#0ea5e9] bg-clip-text text-transparent">
              about our CV builder
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 text-lg"
          >
            Get answers to common questions and start building your perfect CV today
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Side: Interactive Image Display */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative order-2 lg:order-1"
          >
            <div className="sticky top-24">
              {/* Image Container with Glow Effect */}
              <div className="relative group">
                {/* Background Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#04477E] to-[#0ea5e9] rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                {/* Main Image Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                  {/* Image Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {activeIndex !== null ? `Step ${activeIndex + 1}` : 'Preview'}
                      </span>
                    </div>
                  </div>

                  {/* Step Indicator */}
                  {activeIndex !== null && (
                    <div className="absolute top-4 right-4 z-10 bg-[#04477E] text-white px-4 py-2 rounded-full shadow-lg">
                      <span className="text-xs font-bold">FAQ #{activeIndex + 1}</span>
                    </div>
                  )}

                  {/* Image */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      src={currentImage}
                      alt="CV Builder Illustration"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-auto object-cover"
                    />
                  </AnimatePresence>

                  {/* Bottom Gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-800/80"></div>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {faqs.map((faq, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    onClick={() => {
                      toggleItem(index);
                      document.getElementById(`faq-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                      activeIndex === index
                        ? 'bg-[#04477E] text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Step {index + 1}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: FAQ Accordion */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            {/* FAQ Header */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Frequently Asked Questions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
        Can't find what you're looking for? <button className="text-[#04477E] dark:text-[#04477E] font-semibold hover:underline">Contact our support team</button>
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} id={`faq-${index}`}>
                  <FAQItem
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openItems.has(index)}
                    onToggle={() => toggleItem(index)}
                    index={index}
                  />
                </div>
              ))}
            </div>

            {/* Help Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8 bg-gradient-to-r from-[#04477E]/5 to-[#0ea5e9]/5 dark:from-[#04477E]/10 dark:to-[#0ea5e9]/10 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#04477E] rounded-xl flex items-center justify-center flex-shrink-0">
                  <HelpCircleIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Still have questions?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Can't find the answer you're looking for? Our support team is here to help.
                  </p>
                  <button className="text-[#04477E] dark:text-[#04477E] font-medium text-sm hover:underline flex items-center gap-1">
                    Contact Support
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16 md:mt-20"
        >
          <div className="relative inline-block">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#04477E] to-[#0ea5e9] rounded-full blur-2xl opacity-30"></div>
            
            <Link to="/templates">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-[#04477E] hover:bg-[#033b66] text-white font-bold py-4 px-10 md:px-14 rounded-full text-lg md:text-xl  transition-all duration-300 flex items-center justify-center mx-auto gap-3 group"
              >
                <span>Get Started Now</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </motion.button>
            </Link>
          </div>
          
          
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Benefits;