<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';

  interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
  }

  // Checklist
  let checklist: ChecklistItem[] = [
    { id: 'add_column', text: 'Add a new column', completed: false },
    { id: 'add_task', text: 'Add a task to any column', completed: false },
    { id: 'remove_column', text: 'Remove a column', completed: false },
    { id: 'remove_task', text: 'Remove a task from any column', completed: false },
    { id: 'set_time', text: 'Set a time on the countdown', completed: false },
    { id: 'start_timer', text: 'Start the countdown timer', completed: false },
    { id: 'stop_timer', text: 'Stop/pause the countdown timer', completed: false }
  ];

  // Timer variables
  let minutes: number = 0;
  let seconds: number = 10;
  const timeLeft = writable(10);
  let interval: ReturnType<typeof setInterval> | null = null;
  let isRunning: boolean = false;
  let showCompletionNotification: boolean = false;
  let notificationMessage = '';


  $: totalSeconds = minutes * 60 + seconds;
  $: if (seconds >= 60) {
    minutes += Math.floor(seconds / 60);
    seconds = seconds % 60;
  }

  onMount(() => {
    const savedChecklist = localStorage.getItem('checklist');
    if (savedChecklist) {
      checklist = JSON.parse(savedChecklist);
    }
    timeLeft.set(totalSeconds);
  });

  function triggerPopup(message: string) {
  notificationMessage = message;
  showCompletionNotification = true;

  // Automatically hide after 5 seconds
  setTimeout(() => {
    showCompletionNotification = false;
  }, 5000);
}

 async function updateChecklist(itemId: string) {
  checklist = checklist.map(item =>
    item.id === itemId ? { ...item, completed: true } : item
  );
  localStorage.setItem('checklist', JSON.stringify(checklist));

  await tick();

  const allDone = checklist.every(item => item.completed);
  if (allDone) {
    triggerPopup('✅ All tasks completed! Redirecting...');
    console.log('Checklist:', checklist.map(i => `${i.id}: ${i.completed}`));
    setTimeout(() => {
      try {
        goto('/end'); // SvelteKit
      } catch {
        window.location.href = '/end'; // fallback for plain Svelte
      }
    }, 2500);
  }
}

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  $: formattedTime = formatTime($timeLeft);

  function startTimer() {
    if (interval || $timeLeft <= 0) return;
    isRunning = true;
    updateChecklist('start_timer'); // Mark as completed
    interval = setInterval(() => {
      timeLeft.update(t => {
        if (t <= 1) {
          clearInterval(interval as ReturnType<typeof setInterval>);
          interval = null;
          isRunning = false;
          showCompletionNotification = true;
          setTimeout(() => {
            showCompletionNotification = false;
          }, 5000);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function pauseTimer() {
    if (interval) {
      clearInterval(interval);
      interval = null;
      isRunning = false;
      updateChecklist('stop_timer'); // Mark as completed
    }
  }

  function toggleTimer() {
    if (isRunning) pauseTimer();
    else startTimer();
  }

  function setCustomTime() {
    pauseTimer();
    const total = Math.max(1, totalSeconds);
    timeLeft.set(total);
    updateChecklist('set_time'); // Mark as completed
  }

  function resetTimer() {
    pauseTimer();
    const total = Math.max(1, totalSeconds);
    timeLeft.set(total);
  }

  function closeCompletionNotification() {
    showCompletionNotification = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTimer();
    }
  }

  function handleInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      setCustomTime();
    }
  }
</script>

<main>
  <!-- Checklist -->
  <div class="checklist">
    <h3>✓ Test Tasks</h3>
    {#each checklist as item (item.id)}
      <div class="checklist-item" class:completed={item.completed}>
        <span class="checkbox-display">{item.completed ? '✓' : ''}</span>
        <span class="checklist-text">{item.text}</span>
      </div>
    {/each}
  </div>

  <!-- Countdown Timer Card -->
  <div class="timer-card">
    <h2>⏱️ Countdown Timer</h2>
    
    {#if showCompletionNotification}
      <div class="notification-wrapper">
        <div class="notification">
          <div class="notification-content">
            <span class="notification-icon">🎉</span>
            <span class="notification-text">{notificationMessage}</span>
            <button class="close-btn" on:click={closeCompletionNotification}>×</button>
          </div>
        </div>
      </div>
    {/if}

    <div class="timer-container">
      <div class="time-display-container">
        <div class="time-label">Countdown Timer</div>
        
        <div 
          class="time-display" 
          on:click={toggleTimer} 
          on:keydown={handleKeydown} 
          role="button" 
          tabindex="0"
        >
          <h1>{formattedTime}</h1>
        </div>

        <div class="status-indicator">
          {#if isRunning}
            <span class="text-green">Running...</span>
          {:else if $timeLeft < totalSeconds && $timeLeft > 0}
            <span class="text-yellow">Paused</span>
          {:else if $timeLeft === 0}
            <span class="text-red">Finished</span>
          {:else}
            <span class="text-gray">Ready</span>
          {/if}
        </div>
      </div>
      
      <div class="controls">
        <div class="input-row">
          <div class="input-wrapper">
            <label for="minutes">Minutes</label>
            <input 
              id="minutes"
              type="number" 
              bind:value={minutes} 
              on:keydown={handleInputKeydown}
              class="time-input"
              min="0"
              max="99"
            />
          </div>
          <div class="input-wrapper">
            <label for="seconds">Seconds</label>
            <input 
              id="seconds"
              type="number" 
              bind:value={seconds} 
              on:keydown={handleInputKeydown}
              class="time-input"
              min="0"
              max="59"
            />
          </div>
          <button on:click={setCustomTime} class="btn-set">Set</button>
        </div>

        <button on:click={toggleTimer} class="btn-primary">
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button on:click={resetTimer} class="btn-reset">
          Reset
        </button>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    min-height: 100vh;
    padding: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .timer-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 40px;
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 450px;
    width: 100%;
    text-align: center;
    animation: fadeIn 0.4s ease;
  }

  .timer-card h2 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 32px 0;
    color: #1f2937;
  }

  /* Timer Styles */
  .timer-container {
    text-align: center;
    padding: 2rem 0;
    width: 100%;
  }

  .time-display-container {
    margin-bottom: 2rem;
  }

  .time-label {
    font-size: 1.1rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 1rem;
  }

  .time-display {
    outline: none;
    transition: box-shadow 0.2s, background 0.2s;
    width: 100%; 
    padding: 1rem 0;
    cursor: pointer;
    border-radius: 12px;
  }

  .time-display:hover, .time-display:focus {
    background: rgba(102, 126, 234, 0.05);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }

  .time-display h1 {
    font-size: 5rem; 
    font-weight: 800;
    color: #1f2937;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    letter-spacing: -2px; 
    transition: color 0.3s ease;
  }

  .time-display:hover h1 {
    color: #667eea;
  }

  .status-indicator {
    font-size: 0.9rem;
    font-weight: 600;
    margin-top: 1rem;
    text-transform: uppercase;
  }

  .text-green { color: #10b981; }
  .text-yellow { color: #f59e0b; }
  .text-gray { color: #9ca3af; }
  .text-red { color: #ef4444; }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
  }

  .input-row {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .input-wrapper label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    text-align: left;
  }

  .time-input {
    width: 100%;
    text-align: center;
    padding: 0.875rem;
    border: 2px solid #d1d5db;
    border-radius: 12px;
    font-size: 1.25rem;
    outline: none;
    box-sizing: border-box;
    color: #111827;
    font-weight: 700;
    background: white;
  }

  .time-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .controls button {
    padding: 16px;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    color: white;
    font-size: 1.1rem;
  }

  .btn-primary:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
  }

  .btn-primary:active {
    transform: scale(0.95);
  }

  .btn-set {
    background: #e5e7eb;
    color: #374151;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 0.875rem 1.25rem;
    border-radius: 12px;
    font-size: 0.95rem;
    width: 100%;
  }

  .btn-set:hover {
    background: #d1d5db;
  }

  .btn-reset {
    background: #e5e7eb;
    color: #374151;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .btn-reset:hover {
    background: #d1d5db;
  }

  /* Checklist */
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

  /* NOTIFICATION */
  .notification-wrapper {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
    animation: slideInDown 0.4s ease;
  }

  .notification-content {
    background: #10b981;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 350px;
  }

  .notification-icon {
    font-size: 1.5rem;
  }

  .notification-text {
    flex: 1;
    font-weight: 600;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s;
    line-height: 1;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInDown {
    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  @media (max-width: 640px) {
    .timer-card {
      padding: 32px 24px;
      max-width: 90%;
    }

    .timer-card h2 {
      font-size: 24px;
    }

    .time-display h1 {
      font-size: 4rem;
    }

    .checklist {
      top: 10px;
      right: 10px;
      min-width: 220px;
      padding: 16px;
    }
  }
</style>