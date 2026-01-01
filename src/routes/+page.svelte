<script>
	import AppDrawer from '../helper/AppDrawer.svelte';
    import ContextMenu from '../helper/ContextMenu.svelte';
	import { onMount } from 'svelte';
	import WindowManager from '../helper/WindowManager.svelte';
	import Boot from '../helper/Boot.svelte';

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
	onMount(() => {
		document.addEventListener('contextmenu', handleRightClick);
		return () => {
			document.removeEventListener('contextmenu', handleRightClick);
		};
	});
	
	let loading = true;
	onMount(() => {
		setTimeout(() => {
			loading = false;
		}, 3500);
	});

	// Deselect apps when clicking on desktop background
	function handleDesktopClick(event) {
		// Only deselect if clicking directly on desktop, not on app items
		if (event.target.classList.contains('desktop') && !event.target.closest('.app-item')) {
			// Dispatch custom event to deselect all apps
			document.dispatchEvent(new CustomEvent('deselect-apps'));
		}
	}
</script>


{#if loading}
	<Boot />
{:else}
<ContextMenu {left} {top} show={hasRightClicked} close={() => (hasRightClicked = false)} />
    
<WindowManager />

<div class="desktop" on:click={handleDesktopClick}>
    <AppDrawer />
</div>
{/if}

<style>
	.desktop {
		width: 100vw;
		height: 100vh;
		padding-top: 24px;
		box-sizing: border-box;
		background-image: 
			radial-gradient(circle, #000 1px, transparent 1px),
			radial-gradient(circle, #000 1px, transparent 1px);
		background-size: 4px 4px;
		background-position: 0 0, 2px 2px;
		background-color: #fff;
		position: relative;
		z-index: 0;
	}
</style>
