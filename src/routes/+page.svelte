<script>
	import AppDrawer from '../helper/AppDrawer.svelte';
	import ContextMenu from '../helper/ContextMenu.svelte';
	import { onMount } from 'svelte';
	import WindowManager from '../helper/WindowManager.svelte';
	import Boot from '../helper/Boot.svelte';
	import { settings } from '$lib/settings';
	import { toggleAppDrawer } from '$lib/appDrawerStore';
	import { showContextMenu } from '$lib/contextMenuStore';

	$: s = $settings;

	function handleRightClick(e) {
		e.preventDefault();

		const target = e.target.closest('[data-context-menu]');
		if (target) {
			const menuType = target.getAttribute('data-context-menu');
			showContextMenu(e.clientX, e.clientY, menuType);
		} else {
			showContextMenu(e.clientX, e.clientY, 'default');
		}
	}

	function handleKeydown(event) {
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
		}, 3500);
	});

	function handleDesktopClick(event) {
		if (event.target.classList.contains('desktop') && !event.target.closest('.app-item')) {
			document.dispatchEvent(new CustomEvent('deselect-apps'));
		}
	}

	$: desktopStyle = (() => {
		const w = s.wallpaper || 'dot-matrix';
		const bg = s.desktopBgColor || '#ffffff';
		const dotColor = s.dotMatrixColor || '#000000';
		if (w === 'solid-white') return { backgroundColor: '#ffffff' };
		if (w === 'solid-gray') return { backgroundColor: '#808080' };
		if (w === 'solid-black') return { backgroundColor: '#000000' };
		if (w.startsWith('http') || w.startsWith('data:')) {
			return { backgroundImage: `url(${w})`, backgroundSize: 'cover', backgroundColor: bg };
		}
		return { '--desktop-dot-color': dotColor, '--desktop-bg-color': bg };
	})();
	$: desktopClass =
		'desktop' + (s.wallpaper === 'dot-matrix' ? ' desktop-dot-matrix' : '') + ' taskbar-top';
</script>

{#if loading}
	<Boot />
{:else}
	<ContextMenu />

	<WindowManager />

	<div class={desktopClass} style={desktopStyle} on:click={handleDesktopClick}>
		{#if s.showDesktopIcons !== false}
			<AppDrawer />
		{/if}
	</div>
{/if}

<style>
	.desktop {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		position: relative;
		z-index: 0;
	}
	.desktop.taskbar-top {
		padding-top: 24px;
	}
	.desktop-dot-matrix {
		background-image:
			radial-gradient(circle, var(--desktop-dot-color, #000) 1px, transparent 1px),
			radial-gradient(circle, var(--desktop-dot-color, #000) 1px, transparent 1px);
		background-size: 4px 4px;
		background-position:
			0 0,
			2px 2px;
		background-color: var(--desktop-bg-color, #fff);
	}
</style>
