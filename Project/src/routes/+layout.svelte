<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	let { children } = $props();

	let isExpanded = $state(true);

	function toggleSidebar() {
		isExpanded = !isExpanded;
	}

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

	// Check if current path should hide sidebar
	function shouldHideSidebar(pathname: string) {
		return hideSidebarOn.some(route => pathname.endsWith(route));
	}

	// Hide Back button on the base (home) page
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
	{#if !shouldHideSidebar($page.url.pathname)}
		<!-- Sidebar with expandable state -->
		<div class="sidebar" class:expanded={isExpanded}>
			<div class="sidebar-content">
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
					{#if isExpanded}
						<span class="brand-name">TreeApp</span>
					{/if}
				</div>

				<!-- Back (hidden on home page) -->
				{#if !isHomePath($page.url.pathname)}
					<button class="nav-item" on:click={goToHome} type="button">
						<img class="nav-icon-img" src={base + '/Images/icons/back_arrow.png'} alt="Back" />
						{#if isExpanded}
							<span class="nav-label">Back</span>
						{/if}
					</button>
				{/if}

				<nav class="sidebar-nav">
					<!-- Forest -->
					<button class="nav-item" on:click={goToForest} type="button">
						<img class="nav-icon-img" src={base + '/Images/icons/tree_button.png'} alt="Forest" />
						{#if isExpanded}
							<span class="nav-label">Forest</span>
						{/if}
					</button>

					<!-- Home -->
					<button class="nav-item" on:click={goToHome} type="button">
						<img class="nav-icon-img" src={base + '/Images/icons/home_button.png'} alt="Home" />
						{#if isExpanded}
							<span class="nav-label">Home</span>
						{/if}
					</button>

					<!-- Calendar -->
					<button class="nav-item" on:click={goToCalendar} type="button">
						<img class="nav-icon-img" src={base + '/Images/icons/Date_range.png'} alt="Calendar" />
						{#if isExpanded}
							<span class="nav-label">Calendar</span>
						{/if}
					</button>

					<!-- Countdown -->
					<button class="nav-item" on:click={goToCountdown} type="button">
						<svg class="nav-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
							<circle cx="12" cy="13" r="9" stroke="white" stroke-width="2" />
							<path d="M12 13L12 8" stroke="white" stroke-width="2" stroke-linecap="round" />
							<path d="M12 13L15 15" stroke="white" stroke-width="2" stroke-linecap="round" />
							<path d="M10 3L14 3" stroke="white" stroke-width="2" stroke-linecap="round" />
							<path d="M12 3L12 4" stroke="white" stroke-width="2" stroke-linecap="round" />
						</svg>
						{#if isExpanded}
							<span class="nav-label">Countdown</span>
						{/if}
					</button>
				</nav>
			</div>

			<!-- Toggle button on right edge -->
			<button class="toggle-btn" on:click={toggleSidebar} type="button" aria-label="Toggle sidebar">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					{#if isExpanded}
						<!-- Left arrow "<" -->
						<path d="M10 4L6 8L10 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					{:else}
						<!-- Right arrow ">" -->
						<path d="M6 4L10 8L6 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					{/if}
				</svg>
			</button>
		</div>

		<!-- Overlay when expanded (optional - for mobile/tablet) -->
		{#if isExpanded}
			<div class="sidebar-overlay" on:click={toggleSidebar}></div>
		{/if}
	{/if}

	<!-- Child pages render here -->
	<main 
		class="main-content" 
		class:shifted={isExpanded && !shouldHideSidebar($page.url.pathname)}
		class:no-sidebar={shouldHideSidebar($page.url.pathname)}
	>
		{@render children?.()}
	</main>
</div>

<style>
	:global(html, body, #svelte) {
		margin: 0;
		padding: 0;
		height: 100%;
	}

	.app-layout {
		min-height: 100vh;
		position: relative;
	}

	.sidebar {
		width: 70px;
		background: #03440c;
		display: flex;
		flex-direction: column;
		position: fixed;
		left: 0;
		top: 0;
		height: 100vh;
		z-index: 1000;
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
	}

	.sidebar.expanded {
		width: 220px;
	}

	.sidebar-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 20px 0;
		overflow: hidden;
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 0 15px;
		margin-bottom: 40px;
		width: 100%;
	}

	.logo svg {
		display: block;
		flex-shrink: 0;
	}

	.brand-name {
		font-size: 18px;
		font-weight: 600;
		color: #90EE90;
		white-space: nowrap;
		animation: fadeIn 0.3s ease-in-out;
	}

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		padding: 0 5px;
	}

	.nav-item {
		width: 100%;
		height: auto;
		min-height: 50px;
		border-radius: 12px;
		border: none;
		background: transparent;
		cursor: pointer;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		gap: 12px;
		transition: all 0.2s;
		padding: 8px 10px;
		color: white;
	}

	.nav-item:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.nav-item:active {
		background: rgba(255, 255, 255, 0.25);
	}

	.nav-icon-svg {
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		margin-left: 5px;
	}

	.nav-icon-img {
		width: 34px;
		height: 34px;
		object-fit: contain;
		display: block;
		flex-shrink: 0;
	}

	.nav-label {
		font-size: 14px;
		color: #ffffff;
		font-weight: 500;
		white-space: nowrap;
		animation: fadeIn 0.3s ease-in-out;
	}

	.toggle-btn {
		position: absolute;
		right: -12px;
		top: 50%;
		transform: translateY(-50%);
		width: 24px;
		height: 40px;
		background: #03440c;
		border: none;
		border-radius: 0 8px 8px 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
		z-index: 1001;
	}

	.toggle-btn:hover {
		background: #055014;
		right: -14px;
	}

	.toggle-btn:active {
		background: #077019;
	}

	.sidebar-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 999;
		animation: fadeIn 0.3s ease-in-out;
	}

	.main-content {
		margin-left: 70px;
		transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		min-height: 100vh;
	}

	.main-content.shifted {
		margin-left: 220px;
	}

	.main-content.no-sidebar {
		margin-left: 0;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Mobile styles */
	@media (max-width: 768px) {
		.sidebar {
			width: 100%;
			height: auto;
			position: fixed;
			bottom: 0;
			top: auto;
			left: 0;
			flex-direction: row;
			padding: 10px 0;
			box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
		}

		.sidebar.expanded {
			width: 100%;
			height: auto;
		}

		.sidebar-content {
			flex-direction: row;
			padding: 0;
			width: 100%;
			justify-content: space-around;
		}

		.sidebar-header {
			display: none;
		}

		.sidebar-nav {
			flex-direction: row;
			gap: 10px;
			padding: 0;
			justify-content: space-around;
			width: 100%;
		}

		.nav-item {
			flex-direction: column;
			gap: 4px;
			min-height: auto;
			width: auto;
			padding: 8px 12px;
		}

		.nav-label {
			font-size: 10px;
			animation: none;
		}

		.toggle-btn {
			display: none;
		}

		.sidebar-overlay {
			display: none;
		}

		.main-content {
			margin-left: 0;
			margin-bottom: 70px;
		}

		.main-content.shifted {
			margin-left: 0;
		}

		.nav-icon-img {
			width: 28px;
			height: 28px;
		}

		.nav-icon-svg {
			width: 20px;
			height: 20px;
			margin-left: 0;
		}
	}
</style>