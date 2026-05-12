import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FiMail, 
  FiLogOut, 
  FiChevronDown,
  FiUser,
  FiMenu,
  FiX
} from "react-icons/fi";
import { FaRegGem, FaRocket, FaBuilding, FaBriefcase } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Theme Colors
  const COLORS = {
    primaryBlue: "#06497f",
    accentGold: "#dda431",
    white: "#ffffff",
    lightGray: "#f1f5f9"
  };

  // Get subscription plan display info
const getSubscriptionPlanName = (plan: string) => {
  switch (plan?.toLowerCase()) {
    case 'candidate':
      return { name: 'Candidate', icon: <FaBriefcase size={14} /> };

    case 'freelancer':
      return { name: 'Freelancer', icon: <FaBriefcase size={14} /> };

    default:
      return { name: 'Guest', icon: <FaRegGem size={14} /> };
  }
};

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('guestId');
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };
  const handleNavClick = (sectionId: string) => {
    if (location.pathname !== '/') {
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
    setMobileMenuOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const planInfo = getSubscriptionPlanName(user?.subscriptionPlan);

  if (isLoading) return <div style={{ height: '90px', background: COLORS.white }} />;

  return (
    <>
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .nav-item {
            color: ${COLORS.primaryBlue};
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
            transition: 0.2s ease;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
          }
          .nav-item:hover { 
            color: ${COLORS.accentGold}; 
          }

          .btn-primary {
            background: ${COLORS.primaryBlue};
            color: white;
            padding: 10px 22px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
            display: inline-block;
          }
          .btn-primary:hover {
            background: #04365f;
          }

          .btn-secondary {
            background: transparent;
            color: ${COLORS.primaryBlue};
            padding: 10px 22px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            border: 2px solid ${COLORS.primaryBlue};
            transition: 0.2s;
            display: inline-block;
          }
          .btn-secondary:hover {
            background: ${COLORS.primaryBlue};
            color: white;
          }

          .mobile-link {
            color: ${COLORS.primaryBlue};
            font-size: 22px;
            text-decoration: none;
            font-weight: 700;
            background: none;
            border: none;
            cursor: pointer;
            display: block;
          }

          @media (max-width: 880px) {
            .nav-links, .nav-actions {
              display: none !important;
            }
            .mobile-menu-toggle {
              display: block !important;
            }
          }
        `}
      </style>

      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        background: 'transparent' 
      }}>
        <div style={{ margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 24px',
            background: COLORS.white,
            borderRadius: '14px',
            boxShadow: '0 4px 20px rgba(6, 73, 127, 0.1)',
            border: `1px solid ${COLORS.lightGray}`
          }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <img 
                src={'logo.png'} 
                alt="Logo" 
                className="h-12 sm:h-14 md:h-16 w-auto" 
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              <button 
                onClick={() => handleNavClick('how-it-works')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                className="nav-item"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('products')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                className="nav-item"
              >
                Products
              </button>
              <button 
                onClick={() => handleNavClick('pricing')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                className="nav-item"
              >
                Pricing
              </button>
              <Link to="/faq" className="nav-item">FAQ</Link>
            </nav>

            {/* Desktop Actions - Profile with dropdown */}
            <div className="nav-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  {/* Profile Section with Dropdown */}
                  <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '6px 16px',
                        borderRadius: '40px',
                        background: COLORS.lightGray,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e2e8f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = COLORS.lightGray;
                      }}
                    >
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        background: COLORS.primaryBlue,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        {getUserInitials()}
                      </div>
                      <span style={{ 
                        color: COLORS.primaryBlue, 
                        fontWeight: 600, 
                        fontSize: '14px'
                      }}>
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <FiChevronDown 
                        size={16} 
                        style={{ 
                          transform: profileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          color: COLORS.primaryBlue
                        }}
                      />
                    </button>

                    {/* Minimal Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        width: '280px',
                        background: COLORS.white,
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                        border: `1px solid ${COLORS.lightGray}`,
                        overflow: 'hidden',
                        zIndex: 1001,
                        animation: 'slideDown 0.2s ease'
                      }}>
                        {/* User Info */}
                        <div style={{
                          padding: '16px',
                          borderBottom: `1px solid ${COLORS.lightGray}`
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '12px'
                          }}>
                            <div style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '50%', 
                              background: COLORS.primaryBlue,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontWeight: 'bold',
                              fontSize: '16px'
                            }}>
                              {getUserInitials()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '15px', color: '#1f2937' }}>
                                {user?.name}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FiMail size={12} />
                                {user?.email}
                              </div>
                            </div>
                          </div>
                          
                          {/* Plan Badge */}
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            background: '#f0fdf4',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#10b981'
                          }}>
                            {planInfo.icon}
                            <span>{planInfo.name} Plan</span>
                          </div>
                        </div>

                       
                      </div>
                    )}
                  </div>
                  
                  <Link to="/dashboard" className="btn-secondary">Dashboard</Link>
                  <button onClick={handleLogout} className="btn-primary">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">Login</Link>
                  <Link to="/register" className="btn-primary">Sign Up</Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle"
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.primaryBlue,
                cursor: 'pointer',
                display: 'none',
                padding: '8px'
              }}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: COLORS.white,
          zIndex: 999,
          padding: '100px 32px',
          overflowY: 'auto',
          animation: 'slideUp 0.3s ease'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center' }}>
            {/* Mobile Profile Section */}
            {isAuthenticated && user && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '12px',
                padding: '16px',
                borderRadius: '40px',
                background: COLORS.lightGray,
                marginBottom: '20px',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: COLORS.primaryBlue,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '24px'
                }}>
                  {getUserInitials()}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: COLORS.primaryBlue, fontWeight: 700, fontSize: '16px' }}>
                    {user?.name}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                    <FiMail size={12} />
                    {user?.email}
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    background: '#f0fdf4',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#10b981',
                    marginTop: '8px'
                  }}>
                    {planInfo.icon}
                    <span>{planInfo.name} Plan</span>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => handleNavClick('how-it-works')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              className="mobile-link"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('products')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              className="mobile-link"
            >
              Products
            </button>
            <button 
              onClick={() => handleNavClick('pricing')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              className="mobile-link"
            >
              Pricing
            </button>
            {/* <Link to="/career-center" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Career Center</Link> */}
            <Link to="/about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <div style={{ height: '1px', background: COLORS.lightGray, margin: '10px 0' }} />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-secondary" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn-primary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}