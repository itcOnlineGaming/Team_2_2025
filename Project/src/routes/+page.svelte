<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  interface ChecklistItem { id: string; text: string; completed: boolean; }

  let showFeelingModal = false;
  let selectedFeeling: number | null = null;
  let feelingsLog: Array<{date: string, feeling: number, note: string}> = [];
  let currentNote = '';

  let showWelcomePopup = true;
  let agreedToTest = false;

  let checklist: ChecklistItem[] = [
    { id: 'add_column', text: 'Add a new column', completed: false },
    { id: 'add_task', text: 'Add a task to any column', completed: false }
  ];

  onMount(() => {
    const saved = localStorage.getItem('feelingsLog');
    if (saved) {
      feelingsLog = JSON.parse(saved);
    }

    localStorage.setItem('agreedToTest', 'true');
    const savedChecklist = localStorage.getItem('checklist','true');
    
    //if (savedAgreement === 'true') {
      //showWelcomePopup = false;
      //agreedToTest = true;
    //}
    
    if (savedChecklist) {
      checklist = JSON.parse(savedChecklist);
    }
  });

  function clearChecklist() {
     checklist = checklist.map(item => ({ ...item, completed: false }));
     localStorage.removeItem('checklist');
  }

  function handleAgree() {
    if (agreedToTest) {
      localStorage.setItem('agreedToTest', 'true');
      showWelcomePopup = false;
    }
  }

  function goToBoard() {
    goto('/board');
  }

  function goToCountDown() {
    goto('/countdown');
  }

  function openFeelingModal(level: number) {
    selectedFeeling = level;
    showFeelingModal = true;
  }

  function saveFeelingEntry() {
    if (selectedFeeling !== null) {
      const entry = {
        date: new Date().toLocaleString(),
        feeling: selectedFeeling,
        note: currentNote
      };
      feelingsLog = [entry, ...feelingsLog];
      
      // Save to localStorage
      localStorage.setItem('feelingsLog', JSON.stringify(feelingsLog));
      
      // Reset
      showFeelingModal = false;
      currentNote = '';
      selectedFeeling = null;
    }
  }

  function downloadLog() {
    const content = feelingsLog.map(entry => 
      `${entry.date} - Feeling: ${entry.feeling}/5${entry.note ? ` - ${entry.note}` : ''}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feelings-log-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function getEmojiForFeeling(feeling: number): string {
    const emojis = ['😢', '😕', '😐', '😊', '🤩'];
    return emojis[feeling - 1];
  }
</script>

<main>
  <!-- Welcome Popup Overlay -->
  {#if showWelcomePopup}
    <div class="welcome-overlay">
      <div class="welcome-popup">
        <h2>Welcome to the Project Board Test</h2>
        <p>Hello! If you are here, you are likely helping us test our app. We are a group of 7 students conducting this usability test. At the end, there will be a short questionnaire for your feedback.</p>
        <p>This is just a reminder: we are not collecting or storing any sensitive data. Your responses are completely anonymous. We appreciate any feedback, so please share your honest thoughts to help us improve our app!</p>

        
        <div class="agreement-section">
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={agreedToTest} />
            <span>I agree to participate in this test and am comfortable using this application, as well as completing the short questionnaire at the end.</span>
          </label>
        </div>

        <button 
          class="agree-button" 
          on:click={handleAgree}
          disabled={!agreedToTest}
        >
          Get Started
        </button>
      </div>
    </div>
  {/if}

  <!-- Checklist -->
  {#if !showWelcomePopup}
    <div class="checklist">
      <h3>✓ Test Tasks</h3>
      {#each checklist as item (item.id)}
        <div class="checklist-item" class:completed={item.completed}>
          <span class="checkbox-display">{item.completed ? '✓' : ''}</span>
          <span class="checklist-text">{item.text}</span>
        </div>
      {/each}
      <button class="clear-checklist-button" on:click={clearChecklist}>
        Clear Checklist
    </button>
  </div>
  {/if}

  <section class="container">
    <div class="header">
      <div class="title-badge">
        <h1>✨ Task Board App</h1>
      </div>
      
      <p class="subtitle">
        Plan your day, manage your work, and stay on top of your tasks.
      </p>
    </div>

    <button class="main-button" on:click={goToBoard}>
      Go to Project Board
    </button>

    <button class="main-button" on:click={goToCountDown}>
      Go to Countdown
    </button>

    <div class="feelings-section">
      <p class="feelings-title">
        How are you feeling today?
      </p>

      <div class="buttons-container">
        {#each [1, 2, 3, 4, 5] as num}
          <button class="feeling-button" on:click={() => openFeelingModal(num)}>
            {num}
          </button>
        {/each}
      </div>

      {#if feelingsLog.length > 0}
        <div class="log-section">
          <div class="log-header">
            <h3>Recent Entries</h3>
            <button class="download-button" on:click={downloadLog}>
              📥 Download Log
            </button>
          </div>
          <div class="log-entries">
            {#each feelingsLog.slice(0, 5) as entry}
              <div class="log-entry">
                <div class="entry-content">
                  <span class="entry-emoji">{getEmojiForFeeling(entry.feeling)}</span>
                  <div>
                    <p class="entry-date">{entry.date}</p>
                    {#if entry.note}
                      <p class="entry-note">{entry.note}</p>
                    {/if}
                  </div>
                </div>
                <span class="entry-score">{entry.feeling}/5</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
    
  </section>
</main>

{#if showFeelingModal}
  <div 
    class="modal-backdrop" 
    on:click={() => showFeelingModal = false}
    on:keydown={(e) => e.key === 'Escape' && (showFeelingModal = false)}
    role="button"
    tabindex="0"
    aria-label="Close modal"
  >
    <div 
      class="modal-content" 
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
    >
      <div class="modal-header">
        <div class="modal-emoji">{selectedFeeling ? getEmojiForFeeling(selectedFeeling) : '😊'}</div>
        <h2 id="modal-title" class="modal-title">
          You're feeling {selectedFeeling}/5
        </h2>
        <p class="modal-subtitle">Add a note about your day (optional)</p>
      </div>

      <textarea
        bind:value={currentNote}
        placeholder="What's on your mind?"
        class="modal-textarea"
        rows="4"
      ></textarea>

      <div class="modal-buttons">
        <button class="cancel-button" on:click={() => showFeelingModal = false}>
          Cancel
        </button>
        <button class="save-button" on:click={saveFeelingEntry}>
          Save Entry
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    padding: 20px;
  }

  /* Welcome Popup Styles */
  .welcome-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    backdrop-filter: blur(4px);
  }

  .welcome-popup {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    animation: slideIn 0.4s ease;
  }

  .welcome-popup h2 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 28px;
    font-weight: 700;
  }

  .welcome-popup p {
    margin: 0 0 24px 0;
    color: #666;
    font-size: 16px;
    line-height: 1.6;
  }

  .agreement-section {
    background: #f9fafb;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-label input[type="checkbox"] {
    margin-top: 2px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .checkbox-label span {
    color: #374151;
    font-size: 15px;
    line-height: 1.5;
  }

  .clear-checklist-button {
  margin-top: 16px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #f87171; /* red-ish */
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-checklist-button:hover {
  background: #ef4444;
}


  .agree-button {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
  }

  .agree-button:hover:not(:disabled) {
    transform: scale(1.02);
  }

  .agree-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Checklist Styles */
  .checklist {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    min-width: 250px;
    z-index: 1500;
  }

  .checklist h3 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 18px;
    font-weight: 700;
  }

  .checklist-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    margin-bottom: 8px;
    border-radius: 8px;
    background: #f9fafb;
    transition: all 0.3s ease;
  }

  .checklist-item.completed {
    background: #d1fae5;
  }

  .checkbox-display {
    width: 24px;
    height: 24px;
    border: 2px solid #d1d5db;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .checklist-item.completed .checkbox-display {
    background: #10b981;
    border-color: #10b981;
    color: white;
  }

  .checklist-text {
    color: #374151;
    font-size: 14px;
    line-height: 1.4;
  }

  .checklist-item.completed .checklist-text {
    color: #059669;
    font-weight: 500;
  }

  .container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border-radius: 24px;
    padding: 48px;
    width: 100%;
    max-width: 700px;
  }

  .header {
    text-align: center;
    margin-bottom: 40px;
  }

  .title-badge {
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 16px;
    padding: 16px 32px;
    margin-bottom: 24px;
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }

  .title-badge h1 {
    font-size: 40px;
    font-weight: 800;
    margin: 0;
  }

  .subtitle {
    color: #4b5563;
    font-size: 18px;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .main-button {
    width: 100%;
    padding: 16px;
    margin-bottom: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 20px;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    cursor: pointer;
    transition: all 0.2s;
  }

  .main-button:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
  }

  .main-button:active {
    transform: scale(0.95);
  }

  .feelings-section {
    background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%);
    border-radius: 16px;
    padding: 32px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  }

  .feelings-title {
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 32px 0;
    text-align: center;
  }

  .buttons-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 32px;
  }

  .feeling-button {
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    border: 2px solid #e5e7eb;
    font-size: 28px;
    font-weight: 700;
    background: white;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .feeling-button:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: transparent;
    transform: scale(1.1);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  }

  .feeling-button:active {
    transform: scale(0.95);
  }

  .log-section {
    margin-top: 32px;
    padding-top: 32px;
    border-top: 2px solid #e5e7eb;
  }

  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .log-header h3 {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .download-button {
    font-size: 14px;
    background: #667eea;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(102, 126, 234, 0.2);
    transition: all 0.2s;
  }

  .download-button:hover {
    background: #5568d3;
    box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
  }

  .log-entries {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 320px;
    overflow-y: auto;
    padding-right: 8px;
  }

  .log-entries::-webkit-scrollbar {
    width: 8px;
  }

  .log-entries::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .log-entries::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #667eea, #764ba2);
    border-radius: 10px;
  }

  .log-entry {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: box-shadow 0.2s;
  }

  .log-entry:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .entry-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .entry-emoji {
    font-size: 28px;
  }

  .entry-date {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
    margin: 0 0 4px 0;
  }

  .entry-note {
    font-size: 14px;
    color: #374151;
    margin: 0;
  }

  .entry-score {
    font-size: 20px;
    font-weight: 700;
    color: #667eea;
    margin-left: 16px;
  }

  .icon-btn {
    background: white;
    color: #667eea;
    padding: 12px 20px;
    border: 2px solid #667eea;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .icon-btn:hover {
    background: #667eea;
    color: white;
    transform: scale(1.05);
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 24px;
    padding: 40px;
    max-width: 450px;
    width: 100%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    animation: bounce-in 0.3s ease-out;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .modal-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .modal-emoji {
    font-size: 80px;
    margin-bottom: 24px;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  .modal-title {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 12px 0;
  }

  .modal-subtitle {
    font-size: 16px;
    color: #6b7280;
    margin: 0;
  }

  .modal-textarea {
    width: 100%;
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 15px;
    color: #374151;
    resize: none;
    margin-bottom: 32px;
    font-family: inherit;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  .modal-textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .modal-buttons {
    display: flex;
    gap: 16px;
  }

  .cancel-button,
  .save-button {
    flex: 1;
    padding: 16px;
    font-size: 18px;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .cancel-button {
    background: #e5e7eb;
    color: #374151;
  }

  .cancel-button:hover {
    background: #d1d5db;
  }

  .save-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .save-button:hover {
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  }

  .cancel-button:active,
  .save-button:active {
    transform: scale(0.95);
  }

  @media (max-width: 640px) {
    .container {
      padding: 32px 24px;
    }

    .title-badge h1 {
      font-size: 32px;
    }

    .subtitle {
      font-size: 16px;
    }

    .main-button {
      font-size: 18px;
    }

    .feeling-button {
      width: 60px;
      height: 60px;
      font-size: 24px;
    }

    .buttons-container {
      gap: 12px;
    }

    .modal-content {
      padding: 32px 24px;
    }

    .modal-emoji {
      font-size: 64px;
    }

    .modal-title {
      font-size: 24px;
    }

    .checklist {
      top: 10px;
      right: 10px;
      min-width: 220px;
      padding: 16px;
    }
  }
</style>