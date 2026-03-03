<script lang="ts">
  import { cn } from '@subschema/svelte';
  import { examples } from './examples';
  import ExamplePage from './ExamplePage.svelte';
  import SchemaEditorPage from './SchemaEditorPage.svelte';
  import CustomTypePage from './CustomTypePage.svelte';
  import PresetPage from './PresetPage.svelte';

  let currentId = $state(window.location.hash.replace('#/', '') || examples[0].id);
  let sidebarOpen = $state(false);

  // Dark mode
  function getInitialDark(): boolean {
    const stored = localStorage.getItem('subschema-dark');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  let dark = $state(getInitialDark());

  $effect(() => {
    document.documentElement.classList.toggle('dark', dark as boolean);
    localStorage.setItem('subschema-dark', String(dark));
  });

  $effect(() => {
    const onHash = () => {
      currentId = window.location.hash.replace('#/', '') || examples[0].id;
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  });

  let currentExample = $derived(examples.find((e) => e.id === currentId) ?? examples[0]);

  function navigate(id: string) {
    window.location.hash = `#/${id}`;
    sidebarOpen = false;
  }

  function toggleDark() {
    dark = !dark;
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<div class="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
  <!-- Header -->
  <header class="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
    <div class="flex items-center gap-3">
      <button
        class="rounded p-1 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
        onclick={toggleSidebar}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="text-lg font-bold">Subschema Modern Demo</h1>
    </div>
    <div class="flex items-center gap-2">
      <button
        onclick={toggleDark}
        class="rounded-md p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? '☀️' : '🌙'}
      </button>
      <a
        href="https://github.com/subschema/subschema"
        target="_blank"
        rel="noopener noreferrer"
        class="rounded-md p-2 text-sm transition hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        GitHub
      </a>
    </div>
  </header>

  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar overlay on mobile -->
    {#if sidebarOpen}
      <div
        class="fixed inset-0 z-30 bg-black/40 md:hidden"
        onclick={() => sidebarOpen = false}
        role="button"
        tabindex="-1"
        onkeydown={() => {}}
      ></div>
    {/if}

    <!-- Sidebar -->
    <nav
      class={cn(
        'z-40 w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900',
        'fixed inset-y-0 left-0 transform transition-transform md:static md:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'top-0 pt-14 md:top-auto md:pt-0',
      )}
    >
      <div class="p-3">
        <h2 class="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
          Examples
        </h2>
        <ul class="space-y-0.5">
          {#each examples as ex (ex.id)}
            <li>
              <button
                onclick={() => navigate(ex.id)}
                class={cn(
                  'w-full rounded-md px-3 py-2 text-left text-sm transition',
                  currentId === ex.id
                    ? 'bg-blue-100 font-medium text-blue-900 dark:bg-blue-900/40 dark:text-blue-200'
                    : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800',
                )}
              >
                {ex.title}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto p-4 md:p-8">
      {#if currentExample.id === 'editor'}
        <SchemaEditorPage example={currentExample} />
      {:else if currentExample.id === 'custom-type'}
        <CustomTypePage example={currentExample} />
      {:else if currentExample.id === 'preset'}
        <PresetPage example={currentExample} />
      {:else}
        {#key currentExample.id}
          <ExamplePage example={currentExample} />
        {/key}
      {/if}
    </main>
  </div>
</div>

