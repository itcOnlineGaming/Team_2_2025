<script lang="ts">
  export let onClose: () => void;
</script>

<div class="win-popup-backdrop">
  <div class="win-popup">
    <h2>🎉 your safe for now ! 🎉</h2>
    <p>You reached your word count goal!</p>
    <button on:click={onClose}>Close</button>
  </div>
</div>

<style>
.win-popup-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.win-popup {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  text-align: center;
}
.win-popup h2 {
  margin-bottom: 1rem;
}
.win-popup button {
  margin-top: 1.5rem;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: #86efac;
  color: #111827;
  font-weight: 600;
  cursor: pointer;
}
</style>
