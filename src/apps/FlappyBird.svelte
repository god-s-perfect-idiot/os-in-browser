<script>
  import { onMount, onDestroy } from 'svelte';

  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 500;
  const BIRD_SIZE = 30;
  const BIRD_X = 50;  // Fixed bird x position
  const PIPE_WIDTH = 50;
  const PIPE_GAP = 150;
  const GRAVITY = 0.6;
  const JUMP_FORCE = -10;
  const PIPE_SPEED = 3;

  let bird = {
    x: BIRD_X,  // Added x position
    y: GAME_HEIGHT / 2,
    velocity: 0
  };

  let pipes = [];
  let score = 0;
  let highScore = 0;
  let gameLoop;
  let gameStarted = false;
  let gameOver = false;

  function createPipe() {
    const gapStart = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
    return {
      x: GAME_WIDTH,
      topHeight: gapStart,
      bottomY: gapStart + PIPE_GAP,
      passed: false
    };
  }

  function checkCollision(pipe) {
    // Bird coordinates
    const birdRight = BIRD_X + BIRD_SIZE;
    const birdLeft = BIRD_X;
    const birdTop = bird.y;
    const birdBottom = bird.y + BIRD_SIZE;

    // Pipe coordinates
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + PIPE_WIDTH;

    // Check if bird is within pipe's x-range
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      // Check if bird hits top or bottom pipe
      if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
        return true;
      }
    }
    return false;
  }

  function updateGame() {
    if (!gameStarted || gameOver) return;

    // Update bird
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;

    // Check collisions with ground and ceiling
    if (bird.y + BIRD_SIZE > GAME_HEIGHT) {
      bird.y = GAME_HEIGHT - BIRD_SIZE;
      endGame();
    }
    if (bird.y < 0) {
      bird.y = 0;
      bird.velocity = 0;
    }

    // Update pipes
    pipes = pipes.map(pipe => ({
      ...pipe,
      x: pipe.x - PIPE_SPEED
    })).filter(pipe => pipe.x + PIPE_WIDTH > 0);

    // Generate new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < GAME_WIDTH - 300) {
      pipes = [...pipes, createPipe()];
    }

    // Check pipe collisions and update score
    for (let pipe of pipes) {
      // Collision detection
      if (checkCollision(pipe)) {
        endGame();
        return;
      }

      // Score update
      if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X) {
        pipe.passed = true;
        score++;
        highScore = Math.max(score, highScore);
      }
    }

    // Force update for reactivity
    bird = { ...bird };
    pipes = [...pipes];
  }

  function jump() {
    if (gameOver) {
      resetGame();
      return;
    }

    if (!gameStarted) {
      gameStarted = true;
    }

    bird.velocity = JUMP_FORCE;
  }

  function endGame() {
    gameOver = true;
    clearInterval(gameLoop);
  }

  function resetGame() {
    bird = {
      x: BIRD_X,
      y: GAME_HEIGHT / 2,
      velocity: 0
    };
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = false;
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, 16);
  }

  function handleKeypress(event) {
    if (event.code === 'Space') {
      event.preventDefault();
      jump();
    }
  }

  onMount(() => {
    gameLoop = setInterval(updateGame, 16);
    window.addEventListener('keydown', handleKeypress);
  });

  onDestroy(() => {
    if (gameLoop) clearInterval(gameLoop);
    window.removeEventListener('keydown', handleKeypress);
  });
</script>

<div class="game-container">
  <div class="status">
    Score: {score} | Best: {highScore}
  </div>

  <div 
    class="game-area"
    on:click={jump}
    style="width: {GAME_WIDTH}px; height: {GAME_HEIGHT}px;"
  >
    {#if !gameStarted && !gameOver}
      <div class="start-message">
        Click or Press Space to Start
      </div>
    {/if}
    
    {#if gameOver}
      <div class="game-over">
        Game Over!<br>
        Click or Press Space to Restart
      </div>
    {/if}

    <!-- Bird -->
    <div
      class="bird"
      style="
        top: {bird.y}px;
        transform: rotate({bird.velocity * 3}deg);
      "
    />

    <!-- Pipes -->
    {#each pipes as pipe}
      <div
        class="pipe top"
        style="
          left: {pipe.x}px;
          height: {pipe.topHeight}px;
        "
      />
      <div
        class="pipe bottom"
        style="
          left: {pipe.x}px;
          top: {pipe.bottomY}px;
          height: {GAME_HEIGHT - pipe.bottomY}px;
        "
      />
    {/each}
  </div>
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

  .game-area {
    position: relative;
    background: white;
    border: 4px solid black;
    overflow: hidden;
    cursor: pointer;
  }

  .bird {
    position: absolute;
    left: 50px;
    width: 30px;
    height: 30px;
    background: black;
    transition: transform 0.1s;
  }

  .pipe {
    position: absolute;
    width: 50px;
    background: black;
  }

  .start-message,
  .game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-family: monospace;
    font-weight: bold;
    font-size: 1.25rem;
    background: black;
    color: white;
    padding: 1rem;
    white-space: nowrap;
  }
</style>