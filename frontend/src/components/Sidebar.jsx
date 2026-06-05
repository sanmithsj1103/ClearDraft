import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Home, FileText, Mic, Settings, Plus } from 'lucide-react';
import alexAvatar from '../assets/alex_rivera.png';

export default function Sidebar() {
  const activeSidebar = useAppStore((state) => state.activeSidebar);
  const setField = useAppStore((state) => state.setField);
  const resetWorkspace = useAppStore((state) => state.resetWorkspace);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'record', label: 'Record', icon: Mic },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNewRecording = () => {
    resetWorkspace();
    setField('activeSidebar', 'record');
  };

  return (
    <aside className="w-64 bg-stitch-sidebar border-r border-stitch-border flex flex-col justify-between h-screen p-6 select-none shrink-0">
      
      {/* Top Branding Section */}
      <div className="space-y-8">
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold text-stitch-primary tracking-tight">ClearDraft</span>
          <span className="text-xs font-semibold text-stitch-muted mt-0.5 tracking-wider uppercase">AI Transcription</span>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebar === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setField('activeSidebar', item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-stitch-primary/10 text-stitch-primary font-bold'
                    : 'text-stitch-muted hover:text-stitch-text hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-stitch-primary' : 'text-stitch-muted'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile / Quick Action */}
      <div className="space-y-4">
        {/* Solid Blue New Recording Button */}
        <button
          onClick={handleNewRecording}
          className="w-full bg-stitch-primary hover:bg-stitch-primaryHover active:scale-[0.98] text-white py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Recording
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 border-t border-stitch-border pt-4">
          <img
            src={alexAvatar}
            alt="Alex Rivera"
            className="h-10 w-10 rounded-full border border-stitch-border object-cover shadow-sm bg-white"
            onError={(e) => {
              // Fallback initials if image load fails
              e.target.style.display = 'none';
            }}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-stitch-text truncate">Alex Rivera</span>
            <span className="text-[10px] text-stitch-muted font-medium uppercase tracking-wider mt-0.5">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
