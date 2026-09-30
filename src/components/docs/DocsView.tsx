import React, { useState, useMemo, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  Search, 
  BookOpen, 
  ThumbsUp, 
  ThumbsDown, 
  Check, 
  Clock, 
  Layers, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const DocsView: React.FC = () => {
  const { docs, voteDoc, logDocSearch } = usePlatform();
  const [selectedSlug, setSelectedSlug] = useState<string>(docs[0].slug);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [votedMap, setVotedMap] = useState<Record<string, 'up' | 'down'>>({});

  const categories = useMemo(() => {
    const set = new Set(docs.map(d => d.category));
    return Array.from(set);
  }, [docs]);

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return docs;
    const q = searchQuery.toLowerCase();
    return docs.filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.summary.toLowerCase().includes(q) ||
      d.content.some(c => c.toLowerCase().includes(q))
    );
  }, [docs, searchQuery]);

  // Log search results to track failed searches (PRD Section 15 & 20) safely in useEffect
  useEffect(() => {
    if (searchQuery.trim().length > 2 && filteredDocs.length === 0) {
      logDocSearch(searchQuery.trim(), 0);
    }
  }, [searchQuery, filteredDocs.length, logDocSearch]);

  const activeDoc = docs.find(d => d.slug === selectedSlug) || docs[0];

  const handleVote = (slug: string, helpful: boolean) => {
    voteDoc(slug, helpful);
    setVotedMap(prev => ({ ...prev, [slug]: helpful ? 'up' : 'down' }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Docs Header & Search */}
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl font-bold text-white font-display mb-2">Documentation Hub</h1>
        <p className="text-xs sm:text-sm text-neutral-400 mb-6">
          Architectural guides, RFC 7636 PKCE handshake specs, local Ollama integration, and Studio Mode agent controls.
        </p>

        {/* Search input with live query logger */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, PKCE specs, Ollama setup, or commands..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0b1219] border border-white/[0.1] rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#26c6da]"
          />
          {searchQuery && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500">
              {filteredDocs.length} {filteredDocs.length === 1 ? 'match' : 'matches'}
            </span>
          )}
        </div>
      </div>

      {/* Docs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          {categories.map((cat) => {
            const catDocs = filteredDocs.filter(d => d.category === cat);
            if (catDocs.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block font-display">
                  {cat}
                </span>
                <div className="space-y-1">
                  {catDocs.map((doc) => (
                    <button
                      key={doc.slug}
                      onClick={() => setSelectedSlug(doc.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                        selectedSlug === doc.slug
                          ? 'bg-[#26c6da]/15 text-[#26c6da] font-semibold border-l-2 border-[#26c6da]'
                          : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className="truncate">{doc.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredDocs.length === 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              No matching articles found for "{searchQuery}". This query has been automatically logged to our documentation gap detector.
            </div>
          )}
        </div>

        {/* Main Content Pane (Col 8) */}
        <div className="lg:col-span-8 p-8 rounded-2xl bg-[#0b1219] border border-white/[0.08]">
          {activeDoc && (
            <article className="space-y-6">
              
              {/* Metadata Kicker */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 pb-4 border-b border-white/[0.06]">
                <span className="text-[#26c6da] font-medium">{activeDoc.category}</span>
                <span aria-hidden="true">·</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] text-neutral-300 border border-white/[0.08]">
                  Compatibility: {activeDoc.minVersion}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-mono text-neutral-400">
                  <Clock className="w-3 h-3" />
                  {activeDoc.readTime}
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-3">
                  {activeDoc.title}
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                  {activeDoc.summary}
                </p>
              </div>

              {/* Prose Content */}
              <div className="space-y-4 text-xs sm:text-sm text-neutral-400 leading-relaxed pt-2">
                {activeDoc.content.map((p, i) => (
                  <p key={i} className="text-neutral-300">
                    {p}
                  </p>
                ))}
              </div>

              {/* Interactive Helpfulness Widget (Section 15) */}
              <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-xs text-neutral-400">
                  Was this page helpful to your workflow?
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={!!votedMap[activeDoc.slug]}
                    onClick={() => handleVote(activeDoc.slug, true)}
                    className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      votedMap[activeDoc.slug] === 'up'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Yes ({activeDoc.helpfulCount})</span>
                  </button>

                  <button
                    disabled={!!votedMap[activeDoc.slug]}
                    onClick={() => handleVote(activeDoc.slug, false)}
                    className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      votedMap[activeDoc.slug] === 'down'
                        ? 'bg-red-500/20 text-red-300 border-red-500/30'
                        : 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>No ({activeDoc.unhelpfulCount})</span>
                  </button>
                </div>
              </div>

            </article>
          )}
        </div>

      </div>

    </div>
  );
};
