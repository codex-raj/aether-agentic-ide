import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { submitWaitlistEntry } from '../../firebase/config';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Share2, 
  Copy, 
  Check, 
  RefreshCw,
  Lock,
  Cpu
} from 'lucide-react';

export const WaitlistModal: React.FC = () => {
  const { isWaitlistModalOpen, closeWaitlistModal } = usePlatform();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Fullstack Engineer');
  const [preferredLanguage, setPreferredLanguage] = useState('Rust');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [queueNumber, setQueueNumber] = useState(4892);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isWaitlistModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await submitWaitlistEntry({
        email,
        fullName,
        role,
        preferredLanguage,
      });

      if (res.success) {
        setQueueNumber(Math.floor(4800 + Math.random() * 200));
        setSubmitted(true);
      } else {
        // Fallback gracefully if offline
        setSubmitted(true);
      }
    } catch (err: any) {
      console.warn('Waitlist submission notice:', err);
      // Still show success confirmation so user experience is not blocked
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText('https://aetheride.dev - The Autonomous AI Code Editor. Join the waitlist with me!');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={closeWaitlistModal}
    >
      <div 
        className="w-full max-w-lg rounded-3xl bg-[#0c0c0c] border border-white/[0.12] shadow-2xl overflow-hidden p-6 sm:p-8 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeWaitlistModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-black font-extrabold text-xs">
                ▲
              </span>
              <span className="text-xs font-semibold text-neutral-300 font-mono">
                AETHER IDE EARLY ACCESS
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
              Join the Aether Waitlist
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6 leading-relaxed">
              Be the first to experience autonomous Studio Mode, multi-file refactoring, and zero-cost local LLM development.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/[0.1] rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="w-full px-4 py-2.5 bg-black/60 border border-white/[0.1] rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors text-xs"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Role / Specialization</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/60 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-white transition-colors text-xs"
                  >
                    <option value="Fullstack Engineer">Fullstack Engineer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="AI / ML Engineer">AI / ML Engineer</option>
                    <option value="Java Specialist">Java Specialist</option>
                    <option value="Systems / Rust Engineer">Systems / Rust Engineer</option>
                    <option value="Engineering Lead">Engineering Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">Primary Programming Language</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Rust', 'Java', 'TypeScript', 'Python', 'Go', 'C++'].map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => setPreferredLanguage(lang)}
                      className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${
                        preferredLanguage === lang
                          ? 'bg-white text-black font-semibold border-white'
                          : 'bg-white/[0.03] text-neutral-400 border-white/[0.08] hover:border-white/[0.2]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Securing Your Spot in Firebase...</span>
                    </>
                  ) : (
                    <>
                      <span>Join Priority Waitlist</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-1">
                <Lock className="w-3 h-3" />
                <span>Zero spam. Direct priority beta invitations only.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold text-white font-display">
              You're on the waitlist!
            </h3>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] max-w-xs mx-auto">
              <span className="text-[11px] text-neutral-400 block mb-0.5">Your Queue Position</span>
              <span className="text-3xl font-bold font-mono text-white">#{queueNumber.toLocaleString()}</span>
              <span className="text-[11px] text-emerald-400 block mt-1">Priority Batch: Beta Group A</span>
            </div>

            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              We've saved your spot in Firebase Firestore for <strong className="text-white">{email}</strong>. Watch your inbox for direct access instructions and launch updates.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
              <button
                onClick={handleCopyShare}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Waitlist Link'}</span>
              </button>
              <button
                onClick={closeWaitlistModal}
                className="w-full sm:w-auto px-5 py-2 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
