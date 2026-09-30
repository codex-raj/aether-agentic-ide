import React, { useState, useRef } from 'react';
import { usePlatform, NavigationTarget } from '../context/PlatformContext';
import { 
  Menu, 
  Download, 
  Sparkles, 
  User, 
  ShieldCheck, 
  LogIn, 
  LogOut,
  ChevronDown,
  BookOpen,
  MessageSquare,
  LifeBuoy,
  Video,
  Users,
  Terminal,
  Clock
} from 'lucide-react';
import { auth } from '../firebase/config';
import { ComingSoonModal } from './common/ComingSoonModal';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    currentUser, 
    switchRole, 
    openWaitlistModal,
    toggleSidebar,
    loginWithFirebaseGoogle,
    logoutFirebase,
    firebaseAuthLoading
  } = usePlatform();

  // Secret 5-clicks easter egg on logo for Admin Console
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [adminToast, setAdminToast] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState<boolean>(false);
  const [comingSoonType, setComingSoonType] = useState<'product' | 'enterprise' | null>(null);

  const isUserAuthenticated = Boolean(auth.currentUser || (currentUser && currentUser.status === 'active' && currentUser.email));

  const handleLogoClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    const nextCount = logoClicks + 1;

    if (nextCount >= 5) {
      // 5 clicks achieved! Unlock admin console
      setLogoClicks(0);
      switchRole('admin');
      setCurrentPage('admin-overview');
      setAdminToast(true);
      setTimeout(() => setAdminToast(false), 5000);
      return;
    }

    setLogoClicks(nextCount);

    // On 1st click, navigate home normally
    if (nextCount === 1) {
      setCurrentPage('home');
    }

    // Reset click count after 2.5s of inactivity
    clickTimeoutRef.current = setTimeout(() => {
      setLogoClicks(0);
    }, 2500);
  };

  const resourceLinks: { label: string; desc: string; target: NavigationTarget; icon: React.ReactNode }[] = [
    { label: 'Documentation', desc: 'Architecture guides & PKCE specs', target: 'docs', icon: <BookOpen className="w-4 h-4 text-cyan-400" /> },
    { label: 'Community Forum', desc: 'Discussions, Q&A & code snippets', target: 'resources-forum', icon: <MessageSquare className="w-4 h-4 text-emerald-400" /> },
    { label: 'Help & Diagnostics', desc: 'Local Ollama test & FAQs', target: 'resources-help', icon: <LifeBuoy className="w-4 h-4 text-amber-400" /> },
    { label: 'Workshops & Labs', desc: 'Hands-on video masterclasses', target: 'resources-workshops', icon: <Video className="w-4 h-4 text-purple-400" /> },
    { label: 'Community & Events', desc: 'Discord, GitHub & hackathons', target: 'resources-community', icon: <Users className="w-4 h-4 text-blue-400" /> },
    { label: 'API & MCP Spec', desc: 'CLI reference & .aether/config.json', target: 'resources-api', icon: <Terminal className="w-4 h-4 text-pink-400" /> },
  ];

  return (
    <>
      {/* Secret Admin Access Notification Toast */}
      {adminToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#130f1e] border border-purple-500/40 text-purple-200 text-xs font-semibold shadow-2xl flex items-center gap-2.5 backdrop-blur-xl animate-bounce">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>⚡ Secret Admin Access Unlocked! (5 clicks on Aether logo)</span>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-black/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Sidebar Toggle & Aether Logo with 5-click easter egg */}
          <div className="flex items-center gap-3">
            {/* Sidebar toggle for secondary tools */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer flex items-center gap-1.5"
              title="More tools (Desktop IDE Simulator, Changelog, Docs, Command Palette)"
            >
              <Menu className="w-5 h-5 text-neutral-300" />
            </button>

            {/* Aether Logo: Click 5 times to open Admin Section */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 group text-left transition-transform active:scale-95 cursor-pointer relative"
              title="Aether IDE (Tip: Click 5 times for Secret Admin Console)"
            >
              <span className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-black font-extrabold text-sm tracking-tighter shadow-sm group-hover:bg-neutral-200 transition-colors">
                ▲
              </span>
              <span className="text-lg font-bold tracking-tight text-white font-display">
                Aether
              </span>
              {/* Subtle indicator of consecutive clicks */}
              {logoClicks > 1 && logoClicks < 5 && (
                <span className="absolute -top-1 -right-4 w-4 h-4 rounded-full bg-purple-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {logoClicks}
                </span>
              )}
            </button>
          </div>

          {/* Zone 2: Navigation Links (Models | Product [Coming Soon] | Enterprise [Coming Soon] | Pricing | Resources) */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-neutral-400">
            {/* Models Link */}
            <button
              onClick={() => setCurrentPage('models')}
              className={`transition-colors py-1 relative cursor-pointer ${
                currentPage === 'models' ? 'text-white font-semibold' : 'hover:text-white'
              }`}
            >
              <span>Models</span>
              {currentPage === 'models' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />
              )}
            </button>

            {/* Product: Set to Coming Soon */}
            <button
              onClick={() => setComingSoonType('product')}
              className="transition-colors py-1 cursor-pointer hover:text-white flex items-center gap-1.5 group"
              title="Aether Product Suite 2.0 (Coming Soon)"
            >
              <span>Product</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 group-hover:bg-amber-500/25 transition-colors">
                Soon
              </span>
            </button>

            {/* Enterprise: Set to Coming Soon */}
            <button
              onClick={() => setComingSoonType('enterprise')}
              className="transition-colors py-1 cursor-pointer hover:text-white flex items-center gap-1.5 group"
              title="Aether Enterprise Suite (Coming Soon)"
            >
              <span>Enterprise</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 group-hover:bg-purple-500/25 transition-colors">
                Soon
              </span>
            </button>

            {/* Pricing */}
            <button
              onClick={() => setCurrentPage('pricing')}
              className={`transition-colors py-1 relative cursor-pointer ${
                currentPage === 'pricing' ? 'text-white font-semibold' : 'hover:text-white'
              }`}
            >
              <span>Pricing</span>
              {currentPage === 'pricing' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />
              )}
            </button>

            {/* Resources with Rich Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setResourcesDropdownOpen(true)}
              onMouseLeave={() => setResourcesDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  setCurrentPage('resources');
                  setResourcesDropdownOpen(false);
                }}
                className={`transition-colors py-1 relative cursor-pointer flex items-center gap-1 ${
                  currentPage.startsWith('resources') || currentPage === 'docs' 
                    ? 'text-white font-semibold' 
                    : 'hover:text-white'
                }`}
              >
                <span>Resources</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
                {(currentPage.startsWith('resources') || currentPage === 'docs') && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />
                )}
              </button>

              {/* Resources Dropdown Menu */}
              {resourcesDropdownOpen && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 rounded-2xl bg-[#0c0e14] border border-white/[0.12] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-2 border-b border-white/[0.06] mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      Developer Resources
                    </span>
                    <button
                      onClick={() => {
                        setCurrentPage('resources');
                        setResourcesDropdownOpen(false);
                      }}
                      className="text-[10px] font-medium text-cyan-400 hover:text-cyan-300"
                    >
                      Hub Overview →
                    </button>
                  </div>

                  <div className="space-y-1">
                    {resourceLinks.map((item) => (
                      <button
                        key={item.target}
                        onClick={() => {
                          setCurrentPage(item.target);
                          setResourcesDropdownOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-white/[0.06] transition-all flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors mt-0.5">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-neutral-400 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-1 pt-2 border-t border-white/[0.06]">
                    <button
                      onClick={() => {
                        setCurrentPage('resources');
                        setResourcesDropdownOpen(false);
                      }}
                      className="w-full py-1.5 px-3 rounded-lg text-center text-xs font-semibold text-white bg-white/[0.06] hover:bg-white/[0.1] transition-all"
                    >
                      Explore All Resources Hub
                    </button>
                  </div>
                </div>
              )}
            </div>

          </nav>

          {/* Zone 3: Actions (Sign in / User Profile | Contact sales | Download) */}
          <div className="flex items-center gap-3">
            
            {/* Sign in / User Profile */}
            {isUserAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs text-white transition-all cursor-pointer"
                  title="Open Account &amp; Dashboard"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 text-[11px] font-bold flex items-center justify-center text-black">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline font-medium">
                    {currentUser.displayName || currentUser.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0e1017] border border-white/[0.12] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                      <p className="text-xs font-semibold text-white truncate">
                        {currentUser.displayName || 'Developer'}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {currentUser.email}
                      </p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/25">
                        {currentUser.role.toUpperCase()} · {currentUser.planId.toUpperCase()}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-neutral-200 hover:text-white hover:bg-white/[0.06] flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>User Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage('download');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-neutral-200 hover:text-white hover:bg-white/[0.06] flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Download &amp; Sync IDE</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage('resources');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-neutral-200 hover:text-white hover:bg-white/[0.06] flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                      <span>Developer Resources</span>
                    </button>

                    <div className="border-t border-white/[0.06] my-1" />

                    <button
                      onClick={() => {
                        logoutFirebase();
                        setUserDropdownOpen(false);
                      }}
                      disabled={firebaseAuthLoading}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('auth')}
                className="text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-full hover:bg-white/[0.06] border border-transparent hover:border-white/10 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-neutral-400" />
                <span>Sign in</span>
              </button>
            )}

            {/* Contact sales (Rounded Pill Outline button) */}
            <button
              onClick={openWaitlistModal}
              className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium text-neutral-200 hover:text-white border border-white/20 hover:border-white/40 rounded-full transition-all cursor-pointer whitespace-nowrap"
            >
              Contact sales
            </button>

            {/* Download Button (Solid White Pill) */}
            <button
              onClick={() => setCurrentPage('download')}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-full transition-all shadow-sm whitespace-nowrap cursor-pointer active:scale-95"
            >
              <span>Download</span>
            </button>
          </div>

        </div>
      </header>

      {/* Coming Soon Modal for Product / Enterprise */}
      <ComingSoonModal
        isOpen={Boolean(comingSoonType)}
        type={comingSoonType || 'product'}
        onClose={() => setComingSoonType(null)}
      />
    </>
  );
};
