<script lang="ts">
  import { progressStore } from '$lib/stores/progressStore';

  let textColor: string = '#FFFFFF';
  let backgroundColor: string = '#000000';
  let contrastRatio: number | null = null;
  let wcagRating: string = '';

  // IDs para el store (deberían coincidir con course-structure.ts)
  const moduleId = 'design-foundations';
  const lessonId = 'color-contrast';
  const challengeId = 'aa-contrast-target'; // ID del desafío dentro de esta lección

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

  function calculateContrast() {
    const rgb1 = hexToRgb(textColor);
    const rgb2 = hexToRgb(backgroundColor);

    if (!rgb1 || !rgb2) {
      contrastRatio = null;
      wcagRating = 'Colores inválidos';
      return;
    }

    const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    const ratio = (brightest + 0.05) / (darkest + 0.05);
    contrastRatio = parseFloat(ratio.toFixed(2));

    if (contrastRatio >= 7) {
      wcagRating = 'AAA (Excelente)';
    } else if (contrastRatio >= 4.5) {
      wcagRating = 'AA (Bueno)';
    } else if (contrastRatio >= 3) {
      wcagRating = 'AA Large Text (Bueno para texto grande)';
    }
     else {
      wcagRating = 'Fail (Insuficiente)';
    }
  }

  $: if (textColor && backgroundColor) {
    calculateContrast();
  }

  calculateContrast();

// --- Estado del Desafío ---
  let challengeTargetRatio = 4.5;
  let challengeCompleted = false;
  let showExtraInfo = false;

  // Sincronizar challengeCompleted con el store al montar
  progressStore.subscribe(modules => {
    const module = modules.find(m => m.id === moduleId);
    const lesson = module?.lessons.find(l => l.id === lessonId);
    const challenge = lesson?.challenges?.find(c => c.id === challengeId);
    if (challenge) {
        challengeCompleted = challenge.completed;
        if (challengeCompleted) showExtraInfo = true; // Mostrar info si ya estaba completado
    }
  });

  function checkChallenge() {
    if (contrastRatio !== null && contrastRatio >= challengeTargetRatio) {
      if (!challengeCompleted) { // Solo si no está ya marcado como completo localmente
        progressStore.completeChallenge(moduleId, lessonId, challengeId);
        // El estado local 'challengeCompleted' y 'showExtraInfo' se actualizará reactivamente por la suscripción al store
      }
    }
    // else { // Si el usuario cambia los colores y ya no cumple
    //   Si queremos que se pueda "descompletar" un desafío, necesitaríamos más lógica aquí y en el store
    // }
  }

  $: if (textColor && backgroundColor) {
    calculateContrast();
  }

  $: if (contrastRatio !== null) {
    checkChallenge();
  }

  calculateContrast();
</script>

<div class="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-2xl space-y-4">
  <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">Test de Contraste de Color</h2>

  <!-- Sección del Desafío -->
  <div class="p-4 border rounded-md
    {challengeCompleted ? 'bg-green-50 dark:bg-green-900/50 border-green-500 dark:border-green-600' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'}">
    <h3 class="text-lg font-semibold {challengeCompleted ? 'text-green-700 dark:text-green-200' : 'text-blue-700 dark:text-blue-300'}">
      Desafío: {!challengeCompleted ? `Alcanza un ratio de ${challengeTargetRatio}:1 (AA)` : '¡Desafío Completado!'}
    </h3>
    {#if challengeCompleted && showExtraInfo}
      <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
        ¡Excelente! Lograr un contraste AA asegura que tu texto sea legible...
      </p>
    {/if}
  </div>

  <div class="space-y-2">
    <label for="textColor" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Color de Texto:</label>
    <input type="color" id="textColor" bind:value={textColor} class="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
    <!-- Nota: los inputs type="color" pueden tener su propio estilo de SO/navegador para el picker, pero el borde y fondo del input en sí los podemos estilizar -->
    <span class="text-xs text-gray-500 dark:text-gray-400">{textColor}</span>
  </div>

  <div class="space-y-2">
    <label for="backgroundColor" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Color de Fondo:</label>
    <input type="color" id="backgroundColor" bind:value={backgroundColor} class="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
    <span class="text-xs text-gray-500 dark:text-gray-400">{backgroundColor}</span>
  </div>

  <!-- El área de previsualización usa los colores seleccionados, por lo que no necesita clases dark: específicas para sus colores internos -->
  <div class="p-8 rounded-md text-center border border-gray-200 dark:border-gray-700" style="background-color: {backgroundColor}; color: {textColor};">
    <!-- Añadí un borde sutil al área de previsualización para definirla mejor, especialmente si los colores elegidos son similares al fondo del contenedor -->
    <p class="text-lg font-semibold">Texto de Ejemplo</p>
    <p class="text-sm">Así se ve el texto con estos colores.</p>
  </div>

  {#if contrastRatio !== null}
    <div class="mt-4 p-3 rounded-md"
         class:bg-green-100={contrastRatio >= 4.5}
         class:dark:bg-green-800={contrastRatio >= 4.5}
         class:text-green-700={contrastRatio >= 4.5}
         class:dark:text-green-200={contrastRatio >= 4.5}

         class:bg-yellow-100={contrastRatio < 4.5 && contrastRatio >= 3}
         class:dark:bg-yellow-800={contrastRatio < 4.5 && contrastRatio >= 3}
         class:text-yellow-700={contrastRatio < 4.5 && contrastRatio >= 3}
         class:dark:text-yellow-200={contrastRatio < 4.5 && contrastRatio >= 3}

         class:bg-red-100={contrastRatio < 3}
         class:dark:bg-red-800={contrastRatio < 3}
         class:text-red-700={contrastRatio < 3}
         class:dark:text-red-200={contrastRatio < 3}
    >
      <p class="font-semibold">Ratio de Contraste: <span class="font-bold">{contrastRatio}</span></p>
      <p>Nivel WCAG: <span class="font-bold">{wcagRating}</span></p>
    </div>
  {:else}
    <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">Calculando o colores inválidos...</p>
  {/if}

   <div class="text-xs text-gray-600 dark:text-gray-400 mt-4">
    <p class="font-semibold"><strong>Niveles WCAG:</strong></p> <!-- Hice "Niveles WCAG" semibold también para consistencia -->
    <ul class="list-disc list-inside">
      <li><strong>AA:</strong> Ratio de al menos 4.5:1 (texto normal) o 3:1 (texto grande).</li>
      <li><strong>AAA:</strong> Ratio de al menos 7:1 (texto normal) o 4.5:1 (texto grande).</li>
    </ul>
  </div>
</div>