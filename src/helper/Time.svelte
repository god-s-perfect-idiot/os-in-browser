<script>
    import { onMount, onDestroy } from 'svelte';
    
    // Props with defaults
    export let format = '12hour'; // '24hour' or '12hour'
    export let updateInterval = 1000; // Update interval in milliseconds
    export let showSeconds = false;
    
    let time = new Date();
    let intervalId;
    
    // Format the time based on preferences
    $: formattedTime = formatTime(time);
    
    function formatTime(date) {
      const hours = format === '12hour' 
        ? (date.getHours() % 12 || 12) 
        : date.getHours().toString().padStart(2, '0');
        
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      const ampm = format === '12hour' ? (date.getHours() >= 12 ? 'PM' : 'AM') : '';
      
      return `${hours}:${minutes}${showSeconds ? ':' + seconds : ''} ${ampm}`.trim();
    }
    
    onMount(() => {
      // Update time immediately and set interval
      time = new Date();
      intervalId = setInterval(() => {
        time = new Date();
      }, updateInterval);
    });
    
    onDestroy(() => {
      // Clean up interval when component is destroyed
      if (intervalId) clearInterval(intervalId);
    });
  </script>
  
  <span>{formattedTime}</span>
  
  <style>
    /* span {
      font-size: 1rem;
    } */
  </style>