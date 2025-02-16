<script>
  const GRID_SIZE = 9;
  const MINES_COUNT = 10;
  
  let grid = [];
  let revealed = [];
  let flagged = [];
  let gameOver = false;
  let gameWon = false;
  let minesLeft = MINES_COUNT;
  let firstClick = true;
  
  function initializeGame() {
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    revealed = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
    flagged = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
    gameOver = false;
    gameWon = false;
    minesLeft = MINES_COUNT;
    firstClick = true;
  }
  
  function placeMines(firstX, firstY) {
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      
      // Don't place mine on first click or where there's already a mine
      if ((x !== firstX || y !== firstY) && grid[y][x] !== -1) {
        grid[y][x] = -1;
        minesPlaced++;
        
        // Update numbers in adjacent cells
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const newX = x + dx;
            const newY = y + dy;
            if (isValidCell(newX, newY) && grid[newY][newX] !== -1) {
              grid[newY][newX]++;
            }
          }
        }
      }
    }
  }
  
  function isValidCell(x, y) {
    return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
  }
  
  function handleClick(x, y) {
    if (gameOver || gameWon || flagged[y][x]) return;
    
    if (firstClick) {
      firstClick = false;
      placeMines(x, y);
    }
    
    if (grid[y][x] === -1) {
      gameOver = true;
      revealAll();
      return;
    }
    
    revealCell(x, y);
    checkWin();
  }
  
  function handleRightClick(event, x, y) {
    event.preventDefault();
    if (gameOver || gameWon || revealed[y][x]) return;
    
    flagged[y][x] = !flagged[y][x];
    minesLeft += flagged[y][x] ? -1 : 1;
    flagged = [...flagged];
  }
  
  function revealCell(x, y) {
    if (!isValidCell(x, y) || revealed[y][x] || flagged[y][x]) return;
    
    revealed[y][x] = true;
    revealed = [...revealed];
    
    if (grid[y][x] === 0) {
      // Reveal adjacent cells for empty spaces
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          revealCell(x + dx, y + dy);
        }
      }
    }
  }
  
  function revealAll() {
    revealed = grid.map(row => row.map(() => true));
  }
  
  function checkWin() {
    const unrevealed = revealed.flat().filter(cell => !cell).length;
    if (unrevealed === MINES_COUNT) {
      gameWon = true;
      minesLeft = 0;
      flagged = grid.map(row => row.map(cell => cell === -1));
    }
  }
  
  function getCellContent(x, y) {
    if (!revealed[y][x]) {
      return flagged[y][x] ? '🚩' : '';
    }
    if (grid[y][x] === -1) {
      return '💣';
    }
    return grid[y][x] || '';
  }
  
  function getCellClass(x, y) {
    const classes = ['cell'];
    if (revealed[y][x]) {
      classes.push('revealed');
      if (grid[y][x] > 0) classes.push(`number-${grid[y][x]}`);
    }
    return classes.join(' ');
  }
  
  initializeGame();
</script>

<div class="game-container">
  <div class="status">
    {#if gameOver}
      Game Over!
    {:else if gameWon}
      You Win!
    {:else}
      Mines Left: {minesLeft}
    {/if}
  </div>
  
  <div class="grid">
    {#each grid as row, y}
      <div class="row">
        {#each row as _, x}
          <button
            class={getCellClass(x, y)}
            on:click={() => handleClick(x, y)}
            on:contextmenu={(e) => handleRightClick(e, x, y)}
            disabled={gameOver && !revealed[y][x]}
          >
            {getCellContent(x, y)}
          </button>
        {/each}
      </div>
    {/each}
  </div>
  
  <button class="reset-button" on:click={initializeGame}>
    New Game
  </button>
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
  
  .grid {
    background: black;
    padding: 4px;
  }
  
  .row {
    display: flex;
    gap: 4px;
  }
  
  .row:not(:last-child) {
    margin-bottom: 4px;
  }
  
  .cell {
    width: 40px;
    height: 40px;
    background: white;
    border: none;
    font-size: 1.25rem;
    font-weight: bold;
    font-family: monospace;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .cell:not(:disabled):hover {
    background: #f0f0f0;
  }
  
  .cell.revealed {
    background: #e0e0e0;
  }
  
  .cell:disabled {
    cursor: not-allowed;
  }
  
  .number-1 { color: blue; }
  .number-2 { color: green; }
  .number-3 { color: red; }
  .number-4 { color: darkblue; }
  .number-5 { color: darkred; }
  .number-6 { color: teal; }
  .number-7 { color: black; }
  .number-8 { color: gray; }
  
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