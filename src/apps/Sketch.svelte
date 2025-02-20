<script>
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	let canvas;
	let container;
	let ctx;
	let drawing = false;
	let lastX = 0;
	let lastY = 0;
	let color = '#000000';

	// Predefined palette colors
	const palette = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'];

	// Resize the canvas to always match the container's dimensions
	function resizeCanvas() {
		if (canvas && container) {
			canvas.width = container.clientWidth;
			canvas.height = container.clientHeight - paletteBarHeight();
			// Reinitialize drawing context properties (if needed)
			if (ctx) {
				ctx.lineJoin = 'round';
				ctx.lineCap = 'round';
				ctx.lineWidth = 4;
				ctx.strokeStyle = color;
			}
		}
	}

	// Estimate the height used by the color palette bar (could be hardcoded to match our design)
	function paletteBarHeight() {
		// For example, the palette bar is 2rem tall (32px)
		return 32;
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.lineWidth = 4;
		ctx.strokeStyle = color;
		resizeCanvas();

		const ro = new ResizeObserver(() => {
			resizeCanvas();
		});
		ro.observe(container);
		return () => ro.disconnect();
	});

	function handleMouseDown(event) {
		drawing = true;
		[lastX, lastY] = [event.offsetX, event.offsetY];
	}

	function handleMouseMove(event) {
		if (!drawing) return;
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(event.offsetX, event.offsetY);
		ctx.stroke();
		[lastX, lastY] = [event.offsetX, event.offsetY];
	}

	function handleMouseUp() {
		drawing = false;
	}

	function handleMouseLeave() {
		drawing = false;
	}
</script>

<!-- The outer container fills its parent -->
<div bind:this={container} class="main flex h-full w-full flex-col p-2 gap-1">
	<!-- Palette Bar -->
	<div class="flex h-fit w-full items-center justify-between py-2">
    <div class="flex gap-1">
      {#each palette as pal}
			<button class="flex h-10 w-10 rounded-md bg-white justify-center items-center" on:click={() => (color = pal)}>
				<span
        class="h-6 w-6 rounded-full p-1 flex justify-center items-center"
					style="background-color: {pal}; }"
				>
          {#if pal === color}
            <span class="h-4 w-4 rounded-full flex justify-center items-center" style="background-color: #b1b1b192;">
              <Icon icon="material-symbols:check" class="text-white" font-size="0.7rem" /> 
            </span>
          {/if}
      </span>
			</button>
		{/each}
    </div>
    <div class="flex h-10 w-fit justify-center items-center gap-2">
      <div class="flex flex-col">
        <span class="text-sm font-[500]">Current Color</span>
        <span class="text-xs">{color}</span>
      </div>
      <input type="color" bind:value={color} class="h-10 w-10 rounded-[1rem] border-none p-0" />
    </div>
	</div>
	<!-- Canvas fills the remaining space -->
	<canvas
		bind:this={canvas}
		class="h-[calc(100%-3.5rem)] w-full flex-1 rounded-xl"
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
		on:mouseleave={handleMouseLeave}
	></canvas>
</div>

<style>
	.main {
		background-color: var(--surface-color);
	}
	canvas {
		background-color: var(--surface-high-color);
	}
</style>
