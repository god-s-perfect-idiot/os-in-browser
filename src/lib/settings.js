import { writable, get } from 'svelte/store';

const STORAGE_KEY = 'os-in-browser-settings';

const defaults = {
	// Desktop & appearance
	wallpaper: 'dot-matrix', // 'dot-matrix' | 'solid-white' | 'solid-gray' | 'solid-black' | custom url
	desktopBgColor: '#ffffff',
	theme: 'light', // 'light' | 'dark'
	dotMatrixColor: '#000000',

	// Taskbar & clock
	clockFormat: '12hour', // '12hour' | '24hour'
	clockShowSeconds: false,
	dateFormat: 'short', // 'short' (e.g. Wed 3/4) | 'long' (e.g. Wednesday, March 4, 2025)
	showClock: true,

	// Typography & UI
	fontSize: 'medium', // 'small' | 'medium' | 'large'
	cursorStyle: 'pixel', // 'pixel' | 'default'
	windowAnimation: true,

	// Sound
	soundEnabled: true,
	volume: 100,

	// Desktop & apps
	showDesktopIcons: true,
	visibleAppIds: null, // null = all apps; or array of appId strings to show in drawer

	// Developer
	developerMode: false,
	showPidInTitle: false,

	// Accessibility
	highContrast: false,
	largeClickTargets: false
};

function load() {
	if (typeof window === 'undefined' || !window.localStorage) return { ...defaults };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...defaults };
		const parsed = JSON.parse(raw);
		return { ...defaults, ...parsed };
	} catch {
		return { ...defaults };
	}
}

function save(state) {
	if (typeof window === 'undefined' || !window.localStorage) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (e) {
		console.warn('Failed to save settings:', e);
	}
}

const state = load();
const { subscribe, set, update } = writable(state);

subscribe((current) => {
	save(current);
});

export const settings = {
	subscribe,
	set,
	update,
	get: () => get({ subscribe }),
	reset: () => set({ ...defaults }),
	updateKey(key, value) {
		update((s) => ({ ...s, [key]: value }));
	}
};

export const WALLPAPER_OPTIONS = [
	{ value: 'dot-matrix', label: 'Dot matrix' },
	{ value: 'solid-white', label: 'Solid white' }
];

export const THEME_OPTIONS = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' }
];

export const CLOCK_FORMAT_OPTIONS = [
	{ value: '12hour', label: '12-hour (AM/PM)' },
	{ value: '24hour', label: '24-hour' }
];

export const DATE_FORMAT_OPTIONS = [
	{ value: 'short', label: 'Short (e.g. Wed 3/4)' },
	{ value: 'long', label: 'Long (e.g. Wednesday, March 4, 2025)' }
];

export const FONT_SIZE_OPTIONS = [
	{ value: 'small', label: 'Small' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'large', label: 'Large' }
];

export const CURSOR_OPTIONS = [
	{ value: 'pixel', label: 'Pixel (retro)' },
	{ value: 'default', label: 'System default' }
];
