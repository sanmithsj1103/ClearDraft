import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Settings, Shield, HardDrive, Trash2, Check, ExternalLink } from 'lucide-react';

export default function SettingsPanel() {
  const isOffline = useAppStore((state) => state.isOffline);
  const setField = useAppStore((state) => state.setField);
  const resetStore = useAppStore((state) => state.resetStore);

  const [cleared, setCleared] = useState(false);
  const [lang, setLang] = useState('en-US');

  const handleClearApp = () => {
    if (confirm("This will erase all locally saved drafts. Are you sure?")) {
      setField('draftsList', []);
      resetStore();
      setCleared(true);
      setTimeout(() => setCleared(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl select-none">
      
      {/* General API Info */}
      <div className="bg-white border border-stitch-border rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="font-bold text-stitch-text font-sans flex items-center gap-2">
          <Shield className="h-4.5 w-4.5 text-stitch-primary" />
          API & Connection Settings
        </h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stitch-muted block mb-1">Backend REST API Endpoint</label>
            <input
              type="text"
              defaultValue="http://localhost:8000"
              disabled
              className="w-full px-3 py-2 border border-stitch-border rounded-lg text-xs bg-slate-50 text-stitch-muted cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stitch-muted block mb-1">Connection Health</label>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isOffline ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
            }`}>
              {isOffline ? 'Offline - Backend Unreachable' : 'Healthy - Connected'}
            </span>
          </div>
        </div>
      </div>

      {/* Voice Settings */}
      <div className="bg-white border border-stitch-border rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="font-bold text-stitch-text font-sans flex items-center gap-2">
          <Settings className="h-4.5 w-4.5 text-stitch-primary" />
          Real-time Transcription Options
        </h4>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-stitch-muted block mb-1">Web Speech Language</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full bg-slate-50 border border-stitch-border rounded-lg px-3 py-2 text-xs font-semibold text-stitch-text cursor-pointer hover:bg-slate-100 transition-all focus-ring"
          >
            <option value="en-US">English (United States)</option>
            <option value="en-GB">English (United Kingdom)</option>
            <option value="es-ES">Spanish (Spain)</option>
            <option value="fr-FR">French (France)</option>
            <option value="de-DE">German (Germany)</option>
          </select>
        </div>
      </div>

      {/* Data management */}
      <div className="bg-white border border-stitch-border rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="font-bold text-stitch-text font-sans flex items-center gap-2 text-red-600">
          <HardDrive className="h-4.5 w-4.5 text-red-500" />
          Local Data Management
        </h4>
        <div className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/10">
          <div>
            <h5 className="text-xs font-bold text-stitch-text">Clear Stored Drafts</h5>
            <p className="text-[10px] text-stitch-muted mt-0.5">Erases all drafts from the local list store.</p>
          </div>
          <button
            onClick={handleClearApp}
            className="px-4 py-2 border border-red-200 bg-white hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
          >
            {cleared ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Trash2 className="h-3.5 w-3.5" />}
            {cleared ? 'Cleared' : 'Clear Data'}
          </button>
        </div>
      </div>

    </div>
  );
}
