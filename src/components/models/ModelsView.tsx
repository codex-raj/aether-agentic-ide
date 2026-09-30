import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Terminal, 
  Download, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Sliders, 
  Server, 
  Layers,
  Lock,
  ExternalLink
} from 'lucide-react';

export const ModelsView: React.FC = () => {
  const { setCurrentPage, openWaitlistModal } = usePlatform();
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'cloud' | 'local'>('all');

  const models = [
    {
      id: 'claude-3-7-sonnet',
      name: 'Claude 3.7 Sonnet (Hybrid Reasoning)',
      provider: 'Anthropic',
      type: 'cloud',
      speed: 'Fast (120 t/s)',
      context: '200k tokens',
      cost: 'Included in Pro / Team',
      description: 'Frontier reasoning model with extended thinking mode. Premier engine for autonomous multi-file architecture refactoring.',
      tags: ['Autonomous Agent', 'Architectural Refactor', 'Reasoning'],
      badge: 'POPULAR'
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o (Omni Engine)',
      provider: 'OpenAI',
      type: 'cloud',
      speed: 'Ultra Fast (150 t/s)',
      context: '128k tokens',
      cost: 'Included in Pro / Team',
      description: 'Low-latency multimodal model with strong system-level coding and inline completion accuracy.',
      tags: ['Inline Tab Completion', 'Fast Diffs'],
      badge: 'RECOMMENDED'
    },
    {
      id: 'gemini-2-flash',
      name: 'Gemini 2.0 Flash',
      provider: 'Google',
      type: 'cloud',
      speed: 'Instant (180 t/s)',
      context: '1M tokens',
      cost: 'Included in Free & Pro',
      description: 'Extreme speed with massive 1-million token context window. Perfect for whole-repo analysis and AST indexing.',
      tags: ['Repo-Wide Context', 'Instant Edits'],
      badge: 'HIGH SPEED'
    },
    {
      id: 'deepseek-r1',
      name: 'DeepSeek-R1 (CoT Reasoning)',
      provider: 'DeepSeek / Self-Hosted',
      type: 'cloud',
      speed: 'Moderate (45 t/s)',
      context: '64k tokens',
      cost: 'Included in Pro',
      description: 'Open-weights chain-of-thought engine capable of rigorous mathematical proofs and bug isolation.',
      tags: ['Bug Isolation', 'Formal Verification'],
      badge: 'REASONING'
    },
    {
      id: 'ollama-qwen-coder',
      name: 'Qwen 2.5 Coder (32B / 14B / 7B)',
      provider: 'Ollama (Local Workstation)',
      type: 'local',
      speed: 'Hardware dependent',
      context: '32k tokens',
      cost: '100% Free Forever (0 Tokens)',
      description: 'Top-tier open-source coding model running natively on your GPU/Metal. Zero telemetry, completely offline.',
      tags: ['100% Offline', 'Zero Telemetry', 'Free'],
      badge: 'LOCAL OFFLINE'
    },
    {
      id: 'ollama-llama-3-3',
      name: 'Llama 3.3 (70B / 8B Instruct)',
      provider: 'Ollama (Local Workstation)',
      type: 'local',
      speed: 'Hardware dependent',
      context: '128k tokens',
      cost: '100% Free Forever (0 Tokens)',
      description: 'State-of-the-art open weights model running on Apple Silicon unified memory or NVIDIA CUDA cores.',
      tags: ['Local Workstation', 'Air-Gapped', 'Zero Cost'],
      badge: 'AIR-GAPPED'
    }
  ];

  const filteredModels = models.filter(m => {
    if (selectedProvider === 'all') return true;
    return m.type === selectedProvider;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-black text-[#ededed]">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs text-neutral-300 mb-4">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Unified Multi-Model AI Gateway</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-white font-display tracking-tight mb-4">
          Frontier Models. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400">
            Cloud &amp; Offline Local.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 leading-relaxed mb-8">
          Switch effortlessly between frontier cloud models and unlimited local Ollama models on your own machine. Zero markup, zero vendor lock-in.
        </p>

        {/* Filter Toggle */}
        <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-[#111111] border border-white/[0.08]">
          <button
            onClick={() => setSelectedProvider('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedProvider === 'all' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Models ({models.length})
          </button>
          <button
            onClick={() => setSelectedProvider('cloud')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedProvider === 'cloud' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cloud Frontier (4)
          </button>
          <button
            onClick={() => setSelectedProvider('local')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedProvider === 'local' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Local Ollama (Free &amp; Offline)
          </button>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {filteredModels.map((m) => (
          <div 
            key={m.id}
            className="p-6 rounded-3xl bg-[#0c0c0c] border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-neutral-400 border border-white/[0.06]">
                  {m.provider}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  m.type === 'local' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                  {m.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white font-display mb-2 group-hover:text-cyan-300 transition-colors">
                {m.name}
              </h3>
              
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                {m.description}
              </p>

              {/* Specs */}
              <div className="space-y-2 py-3 border-y border-white/[0.06] text-xs mb-6">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Inference Latency:</span>
                  <span className="text-white font-mono">{m.speed}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Context Window:</span>
                  <span className="text-white font-mono">{m.context}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Billing / Quota:</span>
                  <span className={`font-mono font-medium ${m.type === 'local' ? 'text-emerald-400' : 'text-neutral-300'}`}>
                    {m.cost}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {m.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-neutral-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentPage('download')}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white text-white hover:text-black text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Deploy in Aether IDE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Local Ollama Guarantee Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950/30 via-[#0d1419] to-black border border-emerald-500/25 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Zero Cost &amp; Offline Guarantee</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
            Run Unlimited Local LLMs with Zero Quotas
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
            Aether natively interfaces with Ollama and LM Studio over localhost HTTP. Your code, AST, and prompts never leave your device. Complete air-gapped security for sensitive enterprise repositories.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentPage('docs')}
            className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.1] transition-all cursor-pointer"
          >
            Ollama Guide
          </button>
          <button
            onClick={() => setCurrentPage('download')}
            className="px-6 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-semibold transition-all cursor-pointer shadow-md shadow-emerald-500/10"
          >
            Download Aether
          </button>
        </div>
      </div>

    </div>
  );
};
