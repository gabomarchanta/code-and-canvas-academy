<script lang="ts">
	import { browser } from '$app/environment';
	import { theme } from '$lib/stores/themeStore';
	import { html } from '@codemirror/lang-html';
	import { CheckCircle, Circle, ArrowRight } from 'lucide-svelte';
	import { untrack } from 'svelte';
	import { semanticHtmlLesson, type Stage } from '$lib/content/semantic-html';
	import Button from '$lib/components/ui/Button.svelte';
	import FeedbackMessage from '$lib/components/ui/FeedbackMessage.svelte';
	import CodeEditor from '$lib/components/ui/CodeEditor.svelte';

	// --- Svelte 5 State Management (Runes) ---

	let currentStageIndex = $state(0);

	// Create a derived state for stages that includes their completion status.
	// This is now the single source of truth for the UI's progress display.
	const stagesWithStatus = $derived(() =>
		semanticHtmlLesson.map((stage, index) => ({
			...stage,
			status:
				index < currentStageIndex
					? 'completed'
					: index === currentStageIndex
						? 'current'
						: 'pending'
		}))
	);

	let currentStage = $derived(semanticHtmlLesson[currentStageIndex]);

	// Initialize code imperatively. It will be updated by navigation handlers.
	let code = $state(
		semanticHtmlLesson[0].type === 'exercise' ? semanticHtmlLesson[0].initialCode : ''
	);
	let feedback: { type: 'success' | 'error'; message: string } | null = $state(null);
	let srcDoc = $state('');

	// --- Effects ---

	// This effect ONLY handles the preview pane, not the editor's content.
	$effect(() => {
		const isDark = $theme === 'dark';
		const textColor = isDark ? '#e5e7eb' : '#111827';
		const styles = `<style>body { font-family: sans-serif; color: ${textColor}; }</style>`;
		srcDoc = styles + code;
	});

	$effect(() => {
		// This effect resets feedback when the user starts typing again.
		// By reading `code` we subscribe to its changes.
		// By using `untrack` we can read `feedback` without subscribing to it,
		// which prevents this effect from running when `handleCheck` sets the feedback.
		code; // This creates the dependency
		if (untrack(() => feedback)) {
			feedback = null;
		}
	});

	// --- Event Handlers ---

	function updateCodeForStage(index: number) {
		const stage = semanticHtmlLesson[index];
		if (stage.type === 'exercise') {
			code = stage.initialCode;
		} else {
			code = '';
		}
		feedback = null;
	}

	function handleCheck() {
		if (currentStage.type !== 'exercise') return;
		const normalizedCode = code.trim().replace(/\s+/g, ' ');
		const normalizedSolution = currentStage.solution.trim().replace(/\s+/g, ' ');

		if (normalizedCode === normalizedSolution) {
			feedback = { type: 'success', message: '¡Excelente! Código correcto.' };
		} else {
			feedback = { type: 'error', message: 'Parece que algo no está bien. ¡Inténtalo de nuevo!' };
		}
	}

	function handleNext() {
		if (currentStageIndex < semanticHtmlLesson.length - 1) {
			currentStageIndex += 1;
			updateCodeForStage(currentStageIndex);
		} else {
			feedback = { type: 'success', message: '¡Felicidades, has completado la lección!' };
		}
	}

	function handleStageSelection(index: number) {
		if (stagesWithStatus()[index].status !== 'pending') {
			currentStageIndex = index;
			updateCodeForStage(index);
		}
	}
</script>

<svelte:head>
	<title>{currentStage?.title || 'Lección'} - Code & Canvas</title>
</svelte:head>

<div class="lesson-layout">
	<aside
		class="progress-sidebar hidden border-r border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-900 lg:block"
	>
		<h2 class="text-xl font-bold mb-6">HTML Semántico</h2>
		<nav>
			<ul>
				{#each stagesWithStatus() as stage, index (stage.id)}
					<li>
						<button
							class="flex w-full items-center rounded-lg p-2 text-left transition-colors {stage.status ===
							'current'
								? 'bg-blue-100 dark:bg-slate-800'
								: 'hover:bg-gray-200 dark:hover:bg-slate-800'}"
							disabled={stage.status === 'pending'}
							onclick={() => handleStageSelection(index)}
						>
							{#if stage.status === 'completed'}
								<CheckCircle class="mr-3 flex-shrink-0 text-green-500" />
							{:else}
								<Circle
									class="mr-3 flex-shrink-0 {stage.status === 'current'
										? 'text-blue-600'
										: 'text-gray-300'}"
								/>
							{/if}
							<span class:font-bold={stage.status === 'current'}>{stage.title}</span>
						</button>
					</li>
				{/each}
			</ul>
		</nav>
	</aside>

	<!-- Columna Principal de Contenido -->
	<main class="content-main overflow-y-auto">
		<div class="p-8">
			<div class="instructions-area">
				<h1 class="mb-4 text-3xl font-bold">{currentStage.title}</h1>
				<div class="prose max-w-none dark:prose-invert">
					{@html currentStage.type === 'explanation'
						? currentStage.content
						: currentStage.instructions}
				</div>
			</div>

			{#if currentStage.type === 'exercise'}
				<div class="editor-area">
					<CodeEditor lang={html()} bind:value={code} />
				</div>
			{/if}

			<!-- Bloque de acciones DENTRO del contenido desplazable -->
			<div class="actions-footer mt-8">
				<!-- Contenedor de Feedback con altura mínima para reservar espacio -->
				<div class="feedback-container min-h-16">
					{#if feedback}
						<FeedbackMessage type={feedback.type} message={feedback.message} />
					{/if}
				</div>

				<!-- Botones -->
				{#if currentStage.type === 'explanation'}
					<Button onclick={handleNext} fullWidth={true}>
						Continuar
						<ArrowRight class="ml-2" size={18} />
					</Button>
				{:else if feedback?.type === 'success'}
					<Button onclick={handleNext} fullWidth={true} variant="success">
						Continuar
						<ArrowRight class="ml-2" size={18} />
					</Button>
				{:else}
					<Button onclick={handleCheck} fullWidth={true}>
						Comprobar
						<ArrowRight class="ml-2" size={18} />
					</Button>
				{/if}
			</div>
		</div>
	</main>

	<div
		class="preview-pane hidden border-l border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-900 lg:block"
	>
		<div
			class="preview-wrapper h-full rounded-lg border border-gray-200 bg-white dark:border-gray-700"
		>
			<iframe
				srcdoc={srcDoc}
				class="h-full w-full bg-white dark:bg-gray-800"
				title="Vista Previa del Código"
			></iframe>
		</div>
	</div>
</div>

<style lang="postcss">
	.lesson-layout {
		display: grid;
		grid-template-columns: 280px 1fr 1fr;
		height: 100%;
		background-color: var(--color-bg-primary);
	}

	@media (max-width: 1024px) {
		.lesson-layout {
			grid-template-columns: 1fr;
		}
	}

	.editor-area {
		margin-top: 2rem; /* mt-8 */
		border-radius: 0.5rem; /* rounded-lg */
		background-color: rgb(243 244 246 / 0.5); /* bg-gray-100/50 */
		padding: 1rem; /* p-4 */
	}

	:is(html.dark) .editor-area {
		background-color: rgb(31 41 55 / 0.5); /* dark:bg-gray-800/50 */
	}

	/* --- INICIO: Ajuste de altura para CodeMirror --- */
	/* Hace que el contenedor principal del editor se ajuste a su contenido */
	.editor-area :global(.cm-editor) {
		height: auto;
	}

	/* Evita el scroll interno, forzando al editor a crecer */
	.editor-area :global(.cm-scroller) {
		overflow-y: hidden;
	}
	/* --- FIN: Ajuste de altura para CodeMirror --- */

	.progress-sidebar nav button {
		outline: none;
	}
</style> 