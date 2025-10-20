<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import WinPopup from '$lib/components/WinPopup.svelte';

  let fileContent = '';
  let fileName = '';
  let fileHandle: any = null;
  let caretPos = 0;
  let textareaRef: HTMLTextAreaElement | null = null;
  let editorRef: HTMLDivElement | null = null;

  // =========================
  // Timer & routing
  // =========================
  let secondsLeft = 60;
  let timerId: any = null;
  let hasFinished = false;
  let showWinPopup = false;

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function startTimer() {
    clearInterval(timerId);
    secondsLeft = 60;
    hasFinished = false;
    timerId = setInterval(() => {
      secondsLeft = Math.max(0, secondsLeft - 1);
      if (secondsLeft === 0 && !hasFinished) {
        evaluateAndRoute();
      }
    }, 1000);
  }

  function evaluateAndRoute() {
    hasFinished = true;
    clearInterval(timerId);
    // Decide based on current word count
    if (wordCount < 50) {
      // Failure screen
      window.location.href = '/failureScreen';
    } else {
      // Win popup, then home
      showWinPopup = true;
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  }
  // Show win popup immediately if wordCount is reached before timer ends
  $: if (wordCount >= 50 && !showWinPopup && !hasFinished) {
    showWinPopup = true;
    hasFinished = true;
    clearInterval(timerId);
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }

  onMount(() => {
    startTimer();
    return () => clearInterval(timerId);
  });

  onDestroy(() => {
    clearInterval(timerId);
  });

  // Open file picker and read .md file
  async function openFile() {
    [fileHandle] = await (window as any).showOpenFilePicker({
      types: [
        {
          description: 'Markdown Files',
          accept: { 'text/markdown': ['.md'] }
        }
      ]
    });
    fileName = fileHandle.name;
    const file = await fileHandle.getFile();
    fileContent = await fileHandle.getFile().then(f => f.text());
  }

  // Save file automatically
  async function saveFile() {
    if (!fileHandle) return;
    const writable = await fileHandle.createWritable();
    await writable.write(fileContent);
    await writable.close();
  }

  // Track caret position and save on input
  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    caretPos = target.selectionStart;
    fileContent = target.value;
    saveFile();
  }

  // Highlight/bold all text after the caret position
  function getHighlightedContent(content: string) {
    // Always show preview, even if empty
    if (content.length === 0) return '<b></b>';
    // Always bold after caret, even at end
    return (
      content.slice(0, caretPos) +
      '<b>' + content.slice(caretPos) + '</b>'
    );
  }

  // Word count derived from fileContent
  $: wordCount = fileContent.trim().length === 0 ? 0 : fileContent.trim().split(/\s+/).length;

  function findWord() {
    const word = prompt('Enter word to find:');
    if (!word || !textareaRef) return;
    const idx = fileContent.indexOf(word);
    if (idx !== -1) {
      textareaRef.focus();
      textareaRef.setSelectionRange(idx, idx + word.length);
      caretPos = idx + word.length;
    } else {
      alert('Word not found.');
    }
  }
  function undoEdit() {
    textareaRef?.focus();
    document.execCommand('undo');
  }
  function redoEdit() {
    textareaRef?.focus();
    document.execCommand('redo');
  }

  // Helper: get caret position in contenteditable
  function getCaretPosition() {
    const sel = window.getSelection();
    if (!sel || !editorRef || sel.rangeCount === 0) return 0;
    const range = sel.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editorRef);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  }

  // Helper: set caret position in contenteditable
  function setCaretPosition(pos: number) {
    if (!editorRef) return;
    const node = editorRef.firstChild;
    if (!node) return;
    const range = document.createRange();
    const sel = window.getSelection();
    let chars = 0;
    function set(node: any) {
      if (node.nodeType === 3) {
        const next = chars + node.length;
        if (chars <= pos && pos <= next) {
          range.setStart(node, pos - chars);
          range.collapse(true);
        }
        chars = next;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          set(node.childNodes[i]);
        }
      }
    }
    set(node);
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  // Helper: set caret at the end of the last <b> in the current sentence
  function setCaretAtEndOfLastBold() {
    if (!editorRef) return;
    const bolds = editorRef.querySelectorAll('b');
    if (bolds.length === 0) return;
    const lastBold = bolds[bolds.length - 1];
    const range = document.createRange();
    range.selectNodeContents(lastBold);
    range.collapse(false);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  // Helper: set caret at a given character offset in the editor
  function setCaretByCharOffset(offset: number) {
    if (!editorRef) return;
    let chars = 0;
    let found = false;
    function traverse(node: any) {
      if (found) return;
      if (node.nodeType === 3) {
        const next = chars + node.length;
        if (chars <= offset && offset <= next) {
          const range = document.createRange();
          range.setStart(node, offset - chars);
          range.collapse(true);
          const sel = window.getSelection();
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
          }
          found = true;
        }
        chars = next;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          traverse(node.childNodes[i]);
        }
      }
    }
    traverse(editorRef);
  }

  // Format the current sentence (from last full stop or start to caret) as bold
  function formatSentenceBold() {
    if (!editorRef) return;
    const caret = getCaretPosition();
    const text = editorRef.innerText;
    let lastDot = text.lastIndexOf('.', caret - 1);
    lastDot = lastDot === -1 ? 0 : lastDot + 1;
    const before = text.slice(0, lastDot);
    const sentence = text.slice(lastDot, caret);
    const after = text.slice(caret);
    // Only update if needed
    const formatted = before + sentence.replace(/(\S+)/g, '<b>$1</b>') + after;
    if (editorRef.innerHTML !== formatted.replace(/\n/g, '<br>')) {
      editorRef.innerHTML = formatted.replace(/\n/g, '<br>');
      setCaretByCharOffset(caret);
    }
    fileContent = editorRef.innerText;
    saveFile();
  }

  // On input or caret move, format
  let formatTimeout: any;
  function handleEditorInput() {
    clearTimeout(formatTimeout);
    formatTimeout = setTimeout(formatSentenceBold, 0);
  }
</script>

<h1 class="text-2xl font-semibold" style="display:inline-block; margin-right:1rem;">Start Page</h1>
<div style="display:inline-flex; gap:0.5rem; align-items:center; vertical-align:middle;">
  <button title="Get Document" on:click={openFile} style="font-size:1.3rem; background:none; border:none; cursor:pointer;">📂</button>
  <button title="Save Document" on:click={saveFile} style="font-size:1.3rem; background:none; border:none; cursor:pointer;">💾</button>
  <button title="Find Word" on:click={findWord} style="font-size:1.3rem; background:none; border:none; cursor:pointer;">🔍</button>
  <button title="Undo" on:click={undoEdit} style="font-size:1.3rem; background:none; border:none; cursor:pointer;">↩️</button>
  <button title="Redo" on:click={redoEdit} style="font-size:1.3rem; background:none; border:none; cursor:pointer;">↪️</button>
</div>
{#if fileName}
  <span style="font-size: 0.9rem; color: #888; margin-left:1rem;">{fileName}</span>
{/if}

<p>This is a placeholder for the writing experience.</p>

{#if true}
  {#if showWinPopup}
    <WinPopup onClose={() => (showWinPopup = false)} />
  {/if}
  <h2>Editing Markdown:</h2>

  <!-- Timer + Word Count bar -->
  <div class="markdown-editor-bar" style="display:flex; align-items:center; gap:.75rem; margin: .25rem 0 .75rem; color:#666; font-size:.95em;">
    <div><strong>Word count:</strong> {wordCount}</div>
    <div style="display:flex; align-items:center; gap:.5rem;">
      <strong>Time left:</strong>
      <span aria-live="polite" style="font-variant-numeric: tabular-nums;">{formatTime(secondsLeft)}</span>
    </div>
  </div>

  <!-- Simple progress bar for the minute -->
  <div style="height:8px; background:#eee; border-radius:999px; overflow:hidden; margin-bottom:.75rem;">
    <div
      style="
        height:100%;
        width:{(60 - secondsLeft) / 60 * 100}%;
        background:#8BAA8B;
        transition: width .25s linear;
      "
    />
  </div>

  <div
    bind:this={editorRef}
    contenteditable="true"
    style="width: 100%; min-height: 8em; font-family: monospace; border: 1px solid #ccc; padding: 0.5rem; background: #fff;"
    on:input={handleEditorInput}
    on:keyup={handleEditorInput}
    on:mouseup={handleEditorInput}
  >{fileContent}</div>
{/if}
