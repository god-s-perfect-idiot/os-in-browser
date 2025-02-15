<script>
    import { onMount, onDestroy } from 'svelte';
    let isRunning = false;
    let sessionType = "Work"; // "Work" or "Break"
    let sessionDuration = 1500; // 25 minutes default work session
    let remaining = sessionDuration;
    let timer;
  
    function start() {
      if (isRunning) return;
      isRunning = true;
      timer = setInterval(() => {
        if (remaining > 0) {
          remaining--;
        } else {
          switchSession();
        }
      }, 1000);
    }
  
    function stop() {
      isRunning = false;
      clearInterval(timer);
    }
  
    function reset() {
      stop();
      remaining = sessionDuration;
    }
  
    function switchSession() {
      // Switch between work (25 min) and break (5 min) sessions.
      if (sessionType === "Work") {
        sessionType = "Break";
        sessionDuration = 300; // 5 minutes break
      } else {
        sessionType = "Work";
        sessionDuration = 1500; // 25 minutes work
      }
      remaining = sessionDuration;
    }
  
    function formatTime(seconds) {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }
  
    onDestroy(() => {
      clearInterval(timer);
    });
  </script>
  
  <div class="h-full w-full flex flex-col items-center justify-center space-y-4">
    <div class="flex w-full h-[calc(100%-3rem)] flex-col items-center justify-center">
        <div class="text-3xl font-bold">{sessionType} Session</div>
        <div class="text-6xl font-mono">{formatTime(remaining)}</div>
    </div>
    <div class="space-x-2 flex h-[3rem] w-full">
      <button on:click={start} class="px-4 w-[33%] py-2 bg-green-500 text-white rounded">Start</button>
      <button on:click={stop} class="px-4 w-[33%] py-2 bg-yellow-500 text-white rounded">Stop</button>
      <button on:click={reset} class="px-4 w-[33%] py-2 bg-red-500 text-white rounded">Reset</button>
    </div>
  </div>
  