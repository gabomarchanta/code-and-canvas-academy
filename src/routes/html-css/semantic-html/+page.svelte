<script lang="ts">
	// Imports
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import CodeEditor from 'svelte-codemirror-editor';
	import { html } from '@codemirror/lang-html';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { CheckCircle, Circle, ArrowRight } from 'lucide-svelte';
	import { progressStore } from '$lib/stores/progressStore';
	import { theme as currentTheme } from '$lib/stores/themeStore';
	import Button from '$lib/components/ui/Button.svelte';
	import FeedbackMessage from '$lib/components/ui/FeedbackMessage.svelte';
	import type { PageData } from './$types';
	import type { Stage } from '$lib/content/semantic-html';

	// Props y estado local
	let { data }: { data: PageData } = $props();
	const lesson = data.lesson;

	let currentStageIndex = $state(0);
	let code = $state('');
	let feedback = $state<{ type: 'success' | 'error'; message: string } | null>(null);
	let initialized = $state(false);
	let justCompleted = $state(false);

	// Estado Derivado
	const challengeStatuses = $derived(
		$progressStore
			.find((m) => m.id === lesson.moduleId)
			?.lessons.find((l) => l.id === lesson.id)?.challenges ?? []
	);

	const completed = $derived(
		lesson.stages.map((stage: Stage) => {
			const challenge = challengeStatuses.find((c) => c.id === stage.id);
			return challenge ? challenge.completed : false;
		})
	);

	const firstIncompleteIndex = $derived(completed.findIndex((c: boolean) => !c));

	function syncCodeWithStage(index: number) {
		const stage = lesson.stages[index];
		if (stage?.type === 'exercise') {
			// Buscar si hay una solución guardada en el progreso
			const challenge = challengeStatuses.find((c) => c.id === stage.id);
			if (challenge && challenge.completed && challenge.code) {
				code = challenge.code;
			} else {
				code = stage.initialCode;
			}
		} else {
			code = '';
		}
		feedback = null;

		// Actualizar la vista previa inmediatamente
		const isDark = $currentTheme === 'dark';
		const textColor = isDark ? '#e5e7eb' : '#111827';
		const styles = `<style>body { font-family: sans-serif; color: ${textColor}; }</style>`;
		srcDoc = styles + code;
	}

	// Efectos
	$effect(() => {
		// Se ejecuta una vez para establecer la posición inicial
		if (browser && !initialized) {
			const targetIndex = firstIncompleteIndex === -1 ? lesson.stages.length - 1 : firstIncompleteIndex;
			currentStageIndex = targetIndex;
			syncCodeWithStage(targetIndex);
			initialized = true;
		}
	});

	$effect(() => {
		// Gestiona la navegación cuando el progreso cambia.
		if (!initialized) return;

		// Si hay feedback de éxito, no avanzar automáticamente
		if (feedback?.type === 'success') return;

		const isLessonComplete = completed.every((c) => c);
		const isLastStage = currentStageIndex === lesson.stages.length - 1;

		// Solo redirigir si el usuario acaba de completar la lección
		if (isLessonComplete && isLastStage && justCompleted) {
			progressStore.completeLesson(lesson.moduleId, lesson.id);
			justCompleted = false;
			goto('/');
			return;
		}

		// Solo forzar navegación si la etapa actual NO está completada
		if (!completed[currentStageIndex] && firstIncompleteIndex > -1 && currentStageIndex !== firstIncompleteIndex) {
			currentStageIndex = firstIncompleteIndex;
			syncCodeWithStage(firstIncompleteIndex);
		}
	});

	const currentStage = $derived(lesson.stages[currentStageIndex]);

	// Manejadores de eventos
	function handleAdvance() {
		// Si hay feedback de éxito, primero lo limpiamos y luego avanzamos
		if (feedback?.type === 'success') {
			feedback = null;
		}
		// Si estamos en la última etapa y la lección no estaba completa, marcamos justCompleted
		if (currentStageIndex === lesson.stages.length - 1 && !completed.every((c) => c)) {
			justCompleted = true;
		}
		progressStore.completeStage(lesson.moduleId, lesson.id, currentStage.id);
	}

	function handleCheck() {
		if (currentStage?.type !== 'exercise') return;
		const solution = currentStage.solution.replace(/\s/g, '');
		const userCode = code.replace(/\s/g, '');

		if (userCode === solution) {
			feedback = { type: 'success', message: '¡Correcto! ¡Bien hecho!' };
			progressStore.completeStage(lesson.moduleId, lesson.id, currentStage.id);
		} else {
			feedback = { type: 'error', message: 'Parece que algo no está bien. ¡Inténtalo de nuevo!' };
		}
	}

	// Preview Pane
	let srcDoc = $derived('');
	$effect(() => {
		const isDark = $currentTheme === 'dark';
		const textColor = isDark ? '#e5e7eb' : '#111827';
		const styles = `<style>body { font-family: sans-serif; color: ${textColor}; }</style>`;
		// Forzar actualización también cuando cambia feedback
		const _ = feedback;
		srcDoc = styles + code;
	});
</script>

<div class="lesson-layout">
	<!-- Progress Sidebar -->
	<aside
		class="progress-sidebar hidden border-r border-gray-200 bg-white/50 p-4 dark:border-gray-700 dark:bg-gray-800/50 md:block"
	>
		<h2 class="px-4 pt-4 text-xl font-bold">{lesson.title}</h2>
		<nav class="p-4">
			<ul class="space-y-2">
				{#each lesson.stages as stage, i}
					<li>
						<button
							class="flex w-full items-center rounded-md p-3 text-left transition-colors"
							class:bg-blue-100={i === currentStageIndex}
							class:dark:bg-blue-900={i === currentStageIndex}
							class:hover:bg-gray-200={i !== currentStageIndex && (completed[i] || i <= firstIncompleteIndex)}
							class:dark:hover:bg-gray-700={ i !== currentStageIndex && (completed[i] || i <= firstIncompleteIndex) }
							class:opacity-50={!completed[i] && i > firstIncompleteIndex}
							class:cursor-not-allowed={!completed[i] && i > firstIncompleteIndex}
							onclick={() => {
								currentStageIndex = i;
								syncCodeWithStage(i);
							}}
							disabled={!completed[i] && i > firstIncompleteIndex}
						>
							{#if completed[i]}
								<CheckCircle size={20} class="flex-shrink-0 text-green-500" />
							{:else}
								<Circle
									size={20}
									class={
										i === currentStageIndex
											? 'text-blue-500'
											: 'text-gray-400'
									}
								/>
							{/if}
							<span class="ml-3">{stage.title}</span>
						</button>
					</li>
				{/each}
			</ul>
		</nav>
	</aside>

	<!-- Main Content Column -->
	<main class="content-main overflow-y-auto">
		<div class="p-8">
			<div class="instructions-area">
				<h1 class="mb-4 text-3xl font-bold">{currentStage?.title}</h1>
				<div class="prose max-w-none dark:prose-invert">
					{@html currentStage?.type === 'explanation' ? currentStage.content : currentStage?.instructions}
				</div>
			</div>

			{#if currentStage?.type === 'exercise'}
				<div class="editor-area">
					<CodeEditor
						lang={html()}
						bind:value={code}
						theme={$currentTheme === 'dark' ? oneDark : undefined}
						extensions={[$currentTheme === 'dark' ? oneDark : []]}
					/>
				</div>
			{/if}

			<div class="actions-footer mt-8">
				<div class="feedback-container min-h-16">
					{#if feedback}
						<FeedbackMessage type={feedback.type} message={feedback.message} />
					{/if}
				</div>

				{#if currentStage?.type === 'explanation'}
					<Button onclick={handleAdvance} fullWidth={true}>
						Continuar
						<ArrowRight class="ml-2" size={18} />
					</Button>
				{:else if feedback?.type === 'success'}
					<Button onclick={handleAdvance} fullWidth={true} variant="success">
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

	<!-- Preview Pane -->
	<div class="preview-pane">
		<iframe title="Vista previa del código" sandbox="allow-scripts" srcdoc={srcDoc} class="h-full w-full rounded-lg bg-white dark:bg-gray-800"></iframe>
	</div>
</div>

<style lang="postcss">
	.lesson-layout {
		display: grid;
		grid-template-columns: 280px 1fr 1fr;
		height: calc(100vh - 4rem /* altura del header */);
	}

	@media (max-width: 1024px) {
		.lesson-layout {
			grid-template-columns: 1fr;
		}
		.preview-pane {
			display: none;
		}
	}
    
    @media (max-width: 768px) {
        .progress-sidebar {
            display: none;
        }
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

	/* svelte-ignore css_unused_selector */
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

	.preview-pane {
		padding: 2rem; /* p-8 */
	}
</style>