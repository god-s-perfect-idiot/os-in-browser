<script>
    import { onDestroy } from 'svelte';
    let elapsed = 0;
    let timer = null;
  
    function start() {
      if (timer) return;
      const startTime = Date.now() - elapsed;
      timer = setInterval(() => {
        elapsed = Date.now() - startTime;
      }, 10);
    }
  
    function stop() {
      clearInterval(timer);
      timer = null;
    }
  
    function reset() {
      stop();
      elapsed = 0;
    }
  
    onDestroy(() => {
      clearInterval(timer);
    });
  
    // Format elapsed time as mm:ss:ms
    function formatTime(ms) {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const hundredths = Math.floor((ms % 1000) / 10);
      return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}:${hundredths.toString().padStart(2, '0')}`;
    }
  </script>
  
  <div class="h-full w-full flex flex-col items-center justify-between">
    <div class="text-5xl font-mono mb-4 h-[calc(100%-3rem)] flex justify-center items-center">{formatTime(elapsed)}</div>
    <div class="h-[3rem] flex justify-center w-full gap-2">
      <button on:click={start} class="px-4 py-2 bg-green-500 text-white rounded w-[33%]">Start</button>
      <button on:click={stop} class="px-4 py-2 bg-yellow-500 text-white rounded w-[33%]">Stop</button>
      <button on:click={reset} class="px-4 py-2 bg-red-500 text-white rounded w-[33%]">Reset</button>
    </div>
  </div>
  