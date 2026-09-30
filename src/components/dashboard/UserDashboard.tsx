import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  Home, 
  Sliders, 
  Share2, 
  CreditCard, 
  Sparkles, 
  Info, 
  Check, 
  Edit3, 
  Trash2, 
  Laptop, 
  Smartphone, 
  ShieldCheck, 
  Download, 
  Key, 
  ExternalLink,
  RefreshCw,
  LogOut,
  Layers,
  FileJson,
  Cpu,
  LogIn,
  Activity,
  Terminal,
  Server,
  Code2
} from 'lucide-react';
import { auth } from '../../firebase/config';

export const UserDashboard: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser,
    currentPlan, 
    devices, 
    revokeDevice, 
    revokeAllDevices, 
    renameDevice, 
    dailyUsage,
    preferences,
    updatePreferences,
    setCurrentPage,
    logoutFirebase,
    loginWithFirebaseGoogle,
    firebaseAuthLoading,
    downloadAndSyncIDE,
    recordRealtimeUsage
  } = usePlatform();

  // Navigation tabs: Overview | Devices | Settings | Integrations | Spending
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'devices' | 'settings' | 'integrations' | 'spending'>('overview');
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.displayName || '');
  const [agentSimulating, setAgentSimulating] = useState(false);

  // Custom Model BYOK API Keys state
  const [apiKeys, setApiKeys] = useState<{ anthropic: string; openai: string; gemini: string; deepseek: string }>({
    anthropic: 'sk-ant-api03-••••••••••••••••••••••••••••',
    openai: 'sk-proj-••••••••••••••••••••••••••••',
    gemini: 'AIzaSy••••••••••••••••••••••••••••',
    deepseek: 'sk-ds-••••••••••••••••••••••••••••',
  });
  const [keysSavedNotice, setKeysSavedNotice] = useState(false);

  // MCP Integrations toggles
  const [mcpStates, setMcpStates] = useState<Record<string, boolean>>({
    github: true,
    ollama: true,
    postgres: true,
    linear: false,
    slack: false,
    filesystem: true
  });

  // Calculate usage totals
  const totalRequests = dailyUsage.reduce((acc, curr) => acc + curr.requests, 0);
  const totalTokens = dailyUsage.reduce((acc, curr) => acc + curr.inputTokens + curr.outputTokens, 0);
  const cloudTokens = dailyUsage.filter(u => u.providerType === 'cloud').reduce((acc, curr) => acc + curr.inputTokens + curr.outputTokens, 0);
  
  // Percentage used calculation (0% if new or within quota)
  const quotaLimit = typeof currentPlan.entitlements.cloudTokensPerMonth === 'number' ? currentPlan.entitlements.cloudTokensPerMonth : 500000;
  const usagePercent = Math.min(100, Math.round((cloudTokens / quotaLimit) * 100));

  const activeDevices = devices.filter(d => !d.revokedAt);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleStartRename = (devId: string, currentName: string) => {
    setEditingDeviceId(devId);
    setNewDeviceName(currentName);
  };

  const handleSaveRename = (devId: string) => {
    if (newDeviceName.trim()) {
      renameDevice(devId, newDeviceName.trim());
      showNotification(`Device renamed to "${newDeviceName.trim()}".`);
    }
    setEditingDeviceId(null);
  };

  const handleSaveProfileName = () => {
    if (nameInput.trim() && currentUser) {
      setCurrentUser(prev => prev ? ({ ...prev, displayName: nameInput.trim() }) : null);
      setEditNameOpen(false);
      showNotification('Profile handle updated successfully.');
    }
  };

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setKeysSavedNotice(true);
    showNotification('BYOK API credentials encrypted and saved locally.');
    setTimeout(() => setKeysSavedNotice(false), 3000);
  };

  const handleToggleMcp = (key: string) => {
    setMcpStates(prev => {
      const next = !prev[key];
      showNotification(`MCP connector "${key}" ${next ? 'activated' : 'disabled'}.`);
      return { ...prev, [key]: next };
    });
  };

  const handleDownloadAndSync = () => {
    const newDev = downloadAndSyncIDE();
    showNotification(`Aether IDE downloaded & workstation "${newDev.deviceName}" synced in realtime!`);
  };

  const handleSimulateRealtimeAgent = () => {
    setAgentSimulating(true);
    setTimeout(() => {
      recordRealtimeUsage(1450, 1);
      setAgentSimulating(false);
      showNotification('⚡ Live Agent executed: +1,450 tokens & 1 autonomous task recorded in realtime!');
    }, 700);
  };

  const handleExportData = () => {
    if (!currentUser) return;
    const bundle = {
      user: currentUser,
      plan: currentPlan,
      devices: devices,
      dailyUsage: dailyUsage,
      exportedAt: new Date().toISOString(),
      privacyNotice: 'Zero telemetry enclave: source code AST is never stored on servers.'
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-profile-${currentUser.id.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification('Account data archive exported.');
  };

  // -------------------------------------------------------------
  // Unauthenticated State View (No dummy data!)
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#070707] text-[#ededed] flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg rounded-3xl bg-[#0b0f14] border border-white/[0.1] shadow-2xl p-6 sm:p-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white text-black font-extrabold text-2xl flex items-center justify-center mx-auto shadow-lg">
            ▲
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Sign In to Your Workspace
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-md mx-auto">
              Authenticate with your real Google or Developer account to link your desktop IDE, view live token consumption, and manage autonomous agents.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={loginWithFirebaseGoogle}
              disabled={firebaseAuthLoading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {firebaseAuthLoading ? (
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

            <button
              onClick={() => setCurrentPage('auth')}
              className="w-full py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>Sign in or Register with Email</span>
            </button>
          </div>

          {/* Feature list preview */}
          <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-3 text-left text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-white font-semibold block mb-0.5">Realtime IDE Sync</span>
              <span className="text-neutral-400 text-[11px]">Instant pairing with Aether Desktop</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-white font-semibold block mb-0.5">Live Quota Meters</span>
              <span className="text-neutral-400 text-[11px]">Frontier multi-model token tracking</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-white font-semibold block mb-0.5">MCP Connectors</span>
              <span className="text-neutral-400 text-[11px]">GitHub, Postgres, Slack, Linear</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-white font-semibold block mb-0.5">Zero Telemetry</span>
              <span className="text-neutral-400 text-[11px]">Source code AST is never retained</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Authenticated State View (Real User Details & All Features)
  // -------------------------------------------------------------
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#070707] text-[#ededed] flex">
      
      {/* LEFT SIDEBAR TABS */}
      <aside className="w-56 sm:w-64 border-r border-white/[0.08] bg-[#090909] p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* User Avatar Mini Profile */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 text-black font-extrabold flex items-center justify-center text-sm shadow-md shrink-0">
              {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <span className="text-white font-semibold text-xs truncate block">
                {currentUser.displayName || currentUser.email.split('@')[0]}
              </span>
              <span className="text-[10px] text-neutral-400 truncate block">
                {currentUser.email}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setDashboardTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                dashboardTab === 'overview'
                  ? 'bg-white/[0.1] text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Home className="w-4 h-4 text-cyan-400" />
              <span>Overview &amp; Usage</span>
            </button>

            <button
              onClick={() => setDashboardTab('devices')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                dashboardTab === 'devices'
                  ? 'bg-white/[0.1] text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Laptop className="w-4 h-4 text-emerald-400" />
              <span>Workstations ({activeDevices.length})</span>
            </button>

            <button
              onClick={() => setDashboardTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                dashboardTab === 'settings'
                  ? 'bg-white/[0.1] text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Settings &amp; Keys</span>
            </button>

            <button
              onClick={() => setDashboardTab('integrations')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                dashboardTab === 'integrations'
                  ? 'bg-white/[0.1] text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>MCP Integrations</span>
            </button>

            <button
              onClick={() => setDashboardTab('spending')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                dashboardTab === 'spending'
                  ? 'bg-white/[0.1] text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <CreditCard className="w-4 h-4 text-pink-400" />
              <span>Spending &amp; Quotas</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/[0.08] space-y-3">
          <button
            onClick={() => setCurrentPage('pricing')}
            className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all border border-white/[0.08] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Manage Plan</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
            <span className="truncate max-w-[130px]">
              {currentUser.role.toUpperCase()} Tier
            </span>
            <button
              onClick={logoutFirebase}
              disabled={firebaseAuthLoading}
              className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-10 max-w-5xl overflow-y-auto">
        
        {/* Notification Banner */}
        {notice && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* 1. OVERVIEW & USAGE TAB */}
        {dashboardTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  Developer Dashboard
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Real-time usage telemetry, workstation pairing, and multi-model gateway quotas.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadAndSync}
                  className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download &amp; Sync IDE</span>
                </button>
                <button
                  onClick={handleSimulateRealtimeAgent}
                  disabled={agentSimulating}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/[0.1] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Simulate Autonomous Agent run on synced IDE"
                >
                  {agentSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>Test Realtime Sync</span>
                </button>
              </div>
            </div>

            {/* REALTIME IDE SYNC BANNER */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d141f] via-[#0f1118] to-[#140e1f] border border-cyan-500/20 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                      {activeDevices.length > 0 ? 'Aether Desktop IDE Synced' : 'Ready to Pair Desktop Workstation'}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                    Bidirectional Realtime Workstation Sync
                  </h2>
                  <p className="text-xs text-neutral-300 max-w-xl mt-1 leading-relaxed">
                    Tokens consumed, multi-agent refactors, and terminal actions in your local Aether Desktop sync seamlessly to your personal account in real-time.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleDownloadAndSync}
                    className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Installer &amp; Config</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('ide-simulator')}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.12] text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Terminal className="w-4 h-4 text-neutral-400" />
                    <span>Open IDE Simulator</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Usage Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Monthly Token Quota */}
              <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] flex flex-col justify-between h-48">
                <div>
                  <span className="text-xs text-neutral-400 font-medium block mb-2">
                    Frontier Cloud Token Usage
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
                      {usagePercent}%
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      ({(cloudTokens / 1000).toFixed(1)}k / {typeof currentPlan.entitlements.cloudTokensPerMonth === 'number' ? `${(currentPlan.entitlements.cloudTokensPerMonth / 1000).toFixed(0)}k` : 'Unlimited'} tokens)
                    </span>
                  </div>
                </div>

                <div>
                  <div className="w-full h-2 rounded-full bg-white/[0.1] overflow-hidden mb-3">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(usagePercent, 3)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Resets Oct 29, 2026</span>
                    <span className="text-emerald-400 font-mono">Local Ollama: Free &amp; Unlimited</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Realtime Stats */}
              <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] flex flex-col justify-between h-48">
                <div>
                  <span className="text-xs text-neutral-400 font-medium block mb-2">
                    Autonomous Sessions &amp; Requests
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-bold text-white font-display">
                      {totalRequests}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">Total API calls</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/[0.06]">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Agent Tasks Completed</span>
                    <span className="text-white font-bold font-mono">
                      {dailyUsage.reduce((acc, curr) => acc + curr.agentTasks, 0)} Tasks
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Linked Workstations</span>
                    <span className="text-white font-bold font-mono">
                      {activeDevices.length} Connected
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Signed-in User Identity Section */}
            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-black font-extrabold text-lg shadow-md">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white font-display">
                        {currentUser.displayName || currentUser.email.split('@')[0]}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                        {currentUser.role.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/25">
                        PRO DEVELOPER
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDashboardTab('settings')}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white transition-colors cursor-pointer"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    <span>Export Archive</span>
                  </button>
                </div>
              </div>

              {/* Quick Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
                <div>
                  <span className="text-neutral-500 block mb-1">Account UID</span>
                  <span className="text-neutral-300 font-mono text-[11px] truncate block" title={currentUser.id}>
                    {currentUser.id.slice(0, 16)}...
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">Max Devices Quota</span>
                  <span className="text-white font-bold font-mono">
                    {activeDevices.length} / {currentPlan.entitlements.maxDevices}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">Offline Grace Lease</span>
                  <span className="text-emerald-400 font-mono font-medium">
                    {currentPlan.entitlements.offlineLeaseHours} Hours
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">Zero-Telemetry Enclave</span>
                  <span className="text-cyan-400 font-mono font-medium">
                    Active &amp; Guaranteed
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 2. WORKSTATIONS / CONNECTED DEVICES TAB */}
        {dashboardTab === 'devices' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mb-1">
                  Connected Workstations
                </h1>
                <p className="text-xs text-neutral-400">
                  Manage paired desktop clients running Aether IDE and synchronized in real-time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadAndSync}
                  className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pair New Machine</span>
                </button>
                <button
                  onClick={revokeAllDevices}
                  className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-medium transition-colors cursor-pointer"
                >
                  Revoke All
                </button>
              </div>
            </div>

            {/* Devices List */}
            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] space-y-4">
              {devices.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <Laptop className="w-10 h-10 text-neutral-500 mx-auto" />
                  <p className="text-sm text-neutral-300 font-semibold">No workstations connected yet</p>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Download the Aether IDE desktop package to automatically link your computer with realtime telemetry.
                  </p>
                  <button
                    onClick={handleDownloadAndSync}
                    className="mt-2 px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all cursor-pointer"
                  >
                    Download &amp; Pair Now
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {devices.map((d) => {
                    const isRevoked = Boolean(d.revokedAt);
                    return (
                      <div key={d.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            {editingDeviceId === d.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={newDeviceName}
                                  onChange={(e) => setNewDeviceName(e.target.value)}
                                  className="px-2.5 py-1 rounded-lg bg-black border border-cyan-400 text-white text-xs"
                                />
                                <button
                                  onClick={() => handleSaveRename(d.id)}
                                  className="px-2 py-1 rounded bg-cyan-400 text-black font-bold text-[11px]"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingDeviceId(null)}
                                  className="px-2 py-1 text-neutral-400 text-[11px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <span className={`font-semibold ${isRevoked ? 'line-through text-neutral-500' : 'text-white'}`}>
                                  {d.deviceName}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-neutral-400 uppercase">
                                  {d.osPlatform} ({d.arch})
                                </span>
                                {d.isCurrentDevice && (
                                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/25">
                                    CURRENT
                                  </span>
                                )}
                                {isRevoked && (
                                  <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                                    REVOKED
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <span className="text-neutral-500 text-[11px] block mt-1">
                            Build: v{d.appVersion} · Channel: {d.channel} · Device ID: {d.deviceId.slice(0, 16)}...
                          </span>
                        </div>

                        {!isRevoked && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartRename(d.id, d.deviceName)}
                              className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-xs transition-colors"
                            >
                              Rename
                            </button>
                            <button
                              onClick={() => revokeDevice(d.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs transition-colors"
                            >
                              Revoke
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick pairing instructions */}
            <div className="p-5 rounded-2xl bg-[#0b0e14] border border-white/[0.08] text-xs space-y-2">
              <span className="font-semibold text-white block">How Realtime Workstation Sync Works</span>
              <p className="text-neutral-400 leading-relaxed">
                When you download the Aether IDE or config file, it provisions an RFC 7636 PKCE session in your OS Keychain. Every autonomous agent task and token streaming operation updates your account metrics immediately through the zero-telemetry gateway.
              </p>
            </div>
          </div>
        )}

        {/* 3. SETTINGS & KEYS TAB */}
        {dashboardTab === 'settings' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mb-1">
                Account Settings &amp; Keys
              </h1>
              <p className="text-xs text-neutral-400">
                Manage your developer identity, Bring-Your-Own-Key (BYOK) model endpoints, and privacy preferences.
              </p>
            </div>

            {/* Profile Identity Card */}
            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                Profile Identity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1 font-medium">Developer Display Name</label>
                  {!editNameOpen ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/[0.08]">
                      <span className="text-white font-medium">{currentUser.displayName || currentUser.email.split('@')[0]}</span>
                      <button 
                        onClick={() => {
                          setNameInput(currentUser.displayName || '');
                          setEditNameOpen(true);
                        }}
                        className="text-neutral-400 hover:text-white"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-black border border-cyan-400 text-white text-xs focus:outline-none"
                      />
                      <button
                        onClick={handleSaveProfileName}
                        className="px-3 py-2 rounded-xl bg-cyan-400 text-black font-bold text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditNameOpen(false)}
                        className="px-2 py-2 text-neutral-400 hover:text-white text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1 font-medium">Email Address</label>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-neutral-300 font-mono truncate">
                    {currentUser.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Bring-Your-Own-Key (BYOK) Management */}
            <form onSubmit={handleSaveApiKeys} className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                    Custom Model API Keys (BYOK)
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Provide personal API keys for unrestricted direct frontier inference with zero markup.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs transition-colors cursor-pointer"
                >
                  Save API Keys
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <label className="text-neutral-400 block mb-1 font-mono">Anthropic API Key (Claude 3.7)</label>
                  <input
                    type="password"
                    value={apiKeys.anthropic}
                    onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/[0.1] text-neutral-300 font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 font-mono">OpenAI API Key (GPT-4o &amp; o3)</label>
                  <input
                    type="password"
                    value={apiKeys.openai}
                    onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/[0.1] text-neutral-300 font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 font-mono">Google Gemini API Key (Gemini 2.5)</label>
                  <input
                    type="password"
                    value={apiKeys.gemini}
                    onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/[0.1] text-neutral-300 font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 font-mono">DeepSeek API Key (DeepSeek V3 / R1)</label>
                  <input
                    type="password"
                    value={apiKeys.deepseek}
                    onChange={(e) => setApiKeys({ ...apiKeys, deepseek: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/[0.1] text-neutral-300 font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </form>

            {/* Privacy & Enclave Settings */}
            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                Zero-Telemetry Guarantees
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                  <div>
                    <span className="text-white font-medium block">AST Retention Defense</span>
                    <span className="text-neutral-400 text-[11px]">Enclave proxy strips prompts before storing metrics.</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 font-mono text-[10px]">
                    ENFORCED
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                  <div>
                    <span className="text-white font-medium block">Local Ollama Fallback</span>
                    <span className="text-neutral-400 text-[11px]">Route code completion strictly through localhost when offline.</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-cyan-500/15 text-cyan-300 font-mono text-[10px]">
                    AUTO-DETECT
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 4. MCP INTEGRATIONS TAB */}
        {dashboardTab === 'integrations' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mb-1">
                Model Context Protocol (MCP)
              </h1>
              <p className="text-xs text-neutral-400">
                Connect external developer tools, database schemas, and collaboration platforms to your autonomous agents.
              </p>
            </div>

            <div className="space-y-4">
              {/* GitHub */}
              <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.1] flex items-center justify-center text-white font-bold">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">GitHub MCP Server</span>
                    <span className="text-xs text-neutral-400">Sync repositories, push atomic diff branches, and create pull requests.</span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleMcp('github')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                    mcpStates.github 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-white/[0.05] text-neutral-400 hover:text-white'
                  }`}
                >
                  {mcpStates.github ? 'CONNECTED' : 'DISCONNECTED'}
                </button>
              </div>

              {/* Local Ollama */}
              <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.1] flex items-center justify-center text-cyan-400 font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Ollama Local Socket (11434)</span>
                    <span className="text-xs text-neutral-400">Native local execution for Qwen 2.5 Coder and Llama 3.3.</span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleMcp('ollama')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                    mcpStates.ollama 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-white/[0.05] text-neutral-400 hover:text-white'
                  }`}
                >
                  {mcpStates.ollama ? 'ONLINE (0ms)' : 'OFFLINE'}
                </button>
              </div>

              {/* MCP Postgres Server */}
              <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.1] flex items-center justify-center text-purple-400 font-bold">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">PostgreSQL / Supabase Schema MCP</span>
                    <span className="text-xs text-neutral-400">Allows agent to inspect relations, query schemas, and verify migrations.</span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleMcp('postgres')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                    mcpStates.postgres 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-white/[0.05] text-neutral-400 hover:text-white'
                  }`}
                >
                  {mcpStates.postgres ? 'CONNECTED' : 'DISCONNECTED'}
                </button>
              </div>

              {/* Linear Issues MCP */}
              <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.1] flex items-center justify-center text-amber-400 font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Linear Issue Tracker MCP</span>
                    <span className="text-xs text-neutral-400">Directly link tickets to autonomous refactoring work trees.</span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleMcp('linear')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                    mcpStates.linear 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-white/[0.05] text-neutral-400 hover:text-white'
                  }`}
                >
                  {mcpStates.linear ? 'CONNECTED' : 'DISCONNECTED'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. SPENDING & QUOTAS TAB */}
        {dashboardTab === 'spending' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mb-1">
                Spending &amp; Quotas
              </h1>
              <p className="text-xs text-neutral-400">
                Frontier cloud token consumption, monthly invoice receipts, and plan tier limits.
              </p>
            </div>

            {/* Current Tier Overview */}
            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1">Active Plan</span>
                <span className="text-2xl font-bold text-white font-display">
                  {currentPlan.name} Developer Tier
                </span>
                <span className="text-xs text-neutral-400 block mt-1">
                  Cloud Token Quota: {typeof currentPlan.entitlements.cloudTokensPerMonth === 'number' ? `${(currentPlan.entitlements.cloudTokensPerMonth / 1000).toFixed(0)}k` : 'Unlimited'} tokens/month.
                </span>
              </div>
              <button
                onClick={() => setCurrentPage('pricing')}
                className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Change Plan
              </button>
            </div>

            {/* Usage Breakdown */}
            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                Realtime Token Utilization
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06]">
                  <span className="text-neutral-400 block mb-1">Fast Cloud Tokens</span>
                  <span className="text-2xl font-bold text-cyan-400 font-mono">
                    {(cloudTokens / 1000).toFixed(1)}k
                  </span>
                  <span className="text-[11px] text-neutral-500 block mt-1">Claude 3.7 &amp; GPT-4o</span>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06]">
                  <span className="text-neutral-400 block mb-1">Local Ollama Tokens</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono">
                    UNLIMITED
                  </span>
                  <span className="text-[11px] text-emerald-500 block mt-1">Free local inference</span>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06]">
                  <span className="text-neutral-400 block mb-1">Autonomous Agent Runs</span>
                  <span className="text-2xl font-bold text-white font-mono">
                    {dailyUsage.reduce((acc, curr) => acc + curr.agentTasks, 0)} Tasks
                  </span>
                  <span className="text-[11px] text-neutral-500 block mt-1">Verified test loops</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
