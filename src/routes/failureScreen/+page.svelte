

<script lang="ts">
  import ImageDisplay from '$lib/components/imageDisplay.svelte';
  
  // Test data - mix of real URLs and placeholders
  const testImages = [
    {
      id: 1,
  src: '/src/lib/assets/IMG_7766.webp',
      alt: 'Beautiful landscape',
      width: 400,
      height: 300
    },
    {
      id: 2,
  src: '/src/lib/assets/IMG_7769.webp', 
      alt: 'City architecture',
      width: 500,
      height: 400
    },
    {
      id: 3,
  src: '/src/lib/assets/IMG_7848.webp', // This will use placeholder
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

<main class="failure-main">
  <header class="failure-header">
    <h1 class="failure-title">Hall of Failure</h1>
    <p class="failure-desc">We know what you have done & what you have Failed to do...</p>
  </header>

  <section class="failure-section">
    <h2 class="section-title">Default Placeholder</h2>
    <p>Default placeholder image (no src provided):</p>
    <div class="failure-img-center">
      <ImageDisplay alt="Default placeholder" />
    </div>
  </section>

  <section class="failure-section">
    <h2 class="section-title">Different Sizes</h2>
    <div class="failure-size-examples">
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

  <section class="failure-section">
    <h2 class="section-title">Multiple Images (including error test)</h2>
    <div class="failure-image-grid">
      {#each testImages as image (image.id)}
        <div class="failure-image-card">
          <ImageDisplay 
            src={image.src} 
            alt={image.alt} 
            width={image.width} 
            height={image.height} 
          />
          <p class="failure-caption">{image.alt}</p>
        </div>
      {/each}
    </div>
  </section>

  <section class="failure-section">
    <h2 class="section-title">Gallery Style</h2>
    <div class="failure-gallery">
      <ImageDisplay 
        src="/src/lib/assets/IMG_7766.webp"
        alt="Custom image 1"
        width={300}
        height={200}
      />
      <ImageDisplay 
        src="/src/lib/assets/IMG_7769.webp"
        alt="Custom image 2"
        width={300}
        height={200}
      />
      <ImageDisplay 
        src="/src/lib/assets/IMG_7848.webp"
        alt="Custom image 3"
        width={300}
        height={200}
      />
    </div>
  </section>
</main>

<style>
.failure-main {
  min-height: 100vh;
  background: #fff;
  color: #111827;
  padding-bottom: 2rem;
}
.failure-header {
  text-align: center;
  margin-bottom: 2rem;
}
.failure-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.failure-desc {
  color: #6b7280;
  font-size: 1.1rem;
}
.failure-section {
  max-width: 48rem;
  margin: 0 auto 2.5rem auto;
  padding: 0 1rem;
}
.section-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #1f2937;
}
.failure-img-center {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}
.failure-size-examples {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.failure-image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}
.failure-image-card {
  background: #f3f4f6;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.07);
  padding: 1rem;
  text-align: center;
}
.failure-caption {
  margin-top: 0.5rem;
  color: #6b7280;
  font-size: 0.95rem;
}
.failure-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}
</style>