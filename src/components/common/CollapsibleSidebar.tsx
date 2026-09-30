import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  Terminal, 
  FileText, 
  BookOpen, 
  Search, 
  X, 
  ChevronRight, 
  User, 
  LogIn, 
  LogOut, 
  Zap, 
  CheckCircle2, 
  Layers,
  ChevronLeft,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Cpu,
  MessageSquare,
  LifeBuoy,
  Video,
  Users,
  CreditCard,
  Boxes
} from 'lucide-react';
import { ComingSoonModal } from './ComingSoonModal';

export const CollapsibleSidebar: React.FC = () => {
  const { 
    isSidebarOpen, 
    toggleSidebar, 
    setCurrentPage, 
    currentPage, 
    toggleCommandPalette, 
    openWaitlistModal,
    currentUser,
    switchRole,
    loginWithFirebaseGoogle,
    logoutFirebase,
    firebaseAuthLoading
  } = usePlatform();

  const [comingSoonType, setComingSoonType] = useState<'product' | 'enterprise' | null>(null);

  const handleNav = (target: any) => {
    setCurrentPage(target);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const openComingSoon = (type: 'product' | 'enterprise') => {
    setComingSoonType(type);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Floating Toggle Pill when collapsed */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 left-6 z-40 px-3.5 py-2 rounded-full bg-[#111111]/90 hover:bg-[#1c1c1c] text-neutral-300 border border-white/[0.12] shadow-2xl backdrop-blur-xl flex items-center gap-2 text-xs font-medium transition-all group hover:text-white cursor-pointer"
          title="Open Developer Tools &amp; Navigation"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform" />
          <span>More Tools</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Collapsible Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#090909] border-r border-white/[0.08] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black font-extrabold text-xs">
                ▲
              </span>
              <span className="text-sm font-bold text-white font-display">Developer Hub</span>
            </div>

            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions: Waitlist & Command Palette */}
          <div className="p-3 border-b border-white/[0.06] space-y-2">
            <button
              onClick={() => {
                openWaitlistModal();
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join Priority Waitlist</span>
            </button>

            <button
              onClick={() => {
                toggleCommandPalette();
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 border border-white/[0.06] text-xs flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-neutral-400" />
                <span>Command Palette</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono text-neutral-400">⌘K</kbd>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-280px)]">
            
            {/* Products (Set to Coming Soon) */}
            <div className="space-y-1">
              <span className="px-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Products &amp; Edition
              </span>

              <button
                onClick={() => openComingSoon('product')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer text-neutral-400 hover:text-white hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-2.5">
                  <Boxes className="w-4 h-4 text-amber-400" />
                  <span>Aether Product 2.0</span>
                </div>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                  Soon
                </span>
              </button>

              <button
                onClick={() => openComingSoon('enterprise')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer text-neutral-400 hover:text-white hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Enterprise Enclave</span>
                </div>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                  Soon
                </span>
              </button>
            </div>

            {/* Developer Resources Pages */}
            <div className="space-y-1">
              <span className="px-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Developer Resources
              </span>

              <button
                onClick={() => handleNav('docs')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentPage === 'docs' || currentPage === 'resources-docs'
                    ? 'bg-white/[0.1] text-white font-semibold' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Documentation Hub</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button
                onClick={() => handleNav('resources-forum')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentPage === 'resources-forum'
                    ? 'bg-white/[0.1] text-white font-semibold' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Community Forum &amp; Q&amp;A</span>
                </div>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">Active</span>
              </button>

              <button
                onClick={() => handleNav('resources-help')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentPage === 'resources-help'
                    ? 'bg-white/[0.1] text-white font-semibold' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LifeBuoy className="w-4 h-4 text-amber-400" />
                  <span>Help &amp; Diagnostics</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button
                onClick={() => handleNav('resources-workshops')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentPage === 'resources-workshops'
                    ? 'bg-white/[0.1] text-white font-semibold' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Video className="w-4 h-4 text-purple-400" />
                  <span>Workshops &amp; Labs</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button
                onClick={() => handleNav('resources-community')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentPage === 'resources-community'
                    ? 'bg-white/[0.1] text-white font-semibold' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Community &amp; Events</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button
                onClick={() => handleNav('resources-api')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentPage === 'resources-api'
                    ? 'bg-white/[0.1] text-white font-semibold' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-pink-400" />
                  <span>API &amp; MCP Spec</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>
            </div>

            {/* Workstation Simulator & IDE */}
            <div className="space-y-1">
              <span className="px-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Developer Workstation
              </span>

              <button
                onClick={() => handleNav('pricing')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentPage === 'pricing'
                    ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/25' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <span>Pricing (USD &amp; INR)</span>
                </div>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300">₹/$</span>
              </button>

              <button
                onClick={() => handleNav('ide-simulator')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentPage === 'ide-simulator' 
                    ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/25' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Desktop IDE Simulator</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button
                onClick={() => handleNav('models')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentPage === 'models'
                    ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/25' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Multi-Model AI Gateway</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button
                onClick={() => handleNav('dashboard')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentPage.startsWith('account-') || currentPage === 'dashboard'
                    ? 'bg-white/[0.1] text-white font-semibold' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-neutral-300" />
                  <span>Account &amp; Usage Portal</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>
            </div>

          </div>
        </div>

        {/* Footer: User Details & Auth Actions */}
        <div className="p-4 border-t border-white/[0.08] bg-[#070707] text-xs">
          {currentUser ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 text-black font-extrabold flex items-center justify-center shrink-0 text-xs shadow-sm">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <span className="text-white font-medium block truncate text-[11px]">
                      {currentUser.displayName || currentUser.email.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-neutral-400 truncate block">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('dashboard')}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3 h-3 text-cyan-400" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={logoutFirebase}
                  disabled={firebaseAuthLoading}
                  className="py-1.5 px-2.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Exit</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="text-[11px] text-neutral-400">
                Sign in to sync your local IDE, token usage, and agents.
              </div>
              <button
                onClick={() => handleNav('auth')}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in / Register</span>
              </button>
            </div>
          )}
        </div>

      </aside>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={Boolean(comingSoonType)}
        type={comingSoonType || 'product'}
        onClose={() => setComingSoonType(null)}
      />
    </>
  );
};
