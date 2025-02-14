<script>
	import AppDrawer from '../helper/AppDrawer.svelte';
    import ContextMenu from '../helper/ContextMenu.svelte';
	import { onMount } from 'svelte';
	import WindowManager from '../helper/WindowManager.svelte';

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
</script>

<ContextMenu {left} {top} show={hasRightClicked} close={() => (hasRightClicked = false)} />
    
<WindowManager />

<div class="desktop">
    <AppDrawer />
</div>

<style>
	.desktop {
		width: 100vw;
		height: 100vh;
		background-color: blueviolet;
		background-image: url('images/bg-1.jpg');
	}
</style>
