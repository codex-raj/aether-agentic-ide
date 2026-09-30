import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  LogIn, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw,
  Check
} from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  signInAsDeveloper 
} from '../../firebase/config';

export const AuthView: React.FC = () => {
  const { setCurrentUser, setCurrentPage, addAuditLog } = usePlatform();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        const role = fbUser.email?.toLowerCase() === 'rajsinha7462@gmail.com' ? 'admin' : 'user';
        const userObj = {
          id: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Developer',
          avatarUrl: fbUser.photoURL || '',
          role: role as any,
          status: 'active' as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          planId: 'pro' as any,
        };
        setCurrentUser(userObj);
        addAuditLog('User Signed In via Google', 'auth_session', fbUser.uid, { email: fbUser.email });
        // Redirect immediately to User Dashboard with all features on new page
        setCurrentPage('dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (authMode === 'signup') {
        const user = await signUpWithEmail(email, password, displayName);
        if (user) {
          const role = email.toLowerCase() === 'rajsinha7462@gmail.com' ? 'admin' : 'user';
          setCurrentUser({
            id: user.uid,
            email: user.email || email,
            displayName: displayName.trim() || email.split('@')[0] || 'Developer',
            avatarUrl: '',
            role: role as any,
            status: 'active' as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            planId: 'pro' as any,
          });
          addAuditLog('New User Account Registered', 'user_account', user.uid, { email });
          setCurrentPage('dashboard');
        }
      } else {
        const user = await signInWithEmail(email, password);
        if (user) {
          const role = email.toLowerCase() === 'rajsinha7462@gmail.com' ? 'admin' : 'user';
          setCurrentUser({
            id: user.uid,
            email: user.email || email,
            displayName: user.displayName || email.split('@')[0] || 'Developer',
            avatarUrl: user.photoURL || '',
            role: role as any,
            status: 'active' as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            planId: 'pro' as any,
          });
          addAuditLog('User Signed In with Email', 'auth_session', user.uid, { email });
          setCurrentPage('dashboard');
        }
      }
    } catch (err: any) {
      // If Firebase email auth throws (e.g. user-not-found or email-already-in-use), provide helpful message or developer sign-in option
      setErrorMsg(err?.message || 'Authentication failed. Please check credentials or use Instant Developer Sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDeveloperAuth = async () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter your real email address above to proceed.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const targetEmail = email.trim();
    const targetName = displayName.trim() || targetEmail.split('@')[0] || 'Developer';

    try {
      const res = await signInAsDeveloper(targetEmail, targetName);
      const role = targetEmail.toLowerCase() === 'rajsinha7462@gmail.com' ? 'admin' : 'user';
      setCurrentUser({
        id: res.uid,
        email: res.email,
        displayName: res.displayName,
        avatarUrl: '',
        role: role as any,
        status: 'active' as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        planId: 'pro' as any,
      });
      addAuditLog('Authenticated Developer Session', 'auth_session', res.uid, { email: res.email });
      setCurrentPage('dashboard');
    } catch (err: any) {
      setErrorMsg('Failed to initialize developer session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-black text-[#ededed] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md rounded-3xl bg-[#0b0f14] border border-white/[0.1] shadow-2xl p-6 sm:p-8 relative">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-black font-extrabold text-xl mb-4 shadow-md">
            ▲
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            {authMode === 'signup' ? 'Create Aether Account' : 'Welcome to Aether'}
          </h1>
          <p className="text-xs text-neutral-400 mt-2">
            Realtime cloud &amp; local multi-model gateway with autonomous Studio Mode.
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Google One-Click Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 mb-6"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.93 6.72-4.93z"/>
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
            <span className="bg-[#0b0f14] px-3 text-neutral-500">Or with email</span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="text-xs text-neutral-300 block mb-1 font-medium">Your Name / Handle</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/[0.1] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-neutral-300 block mb-1 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/[0.1] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-300 block mb-1 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/[0.1] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{authMode === 'signup' ? 'Create Account & Open Dashboard' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Instant Sandbox / Developer Sign-in (Great for fast verification with custom email) */}
        <div className="pt-4 mt-6 border-t border-white/[0.08] text-center">
          <button
            type="button"
            onClick={handleQuickDeveloperAuth}
            disabled={loading}
            className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.08] text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Sandbox Sign-In ({email.trim() || 'Custom Developer'})</span>
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs text-neutral-400">
          {authMode === 'signup' ? (
            <span>
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => setAuthMode('signin')}
                className="text-white hover:underline font-semibold cursor-pointer"
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-white hover:underline font-semibold cursor-pointer"
              >
                Create one now
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
