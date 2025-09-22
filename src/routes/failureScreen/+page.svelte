<h1 class="text-2xl font-semibold"> Hall of Failure</h1>
<p> We know what you have done & what you have Failed to do...</p>

<script lang="ts">
  import ImageDisplay from '$lib/components/imageDisplay.svelte';
  
  // Test data - mix of real URLs and placeholders
  const testImages = [
    {
      id: 1,
      src: 'https://picsum.photos/400/300?random=100',
      alt: 'Beautiful landscape',
      width: 400,
      height: 300
    },
    {
      id: 2,
      src: 'https://picsum.photos/500/400?random=200', 
      alt: 'City architecture',
      width: 500,
      height: 400
    },
    {
      id: 3,
      src: '', // This will use placeholder
      alt: 'Random placeholder image',
      width: 350,
      height: 250
    },
    {
      id: 4,
      src: 'https://invalid-url-to-test-error.jpg', // This will fail and show error
      alt: 'This will show error state',
      width: 400,
      height: 300
    }
  ];
</script>

<main>
  <h1>ImageDisplay Component Test Page</h1>
  
  <!-- Section 1: Basic usage -->
  <section>
    <h2>1. Basic Usage</h2>
    <p>Default placeholder image (no src provided):</p>
    <ImageDisplay alt="Default placeholder" />
  </section>
  
  <!-- Section 2: Custom sizes -->
  <section>
    <h2>2. Different Sizes</h2>
    <div class="size-examples">
      <div>
        <p>Small (200x150):</p>
        <ImageDisplay 
          src="https://picsum.photos/200/150?random=10" 
          alt="Small image" 
          width={200} 
          height={150} 
        />
      </div>
      
      <div>
        <p>Large (600x400):</p>
        <ImageDisplay 
          src="https://picsum.photos/600/400?random=20" 
          alt="Large image" 
          width={600} 
          height={400} 
        />
      </div>
    </div>
  </section>
  
  <!-- Section 3: Multiple images from array -->
  <section>
    <h2>3. Multiple Images (including error test)</h2>
    <div class="image-grid">
      {#each testImages as image (image.id)}
        <div class="image-card">
          <ImageDisplay 
            src={image.src} 
            alt={image.alt} 
            width={image.width} 
            height={image.height} 
          />
          <p class="caption">{image.alt}</p>
        </div>
      {/each}
    </div>
  </section>
  
  <!-- Section 4: Real-world example -->
  <section>
    <h2>4. Gallery Style</h2>
    <div class="gallery">
      {#each Array(6) as _, i}
        <ImageDisplay 
          src="https://picsum.photos/300/200?random={50 + i}" 
          alt="Gallery image {i + 1}" 
          width={300} 
          height={200} 
        />
      {/each}
    </div>
  </section>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  section {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #eee;
  }
  
  h1 {
    color: #333;
    text-align: center;
    margin-bottom: 3rem;
  }
  
  h2 {
    color: #463e3e;
    margin-bottom: 1rem;
  }
  
  .size-examples {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  .size-examples > div {
    text-align: center;
  }
  
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .image-card {
    text-align: center;
  }
  
  .caption {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #c03131;
    font-style: italic;
  }
  
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  p {
    margin-bottom: 1rem;
    color: #000000;
  }
</style>