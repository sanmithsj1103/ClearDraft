import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import axios from 'axios';
import { 
  Sparkles, Copy, Check, Edit3, Save, Zap, ShieldAlert, 
  Lock, AlertCircle, FileText, Download, RotateCcw 
} from 'lucide-react';

export default function OutputCard() {
  const outputContent = useAppStore((state) => state.outputContent);
  const selectedMode = useAppStore((state) => state.selectedMode);
  const slidesData = useAppStore((state) => state.slidesData);
  const isProcessing = useAppStore((state) => state.isProcessing);
  const isEditing = useAppStore((state) => state.isEditing);
  const errorMessage = useAppStore((state) => state.errorMessage);
  const isOffline = useAppStore((state) => state.isOffline);
  
  const setField = useAppStore((state) => state.setField);
  const generateOutput = useAppStore((state) => state.generateOutput);

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPPT = async () => {
    if (!slidesData) return;
    setDownloading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/download-ppt', {
        slides: slidesData
      }, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'presentation.pptx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PowerPoint file:', err);
      alert('Failed to build and download PowerPoint file.');
    } finally {
      setDownloading(false);
    }
  };

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
    <div className="w-full">
      
      {/* PROCESSING STATE: SKELETON SHIMMER */}
      {isProcessing && (
        <div className="bg-white border border-stitch-border rounded-2xl p-6 shadow-sm min-h-[280px] flex flex-col justify-between select-none">
          <div className="space-y-4 flex-grow py-2">
            <div className="h-4 w-1/4 rounded shimmer-bg" />
            <div className="h-4 w-full rounded shimmer-bg" />
            <div className="h-4 w-11/12 rounded shimmer-bg" />
            <div className="h-4 w-full rounded shimmer-bg" />
            <div className="h-4 w-9/12 rounded shimmer-bg" />
            <div className="h-4 w-full rounded shimmer-bg" />
            <div className="h-4 w-2/3 rounded shimmer-bg" />
          </div>
          <div className="text-center text-xs text-stitch-muted mt-4">
            Polishing draft using Gemini 3.5 Flash...
          </div>
        </div>
      )}

      {/* POPULATED OUTPUT STATE */}
      {outputContent && !isProcessing && (
        <div className="bg-white border border-stitch-border rounded-2xl p-6 shadow-sm min-h-[280px] flex flex-col justify-between transition-all duration-300">
          
          <div className="flex-grow">
            {/* Header / Actions Bar */}
            <div className="flex items-center justify-between border-b border-stitch-border pb-3 mb-4 select-none">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-stitch-primary" />
                <h4 className="text-sm font-bold text-stitch-text font-sans">Polished Result</h4>
              </div>
              
              <div className="flex items-center space-x-1.5">
                {/* Re-run generation */}
                <button
                  disabled={isOffline}
                  onClick={generateOutput}
                  title="Regenerate"
                  className="p-2 border border-stitch-border rounded-lg text-stitch-muted hover:text-stitch-text hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                
                {/* Edit inline */}
                <button
                  onClick={handleToggleEdit}
                  title={isEditing ? "Save draft" : "Edit inline"}
                  className={`p-2 border rounded-lg transition-all cursor-pointer ${
                    isEditing 
                      ? 'border-stitch-primary/30 bg-stitch-primary/5 text-stitch-primary' 
                      : 'border-stitch-border text-stitch-muted hover:text-stitch-text hover:bg-slate-50'
                  }`}
                >
                  {isEditing ? <Save className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
                </button>

                {/* Download PPT */}
                {selectedMode === 'ppt' && slidesData && (
                  <button
                    disabled={downloading || isOffline}
                    onClick={handleDownloadPPT}
                    className={`inline-flex items-center gap-1.5 rounded-lg border border-stitch-primary/30 bg-stitch-primary/5 px-3 py-2 text-xs font-semibold text-stitch-primary shadow-sm hover:bg-stitch-primary/10 transition-all select-none cursor-pointer ${
                      downloading || isOffline ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Download className="h-3.5 w-3.5" />
                    {downloading ? 'Downloading...' : 'Download PPT'}
                  </button>
                )}

                {/* Copy */}
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stitch-border bg-white px-3 py-2 text-xs font-semibold text-stitch-text shadow-sm hover:bg-slate-50 transition-all select-none cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-stitch-muted" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Error notifications */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-200 p-3.5 text-xs text-red-800 my-3 select-none">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Generation Failed</p>
                  <p className="text-red-700/95 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Text Editor Area */}
            <div className="mt-2 min-h-[160px] flex flex-col justify-stretch">
              {isEditing ? (
                <textarea
                  value={outputContent}
                  onChange={(e) => handleSaveEdit(e.target.value)}
                  className="w-full flex-grow p-4 border border-stitch-primary/30 bg-slate-50/50 rounded-xl resize-none focus-ring text-sm leading-relaxed"
                />
              ) : (
                <div className="w-full flex-grow p-4 bg-slate-50 rounded-xl text-sm leading-relaxed whitespace-pre-wrap select-text selection:bg-stitch-primary/10 border border-transparent overflow-y-auto max-h-[340px]">
                  {outputContent}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EMPTY STATE: STITCH DASHED CONTAINER */}
      {!outputContent && !isProcessing && (
        <div className="bg-white border-2 border-dashed border-stitch-primary/20 rounded-2xl p-10 min-h-[340px] flex flex-col items-center justify-between text-center select-none shadow-sm transition-all duration-300">
          
          <div className="flex-grow flex flex-col items-center justify-center py-4">
            {/* Center Icon Box */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 mb-4 shadow-sm">
              <FileText className="h-10 w-10" />
            </div>
            
            <h3 className="text-lg font-bold text-stitch-text font-sans">
              Generated drafts will appear here
            </h3>
            
            <p className="text-xs text-stitch-muted max-w-lg mt-2 leading-relaxed">
              Once you finish recording or typing your notes, click "Generate Draft" to let the AI process your content into your selected format.
            </p>
          </div>

          {/* Bottom Features Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            
            <div className="flex flex-col items-center p-4 rounded-xl border border-stitch-border bg-slate-50/50 shadow-sm">
              <div className="p-2 rounded-lg bg-stitch-primary/5 text-stitch-primary mb-2">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-stitch-text">Fast Processing</span>
            </div>

            <div className="flex flex-col items-center p-4 rounded-xl border border-stitch-border bg-slate-50/50 shadow-sm">
              <div className="p-2 rounded-lg bg-stitch-primary/5 text-stitch-primary mb-2">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-stitch-text">High Accuracy</span>
            </div>

            <div className="flex flex-col items-center p-4 rounded-xl border border-stitch-border bg-slate-50/50 shadow-sm">
              <div className="p-2 rounded-lg bg-stitch-primary/5 text-stitch-primary mb-2">
                <Lock className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-stitch-text">Secure Encryption</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
