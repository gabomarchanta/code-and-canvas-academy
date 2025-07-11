<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import {
		Menu,
		X,
		Construction,
		Lock,
		CheckCircle as CheckCircleIcon,
		CircleDashed,
		Zap as CurrentIcon,
		Users
	} from 'lucide-svelte';
	import CodeAndCanvasLogo from '$lib/components/icons/CodeAndCanvasLogo.svelte';
	import { progressStore } from '$lib/stores/progressStore';
	import { theme } from '$lib/stores/themeStore';
	import { userStore } from '$lib/stores/userStore';
	import ThemeToggler from '$lib/components/ui/ThemeToggler.svelte';

	let sidebarOpen = false;

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	onMount(() => {
		// Esta es la única fuente de verdad para inicializar el tema en el cliente.
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme) {
			theme.set(storedTheme as 'light' | 'dark');
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			theme.set('dark');
		} else {
			theme.set('light');
		}
	});

	// Cierra el sidebar al navegar en móvil
	$: if (browser && $page.url.pathname && sidebarOpen) {
		if (window.innerWidth < 768) {
			sidebarOpen = false;
		}
	}

	// Función para alternar entre usuarios de prueba
	function toggleUser() {
		if ($userStore.id === 'guest') {
			userStore.login({ id: 'user-gabo', name: 'Gabo' });
		} else {
			userStore.logout();
		}
	}
</script>

<div class="flex h-full bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
	<!-- Sidebar -->
	<aside
		class="fixed inset-y-0 left-0 z-30 w-64 transform border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800 {sidebarOpen
			? 'translate-x-0'
			: '-translate-x-full'}
            md:relative md:translate-x-0 md:shadow-none"
	>
		<div class="flex h-16 items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
			<a href="/" class="block">
				<CodeAndCanvasLogo
					class="h-10 w-auto text-gray-800 dark:text-[#CCC] [--logo-color:theme(colors.gray.800)] dark:[--logo-color:#CCC]"
					aria-label="Code & Canvas Academy Logo"
				/>
			</a>
			<button
				on:click={toggleSidebar}
				class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden"
			>
				<X size={24} />
			</button>
		</div>
		<nav class="space-y-1 py-4 px-2">
			{#each $progressStore as module (module.id)}
				<div>
					<h3
						class="flex items-center px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400
 					{module.status === 'locked' ? 'opacity-50' : ''}"
					>
						{#if module.icon}
							<svelte:component this={module.icon} size={16} class="mr-2" />
						{/if}
						{module.title}
						{#if module.status === 'locked'}
							<Lock size={12} class="ml-auto text-gray-400 dark:text-gray-500" />
						{/if}
						{#if module.status === 'completed'}
							<CheckCircleIcon size={12} class="ml-auto text-green-500" />
						{/if}
					</h3>
					{#if module.lessons && module.status !== 'locked'}
						<ul class="space-y-1">
							{#each module.lessons as lesson (lesson.id)}
								<li>
									<a
										href={lesson.status !== 'locked' && lesson.status !== 'todo'
											? lesson.path
											: '#'}
										class="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150
 						{$page.url.pathname === lesson.path &&
										lesson.status !== 'locked' &&
										lesson.status !== 'todo'
											? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
											: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100'}"
										class:opacity-60={lesson.status === 'locked' || lesson.status === 'todo'}
										class:pointer-events-none={lesson.status === 'locked' ||
											lesson.status === 'todo'}
										aria-disabled={lesson.status === 'locked' || lesson.status === 'todo'}
									>
										{#if lesson.status === 'completed'}
											<CheckCircleIcon size={16} class="mr-3 text-green-500 dark:text-green-400" />
										{:else if lesson.status === 'locked'}
											<Lock size={16} class="mr-3 text-gray-400 dark:text-gray-500" />
										{:else if lesson.status === 'current'}
											<CurrentIcon size={16} class="mr-3 text-blue-500 dark:text-blue-400" />
										{:else if lesson.status === 'unlocked'}
											{#if lesson.icon}
												<svelte:component this={lesson.icon} size={16} class="mr-3 opacity-75" />
											{:else}
												<CircleDashed size={16} class="mr-3 text-gray-500 dark:text-gray-400" />
											{/if}
										{:else if lesson.status === 'todo'}
											<Construction size={16} class="mr-3 text-gray-400 dark:text-gray-500" />
										{/if}

										{lesson.title}

										{#if lesson.status === 'todo'}
											<span class="ml-auto text-xs text-gray-400 dark:text-gray-500"
												>(Próximamente)</span
											>
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
	<div class="flex flex-1 flex-col">
		<!-- Header -->
		<header
			class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/80 md:px-6"
		>
			<div class="flex items-center">
				<button
					on:click={toggleSidebar}
					class="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden"
				>
					<Menu size={24} />
				</button>
				<span class="hidden font-semibold md:block">
					{
						$progressStore
							.flatMap((m) => m.lessons)
							.find((l) => l.path === $page.url.pathname)?.title || 'Code & Canvas Academy'
					}
				</span>
			</div>

			<div class="flex items-center space-x-4">
				<div class="flex items-center space-x-2">
					<Users
						class="text-gray-600 dark:text-gray-300"
						size={20}
						aria-label="Usuario actual"
					/>
					<span class="text-sm font-medium">{$userStore.name}</span>
					<button
						on:click={toggleUser}
						class="rounded-md bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
						>Cambiar</button
					>
				</div>
				<div
					class="h-6 w-px bg-gray-200 dark:bg-gray-600"
					aria-hidden="true"
					role="separator"
				></div>
				<ThemeToggler />
			</div>
		</header>

		<!-- Page Content -->
		<main class="flex-1 overflow-y-auto">
			<slot />
		</main>
	</div>
</div>