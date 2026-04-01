# LinkedIn Games Leaderboard

A GitHub Pages-hosted leaderboard for tracking LinkedIn game scores. Players submit scores for multiple games (Mini Sudoku, Zip, Queens, Tango, Pinpoint, Crossclimb) and compete on a live leaderboard.

## Features

✨ **Multi-Game Support**
- Track scores for 6+ LinkedIn games simultaneously
- Each game has its own leaderboard with dedicated tabs

📊 **Real-Time Leaderboard**
- Automatically ranks players by score (lower = better)
- Displays medals (🥇🥈🥉) for top 3 positions
- Shows player names, scores, and submission dates

📝 **Score Submission**
- Simple form for players to submit scores
- Supports both time-based (MM:SS format) and step-based scoring
- Date tracking for each submission

⚙️ **Admin Panel**
- Add/delete players
- Add/delete games with scoring type selection
- Confirmation dialogs prevent accidental deletions
- All changes saved to JSON files

🚀 **GitHub Pages Hosting**
- Free hosting directly from repository
- No server required
- Static HTML/JSON architecture

## Data Structure

```
src/data/
├── players.json      # List of players
├── games.json        # Game definitions with scoring types
└── scores.json       # Game scores and results
```

### players.json
```json
[
  {
    "id": "player_001",
    "name": "You"
  }
]
```

### games.json
```json
[
  {
    "id": "game_001",
    "name": "Mini Sudoku",
    "scoring_type": "time"  // or "steps"
  }
]
```

### scores.json
```json
[
  {
    "player_id": "player_001",
    "game_id": "game_001",
    "score": 145,
    "date": "2026-03-31"
  }
]
```

## Setup & Deployment

1. **Clone/Fork this repository**
2. **Enable GitHub Pages**
   - Settings → Pages → Source: Deploy from branch → Select `main` branch, `/docs` folder
3. **Access your leaderboard**
   - `https://yourusername.github.io/linkedinLeaderboard/leaderboard.html`

## Usage

### Submit Scores
1. Navigate to `form.html`
2. Select player and game
3. Enter score (time in seconds or MM:SS, or steps as number)
4. Submit

### View Leaderboard
1. Navigate to `leaderboard.html`
2. Switch between game tabs
3. Scores ranked from lowest to highest

### Admin Panel
1. Navigate to `admin.html`
2. Add/delete players and games
3. Changes are saved to browser's localStorage (manual JSON commits required)

## Automation (GitHub Actions)

The leaderboard automatically rebuilds before 11:00 AM on weekdays. To set up:

1. Create `.github/workflows/rebuild-leaderboard.yml`
2. Configure schedule: `0 10 * * 1-5` (10:00 AM Monday-Friday)
3. Workflow rebuilds leaderboard from JSON data

## File Structure

```
linkedinLeaderboard/
├── docs/                    # GitHub Pages root
│   ├── leaderboard.html    # Main leaderboard page
│   ├── form.html           # Score submission form
│   └── admin.html          # Admin panel
├── src/
│   ├── data/               # Data files
│   │   ├── players.json
│   │   ├── games.json
│   │   └── scores.json
│   ├── js/                 # JavaScript
│   │   ├── utils.js        # Shared utilities
│   │   ├── leaderboard.js  # Leaderboard logic
│   │   ├── form.js         # Form logic
│   │   └── admin.js        # Admin panel logic
│   └── styles/
│       └── style.css       # Styling
└── README.md
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript required
- LocalStorage used for temporary data

## Future Enhancements

- GitHub API integration for automatic JSON commits
- Multiple leaderboards (daily, weekly, monthly)
- Player profiles and stats
- Score history/analytics
- Holiday calendar configuration
- Mobile app

## License

MIT
