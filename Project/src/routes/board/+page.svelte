<script lang="ts">
  import Column from '$lib/components/Column.svelte';
  import { onMount } from 'svelte';

  interface TaskData { id: number; text: string; }
  interface ColumnData { id: number; title: string; tasks: TaskData[]; }

  let columns: ColumnData[] = [
    { id: 1, title: 'To Do', tasks: [{ id: 101, text: 'Set up the Svelte project' }] },
    { id: 2, title: 'In Progress', tasks: [] }
  ];

  let nextColumnId = 3;
  let nextTaskId = 200;

  // Popup for first task/column
  let showPopup = false;
  let popupMessage = '';
  let popupTimeout: NodeJS.Timeout;

  function triggerPopup(message: string) {
    popupMessage = message;
    showPopup = true;
    clearTimeout(popupTimeout);
    popupTimeout = setTimeout(() => (showPopup = false), 3000);
  }

  // Feedback modals
  let showColumnFeedback = false;
  let showTaskFeedback = false;
  let columnRating: number | null = null;
  let taskRating: number | null = null;

  function submitColumnFeedback() {
    showColumnFeedback = false;
    console.log('Column feedback:', columnRating);
    columnRating = null;
  }

  function submitTaskFeedback() {
    showTaskFeedback = false;
    console.log('Task feedback:', taskRating);
    taskRating = null;
  }

  function addColumn() {
    const newColumn: ColumnData = {
      id: nextColumnId++,
      title: `New List ${nextColumnId - 1}`,
      tasks: []
    };
    columns = [...columns, newColumn];

    // Trigger first column feedback popup
    if (columns.length === 3) {
      triggerPopup('🎉 You added your first column!');
      showColumnFeedback = true;
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
      showTaskFeedback = true;
    }
  }

  function removeTask(event: CustomEvent<{ columnId: number, taskId: number }>) {
    const { columnId, taskId } = event.detail;
    columns = columns.map(c => c.id === columnId ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) } : c);
  }
</script>

<main>
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
    <div class="popup">{popupMessage}</div>
  {/if}

  {#if showColumnFeedback}
    <div class="modal-backdrop" on:click={() => showColumnFeedback = false}>
      <div class="modal-content" on:click|stopPropagation>
        <h2>How easy was it to add a column?</h2>
        <div class="rating-buttons">
          {#each [1,2,3,4,5] as n}
            <button on:click={() => { columnRating = n; submitColumnFeedback(); }}>{n}</button>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  {#if showTaskFeedback}
    <div class="modal-backdrop" on:click={() => showTaskFeedback = false}>
      <div class="modal-content" on:click|stopPropagation>
        <h2>How easy was it to add a task?</h2>
        <div class="rating-buttons">
          {#each [1,2,3,4,5] as n}
            <button on:click={() => { taskRating = n; submitTaskFeedback(); }}>{n}</button>
          {/each}
        </div>
      </div>
    </div>
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

  .board-header {
    text-align: center;
    margin-bottom: 32px;
    color: white;
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
    right: 20px;
    background: white;
    color: #333;
    padding: 16px 24px;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    font-weight: 600;
    animation: fadeIn 0.3s ease;
    z-index: 1000;
  }

  @keyframes fadeIn { from { opacity:0; transform:translateY(-10px);} to{opacity:1; transform:translateY(0);} }

  /* Feedback modals */
  .modal-backdrop {
    position: fixed; inset:0; background: rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:1000;
  }

  .modal-content {
    background:white; border-radius:24px; padding:32px; max-width:400px; width:100%; text-align:center;
    box-shadow:0 25px 50px rgba(0,0,0,0.3);
  }

  .rating-buttons { display:flex; justify-content:center; gap:12px; margin-top:24px; }
  .rating-buttons button {
    width:48px; height:48px; border-radius:12px; border:none; background:#667eea; color:white; font-weight:700; font-size:18px; cursor:pointer; transition:all 0.2s;
  }
  .rating-buttons button:hover { transform:scale(1.1); background:#5568d3; }
</style>
