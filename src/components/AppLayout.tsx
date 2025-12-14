import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Home, User, CreditCard, Wallet, FolderOpen, LogOut, PanelLeftClose, PanelLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleTranslate from "@/components/GoogleTranslate";
import { useClerk } from "@clerk/clerk-react";
import { CreditsDisplay } from "@/components/CreditsDisplay";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { signOut } = useClerk();

  // Save sidebar preference to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const menuItems = {
    dashboard: [
      { name: "Fashion Photography", badge: null, route: "/tools/fashion-photography" },
      { name: "Video Generation", badge: null, route: "/tools/video-generation" },
      { name: "Product Photography", badge: null, route: "/tools/product-photography" },
    ],
    resources: [
      { name: "Portfolio", badge: null, route: "/portfolio" },
    ],
    profile: [
      { name: "Profile", badge: null, route: "/profile" },
      { name: "Billing", badge: null, route: "/billing" },
    ],
  };

  // Helper function to check if a route is active
  const isRouteActive = (route: string) => {
    return location.pathname === route;
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] w-full">
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#1a1a1a] text-white z-50 px-6">
        <div className="h-full flex items-center justify-between">
          {/* Left - Logo with hamburger on mobile/tablet */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-white hover:text-white/80"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xs font-bold tracking-[0.2em]">
              I M A G I N E C R E A T E . A I
            </h1>
          </div>

          {/* Center - Spacer */}
          <div className="flex-1" />

          {/* Right - Translate, Credits, CreativeAgent, Avatar */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Google Translate Widget */}
            <GoogleTranslate variant="dark" />
            
            <CreditsDisplay />


            {/* Profile Avatar with Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:ring-2 hover:ring-purple-400 transition-all"
              >
                <User className="w-4 h-4 text-[#1a1a1a]" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1f1f1f] border border-gray-700 rounded-lg shadow-xl z-50 py-2 overflow-hidden">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-700/50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate("/billing");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-700/50 transition-colors"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>My Credits</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate("/billing");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-700/50 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Billing</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate("/portfolio");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-700/50 transition-colors"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>Portfolio</span>
                  </button>
                  
                  <div className="border-t border-gray-700 my-1" />
                  
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-gray-700/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`
          fixed top-14 left-0 bottom-0 bg-[#1a1a1a] border-r border-gray-800 z-40
          transition-all duration-300 ease-in-out overflow-y-auto
          ${isSidebarCollapsed ? 'w-0 lg:w-0' : 'w-[280px]'}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarCollapsed ? 'lg:-translate-x-full' : 'lg:translate-x-0'}
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Collapse toggle button */}
        <button
          onClick={toggleSidebarCollapse}
          className="hidden lg:flex absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeftClose className="w-5 h-5" />
        </button>

        <nav className="py-4">
          {/* Back to Home Link */}
          <div className="mb-4 px-4">
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigate("/");
              }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full py-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-700 mb-6" />

          {/* Dashboard Section */}
          <div className="mb-6">
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigate("/dashboard");
              }}
              className={`
                block w-full text-left px-4 py-3 text-base font-bold transition-colors
                ${
                  isRouteActive("/dashboard")
                    ? "bg-purple-500/20 text-white border-l-[3px] border-purple-500"
                    : "text-gray-300 hover:bg-gray-800"
                }
              `}
            >
              Dashboard
            </button>
            
            {/* Dashboard Subcategories */}
            {menuItems.dashboard.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setIsSidebarOpen(false);
                  navigate(item.route);
                }}
                className={`
                  w-full text-left pl-8 pr-4 py-3 text-sm transition-colors flex items-center justify-between
                  ${
                    isRouteActive(item.route)
                      ? "bg-purple-500/20 text-white font-bold border-l-[3px] border-purple-500"
                      : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                  }
                `}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] bg-purple-500 text-white rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Resources Section */}
          <div className="mb-6">
            <h2 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Resources
            </h2>
            {menuItems.resources.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setIsSidebarOpen(false);
                  if (item.route !== "#") navigate(item.route);
                }}
                className={`
                  w-full text-left px-4 py-3 text-sm transition-colors
                  ${
                    isRouteActive(item.route)
                      ? "bg-purple-500/20 text-white font-bold border-l-[3px] border-purple-500"
                      : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                  }
                `}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Profile Section */}
          <div className="mb-6">
            <h2 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Profile
            </h2>
            {menuItems.profile.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setIsSidebarOpen(false);
                  if (item.route !== "#") navigate(item.route);
                }}
                className={`
                  w-full text-left px-4 py-3 text-sm transition-colors
                  ${
                    isRouteActive(item.route)
                      ? "bg-purple-500/20 text-white font-bold border-l-[3px] border-purple-500"
                      : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                  }
                `}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Contact Section */}
          <div>
            <button
              onClick={() => {
                setIsSidebarOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm transition-colors text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            >
              Contact Us
            </button>
          </div>
        </nav>
      </aside>

      {/* Floating expand button when sidebar is collapsed */}
      {isSidebarCollapsed && (
        <button
          onClick={toggleSidebarCollapse}
          className="hidden lg:flex fixed top-20 left-4 z-50 w-10 h-10 bg-[#1a1a1a] border border-gray-700 rounded-lg items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all shadow-lg"
          title="Expand sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      )}

      {/* Main Content Area */}
      <main className={`pt-14 min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-[280px]'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-6 md:p-8 lg:p-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
};

export default AppLayout;
