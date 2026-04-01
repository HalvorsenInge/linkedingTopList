// Utility functions for data management

async function loadJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${path}:`, error);
    return [];
  }
}

function getPlayerName(playerId, players) {
  const player = players.find(p => p.id === playerId);
  return player ? player.name : 'Unknown Player';
}

function getGameName(gameId, games) {
  const game = games.find(g => g.id === gameId);
  return game ? game.name : 'Unknown Game';
}

function getGameScoringType(gameId, games) {
  const game = games.find(g => g.id === gameId);
  return game ? game.scoring_type : null;
}

function getRankBadge(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

function formatScore(score, scoringType) {
  if (scoringType === 'time') {
    // Assuming time is in seconds
    const minutes = Math.floor(score / 60);
    const seconds = score % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }
  return score.toString();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Tab switching functionality
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Activate first tab by default
  if (tabButtons.length > 0) {
    tabButtons[0].classList.add('active');
    tabContents[0].classList.add('active');
  }
}

// Modal functionality
function showModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Show notifications
function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert ${type}`;
  alertDiv.textContent = message;
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '20px';
  alertDiv.style.right = '20px';
  alertDiv.style.zIndex = '9999';
  alertDiv.style.maxWidth = '300px';

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 4000);
}

// Update JSON data (for admin use with GitHub API)
async function updateJSONFile(path, data, token) {
  // This would be called from admin panel to commit changes to GitHub
  // Requires GitHub API access
  console.log('Update function would need GitHub API implementation');
}

document.addEventListener('DOMContentLoaded', initTabs);
