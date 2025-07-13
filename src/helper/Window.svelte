<script>
	import { pm } from '$lib/pm';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	export let x;
	export let y;
	export let title;
	export let pid;
	export let defaultWindowSize = { width: '40rem', height: '20rem' };
	export let windowClassOverrides = '';
	export let isMinimized = false;

	let width = defaultWindowSize.width;
	let height = defaultWindowSize.height;
	let isDragging = false;
	let isResizing = false;
	let dragOffset = { x: 0, y: 0 };
	let resizeDirection = { x: '', y: '' };
	let windowElement;
	let focussed = false;
	let isFullscreen = false;

	// Variables to store original size and position when entering fullscreen.
	let originalPosition = { x, y };
	let originalSize = { width, height };

	// Handle window dragging
	function startDrag(e) {
		if (e.target.closest('.controls')) return; // Don't drag if clicking controls
		isDragging = true;
		dragOffset.x = e.clientX - x;
		dragOffset.y = e.clientY - y;
		document.addEventListener('mousemove', drag);
		document.addEventListener('mouseup', stopDrag);
	}

	function drag(e) {
		if (!isDragging) return;
		x = e.clientX - dragOffset.x;
		y = e.clientY - dragOffset.y;
	}

	function stopDrag() {
		isDragging = false;
		document.removeEventListener('mousemove', drag);
		document.removeEventListener('mouseup', stopDrag);
		pm.updateMetadata(pid, { position: { x, y } });
	}

	// Handle window resizing
	function startResize(e, direction) {
		isResizing = true;
		resizeDirection = direction;
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
		e.preventDefault();
	}

	function resize(e) {
		if (!isResizing) return;
		const rect = windowElement.getBoundingClientRect();

		if (resizeDirection.x === 'right') {
			width = `${e.clientX - rect.left}px`;
		} else if (resizeDirection.x === 'left') {
			const newWidth = rect.right - e.clientX;
			if (newWidth >= 200) {
				width = `${newWidth}px`;
				x = e.clientX;
			}
		}

		if (resizeDirection.y === 'bottom') {
			height = `${e.clientY - rect.top}px`;
		} else if (resizeDirection.y === 'top') {
			const newHeight = rect.bottom - e.clientY;
			if (newHeight >= 100) {
				height = `${newHeight}px`;
				y = e.clientY;
			}
		}
	}

	function stopResize() {
		isResizing = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
	}

	// Update cursor based on hover position
	function updateResizeCursor(e) {
		if (isResizing || isDragging) return;
		const rect = e.target.getBoundingClientRect();
		const edge = 8; // Edge size in pixels
		const relX = e.clientX - rect.left;
		const relY = e.clientY - rect.top;

		if (relX < edge && relY < edge) windowElement.style.cursor = 'nw-resize';
		else if (relX > rect.width - edge && relY < edge) windowElement.style.cursor = 'ne-resize';
		else if (relX < edge && relY > rect.height - edge) windowElement.style.cursor = 'sw-resize';
		else if (relX > rect.width - edge && relY > rect.height - edge)
			windowElement.style.cursor = 'se-resize';
		else if (relX < edge) windowElement.style.cursor = 'w-resize';
		else if (relX > rect.width - edge) windowElement.style.cursor = 'e-resize';
		else if (relY < edge) windowElement.style.cursor = 'n-resize';
		else if (relY > rect.height - edge) windowElement.style.cursor = 's-resize';
		else windowElement.style.cursor = 'default';
	}

	// Fullscreen toggle
	function toggleFullscreen() {
		if (isFullscreen) {
			// Exit fullscreen: restore original position and size.
			isFullscreen = false;
			width = originalSize.width;
			height = originalSize.height;
			x = originalPosition.x;
			y = originalPosition.y;
		} else {
			// Store current values before going fullscreen.
			originalPosition = { x, y };
			originalSize = { width, height };
			isFullscreen = true;
			width = '100vw';
			height = '100vh';
			x = 0;
			y = 0;
		}
	}

	onMount(() => {
		windowElement.addEventListener('mousemove', updateResizeCursor);
		windowElement.addEventListener('mousedown', () => {
			focussed = true;
			pm.setActive(pid);
		});
		return () => {
			windowElement.removeEventListener('mousemove', updateResizeCursor);
		};
	});

	const minimize = () => {
		pm.updateMetadata(pid, { isMinimized: true });
	};

	$: console.log(isMinimized);
</script>

{#if !isMinimized}
	<div
		bind:this={windowElement}
		class={`window absolute ${windowClassOverrides}`}
		style="left: {x}px; top: {y}px; width: {width}; height: {height}; z-index: {focussed ? 1 : 0}"
		on:mousedown={(e) => {
			const rect = windowElement.getBoundingClientRect();
			const edge = 8;
			const relX = e.clientX - rect.left;
			const relY = e.clientY - rect.top;

			if (relX < edge) {
				startResize(e, { x: 'left', y: '' });
			} else if (relX > rect.width - edge) {
				startResize(e, { x: 'right', y: '' });
			} else if (relY < edge) {
				startResize(e, { x: '', y: 'top' });
			} else if (relY > rect.height - edge) {
				startResize(e, { x: '', y: 'bottom' });
			}
		}}
	>
		<div class="titlebar" on:mousedown={startDrag}>
			<span class="title">{title}</span>
			<div class="controls">
				<button class="minimize" on:click={minimize}
					><Icon icon="material-symbols:minimize" font-size="1rem" /></button
				>
				<button class="maximize" on:click={toggleFullscreen}>
					<Icon icon="mdi:square-outline" font-size="0.9rem" />
				</button>
				<button class="close" on:click={() => pm.remove(pid)}>
					<Icon icon="mdi:close" font-size="1rem" />
				</button>
			</div>
		</div>
		<div class="window-content">
			<slot />
		</div>
	</div>
{/if}

<style>
	.window {
		user-select: none;
		background-color: #e0e0e0;
		border: 2px solid #000;
		box-shadow: 2px 2px 0 #808080;
		border-radius: 0;
	}
	.titlebar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(180deg, #0a246a 0%, #3a6ea5 100%);
		color: #fff;
		font-family: "MS Sans Serif", Tahoma, Geneva, sans-serif;
		font-weight: bold;
		font-size: 15px;
		padding: 2px 6px 2px 8px;
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #000080;
		border-bottom: 2px solid #000080;
		border-radius: 0;
		user-select: none;
	}
	.titlebar .title {
		padding-left: 2px;
		font-weight: bold;
		color: #fff;
		text-shadow: 1px 1px 0 #0008;
		font-size: 15px;
		font-family: "MS Sans Serif", Tahoma, Geneva, sans-serif;
		flex: 1 1 auto;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.controls {
		display: flex;
		align-items: center;
		gap: 2px;
	}
	.controls button {
		width: 22px;
		height: 20px;
		background: #c0c0c0;
		border: 2px outset #fff;
		box-shadow: 1px 1px 0 #808080;
		color: #000;
		padding: 0;
		margin: 0 1px;
		border-radius: 0;
		cursor: pointer;
		transition: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.controls button:active {
		border: 2px inset #fff;
		background: #a0a0a0;
	}
	.controls .close {
		background: #c04040;
		color: #fff;
		border: 2px outset #fff;
	}
	.controls .close:active {
		background: #a02020;
		border: 2px inset #fff;
	}
	.window-content {
		height: calc(100% - 28px);
		padding: 4px;
		background: #fff;
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #808080;
		border-bottom: 2px solid #808080;
		border-radius: 0;
		overflow: auto;
	}
</style>
