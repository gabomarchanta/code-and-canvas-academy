<!-- src/lib/components/lessons/ColorContrastTester.svelte -->
<script context="module" lang="ts">
  // Este bloque se ejecuta una vez cuando el módulo se carga.
  // Aquí es donde defines y exportas tipos o valores que otros módulos pueden importar.
  export type Stage = 'idle' | 'playing' | 'submittedCorrect' | 'submittedIncorrect' | 'lessonComplete';
</script>

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { progressStore } from '$lib/stores/progressStore';
  import { CheckCircle, XCircle, RotateCcw, Play, ArrowRight } from 'lucide-svelte'; // Iconos
  import { fly } from 'svelte/transition';
  import VanillaColorPicker from '$lib/components/ui/VanillaColorPicker.svelte';
  
  
  // --- Configuración de la Lección/Desafío ---
  const moduleId = 'design-foundations';
  const lessonId = 'color-contrast'; // ID de esta lección general
  // Podríamos tener múltiples desafíos dentro de esta "lección de contraste"
  // Por ahora, nos enfocamos en el primero.
  const currentChallengeConfig = {
    id: 'challenge-1-text-for-given-bg',
    description: 'Elige un color de texto que logre un contraste AA (4.5:1) con el fondo provisto.',
    givenBackgroundColor: '#334155', // Un gris azulado oscuro (slate-700)
    targetRatio: 4.5,
  };

  const dispatch = createEventDispatcher();

  // --- Estado del Componente ---
  let stage: Stage = 'idle';

  let textColor: string = '#FFFFFF'; // Color inicial para el texto que el usuario elegirá
  let backgroundColor: string = currentChallengeConfig.givenBackgroundColor; // Fijo para este desafío
  
  let contrastRatio: number | null = null;
  let wcagRating: string = '';
  let isChallengeInternallyCompleted = false; // Para controlar el estado de este desafío específico

  // Sincronizar con el progressStore para saber si este desafío ya estaba completado
  onMount(() => {
    const unsubscribe = progressStore.subscribe(modules => {
      const module = modules.find(m => m.id === moduleId);
      const lesson = module?.lessons.find(l => l.id === lessonId);
      const challengeInStore = lesson?.challenges?.find(c => c.id === currentChallengeConfig.id);
      if (challengeInStore?.completed) {
        isChallengeInternallyCompleted = true;
        stage = 'submittedCorrect'; // Si ya estaba completo, mostrarlo como tal
      }
    });
    return unsubscribe; // Limpiar suscripción al desmontar
  });

  function luminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function calculateContrastInternal() {
    const rgbText = hexToRgb(textColor);
    const rgbBg = hexToRgb(backgroundColor);

    if (!rgbText || !rgbBg) {
      contrastRatio = null; wcagRating = 'Colores inválidos'; return;
    }
    const lumText = luminance(rgbText.r, rgbText.g, rgbText.b);
    const lumBg = luminance(rgbBg.r, rgbBg.g, rgbBg.b);
    const brightest = Math.max(lumText, lumBg);
    const darkest = Math.min(lumText, lumBg);
    const ratio = (brightest + 0.05) / (darkest + 0.05);
    contrastRatio = parseFloat(ratio.toFixed(2));

    if (contrastRatio >= 7) wcagRating = 'AAA';
    else if (contrastRatio >= 4.5) wcagRating = 'AA';
    else if (contrastRatio >= 3) wcagRating = 'AA Large';
    else wcagRating = 'Fail';
  }
  
  $: if (textColor && backgroundColor && stage === 'playing') {
    calculateContrastInternal();
  }

  // Cada vez que cambies 'stage', también despacha un evento
  function setStage(newStage: Stage) {
    stage = newStage;
    dispatch('stageChange', { currentStage: stage });
  }

  // --- Acciones del Usuario ---
  function startGame() {
    setStage('playing');
    textColor = '#FFFFFF'; // Resetear color de texto por si acaso
    backgroundColor = currentChallengeConfig.givenBackgroundColor; // Asegurar fondo correcto
    calculateContrastInternal(); // Calcular contraste inicial con el texto por defecto
  }

  function handleSubmit() {
    if (stage !== 'playing' || contrastRatio === null) return;

    if (contrastRatio >= currentChallengeConfig.targetRatio) {
      setStage('submittedCorrect');
      isChallengeInternallyCompleted = true;
      progressStore.completeChallenge(moduleId, lessonId, currentChallengeConfig.id);
    } else {
      setStage('submittedIncorrect');
    }
  }

  function handleRetry() {
    setStage('playing');
    // No resetear textColor, permitir al usuario seguir ajustando el que tenía
    calculateContrastInternal(); // Recalcular por si acaso
  }

  function handleNextChallenge() {
    // Aquí iría la lógica para cargar el siguiente desafío
    console.log("Ir al siguiente desafío (lógica pendiente)");
    // Por ahora, podríamos resetear a 'idle' para simular
    setStage('idle');
    isChallengeInternallyCompleted = false; // Asumiendo que el siguiente no está completo
    // Deberías cargar la configuración del siguiente desafío y resetear 'textColor', 'backgroundColor'
  }

</script>

<div class="p-4 md:p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl space-y-4">
  <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1">Test de Contraste</h2>
  <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
    {currentChallengeConfig.description}
  </p>

  {#if stage === 'idle'}
    <button
      on:click={startGame}
      class="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-150"
    >
      <Play size={20} class="mr-2"/> Empezar Desafío
    </button>
  {/if}

  {#if stage === 'playing' || stage === 'submittedIncorrect' || stage === 'submittedCorrect'}
    <div in:fly={{ delay: 200, duration: 400, y: 30 }} class="space-y-3"> <!-- Contenedor para animar en conjunto -->
        <div>
          <label for="challengeTextColor" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tu Color de Texto:</label>
          <!-- Aquí el VanillaColorPicker -->
          <div class="p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 mx-auto w-max">
              <VanillaColorPicker
                  bind:color={textColor}
                  disabled={stage === 'submittedCorrect' || stage === 'submittedIncorrect'}
              />
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-1 text-center block mt-1">{textColor}</span>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color de Fondo (Dado):</p>
          <div class="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md flex items-center px-2" style="background-color: {backgroundColor};">
              <span class="text-xs" style="color: {textColor};">{backgroundColor}</span>
          </div>
        </div>
    </div>

    <!-- Previsualización -->
    <div
        in:fly={{ delay: 200, duration: 400, y: 30 }}
        class="mt-4 p-6 rounded-md text-center border border-gray-200 dark:border-gray-700"
        style="background-color: {backgroundColor}; color: {textColor};"
    >
        <p class="text-lg font-semibold">Texto de Ejemplo</p>
        <p class="text-sm">Así se ve el texto con estos colores.</p>
        {#if contrastRatio !== null && (stage === 'submittedCorrect' || stage === 'submittedIncorrect')}
        <p class="mt-3 pt-2 border-t border-dashed text-xs { (contrastRatio >= currentChallengeConfig.targetRatio) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' }">
            Ratio Actual: {contrastRatio}:1 ({wcagRating})
        </p>
        {/if}
    </div>
    {/if}

  <!-- Feedback y Acciones Post-Envío -->
  {#if stage === 'submittedIncorrect'}
    <div in:fly={{ delay: 200, duration: 400, y: 30 }} class="mt-4 p-3 rounded-md bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-200 border border-red-300 dark:border-red-600">
      <div class="flex items-center">
        <XCircle size={20} class="mr-2 shrink-0"/>
        <p class="font-semibold">Contraste insuficiente. El objetivo es {currentChallengeConfig.targetRatio}:1 o mayor.</p>
      </div>
    </div>
    <button
      on:click={handleRetry}
      class="w-full mt-3 flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-md"
    >
      <RotateCcw size={20} class="mr-2"/> Volver a Intentar
    </button>
  {/if}

  {#if stage === 'submittedCorrect'}
    <div in:fly={{ delay: 200, duration: 400, y: 30 }} class="mt-4 p-3 rounded-md bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-600">
       <div class="flex items-center">
        <CheckCircle size={20} class="mr-2 shrink-0"/>
        <p class="font-semibold">¡Correcto! Has logrado un contraste de {contrastRatio}:1.</p>
      </div>
      <p class="text-sm mt-2 pl-1">
        Este nivel de contraste (AA) es fundamental para asegurar que tus diseños sean accesibles.
        Considera cómo el color del texto y el fondo interactúan para afectar la legibilidad.
      </p>
    </div>
    <!-- Aquí podrías tener un botón para "Siguiente Desafío" o "Finalizar Lección" -->
    <button
      on:click={handleNextChallenge}
      class="w-full mt-3 flex items-center justify-center px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-md"
    >
      Siguiente Desafío <ArrowRight size={20} class="ml-2"/>
    </button>
  {/if}

  <!-- Botón de Enviar (visible solo durante 'playing') -->
  {#if stage === 'playing'}
    <div in:fly={{ delay: 200, duration: 400, y: 30 }}>
        <button
        on:click={handleSubmit}
        disabled={contrastRatio === null}
        class="w-full mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold rounded-lg shadow-md disabled:opacity-50"
        >
        Verificar Respuesta
        </button>
    </div>
  {/if}

   <!-- Información General de Niveles WCAG (siempre visible o según se necesite) -->
   {#if stage !== 'idle'}
   <div class="text-xs text-gray-600 dark:text-gray-400 mt-6 pt-3 border-t border-gray-200 dark:border-gray-700">
    <p class="font-semibold"><strong>Recordatorio Niveles WCAG:</strong></p>
    <ul class="list-disc list-inside">
      <li><strong>AA (Texto Normal):</strong> Ratio ≥ 4.5:1</li>
      <li><strong>AAA (Texto Normal):</strong> Ratio ≥ 7:1</li>
    </ul>
  </div>
  {/if}
</div>