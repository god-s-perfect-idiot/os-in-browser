<script>
	import { onMount } from 'svelte';

	// Console state
	let history = [
		{
			type: 'system',
			content: 'JavaScript Console v1.0.0\nType "help" for available commands.'
		}
	];
	let inputValue = '';
	let commandHistory = [];
	let historyIndex = -1;
	let consoleEnd;
	let inputElement;

	// Console context to maintain variables between evaluations
	const consoleContext = {
		variables: {},
		console: {
			log: (...args) => {
				const output = args
					.map((arg) => {
						if (typeof arg === 'object') {
							return JSON.stringify(arg, null, 2);
						}
						return String(arg);
					})
					.join(' ');
				history = [...history, { type: 'output', content: output }];
			},
			error: (...args) => {
				const output = args.map((arg) => String(arg)).join(' ');
				history = [...history, { type: 'error', content: output }];
			}
		}
	};

	onMount(() => {
		inputElement.focus();
	});

	// Auto-scroll to bottom when history changes
	$: if (history) {
		setTimeout(() => {
			consoleEnd?.scrollIntoView({ behavior: 'smooth' });
		}, 0);
	}

	// Built-in commands
	const builtInCommands = {
		help: () => `Available commands:
      - help: Show this help message
      - clear: Clear the console
      - vars: Show all defined variables
      - reset: Reset the console environment
      
    You can also:
      - Execute any JavaScript code
      - Use console.log() and console.error()
      - Define variables and functions
      - Use arrow keys to navigate command history`,

		clear: () => {
			history = [{ type: 'system', content: 'Console cleared.' }];
			return null;
		},

		vars: () => {
			const vars = Object.entries(consoleContext.variables)
				.map(
					([key, value]) =>
						`${key}: ${typeof value === 'function' ? '[Function]' : JSON.stringify(value)}`
				)
				.join('\n');
			return vars || 'No variables defined';
		},

		reset: () => {
			consoleContext.variables = {};
			return 'Console environment reset.';
		}
	};

	// Evaluate JavaScript code safely
	function evaluateCode(code) {
		try {
			// Create a function with the console context
			const contextKeys = Object.keys(consoleContext.variables);
			const contextValues = Object.values(consoleContext.variables);

			// Include console object in evaluation context
			const evaluator = new Function(
				'console',
				...contextKeys,
				`try {
            return eval(${JSON.stringify(code)});
          } catch (error) {
            throw error;
          }`
			);

			const result = evaluator(consoleContext.console, ...contextValues);

			// Store any variable assignments
			if (code.includes('=')) {
				const varName = code.split('=')[0].trim();
				if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(varName)) {
					consoleContext.variables[varName] = result;
				}
			}

			return result;
		} catch (error) {
			throw new Error(`${error.name}: ${error.message}`);
		}
	}

	function handleCommand(command) {
		// Add command to history
		history = [...history, { type: 'input', content: command }];

		try {
			// Check for built-in commands first
			const builtInCommand = builtInCommands[command.toLowerCase()];
			if (builtInCommand) {
				const result = builtInCommand();
				if (result !== null) {
					history = [...history, { type: 'output', content: result }];
				}
				return;
			}

			// Evaluate JavaScript code
			const result = evaluateCode(command);
			if (result !== undefined) {
				history = [
					...history,
					{
						type: 'output',
						content: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)
					}
				];
			}
		} catch (error) {
			history = [...history, { type: 'error', content: error.message }];
		}
	}

	function handleKeyDown(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (inputValue.trim()) {
				handleCommand(inputValue.trim());
				commandHistory = [...commandHistory, inputValue.trim()];
				historyIndex = -1;
				inputValue = '';
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (historyIndex < commandHistory.length - 1) {
				historyIndex += 1;
				inputValue = commandHistory[commandHistory.length - 1 - historyIndex];
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndex > 0) {
				historyIndex -= 1;
				inputValue = commandHistory[commandHistory.length - 1 - historyIndex];
			} else if (historyIndex === 0) {
				historyIndex = -1;
				inputValue = '';
			}
		}
	}
</script>

<div class="h-full w-full overflow-hidden rounded-lg font-mono text-[#2c2cc9] p-2">
	<div class="h-full overflow-y-auto">
		{#each history as entry}
			<div class="mb-2">
				{#if entry.type === 'input'}
					<span class="text-[#c8619d]">&gt; {entry.content}</span>
				{:else if entry.type === 'error'}
					<span class="text-red-500">{entry.content}</span>
				{:else if entry.type === 'output'}
					<pre class="whitespace-pre-wrap">{entry.content}</pre>
				{:else if entry.type === 'system'}
					<span class="text-gray-500 italic">{entry.content}</span>
				{/if}
			</div>
		{/each}
		<div class="flex items-center">
			<span class="mr-2 text-[#2c2cc9]">&gt;</span>
			<input
				bind:this={inputElement}
				type="text"
				bind:value={inputValue}
				on:keydown={handleKeyDown}
				class="flex-1 bg-transparent text-[#2c2cc9] outline-none"
				spellcheck="false"
				autocomplete="off"
			/>
		</div>
		<div bind:this={consoleEnd} />
	</div>
</div>
