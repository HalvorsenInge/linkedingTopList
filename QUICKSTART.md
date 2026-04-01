# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Push to GitHub
```bash
# If you haven't already set up a GitHub remote:
git remote add origin https://github.com/yourusername/linkedinLeaderboard.git
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repository **Settings**
2. Click **Pages** (left sidebar)
3. Under "Build and deployment":
   - Source: "Deploy from a branch"
   - Branch: `main`
4. Click **Save** ✅

Wait 1-2 minutes for deployment...

### Step 3: Access Your Leaderboard
Your leaderboard is now live at:
```
https://yourusername.github.io/linkedinLeaderboard/docs/leaderboard.html
```

## 📝 Usage Overview

### For Players: Submit Scores
👉 Go to: `/docs/form.html`
1. Select your name (or ask admin to add you)
2. Select a game
3. Enter your score
4. Click "Submit Score"
5. ✨ You'll appear on the leaderboard!

### For Everyone: View Leaderboard
👉 Go to: `/docs/leaderboard.html`
- 📊 See rankings by game
- 🥇 Check top 3 players (medals)
- 📅 View submission dates

### For Admin (You): Manage Players & Games
👉 Go to: `/docs/admin.html`
- ➕ Add players
- ➕ Add games (choose "time" or "steps" scoring)
- 🗑️ Delete players/games (with confirmation)

## 📊 Current Games (Pre-configured)
- ⏱️ **Mini Sudoku** - Time-based
- 🎯 **Zip** - Steps-based
- 🎯 **Queens** - Steps-based
- ⏱️ **Tango** - Time-based
- ⏱️ **Pinpoint** - Time-based
- 🎯 **Crossclimb** - Steps-based

## 🤔 Time Format Help
When submitting a time-based game score:
- **Seconds format**: `145` (for 145 seconds)
- **MM:SS format**: `2:25` (for 2 minutes 25 seconds)

Both work! Use whatever is easier.

## 🔄 Automatic Updates
Every weekday at 10:00 AM, GitHub Actions automatically:
- ✓ Validates your data
- ✓ Rebuilds the leaderboard
- ✓ Commits any changes

## 📁 File Structure Quick Reference
```
docs/                     ← All pages (leaderboard, form, admin)
src/data/
  ├── players.json       ← Player list
  ├── games.json         ← Game definitions
  └── scores.json        ← All game scores
```

## 🛠️ Need to Update Data Directly?

Edit JSON files via GitHub's web editor:

**Add a score:**
1. Go to `src/data/scores.json` in your GitHub repo
2. Click the pencil ✏️ (Edit)
3. Add a new line in the array:
```json
{
  "player_id": "player_001",
  "game_id": "game_001",
  "score": 120,
  "date": "2026-04-01"
}
```
4. Click "Commit changes"

**Add a player:**
1. Go to `src/data/players.json`
2. Add:
```json
{
  "id": "player_002",
  "name": "Friend Name"
}
```

**Add a game:**
1. Go to `src/data/games.json`
2. Add (pick `"time"` or `"steps"`):
```json
{
  "id": "game_007",
  "name": "New Game",
  "scoring_type": "time"
}
```

## ⚠️ Scoring Rules
- **Lower scores win!** 🏆
- Fastest times rank highest
- Fewest steps rank highest

## 🆘 Troubleshooting

**"Page not found" error?**
- Wait 2-3 minutes after enabling Pages
- Refresh the browser
- Check Settings → Pages shows deployment successful

**Scores not showing up?**
- Make sure you pushed the changes to GitHub
- Verify JSON syntax is valid
- Check the `src/data/scores.json` file has proper format

**Players/Games dropdown empty?**
- Add players using `/docs/admin.html` or edit `src/data/players.json`
- Add games using `/docs/admin.html` or edit `src/data/games.json`

**Want to delete everything and start fresh?**
- Reset the JSON files to empty arrays: `[]`
- Or delete and recreate from the admin panel

## 💡 Pro Tips

1. **Backup your data** - Keep a copy of scores.json locally
2. **Share the link** - Send friends `https://yourusername.github.io/linkedinLeaderboard/docs/leaderboard.html`
3. **Use the admin panel** for changes (easier than editing JSON)
4. **Check Actions tab** if things aren't working (shows workflow logs)

## 🎉 You're All Set!

Your leaderboard is ready to use. Start by:
1. Adding yourself as a player (admin panel)
2. Submitting a test score (form page)
3. Viewing your name on the leaderboard! 🎉

Questions? Check `GITHUB_PAGES_SETUP.md` for detailed deployment info.
