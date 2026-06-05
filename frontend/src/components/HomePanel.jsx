import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Sparkles, Mic, FileText, Zap, BookOpen, ChevronRight } from 'lucide-react';

export default function HomePanel() {
  const draftsList = useAppStore((state) => state.draftsList);
  const setField = useAppStore((state) => state.setField);

  // Compute simple demonstration stats
  const totalDrafts = draftsList.length;
  
  return (
    <div className="space-y-6 select-none max-w-5xl">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-stitch-primary/5 border border-stitch-primary/10 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-stitch-primary font-sans">Welcome back, Alex!</h3>
          <p className="text-xs text-stitch-muted">Here is a quick overview of your audio transcriptions and processed drafts.</p>
        </div>
        <button
          onClick={() => setField('activeSidebar', 'record')}
          className="bg-stitch-primary hover:bg-stitch-primaryHover text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1"
        >
          Start Drafting
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-stitch-border shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-black text-stitch-text">{totalDrafts}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stitch-muted">Total Drafts</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stitch-border shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-black text-stitch-text">Gemini 3.5</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stitch-muted">Active Model</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stitch-border shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-black text-stitch-text">Active</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stitch-muted">PWA Service Worker</span>
          </div>
        </div>
      </div>

      {/* User Guides */}
      <div className="bg-white border border-stitch-border rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-stitch-text font-sans mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-stitch-primary" />
          Quick Start & Tips
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-stitch-border">
            <h5 className="text-xs font-bold text-stitch-text flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-stitch-primary" />
              1. Unified Voice Transcription
            </h5>
            <p className="text-[11px] text-stitch-muted leading-relaxed">
              Navigate to the <strong>Record</strong> tab. Click <strong>Record</strong> to speak directly, or drag and drop an audio file into the text area to automatically transcribe.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-stitch-border">
            <h5 className="text-xs font-bold text-stitch-text flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-stitch-primary" />
              2. Select Output Formats
            </h5>
            <p className="text-[11px] text-stitch-muted leading-relaxed">
              Use the <strong>Output Mode</strong> dropdown at the bottom of the Compose card to specify the exact template and format you want the AI to structure your notes into.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
