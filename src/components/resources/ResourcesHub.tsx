import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  MessageSquare, 
  LifeBuoy, 
  Video, 
  Users, 
  Terminal, 
  Search, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { DocsView } from '../docs/DocsView';
import { CommunityForum } from './CommunityForum';
import { HelpCenter } from './HelpCenter';
import { WorkshopsView } from './WorkshopsView';
import { CommunityView } from './CommunityView';
import { ApiReference } from './ApiReference';

export type ResourceTab = 'docs' | 'forum' | 'help' | 'workshops' | 'community' | 'api';

interface ResourcesHubProps {
  initialTab?: ResourceTab;
}

export const ResourcesHub: React.FC<ResourcesHubProps> = ({ initialTab = 'docs' }) => {
  const { currentPage, setCurrentPage } = usePlatform();
  const [activeTab, setActiveTab] = useState<ResourceTab>(() => {
    if (currentPage === 'resources-forum') return 'forum';
    if (currentPage === 'resources-help') return 'help';
    if (currentPage === 'resources-workshops') return 'workshops';
    if (currentPage === 'resources-community') return 'community';
    if (currentPage === 'resources-api') return 'api';
    return initialTab;
  });

  useEffect(() => {
    if (currentPage === 'resources-forum') setActiveTab('forum');
    else if (currentPage === 'resources-help') setActiveTab('help');
    else if (currentPage === 'resources-workshops') setActiveTab('workshops');
    else if (currentPage === 'resources-community') setActiveTab('community');
    else if (currentPage === 'resources-api') setActiveTab('api');
    else if (currentPage === 'resources-docs' || currentPage === 'docs') setActiveTab('docs');
  }, [currentPage]);

  const tabs: { id: ResourceTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'docs', label: 'Documentation', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'forum', label: 'Community Forum', icon: <MessageSquare className="w-4 h-4" />, badge: 'Active' },
    { id: 'help', label: 'Help & Diagnostic Center', icon: <LifeBuoy className="w-4 h-4" /> },
    { id: 'workshops', label: 'Workshops & Labs', icon: <Video className="w-4 h-4" />, badge: 'New' },
    { id: 'community', label: 'Community & Events', icon: <Users className="w-4 h-4" /> },
    { id: 'api', label: 'API & MCP Spec', icon: <Terminal className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-black text-[#ededed]">
      
      {/* Top Header Hub Navigation */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black font-extrabold text-xs">
                ▲
              </span>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                DEVELOPER RESOURCES PORTAL
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              Aether Developer Resources Hub
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
              Access official architectural documentation, participate in active community forums, diagnose local Ollama environments, and attend live hands-on masterclasses.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>v2.0 Documentation Suite</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.08]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-lg'
                    : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.04]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase tracking-wider ${
                    isActive
                      ? 'bg-black text-white'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[500px]">
        {activeTab === 'docs' && <DocsView />}
        {activeTab === 'forum' && <CommunityForum />}
        {activeTab === 'help' && <HelpCenter />}
        {activeTab === 'workshops' && <WorkshopsView />}
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'api' && <ApiReference />}
      </div>

    </div>
  );
};
