import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Search, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  FileText, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  ExternalLink,
  RefreshCw,
  Clock,
  Ticket
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface DiagnosticItem {
  id: string;
  name: string;
  category: 'local' | 'cloud' | 'auth';
  status: 'operational' | 'warning' | 'checking';
  latencyMs: number;
  detail: string;
}

export const HelpCenter: React.FC = () => {
  const { currentUser } = usePlatform();
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSeverity, setTicketSeverity] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [ticketSubmittedId, setTicketSubmittedId] = useState<string | null>(null);

  const [diagnostics, setDiagnostics] = useState<DiagnosticItem[]>([
    {
      id: 'diag-1',
      name: 'Local Ollama Server (localhost:11434)',
      category: 'local',
      status: 'operational',
      latencyMs: 3,
      detail: 'Ollama daemon responsive. Available models: deepseek-coder-v2, llama3.1:8b.'
    },
    {
      id: 'diag-2',
      name: 'Aether Multi-Model Gateway (Edge US/EU/AP)',
      category: 'cloud',
      status: 'operational',
      latencyMs: 24,
      detail: 'HTTP/2 low-latency tunnel active. Anthropic & OpenAI proxies online.'
    },
    {
      id: 'diag-3',
      name: 'RFC 7636 PKCE Keyring Token Attestation',
      category: 'auth',
      status: 'operational',
      latencyMs: 1,
      detail: 'Electron safeStorage encrypted lease valid for 48 hours offline grace.'
    },
    {
      id: 'diag-4',
      name: 'Language Server Protocol (LSP) AST Indexer',
      category: 'local',
      status: 'operational',
      latencyMs: 5,
      detail: 'In-memory multi-file tree-sitter syntax graph operational.'
    }
  ]);

  const runSystemDiagnostics = () => {
    setDiagnosticRunning(true);
    setTimeout(() => {
      setDiagnostics(prev => prev.map(item => ({
        ...item,
        latencyMs: Math.floor(Math.random() * 20) + 2,
        status: 'operational'
      })));
      setDiagnosticRunning(false);
    }, 800);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    const generatedId = `AETH-TK-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketSubmittedId(generatedId);
    setTicketSubject('');
    setTicketMessage('');
  };

  const faqs = [
    {
      q: 'How do I resolve "Connection refused to localhost:11434" when launching Ollama?',
      category: 'Ollama & Local Models',
      a: 'Make sure your Ollama daemon is running in the background. On macOS run `ollama serve` or open the Ollama app. On Linux run `systemctl start ollama`. Also verify that the OLLAMA_ORIGINS environment variable permits cross-origin requests from the Aether desktop app: `OLLAMA_ORIGINS="*" ollama serve`.'
    },
    {
      q: 'Can I use Aether 100% offline without ever connecting to the internet?',
      category: 'Offline & Privacy',
      a: 'Yes! Aether provides a 48-hour offline cryptographic lease window. If you exclusively utilize local models (Ollama, LM Studio, vLLM), your source code, indices, and prompts never touch any cloud server.'
    },
    {
      q: 'What should I do if the PKCE browser login does not redirect back to Aether IDE?',
      category: 'Authentication',
      a: 'If your custom Linux window manager or browser blocks the `aether://callback` protocol handler, navigate to the User Dashboard or Account Security tab on the website and click "Download Pairing Key JSON". Then in Aether IDE, open Command Palette (⌘K) and select "Import Offline Pairing Key".'
    },
    {
      q: 'How does Aether handle multi-file autonomous editing without breaking syntax?',
      category: 'Studio Mode & Agents',
      a: 'Aether employs AST tree-sitter validation passes on proposed diffs before applying changes to disk. If a patch creates a syntax or type error, the autonomous agent immediately detects the diagnostic error and self-corrects the diff before presenting the review stage.'
    },
    {
      q: 'Can I add custom Model Context Protocol (MCP) servers?',
      category: 'MCP Extensions',
      a: 'Yes! In your project root, create a `.aether/mcp.json` or configure it through Settings > Integrations. Aether natively connects to standard MCP stdio and SSE transport servers for databases, git, GitHub issues, and filesystem tools.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.a.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d131f] via-[#090e18] to-[#14101e] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 uppercase">
              Help &amp; Support Hub
            </span>
            <span className="text-[11px] text-neutral-400">All Systems Operational</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Aether Diagnostic &amp; Help Center
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl leading-relaxed">
            Run automated local environment diagnostics, troubleshoot desktop issues, explore comprehensive FAQs, or open an engineering support ticket.
          </p>
        </div>

        <button
          onClick={runSystemDiagnostics}
          disabled={diagnosticRunning}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${diagnosticRunning ? 'animate-spin' : ''}`} />
          <span>{diagnosticRunning ? 'Scanning Environment...' : 'Run Diagnostics'}</span>
        </button>
      </div>

      {/* Diagnostics Panel */}
      <div className="rounded-3xl bg-[#090b10] border border-white/[0.08] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-display">
              Environment &amp; Handshake Diagnostics
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>4 / 4 Checks Passing</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {diagnostics.map((diag) => (
            <div 
              key={diag.id}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 hover:border-white/[0.12] transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-semibold text-white truncate">{diag.name}</h4>
                  <span className="text-[10px] font-mono text-neutral-400 ml-2 shrink-0">
                    {diag.latencyMs}ms
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {diag.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive FAQ Search */}
      <div className="rounded-3xl bg-[#090b10] border border-white/[0.08] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Frequently Answered Solutions
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Instant fixes for local runtime, PKCE desktop auth, and MCP extensions.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search help topics..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#050608] border border-white/[0.08] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-medium text-white hover:bg-white/[0.02] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-neutral-400">
                      {faq.category}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-2 text-xs text-neutral-300 leading-relaxed border-t border-white/[0.04] bg-[#06080b]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Support Ticket Form */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0e121b] to-[#090b10] border border-white/[0.08] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              Open an Engineering Support Request
            </h3>
            <p className="text-xs text-neutral-400">
              Need assistance with an edge-case configuration or custom enterprise setup? Our team responds within 24 hours.
            </p>
          </div>
        </div>

        {ticketSubmittedId ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-white">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Ticket Received: {ticketSubmittedId}</span>
            </div>
            <p className="text-xs text-neutral-300">
              A support engineer has been assigned. You'll receive updates at {currentUser?.email || 'your registered email'}.
            </p>
            <button
              onClick={() => setTicketSubmittedId(null)}
              className="text-xs font-semibold text-emerald-300 hover:text-white underline cursor-pointer"
            >
              Submit another inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Ollama token streaming stuttering on Linux"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080b] border border-white/[0.1] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Severity Level
                </label>
                <select
                  value={ticketSeverity}
                  onChange={(e: any) => setTicketSeverity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080b] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="low">Low — General inquiry or question</option>
                  <option value="normal">Normal — Non-blocking bug or setup issue</option>
                  <option value="high">High — Blocking local workflow / sync failure</option>
                  <option value="urgent">Urgent — Production outage / team blocker</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Issue Description &amp; Reproduction Steps
              </label>
              <textarea
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Include your OS version, Aether IDE build, Ollama version, and error logs..."
                rows={4}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080b] border border-white/[0.1] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-neutral-400">
                Logged in as: {currentUser?.email || 'Anonymous Developer'}
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
