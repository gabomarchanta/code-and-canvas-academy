<!-- src/lib/components/ui/FeedbackMessage.svelte -->
<script lang="ts">
	import { CheckCircle, XCircle, Info } from 'lucide-svelte';

	export let type: 'success' | 'error' | 'info' = 'info';
	export let message: string;

	const config = {
		success: {
			icon: CheckCircle,
			classes: 'bg-green-100 border-green-400 text-green-700'
		},
		error: {
			icon: XCircle,
			classes: 'bg-red-100 border-red-400 text-red-700'
		},
		info: {
			icon: Info,
			classes: 'bg-blue-100 border-blue-400 text-blue-700'
		}
	};

	$: currentConfig = config[type];
</script>

<div class={`border-l-4 p-4 ${currentConfig.classes}`} role="alert">
	<div class="flex">
		<div class="py-1">
			<svelte:component this={currentConfig.icon} class="h-5 w-5 mr-3" />
		</div>
		<div>
			<p class="font-bold">
				{#if type === 'success'}
					¡Éxito!
				{:else if type === 'error'}
					Error
				{:else}
					Información
				{/if}
			</p>
			<p class="text-sm">{@html message}</p>
		</div>
	</div>
</div>