// Rank to points mapping
const rankPoints = {
    'LT5': 1,
    'HT5': 2,
    'LT4': 3,
    'HT4': 4,
    'LT3': 6,
    'HT3': 10,
    'LT2': 20,
    'HT2': 30,
    'LT1': 45,
    'HT1': 60
};

let players = [];

// Load players from localStorage
function loadPlayers() {
    const saved = localStorage.getItem('mctiersPlayers');
    if (saved) {
        players = JSON.parse(saved);
        renderLeaderboard();
    }
}

// Save players to localStorage
function savePlayers() {
    localStorage.setItem('mctiersPlayers', JSON.stringify(players));
}

// Open modal
function openAddPlayerModal() {
    document.getElementById('modal').classList.add('show');
    document.getElementById('player-name').focus();
    updateRankCount();
}

// Close modal
function closeAddPlayerModal() {
    document.getElementById('modal').classList.remove('show');
    document.getElementById('player-name').value = '';
    document.getElementById('player-rank').value = '';
}

// Update rank count display
function updateRankCount() {
    const playerName = document.getElementById('player-name').value.trim();
    const player = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
    const rankCountDiv = document.getElementById('rank-count');
    
    if (player) {
        const ranksCount = player.ranks.length;
        if (ranksCount >= 8) {
            rankCountDiv.innerHTML = `<div class="warning">⚠ This player already has 8 ranks (maximum)!</div>`;
        } else {
            rankCountDiv.innerHTML = `<div class="info">Ranks: ${ranksCount}/8</div>`;
        }
    } else {
        rankCountDiv.innerHTML = `<div class="info">New player - will have 1 rank</div>`;
    }
}

// Add rank to player
function addRank() {
    const name = document.getElementById('player-name').value.trim();
    const rank = document.getElementById('player-rank').value;

    if (!name) {
        alert('Please enter a player name');
        return;
    }

    if (!rank) {
        alert('Please select a rank');
        return;
    }

    // Check if player exists
    let player = players.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (player) {
        // Player exists - add rank
        if (player.ranks.length >= 8) {
            alert('This player already has 8 ranks (maximum)!');
            return;
        }
        player.ranks.push(rank);
    } else {
        // New player - create with first rank
        players.push({
            id: Date.now(),
            name: name,
            ranks: [rank]
        });
    }

    savePlayers();
    renderLeaderboard();
    closeAddPlayerModal();
}

// Calculate player points
function calculatePoints(ranks) {
    return ranks.reduce((total, rank) => total + rankPoints[rank], 0);
}

// Delete player
function deletePlayer(id) {
    if (confirm('Are you sure you want to delete this player?')) {
        players = players.filter(p => p.id !== id);
        savePlayers();
        renderLeaderboard();
    }
}

// Delete rank from player
function deleteRank(playerId, rankIndex) {
    const player = players.find(p => p.id === playerId);
    if (player) {
        player.ranks.splice(rankIndex, 1);
        
        if (player.ranks.length === 0) {
            // If no ranks left, delete player
            deletePlayer(playerId);
        } else {
            savePlayers();
            renderLeaderboard();
        }
    }
}

// Render leaderboard
function renderLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    const emptyState = document.getElementById('empty-state');

    if (players.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }

    emptyState.classList.remove('show');

    // Sort by points (descending)
    const sorted = [...players].sort((a, b) => calculatePoints(b.ranks) - calculatePoints(a.ranks));

    tbody.innerHTML = sorted.map((player, index) => {
        const points = calculatePoints(player.ranks);
        const ranksDisplay = player.ranks.map((rank, rankIndex) => `
            <span class="rank-badge tier-${rank.toLowerCase()}">
                ${rank}
                <button class="rank-delete" onclick="deleteRank(${player.id}, ${rankIndex})">×</button>
            </span>
        `).join('');

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td class="ranks-cell">${ranksDisplay}</td>
                <td class="points-cell">${points}</td>
                <td>
                    <button class="delete-btn" onclick="deletePlayer(${player.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Allow Enter key and autocomplete
document.addEventListener('DOMContentLoaded', function() {
    loadPlayers();

    const playerNameInput = document.getElementById('player-name');
    const playerRankSelect = document.getElementById('player-rank');

    // Autocomplete player names
    playerNameInput.addEventListener('input', function() {
        updateRankCount();
    });

    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            playerRankSelect.focus();
        }
    });

    playerRankSelect.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addRank();
        }
    });

    // Close modal when clicking outside
    const modal = document.getElementById('modal');
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAddPlayerModal();
        }
    });
});
