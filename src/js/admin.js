// Admin panel logic
let allPlayers = [];
let allGames = [];

async function initAdmin() {
  // Load data
  allPlayers = await loadJSON('../src/data/players.json');
  allGames = await loadJSON('../src/data/games.json');

  // Render tables
  renderPlayersTable();
  renderGamesTable();

  // Handle form submissions
  document.getElementById('addPlayerForm').addEventListener('submit', handleAddPlayer);
  document.getElementById('addGameForm').addEventListener('submit', handleAddGame);
}

function renderPlayersTable() {
  const tbody = document.getElementById('playersTable');
  tbody.innerHTML = '';

  allPlayers.forEach(player => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${player.name}</td>
      <td><code>${player.id}</code></td>
      <td>
        <button class="danger" onclick="deletePlayer('${player.id}', '${player.name}')">🗑️ Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (allPlayers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">No players yet</td></tr>';
  }
}

function renderGamesTable() {
  const tbody = document.getElementById('gamesTable');
  tbody.innerHTML = '';

  allGames.forEach(game => {
    const typeLabel = game.scoring_type === 'time' ? '⏱️ Time' : '🎯 Steps';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${game.name}</td>
      <td>${typeLabel}</td>
      <td><code>${game.id}</code></td>
      <td>
        <button class="danger" onclick="deleteGame('${game.id}', '${game.name}')">🗑️ Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (allGames.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">No games yet</td></tr>';
  }
}

function handleAddPlayer(e) {
  e.preventDefault();

  const playerName = document.getElementById('playerName').value.trim();

  if (!playerName) {
    showAlert('Player name cannot be empty', 'error');
    return;
  }

  // Check for duplicates
  if (allPlayers.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
    showAlert('Player already exists!', 'error');
    return;
  }

  // Generate ID
  const newId = `player_${Date.now()}`;

  // Add player
  const newPlayer = { id: newId, name: playerName };
  allPlayers.push(newPlayer);

  // Save to localStorage
  localStorage.setItem('players', JSON.stringify(allPlayers));

  showAlert(`Player "${playerName}" added successfully!`, 'success');

  // Reset form
  document.getElementById('addPlayerForm').reset();

  // Re-render
  renderPlayersTable();
}

function handleAddGame(e) {
  e.preventDefault();

  const gameName = document.getElementById('gameName').value.trim();
  const scoringType = document.getElementById('scoringType').value;

  if (!gameName) {
    showAlert('Game name cannot be empty', 'error');
    return;
  }

  // Check for duplicates
  if (allGames.some(g => g.name.toLowerCase() === gameName.toLowerCase())) {
    showAlert('Game already exists!', 'error');
    return;
  }

  // Generate ID
  const newId = `game_${Date.now()}`;

  // Add game
  const newGame = { id: newId, name: gameName, scoring_type: scoringType };
  allGames.push(newGame);

  // Save to localStorage
  localStorage.setItem('games', JSON.stringify(allGames));

  showAlert(`Game "${gameName}" added successfully!`, 'success');

  // Reset form
  document.getElementById('addGameForm').reset();

  // Re-render
  renderGamesTable();
}

function deletePlayer(playerId, playerName) {
  const confirmModal = document.getElementById('confirmModal');
  const confirmMessage = document.getElementById('confirmMessage');
  const confirmDelete = document.getElementById('confirmDelete');

  confirmMessage.textContent = `Are you sure you want to delete player "${playerName}"? This action cannot be undone.`;

  // Clear previous handlers
  confirmDelete.onclick = null;

  // Set new handler
  confirmDelete.onclick = () => {
    allPlayers = allPlayers.filter(p => p.id !== playerId);
    localStorage.setItem('players', JSON.stringify(allPlayers));
    hideModal('confirmModal');
    showAlert(`Player "${playerName}" deleted successfully!`, 'success');
    renderPlayersTable();
  };

  showModal('confirmModal');
}

function deleteGame(gameId, gameName) {
  const confirmModal = document.getElementById('confirmModal');
  const confirmMessage = document.getElementById('confirmMessage');
  const confirmDelete = document.getElementById('confirmDelete');

  confirmMessage.textContent = `Are you sure you want to delete game "${gameName}"? All scores for this game will remain but it won't appear in the leaderboard.`;

  // Clear previous handlers
  confirmDelete.onclick = null;

  // Set new handler
  confirmDelete.onclick = () => {
    allGames = allGames.filter(g => g.id !== gameId);
    localStorage.setItem('games', JSON.stringify(allGames));
    hideModal('confirmModal');
    showAlert(`Game "${gameName}" deleted successfully!`, 'success');
    renderGamesTable();
  };

  showModal('confirmModal');
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}
