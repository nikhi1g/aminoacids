# Project Status: Amino Acids Site

## Known Issues
- **Supabase Integration:** Auth UI is currently being re-implemented. Actual project credentials need to be swapped in.

## Future Tasks: Smart Progress Tracking (Planned)
*Do not implement the logic below yet. This is a reference architecture.*

### 1. Database Schema
Create a table `user_progress` in Supabase:
- `id`: uuid (Primary Key)
- `user_id`: uuid (Foreign Key to auth.users)
- `amino_acid_id`: text (The 3-letter code, e.g., "Ala")
- `is_mastered`: boolean (User manually ticked this off)
- `proficiency`: integer (0-5 scale of knowledge)
- `next_review`: timestamp (When to show this card again)
- `last_reviewed`: timestamp

### 2. Spaced Repetition Logic (SRS)
The "Recall" and "Learn" modes should query the local `aminoAcids` data, which will be enriched with the user's progress data on load.

**Selection Algorithm:**
1. **Due Items:** `next_review < now()`
2. **New Items:** `proficiency == 0`
3. **Hard Items:** Lowest proficiency score.
4. **Random:** If no priority items, pick random non-mastered items.

**Scoring:**
- **Correct:** Increment `proficiency`. Set `next_review` to `now + (2 ^ proficiency) days`.
- **Incorrect:** Reset `proficiency` to 0. Set `next_review` to `now`.

### 3. Sync Strategy
- **On Load:** Fetch all `user_progress` rows for `auth.uid()`. Map them to the global `aminoAcids` array.
- **On Action:** When a user ticks "Mastered" or answers a question, update the local state immediately, then fire an async Supabase `upsert` to save to the cloud.