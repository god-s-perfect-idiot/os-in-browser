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
	export let isActive = false;

	let width = defaultWindowSize.width;
	let height = defaultWindowSize.height;
	let isDragging = false;
	let isResizing = false;
	let dragOffset = { x: 0, y: 0 };
	let resizeStartPos = { x: 0, y: 0 };
	let resizeStartSize = { width: 0, height: 0 };
	let windowElement;
	let isFullscreen = false;
	let previewPosition = { x: 0, y: 0 };
	let originalDragPosition = { x: 0, y: 0 };
	let isFlickering = false;
	let previewSize = { width: '40rem', height: '20rem' };
	let originalResizeSize = { width: '40rem', height: '20rem' };

	// Variables to store original size and position when entering fullscreen.
	let originalPosition = { x, y };
	let originalSize = { width, height };

	// Handle window dragging with retro preview box
	function startDrag(e) {
		if (e.target.closest('.controls')) return; // Don't drag if clicking controls
		isDragging = true;
		originalDragPosition = { x, y };
		dragOffset.x = e.clientX - x;
		dragOffset.y = e.clientY - y;
		previewPosition = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
		document.addEventListener('mousemove', drag);
		document.addEventListener('mouseup', stopDrag);
	}

	function drag(e) {
		if (!isDragging) return;
		// Only update preview position, keep actual window in place
		previewPosition.x = e.clientX - dragOffset.x;
		previewPosition.y = e.clientY - dragOffset.y;
	}

	function stopDrag() {
		if (!isDragging) return;
		isDragging = false;
		document.removeEventListener('mousemove', drag);
		document.removeEventListener('mouseup', stopDrag);
		
		const targetX = previewPosition.x;
		const targetY = previewPosition.y;
		
		// Move window to new position first
		x = targetX;
		y = targetY;
		pm.updateMetadata(pid, { position: { x, y } });
		
		// Trigger flicker animation
		isFlickering = true;
		setTimeout(() => {
			isFlickering = false;
		}, 200);
	}

	// Handle window resizing from bottom-right corner with retro preview
	function startResize(e) {
		isResizing = true;
		const rect = windowElement.getBoundingClientRect();
		resizeStartPos.x = e.clientX;
		resizeStartPos.y = e.clientY;
		resizeStartSize.width = rect.width;
		resizeStartSize.height = rect.height;
		originalResizeSize = { width, height };
		previewSize = { width, height };
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
		e.preventDefault();
		e.stopPropagation();
	}

	function resize(e) {
		if (!isResizing) return;
		const deltaX = e.clientX - resizeStartPos.x;
		const deltaY = e.clientY - resizeStartPos.y;

		const newWidth = resizeStartSize.width + deltaX;
		const newHeight = resizeStartSize.height + deltaY;

		// Update preview size only, keep actual window size unchanged
		if (newWidth >= 200) {
			previewSize.width = `${newWidth}px`;
		}
		if (newHeight >= 100) {
			previewSize.height = `${newHeight}px`;
		}
	}

	function stopResize() {
		if (!isResizing) return;
		isResizing = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		
		// Apply the resize
		width = previewSize.width;
		height = previewSize.height;
		
		// Trigger flicker animation
		isFlickering = true;
		setTimeout(() => {
			isFlickering = false;
		}, 200);
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

	const minimize = () => {
		pm.updateMetadata(pid, { isMinimized: true });
	};
</script>

{#if !isMinimized}
	<!-- Preview box shown during drag -->
	{#if isDragging}
		<div
			class={`window drag-preview ${windowClassOverrides}`}
			style="left: {previewPosition.x}px; top: {previewPosition.y}px; width: {width}; height: {height}; z-index: 300;"
		>
			<div class="titlebar">
				<div class="controls">
					<button class="close">
						<span class="close-dot"></span>
					</button>
					<button class="minimize">
						<span class="minimize-line"></span>
					</button>
				</div>
				<div class="title-container">
					<span class="title">{title}</span>
				</div>
			</div>
			<div class="window-content"></div>
		</div>
	{/if}
	
	<!-- Preview box shown during resize -->
	{#if isResizing}
		<div
			class={`window drag-preview ${windowClassOverrides}`}
			style="left: {x}px; top: {y}px; width: {previewSize.width}; height: {previewSize.height}; z-index: 300;"
		>
			<div class="titlebar">
				<div class="controls">
					<button class="close">
						<span class="close-dot"></span>
					</button>
					<button class="minimize">
						<span class="minimize-line"></span>
					</button>
				</div>
				<div class="title-container">
					<span class="title">{title}</span>
				</div>
			</div>
			<div class="window-content"></div>
		</div>
	{/if}
	
	<!-- Preview box shown during resize -->
	{#if isResizing}
		<div
			class={`window drag-preview ${windowClassOverrides}`}
			style="left: {x}px; top: {y}px; width: {previewSize.width}; height: {previewSize.height}; z-index: 300;"
		>
			<div class="titlebar">
				<div class="controls">
					<button class="close">
						<span class="close-dot"></span>
					</button>
					<button class="minimize">
						<span class="minimize-line"></span>
					</button>
				</div>
				<div class="title-container">
					<span class="title">{title}</span>
				</div>
			</div>
			<div class="window-content"></div>
		</div>
	{/if}
	
	<!-- Actual window -->
	<div
		bind:this={windowElement}
		class={`window ${windowClassOverrides} ${isFlickering ? 'flickering' : ''}`}
		style="left: {x}px; top: {y}px; width: {width}; height: {height}; z-index: {isActive
			? 200
			: 100}; {isDragging || isResizing ? 'opacity: 0.9;' : ''}"
		on:mousedown={() => {
			// Bring window to front when clicked
			pm.setActive(pid);
		}}
	>
		<div class="titlebar" on:mousedown={startDrag}>
			<div class="controls">
				<button class="close" on:click={() => pm.remove(pid)} aria-label="Close window">
					<span class="close-dot"></span>
				</button>
				<button class="minimize" on:click={minimize} aria-label="Minimize window">
					<span class="minimize-line"></span>
				</button>
			</div>
			<div class="title-container">
				<span class="title">{title}</span>
			</div>
		</div>
		<div
			class="window-content"
			on:mousedown={() => pm.setActive(pid)}
			on:focusin={() => pm.setActive(pid)}
		>
			<slot />
		</div>
		<div class="resize-handle" on:mousedown={startResize} role="button" aria-label="Resize window">
			<div class="resize-icon"></div>
		</div>
	</div>
{/if}

<style>
	.window {
		position: fixed;
		user-select: none;
		background-image: 
			radial-gradient(circle, #000 1px, transparent 1px),
			radial-gradient(circle, #000 1px, transparent 1px);
		background-size: 4px 4px;
		background-position: 0 0, 2px 2px;
		background-color: #fff;
		border: 2px solid #000;
		border-radius: 0;
		box-sizing: border-box;
	}
	.titlebar {
		display: flex;
		align-items: stretch;
		gap: 8px;
		background: #fff;
		color: #000;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 14px;
		padding: 0;
		border-bottom: 2px solid black;
		border-radius: 0;
		user-select: none;
		cursor: pointer;
		position: relative;
		height: 31px;
	}
	.title-container {
		flex: 1 1 auto;
		display: flex;
		justify-content: center;
		align-items: stretch;
		margin: 0 auto;
		position: relative;
		padding: 0;
	}
	.titlebar .title {
		font-weight: bold;
		color: #000;
		font-size: 18px;
		font-family: 'Courier New', Courier, monospace;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		background: transparent;
		padding: 0 16px;
		border-radius: 0;
		display: inline-flex;
		align-items: center;
		height: 100%;
		position: relative;
		z-index: 1;
		margin: 0;
	}
	.controls {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 8px;
	}
	.controls button {
		width: 18px;
		height: 18px;
		border: 2px solid #000;
		border-radius: 0;
		padding: 0;
		margin: 0;
		cursor: pointer;
		transition: none;
		display: flex;
		align-items: center;
		justify-content: center;
		background-image: 
			radial-gradient(circle, #808080 1px, transparent 1px),
			radial-gradient(circle, #808080 1px, transparent 1px);
		background-size: 3px 3px;
		background-position: 0 0, 1.5px 1.5px;
		background-color: #e8e8e8;
	}
	.controls button:hover {
		opacity: 0.8;
	}
	.controls .close {
		background-image: 
			radial-gradient(circle, #808080 1px, transparent 1px),
			radial-gradient(circle, #808080 1px, transparent 1px);
		background-size: 3px 3px;
		background-position: 0 0, 1.5px 1.5px;
		background-color: #e8e8e8;
		border-color: #808080;
	}
	.controls .close .close-dot {
		width: 6px;
		height: 6px;
		background: #000;
		border-radius: 0;
		display: block;
	}
	.controls .minimize {
		background-image: 
			radial-gradient(circle, #808080 1px, transparent 1px),
			radial-gradient(circle, #808080 1px, transparent 1px);
		background-size: 3px 3px;
		background-position: 0 0, 1.5px 1.5px;
		background-color: #e8e8e8;
		border-color: #808080;
	}
	.controls .minimize .minimize-line {
		width: 9px;
		height: 2px;
		background: #000;
		display: block;
	}
	.window-content {
    height: calc(100% - 31px);
    padding: 8px;
    background: #fff;
    border-radius: 0;
    overflow-x: scroll !important;
    overflow-y: scroll !important;
    outline: none;
    box-sizing: border-box;
    caret-color: #000;
    caret-shape: block;
    /* DELETE THESE TWO LINES: */
    /* scrollbar-width: auto; */
    /* scrollbar-color: #fff #808080; */
}
/* Custom scrollbar styling - Vertical (right) and Horizontal (bottom) */
.window-content::-webkit-scrollbar {
    width: 20px;
    height: 20px;
}

/* Gray bar container (track) */
.window-content::-webkit-scrollbar-track {
    background-image: 
		radial-gradient(circle, #000 1px, transparent 1px),
		radial-gradient(circle, #000 1px, transparent 1px);
	background-size: 4px 4px;
	background-position: 0 0, 2px 2px;
	background-color: #fff;
    border: 2px solid #000;
}

/* Retro blocky thumb */
.window-content::-webkit-scrollbar-thumb {
    background: #fff;
    border: 2px solid #000;
    box-sizing: border-box;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
}

.window-content::-webkit-scrollbar-thumb:hover {
    background: #000;
}

.window-content::-webkit-scrollbar-thumb:active {
    background: #000;
}

	/* Up arrow button (vertical scrollbar top) */
	.window-content::-webkit-scrollbar-button:vertical:start:decrement {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M5 2 L2 6 L8 6 Z' fill='%23000'/%3E%3C/svg%3E") !important;
		background-repeat: no-repeat !important;
		background-position: center !important;
		background-size: 10px 10px !important;
	}

	/* Down arrow button (vertical scrollbar bottom) */
	.window-content::-webkit-scrollbar-button:vertical:end:increment {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M5 8 L2 4 L8 4 Z' fill='%23000'/%3E%3C/svg%3E") !important;
		background-repeat: no-repeat !important;
		background-position: center !important;
		background-size: 10px 10px !important;
	}

	/* Left arrow button (horizontal scrollbar left) */
	.window-content::-webkit-scrollbar-button:horizontal:start:decrement {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M2 5 L6 2 L6 8 Z' fill='%23000'/%3E%3C/svg%3E") !important;
		background-repeat: no-repeat !important;
		background-position: center !important;
		background-size: 10px 10px !important;
	}

	/* Right arrow button (horizontal scrollbar right) */
	.window-content::-webkit-scrollbar-button:horizontal:end:increment {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M8 5 L4 2 L4 8 Z' fill='%23000'/%3E%3C/svg%3E") !important;
		background-repeat: no-repeat !important;
		background-position: center !important;
		background-size: 10px 10px !important;
	}

	.window-content::-webkit-scrollbar-button:hover {
		background-image: 
			radial-gradient(circle, #000 1px, transparent 1px),
			radial-gradient(circle, #000 1px, transparent 1px) !important;
		background-size: 4px 4px !important;
		background-position: 0 0, 2px 2px !important;
		background-color: #fff !important;
		border-radius: 0px !important;
	}
	.resize-handle {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 20px;
		height: 20px;
		cursor: nwse-resize;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #e8e8e8;
		border-left: 2px solid #000;
		border-top: 2px solid #000;
		z-index: 10;
	}
	.resize-handle:hover {
		background: #000;
		border-left-color: #fff;
		border-top-color: #fff;
	}
	
	.resize-handle:active {
		background: #000;
		border-left-color: #fff;
		border-top-color: #fff;
	}
	.resize-handle:hover .resize-icon::before,
	.resize-handle:active .resize-icon::before {
		border-color: transparent transparent #fff transparent;
	}
	.resize-handle:hover .resize-icon::after,
	.resize-handle:active .resize-icon::after {
		border-color: transparent transparent #fff transparent;
	}
	.resize-icon {
		width: 12px;
		height: 12px;
		position: relative;
	}
	.resize-icon::before {
		content: '';
		position: absolute;
		bottom: 2px;
		right: 2px;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 0 8px 8px;
		border-color: transparent transparent #000 transparent;
		opacity: 0.6;
	}
	.resize-icon::after {
		content: '';
		position: absolute;
		bottom: 4px;
		right: 4px;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 0 6px 6px;
		border-color: transparent transparent #000 transparent;
		opacity: 0.4;
	}
	.drag-preview {
		pointer-events: none;
		background: transparent;
		border: 2px solid #000;
	}
	.drag-preview .titlebar,
	.drag-preview .window-content {
		display: none;
	}
	.flickering {
		animation: flicker 0.2s ease-in-out;
	}
	@keyframes flicker {
		0% { opacity: 1; }
		12.5% { opacity: 0; }
		100% { opacity: 1; }
	}
</style>
