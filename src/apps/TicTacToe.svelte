<script>
    const WINNING_COMBINATIONS = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    let board = Array(9).fill(null);
    let isXNext = true;
    let winner = null;
    let gameOver = false;
    
    function handleClick(index) {
      if (board[index] || winner) return;
      
      board[index] = isXNext ? 'X' : 'O';
      board = [...board]; // Trigger reactivity
      
      checkWinner();
      if (!winner) {
        isXNext = !isXNext;
        if (!gameOver) makeAIMove();
      }
    }
    
    function makeAIMove() {
      if (winner || board.every(cell => cell !== null)) return;
      
      // Simple AI: Look for winning move, then blocking move, then center, then random
      let moveIndex = findBestMove();
      
      setTimeout(() => {
        board[moveIndex] = 'O';
        board = [...board];
        checkWinner();
        isXNext = true;
      }, 300); // Small delay for better UX
    }
    
    function findBestMove() {
      // Try to win
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'O';
          if (checkWinningMove()) {
            board[i] = null;
            return i;
          }
          board[i] = null;
        }
      }
      
      // Block player's winning move
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'X';
          if (checkWinningMove()) {
            board[i] = null;
            return i;
          }
          board[i] = null;
        }
      }
      
      // Take center if available
      if (!board[4]) return 4;
      
      // Take random available spot
      const availableSpots = board
        .map((cell, index) => cell === null ? index : null)
        .filter(spot => spot !== null);
      
      return availableSpots[Math.floor(Math.random() * availableSpots.length)];
    }
    
    function checkWinningMove() {
      return WINNING_COMBINATIONS.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
      });
    }
    
    function checkWinner() {
      WINNING_COMBINATIONS.forEach(combination => {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          winner = board[a];
          gameOver = true;
        }
      });
      
      if (!winner && board.every(cell => cell !== null)) {
        gameOver = true;
      }
    }
    
    function resetGame() {
      board = Array(9).fill(null);
      isXNext = true;
      winner = null;
      gameOver = false;
    }
  </script>
  
  <div class="game-container">
    <div class="status">
      {#if winner}
        {winner} Wins!
      {:else if gameOver}
        Draw!
      {:else}
        {isXNext ? 'Your Turn (X)' : 'AI Thinking...'}
      {/if}
    </div>
    
    <div class="board">
      {#each board as cell, index}
        <button 
          class="cell"
          on:click={() => handleClick(index)}
          disabled={!isXNext || cell !== null || winner}
        >
          {cell}
        </button>
      {/each}
    </div>
    
    {#if gameOver}
      <button class="reset-button" on:click={resetGame}>
        Play Again
      </button>
    {/if}
  </div>
  
  <style>
    .game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
    }
    
    .status {
      font-size: 1.5rem;
      font-weight: bold;
      font-family: monospace;
      background: black;
      color: white;
      padding: 0.75rem 1.5rem;
    }
    
    .board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
      background: black;
      padding: 4px;
    }
    
    .cell {
      width: 80px;
      height: 80px;
      background: white;
      border: none;
      font-size: 2.5rem;
      font-weight: bold;
      font-family: monospace;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .cell:not(:disabled):hover {
      background: #f0f0f0;
    }
    
    .cell:disabled {
      cursor: not-allowed;
    }
    
    .reset-button {
      background: black;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-family: monospace;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    
    .reset-button:hover {
      opacity: 0.9;
    }
  </style>