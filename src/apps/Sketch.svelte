<script>
  import { onMount } from 'svelte';
  let canvas;
  let container;
  let ctx;
  let drawing = false;
  let lastX = 0;
  let lastY = 0;
  let color = "#000000";

  // Predefined palette colors
  const palette = ["#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00"];

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
<div bind:this={container} class="h-full w-full flex flex-col p-2 main">
  <!-- Palette Bar -->
  <div class="flex items-center space-x-2 p-2 w-full justify-center h-[10%]">
    {#each palette as pal}
      <button
        class="h-full w-8 rounded-full border-2"
        style="background-color: {pal}; border-color: {pal === color ? '#000' : 'transparent'}"
        on:click={() => color = pal}
      ></button>
    {/each}
    <input type="color" bind:value={color} class="h-full w-8 p-0 border-none rounded-full" />
  </div>
  <!-- Canvas fills the remaining space -->
  <canvas
    bind:this={canvas}
    class="flex-1 h-[90%] w-full rounded-xl"
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