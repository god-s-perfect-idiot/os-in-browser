<script>
	import { pm } from '$lib/pm';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	export let x;
	export let y;
	export let title;
	export let slot;
	export let pid;

	let width = '40rem';
	let height = '20rem';
	let isDragging = false;
	let isResizing = false;
	let dragOffset = { x: 0, y: 0 };
	let resizeDirection = { x: '', y: '' };
	let windowElement;
	let focussed = false;

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
				// Minimum width
				width = `${newWidth}px`;
				x = e.clientX;
			}
		}

		if (resizeDirection.y === 'bottom') {
			height = `${e.clientY - rect.top}px`;
		} else if (resizeDirection.y === 'top') {
			const newHeight = rect.bottom - e.clientY;
			if (newHeight >= 100) {
				// Minimum height
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
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (x < edge && y < edge) windowElement.style.cursor = 'nw-resize';
		else if (x > rect.width - edge && y < edge) windowElement.style.cursor = 'ne-resize';
		else if (x < edge && y > rect.height - edge) windowElement.style.cursor = 'sw-resize';
		else if (x > rect.width - edge && y > rect.height - edge)
			windowElement.style.cursor = 'se-resize';
		else if (x < edge) windowElement.style.cursor = 'w-resize';
		else if (x > rect.width - edge) windowElement.style.cursor = 'e-resize';
		else if (y < edge) windowElement.style.cursor = 'n-resize';
		else if (y > rect.height - edge) windowElement.style.cursor = 's-resize';
		else windowElement.style.cursor = 'default';
	}

	onMount(() => {
		windowElement.addEventListener('mousemove', updateResizeCursor);
		windowElement.addEventListener('mousedown', () => {
			focussed = true;
            console.log(pid)
		});
		windowElement.addEventListener('mouseleave', () => {
			focussed = false;
		});
		return () => {
			windowElement.removeEventListener('mousemove', updateResizeCursor);
		};
	});
</script>

<div
	bind:this={windowElement}
	class="window absolute rounded-md shadow-md"
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
	<div
		class="flex cursor-move items-center justify-between border-b border-gray-300 p-1"
		on:mousedown={startDrag}
	>
		<span class="pt-1 pl-1">{title}</span>
		<div class="controls flex items-center justify-center">
			<button class="minimize"><Icon icon="material-symbols:minimize" font-size="1.5rem" /></button>
			<button class="maximize"><Icon icon="mdi:window-maximize" font-size="1.5rem" /></button>
			<button class="close" on:click={() => pm.remove(pid)}
				><Icon icon="material-symbols:close" font-size="1.5rem" /></button
			>
		</div>
	</div>
	<div class="window-content">
		{slot}
	</div>
</div>

<style>
	.window {
		user-select: none;
        background-color: #ffffffef;
	}
	.controls button {
		padding: 0rem 0.25rem;
	}
	.minimize,
	.maximize,
	.close {
		cursor: pointer;
	}
	.close:hover {
		background-color: red;
		color: white;
	}
	.maximize:hover {
		background-color: green;
		color: white;
	}
	.minimize:hover {
		background-color: blue;
		color: white;
	}
	.window-content {
		height: calc(100% - 2.5rem);
		overflow: auto;
	}
</style>
