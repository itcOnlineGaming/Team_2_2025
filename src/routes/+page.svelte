<script>
  import { goto } from '$app/navigation';

  function handleStart() {
    goto('/doc');
  }
</script>

<main class="flex flex-col items-center justify-center h-screen">
  <h1 class="text-3xl font-bold mb-6">Daily Writing App</h1>
  <button
    class="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
    on:click={handleStart}
  >
    Start
  </button>
</main>