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
		if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
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
			valid = !snake.some(segment => segment.x === apple.x && segment.y === apple.y);
		}
	}

	// Draw the game state on the canvas.
	function draw() {
		if (!ctx) return;
		// Clear canvas.
		ctx.fillStyle = '#f3f4f6';
		ctx.fillRect(0, 0, width, height);
		// Draw apple.
		ctx.fillStyle = '#ef4444';
		ctx.fillRect(apple.x * cellSize, apple.y * cellSize, cellSize, cellSize);
		// Draw snake.
		ctx.fillStyle = '#10b981';
		snake.forEach(segment => {
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
		const resizeObserver = new ResizeObserver(entries => {
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
<div bind:this={container} class="h-full w-full relative">
	<canvas bind:this={canvas} class="h-full w-full"></canvas>
	{#if gameOver}
		<!-- Overlay for game over message -->
		<div class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
			<div class="text-3xl font-bold mb-4">Game Over!</div>
			<button on:click={initGame} class="px-4 py-2 bg-green-500 rounded">
				Restart
			</button>
		</div>
	{/if}
</div>
