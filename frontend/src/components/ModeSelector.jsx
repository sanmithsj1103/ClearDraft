import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  FileText, BookOpen, Mail, Share2, Lightbulb, 
  ClipboardList, Scroll, PenTool, CheckSquare, Terminal 
} from 'lucide-react';

const MODES = [
  { id: 'transcribe', label: 'Clean Transcript', icon: FileText, desc: 'Punctuate & remove fillers' },
  { id: 'documentation', label: 'Documentation', icon: BookOpen, desc: 'Structured Markdown docs' },
  { id: 'email', label: 'Email Draft', icon: Mail, desc: 'Professional emails & replies' },
  { id: 'linkedin', label: 'LinkedIn Post', icon: Share2, desc: 'Engaging social content' },
  { id: 'brainstorm', label: 'Brainstorm', icon: Lightbulb, desc: 'Elaborate thoughts & items' },
  { id: 'meeting_notes', label: 'Meeting Notes', icon: ClipboardList, desc: 'Summary, decisions, actions' },
  { id: 'formal_letter', label: 'Formal Letter', icon: Scroll, desc: 'Business letter templates' },
  { id: 'story', label: 'Creative Story', icon: PenTool, desc: 'Narratives & short stories' },
  { id: 'todo', label: 'Task Checklist', icon: CheckSquare, desc: 'Clean actionable TODO lists' },
  { id: 'prompting', label: 'Prompt Builder', icon: Terminal, desc: 'Constructed system prompts' }
];

const TONES = [
  { id: 'formal', label: 'Formal' },
  { id: 'semi-formal', label: 'Semi-Formal' },
  { id: 'friendly', label: 'Friendly' }
];

export default function ModeSelector() {
  const selectedMode = useAppStore((state) => state.selectedMode);
  const tone = useAppStore((state) => state.tone);
  const setField = useAppStore((state) => state.setField);
  const isProcessing = useAppStore((state) => state.isProcessing);

  return (
    <div className="w-full space-y-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Select Output Format</h3>
        
        {/* Horizontal scroll on mobile, flex wrap on desktop */}
        <div className="flex w-full items-stretch gap-2 overflow-x-auto pb-2 scrollbar-thin md:flex-wrap md:overflow-x-visible">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                disabled={isProcessing}
                onClick={() => setField('selectedMode', mode.id)}
                className={`flex flex-shrink-0 flex-col items-start justify-between text-left p-3 rounded-xl border transition-all duration-200 w-36 md:w-[19%] select-none ${
                  isSelected
                    ? 'border-brand-accent bg-white shadow-sm ring-1 ring-brand-accent'
                    : 'border-brand-border bg-white hover:border-neutral-300 hover:shadow-sm'
                } ${isProcessing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-50 text-brand-accent' : 'bg-neutral-50 text-brand-muted'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />}
                </div>
                <div>
                  <span className="block text-xs font-bold text-brand-text truncate w-full">{mode.label}</span>
                  <span className="block text-[10px] text-brand-muted truncate w-full mt-0.5">{mode.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional Email Tone Controls */}
      {selectedMode === 'email' && (
        <div className="flex items-center space-x-3 rounded-lg border border-brand-border bg-white p-3 transition-all duration-300">
          <span className="text-xs font-semibold text-brand-muted">Email Tone:</span>
          <div className="flex items-center gap-1.5">
            {TONES.map((t) => (
              <button
                key={t.id}
                disabled={isProcessing}
                onClick={() => setField('tone', t.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 border ${
                  tone === t.id
                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm'
                    : 'bg-white border-brand-border text-brand-text hover:bg-neutral-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
