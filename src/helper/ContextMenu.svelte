<script>
	import { apps } from '$lib/applib';
	import { pm } from '$lib/pm';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	export let left = 0,
		top = 0,
		show = false,
		close = () => {},
		menuItems = null; // Custom menu items, if null use default

	let menuElement;
	let adjustedLeft = left;
	let adjustedTop = top;

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

	const launchApp = (app) =>
		pm.add(app.name, {
			type: 'window', // You can adjust this based on your needs
			appId: app.appId,
			isMinimized: false,
			position: {
				x: 100, // Default window position
				y: 100
			},
			...app
		});

	// Default desktop context menu items
	const defaultMenuItems = [
		{
			icon: 'mdi:pen',
			label: 'Quick Note',
			shortcut: 'Ctrl+N',
			action: () => {
				launchApp(apps.notes);
				close();
			}
		},
		{ type: 'separator' },
		{
			icon: 'mdi:monitor',
			label: 'Process Manager',
			shortcut: 'Ctrl+M',
			action: () => {
				launchApp(apps.processes);
				close();
			}
		},
		{
			icon: 'mdi:color-lens',
			label: 'Customization',
			shortcut: 'Ctrl+T',
			action: () => {
				// Placeholder for customization
				close();
			}
		},
		{
			icon: 'mdi:cog',
			label: 'Settings',
			shortcut: 'Ctrl+,',
			action: () => {
				launchApp(apps.settings);
				close();
			}
		},
		{ type: 'separator' },
		{
			icon: 'mdi:restart',
			label: 'Restart',
			shortcut: 'Alt+Enter',
			action: () => {
				window.location.reload();
			}
		},
		{
			icon: 'mdi:help',
			label: 'Help',
			shortcut: 'Ctrl+H',
			action: () => {
				launchApp(apps.help);
				close();
			}
		},
		{
			icon: 'mdi:information',
			label: 'About',
			shortcut: 'Ctrl+I',
			action: () => {
				// Placeholder for about
				close();
			}
		},
		{ type: 'separator' },
		{
			icon: 'mdi:close',
			label: 'Close',
			shortcut: 'Esc',
			action: () => {
				close();
			}
		}
	];

	// Use custom menu items if provided, otherwise use default
	$: items = menuItems || defaultMenuItems;
</script>

{#if show}
	<div
		bind:this={menuElement}
		class="context-menu fixed z-[9999] flex w-fit flex-col justify-start px-2 py-2 text-black"
		style="left: {adjustedLeft}px; top: {adjustedTop}px"
	>
		{#each items as item}
			{#if item.type === 'separator'}
				<div class="w-full border-b border-gray-400 pt-1 mb-2" />
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
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
		/* background-color: #ffffffec; */
		background-color: white;
		border-radius: 0.5rem;
	}
	.context-menu button {
		cursor: pointer;
		border: none;
		text-align: left;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-weight: 400;
		font-size: 0.9rem;
		color: #333333;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		gap: 2rem;
	}
	button span {
		font-size: 0.9rem;
		color: #666666;
		font-weight: 500;
	}

	button:hover {
		background-color: var(--accent-color);
		color: white !important;
	}

	button:hover span {
		color: #f1f1f1 !important;
	}
</style>
