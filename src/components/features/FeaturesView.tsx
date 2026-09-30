import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  Zap, 
  Code2, 
  Cpu, 
  Layers, 
  Terminal, 
  Mic, 
  GitBranch, 
  CheckCircle2, 
  ArrowRight,
  Download,
  Sliders,
  Database,
  ExternalLink
} from 'lucide-react';

export const FeaturesView: React.FC = () => {
  const { setCurrentPage } = usePlatform();
  const [activeTab, setActiveTab] = useState<'agent' | 'studio' | 'gateway' | 'mcp' | 'terminal'>('agent');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Features Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-display tracking-tight mb-4">
          Architectural Superiority
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-8">
          Aether was engineered from the ground up to replace patchwork AI extensions with an autonomous, dual-mode workstation.
        </p>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center justify-center p-1.5 bg-[#0b1219] rounded-2xl border border-white/[0.08] max-w-2xl mx-auto overflow-x-auto text-xs font-semibold">
          {[
            { id: 'agent', label: 'Autonomous Agent' },
            { id: 'studio', label: 'Studio Slide Mode' },
            { id: 'gateway', label: 'Multi-Model Gateway' },
            { id: 'mcp', label: 'MCP Connectors' },
            { id: 'terminal', label: 'Terminal & Voice' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#26c6da] text-black shadow-md shadow-[#26c6da]/25'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Deep Dive Block */}
      <div className="rounded-3xl border border-white/[0.1] bg-[#0b1219] p-8 md:p-12 mb-16 shadow-2xl">
        {activeTab === 'agent' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-2.5 py-1 rounded text-xs font-mono bg-[#26c6da]/15 text-[#26c6da] border border-[#26c6da]/30 inline-block">
                Available in v1.2.0+ · Core Agent Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                Autonomous Multi-File Refactoring
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Traditional AI assistants are trapped inside a single file tab. Aether Agent parses your workspace Abstract Syntax Tree (AST), plans changes across multiple modules, stages atomic diffs, and validates fixes by executing your local test suites.
              </p>
              
              <ul className="space-y-2.5 text-xs text-neutral-400 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#26c6da]" />
                  <span>Self-healing test runner loops on compiler errors until 100% green.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#26c6da]" />
                  <span>Interactive line-by-line diff approval tree before staging.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#26c6da]" />
                  <span>Zero code leaves your machine when paired with local models.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6 p-6 rounded-2xl bg-black/60 border border-white/[0.08] font-mono text-xs text-neutral-300">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-neutral-500">
                <span>Agent Execution Plan (3 files)</span>
                <span className="text-emerald-400">Green Status</span>
              </div>
              <div className="space-y-2 leading-relaxed">
                <div className="text-neutral-400">1. Modify src/auth/pkce.rs (+14 -2 lines)</div>
                <div className="text-neutral-400">2. Update src/gateway/router.ts (+8 -1 lines)</div>
                <div className="text-neutral-400">3. Run test: vitest run auth.spec.ts</div>
                <div className="p-2.5 rounded bg-emerald-500/10 border-l-2 border-emerald-500 text-emerald-300">
                  ✓ 18 passed in 142ms. Zero regressions detected.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-2.5 py-1 rounded text-xs font-mono bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30 inline-block">
                Hardware Accelerated · Studio Toggle
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                Editor Mode &lt;—&gt; Studio Mode Slide
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Press <code>Cmd+Shift+A</code> to slide between standard lightweight code editing and full autonomous studio orchestration. No context switching, no cumbersome split-screen clutter.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage('ide-simulator')}
                  className="px-4 py-2 rounded-xl bg-[#26c6da] hover:bg-[#22b2c4] text-black font-semibold text-xs transition-all shadow-md shadow-[#26c6da]/25 flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Try Slide Toggle in Simulator</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-2xl bg-black/60 border border-white/[0.08] text-center">
              <div className="inline-flex items-center p-1 bg-white/[0.04] rounded-xl border border-white/[0.08] mb-4">
                <span className="px-4 py-1.5 rounded-lg text-xs font-medium text-neutral-400">Editor Mode</span>
                <span className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#26c6da] text-black">Studio Mode</span>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Transitions the layout seamlessly into diff approval trees, test output consoles, and autonomous execution scratchpads.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'gateway' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-2.5 py-1 rounded text-xs font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 inline-block">
                Zero Cloud Surcharge · 100% Free Local
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                Multi-Model Gateway
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Run local models (Ollama, LM Studio) over high-performance unix sockets with 0ms cloud proxy delay, or switch on-demand to frontier cloud reasoning (Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro) with automated fallback.
              </p>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-neutral-300">
                Fallback Chain: Ollama (Llama 3.3 70B) -&gt; Claude 3.5 Sonnet -&gt; OpenRouter
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              {[
                { name: 'Ollama / LM Studio', type: 'Local Hardware', cost: '$0.00 / ∞', quota: 'Unlimited' },
                { name: 'Claude 3.5 Sonnet', type: 'Anthropic Cloud', cost: 'Included in Pro', quota: 'Fast priority' },
                { name: 'Google Gemini 1.5 Pro', type: 'Google Cloud', cost: 'Included in Pro', quota: '2M context' },
              ].map(m => (
                <div key={m.name} className="p-4 rounded-xl bg-black/50 border border-white/[0.06] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{m.name}</span>
                    <span className="text-neutral-500 text-[11px]">{m.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-emerald-400 font-bold block">{m.cost}</span>
                    <span className="text-neutral-400 text-[11px]">{m.quota}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mcp' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-2.5 py-1 rounded text-xs font-mono bg-[#26c6da]/15 text-[#26c6da] border border-[#26c6da]/30 inline-block">
                Open Standard · MCP Protocol
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                Model Context Protocol (MCP) Connectors
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Connect external data sources and tools directly to your agent. Inspect live production or development Postgres schemas, search GitHub issues, and fetch external documentation without leaving your keyboard.
              </p>
            </div>

            <div className="lg:col-span-6 p-6 rounded-2xl bg-black/60 border border-white/[0.08] font-mono text-xs text-neutral-300 space-y-3">
              <div className="text-neutral-500">// .aether/mcp.json</div>
              <pre className="text-[#26c6da] leading-relaxed overflow-x-auto text-[11px]">
{`{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/db"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-2.5 py-1 rounded text-xs font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-block">
                v1.2.4+ · Multi-Profile Terminal
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                Multi-Profile Terminal &amp; Voice Coding
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Switch between zsh, bash, fish, and WSL terminals with independent environment profiles. Speak commands or explanations directly into terminal prompts using local Whisper speech recognition.
              </p>
            </div>

            <div className="lg:col-span-6 p-6 rounded-2xl bg-black/60 border border-white/[0.08] font-mono text-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.06] text-neutral-500">
                <span>Terminal Profile: Rust Toolchain (1.81.0)</span>
                <span className="text-[#26c6da]">Mic Active</span>
              </div>
              <p className="text-neutral-400 mb-2">$ cargo build --release</p>
              <p className="text-emerald-400">   Compiling aether_core v1.2.4</p>
              <p className="text-emerald-400">    Finished `release` profile in 4.82s</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <button
          onClick={() => setCurrentPage('download')}
          className="px-8 py-3.5 rounded-xl bg-[#26c6da] hover:bg-[#22b2c4] text-black font-semibold text-sm transition-all shadow-lg shadow-[#26c6da]/25 inline-flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Aether IDE</span>
        </button>
      </div>

    </div>
  );
};
