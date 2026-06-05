# ClearDraft — Project Implementation Plan

**Version:** 1.0  
**Date:** June 2026  
**Status:** Draft  
**Reference Documents:** [PRD.md](file:///d:/Projects/ClearDraft/documentation/PRD.md) | [TRD.md](file:///d:/Projects/ClearDraft/documentation/TRD.md)

---

## Phase 1: Environment & Workspace Setup

### 1.1 Backend Setup
1.  Initialize a Python virtual environment inside the `backend` directory.
2.  Install dependencies:
    *   `fastapi`
    *   `uvicorn[standard]`
    *   `google-generativeai` (or `google-genai`)
    *   `python-multipart`
    *   `python-dotenv`
3.  Create a `.env` file containing:
    ```env
    GEMINI_API_KEY=your_free_gemini_api_key_here
    PORT=8000
    ```
4.  Create the backend directory structure:
    ```
    backend/
    ├── app/
    │   ├── __init__.py
    │   ├── main.py
    │   ├── prompts.py
    │   └── services/
    │       ├── __init__.py
    │       └── gemini.py
    ├── .env
    ├── requirements.txt
    └── README.md
    ```

### 1.2 Frontend Setup
1.  Initialize a React project using Vite in the `frontend` directory.
2.  Install Tailwind CSS (v3 or v4) and configure the tailwind configurations.
3.  Install frontend dependencies:
    *   `lucide-react`
    *   `zustand`
    *   `axios`
4.  Create the frontend directory structure:
    ```
    frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── InputPanel.jsx
    │   │   ├── OutputPanel.jsx
    │   │   └── ModeSelector.jsx
    │   ├── store/
    │   │   └── useAppStore.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── tailwind.config.js
    ├── package.json
    └── README.md
    ```

---

## Phase 2: Backend Development (FastAPI)

### 2.1 Base Server Configuration
1.  Configure `main.py` with the FastAPI app instance.
2.  Implement CORS middleware to allow requests from the React development server (typically `http://localhost:5173`).
3.  Add basic health checks (`GET /health`) returning application status.

### 2.2 System Prompt Configuration
1.  Write `prompts.py` containing the prompt templates for the 10 modes defined in the TRD:
    *   `transcribe`, `documentation`, `email`, `linkedin`, `brainstorm`, `meeting_notes`, `formal_letter`, `story`, `todo`, and `prompting`.

### 2.3 Gemini API Service
1.  Implement `services/gemini.py` using `google-generativeai` to authenticate using the environment key.
2.  Write a function `transcribe_audio_file(file_bytes, mime_type)`:
    *   Pass the audio bytes directly to the Gemini API (`gemini-3.5-flash` model).
    *   Provide a transcription instruction prompt: *"Accurately transcribe the audio. Retain exact wording but remove speech disfluencies (like 'um', 'uh', 'like'). Output only the transcript without comments."*
3.  Write a function `generate_polished_content(text, mode, tone=None)`:
    *   Select the correct prompt template from `prompts.py` based on `mode`.
    *   Format it with variables (like `tone`).
    *   Query the `gemini-3.5-flash` model to return the final output.

### 2.4 Endpoints Development
1.  **`POST /api/transcribe`**:
    *   Accept audio file uploads via `UploadFile`.
    *   Enforce a file size limit of 25MB.
    *   Read bytes and forward them to the Gemini audio transcription service.
    *   Return transcription text.
2.  **`POST /api/generate`**:
    *   Accept JSON payload with raw text, mode, tone, and additional guidelines.
    *   Trigger `generate_polished_content`.
    *   Return formatted output.

---

## Phase 3: Frontend State & Static Layout

### 3.1 Global State Store (`useAppStore.js`)
1.  Define the initial Zustand store with state variables:
    *   `activeTab`, `selectedMode`, `tone`, `rawText`, `audioFile`, `transcription`, `outputContent`, `isRecording`, `isProcessing`, `isEditing`.
2.  Create actions for updating these variables, clearing states, and handles for fetching transcription and generation.

### 3.2 Global Styling & Base Layout
1.  Configure `index.css` with the custom font (Outfit/Inter) and color system.
2.  Define the primary grid layout:
    *   Two columns for screen size `>= 960px` (Input left, Output right).
    *   Single-column stack for `< 960px`.
3.  Build the `Header.jsx` with a minimal typographic logo and nav placeholders.

---

## Phase 4: Component Implementation

### 4.1 Mode Selector (`ModeSelector.jsx`)
1.  Render a row of pills or a elegant dropdown representing the 10 modes.
2.  Add hover states, active styling (e.g. highlighted outline or amber background), and tooltips/descriptions for each mode.
3.  Add tone control (Formal, Semi-formal, Friendly) visible specifically when the "Email" mode is selected.

### 4.2 Input Panel (`InputPanel.jsx`)
1.  Implement tabs for switching modes: **Live Voice**, **Text Input**, and **Upload Audio**.
2.  **Text Input Tab:**
    *   A clean, autosizing textarea.
    *   Character counter display.
    *   Ensure raw inputs sync instantly with Zustand state.
3.  **Live Voice Tab:**
    *   Recording control button (microphone icon).
    *   Implement browser Web Speech API for real-time transcription feedback.
    *   Implement MediaRecorder API to record an audio file fallback.
    *   Pulsing recording animation state.
4.  **Upload Audio Tab:**
    *   Drag-and-drop target zone.
    *   File validation (checking type and file sizes `< 25MB`).
    *   Display file name, file size, and upload progress/status.

### 4.3 Output Panel (`OutputPanel.jsx`)
1.  Render the final content area.
2.  Implement "Generate" state spinner / shimmer skeletons while loading.
3.  Add control buttons:
    *   **Copy to Clipboard:** Copy text to clipboard, show a temporary success indicator.
    *   **Edit Inline:** Toggles between read-only pre-wrap text and an editable textarea so users can manually refine content.
    *   **Regenerate:** Re-sends the raw text or transcription to `/api/generate` with the currently active settings.

---

## Phase 5: Client-Server Integration & Error Handling

1.  Connect frontend buttons to backend endpoints via Axios.
2.  Handle file upload flow:
    *   Voice/File uploaded -> Calls `/api/transcribe` -> Updates `transcription` -> Injects into Input textarea for review.
3.  Handle generation flow:
    *   User reviews input -> Clicks "Generate" -> Calls `/api/generate` -> Updates `outputContent` in OutputPanel.
4.  Implement comprehensive error catch wrappers:
    *   Friendly UI prompts for Gemini Rate Limiting (429 status).
    *   Graceful degradation if Web Speech API is not supported in the user's browser.
    *   Validation errors for files over 25MB or unsupported formats.

---

## Phase 6: Design Polish & Verification

1.  **Aesthetics Audit:**
    *   Verify margins, border-radius (8-12px), background colors (`#FAF9F6`), and line-heights align with the minimal, premium design principles.
    *   Add micro-animations for tab changes, button hovers, and recording indicators.
2.  **Responsive Design Checks:**
    *   Ensure correct viewport wrapping down to 375px.
    *   Ensure independent scrolling works for the input and output panels.
3.  **End-to-End Verification:**
    *   Test text generation across all 10 modes.
    *   Test file upload with various audio file formats (MP3, WAV, M4A).
    *   Validate the copy/paste flow and inline editing.
