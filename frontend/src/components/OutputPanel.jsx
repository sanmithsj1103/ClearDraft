import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Copy, Check, Edit3, Save, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export default function OutputPanel() {
  const rawText = useAppStore((state) => state.rawText);
  const outputContent = useAppStore((state) => state.outputContent);
  const isProcessing = useAppStore((state) => state.isProcessing);
  const isEditing = useAppStore((state) => state.isEditing);
  const errorMessage = useAppStore((state) => state.errorMessage);
  const isOffline = useAppStore((state) => state.isOffline);
  const setField = useAppStore((state) => state.setField);
  const generateOutput = useAppStore((state) => state.generateOutput);

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!outputContent) return;
    try {
      await navigator.clipboard.writeText(outputContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleToggleEdit = () => {
    setField('isEditing', !isEditing);
  };

  const handleSaveEdit = (newText) => {
    setField('outputContent', newText);
  };

  return (
    <div className="claude-card p-6 min-h-[420px] flex flex-col justify-between">
      
      {/* Title & Actions Bar */}
      <div className="space-y-4 flex-grow flex flex-col">
        <div className="flex items-center justify-between border-b border-brand-border pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-brand-accent" />
            <h2 className="text-sm font-semibold text-brand-text">Polished Output</h2>
          </div>
          
          {outputContent && !isProcessing && (
            <div className="flex items-center space-x-1.5">
              <button
                disabled={isOffline}
                onClick={generateOutput}
                title="Regenerate output"
                className="p-1.5 rounded-lg border border-brand-border hover:bg-neutral-50 text-brand-muted hover:text-brand-text transition-all duration-200"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              
              <button
                onClick={handleToggleEdit}
                title={isEditing ? "Save content" : "Edit content inline"}
                className={`p-1.5 rounded-lg border border-brand-border hover:bg-neutral-50 transition-all duration-200 ${
                  isEditing ? 'text-brand-accent border-brand-accent/50 bg-amber-50/10' : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                {isEditing ? <Save className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
              </button>
              
              <button
                onClick={handleCopy}
                title="Copy to clipboard"
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border bg-white px-2.5 py-1.5 text-xs font-semibold text-brand-text shadow-sm hover:bg-neutral-50 transition-all duration-200"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-brand-muted" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Errors Block */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-200 p-3.5 text-xs text-red-800 my-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Processing Error</p>
              <p className="text-red-700/90 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Content Display */}
        <div className="flex-grow flex flex-col justify-stretch mt-2">
          {isProcessing ? (
            /* Shimmer loading skeleton */
            <div className="space-y-4 w-full py-2">
              <div className="h-4 w-1/4 rounded shimmer-bg" />
              <div className="h-4 w-full rounded shimmer-bg" />
              <div className="h-4 w-11/12 rounded shimmer-bg" />
              <div className="h-4 w-full rounded shimmer-bg" />
              <div className="h-4 w-9/12 rounded shimmer-bg" />
              <div className="h-4 w-full rounded shimmer-bg" />
              <div className="h-4 w-2/3 rounded shimmer-bg" />
            </div>
          ) : outputContent ? (
            isEditing ? (
              /* Editable Content Area */
              <textarea
                value={outputContent}
                onChange={(e) => handleSaveEdit(e.target.value)}
                className="w-full flex-grow min-h-[260px] p-4 border border-brand-accent/30 rounded-lg resize-none focus-ring text-sm bg-amber-50/5 leading-relaxed"
              />
            ) : (
              /* Read-only Content Display */
              <div className="w-full flex-grow p-4 bg-neutral-50/30 rounded-lg text-sm text-brand-text leading-relaxed whitespace-pre-wrap select-text selection:bg-amber-100 border border-transparent overflow-y-auto max-h-[300px]">
                {outputContent}
              </div>
            )
          ) : (
            /* Empty State */
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 text-brand-muted select-none">
              <Sparkles className="h-8 w-8 text-neutral-300 mb-3" />
              <p className="text-sm font-semibold">Ready to draft</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-[240px]">
                Type, record voice, or upload audio files on the left and click Generate to see polished outputs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Generation trigger button - only active if there is rawText inputs and online */}
      <div className="pt-4 border-t border-brand-border mt-4">
        <button
          onClick={generateOutput}
          disabled={isProcessing || !rawText.trim() || isOffline}
          className={`w-full py-2.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
            isProcessing || !rawText.trim() || isOffline
              ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
              : 'bg-neutral-900 border border-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-accent" />
          {isProcessing ? 'Generating Polished Content...' : 'Generate Polished Text'}
        </button>
      </div>
    </div>
  );
}
