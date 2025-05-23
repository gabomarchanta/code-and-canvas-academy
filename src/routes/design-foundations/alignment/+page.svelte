<script lang="ts">
  import AlignmentPractice from '$lib/components/lessons/AlignmentPractice.svelte';
</script>

<div class="container mx-auto py-8 px-4">
  <header class="mb-8">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">Lección: Dominando la Alineación</h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 mt-2">
      Descubre el poder de la alineación para crear interfaces limpias, organizadas y fáciles de seguir.
    </p>
  </header>

  <section class="mb-8 p-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50 rounded-lg">
    <h2 class="text-2xl font-semibold text-green-700 dark:text-green-300 mb-3">¿Qué aprenderás?</h2>
    <p class="text-gray-700 dark:text-gray-300 mb-2">
      La alineación es uno de los principios fundamentales del diseño. En esta lección interactiva:
    </p>
    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
      <li>Comprenderás cómo la alineación guía el ojo del usuario.</li>
      <li>Experimentarás con diferentes tipos de alineación (izquierda, centro, derecha, arriba, medio, abajo).</li>
      <li>Verás cómo la consistencia en la alineación mejora la estética y la usabilidad.</li>
    </ul>
  </section>

  <AlignmentPractice />

  <section class="mt-12 p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Puntos Clave sobre Alineación</h2>
    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
      <li><strong>Alineación al Borde:</strong> Alinear elementos a un borde común (izquierdo o derecho más comúnmente) crea una línea fuerte y limpia.</li>
      <li><strong>Alineación al Centro:</strong> Útil para elementos simétricos o para crear un punto focal, pero úsalo con moderación para bloques de texto largos.</li>
      <li><strong>Consistencia:</strong> Elige un tipo de alineación y sé consistente a lo largo de tu diseño o sección.</li>
      <li><strong>Rejillas (Grids):</strong> La alineación es la base de los sistemas de rejilla, que ayudan a organizar el contenido de manera estructurada. (¡Futura lección!)</li>
    </ul>
    <p class="mt-4 text-gray-700 dark:text-gray-300">
      Presta atención a la alineación en las webs y apps que usas a diario. Verás que los diseños más pulidos la utilizan de manera efectiva.
    </p>
  </section>
</div>