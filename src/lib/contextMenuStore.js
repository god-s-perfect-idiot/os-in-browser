import { writable } from 'svelte/store';
import { toggleAutoHide, startAutoHideTimer } from './taskbarStore.js';

export const contextMenuState = writable({
	show: false,
	left: 0,
	top: 0,
	menuType: 'default'
});

export function showContextMenu(left, top, menuType = 'default') {
	contextMenuState.set({
		show: true,
		left,
		top,
		menuType
	});
}

export function hideContextMenu() {
	contextMenuState.set({
		show: false,
		left: 0,
		top: 0,
		menuType: 'default'
	});
}

// Menu items for different contexts
export const menuItems = {
	default: [
		{
			icon: 'mdi:pen',
			label: 'Quick Note',
			shortcut: 'Ctrl+N',
			action: () => {
				// Launch notes app
				hideContextMenu();
			}
		},
		{ type: 'separator' },
		{
			icon: 'mdi:monitor',
			label: 'Process Manager',
			shortcut: 'Ctrl+M',
			action: () => {
				// Launch process manager
				hideContextMenu();
			}
		},
		{
			icon: 'mdi:color-lens',
			label: 'Customization',
			shortcut: 'Ctrl+T',
			action: () => {
				hideContextMenu();
			}
		},
		{
			icon: 'mdi:cog',
			label: 'Settings',
			shortcut: 'Ctrl+,',
			action: () => {
				// Launch settings
				hideContextMenu();
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
				// Launch help
				hideContextMenu();
			}
		},
		{
			icon: 'mdi:information',
			label: 'About',
			shortcut: 'Ctrl+I',
			action: () => {
				hideContextMenu();
			}
		},
		{ type: 'separator' },
		{
			icon: 'mdi:close',
			label: 'Close',
			shortcut: 'Esc',
			action: () => {
				hideContextMenu();
			}
		}
	],
	taskbar: [
		{
			icon: 'mdi:eye-off',
			label: 'Auto Hide Taskbar',
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
	]
};

// Reactive menu items that update based on taskbar state
export function getTaskbarMenuItems() {
	// This function will be called reactively in the component
	return [
		{
			icon: 'mdi:eye-off',
			label: 'Auto Hide Taskbar',
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