import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Terminal as TerminalIcon, 
  Cpu, 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  RotateCcw,
  ExternalLink,
  Laptop
} from 'lucide-react';

export const DesktopIDESimulator: React.FC = () => {
  const { 
    pkceState, 
    startPKCEFlow, 
    completeWebAuth, 
    exchangePKCEToken, 
    triggerDesktopRevoke, 
    resetDesktopLock,
    currentUser
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'editor' | 'logs' | 'security_spec'>('editor');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Aether Autonomous IDE v1.2.4 (darwin-arm64)',
    'Type "help" or run "cargo test", "aether status", "ollama list".',
  ]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    const cmd = terminalInput.trim();
    let response = '';

    if (cmd === 'help') {
      response = 'Available commands: aether status, ollama list, cargo test, git status, clear';
    } else if (cmd === 'aether status') {
      response = `Status: ${pkceState.status.toUpperCase()} | Lease: 48h active | Heartbeat: ${pkceState.heartbeatCountdown}s remaining | Device: ${pkceState.deviceId}`;
    } else if (cmd === 'ollama list') {
      response = 'NAME                     ID           SIZE    MODIFIED\nllama3.3:70b-instruct   78a2e19b88   39 GB   2 days ago\nqwen2.5-coder:32b       9b14f88c12   19 GB   1 week ago';
    } else if (cmd === 'cargo test') {
      response = 'running 18 tests\ntest auth::tests::test_pkce_verifier_match ... ok\ntest auth::tests::test_refresh_token_rotation ... ok\ntest agent::tests::test_ast_atomic_patch ... ok\ntest result: ok. 18 passed; 0 failed; 0 ignored';
    } else if (cmd === 'git status') {
      response = 'On branch feat/pkce-handshake\nChanges to be committed:\n  modified: src/auth_pkce.rs';
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      response = `Command not recognized: ${cmd}`;
    }

    setTerminalHistory(prev => [...prev, `$ ${cmd}`, response]);
    setTerminalInput('');
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Simulator Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#26c6da] animate-ping" />
            <h1 className="text-2xl font-bold text-white font-display">Aether Desktop Simulator</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-neutral-300 border border-white/[0.08]">
              RFC 7636 PKCE &amp; Lock Barrier
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Interactive test harness for Section 7: Mandatory Desktop Auth, safeStorage token exchange, 5-minute heartbeat, and Realtime Revoke.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {pkceState.status === 'unlocked' ? (
            <button
              onClick={() => triggerDesktopRevoke('Administrative Revoke triggered from simulator')}
              className="px-3.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Simulate Remote Revoke</span>
            </button>
          ) : (
            <button
              onClick={resetDesktopLock}
              className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-xs font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          )}

          <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/[0.08] text-xs font-mono flex items-center gap-2">
            <span className="text-neutral-400">Heartbeat:</span>
            <span className={`font-bold ${pkceState.status === 'unlocked' ? 'text-[#26c6da]' : 'text-neutral-400'}`}>
              {pkceState.status === 'unlocked' ? formatCountdown(pkceState.heartbeatCountdown) : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Main IDE Simulator Frame */}
      <div className="relative rounded-2xl border border-white/[0.1] bg-[#070b0e] shadow-2xl overflow-hidden min-h-[580px] flex flex-col">
        
        {/* Desktop Top Titlebar */}
        <div className="px-4 py-2.5 bg-[#0b1219] border-b border-white/[0.08] flex items-center justify-between text-xs font-mono select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            </div>
            <span className="text-neutral-400">Aether IDE — /workspace/hyper-auth</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-neutral-500">Device UUID: <code className="text-neutral-300">{pkceState.deviceId.slice(0, 8)}...</code></span>
            <span className="text-neutral-500">Channel: <strong className="text-cyan-400">stable (1.2.4)</strong></span>
            <span className={`flex items-center gap-1 font-semibold ${
              pkceState.status === 'unlocked' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {pkceState.status === 'unlocked' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {pkceState.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Workspace Canvas (Blurred when locked!) */}
        <div className="relative flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* File Explorer (Col 3) */}
          <div className={`lg:col-span-3 border-r border-white/[0.06] bg-[#080d12] p-4 text-xs font-mono text-neutral-400 flex flex-col justify-between ${
            pkceState.status !== 'unlocked' ? 'blur-md pointer-events-none select-none' : ''
          }`}>
            <div>
              <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-3">Project Explorer</span>
              <ul className="space-y-1.5">
                <li className="text-white flex items-center gap-2">📂 src</li>
                <li className="pl-4 text-[#26c6da] flex items-center gap-2">📄 auth_pkce.rs</li>
                <li className="pl-4 text-neutral-300 flex items-center gap-2">📄 gateway_router.ts</li>
                <li className="pl-4 text-neutral-300 flex items-center gap-2">📄 local_stream.rs</li>
                <li className="text-neutral-300 flex items-center gap-2">📂 .aether</li>
                <li className="pl-4 text-neutral-400">📄 mcp.json</li>
                <li className="pl-4 text-neutral-400">📄 rules.md</li>
                <li className="text-neutral-400">📄 Cargo.toml</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/[0.06] text-[11px]">
              <span className="text-neutral-400 block mb-1">Local Gateway:</span>
              <span className="text-emerald-400">Ollama Unix Socket (/var/run/ollama.sock)</span>
            </div>
          </div>

          {/* Editor & Terminal Area (Col 9) */}
          <div className={`lg:col-span-9 flex flex-col justify-between bg-[#070b0e] ${
            pkceState.status !== 'unlocked' ? 'blur-md pointer-events-none select-none' : ''
          }`}>
            {/* Editor Code Area */}
            <div className="p-6 font-mono text-xs text-neutral-300 overflow-y-auto max-h-[300px] leading-relaxed">
              <div className="text-neutral-400 mb-3">// Autonomous code editing enabled. Tokens verified via safeStorage.</div>
              <p><span className="text-[#a855f7]">use</span> aether_core::crypto::pkce;</p>
              <p><span className="text-[#a855f7]">use</span> aether_core::security::safe_storage;</p>
              <br />
              <p><span className="text-[#a855f7]">pub struct</span> <span className="text-[#26c6da]">DesktopSessionManager</span> &#123;</p>
              <p className="pl-4 text-neutral-400">device_id: Uuid,</p>
              <p className="pl-4 text-neutral-400">lease_expiry: DateTime&lt;Utc&gt;,</p>
              <p className="pl-4 text-neutral-400">heartbeat_interval_secs: u32,</p>
              <p>&#125;</p>
              <br />
              <p><span className="text-emerald-400">// Status: Green - Realtime heartbeat active every 300 seconds</span></p>
            </div>

            {/* Interactive Terminal Bar */}
            <div className="border-t border-white/[0.08] bg-[#05080b] p-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-neutral-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-[#26c6da]" />
                  <span>Terminal (zsh - interactive shell)</span>
                </div>
                <span>Status: Connected</span>
              </div>

              <div className="space-y-1 mb-3 max-h-32 overflow-y-auto text-neutral-300">
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className={line.startsWith('$') ? 'text-[#26c6da] font-bold' : 'text-neutral-300'}>
                    {line}
                  </div>
                ))}
              </div>

              <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2">
                <span className="text-[#26c6da] font-bold">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type a command (e.g. 'aether status', 'cargo test', 'ollama list')..."
                  className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-neutral-600 font-mono text-xs"
                />
              </form>
            </div>
          </div>

          {/* LOCK BARRIER OVERLAY (Active when status != unlocked) */}
          {pkceState.status !== 'unlocked' && (
            <div className="absolute inset-0 z-40 bg-[#070b0e]/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
              
              <div className="max-w-md w-full p-8 rounded-2xl bg-[#0b141d] border border-white/[0.12] shadow-2xl">
                
                {/* Lock icon with state glow */}
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                  pkceState.status === 'revoked'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-[#26c6da]/20 text-[#26c6da] border border-[#26c6da]/30'
                }`}>
                  {pkceState.status === 'revoked' ? <ShieldAlert className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-display">
                  {pkceState.status === 'revoked' ? 'Session Revoked' : 'Aether IDE Locked'}
                </h3>

                <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                  {pkceState.status === 'revoked' 
                    ? (pkceState.lastRevokeReason || 'This device was signed out remotely from the User Portal or Admin Console.')
                    : 'Authentication required. Aether enforces RFC 7636 PKCE. Tokens are never passed in URLs or deep links.'
                  }
                </p>

                {/* Handshake Step-by-Step Interactive Flow */}
                {pkceState.status === 'locked' || pkceState.status === 'revoked' ? (
                  <button
                    onClick={startPKCEFlow}
                    className="w-full py-3 rounded-xl bg-[#26c6da] hover:bg-[#22b2c4] text-black font-semibold text-xs transition-all shadow-lg shadow-[#26c6da]/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Key className="w-4 h-4" />
                    <span>Initiate PKCE Handshake</span>
                  </button>
                ) : pkceState.status === 'generating_pkce' ? (
                  <div className="p-4 rounded-xl bg-white/[0.04] text-xs font-mono text-[#26c6da] flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating verifier &amp; SHA-256 challenge...</span>
                  </div>
                ) : pkceState.status === 'web_auth_pending' ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-black/60 border border-white/[0.08] text-xs font-mono text-left">
                      <div className="text-neutral-400">code_challenge: <span className="text-[#26c6da]">{pkceState.codeChallenge}</span></div>
                      <div className="text-neutral-400">state: <span className="text-white">{pkceState.stateToken}</span></div>
                    </div>
                    <span className="text-xs text-neutral-300 block">Complete Sign-In via Browser Web Flow:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => completeWebAuth('google')}
                        className="py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs text-white border border-white/[0.1]"
                      >
                        Sign in with Google
                      </button>
                      <button
                        onClick={() => completeWebAuth('github')}
                        className="py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs text-white border border-white/[0.1]"
                      >
                        Sign in with GitHub
                      </button>
                    </div>
                  </div>
                ) : pkceState.status === 'code_ready' ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 text-left">
                      <div>✓ Auth code issued: <strong>{pkceState.authCode}</strong></div>
                      <div className="text-[11px] text-neutral-400 mt-1">Deep link received: aether://auth/callback?code=...&amp;state=...</div>
                    </div>
                    <button
                      onClick={exchangePKCEToken}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs shadow-lg shadow-emerald-500/20"
                    >
                      Exchange PKCE Code for Token &amp; Unlock
                    </button>
                  </div>
                ) : pkceState.status === 'exchanging_token' ? (
                  <div className="p-4 rounded-xl bg-white/[0.04] text-xs font-mono text-[#a855f7] flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying SHA-256 match &amp; storing safeStorage tokens...</span>
                  </div>
                ) : null}

              </div>

            </div>
          )}

        </div>

        {/* Bottom Console: Logs & Specification */}
        <div className="border-t border-white/[0.08] bg-[#05080b] p-4 text-xs font-mono">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/[0.06]">
            <span className="text-neutral-400 flex items-center gap-1.5 font-bold">
              <Laptop className="w-3.5 h-3.5 text-[#26c6da]" />
              Realtime Protocol Logs
            </span>
            <span className="text-[11px] text-neutral-400">Auto-scrolling append-only</span>
          </div>

          <div className="space-y-1 max-h-24 overflow-y-auto text-neutral-400 text-[11px] leading-relaxed">
            {pkceState.logMessages.map((msg, i) => (
              <div key={i} className={
                msg.includes('UNLOCKED') ? 'text-emerald-400' :
                msg.includes('REVOKE') || msg.includes('EMERGENCY') ? 'text-red-400' :
                msg.includes('PKCE') || msg.includes('Heartbeat') ? 'text-[#26c6da]' : 'text-neutral-400'
              }>
                {msg}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
