<script>
	import { fileSystem } from '$lib/fs';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import ContextMenu from '../helper/ContextMenu.svelte';

	// Reactive stores
	$: currentPath = $fileSystem.currentPathStore;
	$: pathParts = currentPath ? currentPath.split('/').filter(Boolean) : [];

	$: files = fileSystem.ls();

	// UI state
	let selectedFile = null;
	let deletePopup = false;
	let newFilePopup = false;
	let newFolderPopup = false;
	let renamePopup = false;
	let fileToDelete = null;
	let fileToRename = null;
	let newFileName = '';
	let newFolderName = '';
	let renameName = '';

	// Context menu state
	let contextMenu = {
		show: false,
		left: 0,
		top: 0,
		items: []
	};

	// Context menu items for different contexts
	const backgroundMenuItems = [
		{
			icon: 'mdi:folder-plus',
			label: 'New Folder',
			shortcut: 'Ctrl+Shift+N',
			action: () => {
				newFolderPopup = true;
				contextMenu.show = false;
			}
		},
		{
			icon: 'mdi:file-plus',
			label: 'New File',
			shortcut: 'Ctrl+N',
			action: () => {
				newFilePopup = true;
				contextMenu.show = false;
			}
		},
		{ type: 'separator' },
		{
			icon: 'mdi:content-paste',
			label: 'Paste',
			shortcut: 'Ctrl+V',
			action: () => {
				// Implement paste functionality
				console.log('Paste file');
				contextMenu.show = false;
			}
		},
		{ type: 'separator' },
		{
			icon: 'mdi:close',
			label: 'Close App',
			shortcut: 'Ctrl+W',
			action: () => {
				// Close the app window
				window.dispatchEvent(new CustomEvent('closeApp'));
				contextMenu.show = false;
			}
		}
	];

	const fileMenuItems = (file) => [
		{
			icon: 'mdi:content-cut',
			label: 'Cut',
			shortcut: 'Ctrl+X',
			action: () => {
				console.log('Cut file:', file.name);
				contextMenu.show = false;
			}
		},
		{
			icon: 'mdi:content-copy',
			label: 'Copy',
			shortcut: 'Ctrl+C',
			action: () => {
				console.log('Copy file:', file.name);
				contextMenu.show = false;
			}
		},
		{ type: 'separator' },
		{
			icon: 'mdi:pencil',
			label: 'Rename',
			shortcut: 'F2',
			action: () => {
				fileToRename = file;
				renameName = file.name;
				renamePopup = true;
				contextMenu.show = false;
			}
		},
		{
			icon: 'mdi:delete',
			label: 'Delete',
			shortcut: 'Del',
			action: () => {
				fileToDelete = file;
				deletePopup = true;
				contextMenu.show = false;
			}
		}
	];

	// Handle right-click events
	function handleRightClick(e, context = 'background', file = null) {
		e.preventDefault();
		e.stopPropagation();

		// Use clientX/clientY for viewport-relative positioning
		contextMenu.left = e.clientX;
		contextMenu.top = e.clientY;

		if (context === 'file' && file) {
			contextMenu.items = fileMenuItems(file);
		} else {
			contextMenu.items = backgroundMenuItems;
		}

		contextMenu.show = true;
	}

	// Close context menu when clicking outside
	function handleClickOutside() {
		contextMenu.show = false;
	}

	// Navigation functions
	function navigateToPath(path) {
		fileSystem.cd(path);
		selectedFile = null;
	}

	function goBack() {
		// Get the current path from the file system directly
		const currentPathValue = get(fileSystem.currentPath);

		if (currentPathValue === '/') {
			return; // Already at root
		}

		// Split the path and remove the last component
		const parts = currentPathValue.split('/').filter(Boolean);
		if (parts.length === 0) {
			return; // Already at root
		}

		// Remove the last part and construct the parent path
		parts.pop();
		const parentPath = parts.length === 0 ? '/' : '/' + parts.join('/');

		navigateToPath(parentPath);
	}

	function goHome() {
		navigateToPath('/');
	}

	// File operations
	function createFile() {
		if (newFileName.trim()) {
			fileSystem.touch(newFileName.trim());
			newFileName = '';
			newFilePopup = false;
		}
	}

	function createFolder() {
		if (newFolderName.trim()) {
			fileSystem.mkdir(newFolderName.trim());
			newFolderName = '';
			newFolderPopup = false;
		}
	}

	function deleteFile() {
		if (fileToDelete) {
			fileSystem.rm(fileToDelete.path);
			fileToDelete = null;
			deletePopup = false;
		}
	}

	function renameFile() {
		if (fileToRename && renameName.trim()) {
			const parentPath = fileToRename.path.substring(0, fileToRename.path.lastIndexOf('/'));
			const newPath = parentPath + '/' + renameName.trim();
			fileSystem.mv(fileToRename.path, newPath);
			fileToRename = null;
			renameName = '';
			renamePopup = false;
		}
	}

	function openFile(file) {
		if (file.type === 'directory') {
			navigateToPath(file.path);
		} else {
			selectedFile = file;
		}
	}

	function formatDate(timestamp) {
		return new Date(timestamp).toLocaleDateString();
	}

	function formatFileSize(content) {
		if (!content) return '0 B';
		const bytes = new Blob([content]).size;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
	}

	// Initialize with some sample files if empty
	onMount(() => {
		// Create sample files if the file system is empty
		setTimeout(() => {
			try {
				const currentFiles = get(files);
				if (!currentFiles || currentFiles.length === 0) {
					fileSystem.touch(
						'README.md',
						'# Welcome to OS in Browser\n\nThis is a virtual file system running in your browser.\n\n## Features\n- Create and edit files\n- Organize files in folders\n- Persistent storage using localStorage\n\n## Getting Started\n1. Create new files and folders using the toolbar buttons\n2. Click on files to edit them\n3. Double-click folders to navigate into them\n4. Use the breadcrumb navigation to move between directories'
					);
					fileSystem.mkdir('Documents');
					fileSystem.mkdir('Pictures');
					fileSystem.touch(
						'Documents/notes.txt',
						'Your personal notes go here...\n\n- Meeting notes\n- Ideas\n- Todo list\n\nThis is a simple text editor for your notes.'
					);
					fileSystem.touch(
						'Documents/todo.md',
						'# Todo List\n\n## Today\n- [ ] Review project requirements\n- [ ] Set up development environment\n- [ ] Create initial documentation\n\n## This Week\n- [ ] Implement core features\n- [ ] Write tests\n- [ ] Deploy to staging\n\n## Later\n- [ ] Performance optimization\n- [ ] User feedback integration\n- [ ] Final polish'
					);
				}
			} catch (error) {
				console.warn('Error initializing file system:', error);
			}
		}, 100);
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions a11y_no_noninteractive_tabindex -->
<div
	class="files-app"
	role="application"
	aria-label="File Explorer"
	tabindex="0"
	on:contextmenu={(e) => handleRightClick(e, 'background')}
	on:click={handleClickOutside}
	on:keydown={(e) => e.key === 'Escape' && handleClickOutside()}
>
	<header class="files-header">
		<div class="files-nav">
			<h1 class="files-title">FILE EXPLORER</h1>
			<button type="button" class="files-nav-btn" on:click={goHome} title="Home">^</button>
			<button
				type="button"
				class="files-nav-btn"
				on:click={goBack}
				disabled={currentPath === '/'}
				title="Go Back">&lt;</button
			>
		</div>

		<div class="files-breadcrumb">
			<button type="button" on:click={() => navigateToPath('/')}>/</button>
			{#if pathParts && pathParts.length > 0}
				{#each pathParts as part, index}
					<span class="sep">/</span>
					<button
						type="button"
						on:click={() => {
							const targetPath = '/' + pathParts.slice(0, index + 1).join('/');
							navigateToPath(targetPath);
						}}
					>
						{part}
					</button>
				{/each}
			{/if}
		</div>

		<div class="files-toolbar">
			<button type="button" class="files-btn" on:click={() => (newFilePopup = true)}>+ FILE</button>
			<button type="button" class="files-btn" on:click={() => (newFolderPopup = true)}
				>+ FOLDER</button
			>
		</div>
	</header>

	<div class="files-main">
		<div class="files-list-panel">
			<div class="files-list-header">
				<span>NAME</span>
				<span>TYPE</span>
				<span>SIZE</span>
				<span>MODIFIED</span>
			</div>
			<div
				class="files-list-body"
				role="list"
				aria-label="File list"
				on:contextmenu={(e) => handleRightClick(e, 'background')}
			>
				{#if $files}
					{#each $files as file}
						<button
							type="button"
							class="files-row {selectedFile?.path === file.path ? 'selected' : ''}"
							on:click={() => openFile(file)}
							on:dblclick={() => openFile(file)}
							on:keydown={(e) =>
								(e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openFile(file))}
							on:contextmenu={(e) => handleRightClick(e, 'file', file)}
						>
							<span class="name">
								<span class="type-dir">[{file.type === 'directory' ? 'DIR' : 'FILE'}]</span>
								{file.name}
							</span>
							<span>{file.type === 'directory' ? 'Folder' : 'File'}</span>
							<span>{file.type === 'directory' ? '-' : formatFileSize(file.content || '')}</span>
							<span>{formatDate(file.modified)}</span>
						</button>
					{/each}
				{:else}
					<div class="files-empty">No files in this directory</div>
				{/if}
			</div>
		</div>

		{#if selectedFile}
			<div class="files-preview-panel">
				<div class="files-preview-header">
					<span>[FILE] {selectedFile.name}</span>
					<div class="files-preview-actions">
						<button
							type="button"
							on:click={() => {
								fileToRename = selectedFile;
								renameName = selectedFile.name;
								renamePopup = true;
							}}
							title="Rename">RENAME</button
						>
						<button
							type="button"
							on:click={() => {
								fileToDelete = selectedFile;
								deletePopup = true;
							}}
							title="Delete">DEL</button
						>
					</div>
				</div>
				<div class="files-preview-body">
					{#if selectedFile.type === 'file'}
						<textarea
							value={selectedFile.content || ''}
							on:input={(e) => fileSystem.writeFile(selectedFile.path, e.target.value)}
							placeholder="File content..."
						></textarea>
					{:else}
						<div class="files-preview-placeholder">[DIR] Double-click to open.</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if deletePopup}
	<div class="files-modal-backdrop">
		<div class="files-modal">
			<h3>DELETE FILE</h3>
			<p style="margin: 0 0 16px 0; font-size: 13px;">
				Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
			</p>
			<div class="files-modal-actions">
				<button
					type="button"
					class="files-btn"
					on:click={() => {
						deletePopup = false;
						fileToDelete = null;
					}}
				>
					CANCEL
				</button>
				<button type="button" class="files-btn" on:click={deleteFile}> DELETE </button>
			</div>
		</div>
	</div>
{/if}

<!-- New File Modal -->
{#if newFilePopup}
	<div class="files-modal-backdrop">
		<div class="files-modal">
			<h3>CREATE NEW FILE</h3>
			<label for="new-file-input">File Name</label>
			<input
				id="new-file-input"
				type="text"
				bind:value={newFileName}
				placeholder="Enter file name..."
				on:keydown={(e) => e.key === 'Enter' && createFile()}
			/>
			<div class="files-modal-actions">
				<button
					type="button"
					class="files-btn"
					on:click={() => {
						newFilePopup = false;
						newFileName = '';
					}}
				>
					CANCEL
				</button>
				<button type="button" class="files-btn" on:click={createFile}> CREATE </button>
			</div>
		</div>
	</div>
{/if}

<!-- New Folder Modal -->
{#if newFolderPopup}
	<div class="files-modal-backdrop">
		<div class="files-modal">
			<h3>CREATE NEW FOLDER</h3>
			<label for="new-folder-input">Folder Name</label>
			<input
				id="new-folder-input"
				type="text"
				bind:value={newFolderName}
				placeholder="Enter folder name..."
				on:keydown={(e) => e.key === 'Enter' && createFolder()}
			/>
			<div class="files-modal-actions">
				<button
					type="button"
					class="files-btn"
					on:click={() => {
						newFolderPopup = false;
						newFolderName = '';
					}}
				>
					CANCEL
				</button>
				<button type="button" class="files-btn" on:click={createFolder}> CREATE </button>
			</div>
		</div>
	</div>
{/if}

<!-- Rename Modal -->
{#if renamePopup}
	<div class="files-modal-backdrop">
		<div class="files-modal">
			<h3>RENAME FILE</h3>
			<label for="rename-input">New Name</label>
			<input
				id="rename-input"
				type="text"
				bind:value={renameName}
				placeholder="Enter new name..."
				on:keydown={(e) => e.key === 'Enter' && renameFile()}
			/>
			<div class="files-modal-actions">
				<button
					type="button"
					class="files-btn"
					on:click={() => {
						renamePopup = false;
						fileToRename = null;
						renameName = '';
					}}
				>
					CANCEL
				</button>
				<button type="button" class="files-btn" on:click={renameFile}> RENAME </button>
			</div>
		</div>
	</div>
{/if}

<!-- Context Menu -->
<ContextMenu
	left={contextMenu.left}
	top={contextMenu.top}
	show={contextMenu.show}
	close={() => (contextMenu.show = false)}
	menuItems={contextMenu.items}
/>

<style>
	.files-app {
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
	}

	.files-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 8px;
		padding: 10px 12px;
		background: #000;
		color: #fff;
		border-bottom: 2px solid #000;
	}

	.files-title {
		font-size: 16px;
		margin: 0;
	}

	.files-nav {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.files-nav-btn {
		padding: 6px 10px;
		border: 2px solid #fff;
		background: transparent;
		color: #fff;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 13px;
		cursor: pointer;
		min-width: 32px;
	}

	.files-nav-btn:hover:not(:disabled) {
		background: #fff;
		color: #000;
	}

	.files-nav-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.files-breadcrumb {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-wrap: wrap;
		font-size: 13px;
	}

	.files-breadcrumb button {
		background: none;
		border: none;
		color: #fff;
		font-family: inherit;
		font-weight: bold;
		cursor: pointer;
		padding: 2px 4px;
	}

	.files-breadcrumb button:hover {
		text-decoration: underline;
	}

	.files-breadcrumb .sep {
		color: #808080;
		user-select: none;
	}

	.files-toolbar {
		display: flex;
		gap: 8px;
	}

	.files-btn {
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 13px;
		padding: 6px 12px;
		border: 2px solid #000;
		border-radius: 0;
		background-image:
			radial-gradient(circle, #808080 1px, transparent 1px),
			radial-gradient(circle, #808080 1px, transparent 1px);
		background-size: 3px 3px;
		background-position:
			0 0,
			1.5px 1.5px;
		background-color: #e8e8e8;
		color: #000;
		cursor: pointer;
		box-shadow: 2px 2px 0 #000;
	}

	.files-btn:hover {
		background-color: #d0d0d0;
	}

	.files-main {
		display: flex;
		flex: 1;
		min-height: 0;
	}

	.files-list-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
		border-right: 2px solid #000;
	}

	.files-list-header {
		display: grid;
		grid-template-columns: 2fr 80px 80px 90px;
		gap: 8px;
		padding: 8px 12px;
		background: #000;
		color: #fff;
		font-size: 13px;
		border-bottom: 2px solid #000;
	}

	.files-list-body {
		flex: 1;
		overflow-y: auto;
		min-height: 0;
	}

	.files-row {
		display: grid;
		grid-template-columns: 2fr 80px 80px 90px;
		gap: 8px;
		align-items: center;
		padding: 8px 12px;
		border: none;
		border-bottom: 2px solid #000;
		border-radius: 0;
		background: #fff;
		cursor: pointer;
		font-size: 13px;
		width: 100%;
		text-align: left;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		box-sizing: border-box;
	}

	.files-row:nth-child(even) {
		background-image:
			radial-gradient(circle, #e0e0e0 1px, transparent 1px),
			radial-gradient(circle, #e0e0e0 1px, transparent 1px);
		background-size: 4px 4px;
		background-position:
			0 0,
			2px 2px;
		background-color: #fff;
	}

	.files-row:hover,
	.files-row.selected {
		background: #000;
		color: #fff;
	}

	.files-row .type-dir {
		color: #000;
	}

	.files-row:hover .type-dir,
	.files-row.selected .type-dir {
		color: #fff;
	}

	.files-row .name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}

	.files-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 120px;
		color: #808080;
		font-size: 13px;
		border-bottom: 2px solid #000;
	}

	.files-preview-panel {
		width: 50%;
		display: flex;
		flex-direction: column;
		border-left: 2px solid #000;
		background: #fff;
	}

	.files-preview-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 12px;
		border-bottom: 2px solid #000;
		background-image:
			radial-gradient(circle, #e0e0e0 1px, transparent 1px),
			radial-gradient(circle, #e0e0e0 1px, transparent 1px);
		background-size: 4px 4px;
		background-position:
			0 0,
			2px 2px;
		background-color: #fff;
		font-size: 13px;
	}

	.files-preview-actions {
		display: flex;
		gap: 4px;
	}

	.files-preview-actions button {
		padding: 4px 8px;
		border: 2px solid #000;
		background: #fff;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 12px;
		cursor: pointer;
	}

	.files-preview-actions button:hover {
		background: #000;
		color: #fff;
	}

	.files-preview-body {
		flex: 1;
		padding: 12px;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}

	.files-preview-body textarea {
		width: 100%;
		flex: 1;
		min-height: 100px;
		resize: none;
		border: 2px solid #000;
		padding: 10px;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 13px;
		background: #fff;
		box-sizing: border-box;
	}

	.files-preview-body textarea:focus {
		outline: none;
	}

	.files-preview-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		color: #808080;
		font-size: 13px;
		text-align: center;
		padding: 20px;
	}

	/* Modals */
	.files-modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
	}

	.files-modal {
		background: #fff;
		border: 2px solid #000;
		box-shadow: 4px 4px 0 #000;
		padding: 20px;
		max-width: 400px;
		width: calc(100% - 32px);
		font-size: 14px;
	}

	.files-modal h3 {
		margin: 0 0 12px 0;
		font-size: 16px;
		border-bottom: 2px solid #000;
		padding-bottom: 8px;
	}

	.files-modal label {
		display: block;
		margin-bottom: 6px;
		font-size: 13px;
	}

	.files-modal input {
		width: 100%;
		padding: 8px 10px;
		border: 2px solid #000;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 13px;
		box-sizing: border-box;
		margin-bottom: 16px;
	}

	.files-modal input:focus {
		outline: none;
	}

	.files-modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		margin-top: 8px;
	}

	.files-modal-actions .files-btn {
		margin: 0;
	}

	@media (max-width: 768px) {
		.files-list-header,
		.files-row {
			grid-template-columns: 1fr 70px 70px 70px;
		}
		.files-preview-panel {
			width: 100%;
		}
	}
</style>
