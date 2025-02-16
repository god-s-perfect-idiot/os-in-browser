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

<div class="flex h-full w-full flex-col items-center justify-between p-2">
	<div class="mb-4 flex h-[calc(100%-3rem)] items-center justify-center font-mono text-5xl">
		{formatTime(elapsed)}
	</div>
	<div class="flex h-[3rem] w-full justify-center gap-2">
		<button on:click={start} class="w-[33%] rounded bg-green-500 px-4 py-2 text-white">Start</button
		>
		<button on:click={stop} class="w-[33%] rounded bg-yellow-500 px-4 py-2 text-white">Stop</button>
		<button on:click={reset} class="w-[33%] rounded bg-red-500 px-4 py-2 text-white">Reset</button>
	</div>
</div>
