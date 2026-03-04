<script>
	import { onMount, onDestroy } from 'svelte';

	let canvas;
	let ctx;
	let container;
	let width = 400;
	let height = 400;

	// Define grid cell size.
	const cellSize = 20;
	let cols = Math.floor(width / cellSize);
	let rows = Math.floor(height / cellSize);

	let snake = [];
	let direction = { x: 1, y: 0 };
	let nextDirection = { x: 1, y: 0 };
	let apple = { x: 0, y: 0 };
	let gameInterval;
	const gameSpeed = 150; // milliseconds per move

	let gameOver = false;

	// Initialize the game state.
	function initGame() {
		snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
		direction = { x: 1, y: 0 };
		nextDirection = { x: 1, y: 0 };
		gameOver = false;
		placeApple();
		if (gameInterval) clearInterval(gameInterval);
		gameInterval = setInterval(gameLoop, gameSpeed);
		draw();
	}

	// Main game loop.
	function gameLoop() {
		direction = nextDirection;
		const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

		// Wrap around edges.
		head.x = (head.x + cols) % cols;
		head.y = (head.y + rows) % rows;

		// Check for collision with self.
		if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
			gameOver = true;
			clearInterval(gameInterval);
			return;
		}

		snake.unshift(head);
		// Check if apple was eaten.
		if (head.x === apple.x && head.y === apple.y) {
			placeApple();
		} else {
			snake.pop();
		}
		draw();
	}

	// Place the apple in a random cell not occupied by the snake.
	function placeApple() {
		let valid = false;
		while (!valid) {
			apple.x = Math.floor(Math.random() * cols);
			apple.y = Math.floor(Math.random() * rows);
			valid = !snake.some((segment) => segment.x === apple.x && segment.y === apple.y);
		}
	}

	// Create dot matrix pattern for canvas
	function createDotMatrixPattern() {
		const patternCanvas = document.createElement('canvas');
		patternCanvas.width = 4;
		patternCanvas.height = 4;
		const patternCtx = patternCanvas.getContext('2d');
		// Draw black dots
		patternCtx.fillStyle = '#000';
		patternCtx.fillRect(0, 0, 1, 1);
		patternCtx.fillRect(2, 2, 1, 1);
		return ctx.createPattern(patternCanvas, 'repeat');
	}

	function draw() {
		if (!ctx) return;

		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, width, height);

		const pattern = createDotMatrixPattern();
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, width, height);

		// Draw apple
		ctx.fillStyle = '#e53e3e';
		ctx.fillRect(apple.x * cellSize, apple.y * cellSize, cellSize, cellSize);

		// Draw snake
		snake.forEach((segment, i) => {
			ctx.fillStyle = i === 0 ? '#1a1a1a' : '#333';
			ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
		});
	}

	// Handle keyboard input for snake direction.
	function handleKeydown(e) {
		if (e.key === 'ArrowUp' && direction.y !== 1) {
			nextDirection = { x: 0, y: -1 };
		} else if (e.key === 'ArrowDown' && direction.y !== -1) {
			nextDirection = { x: 0, y: 1 };
		} else if (e.key === 'ArrowLeft' && direction.x !== 1) {
			nextDirection = { x: -1, y: 0 };
		} else if (e.key === 'ArrowRight' && direction.x !== -1) {
			nextDirection = { x: 1, y: 0 };
		}
	}

	// Resize the canvas to fill its container.
	function resizeCanvas() {
		if (container) {
			width = container.clientWidth;
			height = container.clientHeight;
			cols = Math.floor(width / cellSize);
			rows = Math.floor(height / cellSize);
			canvas.width = width;
			canvas.height = height;
			draw();
		}
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		initGame();
		window.addEventListener('keydown', handleKeydown);
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				resizeCanvas();
			}
		});
		resizeObserver.observe(container);
		return () => {
			clearInterval(gameInterval);
			window.removeEventListener('keydown', handleKeydown);
			resizeObserver.disconnect();
		};
	});
</script>

<!-- Container and canvas fill their parent using Tailwind's h-full w-full classes -->
<div bind:this={container} class="relative h-full w-full">
	<canvas bind:this={canvas} class="h-full w-full"></canvas>
	{#if gameOver}
		<!-- Overlay for game over message -->
		<div class="absolute inset-0 flex flex-col items-center justify-center bg-black text-white">
			<div class="mb-4 text-3xl font-bold">Game Over!</div>
			<button on:click={initGame} class="dot-matrix rounded px-4 py-2"> Restart </button>
		</div>
	{/if}
</div>
