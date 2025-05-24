<!-- src/lib/components/ui/FeedbackMessage.svelte -->
<script lang="ts">
  import { CheckCircle, XCircle } from 'lucide-svelte';
  import { fly } from 'svelte/transition';

  export let type: 'correct' | 'incorrect';
  export let message: string = '';
</script>

{#if type === 'correct'}
  <div in:fly={{y:10}} class="mt-4 p-3 rounded-md bg-green-100 dark:bg-green-800/60 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-600 flex items-center">
    <CheckCircle size={20} class="mr-2 shrink-0"/>
    <p class="font-semibold"><slot>{message || '¡Correcto!'}</slot></p>
  </div>
{:else if type === 'incorrect'}
  <div in:fly={{y:10}} class="mt-4 p-3 rounded-md bg-red-100 dark:bg-red-800/60 text-red-700 dark:text-red-200 border border-red-300 dark:border-red-600 flex items-center">
    <XCircle size={20} class="mr-2 shrink-0"/>
    <p class="font-semibold"><slot>{message || 'Incorrecto. Intenta de nuevo.'}</slot></p>
  </div>
{/if}