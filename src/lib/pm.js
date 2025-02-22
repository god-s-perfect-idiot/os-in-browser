import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

function createProcessManager() {
	// Initial state - try to load from localStorage first
	let initialProcesses = new Map();
	let nextPid = 1;
	let activePid = null;

	// Only attempt to access localStorage in the browser environment
	if (browser) {
		try {
			const savedState = localStorage.getItem('processManagerState');
			if (savedState) {
				const parsed = JSON.parse(savedState);
				
				// Restore processes
				initialProcesses = new Map(
					parsed.processes.map(process => {
						// Convert createdAt back to Date object
						return [process.pid, {
							...process,
							createdAt: new Date(process.createdAt)
						}];
					})
				);
				
				// Restore nextPid and activePid
				nextPid = parsed.nextPid;
				activePid = parsed.activePid;
			}
		} catch (error) {
			console.error('Error loading process manager state:', error);
		}
	}

	const { subscribe, set, update } = writable(initialProcesses);

	// Helper to convert Map to Array for array-like operations
	const asArray = derived({ subscribe }, ($processes) => Array.from($processes.values()));

	// Function to save the current state to localStorage
	function saveToLocalStorage($processes) {
		if (browser) {
			try {
				const state = {
					processes: Array.from($processes.values()),
					nextPid,
					activePid
				};
				localStorage.setItem('processManagerState', JSON.stringify(state));
			} catch (error) {
				console.error('Error saving process manager state:', error);
			}
		}
	}

	function add(title, metadata = {}) {
		let pid;
		update(($processes) => {
			const newProcess = {
				pid: nextPid++,
				title,
				metadata,
				createdAt: new Date()
			};
			pid = newProcess.pid;
			$processes.set(pid, newProcess);
			saveToLocalStorage($processes);
			return $processes;
		});
		activePid = pid;
		return pid;
	}

	function remove(pid) {
		update(($processes) => {
			$processes.delete(pid);
			saveToLocalStorage($processes);
			return $processes;
		});
	}

	function getByPid(pid) {
		return get({ subscribe }).get(pid);
	}

	function getAll() {
		return get({ subscribe });
	}

	function getAllAsArray() {
		return get(asArray);
	}

	function getActive() {
		return activePid;
	}

	function setActive(pid) {
		activePid = pid;
		// Save current state with updated activePid
		saveToLocalStorage(get({ subscribe }));
	}

	function updateMetadata(pid, metadata) {
		update(($processes) => {
			const process = $processes.get(pid);
			if (process) {
				$processes.set(pid, {
					...process,
					metadata: { ...process.metadata, ...metadata }
				});
			}
			saveToLocalStorage($processes);
			return $processes;
		});
	}

	function updateTitle(pid, newTitle) {
		update(($processes) => {
			const process = $processes.get(pid);
			if (process) {
				$processes.set(pid, {
					...process,
					title: newTitle
				});
			}
			saveToLocalStorage($processes);
			return $processes;
		});
	}

	function clear() {
		update(() => {
			const emptyMap = new Map();
			nextPid = 1;
			activePid = null;
			saveToLocalStorage(emptyMap);
			return emptyMap;
		});
	}

	// Get processes sorted by creation time
	const sorted = derived({ subscribe }, ($processes) =>
		Array.from($processes.values()).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
	);

	return {
		subscribe: asArray.subscribe, // Subscribe to array version by default
		add,
		remove,
		getByPid,
		getAll,
		getAllAsArray,
		updateMetadata,
		updateTitle,
		clear,
		sorted,
		getActive,
		setActive
	};
}

// Create and export the store
export const pm = createProcessManager();