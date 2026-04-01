// Form submission logic
let allPlayers = [];
let allGames = [];
let allScores = [];

async function initForm() {
  // Load data
  allPlayers = await loadJSON('../src/data/players.json');
  allGames = await loadJSON('../src/data/games.json');
  allScores = await loadJSON('../src/data/scores.json');

  // Populate player dropdown
  const playerSelect = document.getElementById('player');
  allPlayers.forEach(player => {
    const option = document.createElement('option');
    option.value = player.id;
    option.textContent = player.name;
    playerSelect.appendChild(option);
  });

  // Populate game dropdown
  const gameSelect = document.getElementById('game');
  allGames.forEach(game => {
    const option = document.createElement('option');
    option.value = game.id;
    option.textContent = game.name;
    gameSelect.appendChild(option);
  });

  // Set today's date
  document.getElementById('date').valueAsDate = new Date();

  // Handle form submission
  document.getElementById('scoreForm').addEventListener('submit', handleSubmit);
}

function updateScoreLabel() {
  const gameId = document.getElementById('game').value;
  const game = allGames.find(g => g.id === gameId);

  if (!game) return;

  const scoreLabel = document.getElementById('scoreLabel');
  const scoreHint = document.getElementById('scoreHint');
  const scoreInput = document.getElementById('score');

  if (game.scoring_type === 'time') {
    scoreLabel.textContent = 'Time (seconds or MM:SS)';
    scoreHint.textContent = 'Enter time in seconds (145) or MM:SS format (2:25)';
    scoreInput.placeholder = 'e.g., 145 or 2:25';
  } else {
    scoreLabel.textContent = 'Steps/Moves';
    scoreHint.textContent = 'Enter number of steps or moves';
    scoreInput.placeholder = 'e.g., 32';
  }
}

function parseScore(scoreInput, scoringType) {
  if (scoringType === 'steps') {
    const parsed = parseInt(scoreInput, 10);
    if (isNaN(parsed) || parsed < 0) {
      throw new Error('Invalid steps value. Must be a positive number.');
    }
    return parsed;
  } else if (scoringType === 'time') {
    // Handle both "145" and "2:25" formats
    if (scoreInput.includes(':')) {
      const parts = scoreInput.split(':');
      if (parts.length !== 2) throw new Error('Invalid time format. Use MM:SS');
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      if (isNaN(minutes) || isNaN(seconds) || seconds >= 60) {
        throw new Error('Invalid time format. Use MM:SS');
      }
      return minutes * 60 + seconds;
    } else {
      const parsed = parseInt(scoreInput, 10);
      if (isNaN(parsed) || parsed < 0) {
        throw new Error('Invalid time value. Must be a positive number in seconds.');
      }
      return parsed;
    }
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  const playerId = document.getElementById('player').value;
  const gameId = document.getElementById('game').value;
  const scoreInput = document.getElementById('score').value;
  const date = document.getElementById('date').value;

  if (!playerId || !gameId || !scoreInput || !date) {
    showAlert('Please fill in all fields', 'error');
    return;
  }

  try {
    const game = allGames.find(g => g.id === gameId);
    const score = parseScore(scoreInput, game.scoring_type);

    // Create new score object
    const newScore = {
      player_id: playerId,
      game_id: gameId,
      score: score,
      date: date
    };

    // Add to scores array
    allScores.push(newScore);

    // Save to localStorage temporarily
    localStorage.setItem('pendingScore', JSON.stringify(newScore));
    localStorage.setItem('allScores', JSON.stringify(allScores));

    showAlert('Score submitted! ✅ Changes will be saved to GitHub shortly.', 'success');

    // Reset form
    document.getElementById('scoreForm').reset();
    document.getElementById('date').valueAsDate = new Date();
    updateScoreLabel();

    // Redirect to leaderboard after 2 seconds
    setTimeout(() => {
      window.location.href = 'leaderboard.html';
    }, 2000);
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForm);
} else {
  initForm();
}
