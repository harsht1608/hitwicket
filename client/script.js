let playerId = null;
let ws;

function connectWebSocket() {
  ws = new WebSocket('ws://localhost:8000');

  ws.onopen = () => {
    console.log('Connected to the WebSocket server');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleServerMessage(data);
  };

  ws.onclose = (event) => {
    console.log('WebSocket connection closed', event);
    // Optionally, attempt to reconnect
  };

  ws.onerror = (error) => {
    console.error('WebSocket error', error);
  };
}

function handleServerMessage(data) {
  switch (data.type) {
    case 'playerId':
      playerId = data.playerId;
      break;
    case 'gameState':
      updateGameState(data.gameState);
      break;
    case 'moveResult':
      alert(data.success ? 'Move successful' : 'Move failed');
      break;
    case 'error':
      alert(data.message);
      break;
  }
}

function updateGameState(gameState) {
  document.getElementById('current-player').textContent = gameState.currentTurn;
  const board = document.getElementById('game-board');
  board.innerHTML = '';

  gameState.grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('grid-cell');

      // Displaying the correct cell information
      if (cell && cell.owner && cell.name) {
        cellDiv.textContent = `${cell.name}`;
      } else {
        cellDiv.textContent = ''; // Empty if no character
      }

      cellDiv.addEventListener('click', () => {
        handleCellClick(rowIndex, colIndex);
      });

      board.appendChild(cellDiv);
    });
  });
}

function handleCellClick(row, col) {
  if (ws.readyState === WebSocket.OPEN) {
    const characterName = prompt('Enter character name to move:');
    const move = prompt('Enter move (e.g., up, down, left, right):');
    ws.send(JSON.stringify({
      type: 'move',
      characterName: characterName,
      move: move,
      position: { row, col }
    }));
  } else {
    alert('WebSocket connection is not open');
  }
}

document.getElementById('start-game').addEventListener('click', () => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'initialize', positions: [] }));
  } else {
    alert('WebSocket connection is not open');
  }
});

document.getElementById('reset-game').addEventListener('click', () => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'reset' }));
  } else {
    alert('WebSocket connection is not open');
  }
});

// Connect to WebSocket server on page load
connectWebSocket();
