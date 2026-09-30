import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Cpu,
  Layers
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Security Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-300 mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-[#26c6da]" />
          <span>Security &amp; Trust Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-display tracking-tight mb-4">
          Privacy-First Autonomous Engineering
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
          How Aether protects your proprietary intellectual property. We believe your codebase should never be held hostage in a third-party cloud.
        </p>
      </div>

      {/* 1. Data Handling Matrix: Local vs Uploaded */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-white font-display mb-2">Data Processing &amp; Retention Matrix</h2>
        <p className="text-xs text-neutral-400 mb-6">
          Transparent breakdown of data categories handled by Aether Desktop IDE and cloud services:
        </p>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0b1219] overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase tracking-wider text-neutral-400 bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Data Category</th>
                <th className="px-6 py-3.5 font-semibold">Leaves Your Workstation?</th>
                <th className="px-6 py-3.5 font-semibold">Storage Location</th>
                <th className="px-6 py-3.5 font-semibold">Retention Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-neutral-300">
              <tr className="hover:bg-white/[0.01]">
                <td className="px-6 py-4 font-semibold text-white">Source Code &amp; Repositories</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <XCircle className="w-4 h-4 shrink-0" />
                    NEVER Leaves Machine
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-400">Local disk only</td>
                <td className="px-6 py-4 font-mono text-neutral-400">N/A (Zero Cloud Retention)</td>
              </tr>
              <tr className="hover:bg-white/[0.01]">
                <td className="px-6 py-4 font-semibold text-white">Local LLM Inferences (Ollama)</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <XCircle className="w-4 h-4 shrink-0" />
                    NEVER Leaves Machine
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-400">Local Unix socket / loopback</td>
                <td className="px-6 py-4 font-mono text-neutral-400">N/A ($0 cost, 0 tokens logged)</td>
              </tr>
              <tr className="hover:bg-white/[0.01]">
                <td className="px-6 py-4 font-semibold text-white">User API Keys &amp; Passwords</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <XCircle className="w-4 h-4 shrink-0" />
                    NEVER Leaves Machine
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-400">Electron safeStorage (DPAPI / Keychain)</td>
                <td className="px-6 py-4 font-mono text-neutral-400">N/A (OS Keychain encrypted)</td>
              </tr>
              <tr className="hover:bg-white/[0.01]">
                <td className="px-6 py-4 font-semibold text-white">Heartbeat &amp; License Pulse</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-[#26c6da] font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Required Minimal Pulse
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-400">user_devices table (UUID only)</td>
                <td className="px-6 py-4 font-mono text-neutral-400">Salted IP hash purged in 30 days</td>
              </tr>
              <tr className="hover:bg-white/[0.01]">
                <td className="px-6 py-4 font-semibold text-white">Cloud AI Token Counters</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-[#26c6da] font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Numerical Aggregates
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-400">daily_usage (Tokens, requests)</td>
                <td className="px-6 py-4 font-mono text-neutral-400">24 months (Zero prompt text)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Cryptographic PKCE Handshake Architecture */}
      <div className="p-8 rounded-2xl bg-[#0b1219] border border-white/[0.08] mb-16 space-y-6">
        <div>
          <span className="text-xs font-mono text-[#26c6da] uppercase block mb-1">RFC 7636 Standard</span>
          <h2 className="text-xl font-bold text-white font-display">
            Desktop Authentication via PKCE Code Exchange
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            In Aether v2.0, tokens are never exposed in browser address bars or custom deep link URLs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-black/50 border border-white/[0.06]">
            <span className="text-[#26c6da] font-bold block mb-1">Step 1: Ephemeral Key</span>
            <p className="text-neutral-400 font-sans">
              Desktop generates <code>code_verifier</code> in memory and computes <code>SHA-256(verifier)</code>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/50 border border-white/[0.06]">
            <span className="text-[#26c6da] font-bold block mb-1">Step 2: Web Authentication</span>
            <p className="text-neutral-400 font-sans">
              Browser verifies user identity and issues a 60-second single-use <code>auth_code</code>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/50 border border-white/[0.06]">
            <span className="text-[#26c6da] font-bold block mb-1">Step 3: Direct API Exchange</span>
            <p className="text-neutral-400 font-sans">
              Desktop calls POST /desktop/token with code and verifier over strict TLS.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/50 border border-white/[0.06]">
            <span className="text-[#26c6da] font-bold block mb-1">Step 4: Rotating Tokens</span>
            <p className="text-neutral-400 font-sans">
              Short-lived (10m) tokens stored in OS keychain. Refresh reuse detection auto-revokes families.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Sub-Processors & Security.txt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-[#0b1219] border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white font-display mb-4">Authorized Sub-Processors</h3>
          <ul className="space-y-3 text-xs text-neutral-300">
            <li className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <div>
                <strong className="text-white">Supabase (PostgreSQL &amp; Auth)</strong>
                <span className="block text-[11px] text-neutral-500">Identity, RLS policies, daily aggregate usage</span>
              </div>
              <span className="text-neutral-500 font-mono">AWS US-East</span>
            </li>
            <li className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <div>
                <strong className="text-white">Cloudflare</strong>
                <span className="block text-[11px] text-neutral-500">WAF, DDoS mitigation, binary artifact CDN</span>
              </div>
              <span className="text-neutral-500 font-mono">Global Edge</span>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <strong className="text-white">Vercel</strong>
                <span className="block text-[11px] text-neutral-500">Edge functions &amp; public portal hosting</span>
              </div>
              <span className="text-neutral-500 font-mono">Global Edge</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[#0b1219] border border-white/[0.08] font-mono text-xs">
          <div className="flex items-center justify-between mb-3 text-neutral-400">
            <span className="font-sans font-bold text-white">/.well-known/security.txt</span>
            <span className="text-[11px] text-[#26c6da]">RFC 9116</span>
          </div>
          <pre className="p-4 rounded-xl bg-black/60 border border-white/[0.06] text-neutral-300 leading-relaxed overflow-x-auto text-[11px]">
Contact: mailto:security@aether.build
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: en
Canonical: https://aether.build/.well-known/security.txt
Policy: https://aether.build/security/policy
Hiring: https://aether.build/careers
          </pre>
        </div>
      </div>

    </div>
  );
};
