<script>
    import Window from "./Window.svelte";
    import { pm } from "$lib/pm";

    // Subscribe to the store using reactive $-prefix
    $: runningApps = $pm.map(p => ({
        pid: p.pid,
        x: p.metadata.position.x,
        y: p.metadata.position.y,
        title: p.title,
    }));

    $: console.log($pm); // If you still want to log changes
</script>

{#each runningApps as app}
    <Window x={app.x} y={app.y} title={app.title} pid={app.pid}/>
{/each}