<script context="module" lang="ts">
  export type Stage = 'idle' | 'playing' | 'submittedCorrect' | 'submittedIncorrect' | 'allChallengesComplete';
</script>

<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { progressStore } from '$lib/stores/progressStore';
  import type { Challenge as ChallengeData } from '$lib/course-structure';
  import { 
    AlignLeft, AlignCenterHorizontal, AlignRight, AlignStartHorizontal,
    AlignCenterVertical, AlignEndHorizontal, RotateCcw, Play, CheckCircle, XCircle, ArrowRight 
  } from 'lucide-svelte'; // Iconos
  import { fly } from 'svelte/transition';
  import { writable, type Unsubscriber } from 'svelte/store';
  import Button from '$lib/components/ui/Button.svelte';
  import FeedbackMessage from '$lib/components/ui/FeedbackMessage.svelte';

  
  // --- Configuración de la Lección/Desafío ---
  const moduleId = 'design-foundations';
  const lessonId = 'alignment';

  const dispatch = createEventDispatcher();

  // --- Estado del Componente ---
  let stage: Stage = 'idle';
  let allLessonChallenges: ChallengeData[] = []; // Se cargará desde el store
  let currentChallengeIndex = 0;
  let currentChallenge = writable<ChallengeData | null>(null); // Store local para el desafío actual
  
  interface Box { id: number; x: number; y: number; width: number; height: number; initialX: number; initialY: number; color: string; }
  let boxes: Box[] = []; // Se inicializará para cada desafío
  const initialBoxConfigs: Box[][] = [ // Diferentes configuraciones de cajas para cada desafío
    [ // Desafío 1 (Alinear Izquierda)
      { id: 1, x: 50,  y: 30,  width: 80, height: 100, initialX: 50,  initialY: 30,  color: 'bg-sky-500' },
      { id: 2, x: 180, y: 80,  width: 100,height: 60,  initialX: 180, initialY: 80,  color: 'bg-emerald-500' },
      { id: 3, x: 80,  y: 150, width: 60, height: 120, initialX: 80,  initialY: 150, color: 'bg-amber-500' },
    ],
    [ // Desafío 2 (Centrar H) - podrían ser las mismas cajas pero con otra tarea
      { id: 1, x: 30, y: 50, width: 70, height: 90, initialX: 30, initialY: 50, color: 'bg-sky-500' },
      { id: 2, x: 150, y: 100, width: 120, height: 50, initialX: 150, initialY: 100, color: 'bg-emerald-500' },
      { id: 3, x: 250, y: 30, width: 50, height: 150, initialX: 250, initialY: 30, color: 'bg-amber-500' },
    ],
    [ // Desafío 3 (Alinear Arriba)
      { id: 1, x: 50,  y: 80,  width: 80, height: 100, initialX: 50,  initialY: 80,  color: 'bg-sky-500' },
      { id: 2, x: 180, y: 30,  width: 100,height: 60,  initialX: 180, initialY: 30,  color: 'bg-emerald-500' },
      { id: 3, x: 80,  y: 120, width: 60, height: 120, initialX: 80,  initialY: 120, color: 'bg-amber-500' },
    ]
  ];


  let containerWidth = 400;
  let containerHeight = 280;
  let practiceArea: HTMLElement;
  
  let progressUnsubscriber: Unsubscriber;

  onMount(() => {
    progressUnsubscriber = progressStore.subscribe(modules => {
      const module = modules.find(m => m.id === moduleId);
      const lesson = module?.lessons.find(l => l.id === lessonId);
      if (lesson?.challenges) {
        allLessonChallenges = JSON.parse(JSON.stringify(lesson.challenges)); // Copia profunda
        
        // Encontrar el primer desafío no completado para empezar
        const firstUncompletedIndex = allLessonChallenges.findIndex(c => !c.completed);
        currentChallengeIndex = firstUncompletedIndex !== -1 ? firstUncompletedIndex : allLessonChallenges.length;

        if (currentChallengeIndex < allLessonChallenges.length) {
          currentChallenge.set(allLessonChallenges[currentChallengeIndex]);
          loadChallenge(currentChallengeIndex);
          if(stage === 'idle' && allLessonChallenges[currentChallengeIndex].completed){
             // Si el desafío actual ya estaba completo, pero la lección no (quizás recargó)
             // Se podría avanzar o mostrar como completo. Por ahora, lo dejamos en idle para que pulse "Empezar"
          } else if (allLessonChallenges[currentChallengeIndex].completed) {
             stage = 'submittedCorrect'; // Si ya estaba completo, ir directo a ese estado
          }
        } else {
          stage = 'allChallengesComplete'; // Todos los desafíos de esta lección ya están hechos
        }
      }
    });
    // dispatch('stageChange', { currentStage: stage }); // Despachar estado inicial
    return () => {
      if (progressUnsubscriber) progressUnsubscriber();
    };
  });

  function loadChallenge(index: number) {
    if (index < 0 || index >= allLessonChallenges.length || index >= initialBoxConfigs.length) {
      console.error("Índice de desafío inválido o falta configuración de cajas.");
      stage = 'allChallengesComplete'; // No hay más desafíos o config
      dispatch('stageChange', { currentStage: stage });
      return;
    }
    currentChallenge.set(allLessonChallenges[index]);
    // Resetear cajas a la configuración inicial para ESTE desafío
    boxes = JSON.parse(JSON.stringify(initialBoxConfigs[index])); // Copia profunda
    stage = allLessonChallenges[index].completed ? 'submittedCorrect' : 'idle';
    dispatch('stageChange', { currentStage: stage });
  }

  function setStage(newStage: Stage) {
    stage = newStage;
    dispatch('stageChange', { currentStage: stage });
  }

  function startGame() {
    if (!$currentChallenge) return;
    // Asegurar que las cajas estén en su posición inicial para el desafío actual
    boxes = JSON.parse(JSON.stringify(initialBoxConfigs[currentChallengeIndex]));
    setStage('playing');
  }

  // --- Lógica de Alineación (simplificada, ya la tienes) ---
  function alignLeft() { if (boxes.length === 0) return; const minX = boxes[0].x; boxes = boxes.map(box => ({ ...box, x: minX })); }
  function alignHorizontalCenter() { if (boxes.length === 0) return; const contCenterX = containerWidth / 2; boxes = boxes.map(box => ({ ...box, x: contCenterX - box.width / 2 })); }
  function alignRight() { if (boxes.length === 0) return; const maxX = containerWidth - boxes[0].width; boxes = boxes.map(box => ({ ...box, x: maxX })); }
  function alignTop() { if (boxes.length === 0) return; const minY = boxes[0].y; boxes = boxes.map(box => ({ ...box, y: minY })); }
  function alignVerticalCenter() { if (boxes.length === 0) return; const contCenterY = containerHeight / 2; boxes = boxes.map(box => ({ ...box, y: contCenterY - box.height / 2 })); }
  function alignBottom() { if (boxes.length === 0) return; const maxY = containerHeight - boxes[0].height; boxes = boxes.map(box => ({ ...box, y: maxY })); }

  // --- Verificación del Desafío ---
  function checkChallengeSuccess(): boolean {
    if (!$currentChallenge || boxes.length === 0) return false;

    const target = ($currentChallenge as any).targetAlignment; // Asumimos que existe esta prop

    switch (target) {
      case 'left':
        const firstBoxX = boxes[0].x;
        return boxes.every(box => Math.abs(box.x - firstBoxX) < 1);
      case 'h-center':
        const contCenterX = containerWidth / 2;
        return boxes.every(box => Math.abs((box.x + box.width / 2) - contCenterX) < 1);
      case 'top':
        const firstBoxY = boxes[0].y;
        return boxes.every(box => Math.abs(box.y - firstBoxY) < 1);
      // TODO: Añadir casos para 'right', 'v-center', 'bottom'
      default:
        return false;
    }
  }

  function handleSubmit() {
    if (stage !== 'playing' || !$currentChallenge) return;

    if (checkChallengeSuccess()) {
      setStage('submittedCorrect');
      progressStore.completeChallenge(moduleId, lessonId, $currentChallenge.id);
    } else {
      setStage('submittedIncorrect');
    }
  }

  function handleRetry() {
    // Resetear cajas a la posición inicial del desafío actual
    boxes = JSON.parse(JSON.stringify(initialBoxConfigs[currentChallengeIndex]));
    setStage('playing');
  }

  function handleNextChallenge() {
    if (currentChallengeIndex < allLessonChallenges.length - 1) {
      currentChallengeIndex++;
      loadChallenge(currentChallengeIndex);
    } else {
      setStage('allChallengesComplete');
      // Aquí se podría llamar a progressStore.completeLesson si no se hace automáticamente
      // basado en todos los desafíos completados.
      console.log("Todos los desafíos de alineación completados!");
    }
  }
  
  function resetCurrentChallengeBoxes() {
    boxes = JSON.parse(JSON.stringify(initialBoxConfigs[currentChallengeIndex]));
  }

</script>

<div class="p-4 md:p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl space-y-4">
  {#if $currentChallenge}
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
      Desafío de Alineación {currentChallengeIndex + 1} / {allLessonChallenges.length}
    </h2>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      {$currentChallenge.description}
    </p>

    {#if stage === 'idle'}
      <Button variant="primary" on:click={startGame} fullWidth={true}>
        <Play size={20} class="mr-2"/> Empezar Desafío
      </Button>
    {/if}

    {#if stage === 'playing' || stage === 'submittedIncorrect' || stage === 'submittedCorrect'}
      <!-- Área de Práctica (sin cambios) -->
      <div bind:this={practiceArea}
           class="relative border border-dashed border-gray-300 dark:border-gray-600 rounded-md overflow-hidden mx-auto"
           style="width: {containerWidth}px; height: {containerHeight}px;">
        {#each boxes as box (box.id)}
          <div class="absolute {box.color} transition-all duration-200 ease-in-out flex items-center justify-center text-white text-xs font-mono rounded shadow-sm"
               style="left: {box.x}px; top: {box.y}px; width: {box.width}px; height: {box.height}px;">
            B{box.id}
          </div>
        {/each}
      </div>

      <!-- Controles de Alineación (Solo activos en 'playing') -->
      {#if stage === 'playing'}
        <div class="grid grid-cols-3 gap-2 pt-2">
          <Button variant="secondary" size="sm" on:click={() => { alignLeft(); checkChallengeSuccess();  }}> <AlignLeft size={18}/> Izquierda </Button>
          <Button variant="secondary" size="sm" on:click={() => { alignHorizontalCenter(); checkChallengeSuccess(); }}> <AlignCenterVertical size={18}/> Centro H </Button>
          <Button variant="secondary" size="sm" on:click={() => { alignRight(); checkChallengeSuccess(); }}> <AlignRight size={18}/> Derecha </Button>
          <Button variant="secondary" size="sm" on:click={() => { alignTop(); checkChallengeSuccess(); }}> <AlignStartHorizontal size={18}/> Arriba </Button>
          <Button variant="secondary" size="sm" on:click={() => { alignVerticalCenter(); checkChallengeSuccess(); }}> <AlignCenterHorizontal size={18}/> Centro V </Button>
          <Button variant="secondary" size="sm" on:click={() => { alignBottom(); checkChallengeSuccess(); }}> <AlignEndHorizontal size={18}/> Abajo </Button>
          <Button variant="neutral" size="sm" on:click={resetCurrentChallengeBoxes} fullWidth={true}> <RotateCcw size={18}/> Resetear Bloques </Button>
        </div>
      {/if}
    {/if}

    <!-- Feedback y Acciones -->
    {#if stage === 'submittedIncorrect'}
      <FeedbackMessage type="incorrect" message="No del todo. El objetivo es {$currentChallenge?.targetAlignment || 'el correcto'}. ¡Inténtalo de nuevo!" />
      <Button variant="warning" on:click={handleRetry} fullWidth={true} class="mt-3">
        <RotateCcw size={20} class="mr-2"/> Volver a Intentar
      </Button>
    {/if}

    {#if stage === 'submittedCorrect'}
      <FeedbackMessage type="correct" message="¡Excelente! Desafío completado." />
      <Button variant="success" on:click={handleNextChallenge} fullWidth={true} class="mt-3">
        {#if currentChallengeIndex < allLessonChallenges.length - 1}
          Siguiente Desafío <ArrowRight size={20} class="ml-2"/>
        {:else}
          Finalizar Lección <CheckCircle size={20} class="ml-2"/>
        {/if}
      </Button>
    {/if}
    
    <!-- Botón de Verificar (solo visible y activo en 'playing') -->
    {#if stage === 'playing'}
      <div in:fly={{y:10}}>
        <Button variant="main-cta" on:click={handleSubmit} fullWidth={true} class="mt-4">Verificar Alineación</Button>
      </div>
    {/if}

  {:else if stage === 'allChallengesComplete'}
    <div class="text-center p-6 bg-green-50 dark:bg-green-900/50 rounded-lg">
      <CheckCircle size={48} class="mx-auto text-green-500 dark:text-green-400 mb-4"/>
      <h3 class="text-2xl font-semibold text-green-700 dark:text-green-200">¡Felicidades!</h3>
      <p class="text-gray-700 dark:text-gray-300 mt-2">
        Has completado todos los desafíos de alineación. ¡Gran trabajo!
      </p>
    </div>
  {:else if !allLessonChallenges || allLessonChallenges.length === 0}
    <p class="text-center text-gray-500 dark:text-gray-400">Cargando desafíos de alineación...</p>
  {/if}
</div>