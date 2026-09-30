export type OSPlatform = 'win32' | 'darwin' | 'linux';
export type Channel = 'stable' | 'beta' | 'nightly';
export type UserRole = 'user' | 'tester' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending' | 'deleted';
export type ProviderType = 'local' | 'cloud';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  planId: 'free' | 'starter' | 'pro' | 'team' | 'enterprise';
}

export interface UserDevice {
  id: string;
  userId: string;
  deviceId: string; // Random UUID (NOT hardware fingerprint)
  deviceName: string;
  osPlatform: OSPlatform;
  osRelease: string;
  arch: string;
  appVersion: string;
  channel: Channel;
  lastSeenAt: string;
  lastIpHash: string;
  revokedAt: string | null;
  createdAt: string;
  isCurrentDevice?: boolean;
}

export interface DesktopSession {
  id: string;
  userId: string;
  deviceUuid: string;
  familyId: string;
  expiresAt: string;
  revokedAt: string | null;
  revokedReason?: string;
  createdAt: string;
}

export interface DailyUsage {
  date: string;
  providerType: ProviderType;
  provider: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  agentTasks: number;
  successfulTasks: number;
  failedTasks: number;
}

export interface ReleaseAsset {
  platform: OSPlatform;
  arch: 'x64' | 'arm64' | 'universal';
  kind: 'installer' | 'portable' | 'dmg' | 'appimage' | 'deb';
  downloadUrl: string;
  sha256: string;
  sizeBytes: number;
  fileName: string;
}

export interface Release {
  id: string;
  version: string;
  channel: Channel;
  releaseNotes: string;
  minimumVersion?: string;
  recommendedVersion?: string;
  mandatory: boolean;
  rolloutPercent: number;
  status: 'published' | 'draft' | 'rolled_back';
  publishedAt: string;
  assets: ReleaseAsset[];
}

export interface FeatureFlag {
  key: string;
  description: string;
  enabled: boolean;
  rolloutPercent: number;
  rules: {
    channels?: Channel[];
    minVersion?: string;
    userIds?: string[];
  };
  updatedAt: string;
}

export interface PlanEntitlements {
  maxAgentTasks: number | 'unlimited';
  cloudAiEnabled: boolean;
  cloudTokensPerMonth: number | 'unlimited';
  allowedModels: string[];
  maxDevices: number;
  offlineLeaseHours: number;
  teamEnabled: boolean;
  priorityGateway: boolean;
}

export type CurrencyMode = 'USD' | 'INR';

export interface Plan {
  id: 'free' | 'starter' | 'pro' | 'team' | 'enterprise';
  name: string;
  tagline: string;
  priceMonthly: number; // in USD
  priceAnnual: number;  // in USD
  priceMonthlyINR: number;
  priceAnnualINR: number;
  entitlements: PlanEntitlements;
  highlights: string[];
}

export interface AdminAuditLog {
  id: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, any>;
  ipHash: string;
  createdAt: string;
}

export interface DocsSearchLog {
  id: string;
  query: string;
  resultCount: number;
  createdAt: string;
}

export interface UserPreferences {
  updateChannel: Channel;
  analyticsEnabled: boolean;
  crashReportsEnabled: boolean;
  usageStatsEnabled: boolean;
}
