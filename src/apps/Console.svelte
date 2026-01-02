<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import '@xterm/xterm/css/xterm.css';
	import { fileSystem } from '$lib/fs';

	let terminalContainer;
	let terminal;
	let TerminalClass;
	let currentLine = '';
	let commandHistory = [];
	let historyIndex = -1;

	// Helper to resolve path (handle relative paths, .., etc.)
	function resolvePath(path, currentPath) {
		if (path.startsWith('/')) {
			return path;
		}
		
		const parts = path.split('/').filter(Boolean);
		const currentParts = currentPath.split('/').filter(Boolean);
		
		for (const part of parts) {
			if (part === '..') {
				currentParts.pop();
			} else if (part !== '.' && part !== '') {
				currentParts.push(part);
			}
		}
		
		return '/' + currentParts.join('/');
	}

	// Helper to get node at path
	function getNodeAtPath(fs, path) {
		if (path === '/') return fs;
		const parts = path.split('/').filter(Boolean);
		let current = fs;
		
		for (const part of parts) {
			if (!current.children || !current.children[part]) return null;
			current = current.children[part];
		}
		return current;
	}

	// Shell command handlers
	const commands = {
		help: () => `Available commands:
  help     - Show this help message
  clear    - Clear the terminal
  pwd      - Print working directory
  cd <dir> - Change directory
  ls [dir] - List directory contents
  mkdir    - Create directory (mkdir <name>)
  touch    - Create file (touch <name> [content])
  echo     - Print text (echo <text>)
  cat      - Display file contents (cat <file>)
  rm       - Remove file or directory (rm <path>)
  mv       - Move/rename file (mv <old> <new>)
  date     - Show current date and time
  whoami   - Show current user
  exit     - Exit the terminal`,

		clear: () => {
			terminal.clear();
			return null;
		},

		pwd: () => {
			return get(fileSystem.currentPath);
		},

		cd: (args) => {
			if (args.length === 0) {
				fileSystem.cd('/');
				return '';
			}
			
			const targetPath = args[0];
			const currentPath = get(fileSystem.currentPath);
			const resolvedPath = resolvePath(targetPath, currentPath);
			
			// Check if path exists
			const fs = get(fileSystem);
			const node = getNodeAtPath(fs, resolvedPath);
			
			if (!node) {
				return { error: true, message: `cd: ${targetPath}: No such file or directory` };
			}
			
			if (node.type !== 'directory') {
				return { error: true, message: `cd: ${targetPath}: Not a directory` };
			}
			
			fileSystem.cd(resolvedPath);
			return '';
		},

		ls: (args) => {
			const currentPath = get(fileSystem.currentPath);
			const targetPath = args.length > 0 ? resolvePath(args[0], currentPath) : currentPath;
			
			const fs = get(fileSystem);
			const node = getNodeAtPath(fs, targetPath);
			
			if (!node) {
				return { error: true, message: `ls: ${args[0] || ''}: No such file or directory` };
			}
			
			if (node.type !== 'directory') {
				return node.name;
			}
			
			const children = node.children || {};
			const entries = Object.keys(children).sort((a, b) => {
				const aNode = children[a];
				const bNode = children[b];
				// Directories first
				if (aNode.type === 'directory' && bNode.type !== 'directory') return -1;
				if (aNode.type !== 'directory' && bNode.type === 'directory') return 1;
				return a.localeCompare(b);
			});
			
			return entries.map(name => {
				const child = children[name];
				return child.type === 'directory' ? `${name}/` : name;
			}).join('  ') || '';
		},

		mkdir: (args) => {
			if (args.length === 0) {
				return { error: true, message: 'mkdir: missing operand' };
			}
			
			try {
				fileSystem.mkdir(args[0]);
				return '';
			} catch (error) {
				return { error: true, message: `mkdir: ${error.message}` };
			}
		},

		touch: (args) => {
			if (args.length === 0) {
				return { error: true, message: 'touch: missing file operand' };
			}
			
			const fileName = args[0];
			const content = args.slice(1).join(' ') || '';
			
			try {
				fileSystem.touch(fileName, content);
				return '';
			} catch (error) {
				return { error: true, message: `touch: ${error.message}` };
			}
		},

		echo: (args) => {
			return args.join(' ');
		},

		cat: (args) => {
			if (args.length === 0) {
				return { error: true, message: 'cat: missing file operand' };
			}
			
			const currentPath = get(fileSystem.currentPath);
			const filePath = resolvePath(args[0], currentPath);
			
			const fs = get(fileSystem);
			const node = getNodeAtPath(fs, filePath);
			
			if (!node) {
				return { error: true, message: `cat: ${args[0]}: No such file or directory` };
			}
			
			if (node.type !== 'file') {
				return { error: true, message: `cat: ${args[0]}: Is a directory` };
			}
			
			return node.content || '';
		},

		rm: (args) => {
			if (args.length === 0) {
				return { error: true, message: 'rm: missing operand' };
			}
			
			const currentPath = get(fileSystem.currentPath);
			const targetPath = resolvePath(args[0], currentPath);
			
			try {
				fileSystem.rm(targetPath);
				return '';
			} catch (error) {
				return { error: true, message: `rm: ${error.message}` };
			}
		},

		mv: (args) => {
			if (args.length < 2) {
				return { error: true, message: 'mv: missing file operand' };
			}
			
			const currentPath = get(fileSystem.currentPath);
			const oldPath = resolvePath(args[0], currentPath);
			const newPath = resolvePath(args[1], currentPath);
			
			try {
				fileSystem.mv(oldPath, newPath);
				return '';
			} catch (error) {
				return { error: true, message: `mv: ${error.message}` };
			}
		},

		date: () => {
			return new Date().toString();
		},

		whoami: () => {
			return 'user';
		},

		exit: () => {
			return null;
		}
	};

	function writeError(message) {
		// Write error with bold ANSI code for extra thickness
		terminal.writeln(`\x1b[1m${message}\x1b[0m`);
	}

	function executeCommand(line) {
		if (!line.trim()) return;

		const parts = line.trim().split(/\s+/);
		const command = parts[0].toLowerCase();
		const args = parts.slice(1);

		if (commands[command]) {
			const result = commands[command](args);
			if (result !== null && result !== '') {
				if (typeof result === 'object' && result.error) {
					writeError(result.message);
				} else {
					terminal.writeln(result);
				}
			}
		} else {
			writeError(`${command}: command not found`);
		}
	}

	onMount(async () => {
		// Dynamically import xterm.js
		const xtermModule = await import('@xterm/xterm');
		TerminalClass = xtermModule.Terminal || xtermModule.default?.Terminal || xtermModule.default;

		// Initialize terminal
		terminal = new TerminalClass({
			cursorBlink: true,
			fontFamily: 'Courier New, Courier, monospace',
			fontSize: 14,
			fontWeight: 700,
			scrollback: 1000,
			theme: {
				background: '#ffffff',
				foreground: '#000000',
				cursor: '#000000',
				black: '#000000',
				red: '#000000',
				green: '#000000',
				yellow: '#000000',
				blue: '#000000',
				magenta: '#000000',
				cyan: '#000000',
				white: '#000000',
				brightBlack: '#000000',
				brightRed: '#000000',
				brightGreen: '#000000',
				brightYellow: '#000000',
				brightBlue: '#000000',
				brightMagenta: '#000000',
				brightCyan: '#000000',
				brightWhite: '#000000'
			}
		});

		terminal.open(terminalContainer);
		terminal.write('$ ');

		// Handle terminal input
		terminal.onData((data) => {
			const code = data.charCodeAt(0);

			if (code === 13) {
				// Enter
				terminal.write('\r\n');
				if (currentLine.trim()) {
					commandHistory.push(currentLine);
					historyIndex = commandHistory.length;
				}
				executeCommand(currentLine);
				currentLine = '';
				terminal.write('$ ');
			} else if (code === 127) {
				// Backspace
				if (currentLine.length > 0) {
					currentLine = currentLine.slice(0, -1);
					terminal.write('\b \b');
				}
			} else if (code === 27) {
				// Arrow keys
				const seq = data.slice(1);
				if (seq === '[A') {
					// Up arrow
					if (historyIndex > 0) {
						historyIndex--;
						// Clear current line
						for (let i = 0; i < currentLine.length; i++) {
							terminal.write('\b \b');
						}
						currentLine = commandHistory[historyIndex];
						terminal.write(currentLine);
					}
				} else if (seq === '[B') {
					// Down arrow
					if (historyIndex < commandHistory.length - 1) {
						historyIndex++;
						// Clear current line
						for (let i = 0; i < currentLine.length; i++) {
							terminal.write('\b \b');
						}
						currentLine = commandHistory[historyIndex];
						terminal.write(currentLine);
					} else if (historyIndex === commandHistory.length - 1) {
						historyIndex = commandHistory.length;
						// Clear current line
						for (let i = 0; i < currentLine.length; i++) {
							terminal.write('\b \b');
						}
						currentLine = '';
					}
				}
			} else if (code >= 32) {
				// Printable characters
				currentLine += data;
				terminal.write(data);
			}
		});

		// Handle terminal resize
		const resizeObserver = new ResizeObserver(() => {
			if (terminal) {
				const dimensions = {
					cols: Math.floor(terminalContainer.clientWidth / 8.4),
					rows: Math.floor(terminalContainer.clientHeight / 17)
				};
				terminal.resize(dimensions.cols, dimensions.rows);
			}
		});

		resizeObserver.observe(terminalContainer);
	});

	onDestroy(() => {
		if (terminal) {
			terminal.dispose();
		}
	});
</script>

<div bind:this={terminalContainer} class="terminal-container"></div>

<style>
	.terminal-container {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 0;
		margin: 0;
	}

	:global(.xterm) {
		height: 100%;
	}

	:global(.xterm-viewport) {
		background-color: #ffffff !important;
		overflow: hidden !important;
	}

	:global(.xterm-screen) {
		background-color: #ffffff !important;
	}

	:global(.xterm) {
		font-weight: 600 !important;
	}

	:global(.xterm .xterm-rows) {
		font-weight: 600 !important;
	}

	:global(.xterm .xterm-rows > div) {
		font-weight: 600 !important;
	}

	:global(.xterm .xterm-screen .xterm-rows > div[style*="31"]) {
		font-weight: 900 !important;
	}

	:global(.xterm-scrollbar) {
		display: none !important;
	}

	:global(.xterm-viewport::-webkit-scrollbar) {
		display: none !important;
		width: 0 !important;
		height: 0 !important;
	}
</style>
