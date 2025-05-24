<!-- src/lib/components/ui/VanillaColorPicker.svelte -->
<script lang="ts">
  import { onMount, createEventDispatcher, afterUpdate } from 'svelte'; // Estas vienen de 'svelte'
  import { browser } from '$app/environment'; // 'browser' viene de '$app/environment'

  // Si quisieras otros: import { RgbColorPicker, HslStringColorPicker, etc } from 'vanilla-colorful';

  export let color: string = '#FFFFFF'; // Prop para el color actual (string HEX)
  export let disabled: boolean = false; // Prop para deshabilitar

  const dispatch = createEventDispatcher<{colorChange: { value: string }}>();
  let pickerContainer: HTMLElement;
  let pickerInstance: any = null; // Tipo específico del picker importado
  let internalUpdate = false; // Flag para evitar bucles de actualización

  onMount(async () => { // Hacer onMount asíncrono
    if (browser && pickerContainer) { // 'browser' es true solo en el cliente
      // Importar dinámicamente SOLO en el cliente
      const { HexColorPicker } = await import('vanilla-colorful');

      // @ts-ignore
      pickerInstance = new HexColorPicker();
      pickerInstance.color = color;
      pickerContainer.appendChild(pickerInstance);

      pickerInstance.addEventListener('color-changed', (event: any) => {
        internalUpdate = true;
        color = event.detail.value;
        dispatch('colorChange', { value: color });
      });
    }
  });

  afterUpdate(() => {
    if (browser && pickerInstance && !internalUpdate && pickerInstance.color !== color) {
      pickerInstance.color = color;
    }
    internalUpdate = false;
  });

  $: if (browser && pickerInstance) {
    if (disabled) {
      pickerInstance.style.pointerEvents = 'none';
      pickerInstance.style.opacity = '0.6';
    } else {
      pickerInstance.style.pointerEvents = 'auto';
      pickerInstance.style.opacity = '1';
    }
  }
</script>

<div bind:this={pickerContainer} class="vanilla-color-picker-wrapper">
  <!-- El picker se adjuntará aquí solo en el cliente -->
  {#if !browser}
    <!-- Placeholder o mensaje de carga opcional para SSR -->
    <div class="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-sm text-gray-500">
      Cargando Color Picker...
    </div>
  {/if}
</div>

<style>
  .vanilla-color-picker-wrapper :global(hex-color-picker) {
    /* Estilos por defecto para el custom element. Ajusta según necesites. */
    /* vanilla-colorful usa custom elements, así que puedes estilizarlos directamente */
    /* o sus partes internas si exponen ::part() */
    max-width: 280px; /* Un ancho máximo razonable */
    box-shadow: none; /* Quitar la sombra por defecto si no la quieres aquí */
    border-radius: 0.375rem; /* Equivalente a rounded-md de Tailwind */
    /* display: block; /* Asegura que se comporte como un bloque si es necesario para el cálculo de w-max */
    margin: auto; /* Si el picker mismo necesita centrarse dentro de su slot, aunque w-max en el padre debería manejarlo */
  }
  /* Puedes añadir más estilos para otros pickers si los usas (rgb-color-picker, etc.) */
</style>