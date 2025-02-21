<script>
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	let todos = [];
	let newTodo = '';

	// Load todos on mount
	onMount(() => {
		const savedTodos = localStorage.getItem('todolist');
		if (savedTodos) {
			todos = JSON.parse(savedTodos);
		}
        console.log(todos);
	});

	function addTodo(e) {
		e.preventDefault();
		if (!newTodo.trim()) return;

		todos = [
			...todos,
			{
				id: Date.now(),
				text: newTodo,
				completed: false
			}
		];

		newTodo = '';
		localStorage.setItem('todolist', JSON.stringify(todos));
	}

	function toggleTodo(id) {
		todos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
		localStorage.setItem('todolist', JSON.stringify(todos));
	}

	function deleteTodo(id) {
		todos = todos.filter((todo) => todo.id !== id);
		localStorage.setItem('todolist', JSON.stringify(todos));
	}
</script>

<div class="flex flex-col h-full p-2">
	<form on:submit={addTodo} class="flex gap-2 mb-4 h-12 flex-shrink-0">
		<input
			type="text"
			bind:value={newTodo}
			placeholder="Add a new task..."
			class="flex-grow border-b border-b-gray-300 border-b-2 outline-none px-3 py-2 text-box" 
		/>
		<button type="submit" class="bg-accent cursor-pointer rounded-full px-6 py-2 text-white">
			<Icon icon="mdi:add-bold" class="text-lg" />
		</button>
	</form>

	<div class="flex-grow overflow-y-auto flex flex-col">
		<div class="space-y-2">
			{#each todos as todo (todo.id)}
				<div
					class={`mb-2 flex items-center gap-3 p-3 ${
						todos.findIndex((t) => t.id === todo.id) === todos.length - 1 ? '' : 'border-b-2 border-gray-400'
					}`}
				>
					<button on:click={() => toggleTodo(todo.id)} class="p-1 text-gray-900 hover:text-gray-700">
						{#if todo.completed}
							<Icon icon="mdi:checkbox-marked-circle" class="text-2xl" />
						{:else}
							<Icon icon="mdi:checkbox-blank-circle-outline" class="text-2xl" />
						{/if}
					</button>
					<span class="flex-grow {todo.completed ? 'text-gray-700 line-through' : ''}">
						{todo.text}
					</span>
					<button
						on:click={() => deleteTodo(todo.id)}
						class="p-1 text-xl text-gray-900 hover:text-gray-700"
					>
						<Icon icon="material-symbols:delete-outline-rounded" class="text-xl" />
					</button>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.cb {
		border-radius: 2rem;
		background-color: var(--surface-color);
	}
    .text-box:focus {
        border-bottom-color: var(--accent-color);
        background-color: var(--surface-high-color);
    }
</style>