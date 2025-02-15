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
    });

    // // Save todos whenever they change
    // $: {
    //     if (todos) {  // Only save if todos is initialized
    //         localStorage.setItem('todolist', JSON.stringify(todos));
    //     }
    // }

    function addTodo(e) {
        e.preventDefault();
        if (!newTodo.trim()) return;
        
        todos = [...todos, {
            id: Date.now(),
            text: newTodo,
            completed: false
        }];
        
        newTodo = '';
        localStorage.setItem('todolist', JSON.stringify(todos));
    }

    function toggleTodo(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        localStorage.setItem('todolist', JSON.stringify(todos));
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        localStorage.setItem('todolist', JSON.stringify(todos));
    }
</script>

<div class="h-full flex flex-col p-4">
    <form on:submit={addTodo} class="flex gap-2 mb-4">
        <input
            type="text"
            bind:value={newTodo}
            placeholder="Add a new task..."
            class="flex-grow px-3 py-2 rounded border border-gray-300"
        />
        <button 
            type="submit" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
            <Icon icon="material-symbols:add" />
        </button>
    </form>

    <div class="flex-grow overflow-auto">
        {#each todos as todo (todo.id)}
            <div class="mb-2 p-3 flex items-center gap-3 border border-gray-200 rounded">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    on:change={() => toggleTodo(todo.id)}
                    class="w-4 h-4"
                />
                <span class="flex-grow {todo.completed ? 'line-through text-gray-500' : ''}">
                    {todo.text}
                </span>
                <button
                    on:click={() => deleteTodo(todo.id)}
                    class="text-red-500 hover:text-red-600 p-1"
                >
                    <Icon icon="material-symbols:delete" />
                </button>
            </div>
        {/each}
    </div>
</div>