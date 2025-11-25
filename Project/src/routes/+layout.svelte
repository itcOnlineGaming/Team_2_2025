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
	const hideSidebarOn = ['/end'];

	// Hide Back button on the base (home) page — computed like the /end logic (no $:)
	function isHomePath(pathname: string) {
		const home = base && base !== '' ? base : '/';
		const homeSlash = home.endsWith('/') ? home : `${home}/`;
		return pathname === home || pathname === homeSlash;
	}
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

      <!-- Back (hidden on home page) -->
			{#if !isHomePath($page.url.pathname)}
				<button class="nav-item" on:click={goToHome} type="button">
					<img class="nav-icon-img" src={base + '/Images/icons/back_arrow.png'} alt="Back" />
					<span class="nav-label">Back</span>
				</button>
			{/if}

			<nav class="sidebar-nav">
				<!-- Forest -->
				<button class="nav-item" on:click={goToForest} type="button">
					<img class="nav-icon-img" src={base + '/Images/icons/tree_button.png'} alt="Forest" />
					<span class="nav-label">Forest</span>
				</button>

				<!-- Home -->
				<button class="nav-item" on:click={goToHome} type="button">
					<img class="nav-icon-img" src={base + '/Images/icons/home_button.png'} alt="Home" />
					<span class="nav-label">Home</span>
				</button>

				<!-- Calendar -->
				<button class="nav-item" on:click={goToCalendar} type="button">
					<img class="nav-icon-img" src={base + '/Images/icons/Date_range.png'} alt="Calendar" />
					<span class="nav-label">Calendar</span>
				</button>

				<!-- Countdown (no PNG provided, keeping SVG) -->
				<button class="nav-item" on:click={goToCountdown} type="button">
					<svg class="nav-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="13" r="9" stroke="white" stroke-width="2" />
						<path d="M12 13L12 8" stroke="white" stroke-width="2" stroke-linecap="round" />
						<path d="M12 13L15 15" stroke="white" stroke-width="2" stroke-linecap="round" />
						<path d="M10 3L14 3" stroke="white" stroke-width="2" stroke-linecap="round" />
						<path d="M12 3L12 4" stroke="white" stroke-width="2" stroke-linecap="round" />
					</svg>
					<span class="nav-label">Countdown</span>
				</button>
			</nav>
		</div>
	{/if}

	<!-- Child pages render here -->
	{@render children?.()}
</div>

<style>
	:global(html, body, #svelte) {
		margin: 0;
		padding: 0;
		height: 100%;
	}

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

	.nav-icon-img {
		width: 34px;
		height: 34px;
		object-fit: contain;
		display: block;
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
