<script>
	import { onMount } from 'svelte';
	import CustomSelect from '../ui-library/CustomSelect.svelte';

	let canvas;
	let canvasWrap;
	let ctx;
	let drawing = false;
	let lastX = 0;
	let lastY = 0;
	let color = '#000000';
	let brushSize = 4;

	const palette = [
		'#000000',
		'#ffffff',
		'#808080',
		'#ff0000',
		'#00ff00',
		'#0000ff',
		'#ffff00',
		'#ff00ff',
		'#00ffff'
	];

	const brushSizeOptions = [
		{ value: '2', label: '2' },
		{ value: '4', label: '4' },
		{ value: '8', label: '8' },
		{ value: '12', label: '12' }
	];

	function resizeCanvas() {
		if (canvas && canvasWrap) {
			const w = canvasWrap.clientWidth;
			const h = canvasWrap.clientHeight;
			canvas.width = w;
			canvas.height = Math.max(0, h);
			if (ctx) {
				ctx.lineJoin = 'round';
				ctx.lineCap = 'round';
				ctx.lineWidth = brushSize;
				ctx.strokeStyle = color;
			}
		}
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.lineWidth = brushSize;
		ctx.strokeStyle = color;
		resizeCanvas();

		const ro = new ResizeObserver(() => resizeCanvas());
		ro.observe(canvasWrap);
		return () => ro.disconnect();
	});

	function handleMouseDown(event) {
		drawing = true;
		const rect = canvas.getBoundingClientRect();
		lastX = event.clientX - rect.left;
		lastY = event.clientY - rect.top;
	}

	function handleMouseMove(event) {
		if (!drawing || !ctx) return;
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		ctx.strokeStyle = color;
		ctx.lineWidth = brushSize;
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.stroke();
		lastX = x;
		lastY = y;
	}

	function handleMouseUp() {
		drawing = false;
	}

	function handleMouseLeave() {
		drawing = false;
	}

	function clearCanvas() {
		if (!ctx || !canvas) return;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	function selectColor(c) {
		color = c;
	}
</script>

<div class="sketch-app">
	<header class="sketch-header">
		<span class="sketch-title">SKETCH</span>
	</header>

	<div class="sketch-toolbar">
		<div class="sketch-palette">
			{#each palette as c}
				<button
					type="button"
					class="palette-swatch"
					class:active={color === c}
					style="background-color: {c};"
					on:click={() => selectColor(c)}
					title={c}
				>
					{#if color === c}[X]{/if}
				</button>
			{/each}
		</div>
		<div class="sketch-toolbar-right">
			<span class="sketch-label">Color</span>
			<input type="color" bind:value={color} class="sketch-color-input" title="Pick color" />
			<span class="sketch-hex">{color}</span>
			<span class="sketch-label">Size</span>
			<CustomSelect
				options={brushSizeOptions}
				value={String(brushSize)}
				onchange={(v) => (brushSize = parseInt(v, 10))}
			/>
			<button type="button" class="sketch-btn" on:click={clearCanvas}>CLEAR</button>
		</div>
	</div>

	<div bind:this={canvasWrap} class="sketch-canvas-wrap">
		<canvas
			bind:this={canvas}
			class="sketch-canvas"
			on:mousedown={handleMouseDown}
			on:mousemove={handleMouseMove}
			on:mouseup={handleMouseUp}
			on:mouseleave={handleMouseLeave}
		></canvas>
	</div>
</div>

<style>
	.sketch-app {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 14px;
		background-image:
			radial-gradient(circle, #000 1px, transparent 1px),
			radial-gradient(circle, #000 1px, transparent 1px);
		background-size: 4px 4px;
		background-position:
			0 0,
			2px 2px;
		background-color: #fff;
		border: 2px solid #000;
		box-sizing: border-box;
		overflow: hidden;
	}

	.sketch-header {
		padding: 8px 12px;
		background: #000;
		color: #fff;
		border-bottom: 2px solid #000;
		flex-shrink: 0;
	}

	.sketch-title {
		font-size: 14px;
		letter-spacing: 0.02em;
	}

	.sketch-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 8px;
		padding: 6px 12px;
		background: #fff;
		border-bottom: 2px solid #000;
		flex-shrink: 0;
		min-height: 36px;
	}

	.sketch-palette {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
	}

	.palette-swatch {
		width: 28px;
		height: 28px;
		padding: 0;
		border: 2px solid #000;
		cursor: pointer;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 10px;
		color: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.palette-swatch:hover {
		outline: 2px solid #000;
		outline-offset: 1px;
	}

	.palette-swatch.active {
		box-shadow: inset 0 0 0 2px #fff;
		outline: 2px solid #000;
		outline-offset: 0;
	}

	.sketch-toolbar-right {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.sketch-label {
		font-size: 12px;
	}

	.sketch-color-input {
		width: 28px;
		height: 28px;
		padding: 0;
		border: 2px solid #000;
		background: #fff;
		cursor: pointer;
		box-sizing: border-box;
	}

	.sketch-hex {
		font-size: 11px;
		min-width: 4.5rem;
	}

	.sketch-btn {
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 13px;
		padding: 6px 12px;
		border: 2px solid #000;
		background: #fff;
		cursor: pointer;
	}

	.sketch-btn:hover {
		background: #e0e0e0;
	}

	.sketch-canvas-wrap {
		flex: 1;
		min-height: 0;
		padding: 8px;
		background: #fff;
	}

	.sketch-canvas {
		display: block;
		width: 100%;
		height: 100%;
		background: #fff;
		border: 2px solid #000;
		box-sizing: border-box;
		cursor: crosshair;
	}
</style>
