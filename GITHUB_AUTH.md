# Using GitHub Authentication in the Admin Panel

The admin panel now supports direct GitHub integration, allowing you to add and delete players/games with automatic persistence to your repository.

## Step 1: Create a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens (or click the "Create Token" link in the admin panel)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name like "LinkedIn Leaderboard Admin"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

## Step 2: Authenticate in Admin Panel

1. Navigate to your leaderboard's admin panel (`/docs/admin.html`)
2. At the top, you'll see the GitHub Authentication section
3. Paste your token into the input field
4. Click **"Authenticate"**
5. You should see a confirmation: ✅ Authenticated as `username/linkedinLeaderboard`

## Step 3: Add Players & Games

Once authenticated:
- **Add a player**: Enter a name and click "➕ Add Player"
  - Player appears in the list instantly
  - Change is automatically committed to `src/data/players.json`
- **Add a game**: Enter name, select scoring type, click "➕ Add Game"
  - Game appears in the list instantly
  - Change is automatically committed to `src/data/games.json`

## What Happens Without Authentication?

If you don't authenticate:
- Players and games are still added to the UI and saved to your browser's localStorage
- **Changes don't persist** across devices or after closing the browser
- You'll see a warning: "⚠️ Not authenticated - changes will only save locally"

## Important Security Notes

⚠️ **Your GitHub token is stored in browser localStorage** (not encrypted). This is OK for personal projects because:
- The token is only sent to GitHub's official API
- Token scope is limited to repository access
- You can revoke the token anytime at https://github.com/settings/tokens

🔒 **Best practices**:
1. Use a **classic personal access token** with minimal scope
2. **Revoke the token** when you're done making changes
3. **Never share** the token with others
4. If you suspect it was compromised, delete it immediately on GitHub

## Troubleshooting

**"Authentication failed" error**
- Token is invalid or expired
- GitHub API is temporarily down
- Check the browser console (F12 → Console tab) for error details

**Token doesn't appear to work**
- Make sure you created a **classic** token, not a fine-grained token
- Token must have `repo` scope
- Token must not be expired

**"No access to owner/repo" error**
- The admin panel couldn't find your GitHub repository
- Make sure the repository name is correct in the URL
- Verify your token has access to the repository

**Changes saved to GitHub but not appearing on GitHub Pages**
- GitHub Pages may take a few minutes to rebuild
- Refresh your browser
- Check the Actions tab in your GitHub repository for any errors
