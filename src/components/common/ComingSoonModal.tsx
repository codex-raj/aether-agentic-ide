import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Bell, 
  Boxes, 
  Terminal, 
  ArrowRight,
  Server,
  Lock,
  Layers,
  Key
} from 'lucide-react';

export interface ComingSoonModalProps {
  isOpen: boolean;
  type: 'product' | 'enterprise';
  onClose: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, type, onClose }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'specs'>(type === 'enterprise' ? 'specs' : 'preview');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubscribed(true);
    }, 600);
  };

  const isProduct = type === 'product';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0c0d12] border border-white/[0.14] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isProduct ? 'bg-cyan-500' : 'bg-purple-600'
        }`} />
        <div className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isProduct ? 'bg-emerald-500' : 'bg-blue-600'
        }`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            isProduct 
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' 
              : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coming Soon · Launching Q2 2026</span>
          </span>
          <span className="text-[11px] text-neutral-400 font-mono">
            {isProduct ? 'AETHER PRODUCT 2.0' : 'AETHER ENTERPRISE SUITE'}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2.5">
          {isProduct ? 'Next-Gen Autonomous Product Suite' : 'Aether Enterprise Private Cloud & Enclave'}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 mb-6 leading-relaxed">
          {isProduct 
            ? 'We are finishing up the ultimate local-first autonomous IDE upgrade. Experience multi-repository AST intelligence, voice-driven pair programming, and instant zero-latency test synthesis.' 
            : 'Engineered for security-critical engineering organizations. Deploy self-hosted model enclaves, enforce air-gapped cryptographic leases, and leverage dedicated custom SLM fine-tuning.'}
        </p>

        {/* Features Preview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {isProduct ? (
            <>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-2 mb-1.5 text-cyan-400">
                  <Boxes className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">Multi-Repo Swarm Studio</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Refactor frontends, microservices, and infrastructure files simultaneously in a single unified atomic commit.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-2 mb-1.5 text-emerald-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">Zero-Cost Offline Enclave</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Run quantized DeepSeek Coder V2 & Llama 3 locally on your Apple Silicon / RTX GPU with 0ms cloud latency.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-2 mb-1.5 text-amber-400">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">Live Multiplayer Agent Canvas</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Collaborate in real-time with teammates and autonomous AI co-pilots in shared workspace sandboxes.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 transition-all">
                <div className="flex items-center gap-2 mb-1.5 text-purple-400">
                  <Terminal className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">Autonomous Test Healing</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Detects failing CI/CD tests, inspects stack traces, and produces verified patch proposals automatically.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 transition-all">
                <div className="flex items-center gap-2 mb-1.5 text-purple-400">
                  <Server className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">Air-Gapped VPC Gateway</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Route 100% of LLM traffic through your private AWS/GCP VPC proxy with zero public internet egress.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-400 transition-all">
                <div className="flex items-center gap-2 mb-1.5 text-blue-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">SOC-2 & Zero-Retention DPA</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Guaranteed zero training on customer IP, enterprise cryptographic keys, and signed audit certifications.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-cyan-400 transition-all">
                <div className="flex items-center gap-2 mb-1.5 text-cyan-400">
                  <Key className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">SAML 2.0 / SCIM Provisioning</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Sync with Okta, Microsoft Entra ID, Google Workspace, and enforce device biometric attestation.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-400 transition-all">
                <div className="flex items-center gap-2 mb-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">Custom Fine-Tuned SLMs</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Host internal models fine-tuned on your organization's proprietary APIs, design system, and coding standards.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Email Notification & Pilot Sign-up */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141620] border border-white/[0.08]">
          {subscribed ? (
            <div className="flex items-center gap-3 text-emerald-400 py-1">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  You're on the early access priority list!
                </p>
                <p className="text-[11px] text-neutral-400">
                  We'll invite your email ({email}) to the private beta wave as soon as slots open.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isProduct ? 'Notify Me When Product 2.0 Drops' : 'Request Early Enterprise Pilot Access'}</span>
                </span>
                <span className="text-[10px] text-neutral-400">
                  {isProduct ? 'Beta release in 4 weeks' : 'Priority onboarding queue'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work or developer email..."
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/[0.12] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 whitespace-nowrap ${
                    isProduct
                      ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-400/20'
                      : 'bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/20'
                  }`}
                >
                  {submitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>{isProduct ? 'Get Early Access' : 'Request Pilot'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
