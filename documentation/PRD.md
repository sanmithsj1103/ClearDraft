# ClearDraft — Product Requirements Document (PRD)

**Version:** 1.1  
**Date:** June 2026  
**Author:** Sanmith  
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary

ClearDraft is an AI-powered voice and text transcription application that converts raw, unstructured user input — spoken or typed — into polished, professionally formatted content. Users select an output mode before providing input, and the AI tailors the structure, tone, and formatting accordingly.

### 1.2 Problem Statement

People often have good ideas but struggle to articulate them in a structured, professional format. Whether it's drafting an email, writing meeting notes, or turning a brainstorm session into an action plan — the gap between raw thought and polished output is time-consuming and cognitively demanding. ClearDraft eliminates that gap.

### 1.3 Target Users

- Students and early-career professionals building their communication skills
- Developers and technical writers creating documentation from verbal explanations
- Professionals drafting emails, LinkedIn posts, and formal letters
- Founders and team leads running brainstorming sessions or meetings
- Content creators turning raw ideas into structured narratives

### 1.4 Design Philosophy

The UI/UX of ClearDraft takes direct inspiration from the Claude.ai interface — clean, minimal, white-surface aesthetics with a calm and focused feel. The emphasis is on content, not chrome.

---

## 2. Goals and Success Metrics

### 2.1 Project Goals

- Build a functional, demo-ready full-stack web application suitable for a developer portfolio
- Demonstrate integration of voice input, AI processing, and structured output generation
- Deliver a polished UI experience comparable to modern AI products

### 2.2 Success Metrics

| Metric | Target |
|---|---|
| Input-to-output latency | < 5 seconds for text input |
| Voice transcription accuracy | > 90% on clear English speech |
| Supported output modes | 10 modes at launch |
| Supported input modes | 3 modes at launch |
| Mobile responsiveness | Fully responsive on 375px+ viewports |

---

## 3. Features and Requirements

### 3.1 Input Modes

ClearDraft supports three methods of providing raw input.

#### 3.1.1 Live Voice Recording

- A record button in the UI triggers the browser's microphone via the Web Speech API or MediaRecorder API
- Real-time audio capture with a live waveform or pulsing indicator while recording
- Recording stops on a second button press or after a configurable silence threshold
- The captured audio is either transcribed client-side (Web Speech API) or sent to a backend transcription service (Whisper API)
- A raw transcript is shown to the user for review before AI processing

#### 3.1.2 Text Input

- A large, resizable textarea where the user types or pastes raw, unstructured thoughts
- No grammar or formatting enforcement at input — the AI handles that downstream
- Character count indicator displayed below the input field
- Supports paste from clipboard, including multi-paragraph text

#### 3.1.3 Upload Audio File

- A drag-and-drop upload zone or file picker accepting `.mp3`, `.wav`, `.m4a`, `.webm` formats
- File size limit: 25 MB
- Uploaded file is sent to the backend and transcribed via OpenAI Whisper or equivalent
- Transcription result is displayed for user review before AI processing
- Upload progress indicator shown during file transfer

---

### 3.2 Output Modes

The output mode is selected before or during input via a dropdown menu or segmented button control. It determines how the AI structures and formats the final output.

> **Output display:** All modes render their output as plain text directly in the chat/output panel. The user reads, copies, and uses the text from there. No special rendering, markdown preview, or formatted views are applied in v1.0 — clarity and copyability are the priority.

#### 3.2.1 Transcribe Mode

Converts voice or audio input into a clean, readable plain-text transcript with proper punctuation and paragraph breaks. No interpretation or reformatting beyond cleaning up filler words and run-on sentences.

**Output format:** Plain text in chat  
**Ideal for:** Interviews, lectures, verbal notes

#### 3.2.2 Documentation Mode

Transforms raw thoughts into structured technical or process documentation with headings, subheadings, and numbered or bulleted sections.

**Output format:** Plain text in chat (Markdown syntax visible as-is, copyable for use in any Markdown editor)  
**Sub-types (optional):** README, API doc, SOP, System Design doc  
**Ideal for:** Developers, technical writers, project leads

#### 3.2.3 Email Mode

Converts a casual spoken or typed message into a professionally formatted email with a subject line, greeting, body paragraphs, and sign-off.

**Output format:** Plain text in chat  
**Tone control:** Formal / Semi-formal / Friendly  
**Ideal for:** Professionals, job seekers, client communication

#### 3.2.4 LinkedIn Mode

Rewrites raw ideas or experiences into an engaging LinkedIn post optimized for professional reach — with a hook opening line, structured body, and call to action.

**Output format:** Plain text in chat, 150–300 words  
**Features:** Optional hashtag suggestions at the end  
**Ideal for:** Founders, professionals, job seekers, thought leaders

#### 3.2.5 Brainstorm / Ideation Mode

Expands raw idea fragments into a structured brainstorm document — categorizing thoughts, identifying themes, and suggesting related ideas the user may not have considered.

**Output format:** Plain text in chat with clearly labeled sections and bullet points  
**Ideal for:** Product thinkers, students, founders, creatives

#### 3.2.6 Meeting Notes Mode

Converts a spoken or typed meeting recap into structured meeting notes with sections for attendees (if mentioned), discussion points, decisions made, and action items.

**Output format:** Plain text in chat with labeled sections — Summary, Discussion, Decisions, Action Items  
**Ideal for:** Team leads, project managers, remote workers

#### 3.2.7 Formal Letter Mode

Transforms raw intent into a properly formatted formal letter with date, recipient address block, subject line, body paragraphs, and a closing salutation.

**Output format:** Plain text in chat  
**Ideal for:** Job applications, official requests, academic correspondence

#### 3.2.8 Story Mode

Converts a rough narrative or sequence of events into a well-written, engaging short story or narrative paragraph with proper flow, dialogue cues, and descriptive language.

**Output format:** Plain text in chat  
**Ideal for:** Writers, content creators, journaling, personal statements

#### 3.2.9 Action / TODO Mode

Extracts tasks, commitments, and next steps from raw input and presents them as a clean, prioritized to-do list with optional due dates and owners if mentioned.

**Output format:** Plain text in chat as a numbered or checkbox list  
**Ideal for:** Meeting follow-ups, personal planning, project kick-offs

#### 3.2.10 Prompting Mode

Takes the user's raw idea or goal and transforms it into a clear, structured, ready-to-use prompt for other AI tools such as ChatGPT, Midjourney, Claude, or Gemini. The AI infers the target tool from context clues in the input, or the user can specify it. The output prompt includes a clear role/context setup, specific instructions, constraints, and an expected output format — making it immediately usable without further editing.

**Output format:** Plain text in chat — a clean, copy-paste-ready prompt block  
**Prompt components generated:** Role definition, context/background, task instruction, constraints, output format specification  
**Target tool detection:** Auto-inferred (e.g. "image of a sunset" → Midjourney style) or user-specified  
**Ideal for:** AI power users, developers, content creators, students learning prompt engineering

---

### 3.3 Output Controls

All output is rendered as plain text in the output panel. After generation, the user has access to the following controls:

- **Copy to clipboard** — one-click copy of the full plain text output; primary action
- **Regenerate** — re-runs AI generation with the same input and mode
- **Edit inline** — the output area becomes editable for manual tweaks before copying

---

## 4. User Interface Requirements

### 4.1 Design Language

ClearDraft's visual design follows the Claude.ai aesthetic:

- Background: off-white / near-white (`#FAFAF8` or equivalent)
- Typography: Clean sans-serif (Inter or system font stack)
- Font sizes: 14px body, 16px input, 13px labels
- Colors: Minimal — black text, gray borders, a single accent color for interactive elements
- Borders: 0.5px–1px, subtle gray
- Border radius: 8–12px for cards and inputs, 20px+ for pill buttons
- No gradients, no drop shadows on surfaces, no decorative illustrations
- Spacing: generous padding (16–24px inside cards), clean whitespace between sections

### 4.2 Layout Structure

```
┌─────────────────────────────────────────┐
│  Header: ClearDraft logo + nav          │
├─────────────────────────────────────────┤
│                                         │
│  [ Output Mode Selector — dropdown ]    │
│                                         │
│  [ Input Area ]                         │
│  ┌─────────────────────────────────┐    │
│  │ 🎙 Live Voice  ⌨ Text  📁 File │    │
│  │                                 │    │
│  │  [textarea / recorder / upload] │    │
│  │                                 │    │
│  │              [ Generate → ]     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [ Output Area ]                        │
│  ┌─────────────────────────────────┐    │
│  │  Generated content appears here │    │
│  │                                 │    │
│  │  [Copy] [Edit] [Export ▾]       │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### 4.3 Mode Selector

- Displayed as a styled dropdown or a horizontally scrollable pill button row
- Each mode has a short label and an icon
- Selected mode is visually highlighted
- Mode can be changed before generating; switching after generation prompts a confirm dialog

### 4.4 Input Area Tabs

Three tabs at the top of the input card: **Live Voice**, **Text Input**, **Upload Audio**. Switching tabs preserves any existing content in the other tabs.

### 4.5 Responsive Design

- Desktop: two-column layout (input left, output right) on screens wider than 960px
- Tablet/Mobile: single-column stacked layout
- Output area scrollable independently on all screen sizes

---

## 5. Technical Architecture

### 5.1 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Routing | React Router v6 |
| State Management | React Context or Zustand |
| Voice Capture | Web Speech API / MediaRecorder API |
| Audio Transcription | OpenAI Whisper API (file upload) |
| AI Processing | Anthropic Claude API (claude-sonnet-4) |
| Backend | Node.js + Express or Python FastAPI |
| File Handling | Multer (Node) or FastAPI UploadFile |
| Deployment | Vercel (frontend) + Render or Railway (backend) |

### 5.2 Data Flow

```
User Input (voice / text / file)
        │
        ▼
  [Input Handler]
  ├── Text → passed directly
  ├── Live Voice → Web Speech API → raw transcript
  └── Audio File → POST /transcribe → Whisper API → raw transcript
        │
        ▼
  [Mode-aware Prompt Builder]
  Combines: raw transcript + selected output mode + tone settings
        │
        ▼
  POST /generate → Claude API (claude-sonnet-4)
        │
        ▼
  Structured Output → Rendered in Output Panel
```

### 5.3 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/transcribe` | Accepts audio file, returns raw transcript via Whisper |
| POST | `/api/generate` | Accepts transcript + mode, returns AI-formatted output |

### 5.4 Prompt Engineering Strategy

Each output mode maps to a dedicated system prompt template. Example for Email mode:

```
System: You are a professional communication assistant. 
Convert the following raw thoughts into a well-structured, 
professional email. Include: Subject line, greeting, body (2–3 
paragraphs), and a closing. Tone: {tone_setting}.

User: {raw_transcript}
```

Templates for all 10 modes are maintained in a `prompts.js` / `prompts.py` config file for easy tuning. Example for Prompting Mode:

```
System: You are an expert prompt engineer. Convert the user's raw idea 
into a clear, structured, ready-to-use prompt for {target_tool}. 
Include: a role definition, context/background, specific task instruction, 
constraints, and expected output format. Output only the final prompt — 
no preamble or explanation.

User: {raw_transcript}
```

---

## 6. Non-Functional Requirements

| Requirement | Specification |
|---|---|
| Performance | AI response rendered within 5s for text input, 10s for audio |
| Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| Accessibility | WCAG 2.1 AA — keyboard nav, ARIA labels, focus management |
| Security | API keys stored server-side only, never exposed to client |
| Privacy | No user input stored persistently without explicit consent |
| Scalability | Stateless backend, horizontally scalable |

---

## 7. Out of Scope (v1.0)

The following features are explicitly excluded from the initial version to keep scope manageable:

- User authentication and accounts
- Saved history / session persistence
- Mobile native app (iOS / Android)
- Real-time collaborative editing
- Custom persona / "write like me" training
- Paid tiers or usage limits enforcement
- Integrations (Notion, Gmail, Slack exports)
- Multilingual output (beyond English)

These are candidates for a v2.0 roadmap.

---

## 8. Milestones and Build Plan

| Phase | Tasks | Est. Time |
|---|---|---|
| Phase 1 — Setup | Project scaffold, routing, base UI layout, mode selector | 1 day |
| Phase 2 — Input | Text input, Live Voice (Web Speech API), UI tabs | 1 day |
| Phase 3 — AI Integration | Prompt templates for all 10 modes, Claude API integration | 1 day |
| Phase 4 — Audio Upload | File upload UI, Whisper API integration, transcription flow | 1 day |
| Phase 5 — Output Panel | Rendered output, copy/edit/export controls, markdown preview | 0.5 day |
| Phase 6 — Polish | Responsive design, loading states, error handling, final UI pass | 0.5 day |
| **Total** | | **~5 days** |

---

## 9. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Web Speech API not supported on all browsers | Fallback to manual text input with a clear browser warning |
| Whisper API latency for large files | File size cap (25 MB) + progress indicator + async processing |
| Claude API rate limits during demo | Cache sample outputs for demo mode as a fallback |
| Prompt outputs varying in quality per mode | Extensive prompt testing + few-shot examples in system prompts |

---

## 10. Appendix

### 10.1 Output Mode Summary Table

| Mode | Output Format | Avg. Length | Key AI Instruction |
|---|---|---|---|
| Transcribe | Plain text in chat | Variable | Clean and punctuate only |
| Documentation | Plain text in chat | 300–800 words | Structure with headings and sections |
| Email | Plain text in chat | 100–200 words | Subject + body + sign-off |
| LinkedIn | Plain text in chat | 150–300 words | Hook + value + CTA |
| Brainstorm | Plain text in chat | 200–400 words | Expand and categorize ideas |
| Meeting Notes | Plain text in chat | 200–500 words | Summary + decisions + actions |
| Formal Letter | Plain text in chat | 200–400 words | Block letter format |
| Story | Plain text in chat | 200–500 words | Narrative flow + description |
| Action / TODO | Plain text in chat | 5–15 items | Extract tasks only |
| Prompting | Plain text in chat | 100–250 words | Role + context + task + constraints + output format |

### 10.2 Glossary

- **Raw transcript** — unedited, unformatted text from voice or user input
- **Output mode** — the AI's target format and intent for the generated content
- **Prompt template** — a pre-written system prompt that defines AI behavior per mode
- **Whisper** — OpenAI's speech-to-text model used for audio file transcription
- **Prompting mode** — an output mode where the AI converts a vague idea into a structured, ready-to-use prompt for other AI tools
- **Target tool** — the AI tool a generated prompt is intended for (e.g. ChatGPT, Midjourney, Claude, Gemini)
