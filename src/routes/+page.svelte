<script>
    import ContextMenu from '../helper/ContextMenu.svelte';
	import { onMount } from 'svelte';
	import WindowManager from '../helper/WindowManager.svelte';
	import Boot from '../helper/Boot.svelte';
	import { toggleAppDrawer } from '$lib/appDrawerStore';
	import { showContextMenu } from '$lib/contextMenuStore';

	function handleRightClick(e) {
		e.preventDefault();
		
		// Check if the clicked element has a specific context menu
		const target = e.target.closest('[data-context-menu]');
		if (target) {
			const menuType = target.getAttribute('data-context-menu');
			showContextMenu(e.clientX, e.clientY, menuType);
		} else {
			// Default context menu
			showContextMenu(e.clientX, e.clientY, 'default');
		}
	}

	function handleKeydown(event) {
		// Ctrl+Space to open app drawer
		if (event.ctrlKey && event.code === 'Space') {
			event.preventDefault();
			toggleAppDrawer();
		}
	}

	onMount(() => {
		document.addEventListener('contextmenu', handleRightClick);
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('contextmenu', handleRightClick);
			document.removeEventListener('keydown', handleKeydown);
		};
	});
	
	let loading = true;
	onMount(() => {
		setTimeout(() => {
			loading = false;
		}, 3000);
	});
</script>


{#if loading}
	<Boot />
{:else}
<ContextMenu />
    
<WindowManager />

<div class="desktop">
    <!-- Desktop is now clean - app drawer is in taskbar -->
</div>
{/if}

<style>
	.desktop {
		width: 100vw;
		height: 100vh;
		background-color: var(--surface-color);
		background-image: url('https://i.postimg.cc/zBd3S8nR/bg-6.png');
        background-size: cover;
        background-position: center;
	}
</style>
