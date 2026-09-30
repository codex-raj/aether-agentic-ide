import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  Server, 
  Layers, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface CliCommand {
  command: string;
  description: string;
  args: { flag: string; desc: string }[];
  example: string;
}

const CLI_COMMANDS: CliCommand[] = [
  {
    command: 'aether login',
    description: 'Initiates RFC 7636 PKCE browser handshake and saves rotating JWT token to OS keychain.',
    args: [
      { flag: '--no-browser', desc: 'Outputs manual one-time pairing key URL for headless SSH servers' },
      { flag: '--keyring=gnome|pass|fallback', desc: 'Selects keychain attestation provider' }
    ],
    example: 'aether login --keyring=fallback'
  },
  {
    command: 'aether doctor',
    description: 'Diagnoses local Ollama daemon, GPU VRAM allocation, and AST parser health.',
    args: [
      { flag: '--verbose', desc: 'Dumps active network latency and active local models' },
      { flag: '--json', desc: 'Emits machine-readable diagnostic schema' }
    ],
    example: 'aether doctor --verbose'
  },
  {
    command: 'aether agent',
    description: 'Executes autonomous multi-file refactoring tasks from your CLI or CI pipeline.',
    args: [
      { flag: '--task="<prompt>"', desc: 'Natural language specification of changes needed' },
      { flag: '--model=ollama/<id>', desc: 'Specify model backend (local or cloud)' },
      { flag: '--dry-run', desc: 'Outputs unified diffs without modifying files on disk' }
    ],
    example: 'aether agent --task="Convert all callbacks to async/await" --dry-run'
  },
  {
    command: 'aether mcp list',
    description: 'Lists all connected Model Context Protocol tool servers and their exposed schema tools.',
    args: [
      { flag: '--check', desc: 'Pings each MCP transport to verify stdio/SSE responsiveness' }
    ],
    example: 'aether mcp list --check'
  }
];

export const ApiReference: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleConfig = `{
  "$schema": "https://aether.build/schemas/aether-v2.json",
  "project": {
    "name": "my-distributed-backend",
    "language": "typescript",
    "testRunner": "vitest"
  },
  "models": {
    "defaultProvider": "ollama",
    "fallbackProvider": "cloud-gateway",
    "ollama": {
      "host": "http://localhost:11434",
      "model": "deepseek-coder-v2:16b",
      "contextWindow": 131072,
      "numGpuLayers": 33
    },
    "cloudGateway": {
      "priorityLane": true,
      "preferredModel": "claude-3-5-sonnet"
    }
  },
  "agent": {
    "autoRepairTests": true,
    "maxFileEditsPerAtomicCommit": 15,
    "forbiddenPaths": ["**/node_modules/**", "**/.env*"]
  }
}`;

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1620] via-[#090b10] to-[#14101e] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 uppercase">
              CLI &amp; Protocol Reference
            </span>
            <span className="text-[11px] text-neutral-400">Spec Version 2.0</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Aether CLI &amp; MCP Architecture Spec
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl leading-relaxed">
            Reference for terminal orchestration, `.aether/config.json` schema declarations, and Model Context Protocol (MCP) tool integration.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] font-mono text-xs text-cyan-300 shrink-0 flex items-center gap-3">
          <span>npm install -g aether-cli</span>
          <button
            onClick={() => handleCopy('npm install -g aether-cli', 'install')}
            className="p-1 rounded text-neutral-400 hover:text-white"
            title="Copy command"
          >
            {copiedKey === 'install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* CLI Commands Section */}
      <div className="rounded-3xl bg-[#090b10] border border-white/[0.08] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white font-display">
            Core CLI Commands
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {CLI_COMMANDS.map((cmd) => (
            <div 
              key={cmd.command}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-emerald-400">
                  {cmd.command}
                </span>
                <button
                  onClick={() => handleCopy(cmd.example, cmd.command)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-neutral-300 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  {copiedKey === cmd.command ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied!
                    </span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{cmd.example}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {cmd.description}
              </p>

              <div className="space-y-1 pt-1">
                {cmd.args.map((arg, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className="font-mono text-cyan-300 shrink-0">{arg.flag}</span>
                    <span className="text-neutral-400">— {arg.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Config File Schema */}
      <div className="rounded-3xl bg-[#090b10] border border-white/[0.08] p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-base font-bold text-white font-display">
              Configuration Schema (.aether/config.json)
            </h3>
          </div>
          <button
            onClick={() => handleCopy(sampleConfig, 'json-config')}
            className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-neutral-300 flex items-center gap-1.5 cursor-pointer"
          >
            {copiedKey === 'json-config' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Copied
              </span>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Schema</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-neutral-400">
          Place this configuration file in your project root to declare localized model rules, context limits, and test runner targets.
        </p>

        <div className="rounded-2xl bg-[#050608] border border-white/[0.08] p-4 font-mono text-xs text-cyan-300 overflow-x-auto">
          <pre>{sampleConfig}</pre>
        </div>
      </div>

    </div>
  );
};
