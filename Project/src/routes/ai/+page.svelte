<script lang="ts">
	import { base } from '$app/paths';
	import { tick } from 'svelte';

	type ChatMsg = { role: 'user' | 'ai'; content: string };

	let input = '';
	let loading = false;
	let error = '';

	let messages: ChatMsg[] = [
		{
			role: 'ai',
			content: "Hey! I'm your study buddy. Ask me to explain a topic, quiz you, or help plan what to study next."
		}
	];

	let scroller: HTMLDivElement | null = null;

	async function scrollToBottom() {
		await tick();
		if (scroller) scroller.scrollTop = scroller.scrollHeight;
	}

	function clearChat() {
		messages = [
			{
				role: 'ai',
				content:
					"Hey! I'm your study buddy. Ask me to explain a topic, quiz you, or help plan what to study next."
			}
		];
		error = '';
		input = '';
	}

	async function send() {
		if (!input.trim() || loading) return;

		error = '';
		const userText = input;
		input = '';

		messages = [...messages, { role: 'user', content: userText }];
		loading = true;
		await scrollToBottom();

		try {
			const res = await fetch(`${base}/api/gemini`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				// send full history so the server can build a prompt
				body: JSON.stringify({ messages })
			});

			const data = await res.json();

			if (!res.ok) {
				error = data?.error ?? `Request failed (HTTP ${res.status})`;
				return;
			}

			messages = [...messages, { role: 'ai', content: data.reply ?? '(no reply)' }];
			await scrollToBottom();
		} catch (e) {
			console.error(e);
			error = 'Request failed';
		} finally {
			loading = false;
		}
	}

	function onKeydown(e: KeyboardEvent) {
		// Enter = send, Shift+Enter = newline
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}
</script>

<div class="content">
	<!-- Header copied from your provided page (same structure & classes) -->
	<div class="header">
		<h1>AI</h1>

		<div class="header-right">
			<button class="clear-btn" on:click={clearChat} type="button">Clear</button>
			<input type="search" class="search-bar" placeholder="Search..." />
		</div>
	</div>

	<!-- Outer light-green frame like the sample -->
	<div class="frame">
		<!-- Teal “board” like the sample -->
		<div class="board">
			<div class="messages" bind:this={scroller}>
				{#each messages as m (m.role + m.content)}
					<div class="bubble {m.role}">
						<div class="label">{m.role === 'ai' ? 'AI:' : 'You:'}</div>
						<div class="text">{m.content}</div>
					</div>
				{/each}

				{#if loading}
					<div class="bubble ai">
						<div class="label">AI:</div>
						<div class="text muted">Thinking…</div>
					</div>
				{/if}
			</div>

			{#if error}
				<div class="error-pill">{error}</div>
			{/if}

			<!-- Bottom bar like the sample -->
			<div class="composer">
				<div class="composer-label">Ask AI:</div>
				<textarea
					class="composer-input"
					rows="1"
					bind:value={input}
					placeholder="Explain photosynthesis like I'm 12…"
					on:keydown={onKeydown}
				/>
				<button class="send-btn" on:click={send} disabled={loading || !input.trim()} type="button">
					Send
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	/* Same layout baseline as your provided page */
	.content {
		margin-left: 70px; /* your sidebar offset */
		padding: 20px 40px;
		min-height: 100vh;
		background: #abde9d;
	}

	.header {
		background: #03440c;
		padding: 15px 30px;
		border-radius: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
	}

	.header h1 {
		color: white;
		font-size: 40px;
		font-weight: 800;
		letter-spacing: 1px;
		margin: 0;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.search-bar {
		padding: 10px 16px;
		border-radius: 20px;
		border: none;
		width: 320px;
		font-size: 14px;
		outline: none;
	}

	.clear-btn {
		border: none;
		border-radius: 999px;
		padding: 10px 14px;
		background: rgba(255, 255, 255, 0.12);
		color: #fff;
		font-weight: 700;
		cursor: pointer;
	}

	.clear-btn:hover {
		background: rgba(255, 255, 255, 0.18);
	}

	/* Big light-green frame around the teal board */
	.frame {
		background: #bfe9b0;
		border-radius: 22px;
		padding: 22px;
		box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.12);
	}

	/* Teal board */
	.board {
		border-radius: 18px;
		min-height: 72vh;
		display: flex;
		flex-direction: column;
		padding: 18px;
		box-shadow:
			inset 0 0 0 2px rgba(255, 255, 255, 0.35),
			0 12px 28px rgba(0, 0, 0, 0.18);

		/* “textured” feel */
		background:
			radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.18), transparent 45%),
			radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.10), transparent 55%),
			linear-gradient(180deg, #7bb7bd, #70acb2);
	}

	.messages {
		flex: 1;
		overflow: auto;
		padding: 18px;
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	.bubble {
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 10px 18px rgba(0, 0, 0, 0.18);
		border: 2px solid rgba(0, 0, 0, 0.06);
		padding: 16px 18px;
		max-width: min(640px, 70%);
	}

	.bubble.ai {
		align-self: flex-start;
	}

	.bubble.user {
		align-self: flex-end;
	}

	.label {
		font-size: 28px;
		font-weight: 900;
		margin-bottom: 8px;
		letter-spacing: 0.5px;
	}

	.text {
		font-size: 16px;
		line-height: 1.35;
		white-space: pre-wrap;
	}

	.muted {
		opacity: 0.7;
	}

	.error-pill {
		margin: 8px 18px 0;
		background: rgba(255, 255, 255, 0.85);
		border-radius: 12px;
		padding: 12px 14px;
		font-weight: 700;
	}

	/* Bottom composer bar */
	.composer {
		margin: 14px 18px 6px;
		background: #3f3f3f;
		border-radius: 12px;
		padding: 14px;
		display: flex;
		align-items: center;
		gap: 12px;
		box-shadow: 0 10px 18px rgba(0, 0, 0, 0.2);
	}

	.composer-label {
		color: #fff;
		font-weight: 900;
		font-size: 18px;
		min-width: 70px;
	}

	.composer-input {
		flex: 1;
		border: none;
		outline: none;
		resize: none;
		background: transparent;
		color: #fff;
		font-size: 16px;
		line-height: 1.3;
		padding: 6px 2px;
		min-height: 24px;
		max-height: 120px;
		overflow: auto;
	}

	.composer-input::placeholder {
		color: rgba(255, 255, 255, 0.6);
	}

	.send-btn {
		border: none;
		border-radius: 999px;
		padding: 10px 16px;
		font-weight: 900;
		cursor: pointer;
		background: rgba(255, 255, 255, 0.75);
	}

	.send-btn:disabled {
		opacity: 0.5;
		cursor: default;
	}
</style>
