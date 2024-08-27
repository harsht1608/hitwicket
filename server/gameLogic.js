// server/gameLogic.js

class Game {
    constructor() {
      this.grid = Array(5).fill().map(() => Array(5).fill(null));
      this.players = {}; // Track players by ID
      this.currentTurn = null;
    }
  
    addPlayer(playerId) {
      if (Object.keys(this.players).length < 2) {
        this.players[playerId] = { id: playerId, characters: [] };
        if (Object.keys(this.players).length === 1) {
          this.currentTurn = playerId; // First player to join gets the first turn
        }
        return true;
      }
      return false;
    }
  
    initializeBoard(playerId, positions) {
      // Initialize player's pieces on the board
      if (this.players[playerId]) {
        positions.forEach((character, index) => {
          this.grid[0][index] = { ...character, owner: playerId };
          this.players[playerId].characters.push(character);
        });
      }
    }
  
    isValidMove(playerId, characterName, move) {
      // Validate the move according to game rules
      return true; // Simplified for this example
    }
  
    processMove(playerId, characterName, move) {
      if (playerId !== this.currentTurn) return false;
      if (this.isValidMove(playerId, characterName, move)) {
        // Apply the move
        this.updateTurn();
        return true;
      }
      return false;
    }
  
    updateTurn() {
      const playerIds = Object.keys(this.players);
      this.currentTurn = playerIds.find(id => id !== this.currentTurn); // Switch turn
    }
  
    resetGame() {
      this.grid = Array(5).fill().map(() => Array(5).fill(null));
      this.currentTurn = Object.keys(this.players)[0]; // Reset turn to first player
    }
  
    getGameState() {
      return {
        grid: this.grid,
        currentTurn: this.currentTurn,
        players: this.players,
      };
    }
  }
  
  module.exports = Game;
  