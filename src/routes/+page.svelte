<script>
    import ContextMenu from '../helper/ContextMenu.svelte';
	import { onMount } from 'svelte';
	import WindowManager from '../helper/WindowManager.svelte';
	import Boot from '../helper/Boot.svelte';
	import { toggleAppDrawer } from '$lib/appDrawerStore';

	// listen for right click
	$: hasRightClicked = false;
	let left = 0;
	let top = 0;
	function handleRightClick(e) {
		e.preventDefault();
		hasRightClicked = true;
		left = e.clientX;
		top = e.clientY;
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
<ContextMenu {left} {top} show={hasRightClicked} close={() => (hasRightClicked = false)} />
    
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
		background-image: url('images/bg-6.png');
        background-size: cover;
        background-position: center;
	}
</style>
