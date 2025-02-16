<script>
    import { onMount } from 'svelte';
    
    let date = new Date();
    
    onMount(() => {
      setInterval(() => {
        date = new Date();
      }, 1000);
    });
</script>



{#if date}
    <span>{date.toDateString()}</span>
{/if}