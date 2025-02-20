<script>
	import Icon from '@iconify/svelte';
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
	function getTime(ms) {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		const hundredths = Math.floor((ms % 1000) / 10);
		return `${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	}

	function getMS(ms) {
		const hundredths = Math.floor((ms % 1000) / 10);
		return `${hundredths.toString().padStart(2, '0')}`;
	}
</script>

<div class="flex h-full w-full flex-col items-center justify-between p-2 gap-4">
	<div class="mb-4 flex h-[calc(100%-4rem)] items-center justify-center gap-1 rounded-full border-2 border-gray-600 w-full m-6">
		<span class="text-5xl">{getTime(elapsed)}</span>
		<span class="text-4xl">{getMS(elapsed)}</span>
	</div>
	<div class="flex h-[4rem] w-full justify-center gap-2">
		<button
			on:click={stop}
			class="flex w-[20%] h-full items-center justify-center rounded bg-secondary px-4 py-2 text-black"
		>
			<Icon icon="mdi:stop" font-size="1.5rem" />
		</button>
		<button
			on:click={start}
			class="bg-accent flex h-full w-[60%] items-center justify-center rounded px-4 py-2 text-white"
		>
			<Icon icon="mdi:play" font-size="1.5rem" />
		</button>
		<button
			on:click={reset}
			class="flex w-[20%] h-full items-center justify-center rounded-full bg-source px-4 py-2 text-black"
		>
			<Icon icon="mdi:restart" font-size="1.5rem" />
		</button>
	</div>
</div>
