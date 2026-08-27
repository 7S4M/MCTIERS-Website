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
}

// Close modal
function closeAddPlayerModal() {
    document.getElementById('modal').classList.remove('show');
    document.getElementById('player-name').value = '';
    document.getElementById('player-rank').value = '';
}

// Add player
function addPlayer() {
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

    // Check if player already exists
    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        alert('Player already exists!');
        return;
    }

    players.push({
        id: Date.now(),
        name: name,
        rank: rank,
        points: rankPoints[rank]
    });

    savePlayers();
    renderLeaderboard();
    closeAddPlayerModal();
}

// Delete player
function deletePlayer(id) {
    if (confirm('Are you sure you want to delete this player?')) {
        players = players.filter(p => p.id !== id);
        savePlayers();
        renderLeaderboard();
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
    const sorted = [...players].sort((a, b) => b.points - a.points);

    tbody.innerHTML = sorted.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td class="tier-${player.rank.toLowerCase()}">${player.rank}</td>
            <td>${player.points}</td>
            <td>
                <button class="delete-btn" onclick="deletePlayer(${player.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Allow Enter key to add player
document.addEventListener('DOMContentLoaded', function() {
    loadPlayers();

    const playerNameInput = document.getElementById('player-name');
    const playerRankSelect = document.getElementById('player-rank');
    const addBtn = document.querySelector('.btn-add');

    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            playerRankSelect.focus();
        }
    });

    playerRankSelect.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addPlayer();
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
