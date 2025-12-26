# Project Goal
Help users memorize all amino acids through repeated exposure and recall practice. The app must be fully client-side with no accounts. Users can optionally save and restore their progress using a local JSON file.

# Coding Practices
- Keep everything client-side and deterministic; avoid any auth or backend dependencies.
- Keep the core data source in `script.js` and treat it as the single source of truth.
- Prefer small, pure helper functions for selection/scoring logic so behavior is easy to test and reason about.
- Persist user progress only to local state, `localStorage`, or a downloadable JSON file; never assume server state.
- When adding features, preserve existing UX flows in `index.html`, `learn.html`, and `recall.html` unless explicitly requested.
- Validate JSON import/export and handle missing or malformed fields gracefully with safe defaults.
- Avoid heavy dependencies; use existing Tailwind + inline JS patterns already in the project.
- Keep UI changes accessible: readable contrast, keyboard-friendly controls, and clear feedback.
- Add brief comments only when logic is non-obvious.
- Maintain ASCII-only edits unless a file already uses Unicode.
