<script>
	import { onMount, onDestroy } from 'svelte';
	let isRunning = false;
	let sessionType = 'Work'; // "Work" or "Break"
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
		if (sessionType === 'Work') {
			sessionType = 'Break';
			sessionDuration = 300; // 5 minutes break
		} else {
			sessionType = 'Work';
			sessionDuration = 1500; // 25 minutes work
		}
		remaining = sessionDuration;
	}

	function formatTime(seconds) {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	}

	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<div class="flex h-full w-full flex-col items-center justify-center space-y-4 p-2">
	<div class="flex h-[calc(100%-3rem)] w-full flex-col items-center justify-center">
		<div class="text-3xl font-bold">{sessionType} Session</div>
		<div class="font-mono text-6xl">{formatTime(remaining)}</div>
	</div>
	<div class="flex h-[3rem] w-full space-x-2">
		<button on:click={start} class="w-[33%] rounded bg-green-500 px-4 py-2 text-white">Start</button
		>
		<button on:click={stop} class="w-[33%] rounded bg-yellow-500 px-4 py-2 text-white">Stop</button>
		<button on:click={reset} class="w-[33%] rounded bg-red-500 px-4 py-2 text-white">Reset</button>
	</div>
</div>
