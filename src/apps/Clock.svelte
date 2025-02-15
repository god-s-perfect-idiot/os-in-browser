<script>
    import { onMount, onDestroy } from 'svelte';
    let time = new Date();
    let timer;
    let container;
    let fontSize = 20; // default value
  
    onMount(() => {
      timer = setInterval(() => {
        time = new Date();
      }, 1000);
  
      const ro = new ResizeObserver(entries => {
        for (let entry of entries) {
          // Adjust font size to, say, 50% of the container's height
          fontSize = entry.contentRect.height * 0.5;
        }
      });
      ro.observe(container);
      return () => {
        clearInterval(timer);
        ro.disconnect();
      };
    });
  
    onDestroy(() => {
      clearInterval(timer);
    });
  </script>
  
  <!-- Container fills its parent; no bg color so that parent's background shows -->
  <div bind:this={container} class="h-full w-full flex items-center justify-center">
    <!-- Clock text: font size is dynamically set; text color uses #222 (formerly the bg color) -->
    <div style="font-size: {fontSize}px; color: #222; font-weight: bold; font-family: monospace">
      {time.toLocaleTimeString()}
    </div>
  </div>
  