import { create } from 'zustand';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';

export const useAppStore = create((set, get) => ({
  activeTab: 'text',          // 'voice' | 'text' | 'upload'
  selectedMode: 'transcribe', // 10 modes
  tone: 'formal',             // 'formal' | 'semi-formal' | 'friendly'
  rawText: '',                // raw text or transcription
  audioFile: null,            // uploaded/recorded audio file
  outputContent: '',          // finalized polished content
  isRecording: false,
  isProcessing: false,        // global loading spinner
  isEditing: false,           // inline editor state
  errorMessage: '',
  isOffline: !navigator.onLine,

  // Set individual fields
  setField: (key, value) => set({ [key]: value }),

  // Reset store
  resetStore: () => set({
    rawText: '',
    audioFile: null,
    outputContent: '',
    isRecording: false,
    isProcessing: false,
    isEditing: false,
    errorMessage: ''
  }),

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
