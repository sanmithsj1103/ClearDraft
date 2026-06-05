import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Mic, MicOff, Sparkles, FileText, ChevronDown, UploadCloud } from 'lucide-react';

export default function ComposeCard() {
  const rawText = useAppStore((state) => state.rawText);
  const selectedMode = useAppStore((state) => state.selectedMode);
  const tone = useAppStore((state) => state.tone);
  const isRecording = useAppStore((state) => state.isRecording);
  const isProcessing = useAppStore((state) => state.isProcessing);
  const isOffline = useAppStore((state) => state.isOffline);
  
  const setField = useAppStore((state) => state.setField);
  const generateOutput = useAppStore((state) => state.generateOutput);
  const transcribeAudioFile = useAppStore((state) => state.transcribeAudioFile);

  const [dragActive, setDragActive] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Initialize browser speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setField('rawText', getStoreText() + finalTranscript);
        }
      };

      recognition.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        if (e.error === 'not-allowed') {
          alert('Microphone permission denied. Please enable it in browser settings.');
          stopSpeechRecognition();
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const getStoreText = () => useAppStore.getState().rawText;

  const startRecording = async () => {
    audioChunksRef.current = [];
    setField('isRecording', true);

    // 1. Client Speech
    if (speechSupported && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech recognition start issue:', err);
      }
    }

    // 2. Media recorder
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        
        stream.getTracks().forEach((track) => track.stop());

        // If Web Speech API wasn't supported, we upload the file automatically
        if (!speechSupported && !isOffline) {
          await transcribeAudioFile(file);
        }
      };

      mediaRecorder.start();
    } catch (err) {
      console.error('Microphone access failed:', err);
      stopSpeechRecognition();
    }
  };

  const stopSpeechRecognition = () => {
    setField('isRecording', false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const maxBytes = 25 * 1024 * 1024;
      if (file.size > maxBytes) {
        alert('File size exceeds the 25MB limit.');
        return;
      }
      if (!isOffline) {
        await transcribeAudioFile(file);
      }
    }
  };

  const MODES = [
    { id: 'transcribe', label: 'General Transcription' },
    { id: 'documentation', label: 'Structured Documentation' },
    { id: 'email', label: 'Email Draft' },
    { id: 'linkedin', label: 'LinkedIn Post' },
    { id: 'brainstorm', label: 'Brainstorm Outline' },
    { id: 'meeting_notes', label: 'Meeting Notes' },
    { id: 'formal_letter', label: 'Formal Letter' },
    { id: 'story', label: 'Short Narrative Story' },
    { id: 'todo', label: 'Action Checklist' },
    { id: 'prompting', label: 'AI Prompt Builder' }
  ];

  return (
    <div 
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className="bg-white border border-stitch-border rounded-2xl p-6 shadow-sm relative transition-all duration-300"
    >
      
      {/* File drag-and-drop overlay */}
      {dragActive && (
        <div className="absolute inset-0 bg-stitch-primary/5 border-2 border-dashed border-stitch-primary rounded-2xl flex flex-col items-center justify-center z-50 backdrop-blur-sm transition-all">
          <UploadCloud className="h-12 w-12 text-stitch-primary animate-bounce mb-3" />
          <span className="text-sm font-bold text-stitch-primary">Drop audio file here to transcribe</span>
          <span className="text-[10px] text-stitch-muted mt-1">Accepts MP3, WAV, M4A, WebM up to 25MB</span>
        </div>
      )}

      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 select-none">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-stitch-primary/5 text-stitch-primary border border-stitch-primary/10">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-stitch-text font-sans">Compose & Process</h3>
          </div>
        </div>

        {/* Counter and Record Button */}
        <div className="flex items-center space-x-4">
          <span className="text-xs text-stitch-muted font-medium">
            {rawText.length} characters
          </span>
          
          <button
            onClick={isRecording ? stopSpeechRecognition : startRecording}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
              isRecording 
                ? 'bg-neutral-900 border border-neutral-900 text-white animate-pulse' 
                : 'bg-stitch-record border border-stitch-record text-white hover:bg-stitch-recordHover active:scale-[0.98]'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            {isRecording ? 'Stop' : 'Record'}
          </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          value={rawText}
          disabled={isProcessing}
          onChange={(e) => setField('rawText', e.target.value)}
          placeholder="Start typing or click record to transcribe your thoughts... (or drag and drop audio files here to transcribe)"
          className="w-full h-52 py-2 border-0 resize-none focus:outline-none focus:ring-0 text-sm leading-relaxed placeholder:text-slate-400 bg-transparent"
        />
      </div>

      {/* Footer Controls Row */}
      <div className="flex items-center justify-between pt-4 border-t border-stitch-border mt-2 select-none">
        
        {/* Output Mode Selection Dropdown */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stitch-muted mb-1">
              Output Mode
            </span>
            <div className="relative min-w-48">
              <select
                value={selectedMode}
                disabled={isProcessing}
                onChange={(e) => setField('selectedMode', e.target.value)}
                className="w-full bg-slate-50 border border-stitch-border rounded-lg px-3 py-2 text-xs font-semibold text-stitch-text focus-ring appearance-none pr-8 cursor-pointer hover:bg-slate-100 transition-all"
              >
                {MODES.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stitch-muted pointer-events-none" />
            </div>
          </div>

          {/* Inline Email Tone Selector if selectedMode is Email */}
          {selectedMode === 'email' && (
            <div className="flex flex-col transition-all duration-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stitch-muted mb-1">
                Tone
              </span>
              <div className="flex bg-slate-50 border border-stitch-border rounded-lg p-0.5">
                {['formal', 'semi-formal', 'friendly'].map((t) => (
                  <button
                    key={t}
                    disabled={isProcessing}
                    onClick={() => setField('tone', t)}
                    className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold capitalize transition-all ${
                      tone === t 
                        ? 'bg-white text-stitch-primary shadow-sm' 
                        : 'text-stitch-muted hover:text-stitch-text'
                    }`}
                  >
                    {t.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={generateOutput}
          disabled={isProcessing || !rawText.trim() || isOffline}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98] ${
            isProcessing || !rawText.trim() || isOffline
              ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-stitch-primary border border-stitch-primary text-white hover:bg-stitch-primaryHover'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-white/90" />
          {isProcessing ? 'Processing...' : 'Generate Draft'}
        </button>
      </div>
    </div>
  );
}
