# Amino Acid Explorer

## Goal
Help users memorize all amino acids through repeated study and recall. The site is fully client-side and does not use accounts.

## Pages
- `index.html` Show all amino acids with structure, abbreviations, pKa values, and tags. Filters apply by category.
- `learn.html` Flashcard view to study one amino acid at a time. Flip to reveal details and structure.
- `recall.html` Quiz mode with randomized question types. Tracks streaks and feedback.
- `draw.html` Drawing practice using an in-browser editor. Users draw the structure and check against the expected answer.
- `progress.html` Progress overview from local storage with mastery and accuracy metrics.

## Data and Logic
- `script.js` Shared data set and UI logic for filters, theme, and SMILES rendering.
- `style.css` Shared styles and small custom layout rules.

## Progress Storage
- Progress is stored in local storage on the device.
- Clearing browser storage will reset progress.

## Deployment
- Works as a static site on GitHub Pages.
- All dependencies are loaded via CDN.
