<script lang="ts">
	import { goto } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import '../lib/styles.css';

	function goBack() {
		history.length > 1 ? history.back() : goto('/');
	}

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-layout">
	<header class="header">
		<button class="back-button" onclick={goBack} type="button">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="m15 18-6-6 6-6"/>
			</svg>
			<span>Back</span>
		</button>
	</header>
	
	<main class="main-content">
		{@render children?.()}
	</main>
</div>
