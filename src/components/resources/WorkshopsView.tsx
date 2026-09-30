import React, { useState } from 'react';
import { 
  Play, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Code2, 
  Terminal, 
  Download, 
  Share2, 
  Sparkles,
  Users,
  Copy,
  Check
} from 'lucide-react';

interface WorkshopItem {
  id: string;
  title: string;
  category: 'Local AI' | 'Autonomous Agents' | 'MCP Extensions' | 'Architecture';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  thumbnail: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  summary: string;
  commandSnippet: string;
  chapters: { title: string; timestamp: string }[];
  completed?: boolean;
}

const WORKSHOPS: WorkshopItem[] = [
  {
    id: 'ws-1',
    title: 'Zero-Cost Local AI: Running Quantized DeepSeek & Llama 3 in Aether with 0ms Cloud Latency',
    category: 'Local AI',
    level: 'Beginner',
    duration: '42 mins',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Dr. Aaron Vance',
      role: 'Head of Local Systems, Aether',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    summary: 'Master zero-dollar local development. Learn to set up Ollama daemon, tune context windows up to 131k tokens, configure GPU VRAM offloading, and pair Aether IDE for completely private, offline coding.',
    commandSnippet: 'ollama run deepseek-coder-v2:16b --verbose\n# In Aether: Settings > Providers > Local > Select Ollama',
    chapters: [
      { title: 'Ollama Daemon Installation & VRAM Tuning', timestamp: '00:00' },
      { title: 'Configuring Aether Local Model Endpoints', timestamp: '12:30' },
      { title: 'Testing Multi-File AST Context Parsing', timestamp: '24:15' },
      { title: 'Offline 48-Hour Leases & Keyring Storage', timestamp: '35:40' }
    ]
  },
  {
    id: 'ws-2',
    title: 'Autonomous Multi-File Refactoring: Driving Studio Mode Agent Swarms',
    category: 'Autonomous Agents',
    level: 'Intermediate',
    duration: '58 mins',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Maya Lin',
      role: 'Principal Agent Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    summary: 'A deep-dive into autonomous multi-file refactoring. Discover how Aether indexes AST trees, resolves cross-module dependencies, generates verifiable patch diffs, and auto-fixes broken unit tests.',
    commandSnippet: 'aether agent --mode=studio --task="Migrate auth subsystem to PKCE with Argon2id"',
    chapters: [
      { title: 'How Tree-Sitter AST Graphs Work', timestamp: '00:00' },
      { title: 'Structuring Atomic Multi-File Prompts', timestamp: '15:20' },
      { title: 'Reviewing Unified Diffs & Safe Reject', timestamp: '31:45' },
      { title: 'Autonomous Test Repair in CI pipelines', timestamp: '48:10' }
    ]
  },
  {
    id: 'ws-3',
    title: 'Building Custom Model Context Protocol (MCP) Servers for Live Tool Calling',
    category: 'MCP Extensions',
    level: 'Advanced',
    duration: '51 mins',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Carlos Mendez',
      role: 'Ecosystem & Protocols Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    },
    summary: 'Build your own MCP tool servers in TypeScript or Python. Enable Aether IDE agents to query live databases, inspect cloud logs, run Docker containers, and trigger production deployments directly from chat.',
    commandSnippet: 'npx @modelcontextprotocol/create-server my-custom-db-mcp\ncd my-custom-db-mcp && npm run build',
    chapters: [
      { title: 'MCP JSON-RPC Protocol Specification', timestamp: '00:00' },
      { title: 'Declaring Tools, Prompts & Resources', timestamp: '14:10' },
      { title: 'Testing STDIO and SSE Transports', timestamp: '29:50' },
      { title: 'Registering with Aether Global Tools', timestamp: '42:30' }
    ]
  }
];

export const WorkshopsView: React.FC = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopItem>(WORKSHOPS[0]);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [rsvpRegistered, setRsvpRegistered] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#141224] via-[#0d1017] to-[#0a1622] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25 uppercase">
              Workshops &amp; Masterclasses
            </span>
            <span className="text-[11px] text-neutral-400">Interactive Video &amp; Code Labs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Aether Developer Masterclasses
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl leading-relaxed">
            Hands-on architectural tutorials, zero-cost local LLM orchestration, and advanced multi-file agent refactoring workshops.
          </p>
        </div>

        {/* Live Webinar RSVP card */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.1] shrink-0 w-full md:w-80">
          <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Next Live Developer Webinar</span>
          </div>
          <p className="text-[11px] text-neutral-400 mb-3">
            Every Thursday at 10:00 AM PST · Live Q&amp;A with Aether Core Team
          </p>
          <button
            onClick={() => setRsvpRegistered(prev => !prev)}
            className={`w-full py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              rsvpRegistered
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {rsvpRegistered ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reserved! Link Sent to Email</span>
              </>
            ) : (
              <span>Reserve Free Webinar Spot</span>
            )}
          </button>
        </div>
      </div>

      {/* Featured Video Player Mockup & Active Workshop */}
      <div className="rounded-3xl bg-[#090b10] border border-white/[0.08] overflow-hidden">
        
        {/* Video Player Display */}
        <div className="relative aspect-video w-full bg-[#050608] flex items-center justify-center overflow-hidden group">
          <img 
            src={selectedWorkshop.thumbnail} 
            alt={selectedWorkshop.title}
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
            <button 
              className="w-16 h-16 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer mb-4"
              title="Play Workshop Video"
            >
              <Play className="w-7 h-7 fill-black ml-1" />
            </button>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-black/70 text-white backdrop-blur-md border border-white/[0.1] mb-2">
              {selectedWorkshop.duration} Masterclass · {selectedWorkshop.level}
            </span>
            <h3 className="text-lg sm:text-2xl font-bold text-white max-w-2xl font-display">
              {selectedWorkshop.title}
            </h3>
          </div>
        </div>

        {/* Workshop Details & Code Snippet */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
            <div className="flex items-center gap-3">
              <img 
                src={selectedWorkshop.instructor.avatar} 
                alt={selectedWorkshop.instructor.name}
                className="w-10 h-10 rounded-full object-cover border border-white/[0.1]" 
              />
              <div>
                <p className="text-sm font-semibold text-white">{selectedWorkshop.instructor.name}</p>
                <p className="text-xs text-neutral-400">{selectedWorkshop.instructor.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="px-2.5 py-1 rounded-full bg-white/[0.06] text-neutral-300 font-mono">
                {selectedWorkshop.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedWorkshop.duration}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Summary & Commands (Col 7) */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Workshop Overview
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {selectedWorkshop.summary}
              </p>

              <div className="rounded-2xl bg-[#050608] border border-white/[0.08] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Quickstart Terminal Snippet</span>
                  </span>
                  <button
                    onClick={() => handleCopy(selectedWorkshop.commandSnippet)}
                    className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy command"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="font-mono text-xs text-neutral-200 overflow-x-auto whitespace-pre-wrap">
                  {selectedWorkshop.commandSnippet}
                </pre>
              </div>
            </div>

            {/* Chapters / Timeline (Col 5) */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Chapters &amp; Milestones
              </h4>
              <div className="space-y-1.5">
                {selectedWorkshop.chapters.map((ch, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] flex items-center justify-between text-xs transition-colors cursor-pointer"
                  >
                    <span className="text-neutral-300 font-medium">{ch.title}</span>
                    <span className="font-mono text-[10px] text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10">
                      {ch.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* More Masterclasses Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-display">
          All Available Workshops &amp; Labs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WORKSHOPS.map((ws) => {
            const isSelected = selectedWorkshop.id === ws.id;
            return (
              <div
                key={ws.id}
                onClick={() => setSelectedWorkshop(ws)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/20 border-cyan-500/40 ring-1 ring-cyan-500/30'
                    : 'bg-[#090b10] border-white/[0.06] hover:border-white/[0.14]'
                }`}
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-black">
                    <img src={ws.thumbnail} alt={ws.title} className="w-full h-full object-cover opacity-60" />
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
                      {ws.duration}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-neutral-400">
                    {ws.category}
                  </span>

                  <h4 className="text-xs sm:text-sm font-semibold text-white mt-2 line-clamp-2 leading-snug">
                    {ws.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-white/[0.04] mt-3">
                  <span>{ws.instructor.name}</span>
                  <span className="text-cyan-400 font-medium">Watch Lab →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
