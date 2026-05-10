# Study Buddy — AI War Room

Turn any topic into quizzes, flashcards, and a 15-minute revision plan using Claude AI.

## Features

- **Quiz generation** — 5 targeted questions per topic
- **AI marking** — explains every mistake with encouragement
- **Smart flashcards** — generated from your weak areas
- **15-min revision plan** — timed study blocks
- **Next topic recommendation** — the agentic part: uses your results to decide what to study next

## Quick Start

### 1. Clone / download the project

```bash
cd study-buddy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your Anthropic API key

Create a `.env.local` file in the root (already included as a template):

```
ANTHROPIC_API_KEY=your_api_key_here
```

Get your key from https://console.anthropic.com

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 — you're live!

## Deploying to Vercel (free)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com and import the repo
3. Add `ANTHROPIC_API_KEY` in Vercel → Settings → Environment Variables
4. Hit Deploy — done ✅

## Project Structure

```
src/
  app/
    page.tsx              ← main page, orchestrates the agent flow
    layout.tsx            ← root layout + fonts
    globals.css           ← all styles
    types.ts              ← TypeScript interfaces
    lib/
      api.ts              ← helper to call your backend route
    api/
      generate/
        route.ts          ← secure API route (key stays server-side)
    components/
      TopicPanel.tsx      ← stage 0: enter topic
      QuizPanel.tsx       ← stage 1: answer questions
      ResultsPanel.tsx    ← stage 2: see marked results
      FlashcardsPanel.tsx ← stage 3: flip flashcards
      PlanPanel.tsx       ← stage 4: revision plan + next topic
```

## The Agent Flow

```
Topic input
    ↓
Generate 5 questions  (Claude API call)
    ↓
Student answers quiz
    ↓
Mark answers + explain mistakes  (Claude API call)
    ↓
Generate flashcards from weak areas  (Claude API call — uses marking result)
    ↓
Build 15-min plan + recommend next topic  (Claude API call — uses score + gaps)
    ↓
"Study Next Topic" → loops back with new topic
```

Each stage feeds its output into the next prompt — that's the agent-like behaviour.
