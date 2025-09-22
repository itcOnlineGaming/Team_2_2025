<h1 class="text-2xl font-semibold">Start Page</h1>
<button on:click={openFile} style="padding: 0.5rem 1rem;">Open .md File</button>
{#if fileName}
  <span style="font-size: 0.9rem; color: #888;">{fileName}</span>
{/if}

<p>This is a placeholder for the writing experience.</p>

{#if fileContent}
  <h2>Editing Markdown:</h2>
  <textarea
    bind:this={textareaRef}
    bind:value={fileContent}
    rows="12"
    style="width: 100%; font-family: monospace;"
    on:input={handleInput}
    on:click={() => caretPos = textareaRef?.selectionStart || 0}
    on:keyup={() => caretPos = textareaRef?.selectionStart || 0}
  ></textarea>
  <h3>Preview (bold after caret):</h3>
  <div style="white-space: pre-wrap; border: 1px solid #ccc; padding: 1rem; margin-top: 0.5rem; background: #fafafa;">
    {@html getHighlightedContent(fileContent)}
  </div>
{/if}

<script lang="ts">
  let fileContent = '';
  let fileName = '';
  let fileHandle: any = null;
  let caretPos = 0;
  let textareaRef: HTMLTextAreaElement | null = null;

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
    fileContent = await file.text();
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
</script>
