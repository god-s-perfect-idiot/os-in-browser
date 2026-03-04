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

<div class="process-manager">
	<div class="header">
		<div class="col col-pid">PID</div>
		<div class="col col-name">Name</div>
		<div class="col col-uptime">Uptime</div>
		<div class="col col-action"></div>
	</div>
	{#each processes as process (process.pid)}
		<div class="row">
			<span class="col col-pid">{process.pid}</span>
			<span class="col col-name">{process.title}</span>
			<span class="col col-uptime">{now && getUptime(process.createdAt)}</span>
			<div class="col col-action">
				<button type="button" class="stop-btn" on:click={() => pm.remove(process.pid)}>
					Stop
				</button>
			</div>
		</div>
	{/each}
</div>

<style>
	.process-manager {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow-y: auto;
		padding: 8px;
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
	}

	.header {
		display: grid;
		grid-template-columns: 60px 1fr 100px 90px;
		gap: 8px;
		padding: 8px 10px;
		background: #000;
		color: #fff;
		border: 2px solid #000;
		margin-bottom: 2px;
		font-weight: bold;
	}

	.row {
		display: grid;
		grid-template-columns: 60px 1fr 100px 90px;
		gap: 8px;
		align-items: center;
		padding: 8px 10px;
		border-bottom: 2px solid #000;
		background: #fff;
	}

	.row:nth-child(even) {
		background-image:
			radial-gradient(circle, #e0e0e0 1px, transparent 1px),
			radial-gradient(circle, #e0e0e0 1px, transparent 1px);
		background-size: 4px 4px;
		background-position:
			0 0,
			2px 2px;
		background-color: #fff;
	}

	.col {
		min-width: 0;
	}

	.col-pid {
		font-variant-numeric: tabular-nums;
	}

	.col-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.col-action {
		display: flex;
		justify-content: flex-end;
	}

	.stop-btn {
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 13px;
		padding: 4px 12px;
		border: 2px solid #000;
		border-radius: 0;
		background-image:
			radial-gradient(circle, #808080 1px, transparent 1px),
			radial-gradient(circle, #808080 1px, transparent 1px);
		background-size: 3px 3px;
		background-position:
			0 0,
			1.5px 1.5px;
		background-color: #e8e8e8;
		color: #000;
		cursor: pointer;
		box-shadow: 2px 2px 0 #000;
	}

	.stop-btn:hover {
		background-color: #d0d0d0;
	}

	.stop-btn:active {
		box-shadow: none;
		transform: translate(1px, 1px);
	}
</style>
