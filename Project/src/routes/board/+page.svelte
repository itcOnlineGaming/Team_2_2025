<script lang="ts">
  import Column from '$lib/components/Column.svelte';

  interface TaskData
  {
    id: number;
    text: string;
  }

  interface ColumnData
  {
    id: number;
    title: string;
    tasks: TaskData[];
  }

  let columns: ColumnData[] = [
    { id: 1, title: 'To Do', tasks: [{ id: 101, text: 'Set up the Svelte project' }] },
    { id: 2, title: 'In Progress', tasks: [] }
  ];

  let nextColumnId: number = 3;
  let nextTaskId: number = 200;

  function addColumn(): void
  {
    const newColumn: ColumnData = 
    {
      id: nextColumnId++,
      title: `New List ${nextColumnId - 1}`,
      tasks: []
    };
    columns = [...columns, newColumn];
  }

  function removeColumn(event: CustomEvent<number>): void
  {
    const columnIdToRemove = event.detail;

    columns = columns.filter(column => column.id !== columnIdToRemove);
  }

  function editColumn(event: CustomEvent<{ id: number, newTitle: string }>): void
  {
    const { id, newTitle } = event.detail;

    columns = columns.map(column => 
    {
      if (column.id === id) 
      {
        return { ...column, title: newTitle };
      }
      return column;
    });
  }

  function addTask(event: CustomEvent<{ columnId: number, text: string }>): void
  {
    const { columnId, text } = event.detail;
    
    const newTask: TaskData = { id: nextTaskId++, text };

    columns = columns.map(column => 
    {
      if (column.id === columnId) 
      {
        return { ...column, tasks: [...column.tasks, newTask] };
      }
      return column;
    });
  }

  function removeTask(event: CustomEvent<{ columnId: number, taskId: number }>): void
  {
    const { columnId, taskId } = event.detail;

    columns = columns.map(column => 
    {
      if (column.id === columnId) 
      {
        // Filter out the task from the matching column's tasks array
        const updatedTasks = column.tasks.filter(task => task.id !== taskId);
        return { ...column, tasks: updatedTasks };
      }
      return column;
    });
  }
</script>

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

  <button on:click={addColumn} class="add-column-button">
    <span class="plus-symbol">+</span> Add another column
  </button>
</div>

<style>
  .board-container
  {
    display: flex;
    gap: 12px;
    padding: 16px;
    background-color: #0079bf;
    height: 100vh;
    overflow-x: auto;
    align-items: flex-start;
  }

  .add-column-button
  {
    flex-shrink: 0; 
    width: 272px; 
    height: 40px;
    background-color: #ffffff3d; 
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-weight: 500;
    text-align: left;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    transition: background-color 0.2s;
  }

  .add-column-button:hover
  {
    background-color: #ffffff52;
  }

  .plus-symbol
  {
    font-size: 1.2em;
    margin-right: 5px;
    line-height: 1;
  }
</style>