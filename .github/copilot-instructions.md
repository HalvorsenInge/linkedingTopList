# Copilot Instructions for LinkedIn Games Leaderboard

This is a GitHub Pages-hosted leaderboard application for tracking LinkedIn game scores. It's a static site with vanilla JavaScript and JSON-based data storage.

## Quick Start

**Tech Stack**: Vanilla JavaScript (ES6+), HTML5, CSS3, JSON data files, GitHub Pages, GitHub Actions

**No build step required** — files are served directly from the `docs/` folder via GitHub Pages.

## Project Structure

```
linkedinLeaderboard/
├── docs/                    # GitHub Pages root (deployed)
│   ├── leaderboard.html    # Main leaderboard display
│   ├── form.html           # Score submission form
│   └── admin.html          # Admin management panel
├── src/
│   ├── data/               # JSON data files
│   │   ├── players.json    # Player list
│   │   ├── games.json      # Game definitions
│   │   └── scores.json     # All submitted scores
│   ├── js/                 # Shared and page-specific logic
│   │   ├── utils.js        # Shared utilities (loadJSON, formatters, modals, tabs)
│   │   ├── leaderboard.js  # Leaderboard tab/ranking logic
│   │   ├── form.js         # Score submission and parsing
│   │   └── admin.js        # Player/game CRUD operations
│   └── styles/
│       └── style.css       # Global styles
├── .github/
│   └── workflows/
│       └── rebuild-leaderboard.yml  # Scheduled validation (10 AM UTC, weekdays)
```

## Architecture Overview

### Data Flow

1. **HTML pages** in `docs/` load JavaScript modules from `src/js/`
2. **JavaScript modules** fetch JSON data via `loadJSON()` from `src/data/`
3. **Data files** store persistent state:
   - `players.json`: Array of `{id, name}`
   - `games.json`: Array of `{id, name, scoring_type: "time"|"steps"}`
   - `scores.json`: Array of `{player_id, game_id, score, date}`

### Key Design Patterns

- **Shared utilities in `utils.js`**: All pages import this for common functions (data loading, formatting, UI widgets)
- **Page initialization**: Each page has its own `initPage()` function (e.g., `initLeaderboard()`, `initForm()`, `initAdmin()`)
- **Tab system**: `utils.js` provides `initTabs()` for the multi-game display on the leaderboard
- **Modal dialogs**: Used in admin panel for delete confirmations
- **localStorage**: Admin changes (add/delete players/games) persist to localStorage; must be manually committed to JSON files

### Score Ranking

- **Lower scores always rank higher** (standard for LinkedIn games)
- Leaderboard is sorted by score ascending: `gameScores.sort((a, b) => a.score - b.score)`
- Top 3 get medals: 🥇🥈🥉, others show `#rank`

### Time vs Steps Scoring

Two scoring types supported in `games.json`:
- **`"time"`**: Scores in seconds, displayed as `Xm Ys` (e.g., 145s → "2m 25s")
- **`"steps"`**: Raw number, displayed as-is

Form parsing (`form.js`) handles both:
- Time input: `145` (seconds) or `2:25` (MM:SS format) → converted to seconds
- Steps input: Raw positive integer

## Commands

**Development & Testing**
```bash
npm install                 # Install Playwright and dependencies
npm test                    # Run Playwright tests (headless)
npm run test:ui            # Run tests with interactive Playwright UI
npm run test:debug         # Run tests in debug mode
npm run serve              # Start local HTTP server on port 8000
```

**Validation** (GitHub Actions)
- Runs at 10:00 AM UTC, Monday–Friday via `rebuild-leaderboard.yml`
- Validates JSON structure with Node.js: `node -e "JSON.parse(...)"`
- Commits any changes (the workflow itself doesn't modify data, but can be extended)

## Key Conventions

### File Naming
- **IDs in JSON**: `player_NNN` or `game_NNN` pattern (auto-generated with `Date.now()` in admin panel)
- **Tab IDs in HTML**: `data-tab="game-{gameId}"` matches content div `id="game-{gameId}"`

### Function Signatures

**utils.js**
```javascript
loadJSON(path)              // Async: fetch and parse JSON, return [] on error
formatScore(score, type)    // Format score based on scoring_type
formatDate(dateString)      // Format ISO date to "MMM DD, YYYY"
getRankBadge(rank)          // Return medal emoji or "#rank"
initTabs()                  // Auto-called on DOMContentLoaded
showAlert(message, type)    // Display toast notification (top-right, auto-dismiss)
showModal(id) / hideModal(id)
```

**form.js**
```javascript
parseScore(input, scoringType)  // Validate and convert user input to seconds (time) or int (steps)
updateScoreLabel()              // Update form label when game selection changes
```

### Data Mutation Rules
- **Read-only on leaderboard page**: Only displays data
- **Admin panel**: Can add/delete players and games
  - Changes save to localStorage immediately and appear in the UI
  - With GitHub authentication, changes are also committed directly to the JSON files
  - Without GitHub token, changes persist locally only (manual JSON commit required)
- **Form page**: Submits new scores
  - Saves to localStorage, redirects to leaderboard after 2s
  - **Scores don't persist** until manually added to `scores.json`

### GitHub Authentication
The admin panel now supports GitHub API integration:
1. Visit `/admin.html`
2. Click "Create Token" link to generate a personal access token on GitHub
3. Paste the token into the authentication section
4. Click "Authenticate"
5. **After authentication**: All add/delete operations will automatically commit changes to the JSON files
6. Token is stored in localStorage (not sent anywhere except GitHub API)

### Common Pitfalls
- **Relative paths**: All HTML files are in `docs/`, JavaScript files in `src/js/` → use `../src/data/file.json` or `../src/js/utils.js` in imports
- **localStorage vs JSON files**: Admin panel uses both; changes in localStorage don't auto-sync to JSON (no GitHub API integration yet)
- **Empty state**: Always check for empty arrays before rendering tables/leaderboards
- **Score parsing**: Time format is flexible (`145` or `2:25`) but seconds are required internally

## Extending the Codebase

### Adding a New Game
1. Edit `src/data/games.json` (or use admin panel) to add `{id, name, scoring_type}`
2. Leaderboard tabs auto-generate from this file
3. Form automatically detects scoring type via `game.scoring_type`

### Adding a New Page
1. Create `.html` file in `docs/`
2. Import `src/js/utils.js` and any other modules needed
3. Implement your own initialization function or call existing ones
4. Use the same relative path pattern: `../src/data/`, `../src/js/`, `../src/styles/`

### Modifying Scoring Logic
- Time formatting: `formatScore()` in `utils.js`
- Time parsing: `parseScore()` in `form.js`
- Ranking logic: `leaderboard.js` sorts by `.sort((a, b) => a.score - b.score)`

### Persistent Changes via GitHub API
The admin panel now has GitHub API integration:
- Admin users authenticate with a personal access token
- Add/delete operations automatically commit to JSON files when authenticated
- Token is stored securely in localStorage
- Users must create a token on GitHub with appropriate repo access

## GitHub Pages & Deployment

- **Deployment source**: `main` branch, `/docs` folder
- **Rebuild workflow**: Scheduled at 10:00 AM UTC weekdays, validates JSON
- **Manual trigger**: Can manually run workflow via GitHub Actions UI
- **No secrets needed**: All data is public (JSON in repo)

## Testing & Debugging

**Automated Testing**: Uses Playwright for E2E tests
- Tests are in `tests/` directory (`.spec.ts` files)
- Covers all three pages: leaderboard, form, admin
- Tests check page loading, navigation, form validation, UI elements
- Run tests:
  ```bash
  npm install              # First time setup
  npm test                 # Run headless tests
  npm run test:ui         # Visual test runner
  npm run test:debug      # Debug mode with browser
  ```
- Tests expect local server running on `http://localhost:8000/docs`
- Playwright config in `playwright.config.ts` auto-starts server

**Manual Testing**
1. **Local**: Run `npm run serve` then open `http://localhost:8000/docs/leaderboard.html`
2. **Admin panel**: Verify add/delete operations update table and localStorage
3. **Form validation**: Test both time formats (`145` and `2:25`) and steps parsing
4. **GitHub Pages**: After commit, check live site at `https://yourusername.github.io/linkedinLeaderboard/docs/leaderboard.html`
5. **Workflow logs**: Check GitHub Actions logs if `rebuild-leaderboard.yml` validation fails
