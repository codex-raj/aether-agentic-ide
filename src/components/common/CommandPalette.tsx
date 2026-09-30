import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePlatform, NavigationTarget } from '../../context/PlatformContext';
import { 
  Search, 
  Terminal, 
  Laptop, 
  Key, 
  ShieldAlert, 
  RotateCcw, 
  Download, 
  DollarSign, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  User, 
  Layers, 
  Flag, 
  ScrollText, 
  Sliders, 
  FileJson, 
  Zap, 
  ExternalLink,
  CheckCircle2,
  MessageSquare,
  Lock,
  Unlock,
  CornerDownLeft,
  ArrowUpDown
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: 'Navigation' | 'IDE Simulator' | 'Platform & Governance';
  title: string;
  subtitle: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
  keywords?: string[];
}

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen,
    setCurrentPage,
    currentUser,
    switchRole,
    pkceState,
    startPKCEFlow,
    completeWebAuth,
    exchangePKCEToken,
    triggerDesktopRevoke,
    resetDesktopLock,
    updatePreferences,
    toggleFlag,
    flags
  } = usePlatform();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open & reset selection
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isCommandPaletteOpen]);

  const handleExportData = () => {
    const exportBundle = {
      exportVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      user: currentUser,
      notice: 'Proprietary source code and keystrokes are never stored or logged on Aether servers.',
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-account-export-${(currentUser?.id || 'guest').slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const commands: CommandItem[] = useMemo(() => [
    // --- Navigation Pages ---
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Home & Product Showcase',
      subtitle: 'Hero, interactive product slide demo, benchmarks',
      icon: Zap,
      shortcut: 'H',
      action: () => setCurrentPage('home'),
      keywords: ['landing', 'hero', 'overview', 'main', 'start']
    },
    {
      id: 'nav-features',
      category: 'Navigation',
      title: 'Features: Autonomous Agent & Studio Mode',
      subtitle: 'Multi-file refactoring, Multi-Model Gateway, MCP connectors',
      icon: Layers,
      shortcut: 'F',
      action: () => setCurrentPage('features'),
      keywords: ['capabilities', 'agent', 'mcp', 'terminal', 'models']
    },
    {
      id: 'nav-download',
      category: 'Navigation',
      title: 'Download Portal & SHA-256 Checksums',
      subtitle: 'Binaries for macOS, Windows, Linux with verified signatures',
      icon: Download,
      shortcut: 'D',
      action: () => setCurrentPage('download'),
      keywords: ['install', 'exe', 'dmg', 'appimage', 'deb', 'hash']
    },
    {
      id: 'nav-pricing',
      category: 'Navigation',
      title: 'Pricing & Entitlements Matrix',
      subtitle: 'Free, Pro, Team, Enterprise plans and local AI guarantee',
      icon: DollarSign,
      shortcut: 'P',
      action: () => setCurrentPage('pricing'),
      keywords: ['plans', 'cost', 'subscription', 'free', 'pro', 'upgrade']
    },
    {
      id: 'nav-docs',
      category: 'Navigation',
      title: 'Documentation Hub',
      subtitle: 'Architectural guides, PKCE specs, Ollama setup, and APIs',
      icon: BookOpen,
      shortcut: 'B',
      action: () => setCurrentPage('docs'),
      keywords: ['help', 'manual', 'reference', 'setup', 'tutorial', 'resources']
    },
    {
      id: 'nav-forum',
      category: 'Navigation',
      title: 'Resources: Community Forum & Q&A',
      subtitle: 'Developer discussions, Ollama configs, and custom solutions',
      icon: MessageSquare,
      action: () => setCurrentPage('resources-forum'),
      keywords: ['forum', 'community', 'questions', 'discussions', 'answers']
    },
    {
      id: 'nav-help',
      category: 'Navigation',
      title: 'Resources: Help & Environment Diagnostics',
      subtitle: 'Scan local Ollama daemon, troubleshooting wizard, FAQs',
      icon: ShieldCheck,
      action: () => setCurrentPage('resources-help'),
      keywords: ['help', 'diagnostics', 'faq', 'support', 'ticket', 'troubleshoot']
    },
    {
      id: 'nav-workshops',
      category: 'Navigation',
      title: 'Resources: Workshops & Labs',
      subtitle: 'Interactive video masterclasses and companion code labs',
      icon: Layers,
      action: () => setCurrentPage('resources-workshops'),
      keywords: ['workshops', 'videos', 'labs', 'masterclass', 'tutorials']
    },
    {
      id: 'nav-resources-api',
      category: 'Navigation',
      title: 'Resources: API & MCP Protocol Reference',
      subtitle: 'CLI commands, .aether/config.json schema, Model Context Protocol',
      icon: Terminal,
      action: () => setCurrentPage('resources-api'),
      keywords: ['api', 'cli', 'mcp', 'protocol', 'schema', 'config']
    },
    {
      id: 'nav-changelog',
      category: 'Navigation',
      title: 'Release Changelog',
      subtitle: 'Version history, release notes, rollback tracking',
      icon: FileText,
      action: () => setCurrentPage('changelog'),
      keywords: ['versions', 'history', 'releases', 'updates', 'withdrawn']
    },
    {
      id: 'nav-security',
      category: 'Navigation',
      title: 'Security, Trust & Privacy Center',
      subtitle: 'Data handling matrix, PKCE flow, sub-processors',
      icon: ShieldCheck,
      action: () => setCurrentPage('security'),
      keywords: ['privacy', 'retention', 'gdpr', 'security.txt', 'audit']
    },
    {
      id: 'nav-dashboard',
      category: 'Navigation',
      title: 'User Portal: Overview & Devices',
      subtitle: 'Manage connected workstations, AI quotas, active sessions',
      icon: User,
      action: () => setCurrentPage('dashboard'),
      keywords: ['account', 'profile', 'workstation', 'portal']
    },
    {
      id: 'nav-admin',
      category: 'Navigation',
      title: 'Admin Console & Control Plane',
      subtitle: 'Server-authorized user governance, rollbacks, flags, audit logs',
      icon: ShieldCheck,
      action: () => setCurrentPage('admin-overview'),
      keywords: ['admin', 'owner', 'governance', 'telemetry', 'rollout']
    },

    // --- IDE Simulator Commands ---
    {
      id: 'ide-open',
      category: 'IDE Simulator',
      title: 'Desktop IDE: Open Simulator Workspace',
      subtitle: 'Simulate desktop editor, terminal shell, and Lock Barrier',
      icon: Terminal,
      shortcut: 'I',
      action: () => setCurrentPage('ide-simulator'),
      keywords: ['ide', 'editor', 'code', 'simulator', 'desktop']
    },
    {
      id: 'ide-pkce-start',
      category: 'IDE Simulator',
      title: 'Desktop IDE: Initiate PKCE Handshake',
      subtitle: 'Generate verifier, SHA-256 challenge & trigger web auth',
      icon: Key,
      action: () => {
        setCurrentPage('ide-simulator');
        startPKCEFlow();
      },
      keywords: ['pkce', 'login', 'handshake', 'auth', 'challenge']
    },
    {
      id: 'ide-auth-google',
      category: 'IDE Simulator',
      title: 'Desktop IDE: Complete Web Sign-in (Google)',
      subtitle: 'Simulate successful browser OAuth & issue 60s auth_code',
      icon: CheckCircle2,
      action: () => {
        setCurrentPage('ide-simulator');
        completeWebAuth('google');
      },
      keywords: ['google', 'oauth', 'web', 'login']
    },
    {
      id: 'ide-exchange-token',
      category: 'IDE Simulator',
      title: 'Desktop IDE: Exchange PKCE Code for Tokens',
      subtitle: 'Direct POST /desktop/token exchange, safeStorage, unlock workstation',
      icon: Unlock,
      action: () => {
        setCurrentPage('ide-simulator');
        exchangePKCEToken();
      },
      keywords: ['token', 'unlock', 'exchange', 'safestorage']
    },
    {
      id: 'ide-revoke-sim',
      category: 'IDE Simulator',
      title: 'Desktop IDE: Simulate Remote Revoke Broadcast',
      subtitle: 'Fire Realtime Revoke signal to instantly engage Lock Barrier',
      icon: ShieldAlert,
      action: () => {
        setCurrentPage('ide-simulator');
        triggerDesktopRevoke('Revocation broadcast received via Command Palette');
      },
      keywords: ['revoke', 'lock', 'kick', 'security', 'emergency']
    },
    {
      id: 'ide-reset-lock',
      category: 'IDE Simulator',
      title: 'Desktop IDE: Reset Lock Barrier State',
      subtitle: 'Clear tokens and reset simulator to fresh locked state',
      icon: RotateCcw,
      action: () => {
        setCurrentPage('ide-simulator');
        resetDesktopLock();
      },
      keywords: ['reset', 'clean', 'lock']
    },

    // --- Platform & Governance Commands ---
    {
      id: 'role-admin',
      category: 'Platform & Governance',
      title: 'Role: Switch to Admin / Owner Privilege',
      subtitle: 'Test server-authorized admin controls, rollbacks, and flags',
      icon: ShieldCheck,
      action: () => switchRole('admin'),
      keywords: ['admin', 'privilege', 'owner', 'role']
    },
    {
      id: 'role-user',
      category: 'Platform & Governance',
      title: 'Role: Switch to Regular Developer',
      subtitle: 'Test standard user dashboard and limited permissions',
      icon: User,
      action: () => switchRole('user'),
      keywords: ['user', 'developer', 'normal', 'role']
    },
    {
      id: 'channel-stable',
      category: 'Platform & Governance',
      title: 'Update Channel: Switch to Stable',
      subtitle: 'Tested, production-grade release stream (default)',
      icon: CheckCircle2,
      action: () => updatePreferences({ updateChannel: 'stable' }),
      keywords: ['stable', 'channel', 'update']
    },
    {
      id: 'channel-beta',
      category: 'Platform & Governance',
      title: 'Update Channel: Switch to Beta',
      subtitle: 'Early features including Studio Mode v2 and MCP debuggers',
      icon: Zap,
      action: () => updatePreferences({ updateChannel: 'beta' }),
      keywords: ['beta', 'channel', 'early']
    },
    {
      id: 'export-data',
      category: 'Platform & Governance',
      title: 'Privacy: Export Account Data (JSON Archive)',
      subtitle: 'Download complete GDPR/CCPA personal data package',
      icon: FileJson,
      action: handleExportData,
      keywords: ['export', 'json', 'gdpr', 'ccpa', 'download']
    },
    {
      id: 'flag-agent-v2',
      category: 'Platform & Governance',
      title: 'Feature Flag: Toggle "agent_v2_engine"',
      subtitle: 'Multi-file refactoring engine with self-healing test loop',
      icon: Flag,
      action: () => toggleFlag('agent_v2_engine'),
      keywords: ['flag', 'agent', 'toggle', 'feature']
    },
    {
      id: 'flag-studio-mode',
      category: 'Platform & Governance',
      title: 'Feature Flag: Toggle "studio_mode_slide"',
      subtitle: 'Hardware-accelerated canvas slide transition',
      icon: Flag,
      action: () => toggleFlag('studio_mode_slide'),
      keywords: ['flag', 'studio', 'slide', 'feature']
    },
  ], [
    setCurrentPage, 
    switchRole, 
    startPKCEFlow, 
    completeWebAuth, 
    exchangePKCEToken, 
    triggerDesktopRevoke, 
    resetDesktopLock,
    updatePreferences,
    toggleFlag,
    currentUser
  ]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase().trim();
    return commands.filter(cmd => 
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      (cmd.keywords && cmd.keywords.some(k => k.toLowerCase().includes(q)))
    );
  }, [commands, query]);

  // Keyboard navigation inside command palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + Math.max(1, filteredCommands.length)) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsCommandPaletteOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const executeCommand = (cmd: CommandItem) => {
    cmd.action();
    setIsCommandPaletteOpen(false);
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 sm:pt-28 px-4"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl bg-[#0b1219]/95 border border-white/[0.14] shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[75vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-white/[0.08] px-4 py-3.5 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or jump to page (e.g. 'download', 'pkce', 'agent', 'admin')..."
            className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="text-xs text-neutral-500 hover:text-white px-1.5 py-0.5 rounded bg-white/[0.05]"
            >
              Clear
            </button>
          )}
          <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono text-neutral-400 border border-white/[0.08]">
            ESC
          </span>
        </div>

        {/* Command List Viewport */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-white/[0.02]"
        >
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const isSelected = selectedIndex === idx;
              const Icon = cmd.icon;

              return (
                <div
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-gradient-to-r from-[#26c6da]/15 via-white/[0.05] to-transparent border border-[#26c6da]/30 text-white' 
                      : 'hover:bg-white/[0.04] text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? 'bg-[#26c6da] text-black shadow-md shadow-[#26c6da]/30' 
                        : 'bg-white/[0.05] text-neutral-400 border border-white/[0.06]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {cmd.title}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {cmd.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-neutral-400 border border-white/[0.08]">
                        {cmd.shortcut}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-[#26c6da]" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center">
              <Search className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs text-neutral-400 mb-1">No matching commands found for "{query}".</p>
              <p className="text-[11px] text-neutral-600">Try searching for "download", "features", "pkce", "flag", or "admin".</p>
            </div>
          )}
        </div>

        {/* Footer Quick Status & Shortcuts */}
        <div className="px-4 py-2.5 border-t border-white/[0.08] bg-[#070b0e] flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-neutral-400" /> Navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3 text-neutral-400" /> Execute
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1 py-0.5 rounded bg-white/[0.06] text-[10px]">ESC</span> Close
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Aether Workstation:</span>
            <span className={pkceState.status === 'unlocked' ? 'text-emerald-400' : 'text-amber-400'}>
              {pkceState.status.toUpperCase()}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
