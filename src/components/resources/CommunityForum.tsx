import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Search, 
  Plus, 
  Tag, 
  Clock, 
  CheckCircle2, 
  Send, 
  X, 
  Flame, 
  Code2, 
  CornerDownRight, 
  HelpCircle,
  Share2
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface ForumReply {
  id: string;
  authorName: string;
  authorAvatar: string;
  isStaff?: boolean;
  content: string;
  createdAt: string;
  upvotes: number;
}

interface ForumThread {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  isStaff?: boolean;
  tags: string[];
  content: string;
  codeSnippet?: string;
  upvotes: number;
  hasVoted?: boolean;
  replies: ForumReply[];
  solved?: boolean;
  createdAt: string;
}

const INITIAL_THREADS: ForumThread[] = [
  {
    id: 'thread-1',
    title: 'How to configure DeepSeek-Coder-V2 locally via Ollama with 128k context in Aether?',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    tags: ['Ollama', 'Local AI', 'DeepSeek', 'Config'],
    content: 'I have an RTX 4090 and want to ensure Aether IDE routes multi-file AST scans through my local Ollama server rather than the cloud gateway. Do I need to set num_ctx in the Modelfile or can Aether override it directly via .aether/config.json?',
    codeSnippet: '{\n  "models": {\n    "defaultProvider": "ollama",\n    "ollama": {\n      "host": "http://localhost:11434",\n      "model": "deepseek-coder-v2:16b",\n      "contextWindow": 131072\n    }\n  }\n}',
    upvotes: 38,
    solved: true,
    createdAt: '2 hours ago',
    replies: [
      {
        id: 'reply-1',
        authorName: 'Marcus Vance',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        isStaff: true,
        content: 'Yes! Aether IDE automatically detects Ollama at localhost:11434 and reads both your local Modelfile parameter and your project .aether/config.json. When you configure "contextWindow": 131072, Aether will format the prompt chunks using rotary position embeddings.',
        createdAt: '1 hour ago',
        upvotes: 19
      }
    ]
  },
  {
    id: 'thread-2',
    title: 'Building a custom MCP Server to connect Postgres schema directly to Aether Agent',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    tags: ['MCP Protocol', 'Database', 'Tools', 'Agent'],
    content: 'Has anyone integrated the Postgres MCP server? The agent was able to inspect tables, write migration SQL, and verify indices automatically. Here is the docker-compose setup that worked seamlessly.',
    codeSnippet: '# aether-mcp-postgres\nmcpServers:\n  postgres:\n    command: "npx"\n    args: ["-y", "@modelcontextprotocol/server-postgres", "postgresql://dev:secret@localhost:5432/main"]',
    upvotes: 64,
    solved: false,
    createdAt: '5 hours ago',
    replies: [
      {
        id: 'reply-2',
        authorName: 'Devon Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        content: 'This is brilliant! Tested this on our staging database today. When using the @database context tag in chat, Aether generates flawless DDL migration patches.',
        createdAt: '3 hours ago',
        upvotes: 11
      }
    ]
  },
  {
    id: 'thread-3',
    title: 'RFC 7636 PKCE Handshake troubleshooting on Linux with custom desktop keyrings',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    tags: ['Linux', 'PKCE', 'Security', 'Troubleshooting'],
    content: 'On Arch Linux with Sway WM, secret-service was failing to open the OS keychain for storing the rotating refresh token. Setting up gnome-keyring or pass solves the issue instantly.',
    upvotes: 27,
    solved: true,
    createdAt: '1 day ago',
    replies: [
      {
        id: 'reply-3',
        authorName: 'Aether Bot',
        authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        isStaff: true,
        content: 'We added fallback file-based AES-256 encrypted storage for headless/tiling WM environments in Release v2.0.1. Run `aether auth --keyring=fallback` if dbus secret-service is absent.',
        createdAt: '18 hours ago',
        upvotes: 15
      }
    ]
  },
  {
    id: 'thread-4',
    title: 'Showcase: Built an entire microservices boilerplate in 10 minutes with Studio Mode',
    authorName: 'Kenji Sato',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    tags: ['Showcase', 'Studio Mode', 'Multi-File'],
    content: 'Fed Aether my OpenAPI spec and prompted it to generate 4 Go services with gRPC inter-service communication, dockerfiles, and k8s helm charts. The auto-test repair caught 2 type mismatch bugs before I even hit compile!',
    upvotes: 92,
    solved: false,
    createdAt: '2 days ago',
    replies: []
  }
];

export const CommunityForum: React.FC = () => {
  const { currentUser } = usePlatform();
  const [threads, setThreads] = useState<ForumThread[]>(INITIAL_THREADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [newThreadModalOpen, setNewThreadModalOpen] = useState(false);
  
  // New discussion form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('General, Question');
  const [newCodeSnippet, setNewCodeSnippet] = useState('');

  // Reply form state
  const [replyText, setReplyText] = useState('');

  const allTags = ['All', 'Ollama', 'Local AI', 'MCP Protocol', 'Studio Mode', 'Troubleshooting', 'Config', 'Showcase'];

  const filteredThreads = threads.filter(thread => {
    const matchesTag = selectedTag === 'All' || thread.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());
    const matchesQuery = !searchQuery.trim() || 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesQuery;
  });

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(prev => prev.map(t => {
      if (t.id === id) {
        const hasVoted = Boolean(t.hasVoted);
        return {
          ...t,
          upvotes: hasVoted ? t.upvotes - 1 : t.upvotes + 1,
          hasVoted: !hasVoted
        };
      }
      return t;
    }));
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const parsedTags = newTags.split(',').map(t => t.trim()).filter(Boolean);

    const newThread: ForumThread = {
      id: `thread-${Date.now()}`,
      title: newTitle.trim(),
      authorName: currentUser?.displayName || currentUser?.email.split('@')[0] || 'Community Developer',
      authorAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      tags: parsedTags.length > 0 ? parsedTags : ['Discussion'],
      content: newContent.trim(),
      codeSnippet: newCodeSnippet.trim() ? newCodeSnippet.trim() : undefined,
      upvotes: 1,
      hasVoted: true,
      replies: [],
      solved: false,
      createdAt: 'Just now'
    };

    setThreads([newThread, ...threads]);
    setNewTitle('');
    setNewContent('');
    setNewCodeSnippet('');
    setNewThreadModalOpen(false);
    setActiveThreadId(newThread.id);
  };

  const handleSendReply = (threadId: string) => {
    if (!replyText.trim()) return;

    const newReply: ForumReply = {
      id: `reply-${Date.now()}`,
      authorName: currentUser?.displayName || currentUser?.email.split('@')[0] || 'Aether Engineer',
      authorAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      isStaff: currentUser?.role === 'admin',
      content: replyText.trim(),
      createdAt: 'Just now',
      upvotes: 0
    };

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          replies: [...t.replies, newReply]
        };
      }
      return t;
    }));

    setReplyText('');
  };

  const activeThread = threads.find(t => t.id === activeThreadId);

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#10141e] via-[#0d1017] to-[#120f1f] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 uppercase">
              Developer Forum &amp; Q&amp;A
            </span>
            <span className="text-[11px] text-neutral-400">14,800+ Active Builders</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Aether Community Discussions
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Ask technical questions, share local Ollama model configs, showcase custom MCP tool extensions, and vote on community solutions.
          </p>
        </div>

        <button
          onClick={() => setNewThreadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions, Ollama configs, MCP plugins, error codes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090b10] border border-white/[0.08] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedTag === tag
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.04]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Thread List or Detail */}
      {activeThread ? (
        /* Thread Detail View */
        <div className="rounded-3xl bg-[#090b10] border border-white/[0.08] p-6 sm:p-8 space-y-6">
          <button
            onClick={() => setActiveThreadId(null)}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>← Back to all discussions</span>
          </button>

          <div className="border-b border-white/[0.06] pb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {activeThread.tags.map(tag => (
                <span key={tag} className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-neutral-300 border border-white/[0.08]">
                  #{tag}
                </span>
              ))}
              {activeThread.solved && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Solved</span>
                </span>
              )}
              <span className="text-[11px] text-neutral-400 ml-auto flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{activeThread.createdAt}</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white font-display mb-4">
              {activeThread.title}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <img 
                src={activeThread.authorAvatar} 
                alt={activeThread.authorName} 
                className="w-8 h-8 rounded-full object-cover border border-white/[0.1]"
              />
              <div>
                <p className="text-xs font-semibold text-white">{activeThread.authorName}</p>
                <p className="text-[10px] text-neutral-400">Community Contributor</p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-4">
              <p>{activeThread.content}</p>
              {activeThread.codeSnippet && (
                <div className="rounded-2xl bg-[#050608] border border-white/[0.08] p-4 font-mono text-xs text-neutral-200 overflow-x-auto">
                  <pre>{activeThread.codeSnippet}</pre>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/[0.04]">
              <button
                onClick={(e) => handleUpvote(activeThread.id, e)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeThread.hasVoted
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-white/[0.06] text-neutral-300 hover:text-white hover:bg-white/[0.1]'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{activeThread.upvotes} Upvotes</span>
              </button>
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{activeThread.replies.length} Replies</span>
              </span>
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Replies ({activeThread.replies.length})
            </h3>

            {activeThread.replies.map((reply) => (
              <div 
                key={reply.id} 
                className={`p-4 rounded-2xl border transition-all ${
                  reply.isStaff 
                    ? 'bg-cyan-950/20 border-cyan-500/30' 
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src={reply.authorAvatar} 
                      alt={reply.authorName} 
                      className="w-6 h-6 rounded-full object-cover" 
                    />
                    <span className="text-xs font-semibold text-white">{reply.authorName}</span>
                    {reply.isStaff && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Aether Core Team
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400">{reply.createdAt}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed pl-8">
                  {reply.content}
                </p>
              </div>
            ))}

            {/* Reply Input Box */}
            <div className="pt-4">
              <div className="p-3 rounded-2xl bg-[#050608] border border-white/[0.08] focus-within:border-cyan-400 transition-colors">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a helpful response or solution..."
                  rows={3}
                  className="w-full bg-transparent text-xs text-white placeholder:text-neutral-500 focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <span className="text-[10px] text-neutral-400">
                    Markdown and code blocks supported
                  </span>
                  <button
                    onClick={() => handleSendReply(activeThread.id)}
                    className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post Reply</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Threads List View */
        <div className="space-y-3">
          {filteredThreads.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-[#090b10] border border-white/[0.06]">
              <HelpCircle className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">No discussions found</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                No matching threads found for "{searchQuery}". Start a new discussion to kickstart the conversation!
              </p>
              <button
                onClick={() => setNewThreadModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold cursor-pointer"
              >
                Start New Discussion
              </button>
            </div>
          ) : (
            filteredThreads.map(thread => (
              <div
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className="p-5 rounded-2xl bg-[#090b10] hover:bg-[#0e1118] border border-white/[0.06] hover:border-white/[0.14] transition-all flex items-start gap-4 cursor-pointer group"
              >
                {/* Upvote Pill */}
                <button
                  onClick={(e) => handleUpvote(thread.id, e)}
                  className={`flex flex-col items-center justify-center min-w-[48px] py-2 px-2.5 rounded-xl border transition-all cursor-pointer ${
                    thread.hasVoted 
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' 
                      : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white border-white/[0.06]'
                  }`}
                  title="Upvote thread"
                >
                  <ThumbsUp className="w-3.5 h-3.5 mb-1" />
                  <span className="text-xs font-bold font-mono">{thread.upvotes}</span>
                </button>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {thread.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-neutral-400 border border-white/[0.06]">
                        #{tag}
                      </span>
                    ))}
                    {thread.solved && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Solved</span>
                      </span>
                    )}
                    <span className="text-[10px] text-neutral-400 ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{thread.createdAt}</span>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1.5">
                    {thread.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                    {thread.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <img 
                        src={thread.authorAvatar} 
                        alt={thread.authorName} 
                        className="w-5 h-5 rounded-full object-cover" 
                      />
                      <span className="text-[11px] text-neutral-300">{thread.authorName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{thread.replies.length} {thread.replies.length === 1 ? 'reply' : 'replies'}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* New Discussion Modal */}
      {newThreadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-xl bg-[#0d1017] border border-white/[0.12] rounded-3xl p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setNewThreadModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.08]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-display mb-1">
              Start a New Community Discussion
            </h3>
            <p className="text-xs text-neutral-400 mb-5">
              Share a setup guide, ask for troubleshooting help, or post an MCP tool snippet.
            </p>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How to optimize Llama 3 8B token throughput on M3 Max"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080b] border border-white/[0.1] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Ollama, AppleSilicon, Performance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080b] border border-white/[0.1] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Question / Discussion Body
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide context, details on your environment, and what you've tried..."
                  rows={4}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080b] border border-white/[0.1] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Optional Code / Config Snippet
                </label>
                <textarea
                  value={newCodeSnippet}
                  onChange={(e) => setNewCodeSnippet(e.target.value)}
                  placeholder="// Paste JSON config, terminal command, or code snippet..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080b] border border-white/[0.1] text-xs font-mono text-cyan-300 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewThreadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
