<script>
	import { apps } from '$lib/applib';
	import { pm } from '$lib/pm';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { contextMenuState, menuItems, hideContextMenu, getTaskbarMenuItems } from '$lib/contextMenuStore';
	import { taskbarState, toggleAutoHide, startAutoHideTimer } from '$lib/taskbarStore';

	let menuElement;
	let adjustedLeft = 0;
	let adjustedTop = 0;

	// Subscribe to context menu state
	$: ({ show, left, top, menuType } = $contextMenuState);
	
	// Get menu items based on type and state
	$: currentItems = menuType === 'taskbar' ? getTaskbarMenuItemsWithState() : (menuItems[menuType] || menuItems.default);

	// Function to get taskbar menu items with current state
	function getTaskbarMenuItemsWithState() {
		const { isAutoHideEnabled } = $taskbarState;
		
		return [
			{
				icon: isAutoHideEnabled ? 'mdi:eye' : 'mdi:eye-off',
				label: isAutoHideEnabled ? 'Show Taskbar Always' : 'Auto Hide Taskbar',
				shortcut: '',
				action: () => {
					toggleAutoHide();
					startAutoHideTimer();
					hideContextMenu();
				}
			},
			{ type: 'separator' },
			{
				icon: 'mdi:cog',
				label: 'Taskbar Settings',
				shortcut: '',
				action: () => {
					// Open taskbar settings
					console.log('Taskbar settings');
					hideContextMenu();
				}
			},
			{
				icon: 'mdi:close',
				label: 'Close',
				shortcut: 'Esc',
				action: () => {
					hideContextMenu();
				}
			}
		];
	}

	// Calculate adjusted position to prevent overflow
	function calculatePosition() {
		if (!menuElement) return;
		
		const rect = menuElement.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		
		// Reset to original position first
		adjustedLeft = left;
		adjustedTop = top;
		
		// Check right overflow
		if (left + rect.width > viewportWidth) {
			adjustedLeft = left - rect.width;
		}
		
		// Check bottom overflow
		if (top + rect.height > viewportHeight) {
			adjustedTop = top - rect.height;
		}
		
		// Check left overflow (if we moved it left)
		if (adjustedLeft < 0) {
			adjustedLeft = 10; // Small margin from left edge
		}
		
		// Check top overflow (if we moved it up)
		if (adjustedTop < 0) {
			adjustedTop = 10; // Small margin from top edge
		}
	}

	// Recalculate position when show changes
	$: if (show) {
		// Use setTimeout to ensure the menu is rendered before measuring
		setTimeout(calculatePosition, 0);
	}

	const launchApp = (app) => {
		pm.add(app.name, {
			type: 'window',
			appId: app.appId,
			isMinimized: false,
			position: {
				x: 100,
				y: 150
			},
			...app
		});
		hideContextMenu();
	};

	// Update menu items to use the launchApp function
	$: updatedItems = currentItems.map(item => {
		if (item.label === 'Quick Note') {
			return { ...item, action: () => { launchApp(apps.notes); } };
		} else if (item.label === 'Process Manager') {
			return { ...item, action: () => { launchApp(apps.processes); } };
		} else if (item.label === 'Settings') {
			return { ...item, action: () => { launchApp(apps.settings); } };
		} else if (item.label === 'Help') {
			return { ...item, action: () => { launchApp(apps.help); } };
		}
		return item;
	});
</script>

{#if show}
	<div
		bind:this={menuElement}
		class="context-menu fixed z-[9999] flex w-fit flex-col justify-start px-2 py-2 text-black"
		style="left: {adjustedLeft}px; top: {adjustedTop}px"
	>
		{#each updatedItems as item}
			{#if item.type === 'separator'}
				<div class="w-full border-b border-[#000]" />
			{:else}
				<button on:click={item.action}>
					<div class="flex items-center justify-start">
						<Icon icon={item.icon} class="mr-2" />
						{item.label}
					</div>
					<span>{item.shortcut}</span>
				</button>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.context-menu {
		background: #fff;
		border: 2px solid #000;
		border-radius: 0;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
	}
	.context-menu button {
		cursor: pointer;
		border: none;
		text-align: left;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;
		font-size: 1rem;
		color: #000;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		gap: 2rem;
		background: transparent;
	}
	button span {
		font-size: 1rem;
		color: #000;
		font-weight: bold;
	}

	button:hover {
		background: #000;
		color: #fff !important;
	}

	button:hover span {
		color: #fff !important;
	}
	
	button:hover :global(svg) {
		color: #fff !important;
	}
</style>
