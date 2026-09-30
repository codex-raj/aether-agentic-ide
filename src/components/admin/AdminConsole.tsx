import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  ShieldCheck, 
  Users, 
  Layers, 
  Flag, 
  BookOpen, 
  ScrollText, 
  Sliders, 
  Search, 
  RotateCcw, 
  Check, 
  AlertTriangle,
  Play,
  Download,
  Plus,
  RefreshCw,
  Eye,
  LogOut,
  Slash
} from 'lucide-react';
import { Release, FeatureFlag } from '../../types/platform';

export const AdminConsole: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    releases, 
    publishRelease, 
    rollbackRelease, 
    updateRolloutPercent,
    flags, 
    toggleFlag, 
    setFlagRollout,
    auditLogs, 
    addAuditLog,
    docs,
    failedSearches,
    dailyUsage,
    devices,
    currentPage,
    setCurrentPage
  } = usePlatform();

  // Derive initial tab from currentPage (e.g. 'admin-releases' -> 'releases')
  const getTabFromCurrentPage = (): 'overview' | 'users' | 'releases' | 'flags' | 'docs' | 'audit' | 'settings' => {
    if (currentPage && currentPage.startsWith('admin-')) {
      const sub = currentPage.replace('admin-', '');
      if (['overview', 'users', 'releases', 'flags', 'docs', 'audit', 'settings'].includes(sub)) {
        return sub as any;
      }
    }
    return 'overview';
  };

  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'releases' | 'flags' | 'docs' | 'audit' | 'settings'>(getTabFromCurrentPage);

  // Sync tab when navigation changes
  useEffect(() => {
    if (currentPage && currentPage.startsWith('admin-')) {
      const sub = currentPage.replace('admin-', '');
      if (['overview', 'users', 'releases', 'flags', 'docs', 'audit', 'settings'].includes(sub)) {
        setAdminTab(sub as any);
      }
    }
  }, [currentPage]);
  
  // User management mock state
  const [userList, setUserList] = useState([
    { id: 'usr_8923fa12', name: 'Raj Sinha', email: 'Rajsinha7462@gmail.com', role: 'admin', status: 'active', version: '1.2.4', os: 'macOS (arm64)', devicesCount: 3, lastActive: '2 min ago' },
    { id: 'usr_4401bb22', name: 'Elena Rostova', email: 'elena@quantum-dev.io', role: 'tester', status: 'active', version: '1.3.0-rc2', os: 'Linux (x64)', devicesCount: 1, lastActive: '18 min ago' },
    { id: 'usr_1092cc77', name: 'David Chen', email: 'dchen@enterprise.com', role: 'user', status: 'active', version: '1.2.4', os: 'Windows 11', devicesCount: 2, lastActive: '1 hour ago' },
    { id: 'usr_7721aa90', name: 'Marcus Vance', email: 'marcus@suspicious.xyz', role: 'user', status: 'suspended', version: '1.1.8', os: 'Windows 10', devicesCount: 1, lastActive: '3 days ago' },
  ]);

  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // New release modal state
  const [newVersion, setNewVersion] = useState('');
  const [newChannel, setNewChannel] = useState<'stable' | 'beta' | 'nightly'>('beta');
  const [newNotes, setNewNotes] = useState('');
  const [newMandatory, setNewMandatory] = useState(false);
  const [newRollout, setNewRollout] = useState(25);
  const [createReleaseOpen, setCreateReleaseOpen] = useState(false);

  // System settings state
  const [heartbeatInterval, setHeartbeatInterval] = useState(300);
  const [offlineLease, setOfflineLease] = useState(48);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Authorization check (Section 20.1: Server-side authorization only)
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 rounded-2xl bg-[#0b1219] border border-purple-500/30 text-center">
        <ShieldCheck className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2 font-display">Superadmin Console</h2>
        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
          Access to the secret Admin Console is unlocked by clicking the Aether logo 5 times, or logging in as superadmin (<span className="text-purple-300 font-mono">Rajsinha7462@gmail.com</span>). Current status: <strong className="text-white">{currentUser?.role || 'Guest (Not Signed In)'}</strong>.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => switchRole('admin')}
            className="px-6 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold shadow-lg shadow-[#a855f7]/25 transition-all cursor-pointer"
          >
            Unlock Admin Console Access
          </button>
          <button
            onClick={() => setCurrentPage('home')}
            className="px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const handleToggleSuspendUser = (userId: string) => {
    const target = userList.find(u => u.id === userId);
    if (!target) return;

    const nextStatus = target.status === 'suspended' ? 'active' : 'suspended';
    setUserList(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    
    addAuditLog(
      nextStatus === 'suspended' ? 'Suspended User' : 'Reactivated User',
      'user_profile',
      userId,
      { previous: target.status, current: nextStatus }
    );
  };

  const handleCreateReleaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersion.trim()) return;

    publishRelease({
      version: newVersion.trim(),
      channel: newChannel,
      releaseNotes: newNotes,
      mandatory: newMandatory,
      rolloutPercent: newRollout,
      status: 'published',
      assets: [
        {
          platform: 'win32',
          arch: 'x64',
          kind: 'installer',
          fileName: `Aether-Setup-${newVersion}.exe`,
          downloadUrl: `/download/win32?version=${newVersion}`,
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          sizeBytes: 95400000,
        },
        {
          platform: 'darwin',
          arch: 'arm64',
          kind: 'dmg',
          fileName: `Aether-${newVersion}-arm64.dmg`,
          downloadUrl: `/download/darwin?version=${newVersion}`,
          sha256: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
          sizeBytes: 103200000,
        },
      ],
    });

    setCreateReleaseOpen(false);
    setNewVersion('');
    setNewNotes('');
  };

  const filteredUsers = userList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.id.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Titlebar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/[0.08] mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-[#a855f7]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">Aether Admin Console</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30">
              AUDITED PRIVILEGE
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Control plane for releases, rollback, staged rollouts, feature flags, user governance, and docs gap detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-neutral-400">
            Admin: <strong className="text-white">{currentUser.displayName}</strong>
          </span>
          <button
            onClick={() => {
              switchRole('user');
              setCurrentPage('dashboard');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-neutral-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
          >
            Exit to Dashboard
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-px mb-8 overflow-x-auto text-xs font-medium">
        {[
          { id: 'overview', label: 'Platform Overview', icon: Layers },
          { id: 'users', label: 'User Governance', icon: Users },
          { id: 'releases', label: 'Releases & Rollback', icon: RefreshCw },
          { id: 'flags', label: 'Feature Flags & Rollouts', icon: Flag },
          { id: 'docs', label: 'Docs & Failed Searches', icon: BookOpen },
          { id: 'audit', label: 'Audit Logs', icon: ScrollText },
          { id: 'settings', label: 'Engine Settings', icon: Sliders },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setAdminTab(t.id as any)}
              className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                adminTab === t.id
                  ? 'bg-white/[0.08] text-white border-b-2 border-[#a855f7] font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#a855f7]" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-[#0b1219] border border-white/[0.08]">
              <span className="text-xs text-neutral-400 block mb-1">Total Registered Developers</span>
              <span className="text-3xl font-bold text-white font-mono">14,892</span>
              <span className="text-[11px] text-emerald-400 block mt-2">+342 new signups this week</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b1219] border border-white/[0.08]">
              <span className="text-xs text-neutral-400 block mb-1">Active Desktop Instances (15m)</span>
              <span className="text-3xl font-bold text-[#26c6da] font-mono">1,418</span>
              <span className="text-[11px] text-neutral-500 block mt-2">Presence verified via Redis lease</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b1219] border border-white/[0.08]">
              <span className="text-xs text-neutral-400 block mb-1">Local vs Cloud AI Split</span>
              <span className="text-3xl font-bold text-[#a855f7] font-mono">68% / 32%</span>
              <span className="text-[11px] text-neutral-400 block mt-2">68% local Ollama requests</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b1219] border border-white/[0.08]">
              <span className="text-xs text-neutral-400 block mb-1">Heartbeat Error Rate</span>
              <span className="text-3xl font-bold text-emerald-400 font-mono">0.01%</span>
              <span className="text-[11px] text-neutral-500 block mt-2">p95 latency: 42ms</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b1219] border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white mb-4 font-display">Download Volume by OS (Past 30 Days)</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-xs text-neutral-400 block mb-1">macOS (Apple Silicon &amp; Intel)</span>
                <span className="text-2xl font-bold text-white font-mono">8,912</span>
                <span className="text-[11px] text-cyan-400 block mt-1">60% of downloads</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-xs text-neutral-400 block mb-1">Windows x64 (.exe / portable)</span>
                <span className="text-2xl font-bold text-white font-mono">4,120</span>
                <span className="text-[11px] text-neutral-400 block mt-1">28% of downloads</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-xs text-neutral-400 block mb-1">Linux (.AppImage / .deb)</span>
                <span className="text-2xl font-bold text-white font-mono">1,860</span>
                <span className="text-[11px] text-neutral-400 block mt-1">12% of downloads</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. USERS */}
      {adminTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name, email, or UUID..."
                className="w-full pl-9 pr-4 py-2 bg-[#0b1219] border border-white/[0.1] rounded-xl text-xs text-white focus:outline-none focus:border-[#a855f7]"
              />
            </div>
            <span className="text-xs text-neutral-400">
              Showing {filteredUsers.length} developer accounts
            </span>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0b1219] overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase tracking-wider text-neutral-400 bg-white/[0.02] border-b border-white/[0.06]">
                <tr>
                  <th className="px-6 py-3 font-semibold">User</th>
                  <th className="px-6 py-3 font-semibold">Version &amp; OS</th>
                  <th className="px-6 py-3 font-semibold">Devices</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Last Active</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-300">
                      <div>v{u.version}</div>
                      <div className="text-[11px] text-neutral-500">{u.os}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">{u.devicesCount} active</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        u.status === 'active' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'
                      }`}>
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">{u.lastActive}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleSuspendUser(u.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                          u.status === 'suspended'
                            ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            : 'bg-red-500/15 text-red-300 hover:bg-red-500/25'
                        }`}
                      >
                        {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. RELEASES & ROLLBACK (Section 14 & 14.2) */}
      {adminTab === 'releases' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display">Release Management &amp; Rollback Control</h3>
              <p className="text-xs text-neutral-400">
                Publish staged updates (1% → 100%) or execute instant rollbacks that auto-promote previous stable releases.
              </p>
            </div>
            <button
              onClick={() => setCreateReleaseOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-[#a855f7]/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Release</span>
            </button>
          </div>

          {/* Create Release Modal */}
          {createReleaseOpen && (
            <div className="p-6 rounded-2xl bg-[#0e1620] border border-[#a855f7]/40 shadow-2xl space-y-4">
              <h4 className="text-sm font-bold text-white">Create New Aether Release</h4>
              <form onSubmit={handleCreateReleaseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Version (e.g. 1.3.0)</label>
                    <input
                      type="text"
                      value={newVersion}
                      onChange={(e) => setNewVersion(e.target.value)}
                      placeholder="1.3.0"
                      required
                      className="w-full px-3 py-2 bg-black/60 border border-white/[0.1] rounded-lg text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Channel</label>
                    <select
                      value={newChannel}
                      onChange={(e) => setNewChannel(e.target.value as any)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/[0.1] rounded-lg text-xs text-white focus:outline-none"
                    >
                      <option value="stable">Stable</option>
                      <option value="beta">Beta</option>
                      <option value="nightly">Nightly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Rollout Percent ({newRollout}%)</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={newRollout}
                      onChange={(e) => setNewRollout(Number(e.target.value))}
                      className="w-full mt-2 accent-[#a855f7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Release Notes</label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Security patch, Studio Mode optimizations, etc."
                    className="w-full px-3 py-2 bg-black/60 border border-white/[0.1] rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs text-neutral-300">
                    <input
                      type="checkbox"
                      checked={newMandatory}
                      onChange={(e) => setNewMandatory(e.target.checked)}
                      className="rounded accent-[#a855f7]"
                    />
                    <span>Mandatory Update (Locks clients below minimum_version)</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCreateReleaseOpen(false)}
                      className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#a855f7] text-white text-xs font-semibold"
                    >
                      Publish Release
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Releases List */}
          <div className="space-y-4">
            {releases.map((rel) => {
              const isWithdrawn = rel.status === 'rolled_back';

              return (
                <div
                  key={rel.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isWithdrawn
                      ? 'bg-black/30 border-red-500/25 opacity-70'
                      : 'bg-[#0b1219] border-white/[0.08]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-white font-mono">v{rel.version}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        rel.channel === 'stable' ? 'bg-[#26c6da]/20 text-[#26c6da]' :
                        rel.channel === 'beta' ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {rel.channel.toUpperCase()}
                      </span>
                      {isWithdrawn && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                          WITHDRAWN / ROLLED BACK
                        </span>
                      )}
                      {rel.mandatory && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">
                          MANDATORY
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {!isWithdrawn ? (
                        <>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-neutral-400">Rollout:</span>
                            <span className="font-mono text-white font-bold">{rel.rolloutPercent}%</span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={rel.rolloutPercent}
                              onChange={(e) => updateRolloutPercent(rel.id, Number(e.target.value))}
                              className="w-24 accent-[#a855f7]"
                            />
                          </div>
                          <button
                            onClick={() => rollbackRelease(rel.id, 'Administrative Rollback via Admin Console')}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Rollback</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-neutral-500">Auto-fallback to previous stable</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                    {rel.releaseNotes}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                    <span>Published: {new Date(rel.publishedAt).toLocaleDateString()}</span>
                    <span>Assets: {rel.assets.length} binary builds</span>
                    <span>Min Version: {rel.minimumVersion || 'none'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. FEATURE FLAGS (Section 17) */}
      {adminTab === 'flags' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-display">Feature Flags &amp; Staged Rollout Rules</h3>
            <p className="text-xs text-neutral-400">
              Deterministic bucketing: hash(user_id + flag_key) % 100 &lt; rollout_percent. Changes propagate in real-time.
            </p>
          </div>

          <div className="space-y-4">
            {flags.map((flag) => (
              <div key={flag.key} className="p-6 rounded-2xl bg-[#0b1219] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold font-mono text-white">{flag.key}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      flag.enabled ? 'bg-emerald-500/15 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {flag.enabled ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {flag.description}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {flag.enabled && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-400">Rollout:</span>
                      <span className="font-mono text-white font-bold">{flag.rolloutPercent}%</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={flag.rolloutPercent}
                        onChange={(e) => setFlagRollout(flag.key, Number(e.target.value))}
                        className="w-24 accent-[#26c6da]"
                      />
                    </div>
                  )}

                  <button
                    onClick={() => toggleFlag(flag.key)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      flag.enabled 
                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                        : 'bg-[#26c6da] hover:bg-[#22b2c4] text-black shadow-md shadow-[#26c6da]/25'
                    }`}
                  >
                    {flag.enabled ? 'Kill Switch (OFF)' : 'Enable Flag (ON)'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. DOCS ANALYTICS & FAILED SEARCHES (Section 15) */}
      {adminTab === 'docs' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-base font-bold text-white font-display">Documentation Health &amp; Gap Analysis</h3>
            <p className="text-xs text-neutral-400">
              Identify where developers get stuck. Failed searches log zero-result queries to guide documentation additions.
            </p>
          </div>

          {/* Failed Searches Section */}
          <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-bold font-display">Documentation Gap Detector: Failed Searches (Zero Results)</h4>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              These queries were entered by developers in the documentation search bar but returned 0 results:
            </p>

            <div className="space-y-2">
              {failedSearches.map((fs, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
                  <span className="font-mono text-amber-300">"{fs.query}"</span>
                  <span className="text-neutral-500 font-mono text-[11px]">{new Date(fs.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Articles Engagement Table */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0b1219] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] text-xs font-bold text-white uppercase tracking-wider font-display">
              Article Helpfulness &amp; Engagement
            </div>
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase tracking-wider text-neutral-400 bg-white/[0.02] border-b border-white/[0.06]">
                <tr>
                  <th className="px-6 py-3 font-semibold">Article Title</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold text-right">Helpful (👍)</th>
                  <th className="px-6 py-3 font-semibold text-right">Unhelpful (👎)</th>
                  <th className="px-6 py-3 font-semibold text-right">Satisfaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono text-neutral-300">
                {docs.map((d) => {
                  const total = d.helpfulCount + d.unhelpfulCount;
                  const satisfaction = total > 0 ? Math.round((d.helpfulCount / total) * 100) : 100;
                  return (
                    <tr key={d.slug} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-3 font-sans font-medium text-white">{d.title}</td>
                      <td className="px-6 py-3 text-neutral-400">{d.category}</td>
                      <td className="px-6 py-3 text-right text-emerald-400">{d.helpfulCount}</td>
                      <td className="px-6 py-3 text-right text-red-400">{d.unhelpfulCount}</td>
                      <td className="px-6 py-3 text-right font-bold text-cyan-400">{satisfaction}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. AUDIT LOGS (Section 20.2: Append-Only) */}
      {adminTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display">System &amp; Admin Audit Logs (Append-Only)</h3>
              <p className="text-xs text-neutral-400">
                All administrative state mutations are permanently recorded with salted IP hashes. UPDATE and DELETE are revoked at Postgres RLS level.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-500">Retention: &gt;= 12 months</span>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0b1219] overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase tracking-wider text-neutral-400 bg-white/[0.02] border-b border-white/[0.06]">
                <tr>
                  <th className="px-6 py-3 font-semibold">Timestamp</th>
                  <th className="px-6 py-3 font-semibold">Operator</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                  <th className="px-6 py-3 font-semibold">Target</th>
                  <th className="px-6 py-3 font-semibold">Metadata</th>
                  <th className="px-6 py-3 font-semibold text-right">Masked IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono text-neutral-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-3 text-neutral-500">{new Date(log.createdAt).toLocaleTimeString()}</td>
                    <td className="px-6 py-3 font-sans font-medium text-white">{log.adminName}</td>
                    <td className="px-6 py-3 text-[#a855f7] font-semibold">{log.action}</td>
                    <td className="px-6 py-3 text-cyan-400">{log.targetType}:{log.targetId.slice(0, 10)}</td>
                    <td className="px-6 py-3 text-[11px] text-neutral-400 font-mono">
                      {JSON.stringify(log.metadata)}
                    </td>
                    <td className="px-6 py-3 text-right text-neutral-500">{log.ipHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. SETTINGS */}
      {adminTab === 'settings' && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-white font-display">Global Licensing &amp; Protocol Engine Settings</h3>
            <p className="text-xs text-neutral-400">
              Configure baseline parameters for heartbeat intervals, offline cryptographic lease duration, and maintenance windows.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b1219] border border-white/[0.08] space-y-4 text-xs">
            <div>
              <label className="text-neutral-300 block mb-1 font-semibold">Desktop Heartbeat Interval (Seconds)</label>
              <input
                type="number"
                value={heartbeatInterval}
                onChange={(e) => setHeartbeatInterval(Number(e.target.value))}
                className="w-full px-3 py-2 bg-black/60 border border-white/[0.1] rounded-lg text-white font-mono"
              />
              <span className="text-[11px] text-neutral-500 block mt-1">Default 300s (5 min) as mandated by PRD Section 7.5.</span>
            </div>

            <div>
              <label className="text-neutral-300 block mb-1 font-semibold">Offline Cryptographic Lease (Hours)</label>
              <input
                type="number"
                value={offlineLease}
                onChange={(e) => setOfflineLease(Number(e.target.value))}
                className="w-full px-3 py-2 bg-black/60 border border-white/[0.1] rounded-lg text-white font-mono"
              />
              <span className="text-[11px] text-neutral-500 block mt-1">Default 48 hours. Enterprise policies can reduce to 0-4h.</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <div>
                <span className="font-semibold text-white block">Server Maintenance Mode</span>
                <span className="text-neutral-500 text-[11px]">Displays read-only banner while existing sessions operate on valid leases.</span>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-10 h-6 rounded-full transition-colors relative p-1 ${
                  maintenanceMode ? 'bg-[#a855f7]' : 'bg-neutral-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  maintenanceMode ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
