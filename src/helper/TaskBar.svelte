<script>
	import Icon from '@iconify/svelte';
	import Time from './Time.svelte';
	import { pm } from '$lib/pm';
	import { apps } from '$lib/applib';
	import Date from './Date.svelte';

	let showStartMenu = false;

	$: runningApps = $pm.map((p) => ({
		pid: p.pid,
		title: p.title,
		icon: p.metadata.icon,
		color: p.metadata.color,
		appId: p.metadata.appId,
		iconColor: p.metadata.iconColor
	}));

	// Add a simple Windows 95 Start icon SVG
	const startIconSVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#008080"/><rect x="2" y="2" width="12" height="12" fill="#fff"/><rect x="4" y="4" width="8" height="8" fill="#008080"/></svg>`;
</script>

<div class="modern-taskbar">
	<div class="taskbar-section left">
		<button class="start-btn {showStartMenu ? 'active' : ''}" on:click={() => showStartMenu = !showStartMenu}>
			<span class="start-svg" innerHTML={startIconSVG}></span>
			<span class="start-label">Start</span>
		</button>
		<div class="taskbar-divider"></div>
	</div>
	<div class="taskbar-section center">
		<div class="running-apps">
			{#if runningApps.length > 0}
				{#each runningApps as app}
					<button 
						class="app-btn {app.isActive ? 'active' : ''}"
						on:click={() => {
							const isMinimized = $pm.find((p) => p.pid === app.pid).metadata.isMinimized;
							if (isMinimized) {
								pm.updateMetadata(app.pid, { isMinimized: false });
							}
						}}
						on:contextmenu={(e) => {
							e.preventDefault();
							pm.remove(app.pid);
						}}
					>
						<div class="app-icon" style="background-color: #fff; border: 1px solid #808080; margin-right: 4px;">
							<Icon icon={app.icon} style="color: {app.iconColor}; font-size: 1rem;" />
						</div>
						<span class="app-title">{app.title}</span>
					</button>
				{/each}
			{:else}
				<div class="no-apps">
					<Icon icon="mdi:monitor" />
					<span>No running applications</span>
				</div>
			{/if}
		</div>
	</div>
	<div class="taskbar-section right">
		<div class="system-controls">
			<button class="control-btn">
				<Icon icon="mdi:wifi" />
			</button>
			<button class="control-btn">
				<Icon icon="mdi:volume-high" />
			</button>
			<button class="control-btn">
				<Icon icon="mdi:battery" />
			</button>
			<div class="taskbar-divider"></div>
			<div class="clock">
				<Time />
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		font-family: "MS Sans Serif", Tahoma, Geneva, sans-serif;
	}
	.modern-taskbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 38px;
		background: #c0c0c0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 6px;
		z-index: 1000;
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #808080;
		border-bottom: 2px solid #808080;
		box-shadow: 0 -1px 0 #808080;
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
	.taskbar-section.center {
		flex: 1;
		justify-content: flex-start;
	}
	.taskbar-section.right {
		flex: 0 0 auto;
	}
	.start-btn {
		background: linear-gradient(180deg, #0a246a 0%, #3a6ea5 100%);
		color: #fff;
		font-weight: bold;
		font-size: 15px;
		border: 2px outset #fff;
		padding: 2px 18px 2px 10px;
		margin-right: 8px;
		box-shadow: 1px 1px 0 #808080;
		cursor: pointer;
		outline: none;
		border-radius: 0;
		display: flex;
		align-items: center;
		gap: 6px;
		user-select: none;
		transition: none;
	}
	.start-btn:active {
		border: 2px inset #fff;
		background: linear-gradient(180deg, #3a6ea5 0%, #0a246a 100%);
	}
	.start-icon {
		font-size: 1.1rem;
		color: #fff;
	}
	.start-btn .start-label {
		font-family: "MS Sans Serif", Tahoma, Geneva, sans-serif;
		font-size: 15px;
		font-weight: bold;
		letter-spacing: 0.5px;
	}
	/* Start Menu */
	.start-menu {
		position: fixed;
		bottom: 44px;
		left: 8px;
		background: #c0c0c0;
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #808080;
		border-bottom: 2px solid #808080;
		box-shadow: 4px 4px 0 #0008;
		min-width: 220px;
		max-width: 320px;
		max-height: 320px;
		overflow-y: auto;
		z-index: 2000;
		padding: 8px 0 8px 0;
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
		gap: 10px;
		padding: 4px 18px 4px 12px;
		background: none;
		border: none;
		border-radius: 0;
		font-size: 15px;
		color: #000;
		font-family: "MS Sans Serif", Tahoma, Geneva, sans-serif;
		cursor: pointer;
		outline: none;
		transition: none;
	}
	.app-item:hover, .app-item:focus {
		background: #000080;
		color: #fff;
	}
	.app-icon {
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		border: 1px solid #808080;
		box-shadow: 1px 1px 0 #fff;
		margin-right: 2px;
	}
	.app-name {
		font-size: 15px;
		font-family: "MS Sans Serif", Tahoma, Geneva, sans-serif;
	}
	.running-apps {
		display: flex;
		align-items: center;
		gap: 4px;
		max-width: 600px;
		overflow-x: auto;
		padding: 0 8px;
		background: #e8e8e8;
		border-top: 2px inset #fff;
		border-left: 2px inset #fff;
		border-right: 2px inset #808080;
		border-bottom: 2px inset #808080;
		box-shadow: 1px 1px 0 #808080;
		border-radius: 0;
	}
	.app-btn {
		border: 2px outset #fff;
		background: #e0e0e0;
		color: #000;
		font-size: 15px;
		font-family: "MS Sans Serif", Tahoma, Geneva, sans-serif;
		border-radius: 0;
		box-shadow: 1px 1px 0 #808080;
		cursor: pointer;
		transition: none;
		padding: 2px 12px 2px 8px;
		margin-right: 4px;
		min-width: 80px;
		max-width: 180px;
		text-align: left;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.app-btn.active, .app-btn:active {
		border: 2px inset #fff;
		background: #c0c0c0;
	}
	.app-title {
		font-size: 15px;
		font-family: "MS Sans Serif", Tahoma, Geneva, sans-serif;
		color: #000;
		white-space: nowrap;
	}
	.no-apps {
		font-size: 15px;
		color: #666;
		font-family: "MS Sans Serif", Tahoma, Geneva, sans-serif;
		padding: 0 8px;
	}
	.system-controls {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.control-btn {
		width: 28px;
		height: 28px;
		border: 2px outset #fff;
		background: #e0e0e0;
		color: #000;
		font-size: 15px;
		border-radius: 0;
		box-shadow: 1px 1px 0 #808080;
		cursor: pointer;
		transition: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.control-btn:active {
		border: 2px inset #fff;
		background: #c0c0c0;
	}
	.control-btn :global(svg) {
		font-size: 1rem;
		color: #000;
	}
	.datetime {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		padding: 0 8px;
		background: #e0e0e0;
		border: 2px outset #fff;
		border-radius: 0;
		box-shadow: 1px 1px 0 #808080;
	}
	.datetime :global(span) {
		font-size: 13px;
		font-family: "MS Sans Serif", Tahoma, Geneva, sans-serif;
		color: #000;
		line-height: 1;
	}
	.start-svg {
		display: inline-block;
		vertical-align: middle;
		margin-right: 4px;
		width: 16px;
		height: 16px;
	}
	.taskbar-divider {
		width: 2px;
		height: 24px;
		background: #808080;
		margin: 0 8px;
		box-shadow: 1px 0 #fff;
		align-self: center;
	}
	.clock {
		background: #e0e0e0;
		border: 2px inset #fff;
		color: #000;
		font-size: 15px;
		font-family: "MS Sans Serif", Tahoma, Geneva, sans-serif;
		padding: 2px 12px;
		margin-left: 8px;
		min-width: 60px;
		text-align: center;
		box-shadow: 1px 1px 0 #808080;
		border-radius: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>