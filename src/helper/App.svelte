<script>
    import Icon from "@iconify/svelte";
    import { pm } from '$lib/pm';  // Adjust the import path as needed
	import { apps } from "$lib/applib";
    import { onMount } from 'svelte';

    export let appId;

    const app = apps[appId];
    let isSelected = false;

    function handleClick(event) {
        event.stopPropagation();
        // Dispatch event to select this app and deselect others
        document.dispatchEvent(new CustomEvent('select-app', { detail: { appId } }));
        isSelected = true;
    }

    function handleDoubleClick() {
        // Create a new process with the icon's metadata
        const pid = pm.add(app.name, {
            type: 'window',
            appId,
            isMinimized: false,
            position: {
                x: 100,
                y: 150
            },
            ...app
        });
        // Remove selection when launching
        isSelected = false;
    }

    // Listen for select/deselect events
    onMount(() => {
        function handleSelect(event) {
            // If another app is selected, deselect this one
            if (event.detail.appId !== appId) {
                isSelected = false;
            }
        }
        function handleDeselect() {
            isSelected = false;
        }
        document.addEventListener('select-app', handleSelect);
        document.addEventListener('deselect-apps', handleDeselect);
        return () => {
            document.removeEventListener('select-app', handleSelect);
            document.removeEventListener('deselect-apps', handleDeselect);
        };
    });
</script>

<div 
    class="app-item flex flex-col items-center gap-2 text-center text-white cursor-pointer w-20 h-24 {isSelected ? 'selected' : ''}"
    on:click={handleClick}
    on:dblclick={handleDoubleClick}
>
    <div class="icon p-2" style="width: 60px; height: 40px; aspect-ratio: 1.5/1;">
        {#if app.icon?.startsWith('/')}
            <img src={app.icon} alt={app.name} class="icon-image" />
        {:else}
            <Icon icon="{app.icon}" font-size="2.2rem" class="icon-iconify" style="color: {isSelected ? '#fff' : '#000'};"/>
        {/if}
    </div>
    <span class="icon-text text-base">{app.name}</span>
</div>

<style>
    .app-item {
        position: relative;
        z-index: 0;
    }
    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.5);
    }
    .icon-text {
        color: #000;
        font-weight: bold;
        font-size: 13px;
        background: #fff;
        padding: 2px 4px;
    }
    .app-item.selected .icon {
        background-color: #000 !important;
        border-color: #000;
    }
    .app-item.selected .icon-iconify :global(svg) {
        filter: invert(1);
    }
    .icon-image {
        width: 2.2rem;
        height: 2.2rem;
        object-fit: contain;
        display: block;
    }
    .app-item.selected .icon-image {
        filter: invert(1);
    }
    .app-item.selected .icon-text {
        background: #000;
        color: #fff;
    }
</style>