import React from 'react';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';

export default function App() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-6">
        
        {/* Banner introduction details */}
        <div className="space-y-1.5 max-w-3xl">
          <h2 className="text-xl font-extrabold text-brand-text tracking-tight sm:text-2xl font-sans">
            Polish raw thoughts into professional draft formats.
          </h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            Record spoken audio directly, upload pre-recorded notes, or type unstructured text outlines. 
            Choose an output format below, and our Gemini-powered engine will structure, correct, and rewrite the content instantly.
          </p>
        </div>

        {/* Output formatting selector */}
        <ModeSelector />

        {/* Dynamic Dual Panel Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Input Side: voice transcription, uploaded file handler, textarea editor */}
          <InputPanel />

          {/* Output Side: formatted plain text display, copying helper, inline correction controls */}
          <OutputPanel />
        </div>
      </main>

      {/* Simple Footer details */}
      <footer className="w-full border-t border-brand-border py-4 bg-white/50">
        <div className="mx-auto max-w-7xl px-4 text-center text-[10px] text-brand-muted">
          ClearDraft &copy; {new Date().getFullYear()} &bull; Built with React, Tailwind, FastAPI and Gemini 1.5 Flash.
        </div>
      </footer>
    </div>
  );
}
