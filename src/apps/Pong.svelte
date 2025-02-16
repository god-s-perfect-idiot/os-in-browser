<script>
    import { onMount, onDestroy } from 'svelte';
    
    const PADDLE_HEIGHT = 80;
    const PADDLE_WIDTH = 20;
    const BALL_SIZE = 15;
    const GAME_HEIGHT = 400;
    const GAME_WIDTH = 600;
    const PADDLE_SPEED = 8;
    const BALL_SPEED = 7;
    const AI_REACTION_SPEED = 0.8;
    
    let playerScore = 0;
    let aiScore = 0;
    let playerPaddle = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    let aiPaddle = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    let ball = {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      dx: BALL_SPEED,
      dy: BALL_SPEED
    };
    
    let keys = {
      ArrowUp: false,
      ArrowDown: false
    };
    
    function handleKeyDown(e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        keys[e.key] = true;
      }
    }
    
    function handleKeyUp(e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        keys[e.key] = false;
      }
    }
    
    function updateGame() {
      // Update player paddle
      if (keys.ArrowUp && playerPaddle > 0) {
        playerPaddle -= PADDLE_SPEED;
      }
      if (keys.ArrowDown && playerPaddle < GAME_HEIGHT - PADDLE_HEIGHT) {
        playerPaddle += PADDLE_SPEED;
      }
      
      // Update AI paddle
      const targetY = ball.y - PADDLE_HEIGHT / 2;
      const diff = targetY - aiPaddle;
      aiPaddle += diff * AI_REACTION_SPEED;
      
      // Update ball position
      ball.x += ball.dx;
      ball.y += ball.dy;
      
      // Ball collision with top and bottom
      if (ball.y <= 0 || ball.y + BALL_SIZE >= GAME_HEIGHT) {
        ball.dy *= -1;
      }
      
      // Ball collision with paddles
      if (
        (ball.x <= PADDLE_WIDTH && 
         ball.y + BALL_SIZE >= playerPaddle && 
         ball.y <= playerPaddle + PADDLE_HEIGHT) ||
        (ball.x + BALL_SIZE >= GAME_WIDTH - PADDLE_WIDTH && 
         ball.y + BALL_SIZE >= aiPaddle && 
         ball.y <= aiPaddle + PADDLE_HEIGHT)
      ) {
        ball.dx *= -1;
      }
      
      // Score points
      if (ball.x <= 0) {
        aiScore += 1;
        ball = {
          x: GAME_WIDTH / 2,
          y: GAME_HEIGHT / 2,
          dx: BALL_SPEED,
          dy: BALL_SPEED
        };
      } else if (ball.x >= GAME_WIDTH) {
        playerScore += 1;
        ball = {
          x: GAME_WIDTH / 2,
          y: GAME_HEIGHT / 2,
          dx: -BALL_SPEED,
          dy: BALL_SPEED
        };
      }
    }
    
    let gameLoop;
    
    onMount(() => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      gameLoop = setInterval(updateGame, 16);
    });
    
    onDestroy(() => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(gameLoop);
    });
  </script>
  
  <div class="game-container">
    <div class="scoreboard">
      {playerScore} - {aiScore}
    </div>
    
    <div class="game-board" style="width: {GAME_WIDTH}px; height: {GAME_HEIGHT}px;">
      <!-- Player paddle -->
      <div
        class="paddle player-paddle"
        style="top: {playerPaddle}px; width: {PADDLE_WIDTH}px; height: {PADDLE_HEIGHT}px;"
      ></div>
      
      <!-- AI paddle -->
      <div
        class="paddle ai-paddle"
        style="top: {aiPaddle}px; width: {PADDLE_WIDTH}px; height: {PADDLE_HEIGHT}px;"
      ></div>
      
      <!-- Ball -->
      <div
        class="ball"
        style="left: {ball.x}px; top: {ball.y}px; width: {BALL_SIZE}px; height: {BALL_SIZE}px;"
      ></div>
    </div>
  </div>
  
  <style>
    .game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .scoreboard {
      background-color: black;
      color: white;
      padding: 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      font-family: monospace;
    }
    
    .game-board {
      position: relative;
      /* width: {GAME_WIDTH}px;
      height: {GAME_HEIGHT}px; */
      background-color: white;
      border: 2px solid black;
    }
    
    .paddle {
      position: absolute;
      /* width: {PADDLE_WIDTH}px;
      height: {PADDLE_HEIGHT}px; */
      background-color: black;
    }
    
    .player-paddle {
      left: 0;
    }
    
    .ai-paddle {
      right: 0;
    }
    
    .ball {
      position: absolute;
      /* width: {BALL_SIZE}px;
      height: {BALL_SIZE}px; */
      background-color: black;
    }
    
    .controls {
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
  </style>