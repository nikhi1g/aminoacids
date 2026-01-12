# Project Goal
Help users memorize all amino acids through repeated exposure and recall practice. The app must be fully client-side with no accounts. Users can optionally save and restore their progress using a local JSON file.

#  Coding Practices
- Keep everything client-side and deterministic; avoid any auth or backend dependencies.
- Keep the core data source in `script.js` and treat it as the single source of truth.
- Prefer small, pure helper functions for selection/scoring logic so behavior is easy to test and reason about.
- Persist user progress only to local state, `localStorage`, or a downloadable JSON file; never assume server state.
- Progress keys in `localStorage`: `aa_progress_v1`, `aa_draw_progress_v1`, `midterm1_153b_progress_v1`. 153B mode toggle uses `midterm1_153b_mode_v1`. Document new progress keys here.
- When adding features, preserve existing UX flows in `index.html`, `learn.html`, and `recall.html` unless explicitly requested.
- Validate JSON import/export and handle missing or malformed fields gracefully with safe defaults.
- Avoid heavy dependencies; use existing Tailwind + inline JS patterns already in the project.
- Keep UI changes accessible: readable contrast, keyboard-friendly controls, and clear feedback.
- Add brief comments only when logic is non-obvious.
- Maintain ASCII-only edits unless a file already uses Unicode.

# Deployment Versioning
- The header displays the latest GitHub commit hash and commit date (no "Commit:" label).
- Commit data is fetched from the local `commit.json` file generated during the GitHub Pages build.
- This avoids hitting GitHub API rate limits.
- Poll for updates every 5 minutes to detect new deployments.
- A "New" indicator appears in the header when the hash changes, with a Refresh button.

# Known Bugs
- Draw mode answer validation is unreliable; SMILES comparison is not robust.
