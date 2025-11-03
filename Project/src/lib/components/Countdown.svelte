<script>
  import { writable } from 'svelte/store';

  let customMinutes = 25; // default input
  const timeLeft = writable(customMinutes * 60);
  let interval = null;
  let isRunning = false;

  $: totalSeconds = customMinutes * 60;
  $: progress = 1 - $timeLeft / totalSeconds;

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

<div class="timer {isRunning ? 'running' : ''}">
   <div class="circle">
    <svg viewBox="0 0 120 120" class="progress-ring">
      <circle
        class="progress-ring__bg"
        cx="60"
        cy="60"
        r="54"
        stroke-width="8"
      />
      <circle
        class="progress-ring__progress"
        cx="60"
        cy="60"
        r="54"
        stroke-width="8"
        stroke-dasharray={2 * Math.PI * 54}
        stroke-dashoffset={(1 - progress) * 2 * Math.PI * 54}
      />
    </svg>
    <!-- 🌲 Tree in the middle -->
    <div class="tree">
      🌲
    </div>
    <div class="time-display">
       <h2>{formattedTime}</h2>
    </div>
  </div>
  

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
  .circle {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 1.5rem auto;
  }

  .progress-ring {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }

  .progress-ring__bg {
    fill: none;
    stroke: #dfe6e9;
  }

  .progress-ring__progress {
    fill: none;
    stroke: #2ecc71;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.35s;
  }

  .tree {
    position: absolute;
    top: 70%;
    left: 50%;
    font-size: 4rem;
    transform: translate(-50%, -70%);
    transition: transform 0.3s ease;
  }

  
  .running .tree {
  font-size: 4.5rem;
  transform: translate(-50%, -72%) scale(1.05);
  }

  .time-display {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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