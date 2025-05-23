<script lang="ts">
  import { onMount } from 'svelte';
  import { AlignLeft, AlignCenterHorizontal, AlignRight, AlignStartHorizontal, AlignCenterVertical, AlignEndHorizontal, RotateCcw } from 'lucide-svelte'; // Iconos

  interface Box {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    initialX: number;
    initialY: number;
    color: string;
  }

  let containerWidth = 500; // Ancho del contenedor de práctica
  let containerHeight = 300; // Alto del contenedor de práctica

  let boxes: Box[] = [
    { id: 1, x: 50, y: 30, width: 80, height: 100, initialX: 50, initialY: 30, color: 'bg-sky-500' },
    { id: 2, x: 150, y: 80, width: 100, height: 60, initialX: 150, initialY: 80, color: 'bg-emerald-500' },
    { id: 3, x: 280, y: 50, width: 60, height: 120, initialX: 280, initialY: 50, color: 'bg-amber-500' },
    { id: 4, x: 380, y: 100, width: 90, height: 80, initialX: 380, initialY: 100, color: 'bg-rose-500' },
  ];

  // --- Estado del Desafío ---
  let alignmentChallengeCompleted = false;
  let showAlignmentExtraInfo = false;

  function checkAlignmentChallenge() {
    if (boxes.length < 2) { // Necesitas al menos 2 cajas para un desafío de alineación significativo
      alignmentChallengeCompleted = true; // O no tener desafío si hay pocas cajas
      return;
    }
    // Condición: Todos los boxes tienen la misma coordenada X
    const firstBoxX = boxes[0].x;
    const allAlignedLeft = boxes.every(box => Math.abs(box.x - firstBoxX) < 1); // Usamos una pequeña tolerancia por si hay errores de flotantes

    if (allAlignedLeft) {
      if (!alignmentChallengeCompleted) {
        alignmentChallengeCompleted = true;
        showAlignmentExtraInfo = true;
        console.log("¡Desafío de Alineación Izquierda completado!");
      }
    } else {
      // Opcional: resetear si el usuario desalinea después de completar
      // alignmentChallengeCompleted = false;
      // showAlignmentExtraInfo = false;
    }
  }

  // --- Funciones de Alineación ---
  function alignLeft() {
    if (boxes.length === 0) return;
    const minX = Math.min(...boxes.map(b => b.x));
    boxes = boxes.map(box => ({ ...box, x: minX }));
    boxes = [...boxes]; checkAlignmentChallenge();
  }

  function alignHorizontalCenter() {
    if (boxes.length === 0) return;
    // Tomamos el centro del primer box como referencia para simplificar
    // Una implementación más robusta calcularía el centro del grupo
    const centerX = boxes[0].x + boxes[0].width / 2;
    boxes = boxes.map(box => ({ ...box, x: centerX - box.width / 2 }));
    boxes = [...boxes]; checkAlignmentChallenge();
  }

  function alignRight() {
    if (boxes.length === 0) return;
    const maxX = Math.max(...boxes.map(b => b.x + b.width));
    boxes = boxes.map(box => ({ ...box, x: maxX - box.width }));
    boxes = [...boxes]; checkAlignmentChallenge();
  }

  function alignTop() {
     if (boxes.length === 0) return;
    const minY = Math.min(...boxes.map(b => b.y));
    boxes = boxes.map(box => ({ ...box, y: minY }));
    boxes = [...boxes]; checkAlignmentChallenge();
  }

  function alignVerticalCenter() {
    if (boxes.length === 0) return;
    // Tomamos el centro del primer box como referencia
    const centerY = boxes[0].y + boxes[0].height / 2;
    boxes = boxes.map(box => ({ ...box, y: centerY - box.height / 2 }));
    boxes = [...boxes]; checkAlignmentChallenge();
  }

  function alignBottom() {
    if (boxes.length === 0) return;
    const maxY = Math.max(...boxes.map(b => b.y + b.height));
    boxes = boxes.map(box => ({ ...box, y: maxY - box.height}));
    boxes = [...boxes]; checkAlignmentChallenge();
  }

   function resetBoxes() {
    boxes = boxes.map(box => ({ ...box, x: box.initialX, y: box.initialY }));
    alignmentChallengeCompleted = false; // Resetear el desafío
    showAlignmentExtraInfo = false;
    checkAlignmentChallenge(); // Re-evaluar (no debería estar completado)
  }

  // Para que el contenedor se adapte si es necesario (opcional)
  let practiceArea: HTMLElement;
  onMount(() => {
    // Podrías ajustar containerWidth/Height si quieres que sea dinámico
    // containerWidth = practiceArea.offsetWidth;
    // containerHeight = practiceArea.offsetHeight;
  });

</script>

<div class="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-2xl space-y-6">
  <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Práctica de Alineación</h3>
  
  <!-- Sección del Desafío -->
  <div class="p-4 border rounded-md
    {alignmentChallengeCompleted ? 'bg-green-50 dark:bg-green-900/50 border-green-500 dark:border-green-600' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'}">
    <h4 class="text-lg font-semibold {alignmentChallengeCompleted ? 'text-green-700 dark:text-green-200' : 'text-blue-700 dark:text-blue-300'}">
      Desafío: {!alignmentChallengeCompleted ? 'Alinea todos los bloques al borde izquierdo.' : '¡Desafío Completado!'}
    </h4>
    {#if alignmentChallengeCompleted && showAlignmentExtraInfo}
      <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
        ¡Correcto! Alinear elementos a un borde común, como el izquierdo, crea una "línea implícita" fuerte
        que guía la vista del usuario y aporta una sensación de orden y profesionalismo al diseño.
        Es una de las técnicas de alineación más utilizadas.
      </p>
      <!-- Podrías añadir "Próximo Desafío: Alinear al Centro" -->
    {/if}
  </div>

  <p class="text-sm text-gray-600 dark:text-gray-400">
    Usa los botones para alinear los bloques de color. Observa cómo la alineación crea orden visual.
  </p>

  <!-- Área de Práctica -->
  <div
    bind:this={practiceArea}
    class="relative border border-dashed border-gray-300 dark:border-gray-600 rounded-md overflow-hidden"
    style="width: {containerWidth}px; height: {containerHeight}px;"
  >
    {#each boxes as box (box.id)}
      <div
        class="absolute {box.color} transition-all duration-300 ease-in-out flex items-center justify-center text-white text-xs font-mono rounded shadow"
        style="left: {box.x}px; top: {box.y}px; width: {box.width}px; height: {box.height}px;"
      >
        {box.id}
      </div>
    {/each}
  </div>

  <!-- Controles -->
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    <button on:click={alignLeft} title="Alinear a la Izquierda" class="flex items-center justify-center space-x-2 p-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md shadow transition-colors">
      <AlignLeft size={20}/> <span>Izquierda</span>
    </button>
    <button on:click={alignVerticalCenter} title="Alinear al Centro Horizontal" class="flex items-center justify-center space-x-2 p-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md shadow transition-colors">
      <AlignCenterHorizontal size={20}/> <span>Centro H</span>
    </button>
    <button on:click={alignRight} title="Alinear a la Derecha" class="flex items-center justify-center space-x-2 p-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md shadow transition-colors">
      <AlignRight size={20}/> <span>Derecha</span>
    </button>
     <button on:click={alignTop} title="Alinear Arriba" class="flex items-center justify-center space-x-2 p-3 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-md shadow transition-colors">
      <AlignStartHorizontal size={20}/> <span>Arriba</span>
    </button>
    <button on:click={alignHorizontalCenter} title="Alinear al Centro Vertical" class="flex items-center justify-center space-x-2 p-3 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-md shadow transition-colors">
      <AlignCenterVertical size={20}/> <span>Centro V</span>
    </button>
    <button on:click={alignBottom} title="Alinear Abajo" class="flex items-center justify-center space-x-2 p-3 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-md shadow transition-colors">
      <AlignEndHorizontal size={20}/> <span>Abajo</span>
    </button>
    <button on:click={resetBoxes} title="Resetear Posiciones" class="col-span-full sm:col-span-1 md:col-span-2 flex items-center justify-center space-x-2 p-3 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md shadow transition-colors">
      <RotateCcw size={20}/> <span>Resetear</span>
    </button>
  </div>
</div>