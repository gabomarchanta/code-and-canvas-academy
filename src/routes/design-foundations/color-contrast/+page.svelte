<script lang="ts">
  import ColorContrastTester from '$lib/components/lessons/ColorContrastTester.svelte';
</script>

<div class="container mx-auto py-8 px-4"> <!-- El fondo general de la página ya se maneja en +layout.svelte -->
  <header class="mb-8">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">Lección: Dominando el Contraste de Color</h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 mt-2">
      Aprende por qué el contraste es crucial para la accesibilidad y cómo asegurarte de que tus diseños sean legibles para todos.
    </p>
  </header>

  <section class="mb-8 p-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg">
    <!-- Nota: dark:bg-blue-900/30 y dark:border-blue-700/50 usan opacidad para hacerlo más sutil si el azul oscuro es muy fuerte -->
    <!-- Alternativamente, puedes usar colores más oscuros sólidos como dark:bg-gray-800 y dark:border-gray-700 si prefieres una apariencia menos colorida en modo oscuro para estos bloques -->
    <h2 class="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-3">¿Qué aprenderás?</h2>
    <p class="text-gray-700 dark:text-gray-300 mb-2">
      En esta lección interactiva, podrás experimentar con diferentes combinaciones de colores de texto y fondo.
      Observarás en tiempo real cómo cambia el ratio de contraste y si cumple con los estándares de accesibilidad
      web (WCAG).
    </p>
    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
      <li>Entender la importancia del ratio de contraste.</li>
      <li>Identificar los niveles AA y AAA de WCAG.</li>
      <li>Utilizar una herramienta interactiva para probar tus propias combinaciones.</li>
    </ul>
  </section>

  <ColorContrastTester /> <!-- Asumiremos que ColorContrastTester maneja su propio modo oscuro internamente si es necesario, o que su diseño es neutro -->

  <section class="mt-12 p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Reflexión</h2>
    <p class="text-gray-700 dark:text-gray-300">
      Ahora que has jugado con el contraste, piensa en cómo aplicarás este conocimiento en tus futuros proyectos.
      Un buen contraste no solo ayuda a personas con discapacidades visuales, sino que mejora la experiencia de
      todos los usuarios, especialmente en diferentes condiciones de iluminación.
    </p>
  </section>

   <!-- Podrías añadir un botón "Siguiente Lección" aquí en el futuro -->
   <!-- Ejemplo de botón con modo oscuro:
   <button class="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-150">
       Siguiente Lección
   </button>
   -->
</div>