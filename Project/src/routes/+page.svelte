<script lang="ts">
  import { onMount } from 'svelte';
  import { TaskBoard } from '@stevenk03/flow-board';
  import type { Task } from '../../packages/flow-board/src/index';
  import { availableTreesStore } from '$lib/stores/taskStore.ts';
  
  let showPopup = false;
  let popupMessage = '';
  let popupTimeout: NodeJS.Timeout;
  let treeCount = 0;
  
  availableTreesStore.subscribe(value => {
    treeCount = value;
  });
  
  function triggerPopup(message: string) {
    popupMessage = message;
    showPopup = true;
    clearTimeout(popupTimeout);
    popupTimeout = setTimeout(() => (showPopup = false), 3000); 
  }

  let tasks: Task[] = [];
  let isLoading = true;
  let user = { id: 'u123', name: 'Demo User' };
  
  onMount(() => {
    availableTreesStore.load(); 

    setTimeout(() => {
      const saved = localStorage.getItem(`tasks_${user.id}`);
      if (saved) {
        tasks = JSON.parse(saved);
      } else {
        tasks = [{
            id: 1,
            title: 'Review Project Brief',
            startDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 604800000).toISOString().split('T')[0],
            color: '#38bdf8',
            showTestTasks: false,
            isComplete: false,
            notes: 'Check all requirements.',
            subtasks: []
        }];
      }
      isLoading = false;
    }, 800);
  });

  function handleBoardChange(event: CustomEvent<Task[]>) {
    tasks = event.detail;
    localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks));
  }

  function handleTreeEarned(event: CustomEvent<{ title: string }>) {
    console.log('Tree earned event received!', event.detail);
    availableTreesStore.increment(); 
    triggerPopup(`You've gained a tree! 🌳`);
  }
</script>

<div class="app">
  <header class="header">
    <h1 class="logo">Flow Board</h1>
    <div class="tree-count">Trees: {treeCount}</div>
  </header>

  <main class="main-content">
    {#if isLoading}
        <div class="loading">Loading your flow...</div>
    {:else}
        <TaskBoard 
            {tasks} 
            on:change={handleBoardChange} 
            on:treeEarned={handleTreeEarned}
        />
    {/if}
  </main>
  
  {#if showPopup}
    <div class="popup">{popupMessage}</div>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    min-height: 100vh;
    color: #334e68;
    -webkit-font-smoothing: antialiased;
    transition: background 1.5s ease-in-out;
    background-color: #e6e9ee;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    background: #004d00; 
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2); 
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .logo {
    color: white;
    font-size: 24px;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.5px;
    text-shadow: none;
  }
  
  .tree-count {
    color: #ABDE9D;
    font-size: 18px;
    font-weight: 700;
    padding: 4px 12px;
    border: 1px solid #006600;
    border-radius: 6px;
    background: #003300;
  }

  .main-content {
    width: 100%;
    padding: 0;
    box-sizing: border-box;
    flex: 1;
  }
  
  .loading { 
    text-align: center; 
    margin-top: 50px; 
    color: #486581;
  }
  
  .popup {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #004d00;
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    z-index: 3500;
    animation: slideInUp 0.3s ease;
    font-size: 15px;
    font-weight: 500;
  }

  @keyframes slideInUp {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 640px) {
    .header {
      padding: 16px;
    }
    .logo {
      font-size: 20px;
    }
  }
</style>