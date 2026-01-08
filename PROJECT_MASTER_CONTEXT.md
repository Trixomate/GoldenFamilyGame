# PROJECT MASTER CONTEXT: Golden Family (Famille en Or)

## 1. Overview
**Project Name:** Golden Family
**Description:** A browser-based, interactive TV game show interface replicating "Family Feud" (Une Famille en Or). It is designed to be projected on a screen while a host controls the flow (revealing answers, managing strikes, scoring).
**Target Audience:** Game show hosts, event organizers, family gatherings.

## 2. Technical Stack
*   **Core:** React 19
*   **Build Tool:** Vite (inferred)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Data Source:** YAML (`questions.yaml`) parsed via `js-yaml`
*   **Icons:** Heroicons
*   **Animation:** CSS Transitions / Tailwind utilities

## 3. Architecture

### 3.1. Current Status
The project is currently a hybrid of a clean Game application and a leftover "Gemini Artifact Generator" template.
*   **Active Core:** `App.tsx`, `useGameLogic.ts`, `components/slides/*`, `components/layout/*`.
*   **Dead Code (To Remove):** `services/gemini.ts`, `components/Hero.tsx`, `components/InputArea.tsx`, `components/LivePreview.tsx`, `components/CreationHistory.tsx`, and related PDF/Gemini logic.

### 3.2. Target Directory Structure (Clean Architecture)
```text
/
├── public/
│   └── questions.yaml       # Data source
├── src/
│   ├── assets/              # Static assets
│   ├── components/
│   │   ├── game/            # Specific Game Logic Components (Board, Card)
│   │   ├── layout/          # Layout Shells (Header, Footer, Container)
│   │   ├── slides/          # Top-level Slide Views (Intro, Transition, End)
│   │   └── ui/              # Generic UI (Status screens, buttons - primitive)
│   ├── hooks/               # Custom Logic (useGameLogic)
│   ├── services/            # Data fetching (YamlLoader)
│   ├── types/               # TypeScript Definitions
│   ├── App.tsx
│   ├── main.tsx (index.tsx)
│   └── styles/
```

## 4. Business Rules & Logic

### 4.1. Game Loop
1.  **Intro Slide:** Title screen. Waiting for start.
2.  **Transition Slide:** Displays the category/theme of the next round.
3.  **Question Board:**
    *   Displays the question.
    *   Displays 3 to 8 hidden answers.
    *   **Host Action:** Click a hidden card -> Reveals answer + points.
    *   **Host Action:** Click team strike button (X) -> Toggles strike indicator.
    *   **Host Action:** Manual Score adjustment (+/-) via footer controls.
4.  **End Slide:** Displays winner based on manual scores.

### 4.2. Data Model (`questions.yaml`)
*   **Transition Item:** `{ type: 'transition', title: string, subtitle?: string }`
*   **Question Item:** `{ type: 'question', id: number, question: string, answers: Array<{text, percentage}> }`
*   **Answers:** Sorted by popularity (percentage). Count varies (3-8).

## 5. Coding Conventions
*   **Naming:** PascalCase for Components (`QuestionBoard.tsx`), camelCase for hooks/functions (`useGameLogic.ts`).
*   **Styling:** Mobile-first Tailwind, but locked to "TV Mode" aspect ratio via `GameContainer`.
*   **State Management:** `useGameLogic` acts as the central store (Fat Hook pattern).
*   **Type Safety:** Strict TypeScript interfaces imported from `types.ts`.

## 6. Current State & Refactoring Roadmap

### 6.1. Identified Debt
*   **ZOMBIE CODE:** Heavy presence of unused Gemini/AI generation components.
*   **Hardcoded Fetch:** `useGameLogic` fetches `./questions.yaml` directly. This should be abstracted.
*   **File Organization:** `components/` is currently a mix of generic and specific.
*   **Types:** `any` usage in `metadata.json` or loose types in some props.

### 6.2. Phase 2 Refactoring Tasks (To Execute)
1.  **Purge:** Delete all Gemini/Artifact related files.
2.  **Restructure:** Move `AnswerCard` and `TeamControl` to `components/game/`.
3.  **Refine Logic:** Ensure `useGameLogic` handles the "Virtual End" state gracefully.
4.  **Polish UI:** Ensure the `QuestionBoard` adapts perfectly to 3-8 answers (already started, needs verification).
