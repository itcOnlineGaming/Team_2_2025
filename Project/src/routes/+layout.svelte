<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { page } from '$app/stores';

  let { children } = $props();

  function goToForest() {
    goto(`${base}/forest`);
  }

  function goToCalendar() {
    goto(`${base}/calender`);
  }

  function goToCountdown() {
    goto(`${base}/countdown`);
  }

  function goToHome() {
    goto(`${base}/`);
  }

  // Routes where the sidebar should NOT be shown
  // Change '/end' to whatever your thank-you page route is
  const hideSidebarOn = ['/end'];
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="stylesheet" href="/styles.css" />
</svelte:head>

<div class="app-layout">
  {#if !hideSidebarOn.includes($page.url.pathname)}
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="15" r="8" fill="#90EE90" />
            <path
              d="M20 23 L20 35 M15 30 L25 30"
              stroke="#90EE90"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>

      <nav class="sidebar-nav">
        <button class="nav-item" on:click={goToForest}>
          <img
            src={base + '/Images/tree.png'}
            alt="Forest"
            style="width: 32px; height: 32px; object-fit: contain;"
          />
          <span class="nav-label">Forest</span>
        </button>

        <!-- Back arrow -> Home -->
        <button class="nav-item" on:click={goToHome}>
          <svg
            class="nav-icon-svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="nav-label">Back</span>
        </button>

        <!-- Profile icon (no action yet) -->
        <button class="nav-item">
          <svg
            class="nav-icon-svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="8" r="4" fill="white" />
            <path
              d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <span class="nav-label">Profile</span>
        </button>

        <!-- AI icon (no route wired yet) -->
        <button class="nav-item">
          <svg
            class="nav-icon-svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <text
              x="12"
              y="14"
              text-anchor="middle"
              fill="white"
              font-size="10"
              font-weight="bold"
            >
              AI
            </text>
          </svg>
          <span class="nav-label">AI</span>
        </button>

        <button class="nav-item" on:click={goToCalendar}>
          <svg
            class="nav-icon-svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
              stroke="white"
              stroke-width="2"
            />
            <path
              d="M3 10H21M8 2V6M16 2V6"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
            <rect x="7" y="14" width="3" height="3" fill="white" />
            <rect x="14" y="14" width="3" height="3" fill="white" />
          </svg>
          <span class="nav-label">Calendar</span>
        </button>

        <button class="nav-item" on:click={goToCountdown}>
          <svg
            class="nav-icon-svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="13" r="9" stroke="white" stroke-width="2" />
            <path
              d="M12 13L12 8"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M12 13L15 15"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M10 3L14 3"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M12 3L12 4"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <span class="nav-label">Countdown</span>
        </button>

        <button class="nav-item" on:click={goToHome}>
          <svg
            class="nav-icon-svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 22V12H15V22"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="nav-label">Home</span>
        </button>
      </nav>
    </div>
  {/if}

  <!-- Child pages render here -->
  {@render children?.()}
</div>

<style>
  .app-layout {
    min-height: 100vh;
  }

  .sidebar {
    width: 70px;
    background: #03440c;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    position: fixed;
    height: 100vh;
    z-index: 1000;
  }

  .sidebar-header {
    margin-bottom: 40px;
  }

  .logo {
    font-size: 32px;
  }

  .logo svg {
    display: block;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .nav-icon-svg {
    width: 24px;
    height: 24px;
  }

  .nav-item {
    width: 60px;
    height: auto;
    border-radius: 12px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    padding: 6px 4px;
    gap: 4px;
  }

  .nav-item:hover,
  .nav-item.active {
    background: rgba(255, 255, 255, 0.2);
  }

  .nav-item svg {
    flex-shrink: 0;
  }

  .nav-label {
    font-size: 10px;
    color: #ffffff;
    text-align: center;
    line-height: 1.2;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      height: auto;
      position: fixed;
      bottom: 0;
      top: auto;
      flex-direction: row;
      padding: 10px 0;
      justify-content: space-around;
    }

    .sidebar-header {
      display: none;
    }

    .sidebar-nav {
      flex-direction: row;
      gap: 10px;
    }
  }
</style>
