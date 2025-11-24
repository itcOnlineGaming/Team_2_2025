<script lang="ts">
  type ChatMessage = {
    role: 'user' | 'model';
    content: string;
  };

  let messages: ChatMessage[] = [
    {
      role: 'model',
      content:
        "Hi! I'm your AI helper powered by Gemini. Ask me anything about your work, studies, or tasks."
    }
  ];

  let input = '';
  let isLoading = false;
  let error = '';

  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    messages = [...messages, userMsg];
    input = '';
    error = '';
    isLoading = true;

    try {
      const res = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || 'Request failed');
      }

      const data = await res.json();
      const botMsg: ChatMessage = { role: 'model', content: data.text };
      messages = [...messages, botMsg];
    } catch (e: any) {
      console.error(e);
      error = e?.message ?? 'Something went wrong talking to Gemini.';
    } finally {
      isLoading = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
</script>

<main class="ai-page">
  <div class="ai-header">
    <h1>AI Assistant</h1>
    <p>Ask questions, brainstorm ideas, or get help with your tasks.</p>
  </div>

  <div class="chat-card">
    <div class="messages">
      {#each messages as msg}
        <div class="message-row {msg.role}">
          <div class="bubble">
            <div class="meta">
              <span class="who">{msg.role === 'user' ? 'You' : 'Gemini Bot'}</span>
            </div>
            <div class="text">
              {msg.content}
            </div>
          </div>
        </div>
      {/each}

      {#if isLoading}
        <div class="message-row model">
          <div class="bubble typing">
            <span>Gemini is thinking…</span>
          </div>
        </div>
      {/if}
    </div>

    {#if error}
      <div class="error-banner">
        {error}
      </div>
    {/if}

    <form class="input-row" on:submit|preventDefault={sendMessage}>
      <textarea
        bind:value={input}
        placeholder="Type your message and press Enter (Shift+Enter for new line)…"
        rows="2"
        on:keydown={handleKeydown}
      ></textarea>
      <button type="submit" disabled={isLoading || !input.trim()}>
        {isLoading ? 'Sending…' : 'Send'}
      </button>
    </form>
  </div>
</main>

<style>
  .ai-page {
    min-height: 100vh;
    padding: 20px 40px;
    background: #abde9d;
    /* your other pages usually do margin-left:70px for the sidebar */
    margin-left: 70px;
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    .ai-page {
      margin-left: 0;
      padding: 15px 20px;
      padding-bottom: 80px; /* room for bottom sidebar on mobile */
    }
  }

  .ai-header {
    background: #03440c;
    padding: 15px 30px;
    border-radius: 12px;
    color: white;
    margin-bottom: 20px;
  }

  .ai-header h1 {
    margin: 0 0 6px;
    font-size: 24px;
  }

  .ai-header p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }

  .chat-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 140px);
    max-height: 800px;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px 4px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .message-row {
    display: flex;
  }

  .message-row.user {
    justify-content: flex-end;
  }

  .message-row.model {
    justify-content: flex-start;
  }

  .bubble {
    max-width: 70%;
    border-radius: 14px;
    padding: 10px 14px;
    font-size: 14px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  .message-row.user .bubble {
    background: #03440c;
    color: white;
    border-bottom-right-radius: 2px;
  }

  .message-row.model .bubble {
    background: #f3f4f6;
    color: #111827;
    border-bottom-left-radius: 2px;
  }

  .meta {
    font-size: 11px;
    margin-bottom: 4px;
    opacity: 0.75;
  }

  .who {
    font-weight: 600;
  }

  .text {
    white-space: pre-wrap;
    line-height: 1.5;
  }

  .typing {
    font-style: italic;
    opacity: 0.8;
  }

  .error-banner {
    margin-top: 8px;
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    background: #fee2e2;
    color: #991b1b;
    font-size: 13px;
  }

  .input-row {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    border-top: 1px solid #e5e7eb;
    padding-top: 10px;
  }

  .input-row textarea {
    flex: 1;
    resize: none;
    border-radius: 10px;
    border: 2px solid #e5e7eb;
    padding: 10px 12px;
    font-size: 14px;
    font-family: inherit;
  }

  .input-row textarea:focus {
    outline: none;
    border-color: #03440c;
    box-shadow: 0 0 0 2px rgba(3, 68, 12, 0.12);
  }

  .input-row button {
    padding: 0 18px;
    border-radius: 10px;
    border: none;
    background: #03440c;
    color: white;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
  }

  .input-row button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
