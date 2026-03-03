import { useState, useRef, useEffect } from "react";
import "remixicon/fonts/remixicon.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { ThemeToggle } from "../ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const cvTriggerRef = useRef<HTMLLIElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check authentication status immediately and on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      console.log('Checking auth - Token:', token ? 'exists' : 'missing');
      console.log('Checking auth - User:', userStr ? 'exists' : 'missing');
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('User authenticated:', userData);
        } catch (error) {
          console.error('Failed to parse user data:', error);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        console.log('No authentication found');
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage events (in case of logout in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // CV Tools dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          cvTriggerRef.current && !cvTriggerRef.current.contains(event.target as Node)) {
        setDropdown(null);
      }
      
      // User menu dropdown
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdown(null);
    setUserMenuOpen(false);
  }, [location]);

  // Force re-check auth on route change
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [location]);

  const showMenu = (name: string) => setDropdown(name);
  const hideMenu = () => setDropdown(null);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state immediately
    setIsAuthenticated(false);
    setUser(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    
    console.log('User logged out, auth state set to false');
    
    // Navigate to home
    navigate('/');
  };

  // Handle navigation with proper routing
  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    setDropdown(null);
    setUserMenuOpen(false);
    navigate(path);
  };

  // Base navigation links
  const baseNavLinks = [
    { name: "Home", path: "/" },
    { name: "Career Center", path: "/career-center" },
    { name: "About", path: "/about" },
  ];

  // Dashboard link - only shown when authenticated
  const dashboardLink = { name: "Dashboard", path: "/dashboard" };

  // Conditionally add Dashboard to navLinks
  const navLinks = isAuthenticated 
    ? [...baseNavLinks, dashboardLink]
    : baseNavLinks;

  const isActive = (path: string) => location.pathname === path;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Don't render anything while checking auth to prevent flicker
  if (isLoading) {
    return (
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="block">
                <img 
                  src={theme === 'dark' ? 'white_logo.png' : 'logo.png'} 
                  alt="Logo" 
                  className="h-12 sm:h-14 md:h-16 w-auto" 
                />
              </Link>
            </div>
            <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  console.log('Rendering Navbar - Auth state:', isAuthenticated, 'User:', user);

  return (
    <>
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo with React Router Link */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <Link to="/" className="block" onClick={() => setMobileMenuOpen(false)}>
                <img 
                  src={theme === 'dark' ? 'white_logo.png' : 'logo.png'} 
                  alt="Logo" 
                  className="h-12 sm:h-14 md:h-16 w-auto transition-all duration-300 hover:scale-105" 
                />
              </Link>
            </motion.div>

           <div className="flex">
             {/* Desktop Menu - Centered */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <ul className="flex items-center gap-1 lg:gap-2 xl:gap-4 font-medium text-gray-700 dark:text-gray-200">
                {navLinks.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base transition-all duration-300 hover:bg-[#04477E]/10 dark:hover:bg-[#04477E]/20 hover:text-[#04477E] dark:hover:text-[#04477E] block ${
                        isActive(link.path) 
                          ? 'text-[#04477E] dark:text-[#04477E] font-semibold bg-[#04477E]/10 dark:bg-[#04477E]/20' 
                          : ''
                      }`}
                      onClick={() => setDropdown(null)}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}

                {/* CV DROPDOWN - Desktop */}
                <motion.li
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  ref={cvTriggerRef}
                  className="relative"
                  onMouseEnter={() => showMenu("cv")}
                  onMouseLeave={hideMenu}
                >
                  <button
                    className={`flex items-center gap-1 px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base transition-all duration-300 hover:bg-[#04477E]/10 dark:hover:bg-[#04477E]/20 ${
                      dropdown === "cv" 
                        ? 'text-[#04477E] dark:text-[#04477E] bg-[#04477E]/10 dark:bg-[#04477E]/20' 
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                    onClick={() => setDropdown(dropdown === "cv" ? null : "cv")}
                  >
                    <span>CV Tools</span>
                    <motion.i 
                      animate={{ rotate: dropdown === "cv" ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`ri-arrow-down-s-line text-lg transition-colors ${
                        dropdown === "cv" ? 'text-[#04477E]' : ''
                      }`}
                    ></motion.i>
                  </button>
                </motion.li>
              </ul>
            </div>

            {/* Desktop Right Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:flex items-center gap-3 lg:gap-4"
            >
              {/* <ThemeToggle /> */}
              
              {isAuthenticated && user ? (
                <>
                  {/* User Menu - Only Dashboard and Logout */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#04477E]/10 dark:hover:bg-[#04477E]/20 transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#04477E] to-[#0a5fa3] flex items-center justify-center text-white font-semibold text-sm">
                        {getUserInitials()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden lg:block">
                        {user.name.split(' ')[0]}
                      </span>
                      <motion.i 
                        animate={{ rotate: userMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="ri-arrow-down-s-line text-lg"
                      ></motion.i>
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
                        >
                          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-[#04477E]/10 text-[#04477E] rounded-full">
                              {user.role}
                            </span>
                          </div>
                          
                          <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                            <button
                              onClick={() => {
                                handleLogout();
                                setUserMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <i className="ri-logout-box-line text-lg"></i>
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 lg:px-5 py-2 text-sm lg:text-base font-medium text-gray-700 dark:text-gray-200 hover:text-[#04477E] dark:hover:text-[#04477E] transition-colors"
                    onClick={() => setDropdown(null)}
                  >
                    Login
                  </Link>
                  
                  <Link 
                    to="/register" 
                    className="bg-gradient-to-r from-[#04477E] to-[#0a5fa3] hover:from-[#033b66] hover:to-[#094d82] text-white px-4 lg:px-6 py-2 rounded-lg text-sm lg:text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    onClick={() => setDropdown(null)}
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </motion.div>
           </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              {/* <ThemeToggle /> */}
              <button
                className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <motion.i 
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}
                ></motion.i>
              </button>
            </div>
          </div>
        </div>

        {/* Mega Dropdown - CV Tools */}
        <AnimatePresence>
          {dropdown === "cv" && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-800 z-50"
              style={{
                top: cvTriggerRef.current
                  ? cvTriggerRef.current.getBoundingClientRect().bottom + window.scrollY
                  : 64,
              }}
              onMouseEnter={() => showMenu("cv")}
              onMouseLeave={hideMenu}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                  {/* Column 1 - CV Builder */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">
                      CV BUILDER
                    </h4>
                    <Link 
                      to="/dashboard" 
                      className="group block"
                      onClick={() => setDropdown(null)}
                    >
                      <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#DDA337] to-[#f5b342] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <i className="ri-tools-line text-2xl text-white"></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-[#04477E] transition-colors">
                            CV Builder
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Build a professional CV in minutes with our smart CV builder and AI assistance.
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Column 2 - CV Resources */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">
                      CV RESOURCES
                    </h4>
                    <div className="space-y-6">
                      <Link 
                        to="/templates" 
                        className="group block"
                        onClick={() => setDropdown(null)}
                      >
                        <div className="p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-[#04477E] transition-colors mb-2">
                            CV Templates
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Choose from 50+ professional templates designed for every industry.
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 3 - CV Blog */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">
                      CV BLOG
                    </h4>
                    <div className="space-y-6">
                      <Link 
                        to="/how-to-write-cv" 
                        className="group block"
                        onClick={() => setDropdown(null)}
                      >
                        <div className="p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-[#04477E] transition-colors mb-2">
                            How to Write a CV
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Step-by-step guide to writing a winning CV that gets interviews.
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <div className="bg-gradient-to-r from-[#04477E]/5 to-[#DDA337]/5 rounded-xl p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Ready to create your CV?</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Join 1M+ users who built their CV with us</p>
                      </div>
                      <Link 
                        to="/templates" 
                        className="bg-[#04477E] hover:bg-[#033b66] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                        onClick={() => setDropdown(null)}
                      >
                        Get Started Now
                        <i className="ri-arrow-right-line"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-hidden fixed top-16 left-0 right-0 z-30 shadow-xl"
          >
            <div className="px-4 py-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* User Info - Only name and email at the top */}
              {isAuthenticated && user && (
                <div className="mb-6 p-4 bg-gradient-to-r from-[#04477E]/5 to-[#DDA337]/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#04477E] to-[#0a5fa3] flex items-center justify-center text-white font-semibold text-lg">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive(link.path)
                        ? 'bg-[#04477E] text-white'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile CV Dropdown */}
                <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2">
                  <button
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setDropdown(dropdown === "cv-mobile" ? null : "cv-mobile")}
                  >
                    <span>CV Tools</span>
                    <i className={`ri-arrow-down-s-line text-xl transition-transform duration-300 ${
                      dropdown === "cv-mobile" ? 'rotate-180' : ''
                    }`}></i>
                  </button>

                  <AnimatePresence>
                    {dropdown === "cv-mobile" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-4"
                      >
                        <div className="py-2 space-y-3">
                          <Link 
                            to="/dashboard" 
                            className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#04477E]"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setDropdown(null);
                            }}
                          >
                            CV Builder
                          </Link>
                          <Link 
                            to="/templates" 
                            className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#04477E]"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setDropdown(null);
                            }}
                          >
                            CV Templates
                          </Link>
                          <Link 
                            to="/how-to-write-cv" 
                            className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#04477E]"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setDropdown(null);
                            }}
                          >
                            How to Write a CV
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Auth Buttons - Now at the bottom */}
              {isAuthenticated ? (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3">
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-center text-base font-medium text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                  >
                    <i className="ri-logout-box-line text-lg"></i>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-3 text-center text-base font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-4 py-3 text-center text-base font-medium text-white bg-gradient-to-r from-[#04477E] to-[#0a5fa3] rounded-lg hover:from-[#033b66] hover:to-[#094d82] transition-all duration-300 shadow-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}