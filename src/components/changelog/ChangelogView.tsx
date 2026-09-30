import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Channel } from '../../types/platform';
import { GitCommit, Tag, AlertTriangle, Download, ArrowRight, Rss } from 'lucide-react';

export const ChangelogView: React.FC = () => {
  const { releases, setCurrentPage } = usePlatform();
  const [selectedChannel, setSelectedChannel] = useState<'all' | Channel>('all');

  const filteredReleases = releases.filter(r => selectedChannel === 'all' || r.channel === selectedChannel);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Changelog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-white/[0.08] mb-10 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display mb-2">Release Changelog</h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Chronological log of features, security patches, architectural updates, and withdrawal notices.
          </p>
        </div>

        {/* Channel Filter & RSS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-[#0b1219] rounded-xl border border-white/[0.08]">
            {['all', 'stable', 'beta', 'nightly'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedChannel(c as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  selectedChannel === c
                    ? 'bg-white/[0.1] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-neutral-400 hover:text-amber-400 cursor-pointer" title="RSS / Atom Feed">
            <Rss className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Timeline Releases */}
      <div className="space-y-8">
        {filteredReleases.map((release) => {
          const isWithdrawn = release.status === 'rolled_back';

          return (
            <div
              key={release.id}
              className={`p-8 rounded-2xl border transition-all ${
                isWithdrawn
                  ? 'bg-red-950/15 border-red-500/25'
                  : 'bg-[#0b1219] border-white/[0.08]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white font-mono">v{release.version}</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono capitalize ${
                    release.channel === 'stable' ? 'bg-[#26c6da]/20 text-[#26c6da]' :
                    release.channel === 'beta' ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {release.channel}
                  </span>

                  {isWithdrawn && (
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>WITHDRAWN (ROLLED BACK)</span>
                    </span>
                  )}
                </div>

                <span className="text-xs text-neutral-500 font-mono">
                  {new Date(release.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                {release.releaseNotes}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.04] text-xs">
                <div className="text-neutral-500">
                  Rollout: <strong className="text-neutral-300">{release.rolloutPercent}%</strong> · Min version: {release.minimumVersion || 'None'}
                </div>

                {!isWithdrawn && (
                  <button
                    onClick={() => setCurrentPage('download')}
                    className="text-[#26c6da] hover:text-[#22b2c4] flex items-center gap-1 font-semibold"
                  >
                    <span>Download v{release.version}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
