<script>
	import { fileSystem } from '$lib/fs';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

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
		return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
	}

	// Initialize with some sample files if empty
	onMount(() => {
		// Create sample files if the file system is empty
		setTimeout(() => {
			try {
				const currentFiles = get(files);
				if (!currentFiles || currentFiles.length === 0) {
					fileSystem.touch('README.md', '# Welcome to OS in Browser\n\nThis is a virtual file system running in your browser.\n\n## Features\n- Create and edit files\n- Organize files in folders\n- Persistent storage using localStorage\n\n## Getting Started\n1. Create new files and folders using the toolbar buttons\n2. Click on files to edit them\n3. Double-click folders to navigate into them\n4. Use the breadcrumb navigation to move between directories');
					fileSystem.mkdir('Documents');
					fileSystem.mkdir('Pictures');
					fileSystem.touch('Documents/notes.txt', 'Your personal notes go here...\n\n- Meeting notes\n- Ideas\n- Todo list\n\nThis is a simple text editor for your notes.');
					fileSystem.touch('Documents/todo.md', '# Todo List\n\n## Today\n- [ ] Review project requirements\n- [ ] Set up development environment\n- [ ] Create initial documentation\n\n## This Week\n- [ ] Implement core features\n- [ ] Write tests\n- [ ] Deploy to staging\n\n## Later\n- [ ] Performance optimization\n- [ ] User feedback integration\n- [ ] Final polish');
				}
			} catch (error) {
				console.warn('Error initializing file system:', error);
			}
		}, 100);
	});
</script>

<style>
	/* Custom scrollbar */
	.overflow-y-auto::-webkit-scrollbar {
		width: 8px;
	}

	.overflow-y-auto::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	.overflow-y-auto::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 4px;
	}

	.overflow-y-auto::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}

	/* File list hover effects */
	.grid:hover {
		background-color: #f8fafc;
	}

	/* Focus styles */
	input:focus, textarea:focus {
		outline: none;
		ring: 2px;
		ring-color: #3b82f6;
	}

	/* Button hover effects */
	button:hover {
		transition: all 0.2s ease-in-out;
	}

	/* Modal backdrop */
	.fixed {
		backdrop-filter: blur(4px);
	}

	/* File type icons */
	.text-yellow-500 {
		color: #eab308;
	}

	.text-gray-500 {
		color: #6b7280;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.grid-cols-12 {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
		
		.col-span-6 {
			grid-column: span 3 / span 3;
		}
		
		.col-span-2 {
			grid-column: span 1 / span 1;
		}
	}
</style>

<div class="flex h-full w-full flex-col bg-gray-50">
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
		<div class="flex items-center gap-4">
			<h1 class="text-xl font-semibold text-gray-800">File Explorer</h1>
			<div class="flex items-center gap-2">
				<button 
					class="p-2 hover:bg-gray-100 rounded-md transition-colors"
					on:click={goHome}
					title="Home"
				>
					<Icon icon="material-symbols:home" class="text-lg" />
				</button>
				<button 
					class="p-2 hover:bg-gray-100 rounded-md transition-colors {currentPath === '/' ? 'opacity-50 cursor-not-allowed' : ''}"
					on:click={goBack}
					disabled={currentPath === '/'}
					title="Go Back"
				>
					<Icon icon="material-symbols:arrow-back" class="text-lg" />
				</button>
			</div>
		</div>
		
		<!-- Breadcrumb -->
		<div class="flex items-center gap-1 text-sm text-gray-600">
			<button 
				class="hover:text-blue-600 transition-colors"
				on:click={() => navigateToPath('/')}
			>
				Home
			</button>
			{#if pathParts && pathParts.length > 0}
				{#each pathParts as part, index}
					<Icon icon="material-symbols:chevron-right" class="text-sm" />
					<button 
						class="hover:text-blue-600 transition-colors"
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

		<!-- Toolbar -->
		<div class="flex items-center gap-2">
			<button 
				class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
				on:click={() => newFilePopup = true}
			>
				<Icon icon="material-symbols:add" class="text-sm" />
				New File
			</button>
			<button 
				class="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
				on:click={() => newFolderPopup = true}
			>
				<Icon icon="material-symbols:create-new-folder" class="text-sm" />
				New Folder
			</button>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex h-full">
		<!-- File List -->
		<div class="flex-1 bg-white">
			<div class="border-b border-gray-200 px-4 py-2 bg-gray-50">
				<div class="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
					<div class="col-span-6">Name</div>
					<div class="col-span-2">Type</div>
					<div class="col-span-2">Size</div>
					<div class="col-span-2">Modified</div>
				</div>
			</div>
			
			<div class="overflow-y-auto h-full">
				{#if $files}
					{#each $files as file}
						<div 
							class="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 {selectedFile?.path === file.path ? 'bg-blue-50' : ''}"
							on:click={() => openFile(file)}
							on:dblclick={() => openFile(file)}
						>
							<div class="col-span-6 flex items-center gap-3">
								<Icon 
									icon={file.type === 'directory' ? 'material-symbols:folder' : 'material-symbols:description'} 
									class="text-lg {file.type === 'directory' ? 'text-yellow-500' : 'text-gray-500'}" 
								/>
								<span class="truncate">{file.name}</span>
							</div>
							<div class="col-span-2 text-sm text-gray-600">
								{file.type === 'directory' ? 'Folder' : 'File'}
							</div>
							<div class="col-span-2 text-sm text-gray-600">
								{file.type === 'directory' ? '-' : formatFileSize(file.content || '')}
							</div>
							<div class="col-span-2 text-sm text-gray-600">
								{formatDate(file.modified)}
							</div>
						</div>
					{/each}
				{:else}
					<div class="flex items-center justify-center h-32 text-gray-500">
						No files in this directory
					</div>
				{/if}
			</div>
		</div>

		<!-- File Preview/Editor -->
		{#if selectedFile}
			<div class="w-1/2 border-l border-gray-200 bg-white">
				<div class="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Icon icon="material-symbols:description" class="text-lg text-gray-500" />
						<span class="font-medium">{selectedFile.name}</span>
					</div>
					<div class="flex items-center gap-2">
						<button 
							class="p-1 hover:bg-gray-100 rounded transition-colors"
							on:click={() => { fileToRename = selectedFile; renameName = selectedFile.name; renamePopup = true; }}
							title="Rename"
						>
							<Icon icon="material-symbols:edit" class="text-sm" />
						</button>
						<button 
							class="p-1 hover:bg-gray-100 rounded transition-colors"
							on:click={() => { fileToDelete = selectedFile; deletePopup = true; }}
							title="Delete"
						>
							<Icon icon="material-symbols:delete" class="text-sm text-red-500" />
						</button>
					</div>
				</div>
				<div class="p-4 h-full">
					{#if selectedFile.type === 'file'}
						<textarea 
							class="w-full h-full resize-none border border-gray-200 rounded-md p-3 font-mono text-sm"
							value={selectedFile.content || ''}
							on:input={(e) => fileSystem.writeFile(selectedFile.path, e.target.value)}
							placeholder="File content..."
						></textarea>
					{:else}
						<div class="flex items-center justify-center h-full text-gray-500">
							<Icon icon="material-symbols:folder" class="text-4xl text-yellow-500 mr-3" />
							<span>This is a folder. Double-click to open it.</span>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if deletePopup}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
			<div class="flex items-center gap-3 mb-4">
				<Icon icon="material-symbols:warning" class="text-2xl text-red-500" />
				<h3 class="text-lg font-semibold">Delete File</h3>
			</div>
			<p class="text-gray-600 mb-6">
				Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
			</p>
			<div class="flex justify-end gap-3">
				<button 
					class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
					on:click={() => { deletePopup = false; fileToDelete = null; }}
				>
					Cancel
				</button>
				<button 
					class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
					on:click={deleteFile}
				>
					Delete
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- New File Modal -->
{#if newFilePopup}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
			<h3 class="text-lg font-semibold mb-4">Create New File</h3>
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700 mb-2">File Name</label>
				<input 
					type="text" 
					bind:value={newFileName}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Enter file name..."
					on:keydown={(e) => e.key === 'Enter' && createFile()}
				/>
			</div>
			<div class="flex justify-end gap-3">
				<button 
					class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
					on:click={() => { newFilePopup = false; newFileName = ''; }}
				>
					Cancel
				</button>
				<button 
					class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					on:click={createFile}
				>
					Create
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- New Folder Modal -->
{#if newFolderPopup}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
			<h3 class="text-lg font-semibold mb-4">Create New Folder</h3>
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700 mb-2">Folder Name</label>
				<input 
					type="text" 
					bind:value={newFolderName}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Enter folder name..."
					on:keydown={(e) => e.key === 'Enter' && createFolder()}
				/>
			</div>
			<div class="flex justify-end gap-3">
				<button 
					class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
					on:click={() => { newFolderPopup = false; newFolderName = ''; }}
				>
					Cancel
				</button>
				<button 
					class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
					on:click={createFolder}
				>
					Create
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Rename Modal -->
{#if renamePopup}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
			<h3 class="text-lg font-semibold mb-4">Rename File</h3>
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700 mb-2">New Name</label>
				<input 
					type="text" 
					bind:value={renameName}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Enter new name..."
					on:keydown={(e) => e.key === 'Enter' && renameFile()}
				/>
			</div>
			<div class="flex justify-end gap-3">
				<button 
					class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
					on:click={() => { renamePopup = false; fileToRename = null; renameName = ''; }}
				>
					Cancel
				</button>
				<button 
					class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					on:click={renameFile}
				>
					Rename
				</button>
			</div>
		</div>
	</div>
{/if} 