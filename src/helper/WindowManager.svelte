<script>
	import Window from './Window.svelte';
	import { pm } from '$lib/pm';
	import Help from '../apps/Help.svelte';
	import { apps } from '$lib/applib';

	// Subscribe to the store using reactive $-prefix
	$: runningApps = $pm.map((p) => ({
		pid: p.pid,
		x: p.metadata.position.x,
		y: p.metadata.position.y,
		title: p.title,
		...p.metadata
	}));
	
	// Subscribe to activePid store reactively
	let activePidStoreValue = pm.getActive();
	pm.activePidStore.subscribe(v => activePidStoreValue = v);
	$: activePid = activePidStoreValue;
</script>

<div class="window-manager">
	{#each runningApps as app}
		<Window
			x={app.x}
			y={app.y}
			title={app.title}
			pid={app.pid}
			defaultWindowSize={app.defaultWindowSize}
			windowClassOverrides={app.windowClassOverrides}
			isMinimized={app.isMinimized}
			isActive={activePid === app.pid}
		>   
			<svelte:component this={apps[app.appId].component} {...app.props}/>
		</Window>
	{/each}
</div>

<style>
	.window-manager {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 50;
	}
	.window-manager :global(.window) {
		pointer-events: all;
	}
</style>
