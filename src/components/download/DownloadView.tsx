import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { OSPlatform, Channel } from '../../types/platform';
import { 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  Terminal, 
  Laptop, 
  CheckCircle2,
  FileCode2,
  ArrowRight
} from 'lucide-react';

export const DownloadView: React.FC = () => {
  const { detectedOS, releases, setCurrentPage, downloadAndSyncIDE } = usePlatform();
  const [selectedOS, setSelectedOS] = useState<OSPlatform>(detectedOS);
  const [selectedChannel, setSelectedChannel] = useState<Channel>('stable');
  const [copiedSha, setCopiedSha] = useState<string | null>(null);
  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);
  const [downloadFileName, setDownloadFileName] = useState<string>('');

  const currentRelease = releases.find(r => r.channel === selectedChannel && r.status === 'published') || releases[0];

  const handleCopySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2500);
  };

  const handleTriggerDownload = (fileName: string) => {
    setDownloadFileName(fileName);
    setDownloadStarted(true);

    // Sync workstation with personal account in realtime
    downloadAndSyncIDE(selectedOS);

    const dummyBlob = new Blob(['Aether IDE Binary Placeholder\nVersion: ' + currentRelease.version], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(dummyBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredAssets = currentRelease.assets.filter(a => a.platform === selectedOS);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-black text-[#ededed]">
      
      {/* Download Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-6xl font-bold text-white font-display tracking-tight mb-4">
          Download Aether
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
          The AI-first code editor. Available for macOS, Windows, and Linux.
        </p>
      </div>

      {/* OS & Channel Selector Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-[#0e0e0e] border border-white/[0.08] mb-12">
        
        {/* OS Tabs */}
        <div className="flex items-center p-1 bg-black/60 rounded-xl border border-white/[0.08] w-full sm:w-auto">
          {[
            { id: 'darwin', label: 'macOS' },
            { id: 'win32', label: 'Windows' },
            { id: 'linux', label: 'Linux' },
          ].map((os) => (
            <button
              key={os.id}
              onClick={() => setSelectedOS(os.id as any)}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedOS === os.id
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {os.label}
            </button>
          ))}
        </div>

        {/* Channel Segmented Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Channel:</span>
          <div className="flex items-center p-1 bg-black/60 rounded-xl border border-white/[0.08]">
            {(['stable', 'beta', 'nightly'] as Channel[]).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedChannel(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  selectedChannel === c
                    ? 'bg-white/[0.12] text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Post-Download 3-Step Guide (if triggered) */}
      {downloadStarted && (
        <div className="mb-12 p-6 rounded-2xl bg-[#111111] border border-white/[0.15] shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm font-display">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Download initiated: {downloadFileName}</span>
            </div>
            <button
              onClick={() => setDownloadStarted(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06]">
              <span className="font-mono text-white font-bold block mb-1">01. Install</span>
              <p className="text-neutral-400">Open the installer and drag to Applications or run the setup executable.</p>
            </div>
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06]">
              <span className="font-mono text-white font-bold block mb-1">02. Sign in</span>
              <p className="text-neutral-400">Launch Aether and click Sign In to authenticate via your default browser.</p>
            </div>
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06]">
              <span className="font-mono text-white font-bold block mb-1">03. Code</span>
              <p className="text-neutral-400">Tokens are stored in safeStorage and your workstation unlocks instantly.</p>
            </div>
          </div>
        </div>
      )}

      {/* Artifact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
            <div
              key={asset.fileName}
              className="p-6 rounded-2xl bg-[#0c0c0c] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-white font-display mb-1">{asset.fileName}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span className="capitalize">{asset.kind}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono uppercase">{asset.arch}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{(asset.sizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-neutral-300">
                    Code-Signed
                  </span>
                </div>

                {/* SHA-256 Checksum block */}
                <div className="p-3 rounded-xl bg-black/50 border border-white/[0.06] mb-4">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                    <span>SHA-256 Checksum:</span>
                    <button
                      onClick={() => handleCopySha(asset.sha256)}
                      className="text-neutral-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSha === asset.sha256 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSha === asset.sha256 ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <code className="text-[11px] font-mono text-neutral-400 break-all select-all block">
                    {asset.sha256}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTriggerDownload(asset.fileName)}
                  className="flex-1 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {asset.fileName}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center rounded-2xl bg-[#0c0c0c] border border-white/[0.08] text-neutral-400">
            No published binaries found for this channel and platform. Try selecting the Stable channel.
          </div>
        )}
      </div>

      {/* Package Manager Commands Snippets */}
      <div className="p-8 rounded-2xl bg-[#080808] border border-white/[0.08] mb-12">
        <h3 className="text-sm font-bold text-white mb-2 font-display">Command Line Installation</h3>
        <p className="text-xs text-neutral-400 mb-6">
          Install and manage Aether directly using official verified package managers:
        </p>

        <div className="space-y-3 text-xs font-mono">
          {selectedOS === 'win32' && (
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06] flex items-center justify-between">
              <span className="text-neutral-300">winget install Aether.AetherIDE</span>
              <button
                onClick={() => handleCopySha('winget install Aether.AetherIDE')}
                className="text-neutral-500 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}

          {selectedOS === 'darwin' && (
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06] flex items-center justify-between">
              <span className="text-neutral-300">brew install --cask aether-ide</span>
              <button
                onClick={() => handleCopySha('brew install --cask aether-ide')}
                className="text-neutral-500 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}

          {selectedOS === 'linux' && (
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06] flex items-center justify-between">
              <span className="text-neutral-300">sudo dpkg -i aether_1.2.4_amd64.deb</span>
              <button
                onClick={() => handleCopySha('sudo dpkg -i aether_1.2.4_amd64.deb')}
                className="text-neutral-500 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
