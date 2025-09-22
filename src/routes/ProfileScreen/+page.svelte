<script lang="ts">
  import { goto } from '$app/navigation';
  import ColorPicker from '../../lib/components/ColorPicker.svelte';
  let showColorPicker = true;
  let profileColor = '#86efac';

  function goBack() {
    history.length > 1 ? history.back() : goto('/');
  }

  function handleColor(event: CustomEvent) {
    profileColor = event.detail.color;
  }
  function handleConfirm(event: CustomEvent) {
    profileColor = event.detail.color;
    showColorPicker = false;
  }

  const stats = [
    { label: 'Username', value: 'John Doe' },
    { label: 'Days Completed', value: '20' },
    { label: 'Writing Streak', value: '6 🔥' },
    { label: 'Average Words per Minute', value: '56' }
  ];

  const failedGallery = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    src: `https://picsum.photos/seed/profile-fail-${i}/300/400`,
    alt: `Failed attempt ${i + 1}`
  }));
</script>

{#if showColorPicker}
  <ColorPicker on:color={handleColor} on:confirm={handleConfirm} />
{/if}
<main class="profile-main" style="background-color: {profileColor}">
  <!-- Header -->
  <header class="profile-header">
    <div class="profile-header-inner">
      <button aria-label="Go back" class="back-btn" on:click={goBack}>
        ←
      </button>
      <h1 class="profile-title">Your Profile</h1>
      <span class="header-spacer" aria-hidden="true"></span>
    </div>
  </header>

  <section class="profile-section">
    <!-- Avatar -->
    <div class="avatar-container">
  <div class="avatar-img-wrapper">
        <img
          src="https://marinesanctuary.org/wp-content/uploads/2021/08/SBNMS_Gray-Seal_Matt-McIntosh_NOAA-e1630332861699.jpg"
          alt="Profile avatar"
          class="avatar-img"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Stats Card -->
    <div class="stats-card">
      <div class="stats-inner">
        {#each stats as s}
          <div class="stats-row">
            <p class="stats-text">
              <span class="stats-label">{s.label}:</span>
              <span class="stats-value">{s.value}</span>
            </p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Gallery -->
    <div class="gallery-section">
      <h2 class="gallery-title">Your Failed Gallery</h2>
      <div class="gallery-grid">
        {#each failedGallery as item}
          <figure class="gallery-item">
            <img src={item.src} alt={item.alt} class="gallery-img" loading="lazy" />
          </figure>
        {/each}
      </div>
    </div>
  </section>
</main>

<style>
.profile-main {
  min-height: 100vh;
  background-color: #f3f4f6;
  color: #111827;
}
:global(.dark) .profile-main {
  background-color: #171717;
  color: #f3f4f6;
}
.profile-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  color: #111827;
}
:global(.dark) .profile-header {
  background-color: #fff;
  color: #111827;
}
.profile-header-inner {
  max-width: 48rem;
  margin: 0 auto;
  padding: 1rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.back-btn {
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
}
.profile-title {
  flex: 1;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
}
@media (min-width: 640px) {
  .profile-title {
    font-size: 1.5rem;
  }
}
.header-spacer {
  width: 1.5rem;
}
.profile-section {
  max-width: 48rem;
  margin: 0 auto;
  padding: 0 1rem 4rem 1rem;
}
.avatar-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  background: #fff;
}
:global(.dark) .avatar-container {
  background: #171717;
}
.avatar-img-wrapper {
  height: 10rem;
  width: 10rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
@media (min-width: 640px) {
  .avatar-img-wrapper {
    height: 12rem;
    width: 12rem;
  }
}
.avatar-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.stats-card {
  background: rgba(134, 239, 172, 0.7);
  border-radius: 0.5rem;
  padding: 1rem;
}
:global(.dark) .stats-card {
  background: rgba(21, 128, 61, 0.6);
}
.stats-inner {
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 1.25rem;
}
:global(.dark) .stats-inner {
  background: #000;
}
.stats-row {
  margin-bottom: 1rem;
}
.stats-row:last-child {
  margin-bottom: 0;
}
.stats-text {
  font-size: 1.125rem;
}
@media (min-width: 640px) {
  .stats-text {
    font-size: 1.25rem;
  }
}
.stats-label {
  font-weight: 500;
}
.stats-value {
  margin-left: 0.5rem;
}
.gallery-section {
  margin-top: 1.5rem;
}
.gallery-title {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: #1f2937;
}
:global(.dark) .gallery-title {
  color: #e5e7eb;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
.gallery-item {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
:global(.dark) .gallery-item {
  background: #000;
}
.gallery-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>