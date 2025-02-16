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
		appId: p.metadata.appId,
		defaultWindowSize: p.metadata.defaultWindowSize,
        props: p.metadata.props
	}));

	$: console.log("processes", $pm); // If you still want to log changes
</script>

{#each runningApps as app}
	<Window
		x={app.x}
		y={app.y}
		title={app.title}
		pid={app.pid}
		defaultWindowSize={app.defaultWindowSize}
	>   
		<svelte:component this={apps[app.appId].component} {...app.props}/>
	</Window>
{/each}
