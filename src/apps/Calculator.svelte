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

<div class="calculator w-full h-full">
	<input class="display w-full h-[15%]" type="text" readonly bind:value={display} />
	<div class="buttons w-full h-[85%]">
		<button on:click={() => append('7')}>7</button>
		<button on:click={() => append('8')}>8</button>
		<button on:click={() => append('9')}>9</button>
		<button on:click={() => append('/')}>÷</button>

		<button on:click={() => append('4')}>4</button>
		<button on:click={() => append('5')}>5</button>
		<button on:click={() => append('6')}>6</button>
		<button on:click={() => append('*')}>×</button>

		<button on:click={() => append('1')}>1</button>
		<button on:click={() => append('2')}>2</button>
		<button on:click={() => append('3')}>3</button>
		<button on:click={() => append('-')}>−</button>

		<button on:click={clearDisplay}>C</button>
		<button on:click={() => append('0')}>0</button>
		<button on:click={calculate}>=</button>
		<button on:click={() => append('+')}>+</button>
	</div>
</div>

<style>
	.calculator {
		margin: auto;
		background: #f9f9f9;
	}
	.display {
		margin-bottom: 0.5rem;
		font-size: 1.2rem;
		padding: 0.2rem;
		text-align: right;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.buttons {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
	}
	button {
		font-size: 1rem;
		border: none;
		border-radius: 4px;
		background: #e0e0e0;
		cursor: pointer;
	}
	button:hover {
		background: #d0d0d0;
	}
	.span-two {
		grid-column: span 2;
	}
</style>
