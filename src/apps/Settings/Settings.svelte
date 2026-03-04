<script>
	import { settings } from '$lib/settings';
	import {
		WALLPAPER_OPTIONS,
		CLOCK_FORMAT_OPTIONS,
		DATE_FORMAT_OPTIONS,
		FONT_SIZE_OPTIONS,
		CURSOR_OPTIONS
	} from '$lib/settings';
	import { apps } from '$lib/applib';
	import CustomSelect from '../../ui-library/CustomSelect.svelte';

	const categories = [
		{ id: 'appearance', title: 'Appearance' },
		{ id: 'taskbar', title: 'Taskbar & Clock' },
		{ id: 'typography', title: 'Typography & UI' },
		{ id: 'sound', title: 'Sound' },
		{ id: 'desktop', title: 'Desktop & Apps' },
		{ id: 'developer', title: 'Developer' },
		{ id: 'accessibility', title: 'Accessibility' },
		{ id: 'about', title: 'About' },
		{ id: 'help', title: 'Help' }
	];

	let activeCategory = 'appearance';

	$: s = $settings;

	// Apps that can be shown/hidden on desktop (has component, !needsParent)
	$: drawerApps = Object.entries(apps).filter(([, app]) => app.component && !app.needsParent);
	$: visibleAppIds = s.visibleAppIds ?? drawerApps.map(([id]) => id);

	function toggleAppVisibility(appId) {
		let next = visibleAppIds.includes(appId)
			? visibleAppIds.filter((id) => id !== appId)
			: [...visibleAppIds, appId];
		if (next.length === 0) next = drawerApps.map(([id]) => id);
		settings.updateKey('visibleAppIds', next);
	}
</script>

<div class="settings-app">
	<header class="settings-header">
		<span class="settings-title">CONTROL PANEL</span>
	</header>

	<div class="settings-body">
		<nav class="settings-nav">
			{#each categories as cat}
				<button
					type="button"
					class="nav-item"
					class:active={activeCategory === cat.id}
					on:click={() => (activeCategory = cat.id)}
				>
					{cat.title}
				</button>
			{/each}
		</nav>

		<main class="settings-content">
			{#if activeCategory === 'appearance'}
				<section class="panel">
					<div class="panel-header">Appearance</div>
					<div class="panel-body">
						<div class="row">
							<span class="label">Wallpaper</span>
							<CustomSelect
								options={WALLPAPER_OPTIONS}
								value={s.wallpaper || 'dot-matrix'}
								onchange={(v) => settings.updateKey('wallpaper', v)}
							/>
						</div>
					</div>
				</section>
			{:else if activeCategory === 'taskbar'}
				<section class="panel">
					<div class="panel-header">Taskbar & Clock</div>
					<div class="panel-body">
						<div class="row">
							<span class="label">Show clock</span>
							<button
								type="button"
								class="checkbox"
								class:checked={s.showClock !== false}
								on:click={() => settings.updateKey('showClock', !s.showClock)}
								aria-pressed={s.showClock !== false}
							>
								{s.showClock !== false ? '[X]' : '[ ]'}
							</button>
						</div>
						<div class="row">
							<span class="label">Clock format</span>
							<CustomSelect
								options={CLOCK_FORMAT_OPTIONS}
								value={s.clockFormat || '12hour'}
								onchange={(v) => settings.updateKey('clockFormat', v)}
							/>
						</div>
						<div class="row">
							<span class="label">Show seconds</span>
							<button
								type="button"
								class="checkbox"
								class:checked={s.clockShowSeconds}
								on:click={() => settings.updateKey('clockShowSeconds', !s.clockShowSeconds)}
								aria-pressed={s.clockShowSeconds}
							>
								{s.clockShowSeconds ? '[X]' : '[ ]'}
							</button>
						</div>
						<div class="row">
							<span class="label">Date format</span>
							<CustomSelect
								options={DATE_FORMAT_OPTIONS}
								value={s.dateFormat || 'short'}
								onchange={(v) => settings.updateKey('dateFormat', v)}
							/>
						</div>
					</div>
				</section>
			{:else if activeCategory === 'typography'}
				<section class="panel">
					<div class="panel-header">Typography & UI</div>
					<div class="panel-body">
						<div class="row">
							<span class="label">Font size</span>
							<CustomSelect
								options={FONT_SIZE_OPTIONS}
								value={s.fontSize || 'medium'}
								onchange={(v) => settings.updateKey('fontSize', v)}
							/>
						</div>
						<div class="row">
							<span class="label">Cursor</span>
							<CustomSelect
								options={CURSOR_OPTIONS}
								value={s.cursorStyle || 'pixel'}
								onchange={(v) => settings.updateKey('cursorStyle', v)}
							/>
						</div>
						<div class="row">
							<span class="label">Window animations</span>
							<button
								type="button"
								class="checkbox"
								class:checked={s.windowAnimation !== false}
								on:click={() => settings.updateKey('windowAnimation', !s.windowAnimation)}
								aria-pressed={s.windowAnimation !== false}
							>
								{s.windowAnimation !== false ? '[X]' : '[ ]'}
							</button>
						</div>
					</div>
				</section>
			{:else if activeCategory === 'sound'}
				<section class="panel">
					<div class="panel-header">Sound</div>
					<div class="panel-body">
						<div class="row">
							<span class="label">Sound enabled</span>
							<button
								type="button"
								class="checkbox"
								class:checked={s.soundEnabled !== false}
								on:click={() => settings.updateKey('soundEnabled', !s.soundEnabled)}
								aria-pressed={s.soundEnabled !== false}
							>
								{s.soundEnabled !== false ? '[X]' : '[ ]'}
							</button>
						</div>
						<div class="row">
							<span class="label">Master volume</span>
							<input
								type="range"
								class="slider"
								min="0"
								max="100"
								value={s.volume ?? 100}
								on:input={(e) => settings.updateKey('volume', parseInt(e.target.value, 10))}
							/>
							<span class="value">{s.volume ?? 100}%</span>
						</div>
					</div>
				</section>
			{:else if activeCategory === 'desktop'}
				<section class="panel">
					<div class="panel-header">Desktop & Apps</div>
					<div class="panel-body">
						<div class="row">
							<span class="label">Show desktop icons</span>
							<button
								type="button"
								class="checkbox"
								class:checked={s.showDesktopIcons !== false}
								on:click={() => settings.updateKey('showDesktopIcons', !s.showDesktopIcons)}
								aria-pressed={s.showDesktopIcons !== false}
							>
								{s.showDesktopIcons !== false ? '[X]' : '[ ]'}
							</button>
						</div>
						<div class="row row-legend">Apps visible in app drawer:</div>
						{#each drawerApps as [appId, app]}
							<div class="row row-check">
								<button
									type="button"
									class="checkbox small"
									class:checked={visibleAppIds.includes(appId)}
									on:click={() => toggleAppVisibility(appId)}
									aria-pressed={visibleAppIds.includes(appId)}
								>
									{visibleAppIds.includes(appId) ? '[X]' : '[ ]'}
								</button>
								<span class="app-name">{app.name}</span>
							</div>
						{/each}
					</div>
				</section>
			{:else if activeCategory === 'developer'}
				<section class="panel">
					<div class="panel-header">Developer</div>
					<div class="panel-body">
						<div class="row">
							<span class="label">Developer mode</span>
							<button
								type="button"
								class="checkbox"
								class:checked={s.developerMode}
								on:click={() => settings.updateKey('developerMode', !s.developerMode)}
								aria-pressed={s.developerMode}
							>
								{s.developerMode ? '[X]' : '[ ]'}
							</button>
						</div>
						<div class="row">
							<span class="label">Show PID in title bar</span>
							<button
								type="button"
								class="checkbox"
								class:checked={s.showPidInTitle}
								on:click={() => settings.updateKey('showPidInTitle', !s.showPidInTitle)}
								aria-pressed={s.showPidInTitle}
							>
								{s.showPidInTitle ? '[X]' : '[ ]'}
							</button>
						</div>
					</div>
				</section>
			{:else if activeCategory === 'accessibility'}
				<section class="panel">
					<div class="panel-header">Accessibility</div>
					<div class="panel-body">
						<div class="row">
							<span class="label">High contrast</span>
							<button
								type="button"
								class="checkbox"
								class:checked={s.highContrast}
								on:click={() => settings.updateKey('highContrast', !s.highContrast)}
								aria-pressed={s.highContrast}
							>
								{s.highContrast ? '[X]' : '[ ]'}
							</button>
						</div>
						<div class="row">
							<span class="label">Large click targets</span>
							<button
								type="button"
								class="checkbox"
								class:checked={s.largeClickTargets}
								on:click={() => settings.updateKey('largeClickTargets', !s.largeClickTargets)}
								aria-pressed={s.largeClickTargets}
							>
								{s.largeClickTargets ? '[X]' : '[ ]'}
							</button>
						</div>
					</div>
				</section>
			{:else if activeCategory === 'about'}
				<section class="panel">
					<div class="panel-header">About</div>
					<div class="panel-body about-body">
						<p class="about-title">OS in Browser</p>
						<p>A retro-style operating system experience running in your browser.</p>
						<p>Built with Svelte. All state is stored locally in your browser.</p>
						<p class="about-version">Version 1.0</p>
						<button type="button" class="btn" on:click={() => settings.reset()}>
							Reset all settings
						</button>
					</div>
				</section>
			{:else if activeCategory === 'help'}
				<section class="panel">
					<div class="panel-header">Help</div>
					<div class="panel-body about-body">
						<p><strong>Control Panel</strong></p>
						<p>
							Use the list on the left to switch between sections. Changes are saved automatically.
						</p>
						<p><strong>Desktop</strong></p>
						<p>
							Right-click the desktop to open the context menu. Click app icons to launch
							applications.
						</p>
						<p><strong>Taskbar</strong></p>
						<p>
							Use the taskbar to switch between running apps, see the clock, and access system
							controls.
						</p>
						<p><strong>Reset</strong></p>
						<p>Go to About and click "Reset all settings" to restore defaults.</p>
					</div>
				</section>
			{/if}
		</main>
	</div>
</div>

<style>
	.settings-app {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 14px;
		background-image:
			radial-gradient(circle, #000 1px, transparent 1px),
			radial-gradient(circle, #000 1px, transparent 1px);
		background-size: 4px 4px;
		background-position:
			0 0,
			2px 2px;
		background-color: #fff;
		border: 2px solid #000;
		box-sizing: border-box;
		overflow: hidden;
	}

	.settings-header {
		padding: 8px 12px;
		background: #000;
		color: #fff;
		border-bottom: 2px solid #000;
		flex-shrink: 0;
	}

	.settings-title {
		font-size: 14px;
		letter-spacing: 0.02em;
	}

	.settings-body {
		display: flex;
		flex: 1;
		min-height: 0;
	}

	.settings-nav {
		display: flex;
		flex-direction: column;
		width: 200px;
		flex-shrink: 0;
		border-right: 2px solid #000;
		background: #fff;
		overflow-y: auto;
	}

	.nav-item {
		width: 100%;
		padding: 10px 12px;
		text-align: left;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 13px;
		border: none;
		border-bottom: 2px solid #000;
		background: #fff;
		cursor: pointer;
	}

	.nav-item:hover {
		background: #e0e0e0;
	}

	.nav-item.active {
		background: #000;
		color: #fff;
	}

	.settings-content {
		flex: 1;
		overflow-y: auto;
		padding: 12px;
		background: #fff;
	}

	.panel {
		border: 2px solid #000;
		background: #fff;
		margin-bottom: 12px;
	}

	.panel-header {
		padding: 8px 12px;
		background: #000;
		color: #fff;
		font-size: 13px;
	}

	.panel-body {
		padding: 12px;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 10px;
		flex-wrap: wrap;
	}

	.row:last-child {
		margin-bottom: 0;
	}

	.row-legend {
		font-weight: bold;
		margin-top: 8px;
		margin-bottom: 4px;
	}

	.row-check {
		margin-bottom: 4px;
	}

	.label {
		min-width: 140px;
		flex-shrink: 0;
	}

	.checkbox {
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 13px;
		padding: 4px 10px;
		border: 2px solid #000;
		background: #fff;
		cursor: pointer;
	}

	.checkbox:hover {
		background: #e8e8e8;
	}

	.checkbox.checked {
		background: #000;
		color: #fff;
	}

	.checkbox.small {
		padding: 2px 6px;
		min-width: 36px;
	}

	.slider {
		width: 120px;
		height: 8px;
		accent-color: #000;
	}

	.value {
		min-width: 3ch;
	}

	.app-name {
		margin-left: 4px;
	}

	.hint {
		font-size: 12px;
		color: #555;
		margin-top: 8px;
		margin-bottom: 0;
	}

	.about-body p {
		margin: 0 0 8px 0;
	}

	.about-title {
		font-size: 16px;
		margin-bottom: 12px !important;
	}

	.about-version {
		margin-top: 12px !important;
	}

	.btn {
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 13px;
		padding: 8px 16px;
		margin-top: 12px;
		border: 2px solid #000;
		background: #fff;
		cursor: pointer;
	}

	.btn:hover {
		background: #e0e0e0;
	}
</style>
