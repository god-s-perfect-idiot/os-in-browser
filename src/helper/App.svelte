<script>
    import Icon from "@iconify/svelte";
    import { pm } from '$lib/pm';  // Adjust the import path as needed
	import { apps } from "$lib/applib";

    // export let src;
    // export let color;
    // export let iconColor;
    // export let name;
    export let appId;

    const app = apps[appId];
    console.log(app)

    function handleDoubleClick() {
        console.log('Double clicked icon:', name);
        // Create a new process with the icon's metadata
        const pid = pm.add(app.name, {
            icon: app.icon,
            color: app.color,
            type: 'window',  // You can adjust this based on your needs
            appId,
            isMinimized: false,
            position: {
                x: 100,  // Default window position
                y: 100
            },
            props: app.props,
            defaultWindowSize: app.defaultWindowSize
        });
    }
</script>

<div 
    class="flex flex-col items-center gap-2 text-center text-white cursor-pointer w-24 h-24"
    on:dblclick={handleDoubleClick}
>
    <div class="icon rounded-full p-2" style="background-color: {app.color};">
        <Icon icon="{app.icon}" font-size="2.2rem" style="color: {app.iconColor};"/>
    </div>
    <span class="icon-text">{app.name}</span>
</div>

<style>
    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.5);
    }
    .icon-text {
        /* text-shadow: rgba(0, 0, 0, 0.5) 0px 2px 5px; */
        color: black;
        font-weight:500;
    }
</style>