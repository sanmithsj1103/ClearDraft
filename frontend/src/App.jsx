import React from 'react';
import Sidebar from './components/Sidebar';
import MainHeader from './components/MainHeader';
import ComposeCard from './components/ComposeCard';
import OutputCard from './components/OutputCard';
import HomePanel from './components/HomePanel';
import DraftsPanel from './components/DraftsPanel';
import SettingsPanel from './components/SettingsPanel';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const activeSidebar = useAppStore((state) => state.activeSidebar);

  const renderActivePanel = () => {
    switch (activeSidebar) {
      case 'home':
        return <HomePanel />;
      case 'drafts':
        return <DraftsPanel />;
      case 'settings':
        return <SettingsPanel />;
      case 'record':
      default:
        return (
          <div className="flex flex-col space-y-6 max-w-5xl">
            {/* Composing Input Card */}
            <ComposeCard />
            
            {/* Dashed Output Drafts Card */}
            <OutputCard />
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen flex bg-stitch-bg overflow-hidden select-none">
      {/* Left Sidebar Branding & Navigation */}
      <Sidebar />

      {/* Right Content Column */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Main top header bar */}
        <MainHeader />

        {/* Scrollable Viewport Panel */}
        <div className="flex-grow p-8 overflow-y-auto">
          {renderActivePanel()}
        </div>
      </div>
    </div>
  );
}
