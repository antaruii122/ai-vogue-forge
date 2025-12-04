import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, ChevronDown, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

          {/* Right - Credits, CreativeAgent, Avatar */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-[#666666] hover:text-[#888888] transition-colors">
              <span className="text-sm">0 CREDITS</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <button className="flex items-center gap-2 text-[#666666] hover:text-[#888888] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-sm hidden sm:inline">CreativeAgent</span>
            </button>

            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-xs font-bold text-[#1a1a1a]">U</span>
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
          fixed top-14 left-0 bottom-0 w-[280px] bg-white border-r border-[#e0e0e0] z-40
          transition-transform duration-300 ease-in-out overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-[#666666] hover:text-[#000000]"
        >
          <X className="w-5 h-5" />
        </button>

        <nav className="py-4">
          {/* Back to Home Link */}
          <div className="mb-4 px-4">
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigate("/");
              }}
              className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#000000] transition-colors w-full py-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Separator */}
          <div className="border-t border-[#e0e0e0] mb-6" />

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
                    ? "bg-[#f5f5f5] text-[#000000] border-l-[3px] border-[#000000]"
                    : "text-[#666666] hover:bg-[#fafafa]"
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
                      ? "bg-[#f5f5f5] text-[#000000] font-bold border-l-[3px] border-[#000000]"
                      : "text-[#666666] hover:bg-[#fafafa]"
                  }
                `}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] bg-[#1a1a1a] text-white rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Resources Section */}
          <div className="mb-6">
            <h2 className="px-4 mb-2 text-xs font-bold text-[#999999] uppercase tracking-wider">
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
                      ? "bg-[#f5f5f5] text-[#000000] font-bold border-l-[3px] border-[#000000]"
                      : "text-[#666666] hover:bg-[#fafafa]"
                  }
                `}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Profile Section */}
          <div className="mb-6">
            <h2 className="px-4 mb-2 text-xs font-bold text-[#999999] uppercase tracking-wider">
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
                      ? "bg-[#f5f5f5] text-[#000000] font-bold border-l-[3px] border-[#000000]"
                      : "text-[#666666] hover:bg-[#fafafa]"
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
              className="w-full text-left px-4 py-3 text-sm transition-colors text-[#666666] hover:bg-[#fafafa]"
            >
              Contact Us
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="pt-14 lg:ml-[280px] min-h-screen">
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
