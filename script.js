document.addEventListener('DOMContentLoaded', function() {
    // Game state
    const gameState = {
        currentPlayer: 1,
        diceValue: 0,
        tokens: {
            1: { positions: [0, 0, 0, 0], home: 0 }, // Player 1 (Red)
            2: { positions: [0, 0, 0, 0], home: 0 }, // Player 2 (Green)
            3: { positions: [0, 0, 0, 0], home: 0 }, // Player 3 (Yellow)
            4: { positions: [0, 0, 0, 0], home: 0 }  // Player 4 (Blue)
        },
        boardSize: 52, // Total cells in the path
        winningPath: {
            1: [/* array of cell indexes for player 1 */],
            2: [/* array of cell indexes for player 2 */],
            3: [/* array of cell indexes for player 3 */],
            4: [/* array of cell indexes for player 4 */]
        }
    };

    // DOM elements
    const rollDiceBtn = document.getElementById('roll-dice');
    const diceValueEl = document.getElementById('dice-value');
    const currentPlayerEl = document.getElementById('current-player');
    const tokens = document.querySelectorAll('.token');

    // Initialize game
    function initGame() {
        // Set up event listeners
        rollDiceBtn.addEventListener('click', rollDice);
        
        tokens.forEach(token => {
            token.addEventListener('click', handleTokenClick);
        });
        
        updateUI();
    }

    // Roll dice function
    function rollDice() {
        gameState.diceValue = Math.floor(Math.random() * 6) + 1;
        diceValueEl.textContent = gameState.diceValue;
        
        // Check if player has movable tokens
        if (!canPlayerMove(gameState.currentPlayer)) {
            // Skip turn if no moves possible
            nextPlayer();
        }
    }

    // Check if player can move
    function canPlayerMove(player) {
        // Check if any token can move based on dice value
        // This is a simplified version - you'll need to expand it
        return gameState.diceValue === 6 || 
               gameState.tokens[player].positions.some(pos => pos > 0);
    }

    // Handle token click
    function handleTokenClick(e) {
        const token = e.target;
        const player = parseInt(token.closest('.player').dataset.player);
        const tokenNum = parseInt(token.dataset.token);
        
        // Only allow current player to move their tokens
        if (player !== gameState.currentPlayer) return;
        
        // Only allow moves after dice is rolled
        if (gameState.diceValue === 0) return;
        
        // Move token
        moveToken(player, tokenNum - 1); // Convert to 0-based index
        
        // Update UI
        updateUI();
        
        // Check for win condition
        if (checkWin(player)) {
            alert(`Player ${player} wins!`);
            resetGame();
            return;
        }
        
        // If not 6, switch player
        if (gameState.diceValue !== 6) {
            nextPlayer();
        } else {
            // Allow another turn if rolled 6
            gameState.diceValue = 0;
            diceValueEl.textContent = '0';
        }
    }

    // Move token logic
    function moveToken(player, tokenIndex) {
        const tokenState = gameState.tokens[player];
        
        // If token is in home (position 0) and dice is 6, start it
        if (tokenState.positions[tokenIndex] === 0 && gameState.diceValue === 6) {
            tokenState.positions[tokenIndex] = 1;
            return;
        }
        
        // If token is already on the board, move it
        if (tokenState.positions[tokenIndex] > 0) {
            tokenState.positions[tokenIndex] += gameState.diceValue;
            
            // Check if token completed the loop
            if (tokenState.positions[tokenIndex] > gameState.boardSize) {
                tokenState.positions[tokenIndex] = 0; // Return to home
                tokenState.home++; // Increment home count
            }
        }
        
        // TODO: Add collision detection with other players' tokens
    }

    // Check win condition
    function checkWin(player) {
        return gameState.tokens[player].home === 4;
    }

    // Switch to next player
    function nextPlayer() {
        gameState.currentPlayer = gameState.currentPlayer % 4 + 1;
        gameState.diceValue = 0;
        updateUI();
    }

    // Reset game
    function resetGame() {
        gameState.currentPlayer = 1;
        gameState.diceValue = 0;
        for (let player in gameState.tokens) {
            gameState.tokens[player].positions = [0, 0, 0, 0];
            gameState.tokens[player].home = 0;
        }
        updateUI();
    }

    // Update UI
    function updateUI() {
        // Update current player display
        currentPlayerEl.textContent = gameState.currentPlayer;
        
        // Update dice display
        diceValueEl.textContent = gameState.diceValue;
        
        // Update token positions on board (simplified - you'll need to implement actual positioning)
        // This would involve calculating the actual x,y positions on the board
        // based on the gameState.tokens positions
        
        // Highlight current player's tokens
        document.querySelectorAll('.player').forEach(playerEl => {
            const playerNum = parseInt(playerEl.dataset.player);
            playerEl.style.opacity = playerNum === gameState.currentPlayer ? '1' : '0.6';
        });
    }

    // Start the game
    initGame();
});