import React, { useState } from 'react';
import { 
  Users, 
  Github, 
  MessageSquare, 
  Sparkles, 
  ExternalLink, 
  Award, 
  Calendar, 
  Star, 
  GitFork, 
  Terminal, 
  CheckCircle2, 
  ArrowRight,
  Heart
} from 'lucide-react';

interface ShowcaseProject {
  id: string;
  name: string;
  author: string;
  description: string;
  tags: string[];
  stars: number;
  githubUrl: string;
}

const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'proj-1',
    name: 'aether-mcp-k8s',
    author: 'cloudnative-labs',
    description: 'Autonomous Kubernetes cluster inspection and pod crash troubleshooting MCP server designed for Aether IDE.',
    tags: ['Kubernetes', 'DevOps', 'MCP Protocol'],
    stars: 342,
    githubUrl: 'https://github.com'
  },
  {
    id: 'proj-2',
    name: 'local-rag-ollama-bridge',
    author: 'dev-artisan',
    description: 'High-speed local AST vector embedding indexer that runs in-memory with Qdrant and Ollama embedding models.',
    tags: ['Vector RAG', 'Ollama', 'Local AI'],
    stars: 512,
    githubUrl: 'https://github.com'
  },
  {
    id: 'proj-3',
    name: 'aether-theme-synthwave',
    author: 'neon-coder',
    description: 'Cyberpunk neon syntax theme optimized for Aether IDE multi-file diff previews and terminal output.',
    tags: ['Theme', 'UI/UX', 'Extension'],
    stars: 189,
    githubUrl: 'https://github.com'
  }
];

export const CommunityView: React.FC = () => {
  const [rsvpMeetup, setRsvpMeetup] = useState(false);
  const [ambassadorApplied, setAmbassadorApplied] = useState(false);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#140e24] via-[#0b1019] to-[#09151e] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 uppercase">
              Global Developer Ecosystem
            </span>
            <span className="text-[11px] text-neutral-400">14,800+ Members Strong</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Aether Community &amp; Events
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl leading-relaxed">
            Connect with autonomous agent builders, exchange local model configurations, attend global hackathons, and contribute to open-source MCP tools.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Join Discord Lounge</span>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <Github className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>
        </div>
      </div>

      {/* Community Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#090b10] border border-white/[0.06] text-center">
          <div className="text-2xl sm:text-3xl font-bold text-white font-display">24.8k+</div>
          <div className="text-xs text-neutral-400 mt-1">GitHub Stars</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#090b10] border border-white/[0.06] text-center">
          <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-display">14,800+</div>
          <div className="text-xs text-neutral-400 mt-1">Discord Engineers</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#090b10] border border-white/[0.06] text-center">
          <div className="text-2xl sm:text-3xl font-bold text-purple-400 font-display">89+</div>
          <div className="text-xs text-neutral-400 mt-1">Community MCP Servers</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#090b10] border border-white/[0.06] text-center">
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-display">180+</div>
          <div className="text-xs text-neutral-400 mt-1">Open-Source Contributors</div>
        </div>
      </div>

      {/* Upcoming Hackathon & Meetup */}
      <div className="rounded-3xl bg-[#090b10] border border-white/[0.08] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25 uppercase">
              Global Virtual Hackathon
            </span>
            <span className="text-[11px] text-neutral-400">$25,000 in Prizes</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            Aether Autonomous Agents Hackathon 2026
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
            Build the next generation of autonomous MCP tools, local AST refactoring extensions, or multi-repo developer agents. Open to developers worldwide.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>April 24 – 26, 2026</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>1,240 registered participants</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setRsvpMeetup(prev => !prev)}
          className={`px-6 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 ${
            rsvpMeetup
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-white hover:bg-neutral-200 text-black shadow-lg active:scale-95'
          }`}
        >
          {rsvpMeetup ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>RSVP Confirmed! Calendar Invite Sent</span>
            </>
          ) : (
            <>
              <span>Register for Hackathon</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Community Project Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Community Extensions &amp; Showcases
            </h3>
            <p className="text-xs text-neutral-400">
              Open-source MCP tool servers and plugins built by the community.
            </p>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Submit Your Plugin</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SHOWCASE_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="p-5 rounded-2xl bg-[#090b10] border border-white/[0.06] hover:border-white/[0.14] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{project.name}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{project.stars}</span>
                  </span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-neutral-300 border border-white/[0.06]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] text-xs text-neutral-400">
                <span>by {project.author}</span>
                <span className="text-cyan-400 font-medium group-hover:underline">View Repo →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ambassador Program Application */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#120f1e] via-[#090b10] to-[#0d131f] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-display">
              Become an Aether Campus &amp; Community Ambassador
            </h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
              Host workshops, write architectural guides, receive free Pro tier licenses, exclusive swags, and direct access to Aether core engineers.
            </p>
          </div>
        </div>

        <button
          onClick={() => setAmbassadorApplied(true)}
          disabled={ambassadorApplied}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 disabled:opacity-60"
        >
          {ambassadorApplied ? 'Application Submitted!' : 'Apply for Ambassador'}
        </button>
      </div>

    </div>
  );
};
