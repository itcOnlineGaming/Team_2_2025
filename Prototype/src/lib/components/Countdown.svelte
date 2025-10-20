<script>
  import { writable } from 'svelte/store';

  let customMinutes = 25; // default input
  const timeLeft = writable(customMinutes * 60);
  let interval = null;
  let isRunning = false;

  // Format seconds -> mm:ss
  $: formattedTime = formatTime($timeLeft);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  function startTimer() {
    if (interval) return; // prevent duplicates
    isRunning = true;
    interval = setInterval(() => {
      timeLeft.update(t => {
        if (t <= 1) {
          clearInterval(interval);
          interval = null;
          isRunning = false;
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(interval);
    interval = null;
    isRunning = false;
  }

  function toggleTimer() {
    if (isRunning) pauseTimer();
    else startTimer();
  }

  function setCustomTime() {
    pauseTimer();
    timeLeft.set(customMinutes * 60);
  }
</script>

<div class="timer">
  <h2>{formattedTime}</h2>

  <div class="controls">
    <label>
      <input type="number" min="1" bind:value={customMinutes} />
      minutes
    </label>

    <button on:click={setCustomTime}>Set</button>
    <button on:click={toggleTimer}>
      {isRunning ? 'Pause' : 'Start'}
    </button>
    <button on:click={() => timeLeft.set(0)}>Reset</button>
  </div>
</div>

<style>
  .timer {
    text-align: center;
    font-family: monospace;
    padding: 1rem;
  }
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .controls {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }
  input {
    width: 4rem;
    text-align: center;
  }
  button {
    padding: 0.5rem 1rem;
    border: 1px solid #444;
    border-radius: 6px;
    background: #eee;
    cursor: pointer;
  }
  button:hover {
    background: #ddd;
  }
</style>



