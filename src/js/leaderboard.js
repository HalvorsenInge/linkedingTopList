// Leaderboard logic
let allPlayers = [];
let allGames = [];
let allScores = [];

async function initLeaderboard() {
  // Load all data
  allPlayers = await loadJSON('../src/data/players.json');
  allGames = await loadJSON('../src/data/games.json');
  allScores = await loadJSON('../src/data/scores.json');

  if (allGames.length === 0) {
    document.getElementById('leaderboardsContainer').innerHTML = '<p>No games available yet.</p>';
    return;
  }

  // Create tabs
  const tabsContainer = document.getElementById('gamesTabs');
  const leaderboardsContainer = document.getElementById('leaderboardsContainer');

  allGames.forEach((game, index) => {
    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.className = 'tab-button';
    if (index === 0) tabButton.classList.add('active');
    tabButton.setAttribute('data-tab', `game-${game.id}`);
    tabButton.textContent = game.name;
    tabsContainer.appendChild(tabButton);

    // Create leaderboard content
    const content = document.createElement('div');
    content.id = `game-${game.id}`;
    content.className = 'tab-content';
    if (index === 0) content.classList.add('active');

    const gameScores = allScores
      .filter(score => score.game_id === game.id)
      .map(score => ({
        ...score,
        playerName: getPlayerName(score.player_id, allPlayers),
        scoringType: game.scoring_type
      }))
      .sort((a, b) => a.score - b.score); // Lower scores rank higher

    if (gameScores.length === 0) {
      content.innerHTML = '<p>No scores submitted yet for this game.</p>';
    } else {
      let html = '<table class="leaderboard"><thead><tr><th>Rank</th><th>Player</th><th>Score</th><th>Date</th></tr></thead><tbody>';

      gameScores.forEach((score, rank) => {
        const formattedScore = formatScore(score.score, score.scoringType);
        const formattedDate = formatDate(score.date);
        const badge = getRankBadge(rank + 1);

        html += `<tr>
          <td class="rank">${badge}</td>
          <td>${score.playerName}</td>
          <td>${formattedScore}</td>
          <td>${formattedDate}</td>
        </tr>`;
      });

      html += '</tbody></table>';
      content.innerHTML = html;
    }

    leaderboardsContainer.appendChild(content);
  });

  // Re-initialize tabs after creating them
  initTabs();
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLeaderboard);
} else {
  initLeaderboard();
}
