// server/server.js

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const Game = require('./gameLogic');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const game = new Game();

wss.on('connection', (ws) => {
  const playerId = Math.random().toString(36).substr(2, 9);

  if (!game.addPlayer(playerId)) {
    ws.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
    ws.close();
    return;
  }

  ws.send(JSON.stringify({ type: 'playerId', playerId }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'initialize':
        // For simplicity, auto-assign positions
        const positions = [
          { name: 'Pawn1' },
          { name: 'Pawn2' },
          { name: 'Hero1' },
          { name: 'Hero2' },
        ];
        game.initializeBoard(playerId, positions);
        break;

      case 'move':
        const success = game.processMove(playerId, data.characterName, data.move);
        ws.send(JSON.stringify({ type: 'moveResult', success }));
        break;

      case 'reset':
        game.resetGame();
        break;
    }

    // Broadcast updated game state to all clients
    const gameState = game.getGameState();
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'gameState', gameState }));
      }
    });
  });
});

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});

app.use(express.static('client'));
