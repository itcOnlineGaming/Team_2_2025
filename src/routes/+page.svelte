<script>
  import { goto } from '$app/navigation';
  function handleStart() {
    goto('/doc');
  }

  function handleProfile() {
    goto('/ProfileScreen');
  }

    function failurePage() {
    goto('/failureScreen');
  }
</script>

<div class="fullscreen">
  <div class="card" role="region" aria-label="Start card">
    <button class="icon-btn" aria-label="profile" on:click={() => goto('/ProfileScreen')}>
      <!-- small profile icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"></path>
        <path d="M4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z"></path>
      </svg>
    </button>

    <!-- Streak Counter -->
    <div class="streak-counter">
      <span class="streak-num">0</span>
      <span class="streak-fire" aria-label="streak fire" role="img">🔥</span>
    </div>

    <div>
      <div class="title">DAY ONE</div>
      <div class="subtitle">Every expert was once a beginner. Keep going!</div>
      <div style="height:10px"></div>
    </div>

    <button class="start-btn" on:click={handleStart}>START</button>
    <div class="progress">0 / 300</div>
    <div class="divider" aria-hidden="true"></div>
    <button class="fail-btn" on:click={() => goto('/failureScreen')}>VIEW FAILS</button>
  </div>
</div>