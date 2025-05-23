<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { modules, type Module, type Lesson } from '$lib/course-structure'; // Ajusta la ruta si es necesario
  import { page } from '$app/stores'; // Para saber la ruta actual
  import { Home, Menu, X, Moon, Sun, Construction, Lock, CheckCircle as CheckCircleIcon, Zap as CurrentIcon, CircleDotDashed } from 'lucide-svelte'; // Iconos para UI
  import CodeAndCanvasLogo from '$lib/components/icons/CodeAndCanvasLogo.svelte';
  import { progressStore } from '$lib/stores/progressStore';

  let sidebarOpen = false;
  let darkMode = false; // Podrías guardarlo en localStorage con Svelte stores

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  onMount(() => {
    const storedDarkMode = localStorage.getItem('cca-darkMode');
    if (storedDarkMode) {
      darkMode = JSON.parse(storedDarkMode);
      if (darkMode) document.documentElement.classList.add('dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Si no hay preferencia guardada, usa la del sistema
      darkMode = true;
      document.documentElement.classList.add('dark');
    }
  });

  function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cca-darkMode', JSON.stringify(darkMode));
  }

  // Cierra el sidebar al navegar en móvil
  $: if ($page.url.pathname && sidebarOpen) {
     //  En pantallas pequeñas, cierra el sidebar al hacer clic en un enlace
     if (window.innerWidth < 768) { // Tailwind's md breakpoint
         sidebarOpen = false;
     }
  }

</script>

<div class="{darkMode ? 'dark' : ''} min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex">
  <!-- Sidebar -->
  <aside
    class="fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
           md:relative md:translate-x-0 md:shadow-none transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700"
  >
    <div class="p-4 flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700">
		<a href="/" class="block"> <!-- text-xl font-bold text-blue-600 dark:text-blue-400 -->
			<CodeAndCanvasLogo class="h-10 w-auto text-gray-800 dark:text-[#CCC] [--logo-color:theme(colors.gray.800)] dark:[--logo-color:#CCC]"
    aria-label="Code & Canvas Academy Logo" /> <!-- Ajusta tamaño y color con Tailwind -->
		</a>
		<button on:click={toggleSidebar} class="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
			<X size={24} />
		</button>
	</div>
    <nav class="py-4 px-2 space-y-1">
	{#each $progressStore as module (module.id)} <!-- Usar $progressStore para auto-suscripción -->
		<div>
		<h3 class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center
					{module.status === 'locked' ? 'opacity-50' : ''}">
			{#if module.icon} <svelte:component this={module.icon} size={16} class="mr-2" /> {/if}
			{module.title}
			{#if module.status === 'locked'} <Lock size={12} class="ml-auto text-gray-400 dark:text-gray-500"/> {/if}
			{#if module.status === 'completed'} <CheckCircleIcon size={12} class="ml-auto text-green-500"/> {/if}
		</h3>
		{#if module.lessons && module.status !== 'locked'}
			<ul class="space-y-1">
			{#each module.lessons as lesson (lesson.id)}
				<li>
				<a
					href={lesson.status !== 'locked' && lesson.status !== 'todo' ? lesson.path : '#'}
					class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
						{$page.url.pathname === lesson.path && lesson.status !== 'locked' && lesson.status !== 'todo'
							? 'bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100'
							: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'}"
					class:opacity-60={lesson.status === 'locked' || lesson.status === 'todo'}
					class:pointer-events-none={lesson.status === 'locked' || lesson.status === 'todo'}
					aria-disabled={lesson.status === 'locked' || lesson.status === 'todo'}
				>
					{#if lesson.status === 'completed'}
					<CheckCircleIcon size={16} class="mr-3 text-green-500 dark:text-green-400" />
					{:else if lesson.status === 'locked'}
					<Lock size={16} class="mr-3 text-gray-400 dark:text-gray-500" />
					{:else if lesson.status === 'current'}
					<CurrentIcon size={16} class="mr-3 text-blue-500 dark:text-blue-400" /> <!-- Zap o un icono de 'en progreso' -->
					{:else if lesson.status === 'unlocked'}
					<!-- Podrías usar el icono original de la lección o uno genérico de 'desbloqueado' -->
					{#if lesson.icon} <svelte:component this={lesson.icon} size={16} class="mr-3" />
					{:else} <CircleDotDashed size={16} class="mr-3 text-gray-500 dark:text-gray-400"/> {/if}
					{:else if lesson.status === 'todo'}
					<Construction size={16} class="mr-3 text-gray-400 dark:text-gray-500"/>
					{/if}

					{lesson.title}

					{#if lesson.status === 'todo'}
					<span class="ml-auto text-xs text-gray-400 dark:text-gray-500">(Próximamente)</span>
					{/if}
				</a>
				</li>
			{/each}
			</ul>
		{/if}
		</div>
	{/each}
	</nav>
  </aside>

  <!-- Main content area -->
  <div class="flex-1 flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
         <button on:click={toggleSidebar} class="md:hidden mr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
             <Menu size={24} />
         </button>
         <!-- Breadcrumbs o Título de la Lección Actual (opcional) -->
         <span class="text-lg font-semibold hidden md:block">
             { modules.flatMap(m => m.lessons).find(l => l.path === $page.url.pathname)?.title || "Code & Canvas Academy" }
         </span>
      </div>

      <div class="flex items-center space-x-3">
        <button on:click={toggleDarkMode} title="Toggle Dark Mode" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          {#if darkMode} <Sun size={20} /> {:else} <Moon size={20} /> {/if}
        </button>
        <!-- Otros iconos de header (ej: perfil, notificaciones) -->
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
      {#if $$slots.default} <!-- SvelteKit 1.0+ way to check for slot content -->
         <slot />
      {:else}
         <p>Cargando contenido...</p>
      {/if}
      <!-- El @render children() o <slot /> de tu versión -->
    </main>
  </div>
</div>

<style lang="postcss">
  /* Estilos globales adicionales si necesitas, aquí puedes usar theme() */
  /* Ejemplo: scrollbars personalizados */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f3f4f6; /* gray-100 */
  }
  .dark ::-webkit-scrollbar-track {
    background: #1f2937; /* gray-800 */
  }
  ::-webkit-scrollbar-thumb {
    background: #d1d5db; /* gray-300 */
    border-radius: 9999px;
  }
  .dark ::-webkit-scrollbar-thumb {
    background: #4b5563; /* gray-600 */
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #9ca3af; /* gray-400 */
  }
  .dark ::-webkit-scrollbar-thumb:hover {
    background: #6b7280; /* gray-500 */
  }
</style>