<script>
  import { goto } from '$app/navigation';
  function handleStart() {
    goto('/start');
  }
</script>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    background: #8B5C7E;
  }

  .fullscreen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .card {
    width: 100%;
    max-width: 360px;
    background: #fff;
    border-radius: 18px;
    padding: 24px;
    position: relative;
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    border: 2px solid #8BAA8B;
    text-align: center;
  }

  .icon-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f3f3f3;
    border: 1px solid #ddd;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
    cursor: pointer;
  }
  .icon-btn:hover {
    transform: scale(1.08) rotate(-8deg);
    background: #e7e7e7;
    box-shadow: 0 2px 8px rgba(139,92,126,0.10);
  }

  .title {
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 4px;
    color: #222;
    margin: 6px 0;
  }

  .subtitle {
    color: #8B5C7E;
    font-family: monospace;
    margin-top: 6px;
  }

  .start-btn {
    margin-top: 18px;
    padding: 12px 28px;
    background: #8BAA8B;
    color: #000;
    border-radius: 12px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: transform .15s ease, background .15s ease;
  }
  .start-btn:hover { transform: scale(1.03); background: #7a9c7a; }

  .progress {
    margin-top: 12px;
    font-family: monospace;
  }

  .divider {
    width: 66%;
    height: 1px;
    background: #eee;
    margin: 18px auto;
  }

  .fail-btn {
    padding: 8px 20px;
    background: #F3C6C6;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: transform .15s ease, background .15s ease, box-shadow .15s ease;
  }
  .fail-btn:hover {
    transform: scale(1.04);
    background: #e6b3b3;
    box-shadow: 0 2px 8px rgba(139,92,126,0.10);
  }

  .streak-counter {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    margin-bottom: 2px;
    gap: 4px;
  }
  .streak-num {
    font-size: 28px;
    font-family: monospace;
    color: #222;
    font-weight: 500;
  }
  .streak-fire {
    font-size: 28px;
    display: inline-block;
    animation: fire-bounce 1.2s infinite cubic-bezier(.68,-0.55,.27,1.55);
    will-change: transform;
  }
  @keyframes fire-bounce {
    0%, 100% { transform: translateY(0) scale(1); }
    20% { transform: translateY(-6px) scale(1.1); }
    40% { transform: translateY(0) scale(1); }
    60% { transform: translateY(-3px) scale(1.05); }
    80% { transform: translateY(0) scale(1); }
  }
</style>

<div class="fullscreen">
  <div class="card" role="region" aria-label="Start card">
    <button class="icon-btn" aria-label="profile" on:click={() => goto('/profile')}>
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
    <button class="fail-btn" on:click={() => goto('/fails')}>VIEW FAILS</button>
  </div>
</div>