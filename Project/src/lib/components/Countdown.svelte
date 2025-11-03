<script>
  import { writable } from 'svelte/store';

  let customMinutes = 25; // default input
  const timeLeft = writable(customMinutes * 60);
  let interval = null;
  let isRunning = false;
  
  // Popup states
  let showWelcomePopup = true;
  let showThankYouNotification = false;

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
          // Show thank you notification
          showThankYouNotification = true;
          setTimeout(() => {
            showThankYouNotification = false;
          }, 5000); // Hide after 5 seconds
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

  function closeWelcomePopup() {
    showWelcomePopup = false;
  }

  function closeThankYouNotification() {
    showThankYouNotification = false;
  }
</script>

<!-- Welcome Popup -->
{#if showWelcomePopup}
  <div class="popup-overlay">
    <div class="popup-content">
      <h2>Welcome! 🌲</h2>
      <p>Thank you for taking the time to test the countdown timer.</p>
      <p>Set your desired time and click "Start" to begin.</p>
      <button class="primary-btn" on:click={closeWelcomePopup}>
        Got it!
      </button>
    </div>
  </div>
{/if}

<!-- Thank You Notification -->
{#if showThankYouNotification}
  <div class="notification">
    <div class="notification-content">
      <span class="notification-icon">✨</span>
      <span class="notification-text">Great job! Timer completed successfully.</span>
      <button class="close-btn" on:click={closeThankYouNotification}>×</button>
    </div>
  </div>
{/if}

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

  /* Welcome Popup Styles */
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }

  .popup-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease;
  }

  .popup-content h2 {
    margin: 0 0 1rem 0;
    color: #2ecc71;
  }

  .popup-content p {
    margin: 0.5rem 0;
    color: #555;
    line-height: 1.5;
  }

  .primary-btn {
    margin-top: 1.5rem;
    padding: 0.75rem 2rem;
    background: #2ecc71;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .primary-btn:hover {
    background: #27ae60;
  }

  /* Thank You Notification Styles */
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    animation: slideInRight 0.4s ease;
  }

  .notification-content {
    background: #2ecc71;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
    font-family: system-ui, -apple-system, sans-serif;
  }

  .close-btn {
    background: transparent;
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
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>