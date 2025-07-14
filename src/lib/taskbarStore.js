import { writable } from 'svelte/store';

export const taskbarState = writable({
	isAutoHideEnabled: false,
	isHidden: false,
	isHovering: false
});

export function toggleAutoHide() {
	taskbarState.update(state => {
		console.log('Toggle auto-hide:', !state.isAutoHideEnabled);
		return {
			...state,
			isAutoHideEnabled: !state.isAutoHideEnabled
		};
	});
}

export function hideTaskbar() {
	taskbarState.update(state => {
		console.log('Hide taskbar');
		return {
			...state,
			isHidden: true
		};
	});
}

export function showTaskbar() {
	taskbarState.update(state => {
		console.log('Show taskbar');
		return {
			...state,
			isHidden: false
		};
	});
}

export function setHovering(isHovering) {
	taskbarState.update(state => {
		console.log('Set hovering:', isHovering);
		return {
			...state,
			isHovering
		};
	});
}

// Auto-hide timer management
let hideTimer = null;

export function startAutoHideTimer() {
	console.log('Starting auto-hide timer');
	// Clear any existing timer
	if (hideTimer) {
		clearTimeout(hideTimer);
	}
	
	// Set new timer for 5 seconds
	hideTimer = setTimeout(() => {
		console.log('Auto-hide timer fired');
		taskbarState.update(state => {
			if (state.isAutoHideEnabled && !state.isHovering) {
				console.log('Hiding taskbar via timer');
				return { ...state, isHidden: true };
			}
			return state;
		});
	}, 5000);
}

export function cancelAutoHideTimer() {
	console.log('Canceling auto-hide timer');
	if (hideTimer) {
		clearTimeout(hideTimer);
		hideTimer = null;
	}
} 