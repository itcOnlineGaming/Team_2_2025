<script lang="ts">
  import { goto } from '$app/navigation';

  function goBack() {
    history.length > 1 ? history.back() : goto('/');
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

<main class="min-h-screen bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
  <!-- Header -->
  <header class="sticky top-0 z-10 bg-green-300 dark:bg-green-700 text-gray-900 dark:text-gray-100">
    <div class="mx-auto max-w-3xl px-4 py-4 flex items-center gap-4">
      <button aria-label="Go back" class="text-2xl" on:click={goBack}>
        ←
      </button>
      <h1 class="flex-1 text-center text-xl sm:text-2xl font-semibold">Your Profile</h1>
      <span class="w-6" aria-hidden="true"></span>
    </div>
  </header>

  <section class="mx-auto max-w-3xl px-4 pb-16">
    <!-- Avatar -->
    <div class="flex justify-center py-8 sm:py-10 bg-white dark:bg-neutral-900">
      <div class="h-40 w-40 sm:h-48 sm:w-48 rounded-md overflow-hidden shadow">
        <img
          src="https://illustrations.popsy.co/gray/avatar-1.png"
          alt="Profile avatar"
          class="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Stats Card -->
    <div class="bg-green-300/70 dark:bg-green-700/60 rounded-md p-4 sm:p-6">
      <div class="bg-white dark:bg-black rounded-md shadow p-5 sm:p-6">
        {#each stats as s}
          <div class="mb-4 last:mb-0">
            <p class="text-lg sm:text-xl">
              <span class="font-medium">{s.label}:</span>
              <span class="ml-2">{s.value}</span>
            </p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Gallery -->
    <div class="mt-6">
      <h2 class="text-lg sm:text-xl font-medium mb-3 text-gray-800 dark:text-gray-200">Your Failed Gallery</h2>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {#each failedGallery as item}
          <figure class="w-full aspect-square rounded-lg overflow-hidden bg-white dark:bg-black shadow">
            <img src={item.src} alt={item.alt} class="h-full w-full object-cover" loading="lazy" />
          </figure>
        {/each}
      </div>
    </div>
  </section>
</main>
