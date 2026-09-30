import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  Download, 
  Terminal, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Zap, 
  Code2, 
  GitBranch, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Search,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Laptop,
  Maximize2,
  X,
  Share2
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setCurrentPage, detectedOS, openWaitlistModal } = usePlatform();
  
  // Interactive Composer / Agent demo state
  const [composerStep, setComposerStep] = useState<'idle' | 'generating' | 'diff' | 'accepted'>('diff');
  const [tabAccepted, setTabAccepted] = useState(false);
  const [selectedZoomImage, setSelectedZoomImage] = useState<{ src: string; title: string; desc: string } | null>(null);

  const getOSName = () => {
    if (detectedOS === 'win32') return 'Windows';
    if (detectedOS === 'darwin') return 'macOS';
    return 'Linux';
  };

  const getArchLabel = () => {
    if (detectedOS === 'darwin') return 'Apple Silicon & Intel';
    if (detectedOS === 'win32') return 'x64 Installer';
    return '.AppImage & .deb';
  };

  return (
    <div className="w-full flex flex-col items-center bg-black text-[#ededed] selection:bg-neutral-800 selection:text-white">
      
      {/* 1. CURSOR-STYLE HERO SECTION */}
      <section className="relative w-full pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Subtle top spotlight (Cursor signature look) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Minimal pill kicker */}
        <button
          onClick={openWaitlistModal}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-neutral-300 mb-8 transition-colors cursor-pointer group"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Aether IDE Coming Soon · Join the Early Access Waitlist</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-4xl font-display leading-[1.04] mb-6">
          The AI Code Editor
        </h1>

        <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl font-normal leading-relaxed mb-8">
          Built to make you extraordinarily productive, Aether is the best way to code with AI.
        </p>

        {/* Primary CTAs: Join Waitlist & Download */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 w-full sm:w-auto">
          <button
            onClick={openWaitlistModal}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-white to-purple-400 text-black font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-700" />
            <span>Join Waitlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCurrentPage('download')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.1] font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <Download className="w-4 h-4 text-neutral-400" />
            <span>Download for {getOSName()}</span>
          </button>
        </div>

        <p className="text-xs text-neutral-500 mb-12">
          Exclusive early access · Priority beta seats · Zero-cost local Ollama LLMs
        </p>

        {/* 2. SHOWCASE IMAGE 1: "COMING SOON - CODE THE FUTURE" */}
        <div className="w-full max-w-6xl mx-auto rounded-3xl border border-white/[0.1] bg-[#0c0c0c] shadow-2xl overflow-hidden p-3 relative group">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e0e12] to-black">
            <img
              src="/image_636deef.svg"
              alt="Aether IDE Coming Soon - Code the Future. Redefine Development."
              className="w-full h-auto object-cover max-h-[520px] transition-transform duration-500 group-hover:scale-[1.01]"
              loading="lazy"
            />
            
            {/* Overlay Action Bar */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/[0.1]">
              <div className="text-left">
                <span className="text-white font-bold text-sm block">Aether IDE: Code the Future</span>
                <span className="text-neutral-400 text-xs">Be the first to experience autonomous agent development.</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={openWaitlistModal}
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Join Waitlist</span>
                </button>
                <button
                  onClick={() => setSelectedZoomImage({
                    src: '/image_636deef.svg',
                    title: 'Aether IDE: Coming Soon',
                    desc: 'Be the first to experience autonomous agent coding with deep codebase intelligence.'
                  })}
                  className="p-2 rounded-full bg-white/[0.1] hover:bg-white/[0.2] text-white"
                  title="Expand preview"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 3. LOGO BAR: TRUSTED BY WORLD-CLASS ENGINEERS */}
      <section className="w-full border-y border-white/[0.06] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <p className="text-[11px] uppercase tracking-widest text-neutral-500 text-center mb-6 font-semibold">
          Trusted by developers building ambitious software
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm font-semibold tracking-wider text-neutral-400">
          <span className="hover:text-white transition-colors">STRIPE</span>
          <span className="hover:text-white transition-colors">OPENAI</span>
          <span className="hover:text-white transition-colors">PERPLEXITY</span>
          <span className="hover:text-white transition-colors">MIDJOURNEY</span>
          <span className="hover:text-white transition-colors">REPLIT</span>
          <span className="hover:text-white transition-colors">VERCEL</span>
          <span className="hover:text-white transition-colors">SHOPIFY</span>
          <span className="hover:text-white transition-colors">RAMP</span>
        </div>
      </section>

      {/* 4. SHOWCASE IMAGE 2: "ALL FEATURES. ONE POWERFUL WORKSPACE" */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            Complete Architectural Overview
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display mt-2 mb-4">
            All features. One powerful workspace.
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            The future of coding is here. Autonomous agents, MCP servers, customizable skills, and hooks integrated into a cohesive developer desktop.
          </p>
        </div>

        <div className="w-full rounded-3xl border border-white/[0.1] bg-[#0c0c0c] p-3 shadow-2xl relative group mb-8">
          <img
            src="/image_6ee3f07e.svg"
            alt="Aether IDE Workspace Overview: Plugins, Skills, Agents, MCP Servers, Tools, Hooks, Connectors, Aether AI"
            className="w-full h-auto object-cover rounded-2xl"
            loading="lazy"
          />

          <div className="absolute top-6 right-6">
            <button
              onClick={() => setSelectedZoomImage({
                src: '/image_6ee3f07e.svg',
                title: 'Aether IDE: Full Workspace Architecture',
                desc: 'Plugins, Skills, Agents, MCP Servers, Hooks, and Pair Programming interface.'
              })}
              className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-medium border border-white/[0.15] backdrop-blur-md flex items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Inspect Workspace</span>
            </button>
          </div>
        </div>

        {/* Feature Grid corresponding to the visual in image_6ee3f07e */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/[0.08]">
            <span className="text-xs font-bold text-white font-display block mb-1">🔌 Plugins</span>
            <p className="text-[11px] text-neutral-400">Install reusable packages that extend the agent with custom tools.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/[0.08]">
            <span className="text-xs font-bold text-white font-display block mb-1">🌐 MCP Servers</span>
            <p className="text-[11px] text-neutral-400">Connect agents to external databases, APIs, and GitHub tools.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/[0.08]">
            <span className="text-xs font-bold text-white font-display block mb-1">💡 Skills</span>
            <p className="text-[11px] text-neutral-400">Add domain workflows and specialized task capabilities.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/[0.08]">
            <span className="text-xs font-bold text-white font-display block mb-1">🪝 Hooks</span>
            <p className="text-[11px] text-neutral-400">Automate validation, test runs, and formatters in agent lifecycle.</p>
          </div>
        </div>
      </section>

      {/* 5. SHOWCASE IMAGE 3: "THE AI-NATIVE WORKSPACE - JAVA OPTIMIZED" */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              Aether IDE: The AI-Native Workspace
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white font-display leading-[1.08]">
              Agent-Ready. <br />Java-optimized. <br />Hyper-customizable.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Designed for high-throughput enterprise workloads, Spring Boot ecosystems, and large-scale polyglot codebases. Pair program with autonomous agents that plan, write, and verify changes.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={openWaitlistModal}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Join the Waitlist Today</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-3xl border border-white/[0.1] bg-[#0c0c0c] p-2 shadow-2xl relative group">
            <img
              src="/image_d3fa07c4.svg"
              alt="Aether IDE: The AI-Native Workspace - Agent-Ready. Java-optimized. Hyper-customizable."
              className="w-full h-auto object-cover rounded-2xl"
              loading="lazy"
            />

            <div className="absolute top-4 right-4">
              <button
                onClick={() => setSelectedZoomImage({
                  src: '/image_d3fa07c4.svg',
                  title: 'Aether IDE: AI-Native Workspace',
                  desc: 'Agent-Ready, Java-optimized, and hyper-customizable developer environment.'
                })}
                className="p-2 rounded-full bg-black/80 hover:bg-black text-white text-xs border border-white/[0.15] backdrop-blur-md"
                title="Expand"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SIGNATURE CURSOR PREDICTIVE TAB SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
              Cursor Tab
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display leading-tight">
              Predict your next edit.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Aether suggests your next edit across multiple lines and multiple files, before you even realize you need it.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setTabAccepted(!tabAccepted)}
                className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-xs font-medium text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{tabAccepted ? 'Reset Tab' : 'Press Tab to accept'}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.1] text-[10px] font-mono">Tab</kbd>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0c0c0c] p-6 font-mono text-xs text-neutral-300 text-left">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06] text-neutral-500">
              <span>src/service/PaymentProcessor.java</span>
              <span>Next Edit Prediction</span>
            </div>
            <div className="space-y-1 leading-relaxed">
              <div><span className="text-purple-400">public CompletableFuture</span>&lt;PaymentResult&gt; <span className="text-blue-400">processOrder</span>(Order order) &#123;</div>
              <div className="pl-4">log.info(<span className="text-emerald-400">"Processing order: {}"</span>, order.getId());</div>
              
              {/* Ghost cursor autocomplete preview */}
              <div className={`pl-4 transition-all ${tabAccepted ? 'text-white' : 'text-neutral-600'}`}>
                <div>return gateway.charge(order.getAmount())</div>
                <div className="pl-4">.thenApply(tx -&gt; new PaymentResult(tx.getId(), Status.SUCCESS))</div>
                <div className="pl-4">.exceptionally(ex -&gt; handlePaymentFailure(order, ex));</div>
              </div>

              <div>&#125;</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRIVACY MODE SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.06]">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0a0a0a] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-3">
            Privacy Mode: Your code never leaves your computer.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-6">
            With Privacy Mode enabled, your code is never stored on our servers. Run local Ollama or LM Studio models with zero cost, zero quota, and complete offline capability.
          </p>
          <div className="inline-flex items-center gap-6 text-xs text-neutral-400">
            <span>✓ Zero code upload</span>
            <span>·</span>
            <span>✓ Unlimited local LLMs</span>
            <span>·</span>
            <span>✓ RFC 7636 PKCE security</span>
          </div>
        </div>
      </section>

      {/* 8. FINAL CURSOR CALLOUT */}
      <section className="w-full border-t border-white/[0.08] bg-[#050505] py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-white font-display mb-4 tracking-tight">
            Code the Future. Redefine Development.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mb-8 max-w-md mx-auto">
            Be the first to experience Aether IDE. Sign up now for exclusive early access and launch updates.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={openWaitlistModal}
              className="px-8 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-700" />
              <span>Join Priority Waitlist</span>
            </button>

            <button
              onClick={() => setCurrentPage('download')}
              className="px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-sm font-medium transition-all"
            >
              Download Beta
            </button>
          </div>

          <div className="text-xs text-neutral-500">
            Follow us @AetherIDE · aetheride.dev · Powered by Firebase
          </div>
        </div>
      </section>

      {/* High-Resolution Screenshot Zoom Modal */}
      {selectedZoomImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedZoomImage(null)}
        >
          <div 
            className="max-w-5xl w-full bg-[#0a0a0a] border border-white/[0.15] rounded-3xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-display">{selectedZoomImage.title}</h3>
                <p className="text-xs text-neutral-400">{selectedZoomImage.desc}</p>
              </div>
              <button 
                onClick={() => setSelectedZoomImage(null)}
                className="p-1.5 rounded-full bg-white/[0.05] text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-black max-h-[80vh] overflow-y-auto">
              <img
                src={selectedZoomImage.src}
                alt={selectedZoomImage.title}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
