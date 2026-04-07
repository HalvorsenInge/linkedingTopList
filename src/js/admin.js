// Admin panel logic
let allPlayers = [];
let allGames = [];
let githubToken = null;
let githubOwner = null;
let githubRepo = null;

async function initAdmin() {
  // Load data
  allPlayers = await loadJSON('../src/data/players.json');
  allGames = await loadJSON('../src/data/games.json');

  // Try to restore GitHub token from localStorage
  const savedToken = localStorage.getItem('githubToken');
  const savedOwner = localStorage.getItem('githubOwner');
  const savedRepo = localStorage.getItem('githubRepo');
  
  if (savedToken && savedOwner && savedRepo) {
    githubToken = savedToken;
    githubOwner = savedOwner;
    githubRepo = savedRepo;
    updateAuthStatus(true);
  }

  // Render tables
  renderPlayersTable();
  renderGamesTable();

  // Handle form submissions
  document.getElementById('addPlayerForm').addEventListener('submit', handleAddPlayer);
  document.getElementById('addGameForm').addEventListener('submit', handleAddGame);
  document.getElementById('authButton').addEventListener('click', handleAuthenticate);
}

function updateAuthStatus(isAuthenticated) {
  const statusDiv = document.getElementById('authStatus');
  const authForm = document.getElementById('authForm');
  
  if (isAuthenticated) {
    statusDiv.innerHTML = `✅ <strong>Authenticated</strong> as ${githubOwner}/${githubRepo}`;
    statusDiv.style.color = '#28a745';
    authForm.style.display = 'none';
  } else {
    statusDiv.innerHTML = '⚠️ Not authenticated - changes will only save locally';
    statusDiv.style.color = '#dc3545';
    authForm.style.display = 'flex';
  }
}

async function handleAuthenticate() {
  const tokenInput = document.getElementById('githubToken').value.trim();
  const statusDiv = document.getElementById('authStatus');

  if (!tokenInput) {
    statusDiv.innerHTML = '❌ Please enter a token';
    statusDiv.style.color = '#dc3545';
    return;
  }

  try {
    // Verify token and get repo info
    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${tokenInput}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error('Invalid token or API error');
    }

    // Try to detect the current repo from the page URL
    // Format: https://username.github.io/linkedinLeaderboard/...
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(p => p);
    
    // Assuming the repo name is in the URL
    const repoName = pathParts[1] || 'linkedinLeaderboard';
    const ownerName = window.location.hostname.split('.')[0];

    // Verify we have access to this repo
    const repoResponse = await fetch(`https://api.github.com/repos/${ownerName}/${repoName}`, {
      headers: {
        'Authorization': `token ${tokenInput}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!repoResponse.ok) {
      throw new Error(`No access to ${ownerName}/${repoName}`);
    }

    // Save credentials
    githubToken = tokenInput;
    githubOwner = ownerName;
    githubRepo = repoName;
    localStorage.setItem('githubToken', githubToken);
    localStorage.setItem('githubOwner', githubOwner);
    localStorage.setItem('githubRepo', githubRepo);
    document.getElementById('githubToken').value = '';

    updateAuthStatus(true);
    showAlert('✅ Authenticated successfully!', 'success');
  } catch (error) {
    console.error('Auth error:', error);
    updateAuthStatus(false);
    showAlert(`❌ Authentication failed: ${error.message}`, 'error');
  }
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

  // Try to save to GitHub
  if (githubToken && githubOwner && githubRepo) {
    saveToGitHub('src/data/players.json', allPlayers, playerName);
  } else {
    showAlert(`Player "${playerName}" added (local only - not saved to GitHub)`, 'warning');
  }

  // Reset form
  document.getElementById('addPlayerForm').reset();

  // Re-render
  renderPlayersTable();
}

async function saveToGitHub(filePath, data, itemName) {
  try {
    await updateJSONFile(filePath, data, githubToken, githubOwner, githubRepo);
    showAlert(`✅ Changes saved to GitHub!`, 'success');
  } catch (error) {
    console.error('GitHub save error:', error);
    showAlert(`⚠️ Added locally but failed to save to GitHub: ${error.message}`, 'warning');
  }
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

  // Try to save to GitHub
  if (githubToken && githubOwner && githubRepo) {
    saveToGitHub('src/data/games.json', allGames, gameName);
  } else {
    showAlert(`Game "${gameName}" added (local only - not saved to GitHub)`, 'warning');
  }

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
    
    // Try to save to GitHub
    if (githubToken && githubOwner && githubRepo) {
      saveToGitHub('src/data/players.json', allPlayers, playerName);
    } else {
      showAlert(`Player "${playerName}" deleted (local only - not saved to GitHub)`, 'warning');
    }
    
    hideModal('confirmModal');
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
    
    // Try to save to GitHub
    if (githubToken && githubOwner && githubRepo) {
      saveToGitHub('src/data/games.json', allGames, gameName);
    } else {
      showAlert(`Game "${gameName}" deleted (local only - not saved to GitHub)`, 'warning');
    }
    
    hideModal('confirmModal');
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
