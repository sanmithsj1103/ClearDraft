import { create } from 'zustand';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';

export const useAppStore = create((set, get) => ({
  activeSidebar: 'record',      // 'home' | 'drafts' | 'record' | 'settings'
  selectedMode: 'transcribe',   // maps to backend system prompts
  tone: 'formal',               // 'formal' | 'semi-formal' | 'friendly'
  rawText: '',                  // input text
  outputContent: '',            // polished draft
  isRecording: false,
  isProcessing: false,
  isEditing: false,             // inline editor flag
  errorMessage: '',
  searchQuery: '',
  isOffline: !navigator.onLine,
  
  // Local list of drafts for portfolio demonstration
  draftsList: [
    {
      id: 1,
      title: "Marketing Campaign Brainstorm",
      mode: "brainstorm",
      date: "June 04, 2026",
      input: "We should launch a summer campaign for ClearDraft focusing on students. Offer 30% discount.",
      output: "🧠 Summer Campaign expansion:\n\n1. **Core Concept:** Summer Promotion targeting students.\n2. **Discount structure:** 30% off standard pricing tiers.\n3. **Channels:** TikTok and Instagram."
    },
    {
      id: 2,
      title: "Meeting Notes: ClearDraft Sprint",
      mode: "meeting_notes",
      date: "June 03, 2026",
      input: "Sprint planning meeting with team. Alex to build frontend. Sanmith to configure Gemini API.",
      output: "📋 Sprint Planning Meeting Notes:\n\n**Attendees:** Alex, Sanmith\n\n**Action Items:**\n- [ ] Alex: Build custom PWA frontend components\n- [ ] Sanmith: Link Gemini API backend router"
    }
  ],

  setField: (key, value) => set({ [key]: value }),

  // Reset the current workspace
  resetWorkspace: () => set({
    rawText: '',
    outputContent: '',
    isRecording: false,
    isProcessing: false,
    isEditing: false,
    errorMessage: ''
  }),

  // Add current output to drafts
  saveCurrentDraft: () => {
    const { outputContent, rawText, selectedMode, draftsList } = get();
    if (!outputContent) return;

    // Infer title
    const firstLine = outputContent.split('\n')[0].replace(/[#*_\-]/g, '').trim();
    const title = firstLine.length > 5 ? firstLine.substring(0, 35) + "..." : `${selectedMode.toUpperCase()} Draft`;

    const newDraft = {
      id: Date.now(),
      title,
      mode: selectedMode,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      input: rawText,
      output: outputContent
    };

    set({ draftsList: [newDraft, ...draftsList] });
  },

  // Delete draft
  deleteDraft: (id) => {
    const filtered = get().draftsList.filter(d => d.id !== id);
    set({ draftsList: filtered });
  },

  // Transcribe file on backend
  transcribeAudioFile: async (file) => {
    set({ isProcessing: true, errorMessage: '' });
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        set({ 
          rawText: response.data.transcript,
          isProcessing: false 
        });
      } else {
        throw new Error(response.data.error || 'Transcription failed');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || error.message || 'Error connecting to transcription server.';
      set({ 
        errorMessage: msg, 
        isProcessing: false 
      });
    }
  },

  // Polish raw text using Gemini backend
  generateOutput: async () => {
    const { rawText, selectedMode, tone } = get();
    if (!rawText.trim()) {
      set({ errorMessage: 'Please enter or transcribe some text first.' });
      return;
    }

    set({ isProcessing: true, errorMessage: '', isEditing: false });

    try {
      const response = await axios.post(`${BACKEND_URL}/api/generate`, {
        text: rawText,
        mode: selectedMode,
        tone: selectedMode === 'email' ? tone : null
      });

      if (response.data.success) {
        set({ 
          outputContent: response.data.output,
          isProcessing: false 
        });
        // Auto-save to drafts list on successful generation
        get().saveCurrentDraft();
      } else {
        throw new Error(response.data.error || 'Generation failed');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || error.message || 'Error connecting to polishing server.';
      set({ 
        errorMessage: msg, 
        isProcessing: false 
      });
    }
  }
}));

// Setup window offline/online event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useAppStore.getState().setField('isOffline', false));
  window.addEventListener('offline', () => useAppStore.getState().setField('isOffline', true));
}
