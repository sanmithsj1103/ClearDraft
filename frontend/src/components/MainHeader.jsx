import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Search, Bell, HelpCircle } from 'lucide-react';

export default function MainHeader() {
  const activeSidebar = useAppStore((state) => state.activeSidebar);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setField = useAppStore((state) => state.setField);

  // Dynamic Page Title
  const getPageTitle = () => {
    switch (activeSidebar) {
      case 'home': return 'Home Dashboard';
      case 'drafts': return 'Saved Drafts';
      case 'settings': return 'System Settings';
      case 'record':
      default: return 'New Transcription';
    }
  };

  return (
    <header className="h-16 border-b border-stitch-border bg-white px-8 flex items-center justify-between shrink-0 select-none">
      {/* Title */}
      <h2 className="text-xl font-bold text-stitch-primary font-sans tracking-tight">
        {getPageTitle()}
      </h2>

      {/* Center Search Bar & Right icons */}
      <div className="flex items-center space-x-6">
        
        {/* Search Input (integrated with state) */}
        <div className="relative w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stitch-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setField('searchQuery', e.target.value);
              // Auto route to drafts tab if search is input
              if (activeSidebar !== 'drafts') {
                setField('activeSidebar', 'drafts');
              }
            }}
            placeholder="Search transcripts..."
            className="w-full pl-10 pr-4 py-2 border border-stitch-border rounded-lg text-xs bg-slate-50 focus-ring transition-all placeholder:text-stitch-muted"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-3 text-stitch-muted">
          <button 
            className="p-2 hover:bg-slate-100 rounded-full hover:text-stitch-text transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-stitch-primary animate-pulse" />
          </button>
          
          <button 
            className="p-2 hover:bg-slate-100 rounded-full hover:text-stitch-text transition-colors"
            title="Help Support"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* User initials circular avatar */}
          <div 
            className="h-8 w-8 rounded-full bg-stitch-primary/10 border border-stitch-primary/20 text-stitch-primary text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-stitch-primary/20 transition-all shadow-sm"
            title="Profile details"
          >
            AR
          </div>
        </div>
      </div>
    </header>
  );
}
