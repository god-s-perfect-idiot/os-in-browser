import { writable, derived, get } from 'svelte/store';

function createProcessManager() {
	// Use Map instead of Array for efficient PID lookups
	const processes = new Map();
	let nextPid = 1;
	let activePid = null;

	const { subscribe, set, update } = writable(processes);

	// Helper to convert Map to Array for array-like operations
	const asArray = derived({ subscribe }, ($processes) => Array.from($processes.values()));

	function add(title, metadata = {}) {
		update(($processes) => {
			const newProcess = {
				pid: nextPid++,
				title,
				metadata,
				createdAt: new Date()
			};
			$processes.set(newProcess.pid, newProcess);
			return $processes;
		});
		activePid = nextPid - 1;
		return nextPid - 1; // Return the PID that was just used
	}

	function remove(pid) {
		update(($processes) => {
			$processes.delete(pid);
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
			return $processes;
		});
	}

	function clear() {
		update(() => new Map());
		nextPid = 1;
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
