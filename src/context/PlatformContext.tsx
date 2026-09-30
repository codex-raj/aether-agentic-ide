import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserDevice, 
  Release, 
  FeatureFlag, 
  Plan, 
  DailyUsage, 
  AdminAuditLog, 
  UserPreferences,
  OSPlatform,
  Channel
} from '../types/platform';
import { 
  INITIAL_PLANS, 
  INITIAL_USER, 
  INITIAL_DEVICES, 
  INITIAL_RELEASES, 
  INITIAL_FLAGS, 
  INITIAL_DAILY_USAGE, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_PREFERENCES,
  DOC_ARTICLES,
  DocArticle
} from '../data/mockData';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser 
} from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export type NavigationTarget = 
  | 'home' 
  | 'features' 
  | 'download' 
  | 'pricing' 
  | 'docs' 
  | 'changelog' 
  | 'security' 
  | 'blog' 
  | 'enterprise'
  | 'models'
  | 'auth'
  | 'dashboard'
  | 'account-devices'
  | 'account-usage'
  | 'account-security'
  | 'account-downloads'
  | 'account-preferences'
  | 'admin-overview'
  | 'admin-users'
  | 'admin-releases'
  | 'admin-flags'
  | 'admin-docs'
  | 'admin-audit'
  | 'admin-settings'
  | 'ide-simulator'
  | 'resources'
  | 'resources-docs'
  | 'resources-forum'
  | 'resources-help'
  | 'resources-workshops'
  | 'resources-community'
  | 'resources-api';

export interface PKCEState {
  status: 'locked' | 'generating_pkce' | 'web_auth_pending' | 'code_ready' | 'exchanging_token' | 'unlocked' | 'revoked';
  deviceId: string;
  codeVerifier: string;
  codeChallenge: string;
  stateToken: string;
  authCode: string;
  accessToken: string | null;
  refreshToken: string | null;
  leaseExpiresAt: string | null;
  heartbeatCountdown: number; // in seconds (300 = 5 min)
  lastRevokeReason?: string;
  logMessages: string[];
}

interface PlatformContextType {
  currentPage: NavigationTarget;
  setCurrentPage: (page: NavigationTarget) => void;
  detectedOS: OSPlatform;
  setDetectedOS: (os: OSPlatform) => void;
  
  // User state
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  switchRole: (role: 'user' | 'tester' | 'admin') => void;
  recordRealtimeUsage: (tokens?: number, requests?: number) => void;
  registerConnectedWorkstation: (name?: string) => void;
  downloadAndSyncIDE: (os?: OSPlatform) => UserDevice;
  
  // Plans & Entitlements
  plans: Plan[];
  currentPlan: Plan;
  
  // Devices & Sessions
  devices: UserDevice[];
  revokeDevice: (id: string, reason?: string) => void;
  revokeAllDevices: () => void;
  renameDevice: (id: string, newName: string) => void;
  
  // Releases & Updates
  releases: Release[];
  publishRelease: (newRelease: Omit<Release, 'id' | 'publishedAt'>) => void;
  rollbackRelease: (releaseId: string, reason: string) => void;
  updateRolloutPercent: (releaseId: string, percent: number) => void;
  
  // Feature Flags
  flags: FeatureFlag[];
  toggleFlag: (key: string) => void;
  setFlagRollout: (key: string, percent: number) => void;
  
  // Usage
  dailyUsage: DailyUsage[];
  
  // Preferences
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  
  // Audit Logs
  auditLogs: AdminAuditLog[];
  addAuditLog: (action: string, targetType: string, targetId: string, metadata?: Record<string, any>) => void;
  
  // Docs & Search
  docs: DocArticle[];
  voteDoc: (slug: string, helpful: boolean) => void;
  failedSearches: { query: string; timestamp: string }[];
  logDocSearch: (query: string, resultCount: number) => void;
  
  // Desktop IDE & PKCE Simulator
  pkceState: PKCEState;
  startPKCEFlow: () => void;
  completeWebAuth: (provider: 'google' | 'github' | 'magic_link') => void;
  exchangePKCEToken: () => void;
  triggerDesktopRevoke: (reason: string) => void;
  resetDesktopLock: () => void;

  // Global Command Palette
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  // Waitlist Modal
  isWaitlistModalOpen: boolean;
  setIsWaitlistModalOpen: (open: boolean) => void;
  openWaitlistModal: () => void;
  closeWaitlistModal: () => void;

  // Collapsible Sidebar (housing Admin, Commands, Changelog, Docs)
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Firebase Auth helpers
  loginWithFirebaseGoogle: () => Promise<void>;
  logoutFirebase: () => Promise<void>;
  firebaseAuthLoading: boolean;
}

const PlatformContext = createContext<PlatformContextType | null>(null);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavigationTarget>('home');
  const [detectedOS, setDetectedOS] = useState<OSPlatform>('darwin');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [plans] = useState<Plan[]>(INITIAL_PLANS);
  const [devices, setDevices] = useState<UserDevice[]>(INITIAL_DEVICES);
  const [releases, setReleases] = useState<Release[]>(INITIAL_RELEASES);
  const [flags, setFlags] = useState<FeatureFlag[]>(INITIAL_FLAGS);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>(INITIAL_DAILY_USAGE);
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [docs, setDocs] = useState<DocArticle[]>(DOC_ARTICLES);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [firebaseAuthLoading, setFirebaseAuthLoading] = useState<boolean>(false);
  const [failedSearches, setFailedSearches] = useState<{ query: string; timestamp: string }[]>([
    { query: 'rust analyzer rust-project.json', timestamp: '2026-09-29T14:10:00Z' },
    { query: 'wsl2 display port forwarding', timestamp: '2026-09-29T18:32:00Z' },
    { query: 'claude 3.7 hybrid reasoning', timestamp: '2026-09-30T00:15:00Z' },
  ]);

  // Sync real Firebase Auth user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setTimeout(() => {
          setCurrentUser({
            id: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Developer',
            avatarUrl: fbUser.photoURL || '',
            role: fbUser.email?.toLowerCase() === 'rajsinha7462@gmail.com' ? 'admin' : 'user',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            planId: 'pro',
          });
        }, 0);
      } else {
        setTimeout(() => {
          setCurrentUser(null);
        }, 0);
      }
    });
    return () => unsubscribe();
  }, []);

  const openWaitlistModal = () => setIsWaitlistModalOpen(true);
  const closeWaitlistModal = () => setIsWaitlistModalOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const loginWithFirebaseGoogle = async () => {
    setFirebaseAuthLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        const userObj: UserProfile = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Developer',
          avatarUrl: user.photoURL || '',
          role: user.email?.toLowerCase() === 'rajsinha7462@gmail.com' ? 'admin' : 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          planId: 'pro',
        };
        setCurrentUser(userObj);
        setCurrentPage('dashboard');
      }
    } catch (err) {
      console.warn('Firebase login notice:', err);
    } finally {
      setFirebaseAuthLoading(false);
    }
  };

  const logoutFirebase = async () => {
    setFirebaseAuthLoading(true);
    try {
      await signOutUser();
      setCurrentUser(null);
    } catch (err) {
      console.warn('Firebase logout notice:', err);
    } finally {
      setFirebaseAuthLoading(false);
    }
  };

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleCommandPalette = () => {
    setIsCommandPaletteOpen(prev => !prev);
  };

  // PKCE Desktop Handshake simulator state
  const [pkceState, setPkceState] = useState<PKCEState>({
    status: 'locked',
    deviceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    codeVerifier: '',
    codeChallenge: '',
    stateToken: '',
    authCode: '',
    accessToken: null,
    refreshToken: null,
    leaseExpiresAt: null,
    heartbeatCountdown: 300,
    logMessages: [
      '[Aether Auth Engine] Initialized lock barrier. Session missing or unauthenticated.',
      '[Security Protocol] Tokens will never be passed through URLs or deep links (RFC 7636 PKCE mandatory).',
    ],
  });

  // Detect client OS on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('win')) {
        setDetectedOS('win32');
      } else if (ua.includes('mac')) {
        setDetectedOS('darwin');
      } else if (ua.includes('linux')) {
        setDetectedOS('linux');
      }
    }
  }, []);

  // Heartbeat countdown timer when unlocked
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pkceState.status === 'unlocked') {
      timer = setInterval(() => {
        setPkceState(prev => {
          if (prev.heartbeatCountdown <= 1) {
            // Heartbeat sent!
            return {
              ...prev,
              heartbeatCountdown: 300,
              logMessages: [
                ...prev.logMessages.slice(-15),
                `[Heartbeat 5m] POST /api/v1/desktop/heartbeat -> 200 OK (device=${prev.deviceId.slice(0, 8)}..., lease valid)`,
              ],
            };
          }
          return { ...prev, heartbeatCountdown: prev.heartbeatCountdown - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pkceState.status]);

  const currentPlan = (currentUser ? plans.find(p => p.id === currentUser.planId) : null) || plans[0];

  const switchRole = (role: 'user' | 'tester' | 'admin') => {
    setCurrentUser(prev => prev ? ({ ...prev, role }) : null);
    setTimeout(() => {
      if (currentUser) {
        addAuditLog(`Switched preview role to ${role}`, 'user_profile', currentUser.id, { role });
      }
    }, 0);
  };

  const addAuditLog = (action: string, targetType: string, targetId: string, metadata: Record<string, any> = {}) => {
    const userName = currentUser ? (currentUser.displayName || currentUser.email) : 'System';
    const newLog: AdminAuditLog = {
      id: `log_${Date.now()}`,
      adminName: userName + (currentUser?.role === 'admin' ? ' (Admin)' : ''),
      action,
      targetType,
      targetId,
      metadata,
      ipHash: '9a8b***3e2',
      createdAt: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const recordRealtimeUsage = (tokens: number = 850, requests: number = 1) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyUsage(prev => {
      const existingIndex = prev.findIndex(u => u.date === today && u.providerType === 'cloud');
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          requests: updated[existingIndex].requests + requests,
          inputTokens: updated[existingIndex].inputTokens + Math.round(tokens * 0.7),
          outputTokens: updated[existingIndex].outputTokens + Math.round(tokens * 0.3),
          agentTasks: updated[existingIndex].agentTasks + 1,
          successfulTasks: updated[existingIndex].successfulTasks + 1
        };
        return updated;
      } else {
        const newEntry: DailyUsage = {
          date: today,
          providerType: 'cloud',
          provider: 'Aether Autonomous Multi-Model Gateway',
          requests,
          inputTokens: Math.round(tokens * 0.7),
          outputTokens: Math.round(tokens * 0.3),
          agentTasks: 1,
          successfulTasks: 1,
          failedTasks: 0
        };
        return [newEntry, ...prev];
      }
    });
  };

  const downloadAndSyncIDE = (targetOS?: OSPlatform): UserDevice => {
    const os = targetOS || detectedOS;
    const devId = 'dev_' + Math.random().toString(36).substring(2, 9);
    const deviceUuid = 'aether-' + Math.random().toString(36).substring(2, 8) + '-' + Date.now().toString(36);
    const osNames: Record<OSPlatform, string> = {
      darwin: 'MacBook Pro (Synced Aether IDE)',
      win32: 'Windows 11 Workstation (Synced Aether IDE)',
      linux: 'Linux Devbox (Synced Aether IDE)'
    };
    const deviceName = osNames[os] || 'Developer Workstation (Synced Aether IDE)';

    const newDevice: UserDevice = {
      id: devId,
      userId: currentUser ? currentUser.id : 'usr_local',
      deviceId: deviceUuid,
      deviceName,
      osPlatform: os,
      osRelease: os === 'darwin' ? 'macOS 15.1 Sequoia' : os === 'win32' ? 'Windows 11 24H2' : 'Linux Kernel 6.10',
      arch: os === 'darwin' ? 'arm64' : 'x64',
      appVersion: '2.0.0-synced',
      channel: 'stable',
      lastSeenAt: new Date().toISOString(),
      lastIpHash: '7f83b16***9069',
      revokedAt: null,
      createdAt: new Date().toISOString(),
      isCurrentDevice: true,
    };

    setDevices(prev => [newDevice, ...prev.map(d => ({ ...d, isCurrentDevice: false }))]);
    recordRealtimeUsage(1250, 1);

    if (currentUser) {
      addAuditLog('IDE Downloaded & Realtime Workstation Linked', 'device_sync', newDevice.id, {
        deviceName,
        os,
        email: currentUser.email
      });
    }

    // Trigger pairing credential download
    const syncPayload = {
      app: 'Aether Autonomous IDE',
      version: '2.0.0',
      syncedAt: new Date().toISOString(),
      account: {
        userId: currentUser ? currentUser.id : 'usr_guest',
        email: currentUser ? currentUser.email : 'developer@aetheride.dev',
        role: currentUser ? currentUser.role : 'user'
      },
      workstation: {
        deviceId: deviceUuid,
        deviceName,
        platform: os,
        syncChannel: 'wss://gateway.aetheride.dev/v1/realtime',
        telemetry: 'zero-enclave'
      },
      apiKeyGateway: {
        defaultModel: 'claude-3-7-sonnet',
        allowedFallbacks: ['gemini-2.5-pro', 'gpt-4o', 'deepseek-v3'],
        maxTokensPerTask: 32000
      }
    };

    try {
      const blob = new Blob([JSON.stringify(syncPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aether-ide-credentials-${(currentUser?.id || 'workstation').slice(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // browser environment check
    }

    return newDevice;
  };

  const registerConnectedWorkstation = (name?: string) => {
    downloadAndSyncIDE();
  };

  const revokeDevice = (id: string, reason: string = 'User requested revocation from portal') => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, revokedAt: new Date().toISOString() } : d));
    addAuditLog('Revoked Device Session', 'device', id, { reason });

    // If the revoked device matches the simulator's device ID, trigger Realtime Revoke in simulator
    const targetDev = devices.find(d => d.id === id);
    if (targetDev && targetDev.deviceId === pkceState.deviceId) {
      triggerDesktopRevoke(reason);
    }
  };

  const revokeAllDevices = () => {
    const now = new Date().toISOString();
    setDevices(prev => prev.map(d => ({ ...d, revokedAt: now })));
    addAuditLog('Revoked All Device Sessions', 'user_devices', currentUser?.id || 'all', { reason: 'Emergency Sign Out All' });
    triggerDesktopRevoke('All active sessions revoked by account security policy');
  };

  const renameDevice = (id: string, newName: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, deviceName: newName } : d));
    addAuditLog('Renamed Device', 'device', id, { newName });
  };

  const publishRelease = (newRelease: Omit<Release, 'id' | 'publishedAt'>) => {
    const release: Release = {
      ...newRelease,
      id: `rel_${Date.now()}`,
      publishedAt: new Date().toISOString(),
    };
    setReleases(prev => [release, ...prev]);
    addAuditLog(`Published Release v${release.version}`, 'release', release.id, {
      channel: release.channel,
      rollout: release.rolloutPercent,
      mandatory: release.mandatory,
    });
  };

  const rollbackRelease = (releaseId: string, reason: string) => {
    setReleases(prev => {
      return prev.map(rel => {
        if (rel.id === releaseId) {
          return {
            ...rel,
            status: 'rolled_back',
            rolloutPercent: 0,
            releaseNotes: `[WITHDRAWN: ${reason}] ${rel.releaseNotes}`,
          };
        }
        return rel;
      });
    });
    addAuditLog(`Rollback Executed for Release`, 'release', releaseId, { reason });
  };

  const updateRolloutPercent = (releaseId: string, percent: number) => {
    setReleases(prev => prev.map(rel => rel.id === releaseId ? { ...rel, rolloutPercent: percent } : rel));
    addAuditLog(`Updated Rollout Percent to ${percent}%`, 'release', releaseId, { percent });
  };

  const toggleFlag = (key: string) => {
    setFlags(prev => prev.map(f => {
      if (f.key === key) {
        const nextState = !f.enabled;
        addAuditLog(`Toggled Feature Flag: ${key}`, 'feature_flag', key, { enabled: nextState });
        return { ...f, enabled: nextState, updatedAt: new Date().toISOString() };
      }
      return f;
    }));
  };

  const setFlagRollout = (key: string, percent: number) => {
    setFlags(prev => prev.map(f => {
      if (f.key === key) {
        addAuditLog(`Updated Flag Rollout: ${key}`, 'feature_flag', key, { rollout: percent });
        return { ...f, rolloutPercent: percent, updatedAt: new Date().toISOString() };
      }
      return f;
    }));
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
    addAuditLog('Updated Account Preferences', 'user_preferences', currentUser?.id || 'guest_user', prefs);
  };

  const voteDoc = (slug: string, helpful: boolean) => {
    setDocs(prev => prev.map(doc => {
      if (doc.slug === slug) {
        return {
          ...doc,
          helpfulCount: helpful ? doc.helpfulCount + 1 : doc.helpfulCount,
          unhelpfulCount: !helpful ? doc.unhelpfulCount + 1 : doc.unhelpfulCount,
        };
      }
      return doc;
    }));
  };

  const logDocSearch = (query: string, resultCount: number) => {
    if (resultCount === 0 && query.trim().length > 2) {
      setFailedSearches(prev => [{ query, timestamp: new Date().toISOString() }, ...prev]);
    }
  };

  // --- PKCE Interactive Simulator Functions ---
  const startPKCEFlow = () => {
    const verifier = 'v_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const challenge = 'ch_' + Math.random().toString(36).substring(2, 15) + '8e2fa90';
    const state = 'st_' + Math.random().toString(36).substring(2, 10);
    
    setPkceState(prev => ({
      ...prev,
      status: 'generating_pkce',
      codeVerifier: verifier,
      codeChallenge: challenge,
      stateToken: state,
      logMessages: [
        ...prev.logMessages,
        `[PKCE Client] Generated code_verifier (${verifier.length} chars) stored in safe memory.`,
        `[PKCE Client] Computed code_challenge = SHA-256(verifier) = "${challenge}"`,
        `[PKCE Client] Generated random state = "${state}"`,
        `[Desktop Handshake] Launching system default browser to: /auth/desktop?challenge=${challenge}&state=${state}&device_id=${prev.deviceId.slice(0, 8)}...`,
      ],
    }));

    setTimeout(() => {
      setPkceState(prev => ({
        ...prev,
        status: 'web_auth_pending',
      }));
    }, 600);
  };

  const completeWebAuth = (provider: 'google' | 'github' | 'magic_link') => {
    const authCode = 'authcode_' + Math.random().toString(36).substring(2, 12);
    setPkceState(prev => ({
      ...prev,
      status: 'code_ready',
      authCode,
      logMessages: [
        ...prev.logMessages,
        `[Web Auth Engine] Authenticated user via ${provider.toUpperCase()} (user_id=${(currentUser?.id || 'guest_user').slice(0, 8)}...).`,
        `[Backend API] Created one-time auth_code bound to (challenge, device_id). TTL = 60s.`,
        `[Deep Link Handler] Firing desktop callback: aether://auth/callback?code=${authCode}&state=${prev.stateToken}`,
      ],
    }));
  };

  const exchangePKCEToken = () => {
    setPkceState(prev => ({
      ...prev,
      status: 'exchanging_token',
      logMessages: [
        ...prev.logMessages,
        `[Desktop Client] Deep link received. Verifying state match: "${prev.stateToken}" == OK.`,
        `[Desktop Client] POST /api/v1/desktop/token { code: "${prev.authCode}", code_verifier: "${prev.codeVerifier}", device_id: "${prev.deviceId.slice(0, 8)}..." }`,
      ],
    }));

    setTimeout(() => {
      const lease = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
      setPkceState(prev => ({
        ...prev,
        status: 'unlocked',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.at_' + Math.random().toString(36).substring(2, 10),
        refreshToken: 'rt_' + Math.random().toString(36).substring(2, 14),
        leaseExpiresAt: lease,
        heartbeatCountdown: 300,
        logMessages: [
          ...prev.logMessages,
          `[Backend API] PKCE cryptographic match verified: SHA256(verifier) == challenge!`,
          `[Backend API] auth_code consumed (marked used_at). Issued short-lived access_token (10m) + rotating refresh_token.`,
          `[Desktop Engine] Stored tokens securely in Electron safeStorage (OS Keychain / DPAPI).`,
          `[Lock Barrier] Barrier removed. Desktop IDE completely UNLOCKED. Subscribed to Realtime channel 'revoke:${prev.deviceId}'.`,
        ],
      }));
    }, 800);
  };

  const triggerDesktopRevoke = (reason: string) => {
    setPkceState(prev => ({
      ...prev,
      status: 'revoked',
      lastRevokeReason: reason,
      accessToken: null,
      refreshToken: null,
      logMessages: [
        ...prev.logMessages,
        `[Realtime Revoke Broadcast] RECEIVED SIGNAL on channel 'revoke:${prev.deviceId}': "${reason}"`,
        `[Desktop Engine] Refresh token family invalidated. Revoking local safeStorage tokens.`,
        `[Lock Barrier] EMERGENCY LOCK ENGAGED! Editor and terminal frozen with blur filter.`,
      ],
    }));
  };

  const resetDesktopLock = () => {
    setPkceState({
      status: 'locked',
      deviceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      codeVerifier: '',
      codeChallenge: '',
      stateToken: '',
      authCode: '',
      accessToken: null,
      refreshToken: null,
      leaseExpiresAt: null,
      heartbeatCountdown: 300,
      logMessages: [
        '[Aether Auth Engine] Clean state reset. Lock barrier active.',
      ],
    });
  };

  return (
    <PlatformContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        detectedOS,
        setDetectedOS,
        currentUser,
        setCurrentUser,
        switchRole,
        recordRealtimeUsage,
        registerConnectedWorkstation,
        downloadAndSyncIDE,
        plans,
        currentPlan,
        devices,
        revokeDevice,
        revokeAllDevices,
        renameDevice,
        releases,
        publishRelease,
        rollbackRelease,
        updateRolloutPercent,
        flags,
        toggleFlag,
        setFlagRollout,
        dailyUsage,
        preferences,
        updatePreferences,
        auditLogs,
        addAuditLog,
        docs,
        voteDoc,
        failedSearches,
        logDocSearch,
        pkceState,
        startPKCEFlow,
        completeWebAuth,
        exchangePKCEToken,
        triggerDesktopRevoke,
        resetDesktopLock,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        toggleCommandPalette,
        isWaitlistModalOpen,
        setIsWaitlistModalOpen,
        openWaitlistModal,
        closeWaitlistModal,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        loginWithFirebaseGoogle,
        logoutFirebase,
        firebaseAuthLoading,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
