# GitHub Pages Setup Guide

To deploy this leaderboard to GitHub Pages, follow these steps:

## 1. Enable GitHub Pages

1. Go to your repository settings
2. Navigate to **Settings → Pages**
3. Under "Build and deployment":
   - Set **Source** to "Deploy from a branch"
   - Set **Branch** to `main`
   - Set **Folder** to `/ (root)` or `/docs`
4. Click **Save**

## 2. Access Your Leaderboard

Your leaderboard will be available at:
```
https://yourusername.github.io/linkedinLeaderboard/
```

Or directly:
- **Leaderboard**: `https://yourusername.github.io/linkedinLeaderboard/docs/leaderboard.html`
- **Submit Score**: `https://yourusername.github.io/linkedinLeaderboard/docs/form.html`
- **Admin Panel**: `https://yourusername.github.io/linkedinLeaderboard/docs/admin.html`

## 3. Automatic Updates (GitHub Actions)

The workflow `.github/workflows/rebuild-leaderboard.yml` automatically runs:
- **Every weekday (Monday-Friday) at 10:00 AM UTC**
- Validates all JSON files
- Commits any changes

You can also manually trigger it:
1. Go to **Actions** tab
2. Select **"Rebuild Leaderboard"** workflow
3. Click **"Run workflow"** button

## 4. Manual Updates

To manually add/update scores:

1. Edit the JSON files directly:
   - `src/data/scores.json` - Add new scores
   - `src/data/players.json` - Add new players
   - `src/data/games.json` - Add new games

2. Commit and push changes:
   ```bash
   git add src/data/
   git commit -m "Update leaderboard scores"
   git push
   ```

## 5. File Locations

- **Leaderboard pages**: `/docs/` folder
- **Data files**: `/src/data/` folder
- **JavaScript**: `/src/js/` folder
- **Styles**: `/src/styles/` folder

## Notes

- Lower scores rank higher (faster times, fewer steps = better)
- Time scores can be in seconds (145) or MM:SS format (2:25)
- Changes to JSON files automatically update the leaderboard (no rebuild needed for reads)
- Admin panel changes are saved to browser localStorage (requires manual JSON commits)

## Troubleshooting

**Page not showing?**
- Wait 1-2 minutes after pushing changes
- Clear browser cache
- Check repository settings → Pages to verify deployment

**Leaderboard not updating?**
- Verify JSON files are valid (check Actions tab for errors)
- Push changes to the correct branch (`main`)
- Check that the branch is selected in Pages settings

**JSON validation fails?**
- Use a JSON validator tool to check syntax
- Ensure all quotes and brackets are properly formatted
- Check for trailing commas in objects/arrays
