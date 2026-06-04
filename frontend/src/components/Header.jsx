import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Download, Wifi, WifiOff } from 'lucide-react';

export default function Header() {
  const isOffline = useAppStore((state) => state.isOffline);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and branding */}
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border bg-white shadow-sm">
            <svg viewBox="0 0 512 512" className="h-6 w-6">
              <circle cx="256" cy="256" r="240" fill="#FAF9F6" stroke="#E5E5E0" stroke-width="8"/>
              <circle cx="256" cy="256" r="140" fill="#D97706" fill-opacity="0.08"/>
              <g transform="translate(156, 176) scale(1)">
                <path d="M 40 20 H 160" stroke="#111111" stroke-width="14" stroke-linecap="round"/>
                <path d="M 40 55 H 160" stroke="#111111" stroke-width="14" stroke-linecap="round"/>
                <rect x="0" y="10" width="24" height="60" rx="12" fill="#D97706" stroke="#111111" stroke-width="8"/>
              </g>
            </svg>
          </div>
          <div>
            <h1 className="font-sans font-extrabold text-lg tracking-tight text-brand-text">ClearDraft</h1>
            <p className="text-[10px] text-brand-muted uppercase tracking-wider font-semibold">AI Assistant</p>
          </div>
        </div>

        {/* Action Controls & Badges */}
        <div className="flex items-center space-x-3">
          {/* Offline/Online indicators */}
          {isOffline ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-2 py-1 text-xs font-medium text-red-700">
              <WifiOff className="h-3.5 w-3.5" />
              Offline Mode (Local editing)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-2.5 py-1 text-xs font-medium text-green-700">
              <Wifi className="h-3.5 w-3.5" />
              Connected
            </span>
          )}

          {/* PWA Install Button */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-white px-3 py-1.5 text-xs font-semibold text-brand-text shadow-sm hover:bg-neutral-50 transition-all duration-200"
            >
              <Download className="h-3.5 w-3.5 text-brand-accent" />
              Install App
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
