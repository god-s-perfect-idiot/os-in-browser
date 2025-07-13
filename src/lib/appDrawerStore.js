import { writable } from 'svelte/store';

export const appDrawerOpen = writable(false);

export function toggleAppDrawer() {
	appDrawerOpen.update(open => !open);
}

export function openAppDrawer() {
	appDrawerOpen.set(true);
}

export function closeAppDrawer() {
	appDrawerOpen.set(false);
} 