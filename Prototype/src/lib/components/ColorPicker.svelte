<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let color = '#86efac'; [cite: 24]
  function selectColor(e: Event) {
    color = (e.target as HTMLInputElement).value;
    dispatch('color', { color });
  } [cite: 26]
</script>

<div class="color-picker-modal">
  <div class="color-picker-content">
    <h2>Pick your profile color</h2>
    <input type="color" bind:value={color} on:input={selectColor} />
    <div class="color-preview" style="background: {color}"></div> [cite: 29]
    <button class="confirm-btn" on:click={() => dispatch('confirm', { color })}>Confirm</button>
  </div>
</div>

<style>
.color-picker-modal {
  position: fixed;
  inset: 0; [cite: 27]
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.color-picker-content {
  background: #fff;
  padding: 2rem;
  border-radius: 1rem; [cite: 28]
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
/* ADDED: Explicitly set input color/background for visibility */
.color-picker-content input[type="color"] {
  color: #111827; /* Dark text */
  background-color: #ffffff; /* White background */
}
.color-preview {
  width: 3rem;
  height: 3rem; [cite: 29]
  border-radius: 50%;
  border: 2px solid #ccc;
}
.confirm-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: #86efac;
  color: #111827; [cite: 30]
  font-weight: 600;
  cursor: pointer;
}
</style>