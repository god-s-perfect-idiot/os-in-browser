<script>
    import Icon from "@iconify/svelte";
    import { pm } from '$lib/pm';  // Adjust the import path as needed

    export let src;
    export let color;
    export let name;
    export let appId;

    function handleDoubleClick() {
        console.log('Double clicked icon:', name);
        // Create a new process with the icon's metadata
        const pid = pm.add(name, {
            icon: src,
            color: color,
            type: 'window',  // You can adjust this based on your needs
            appId,
            isMinimized: false,
            position: {
                x: 100,  // Default window position
                y: 100
            }
        });
    }
</script>

<div 
    class="flex flex-col items-center gap-2 text-center text-white cursor-pointer"
    on:dblclick={handleDoubleClick}
>
    <div class="icon rounded-md p-2" style="background-color: {color};">
        <Icon icon="{src}" font-size="2.5rem" />
    </div>
    <span class="icon-text">{name}</span>
</div>

<style>
    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    .icon-text {
        text-shadow: rgba(0, 0, 0, 0.5) 0px 0px 10px;
    }
</style>