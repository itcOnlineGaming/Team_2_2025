<script lang="ts">
  import { PlanningBoard } from '$lib/components/planning-board/src';
  import { mockTasks } from '$lib/components/planning-board/src/mockData';
  import { onMount } from 'svelte';
  
  // Use mock data initially
  let tasks = mockTasks;
  
  // OR load from your existing task board's localStorage
  onMount(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
    }
  });
  
  function handleUpdate(event) {
    tasks = event.detail.tasks;
    // Save changes back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Tasks updated:', tasks);
  }
</script>

<PlanningBoard {tasks} on:update={handleUpdate} />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
/>