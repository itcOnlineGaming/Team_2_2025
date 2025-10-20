<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let columnId: number;
  export let taskId: number;
  export let text: string;

  const dispatch = createEventDispatcher();

  function remove()
  {
    dispatch('removeTask', { columnId, taskId });
  }
</script>

<div class="task-card">
  {text}
  <button on:click={remove} class="remove-task-button">
    &times;
  </button>
</div>

<style>
  .task-card
  {
    background-color: white;
    border-radius: 3px;
    padding: 8px 12px;
    margin-bottom: 8px;
    box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
    cursor: grab;
    font-size: 14px;
    line-height: 20px;
    word-break: break-word;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .task-card:last-child
  {
    margin-bottom: 0;
  }

  .remove-task-button
  {
    background: none;
    border: none;
    color: #6b778c;
    font-size: 1.2em;
    cursor: pointer;
    line-height: 1;
    padding: 0 4px;
    transition: color 0.2s;
    opacity: 0;
  }

  .task-card:hover .remove-task-button
  {
    opacity: 1;
  }
</style>