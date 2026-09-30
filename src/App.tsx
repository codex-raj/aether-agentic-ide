import React from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/home/HomeView';
import { FeaturesView } from './components/features/FeaturesView';
import { DownloadView } from './components/download/DownloadView';
import { PricingView } from './components/pricing/PricingView';
import { DocsView } from './components/docs/DocsView';
import { ChangelogView } from './components/changelog/ChangelogView';
import { SecurityView } from './components/security/SecurityView';
import { ModelsView } from './components/models/ModelsView';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AuthView } from './components/auth/AuthView';
import { AdminConsole } from './components/admin/AdminConsole';
import { DesktopIDESimulator } from './components/desktop/DesktopIDESimulator';
import { CommandPalette } from './components/common/CommandPalette';
import { CollapsibleSidebar } from './components/common/CollapsibleSidebar';
import { WaitlistModal } from './components/common/WaitlistModal';
import { ResourcesHub } from './components/resources/ResourcesHub';

const MainContent: React.FC = () => {
  const { currentPage } = usePlatform();

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView />;
      case 'features':
        return <FeaturesView />;
      case 'download':
        return <DownloadView />;
      case 'pricing':
        return <PricingView />;
      case 'models':
        return <ModelsView />;
      case 'enterprise':
        return <SecurityView />;
      case 'docs':
      case 'resources':
      case 'resources-docs':
      case 'resources-forum':
      case 'resources-help':
      case 'resources-workshops':
      case 'resources-community':
      case 'resources-api':
        return <ResourcesHub />;
      case 'changelog':
        return <ChangelogView />;
      case 'security':
        return <SecurityView />;
      case 'auth':
        return <AuthView />;
      case 'dashboard':
      case 'account-devices':
      case 'account-usage':
      case 'account-security':
      case 'account-downloads':
      case 'account-preferences':
        return <UserDashboard />;
      case 'admin-overview':
      case 'admin-users':
      case 'admin-releases':
      case 'admin-flags':
      case 'admin-docs':
      case 'admin-audit':
      case 'admin-settings':
        return <AdminConsole />;
      case 'ide-simulator':
        return <DesktopIDESimulator />;
      default:
        return <HomeView />;
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        {renderContent()}
      </div>
      <Footer />
      <CollapsibleSidebar />
      <CommandPalette />
      <WaitlistModal />
    </main>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <MainContent />
    </PlatformProvider>
  );
}
