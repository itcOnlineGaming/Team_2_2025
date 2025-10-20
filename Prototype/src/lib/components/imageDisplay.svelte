<!-- src/lib/components/ImageDisplay.svelte -->
<script lang="ts">
  // Props - what the parent component can customize
  export let src = '';
  export let alt = '';
  export let width = 400;
  export let height = 300;
  
  // Internal state - manages loading and error states
  let imageLoaded = false;
  let imageError = false;
  
  // Helper function to generate placeholder URL
  function getPlaceholderUrl(w : number, h : number) {
    return `https://picsum.photos/${w}/${h}?random=${Math.floor(Math.random() * 1000)}`;
  }
  
  // If no src provided, use a placeholder
  $: displaySrc = src || getPlaceholderUrl(width, height);
  
  function handleImageLoad() {
    imageLoaded = true;
    console.log('Image loaded successfully:', displaySrc);
  }
  
  function handleImageError() {
    imageError = true;
    console.log('Image failed to load:', displaySrc);
  }
</script>

<!-- Main container with aspect ratio -->
<div class="image-container" style="--width: {width}px; --height: {height}px;">
  
  <!-- Loading placeholder - shows while image loads -->
  {#if !imageLoaded && !imageError}
    <div class="loading-placeholder">
      <div class="spinner"></div>
      <p>Loading image...</p>
    </div>
  {/if}
  
  <!-- The actual image -->
  <img
    src={displaySrc}
    {alt}
    class:loaded={imageLoaded}
    class:error={imageError}
    on:load={handleImageLoad}
    on:error={handleImageError}
  />
  
  <!-- Error state -->
  {#if imageError}
    <div class="error-overlay">
      <p>📷 Image unavailable</p>
    </div>
  {/if}
</div>

<style>
  .image-container {
    position: relative;
    width: var(--width);
    height: var(--height);
    max-width: 100%;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f5f5f5;
    border: 1px solid #e0e0e0;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  img.loaded {
    opacity: 1;
  }
  
  img.error {
    opacity: 0;
  }
  
  .loading-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 0.9rem;
  }
  
  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #ddd;
    border-top: 2px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 0.5rem;
  }
  
  .error-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.1);
    color: #666;
    font-size: 0.9rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>