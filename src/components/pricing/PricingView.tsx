import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Check, ShieldCheck, ChevronDown, ChevronUp, Sparkles, Globe, Zap, ArrowRight } from 'lucide-react';
import { CurrencyMode } from '../../types/platform';
import { ComingSoonModal } from '../common/ComingSoonModal';

export const PricingView: React.FC = () => {
  const { plans, currentPlan, setCurrentUser, setCurrentPage } = usePlatform();
  const [annualBilling, setAnnualBilling] = useState<boolean>(true);
  const [currency, setCurrency] = useState<CurrencyMode>('INR'); // Default to INR or toggleable to USD
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [enterpriseModalOpen, setEnterpriseModalOpen] = useState(false);
  const [planSuccessToast, setPlanSuccessToast] = useState<string | null>(null);

  const isINR = currency === 'INR';
  const currencySymbol = isINR ? '₹' : '$';

  const faqs = [
    {
      q: 'Are local models (Ollama / LM Studio) really 100% free forever?',
      a: 'Yes, completely free and unlimited forever across every tier, including Free and Starter tiers. Your local LLMs run on your own CPU/GPU hardware. Aether applies zero quota, zero markup, and zero token tracking.',
    },
    {
      q: 'Why is Indian Rupee (INR) pricing localized and low?',
      a: 'We calibrated our pricing for Indian developers, college students, and startups using Purchasing Power Parity (PPP). You get direct INR payments without international transaction fees or currency conversion markups.',
    },
    {
      q: 'How does the Starter tier differ from Free and Pro?',
      a: 'Starter is crafted for individual builders and students who need more cloud AI power than Free (500 fast requests/mo and 50 agent tasks/day with Claude 3.5 Haiku, GPT-4o Mini, and Gemini Flash) at an ultra-low standard price (only ₹249/mo or $4/mo).',
    },
    {
      q: 'How does the mandatory desktop login work?',
      a: 'When you launch Aether IDE, it opens your default browser with an RFC 7636 PKCE challenge. You sign in once on the website. An encrypted, rotating token is securely stored in your OS keychain via Electron safeStorage.',
    },
    {
      q: 'What is the offline lease policy?',
      a: 'Aether gives you a 48-hour offline cryptographic lease window. You can code completely offline on planes, trains, or off-grid locations without an active internet connection.',
    },
    {
      q: 'Does Aether upload my proprietary source code to the cloud?',
      a: 'Never. Your repository, files, and AST indices stay exclusively on your local file system. If you choose to run a patch through a cloud model, only the specific diff context needed for that prompt is dispatched to that provider.',
    },
    {
      q: 'How many devices can I use per license?',
      a: 'Free plan includes 1 active device. Starter includes 2 devices with cloud sync. Pro includes up to 3 concurrent workstations. Team plan offers up to 5 devices per seat with team pooling.',
    },
  ];

  const handleSelectPlan = (planId: any) => {
    if (planId === 'enterprise') {
      setEnterpriseModalOpen(true);
      return;
    }
    setCurrentUser(prev => prev ? ({ ...prev, planId }) : null);
    setPlanSuccessToast(planId);
    setTimeout(() => setPlanSuccessToast(null), 4000);
    if (planId === 'free') {
      setCurrentPage('download');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-black text-[#ededed]">
      
      {/* Toast Notification */}
      {planSuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#10141e] border border-cyan-500/40 text-cyan-200 text-xs font-semibold shadow-2xl flex items-center gap-2.5 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Plan updated to {planSuccessToast.toUpperCase()}! Entitlements synced to your account.</span>
        </div>
      )}

      {/* Pricing Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-300 mb-4">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Global Developer Access · Indian Rupee &amp; US Dollar Supported</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-white font-display tracking-tight mb-4">
          Fair, Accessible Developer Pricing
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 leading-relaxed mb-8">
          Free to start. Standard low pricing tailored for students, freelancers, and professional teams worldwide.
        </p>

        {/* Dual Control Toggles: Currency Toggle & Billing Toggle */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          
          {/* Currency Toggle (USD $ vs INR ₹) */}
          <div className="inline-flex items-center p-1 rounded-full bg-[#111111] border border-white/[0.12] shadow-inner">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currency === 'USD'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>USD ($)</span>
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currency === 'INR'
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>INR (₹)</span>
              <span className="text-[10px] px-1 py-0.2 rounded font-mono font-bold bg-black/20 text-black">India PPP</span>
            </button>
          </div>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-[#111111] border border-white/[0.12]">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                !annualBilling ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                annualBilling ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Yearly</span>
              <span className="text-[10px] text-emerald-600 font-bold">Save 20%</span>
            </button>
          </div>

        </div>

        {/* Currency Highlight Badge */}
        {isINR ? (
          <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-cyan-300/90 font-mono bg-cyan-950/30 border border-cyan-500/20 px-3 py-1 rounded-full">
            <span>🇮🇳 Indian Rupee (INR) Pricing active — standard &amp; affordable for Indian builders</span>
          </div>
        ) : (
          <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono bg-white/[0.03] border border-white/[0.06] px-3 py-1 rounded-full">
            <span>🌐 United States Dollar (USD) International pricing</span>
          </div>
        )}

      </div>

      {/* Plan Cards Grid (5 Tiers: Free, Starter, Pro, Team, Enterprise) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-20">
        {plans.map((plan) => {
          const isCurrent = currentPlan.id === plan.id;
          const isStarter = plan.id === 'starter';
          const isPopular = plan.id === 'pro';

          // Price calculation based on currency and billing cycle
          let price = 0;
          if (isINR) {
            price = annualBilling ? plan.priceAnnualINR : plan.priceMonthlyINR;
          } else {
            price = annualBilling ? plan.priceAnnual : plan.priceMonthly;
          }

          return (
            <div
              key={plan.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative ${
                isPopular
                  ? 'bg-[#12141a] border-cyan-500/50 shadow-2xl ring-1 ring-cyan-500/30'
                  : isStarter
                  ? 'bg-[#0f1218] border-emerald-500/30 shadow-lg'
                  : 'bg-[#0a0a0a] border-white/[0.08] hover:border-white/[0.14]'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-400 text-black font-bold text-[10px] uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              {isStarter && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-black font-bold text-[10px] uppercase tracking-wider shadow-md">
                  Best Value
                </div>
              )}

              <div>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white font-display">{plan.name}</h3>
                    {plan.id === 'free' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-neutral-300">
                        Forever $0
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 min-h-[38px] leading-snug">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="mb-5 pb-4 border-b border-white/[0.06]">
                  {plan.id === 'enterprise' ? (
                    <div>
                      <div className="text-2xl font-bold text-white font-display">Custom</div>
                      <span className="text-[11px] text-purple-400 block mt-0.5">Coming Soon (Q2 2026)</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                          {currencySymbol}{price}
                        </span>
                        <span className="text-xs text-neutral-400">/ mo</span>
                      </div>
                      {annualBilling && price > 0 ? (
                        <span className="text-[10px] text-neutral-500 block mt-0.5">
                          Billed annually ({currencySymbol}{price * 12}/yr)
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-500 block mt-0.5">
                          {price === 0 ? 'No credit card needed' : 'Billed monthly'}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Highlights */}
                <div className="space-y-2 mb-6 text-xs text-neutral-300">
                  {plan.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                        isPopular ? 'text-cyan-400' : isStarter ? 'text-emerald-400' : 'text-white'
                      }`} />
                      <span className="leading-snug text-[11px]">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-white/[0.08] text-white border border-white/[0.15] cursor-default'
                      : isPopular
                      ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-400/20'
                      : isStarter
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-lg shadow-emerald-400/20'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.1]'
                  }`}
                >
                  {isCurrent 
                    ? 'Current Plan' 
                    : plan.id === 'enterprise' 
                    ? 'Preview Enterprise' 
                    : plan.id === 'free' 
                    ? 'Get Started Free' 
                    : 'Upgrade Plan'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Feature Entitlement Comparison Table */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden mb-20">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="text-sm font-bold text-white font-display">
            Plan Feature Comparison ({currency})
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            All plans include unlimited local models
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase tracking-wider text-neutral-400 bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-3 font-semibold">Capability</th>
                <th className="px-6 py-3 font-semibold">Free</th>
                <th className="px-6 py-3 font-semibold text-emerald-400">Starter</th>
                <th className="px-6 py-3 font-semibold text-cyan-400">Pro</th>
                <th className="px-6 py-3 font-semibold">Team</th>
                <th className="px-6 py-3 font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-neutral-300">
              <tr>
                <td className="px-6 py-3 font-medium text-white">Monthly Price ({currency})</td>
                <td className="px-6 py-3 font-mono">{currencySymbol}0</td>
                <td className="px-6 py-3 font-mono text-emerald-400 font-bold">{currencySymbol}{isINR ? '249' : '4'}</td>
                <td className="px-6 py-3 font-mono text-cyan-400 font-bold">{currencySymbol}{isINR ? '699' : '9'}</td>
                <td className="px-6 py-3 font-mono">{currencySymbol}{isINR ? '1,499' : '19'}</td>
                <td className="px-6 py-3 font-mono text-neutral-400">Custom</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-medium text-white">Agent Multi-File Tasks</td>
                <td className="px-6 py-3 font-mono">20 / day</td>
                <td className="px-6 py-3 font-mono text-emerald-400 font-bold">50 / day</td>
                <td className="px-6 py-3 font-mono text-cyan-400 font-bold">Unlimited</td>
                <td className="px-6 py-3 font-mono">Unlimited</td>
                <td className="px-6 py-3 font-mono">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-medium text-white">Local Offline Models (Ollama)</td>
                <td className="px-6 py-3 text-emerald-400 font-bold">✓ Included ($0)</td>
                <td className="px-6 py-3 text-emerald-400 font-bold">✓ Included ($0)</td>
                <td className="px-6 py-3 text-emerald-400 font-bold">✓ Included ($0)</td>
                <td className="px-6 py-3 text-emerald-400 font-bold">✓ Included ($0)</td>
                <td className="px-6 py-3 text-emerald-400 font-bold">✓ Included ($0)</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-medium text-white">Fast Cloud Reasoning</td>
                <td className="px-6 py-3 text-neutral-500">50 req / mo</td>
                <td className="px-6 py-3 text-emerald-400 font-semibold">500 req / mo</td>
                <td className="px-6 py-3 text-cyan-400 font-bold">Unlimited Priority</td>
                <td className="px-6 py-3 text-cyan-400 font-bold">Unlimited Priority</td>
                <td className="px-6 py-3 text-white font-bold">Dedicated VPC</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-medium text-white">Max Workstation Devices</td>
                <td className="px-6 py-3 font-mono">1 device</td>
                <td className="px-6 py-3 font-mono text-emerald-400 font-bold">2 devices</td>
                <td className="px-6 py-3 font-mono text-cyan-400 font-bold">3 devices</td>
                <td className="px-6 py-3 font-mono">5 devices / seat</td>
                <td className="px-6 py-3 font-mono">Custom pool</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-medium text-white">Offline Cryptographic Lease</td>
                <td className="px-6 py-3 font-mono">48 hours</td>
                <td className="px-6 py-3 font-mono">48 hours</td>
                <td className="px-6 py-3 font-mono">48 hours</td>
                <td className="px-6 py-3 font-mono">24 hours</td>
                <td className="px-6 py-3 font-mono">0-4 hours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-3">
        <h3 className="text-2xl font-bold text-white text-center mb-8 font-display">
          Frequently Asked Questions
        </h3>
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div key={idx} className="rounded-2xl border border-white/[0.08] bg-[#0c0c0c] overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-medium text-white hover:bg-white/[0.02] cursor-pointer"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-white/[0.04] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Enterprise Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={enterpriseModalOpen}
        type="enterprise"
        onClose={() => setEnterpriseModalOpen(false)}
      />

    </div>
  );
};
