# ClearDraft — AI Voice Transcription & Drafting Assistant

ClearDraft is an AI-powered voice and text transcription Progressive Web Application (PWA) that converts raw, unstructured spoken or typed thoughts into polished, professionally formatted draft content. 

Inspired by the clean, minimal aesthetic of Claude.ai, ClearDraft is built to run entirely cost-free using the **Google Gemini 2.5 Flash API** for native transcription and content restructuring.

---

## 🌟 Key Features

*   **Multi-Modal Input Support:**
    *   **Text Input:** Paste or write raw, chaotic outlines directly into a clean, auto-sizing editor.
    *   **Live Voice Recording:** Capture speech in real-time using the browser's Web Speech API (with MediaRecorder fallback).
    *   **Audio Upload:** Drag and drop audio files (`.mp3`, `.wav`, `.m4a`, `.webm` up to 25MB) directly.
*   **10 Specialized AI Output Modes:**
    *   *Clean Transcript:* Punctuate and structure verbal statements while removing filler words.
    *   *Documentation:* Format notes into structured Markdown documentation (headings, lists).
    *   *Email Draft:* Generate professionally structured emails based on three selected tones (Formal, Semi-Formal, Friendly).
    *   *LinkedIn Post:* Create highly engaging posts complete with hooks, emoji, CTAs, and hashtags.
    *   *Brainstorming:* Expand fragmented ideas into categorized outlines and growth suggestions.
    *   *Meeting Notes:* Organize discussions into Summary, Attendees, Decisions, and Action checklists.
    *   *Formal Letter:* Lay out structured business letters with date blocks and formal salutations.
    *   *Creative Story:* Rewrite raw storylines into immersive narrative prose.
    *   *Task Checklist:* Extract and prioritize checkbox checklists.
    *   *Prompt Builder:* Formulate structured prompt blocks for other tools (like ChatGPT, Claude, Midjourney).
*   **Polished Output Actions:** One-click copy, inline manual editing, and immediate regeneration.
*   **Complete PWA Capability:** Installable on desktop/mobile and fully functional offline using custom Service Worker caching.

---

## 🛠️ Technology Stack

### Frontend
*   **Core:** React (Vite-based)
*   **Styles:** Tailwind CSS (Claude-inspired color tokens, minimal layout)
*   **State Management:** Zustand (boilerplate-free reactive global store)
*   **PWA Integrations:** Custom Service Worker (`sw.js`), Web Manifest (`manifest.json`), and high-resolution scalable vector icons (`icon.svg`)
*   **Icons:** Lucide React

### Backend
*   **Core:** Python 3.9+ with FastAPI
*   **Server:** Uvicorn ASGI
*   **LLM & Transcription:** Google GenAI SDK (`google-generativeai` interfacing with `gemini-2.5-flash`)
*   **Utilities:** Dotenv (environment credentials), Python-Multipart (multipart form-data parsing)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.0 or higher)
*   [Python](https://www.python.org/downloads/) (v3.9 - v3.12)

---

### Step 1: Clone & Configure Backend

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Create a virtual environment and install dependencies:
    ```bash
    python -m venv .venv
    # Activate in Windows PowerShell:
    .\.venv\Scripts\Activate.ps1
    # Install packages:
    pip install -r requirements.txt
    ```
3.  Create a `.env` file in the `backend` folder and add your **Google Gemini API Key**:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    PORT=8000
    ```
4.  Start the backend API server:
    ```bash
    uvicorn app.main:app --port 8000 --reload
    ```
    *API will run on:* `http://localhost:8000`  
    *Swagger Docs:* `http://localhost:8000/docs`

---

### Step 2: Configure & Start Frontend

1.  Open a new terminal window and navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
    *Vite will run on:* `http://localhost:5173` (or `http://localhost:5174` if 5173 is occupied).

---

## 🔒 Security Configuration

A `.gitignore` file is placed in the project root to prevent tracking sensitive information. **Never commit the following to GitHub:**
*   `backend/.env` (contains your API secrets)
*   `backend/.venv/` (local Python packages)
*   `frontend/node_modules/` (local npm packages)
*   `frontend/dist/` (compiled production builds)
