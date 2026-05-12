import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Sparkles,
  Shield,
  Star,
  Zap,
  PlusCircle,
  ArrowUpCircle
} from 'lucide-react';

function LiveCareerApp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-[#044981]/10">
      <header className="bg-gradient-to-r from-[#044981] to-[#0660a9] px-6 py-4 flex justify-between items-center text-white shadow-lg sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img className='h-10 sm:h-12' src="./white_logo.png" alt="ResumeYatra Logo" />
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center py-16 px-4  ">
        <div className="w-full max-w-6xl mx-auto ">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Create Your <span className="text-[#044981]">Professional Resume</span>
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              How would you like to begin?
            </p>
          </motion.div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Option 1: Create New */}
            <motion.div 
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => navigate('/templates')}
              className="group relative bg-white/70 backdrop-blur-md border border-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer overflow-hidden"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-[#044981]/10 rounded-2xl flex items-center justify-center mb-6 text-[#044981] group-hover:scale-110 transition-transform">
                  <PlusCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Create a New CV</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Start fresh with a blank canvas and our industry-standard expert templates.
                </p>
                <div className="mt-auto flex items-center text-[#044981] font-bold gap-2">
                  Pick a template <ChevronRight size={20} />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 text-[#044981]/5 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <PlusCircle size={140} />
              </div>
            </motion.div>

            {/* Option 2: Upgrade Existing */}
            <motion.div 
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => navigate('/upload')}
              className="group relative bg-gradient-to-br from-[#044981] to-[#0660a9] rounded-3xl p-8 shadow-xl shadow-blue-900/20 cursor-pointer overflow-hidden"
            >
              <div className="relative z-10 flex flex-col h-full text-white">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <ArrowUpCircle size={32} />
                  </div>
                  <span className="bg-yellow-400 text-blue-900 text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm uppercase">
                    <Sparkles size={10} /> AI Enhanced
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-3">Upgrade your Current CV</h3>
                <p className="text-blue-50/80 mb-8 leading-relaxed">
                  Upload your old PDF/Word file and let our AI transform it into a modern, high-impact design.
                </p>
                <div className="mt-auto flex items-center text-white font-bold gap-2">
                  Fast-track with AI <ChevronRight size={20} />
                </div>
              </div>
              {/* Subtle glass effect accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
            </motion.div>
          </div>

         
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-xs text-gray-400 font-medium tracking-wide">
          © 2026 RESUMEYATRA · POWERED BY INTELLIGENT DESIGN
        </p>
      </footer>
    </div>
  );
}

export default LiveCareerApp;