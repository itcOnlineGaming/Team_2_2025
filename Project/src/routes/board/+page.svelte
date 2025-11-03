<script lang="ts">
  import Column from '$lib/components/Column.svelte';
  import { onMount } from 'svelte';

  interface TaskData { id: number; text: string; }
  interface ColumnData { id: number; title: string; tasks: TaskData[]; }
  interface ChecklistItem { id: string; text: string; completed: boolean; }
  interface ChecklistItem { id: string; text: string; completed: boolean; }

  let columns: ColumnData[] = [
    { id: 1, title: 'To Do', tasks: [{ id: 101, text: 'Set up the Svelte project' }] },
    { id: 2, title: 'In Progress', tasks: [] }
  ];

  let nextColumnId = 3;
  let nextTaskId = 200;

  // Welcome popup state
  let showWelcomePopup = true;
  let agreedToTest = false;

  // Checklist state
  let checklist: ChecklistItem[] = [
    { id: 'add_column', text: 'Add a new column', completed: false },
    { id: 'add_task', text: 'Add a task to any column', completed: false }
  ];

  // Success popup for first task/column
  let showPopup = false;
  let popupMessage = '';
  let popupTimeout: NodeJS.Timeout;

  // Load saved state on mount
  onMount(() => {
    const savedAgreement = localStorage.getItem('agreedToTest');
    const savedChecklist = localStorage.getItem('checklist');
    
    if (savedAgreement === 'true') {
      showWelcomePopup = false;
      agreedToTest = true;
    }
    
    if (savedChecklist) {
      checklist = JSON.parse(savedChecklist);
    }
  });

  function handleAgree() {
    if (agreedToTest) {
      localStorage.setItem('agreedToTest', 'true');
      showWelcomePopup = false;
    }
  }

  function updateChecklist(itemId: string) {
    checklist = checklist.map(item => 
      item.id === itemId ? { ...item, completed: true } : item
    );
    localStorage.setItem('checklist', JSON.stringify(checklist));
  }

  function triggerPopup(message: string) {
    popupMessage = message;
    showPopup = true;
    clearTimeout(popupTimeout);
    popupTimeout = setTimeout(() => (showPopup = false), 3000);
  }

  // Load checklist from localStorage on mount
  onMount(() => {
    const savedChecklist = localStorage.getItem('checklist');
    if (savedChecklist) {
      checklist = JSON.parse(savedChecklist);
    }
  });

  function addColumn() {
    const newColumn: ColumnData = {
      id: nextColumnId++,
      title: `New List ${nextColumnId - 1}`,
      tasks: []
    };
    columns = [...columns, newColumn];

    if (columns.length === 3) {
      triggerPopup('🎉 You added your first column!');
      updateChecklist('add_column');
    }
  }

  function removeColumn(event: CustomEvent<number>) {
    columns = columns.filter(c => c.id !== event.detail);
  }

  function editColumn(event: CustomEvent<{ id: number, newTitle: string }>) {
    const { id, newTitle } = event.detail;
    columns = columns.map(c => c.id === id ? { ...c, title: newTitle } : c);
  }

  function addTask(event: CustomEvent<{ columnId: number, text: string }>) {
    const { columnId, text } = event.detail;
    const newTask: TaskData = { id: nextTaskId++, text };
    columns = columns.map(c => c.id === columnId ? { ...c, tasks: [...c.tasks, newTask] } : c);

    const totalTasks = columns.reduce((sum, c) => sum + c.tasks.length, 0);
    if (totalTasks === 2) {
      triggerPopup('🎊 Your first task was added!');
      updateChecklist('add_task');
    }
  }

  function removeTask(event: CustomEvent<{ columnId: number, taskId: number }>) {
    const { columnId, taskId } = event.detail;
    columns = columns.map(c => c.id === columnId ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) } : c);
  }
</script>

<main>
  <!-- Welcome Popup Overlay -->
  {#if showWelcomePopup}
    <div class="welcome-overlay">
      <div class="welcome-popup">
        <h2>🎯 Welcome to the Project Board Test</h2>
        <p>This is a usability test for our project management board. We'd like you to try out the features and complete a few simple tasks.</p>
        
        <div class="agreement-section">
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={agreedToTest} />
            <span>I agree to participate in this test and am comfortable using this application</span>
          </label>
        </div>

        <button 
          class="agree-button" 
          on:click={handleAgree}
          disabled={!agreedToTest}
        >
          Get Started
        </button>
      </div>
    </div>
  {/if}

  <!-- Checklist -->
  {#if !showWelcomePopup}
    <div class="checklist">
      <h3>✓ Test Tasks</h3>
      {#each checklist as item (item.id)}
        <div class="checklist-item" class:completed={item.completed}>
          <span class="checkbox">{item.completed ? '✓' : ''}</span>
          <span class="checklist-text">{item.text}</span>
        </div>
      {/each}
    </div>
  {/if}

  <div class="board-header">
    <h1>✨ Project Board</h1>
    <p>Manage your tasks, move them between lists, and stay organized.</p>
  </div>

  <div class="board-container">
    {#each columns as column (column.id)}
      <Column
        id={column.id}
        title={column.title}
        tasks={column.tasks}
        on:remove={removeColumn}
        on:edit={editColumn}
        on:addTask={addTask}
        on:removeTask={removeTask}
      />
    {/each}

    <button class="add-column-button" on:click={addColumn}>
      <span class="plus-symbol">+</span> Add another column
    </button>
  </div>

  {#if showPopup}
    <div class="popup" role="status">{popupMessage}</div>
  {/if}
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-height: 100vh;
    padding: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Welcome Popup Styles */
  .welcome-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    backdrop-filter: blur(4px);
  }

  .welcome-popup {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    animation: slideIn 0.4s ease;
  }

  .welcome-popup h2 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 28px;
    font-weight: 700;
  }

  .welcome-popup p {
    margin: 0 0 24px 0;
    color: #666;
    font-size: 16px;
    line-height: 1.6;
  }

  .agreement-section {
    background: #f9fafb;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-label input[type="checkbox"] {
    margin-top: 2px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .checkbox-label span {
    color: #374151;
    font-size: 15px;
    line-height: 1.5;
  }

  .agree-button {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
  }

  .agree-button:hover:not(:disabled) {
    transform: scale(1.02);
  }

  .agree-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Checklist Styles */
  .checklist {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    min-width: 250px;
    z-index: 1500;
  }

  .checklist h3 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 18px;
    font-weight: 700;
  }

  .checklist-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    margin-bottom: 8px;
    border-radius: 8px;
    background: #f9fafb;
    transition: all 0.3s ease;
  }

  .checklist-item.completed {
    background: #d1fae5;
  }

  .checkbox {
    width: 24px;
    height: 24px;
    border: 2px solid #d1d5db;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .checklist-item.completed .checkbox {
    background: #10b981;
    border-color: #10b981;
    color: white;
  }

  .checklist-text {
    color: #374151;
    font-size: 14px;
    line-height: 1.4;
  }

  .checklist-item.completed .checklist-text {
    color: #059669;
    font-weight: 500;
  }

  .board-header {
    text-align: center;
    margin-bottom: 32px;
    color: white;
  }

  /* Checklist Styles */
  .checklist {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    min-width: 250px;
    z-index: 1500;
  }

  .checklist h3 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 18px;
    font-weight: 700;
  }

  .checklist-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    margin-bottom: 8px;
    border-radius: 8px;
    background: #f9fafb;
    transition: all 0.3s ease;
  }

  .checklist-item.completed {
    background: #d1fae5;
  }

  .checkbox-display {
    width: 24px;
    height: 24px;
    border: 2px solid #d1d5db;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .checklist-item.completed .checkbox-display {
    background: #10b981;
    border-color: #10b981;
    color: white;
  }

  .checklist-text {
    color: #374151;
    font-size: 14px;
    line-height: 1.4;
  }

  .checklist-item.completed .checklist-text {
    color: #059669;
    font-weight: 500;
  }

  .board-header h1 { font-size: 40px; font-weight: 800; margin-bottom: 12px; }
  .board-header p { font-size: 18px; color: #f3f4f6; }

  .board-container { display: flex; gap: 16px; overflow-x: auto; align-items: flex-start; }

  .add-column-button {
    flex-shrink: 0;
    min-width: 272px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 16px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.2);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .add-column-button:hover { transform: scale(1.05); box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
  .plus-symbol { font-size: 20px; }

  .popup {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    color: #333;
    padding: 16px 24px;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    font-weight: 600;
    animation: fadeIn 0.3s ease;
    z-index: 1000;
  }

  @keyframes fadeIn { 
    from { opacity:0; transform: translate(-50%, -10px);} 
    to {opacity:1; transform: translate(-50%, 0);} 
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>