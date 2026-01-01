<script>
	import { apps } from '$lib/applib';
	import { pm } from '$lib/pm';
	import Icon from '@iconify/svelte';

	export let left = 0,
		top = 0,
		show = false,
		close = () => {},
		menuItems = null; // Custom menu items, if null use default

	const launchApp = (app) =>
		pm.add(app.name, {
			type: 'window', // You can adjust this based on your needs
			appId: app.appId,
			isMinimized: false,
			position: {
				x: 100, // Default window position
				y: 150  // Account for menu bar (24px) + padding
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
		class="context-menu fixed z-[9999] flex w-fit flex-col justify-start text-black"
		style="left: {left}px; top: {top}px"
	>
		{#each items as item}
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
