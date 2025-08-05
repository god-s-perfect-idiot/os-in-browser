<script>
	import Window from './Window.svelte';
	import { pm } from '$lib/pm';
	import Help from '../apps/Help.svelte';
	import { apps } from '$lib/applib';
	import { onMount } from 'svelte';

	// Track newly created windows
	let newlyCreatedPids = new Set();
	let previousProcesses = new Map();

	// Subscribe to the store using reactive $-prefix
	$: runningApps = $pm.map((p) => ({
		pid: p.pid,
		x: p.metadata.position.x,
		y: p.metadata.position.y,
		title: p.title,
		...p.metadata
	}));

	// Track newly created windows
	$: {
		const currentProcesses = new Map($pm.map(p => [p.pid, p]));
		
		// Check for new processes
		currentProcesses.forEach((process, pid) => {
			if (!previousProcesses.has(pid)) {
				// This is a new process
				newlyCreatedPids.add(pid);
				// Remove from newly created after animation
				setTimeout(() => {
					newlyCreatedPids.delete(pid);
				}, 300);
			}
		});
		
		previousProcesses = currentProcesses;
	}

	$: console.log("processes", $pm, pm.getActive()); // If you still want to log changes
</script>

{#each runningApps as app}
	<Window
		x={app.x}
		y={app.y}
		title={app.title}
		pid={app.pid}
		defaultWindowSize={app.defaultWindowSize}
		windowClassOverrides={app.windowClassOverrides}
		isMinimized={app.isMinimized}
		isFullscreen={app.isFullscreen}
		isNewlyCreated={newlyCreatedPids.has(app.pid)}
	>   
		<svelte:component this={apps[app.appId].component} {...app.props}/>
	</Window>
{/each}
