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
	export let isNewlyCreated = false;
	export let isFullscreen = false;

	let width = defaultWindowSize.width;
	let height = defaultWindowSize.height;
	let isDragging = false;
	let isResizing = false;
	let dragOffset = { x: 0, y: 0 };
	let resizeDirection = { x: '', y: '' };
	let windowElement;
	let focussed = false;
	let isFullscreen = false;
	let isAnimating = false;

	// Variables to store original size and position when entering fullscreen.
	let originalPosition = { x, y };
	let originalSize = { width, height };

	// Handle animation for newly created windows
	$: if (isNewlyCreated && !isAnimating && windowElement) {
		isAnimating = true;
		windowElement.classList.add('window-open-animation');
		// Reset animation after it completes
		setTimeout(() => {
			if (windowElement) {
				windowElement.classList.remove('window-open-animation');
			}
			isNewlyCreated = false;
			isAnimating = false;
		}, 300);
	}

	// Handle animation for restored windows
	let wasMinimized = false;
	$: if (!isMinimized && wasMinimized && windowElement) {
		// Add restore animation when window becomes visible again
		windowElement.classList.add('window-restore-animation');
		
		// If window was fullscreen before minimizing, restore to fullscreen
		if (isFullscreen) {
			x = 0;
			y = 0;
			width = '100vw';
			height = '100vh';
			// Update process manager with fullscreen position
			pm.updateMetadata(pid, { 
				position: { x: 0, y: 0 },
				isFullscreen: true
			});
		}
		
		setTimeout(() => {
			if (windowElement) {
				windowElement.classList.remove('window-restore-animation');
			}
		}, 300);
	}
	$: wasMinimized = isMinimized;

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
		const edge = 4; // Edge size in pixels - matches resize detection
		const relX = e.clientX - rect.left;
		const relY = e.clientY - rect.top;

		// Check if we're hovering over the title bar element or its children
		const titleBarElement = windowElement.querySelector('.title-bar');
		const inTitleBar = titleBarElement && (titleBarElement === e.target || titleBarElement.contains(e.target));

		// Debug logging
		console.log('Mouse position:', relX, relY, 'In title bar:', inTitleBar, 'Target:', e.target.tagName);

		if (relX <= edge && relY <= edge) windowElement.style.cursor = 'nw-resize';
		else if (relX >= rect.width - edge && relY <= edge) windowElement.style.cursor = 'ne-resize';
		else if (relX <= edge && relY >= rect.height - edge) windowElement.style.cursor = 'sw-resize';
		else if (relX >= rect.width - edge && relY >= rect.height - edge)
			windowElement.style.cursor = 'se-resize';
		else if (relX <= edge) windowElement.style.cursor = 'w-resize';
		else if (relX >= rect.width - edge) windowElement.style.cursor = 'e-resize';
		else if (relY <= edge) windowElement.style.cursor = 'n-resize';
		else if (relY >= rect.height - edge) windowElement.style.cursor = 's-resize';
		else if (inTitleBar) windowElement.style.cursor = 'move';
		else windowElement.style.cursor = 'default';
	}

	// Fullscreen toggle
	function toggleFullscreen() {
		if (isFullscreen) {
			// Exit fullscreen: restore original position and size with animation
			isFullscreen = false;
			// Animate back to original size and position
			setTimeout(() => {
				width = originalSize.width;
				height = originalSize.height;
				x = originalPosition.x;
				y = originalPosition.y;
				// Update process manager
				pm.updateMetadata(pid, { 
					position: { x: originalPosition.x, y: originalPosition.y },
					isFullscreen: false
				});
			}, 50);
		} else {
			// Store current values before going fullscreen.
			originalPosition = { x, y };
			originalSize = { width, height };
			isFullscreen = true;
			// Animate to fullscreen
			setTimeout(() => {
				width = '100vw';
				height = '100vh';
				x = 0;
				y = 0;
				// Update process manager
				pm.updateMetadata(pid, { 
					position: { x: 0, y: 0 },
					isFullscreen: true
				});
			}, 50);
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
		// Add minimize animation class
		windowElement.classList.add('window-minimize-animation');
		
		// After animation completes, actually minimize
		setTimeout(() => {
			pm.updateMetadata(pid, { isMinimized: true });
		}, 200);
	};

	$: console.log(isMinimized);
</script>

{#if !isMinimized}
	<div
		bind:this={windowElement}
		class={`window absolute pb-2 shadow-md ${windowClassOverrides} ${isFullscreen ? '!rounded-none' : '!rounded-2xl'} ${isNewlyCreated ? 'window-open-animation' : ''}`}
		style="left: {x}px; top: {y}px; width: {width}; height: {height}; z-index: {isFullscreen ? 10001 : (focussed ? 1 : 0)}"
		on:mousedown={(e) => {
			// Only handle resize if we're not already dragging and not clicking on controls
			if (e.target.closest('.controls')) return;
			
			const rect = windowElement.getBoundingClientRect();
			const edge = 4; // Reduced edge size for more precise resize detection
			const relX = e.clientX - rect.left;
			const relY = e.clientY - rect.top;

			// Only start resize if we're very close to the edge (within 4 pixels)
			if (relX <= edge) {
				startResize(e, { x: 'left', y: '' });
			} else if (relX >= rect.width - edge) {
				startResize(e, { x: 'right', y: '' });
			} else if (relY <= edge) {
				startResize(e, { x: '', y: 'top' });
			} else if (relY >= rect.height - edge) {
				startResize(e, { x: '', y: 'bottom' });
			} else {
				// If not on edge, start dragging instead
				startDrag(e);
			}
		}}
	>
		<div class="title-bar flex items-center justify-between p-1">
			<span class="pt-1 pl-2 font-[500]">{title}</span>
			<div class="controls flex items-end justify-center gap-2 pr-1">
				<button class="minimize flex h-6 items-center" on:click={minimize}
					><Icon icon="material-symbols:minimize" font-size="1rem" /></button
				>
				<button class="maximize flex h-6 items-center" on:click={toggleFullscreen}>
					{#if isFullscreen}
					<Icon icon="gg:minimize" font-size="1rem" />
					{:else}
					<Icon icon="mdi:square-outline" font-size="1rem" />
					{/if}
				</button>
				<button class="close flex h-6 items-center" on:click={() => pm.remove(pid)}>
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
		background-color: #fffffff9;
		transform-origin: center;
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
					height 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
					left 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
					top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.window-open-animation {
		animation: windowOpen 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		transition: none !important;
	}

	@keyframes windowOpen {
		0% {
			opacity: 0;
			transform: scale(0.8) translateY(20px);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.window-minimize-animation {
		animation: windowMinimize 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
		transition: none !important;
	}

	@keyframes windowMinimize {
		0% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(0.8) translateY(20px);
		}
	}

	.window-restore-animation {
		animation: windowRestore 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		transition: none !important;
	}

	@keyframes windowRestore {
		0% {
			opacity: 0;
			transform: scale(0.8) translateY(20px);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
	.controls button {
		padding: 0rem 0.25rem;
    border-radius: 2rem;
    align-items: center;
    justify-content: center;
    display: flex;
	}

  .controls button :global(svg) {
    opacity: 0;
    transition: opacity 0.15s;
  }
  
  .controls button:hover :global(svg) {
    opacity: 1;
  }
  
  .minimize,
	.maximize,
	.close {
		cursor: pointer;
	}
	.close {
		background-color: #ff3131;
		color: white;
	}
	.maximize {
		background-color: #737373;
		color: white;
	}
	.minimize {
		background-color: #000;
		color: white;
	}
	.window-content {
		height: calc(100% - 2.5rem);
		overflow: auto;
	}
</style>
