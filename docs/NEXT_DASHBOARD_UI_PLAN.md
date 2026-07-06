# Next.js Dashboard UI Plan

## 1. Design Goals
*   **Aesthetic:** Modern, clean, and premium UI.
*   **Visual Language:** Minimalist, generous spacing, soft shadows, `rounded-2xl` cards.
*   **Palette:** Limited and curated colors. Primary accent color is `#02abff` (Electric Blue).
*   **Responsiveness:** Fluid grid and flex layouts accommodating mobile, tablet, and desktop viewports perfectly.
*   **Contextual Relevance:** While structured like a SaaS dashboard, the components are intrinsically mapped to a guitar learning journey rather than generic analytics.

## 2. Information Architecture
The dashboard serves as the central hub for the student's daily practice routine and macro-level progression.

*   **Global Navigation (Sidebar / Mobile Menu):**
    *   Dashboard Home
    *   Practice Room (Metronome, Core Tools)
    *   Mini Courses Shelf
    *   Journey Timeline (Months 1-4)
*   **Top Bar:**
    *   Dev Preview Indicator (Visible only if `?preview` or `?devPreview` is active)
    *   Current Month/Week breadcrumbs
    *   Quick Theme Toggle (Light/Dark)
*   **Main Dashboard View:**
    *   **Hero / Current Mission:** Today's practice routine and immediate next step.
    *   **Stat Cards (4):** Key learning metrics.
    *   **Progress Section:** Visualizing completion percentage of the current Module.
    *   **Recent Activity:** Table or list of recently completed drills and lessons.
    *   **Quick Access:** Metronome widget and Practice Room shortcuts.

## 3. Component Map (shadcn/ui & lucide-react)
*   **Layout:**
    *   `Sidebar` (collapsible on mobile, fixed on desktop)
    *   `TopNav` (breadcrumbs, QA badges, quick actions)
*   **Cards (`rounded-2xl`, soft shadows):**
    *   `StatCard` (Metric, Lucide Icon, small trend indicator)
    *   `MissionCard` (Featured daily lesson, CTA button to start)
    *   `ProgressCard` (Chart/Progress bar showing week completion)
*   **Widgets:**
    *   `MetronomeWidget` (BPM slider, play/pause, tap tempo)
    *   `RecentActivityList` (Table component repurposed for lesson history)
*   **Badges/Indicators:**
    *   `PreviewBadge` (Destructive/Warning colors for Month 5/6 dev preview)
    *   `StatusBadge` (Live, Locked, Completed)

## 4. Responsive Behavior
*   **Mobile (< 768px):** Sidebar collapses into a Hamburger menu (Sheet component from shadcn). Stat cards stack vertically (`flex-col` or `grid-cols-1`). Metronome widget simplifies to essential play/BPM controls.
*   **Tablet (768px - 1024px):** Sidebar minimizes to icons only. Stat cards form a `grid-cols-2` layout. Main mission and progress charts sit side-by-side.
*   **Desktop (> 1024px):** Full expanded sidebar. Stat cards form a `grid-cols-4` layout. Ample whitespace and generous margins.

## 5. State Handling
*   **Default:** Standard view for Months 1-4.
*   **Hover:** Subtle `translate-y-[-2px]` and shadow elevation on clickable lesson cards and primary buttons (`hover:bg-primary/90`).
*   **Loading:** Skeleton loaders (`animate-pulse`) mirroring the exact shape of the cards and text blocks while data shards load.
*   **Empty:** Beautiful empty states (e.g., "No activity yet. Time to pick up the guitar!") with illustrative Lucide icons (e.g., `Guitar`, `PlayCircle`).
*   **Error:** Graceful error boundaries showing a retry button, avoiding full app crashes.
*   **Locked Month State:** Grayscale/faded visual treatment with a `Lock` icon, non-clickable.
*   **Hidden Preview Mode:** 
    *   Global warning banner at the top (`bg-yellow-500/10 text-yellow-500`).
    *   "No Progress Save" explicitly stated in the UI when interacting with Month 5/6 data.

## 6. Data Requirements
*   **Data Shards Compatibility:** Must consume the existing JSON shard architecture (`core-m1-m4.json`, `month5-preview.json`, `month6-preview.json`).
*   **User State:** Relies on existing `localStorage` keys for progress (completed weeks, daily practice ticks, BPM history), but must respect the "No Progress Save" constraint during Dev Previews.
*   **URL Routing:** Needs to parse `?preview=` and `?devPreview=` search params gracefully in the Next.js `useSearchParams` hook to load the appropriate data shards.

## 7. Migration Risks
*   **Loss of Simplicity:** Moving from a dependency-free Vanilla JS app to a Node-based build toolchain introduces maintenance overhead.
*   **State Management:** The current Vanilla JS app relies on mutable global variables (e.g., `selectedFocusedMonth`, `weeks`). This must be re-architected into React state (`useState`, `useContext`, or Zustand) which risks desyncing if not mapped perfectly.
*   **DOM Manipulation:** Current features like `scrollIntoView()` and manual DOM updates will need to be entirely refactored into React refs and declarative rendering.
*   **Preview Leakage:** The Next.js router and SSG/SSR mechanisms must be carefully configured so that Month 5/6 data is NEVER accidentally statically generated or shipped in the public bundle.

## 8. Recommended Implementation Phases
1.  **Phase 1: Setup & Skeleton:** Initialize Next.js, Tailwind, and shadcn/ui. Build the static UI shell (Sidebar, TopNav, Cards) using mock data.
2.  **Phase 2: Data Hydration:** Replicate `loadFutureData()` using Next.js data fetching patterns. Hydrate the UI with `core-m1-m4.json`.
3.  **Phase 3: Logic Migration:** Port the progress tracking, localStorage management, and Metronome logic into React hooks.
4.  **Phase 4: Dev Preview Porting:** Implement the URL parameter hooks to safely load `month5-preview.json` dynamically on the client side without leaking it to the build.

## 9. What Must Remain Unchanged in Production
*   **JSON Data Shards:** The underlying JSON schema and file structures must not change.
*   **Content Visibility:** Normal production must remain locked strictly to Months 1-4.
*   **Progress Data Contract:** The `localStorage` keys (e.g., `guitarCourseCompletedWeeks`) must remain identical so users don't lose their historical practice data during the migration.

## 10. Review Questions Before Implementation
1.  Are we aiming for Client-Side Rendering (CSR) only (similar to the current architecture), or do we want to leverage Next.js Static Site Generation (SSG) for faster initial loads?
2.  Do we want to maintain the `localStorage` approach for progress, or is this migration a stepping stone toward a backend database (e.g., Supabase)?
3.  Should the Metronome logic be rewritten in React, or should we port the existing Vanilla JS engine into a Web Worker to ensure perfect timing independent of the React render cycle?
