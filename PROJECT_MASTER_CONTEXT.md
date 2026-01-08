
# PROJECT MASTER CONTEXT: Golden Family (Famille en Or)

## 1. Overview
**Project Name:** Golden Family
**Description:** A browser-based, interactive TV game show interface replicating "Family Feud" (Une Famille en Or). It is designed to be projected on a screen while a host controls the flow (revealing answers, managing strikes, scoring).
**Target Audience:** Game show hosts, event organizers, family gatherings.

## 2. Technical Stack
*   **Core:** React 19
*   **Build Tool:** Vite (inferred)
*   **Language:** TypeScript
*   **Styling:** 
    *   Tailwind CSS
    *   **CSS Container Queries** (`cqh` units) for fluid typography in cards.
*   **Data Source:** YAML (`questions.yaml`) parsed via `js-yaml`
*   **Icons:** Heroicons
*   **Animation:** CSS Transitions / Tailwind utilities

## 3. Architecture

### 3.1. Current Status
The project has successfully transitioned to a Clean Architecture. The legacy Gemini/Artifact generator code has been purged. The application now features a robust, adaptable UI that fits strictly within a 16:9 container.
*   **Active Core:** `App.tsx`, `useGameLogic.ts`, `components/slides/*`, `components/layout/*`.
*   **Data Layer:** `services/yamlLoader.ts`.

### 3.2. Directory Structure
```text
/
├── public/
│   └── questions.yaml       # Data source (Demo data available)
├── src/
│   ├── assets/              # Static assets
│   ├── components/
│   │   ├── game/            # Game Logic Components (AnswerCard, TeamControl)
│   │   ├── layout/          # Layout Shells (Header, Footer, Container)
│   │   ├── slides/          # Top-level Slide Views (Intro, Transition, QuestionBoard, End)
│   │   └── ui/              # Generic UI (Status screens, primitive loaders)
│   ├── hooks/               # Custom Logic (useGameLogic - Fat Hook Pattern)
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
    *   **Layout Logic:** Adapts dynamically to 3-8 answers.
        *   *3 Answers:* Tall, prominent cards.
        *   *8 Answers:* High-density grid.
    *   **Host Action:** Click hidden card -> Reveals answer + points.
    *   **Host Action:** Click strike button -> Toggles visual indicator.
    *   **Host Action:** Manual Score (+/-) via footer.
4.  **End Slide:** Displays winner based on accumulated scores.

### 4.2. Data Model (`questions.yaml`)
*   **Transition Item:** `{ type: 'transition', title: string, subtitle?: string }`
*   **Question Item:** `{ type: 'question', id: number, question: string, answers: Array<{text, percentage}> }`
*   **Answers:** Sorted by popularity. Count varies (3-8).

## 5. Coding Conventions
*   **Naming:** PascalCase for Components, camelCase for hooks.
*   **Layout Strategy:**
    *   **Macro Layout:** Percentage-based relative to the `GameContainer` (16:9 aspect ratio). Avoid `vh` for internal component sizing where possible to ensure containment.
    *   **Micro Layout:** Use **CSS Container Queries** (`container-type: size` + `cqh` units) for typography within resizing elements (like `AnswerCard`) to ensure text perfectly fits the available height.
*   **State Management:** `useGameLogic` acts as the central store.
*   **Type Safety:** Strict TypeScript interfaces imported from `types.ts`.

## 6. Roadmap & Status

### 6.1. Completed Tasks
*   [x] **Purge:** Removed unused AI generation templates.
*   [x] **Restructure:** Organized components into `game/`, `layout/`, `slides/`.
*   [x] **Refine Logic:** `useGameLogic` handles Virtual End state.
*   [x] **Advanced UI:** Implemented `QuestionBoard` with dynamic gap/height calculation based on answer count (3 vs 8).
*   [x] **Fluid Typography:** Implemented Container Queries for answer cards.

### 6.2. Future Enhancements (Phase 3)
*   **Sound Effects:** Add audio triggers for Correct/Incorrect/Win.
*   **Keyboard Shortcuts:** Expand host controls (currently 1-8 for reveal, Arrows for nav).
*   **Animations:** Add "Staggered" entrance for answers on board load.
*   **Edit Mode:** Potential in-browser editor for `questions.yaml` (Local Storage override).
