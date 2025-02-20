<script>
	let display = '';

	// Append character to the current expression
	function append(char) {
		display += char;
	}

	// Clear the display
	function clearDisplay() {
		display = '';
	}

	// Evaluate the expression and update the display
	function calculate() {
		try {
			// Using eval for simplicity; replace with a safer alternative if needed.
			display = eval(display).toString();
		} catch (error) {
			display = 'Error';
		}
	}

</script>

<div class="calculator w-full h-full p-2">
	<input class="display w-full h-[25%]" type="text" readonly bind:value={display} />
	<div class="buttons w-full h-[75%]">
		<button on:click={() => append('7')}>7</button>
		<button on:click={() => append('8')}>8</button>
		<button on:click={() => append('9')}>9</button>
		<button class="muted" on:click={() => append('/')}>÷</button>

		<button on:click={() => append('4')}>4</button>
		<button on:click={() => append('5')}>5</button>
		<button on:click={() => append('6')}>6</button>
		<button class="muted" on:click={() => append('*')}>×</button>

		<button on:click={() => append('1')}>1</button>
		<button on:click={() => append('2')}>2</button>
		<button on:click={() => append('3')}>3</button>
		<button class="muted" on:click={() => append('-')}>−</button>

		<button class="strong" on:click={clearDisplay}>C</button>
		<button on:click={() => append('0')}>0</button>
		<button on:click={calculate}>=</button>
		<button class="muted" on:click={() => append('+')}>+</button>
	</div>
</div>

<style>
	.buttons button {
		border-radius: 10rem;
	}
	.calculator {
		margin: auto;
		background: var(--surface-color);
	}
	.display {
		margin-bottom: 0.5rem;
		font-size: 2rem;
		padding-right: 1rem;
		font-weight: 400;
		text-align: right;
		border-radius: 0 0 1rem 1rem;
		background-color: var(--secondary-color);
	}
	.buttons {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
	}
	button {
		font-size: 1.2rem;
		border: none;
		border-radius: 4px;
		background: var(--surface-high-color);
		cursor: pointer;
		font-weight: 00;
	}
	button.strong {
		background: var(--source-color);
	}
	button.muted {
		background: var(--error-container-color);
	}
	button:hover {
		background: var(--primary-color);
	}
	.span-two {
		grid-column: span 2;
	}
</style>
