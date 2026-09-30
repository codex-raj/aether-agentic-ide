import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { ComingSoonModal } from './common/ComingSoonModal';

export const Footer: React.FC = () => {
  const { setCurrentPage } = usePlatform();
  const [comingSoonType, setComingSoonType] = useState<'product' | 'enterprise' | null>(null);

  return (
    <>
      <footer className="w-full border-t border-white/[0.08] bg-black text-neutral-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black font-extrabold text-xs">
                ▲
              </span>
              <span className="text-base font-bold text-white tracking-tight font-display">Aether</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm mb-4 leading-relaxed">
              The autonomous AI code editor. Built for maximum developer velocity with zero-cost local models and verifiable multi-file atomic diffs.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>© 2026 Aether</span>
              <span aria-hidden="true">·</span>
              <span>v2.0.0</span>
              <span aria-hidden="true">·</span>
              <span>Master Release</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => setComingSoonType('product')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Product 2.0</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300">Soon</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setComingSoonType('enterprise')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Enterprise Enclave</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300">Soon</span>
                </button>
              </li>
              <li><button onClick={() => setCurrentPage('download')} className="hover:text-white transition-colors cursor-pointer">Download</button></li>
              <li><button onClick={() => setCurrentPage('pricing')} className="hover:text-white transition-colors cursor-pointer">Pricing (USD &amp; INR)</button></li>
              <li><button onClick={() => setCurrentPage('changelog')} className="hover:text-white transition-colors cursor-pointer">Changelog</button></li>
              <li><button onClick={() => setCurrentPage('ide-simulator')} className="hover:text-white transition-colors cursor-pointer">Desktop Simulator</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentPage('docs')} className="hover:text-white transition-colors cursor-pointer">Documentation Hub</button></li>
              <li><button onClick={() => setCurrentPage('resources-forum')} className="hover:text-white transition-colors cursor-pointer">Community Forum &amp; Q&amp;A</button></li>
              <li><button onClick={() => setCurrentPage('resources-help')} className="hover:text-white transition-colors cursor-pointer">Help &amp; Diagnostics</button></li>
              <li><button onClick={() => setCurrentPage('resources-workshops')} className="hover:text-white transition-colors cursor-pointer">Workshops &amp; Labs</button></li>
              <li><button onClick={() => setCurrentPage('resources-api')} className="hover:text-white transition-colors cursor-pointer">API &amp; MCP Spec</button></li>
              <li><button onClick={() => setCurrentPage('security')} className="hover:text-white transition-colors cursor-pointer">Security &amp; Privacy</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-4">Community</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentPage('resources-community')} className="hover:text-white transition-colors cursor-pointer">Community Showcase</button></li>
              <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">Discord Lounge</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">GitHub Repository</a></li>
              <li><span className="text-neutral-400">security@aether.build</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <div>
            Privacy Mode: With Local Enclave enabled, your code never leaves your workstation.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-300 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={Boolean(comingSoonType)}
        type={comingSoonType || 'product'}
        onClose={() => setComingSoonType(null)}
      />
    </>
  );
};
