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

// Update JSON data via GitHub API
async function updateJSONFile(path, data, token, owner, repo) {
  try {
    if (!token || !owner || !repo) {
      throw new Error('GitHub token, owner, and repo are required');
    }

    const apiPath = path.replace(/\\/g, '/'); // Normalize path separators
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${apiPath}`;

    // First, get the current file to get its SHA
    const getResponse = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!getResponse.ok && getResponse.status !== 404) {
      throw new Error(`GitHub API error: ${getResponse.status}`);
    }

    let sha = null;
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
    }

    // Prepare the content
    const content = JSON.stringify(data, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    // Create or update the file
    const putResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Admin update: ${apiPath}`,
        content: encodedContent,
        ...(sha && { sha })
      })
    });

    if (!putResponse.ok) {
      const error = await putResponse.json();
      throw new Error(`Failed to update ${apiPath}: ${error.message}`);
    }

    return { success: true, message: `Updated ${apiPath}` };
  } catch (error) {
    console.error('Error updating JSON file:', error);
    throw error;
  }
}

document.addEventListener('DOMContentLoaded', initTabs);
