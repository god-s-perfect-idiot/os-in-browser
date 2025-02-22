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
		}, 3000);
	});
</script>


{#if loading}
	<Boot />
{:else}
<ContextMenu {left} {top} show={hasRightClicked} close={() => (hasRightClicked = false)} />
    
<WindowManager />

<div class="desktop">
    <AppDrawer />
</div>
{/if}

<style>
	.desktop {
		width: 100vw;
		height: 100vh;
		background-color: var(--surface-color);
		background-image: url('images/bg-3.jpg');
        background-size: cover;
        background-position: center;
	}
</style>
