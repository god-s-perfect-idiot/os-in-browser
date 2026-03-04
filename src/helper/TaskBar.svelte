<script>
	import Icon from '@iconify/svelte';
	import Time from './Time.svelte';
	import { pm } from '$lib/pm';
	import { apps } from '$lib/applib';
	import { settings } from '$lib/settings';
	import Date from './Date.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	$: clockFormat = $settings.clockFormat || '12hour';
	$: clockShowSeconds = $settings.clockShowSeconds ?? false;
	$: dateFormat = $settings.dateFormat || 'short';
	$: showClock = $settings.showClock !== false;

	let showStartMenu = false;
	let showRunningAppsMenu = false;
	let showWifiMenu = false;
	let showVolumeMenu = false;
	let showBatteryMenu = false;
	let showApplicationsSubmenu = false;
	let applicationsButtonElement = null;
	let submenuPosition = { top: 0, left: 0 };
	let isDraggingVolume = false;
	let volumeBarElement = null;

	// System state
	let wifiEnabled = browser ? navigator.onLine : true;
	let volumeLevel = 75;
	let isMuted = false;
	let batteryLevel = 100;
	let isCharging = false;
	let audioContext = null;
	let gainNode = null;

	// Subscribe to activePid store
	let activePidStoreValue = pm.getActive();
	pm.activePidStore.subscribe((v) => (activePidStoreValue = v));
	$: activePid = activePidStoreValue;

	// Initialize system status using navigator APIs
	onMount(() => {
		// WiFi status from navigator.onLine
		wifiEnabled = navigator.onLine;
		window.addEventListener('online', () => (wifiEnabled = true));
		window.addEventListener('offline', () => (wifiEnabled = false));

		// Battery API
		if ('getBattery' in navigator) {
			navigator.getBattery().then((battery) => {
				batteryLevel = Math.round(battery.level * 100);
				isCharging = battery.charging;

				battery.addEventListener('chargingchange', () => {
					isCharging = battery.charging;
				});
				battery.addEventListener('levelchange', () => {
					batteryLevel = Math.round(battery.level * 100);
				});
			});
		}

		// Web Audio API for volume control
		try {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
			gainNode = audioContext.createGain();
			gainNode.connect(audioContext.destination);
			gainNode.gain.value = volumeLevel / 100;
		} catch (e) {
			console.warn('Web Audio API not available:', e);
		}

		return () => {
			if (audioContext) {
				audioContext.close();
			}
		};
	});

	// Close menus when clicking outside
	function handleClickOutside(event) {
		if (!event.target.closest('.start-btn') && !event.target.closest('.start-menu')) {
			showStartMenu = false;
			showApplicationsSubmenu = false;
		}
		if (!event.target.closest('.running-apps-container')) {
			showRunningAppsMenu = false;
		}
		if (!event.target.closest('.wifi-container')) {
			showWifiMenu = false;
		}
		if (!event.target.closest('.volume-container')) {
			showVolumeMenu = false;
		}
		if (!event.target.closest('.battery-container')) {
			showBatteryMenu = false;
		}
	}

	function launchApp(app) {
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
		showStartMenu = false;
		showApplicationsSubmenu = false;
	}

	function handleRestart() {
		window.location.reload();
	}

	$: allApps = Object.values(apps).filter((app) => !app.needsParent);

	function toggleWifi() {
		// Note: navigator.onLine is read-only, so we can only reflect the actual state
		// This is a UI toggle that reflects the actual online status
		wifiEnabled = navigator.onLine;
	}

	function setVolume(level) {
		volumeLevel = Math.max(0, Math.min(100, level));
		isMuted = false;

		// Update Web Audio API gain if available
		if (gainNode) {
			gainNode.gain.value = volumeLevel / 100;
		}
	}

	function handleVolumeBarClick(event) {
		event.stopPropagation();
		const rect = event.currentTarget.getBoundingClientRect();
		const clickX = event.clientX - rect.left;
		const percentage = (clickX / rect.width) * 100;
		setVolume(percentage);
	}

	function handleVolumeBarMouseDown(event) {
		isDraggingVolume = true;
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const percentage = (x / rect.width) * 100;
		setVolume(percentage);
		event.preventDefault();
	}

	function handleVolumeBarMouseMove(event) {
		if (isDraggingVolume && volumeBarElement) {
			const rect = volumeBarElement.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
			setVolume(percentage);
		}
	}

	function handleVolumeBarMouseUp() {
		isDraggingVolume = false;
	}

	function handleVolumeBarKeydown(event) {
		if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
			event.preventDefault();
			setVolume(Math.max(0, volumeLevel - 5));
		} else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
			event.preventDefault();
			setVolume(Math.min(100, volumeLevel + 5));
		}
	}

	function toggleMute() {
		isMuted = !isMuted;

		// Update Web Audio API gain if available
		if (gainNode) {
			gainNode.gain.value = isMuted ? 0 : volumeLevel / 100;
		}
	}

	function getVolumeIcon() {
		if (isMuted || volumeLevel === 0) return 'mdi:volume-off';
		if (volumeLevel < 33) return 'mdi:volume-low';
		if (volumeLevel < 66) return 'mdi:volume-medium';
		return 'mdi:volume-high';
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		document.addEventListener('mousemove', handleVolumeBarMouseMove);
		document.addEventListener('mouseup', handleVolumeBarMouseUp);
		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('mousemove', handleVolumeBarMouseMove);
			document.removeEventListener('mouseup', handleVolumeBarMouseUp);
		};
	});

	$: runningApps = $pm.map((p) => ({
		pid: p.pid,
		title: p.title,
		icon: p.metadata.icon,
		color: p.metadata.color,
		appId: p.metadata.appId,
		iconColor: p.metadata.iconColor,
		isActive: p.pid === activePid,
		isMinimized: p.metadata.isMinimized || false
	}));

	// Apple menu icon (simple checkered pattern)
	const startIconSVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="12" height="12" fill="#000"/><rect x="0" y="0" width="6" height="6" fill="#fff"/><rect x="6" y="6" width="6" height="6" fill="#fff"/></svg>`;
</script>

<div class="modern-taskbar">
	<div class="taskbar-section left">
		<div class="start-menu-container">
			<button
				class="start-btn {showStartMenu ? 'active' : ''}"
				on:click={(e) => {
					e.stopPropagation();
					showStartMenu = !showStartMenu;
				}}
			>
				<span class="start-svg" innerHTML={startIconSVG}></span>
				<span class="start-label">Start</span>
			</button>
			{#if showStartMenu}
				<div class="start-menu">
					<button
						class="start-menu-item"
						on:click={() => {
							launchApp(apps.help);
						}}
					>
						<Icon icon="mdi:help" />
						<span>Help</span>
					</button>
					<div class="start-menu-item-container">
						<button
							bind:this={applicationsButtonElement}
							class="start-menu-item {showApplicationsSubmenu ? 'active' : ''}"
							on:click={() => {
								if (applicationsButtonElement) {
									const rect = applicationsButtonElement.getBoundingClientRect();
									submenuPosition = { top: rect.top, left: rect.right };
								}
								showApplicationsSubmenu = !showApplicationsSubmenu;
							}}
							on:mouseenter={() => {
								if (applicationsButtonElement) {
									const rect = applicationsButtonElement.getBoundingClientRect();
									submenuPosition = { top: rect.top, left: rect.right };
								}
								showApplicationsSubmenu = true;
							}}
						>
							<Icon icon="mdi:apps" />
							<span>Applications</span>
							<Icon icon="mdi:chevron-right" class="submenu-arrow" />
						</button>
					</div>
					{#if showApplicationsSubmenu}
						<div
							class="start-submenu"
							style="top: {submenuPosition.top}px; left: {submenuPosition.left}px;"
						>
							{#each allApps as app}
								<button class="start-menu-item submenu-item" on:click={() => launchApp(app)}>
									<div class="app-icon-small">
										{#if app.icon?.startsWith('/')}
											<img src={app.icon} alt={app.name} class="app-icon-image-small" />
										{:else}
											<Icon icon={app.icon} class="app-icon-iconify-small" />
										{/if}
									</div>
									<span>{app.name}</span>
								</button>
							{/each}
						</div>
					{/if}
					<button class="start-menu-item" on:click={handleRestart}>
						<Icon icon="mdi:restart" />
						<span>Restart</span>
					</button>
				</div>
			{/if}
		</div>
		<div class="taskbar-divider"></div>
	</div>
	<div class="taskbar-section center">
		<div class="running-apps-container">
			<button
				class="running-apps-btn {showRunningAppsMenu ? 'active' : ''}"
				on:click={() => (showRunningAppsMenu = !showRunningAppsMenu)}
			>
				<Icon icon="mdi:view-list" />
				<span>Running Apps</span>
				{#if runningApps.length > 0}
					<span class="app-count">({runningApps.length})</span>
				{/if}
			</button>
			{#if showRunningAppsMenu}
				<div class="running-apps-menu">
					{#if runningApps.length > 0}
						{#each runningApps as app}
							<button
								class="running-app-item"
								on:click={() => {
									const process = $pm.find((p) => p.pid === app.pid);
									if (process) {
										const isMinimized = process.metadata.isMinimized;
										if (isMinimized) {
											pm.updateMetadata(app.pid, { isMinimized: false });
										}
										pm.setActive(app.pid);
									}
									showRunningAppsMenu = false;
								}}
								on:contextmenu={(e) => {
									e.preventDefault();
									pm.remove(app.pid);
									if (runningApps.length === 1) {
										showRunningAppsMenu = false;
									}
								}}
							>
								<div class="app-icon" style="background-color: #ffffff; border: 2px solid #000;">
									{#if app.icon?.startsWith('/')}
										<img src={app.icon} alt={app.title} class="app-icon-image" />
									{:else}
										<Icon icon={app.icon} class="app-icon-iconify" />
									{/if}
								</div>
								<span class="app-name">{app.title}</span>
								{#if app.isMinimized}
									<span class="minimized-dot"></span>
								{/if}
							</button>
						{/each}
					{:else}
						<div class="no-apps">
							<Icon icon="mdi:monitor" />
							<span>No running applications</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
	<div class="taskbar-section right">
		<div class="system-controls">
			<div class="wifi-container">
				<button class="control-btn" on:click={() => (showWifiMenu = !showWifiMenu)}>
					<Icon icon={wifiEnabled ? 'mdi:wifi' : 'mdi:wifi-off'} />
				</button>
				{#if showWifiMenu}
					<div class="control-menu">
						<div class="control-menu-header">
							<span>Wi-Fi</span>
							<button
								class="toggle-switch {wifiEnabled ? 'on' : ''}"
								on:click={toggleWifi}
								aria-label={wifiEnabled ? 'Disable Wi-Fi' : 'Enable Wi-Fi'}
							>
								<span class="toggle-slider"></span>
							</button>
						</div>
						{#if wifiEnabled}
							<div class="control-menu-item">
								<Icon icon="mdi:wifi" />
								<span>Connected Network</span>
							</div>
							<div class="control-menu-item">
								<Icon icon="mdi:wifi" />
								<span>Available Network 1</span>
							</div>
							<div class="control-menu-item">
								<Icon icon="mdi:wifi" />
								<span>Available Network 2</span>
							</div>
						{/if}
					</div>
				{/if}
			</div>
			<div class="volume-container">
				<button
					class="control-btn"
					on:click={(e) => {
						e.stopPropagation();
						showVolumeMenu = !showVolumeMenu;
					}}
				>
					<Icon icon={getVolumeIcon()} />
				</button>
				{#if showVolumeMenu}
					<div class="volume-bar-menu">
						<div
							bind:this={volumeBarElement}
							class="volume-bar"
							on:click={handleVolumeBarClick}
							on:mousedown={handleVolumeBarMouseDown}
							on:keydown={handleVolumeBarKeydown}
							role="slider"
							tabindex="0"
							aria-valuemin="0"
							aria-valuemax="100"
							aria-valuenow={volumeLevel}
							aria-label="Volume"
						>
							<div class="volume-bar-track">
								<div class="volume-bar-fill" style="width: {volumeLevel}%"></div>
							</div>
						</div>
					</div>
				{/if}
			</div>
			<div class="battery-container">
				<button
					class="battery-btn"
					on:click={() => (showBatteryMenu = !showBatteryMenu)}
					title="Battery: {batteryLevel}%"
					aria-label="Battery: {batteryLevel}%"
				>
					<div class="battery-bar-inline">
						<div class="battery-outline">
							<div
								class="battery-fill-inline {isCharging ? 'charging' : ''}"
								style="width: {batteryLevel}%"
							></div>
						</div>
						<div class="battery-terminal"></div>
					</div>
				</button>
				{#if showBatteryMenu}
					<div class="control-menu">
						<div class="control-menu-header">
							<span>Battery</span>
						</div>
						<div class="battery-info">
							<div class="battery-level-display">
								<div class="battery-bar">
									<div class="battery-fill" style="width: {batteryLevel}%"></div>
								</div>
								<span class="battery-percentage">{batteryLevel}%</span>
							</div>
							<div class="battery-status">
								{#if isCharging}
									<Icon icon="mdi:battery-charging" />
									<span>Charging</span>
								{:else}
									<Icon icon="mdi:battery" />
									<span>Not charging</span>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			</div>
			<div class="taskbar-divider"></div>
			{#if showClock}
				<div class="clock">
					<Date format={dateFormat} />
					<span class="clock-separator">|</span>
					<Time format={clockFormat} showSeconds={clockShowSeconds} />
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Courier New', Courier, monospace;
	}
	.modern-taskbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 24px;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 8px;
		z-index: 1000;
		border-bottom: 2px solid #808080;
		font-size: 14px;
	}
	.taskbar-section {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.taskbar-section.left {
		flex: 0 0 auto;
		position: relative;
	}
	.start-menu-container {
		position: relative;
	}
	.taskbar-section.center {
		flex: 1;
		justify-content: flex-start;
		position: relative;
	}
	.taskbar-section.right {
		flex: 0 0 auto;
	}
	.start-btn {
		background: transparent;
		color: #000;
		font-weight: bold;
		font-size: 14px;
		border: none;
		padding: 2px 8px;
		margin-right: 4px;
		cursor: pointer;
		outline: none;
		border-radius: 0;
		display: flex;
		align-items: center;
		gap: 4px;
		user-select: none;
		transition: none;
	}
	.start-btn:hover,
	.start-btn.active {
		background: #000;
		color: #fff;
	}
	.start-btn:hover .start-svg,
	.start-btn.active .start-svg {
		filter: invert(1);
	}
	.start-icon {
		font-size: 1.1rem;
		color: #fff;
	}
	.start-btn .start-label {
		font-family: 'Courier New', Courier, monospace;
		font-size: 14px;
		font-weight: bold;
	}
	/* Start Menu */
	.start-menu {
		position: absolute;
		top: 24px;
		left: 0;
		background: #fff;
		border: 2px solid #000;
		border-radius: 0;
		min-width: 200px;
		max-width: 300px;
		max-height: 400px;
		overflow-y: auto;
		z-index: 2000;
		padding: 0;
		box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
	}
	.start-menu-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		background: transparent;
		border: none;
		border-radius: 0;
		font-size: 14px;
		font-weight: bold;
		color: #000;
		font-family: 'Courier New', Courier, monospace;
		cursor: pointer;
		outline: none;
		transition: none;
		width: 100%;
		text-align: left;
		position: relative;
	}
	.start-menu-item:hover,
	.start-menu-item.active {
		background: #000;
		color: #fff;
	}
	.start-menu-item:hover :global(svg),
	.start-menu-item.active :global(svg) {
		color: #fff;
	}
	.start-menu-item:hover .app-icon-small,
	.start-menu-item.active .app-icon-small {
		background-color: #000 !important;
		border-color: #fff;
	}
	.start-menu-item:hover .app-icon-small :global(svg),
	.start-menu-item.active .app-icon-small :global(svg) {
		filter: invert(1);
		color: #fff;
	}
	.start-menu-item:hover .app-icon-iconify-small,
	.start-menu-item.active .app-icon-iconify-small {
		color: #fff;
	}
	.start-menu-item:hover .app-icon-image-small,
	.start-menu-item.active .app-icon-image-small {
		filter: invert(1);
	}
	.start-menu-item-container {
		position: relative;
	}
	.submenu-arrow {
		margin-left: auto;
	}
	.start-submenu {
		position: fixed;
		background: #fff;
		border: 2px solid #000;
		border-radius: 0;
		min-width: 200px;
		max-width: 300px;
		max-height: 400px;
		overflow-y: auto;
		z-index: 2001;
		padding: 0;
		box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
	}
	.submenu-item {
		padding-left: 8px;
	}
	.app-icon-small {
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
		border: 2px solid #000;
	}
	.app-icon-image-small {
		width: 0.875rem;
		height: 0.875rem;
		object-fit: contain;
		flex-shrink: 0;
	}
	.app-icon-iconify-small {
		color: #000;
		font-size: 0.875rem;
	}
	.apps-grid {
		display: flex;
		flex-direction: column;
		gap: 0;
		padding: 0;
	}
	.app-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 12px;
		background: none;
		border: none;
		border-radius: 0;
		font-size: 14px;
		font-weight: bold;
		color: #000;
		font-family: 'Courier New', Courier, monospace;
		cursor: pointer;
		outline: none;
		transition: none;
	}
	.app-item:hover,
	.app-item:focus {
		background: #000;
		color: #fff;
	}
	.app-item:hover .app-icon,
	.app-item:focus .app-icon {
		background-color: #000;
		border: 2px solid #fff;
	}
	.app-item:hover .app-icon :global(svg),
	.app-item:focus .app-icon :global(svg) {
		filter: invert(1);
	}
	.app-item:hover .app-icon-image,
	.app-item:focus .app-icon-image {
		filter: invert(1);
	}
	.app-icon {
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.app-icon-image {
		width: 1rem;
		height: 1rem;
		object-fit: contain;
	}
	.app-icon-iconify {
		color: #000;
		font-size: 1rem;
	}
	.app-name {
		font-size: 16px;
		font-family: 'Courier New', Courier, monospace;
		background: transparent;
		padding: 2px 4px;
	}
	.running-apps-container {
		position: relative;
	}
	.running-apps-btn {
		border: none;
		background: transparent;
		color: #000;
		font-size: 14px;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		border-radius: 0;
		cursor: pointer;
		transition: none;
		padding: 2px 8px;
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.running-apps-btn:hover,
	.running-apps-btn.active {
		background: #000;
		color: #fff;
	}
	.running-apps-btn:hover :global(svg),
	.running-apps-btn.active :global(svg) {
		color: #fff;
	}
	.app-count {
		font-size: 12px;
		opacity: 0.8;
	}
	.running-apps-menu {
		position: absolute;
		top: 24px;
		left: 0;
		background: #fff;
		border: 2px solid #000;
		border-radius: 0;
		min-width: 200px;
		max-width: 300px;
		max-height: 400px;
		overflow-y: auto;
		z-index: 2000;
		padding: 4px 0;
		box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
	}
	.running-app-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		background: none;
		border: none;
		border-radius: 0;
		font-size: 14px;
		font-weight: bold;
		color: #000;
		font-family: 'Courier New', Courier, monospace;
		cursor: pointer;
		outline: none;
		transition: none;
		width: 100%;
		text-align: left;
		position: relative;
	}
	.running-app-item:hover,
	.running-app-item:focus {
		background: #000;
		color: #fff;
	}
	.running-app-item:hover .app-name,
	.running-app-item:focus .app-name {
		background: transparent;
		color: #fff;
	}
	.running-app-item:hover .app-icon,
	.running-app-item:focus .app-icon {
		background-color: #000;
		border: 2px solid #fff;
	}
	.running-app-item:hover .app-icon :global(svg),
	.running-app-item:focus .app-icon :global(svg) {
		filter: invert(1);
	}
	.running-app-item:hover .app-icon-image,
	.running-app-item:focus .app-icon-image {
		filter: invert(1);
	}
	.running-app-item:hover .minimized-dot,
	.running-app-item:focus .minimized-dot {
		background: #fff;
	}
	.minimized-dot {
		width: 4px;
		height: 4px;
		background: #000;
		margin-left: auto;
		flex-shrink: 0;
	}
	.no-apps {
		font-size: 14px;
		color: #808080;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		padding: 0 8px;
	}
	.system-controls {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.control-btn {
		width: 20px;
		height: 20px;
		border: none;
		background: transparent;
		color: #000;
		font-size: 14px;
		border-radius: 0;
		cursor: pointer;
		transition: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.control-btn:hover {
		background: #000;
	}
	.control-btn:hover :global(svg) {
		color: #fff;
	}
	.control-btn :global(svg) {
		font-size: 1rem;
		color: #000;
	}
	.wifi-container,
	.volume-container,
	.battery-container {
		position: relative;
	}
	.control-menu {
		position: absolute;
		bottom: 24px;
		right: 0;
		background: #fff;
		border: 2px solid #000;
		border-radius: 0;
		min-width: 200px;
		max-width: 250px;
		z-index: 2000;
		padding: 8px;
		box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
	}
	.control-menu-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 4px 0;
		margin-bottom: 8px;
		border-bottom: 2px solid #000;
		font-weight: bold;
		font-size: 14px;
	}
	.toggle-switch {
		width: 40px;
		height: 20px;
		background: #fff;
		border: 2px solid #000;
		border-radius: 0;
		position: relative;
		cursor: pointer;
		padding: 0;
	}
	.toggle-switch.on {
		background: #000;
	}
	.toggle-slider {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 12px;
		height: 12px;
		background: #000;
		transition: transform 0.2s;
	}
	.toggle-switch.on .toggle-slider {
		background: #fff;
		transform: translateX(20px);
	}
	.mute-btn {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 2px;
		display: flex;
		align-items: center;
	}
	.mute-btn:hover {
		background: #000;
	}
	.mute-btn:hover :global(svg) {
		color: #fff;
	}
	.volume-bar-menu {
		position: absolute;
		top: 24px;
		right: 0;
		background: #fff;
		border: 2px solid #000;
		border-radius: 0;
		padding: 8px;
		z-index: 1500;
		box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
		min-width: 120px;
	}
	.volume-bar {
		cursor: pointer;
		user-select: none;
	}
	.volume-bar-track {
		width: 100px;
		height: 20px;
		background: #fff;
		border: 2px solid #000;
		position: relative;
		overflow: hidden;
	}
	.volume-bar-fill {
		height: 100%;
		background: #000;
		transition: width 0.1s;
	}
	.volume-bar:hover .volume-bar-track {
		border-color: #000;
	}
	.volume-bar:hover .volume-bar-fill {
		background: #000;
	}
	.control-menu-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 8px;
		cursor: pointer;
		font-size: 13px;
	}
	.control-menu-item:hover {
		background: #000;
		color: #fff;
	}
	.control-menu-item:hover :global(svg) {
		color: #fff;
	}
	.battery-info {
		padding: 8px 0;
	}
	.battery-level-display {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}
	.battery-bar {
		flex: 1;
		height: 16px;
		background: #fff;
		border: 2px solid #000;
		position: relative;
		overflow: hidden;
	}
	.battery-fill {
		height: 100%;
		background: #000;
		transition: width 0.3s;
	}
	.battery-percentage {
		font-size: 12px;
		font-weight: bold;
		min-width: 40px;
		text-align: right;
	}
	.battery-status {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		padding: 4px 0;
	}
	.battery-btn {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 2px 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 20px;
	}
	.battery-btn:hover {
		background: #000;
	}
	.battery-bar-inline {
		display: flex;
		align-items: center;
		gap: 2px;
	}
	.battery-outline {
		width: 24px;
		height: 12px;
		border: 2px solid #000;
		background: #fff;
		position: relative;
		overflow: hidden;
	}
	.battery-fill-inline {
		height: 100%;
		background: #000;
		transition: width 0.3s;
	}
	.battery-fill-inline.charging {
		background: repeating-linear-gradient(45deg, #000, #000 2px, #fff 2px, #fff 4px);
	}
	.battery-terminal {
		width: 2px;
		height: 6px;
		background: #000;
		margin-left: 1px;
	}
	.battery-btn:hover .battery-outline {
		border-color: #fff;
	}
	.battery-btn:hover .battery-fill-inline {
		background: #fff;
	}
	.battery-btn:hover .battery-terminal {
		background: #fff;
	}
	.datetime {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 0;
	}
	.datetime :global(span) {
		font-size: 13px;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		color: #000;
		line-height: 1.2;
	}
	.start-svg {
		display: inline-block;
		vertical-align: middle;
		margin-right: 4px;
		width: 16px;
		height: 16px;
	}
	.taskbar-divider {
		width: 1px;
		height: 16px;
		background-image:
			radial-gradient(circle, #000 1px, transparent 1px),
			radial-gradient(circle, #000 1px, transparent 1px);
		background-size: 4px 4px;
		background-position:
			0 0,
			2px 2px;
		background-color: #fff;
		margin: 0 4px;
		align-self: center;
	}
	.clock {
		background: transparent;
		border: none;
		color: #000;
		font-size: 13px;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		padding: 0 8px;
		margin-left: 4px;
		min-width: 50px;
		text-align: center;
		border-radius: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}
	.clock-separator {
		color: #000;
		font-size: 13px;
	}
</style>
