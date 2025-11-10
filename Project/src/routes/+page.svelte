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
    { id: 'add_task', text: 'Add a task to any column', completed: false },
    { id: 'remove_column', text: 'Remove a column', completed: false },
    { id: 'remove_task', text: 'Remove a task from any column', completed: false },
    { id: 'set_time', text: 'Set a time on the countdown', completed: false },
    { id: 'start_timer', text: 'Start the countdown timer', completed: false },
    { id: 'stop_timer', text: 'Stop/pause the countdown timer', completed: false }
  ];

  onMount(() => {
    const saved = localStorage.getItem('feelingsLog');
    if (saved) {
      feelingsLog = JSON.parse(saved);
    }

    localStorage.setItem('agreedToTest', 'true');
    const savedChecklist = localStorage.getItem('checklist'); // fixed: getItem only takes the key

    // If you later want to persist agreement state, uncomment & wire up:
    // const savedAgreement = localStorage.getItem('agreedToTest');
    // if (savedAgreement === 'true') {
    //   showWelcomePopup = false;
    //   agreedToTest = true;
    // }

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
        <h1>✨ Study Guide App ✨</h1>
      </div>

      <p class="subtitle">
        Plan your day, manage your work, and stay on top of your tasks.
      </p>
    </div>

    <button class="main-button" on:click={goToBoard}>
      Go to Task Board
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
