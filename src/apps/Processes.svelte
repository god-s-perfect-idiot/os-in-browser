<script>
	import { onMount, onDestroy } from 'svelte';
	import { pm } from '$lib/pm';

	// Reactive store for processes
	$: processes = $pm;

	// Reactive variable that updates every second
	let now = new Date();
	let interval;

	onMount(() => {
		// Update now every second
		interval = setInterval(() => {
			now = new Date();
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	// get how many minutes and seconds have passed since createdAt
	const getUptime = (createdAt) => {
		// Ensure createdAt is a Date instance
		const created = createdAt instanceof Date ? createdAt : new Date(createdAt);
		const diff = now - created;
		const minutes = Math.floor(diff / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);
		return `${minutes}m ${seconds}s`;
	};
</script>

<div class="flex h-full w-full flex-col gap-2 overflow-y-auto">
	<div class="grid grid-cols-4 gap-1 text-sm font-semibold mb-2">
		<div>PID</div>
		<div>Name</div>
		<div>Uptime</div>
		<div></div>
	</div>
	{#each processes as process (process.pid)}
		<div class="grid grid-cols-4 gap-1 text-sm items-center">
			<span>{process.pid}</span>
			<span>{process.title}</span>
			<!-- Using now in the template makes it reactive to now changes -->
			<span>{now && getUptime(process.createdAt)}</span>
			<div class="w-full flex justify-end">
				<button 
					on:click={() => pm.remove(process.pid)} 
					class="cursor-pointer w-24 bg-red-500 text-white rounded-sm h-8"
				>
					Kill
				</button>
			</div>
		</div>
	{/each}
</div>