import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Mic, MicOff, Type, UploadCloud, AlertCircle, FileAudio, Trash2 } from 'lucide-react';

export default function InputPanel() {
  const activeTab = useAppStore((state) => state.activeTab);
  const rawText = useAppStore((state) => state.rawText);
  const audioFile = useAppStore((state) => state.audioFile);
  const isRecording = useAppStore((state) => state.isRecording);
  const isProcessing = useAppStore((state) => state.isProcessing);
  const isOffline = useAppStore((state) => state.isOffline);
  const setField = useAppStore((state) => state.setField);
  const transcribeAudioFile = useAppStore((state) => state.transcribeAudioFile);

  const [dragActive, setDragActive] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  // Refs for audio capturing
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  // Initialize Speech Recognition
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
          setField('rawText', rawText + finalTranscript);
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
  }, [rawText]);

  // Audio Recording (MediaRecorder) for backend transcription fallback
  const startRecording = async () => {
    if (isOffline) {
      alert("API transcription is offline. Using client-side speech processing if available.");
    }
    
    audioChunksRef.current = [];
    setField('isRecording', true);

    // 1. Attempt client-side Speech Recognition first
    if (speechSupported && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech recognition start issue:', err);
      }
    }

    // 2. Also record raw bytes via MediaRecorder as fallback / backup file
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
        const file = new File([audioBlob], 'live_recording.webm', { type: 'audio/webm' });
        setField('audioFile', file);
        
        // Stop all track media streams
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
      await processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (file) => {
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm', 'audio/x-m4a', 'audio/m4a'];
    const maxBytes = 25 * 1024 * 1024; // 25 MB

    if (file.size > maxBytes) {
      alert('File size exceeds the 25MB limit.');
      return;
    }

    setField('audioFile', file);
    if (!isOffline) {
      await transcribeAudioFile(file);
    }
  };

  const handleClear = () => {
    setField('rawText', '');
    setField('audioFile', null);
  };

  return (
    <div className="claude-card p-6 min-h-[420px] flex flex-col justify-between">
      
      {/* Tabs */}
      <div>
        <div className="flex border-b border-brand-border pb-3 mb-4 space-x-6">
          <button
            onClick={() => setField('activeTab', 'text')}
            className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 -mb-[13px] transition-all ${
              activeTab === 'text'
                ? 'border-brand-accent text-brand-text'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <Type className="h-4 w-4" />
            Text Input
          </button>
          
          <button
            onClick={() => setField('activeTab', 'voice')}
            className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 -mb-[13px] transition-all ${
              activeTab === 'voice'
                ? 'border-brand-accent text-brand-text'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <Mic className="h-4 w-4" />
            Live Voice
          </button>
          
          <button
            onClick={() => setField('activeTab', 'upload')}
            className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 -mb-[13px] transition-all ${
              activeTab === 'upload'
                ? 'border-brand-accent text-brand-text'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            Upload Audio
          </button>
        </div>

        {/* Tab Contents */}
        
        {/* TEXT INPUT TAB */}
        {activeTab === 'text' && (
          <div className="space-y-2">
            <textarea
              value={rawText}
              disabled={isProcessing}
              onChange={(e) => setField('rawText', e.target.value)}
              placeholder="Paste or type your raw, chaotic thoughts here... Write freely without worrying about grammar or structure."
              className="w-full h-64 p-4 border border-brand-border rounded-lg resize-none focus-ring text-sm bg-neutral-50/30"
            />
            <div className="flex items-center justify-between text-xs text-brand-muted px-1">
              <span>{rawText.length} characters</span>
              {rawText.length > 0 && (
                <button 
                  onClick={handleClear} 
                  className="flex items-center gap-1 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear Input
                </button>
              )}
            </div>
          </div>
        )}

        {/* LIVE VOICE TAB */}
        {activeTab === 'voice' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            
            {/* Real-time browser speech recognition indicator */}
            {!speechSupported && (
              <div className="w-full flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Speech Recognition Unsupported</p>
                  <p className="text-amber-700/90 mt-0.5">Your browser doesn't support real-time speech transcription. We will automatically record your voice and transcribe it backend instead.</p>
                </div>
              </div>
            )}

            {/* Micro / Audio Status Display */}
            <div className="relative flex items-center justify-center">
              {isRecording && (
                <>
                  <span className="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-brand-accent/20 opacity-75" />
                  <span className="absolute inline-flex h-32 w-32 animate-pulse rounded-full bg-brand-accent/10 opacity-55" />
                </>
              )}
              <button
                disabled={isProcessing}
                onClick={isRecording ? stopSpeechRecognition : startRecording}
                className={`z-10 flex h-20 w-20 items-center justify-center rounded-full border shadow-md transition-all duration-300 ${
                  isRecording 
                    ? 'bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-800' 
                    : 'bg-white border-brand-border text-brand-accent hover:border-neutral-300 hover:shadow-lg'
                }`}
              >
                {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </button>
            </div>

            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-brand-text">
                {isRecording ? 'Listening...' : 'Click to start recording'}
              </p>
              <p className="text-xs text-brand-muted">
                {isRecording ? 'Speak clearly. Tap again to finish recording.' : 'Captured transcripts will appear in the text editor below.'}
              </p>
            </div>

            {/* Real-time text preview under microphone */}
            {rawText && (
              <div className="w-full space-y-2 mt-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">Live Transcript</label>
                <div className="w-full max-h-36 overflow-y-auto p-3 bg-neutral-50 border border-brand-border rounded-lg text-xs leading-relaxed">
                  {rawText}
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={handleClear} 
                    className="flex items-center gap-1 text-xs text-brand-muted hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear Transcript
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* UPLOAD FILE TAB */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-brand-accent bg-amber-50/10' 
                  : 'border-brand-border hover:border-neutral-300 bg-neutral-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud className="h-10 w-10 text-brand-muted mb-3" />
              <p className="text-sm font-bold text-brand-text">Drag & drop your audio file here</p>
              <p className="text-xs text-brand-muted mt-1">Accepts MP3, WAV, M4A, or WebM files up to 25MB</p>
            </div>

            {audioFile && (
              <div className="flex items-center justify-between p-3 rounded-lg border border-brand-border bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-neutral-50 text-brand-muted">
                    <FileAudio className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-text truncate max-w-xs">{audioFile.name}</p>
                    <p className="text-[10px] text-brand-muted">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isOffline ? (
                    <span className="text-[10px] text-red-600 font-semibold bg-red-50 border border-red-100 px-2 py-0.5 rounded">Offline (Cant process)</span>
                  ) : null}
                  <button
                    onClick={handleClear}
                    className="p-1 rounded-lg text-brand-muted hover:text-red-600 hover:bg-neutral-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Display transcription result if we transcribed via upload */}
            {rawText && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">Transcribed Text</label>
                <textarea
                  value={rawText}
                  onChange={(e) => setField('rawText', e.target.value)}
                  className="w-full h-32 p-3 border border-brand-border rounded-lg resize-none focus-ring text-xs bg-neutral-50/30"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Warning if offline */}
      {isOffline && (
        <div className="w-full flex items-center gap-2 rounded-lg bg-neutral-100 border border-brand-border px-3 py-2 text-xs text-brand-muted mt-4">
          <AlertCircle className="h-4 w-4" />
          <span>Polishing operates server-side and is disabled offline. Feel free to draft text locally.</span>
        </div>
      )}
    </div>
  );
}
